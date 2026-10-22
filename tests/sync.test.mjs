import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const sources=await Promise.all(['content.js','app.js','extensions.js','portable.js','anime-studio.js','sync.js'].map(f=>readFile(new URL('../public/'+f,import.meta.url),'utf8')));
async function fixture(){
 const elements=new Map(),storage=new Map([['studybridge-v1',JSON.stringify({lang:'fr',notes:{1:'Guest private note'}})]]);
 function el(key){if(key==='#animation-canvas')return null;if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',value:'',dataset:{},style:{},classList:{toggle(){},add(){},remove(){}},setAttribute(){},focus(){},append(){},prepend(){},showModal(){this.open=true},close(){this.open=false}});return elements.get(key)}
 let remote={revision:0,state:null,exam:null},fail=false,writes=0;
 const c={document:{documentElement:{},querySelector:el,querySelectorAll:()=>[],createElement:()=>el('created'),addEventListener(){},hidden:false},location:{hash:'#library',assign(){}},window:{addEventListener(){},scrollTo(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setTimeout(){return 1},clearTimeout(){},setInterval(){},cancelAnimationFrame(){},performance:{now:()=>0},console,crypto:{randomUUID:()=> 'test-id'},URL,Blob,confirm:()=>true,fetch:async(url,opt={})=>{
  if(url==='/api/session')return Response.json({signedIn:true,userId:'alice-id',name:'alice',aiAvailable:false});
  if(url==='/api/courses')return Response.json({courses:[]});
  if(url==='/api/progress'){
   if(opt.method==='PUT'){if(fail)throw Error('offline');const b=JSON.parse(opt.body);if(b.revision!==remote.revision)return Response.json({error:'progress_conflict'},{status:409});remote={...b,revision:b.revision+1};writes++}
   return Response.json(remote);
  }throw Error(url);
 }};
 vm.createContext(c);for(const source of sources)vm.runInContext(source,c);
 const run=s=>vm.runInContext(s,c);
 // Drain the finite promise chain started by initial account loading.
 for(let n=0;n<12;n++)await new Promise(r=>setImmediate(r));
 return {run,storage,get remote(){return remote},set remote(v){remote=v},set fail(v){fail=v},get writes(){return writes}};
}
test('account sync does not claim guest notes and isolates account caches',async()=>{
 const f=await fixture();assert.equal(f.run('progressReady'),true);assert.equal(f.remote.state.notes[1],undefined);
 f.run("state.notes[1]='Alice note';save()");await f.run('flushProgress()');assert.equal(f.remote.state.notes[1],'Alice note');
 assert.equal(JSON.parse(f.storage.get('studybridge-v1')).notes[1],'Guest private note');
 f.remote={revision:0,state:null,exam:null};await f.run("switchAccountProgress({signedIn:true,userId:'bob-id'})");assert.equal(f.run('state.notes[1]'),undefined);
 assert.equal(JSON.parse(f.storage.get('studybridge-v2-alice-id')).notes[1],'Alice note');
});
test('network errors retain unsaved changes and stale windows require explicit resolution',async()=>{
 const f=await fixture();f.fail=true;f.run("state.notes[1]='Keep me';save()");assert.equal(await f.run('flushProgress()'),false);assert.equal(f.run('progressDirty'),true);
 assert.equal(JSON.parse(f.storage.get('studybridge-v2-alice-id')).notes[1],'Keep me');
 f.fail=false;assert.equal(await f.run('flushProgress()'),true);
 f.remote={...f.remote,revision:f.remote.revision+1};f.run("state.notes[1]='Conflict';save()");assert.equal(await f.run('flushProgress()'),false);assert.equal(f.run('progressStatus'),'conflict');const writes=f.writes;
 await f.run('flushProgress()');assert.equal(f.writes,writes);assert.equal(f.remote.state.notes[1],'Keep me');
});

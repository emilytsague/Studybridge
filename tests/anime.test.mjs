import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../public/anime-studio.js',import.meta.url),'utf8');
const audioSource=await readFile(new URL('../public/anime-audio.js',import.meta.url),'utf8');
function fixture(){
 const storage=new Map(),timers=new Map(),drawn=[],elements=new Map();let now=0;
 const ctx=new Proxy({measureText:s=>({width:String(s).length*12}),createLinearGradient:()=>({addColorStop(){}}),fillText:s=>drawn.push(s)},{get:(target,key)=>key in target?target[key]:()=>{}});
 const tracks=[{stopped:false,stop(){this.stopped=true}}];
 function element(key){if(!elements.has(key))elements.set(key,{value:'',textContent:'',innerHTML:'',width:1280,height:720,dataset:{},classList:{toggle(){}},setAttribute(){},getContext:()=>ctx,captureStream:()=>({getTracks:()=>tracks,addTrack:t=>tracks.push(t)})});return elements.get(key)}
 class Recorder{static isTypeSupported(t){return t==='video/webm'}state='inactive';start(interval){this.interval=interval;this.state='recording'}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['test-video'])});this.onstop?.()}}
 const c={console,Blob,Date:{now:()=>now},URL:{createObjectURL:()=> 'blob:test-anime',revokeObjectURL(){}},document:{hidden:false},window:{addEventListener(){}},MediaRecorder:Recorder,$:element,$$:()=>[],localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setTimeout:(fn,delay)=>{timers.set(1,{fn,delay});return 1},clearTimeout:id=>timers.delete(id),requestAnimationFrame:fn=>{c.tick=fn;return 1},cancelAnimationFrame(){},render(){},bindExtra(){},toast(){},LESSONS:[],library:[],api(){},tr:(fr)=>fr,esc:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')};
 vm.createContext(c);vm.runInContext(`let KEY='guest',lang='fr',studioSource='wim',studioFrames=null,animation=null,animationFrame=0,animationStart=0,animationPlaying=false,animationRecording=false,videoURL=null;function defaultFrames(){return [0,1,2].map(n=>({title:'Scene '+n,text:'A course explanation',source:'WIM'}))}function stopAnimation(){animationPlaying=false;if(animationRecording&&animation?.state==='recording')animation.stop();animationRecording=false}`,c);vm.runInContext(source,c);
 return {c,run:s=>vm.runInContext(s,c),timers,tracks,storage,drawn,elements,ctx,set now(v){now=v}};
}
function withAudio(){
 const f=fixture(),nodes=[];let decoded=0;
 class AudioContext{currentTime=0;destination={};resume(){return Promise.resolve()}decodeAudioData(){return Promise.resolve({duration:[3,5,2][decoded++]})}createBufferSource(){const n={connect(){},disconnect(){},start(...args){this.started=args},stop(){this.stopped=true}};nodes.push(n);return n}createMediaStreamDestination(){return {stream:{getAudioTracks:()=>[{kind:'audio',stopped:false,stop(){this.stopped=true}}]}}}}
 f.c.window.AudioContext=AudioContext;f.c.location={hash:'#studio'};f.c.account={signedIn:true};f.c.atob=s=>Buffer.from(s,'base64').toString('binary');
 f.c.fetch=async()=>({ok:true,json:async()=>({clips:Array(3).fill({wav:'AQID'})})});
 f.run('animeLoadDraft();animeDuration=15');vm.runInContext(audioSource,f.c);return {...f,nodes};
}
test('narration is mixed into the exported video and scheduled within its scenes',async()=>{
 const f=withAudio();await f.run('exportAnimation()');assert.equal(f.run('animationRecording'),true);assert.equal(f.run('animeExportHasAudio'),true);assert.equal(f.tracks.filter(t=>t.kind==='audio').length,1);assert.equal(f.nodes.length,3);
 for(let i=0;i<3;i++)assert(f.nodes[i].started[0]>=f.run(`animeSceneStart(${i})`)/1000);
 f.timers.get(1).fn();assert(f.nodes.every(n=>n.stopped));assert(f.elements.get('#animation-status').textContent.includes('Narration française incluse'));
});
test('narration extends short scenes without exceeding six minutes or cutting words',()=>{
 const f=withAudio();f.run("animeAudioBuffers=[{duration:35},{duration:10},{duration:20}];animeAudioKey=animeNarrationKey();animePlanAudio()");assert.equal(f.run('animeDuration'),75);assert(f.run('animeSceneLength(0)')>=35800);assert.equal(f.run('animePosition(animeSceneStart(1)).index'),1);
 assert.throws(()=>f.run('animeAudioBuffers=[{duration:361}];animePlanAudio()'),/6 minutes/);
});
test('anime timeline clamps to six minutes and safely covers the first and last scene',()=>{
 const f=fixture();assert.equal(f.run('animeSeconds(99999)'),360);assert.equal(f.run('animeSeconds(-50)'),15);assert.equal(f.run('animeSeconds(NaN)'),60);
 f.run('animeLoadDraft();animeDuration=360');assert.equal(f.run('animePosition(-50).index'),0);assert.equal(f.run('animePosition(999999).index'),2);
 f.run('drawFrame(-1);drawFrame(359999);drawFrame(Infinity)');assert(f.drawn.includes('Scene 0'));assert(f.drawn.includes('Scene 2'));
 const lines=f.run("animeLines({measureText:s=>({width:s.length*10})},'a'.repeat(100),100)");assert(lines.every(l=>l.length<=10));
});
test('anime projects are saved separately per account and scene text is escaped',()=>{
 const f=fixture();f.run("animeLoadDraft();studioFrames[0].title='<img src=x onerror=alert(1)>';animeDuration=360;animeSaveDraft();KEY='alice';animeLoadDraft()");assert.equal(f.run('animeDuration'),60);assert.equal(f.run('studioFrames[0].title'),'Scene 0');
 f.run("KEY='guest';animeLoadDraft()");assert.equal(f.run('animeDuration'),360);assert(f.run('studioView()').includes('&lt;img'));assert(!f.run('studioView()').includes('<img src=x'));
 assert.equal(f.run("animeFrames(Array.from({length:99},()=>({text:'x'.repeat(2000)}))).length"),12);assert.equal(f.run("animeFrames([{text:'x'.repeat(2000)}])[0].text.length"),900);
});
test('anime export stops at the selected duration and releases recording tracks',async()=>{
 const f=fixture();f.run('animeLoadDraft();animeDuration=360');await f.run('exportAnimation()');assert.equal(f.run('animationRecording'),true);assert.equal(f.timers.get(1).delay,360000);
 f.timers.get(1).fn();assert.equal(f.run('animationRecording'),false);assert(f.tracks.every(t=>t.stopped));assert(f.elements.get('#video-output').innerHTML.includes('studybridge-anime.webm'));assert(f.elements.get('#animation-status').textContent.includes('prête'));
});
test('interrupted anime exports are labelled partial and hidden tabs do not start recording',async()=>{
 const f=fixture();f.run('animeLoadDraft()');f.c.document.hidden=true;await f.run('exportAnimation()');assert.equal(f.run('animationRecording'),false);assert.equal(f.timers.size,0);
 f.c.document.hidden=false;await f.run('exportAnimation()');f.run('stopAnimation()');assert(f.elements.get('#animation-status').textContent.includes('partielle'));assert.equal(f.timers.size,0);assert(f.tracks.every(t=>t.stopped));
});

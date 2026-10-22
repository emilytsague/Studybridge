import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createApp} from '../server.mjs';
test('public health check and trusted proxy keep visitor limits separate',async t=>{
 const f=await fixture(t,{trustProxy:true});assert.equal((await f.request('/api/health')).status,200);
 const attempt=ip=>f.request('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json','X-StudyBridge-Client-IP':ip},body:JSON.stringify({username:'!',password:'invalid'})});
 for(let n=1;n<=11;n++)assert.equal((await attempt('203.0.113.'+n)).status,400);
 for(let n=0;n<9;n++)assert.equal((await attempt('203.0.113.1')).status,400);
 assert.equal((await attempt('203.0.113.1')).status,429);
});
test('local narration requires authentication and validates every scene',async t=>{
 let received;const f=await fixture(t,{narrate:async texts=>{received=texts;return {clips:[{wav:'UklGRg==',duration:1}],voice:'test'}}});
 const request=(cookie,texts,origin)=>f.request('/api/narration',{method:'POST',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(origin?{Origin:origin}:{})},body:JSON.stringify({texts})});
 assert.equal((await request(null,['Bonjour'])).status,401);const cookie=await f.register('alice');
 assert.equal((await request(cookie,['Bonjour'])).status,200);assert.deepEqual(received,['Bonjour']);
 assert.equal((await request(cookie,['x'.repeat(901)])).status,400);
 assert.equal((await request(cookie,[null])).status,400);
 assert.equal((await request(cookie,Array(12).fill('x'.repeat(900)))).status,400);
 assert.equal((await request(cookie,['Bonjour'],'https://attacker.invalid')).status,403);
});
test('progress is private, validates inputs and rejects stale writes',async t=>{
 const f=await fixture(t),a=await f.register('alice'),b=await f.register('bob');
 assert.equal((await f.request('/api/progress')).status,401);
 const state={done:[1],known:[],history:[],notes:{1:'Ma note privée'},lang:'fr'};
 const save=(cookie,payload)=>f.request('/api/progress',{method:'PUT',headers:{Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify(payload)});
 assert.equal((await save(a,{revision:0,state,exam:null})).status,200);
 assert.equal((await(await f.request('/api/progress',{headers:{Cookie:a}})).json()).state.notes[1],'Ma note privée');
 assert.equal((await(await f.request('/api/progress',{headers:{Cookie:b}})).json()).state,null);
 assert.equal((await save(a,{revision:0,state,exam:null})).status,409);
 assert.equal((await save(a,{revision:1,state:{...state,done:[999]},exam:null})).status,400);
 assert.equal((await save(a,{revision:1,state,exam:{kind:'qcm'}})).status,400);
 assert.equal((await save(a,null)).status,400);
 assert.equal((await f.request('/api/progress',{method:'PUT',headers:{Cookie:a,Origin:'https://attacker.invalid','Content-Type':'application/json'},body:JSON.stringify({revision:1,state,exam:null})})).status,403);
});
test('sessions and progress survive restart; logout invalidates the stored session',async t=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'studybridge-restart-'));let server;
 const start=async()=>{server=await createApp({dataDir:dir});await new Promise(r=>server.listen(0,'127.0.0.1',r));return `http://127.0.0.1:${server.address().port}`};
 t.after(async()=>{if(server.listening)await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true})});
 let origin=await start();const response=await fetch(origin+'/api/auth/register',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({username:'alice',password:'correct horse 12345'})});
 const cookie=response.headers.get('set-cookie').split(';')[0];const token=cookie.split('=')[1];
 const state={done:[2],known:[],history:[],notes:{},lang:'en'};
 await fetch(origin+'/api/progress',{method:'PUT',headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({revision:0,state,exam:null})});
 assert(!(await readFile(path.join(dir,'sessions.json'),'utf8')).includes(token));
 await new Promise(r=>server.close(r));origin=await start();
 assert.equal((await(await fetch(origin+'/api/session',{headers:{Cookie:cookie}})).json()).signedIn,true);
 assert.deepEqual((await(await fetch(origin+'/api/progress',{headers:{Cookie:cookie}})).json()).state.done,[2]);
 await fetch(origin+'/api/auth/logout',{method:'POST',headers:{Origin:origin,Cookie:cookie}});
 await new Promise(r=>server.close(r));origin=await start();
 assert.equal((await(await fetch(origin+'/api/session',{headers:{Cookie:cookie}})).json()).signedIn,false);
});
async function fixture(t,options={}){const dir=await mkdtemp(path.join(os.tmpdir(),'studybridge-test-'));const s=await createApp({dataDir:dir,...options});await new Promise(r=>s.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${s.address().port}`;t.after(async()=>{await new Promise(r=>s.close(r));await rm(dir,{recursive:true,force:true})});const request=(url,opt={})=>fetch(origin+url,{...opt,headers:{Origin:origin,...opt.headers}});async function register(username){const r=await request('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password:'correct horse 12345'})});assert.equal(r.status,201);return r.headers.get('set-cookie').split(';')[0]}return {request,register,dir,origin}}
test('public UI, private API and password hashes',async t=>{const f=await fixture(t);assert.equal((await f.request('/')).status,200);assert.equal((await f.request('/login')).status,200);assert.equal((await f.request('/api/courses')).status,401);const cookie=await f.register('alice');const s=await(await f.request('/api/session',{headers:{Cookie:cookie}})).json();assert.equal(s.name,'alice');assert.equal(s.aiAvailable,false);const users=await readFile(path.join(f.dir,'users.json'),'utf8');assert(!users.includes('correct horse'));assert(users.includes('hash'));assert.equal((await f.request('/.env')).status,404);assert.equal((await f.request('/server.mjs')).status,404)});
test('import, read, download, per-user isolation, delete and logout',async t=>{const f=await fixture(t),a=await f.register('alice'),b=await f.register('bob');const form=new FormData();const txt='Ce cours décrit la flexion des poutres et le calcul des contraintes.';form.append('file',new File([txt],'mecanique.txt',{type:'text/plain'}));form.append('title','Mécanique');form.append('pages',JSON.stringify([{page:1,text:txt}]));const added=await f.request('/api/courses',{method:'POST',headers:{Cookie:a},body:form});assert.equal(added.status,201);const c=await added.json();assert(c.hasText);assert.equal((await(await f.request('/api/courses',{headers:{Cookie:a}})).json()).courses.length,1);assert.equal((await(await f.request('/api/courses',{headers:{Cookie:b}})).json()).courses.length,0);assert.equal((await f.request('/api/courses?id='+c.id,{headers:{Cookie:b}})).status,404);const content=await(await f.request('/api/courses?id='+c.id,{headers:{Cookie:a}})).json();assert.equal(content.pages[0].text,txt);const file=await f.request('/api/courses?id='+c.id+'&file=1',{headers:{Cookie:a}});assert.equal(await file.text(),txt);assert(file.headers.get('content-disposition').includes('attachment'));assert.equal((await f.request('/api/courses?id='+c.id,{method:'DELETE',headers:{Cookie:a,Origin:'https://attacker.invalid'}})).status,403);assert.equal((await f.request('/api/courses?id='+c.id,{method:'DELETE',headers:{Cookie:a}})).status,200);assert.equal((await f.request('/api/courses?id='+c.id,{headers:{Cookie:a}})).status,404);await f.request('/api/auth/logout',{method:'POST',headers:{Cookie:a}});assert.equal((await f.request('/api/courses',{headers:{Cookie:a}})).status,401)});
test('invalid uploads and unconfigured AI fail explicitly',async t=>{const f=await fixture(t),cookie=await f.register('alice');const form=new FormData();form.append('file',new File(['not a pdf'],'fake.pdf'));form.append('title','Fake');form.append('pages','[]');assert.equal((await f.request('/api/courses',{method:'POST',headers:{Cookie:cookie},body:form})).status,400);const response=await f.request('/api/ai',{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({question:'SECI',lang:'fr',course:'wim'})});assert.equal(response.status,503);assert.equal((await response.json()).error,'ai_not_configured')});
test('AI request uses server-owned credentials, sources and safe output parsing (mock provider)',async t=>{let outgoing;const f=await fixture(t,{aiKey:'test-only-fake-key',aiModel:'test-model',fetchAI:async(url,options)=>{outgoing={url,options};return Response.json({status:'completed',output:[{type:'reasoning'},{type:'message',content:[{type:'output_text',text:'Test answer [p. 8]'}]}]})}});const cookie=await f.register('alice');const response=await f.request('/api/ai',{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({question:'SECI externalisation',lang:'fr',course:'wim',mode:'explain'})});assert.equal(response.status,200);const result=await response.json();assert.equal(result.text,'Test answer [p. 8]');assert(result.sources.some(s=>s.page===8));const sent=JSON.parse(outgoing.options.body);assert.equal(sent.store,false);assert.equal(sent.model,'test-model');assert(sent.instructions.includes('untrusted'));assert(!JSON.stringify(result).includes('test-only-fake-key'));assert.equal(outgoing.url,'https://api.openai.com/v1/responses')});
test('provider errors do not expose secrets or fabricate an answer',async t=>{const f=await fixture(t,{aiKey:'private-test-token',aiModel:'test-model',fetchAI:async()=>Response.json({error:{message:'private-test-token'}},{status:401})});const cookie=await f.register('alice');const r=await f.request('/api/ai',{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({question:'Wissen',lang:'en',course:'wim'})});assert.equal(r.status,502);const body=await r.text();assert(body.includes('ai_provider_error'));assert(!body.includes('private-test-token'))});

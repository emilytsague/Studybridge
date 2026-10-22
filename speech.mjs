import {spawn} from 'node:child_process';
import {access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
export function validateNarration(value){
 if(!value||!Array.isArray(value.texts)||!value.texts.length||value.texts.length>12||value.texts.some(t=>typeof t!=='string'||t.length>900)||value.texts.join('').length>6000)throw Error('invalid_narration');
 return value.texts;
}
export async function synthesizeNarration(texts){
 const python=process.env.TTS_PYTHON||path.join(root,'.voice-runtime',process.platform==='win32'?'Scripts/python.exe':'bin/python');
 try{await access(python);await access(path.join(root,'voices/fr_FR-siwis-medium.onnx'))}catch{throw Error('narration_unavailable')}
 return await new Promise((resolve,reject)=>{
  const child=spawn(python,[path.join(root,'scripts/narrate.py')],{windowsHide:true,stdio:['pipe','pipe','pipe'],env:{...process.env,PYTHONUTF8:'1',PYTHONDONTWRITEBYTECODE:'1'}});
  let chunks=[],size=0,settled=false;
  const finish=(error,result)=>{if(settled)return;settled=true;clearTimeout(timer);error?reject(error):resolve(result)};
  const timer=setTimeout(()=>{child.kill();finish(Error('narration_timeout'))},120000);
  child.on('error',()=>finish(Error('narration_unavailable')));child.stdin.on('error',()=>{});child.stderr.resume();
  child.stdout.on('data',chunk=>{size+=chunk.length;if(size>50000000){child.kill();finish(Error('narration_too_long'))}else chunks.push(chunk)});
  child.on('close',code=>{if(code!==0)return finish(Error('narration_failed'));try{finish(null,JSON.parse(Buffer.concat(chunks).toString('utf8')))}catch{finish(Error('narration_failed'))}});
  child.stdin.end(JSON.stringify({texts}));
 });
}

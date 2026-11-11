import {cp,mkdir,readFile,writeFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,scrypt} from 'node:crypto';
import {promisify} from 'node:util';
import {createInterface} from 'node:readline/promises';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=path.resolve(process.env.DATA_DIR||path.join(root,'data'));
const [command]=process.argv.slice(2);let arg=process.argv[3];
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
// Der Server muss während der Wartung beendet sein, damit die Sicherung konsistent bleibt.
try{
 let running=false;
 try{const r=await fetch(`http://127.0.0.1:${Number(process.env.PORT)||3000}/api/session`,{signal:AbortSignal.timeout(1500)});running=r.ok}catch{}
 if(running)throw Error('Beende StudyBridge mit Strg+C im Serverfenster und starte dieses Werkzeug erneut.');
 if(command==='backup'){
  await access(data);const dest=path.join(root,'backups',stamp);await mkdir(dest,{recursive:true});await cp(data,path.join(dest,'data'),{recursive:true,errorOnExist:true,force:false});
  await writeFile(path.join(dest,'manifest.json'),JSON.stringify({version:1,createdAt:new Date().toISOString(),source:data},null,2));
  console.log('Sicherung erstellt: '+dest+'\nSie enthält private Daten. Bewahre eine Kopie auf einem anderen Laufwerk auf.');
 }else if(command==='restore'){
  if(!arg)throw Error('Gib nach restore den Sicherungsordner an.');
  const source=path.resolve(arg),manifest=JSON.parse(await readFile(path.join(source,'manifest.json'),'utf8'));
  if(manifest.version!==1)throw Error('Unbekannte Sicherung.');
  const dest=path.join(root,'data-restored-'+stamp);await cp(path.join(source,'data'),dest,{recursive:true,errorOnExist:true,force:false});
  // Sitzungen in der wiederhergestellten Kopie werden ungültig gemacht.
  await writeFile(path.join(dest,'sessions.json'),'[]');
  console.log('Kopie wiederhergestellt: '+dest+'\nTrage diesen Pfad als DATA_DIR in .env ein und starte den Server neu. Die bisherigen Daten bleiben erhalten.');
 }else if(command==='reset-password'){
  if(!arg){const prompt=createInterface({input:process.stdin,output:process.stdout});try{arg=await prompt.question('Benutzername: ')}finally{prompt.close()}}
  if(!/^[a-zA-Z0-9_.-]{3,40}$/.test(arg))throw Error('Ungültiger Benutzername.');
  const usersFile=path.join(data,'users.json'),users=JSON.parse(await readFile(usersFile,'utf8')),user=users.find(u=>u.username===arg.toLowerCase());
  if(!user)throw Error('Konto nicht gefunden.');
  // Vor der Kennwortänderung die bisherigen Daten sichern.
  const backup=path.join(root,'backups','before-reset-'+stamp);await mkdir(backup,{recursive:true});await cp(data,path.join(backup,'data'),{recursive:true});
  await writeFile(path.join(backup,'manifest.json'),JSON.stringify({version:1,createdAt:new Date().toISOString()}));
  const password=randomBytes(18).toString('base64url');user.salt=randomBytes(16).toString('hex');user.hash=(await promisify(scrypt)(password,user.salt,64)).toString('hex');
  const sessionsFile=path.join(data,'sessions.json');let sessions=[];try{sessions=JSON.parse(await readFile(sessionsFile,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
  await writeFile(sessionsFile,JSON.stringify(sessions.filter(([,s])=>s.userId!==user.id)),{mode:0o600});
  await writeFile(usersFile,JSON.stringify(users),{mode:0o600});
  console.log('Neues Kennwort für '+user.username+' : '+password+'\nBewahre das Kennwort vertraulich auf.');
 }else throw Error('Befehle: backup | restore ORDNER | reset-password BENUTZERNAME');
}catch(e){console.error(e.message);process.exitCode=1}

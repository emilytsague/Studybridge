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
// Maintenance requires the server stopped so a backup is a consistent snapshot.
try{
 let running=false;
 try{const r=await fetch(`http://127.0.0.1:${Number(process.env.PORT)||3000}/api/session`,{signal:AbortSignal.timeout(1500)});running=r.ok}catch{}
 if(running)throw Error('Arrête StudyBridge (Ctrl+C dans sa fenêtre), puis relance cet outil.');
 if(command==='backup'){
  await access(data);const dest=path.join(root,'backups',stamp);await mkdir(dest,{recursive:true});await cp(data,path.join(dest,'data'),{recursive:true,errorOnExist:true,force:false});
  await writeFile(path.join(dest,'manifest.json'),JSON.stringify({version:1,createdAt:new Date().toISOString(),source:data},null,2));
  console.log('Sauvegarde créée : '+dest+'\nElle contient tes données privées. Conserve une copie sur un autre disque.');
 }else if(command==='restore'){
  if(!arg)throw Error('Indique le dossier de sauvegarde après restore.');
  const source=path.resolve(arg),manifest=JSON.parse(await readFile(path.join(source,'manifest.json'),'utf8'));
  if(manifest.version!==1)throw Error('Sauvegarde inconnue.');
  const dest=path.join(root,'data-restored-'+stamp);await cp(path.join(source,'data'),dest,{recursive:true,errorOnExist:true,force:false});
  // Restored sessions are intentionally invalidated.
  await writeFile(path.join(dest,'sessions.json'),'[]');
  console.log('Copie restaurée : '+dest+'\nPour l’utiliser, renseigne ce chemin dans DATA_DIR dans .env puis redémarre. Les anciennes données sont conservées.');
 }else if(command==='reset-password'){
  if(!arg){const prompt=createInterface({input:process.stdin,output:process.stdout});try{arg=await prompt.question('Identifiant du compte : ')}finally{prompt.close()}}
  if(!/^[a-zA-Z0-9_.-]{3,40}$/.test(arg))throw Error('Identifiant invalide.');
  const usersFile=path.join(data,'users.json'),users=JSON.parse(await readFile(usersFile,'utf8')),user=users.find(u=>u.username===arg.toLowerCase());
  if(!user)throw Error('Compte introuvable.');
  // Preserve the pre-change snapshot before updating credentials.
  const backup=path.join(root,'backups','before-reset-'+stamp);await mkdir(backup,{recursive:true});await cp(data,path.join(backup,'data'),{recursive:true});
  await writeFile(path.join(backup,'manifest.json'),JSON.stringify({version:1,createdAt:new Date().toISOString()}));
  const password=randomBytes(18).toString('base64url');user.salt=randomBytes(16).toString('hex');user.hash=(await promisify(scrypt)(password,user.salt,64)).toString('hex');
  const sessionsFile=path.join(data,'sessions.json');let sessions=[];try{sessions=JSON.parse(await readFile(sessionsFile,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
  await writeFile(sessionsFile,JSON.stringify(sessions.filter(([,s])=>s.userId!==user.id)),{mode:0o600});
  await writeFile(usersFile,JSON.stringify(users),{mode:0o600});
  console.log('Nouveau mot de passe pour '+user.username+' : '+password+'\nConserve-le dans un endroit privé.');
 }else throw Error('Commandes : backup | restore DOSSIER | reset-password IDENTIFIANT');
}catch(e){console.error(e.message);process.exitCode=1}

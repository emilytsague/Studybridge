'use strict';
// Only account-scoped caches are uploaded; legacy guest data remains local.
let progressReady=false,progressUser=null,progressRevision=0,progressDirty=false;
let progressTimer=null,progressSending=null,progressStatus='loading',progressRemote=null;
document.querySelector('#main').inert=true;
const emptyProgress=()=>({done:[],known:[],history:[],notes:{},lang});
function cacheProgress(){
 try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem(EXAMKEY,JSON.stringify(exam));if(progressUser)localStorage.setItem(KEY+'-sync',JSON.stringify({revision:progressRevision,dirty:progressDirty}))}catch{progressStatus='local-error'}
}
function showSyncStatus(){
 let box=document.querySelector('#sync-status');
 if(!box){box=document.createElement('div');box.id='sync-status';box.className='sync-status';box.setAttribute('role','status');document.querySelector('.shell').prepend(box)}
 const messages={loading:tr('Chargement de ta progression…','Loading your progress…'),saved:tr('Progression sauvegardée sur ton compte','Progress saved to your account'),saving:tr('Sauvegarde en cours…','Saving…'),guest:tr('Mode invité : progression sur cet appareil','Guest mode: progress on this device'),error:tr('Sauvegarde en attente. Vérifie la connexion puis réessaie.','Save pending. Check your connection and retry.'),conflict:tr('Une autre fenêtre a modifié ta progression. Choisis la copie à conserver.','Another window changed your progress. Choose which copy to keep.'),'local-error':tr('Stockage du navigateur indisponible. Garde cette page ouverte et vérifie la sauvegarde.','Browser storage unavailable. Keep this page open and check saving.')};
 box.textContent=messages[progressStatus]||messages.error;
 if(progressStatus==='error'){const b=document.createElement('button');b.className='text-link';b.textContent=tr('Réessayer','Retry');b.onclick=()=>flushProgress();box.append(' ',b)}
 if(progressStatus==='conflict'){
  for(const [label,keepLocal] of [[tr('Conserver cette fenêtre','Keep this window'),true],[tr('Utiliser la copie du serveur','Use server copy'),false]]){const b=document.createElement('button');b.className='text-link';b.textContent=label;b.onclick=()=>{if(!confirm(tr('Confirmer ce choix de progression ?','Confirm this progress copy?')))return;progressRevision=progressRemote.revision;if(!keepLocal){state=progressRemote.state||emptyProgress();exam=progressRemote.exam;lang=state.lang;progressDirty=false;progressStatus='saved';cacheProgress();render();showSyncStatus()}else{progressStatus='saving';flushProgress()}};box.append(' · ',b)}
 }
}
async function switchAccountProgress(next){
 const id=next.signedIn?next.userId:null;
 if(progressReady&&progressUser===id)return;
 progressReady=false;progressUser=id;progressStatus='loading';showSyncStatus();
 KEY=id?'studybridge-v2-'+id:'studybridge-v1';EXAMKEY=id?'studybridge-exam-v2-'+id:'studybridge-klausur-v1';
 let cached=null,cachedExam=null,meta={};try{cached=JSON.parse(localStorage.getItem(KEY)||'null');cachedExam=JSON.parse(localStorage.getItem(EXAMKEY)||'null');meta=JSON.parse(localStorage.getItem(KEY+'-sync')||'{}')}catch{}
 state=cached||emptyProgress();exam=cachedExam;lang=state.lang==='en'?'en':'fr';progressRevision=meta.revision||0;progressDirty=!!meta.dirty;
 if(id){
  try{const remote=await api('/api/progress');progressRemote=remote;
   if(progressDirty&&cached){if(remote.revision!==progressRevision)progressStatus='conflict';else progressStatus='saving'}
   else {state=remote.state||cached||emptyProgress();exam=remote.state?remote.exam:cachedExam;lang=state.lang;progressRevision=remote.revision;progressDirty=!remote.state;progressStatus=progressDirty?'saving':'saved'}
  }catch{progressStatus='error'}
 }else{progressDirty=false;progressStatus='guest'}
 if((cached?.lang||progressRemote?.state?.lang)&&document.querySelector('#welcome').open)document.querySelector('#welcome').close();
 progressReady=true;document.querySelector('#main').inert=false;cacheProgress();render();showSyncStatus();if(id&&progressDirty&&progressStatus==='saving')await flushProgress();
}
function scheduleProgress(){
 if(!progressReady)return;
 progressDirty=!!progressUser;cacheProgress();
 if(progressUser&&progressStatus!=='conflict'){progressStatus='saving';clearTimeout(progressTimer);progressTimer=setTimeout(()=>flushProgress(),500)}
 showSyncStatus();
}
async function flushProgress(){
 clearTimeout(progressTimer);
 if(progressSending){await progressSending;if(progressDirty&&progressStatus!=='conflict'&&progressStatus!=='error')return flushProgress();return !progressDirty}
 if(!progressUser||!progressDirty)return true;
 if(progressStatus==='conflict')return false;
 const user=progressUser,payload=JSON.stringify({revision:progressRevision,state,exam});progressDirty=false;progressStatus='saving';showSyncStatus();
 progressSending=(async()=>{
  try{const response=await fetch('/api/progress',{method:'PUT',headers:{'Content-Type':'application/json'},body:payload,keepalive:payload.length<60000});
   if(response.status===409){progressRemote=await api('/api/progress');throw new Error('conflict')}
   if(!response.ok)throw new Error('save');const result=await response.json();if(user!==progressUser)return;progressRevision=result.revision;progressStatus=progressDirty?'saving':'saved';
  }catch(e){progressDirty=true;progressStatus=e.message==='conflict'?'conflict':'error'}
  finally{cacheProgress();showSyncStatus()}
 })();await progressSending;progressSending=null;
 if(progressDirty&&progressStatus==='saving')return flushProgress();return !progressDirty;
}
const localSave=save,localSaveExam=saveExam;
save=function(){localSave();scheduleProgress()};
saveExam=function(){localSaveExam();scheduleProgress()};
window.addEventListener('online',()=>{if(progressReady&&progressDirty&&progressStatus!=='conflict')flushProgress()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&progressReady)flushProgress()});
window.addEventListener('beforeunload',event=>{if(progressUser&&progressDirty){event.preventDefault();event.returnValue=''}});
showSyncStatus();
loadLibrary().then(()=>{if(!progressReady){progressStatus='error';document.querySelector('#main').inert=false;showSyncStatus();const b=document.createElement('button');b.textContent=tr('Recharger','Reload');b.onclick=()=>location.reload();document.querySelector('#sync-status').append(b)}});

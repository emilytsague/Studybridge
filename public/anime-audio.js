'use strict';
let animeVoiceEnabled=true,animeVoiceScope='',animeAudioContext=null,animeAudioOutput=null,animeAudioNodes=[];
let animeAudioKey='',animeAudioBuffers=[],animeAudioPlan=[],animeAudioPlanDuration=0,animeAudioPreparing=false,animeAudioGeneration=0,animeExportHasAudio=false;
const animeBasePosition=animePosition,animeBaseSceneStart=animeSceneStart,animeBaseSceneLength=animeSceneLength;
function animeNarrationKey(){return JSON.stringify(studioFrames.map(f=>f.text))}
function animeAudioValid(){return animeVoiceEnabled&&animeAudioKey===animeNarrationKey()&&animeAudioPlanDuration===animeDuration&&animeAudioPlan.length===studioFrames.length}
function animeStopAudio(){for(const node of animeAudioNodes){try{node.stop()}catch{}node.disconnect()}animeAudioNodes=[]}
function animePlanAudio(){
 const minimum=animeAudioBuffers.map(b=>(b?.duration||0)+.8),required=minimum.reduce((a,b)=>a+b,0);
 if(required>360)throw Error(tr('Le texte dépasse 6 minutes de narration. Raccourcis les scènes.','Narration exceeds 6 minutes. Shorten the scenes.'));
 if(animeDuration<required){animeDuration=Math.min(360,Math.ceil(required/15)*15);animeSaveDraft()}
 let start=0;const extra=(animeDuration-required)/minimum.length;
 animeAudioPlan=minimum.map((seconds,i)=>{const duration=seconds+extra,entry={start:start*1000,duration:duration*1000};start+=duration;return entry});animeAudioPlanDuration=animeDuration;
}
animeSceneStart=function(i){return animeAudioValid()?animeAudioPlan[i]?.start||0:animeBaseSceneStart(i)};
animeSceneLength=function(i){return animeAudioValid()?animeAudioPlan[i]?.duration||0:animeBaseSceneLength(i)};
animePosition=function(ms=0){if(!animeAudioValid())return animeBasePosition(ms);const duration=animeDuration*1000,time=Math.max(0,Math.min(duration-1,Number(ms)||0));let index=animeAudioPlan.findIndex(p=>time<p.start+p.duration);if(index<0)index=animeAudioPlan.length-1;const p=animeAudioPlan[index];return {duration,time,index,phase:(time-p.start)/p.duration}};
async function animePrepareAudio(){
 if(!animeVoiceEnabled){animeAudioPlan=[];return}
 if(!account?.signedIn)throw Error(tr('Connecte-toi pour préparer la narration locale.','Sign in to prepare local narration.'));
 const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error(tr('Audio non pris en charge par ce navigateur.','Audio is unavailable in this browser.'));
 if(!animeAudioContext)animeAudioContext=new Audio();await animeAudioContext.resume();
 const key=animeNarrationKey();if(animeAudioKey===key&&animeAudioBuffers.length===studioFrames.length){animePlanAudio();return}
 const generation=animeAudioGeneration;animeSetStatus(tr('Préparation de la voix française sur ton ordinateur…','Preparing French narration on your computer…'));
 const response=await fetch('/api/narration',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({texts:studioFrames.map(f=>f.text)})});
 if(!response.ok){let error;try{error=(await response.json()).error}catch{}const messages={narration_unavailable:tr('La voix locale n’est pas installée sur ce serveur.','The local voice is not installed on this server.'),narration_busy:tr('Une narration est déjà en préparation. Réessaie dans un instant.','A narration is already being prepared. Try shortly.'),invalid_narration:tr('Le scénario est trop long : 6 000 caractères maximum au total.','Script is too long: at most 6,000 characters in total.'),signin_required:tr('Reconnecte-toi pour préparer la narration.','Sign in again to prepare narration.')};throw Error(messages[error]||tr('La voix n’a pas pu être préparée. Réessaie.','Could not prepare narration. Try again.'))}
 const data=await response.json(),buffers=[];
 for(const clip of data.clips){if(!clip){buffers.push(null);continue}const bytes=Uint8Array.from(atob(clip.wav),c=>c.charCodeAt(0));buffers.push(await animeAudioContext.decodeAudioData(bytes.buffer))}
 if(generation!==animeAudioGeneration||key!==animeNarrationKey()||!location.hash.startsWith('#studio'))throw Error('narration_cancelled');
 animeAudioBuffers=buffers;animeAudioKey=key;animePlanAudio();render();
}
function animeScheduleAudio(){
 animeStopAudio();if(!animeAudioValid())return;const cursor=animeCursor/1000,base=animeAudioContext.currentTime;
 for(let i=0;i<animeAudioBuffers.length;i++){const buffer=animeAudioBuffers[i];if(!buffer)continue;const start=animeAudioPlan[i].start/1000+.3,offset=Math.max(0,cursor-start);if(offset>=buffer.duration)continue;const node=animeAudioContext.createBufferSource();node.buffer=buffer;node.connect(animeAudioContext.destination);if(animeAudioOutput)node.connect(animeAudioOutput);node.start(base+Math.max(0,start-cursor),offset);animeAudioNodes.push(node)}
}
function animeAttachAudio(stream){animeExportHasAudio=animeAudioValid();animeAudioOutput=null;if(animeExportHasAudio){animeAudioOutput=animeAudioContext.createMediaStreamDestination();for(const track of animeAudioOutput.stream.getAudioTracks())stream.addTrack(track)}}
const animeAudioBasePlay=playAnimation,animeAudioBaseExport=exportAnimation,animeAudioBaseStop=stopAnimation;
function animePlaybackStart(){animeAudioBasePlay();animeScheduleAudio()}
function animeNarrationLabel(){return animeExportHasAudio?tr('Vidéo anime prête · Narration française incluse.','Anime video ready · French narration included.'):tr('Vidéo anime prête · Sans audio.','Anime video ready · No audio.')}
const animeAudioBaseCharacter=animeCharacter;
animeCharacter=function(ctx,x,y,scale,person,time,talking,faceRight){if(animeAudioValid()){const p=animePosition(time*1000),clip=animeAudioBuffers[p.index],start=animeAudioPlan[p.index].start/1000+.3;talking=talking&&animationPlaying&&!!clip&&time>=start&&time<start+clip.duration}animeAudioBaseCharacter(ctx,x,y,scale,person,time,talking,faceRight)};
stopAnimation=function(){animeAudioGeneration++;animeStopAudio();animeAudioBaseStop()};
async function animeWithAudio(action){
 if(animeAudioPreparing)return;stopAnimation();animeAudioPreparing=true;animeControls(true);
 try{await animePrepareAudio();animeAudioPreparing=false;animeControls(false);await action()}catch(e){if(e.message!=='narration_cancelled')animeSetStatus(e.message)}finally{animeAudioPreparing=false;animeControls(animationRecording)}
}
playAnimation=function(){return animeWithAudio(()=>{animeAudioOutput=null;animePlaybackStart()})};
exportAnimation=function(){return animeWithAudio(()=>animeAudioBaseExport())};
const animeAudioBaseView=studioView;
studioView=function(preselect){
 const html=animeAudioBaseView(preselect);if(animeVoiceScope!==KEY){animeVoiceScope=KEY;animeAudioKey='';animeAudioPlan=[];animeAudioBuffers=[];animeVoiceEnabled=localStorage.getItem(KEY+'-anime-voice')!=='off'}
 return html.replace('<label for="anime-theme">',`<div class="anime-voice-option"><label><input id="anime-voice" type="checkbox" ${animeVoiceEnabled?'checked':''}> ${tr('Narration française','French narration')}</label><small>${tr('Voix locale · Sans frais API. La durée s’adapte pour lire tout le texte, jusqu’à 6 min.','Local voice · No API fees. Duration adapts to read all text, up to 6 min.')}</small></div><label for="anime-theme">`).replace('Vidéo sans son',animeVoiceEnabled?'Voix française incluse':'Vidéo sans son').replace('Silent video',animeVoiceEnabled?'French narration included':'Silent video');
};
const animeAudioBaseBind=bindExtra;
bindExtra=function(){animeAudioBaseBind();const input=$('#anime-voice');if(!input)return;input.onchange=()=>{stopAnimation();animeVoiceEnabled=input.checked;localStorage.setItem(KEY+'-anime-voice',animeVoiceEnabled?'on':'off');animeAudioPlan=[];animeSaveDraft();render()}};
render();

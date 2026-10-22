'use strict';
// Original vector characters rendered entirely on the device, without a video API.
const ANIME_MAX_SECONDS=360,ANIME_MAX_SCENES=12;
let animeDuration=60,animeTheme='campus',animeCast='duo',animeCursor=0,animeDraftScope='';
let animeTimer=null,animeExportComplete=false,animeExportCancelled=false,animeLastUI=-1;
const animeThemes={campus:{top:'#28306b',bottom:'#e5a4b4',accent:'#bcadff',board:'#20224a'},night:{top:'#090e2a',bottom:'#34317a',accent:'#72e8db',board:'#151c3b'},sunset:{top:'#643766',bottom:'#ffc18a',accent:'#ffe0a4',board:'#342346'}};
const animeSeconds=value=>Math.max(15,Math.min(ANIME_MAX_SECONDS,Math.round(Number(value)||60)));
const animeTime=seconds=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
function animeFrames(value){return (Array.isArray(value)?value:defaultFrames()).slice(0,ANIME_MAX_SCENES).map((f,i)=>({title:String(f?.title||tr('Nouvelle scène','New scene')).slice(0,100),text:String(f?.text||'').slice(0,900),source:String(f?.source||'').slice(0,150),speaker:f?.speaker==='noe'?'noe':f?.speaker==='aya'?'aya':i%2?'noe':'aya'}))}
function animeSaveDraft(){if(videoURL&&!animationRecording){URL.revokeObjectURL(videoURL);videoURL=null;const output=$('#video-output');if(output)output.innerHTML=''}try{localStorage.setItem(KEY+'-anime-studio',JSON.stringify({duration:animeDuration,theme:animeTheme,cast:animeCast,frames:studioFrames,source:studioSource}))}catch{toast(tr('Projet non sauvegardé : stockage du navigateur indisponible.','Project not saved: browser storage unavailable.'))}}
function animeLoadDraft(){
 if(animeDraftScope===KEY)return;animeDraftScope=KEY;animeDuration=60;animeTheme='campus';animeCast='duo';animeCursor=0;studioFrames=defaultFrames();
 try{const d=JSON.parse(localStorage.getItem(KEY+'-anime-studio')||'null');if(d){animeDuration=animeSeconds(d.duration);animeTheme=animeThemes[d.theme]?d.theme:'campus';animeCast=['duo','aya','noe'].includes(d.cast)?d.cast:'duo';studioFrames=animeFrames(d.frames);if(!studioFrames.length)studioFrames=animeFrames(defaultFrames());studioSource=String(d.source||'wim')}}catch{}
}
function animeSceneStart(i){return i*animeDuration*1000/studioFrames.length}
function animeSceneLength(i){return animeDuration*1000/studioFrames.length}
function animePosition(ms=0){
 const duration=animeSeconds(animeDuration)*1000,count=Math.max(1,studioFrames?.length||0),time=Math.max(0,Math.min(duration-1,Number(ms)||0));
 const index=Math.min(count-1,Math.floor(time/duration*count));return {duration,time,index,phase:(time-index*duration/count)/(duration/count)};
}
function animeSetStatus(text){const e=$('#animation-status');if(e)e.textContent=text}
function animeUI(ms){
 const p=animePosition(ms),elapsed=Math.max(0,Math.min(animeDuration,Number(ms)/1000||0)),second=Math.floor(elapsed);if(second===animeLastUI)return;animeLastUI=second;
 const seek=$('#anime-seek');if(seek)seek.value=String(elapsed);
 const label=$('#anime-clock');if(label)label.textContent=animeTime(second)+' / '+animeTime(animeDuration);
 $$('[data-anime-scene]').forEach(b=>{const selected=Number(b.dataset.animeScene)===p.index;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});
}
studioView=function(preselect){
 animeLoadDraft();if(preselect&&studioSource==='wim')studioSource=preselect;studioFrames=animeFrames(studioFrames);if(!studioFrames.length)studioFrames=animeFrames(defaultFrames());
 return `<section class="anime-heading"><div><span class="anime-kicker">STUDYBRIDGE / ANIME LAB</span><h1>${tr('Ton cours. Leur aventure.','Your course. Their adventure.')}</h1><p>${tr('Aya et Noé donnent vie à tes révisions. Imagine, anime, retiens.','Aya and Noé bring your revision to life. Imagine, animate, remember.')}</p></div><span class="anime-local">✦ ${tr('100 % local · Sans frais API','100% local · No API fees')}</span></section>
 <div class="anime-workspace"><section class="anime-player"><div class="anime-player-top"><span>✦ ${tr('ANIMATION STYLE ANIME','ANIME STYLE ANIMATION')}</span><span>HD · 16:9</span></div><canvas id="animation-canvas" width="1280" height="720" aria-label="${tr('Aperçu avec les personnages anime Aya et Noé','Preview with anime characters Aya and Noé')}"></canvas>
 <div class="anime-playbar"><button class="btn primary" id="animation-play">▶ ${tr('Lire','Play')}</button><button class="btn" id="animation-stop">■ ${tr('Arrêter','Stop')}</button><output id="anime-clock">${animeTime(animeCursor/1000)} / ${animeTime(animeDuration)}</output></div><label class="sr-only" for="anime-seek">${tr('Position dans la vidéo','Video position')}</label><input id="anime-seek" class="anime-seek" type="range" min="0" max="${animeDuration}" step="0.1" value="${animeCursor/1000}">
 <div class="anime-timeline">${studioFrames.map((f,i)=>`<button data-anime-scene="${i}" class="${animePosition(animeCursor).index===i?'active':''}" aria-pressed="${animePosition(animeCursor).index===i}"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(f.title)}</strong><small>${animeTime(animeSceneStart(i)/1000)}</small></button>`).join('')}</div>
 <div class="anime-export-row"><div><strong>${tr('Prête pour tes révisions','Ready for your revision')}</strong><p>${tr('Personnages animés et sous-titres · Vidéo sans son','Animated characters and subtitles · Silent video')}</p></div><button class="btn primary" id="animation-export">↓ ${tr('Exporter la vidéo','Export video')}</button></div><p id="animation-status" role="status">${tr('L’export dure le temps de la vidéo. Garde cet onglet visible.','Export takes as long as the video. Keep this tab visible.')}</p><div id="video-output"></div></section>
 <aside class="anime-settings"><section><span class="anime-section-no">01 / ${tr('MISE EN SCÈNE','DIRECTION')}</span><h2>${tr('Ton univers','Your world')}</h2><label for="anime-duration">${tr('Durée totale','Total duration')} <strong>${animeTime(animeDuration)}</strong></label><input id="anime-duration" type="range" min="15" max="360" step="15" value="${animeDuration}"><div class="anime-duration-presets">${[30,60,120,180,360].map(n=>`<button data-anime-duration="${n}" class="${animeDuration===n?'selected':''}">${n<60?n+' s':n/60+' min'}</button>`).join('')}</div><small>${tr('Maximum 6 minutes pour toute la vidéo.','Maximum 6 minutes for the whole video.')}</small>
 <label for="anime-cast">${tr('Personnages','Characters')}</label><select id="anime-cast"><option value="duo" ${animeCast==='duo'?'selected':''}>Aya + Noé · Duo</option><option value="aya" ${animeCast==='aya'?'selected':''}>Aya · Solo</option><option value="noe" ${animeCast==='noe'?'selected':''}>Noé · Solo</option></select><label for="anime-theme">${tr('Décor','Setting')}</label><select id="anime-theme">${[['campus',tr('Campus · Ciel pastel','Campus · Pastel sky')],['night',tr('Observatoire · Nuit étoilée','Observatory · Starry night')],['sunset',tr('Toit du lycée · Coucher de soleil','School rooftop · Sunset')]].map(([v,t])=>`<option value="${v}" ${animeTheme===v?'selected':''}>${t}</option>`).join('')}</select></section>
 <section><span class="anime-section-no">02 / ${tr('LE COURS DEVIENT HISTOIRE','COURSE TO STORY')}</span><label for="studio-source">${tr('Cours à mettre en scène','Course to animate')}</label><select id="studio-source">${LESSONS.map(l=>`<option value="wim-${l.id}" ${studioSource===`wim-${l.id}`?'selected':''}>WIM · ${esc(l.title[lang])}</option>`).join('')}${library.filter(c=>c.hasText).map(c=>`<option value="${c.id}" ${studioSource===c.id?'selected':''}>${esc(c.title)}</option>`).join('')}</select><button class="btn" id="studio-load">↻ ${tr('Préparer les scènes','Prepare scenes')}</button><p>${tr('Les passages du cours deviennent le scénario. Tu peux tout modifier ci-dessous.','Course excerpts become the script. Edit everything below.')}</p></section></aside></div>
 <section class="anime-script"><div class="anime-script-title"><div><span class="anime-section-no">03 / STORYBOARD</span><h2>${tr('Chaque scène, une idée.','One scene, one idea.')}</h2></div><button class="btn" id="anime-add" ${studioFrames.length>=ANIME_MAX_SCENES?'disabled':''}>＋ ${tr('Ajouter une scène','Add scene')}</button></div><p>${tr('Projet conservé sur cet appareil, séparément pour chaque compte. Jusqu’à 12 scènes.','Project saved on this device, separately for each account. Up to 12 scenes.')}</p><div class="anime-scene-grid">${studioFrames.map((f,i)=>`<article class="anime-scene-card"><div class="anime-scene-top"><span>SCÈNE ${String(i+1).padStart(2,'0')} / ${animeTime(animeSceneLength(i)/1000)}</span><button data-anime-remove="${i}" ${studioFrames.length===1?'disabled':''} aria-label="${tr('Retirer la scène','Remove scene')} ${i+1}">×</button></div><label for="scene-title-${i}">${tr('Titre','Title')}</label><input id="scene-title-${i}" data-scene-title="${i}" maxlength="100" value="${esc(f.title)}"><label for="anime-speaker-${i}">${tr('Qui parle ?','Who speaks?')}</label><select id="anime-speaker-${i}" data-anime-speaker="${i}"><option value="aya" ${f.speaker==='aya'?'selected':''}>Aya</option><option value="noe" ${f.speaker==='noe'?'selected':''}>Noé</option></select><label for="anime-text-${i}">${tr('Explication / sous-titres','Explanation / subtitles')}</label><textarea id="anime-text-${i}" data-scene-text="${i}" maxlength="900" rows="5">${esc(f.text)}</textarea><small>${esc(f.source)||tr('Scène personnelle','Personal scene')}</small></article>`).join('')}</div></section>`;
};

function animeRounded(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function animeEllipse(ctx,x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function animePolygon(ctx,points,fill,stroke){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function animeLines(ctx,text,width){const lines=[];for(const paragraph of String(text).split('\n')){let line='';for(const word of paragraph.split(/\s+/).filter(Boolean)){const proposed=line?line+' '+word:word;if(ctx.measureText(proposed).width>width&&line){lines.push(line);line=''}if(ctx.measureText(word).width>width){if(line){lines.push(line);line=''}for(const char of word){if(ctx.measureText(line+char).width>width&&line){lines.push(line);line=''}line+=char}}else line=line?line+' '+word:word}if(line)lines.push(line)}return lines.length?lines:['…']}
function animeText(ctx,text,x,y,width,font,lineHeight,maxLines){ctx.font=font;const lines=animeLines(ctx,text,width);lines.slice(0,maxLines).forEach((line,i)=>ctx.fillText(line+(i===maxLines-1&&lines.length>maxLines?'…':''),x,y+i*lineHeight));return lines}
function animeCharacter(ctx,x,y,scale,person,time,talking,faceRight){
 const aya=person==='aya',hair=aya?'#352951':'#202943',jacket=aya?'#a498ef':'#61bbb8',skin=aya?'#f7cbb9':'#bd8d72';
 ctx.save();ctx.translate(x,y+Math.sin(time*2.6+(aya?0:1))*3);ctx.scale(faceRight?scale:-scale,scale);
 animeEllipse(ctx,0,318,86,13,'#080e3038');
 // School uniform, boots and layered jacket.
 animePolygon(ctx,[[-38,195],[-6,195],[-9,290],[-35,290]],'#252743');animePolygon(ctx,[[8,195],[40,195],[33,290],[10,290]],'#252743');
 animeRounded(ctx,-41,280,36,24,7,'#172139');animeRounded(ctx,6,280,36,24,7,'#172139');
 if(aya)animeRounded(ctx,-67,-99,135,221,55,hair);
 animePolygon(ctx,[[-55,68],[55,68],[70,208],[-70,208]],jacket,'#242942');
 animePolygon(ctx,[[-24,67],[25,67],[14,181],[-15,181]],'#fff3e7');
 animePolygon(ctx,[[-22,65],[-4,89],[-18,117],[-40,79]],'#e5ddff');animePolygon(ctx,[[22,65],[4,89],[18,117],[40,79]],'#e5ddff');
 animePolygon(ctx,[[-6,89],[6,89],[13,144],[0,157],[-13,144]],aya?'#d86290':'#376b83');
 animeRounded(ctx,-17,33,34,39,10,skin);animeEllipse(ctx,-56,-4,10,16,skin);animeEllipse(ctx,56,-4,10,16,skin);
 animeEllipse(ctx,0,-19,57,73,skin);
 // Hair silhouette and asymmetric bangs create an original anime character.
 animeEllipse(ctx,0,-65,64,45,hair);
 animePolygon(ctx,[[-64,-52],[-48,-96],[-23,-112],[8,-110],[57,-91],[68,-40],[44,-19],[39,-64],[17,-45],[15,-79],[-4,-47],[-15,-77],[-39,-35],[-44,11],[-63,-13]],hair,'#25233d');
 if(aya){animePolygon(ctx,[[49,-67],[89,-84],[106,-38],[91,66],[72,91],[80,-7],[56,-23]],hair);animeRounded(ctx,52,-67,17,10,3,'#f2a8c8');ctx.strokeStyle='#6d5785';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-36,-88);ctx.quadraticCurveTo(-9,-110,24,-88);ctx.stroke()}
 const blink=Math.sin(time*1.4+(aya?0:2))>.989;
 for(const eye of [-25,25]){
  if(blink){ctx.strokeStyle='#30263c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(eye-13,-11);ctx.lineTo(eye+13,-11);ctx.stroke()}
  else{animeEllipse(ctx,eye,-10,15,20,'#fff9f3');animeEllipse(ctx,eye+3,-6,9,16,aya?'#765cb3':'#247e87');animeEllipse(ctx,eye+3,-4,5,11,'#22273e');animeEllipse(ctx,eye+5,-15,4,5,'#ffffff');animeEllipse(ctx,eye-1,0,2,3,'#ffffff');ctx.strokeStyle='#30263c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(eye-15,-18);ctx.quadraticCurveTo(eye,-31,eye+15,-19);ctx.stroke()}
 }
 ctx.strokeStyle='#a96f68';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1,4);ctx.lineTo(-2,13);ctx.lineTo(3,15);ctx.stroke();
 animeEllipse(ctx,-36,18,10,4,aya?'#e8a2a177':'#ba776977');animeEllipse(ctx,36,18,10,4,aya?'#e8a2a177':'#ba776977');
 if(talking)animeEllipse(ctx,0,30,7,3+Math.abs(Math.sin(time*8))*6,'#954e63');else{ctx.strokeStyle='#954e63';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-7,28);ctx.quadraticCurveTo(0,34,7,28);ctx.stroke()}
 // One hand holds a book; the speaking hand gestures towards the board.
 ctx.strokeStyle=jacket;ctx.lineWidth=23;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-51,86);ctx.lineTo(-68,157);ctx.lineTo(-24,166);ctx.stroke();
 animeRounded(ctx,-33,142,53,51,5,'#344b70','#b6cee6');animeEllipse(ctx,-22,164,11,9,skin);
 const gesture=talking?Math.sin(time*2)*12:0;ctx.strokeStyle=jacket;ctx.lineWidth=23;ctx.beginPath();ctx.moveTo(52,86);ctx.lineTo(80,125);ctx.lineTo(105,82+gesture);ctx.stroke();animeEllipse(ctx,108,74+gesture,11,16,skin);
 ctx.restore();
}
drawFrame=function(ms=0){
 const canvas=$('#animation-canvas');if(!canvas)return;if(!studioFrames?.length)studioFrames=animeFrames(defaultFrames());const ctx=canvas.getContext('2d');if(!ctx)return;
 const p=animePosition(ms),f=studioFrames[p.index],t=p.time/1000,palette=animeThemes[animeTheme]||animeThemes.campus,speaker=animeCast==='duo'?f.speaker:animeCast;
 ctx.save();ctx.setTransform(canvas.width/1280,0,0,canvas.height/720,0,0);
 const sky=ctx.createLinearGradient(0,0,0,720);sky.addColorStop(0,palette.top);sky.addColorStop(1,palette.bottom);ctx.fillStyle=sky;ctx.fillRect(0,0,1280,720);
 // Parallax skyline, drifting clouds and atmospheric particles.
 animeEllipse(ctx,1080,107,65,65,animeTheme==='night'?'#fff1d1':'#ffd7b777');
 for(let n=0;n<10;n++){const x=n*156-80+Math.sin(t*.15)*10,h=70+(n*47)%155;ctx.fillStyle=n%2?'#32355744':'#363b675c';ctx.fillRect(x,510-h,113,h);for(let k=0;k<3;k++){ctx.fillStyle='#f3ddb34d';ctx.fillRect(x+17+k*25,520-h,10,15)}}
 for(let n=0;n<17;n++){const x=(n*97+t*(3+n%3))%1320,y=72+(n*83)%430+Math.sin(t*.5+n)*13;animeEllipse(ctx,x,y,n%3===0?3:1.5,n%3===0?3:1.5,'#fff2da90')}
 ctx.fillStyle='#191f3f';ctx.fillRect(0,515,1280,205);ctx.fillStyle='#66749a';ctx.fillRect(0,514,1280,3);ctx.strokeStyle='#7581a535';ctx.lineWidth=2;for(let n=0;n<8;n++){ctx.beginPath();ctx.moveTo(640,510);ctx.lineTo(n*220-160,720);ctx.stroke()}
 animeRounded(ctx,36,25,218,34,17,'#11172c88');ctx.fillStyle='#e8e5ff';ctx.font='700 13px system-ui';ctx.fillText('✦ STUDYBRIDGE / ANIME LAB',51,47);
 ctx.fillStyle='#ffffffcc';ctx.font='600 14px system-ui';ctx.textAlign='right';ctx.fillText(`${String(p.index+1).padStart(2,'0')} / ${String(studioFrames.length).padStart(2,'0')}    ${animeTime(p.time/1000)} / ${animeTime(animeDuration)}`,1240,47);ctx.textAlign='left';
 animeRounded(ctx,278,86,724,438,24,'#11172e30');animeRounded(ctx,268,77,744,438,22,palette.board,palette.accent+'88');
 ctx.fillStyle=palette.accent;ctx.font='700 13px system-ui';ctx.fillText(tr('UNE NOTION À LA FOIS','ONE CONCEPT AT A TIME'),301,113);
 ctx.fillStyle='#fff6ec';animeText(ctx,f.title,300,158,675,'700 31px system-ui',39,2);
 ctx.fillStyle=palette.accent;ctx.fillRect(300,220,44,3);
 // Paginate all subtitle text rather than silently cutting longer explanations.
 ctx.font='23px system-ui';const allLines=animeLines(ctx,f.text,660),pages=Math.max(1,Math.ceil(allLines.length/6)),page=Math.min(pages-1,Math.floor(p.phase*pages));
 ctx.fillStyle='#e4e5f5';allLines.slice(page*6,page*6+6).forEach((line,i)=>ctx.fillText(line,300,264+i*32));
 ctx.fillStyle='#bdc2dc';ctx.font='13px system-ui';ctx.fillText(String(f.source||tr('Scénario personnel','Personal script')).slice(0,90),300,485);if(pages>1){ctx.textAlign='right';ctx.fillText(`${page+1} / ${pages}`,975,485);ctx.textAlign='left'}
 if(animeCast==='duo'||animeCast==='aya')animeCharacter(ctx,144,285,.87,'aya',t,speaker==='aya',true);
 if(animeCast==='duo'||animeCast==='noe')animeCharacter(ctx,1137,285,.87,'noe',t,speaker==='noe',false);
 const name=speaker==='noe'?'NOÉ':'AYA';animeRounded(ctx,235,557,810,122,18,'#11182fe8','#ffffff25');animeRounded(ctx,260,539,100,29,9,speaker==='noe'?'#398e91':'#8b70cc');ctx.fillStyle='white';ctx.font='700 14px system-ui';ctx.fillText(name,278,559);
 const chunks=allLines.length?allLines:['…'],captionLines=chunks.slice(page*6,page*6+6);const captionPage=Math.min(Math.max(0,Math.ceil(captionLines.length/2)-1),Math.floor((p.phase*pages-page)*Math.max(1,Math.ceil(captionLines.length/2))));ctx.fillStyle='#fff5ec';ctx.font='21px system-ui';captionLines.slice(captionPage*2,captionPage*2+2).forEach((line,i)=>ctx.fillText(line,266,600+i*29));
 ctx.fillStyle='#ffffff36';ctx.fillRect(36,699,1208,4);ctx.fillStyle=palette.accent;ctx.fillRect(36,699,1208*p.time/p.duration,4);ctx.restore();
};

const animeOldStop=stopAnimation;
stopAnimation=function(){clearTimeout(animeTimer);animeTimer=null;animeOldStop();animeControls(false)};
function animeControls(recording){$$('.anime-settings input,.anime-settings select,.anime-settings button,.anime-script input,.anime-script textarea,.anime-script select,.anime-script button,[data-anime-scene],#anime-seek,#animation-play,#animation-export').forEach(e=>e.disabled=recording);if(!recording){const add=$('#anime-add');if(add)add.disabled=studioFrames?.length>=ANIME_MAX_SCENES;$$('[data-anime-remove]').forEach(e=>e.disabled=studioFrames?.length<=1)}}
playAnimation=function(){
 stopAnimation();if(animeCursor>=animeDuration*1000-100)animeCursor=0;animationPlaying=true;animationStart=Date.now()-animeCursor;animeLastUI=-1;
 const tick=()=>{if(!animationPlaying)return;animeCursor=Math.max(0,Math.min(animeDuration*1000,Date.now()-animationStart));drawFrame(animeCursor);animeUI(animeCursor);if(animeCursor>=animeDuration*1000){animationPlaying=false;animeExportComplete=true;if(animationRecording&&animation?.state==='recording')animation.stop();animationRecording=false;return}animationFrame=requestAnimationFrame(tick)};
 tick();
};
exportAnimation=async function(){
 const canvas=$('#animation-canvas');if(!canvas?.captureStream||typeof MediaRecorder==='undefined'){animeSetStatus(tr('Export non pris en charge ici. Essaie un navigateur récent.','Export is unavailable here. Try a recent browser.'));return}
 if(document.hidden){animeSetStatus(tr('Affiche cet onglet avant de lancer l’export.','Show this tab before exporting.'));return}
 stopAnimation();animeCursor=0;animeExportComplete=false;animeExportCancelled=false;const type=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t));if(!type){animeSetStatus(tr('Aucun format vidéo compatible.','No compatible video format.'));return}
 let stream;try{
  drawFrame(0);stream=canvas.captureStream(24);if(typeof animeAttachAudio==='function')animeAttachAudio(stream);const recorder=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:2500000}),chunks=[];animation=recorder;
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  recorder.onstop=()=>{clearTimeout(animeTimer);animeTimer=null;stream.getTracks().forEach(t=>t.stop());if(typeof animeStopAudio==='function')animeStopAudio();animationRecording=false;animationPlaying=false;cancelAnimationFrame(animationFrame);if(animeExportComplete){animeCursor=animeDuration*1000;drawFrame(animeCursor);animeUI(animeCursor)}animeControls(false);if(animeExportCancelled||!chunks.length){animeSetStatus(tr('Export annulé. Tu peux recommencer.','Export cancelled. You can try again.'));return}const blob=new Blob(chunks,{type});if(videoURL)URL.revokeObjectURL(videoURL);videoURL=URL.createObjectURL(blob);const output=$('#video-output');if(output){output.innerHTML=`<video controls playsinline src="${videoURL}"></video><a class="btn primary" download="studybridge-anime${typeof animeExportHasAudio!=='undefined'&&animeExportHasAudio?'-avec-voix':''}.${type.includes('mp4')?'mp4':'webm'}" href="${videoURL}">↓ ${tr('Télécharger la vidéo anime','Download anime video')}</a>`;animeSetStatus(animeExportComplete?(typeof animeNarrationLabel==='function'?animeNarrationLabel():tr('Vidéo anime prête · Sans audio.','Anime video ready · No audio.')):tr('Export interrompu : cette vidéo est partielle. Relance pour la durée complète.','Export interrupted: this is a partial video. Export again for the full duration.'))}};
  recorder.onerror=()=>{animeExportCancelled=true;stopAnimation();stream.getTracks().forEach(t=>t.stop());animeSetStatus(tr('L’export a échoué. Réessaie.','Export failed. Try again.'))};
  if(typeof animePlaybackStart==='function')animePlaybackStart();else playAnimation();recorder.start(1000);animationRecording=true;animeControls(true);
  animeTimer=setTimeout(()=>{if(recorder.state==='recording'){animeCursor=animeDuration*1000;animeExportComplete=true;recorder.stop()}},animeDuration*1000);
  animeSetStatus(tr(`Enregistrement en cours · ${animeTime(animeDuration)} · Garde cet onglet visible.`,`Recording · ${animeTime(animeDuration)} · Keep this tab visible.`));
 }catch{if(stream)stream.getTracks().forEach(t=>t.stop());animationRecording=false;animationPlaying=false;cancelAnimationFrame(animationFrame);animeControls(false);animeSetStatus(tr('Impossible de démarrer l’export. Essaie un autre navigateur.','Could not start export. Try another browser.'))}
};

const animeOldBind=bindExtra;
bindExtra=function(){
 animeOldBind();if(!$('#anime-duration'))return;drawFrame(animeCursor);animeLastUI=-1;animeUI(animeCursor);
 const refresh=()=>{stopAnimation();animeCursor=0;animeSaveDraft();render()};
 const setDuration=value=>{animeDuration=animeSeconds(value);refresh()};
 $('#anime-duration').onchange=e=>setDuration(e.target.value);$$('[data-anime-duration]').forEach(b=>b.onclick=()=>setDuration(b.dataset.animeDuration));
 $('#anime-theme').onchange=e=>{animeTheme=animeThemes[e.target.value]?e.target.value:'campus';refresh()};$('#anime-cast').onchange=e=>{animeCast=e.target.value;refresh()};
 $('#anime-seek').oninput=e=>{stopAnimation();animeCursor=Math.max(0,Math.min(animeDuration*1000,Number(e.target.value)*1000));drawFrame(animeCursor);animeLastUI=-1;animeUI(animeCursor)};
 $$('[data-anime-scene]').forEach(b=>b.onclick=()=>{stopAnimation();animeCursor=animeSceneStart(Number(b.dataset.animeScene));drawFrame(animeCursor);animeLastUI=-1;animeUI(animeCursor)});
 $$('[data-scene-title]').forEach(e=>e.oninput=()=>{stopAnimation();studioFrames[Number(e.dataset.sceneTitle)].title=e.value.slice(0,100);animeCursor=animeSceneStart(Number(e.dataset.sceneTitle));animeSaveDraft();drawFrame(animeCursor)});
 $$('[data-scene-text]').forEach(e=>e.oninput=()=>{stopAnimation();studioFrames[Number(e.dataset.sceneText)].text=e.value.slice(0,900);animeCursor=animeSceneStart(Number(e.dataset.sceneText));animeSaveDraft();drawFrame(animeCursor)});
 $$('[data-anime-speaker]').forEach(e=>e.onchange=()=>{studioFrames[Number(e.dataset.animeSpeaker)].speaker=e.value;refresh()});
 $('#anime-add').onclick=()=>{if(studioFrames.length>=ANIME_MAX_SCENES)return;studioFrames.push({title:tr('Nouvelle idée','New idea'),text:tr('Écris ici ce que le personnage doit expliquer.','Write what the character should explain.'),source:'',speaker:studioFrames.length%2?'noe':'aya'});refresh()};
 $$('[data-anime-remove]').forEach(b=>b.onclick=()=>{if(studioFrames.length<=1)return;studioFrames.splice(Number(b.dataset.animeRemove),1);refresh()});
 $('#studio-load').onclick=async()=>{const source=$('#studio-source').value;const button=$('#studio-load');button.disabled=true;try{let frames;if(source.startsWith('wim-')){const l=LESSONS.find(l=>l.id===Number(source.slice(4)));if(!l)throw Error('Course');frames=[{title:l.title[lang],text:l.body[lang][0],source:'WIM · p. '+l.page},{title:tr('Comprendre le mécanisme','Understand the mechanism'),text:l.body[lang].slice(1).join(' '),source:'WIM · p. '+l.page},{title:tr('Un exemple concret','A concrete example'),text:l.example[lang],source:'WIM · p. '+l.page},{title:tr('À toi de jouer','Your turn'),text:l.question.text[lang],source:'WIM · p. '+l.page}]}else{const d=await api('/api/courses?id='+encodeURIComponent(source));frames=d.pages.filter(p=>p.text.trim().length>30).slice(0,8).map((p,i)=>({title:d.title+' · '+(i+1),text:p.text.trim().slice(0,900),source:d.title+' · p. '+p.page}));if(!frames.length)throw Error(tr('Aucun texte exploitable.','No usable text.'))}studioSource=source;studioFrames=animeFrames(frames);refresh()}catch(e){animeSetStatus(e.message)}finally{button.disabled=false}};
 $('#animation-stop').onclick=()=>{if(animationRecording)animeExportComplete=false;stopAnimation();animeSetStatus(tr('Lecture arrêtée. Reprends avec Lire.','Playback stopped. Resume with Play.'))};
};
window.addEventListener('beforeunload',event=>{if(animationRecording){event.preventDefault();event.returnValue=''}});
render();

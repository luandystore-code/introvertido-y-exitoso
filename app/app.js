(function client(){
"use strict";
const DATA=window.CALMA_DATA;
const nav=document.getElementById("nav");
const main=document.getElementById("page-content");
const pageTitle=document.getElementById("page-title");
const saveStatus=document.getElementById("save-status");
const modal=document.getElementById("modal");
const STORAGE_KEY="calma_progreso_local_v1";
const MAX_BACKUP_BYTES=2*1024*1024;
let records={};
let view="inicio",day=1,stage=0,tool="networking",assessment="start";
function escapeHTML(s){return String(s===undefined||s===null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function value(k){if(!records[k])records[k]={answers:{},checks:{},scores:{},done:false};return records[k];}
function localSave(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(records));saveStatus.textContent="✓ Guardado en este dispositivo";return true;}catch(e){saveStatus.textContent="⚠ No se pudo guardar. Exporta un respaldo";return false;}}
function validateRecords(source){
 if(!source||typeof source!=="object"||Array.isArray(source))throw Error("El respaldo no contiene registros válidos.");
 const clean={},allowed=/^(day-([1-9]|[12][0-9]|30)|stage-[0-4]|assessment-(start|end)|tool-(network|meeting|limits|scripts))$/;
 for(const [key,record] of Object.entries(source)){
  if(!allowed.test(key)||!record||typeof record!=="object"||Array.isArray(record))continue;
  const out={answers:{},checks:{},scores:{},done:record.done===true};
  if(Number.isSafeInteger(record.updatedAt)&&record.updatedAt>=1600000000000&&record.updatedAt<=Date.now()+86400000)out.updatedAt=record.updatedAt;
  if(record.answers&&typeof record.answers==="object"&&!Array.isArray(record.answers))for(const [id,answer] of Object.entries(record.answers))if(/^[a-z0-9_-]{1,30}$/i.test(id)&&typeof answer==="string")out.answers[id]=answer.slice(0,2000);
  if(record.checks&&typeof record.checks==="object"&&!Array.isArray(record.checks))for(const [id,checked] of Object.entries(record.checks))if(/^[a-z0-9_-]{1,30}$/i.test(id))out.checks[id]=checked===true;
  if(record.scores&&typeof record.scores==="object"&&!Array.isArray(record.scores))for(const [id,score] of Object.entries(record.scores))if(/^[a-z0-9_-]{1,30}$/i.test(id)&&Number.isInteger(score)&&score>=0&&score<=10)out.scores[id]=score;
  clean[key]=out;
 }
 return clean;
}
function localLoad(){
 try{const saved=localStorage.getItem(STORAGE_KEY);records=saved?validateRecords(JSON.parse(saved)):{};}
 catch(e){records={};saveStatus.textContent="⚠ Error al leer avances guardados";}
}
function changed(k){value(k).updatedAt=Date.now();localSave();}
function applyImported(source){
 const imported=validateRecords(source);
 if(!Object.keys(imported).length)throw Error("No se encontraron ejercicios guardados.");
 if(!confirm("¿Importar estos avances? Reemplazará los registros actuales de este navegador. Exporta primero un respaldo si quieres conservarlos."))return;
 const previous=records;records=imported;
 if(!localSave()){records=previous;throw Error("No se pudo guardar el respaldo en este navegador.");}
 close();render();alert("Tus avances se importaron correctamente.");
}
function exportBackup(){
 const blob=new Blob([JSON.stringify({app:"introvertido-seguro",version:1,storage:"local",exported:new Date().toISOString(),records},null,2)],{type:"application/json"});
 const u=URL.createObjectURL(blob),anchor=document.createElement("a");
 anchor.href=u;anchor.download="respaldo-mi-progreso-calma.json";anchor.click();
 setTimeout(()=>URL.revokeObjectURL(u),5000);
}
function importBackup(){
 const picker=document.createElement("input");picker.type="file";picker.accept=".json,application/json";
 picker.addEventListener("change",async()=>{const file=picker.files&&picker.files[0];if(!file)return;
  if(file.size>MAX_BACKUP_BYTES){alert("El respaldo supera el límite de 2 MB.");return;}
  try{const content=JSON.parse(await file.text());if(content.app!=="introvertido-seguro"||!content.records)throw Error("Este archivo no es un respaldo C.A.L.M.A.");applyImported(content.records);}
  catch(e){alert("No se pudo importar: "+e.message);}
 });picker.click();
}
function field(k,id,label,placeholder="Escribe aquí tu respuesta…"){return `<div class="formfield"><label for="${k}-${id}">${escapeHTML(label)}</label><textarea id="${k}-${id}" data-key="${k}" data-text="${id}" placeholder="${escapeHTML(placeholder)}">${escapeHTML(value(k).answers[id]||"")}</textarea></div>`;}
function checkbox(k,id,label){return `<label class="check"><input type="checkbox" data-key="${k}" data-check="${id}" ${value(k).checks[id]?"checked":""}><span>${escapeHTML(label)}</span></label>`;}
function complete(k,label){return `<label class="check"><input type="checkbox" data-key="${k}" data-done="1" ${value(k).done?"checked":""}><span><b>${escapeHTML(label)}</b></span></label>`;}
function scale(k,id,max){let html=`<div class="scale" role="group" aria-label="Escala de 0 a ${max}">`;for(let i=0;i<=max;i++){html+=`<label><input type="radio" name="${k}-${id}" data-key="${k}" data-score="${id}" value="${i}" ${value(k).scores[id]===i?"checked":""}><span>${i}</span></label>`;}return html+"</div>";}
function btn(text,attrs,kind=""){return `<button class="btn ${kind}" ${attrs}>${text}</button>`;}
function bar(v,max,label="Progreso"){return `<div class="progress" role="progressbar" aria-label="${escapeHTML(label)}" aria-valuemin="0" aria-valuenow="${v}" aria-valuemax="${max}"><span style="width:${Math.min(100,Math.max(0,v/max*100))}%"></span></div>`;}
function countDays(){return DATA.days.filter((_,i)=>value("day-"+(i+1)).done).length;}
function countStages(){return DATA.method.filter((_,i)=>value("stage-"+i).done).length;}
function home(){
 const completed=countDays(),stageCount=countStages();
 const next=Math.max(1,DATA.days.findIndex((_,i)=>!value("day-"+(i+1)).done)+1||30);
 return `<section class="hero"><span class="pill gold">TU VOZ IMPORTA</span><h2>No necesitas hablar más fuerte. Necesitas aprender a hacerte escuchar.</h2><p>Aprende, escribe tus respuestas y construye confianza con acciones pequeñas.</p>${btn("Continuar con mi entrenamiento","data-view='reto' data-day='"+next+"'","gold")}</section>
 <div class="cardgrid metrics"><div class="metric"><strong>${Math.round(completed/30*100)}%</strong><small>${completed} de 30 retos completados</small>${bar(completed,30,"Reto de 30 días")}<p>${btn("Ver mis avances","data-view=\'mi-espacio\'","secondary sm")}</p></div><div class="metric"><strong>${stageCount}/5</strong><small>Etapas del método</small>${bar(stageCount,5)}</div><div class="metric"><strong>${value("assessment-start").done?"✓":"—"}</strong><small>Evaluación inicial</small><p>${btn("Responder","data-view='evaluacion' data-assessment='start'","secondary sm")}</p></div></div>
 <div class="two"><section class="panel"><span class="eyebrow">SIGUIENTE RETO</span><h2 class="section-title">Día ${next}: ${escapeHTML(DATA.days[next-1][0])}</h2><p>${escapeHTML(DATA.days[next-1][1])}</p>${btn("Ir al reto","data-view='reto' data-day='"+next+"'")}</section><section class="panel"><span class="eyebrow">TU RECORRIDO</span><h2 class="section-title">C.A.L.M.A.</h2><p>Clarifica → Acepta → Libérate → Muévete → Actúa.</p>${btn("Abrir método","data-view='metodo'","secondary")}</section></div>
 <div class="notice" style="margin-top:20px"><b>Tu espacio, sin contraseña:</b> esta herramienta se abre directamente. Las respuestas se guardan solo en este navegador, no en Hotmart ni en la nube. Descarga un respaldo desde «Mis avances» para conservarlas. El enlace de la app es público.</div>`;
}
function method(){
 const s=DATA.method[stage],k="stage-"+stage;
 return `<div class="menu-tabs">${DATA.method.map((x,i)=>`<button class="tabbtn ${stage===i?"active":""}" data-stage="${i}">${x.letter} · ${x.name}${value("stage-"+i).done?" ✓":""}</button>`).join("")}</div>
 <section class="panel stack"><div class="row"><span class="stepnum">${stage+1}</span><span class="eyebrow">ETAPA ${stage+1} DE 5</span></div>
 <h2 class="section-title">${escapeHTML(s.letter+" — "+s.title)}</h2><p class="lead">${escapeHTML(s.desc)}</p><div class="notice"><b>Ejemplo:</b> ${escapeHTML(s.example)}</div><h3>Tu práctica escrita</h3>
 ${s.questions.map((q,i)=>field(k,"q"+i,q)).join("")}<h3>Checklist de aprendizaje</h3><div class="checks">${s.checks.map((c,i)=>checkbox(k,"c"+i,c)).join("")}</div>${complete(k,"He completado esta etapa y practicado una acción")}
 <div class="row">${btn("← Anterior",stage>0?"data-stage='"+(stage-1)+"'":"data-view='inicio'","secondary")}${btn(stage<4?"Siguiente etapa →":"Empezar reto →",stage<4?"data-stage='"+(stage+1)+"'":"data-view='reto'")}</div></section>`;
}
function challenge(){
 const k="day-"+day,d=DATA.days[day-1],n=countDays();
 return `<section class="panel"><div class="row between"><h2 class="section-title">Tu avance: ${n}/30 días</h2><span class="pill">${Math.round(n/30*100)}%</span></div>${bar(n,30)}<p class="muted">Los retos no tienen que realizarse en días consecutivos. Repite o simplifica una acción cuando lo necesites.</p>
 <div class="listdays">${DATA.days.map((x,i)=>`<button class="daybtn ${i+1===day?"selected":""} ${value("day-"+(i+1)).done?"done":""}" data-day="${i+1}"><span>${i+1}</span><small>${value("day-"+(i+1)).done?"✓ Hecho":"Abrir"}</small></button>`).join("")}</div></section>
 <section class="panel stack" style="margin-top:18px"><div class="row between"><span class="pill gold">DÍA ${String(day).padStart(2,"0")}</span><span class="muted">Un paso a tu ritmo</span></div><h2 class="section-title">${escapeHTML(d[0])}</h2><p class="lead">Acción: ${escapeHTML(d[0])}.</p><div class="notice">Versión fácil: ${escapeHTML(d[1])}</div>
 <h3>Antes de empezar</h3><span class="label">Incomodidad antes (0–10)</span>${scale(k,"before",10)}
 <h3>Después de practicar</h3>${checkbox(k,"easy","Utilicé la versión fácil")}${checkbox(k,"tried","Intenté la actividad en una situación real")}<span class="label">Incomodidad después (0–10)</span>${scale(k,"after",10)}
 ${field(k,"story","¿Qué ocurrió realmente?")}${field(k,"next","¿Qué aprendí o ajustaré?")}${complete(k,"Marcar este día como completado")}
 <div class="row">${btn("← Día anterior","data-day='"+Math.max(1,day-1)+"'","secondary")}${btn(day===30?"Volver al inicio":"Día siguiente →",day===30?"data-view='inicio'":"data-day='"+(day+1)+"'")}</div></section>`;
}
function tools(){
 const tabs=[["networking","Checklist networking"],["reuniones","Reuniones"],["limites","Límites"],["guiones","Frases rápidas"]];
 let out=`<div class="menu-tabs">${tabs.map(x=>`<button class="tabbtn ${x[0]===tool?"active":""}" data-tool="${x[0]}">${x[1]}</button>`).join("")}</div>`;
 if(tool==="networking"){const k="tool-network";out+=`<section class="panel"><h2 class="section-title">Checklist de networking auténtico</h2><p>Hablar con una persona puede ser suficiente.</p><div class="checks">${DATA.networking.map((x,i)=>checkbox(k,"c"+i,x)).join("")}</div>${field(k,"mission","Mi misión mínima")}${field(k,"follow","Mi mensaje de seguimiento")}${complete(k,"He preparado mi próximo encuentro")}</section>`;}
 if(tool==="reuniones"){const k="tool-meeting";out+=`<section class="panel"><h2 class="section-title">Preparar una reunión</h2><p>Fórmula 1-1-1: una idea, una razón y un siguiente paso.</p>${["Objetivo","Una idea que aportaré","Razón principal","Siguiente paso que propongo","Frase de entrada","Qué diré si me interrumpen"].map((x,i)=>field(k,"f"+i,x)).join("")}${complete(k,"Ya preparé mi intervención")}</section>`;}
 if(tool==="limites"){const k="tool-limits";out+=`<section class="panel"><h2 class="section-title">Límites sin culpa</h2><div class="notice"><b>L-C-A:</b> Límite, contexto breve, alternativa opcional.</div>${field(k,"limit","Mi límite claro")}${field(k,"why","Mi contexto breve")}${field(k,"other","Alternativa opcional")}${checkbox(k,"practice","Lo practiqué en voz alta")}${complete(k,"Preparé un límite respetuoso")}</section>`;}
 if(tool==="guiones"){out+=`<div class="cardgrid">${DATA.scripts.map(x=>`<section class="stepcard"><h3>${escapeHTML(x[0])}</h3>${x.slice(1).map(s=>`<p>«${escapeHTML(s)}»</p>`).join("")}</section>`).join("")}</div><section class="panel" style="margin-top:18px">${field("tool-scripts","mine","Adapta una frase a tu forma de hablar")}</section>`;}
 return out;
}
function evaluation(){
 const k=assessment==="start"?"assessment-start":"assessment-end";
 return `<section class="panel"><span class="eyebrow">${assessment==="start"?"PUNTO DE PARTIDA":"EVALUACIÓN FINAL"}</span><h2 class="section-title">Ocho preguntas para medir tus avances</h2><p>Marca del 0 (nunca) al 4 (casi siempre). No es una prueba clínica.</p>
 ${DATA.questions.map((x,i)=>`<div class="formfield" style="padding:12px 0;border-bottom:1px solid #e4e8df"><label>${i+1}. ${escapeHTML(x)}</label>${scale(k,"q"+i,4)}</div>`).join("")}
 ${field(k,"goal",assessment==="start"?"¿Qué conducta quiero mejorar?":"¿Qué conducta concreta logré mejorar?")}${complete(k,"He terminado esta evaluación")}
 <div class="row">${btn("Volver a mis avances","data-view='mi-espacio'","secondary")}${btn("Reto de 30 días","data-view='reto'")}</div></section>`;
}

function hasWork(k){
 const r=records[k];if(!r)return false;
 return r.done===true
  ||Object.values(r.answers||{}).some(v=>typeof v==="string"&&v.trim().length>0)
  ||Object.values(r.checks||{}).some(Boolean)
  ||Object.values(r.scores||{}).some(n=>Number.isInteger(n));
}
function activityName(key){
 if(key.startsWith("day-")){
  const n=Number(key.slice(4));return n>=1&&n<=30?"Día "+n+" · "+DATA.days[n-1][0]:"Actividad";
 }
 if(key.startsWith("stage-")){
  const n=Number(key.slice(6));return n>=0&&n<5?"Método C.A.L.M.A. · "+DATA.method[n].name:"Etapa";
 }
 if(key==="assessment-start")return "Evaluación inicial";
 if(key==="assessment-end")return "Evaluación final";
 const names={"tool-network":"Networking","tool-meeting":"Reuniones","tool-limits":"Límites","tool-scripts":"Frases rápidas"};
 return names[key]||"Herramientas prácticas";
}
function activityTarget(key){
 if(key.startsWith("day-"))return "data-day='"+Number(key.slice(4))+"'";
 if(key.startsWith("stage-"))return "data-stage='"+Number(key.slice(6))+"'";
 if(key==="assessment-start")return "data-view='evaluacion' data-assessment='start'";
 if(key==="assessment-end")return "data-view='evaluacion' data-assessment='end'";
 const names={"tool-network":"networking","tool-meeting":"reuniones","tool-limits":"limites","tool-scripts":"guiones"};
 return "data-tool='"+(names[key]||"networking")+"'";
}
function space(){
 const completed=countDays(),stages=countStages(),pct=Math.round(completed/30*100);
 const evaluations=["assessment-start","assessment-end"].filter(k=>value(k).done).length;
 const days=DATA.days.map((x,i)=>({number:i+1,title:x[0],done:value("day-"+(i+1)).done,started:hasWork("day-"+(i+1))}));
 const inProgress=days.filter(x=>x.started&&!x.done).length;
 const next=days.find(x=>!x.done);
 const nextWeek=Math.floor(((next?next.number:30)-1)/7);
 const weeks=Array.from({length:5},(_,w)=>{
  const slice=days.slice(w*7,(w+1)*7),done=slice.filter(x=>x.done).length;
  const rows=slice.map(x=>`<div class="advance-day ${x.done?"is-done":x.started?"is-started":""}">
   <span class="advance-day-number" aria-hidden="true">${String(x.number).padStart(2,"0")}</span>
   <div class="advance-day-body"><strong>Día ${x.number} · ${escapeHTML(x.title)}</strong><span class="advance-status">${x.done?"✓ Completado":x.started?"● En práctica":"○ Pendiente"}</span></div>
   ${btn(x.done?"Revisar":x.started?"Continuar":"Empezar","data-day='"+x.number+"'","secondary sm")}
  </div>`).join("");
  return `<details class="advance-week" ${w===nextWeek?"open":""}><summary><b>Semana ${w+1} · Días ${slice[0].number}–${slice[slice.length-1].number}</b><span>${done}/${slice.length} completados</span></summary><div class="advance-days">${rows}</div></details>`;
 }).join("");
 const stageRows=DATA.method.map((m,i)=>{
  const k="stage-"+i,record=value(k);
  return `<div class="advance-stage"><span class="advance-stage-dot ${record.done?"done":""}">${record.done?"✓":m.letter}</span><span><b>${escapeHTML(m.name)}</b><small>${record.done?"Completada":hasWork(k)?"En práctica":"Pendiente"}</small></span>${btn(record.done?"Revisar":"Abrir","data-stage='"+i+"'","secondary sm")}</div>`;
 }).join("");
 const recent=Object.keys(records).filter(hasWork).sort((a,b)=>(records[b].updatedAt||0)-(records[a].updatedAt||0)).slice(0,5);
 const recentRows=recent.map(k=>{
  const r=records[k],date=Number.isSafeInteger(r.updatedAt)?new Date(r.updatedAt).toLocaleDateString("es-PE",{day:"numeric",month:"short",year:"numeric"}):"Registro anterior";
  return `<div class="advance-activity"><div><b>${escapeHTML(activityName(k))}</b><small>${r.done?"Completado":"En práctica"} · ${escapeHTML(date)}</small></div>${btn("Abrir",activityTarget(k),"secondary sm")}</div>`;
 }).join("");
 return `<section class="advance-hero">
 <div><span class="eyebrow">MI RETO DE 30 DÍAS</span><h2>Así vas construyendo tu seguridad</h2><p>Cuenta cada reto como completado cuando lo marques al finalizar la práctica. Puedes avanzar a tu ritmo.</p></div>
 <div class="advance-percent"><strong>${pct}%</strong><small>del reto completado</small></div>
 <div class="advance-fullbar">${bar(completed,30,"Porcentaje completado del reto de 30 días")}</div>
 </section>
 <div class="cardgrid advance-metrics">
  <div class="metric"><strong>${completed}<span class="advance-denom">/30</span></strong><small>Retos completados</small></div>
  <div class="metric"><strong>${inProgress}</strong><small>Retos en práctica</small></div>
  <div class="metric"><strong>${stages}<span class="advance-denom">/5</span></strong><small>Etapas C.A.L.M.A. completadas</small></div>
 </div>
 <section class="panel advance-next">
  <span class="eyebrow">${next?"TU PRÓXIMO RETO":"RETO COMPLETADO"}</span>
  <h2 class="section-title">${next?"Día "+next.number+" · "+escapeHTML(next.title):"¡Completaste los 30 retos!"}</h2>
  <p class="muted">${next?"Tienes "+(30-completed)+" retos por completar. Puedes regresar a cualquiera cuando lo necesites.":"Puedes revisar tus respuestas y completar la evaluación final para comparar tus avances."}</p>
  ${next?btn(next.started?"Continuar con este reto":"Empezar este reto","data-day='"+next.number+"'"):btn("Hacer evaluación final","data-view='evaluacion' data-assessment='end'")}
 </section>
 <section class="panel advance-section"><div class="row between"><div><span class="eyebrow">TU RUTA</span><h2 class="section-title">Qué has hecho en los 30 días</h2></div><span class="pill">${pct}% completado</span></div>
 <p class="muted">«En práctica» significa que guardaste alguna respuesta, escala o checklist, pero aún no marcaste ese día como completado.</p>
 <div class="advance-weeks">${weeks}</div></section>
 <div class="two advance-two"><section class="panel"><span class="eyebrow">MÉTODO C.A.L.M.A.</span><h2 class="section-title">${stages} de 5 etapas</h2><div class="advance-stages">${stageRows}</div></section>
 <section class="panel"><span class="eyebrow">EVALUACIONES</span><h2 class="section-title">${evaluations} de 2 realizadas</h2>
 <p>${value("assessment-start").done?"✓ Evaluación inicial completada":"○ Evaluación inicial pendiente"}</p>
 ${btn(value("assessment-start").done?"Revisar evaluación inicial":"Hacer evaluación inicial","data-view='evaluacion' data-assessment='start'","secondary")}
 <p style="margin-top:20px">${value("assessment-end").done?"✓ Evaluación final completada":"○ Evaluación final pendiente"}</p>
 ${btn(value("assessment-end").done?"Revisar evaluación final":"Hacer evaluación final","data-view='evaluacion' data-assessment='end'","secondary")}
 <p class="muted">Estas evaluaciones no se incluyen en el porcentaje de los 30 retos.</p></section></div>
 <section class="panel advance-section"><span class="eyebrow">TU ACTIVIDAD</span><h2 class="section-title">Lo que has trabajado recientemente</h2>
 ${recentRows||'<p class="muted">Todavía no tienes actividades guardadas. Comienza con el primer reto o la evaluación inicial.</p>'}
 </section>
 <section class="panel advance-section"><h2 class="section-title">Respaldo y privacidad</h2><p>Tus avances están guardados en este navegador, sin contraseña. No se sincronizan automáticamente entre dispositivos.</p>
 <div class="row">${btn("Descargar respaldo","data-action='export'","secondary")}${btn("Importar respaldo","data-action='import-file'","secondary")}</div>
 <p class="muted">El archivo descargado incluye tus respuestas personales. Guárdalo de manera privada.</p>
 <div class="row">${btn("Recuperar avances de cuenta anterior","data-action='legacy'","secondary sm")}</div>
 <p class="muted">Borrar el progreso elimina únicamente los datos locales de esta versión, no cuentas anteriores.</p>
 ${btn("Borrar progreso de este dispositivo","data-action='delete'","secondary")}</section>`;
}
function render(){
 const titles={"inicio":"Tu progreso empieza aquí","metodo":"Método C.A.L.M.A.","reto":"Tu reto de 30 días","herramientas":"Herramientas prácticas","evaluacion":"Mis evaluaciones","mi-espacio":"Mis avances"};
 pageTitle.textContent=titles[view];
 nav.querySelectorAll("[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===view));
 main.innerHTML=view==="inicio"?home():view==="metodo"?method():view==="reto"?challenge():view==="herramientas"?tools():view==="evaluacion"?evaluation():space();
}
function show(html){modal.classList.remove("hidden");document.getElementById("modal-body").innerHTML=html;}
function close(){modal.classList.add("hidden");}
function legacyDialog(){
 const user=localStorage.getItem("calma_username")||"";
 show(`<p>Si usaste la versión antigua con cuenta, puedes traer sus respuestas aquí. No borramos tu cuenta anterior.</p><div class="formfield"><label for="legacy-user">Nombre de usuario anterior</label><input id="legacy-user" value="${escapeHTML(user)}" type="text" autocomplete="username" maxlength="32" placeholder="Solo si tenías usuario"></div><div class="formfield"><label for="legacy-pass">Contraseña anterior</label><input id="legacy-pass" type="password" autocomplete="current-password" maxlength="128" placeholder="Solo si tenías contraseña"></div><div class="formfield"><label for="legacy-key">Clave de recuperación antigua (alternativa)</label><input id="legacy-key" type="password" autocomplete="off" placeholder="Solo si tenías una clave"></div><p class="muted">Si usas este mismo navegador, primero intentaremos recuperar el acceso que ya estaba guardado. Si no se puede, completa los campos.</p><p id="dialog-error" role="alert" class="toast"></p><div class="row">${btn("Recuperar mis avances","data-action='legacy-load'")}${btn("Cancelar","data-action='close'","secondary")}</div>`);
}
function b64(bytes){let s="";for(const v of bytes)s+=String.fromCharCode(v);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
async function deriveKey(u,password){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:new TextEncoder().encode("introvertido-seguro-v2:"+u),iterations:310000,hash:"SHA-256"},key,256);return b64(new Uint8Array(bits));}
async function legacyFetch(token){
 if(!/^[A-Za-z0-9_-]{40,120}$/.test(token))throw Error("La clave anterior no es válida.");
 const response=await fetch("/api/entries",{headers:{Authorization:"Bearer "+token},cache:"no-store"});
 const result=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(result.error||"No se pudo recuperar la cuenta anterior.");
 return result.entries||{};
}
async function restoreLegacy(){
 const givenKey=document.getElementById("legacy-key").value.trim();
 const user=document.getElementById("legacy-user").value.trim().toLowerCase(),pass=document.getElementById("legacy-pass").value;
 const previous=localStorage.getItem("calma_key")||"";
 let token=givenKey;
 if(!token&&user&&pass)token=await deriveKey(user,pass);
 if(!token)token=previous;
 if(!token)throw Error("Escribe tu usuario y contraseña anteriores, o la clave antigua.");
 let entries;
 try{entries=await legacyFetch(token);}
 catch(e){if(!givenKey&&!pass&&previous===token){const raw=localStorage.getItem("calma_backup_"+token);if(raw)entries=JSON.parse(raw);else throw e;}else throw e;}
 applyImported(entries);
}
function boot(){localLoad();render();if(saveStatus.textContent.indexOf("⚠")<0)saveStatus.textContent="✓ Progreso en este dispositivo";}
document.addEventListener("click",async ev=>{
 const b=ev.target.closest("button");if(!b)return;
 if(b.id==="menu"){document.querySelector(".side").classList.toggle("expanded");return;}
 if(b.dataset.page||b.dataset.view){view=b.dataset.page||b.dataset.view;if(b.dataset.day)day=Number(b.dataset.day);if(b.dataset.assessment)assessment=b.dataset.assessment;document.querySelector(".side").classList.remove("expanded");render();scrollTo(0,0);return;}
 if(b.dataset.stage!==undefined){view="metodo";stage=Number(b.dataset.stage);render();scrollTo(0,0);return;}
 if(b.dataset.day){view="reto";day=Number(b.dataset.day);render();scrollTo(0,0);return;}
 if(b.dataset.tool){view="herramientas";tool=b.dataset.tool;render();scrollTo(0,0);return;}
 const action=b.dataset.action;if(!action)return;
 if(action==="close")close();
 if(action==="export")exportBackup();
 if(action==="import-file")importBackup();
 if(action==="legacy")legacyDialog();
 if(action==="legacy-load"){
  b.disabled=true;b.textContent="Recuperando…";
  try{await restoreLegacy();}
  catch(e){const el=document.getElementById("dialog-error");if(el)el.textContent=e.message;}
  finally{b.disabled=false;b.textContent="Recuperar mis avances";}
 }
 if(action==="delete"){
  if(!confirm("¿Eliminar tus ejercicios y respuestas de este navegador? Haz antes un respaldo si deseas conservarlos."))return;
  if(!confirm("Esta acción no se puede deshacer en este dispositivo sin un respaldo. ¿Confirmas?"))return;
  try{localStorage.removeItem(STORAGE_KEY);records={};saveStatus.textContent="Progreso local eliminado";render();}
  catch(e){alert("No se pudo eliminar el progreso de este navegador.");}
 }
});
document.addEventListener("input",ev=>{const t=ev.target;if(t.dataset.key&&t.dataset.text!==undefined){value(t.dataset.key).answers[t.dataset.text]=t.value;changed(t.dataset.key);}});
document.addEventListener("change",ev=>{const t=ev.target,k=t.dataset.key;if(!k)return;if(t.dataset.check!==undefined)value(k).checks[t.dataset.check]=t.checked;else if(t.dataset.score!==undefined)value(k).scores[t.dataset.score]=Number(t.value);else if(t.dataset.done!==undefined)value(k).done=t.checked;else return;changed(k);if(t.dataset.done!==undefined)render();});
window.addEventListener("storage",ev=>{if(ev.key===STORAGE_KEY){localLoad();render();}});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
boot();
})();
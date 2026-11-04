(function client(){
"use strict";
const DATA=window.CALMA_DATA;
const nav=document.getElementById("nav");
const main=document.getElementById("page-content");
const pageTitle=document.getElementById("page-title");
const saveStatus=document.getElementById("save-status");
const modal=document.getElementById("modal");
let secret=localStorage.getItem("calma_key")||"";
let username=localStorage.getItem("calma_username")||"";
let records={};
let view="inicio",day=1,stage=0,tool="networking",assessment="start";
const timers={};
const pending=new Set();
function escapeHTML(s){return String(s===undefined||s===null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function value(k){if(!records[k])records[k]={answers:{},checks:{},scores:{},done:false};return records[k];}
function localSave(){try{localStorage.setItem("calma_backup_"+secret,JSON.stringify(records));}catch(e){}}
function localLoad(){try{records=JSON.parse(localStorage.getItem("calma_backup_"+secret)||"{}");}catch(e){records={};}}
function request(path,opts={}){const h=Object.assign({"Authorization":"Bearer "+secret},opts.headers||{});return fetch(path,Object.assign({},opts,{headers:h,cache:"no-store"})).then(async r=>{let j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||"Error de conexión");return j;});}
async function flush(k){if(!secret)return;try{await request("/api/entries/"+encodeURIComponent(k),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(value(k))});pending.delete(k);saveStatus.textContent=pending.size?"Guardando cambios…":"✓ Progreso guardado";}catch(e){saveStatus.textContent="Sin sincronizar · copia local disponible";}}
function changed(k){pending.add(k);localSave();saveStatus.textContent="Guardando…";clearTimeout(timers[k]);timers[k]=setTimeout(()=>flush(k),600);}
function field(k,id,label,placeholder="Escribe aquí tu respuesta…"){return `<div class="formfield"><label for="${k}-${id}">${escapeHTML(label)}</label><textarea id="${k}-${id}" data-key="${k}" data-text="${id}" placeholder="${escapeHTML(placeholder)}">${escapeHTML(value(k).answers[id]||"")}</textarea></div>`;}
function checkbox(k,id,label){return `<label class="check"><input type="checkbox" data-key="${k}" data-check="${id}" ${value(k).checks[id]?"checked":""}><span>${escapeHTML(label)}</span></label>`;}
function complete(k,label){return `<label class="check"><input type="checkbox" data-key="${k}" data-done="1" ${value(k).done?"checked":""}><span><b>${escapeHTML(label)}</b></span></label>`;}
function scale(k,id,max){let html=`<div class="scale" role="group" aria-label="Escala de 0 a ${max}">`;for(let i=0;i<=max;i++){html+=`<label><input type="radio" name="${k}-${id}" data-key="${k}" data-score="${id}" value="${i}" ${value(k).scores[id]===i?"checked":""}><span>${i}</span></label>`;}return html+"</div>";}
function btn(text,attrs,kind=""){return `<button class="btn ${kind}" ${attrs}>${text}</button>`;}
function bar(v,max){return `<div class="progress" role="progressbar" aria-valuenow="${v}" aria-valuemax="${max}"><span style="width:${v/max*100}%"></span></div>`;}
function countDays(){return DATA.days.filter((_,i)=>value("day-"+(i+1)).done).length;}
function countStages(){return DATA.method.filter((_,i)=>value("stage-"+i).done).length;}
function home(){
 const completed=countDays(),stageCount=countStages();
 const next=Math.max(1,DATA.days.findIndex((_,i)=>!value("day-"+(i+1)).done)+1||30);
 return `<section class="hero"><span class="pill gold">TU VOZ IMPORTA</span><h2>No necesitas hablar más fuerte. Necesitas aprender a hacerte escuchar.</h2><p>Aprende, escribe tus respuestas y construye confianza con acciones pequeñas.</p>${btn("Continuar con mi entrenamiento","data-view='reto' data-day='"+next+"'","gold")}</section>
 <div class="cardgrid metrics"><div class="metric"><strong>${completed}/30</strong><small>Retos completados</small>${bar(completed,30)}</div><div class="metric"><strong>${stageCount}/5</strong><small>Etapas del método</small>${bar(stageCount,5)}</div><div class="metric"><strong>${value("assessment-start").done?"✓":"—"}</strong><small>Evaluación inicial</small><p>${btn("Responder","data-view='evaluacion' data-assessment='start'","secondary sm")}</p></div></div>
 <div class="two"><section class="panel"><span class="eyebrow">SIGUIENTE RETO</span><h2 class="section-title">Día ${next}: ${escapeHTML(DATA.days[next-1][0])}</h2><p>${escapeHTML(DATA.days[next-1][1])}</p>${btn("Ir al reto","data-view='reto' data-day='"+next+"'")}</section><section class="panel"><span class="eyebrow">TU RECORRIDO</span><h2 class="section-title">C.A.L.M.A.</h2><p>Clarifica → Acepta → Libérate → Muévete → Actúa.</p>${btn("Abrir método","data-view='metodo'","secondary")}</section></div>
 <div class="notice" style="margin-top:20px"><b>Piloto interactivo:</b> el acceso por compra de Hotmart aún no está vinculado. Conserva tu clave de recuperación en un sitio seguro.</div>`;
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
 <div class="row">${btn("Volver a mi espacio","data-view='mi-espacio'","secondary")}${btn("Reto de 30 días","data-view='reto'")}</div></section>`;
}
function space(){
 return `<div class="two"><section class="panel"><h2 class="section-title">Mis evaluaciones</h2><p>Compara tus respuestas antes y después de practicar.</p>${btn("Evaluación inicial","data-view='evaluacion' data-assessment='start'","secondary")} ${btn("Evaluación final","data-view='evaluacion' data-assessment='end'","secondary")}</section><section class="panel"><h2 class="section-title">${username?"Mi cuenta":"Mi clave privada"}</h2><p>${username?"Usuario: <b>"+escapeHTML(username)+"</b>. Usa tu contraseña para ingresar desde otros dispositivos.":"Tu cuenta anterior usa una clave de recuperación."}</p>${username?btn("Cerrar sesión","data-action='logout'","secondary"):btn("Ver clave de recuperación","data-action='recovery'")}</section></div>
 <section class="panel" style="margin-top:18px"><h2 class="section-title">Datos y privacidad</h2><p>Guardamos tus registros en Cloudflare y una copia local de respaldo. No enviamos tus respuestas a píxeles publicitarios.</p><div class="row">${btn("Exportar registros","data-action='export'","secondary")} ${btn("Importar clave","data-action='import'","secondary")}</div><p class="muted">Puedes borrar todos tus registros del servidor y de este dispositivo.</p>${btn("Eliminar mi espacio y mis datos","data-action='delete'","secondary")}</section>`;
}
function render(){
 const titles={"inicio":"Tu progreso empieza aquí","metodo":"Método C.A.L.M.A.","reto":"Tu reto de 30 días","herramientas":"Herramientas prácticas","evaluacion":"Mis evaluaciones","mi-espacio":"Mi espacio"};
 pageTitle.textContent=titles[view];
 nav.querySelectorAll("[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===view));
 main.innerHTML=view==="inicio"?home():view==="metodo"?method():view==="reto"?challenge():view==="herramientas"?tools():view==="evaluacion"?evaluation():space();
}
function show(html){modal.classList.remove("hidden");document.getElementById("modal-body").innerHTML=html;}
function close(){modal.classList.add("hidden");}
function welcome(){show('<p>Elige tu nombre de usuario y tu propia contraseña para guardar tus respuestas y regresar desde cualquier dispositivo.</p><div class="notice"><b>Versión piloto:</b> aún no se validan compras de Hotmart. No compartas tu contraseña.</div><div class="stack" style="margin-top:20px">'+btn("Crear cuenta","data-action='show-register'")+btn("Ya tengo cuenta","data-action='show-login'","secondary")+btn("Tengo una clave antigua","data-action='import'","secondary sm")+'</div>');}
function authDialog(mode){const reg=mode==="register";show('<p>'+(reg?'Crea un usuario y elige una contraseña segura de al menos 12 caracteres.':'Entra con tu usuario y contraseña.')+'</p><div class="formfield"><label for="auth-user">Nombre de usuario</label><input id="auth-user" type="text" autocapitalize="none" spellcheck="false" autocomplete="username" maxlength="32" placeholder="Ej. introvertido23"></div><div class="formfield"><label for="auth-pass">Contraseña</label><input id="auth-pass" type="password" autocomplete="'+(reg?'new-password':'current-password')+'" maxlength="128" placeholder="Mínimo 12 caracteres"></div>'+(reg?'<div class="formfield"><label for="auth-confirm">Confirma la contraseña</label><input id="auth-confirm" type="password" autocomplete="new-password" maxlength="128"></div>':'')+'<p class="muted">No guardamos tu contraseña en texto. Por ahora, si la olvidas, no hay recuperación por correo.</p><p id="dialog-error" role="alert" class="toast"></p><div class="row">'+btn(reg?'Crear cuenta':'Iniciar sesión',"data-action='"+(reg?'register':'login')+"'")+btn("Volver","data-action='welcome'","secondary")+'</div>');}
function recover(){if(username){show('<p>Tu usuario es <b>'+escapeHTML(username)+'</b>. Inicia sesión desde cualquier dispositivo con tu contraseña.</p><p class="notice">La recuperación por correo aún no está disponible.</p>'+btn("Cerrar","data-action='close'"));return;}show('<p>Clave de recuperación de la versión anterior. Cualquiera que tenga esta clave puede acceder a tus ejercicios.</p><div class="code">'+escapeHTML(secret)+'</div>'+btn("Copiar clave","data-action='copy'")+btn("Cerrar","data-action='close'","secondary"));}
function importDialog(){show('<p>Solo para cuentas de la versión anterior: pega tu clave de recuperación.</p><div class="formfield"><label for="secret-input">Clave anterior</label><input id="secret-input" type="password" autocomplete="off"></div><p id="dialog-error"></p>'+btn("Recuperar","data-action='connect'")+btn("Volver","data-action='welcome'","secondary"));}
function normalizeUsername(u){return u.trim().toLowerCase();}
function validateUsername(u){if(!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(u))throw Error("Usuario: 3–32 caracteres, letras sin tildes, números, guion, punto o guion bajo.");}
function validatePassword(p){if(p.length<12||p.length>128)throw Error("La contraseña debe tener entre 12 y 128 caracteres.");}
function b64(bytes){let s="";for(const v of bytes)s+=String.fromCharCode(v);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
async function userHash(u){return b64(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode("calma-user-v2:"+u))));}
async function deriveKey(u,password){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:new TextEncoder().encode("introvertido-seguro-v2:"+u),iterations:310000,hash:"SHA-256"},key,256);return b64(new Uint8Array(bits));}
async function personalLogin(register){
 const u=normalizeUsername(document.getElementById("auth-user").value),p=document.getElementById("auth-pass").value;
 validateUsername(u);validatePassword(p);
 if(register&&p!==document.getElementById("auth-confirm").value)throw Error("Las contraseñas no coinciden.");
 const previous=secret;secret=await deriveKey(u,p);
 try{
 const handle_hash=await userHash(u);
 await request(register?"/api/account/register":"/api/account/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({handle_hash})});
 const data=await request("/api/entries");
 username=u;records=Object.assign({},data.entries||{});
 localStorage.setItem("calma_key",secret);localStorage.setItem("calma_username",username);
 localSave();close();render();saveStatus.textContent="✓ Sincronizado";
 }catch(err){secret=previous;throw err;}
}
async function connect(k,isNew){
 secret=k.trim();if(!/^[A-Za-z0-9_-]{40,120}$/.test(secret))throw Error("Clave incorrecta");
 if(isNew)await request("/api/register",{method:"POST"});
 const response=await request("/api/entries");
 localStorage.setItem("calma_key",secret);localStorage.removeItem("calma_username");username="";records={};localLoad();Object.assign(records,response.entries||{});localSave();saveStatus.textContent="✓ Sincronizado";close();render();
}
async function boot(){
 if(!secret){saveStatus.textContent="Sin espacio";welcome();return;}
 localLoad();render();saveStatus.textContent="Sincronizando…";
 try{const result=await request("/api/entries");Object.assign(records,result.entries||{});localSave();saveStatus.textContent="✓ Sincronizado";}
 catch(e){saveStatus.textContent="Copia local · sin conexión";}render();
}
document.addEventListener("click",async ev=>{
 const b=ev.target.closest("button");if(!b)return;
 if(b.id==="menu"){document.querySelector(".side").classList.toggle("expanded");return;}
 if(b.dataset.page||b.dataset.view){view=b.dataset.page||b.dataset.view;if(b.dataset.day)day=Number(b.dataset.day);if(b.dataset.assessment)assessment=b.dataset.assessment;document.querySelector(".side").classList.remove("expanded");render();scrollTo(0,0);return;}
 if(b.dataset.stage!==undefined){view="metodo";stage=Number(b.dataset.stage);render();scrollTo(0,0);return;}
 if(b.dataset.day){view="reto";day=Number(b.dataset.day);render();scrollTo(0,0);return;}
 if(b.dataset.tool){tool=b.dataset.tool;render();return;}
 const a=b.dataset.action;if(!a)return;
 if(a==="close")close();
 if(a==="welcome")welcome();
 if(a==="show-register")authDialog("register");
 if(a==="show-login")authDialog("login");
 if(a==="register"||a==="login"){b.disabled=true;b.textContent="Verificando…";try{await personalLogin(a==="register");}catch(err){b.disabled=false;b.textContent=a==="register"?"Crear cuenta":"Iniciar sesión";document.getElementById("dialog-error").textContent=err.message;}}
 if(a==="logout"){if(pending.size){alert("Hay cambios pendientes de guardar. Reintenta después de sincronizar.");return;}localStorage.removeItem("calma_key");localStorage.removeItem("calma_username");localStorage.removeItem("calma_backup_"+secret);secret="";username="";records={};welcome();saveStatus.textContent="Sin sesión";}
 if(a==="recovery")recover();
 if(a==="import")importDialog();
 if(a==="copy"){try{await navigator.clipboard.writeText(secret);b.textContent="✓ Clave copiada";}catch(e){alert("Copia manualmente la clave.");}}
 if(a==="create")authDialog("register");
 if(a==="connect"){b.disabled=true;try{await connect(document.getElementById("secret-input").value,false);}catch(e){b.disabled=false;document.getElementById("dialog-error").textContent=e.message;}}
 if(a==="export"){const blob=new Blob([JSON.stringify({app:"introvertido-seguro",exported:new Date().toISOString(),records},null,2)],{type:"application/json"});const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download="mi-progreso-calma.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);}
 if(a==="delete"){if(!confirm("¿Eliminar definitivamente tus respuestas?"))return;if(!confirm("No se puede deshacer. ¿Confirmas?"))return;try{await request("/api/profile",{method:"DELETE"});localStorage.removeItem("calma_backup_"+secret);localStorage.removeItem("calma_key");localStorage.removeItem("calma_username");records={};secret="";username="";welcome();saveStatus.textContent="Sin espacio";}catch(e){alert(e.message);}}
});
document.addEventListener("input",ev=>{const t=ev.target;if(t.dataset.key&&t.dataset.text!==undefined){value(t.dataset.key).answers[t.dataset.text]=t.value;changed(t.dataset.key);}});
document.addEventListener("change",ev=>{const t=ev.target,k=t.dataset.key;if(!k)return;if(t.dataset.check!==undefined)value(k).checks[t.dataset.check]=t.checked;else if(t.dataset.score!==undefined)value(k).scores[t.dataset.score]=Number(t.value);else if(t.dataset.done!==undefined)value(k).done=t.checked;else return;changed(k);if(t.dataset.done!==undefined)render();});
window.addEventListener("online",()=>{for(const k of pending)flush(k);});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
boot();
})();
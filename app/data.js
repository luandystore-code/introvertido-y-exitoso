window.CALMA_DATA = {
  questions:[
    "Me quedo callado aunque tenga una idea útil.",
    "Ensayo demasiado lo que voy a decir y pierdo el momento.",
    "Evito iniciar conversaciones que podrían ayudarme.",
    "Me cuesta discrepar o poner límites.",
    "Las reuniones o grupos me drenan antes de que pueda participar.",
    "Me preocupa demasiado parecer torpe o ser juzgado.",
    "Dejo pasar oportunidades por no saber cómo presentarme.",
    "Después de una interacción, repaso mentalmente lo que hice mal."
  ],
  // Agrupaciones orientativas de preguntas negativas; menor frecuencia reportada = menos dificultad.
  // Cada área contiene entre una y tres preguntas; NO es una prueba clínica ni una escala validada.
  focusAreas:[
    {id:"claridad",name:"Expresar tus ideas",questions:[0,6],stage:0,day:8,summary:"Te cuesta compartir ideas o presentarte cuando surge una oportunidad.",action:"Prepara una idea, una razón y un siguiente paso con la fórmula 1-1-1.",tip:"Ensaya una idea en voz alta y exprésala en la próxima conversación."},
    {id:"energia",name:"Cuidar tu energía social",questions:[4],stage:1,day:5,summary:"La energía que requieren los grupos puede dificultarte participar.",action:"Planea una meta pequeña y una pausa antes de la próxima reunión.",tip:"Entra con una meta sencilla: participar una vez, sin exigirte más."},
    {id:"juicio",name:"Miedo al juicio y sobreanálisis",questions:[1,5,7],stage:2,day:22,summary:"Pensar demasiado o temer la opinión de otros puede frenar tus acciones.",action:"Haz una contribución breve sin esperar la frase perfecta.",tip:"Pregúntate qué puedes aportar, en lugar de intentar adivinar qué pensarán."},
    {id:"limites",name:"Poner límites con respeto",questions:[3],stage:3,day:11,summary:"Expresar un desacuerdo o decir no puede resultarte difícil.",action:"Practica un no pequeño con una frase respetuosa.",tip:"Escribe tu límite en una oración antes de decirlo."},
    {id:"conexion",name:"Iniciar conversaciones",questions:[2],stage:4,day:3,summary:"Dar el primer paso para conectar con alguien puede costarte.",action:"Inicia una conversación de dos minutos usando una pregunta abierta.",tip:"Comienza con una pregunta breve relacionada con el momento."}
  ],
  method:[
    {letter:"C",name:"Clarifica",title:"Habla con intención",desc:"Organiza tu mensaje con una idea, una razón y un siguiente paso (1-1-1).",example:"Mi idea es ____. Ayudaría porque ____. Propongo empezar con ____.",questions:["Una idea que quiero aportar","Mi razón principal","El siguiente paso que propondré"],checks:["Preparé mi mensaje en una frase","Practiqué la fórmula 1-1-1","Expresé o ensayé mi idea"]},
    {letter:"A",name:"Acepta",title:"Diseña tu energía social",desc:"Preparar, pausar y elegir interacciones sostenibles también es una habilidad.",example:"Preparo una meta pequeña antes de cada reunión y permito descansos si los necesito.",questions:["Una situación que consume mi energía","Mi objetivo mínimo","Cómo cuidaré mi energía"],checks:["Definí una meta alcanzable","Planifiqué una pausa","Elegí una conversación significativa"]},
    {letter:"L",name:"Libérate",title:"Actúa a pesar del miedo al juicio",desc:"No necesitas esperar a que desaparezcan los nervios para practicar.",example:"En vez de «¿cómo me están juzgando?», pregúntate «¿qué puedo aportar?».",questions:["Una situación que evito","Qué temo que ocurra","Un primer paso manejable"],checks:["Identifiqué mi miedo concreto","Elegí una acción pequeña","La practiqué sin exigir perfección"]},
    {letter:"M",name:"Muévete",title:"Exposición gradual",desc:"Practica una escalera de situaciones; si un paso te supera, hazlo más sencillo.",example:"Si ocurre ____ entonces haré ____ y anotaré qué pasó.",questions:["Mi práctica fácil","El siguiente paso de dificultad","Mi plan si-entonces"],checks:["Elegí un reto manejable","Lo intenté","Registré lo que ocurrió"]},
    {letter:"A",name:"Actúa",title:"Conecta en situaciones reales",desc:"Practica P-E-C: pregunta, escucha y conecta en reuniones y conversaciones.",example:"Pregunta abierta → escucha un detalle → conecta con una segunda pregunta.",questions:["Una conversación donde aplicaré P-E-C","Mi frase de inicio","Lo que aprendí"],checks:["Hice una pregunta abierta","Escuché sin interrumpir","Conecté con otra pregunta"]}
  ],
  days:[
    ["Haz contacto visual y saluda primero","Solo sonríe y di hola."],
    ["Haz una pregunta abierta a alguien conocido","Pregunta «¿cómo te fue con…?»"],
    ["Inicia una conversación de 2 minutos","Haz un comentario y una pregunta."],
    ["Expresa una preferencia pequeña","Elige lugar, comida o plan."],
    ["Usa una pausa antes de responder","Respira una vez antes de hablar."],
    ["Da una opinión breve en un grupo","Haz una pregunta si opinar te supera."],
    ["Revisión semanal","Relee tus notas, no el libro entero."],
    ["Presenta una idea con 1-1-1","Practícala por escrito primero."],
    ["Pide algo que normalmente no pedirías","Haz una petición pequeña."],
    ["Inicia conversación con alguien nuevo","Pregunta por el contexto."],
    ["Di no a algo pequeño","Pide tiempo antes de responder."],
    ["Haz seguimiento a un contacto","Envía un mensaje corto."],
    ["Comparte una historia de 60 segundos","Cuenta una experiencia breve."],
    ["Revisión semanal","Elige tus 3 avances más claros."],
    ["Habla en los primeros 5 minutos de una reunión","Haz una pregunta de aclaración."],
    ["Discrepa con respeto","Di «veo un riesgo distinto»."],
    ["Haz una conversación P-E-C","Usa una sola pregunta y escucha."],
    ["Pon un límite con L-C-A","Practícalo por escrito."],
    ["Pide feedback específico","Pregunta «¿qué podría hacer más claro?»"],
    ["Habla con alguien que admiras o respetas","Escribe primero un mensaje."],
    ["Revisión semanal","Compara con tu día 1."],
    ["Ofrece una idea sin esperar perfección","Di «tengo una opción para considerar»."],
    ["Lidera una pequeña decisión","Resume opciones y propone una."],
    ["Haz networking con misión mínima","Habla con una persona."],
    ["Cierra una conversación de forma clara","Usa un cierre preparado."],
    ["Pide una oportunidad","Pide participar, colaborar o recibir información."],
    ["Repite la situación que más evitaste","Baja un nivel si es necesario."],
    ["Revisión semanal","Elige una conducta para mantener 90 días."],
    ["Haz una acción que tu yo del día 1 habría pospuesto","Elige una versión 10% más fácil."],
    ["Repite el test inicial y escribe tu siguiente meta","Compara solo conductas, no personalidad."]
  ],
  networking:[
    "Sé por qué voy al encuentro y qué quiero aprender.",
    "Definí mi misión mínima: hablar con 1 a 3 personas.",
    "Preparé mi presentación corta en mi estilo.",
    "Tengo dos preguntas abiertas listas.",
    "Investigué el tema del encuentro.",
    "Planifiqué una pausa o lugar tranquilo.",
    "Preparé una salida respetuosa.",
    "Envié un seguimiento personalizado en 24–48 horas."
  ],
  scripts:[
    ["Reuniones","Quiero sumar un punto breve.","Antes de decidir, ¿qué criterio vamos a usar?","Mi idea es ____. Ayudaría porque ____. Propongo ____."],
    ["Interrupciones","Déjame cerrar esta idea y te escucho.","Un segundo, quiero terminar el punto.","Voy a completar esto en una frase."],
    ["Límites","No puedo asumirlo esta semana.","Entiendo, pero mi respuesta sigue siendo no.","Eso no me funciona. Puedo ofrecerte esta alternativa."],
    ["Networking","¿Qué te trajo a este evento?","¿En qué estás trabajando ahora?","Me gustó hablar contigo. ¿Conectamos?"]
  ]
};

(function(){
"use strict";
const D=window.CALMA_DATA;
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function button(label,props,kind="secondary"){return `<button class="btn ${kind}" ${props}>${esc(label)}</button>`;}
function report(records,phase){
 const r=records["assessment-"+phase]||{},scores=D.questions.map((_,i)=>r.scores?.["q"+i]);
 const answered=scores.filter(v=>Number.isInteger(v)&&v>=0&&v<=4).length;
 const complete=answered===8&&r.done===true;
 return {scores,answered,complete,total:complete?scores.reduce((a,b)=>a+b,0):null};
}
function average(rep,area){return rep.complete?area.questions.reduce((t,i)=>t+rep.scores[i],0)/area.questions.length:null;}
function fmt(v){return v.toLocaleString("es-PE",{minimumFractionDigits:1,maximumFractionDigits:1});}
function bar(score,cls,label){return `<div class="insight-track" role="img" aria-label="${esc(label)}: ${fmt(score)} de 4"><span class="${cls}" style="width:${Math.max(0,Math.min(100,score/4*100))}%"></span></div>`;}
function feeling(records){
 let n=0,b=0,a=0,lower=0;
 for(let i=1;i<=30;i++){const s=records["day-"+i]?.scores||{},x=s.before,y=s.after;
 if(Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&x<=10&&y>=0&&y<=10){n++;b+=x;a+=y;if(y<x)lower++;}}
 return {n,b:n?b/n:0,a:n?a/n:0,lower};
}
function render(records){
 const first=report(records,"start"),last=report(records,"end"),both=first.complete&&last.complete,now=last.complete?last:first.complete?first:null;
 let h=`<section class="advance-hero insight-hero"><div><span class="eyebrow">ANÁLISIS PERSONAL</span><h2>Descubre qué mejorar y reconoce tus avances</h2>
 <p>Identifica hábitos concretos para practicar. No necesitas cambiar tu personalidad para ganar seguridad.</p></div>
 <div class="advance-percent"><strong>${Number(first.complete)+Number(last.complete)}/2</strong><small>evaluaciones</small></div></section>
 <div class="two insight-assessments">
 <section class="panel"><span class="eyebrow">PUNTO DE PARTIDA</span><h2 class="section-title">Evaluación inicial</h2>
 <p>${first.complete?"✓ Completada":first.answered+" de 8 preguntas respondidas"}</p>
 ${button(first.complete?"Revisar respuestas":"Completar evaluación","data-view='evaluacion' data-assessment='start'")}</section>
 <section class="panel"><span class="eyebrow">MI SITUACIÓN DESPUÉS</span><h2 class="section-title">Evaluación final</h2>
 <p>${last.complete?"✓ Completada":last.answered+" de 8 preguntas respondidas"}</p>
 ${button(last.complete?"Revisar respuestas":"Completar evaluación","data-view='evaluacion' data-assessment='end'")}</section></div>`;
 if(!now)return h+`<section class="panel insight-section"><h2 class="section-title">Primero descubre tu punto de partida</h2>
 <p>Responde las ocho preguntas y recibirás áreas de práctica ordenadas por las dificultades que reportes con más frecuencia.</p>
 ${button("Empezar la evaluación inicial","data-view='evaluacion' data-assessment='start'","")}</section>`;
 const area=D.focusAreas.map(a=>({...a,current:average(now,a),before:average(first,a),after:average(last,a)}));
 const ranked=area.filter(a=>a.current>0).sort((a,b)=>b.current-a.current||a.stage-b.stage);
 const suggestions=ranked.length?ranked.slice(0,3):area.slice(0,2);
 const selected=area.find(a=>a.id===records["focus-plan"]?.answers?.area)||suggestions[0];
 if(both){
  const diff=first.total-last.total,text=diff>0?diff+" puntos menos":diff<0?(-diff)+" puntos más":"Sin cambio en el total";
  h+=`<section class="panel insight-section"><span class="eyebrow">COMPARA TU EVOLUCIÓN</span><h2 class="section-title">Dificultades reportadas: antes y ahora</h2>
  <div class="insight-totals"><div><strong>${first.total}<small>/32</small></strong><span>Inicial</span></div><span aria-hidden="true">→</span>
  <div><strong>${last.total}<small>/32</small></strong><span>Final</span></div><p>${text}</p></div>
  <p class="muted">Un valor menor indica que reportas esas dificultades con menos frecuencia. Es una reflexión orientativa, no una puntuación clínica ni una garantía de cambio.</p></section>`;
 }else{
  h+=`<section class="panel insight-section"><span class="eyebrow">TU PUNTO DE PARTIDA</span><h2 class="section-title">${now.total} puntos de 32 posibles</h2>
  <p>Identifica qué trabajar desde hoy. Cuando hayas practicado, completa la evaluación final para comparar las mismas preguntas.</p>
  ${button("Hacer evaluación final","data-view='evaluacion' data-assessment='end'")}</section>`;
 }
 h+=`<section class="panel insight-section"><span class="eyebrow">TUS ÁREAS</span><h2 class="section-title">${both?"Qué dificultades han cambiado":"En qué puedes enfocarte"}</h2>
 <p class="muted">Promedio de frecuencia de 0 = nunca a 4 = casi siempre. Una barra más larga indica una dificultad reportada con más frecuencia.</p>
 <div class="insight-areas">${area.map(a=>{
  const diff=both?a.before-a.after:0;
  const label=both?(diff>.15?"↓ "+fmt(diff)+" menos":diff<-.15?"↑ "+fmt(-diff)+" más":"Sin cambio"):
   a.current>=2.5?"Práctica prioritaria":a.current>0?"Para practicar":"Poco frecuente";
  return `<article class="insight-area"><div class="insight-area-head"><strong>${esc(a.name)}</strong><span>${label}</span></div>
  <p>${esc(a.summary)}</p>
  ${both?`<div class="insight-line"><span>Antes</span>${bar(a.before,"before","Antes: "+a.name)}<b>${fmt(a.before)}</b></div>`:""}
  <div class="insight-line"><span>${both?"Ahora":"Inicial"}</span>${bar(a.current,"after","Actual: "+a.name)}<b>${fmt(a.current)}</b></div></article>`;
 }).join("")}</div></section>`;
 if(both){
  const improved=area.filter(a=>a.before-a.after>.15).sort((a,b)=>(b.before-b.after)-(a.before-a.after));
  const worse=area.filter(a=>a.after-a.before>.15).sort((a,b)=>(b.after-b.before)-(a.after-a.before));
  h+=`<div class="two insight-assessments"><section class="panel"><span class="eyebrow">AVANCES</span><h2 class="section-title">Lo que mejoró según tus respuestas</h2>
  ${improved.length?improved.map(a=>`<p class="insight-highlight">✓ <b>${esc(a.name)}</b><small>${fmt(a.before-a.after)} puntos menos</small></p>`).join(""):"<p>No se registraron reducciones. Revisa también los retos que has intentado: practicar puede ser valioso aunque las puntuaciones no cambien.</p>"}</section>
  <section class="panel"><span class="eyebrow">SEGUIR TRABAJANDO</span><h2 class="section-title">Dificultades que aumentaron</h2>
  ${worse.length?worse.map(a=>`<p class="insight-highlight">↗ <b>${esc(a.name)}</b><small>${fmt(a.after-a.before)} puntos más</small></p>`).join(""):"<p>No reportaste aumentos de dificultad entre ambas evaluaciones.</p>"}</section></div>`;
 }
 h+=`<section class="panel insight-section"><span class="eyebrow">TUS PRÓXIMOS PASOS</span><h2 class="section-title">Mis prioridades para practicar</h2>
 <p class="muted">Basadas en ${last.complete?"tu evaluación final":"tu evaluación inicial"}. No son etiquetas personales: solo oportunidades para ensayar nuevas acciones.</p>
 ${!ranked.length?'<div class="notice">Dices experimentar estas dificultades poco frecuentemente. Puedes elegir una habilidad para seguir fortaleciéndola.</div>':""}
 <div class="insight-priorities">${suggestions.map((a,i)=>`<article class="insight-priority ${selected.id===a.id?"selected":""}">
 <span class="pill">${ranked.length?"Prioridad "+(i+1):"Habilidad para fortalecer"}</span>
 <h3>${esc(a.name)}</h3><p>${esc(a.action)}</p><small>${fmt(a.current)}/4 de frecuencia media</small>
 <div class="row">${button("Practicar etapa "+(a.stage+1),"data-stage='"+a.stage+"'","secondary sm")}
 ${button("Hacer día "+a.day,"data-day='"+a.day+"'","secondary sm")}
 ${button(selected.id===a.id?"✓ Elegido":"Elegir enfoque","data-focus-area='"+a.id+"'","sm")}</div></article>`).join("")}</div></section>
 <section class="panel insight-section insight-plan"><span class="eyebrow">MI PLAN PERSONAL</span><h2 class="section-title">Esta semana practicaré: ${esc(selected.name)}</h2>
 <p>${esc(selected.tip)}</p>
 <div class="formfield"><label for="focus-plan-goal">Mi objetivo concreto de esta semana</label>
 <textarea id="focus-plan-goal" data-key="focus-plan" data-text="goal" placeholder="Ej.: aportaré una idea breve en la próxima reunión.">${esc(records["focus-plan"]?.answers?.goal||"")}</textarea></div>
 <div class="checks"><label class="check"><input type="checkbox" data-key="focus-plan" data-check="p-${selected.id}" ${records["focus-plan"]?.checks?.["p-"+selected.id]?"checked":""}><span>Preparé una frase o una acción pequeña</span></label>
 <label class="check"><input type="checkbox" data-key="focus-plan" data-check="r-${selected.id}" ${records["focus-plan"]?.checks?.["r-"+selected.id]?"checked":""}><span>Lo intenté en una situación real</span></label></div>
 <div class="row">${button("Practicar la etapa","data-stage='"+selected.stage+"'","")}
 ${button("Hacer el reto del día "+selected.day,"data-day='"+selected.day+"'")}</div>
 <p class="muted">Tu plan se guarda solamente en este navegador.</p></section>`;
 if(both)h+=`<details class="panel insight-section insight-detail"><summary><b>Comparar las 8 preguntas una por una</b><span>Ver respuestas</span></summary>
 <div class="insight-questions">${D.questions.map((q,i)=>`<div><strong>${i+1}. ${esc(q)}</strong><span>Inicial: ${first.scores[i]}/4 · Final: ${last.scores[i]}/4</span>
 <small>${first.scores[i]>last.scores[i]?"Dificultad menos frecuente":first.scores[i]<last.scores[i]?"Dificultad más frecuente":"Sin cambio"}</small></div>`).join("")}</div></details>`;
 const feel=feeling(records);
 h+=`<section class="panel insight-section"><span class="eyebrow">TUS PRÁCTICAS REALES</span><h2 class="section-title">Antes y después de cada reto</h2>
 ${feel.n?`<div class="insight-totals"><div><strong>${fmt(feel.b)}<small>/10</small></strong><span>Incomodidad antes</span></div><span>→</span>
 <div><strong>${fmt(feel.a)}<small>/10</small></strong><span>Incomodidad después</span></div></div>
 <p>Hay ${feel.n} retos con ambas escalas; en ${feel.lower} la incomodidad fue menor después de practicar.</p>`:
 "<p>Aún no registraste ambas escalas en un reto. Responde «incomodidad antes» y «después» para comparar cómo te sentiste.</p>"}
 ${button("Volver a mis retos","data-view='reto'")}
 <p class="muted">Estas sensaciones son subjetivas y no constituyen un diagnóstico.</p></section>
 <p class="muted insight-disclaimer">Las ocho preguntas y sus agrupaciones son herramientas educativas de reflexión, no una evaluación psicológica validada. El cambio observado no prueba por sí solo el efecto de este curso.</p>`;
 return h;
}
window.CALMA_ANALYTICS={report,render};
})();

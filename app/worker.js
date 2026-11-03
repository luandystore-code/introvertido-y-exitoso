(function worker(){
  const BASE="https://raw.githubusercontent.com/luandystore-code/introvertido-y-exitoso/main/app/";
  const ASSETS={"/":"index.html","/index.html":"index.html","/app.js":"app.js","/data.js":"data.js","/style.css":"style.css","/sw.js":"sw.js","/manifest.webmanifest":"manifest.webmanifest","/icon.svg":"icon.svg"};
  const TYPES={html:"text/html; charset=utf-8",js:"text/javascript; charset=utf-8",css:"text/css; charset=utf-8",webmanifest:"application/manifest+json",svg:"image/svg+xml"};
  const allowed=/^(day-(?:[1-9]|[12][0-9]|30)|stage-[0-4]|assessment-(?:start|end)|tool-(?:network|meeting|limits|scripts))$/;
  function json(obj,status=200){return new Response(JSON.stringify(obj),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});}
  function error(message,status=400){return json({error:message},status);}
  async function hashToken(token){const buffer=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));return Array.from(new Uint8Array(buffer)).map(x=>x.toString(16).padStart(2,"0")).join("");}
  function authorizedToken(request){const a=request.headers.get("Authorization")||"";const m=/^Bearer ([A-Za-z0-9_-]{40,120})$/.exec(a);return m?m[1]:null;}
  async function route(request,env){
    const url=new URL(request.url),path=url.pathname;
    if(path==="/health")return json({ok:true,app:"introvertido-y-seguro",mode:"pilot",hotmart_connected:false});
    if(path.startsWith("/api/")){
      if(!env.DB)return error("Base de datos no configurada",503);
      const token=authorizedToken(request);if(!token)return error("Necesitas tu clave privada",401);
      const user=await hashToken(token);
      if(path==="/api/register"&&request.method==="POST"){
        await env.DB.prepare("INSERT OR IGNORE INTO profiles(token_hash) VALUES(?)").bind(user).run();
        return json({ok:true});
      }
      const exists=await env.DB.prepare("SELECT token_hash FROM profiles WHERE token_hash=?").bind(user).first();
      if(!exists)return error("No existe un espacio asociado a esa clave",401);
      if(path==="/api/entries"&&request.method==="GET"){
        const rows=await env.DB.prepare("SELECT entry_key,payload FROM entries WHERE token_hash=? LIMIT 100").bind(user).all();
        const entries={};for(const row of (rows.results||[])){try{entries[row.entry_key]=JSON.parse(row.payload)}catch(e){}}
        return json({entries});
      }
      if(path.startsWith("/api/entries/")&&request.method==="PUT"){
        const entryKey=path.slice("/api/entries/".length);
        if(!allowed.test(entryKey))return error("Nombre de actividad no válido",400);
        const bodyText=await request.text();if(bodyText.length>12000)return error("Respuesta demasiado larga",413);
        let obj;try{obj=JSON.parse(bodyText)}catch(e){return error("JSON incorrecto",400);}
        if(!obj||typeof obj!=="object"||Array.isArray(obj))return error("Registro incorrecto");
        const clean={answers:{},checks:{},scores:{},done:obj.done===true};
        if(obj.answers&&typeof obj.answers==="object")for(const [k,v] of Object.entries(obj.answers)){if(/^[a-z0-9_-]{1,30}$/i.test(k)&&typeof v==="string")clean.answers[k]=v.slice(0,2000);}
        if(obj.checks&&typeof obj.checks==="object")for(const [k,v] of Object.entries(obj.checks)){if(/^[a-z0-9_-]{1,30}$/i.test(k))clean.checks[k]=v===true;}
        if(obj.scores&&typeof obj.scores==="object")for(const [k,v] of Object.entries(obj.scores)){if(/^[a-z0-9_-]{1,30}$/i.test(k)&&Number.isInteger(v)&&v>=0&&v<=10)clean.scores[k]=v;}
        await env.DB.prepare("INSERT INTO entries(token_hash,entry_key,payload,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(token_hash,entry_key) DO UPDATE SET payload=excluded.payload,updated_at=CURRENT_TIMESTAMP").bind(user,entryKey,JSON.stringify(clean)).run();
        return json({ok:true});
      }
      if(path==="/api/profile"&&request.method==="DELETE"){
        await env.DB.batch([
          env.DB.prepare("DELETE FROM entries WHERE token_hash=?").bind(user),
          env.DB.prepare("DELETE FROM profiles WHERE token_hash=?").bind(user)
        ]);
        return json({ok:true,deleted:true});
      }
      return error("Ruta no disponible",404);
    }
    if(request.method!=="GET"&&request.method!=="HEAD")return error("Método no permitido",405);
    const file=ASSETS[path];if(!file)return new Response("No encontrado",{status:404});
    const upstream=await fetch(BASE+file,{cf:{cacheEverything:false}});
    if(!upstream.ok)return new Response("No se pudo cargar la aplicación",{status:502});
    const ext=file.split(".").pop();const h=new Headers();
    h.set("Content-Type",TYPES[ext]||"text/plain; charset=utf-8");
    h.set("X-Content-Type-Options","nosniff");h.set("Referrer-Policy","no-referrer");
    h.set("X-Frame-Options","DENY");h.set("X-Robots-Tag","noindex, nofollow");
    h.set("Cache-Control","no-store");
    h.set("Permissions-Policy","camera=(),microphone=(),geolocation=()");
    h.set("Content-Security-Policy","default-src 'self';script-src 'self';style-src 'self' 'unsafe-inline';img-src 'self' data:;connect-src 'self';font-src 'self';object-src 'none';base-uri 'none';form-action 'self';frame-ancestors 'none'");
    return new Response(request.method==="HEAD"?null:upstream.body,{status:200,headers:h});
  }
  addEventListener("fetch",event=>event.respondWith(route(event.request,globalThis).catch(err=>{console.error("App error",String(err));return error("Servicio temporalmente no disponible",500)})));
})();
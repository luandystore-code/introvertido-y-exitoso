export default (function worker(){
  const BASE="https://raw.githubusercontent.com/luandystore-code/introvertido-y-exitoso/main/app/";
  const ASSETS={"/":"index.html","/index.html":"index.html","/app.js":"app.js","/data.js":"data.js","/style.css":"style.css","/sw.js":"sw.js","/manifest.webmanifest":"manifest.webmanifest","/icon.svg":"icon.svg"};
  const TYPES={html:"text/html; charset=utf-8",js:"text/javascript; charset=utf-8",css:"text/css; charset=utf-8",webmanifest:"application/manifest+json",svg:"image/svg+xml"};
  const allowed=/^(day-(?:[1-9]|[12][0-9]|30)|stage-[0-4]|assessment-(?:start|end)|tool-(?:network|meeting|limits|scripts))$/;
  function json(obj,status=200){return new Response(JSON.stringify(obj),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});}
  function error(message,status=400){return json({error:message},status);}
  async function hashToken(token){const buffer=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));return Array.from(new Uint8Array(buffer)).map(x=>x.toString(16).padStart(2,"0")).join("");}
  function authorizedToken(request){const a=request.headers.get("Authorization")||"";const m=/^Bearer ([A-Za-z0-9_-]{40,120})$/.exec(a);return m?m[1]:null;}

  const HOTMART_PRODUCT_ID=8875939;
  function constantTimeEquals(a,b){
    if(typeof a!=="string"||typeof b!=="string")return false;
    const one=new TextEncoder().encode(a),two=new TextEncoder().encode(b);
    let diff=one.length^two.length;
    for(let i=0;i<Math.max(one.length,two.length);i++)diff|=(one[i]||0)^(two[i]||0);
    return diff===0;
  }
  async function hotmartWebhook(request,env){
    if(request.method==="GET"||request.method==="HEAD")return json({ok:true,service:"Hotmart Webhook",product_id:HOTMART_PRODUCT_ID,configured:Boolean(env.HOTMART_HOTTOK),processing_enabled:Boolean(env.HOTMART_HOTTOK)});
    if(request.method!=="POST")return error("Método no permitido",405);
    if(!env.DB||!env.HOTMART_HOTTOK)return error("Webhook pendiente de configurar de forma segura",503);
    const received=request.headers.get("X-HOTMART-HOTTOK")||"";
    if(!constantTimeEquals(received,env.HOTMART_HOTTOK))return error("No autorizado",401);
    const raw=await request.text();
    if(raw.length>250000)return error("Payload demasiado grande",413);
    let obj;try{obj=JSON.parse(raw);}catch(e){return error("JSON inválido");}
    if(!obj||obj.version!=="2.0.0"||!obj.data||Number(obj.data.product?.id)!==HOTMART_PRODUCT_ID)return error("Producto o versión no admitidos",422);
    const event=obj.event;
    const grant=event==="PURCHASE_APPROVED"||event==="PURCHASE_COMPLETE";
    const revoke=["PURCHASE_REFUNDED","PURCHASE_CHARGEBACK","PURCHASE_CANCELED","PURCHASE_EXPIRED"].includes(event);
    if(!grant&&!revoke)return json({ok:true,ignored:true});
    const transaction=obj.data.purchase?.transaction;
    const eventId=obj.id;
    const stamp=obj.creation_date;
    const email=obj.data.buyer?.email?.trim().toLowerCase();
    const buyerUcode=obj.data.buyer?.ucode||null;
    if(typeof transaction!=="string"||transaction.length<4||transaction.length>128||typeof eventId!=="string"||eventId.length<3||eventId.length>128||!Number.isSafeInteger(stamp)||stamp<1000000000000||typeof email!=="string"||email.length>320||!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))return error("Datos de transacción incompletos",422);
    const current=await env.DB.prepare("SELECT event_id FROM hotmart_access_events WHERE event_id=?").bind(eventId).first();
    if(current)return json({ok:true,duplicate:true});
    const active=grant?1:0;
    // A la misma hora, cualquier revocación gana. Evitar que eventos atrasados reactiven el acceso.
    const sql="INSERT INTO hotmart_access_purchases(transaction_id,product_id,buyer_email,buyer_ucode,access_enabled,status,last_event_ms,last_event_id) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(transaction_id) DO UPDATE SET buyer_email=excluded.buyer_email,buyer_ucode=COALESCE(excluded.buyer_ucode,hotmart_access_purchases.buyer_ucode),access_enabled=excluded.access_enabled,status=excluded.status,last_event_ms=excluded.last_event_ms,last_event_id=excluded.last_event_id,updated_at=CURRENT_TIMESTAMP WHERE excluded.last_event_ms>hotmart_access_purchases.last_event_ms OR (excluded.last_event_ms=hotmart_access_purchases.last_event_ms AND excluded.access_enabled<hotmart_access_purchases.access_enabled)";
    try{
      await env.DB.batch([
        env.DB.prepare("INSERT OR IGNORE INTO hotmart_access_events(event_id,transaction_id,event_name,creation_date_ms) VALUES(?,?,?,?)").bind(eventId,transaction,event,stamp),
        env.DB.prepare(sql).bind(transaction,HOTMART_PRODUCT_ID,email,buyerUcode,active,event,stamp,eventId)
      ]);
      return json({ok:true,accepted:true});
    }catch(e){
      console.error("Hotmart event storage failed",String(e));
      return error("No se pudo procesar el evento",503);
    }
  }

  async function route(request,env){
    const url=new URL(request.url),path=url.pathname;
    if(path==="/integrations/hotmart/webhook")return hotmartWebhook(request,env);
    if(path==="/health")return json({ok:true,app:"introvertido-y-seguro",mode:"pilot",hotmart_connected:false});
    if(path.startsWith("/api/")){
      if(!env.DB)return error("Base de datos no configurada",503);
      const token=authorizedToken(request);if(!token)return error("Necesitas tu clave privada",401);
      const user=await hashToken(token);
      if((path==="/api/account/register"||path==="/api/account/login")&&request.method==="POST"){
        let body;try{body=await request.json();}catch(e){return error("Solicitud inválida",400);}
        const handle=body&&body.handle_hash;
        if(typeof handle!=="string"||!/^[A-Za-z0-9_-]{43}$/.test(handle))return error("Nombre de usuario inválido",400);
        if(path==="/api/account/register"){
          const taken=await env.DB.prepare("SELECT handle_hash FROM user_handles WHERE handle_hash=?").bind(handle).first();
          if(taken)return error("Ese nombre de usuario ya está ocupado",409);
          try{
            await env.DB.batch([
              env.DB.prepare("INSERT INTO profiles(token_hash) VALUES(?)").bind(user),
              env.DB.prepare("INSERT INTO user_handles(handle_hash,token_hash) VALUES(?,?)").bind(handle,user)
            ]);
          }catch(e){return error("No se pudo crear la cuenta; intenta con otro usuario",409);}
          return json({ok:true});
        }
        const found=await env.DB.prepare("SELECT token_hash FROM user_handles WHERE handle_hash=? AND token_hash=?").bind(handle,user).first();
        if(!found)return error("Usuario o contraseña incorrectos",401);
        return json({ok:true});
      }
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
          env.DB.prepare("DELETE FROM user_handles WHERE token_hash=?").bind(user),
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
  return {fetch:(request,env)=>route(request,env).catch(err=>{console.error("App error",String(err));return error("Servicio temporalmente no disponible",500)})};
})();
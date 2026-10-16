const V="dt-v12";
const FILES=["./","./index.html","./manifest.webmanifest","./icon3-192.png","./icon3-512.png","./apple-icon3.png","./bg-d1.jpg","./bg-d2.jpg","./bg-d3.jpg","./bg-n.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url),page=e.request.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith(".html");
  if(page){
    /* pagina: prima la rete (cosi vedi subito gli aggiornamenti), cache solo se sei offline */
    e.respondWith(fetch(e.request).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp));}return res;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res&&res.ok&&u.origin===location.origin){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp));}
    return res;
  })));
});

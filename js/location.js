const LOC=(()=>{
const K={lat:21.422487,lon:39.826206},MX=111320*Math.cos(K.lat*Math.PI/180),MZ=110574,subs=new Set();
let wid=null,last=null,raw=null,bad=0,st='idle',wa=0;
const loc=(lat,lon)=>({x:(lon-K.lon)*MX,z:(lat-K.lat)*MZ});
const P={S:loc(21.42230,39.82745),M:loc(21.42586,39.82762)};
const snap=()=>({st,pos:last,wa}),emit=()=>subs.forEach(f=>f(snap()));
function ok(p){const c=p.coords,a=c.accuracy||999,t=p.timestamp||Date.now(),q=loc(c.latitude,c.longitude);
 wa=a;if(a>80){st='weak';return emit()}
 let jump=0;
 if(raw){const dt=Math.max((t-raw.t)/1e3,.5),d=Math.hypot(q.x-raw.x,q.z-raw.z);if(d>Math.max(25,a*2)&&d/dt>6){if(++bad<3)return;jump=1}}
 bad=0;raw={...q,t};st='ok';
 const w=a<10?.6:a<25?.4:.25;
 last=last&&!jump?{x:last.x+(q.x-last.x)*w,z:last.z+(q.z-last.z)*w,acc:a,t}:{...q,acc:a,t};emit()}
function err(e){st=e.code===1?'denied':e.code===2?'unav':'weak';emit()}
function sub(f){subs.add(f);if(wid===null){if(!navigator.geolocation)st='unsup';else if(window.isSecureContext===false)st='insec';else{st='wait';try{wid=navigator.geolocation.watchPosition(ok,err,{enableHighAccuracy:true,maximumAge:1000,timeout:20000})}catch(e){st='unav'}}}f(snap())}
function unsub(f){subs.delete(f);if(!subs.size&&wid!==null){navigator.geolocation.clearWatch(wid);wid=null;last=raw=null;st='idle'}}
const polar=p=>p?{r:Math.hypot(p.x,p.z),a:Math.atan2(p.z,p.x)}:null;
return{sub,unsub,snap,loc,polar,P,K}})();
window.LOC=LOC;

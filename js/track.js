const TRK=(()=>{
const s={on:false,k:null,ph:'idle',msg:'',pct:0,got:false,to:false,auto:false},TO=20000;let tm=0,TAU=2*Math.PI,SZ=50;
let snap={st:'idle'},ref=null,tot=0,pa=0,pp=null,t0=0,n=0,inN=0,mx=0,left=false,cool=0,lt=0,jm=0,cnt=0,buf=[];
const med=a=>a.slice().sort((x,y)=>x-y)[a.length>>1],dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z),wrap=a=>a-TAU*Math.round(a/TAU),ang=p=>Math.atan2(p.z,p.x),zone=a=>SZ+Math.min(a,30);
const ends=()=>S.sai%2?[LOC.P.M,LOC.P.S]:[LOC.P.S,LOC.P.M];
function arm(p){tot=0;n=0;inN=0;mx=0;jm=0;left=false;pp=p;pa=ang(p);t0=Date.now();s.ph='run';s.msg='';s.pct=0}
function start(){if(buf.length<3){s.msg='g_wait';return}const p={x:med(buf.map(q=>q.x)),z:med(buf.map(q=>q.z)),acc:med(buf.map(q=>q.acc)),t:buf[buf.length-1].t};if(p.acc>50){s.msg='g_weak';return}
 if(s.k==='tawaf'){const r=Math.hypot(p.x,p.z);if(r<4||r>150){s.msg='far';return}ref={x:p.x,z:p.z};arm(p)}
 else{const ds=dist(p,LOC.P.S),dm=dist(p,LOC.P.M);if(Math.min(ds,dm)>250){s.msg='far';return}
  if(dist(p,ends()[0])>zone(p.acc)){s.msg='wrong:'+(ds<dm?'S':'M');return}arm(p)}}
function cand(){if(Date.now()<cool)return;s.ph='cand';navigator.vibrate&&navigator.vibrate([40,60,40])}
function step(p){if(s.ph!=='run')return;if(p.acc>50){s.msg='g_weak';return}s.msg='';n++;const el=(Date.now()-t0)/1e3;
 if(s.k==='tawaf'){const r=Math.hypot(p.x,p.z);
  if(r>=Math.max(6,p.acc*.6)&&dist(p,pp)>=Math.max(2,p.acc*.35)){const d=wrap(ang(p)-pa),ok=Math.abs(d)<1.2;
   if(ok||++jm>3){if(ok)tot+=d;jm=0;pa=ang(p);pp=p}}
  s.pct=Math.max(0,Math.min(1,tot/TAU));if(tot<-1.6)s.msg='rev';
  inN=dist(p,ref)<=Math.max(30,p.acc*1.5+10)&&Math.abs(wrap(ang(p)-ang(ref)))<=.55?inN+1:0;
  if(tot>=TAU*.9&&inN>=3&&n>=15&&el>=45)cand()}
 else{const[a,b]=ends(),L=dist(a,b),pr=((p.x-a.x)*(b.x-a.x)+(p.z-a.z)*(b.z-a.z))/(L*L);
  mx=Math.max(mx,pr);s.pct=Math.max(0,Math.min(1,mx));if(dist(p,a)>zone(p.acc)+10)left=true;
  inN=dist(p,b)<=zone(p.acc)?inN+1:0;
  if(left&&mx>=.85&&inN>=3&&n>=8&&el>=L/3)cand()}}
function onLoc(sn){snap=sn;if(sn.st==='ok'&&sn.pos){s.got=true;s.to=false;if(!GP.ready)gpReady(sn.pos.acc)}if(sn.pos&&sn.pos.t!==lt){lt=sn.pos.t;buf.push(sn.pos);if(buf.length>5)buf.shift();step(sn.pos);if(s.on&&s.auto&&s.ph==='idle'&&buf.length>=3){start();s.auto=s.ph==='idle'&&s.msg==='g_weak'}}paint()}
let wl=null;const wake=async()=>{try{if(navigator.wakeLock&&!wl&&document.visibilityState==='visible'){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>{wl=null})}}catch(e){wl=null}};
document.addEventListener('visibilitychange',()=>{if(s.on)wake()});
function off(){clearTimeout(tm);s.got=s.to=false;if(s.on){s.on=false;LOC.unsub(onLoc);if(wl){wl.release().catch(()=>{});wl=null}}s.ph='idle';s.msg='';ref=null;buf=[]}
function act(a){
 if(a==='smt'){if(s.on)off();else{s.on=true;s.got=s.to=false;s.auto=GP.ready;s.k=S.step;s.ph='idle';s.msg='';cnt=S[s.k];clearTimeout(tm);tm=setTimeout(()=>{if(s.on&&!s.got){s.to=true;paint()}},TO);LOC.sub(onLoc);wake()}}
 else if(a==='smr'){off();return act('smt')}
 else if(a==='gpp')gpAct();
 else if(a==='sms')start();
 else if(a==='smn'){s.ph='run';cool=Date.now()+20000;inN=0}
 else if(a==='smy'){const b=document.querySelector('[data-a=lap]');if(b&&!b.disabled)b.click()}
 paint()}
const ac=a=>(S.lang==='ar'?' · الدقة ':' · accuracy ')+Math.round(a)+(S.lang==='ar'?' م':' m'),ERR={denied:1,unav:1,unsup:1,insec:1},GK='manasik_gps',GP={st:'idle',acc:0,ready:false,e:''};let gtm=0,gcb=null;
try{GP.ready=localStorage.getItem(GK)==='1';if(GP.ready)GP.st='ready'}catch(e){}
function gpReady(a){GP.ready=true;GP.st='ready';if(a)GP.acc=a;try{localStorage.setItem(GK,'1')}catch(e){}}
try{navigator.permissions&&navigator.permissions.query({name:'geolocation'}).then(r=>{const f=()=>{if(r.state==='denied'&&GP.ready){GP.ready=false;GP.st='idle';try{localStorage.removeItem(GK)}catch(e){}paint()}};f();r.onchange=f}).catch(()=>{})}catch(e){}
function gpStop(){clearTimeout(gtm);if(gcb){const f=gcb;gcb=null;LOC.unsub(f)}}
function gpAct(){gpStop();GP.st='load';GP.e='';GP.acc=0;gtm=setTimeout(()=>{if(GP.st==='load'){GP.st='err';GP.e='g_timeout';gpStop();paint()}},TO);
 gcb=sn=>{if(GP.st!=='load')return;if(sn.st==='ok'&&sn.pos){gpReady(sn.pos.acc);gpStop()}else if(ERR[sn.st]){GP.st='err';GP.e='g_'+sn.st;gpStop()}paint()};LOC.sub(gcb)}
function gpPaint(){const el=document.getElementById('gp');if(!el)return;const g=GP.st,x=g==='load'?`<p class="cfs st-load"><i class="spin"></i>${t('g_load')}</p>`:g==='ready'?`<p class="cfs st-ok">${t('gpR')}${GP.acc?ac(GP.acc):''}</p>`:g==='err'?`<p class="cfs st-err">${t(GP.e)}</p>`:'';
 const bt=g==='load'||g==='ready'?'':`<button class="chip" data-a="gpp">${g==='err'?t('retry'):t('gpB')}</button>`,h=`<div class="gpr"><b>${t('gpT')}</b>${bt}</div>${x}<p class="note">${t('gpN')}</p>`;if(el.dataset.h!==h){el.dataset.h=h;el.innerHTML=h}}
function stat(){const g=snap.st;if(ERR[g])return{k:'err',s:t('g_errs'),x:t('g_'+g)};
 if(!s.got)return s.to?{k:'err',s:t('g_errs'),x:t('g_timeout')}:g==='weak'&&snap.wa?{k:'load',s:t('g_weak')+ac(snap.wa),x:''}:{k:'load',s:t('g_load'),x:''};
 const a=snap.pos?ac(snap.pos.acc):'';return{k:'ok',s:t('g_okm')+a,x:'',sh:(S.lang==='ar'?'✓ الموقع جاهز':'✓ Location ready')+(snap.pos?' · '+Math.round(snap.pos.acc)+(S.lang==='ar'?' م':' m'):'')}}
const gtxt=()=>stat().s;
const mtxt=()=>{const m=s.msg;return m.startsWith('wrong:')?t('wrong').replace('{x}',t(m[6])).replace('{y}',t(ends()[0]===LOC.P.S?'S':'M')):m?t(m):''};
const ctext=()=>s.k==='sai'?t('smA').replace('{x}',t(ends()[1]===LOC.P.S?'S':'M')):t('smC');
function ui(){
 if(S[S.step]>=7)return '';
 if(!s.on)return `<button class="chip" data-a="smt">${t('smb')}${GP.ready?' ✓':''}</button>`;
 const st=stat();return `<button class="chip" data-a="smt">${t('smx')}</button><span class="smg st-${st.k}" id="smg">${st.sh||st.s}</span><div class="pb"><i id="smp" style="width:${Math.round(s.pct*100)}%"></i></div>`}
function bar(){
 if(!s.on)return '';
 if(s.ph==='cand')return `<div class="cfc cand"><div class="cft">${ctext()}</div><div class="row"><button class="btn" data-a="smy">${t('smY')}</button><button class="btn sec" data-a="smn">${t('smNo')}</button></div></div>`;
 if(!s.got){const st=stat();return st.k==='err'?`<div class="cfc"><p class="cfs st-err">${st.x}</p><div class="row"><button class="btn" data-a="smr">${t('retry')}</button></div></div>`:''}
 if(s.ph==='idle')return `<div class="cfc"><button class="btn" data-a="sms">${t('smS')}</button><p class="note" id="cfm"></p></div>`;
 return ''}
function paint(){if(s.on&&(S.step!==s.k||S[s.k]>=7))off();
 if(s.on&&S[s.k]!==cnt){cnt=S[s.k];if(s.ph!=='idle'&&snap.pos)arm(snap.pos)}
 gpPaint();
 const cf=document.getElementById('cf');if(cf){const h=bar();if(cf.dataset.h!==h){cf.dataset.h=h;cf.innerHTML=h}const x=document.getElementById('cfm');if(x)x.textContent=mtxt()}
 const el=document.getElementById('sm');if(!el)return;
 const sig=''+s.on+GP.ready+S[S.step];
 if(el.dataset.sig!==sig||!el.firstChild&&ui()){el.dataset.sig=sig;el.innerHTML=ui()}
 else if(s.on){const g=document.getElementById('smg'),p=document.getElementById('smp');if(g){const st=stat();g.textContent=st.sh||st.s;g.className='smg st-'+st.k}if(p)p.style.width=Math.round(s.pct*100)+'%'}}
return{act,paint,off,prep:gpAct}})();
window.TRK=TRK;

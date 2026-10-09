const APP_URL='https://MOs-V.github.io/Manasik/';
let D={},T={ar:{},en:{}};
const $=s=>document.querySelector(s),KEY='manasik_v1';

const def={lang:'ar',step:'home',tawaf:0,sai:0,done:false};
let S=def,lock=false;
try{S={...def,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){}
let ask=(S.step!=='home'&&S.step!=='end')||S.tawaf>0&&!S.done;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const t=k=>T[S.lang][k],A=()=>S.lang==='ar'?'←':'→';
const dua=(k,tag)=>`<div class="card">${tag?`<div class="tag">${tag}</div>`:''}<div class="dua ar">${D[k].ar}</div>${S.lang==='en'?`<span class="en">${D[k].en}</span>`:''}</div>`;
const note=x=>`<p class="note">${x}</p>`;
const P=()=>PROGRAMS[S.prog]||PROGRAMS.umrah;
const idx=()=>P().order.indexOf(S.step);
const go=s=>{S.step=s;ask=false;save();render();$('#m').scrollTop=0};

function view(){
 const s=S.step,v=P().view(s);if(v)return v;
 const row=(k,i)=>{const ok=k==='tawaf'?S.tawaf>=7:k==='sai'?S.sai>=7:S.done||(i>=0&&P().order.indexOf(k)<Math.max(idx(),0)&&S.step!=='home');return `<button class="item ${ok?'ok':''}" data-go="${k}"><em>${ok?'✓':i}</em><span>${t(k)}</span></button>`};
 return `<div class="hero"><h1 class="ar">مناسك</h1><p>${t('sub')}</p></div>`
 +(ask?`<div class="resume"><p>${t('saved')}</p><div class="row"><button class="btn" data-a="resume">${t('cont')}</button><button class="btn sec" data-a="fresh">${t('fresh')}</button></div></div>`:'')
 +`<button class="btn" style="min-height:68px;font-size:22px" data-go="enter">${t('start')}</button>`
 +'<div class="gp" id="gp"></div>'
 +`<div class="sec-t">${t('before')}</div>`+['travel','ihram','tal'].map((k,i)=>row(k,i+1)).join('')
 }
function foot(){
 const s=S.step;if(s==='home'||s==='end')return '';
 const i=idx(),nx=P().order[i+1],c=P().counted();
 if(i<P().prep)return `<div class="row"><button class="btn sec" data-a="back" style="flex:1">${t('back')}</button></div>`;
 const lbl=s==='hair'?t('finish'):s==='tal'?t('home'):s==='enter'?`${t('next')} ${A()} ${t('sTw')}`:`${t('next')} ${A()} ${P().order.indexOf(nx)>=5&&nx!=='end'?t('st')[P().order.indexOf(nx)-4]:t(nx)}`;
 return (c?`<button class="btn" data-a="lap">${t('fin')}</button>`:'')
 +`<div class="row"><button class="btn sec" data-a="back" style="flex:1">${t('back')}</button><button class="${c?'btn sec':'btn'}" data-a="next" style="flex:2" ${c?'disabled':''}>${lbl}</button></div>`}
function render(){
 const L=S.lang;document.documentElement.lang=L;document.documentElement.dir=L==='ar'?'rtl':'ltr';
 document.querySelectorAll('#lg span').forEach(e=>e.classList.toggle('on',e.dataset.l===L));
 const m=$('#m');if(ls!==S.step){ls=S.step;m.classList.remove('pg');void m.offsetWidth;m.classList.add('pg')}
 $('#m').innerHTML=view();const f=$('#f');f.innerHTML=foot();f.classList.toggle('hide',!f.innerHTML);window.TRK&&TRK.paint();azBar();
 $('#bar i').style.width=(S.step==='home'?0:idx()<P().prep?(idx()+1)/P().prep*100:(idx()-P().prep+1)/(P().order.length-P().prep)*100)+'%'}
const AZ=[.8,.9,1,1.12,1.25,1.4];let az=2;
try{const v=+localStorage.getItem('manasik_az');if(v>=0&&v<AZ.length&&Number.isInteger(v)&&localStorage.getItem('manasik_az')!==null)az=v}catch(e){}
function azSet(n){az=Math.max(0,Math.min(AZ.length-1,n));document.documentElement.style.setProperty('--az',AZ[az]);try{localStorage.setItem('manasik_az',az)}catch(e){}
 const a=$('.az [data-a="az-"]'),b=$('.az [data-a="az+"]');if(a)a.disabled=az===0;if(b)b.disabled=az===AZ.length-1}
function azBar(){if(!$('#m .dua'))return;$('#m').insertAdjacentHTML('afterbegin','<div class="az"><button data-a="az-" aria-label="'+(S.lang==='ar'?'تصغير الخط':'Smaller text')+'">A\u2212</button><button data-a="az+" aria-label="'+(S.lang==='ar'?'تكبير الخط':'Larger text')+'">A+</button></div>');azSet(az)}
document.documentElement.style.setProperty('--az',AZ[az]);
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-go],[data-a]');if(!b)return;
 if(b.dataset.go){if(b.dataset.go==='enter'&&S.step==='home'&&S.done){S={...def,lang:S.lang,prog:S.prog}}return go(b.dataset.go)}
 const a=b.dataset.a,i=idx();
 if(a==='az-')return azSet(az-1);
 if(a==='az+')return azSet(az+1);
 if(a==='home')return $('#hm').click();
 if(/^(sm[tsnyr]|gpp)$/.test(a))return TRK.act(a);
 if(a==='back')go(i<=P().prep?'home':P().order[i-1]);
 if(a==='next'&&!P().counted()){if(S.step==='hair')S.done=true;go(S.step==='tal'?'home':P().order[i+1])}
 if(a==='lap'&&!lock){const k=S.step;if(S[k]<7){lock=true;S[k]++;save();navigator.vibrate&&navigator.vibrate(35);b.disabled=true;const p=$('.prg');if(p)p.classList.add('go');setTimeout(()=>{lock=false;render()},1500)}}
 if(a==='resume')go(S.step!=='home'?S.step:S.sai>0?'sai':'tawaf');
 if(a==='fresh'){S={...def,lang:S.lang};ask=false;save();render()}});
$('#lg').onclick=e=>{const l=e.target.dataset.l;if(l){S.lang=l;save();render()}};
let ls;const H=document.documentElement,dk=()=>H.dataset.theme?H.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
const ti=()=>$('#th').innerHTML=`<svg viewBox="0 0 24 24">${dk()?'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>':'<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>'}</svg>`;
try{const v=localStorage.getItem('manasik_theme');if(v)H.dataset.theme=v}catch(e){}
ti();$('#th').onclick=()=>{const v=dk()?'light':'dark';H.dataset.theme=v;try{localStorage.setItem('manasik_theme',v)}catch(e){}ti()};
$('#hm').onclick=()=>{go('home');ask=(S.tawaf>0||S.sai>0)&&!S.done;render()};

function qrm(txt){
const b=[...new TextEncoder().encode(txt)],CAP=[19,34,55,80,108,136],EC=[7,10,15,20,26,18],NB=[1,1,1,1,1,2],AP=[[],[6,18],[6,22],[6,26],[6,30],[6,34]];
const v=CAP.findIndex(c=>b.length<=c-2);if(v<0)return null;
const cap=CAP[v],n=21+4*v,bits=[],pu=(x,l)=>{for(let i=l-1;i>=0;i--)bits.push(x>>i&1)};
pu(4,4);pu(b.length,8);b.forEach(x=>pu(x,8));pu(0,Math.min(4,cap*8-bits.length));
while(bits.length%8)bits.push(0);
for(let p=0xEC;bits.length<cap*8;p^=0xFD)pu(p,8);
const d=[];for(let i=0;i<cap;i++){let x=0;for(let j=0;j<8;j++)x=x<<1|bits[i*8+j];d.push(x)}
const mul=(x,y)=>{let z=0;for(let i=7;i>=0;i--){z=z<<1^(z>>>7)*0x11D;z^=(y>>>i&1)*x}return z};
const e=EC[v],nb=NB[v],bl=cap/nb,dv=Array(e).fill(0);dv[e-1]=1;
for(let i=0,r=1;i<e;i++){for(let j=0;j<e;j++){dv[j]=mul(dv[j],r);if(j+1<e)dv[j]^=dv[j+1]}r=mul(r,2)}
const bk=[],ec=[];for(let k=0;k<nb;k++){const bd=d.slice(k*bl,(k+1)*bl),r=Array(e).fill(0);bd.forEach(x=>{const f=x^r.shift();r.push(0);dv.forEach((c,i)=>r[i]^=mul(c,f))});bk.push(bd);ec.push(r)}
const cw=[];for(let i=0;i<bl;i++)bk.forEach(x=>cw.push(x[i]));for(let i=0;i<e;i++)ec.forEach(x=>cw.push(x[i]));
const M=Array.from({length:n},()=>Array(n).fill(false)),F=M.map(r=>r.map(()=>false)),set=(x,y,k)=>{if(x>=0&&y>=0&&x<n&&y<n){M[y][x]=k;F[y][x]=true}};
for(let i=0;i<n;i++){set(6,i,i%2==0);set(i,6,i%2==0)}
[[3,3],[n-4,3],[3,n-4]].forEach(([x,y])=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const m=Math.max(Math.abs(dx),Math.abs(dy));set(x+dx,y+dy,m!=2&&m!=4)}});
const ap=AP[v],L=ap.length;ap.forEach((x,i)=>ap.forEach((y,j)=>{if(!(i==0&&j==0||i==0&&j==L-1||i==L-1&&j==0))for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(x+dx,y+dy,Math.max(Math.abs(dx),Math.abs(dy))!=1)}));
let r=8;for(let i=0;i<10;i++)r=r<<1^(r>>>9)*0x537;const fb=(8<<10|r)^0x5412,g=i=>(fb>>i&1)==1;
for(let i=0;i<6;i++)set(8,i,g(i));set(8,7,g(6));set(8,8,g(7));set(7,8,g(8));for(let i=9;i<15;i++)set(14-i,8,g(i));
for(let i=0;i<8;i++)set(n-1-i,8,g(i));for(let i=8;i<15;i++)set(8,n-15+i,g(i));set(8,n-8,true);
let k=0;for(let rt=n-1;rt>=1;rt-=2){if(rt==6)rt=5;for(let vt=0;vt<n;vt++)for(let j=0;j<2;j++){const x=rt-j,y=(rt+1&2)==0?n-1-vt:vt;if(!F[y][x]&&k<cw.length*8){M[y][x]=(cw[k>>3]>>(7-(k&7))&1)==1;k++}}}
for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!F[y][x]&&(x+y)%2==0)M[y][x]=!M[y][x];
return M}
function qrsvg(t){const M=qrm(t);if(!M)return '';const n=M.length;let p='';M.forEach((r,y)=>r.forEach((c,x)=>{if(c)p+=`M${x} ${y}h1v1h-1z`}));return `<svg viewBox="-4 -4 ${n+8} ${n+8}" shape-rendering="crispEdges"><rect x="-4" y="-4" width="${n+8}" height="${n+8}" fill="#fff"/><path d="${p}" fill="#111"/></svg>`}
$('#qb').onclick=()=>{$('#qs').innerHTML=qrsvg(APP_URL);$('#qu').textContent=APP_URL;$('#qm').classList.add('on')};
$('#qm').onclick=()=>$('#qm').classList.remove('on');
Promise.all(Object.values(PROGRAMS).map(p=>fetch(p.data).then(r=>{if(!r.ok)throw 0;return r.json()}).catch(()=>window[p.global]))).then(a=>{a.forEach(j=>{Object.assign(D,j.D);for(const l in j.T)Object.assign(T[l],j.T[l])});render()});
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

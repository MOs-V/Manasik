/* Manasik — TSB: electronic Tasbeeh (tap-anywhere counter, targets, reset confirmation). Storage key: manasik_tsb */
const TSB=(()=>{
const K='manasik_tsb',MAXT=100000;let st={c:0,t:33},last=0;
try{const v=JSON.parse(localStorage.getItem(K)||'{}');if(Number.isInteger(v.c)&&v.c>=0)st.c=v.c;if(Number.isInteger(v.t)&&v.t>=1&&v.t<=MAXT)st.t=v.t}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}},cur=()=>st.c?(st.c-1)%st.t+1:0,pre=[33,100,1000];
function chips(){return pre.map(v=>`<button class="chip${st.t===v?' on':''}" data-a="tst" data-v="${v}">${v}</button>`).join('')+`<button class="chip${pre.includes(st.t)?'':' on'}" data-a="tsc">${t('tsC')}${pre.includes(st.t)?'':' · '+st.t}</button>`}
function view(){return `<div class="tsb" id="tsb"><div class="tsh"><h2>${t('tsb')}</h2><button class="chip" data-a="tsr">${t('tsR')}</button></div><div class="tgs"><small>${t('tsT')}</small>${chips()}</div>
<div class="tbody"><div class="tring"><svg viewBox="0 0 220 220" aria-hidden="true"><circle class="trk" cx="110" cy="110" r="98"/><circle class="prg" id="tp" cx="110" cy="110" r="98" pathLength="100" transform="rotate(-90 110 110)" style="stroke-dashoffset:${100-cur()/st.t*100}"/></svg><div class="tnum"><b id="tn">${st.c}</b><small id="tcn">${cur()} / ${st.t}</small></div></div><p class="tdn" id="tdn">${dn()}</p><p class="thint">${t('tsH')}</p></div></div>`}
const dn=()=>st.c>=st.t?`${t('tsD')}: ${Math.floor(st.c/st.t)}`:'';
function upd(){const n=document.getElementById('tn');if(!n)return;n.textContent=st.c;document.getElementById('tcn').textContent=cur()+' / '+st.t;document.getElementById('tp').style.strokeDashoffset=100-cur()/st.t*100;document.getElementById('tdn').textContent=dn();n.classList.remove('bump');void n.offsetWidth;n.classList.add('bump')}
function tap(){const n=performance.now();if(n-last<30)return;last=n;st.c++;save();upd();vib(st.c%st.t===0?VB.l:VB.s)}
function dlg(h){close();const d=document.createElement('div');d.className='dlg';d.id='dlg';d.innerHTML=`<div class="db" role="dialog" aria-modal="true">${h}</div>`;d.onclick=e=>{if(e.target===d)close()};document.body.appendChild(d);const i=d.querySelector('input');if(i)i.focus()}
function close(){const d=document.getElementById('dlg');if(d)d.remove()}
function setT(v){st.t=v;save();close();const c=document.querySelector('.tgs');if(c){c.innerHTML=`<small>${t('tsT')}</small>`+chips()}upd()}
function act(a,b){
 if(a==='tst')return setT(+b.dataset.v);
 if(a==='tsc')return dlg(`<h3>${t('tsCT')}</h3><input id="tci" type="number" inputmode="numeric" min="1" max="${MAXT}" value="${pre.includes(st.t)?'':st.t}"><p class="tce" id="tce"></p><div class="row"><button class="btn" data-a="tss">${t('tsS')}</button><button class="btn sec" data-a="tsx">${t('tsX')}</button></div>`);
 if(a==='tss'){const i=document.getElementById('tci'),v=Number(i.value);if(Number.isInteger(v)&&v>=1&&v<=MAXT)return setT(v);document.getElementById('tce').textContent=t('tsCE');return}
 if(a==='tsr')return dlg(`<h3>${t('tsQ')}</h3><p>${t('tsQN')}</p><div class="row"><button class="btn" data-a="tsy">${t('tsY')}</button><button class="btn sec" data-a="tsx">${t('tsX')}</button></div>`);
 if(a==='tsy'){st.c=0;save();close();upd();return}
 if(a==='tsx')close()}
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
return{view,tap,act,close}})();
window.TSB=TSB;

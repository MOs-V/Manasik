/* Manasik — Quran reader (Madinah Mushaf).
   Page images:  quran/img/NNN.webp   (604, Madinah Mushaf pages)
   Text + layout: quran/data/quran.json (KFGQPC Hafs, per-page verses)
   Font:          quran/fonts/UthmanicHafs-v-3.0.ttf
   Styles:        css/quran.css
   Storage keys:  manasik_q (page, mode), manasik_qb (bookmarks); Cache Storage 'manasik-quran' (offline download) */
const QR=(()=>{
const KS='manasik_q',KB='manasik_qb',CACHE='manasik-quran',IMG='quran/img/',DATA='quran/data/quran.json',N=604,
 COLS=['#2ea66b','#d4a73a','#3b82c4','#d8688a','#8a63c9'],hx=(c,a)=>{const n=parseInt(c.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
let st={p:1,m:'img'},bm=[],data=null,sel=null,col=0,dl={run:false,done:0,fail:[],msg:'',stop:false},swx=0,swy=0;
try{const v=JSON.parse(localStorage.getItem(KS)||'{}');if(Number.isInteger(v.p)&&v.p>=1&&v.p<=N)st.p=v.p;if(v.m==='txt')st.m='txt'}catch(e){}
try{const v=JSON.parse(localStorage.getItem(KB)||'[]');if(Array.isArray(v))bm=v.filter(b=>b&&b.p>=1&&b.p<=N&&COLS.includes(b.c))}catch(e){}
const sv=()=>{try{localStorage.setItem(KS,JSON.stringify(st))}catch(e){}},svb=()=>{try{localStorage.setItem(KB,JSON.stringify(bm))}catch(e){}},
 pad=n=>String(n).padStart(3,'0'),fmt=(k,n)=>t(k).replace('{n}',n),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
 $q=s=>document.querySelector(s);
function surahOf(p){if(!data)return '';const e=data.pages[p-1].e.find(x=>x[0]!=='h'&&x[0]);return e?(data.surahs[e[0]-1]||[])[1]||'':''}
function view(){return `<div class="qr" id="qr"><div class="qtb"><div class="qseg"><button data-a="qrm" data-v="img" class="${st.m==='img'?'on':''}">${t('q_img')}</button><button data-a="qrm" data-v="txt" class="${st.m==='txt'?'on':''}">${t('q_txt')}</button></div><div class="qic"><button class="ci" data-a="qrb" aria-label="${t('q_bm')}"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg></button><button class="ci" data-a="qrd" aria-label="${t('q_dl')}"><svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg></button></div>
<div class="qnv"><button class="ci" data-a="qrn" data-v="-1" aria-label="${t('q_prev')}"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button><label class="qgo"><span>${t('q_pg')}</span><input id="qpi" type="number" inputmode="numeric" min="1" max="${N}" value="${st.p}"><span>/ ${N}</span></label><button class="chip" data-a="qrg">${t('q_go')}</button><button class="ci" data-a="qrn" data-v="1" aria-label="${t('q_next')}"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button></div><div class="qst" id="qst"></div></div><div class="qpg" id="qpg"></div><div class="qba" id="qba"></div></div>`}
/* Loading: data (quran.json) and page images are independent. Every failure is classified (404 / network / parse / file://) and shown with the exact file name. */
let dp=null;
function errBox(url,why,k){return `<div class="qmsg qerr"><p>${t('q_err')}</p><p class="qef"><b>${t('q_ef')}:</b> <bdi dir="ltr">${esc(url)}</bdi></p><p>${t(why)}</p><p class="qn">${t('q_edep')}</p><button class="btn sec" data-a="qrr" data-k="${k}">${t('retry')}</button></div>`}
async function loadData(){if(data)return data;if(dp)return dp;dp=(async()=>{let why='q_enet';
 if(location.protocol==='file:'){try{await new Promise((ok,no)=>{const s=document.createElement('script');s.src='quran/data/quran.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});if(window.QURAN_DATA){data=window.QURAN_DATA;return data}}catch(e){}throw{url:DATA,why:'q_efile'}}
 try{const x=await fetch(DATA,{cache:'no-cache'});if(!x.ok)throw{url:DATA,why:x.status===404?'q_e404':'q_ehttp',st:x.status};try{data=await x.json()}catch(e){throw{url:DATA,why:'q_eparse'}}if(!data||!data.pages||data.pages.length!==N){data=null;throw{url:DATA,why:'q_eparse'}}return data}
 catch(e){if(e&&e.why)throw e;throw{url:DATA,why:why}}})();
 try{return await dp}finally{dp=null}}
async function mount(){const r=$q('#qr');if(!r)return;paintBar();
 if(!data){loadData().then(()=>{const q=$q('#qr');if(q)draw()}).catch(e=>{if(st.m==='txt'&&$q('#qpg'))$q('#qpg').innerHTML=errBox(e.url,e.why,'data');else if($q('#qst'))$q('#qst').dataset.dataerr=e.why})}
 draw()}
function stat(){if(!data)return `${t('q_pgt')} ${st.p}`;const s=surahOf(st.p),j=data.pages[st.p-1].j;return `${t('q_sur')} ${s} · ${t('q_juz')} ${j} · ${t('q_pgt')} ${st.p}`}
function draw(){const g=$q('#qpg');if(!g)return;if(st.m==='txt'&&!data){g.innerHTML=`<p class="qmsg">${t('q_load')}</p>`;paintBar();const i0=$q('#qpi');if(i0)i0.value=st.p;$q('#qst').textContent=stat();return}const i=$q('#qpi');if(i)i.value=st.p;$q('#qst').textContent=stat();sv();
 if(st.m==='img'){const bs=bm.filter(b=>b.p===st.p&&b.y!=null).map(b=>band(b.y,b.c,b.id)).join('')+(sel&&sel.p===st.p&&sel.y!=null?band(sel.y,COLS[col],'',1):'');
  g.innerHTML=`<div class="qw" id="qw"><img class="qimg" alt="${t('q_pg')} ${st.p}" src="${IMG+pad(st.p)}.webp" decoding="async"><div class="qld">${t('q_load')}</div>${bs}</div>${pn()}`;const im=g.querySelector('img'),w=$q('#qw');im.onload=()=>w.classList.add('ok');im.onerror=async()=>{const u=im.getAttribute('src').split('?')[0];let why='q_enet';try{const x=await fetch(u,{cache:'no-store'});why=x.ok?'q_ebad':x.status===404?'q_e404':'q_ehttp'}catch(e){}if(w.isConnected)w.innerHTML=errBox(u,why,'img')};if(im.complete&&im.naturalWidth)w.classList.add('ok');
  [st.p+1,st.p-1].forEach(p=>{if(p>=1&&p<=N)new Image().src=IMG+pad(p)+'.webp'})}
 else{g.innerHTML='<div class="az" style="direction:ltr"><button data-a="az-" aria-label="-">A\u2212</button><button data-a="az+" aria-label="+">A+</button></div>'+'<div class="qpage">'+txt()+'</div>'+pn();azSet(az)}
 paintBar()}
/* page-number medallion under each Mushaf page (Arabic-Indic digits) */
const pn=()=>`<div class="qpn"><span>${String(st.p).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d])}</span></div>`;
const band=(y,c,id,s)=>`<i class="qb${s?' sl':''}" ${id?`data-a="qrs" data-id="${id}"`:''} style="top:${(y*100).toFixed(2)}%;background:${hx(c,s?.22:.3)};border-color:${hx(c,.8)}"></i>`;
function txt(){const e=data.pages[st.p-1].e;let h='';for(const x of e){if(x[0]==='h'){const s=x[1];h+=`</div><div class="qsh"><span>سُورَةُ ${esc((data.surahs[s-1]||[])[1]||'')}</span></div>`+(s!==1&&s!==9?`<div class="qbs ar">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>`:'')+'<div class="qt ar">';continue}
  const k=x[0]+':'+x[1],b=bm.find(b=>b.p===st.p&&b.k===k),on=sel&&sel.k===k&&sel.p===st.p,s=esc(x[2]).replace(/(۝[٠-٩]+)$/,'<span class="am">$1</span>');
  h+=`<span class="ay${on?' sel':''}${b?' hl':''}" data-a="qra" data-k="${k}" ${b?`data-id="${b.id}" style="background:${hx(b.c,.3)};box-shadow:0 0 0 2px ${hx(b.c,.3)}"`:on?`style="background:${hx(COLS[col],.22)};box-shadow:0 0 0 2px ${hx(COLS[col],.22)}"`:''}>${s}</span> `}
 return `<div class="qt ar">${h}</div>`.replace('<div class="qt ar"></div>','')}
function paintBar(){const b=$q('#qba');if(!b)return;if(!sel){b.innerHTML=`<p class="qhint">${t('q_hint')}</p>`;return}
 const ex=sel.id?bm.find(x=>x.id===sel.id):null,dots=COLS.map((c,i)=>`<button class="qd${i===col?' on':''}" data-a="qrc" data-v="${i}" style="background:${c}" aria-label="${t('q_hl')}"></button>`).join('');
 b.innerHTML=`<div class="qsel"><div class="qds">${dots}</div><div class="row"><button class="btn" data-a="qrk">${ex?t('q_ok'):t('q_save')}</button>${ex?`<button class="btn sec" data-a="qrx">${t('q_del')}</button>`:''}<button class="btn sec" data-a="qrz">${t('tsX')}</button></div></div>`}
function go(p,keep){p=Math.round(+p);if(!(p>=1&&p<=N)){const i=$q('#qpi');if(i)i.value=st.p;return}if(p!==st.p||!keep){sel=null}st.p=p;draw();const m=$q('#m');if(m)m.scrollTop=0}
function save(){const id=sel.id||('b'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)),ex=bm.find(b=>b.id===id),nm=t('q_def')+' · '+t('q_pgt')+' '+st.p;
 if(ex){ex.c=COLS[col]}else{const b={id,p:st.p,c:COLS[col],n:nm+(surahOf(st.p)?' · '+surahOf(st.p):''),t:Date.now()};if(sel.k)b.k=sel.k;if(sel.y!=null)b.y=sel.y;bm.push(b)}svb();sel=null;draw()}
function dlg(h){close();const d=document.createElement('div');d.className='dlg';d.id='dlg';d.innerHTML=`<div class="db qs" role="dialog" aria-modal="true">${h}</div>`;d.onclick=e=>{if(e.target===d)close()};document.body.appendChild(d)}
function close(){const d=document.getElementById('dlg');if(d)d.remove()}
function sheetBm(){const rows=bm.slice().sort((a,b)=>a.p-b.p||(a.t-b.t)).map(b=>`<div class="qrw"><i class="qsw" style="background:${b.c}"></i><button class="qrn" data-a="qro" data-id="${b.id}"><b>${esc(b.n)}</b><small>${t('q_pg')} ${b.p}</small></button><button class="chip" data-a="qre" data-id="${b.id}">${t('q_ren')}</button><button class="chip" data-a="qrq" data-id="${b.id}" aria-label="${t('q_del')}">✕</button></div>`).join('');
 dlg(`<h3>${t('q_bm')}</h3><div class="qls">${rows||`<p>${t('q_nobm')}</p>`}</div><div class="row"><button class="btn sec" data-a="qrw">${t('q_close')}</button></div>`)}
async function cnt(){try{const c=await caches.open(CACHE),k=await c.keys();return k.filter(r=>/\/quran\/img\//.test(r.url)).length}catch(e){return 0}}
async function sheetDl(){const n=await cnt(),a=dl.run?fmt('q_dlp',dl.done):n>=N?t('q_dld'):fmt('q_dlc',n);let q='';try{const e=await navigator.storage.estimate();if(e.quota&&e.quota-e.usage<75e6)q=`<p class="tce">${t('q_dlq')}</p>`}catch(e){}
 dlg(`<h3>${t('q_dl')}</h3><div class="pb"><i style="width:${Math.round((dl.run?dl.done:n)/N*100)}%"></i></div><p id="qdm">${a}</p>${dl.msg?`<p class="tce">${dl.msg}</p>`:''}${dl.fail.length?`<p class="qn" dir="ltr">${esc(dl.fail.slice(0,3).join(', '))}${dl.fail.length>3?' …':''}</p>`:''}${q}<p class="qn">${t('q_dln')}</p><div class="row">${dl.run?`<button class="btn" data-a="qrt">${t('q_dla')}</button>`:n>=N?'':`<button class="btn" data-a="qrs2">${dl.fail.length?fmt('q_dlf',dl.fail.length):t('q_dl')}</button>`}${n>0&&!dl.run?`<button class="btn sec" data-a="qrv">${t('q_dlx')}</button>`:''}</div><p class="qn"><b>${t('q_src')}:</b> ${t('q_srct')}</p><div class="row"><button class="btn sec" data-a="qrw">${t('q_close')}</button></div>`)}
async function download(){if(dl.run)return;if(navigator.onLine===false){dl.msg=t('q_dlo');return sheetDl()}dl.run=true;dl.stop=false;dl.msg='';dl.fail=[];dl.done=0;try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
 let c;try{c=await caches.open(CACHE)}catch(e){dl.run=false;dl.msg=t('q_err');return sheetDl()}
 const urls=[DATA,'quran/fonts/UthmanicHafs-v-3.0.ttf'];for(let p=1;p<=N;p++)urls.push(IMG+pad(p)+'.webp');let i=0;const upd=()=>{const m=document.getElementById('qdm');if(m){m.textContent=fmt('q_dlp',dl.done);const b=m.previousElementSibling;if(b&&b.firstChild)b.firstChild.style.width=Math.round(dl.done/N*100)+'%'}};
 const one=async u=>{for(let t0=0;t0<3&&!dl.stop;t0++){try{if(await c.match(u))return true;const r=await fetch(u,{cache:'no-cache'});if(!r.ok)throw 0;await c.put(u,r);return true}catch(e){if(navigator.onLine===false)return false;await new Promise(r=>setTimeout(r,600*(t0+1)))}}return false};
 const w=async()=>{while(i<urls.length&&!dl.stop){const u=urls[i++];const ok=await one(u);if(u.startsWith(IMG)){if(ok)dl.done++;else if(!dl.stop)dl.fail.push(u);upd()}else if(!ok&&!dl.stop)dl.fail.push(u)}};
 await Promise.all([w(),w(),w(),w()]);dl.run=false;if(dl.stop)dl.msg='';else if(dl.fail.length&&navigator.onLine===false)dl.msg=t('q_dlo');if($q('#dlg'))sheetDl()}
async function wipe(){try{await caches.delete(CACHE)}catch(e){}dl={run:false,done:0,fail:[],msg:'',stop:false};sheetDl()}
function act(a,b){const v=b&&b.dataset.v,id=b&&b.dataset.id;
 if(a==='qrm'){st.m=v;sel=null;sv();const r=$q('#qr');if(r){r.querySelectorAll('.qseg button').forEach(x=>x.classList.toggle('on',x.dataset.v===v));draw()}return}
 if(a==='qrn')return nav(+v);
 if(a==='qrg')return go($q('#qpi').value);
 if(a==='qrr'){if(b.dataset.k==='img'){const im=$q('#qw img');if(im){const w=$q('#qw');w.querySelectorAll('.qerr').forEach(x=>x.remove());return draw()}}if(b.dataset.k==='data'){const g=$q('#qpg');if(g)g.innerHTML=`<p class="qmsg">${t('q_load')}</p>`;return loadData().then(draw).catch(e=>{if($q('#qpg'))$q('#qpg').innerHTML=errBox(e.url,e.why,'data')})}return mount()}
 if(a==='qra'){const k=b.dataset.k;if(id){const e=bm.find(x=>x.id===id);sel={p:st.p,k,id};col=Math.max(0,COLS.indexOf(e.c))}else sel=(sel&&sel.k===k)?null:{p:st.p,k};return draw()}
 if(a==='qrs'){const e=bm.find(x=>x.id===id);if(e){sel={p:st.p,y:e.y,id};col=Math.max(0,COLS.indexOf(e.c));draw()}return}
 if(a==='qrc'){col=+v;if(sel)draw();return}
 if(a==='qrk'){if(sel)save();return}
 if(a==='qrx'){bm=bm.filter(x=>x.id!==sel.id);svb();sel=null;return draw()}
 if(a==='qrz'){sel=null;return draw()}
 if(a==='qrb')return sheetBm();
 if(a==='qrw')return close();
 if(a==='qro'){const e=bm.find(x=>x.id===id);if(e){close();sel=null;go(e.p,1)}return}
 if(a==='qrq'){bm=bm.filter(x=>x.id!==id);svb();sheetBm();return draw()}
 if(a==='qre'){const e=bm.find(x=>x.id===id);if(e)dlg(`<h3>${t('q_name')}</h3><input id="qni" type="text" maxlength="40" value="${esc(e.n)}" data-id="${id}"><div class="row"><button class="btn" data-a="qrr2" data-id="${id}">${t('q_ok')}</button><button class="btn sec" data-a="qrb2">${t('tsX')}</button></div>`);const i=$q('#qni');if(i)i.focus();return}
 if(a==='qrr2'){const e=bm.find(x=>x.id===id),i=$q('#qni');if(e&&i&&i.value.trim())e.n=i.value.trim().slice(0,40);svb();return sheetBm()}
 if(a==='qrb2')return sheetBm();
 if(a==='qrd')return sheetDl();
 if(a==='qrs2'){download();return sheetDl()}
 if(a==='qrt'){dl.stop=true;return}
 if(a==='qrv')return wipe()}
const nav=d=>go(st.p+d,0);
function tap(e){if(st.m!=='img'||e.target.closest('[data-a]'))return;const w=e.target.closest('#qw');if(!w||!w.classList.contains('ok'))return;const r=w.getBoundingClientRect(),y=Math.min(.97,Math.max(.03,(e.clientY-r.top)/r.height));sel={p:st.p,y:Math.round(y*1e3)/1e3};draw()}
document.addEventListener('click',e=>{if(S.step==='quran'&&e.target.closest('#qpg'))tap(e)});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='qpi')go(e.target.value);if(e.key==='Escape')close()});
document.addEventListener('touchstart',e=>{const t=e.touches[0];swx=t.clientX;swy=t.clientY},{passive:true});
document.addEventListener('touchend',e=>{if(S.step!=='quran'||!e.target.closest('#qpg'))return;const t=e.changedTouches[0],dx=t.clientX-swx,dy=t.clientY-swy;if(Math.abs(dx)>70&&Math.abs(dy)<45&&Math.abs(dx)>Math.abs(dy)*2)nav(dx>0?1:-1)},{passive:true});
return{view,mount,act,last:()=>st.p,nav}})();
window.QR=QR;

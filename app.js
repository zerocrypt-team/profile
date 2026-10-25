"use strict";
const KEY="zc_extra_members";
const $=s=>document.querySelector(s)||Object.assign(document.createElement("div"),{value:""});
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
let extra=[];try{extra=JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){}
const all=()=>[...BASE,...extra];
const ini=n=>n.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200)}
let fSpec=(()=>{const s=new URLSearchParams(location.search).get("spec");return s&&SPECS[s]?s:"all"})();

/* matrix rain */
(function(){const c=$("#rain"),x=c.getContext("2d");let cols,drops;
function size(){c.width=innerWidth;c.height=innerHeight;cols=Math.ceil(c.width/16);drops=Array.from({length:cols},()=>Math.random()*c.height/16)}
size();addEventListener("resize",size);if(reduce)return;
const ch="01<>/{}ZC#$";let last=0;
function f(t){requestAnimationFrame(f);if(t-last<60)return;last=t;
const col=getComputedStyle(document.documentElement).getPropertyValue("--g").trim()||"#9dff65";
x.fillStyle="rgba(0,0,0,.12)";x.globalCompositeOperation="destination-out";x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation="source-over";
x.fillStyle=col;x.font="14px monospace";
drops.forEach((d,i)=>{x.fillText(ch[Math.random()*ch.length|0],i*16,d*16);drops[i]=d*16>c.height&&Math.random()>.97?0:d+1})}
requestAnimationFrame(f)})();

/* terminal */
(function(){const tb=$("#tb");
const L=[["p","root@zerocrypt:~$ ./initialize_team.sh"],["","[  OK  ] Loading team directory..."],["","[  OK  ] Mapping specialty domains..."],["","[  OK  ] Linking collaborative nodes..."],["ok","[ READY ] ZEROCRYPT CORE INITIALIZED"],["p","root@zerocrypt:~$ cat team.config"],["","team_name     = \"ZEROCRYPT\""],["","architecture = \"collaborative\""],["ok","mission      = \"learn / analyze / secure\""]];
let i=0,j=0,cur=null;
function line(){if(i>=L.length){tb.insertAdjacentHTML("beforeend",'<span class="p">root@zerocrypt:~$ </span><span class="cur"></span>');return}
const [k,t]=L[i];const s=document.createElement("div");s.className=k;tb.appendChild(s);
if(reduce){s.textContent=t;i++;return line()}
(function ty(){s.textContent=t.slice(0,++j);if(j<t.length)setTimeout(ty,14);else{j=0;i++;setTimeout(line,220)}})()}
line()})();

/* ticker */
$("#track").innerHTML=[0,1].map(()=>Object.values(SPECS).map((s,i)=>`<span><b>${String(i+1).padStart(2,"0")} //</b> ${esc(s.t.toUpperCase())}</span><span>✳</span>`).join("")).join("");

/* counters */
function counters(){const m=all();const v={members:m.length,specs:Object.keys(SPECS).length,leads:m.filter(a=>a.rt==="lead").length,core:m.filter(a=>a.core).length};
document.querySelectorAll("[data-c]").forEach(e=>{const to=v[e.dataset.c],from=+e.textContent||0;if(reduce||from===to){e.textContent=to;return}
const t0=performance.now();(function s(t){const p=Math.min((t-t0)/900,1);e.textContent=Math.round(from+(to-from)*p);if(p<1)requestAnimationFrame(s)})(t0)})}

function spotlight(root){root.querySelectorAll(".card").forEach(c=>{c.onpointermove=e=>{const r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")}})}

function renderCore(){$("#coreGrid").innerHTML=all().filter(m=>m.core).sort((a,b)=>a.id.localeCompare(b.id)).map(m=>`<article class="card rv vis"><div class="id">${esc(m.id)} / ${m.id==="ZC-001"?"OVERALL LEAD":"SPECIALTY LEAD"}</div><h3>${esc(m.name)}</h3><p>Core Leader · ${esc(SPECS[m.spec].n)} Team Lead</p></article>`).join("")}

function renderSpecs(){$("#specGrid").innerHTML=Object.entries(SPECS).map(([k,s])=>{const ms=all().filter(m=>m.spec===k).sort((a,b)=>(b.rt==="lead")-(a.rt==="lead"));
return `<article class="card rv"><div style="display:flex;justify-content:space-between"><span class="ico">${s.s}</span><span class="tag">${esc(s.n.toUpperCase())}</span></div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p><div class="chips">${ms.map(m=>`<span class="chip ${m.rt==="lead"?"lead":""}">${esc(m.name.split(" ")[0])}${m.rt==="lead"?" · Lead":""}</span>`).join("")||'<span class="chip">Open</span>'}</div></article>`}).join("");
spotlight($("#specGrid"));observe()}

function renderNet(){const svg=$("#net svg"),M=all(),keys=Object.keys(SPECS),N=keys.length;let h="";const P={};
keys.forEach((k,i)=>{const a=i*2*Math.PI/N-Math.PI/2;P[k]={a,x:400+270*Math.cos(a),y:230+150*Math.sin(a)}});
keys.forEach(k=>{h+=`<line data-s="${k}" x1="400" y1="230" x2="${P[k].x}" y2="${P[k].y}"/>`;
const ms=M.filter(m=>m.spec===k);ms.forEach((m,j)=>{const a=P[k].a+(j-(ms.length-1)/2)*.6,x=P[k].x+52*Math.cos(a),y=P[k].y+52*Math.sin(a);P[k]["m"+j]=[x,y,m];h+=`<line data-s="${k}" x1="${P[k].x}" y1="${P[k].y}" x2="${x}" y2="${y}"/>`})});
h+=`<g class="ctr"><circle cx="400" cy="230" r="30"/><text x="400" y="234" style="fill:var(--g);font-weight:700">ZC</text></g>`;
keys.forEach(k=>{const p=P[k];h+=`<g class="n" data-s="${k}" tabindex="0" role="button" aria-label="Filter ${esc(SPECS[k].n)}"><circle cx="${p.x}" cy="${p.y}" r="22"/><text x="${p.x}" y="${p.y+4}" style="fill:var(--g)">${esc(SPECS[k].s)}</text><text x="${p.x-38*Math.cos(p.a)}" y="${p.y-34*Math.sin(p.a)*-1+(Math.sin(p.a)>0?-30:34)*0}" dy="${Math.sin(p.a)>0.3?-30:Math.sin(p.a)<-0.3?36:-30}">${esc(SPECS[k].n)}</text></g>`;
Object.keys(p).filter(z=>z[0]==="m").forEach(z=>{const [x,y,m]=p[z];h+=`<g class="n mem" data-s="${k}"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y+3.5}" style="font-size:8px">${esc(ini(m.name))}</text><title>${esc(m.name)}</title></g>`})});
svg.innerHTML=h;
const gs=[...svg.querySelectorAll("[data-s]")];
svg.onpointerover=e=>{const g=e.target.closest("[data-s]");if(!g)return;gs.forEach(n=>n.classList.toggle("dim",n.dataset.s!==g.dataset.s))};
svg.onpointerleave=()=>gs.forEach(n=>n.classList.remove("dim"));
svg.onclick=e=>{const g=e.target.closest("g.n");if(!g)return;location.href="members.html?spec="+g.dataset.s}}

function renderChips(){$("#chips").innerHTML=[["all","All"],...Object.entries(SPECS).map(([k,s])=>[k,s.n])].map(([k,n])=>`<button type="button" data-k="${k}" class="${fSpec===k?"on":""}">${esc(n)}</button>`).join("")}

function renderMembers(){const q=$("#q").value.trim().toLowerCase(),r=$("#role").value;
const f=all().filter(m=>{const s=[m.id,m.name,SPECS[m.spec].t,m.bio,...m.tags].join(" ").toLowerCase();
return s.includes(q)&&(fSpec==="all"||m.spec===fSpec)&&(r==="all"||(r==="core"?m.core:m.rt===r))});
$("#count").textContent=`${f.length} of ${all().length} members`;
$("#mg").innerHTML=f.length?f.map((m,i)=>`<article class="card mc" style="animation-delay:${Math.min(i,12)*50}ms"><div class="top"><div class="av">${esc(ini(m.name))}</div><div style="text-align:right"><div class="mono g" style="font-size:10px">${esc(m.id)}</div>${m.core?'<span class="tag">CORE</span>':""}</div></div>
<h3>${esc(m.name)}</h3><p>${m.core?"Core Leader · ":""}${esc(SPECS[m.spec].n)} ${m.rt==="lead"?"Team Lead":"Member"}</p><p class="bio">${esc(m.bio||"Profile details coming soon.")}</p>
<div class="chips">${m.tags.map(t=>`<span class="chip">${esc(t)}</span>`).join("")}</div>
<div class="bot"><span>${esc(SPECS[m.spec].n)}</span><span><button class="sm" data-copy="${esc(m.id)}" type="button">COPY ID</button>${m.custom?` <button class="sm" data-del="${esc(m.id)}" type="button">REMOVE</button>`:""}</span></div></article>`).join(""):'<div class="empty">No matching members. Try different filters.</div>';
spotlight($("#mg"))}

function refresh(){renderCore();renderSpecs();renderNet();renderMembers();counters()}

$("#q").addEventListener("input",renderMembers);$("#role").addEventListener("change",renderMembers);
$("#chips").addEventListener("click",e=>{const b=e.target.closest("[data-k]");if(!b)return;fSpec=b.dataset.k;renderChips();renderMembers()});
$("#mg").addEventListener("click",async e=>{const c=e.target.closest("[data-copy]"),d=e.target.closest("[data-del]");
if(c){try{await navigator.clipboard.writeText(c.dataset.copy);toast("Copied "+c.dataset.copy)}catch(x){toast("ID: "+c.dataset.copy)}}
if(d){extra=extra.filter(m=>m.id!==d.dataset.del);save();refresh();toast("Member removed")}});
function save(){try{localStorage.setItem(KEY,JSON.stringify(extra))}catch(e){}}
$("#exp").onclick=async()=>{const j=JSON.stringify(all(),null,2);try{await navigator.clipboard.writeText(j);toast("Member list copied as JSON")}catch(e){toast("Clipboard unavailable")}};

const dlg=$("#dlg");$("#fs").innerHTML=Object.entries(SPECS).map(([k,s])=>`<option value="${k}">${esc(s.t)}</option>`).join("");
$("#add").onclick=()=>{$("#frm").reset();dlg.showModal()};$("#cancel").onclick=()=>dlg.close();
$("#frm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData($("#frm")),name=(f.get("name")||"").trim();if(!name)return;
const n=Math.max(...all().map(m=>+m.id.slice(3)))+1;
extra.push({id:"ZC-"+String(n).padStart(3,"0"),name,spec:f.get("spec"),rt:(f.get("rt")==="lead"&&all().some(m=>m.spec===f.get("spec")&&m.rt==="lead"))?"member":f.get("rt"),custom:1,tags:String(f.get("tags")||"").split(",").map(s=>s.trim()).filter(Boolean).slice(0,5),bio:(f.get("bio")||"").trim()});
save();dlg.close();fSpec="all";renderChips();refresh();toast("Member added (saved in this browser)")});

$("#menu").onclick=()=>{const o=$("#links").classList.toggle("open");$("#menu").setAttribute("aria-expanded",o);$("#menu").textContent=o?"✕":"☰"};
document.querySelectorAll("#links a").forEach(a=>a.onclick=()=>{$("#links").classList.remove("open");$("#menu").textContent="☰"});
addEventListener("keydown",e=>{if(e.key==="Escape")$("#links").classList.remove("open")});
addEventListener("scroll",()=>{const h=document.documentElement;$("#prog").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+"%"},{passive:true});
$("#yr").textContent=new Date().getFullYear();

let io;function observe(){if(!("IntersectionObserver"in window)){document.querySelectorAll(".rv").forEach(e=>e.classList.add("vis"));return}
io=io||new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("vis");io.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll(".rv:not(.vis)").forEach(e=>io.observe(e))}
renderChips();refresh();observe();

/* cursor glow */
(function(){if(reduce||matchMedia("(pointer:coarse)").matches)return;const d=document.createElement("div");d.className="cglow";document.body.appendChild(d);
let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY},{passive:true});
(function l(){x+=(tx-x)*.1;y+=(ty-y)*.1;d.style.transform=`translate(${x-220}px,${y-220}px)`;requestAnimationFrame(l)})()})();

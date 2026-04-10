import React,{useState,useRef,useEffect,useMemo,useCallback,useLayoutEffect} from 'react';
import {AnimatePresence,motion} from 'framer-motion';
import {Bold,Italic,Underline,Strikethrough,Upload,Trash2,MousePointer,ArrowRight,CircleDot,Equal,ChevronLeft,X,Check,ZoomIn,ZoomOut,Maximize,Save,Download,FolderOpen,MessageSquare,HelpCircle,Tag,Undo2,Redo2,ChevronsDown,ChevronsUp,RefreshCw,List,ListOrdered,Clock,Target,Link2,ChevronDown,ChevronUp,RemoveFormatting,RotateCcw,FileText,Shield,AlertTriangle,Menu,Layers,Plus,ChevronRight,MessageCircleQuestion,Info,Link as LinkIcon,Image as ImageIcon,Edit3,Sparkles,Eye,EyeOff,Copy,Loader2,Send} from 'lucide-react';

let _nid=0,_eid=0;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const toImg=(svg,w,h,fn)=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const x=c.getContext('2d');x.scale(2,2);x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(i,0,0,w,h);const a=document.createElement('a');a.download=fn;a.href=c.toDataURL('image/png');a.click()};i.onerror=()=>{const b=new Blob([svg],{type:'image/svg+xml'});const a=document.createElement('a');a.download=fn.replace('.png','.svg');a.href=URL.createObjectURL(b);a.click()};i.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)))};

const APP_VERSION=33;
const APP_DATE="1 April 2026";

const DualRangeSlider=({min=0,max=100,low,high,onLowChange,onHighChange})=>{const lp=((low-min)/(max-min))*100,hp=((high-min)/(max-min))*100;return(<div className="relative w-full" style={{height:42}}><div className="absolute top-4 left-0 right-0 h-2 bg-gray-200 rounded-full overflow-visible"><div className="absolute top-0 h-full rounded-l-full" style={{left:0,width:`${lp}%`,background:'linear-gradient(to right,#fecaca,#fca5a5)'}}/><div className="absolute top-0 h-full" style={{left:`${lp}%`,width:`${hp-lp}%`,background:'linear-gradient(to right,#fef08a,#fde68a)'}}/><div className="absolute top-0 h-full rounded-r-full" style={{left:`${hp}%`,width:`${100-hp}%`,background:'linear-gradient(to right,#86efac,#4ade80)'}}/></div><div className="absolute top-9 left-0 right-0">{[0,25,50,75,100].map(v=>(<div key={v} className="flex flex-col items-center" style={{position:'absolute',left:`${v}%`,transform:'translateX(-50%)'}}><div className="w-px h-1.5 bg-gray-300"/><span className="text-[9px] text-gray-400 mt-0.5">{v}%</span></div>))}</div><input type="range" min={min} max={max} value={low} onChange={e=>{const v=Math.min(+e.target.value,high-1);onLowChange(v)}} className="absolute top-2 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none z-10" style={{WebkitAppearance:'none',outline:'none'}}/><input type="range" min={min} max={max} value={high} onChange={e=>{const v=Math.max(+e.target.value,low+1);onHighChange(v)}} className="absolute top-2 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none z-20" style={{WebkitAppearance:'none',outline:'none'}}/><div className="absolute top-[-4px] left-0 right-0 pointer-events-none"><div className="absolute text-[10px] font-bold text-red-500 whitespace-nowrap" style={{left:`${lp}%`,transform:'translateX(-50%)'}}>{low}%</div><div className="absolute text-[10px] font-bold text-green-600 whitespace-nowrap" style={{left:`${hp}%`,transform:'translateX(-50%)'}}>{high}%</div></div><style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:18px;width:18px;border-radius:50%;background:#fff;border:3px solid #6366f1;cursor:pointer;pointer-events:auto;box-shadow:0 1px 4px rgba(0,0,0,0.2)}input[type=range]::-moz-range-thumb{height:18px;width:18px;border-radius:50%;background:#fff;border:3px solid #6366f1;cursor:pointer;pointer-events:auto;box-shadow:0 1px 4px rgba(0,0,0,0.2)}input[type=range]::-webkit-slider-runnable-track{height:0;background:transparent}input[type=range]::-moz-range-track{height:0;background:transparent}`}</style></div>)};

const WeightSlider=({boundaries=[17,33,50,67,83],onChange,colors=['#4338ca','#6366f1','#7c3aed','#9333ea','#a855f7','#c084fc']})=>{const trackRef=useRef(null);const[dragIdx,setDragIdx]=useState(null);useEffect(()=>{if(dragIdx===null)return;const onMove=e=>{e.preventDefault();const tr=trackRef.current;if(!tr)return;const rect=tr.getBoundingClientRect();const pct=Math.max(0,Math.min(100,((e.touches?.[0]||e).clientX-rect.left)/rect.width*100));const nb=[...boundaries];nb[dragIdx]=Math.round(pct);for(let i=dragIdx-1;i>=0;i--)if(nb[i]>nb[i+1])nb[i]=nb[i+1];for(let i=dragIdx+1;i<5;i++)if(nb[i]<nb[i-1])nb[i]=nb[i-1];onChange(nb)};const onUp=()=>setDragIdx(null);window.addEventListener('mousemove',onMove);window.addEventListener('mouseup',onUp);window.addEventListener('touchmove',onMove,{passive:false});window.addEventListener('touchend',onUp);return()=>{window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);window.removeEventListener('touchmove',onMove);window.removeEventListener('touchend',onUp)}},[dragIdx,boundaries,onChange]);const weights=[boundaries[0],boundaries[1]-boundaries[0],boundaries[2]-boundaries[1],boundaries[3]-boundaries[2],boundaries[4]-boundaries[3],100-boundaries[4]];return(<div className="relative w-full" style={{height:52,userSelect:'none'}}><div ref={trackRef} className="absolute top-5 left-0 right-0 h-3 bg-gray-200 rounded-full overflow-hidden flex">{weights.map((w,i)=>(<div key={i} style={{width:Math.max(w,0)+'%',background:colors[i],opacity:0.55,minWidth:0}}/>))}</div>{boundaries.map((b,i)=>(<div key={i} className="absolute cursor-grab active:cursor-grabbing" style={{left:b+'%',top:12,transform:'translateX(-50%)',zIndex:30+i,touchAction:'none'}} onMouseDown={e=>{e.preventDefault();setDragIdx(i)}} onTouchStart={e=>{e.preventDefault();setDragIdx(i)}}><div className="w-4 h-4 rounded-full bg-white shadow-md" style={{border:'3px solid '+colors[i]}}/></div>))}<div className="absolute left-0 right-0" style={{top:40}}>{weights.map((w,i)=>{const l=i===0?0:boundaries[i-1];const r=i===5?100:boundaries[i];const c=(l+r)/2;return w>=4?(<div key={i} className="absolute font-bold whitespace-nowrap" style={{left:c+'%',transform:'translateX(-50%)',fontSize:8,color:colors[i]}}>{Math.round(w)}%</div>):null})}</div></div>)};


const getVennZone=(x,y)=>{if(y>320)return'irrelevant';const inL=((x-215)/185)**2+((y-170)/120)**2<=1;const inR=((x-425)/185)**2+((y-170)/120)**2<=1;if(inL&&inR)return'common';if(inL)return'base';if(inR)return'target';return'irrelevant'};
const getRelIcons=item=>{const s=new Set();[...item.baseRels,...item.targetRels].forEach(r=>{if(r.type==='whole')s.add(r.dir==='child'?'○':'◉');else if(r.type==='attribute')s.add(r.dir==='child'?'◇':'◈')});return[...s].join('')};
const originSt=item=>{if(item.defaultPos==='base')return{bg:'#dbeafe',bd:'#93c5fd',c:'#2563eb'};if(item.defaultPos==='target')return{bg:'#dcfce7',bd:'#86efac',c:'#16a34a'};return{bg:'#ede9fe',bd:'#c4b5fd',c:'#7c3aed'}};
const TYPE_META={sequence:{icon:'⏱',color:'#0d9488',cls:'text-teal-600',sep:' ⟫ ',from:'Earlier',to:'Later'},cause:{icon:'⚡',color:'#dc2626',cls:'text-red-600',sep:' → ',from:'Cause',to:'Effect'},'mean-goal':{icon:'🎯',color:'#b45309',cls:'text-amber-700',sep:' → ',from:'Action',to:'Goal'},whole:{icon:'🔵',color:'#2563eb',cls:'text-blue-600',sep:' ○─ ',from:'Whole',to:'Part'},attribute:{icon:'◆',color:'#0891b2',cls:'text-cyan-600',sep:' ◆ ',from:'Object',to:'Attribute'},comparison:{icon:'⇌',color:'#be185d',cls:'text-pink-600',sep:' ⇌ ',from:'Node A',to:'Node B'},analogy:{icon:'🟰',color:'#059669',cls:'text-emerald-600',sep:' ═ ',from:'Base',to:'Target'},source:{icon:'📋',color:'#8b5cf6',cls:'text-purple-600',sep:' → ',from:'Source',to:'Assertion'},link:{icon:'🔗',color:'#6b7280',cls:'text-gray-600',sep:' — ',from:'From',to:'To'},description:{icon:'📦',color:'#4f46e5',cls:'text-indigo-600',sep:' ▣ ',from:'Root',to:'Child'}};

const DEFAULT_LINK_SCHEME='Premise 1 (Base): In the situation under consideration, the sign or symptom S is observed.\nPremise 2 (Symptomatic): S is typically a sign or symptom of P under normal circumstances \u2014 S and P co-occur because S is an expression or manifestation of P.\nConclusion: Therefore, P is true (or is the case).';
const DEFAULT_LINK_CQS='CQ1 \u2014 Validity of Sign: Is S actually characteristic of P? Is the sign genuinely associated with the property asserted in the standpoint?\nCQ2 \u2014 Strength of Co-occurrence: How strong is the relationship between S and P? Does S always accompany P, or only sometimes?\nCQ3 \u2014 Alternative Explanation: Is it possible that S is present but P is not? Could S be caused by something other than P (e.g., rapid breathing due to exercise rather than fever)? Are there other signs present that support the same conclusion?\nCQ4 \u2014 Contradictory Signs: Are there other indicators present that suggest P is not true?\nCQ5 \u2014 Accumulation of Signs: Is there an accumulation of multiple signs that collectively support the conclusion?';
const DEFAULT_LINK_BACKING='1. The claim that S is a sign of P relies on a domain-specific relation between them. The underlying relation may be causal (e.g., thick clouds \u2192 rain), attributive (e.g., CAPTCHA tests selecting marginal elements), similarity-based (e.g., a machine\'s unusual sound predicting imminent failure), or source-based (e.g., a dog barking signalling a stranger\'s approach).\n\n2. Argument from sign is most appropriate when the exact nature of the relationship between S and P is unknown or unspecifiable. The paradigmatic case is quantum entanglement: particle A\'s spin is always opposite to its paired particle B\'s \u2014 but whether this is cause-and-effect, whole-and-part, or some other relation remains an open question. Historically, phenomena like solar eclipses were treated as signs of misfortune. Even today, physicians recognise that certain symptoms indicate specific illnesses without fully understanding the underlying mechanism.\n\n3. This characteristic makes argument from sign available for rhetorical use. Speakers may invoke it instead of a more specific scheme (e.g., argument from cause) precisely to avoid committing to a particular relational claim. Van Eemeren and Grootendorst define this scheme through concomitance \u2014 it describes how a speaker justifies a claim not by demonstrating causation or another specific relation, but by showing that S is simply a representative symptom or feature of P.';

/* ═══════════════════════════════════════════════════════
   ARGMAP CONSTANTS & UTILITIES
   ═══════════════════════════════════════════════════════ */

const AM_NODE_WIDTH = 218;
const AM_NODE_DEFAULT_HEIGHT = 96;
const AM_CORNER_RADIUS = 12;
const AM_JUNCTION_RADIUS = 8;
const AM_MAX_HISTORY = 80;
const AM_ZOOM_LEVELS = [0.25,0.33,0.5,0.67,0.75,0.8,0.9,1,1.1,1.25,1.5,1.75,2];
const AM_TOUCH_DRAG_THRESHOLD = 5;

const AM_NODE_TYPES = {
  claim: { label: "Claim", color: "#3b82f6", Icon: Target },
  "claim-data": { label: "Claim\u2011Premise", color: "#0891b2", Icon: FileText },
  data: { label: "Premise", color: "#059669", Icon: FileText },
  "claim-warrant": { label: "Claim\u2011Warrant", color: "#7c3aed", Icon: ArrowRight },
  warrant: { label: "Warrant", color: "#8b5cf6", Icon: ArrowRight },
  "claim-backing": { label: "Claim\u2011Backing", color: "#4f46e5", Icon: Shield },
  backing: { label: "Backing", color: "#6366f1", Icon: Shield },
  "claim-qualifier": { label: "Claim\u2011Qualifier", color: "#b45309", Icon: HelpCircle },
  qualifier: { label: "Qualifier", color: "#d97706", Icon: HelpCircle },
  "claim-rebuttal": { label: "Claim\u2011Rebuttal", color: "#dc2626", Icon: AlertTriangle },
  rebuttal: { label: "Rebuttal", color: "#ef4444", Icon: AlertTriangle },
  "claim-cq": { label: "Claim\u2011Critical Question", color: "#db2777", Icon: MessageCircleQuestion },
  cq: { label: "Critical Question", color: "#ec4899", Icon: MessageCircleQuestion },
};

const AM_EDGE_STYLES = {
  support: { color: "#059669", dash: "", label: "Support", arrow: true },
  attack: { color: "#ef4444", dash: "6,3", label: "Attack", arrow: true },
  qualify: { color: "#d97706", dash: "4,4", label: "Qualify", arrow: true },
  question: { color: "#ec4899", dash: "3,3", label: "Question", arrow: true },
  link: { color: "#0d9488", dash: "", label: "Link", arrow: false },
};

const AM_WALTON_TYPES = {
  "cause-effect":{ label:"Cause and Effect", short:"Cause & Effect", subs:{ "cause-to-effect":"From Cause to Effect","effect-to-cause":"From Effect to Cause","from-consequence":"From Consequence" }},
  "whole-part":{ label:"Whole and Part", short:"Whole & Part", subs:{ "from-syllogism":"From Syllogism (whole to part)","from-definition":"From Definition (whole to part)","from-example":"From Example (part to whole)","from-paradigm":"From Paradigm (part to whole to part)" }},
  analogy:{ label:"Analogy", short:"Analogy", subs:{ "same-domain":"Same Domain","different-domains":"Different Domains" }},
  "info-source":{ label:"Information Source", short:"Info Source", subs:{ "from-orthodox":"From Orthodox","from-authority":"From Authority","from-expert-opinion":"From Expert Opinion","from-popular-opinion":"From Popular Opinion" }},
  custom:{ label:"Custom", short:"Custom", subs:{ "from-sign":"From Sign" } },
};

const AM_PRESET_CQ = {
  "cause-effect":{ "cause-to-effect":["CQ1: How strong is the causal link between A and B?","CQ2: Are there interfering factors that could prevent B?","CQ3: Is the evidence for the causal claim reliable?"], "effect-to-cause":["CQ1: Could B have been caused by something other than A?","CQ2: How strong is the reverse causal inference?","CQ3: Are there other plausible explanations?"], "from-consequence":["CQ1: How likely are the predicted consequences?","CQ2: Are there countervailing consequences?","CQ3: Are the consequences correctly evaluated?"] },
  "whole-part":{ "from-syllogism":["CQ1: Is the major premise (universal claim) actually true?","CQ2: Does the specific case truly fall under the major premise?","CQ3: Are there exceptions to the universal claim?"], "from-definition":["CQ1: Is the definition widely accepted?","CQ2: Does X truly satisfy all criteria of the definition?","CQ3: Are there borderline or exceptional cases?"], "from-example":["CQ1: Is the example typical or representative?","CQ2: Is the example verified as genuine?","CQ3: Are there counter-examples?"], "from-paradigm":["CQ1: Is the paradigm case genuinely representative?","CQ2: Does the new case share the relevant features of the paradigm?","CQ3: Are there disanalogies between the paradigm and the new case?"] },
  analogy:{ "same-domain":["CQ1: Are there relevant differences between the cases?","CQ2: Is the similarity strong enough?","CQ3: Is the inferred property the right one to compare?"], "different-domains":["CQ1: Are the domains sufficiently similar?","CQ2: Are there relevant structural differences?","CQ3: Does the analogy break down at critical points?"] },
  "info-source":{ "from-orthodox":["CQ1: Is the tradition or orthodoxy well-established and widely accepted?","CQ2: Is the appeal to orthodoxy relevant to the current context?","CQ3: Are there good reasons to deviate from the tradition?"], "from-authority":["CQ1: Is the authority a legitimate source?","CQ2: Is the authority an expert in the relevant field?","CQ3: Is there agreement among authorities?"], "from-expert-opinion":["CQ1: Is E a genuine expert in domain D?","CQ2: Is A within E\u2019s domain D?","CQ3: Is E personally reliable and unbiased?","CQ4: Is A consistent with what other experts say?","CQ5: Is E\u2019s assertion based on evidence?"], "from-popular-opinion":["CQ1: Is the popular opinion well-founded?","CQ2: Are there reasons to think the majority is wrong?","CQ3: Is the sample representative?"] },
  custom:{ "from-sign":["CQ1: Is the sign genuinely associated with the property claimed?","CQ2: How strong is the co-occurrence between sign and property?","CQ3: Could the sign be present without the property (alternative explanation)?","CQ4: Are there contradictory signs?","CQ5: Is there an accumulation of signs supporting the conclusion?"] },
};

const AM_TEXT_COLORS = ["#000000","#374151","#dc2626","#ea580c","#d97706","#16a34a","#0d9488","#2563eb","#7c3aed","#db2777"];
const AM_HIGHLIGHT_COLORS = ["transparent","#fef08a","#bbf7d0","#bae6fd","#fecaca","#fed7aa","#ddd6fe","#fbcfe8","#fde68a","#d1d5db"];

const AM_RICH_CONTENT_CSS = `
.rc img{max-width:100%;height:auto;border-radius:4px;margin:2px 0;max-height:120px;object-fit:contain}
.rc a{color:#3b82f6;text-decoration:underline;pointer-events:none}
.rc ul,.rc ol{margin:2px 0;padding-left:18px;font-size:inherit}.rc ul{list-style-type:disc}.rc ol{list-style-type:decimal}.rc li{margin:1px 0}.rc p{margin:0}
.rc-editor img{max-width:100%;height:auto;border-radius:6px;margin:4px 0;max-height:240px;object-fit:contain}
.rc-editor a{color:#3b82f6;text-decoration:underline}
.rc-editor ul,.rc-editor ol{margin:4px 0;padding-left:22px}.rc-editor ul{list-style-type:disc}.rc-editor ol{list-style-type:decimal}.rc-editor li{margin:2px 0}
.rc-editor:empty::before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none}.rc-editor:focus{outline:none}.rc-editor{word-break:break-word}
.color-palette-backdrop{position:fixed;top:0;left:0;right:0;bottom:0;z-index:58}
.color-palette-panel{position:absolute;left:50%;transform:translateX(-50%);top:calc(100% + 6px);z-index:60;background:#fff;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.18);border:1px solid #e5e7eb;padding:8px}
.color-palette-panel .palette-title{font-size:10px;font-weight:600;color:#6b7280;margin-bottom:5px;text-align:center;text-transform:uppercase;letter-spacing:.04em}
.color-palette-panel .palette-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.color-palette-panel .palette-swatch{width:26px;height:26px;border-radius:6px;border:2px solid #d1d5db;cursor:pointer;transition:transform .1s,border-color .15s;position:relative}
.color-palette-panel .palette-swatch:hover{transform:scale(1.22);border-color:#3b82f6}
.color-palette-panel .palette-swatch.swatch-none{background:repeating-linear-gradient(-45deg,#fff,#fff 3px,#ef4444 3px,#ef4444 4px)}
`;

let amIdCounter = 10000;
function amNid(){ return "n"+ ++amIdCounter; }
function amEid(){ return "e"+ ++amIdCounter; }
function amIsEdge(id){ return id && typeof id==="string" && id.startsWith("e"); }
function amIsHtmlEmpty(h){ if(!h)return true; if(h.indexOf("<img")>=0)return false; return h.replace(/<[^>]*>/g,"").replace(/&nbsp;/g," ").trim().length===0; }

function amGetWarrantTag(n){
  if(!n.warrantType) return null;
  if(n.warrantType==="custom"){ const t=n.customTypeName||"Custom"; return t+(n.customSubtypeName?" > "+n.customSubtypeName:""); }
  const w=AM_WALTON_TYPES[n.warrantType]; if(!w) return null;
  return w.short+(n.warrantSubtype&&w.subs[n.warrantSubtype]?" > "+w.subs[n.warrantSubtype]:"");
}

function amGetPresetCQs(wt,ws){
  if(!wt||!AM_PRESET_CQ[wt]) return [];
  if(ws&&AM_PRESET_CQ[wt][ws]) return AM_PRESET_CQ[wt][ws];
  if(!ws) return [...new Set(Object.values(AM_PRESET_CQ[wt]).flat())];
  return [];
}

function amIsWarrantType(t){ return t==='warrant'||t==='claim-warrant'; }
function amIsCqType(t){ return t==='cq'||t==='claim-cq'; }
function amIsPremiseType(t){ return t==='data'||t==='claim-data'; }

function amFindLinkedWarrant(cqId,edges,nodes,visited){
  if(!visited) visited=new Set();
  if(visited.has(cqId)) return null;
  visited.add(cqId);
  for(const e of edges){ if(e.from!==cqId) continue;
    if(!amIsEdge(e.to)){ const t=nodes.find(n=>n.id===e.to);
      if(t&&amIsWarrantType(t.type)) return t;
      if(t&&amIsCqType(t.type)){ const w=amFindLinkedWarrant(t.id,edges,nodes,visited); if(w) return w; }
    }
    if(amIsEdge(e.to)){ const te=edges.find(x=>x.id===e.to); if(te){ const f=nodes.find(n=>n.id===te.from); if(f&&amIsWarrantType(f.type)) return f; if(!amIsEdge(te.to)){ const t2=nodes.find(n=>n.id===te.to); if(t2&&amIsWarrantType(t2.type)) return t2; } } }
  } return null;
}

function amFindLinkedCQ(cqId,edges,nodes){
  for(const e of edges){ if(e.from!==cqId) continue;
    if(!amIsEdge(e.to)){ const t=nodes.find(n=>n.id===e.to); if(t&&amIsCqType(t.type)) return t; }
  } return null;
}

function amFindLinkedPeers(nodeId,edges){
  const peers=new Set(),visited=new Set([nodeId]),q=[nodeId];
  const resolveToNode=(ep)=>{
    if(!amIsEdge(ep)) return ep;
    const te=edges.find(x=>x.id===ep);
    return te&&!amIsEdge(te.from)?te.from:null;
  };
  while(q.length){ const c=q.shift(); for(const e of edges){ if(e.type!=="link") continue;
    const fn=resolveToNode(e.from), tn=resolveToNode(e.to);
    let o=null;
    if(fn===c&&tn&&tn!==c) o=tn;
    else if(tn===c&&fn&&fn!==c) o=fn;
    if(o&&!visited.has(o)){ visited.add(o); peers.add(o); q.push(o); } } }
  return peers;
}

function amGetBorderPoint(node,tx,ty,h){
  const w=AM_NODE_WIDTH,r=AM_CORNER_RADIUS,cx=node.x+w/2,cy=node.y+h/2,dx=tx-cx,dy=ty-cy;
  if(!dx&&!dy) return {x:cx,y:cy};
  const sx=Math.abs(dx)>1e-6?w/2/Math.abs(dx):1e8,sy=Math.abs(dy)>1e-6?h/2/Math.abs(dy):1e8,s=Math.min(sx,sy);
  let ix=cx+dx*s,iy=cy+dy*s;
  const corners=[{cx:node.x+r,cy:node.y+r,a:ix<node.x+r&&iy<node.y+r},{cx:node.x+w-r,cy:node.y+r,a:ix>node.x+w-r&&iy<node.y+r},{cx:node.x+r,cy:node.y+h-r,a:ix<node.x+r&&iy>node.y+h-r},{cx:node.x+w-r,cy:node.y+h-r,a:ix>node.x+w-r&&iy>node.y+h-r}];
  for(const c of corners){ if(c.a){ const cdx=ix-c.cx,cdy=iy-c.cy,cd=Math.sqrt(cdx*cdx+cdy*cdy); if(cd>.01){ix=c.cx+cdx/cd*r;iy=c.cy+cdy/cd*r;} break; } }
  return {x:ix,y:iy};
}

function amApplyAutoClaimData(nodes,edges){
  const DUAL_MAP={data:"claim-data",warrant:"claim-warrant",backing:"claim-backing",qualifier:"claim-qualifier",rebuttal:"claim-rebuttal",cq:"claim-cq"};
  const REV_MAP={"claim-data":"data","claim-warrant":"warrant","claim-backing":"backing","claim-qualifier":"qualifier","claim-rebuttal":"rebuttal","claim-cq":"cq"};
  return nodes.map(node=>{
    const baseType=REV_MAP[node.type]||node.type;
    const claimType=DUAL_MAP[baseType];
    if(!claimType) return node;
    const hasPremiseSupport=edges.some(e=>{
      if(e.to!==node.id||e.type!=="support") return false;
      if(amIsEdge(e.from)) return false;
      const src=nodes.find(n=>n.id===e.from);
      return src&&amIsPremiseType(src.type);
    });
    if(hasPremiseSupport) return node.type===claimType?node:{...node,type:claimType};
    return node.type===baseType?node:{...node,type:baseType};
  });
}

function amTouchDist(a,b){ return Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY); }

/* ── useHistory hook for ArgMap ── */
function useAmHistory(init){
  const [st,setSt]=useState({stack:[init],index:0});
  const cur=st.stack[st.index];
  const push=useCallback(u=>{setSt(p=>{const c=p.stack[p.index];const nv=typeof u==="function"?u(c):u;const ns=p.stack.slice(0,p.index+1);ns.push(nv);if(ns.length>AM_MAX_HISTORY)ns.shift();return{stack:ns,index:ns.length-1};});},[]);
  const undo=useCallback(()=>{setSt(p=>({...p,index:Math.max(0,p.index-1)}));},[]);
  const redo=useCallback(()=>{setSt(p=>({...p,index:Math.min(p.index+1,p.stack.length-1)}));},[]);
  const reset=useCallback(v=>{setSt({stack:[v],index:0});},[]);
  return {current:cur,push,undo,redo,canUndo:st.index>0,canRedo:st.index<st.stack.length-1,reset};
}

/* ── ArgMap Schemes ── */
function amBuildSchemes(){
  return [
    { name:"Basic Toulmin Layout", desc:"Warrant, qualifier & rebuttal on inference edge", generate(){ const ids=Array.from({length:6},()=>amNid()); const me=amEid(); return { nodes:[ {id:ids[0],type:"data",text:"Premise: The evidence or facts",x:50,y:155},{id:ids[1],type:"claim",text:"Claim: The conclusion being argued",x:560,y:155},{id:ids[2],type:"warrant",text:"Warrant: Logical bridge from data to claim",x:270,y:340,warrantType:null,warrantSubtype:null,customTypeName:"",customSubtypeName:""},{id:ids[3],type:"backing",text:"Backing: Support for the warrant",x:270,y:500},{id:ids[4],type:"qualifier",text:"Qualifier: Probably, presumably...",x:270,y:10},{id:ids[5],type:"rebuttal",text:"Rebuttal: Unless exception applies",x:560,y:340} ], edges:[ {id:me,from:ids[0],to:ids[1],type:"support"},{id:amEid(),from:ids[2],to:me,type:"support"},{id:amEid(),from:ids[3],to:ids[2],type:"support"},{id:amEid(),from:ids[4],to:me,type:"qualify"},{id:amEid(),from:ids[5],to:me,type:"attack"} ] }; } },
    { name:"Linked Argument", desc:"Multiple premises linked together supporting a claim", generate(){ const ids=Array.from({length:6},()=>amNid()); const me=amEid(); return { nodes:[ {id:ids[0],type:"data",text:"Premise A",x:30,y:60},{id:ids[1],type:"data",text:"Premise B",x:30,y:240},{id:ids[2],type:"data",text:"Premise C",x:30,y:420},{id:ids[3],type:"claim",text:"Conclusion",x:530,y:200},{id:ids[4],type:"warrant",text:"Warrant: Why these premises together support the claim",x:280,y:500,warrantType:null,warrantSubtype:null,customTypeName:"",customSubtypeName:""},{id:ids[5],type:"qualifier",text:"Necessarily",x:530,y:30} ], edges:[ {id:amEid(),from:ids[0],to:ids[1],type:"link"},{id:amEid(),from:ids[1],to:ids[2],type:"link"},{id:me,from:ids[0],to:ids[3],type:"support"},{id:amEid(),from:ids[1],to:ids[3],type:"support"},{id:amEid(),from:ids[2],to:ids[3],type:"support"},{id:amEid(),from:ids[4],to:me,type:"support"},{id:amEid(),from:ids[5],to:ids[3],type:"qualify"} ] }; } },
    { name:"Serial Argument (Chain)", desc:"Conclusions become premises for the next", generate(){ const ids=Array.from({length:8},()=>amNid()); const e1=amEid(), e2=amEid(); return { nodes:[ {id:ids[0],type:"data",text:"Premise A: Initial evidence",x:30,y:150},{id:ids[1],type:"data",text:"Premise B: Intermediate conclusion & further premise",x:300,y:150},{id:ids[2],type:"claim",text:"Claim C: Final conclusion",x:570,y:150},{id:ids[3],type:"warrant",text:"Warrant W1",x:140,y:340,warrantType:null,warrantSubtype:null,customTypeName:"",customSubtypeName:""},{id:ids[4],type:"warrant",text:"Warrant W2",x:410,y:340,warrantType:null,warrantSubtype:null,customTypeName:"",customSubtypeName:""},{id:ids[5],type:"backing",text:"Backing for W1",x:140,y:500},{id:ids[6],type:"backing",text:"Backing for W2",x:410,y:500},{id:ids[7],type:"qualifier",text:"Presumably",x:570,y:10} ], edges:[ {id:e1,from:ids[0],to:ids[1],type:"support"},{id:e2,from:ids[1],to:ids[2],type:"support"},{id:amEid(),from:ids[3],to:e1,type:"support"},{id:amEid(),from:ids[4],to:e2,type:"support"},{id:amEid(),from:ids[5],to:ids[3],type:"support"},{id:amEid(),from:ids[6],to:ids[4],type:"support"},{id:amEid(),from:ids[7],to:ids[2],type:"qualify"} ] }; } },
    { name:"Argument from Expert Opinion", desc:"Info Source > Expert Opinion + CQs", generate(){ const ids=Array.from({length:10},()=>amNid()); const me=amEid(); return { nodes:[ {id:ids[0],type:"data",text:"E is an expert in domain D",x:30,y:60},{id:ids[1],type:"data",text:"E asserts that A is true",x:30,y:240},{id:ids[2],type:"claim",text:"A is true (plausibly)",x:530,y:140},{id:ids[3],type:"warrant",text:"Expert assertions within their domain are reliable",x:250,y:420,warrantType:"info-source",warrantSubtype:"from-expert-opinion",customTypeName:"",customSubtypeName:""},{id:ids[4],type:"backing",text:"E\u2019s credentials",x:250,y:590},{id:ids[5],type:"qualifier",text:"Presumably",x:530,y:10},{id:ids[6],type:"rebuttal",text:"Unless E is biased",x:560,y:420},{id:ids[7],type:"cq",text:"Is E a genuine expert in D?",x:730,y:340,cqSchematic:"CQ1: Is E a genuine expert in domain D?"},{id:ids[8],type:"cq",text:"Is A within E\u2019s domain D?",x:730,y:480,cqSchematic:"CQ2: Is A within E\u2019s domain D?"},{id:ids[9],type:"cq",text:"Is E reliable / unbiased?",x:730,y:620,cqSchematic:"CQ3: Is E personally reliable and unbiased?"} ], edges:[ {id:amEid(),from:ids[0],to:ids[1],type:"link"},{id:amEid(),from:ids[0],to:ids[2],type:"support"},{id:me,from:ids[1],to:ids[2],type:"support"},{id:amEid(),from:ids[3],to:me,type:"support"},{id:amEid(),from:ids[4],to:ids[3],type:"support"},{id:amEid(),from:ids[5],to:ids[2],type:"qualify"},{id:amEid(),from:ids[6],to:me,type:"attack"},{id:amEid(),from:ids[7],to:ids[3],type:"question"},{id:amEid(),from:ids[8],to:ids[3],type:"question"},{id:amEid(),from:ids[9],to:ids[3],type:"question"} ] }; } },
    { name:"Cause to Effect", desc:"Cause & Effect + CQs", generate(){ const ids=Array.from({length:9},()=>amNid()); const me=amEid(); return { nodes:[ {id:ids[0],type:"data",text:"Event A has occurred",x:50,y:155},{id:ids[1],type:"claim",text:"Event B will occur",x:560,y:155},{id:ids[2],type:"warrant",text:"A generally causes B",x:270,y:340,warrantType:"cause-effect",warrantSubtype:"cause-to-effect",customTypeName:"",customSubtypeName:""},{id:ids[3],type:"backing",text:"Empirical evidence",x:270,y:500},{id:ids[4],type:"qualifier",text:"Very likely",x:270,y:10},{id:ids[5],type:"rebuttal",text:"Unless intervening factors",x:560,y:340},{id:ids[6],type:"cq",text:"How strong is the causal link?",x:560,y:510,cqSchematic:"CQ1: How strong is the causal link between A and B?"},{id:ids[7],type:"cq",text:"Interfering factors?",x:760,y:340,cqSchematic:"CQ2: Are there interfering factors that could prevent B?"},{id:ids[8],type:"cq",text:"Evidence reliable?",x:760,y:510,cqSchematic:"CQ3: Is the evidence for the causal claim reliable?"} ], edges:[ {id:me,from:ids[0],to:ids[1],type:"support"},{id:amEid(),from:ids[2],to:me,type:"support"},{id:amEid(),from:ids[3],to:ids[2],type:"support"},{id:amEid(),from:ids[4],to:me,type:"qualify"},{id:amEid(),from:ids[5],to:me,type:"attack"},{id:amEid(),from:ids[6],to:ids[2],type:"question"},{id:amEid(),from:ids[7],to:ids[2],type:"question"},{id:amEid(),from:ids[8],to:ids[2],type:"question"} ] }; } },
    { name:"Argument from Analogy", desc:"Analogy + CQs", generate(){ const ids=Array.from({length:10},()=>amNid()); const me=amEid(); return { nodes:[ {id:ids[0],type:"data",text:"Case C1 has property P",x:30,y:60},{id:ids[1],type:"data",text:"Case C2 is similar to C1",x:30,y:240},{id:ids[2],type:"claim",text:"C2 also has property P",x:530,y:140},{id:ids[3],type:"warrant",text:"Similar cases share similar properties",x:250,y:420,warrantType:"analogy",warrantSubtype:null,customTypeName:"",customSubtypeName:""},{id:ids[4],type:"backing",text:"Relevant similarities",x:250,y:590},{id:ids[5],type:"qualifier",text:"Plausibly",x:530,y:10},{id:ids[6],type:"rebuttal",text:"Unless they differ critically",x:560,y:420},{id:ids[7],type:"cq",text:"Relevant differences?",x:730,y:340,cqSchematic:"CQ1: Are there relevant differences between the cases?"},{id:ids[8],type:"cq",text:"Right property?",x:730,y:480,cqSchematic:"CQ3: Is the inferred property the right one to compare?"},{id:ids[9],type:"cq",text:"Counter-analogy?",x:730,y:620,cqSchematic:"CQ2: Is the similarity strong enough?"} ], edges:[ {id:amEid(),from:ids[0],to:ids[1],type:"link"},{id:me,from:ids[0],to:ids[2],type:"support"},{id:amEid(),from:ids[1],to:ids[2],type:"support"},{id:amEid(),from:ids[3],to:me,type:"support"},{id:amEid(),from:ids[4],to:ids[3],type:"support"},{id:amEid(),from:ids[5],to:ids[2],type:"qualify"},{id:amEid(),from:ids[6],to:me,type:"attack"},{id:amEid(),from:ids[7],to:ids[3],type:"question"},{id:amEid(),from:ids[8],to:ids[3],type:"question"},{id:amEid(),from:ids[9],to:ids[3],type:"question"} ] }; } },
    { name:"Argument from Definition", desc:"Whole & Part > Definition + CQs", generate(){ const ids=Array.from({length:9},()=>amNid()); const me=amEid(); return { nodes:[ {id:ids[0],type:"data",text:"X satisfies the definition of Y",x:50,y:155},{id:ids[1],type:"claim",text:"X is classified as Y",x:560,y:155},{id:ids[2],type:"warrant",text:"Meeting the definition entails membership",x:270,y:340,warrantType:"whole-part",warrantSubtype:"from-definition",customTypeName:"",customSubtypeName:""},{id:ids[3],type:"backing",text:"Accepted definition of Y",x:270,y:500},{id:ids[4],type:"qualifier",text:"Necessarily",x:270,y:10},{id:ids[5],type:"rebuttal",text:"Unless the definition is contested",x:560,y:340},{id:ids[6],type:"cq",text:"Definition widely accepted?",x:560,y:510,cqSchematic:"CQ1: Is the definition widely accepted?"},{id:ids[7],type:"cq",text:"X truly satisfies all criteria?",x:760,y:340,cqSchematic:"CQ2: Does X truly satisfy all criteria of the definition?"},{id:ids[8],type:"cq",text:"Borderline cases?",x:760,y:510,cqSchematic:"CQ3: Are there borderline or exceptional cases?"} ], edges:[ {id:me,from:ids[0],to:ids[1],type:"support"},{id:amEid(),from:ids[2],to:me,type:"support"},{id:amEid(),from:ids[3],to:ids[2],type:"support"},{id:amEid(),from:ids[4],to:me,type:"qualify"},{id:amEid(),from:ids[5],to:me,type:"attack"},{id:amEid(),from:ids[6],to:ids[2],type:"question"},{id:amEid(),from:ids[7],to:ids[2],type:"question"},{id:amEid(),from:ids[8],to:ids[2],type:"question"} ] }; } },
  ];
}
const AM_SCHEMES = amBuildSchemes();

/* ═══════════════════════════════════════════════════════
   AI PROVIDER CONSTANTS
   ═══════════════════════════════════════════════════════ */
const AI_PROVIDERS = {
  openai: { label:'OpenAI', defaultModel:'gpt-4o-mini', models:['gpt-4o-mini','gpt-4o','gpt-3.5-turbo'], endpoint:'https://api.openai.com/v1/chat/completions', type:'openai' },
  gemini: {
	label: 'Google Gemini',
	defaultModel: 'gemini-2.5-flash',
	models: [
		'gemini-2.5-flash',
		'gemini-2.5-pro',
		'gemini-2.0-flash',
		'gemini-flash-latest',
		'gemini-pro-latest'
	],
	endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
	type: 'gemini'
	},
	  alibaba: {
		label: 'Alibaba Cloud (Qwen)',
		defaultModel: 'qwen-plus',
		models: [
		'qwen-turbo',
		'qwen-turbo-latest',
		'qwen-plus',
		'qwen-plus-latest',
		'qwen-max',
		'qwen-max-latest',
		'qwen-long'
		],
		endpoint: 'https://cn-hongkong.dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
		type: 'openai'
	},
  deepseek: { 
    label:'DeepSeek', 
    defaultModel:'deepseek-chat', 
    models:['deepseek-chat','deepseek-reasoner'], 
    endpoint:'https://api.deepseek.com/chat/completions',
    type:'openai' 
	},
	
  };

const ALIBABA_REGIONS = {
  intl:   { label:'International (Singapore)', endpoint:'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions' },
  hk:     { label:'China (Hong Kong)',         endpoint:'https://cn-hongkong.dashscope.aliyuncs.com/compatible-mode/v1/chat/completions' },
  cn:     { label:'China (Mainland)',          endpoint:'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions' },
};

const AI_TEXT_LENGTHS = {
  sentence: { label:'1–2 Sentences', words:'20–40 words', maxTokens:200, desc:'A single argumentative statement' },
  paragraph: { label:'Paragraph', words:'100–200 words', maxTokens:600, desc:'5–8 sentences developing one point' },
  passage: { label:'Passage', words:'300–500 words', maxTokens:1000, desc:'3–5 paragraphs with full argument' },
};

const AAA_SYSTEM_PROMPT=`You are an expert argumentation analyst using a post-Toulmin framework based on Douglas Walton's theory of argumentation schemes. The warrant is the CORE of argument analysis — it determines the argumentation scheme type.

MICRO-STRUCTURE (per argument unit):
- CLAIM: conclusion being argued (expressed or unexpressed/implicit)
- PREMISES: the expressed evidence or reasons offered to support, justify, or lead to the claim (the conclusion)
- WARRANT: reasoning principle or inference license connecting premises to claim. Determines the scheme:
  1. "cause-effect": subtypes "cause-to-effect", "effect-to-cause", "from-consequence" (practical reasoning: goal justifies action — most common in daily decisions)
  2. "whole-part (class-attribute)": subtypes "from-syllogism" (whole→part), "from-definition" (class→distinguishing attributes), "from-example" (part→whole), "from-paradigm" (part→whole→part)
  3. "analogy": subtypes "same-domain", "different-domains (simile or metaphor)"
  4. "info-source": subtypes "from-orthodox (tradition)", "from-authority" (law, Government, regulation), "from-expert-opinion" (knowledge), "from-popular-opinion" (experience) 
  5. "custom": subtypes "from-sign" or describe your own for miscellaneous scheme
- BACKING: underlying knowledge base that supports or validates the warrant (optional)
- QUALIFIER: degree of certainty e.g. "probably" (optional)
- REBUTTAL: statement that certain CQs are unsatisfied, i.e. exception/counterargument (optional)
- CRITICAL QUESTIONS: scheme-specific challenges; when satisfied, no fallacy (optional)

MACRO-STRUCTURE:
- Serial: A1's claim becomes A2's premise (any element can become a claim to be justified)
- Convergent: multiple independent arguments support same claim
- Linked: premises work together (not independently)

Output ONLY valid JSON (no markdown fences, no commentary):
{
  "arguments":[
    {
      "id":"A1",
      "claim":{"text":"...","expressed":true},
      "premises":[{"id":"P1","text":"...","expressed":true}],
      "warrant":{"text":"reasoning principle","schemeType":"cause-effect","schemeSubtype":"from-consequence"},
      "backing":{"text":"..."} or null,
      "qualifier":{"text":"..."} or null,
      "rebuttal":{"text":"..."} or null,
      "criticalQuestions":[{"text":"...","schematic":"CQ1: ..."}],
      "linkedPremiseIds":["P1","P2"] or null
    }
  ],
  "serialLinks":[{"fromArgId":"A1","toArgId":"A2"}]
}

Rules:
- Each argument unit needs one claim, ≥1 premise, and one warrant
- schemeType must be: "cause-effect","whole-part","analogy","info-source","custom"
- schemeSubtype must match valid subtypes above
- "expressed":false for implicit elements
- Identify ALL arguments including sub-arguments forming serial/convergent structures
- For practical reasoning (from-consequence), the premise is the goal/desired outcome and the claim is the action recommended`;


/* ── ArgMap Color Palette Panel ── */
function AmColorPalettePanel({label,colors,onPick,onClose}){
  return <div className="color-palette-panel" onMouseDown={e=>{e.preventDefault();e.stopPropagation()}}><div className="palette-title">{label}</div><div className="palette-grid">{colors.map((c,i)=>{const none=c==="transparent";return <button key={i} className={"palette-swatch"+(none?" swatch-none":"")} style={none?{}:{background:c}} title={none?"Remove":c} onMouseDown={e=>{e.preventDefault();e.stopPropagation()}} onClick={()=>{onPick(c);onClose()}} />;})}</div></div>;
}

/* ── ArgMap Toolbar Button ── */
function AmToolbarButton({onClick,title,active,children}){
  return <button type="button" onClick={onClick} title={title} className={"p-1.5 rounded hover:bg-gray-200 transition-colors "+(active?"bg-blue-100 text-blue-600":"text-gray-600")} onMouseDown={e=>e.preventDefault()}>{children}</button>;
}

/* ── ArgMap RichTextEditor (for node editing) ── */
function AmRichTextEditor({initialValue,onChange,onSave,placeholder,minHeight,editorClassName}){
  const edRef=useRef(null),fiRef=useRef(null);
  const [stc,setSTC]=useState(false),[shc,setSHC]=useState(false);
  const [amCropMd,setAmCropMd]=useState(null);
  const amSelImgRef=useRef(null);
  useEffect(()=>{if(edRef.current)edRef.current.innerHTML=initialValue||"";},[]);
  function exec(cmd,val){if(edRef.current)edRef.current.focus();document.execCommand(cmd,false,val||null);sync();}
  function sync(){if(onChange&&edRef.current){const imgs=[...edRef.current.querySelectorAll('img')];const ols=imgs.map(i=>i.style.outline);imgs.forEach(i=>{i.style.outline=''});onChange(edRef.current.innerHTML);imgs.forEach((i,idx)=>{i.style.outline=ols[idx]});}}
  function insImg(url){if(edRef.current)edRef.current.focus();document.execCommand("insertImage",false,url);sync();}
  function onFile(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>insImg(ev.target.result);r.readAsDataURL(f);e.target.value="";}
  function onPaste(e){const it=e.clipboardData&&e.clipboardData.items;if(it){for(let i=0;i<it.length;i++){if(it[i].type.indexOf("image/")===0){e.preventDefault();const f=it[i].getAsFile();const r=new FileReader();r.onload=ev=>insImg(ev.target.result);r.readAsDataURL(f);return;}}}setTimeout(sync,10);}
  function onDrop(e){const fs=e.dataTransfer&&e.dataTransfer.files;if(fs&&fs.length>0&&fs[0].type.indexOf("image/")===0){e.preventDefault();const r=new FileReader();r.onload=ev=>insImg(ev.target.result);r.readAsDataURL(fs[0]);}}
  function promptImg(){const u=window.prompt("Enter image URL:");if(u)insImg(u);}
  function promptLink(){const u=window.prompt("Enter link URL:");if(u)exec("createLink",u);}
  function closeP(){setSTC(false);setSHC(false);}
  function clearFmt(){if(edRef.current)edRef.current.focus();document.execCommand("removeFormat",false,null);document.execCommand("hiliteColor",false,"transparent");sync();}
  function onKD(e){if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();if(onSave)onSave();}}
  const cls=editorClassName||"rc-editor";
  return <><div className="border rounded-lg border-gray-300 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent relative">
    {(stc||shc)&&<div className="color-palette-backdrop" onClick={closeP} onMouseDown={e=>e.preventDefault()}/>}
    <div className="flex flex-wrap items-center gap-0.5 px-1.5 py-1 bg-gray-50 border-b border-gray-200 rounded-t-lg" style={{position:"relative",zIndex:59}}>
      <AmToolbarButton onClick={()=>{closeP();exec("bold")}} title="Bold"><span className="text-xs font-black w-3.5 text-center block">B</span></AmToolbarButton>
      <AmToolbarButton onClick={()=>{closeP();exec("italic")}} title="Italic"><span className="text-xs italic w-3.5 text-center block">I</span></AmToolbarButton>
      <AmToolbarButton onClick={()=>{closeP();exec("underline")}} title="Underline"><span className="text-xs underline w-3.5 text-center block">U</span></AmToolbarButton>
      <AmToolbarButton onClick={()=>{closeP();exec("strikeThrough")}} title="Strike"><span className="text-xs line-through w-3.5 text-center block">S</span></AmToolbarButton>
      <div className="w-px h-5 bg-gray-300 mx-0.5"/>
      <div style={{position:"relative"}}><AmToolbarButton onClick={()=>{setSHC(false);setSTC(!stc)}} title="Text Color"><span className="text-xs font-bold w-3.5 text-center block" style={{color:"#dc2626",borderBottom:"3px solid #dc2626",lineHeight:"14px"}}>A</span></AmToolbarButton>{stc&&<AmColorPalettePanel label="Text Color" colors={AM_TEXT_COLORS} onPick={c=>exec("foreColor",c)} onClose={()=>setSTC(false)}/>}</div>
      <div style={{position:"relative"}}><AmToolbarButton onClick={()=>{setSTC(false);setSHC(!shc)}} title="Highlight"><span className="text-xs font-bold w-3.5 text-center block px-0.5 rounded" style={{background:"#fef08a",lineHeight:"18px"}}>H</span></AmToolbarButton>{shc&&<AmColorPalettePanel label="Highlight" colors={AM_HIGHLIGHT_COLORS} onPick={c=>exec("hiliteColor",c==="transparent"?"#ffffff":c)} onClose={()=>setSHC(false)}/>}</div>
      <div className="w-px h-5 bg-gray-300 mx-0.5"/>
      <AmToolbarButton onClick={()=>{closeP();promptImg()}} title="Image URL"><ImageIcon size={14}/></AmToolbarButton>
      <AmToolbarButton onClick={()=>{closeP();fiRef.current?.click()}} title="Upload Image"><Upload size={14}/></AmToolbarButton>
      <AmToolbarButton onClick={()=>{closeP();promptLink()}} title="Link"><LinkIcon size={14}/></AmToolbarButton>
      <div className="w-px h-5 bg-gray-300 mx-0.5"/>
      <AmToolbarButton onClick={()=>{closeP();exec("insertUnorderedList")}} title="Bullets"><List size={14}/></AmToolbarButton>
      <AmToolbarButton onClick={()=>{closeP();exec("insertOrderedList")}} title="Numbers"><ListOrdered size={14}/></AmToolbarButton>
      <div className="w-px h-5 bg-gray-300 mx-0.5"/>
      <AmToolbarButton onClick={()=>{closeP();clearFmt()}} title="Clear"><X size={14}/></AmToolbarButton>
      <div className="w-px h-5 bg-gray-300 mx-0.5"/>
      <AmToolbarButton onClick={()=>{closeP();if(amSelImgRef.current)setAmCropMd({imgEl:amSelImgRef.current,src:amSelImgRef.current.src})}} title="Crop Image"><span className="text-xs font-bold" style={{color:amSelImgRef.current?'#3b82f6':'#d1d5db'}}>✂</span></AmToolbarButton>
      <input ref={fiRef} type="file" accept="image/*" className="hidden" onChange={onFile}/>
    </div>
    <div ref={edRef} contentEditable suppressContentEditableWarning className={`p-2.5 text-sm leading-relaxed ${cls} rounded-b-lg bg-white`} style={{minHeight:minHeight||120}} data-placeholder={placeholder||"Type here\u2026"} onInput={sync} onPaste={onPaste} onDrop={onDrop} onDragOver={e=>e.preventDefault()} onClick={e=>{closeP();const t=e.target;if(t.tagName==='IMG'){amSelImgRef.current=t;t.style.outline='3px solid #3b82f6';edRef.current?.querySelectorAll('img').forEach(i=>{if(i!==t)i.style.outline=''})}else{amSelImgRef.current=null;edRef.current?.querySelectorAll('img').forEach(i=>{i.style.outline=''})}}} onDoubleClick={e=>{const t=e.target;if(t.tagName==='IMG'){e.preventDefault();e.stopPropagation();amSelImgRef.current=t;setAmCropMd({imgEl:t,src:t.src})}}} onKeyDown={onKD}/>
  </div>
  {amCropMd&&<ImageCropModal src={amCropMd.src} onApply={dataUrl=>{if(amCropMd.imgEl){amCropMd.imgEl.src=dataUrl;amCropMd.imgEl.style.outline='3px solid #3b82f6'}setAmCropMd(null);sync()}} onCancel={()=>setAmCropMd(null)}/>}
  </>;
}

function AmNodeTypeButton({type,label,onClick}){const c=AM_NODE_TYPES[type];const I=c.Icon;return <button onClick={onClick} className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border hover:shadow-sm transition-all bg-white" style={{borderColor:c.color,color:c.color}}><I size={13}/>{label||c.label}</button>;}

const RichToolbar=({compact,editorRef})=>{
  const ex=(c,v)=>{document.execCommand(c,false,v||null)};
  const btn=(cmd,icon,title)=>(<button key={cmd} onMouseDown={e=>{e.preventDefault();ex(cmd);}} className={'hover:bg-gray-200 rounded transition-colors '+(compact?'p-1':'p-1.5')} title={title}>{icon}</button>);
  const sz=compact?13:14;
  const insImg=(url)=>{if(editorRef?.current)editorRef.current.focus();document.execCommand('insertImage',false,url)};
  const promptImg=()=>{const u=window.prompt('Enter image URL:');if(u)insImg(u)};
  const uploadImg=()=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>insImg(ev.target.result);r.readAsDataURL(f)};i.click()};
  return(<>
    {btn('bold',<Bold size={sz}/>,'Bold')}
    {btn('italic',<Italic size={sz}/>,'Italic')}
    {btn('underline',<Underline size={sz}/>,'Underline')}
    {btn('strikeThrough',<Strikethrough size={sz}/>,'Strikethrough')}
    <span className="w-px bg-gray-300 mx-0.5" style={{height:compact?16:20,alignSelf:'center'}}/>
    {btn('insertUnorderedList',<List size={sz}/>,'Bullet List')}
    {btn('insertOrderedList',<ListOrdered size={sz}/>,'Numbered List')}
    <span className="w-px bg-gray-300 mx-0.5" style={{height:compact?16:20,alignSelf:'center'}}/>
    <button onMouseDown={e=>{e.preventDefault();promptImg()}} className={'hover:bg-gray-200 rounded transition-colors '+(compact?'p-1':'p-1.5')} title="Image URL"><ImageIcon size={sz}/></button>
    <button onMouseDown={e=>{e.preventDefault();uploadImg()}} className={'hover:bg-gray-200 rounded transition-colors '+(compact?'p-1':'p-1.5')} title="Upload Image"><Upload size={sz}/></button>
    <span className="w-px bg-gray-300 mx-0.5" style={{height:compact?16:20,alignSelf:'center'}}/>
    {btn('removeFormat',<RemoveFormatting size={sz}/>,'Clear Format')}
  </>);
};

/* ── Image Crop Modal for Warrantee Editor ── */
function ImageCropModal({src,onApply,onCancel}){
  const[inf,setInf]=useState(null);
  const[sel,setSel]=useState(null);
  const[active,setActive]=useState(false);
  const dr=useRef(null);
  useEffect(()=>{const img=new Image();img.onload=()=>{const mW=560,mH=400,sc=Math.min(1,mW/img.naturalWidth,mH/img.naturalHeight);const dw=Math.round(img.naturalWidth*sc),dh=Math.round(img.naturalHeight*sc);setInf({nw:img.naturalWidth,nh:img.naturalHeight,dw,dh,sc});setSel({x:Math.round(dw*.1),y:Math.round(dh*.1),w:Math.round(dw*.8),h:Math.round(dh*.8)})};img.src=src},[src]);
  useEffect(()=>{if(!active)return;
    const onM=e=>{if(!dr.current||!inf)return;e.preventDefault();const{type,mx:smx,my:smy,sel:ss}=dr.current;const mx=(e.touches?.[0]||e).clientX,my=(e.touches?.[0]||e).clientY;const dx=mx-smx,dy=my-smy,{dw,dh}=inf;let nx=ss.x,ny=ss.y,nw=ss.w,nh=ss.h;if(type==='move'){nx=Math.max(0,Math.min(dw-nw,ss.x+dx));ny=Math.max(0,Math.min(dh-nh,ss.y+dy))}else{if(type.includes('w')){nx=Math.max(0,Math.min(ss.x+ss.w-20,ss.x+dx));nw=ss.x+ss.w-nx}if(type.includes('e')){nw=Math.max(20,Math.min(dw-ss.x,ss.w+dx))}if(type.includes('n')){ny=Math.max(0,Math.min(ss.y+ss.h-20,ss.y+dy));nh=ss.y+ss.h-ny}if(type.includes('s')){nh=Math.max(20,Math.min(dh-ss.y,ss.h+dy))}}setSel({x:nx,y:ny,w:nw,h:nh})};
    const onU=()=>{dr.current=null;setActive(false)};
    window.addEventListener('mousemove',onM);window.addEventListener('mouseup',onU);window.addEventListener('touchmove',onM,{passive:false});window.addEventListener('touchend',onU);
    return()=>{window.removeEventListener('mousemove',onM);window.removeEventListener('mouseup',onU);window.removeEventListener('touchmove',onM);window.removeEventListener('touchend',onU)}},[active,inf]);
  const grab=(type,e)=>{e.preventDefault();e.stopPropagation();dr.current={type,mx:(e.touches?.[0]||e).clientX,my:(e.touches?.[0]||e).clientY,sel:{...sel}};setActive(true)};
  const apply=()=>{if(!inf||!sel)return;const img=new Image();img.onload=()=>{const{sc}=inf;const c=document.createElement('canvas');c.width=Math.round(sel.w/sc);c.height=Math.round(sel.h/sc);c.getContext('2d').drawImage(img,sel.x/sc,sel.y/sc,sel.w/sc,sel.h/sc,0,0,c.width,c.height);onApply(c.toDataURL('image/png'))};img.src=src};
  if(!inf||!sel)return <div className="fixed inset-0 flex items-center justify-center" style={{zIndex:110,background:'rgba(0,0,0,.5)'}}><div className="text-white text-sm">Loading…</div></div>;
  const hs=12,handles=[{t:'nw',x:sel.x,y:sel.y,c:'nw-resize'},{t:'ne',x:sel.x+sel.w,y:sel.y,c:'ne-resize'},{t:'sw',x:sel.x,y:sel.y+sel.h,c:'sw-resize'},{t:'se',x:sel.x+sel.w,y:sel.y+sel.h,c:'se-resize'},{t:'n',x:sel.x+sel.w/2,y:sel.y,c:'n-resize'},{t:'s',x:sel.x+sel.w/2,y:sel.y+sel.h,c:'s-resize'},{t:'w',x:sel.x,y:sel.y+sel.h/2,c:'w-resize'},{t:'e',x:sel.x+sel.w,y:sel.y+sel.h/2,c:'e-resize'}];
  return(<div className="fixed inset-0 flex items-center justify-center" style={{zIndex:110,background:'rgba(0,0,0,.6)'}} onClick={onCancel}><div className="bg-white rounded-2xl shadow-2xl p-5 mx-4" style={{maxWidth:inf.dw+48}} onClick={e=>e.stopPropagation()}>
    <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-gray-800">✂️ Crop Image</h3><button onClick={onCancel} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} className="text-gray-400"/></button></div>
    <div className="relative select-none" style={{width:inf.dw,height:inf.dh,userSelect:'none'}}>
      <img src={src} style={{width:inf.dw,height:inf.dh,display:'block',borderRadius:8}} draggable={false}/>
      <svg style={{position:'absolute',top:0,left:0,width:inf.dw,height:inf.dh,pointerEvents:'none'}}><defs><mask id="cmsk"><rect width={inf.dw} height={inf.dh} fill="white"/><rect x={sel.x} y={sel.y} width={sel.w} height={sel.h} fill="black"/></mask></defs><rect width={inf.dw} height={inf.dh} fill="rgba(0,0,0,0.45)" mask="url(#cmsk)"/></svg>
      <div style={{position:'absolute',left:sel.x,top:sel.y,width:sel.w,height:sel.h,border:'2px dashed #3b82f6',boxSizing:'border-box',cursor:'move'}} onMouseDown={e=>grab('move',e)} onTouchStart={e=>grab('move',e)}/>
      {handles.map(h=><div key={h.t} style={{position:'absolute',left:h.x-hs/2,top:h.y-hs/2,width:hs,height:hs,background:'#3b82f6',border:'2px solid white',borderRadius:'50%',cursor:h.c,zIndex:2}} onMouseDown={e=>grab(h.t,e)} onTouchStart={e=>grab(h.t,e)}/>)}
    </div>
    <div className="flex items-center justify-between mt-3"><span className="text-xs text-gray-400">{Math.round(sel.w/inf.sc)} × {Math.round(sel.h/inf.sc)} px</span><div className="flex gap-2"><button onClick={onCancel} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button onClick={apply} className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">Apply Crop</button></div></div>
  </div></div>);
}

export default function App(){
const[activePage,setActivePage]=useState('workspace');
const[ratio,setRatio]=useState(33);
const[resizing,setResizing]=useState(false);
const[nodes,setNodes]=useState([]);
const[edges,setEdges]=useState([]);

/* ═══ Tab Management State ═══ */
const[activeTab,setActiveTab]=useState('argmap'); // 'argmap' | 'w-0' | 'w-1' | ...
const[warranteeTabs,setWarranteeTabs]=useState([{id:'w-0',label:'Warrantee 1'}]);
const[activeWarranteeId,setActiveWarranteeId]=useState('w-0');
const warranteeStatesRef=useRef({}); // stores saved states for non-active warrantee tabs
const[wTabCounter,setWTabCounter]=useState(1);

/* ═══ ArgMap Left Panel State ═══ */
const[amSidebarTab,setAmSidebarTab]=useState('text'); // 'text' | 'layout' | 'scheme'
const[amWarrantTreeOpen,setAmWarrantTreeOpen]=useState({});

/* ═══ ArgMap Canvas State ═══ */
const amHistory=useAmHistory({nodes:[],edges:[]});
const amCommittedNodes=amHistory.current.nodes;
const amEdges=amHistory.current.edges;
const[amDragDelta,setAmDragDelta]=useState(null);
const amNodes=useMemo(()=>{if(!amDragDelta)return amCommittedNodes;return amCommittedNodes.map(n=>n.id===amDragDelta.id?{...n,x:Math.max(0,n.x+amDragDelta.dx),y:Math.max(0,n.y+amDragDelta.dy)}:n);},[amCommittedNodes,amDragDelta]);
const[amSelectedNodeId,setAmSelectedNodeId]=useState(null);
const[amInteractionMode,setAmInteractionMode]=useState('select');
const[amLinkFromNodeId,setAmLinkFromNodeId]=useState(null);
const[amLinkEdgeType,setAmLinkEdgeType]=useState('support');
const[amEditNodeId,setAmEditNodeId]=useState(null);
const[amEditText,setAmEditText]=useState('');
const[amEditWarrantType,setAmEditWarrantType]=useState(null);
const[amEditWarrantSubtype,setAmEditWarrantSubtype]=useState(null);
const[amEditCustomTypeName,setAmEditCustomTypeName]=useState('');
const[amEditCustomSubtypeName,setAmEditCustomSubtypeName]=useState('');
const[amCqModal,setAmCqModal]=useState(null);

/* ═══ AI Feature States ═══ */
const[aiProvider,setAiProvider]=useState('openai');
const[aiAlibabaRegion,setAiAlibabaRegion]=useState('hk');
const[aiModel,setAiModel]=useState('gpt-4o-mini');
const[aiApiKey,setAiApiKey]=useState('');
const[aiShowKey,setAiShowKey]=useState(false);
const[aiTopic,setAiTopic]=useState('');
const[aiTextLength,setAiTextLength]=useState('paragraph');
const[aiLang,setAiLang]=useState('en');
const[aiReaderLevel,setAiReaderLevel]=useState('regular');
const[aiStructure,setAiStructure]=useState({useDefault:true,claim:false,premises:false,warrant:false,backing:false, criticalQuestion:false,qualifier:false});
const[aiGenerating,setAiGenerating]=useState(false);
const[aiContinuing,setAiContinuing]=useState(false);
const[aiAnalyzing,setAiAnalyzing]=useState(false);
const[aiResult,setAiResult]=useState('');
const[aiError,setAiError]=useState('');
const[leftPanelMode,setLeftPanelMode]=useState('human');
const[aiSubTab,setAiSubTab]=useState('provider');
const[aaaShowPrompt,setAaaShowPrompt]=useState(false);
const[aaaCustomPrompt,setAaaCustomPrompt]=useState(AAA_SYSTEM_PROMPT);

const[amCqFormData,setAmCqFormData]=useState({selectedSchematic:null,customSchematic:'',text:''});
const[amHoveredEdgeId,setAmHoveredEdgeId]=useState(null);
const[amZoomLevel,setAmZoomLevel]=useState(1);
const[amHeightVersion,setAmHeightVersion]=useState(0);
const amScrollRef=useRef(null);
const amDragInfoRef=useRef(null);
const amDidDragRef=useRef(false);
const amNodeElsRef=useRef({});
const amMeasuredHRef=useRef({});
const amZoomRef=useRef(1);amZoomRef.current=amZoomLevel;
const amDoubleTapRef=useRef({time:0,nodeId:null});
const amTouchHandledRef=useRef(false);
const amDragConnRef=useRef({fromId:null,startX:0,startY:0,active:false,anchorX:0,anchorY:0});
const[amDragLine,setAmDragLine]=useState(null);
const amJustDragConnRef=useRef(false);
const[mode,setMode]=useState('select');
const[connFrom,setConnFrom]=useState(null);
const[dragId,setDragId]=useState(null);
const[detailId,setDetailId]=useState(null);
const[detailType,setDetailType]=useState('cause');
const[editModal,setEditModal]=useState(null);

const[wCropModal,setWCropModal]=useState(null);
const wEditImgRef=useRef(null);
const[srcCropModal,setSrcCropModal]=useState(null);
const srcCropImgRef=useRef(null);

const[zoom,setZoom]=useState(1);
const[dimTick,setDimTick]=useState(0);
const[lastDeleted,setLastDeleted]=useState(null);
const[adXY,setAdXY]=useState(null);
const[adHover,setAdHover]=useState(null);
const[showNav,setShowNav]=useState(false);
const[navFlip,setNavFlip]=useState(false);
const[linkLabel,setLinkLabel]=useState('');
const[descState,setDescState]=useState({});
const[slidersOpen,setSlidersOpen]=useState(true);
const[cqsOpen,setCqsOpen]=useState(false);
const[linkBackingOpen,setLinkBackingOpen]=useState(false);
const[descHoverId,setDescHoverId]=useState(null);
const[descEditId,setDescEditId]=useState(null);
const descEditTextRef=useRef('');
const descDragRef=useRef(null);
const[historyTick,setHistoryTick]=useState(0);
const historyRef2=useRef({past:[],future:[]});
const ctnRef=useRef(null),edRef=useRef(null),cvRef=useRef(null),rpRef=useRef(null);
const dOff=useRef({x:0,y:0}),emRef=useRef(null),nodeElsRef=useRef({});
const dragConnRef=useRef({fromId:null,startX:0,startY:0,active:false,anchorX:0,anchorY:0});
const[dragLine,setDragLine]=useState(null);
const justDraggedRef=useRef(false);
const detailIdRef=useRef(null);detailIdRef.current=detailId;
const adRef=useRef(null),vennRef=useRef(null),navBtnRef=useRef(null);
const stateRef=useRef({nodes:[],edges:[]});
stateRef.current={nodes,edges};
/* ═══ Shared Source Editor Helpers ═══ */
const getSelectedHtml=()=>{const s=window.getSelection();if(!s||!s.rangeCount||s.isCollapsed)return null;const rng=s.getRangeAt(0);if(edRef.current&&edRef.current.contains(rng.commonAncestorContainer)){const f=rng.cloneContents();const d=document.createElement('div');d.appendChild(f);return d.innerHTML.trim()||null}return null};

/* ═══ ArgMap State Updaters ═══ */
function amSetNodes(u){amHistory.push(p=>{const nn=typeof u==='function'?u(p.nodes):u;return{nodes:amApplyAutoClaimData(nn,p.edges),edges:p.edges}})}
function amSetEdges(u){amHistory.push(p=>{const ne=typeof u==='function'?u(p.edges):u;return{nodes:amApplyAutoClaimData(p.nodes,ne),edges:ne}})}
function amSetBoth(nu,eu){amHistory.push(p=>{const nn=typeof nu==='function'?nu(p.nodes):nu;const ne=typeof eu==='function'?eu(p.edges):eu;return{nodes:amApplyAutoClaimData(nn,ne),edges:ne}})}

function amGh(id){return amMeasuredHRef.current[id]||AM_NODE_DEFAULT_HEIGHT}

/* ═══ ArgMap Node Operations ═══ */
function amAddNode(type,wt,ws,text){const c=amScrollRef.current;const sx=c?c.scrollLeft/amZoomLevel:0,sy=c?c.scrollTop/amZoomLevel:0;const n={id:amNid(),type,text:text||esc(AM_NODE_TYPES[type].label),x:200+sx+Math.random()*180,y:120+sy+Math.random()*140};if(type==='warrant'){n.warrantType=wt||null;n.warrantSubtype=ws||null;n.customTypeName='';n.customSubtypeName=''}amSetNodes(p=>[...p,n])}
function amAddNodeFromSelection(type,wt,ws){let sel=getSelectedHtml();amAddNode(type,wt,ws,sel||null)}
function amDeleteNode(id){amSetBoth(p=>p.filter(n=>n.id!==id),p=>{const rm=new Set(p.filter(e=>e.from===id||e.to===id).map(e=>e.id));let ch=true;while(ch){ch=false;for(const e of p){if(!rm.has(e.id)&&rm.has(e.to)){rm.add(e.id);ch=true}}}return p.filter(e=>!rm.has(e.id))});if(amSelectedNodeId===id)setAmSelectedNodeId(null);if(amEditNodeId===id)setAmEditNodeId(null);delete amNodeElsRef.current[id];delete amMeasuredHRef.current[id]}
function amDeleteEdge(id){amSetEdges(p=>{const rm=new Set([id]);let ch=true;while(ch){ch=false;for(const e of p){if(!rm.has(e.id)&&rm.has(e.to)){rm.add(e.id);ch=true}}}return p.filter(e=>!rm.has(e.id))});setAmHoveredEdgeId(null)}

function amOpenCqEditor(id){setAmEditNodeId(null);const n=amCommittedNodes.find(x=>x.id===id);if(!n||!amIsCqType(n.type))return;const lw=amFindLinkedWarrant(id,amEdges,amCommittedNodes);const pre=amGetPresetCQs(lw?.warrantType,lw?.warrantSubtype);setAmCqModal({mode:'edit',nodeId:id});setAmCqFormData({selectedSchematic:n.cqSchematic&&pre.includes(n.cqSchematic)?n.cqSchematic:n.cqSchematic?'__custom__':null,customSchematic:n.cqSchematic&&!pre.includes(n.cqSchematic)?n.cqSchematic:'',text:n.text||''})}
function amSaveCqEdit(){if(!amCqModal)return;const sch=amCqFormData.selectedSchematic==='__custom__'?amCqFormData.customSchematic.trim():amCqFormData.selectedSchematic||null;const id=amCqModal.nodeId,txt=amCqFormData.text;amSetNodes(p=>p.map(n=>n.id!==id?n:{...n,text:amIsHtmlEmpty(txt)?'Critical Question':txt,cqSchematic:sch||null}));setAmCqModal(null)}
function amStartEditing(id){setAmCqModal(null);const n=amCommittedNodes.find(x=>x.id===id);if(!n)return;if(amIsCqType(n.type)){amOpenCqEditor(id);return}setAmEditNodeId(id);setAmEditText(n.text);setAmEditWarrantType(n.warrantType||null);setAmEditWarrantSubtype(n.warrantSubtype||null);setAmEditCustomTypeName(n.customTypeName||'');setAmEditCustomSubtypeName(n.customSubtypeName||'')}
function amSaveEdit(){if(!amEditNodeId)return;const id=amEditNodeId;amSetNodes(p=>p.map(n=>{if(n.id!==id)return n;const u={...n,text:amEditText};if(amIsWarrantType(n.type)){u.warrantType=amEditWarrantType;u.warrantSubtype=amEditWarrantSubtype||null;u.customTypeName=(amEditWarrantType==='custom'&&!amEditWarrantSubtype)?amEditCustomTypeName:'';u.customSubtypeName=(amEditWarrantType==='custom'&&!amEditWarrantSubtype)?amEditCustomSubtypeName:''}return u}));setAmEditNodeId(null)}

function amLoadScheme(gen){const r=gen();amHistory.reset({nodes:amApplyAutoClaimData(r.nodes,r.edges),edges:r.edges});setAmSelectedNodeId(null);setAmLinkFromNodeId(null);setAmEditNodeId(null);setAmCqModal(null);setAmZoomLevel(1);amScrollRef.current?.scrollTo(0,0)}
function amClearAll(){amHistory.reset({nodes:[],edges:[]});setAmSelectedNodeId(null);setAmLinkFromNodeId(null);setAmEditNodeId(null);setAmCqModal(null);setAmZoomLevel(1)}

/* ═══ AI Generate Discourse ═══ */
async function aiGenerateDiscourse(){
  if(!aiApiKey.trim()){setAiError('Please enter an API key.');return}
  if(!aiTopic.trim()){setAiError('Please enter a topic.');return}
  setAiGenerating(true);setAiError('');setAiResult('');
  const provider=AI_PROVIDERS[aiProvider];
  const model=aiModel||provider.defaultModel;
  const lengthInfo=AI_TEXT_LENGTHS[aiTextLength];
  let structureInstr='';
  if(!aiStructure.useDefault){
    const elems=[];
    if(aiStructure.claim) elems.push('a clear claim or thesis statement');
    if(aiStructure.premises) elems.push('supporting premises or evidence (at least 2 distinct reasons)');
    if(aiStructure.warrant) elems.push('an explicit warrant — the reasoning principle that connects the evidence to the claim');
	if(aiStructure.backing) elems.push('explicit backing — the underlying knowledge base, shared assumptions, or domain-specific evidence that validates and supports the warrant');
    if(aiStructure.criticalQuestion) elems.push('a critical question, rebuttal, or counterargument that challenges the argument');
    if(aiStructure.qualifier) elems.push('a qualifier indicating the degree of certainty (e.g. "probably", "in most cases", "presumably")');
    if(elems.length>0)structureInstr='\n\nThe text MUST explicitly include the following argumentative elements:\n- '+elems.join('\n- ');
  }
  const langInstr=aiLang==='zh'?'\n- Write the ENTIRE output in Chinese (繁體中文 or 简体中文, whichever is natural for the topic). Do NOT write in English.':'';
  const readerInstr=aiReaderLevel==='secondary'?'\n- Write at a level appropriate for secondary school students (ages 12–17): use clear vocabulary, shorter sentences, and concrete examples. Avoid overly academic or technical language.':aiReaderLevel==='primary'?'\n- Write at a level appropriate for primary school students (ages 6–11): use very simple vocabulary, short sentences, familiar everyday examples, and a friendly tone. Avoid abstract or complex ideas.':'';
  const prompt=`Generate a ${lengthInfo.label.toLowerCase()} (approximately ${lengthInfo.words}) of argumentative discourse on the following topic:\n\nTopic: ${aiTopic.trim()}\n\nRequirements:\n- Write natural, coherent argumentative prose as if it were a passage from an essay or article\n- Present a clear argument or position on the topic\n- Length: approximately ${lengthInfo.words}${langInstr}${readerInstr}${structureInstr}\n\nGenerate ONLY the discourse text. Do NOT include labels, headings, bullet points, or meta-commentary about the argument structure.`;
  try{
    let responseText='';
    if(provider.type==='gemini'){
      const url=`${provider.endpoint}${encodeURIComponent(model)}:generateContent?key=${aiApiKey.trim()}`;
      const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:lengthInfo.maxTokens*2}})});
      if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err.error?.message||`Gemini API error: ${res.status}`)}
      const data=await res.json();responseText=data.candidates?.[0]?.content?.parts?.[0]?.text||'';
    }else{
      /* ── OpenAI-compatible handler (OpenAI, DeepSeek, Alibaba) ── */
      const effectiveEndpoint=(aiProvider==='alibaba')?ALIBABA_REGIONS[aiAlibabaRegion].endpoint:provider.endpoint;
      const headers2={'Content-Type':'application/json','Authorization':`Bearer ${aiApiKey.trim()}`};
      const res=await fetch(effectiveEndpoint,{method:'POST',headers:headers2,body:JSON.stringify({model,messages:[{role:'user',content:prompt}],max_tokens:lengthInfo.maxTokens*2})});
      if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err.error?.message||`API error: ${res.status}`)}
      const data=await res.json();responseText=data.choices?.[0]?.message?.content||'';
    }
    setAiResult(responseText.trim());
  }catch(err){setAiError(err.message||'An error occurred.')}finally{setAiGenerating(false)}
}
function aiInsertToEditor(){
  if(!aiResult||!edRef.current)return;
  const html=aiResult.replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>');
  const cur=edRef.current.innerHTML;
  const isEmpty=!cur||cur==='<p style="color: rgb(170, 170, 170);">Paste or type your text here...</p>'||cur.replace(/<[^>]*>/g,'').trim()==='Paste or type your text here...';
  edRef.current.innerHTML=(isEmpty?'':'<br><hr style="border:none;border-top:1px dashed #d1d5db;margin:12px 0"><br>')+'<p>'+html+'</p>';
}
function aiCopyResult(){if(aiResult)navigator.clipboard?.writeText(aiResult).catch(()=>{})}

async function aiContinueDiscourse(){
  if(!aiApiKey.trim()||!aiResult.trim())return;
  setAiContinuing(true);setAiError('');
  const provider=AI_PROVIDERS[aiProvider];
  const model=aiModel||provider.defaultModel;
  const lengthInfo=AI_TEXT_LENGTHS[aiTextLength];
  const langInstr=aiLang==='zh'?'\nContinue writing in the SAME language (Chinese) as the existing text.':'';
  const prompt=`The following argumentative text was cut off before completion. Continue writing naturally from EXACTLY where it stopped. Do NOT repeat any of the existing text — just provide the continuation that seamlessly connects.${langInstr}\n\nExisting text:\n"""\n${aiResult.trim()}\n"""\n\nContinue from where it left off:`;
  try{
    let responseText='';
    if(provider.type==='gemini'){
      const url=`${provider.endpoint}${encodeURIComponent(model)}:generateContent?key=${aiApiKey.trim()}`;
      const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:lengthInfo.maxTokens*2}})});
      if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err.error?.message||`Gemini API error: ${res.status}`)}
      const data=await res.json();responseText=data.candidates?.[0]?.content?.parts?.[0]?.text||'';
    }else{
      const effectiveEndpoint=(aiProvider==='alibaba')?ALIBABA_REGIONS[aiAlibabaRegion].endpoint:provider.endpoint;
      const headers2={'Content-Type':'application/json','Authorization':`Bearer ${aiApiKey.trim()}`};
      const res=await fetch(effectiveEndpoint,{method:'POST',headers:headers2,body:JSON.stringify({model,messages:[{role:'user',content:prompt}],max_tokens:lengthInfo.maxTokens*2})});
      if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err.error?.message||`API error: ${res.status}`)}
      const data=await res.json();responseText=data.choices?.[0]?.message?.content||'';
    }
    const cont=responseText.trim();
    if(cont){
      setAiResult(prev=>{
        const existing=prev.trimEnd();
        if(!existing)return cont;
        const lastCh=existing.charAt(existing.length-1);
        const firstCh=cont.charAt(0);
        const isCJK=c=>/[\u3000-\u9fff\uf900-\ufaff]/.test(c);
        const isPunctStart=/^[，。、；：！？,.;:!?\-)\]}"'」』）\n]/.test(firstCh);
        const needsSpace=!isCJK(lastCh)&&!isCJK(firstCh)&&!isPunctStart&&!/\s/.test(lastCh);
        return existing+(needsSpace?' ':'')+cont;
      });
    }
  }catch(err){setAiError(err.message||'Continue failed.')}finally{setAiContinuing(false)}
}

/* ═══ AI Argumentative Analysis (AAA) ═══ */
function aaaCreateWarranteeState(argData){
  const w=argData.warrant;const st=w?.schemeType||'custom';const ss=w?.schemeSubtype||null;
  let edgeType='link',fromText=argData.premises?.[0]?.text||'Premise',toText=argData.claim?.text||'Claim';
  if(st==='cause-effect'){
    if(ss==='from-consequence'){edgeType='mean-goal';fromText=argData.premises?.[0]?.text||'Action';toText=argData.claim?.text||'Goal'}
    else{edgeType='cause';fromText=argData.premises?.[0]?.text||'Cause';toText=argData.claim?.text||'Effect'}
  }else if(st==='whole-part'){edgeType='whole';fromText=argData.premises?.[0]?.text||'Example/Part';toText=argData.claim?.text||'Generalisation'}
  else if(st==='analogy'){edgeType='analogy';fromText=argData.premises?.[0]?.text||'Base case';toText=argData.claim?.text||'Target case'}
  else if(st==='info-source'){edgeType='source';fromText=argData.premises?.[0]?.text||'Source';toText=argData.claim?.text||'Assertion'}
  const n1={id:1,text:fromText,html:fromText,type:'expressed',x:30,y:50};
  const n2={id:2,text:toText,html:toText,type:'expressed',x:280,y:50};
  const edge={id:1,from:1,to:2,type:edgeType,pPQ:75,pXPXQ:50,pPrior:50,srcIdentifiability:50,srcAccuracy:50,srcCredibility:50,srcTrustworthiness:50,srcConsistency:50,srcEvidentiality:50,thresholdReject:35,thresholdAccept:65};
  if(edgeType==='mean-goal'){edge.pPR=50;edge.pXPXR=50;edge.ramificationText='';edge.goalText=''}
  if(edgeType==='link'){edge.linkLabel=(w?.text||'').slice(0,30);edge.linkScheme=DEFAULT_LINK_SCHEME;edge.linkCQs=DEFAULT_LINK_CQS;edge.linkBacking=DEFAULT_LINK_BACKING}
  // Add additional warrant-related nodes if premises > 1
  const wNodes=[n1,n2];const wEdges=[edge];let wNid=2,wEid=1;
  if(argData.premises?.length>1){
    argData.premises.slice(1).forEach((p,i)=>{
      const pn={id:++wNid,text:p.text,html:p.text,type:'expressed',x:30,y:180+i*120};
      wNodes.push(pn);
      // Connect additional premises based on scheme type
      if(st==='whole-part'){wEdges.push({id:++wEid,from:1,to:pn.id,type:'attribute',pPQ:75,pXPXQ:50,pPrior:50,srcIdentifiability:50,srcAccuracy:50,srcCredibility:50,srcTrustworthiness:50,srcConsistency:50,srcEvidentiality:50,thresholdReject:35,thresholdAccept:65})}
    })}
  return{nodes:wNodes,edges:wEdges,detailId:null,detailType:edgeType,descState:{},zoom:1,mode:'select',connFrom:null,history:{past:[],future:[]}}
}

function aaaApplyToArgMap(analysis){
  if(!analysis?.arguments?.length){setAiError('No arguments found in the analysis.');return}
  const newNodes=[],newEdges=[],argNodeMap={};
  const BAND_H=580,PREM_X=50,CLAIM_X=530,WARRANT_X=270,CQ_X=730;

  // ── Pre-scan: identify arguments whose claim feeds into a serial link ──
  const serialSourceArgIds = new Set();
  (analysis.serialLinks||[]).forEach(sl=>{ serialSourceArgIds.add(sl.fromArgId); });

  analysis.arguments.forEach((arg,ai)=>{
    const bandY=50+ai*BAND_H;
    // Extended map: track per-premise support edge IDs for edge-to-edge linking
    const map={premiseNodeIds:[],premIdMap:{},premEdgeMap:{},supportEdgeIds:[]};

    // Claim — serial-source claims use type 'data' so amApplyAutoClaimData promotes to 'claim-data'
    const claimId=amNid();
    const isSerialSource = serialSourceArgIds.has(arg.id);
    newNodes.push({id:claimId,type:isSerialSource?'data':'claim',text:esc(arg.claim.text),x:CLAIM_X,y:bandY+120});
    map.claimNodeId=claimId;

    // Premises
    (arg.premises||[]).forEach((prem,pi)=>{
      const premId=amNid();
      newNodes.push({id:premId,type:'data',text:esc(prem.text),x:PREM_X,y:bandY+pi*140});
      map.premiseNodeIds.push(premId);
      if(prem.id)map.premIdMap[prem.id]=premId;
    });

    // Support edges: one per premise → claim, tracking edge IDs for edge-to-edge linking
    const mainEdgeId=amEid();
    if(map.premiseNodeIds.length>0){
      newEdges.push({id:mainEdgeId,from:map.premiseNodeIds[0],to:claimId,type:'support'});
      map.supportEdgeIds.push(mainEdgeId);
      if(arg.premises?.[0]?.id) map.premEdgeMap[arg.premises[0].id]=mainEdgeId;
      for(let pi=1;pi<map.premiseNodeIds.length;pi++){
        const edgeId=amEid();
        newEdges.push({id:edgeId,from:map.premiseNodeIds[pi],to:claimId,type:'support'});
        map.supportEdgeIds.push(edgeId);
        if(arg.premises?.[pi]?.id) map.premEdgeMap[arg.premises[pi].id]=edgeId;
      }
    }
    map.mainEdgeId=mainEdgeId;

    // Linked premises — connect support EDGES (edge-to-edge), not premise nodes
    if(arg.linkedPremiseIds&&arg.linkedPremiseIds.length>1){
      for(let li=0;li<arg.linkedPremiseIds.length-1;li++){
        const fEdgeId=map.premEdgeMap[arg.linkedPremiseIds[li]];
        const tEdgeId=map.premEdgeMap[arg.linkedPremiseIds[li+1]];
        if(fEdgeId&&tEdgeId){
          newEdges.push({id:amEid(),from:fEdgeId,to:tEdgeId,type:'link'});
        }
      }
    }

    // Warrant
    if(arg.warrant){
      const warrantId=amNid();const wt=arg.warrant.schemeType||null;const ws=arg.warrant.schemeSubtype||null;
      newNodes.push({id:warrantId,type:'warrant',text:esc(arg.warrant.text),x:WARRANT_X,y:bandY+300,
        warrantType:wt,warrantSubtype:ws,
        customTypeName:wt==='custom'?(arg.warrant.customTypeName||''):'',
        customSubtypeName:wt==='custom'?(arg.warrant.customSubtypeName||''):''});
      map.warrantNodeId=warrantId;
      newEdges.push({id:amEid(),from:warrantId,to:mainEdgeId,type:'support'});
      // Backing
      if(arg.backing?.text){
        const backId=amNid();
        newNodes.push({id:backId,type:'backing',text:esc(arg.backing.text),x:WARRANT_X,y:bandY+440});
        newEdges.push({id:amEid(),from:backId,to:warrantId,type:'support'})
      }
      // CQs
      (arg.criticalQuestions||[]).forEach((cq,ci)=>{
        const cqId=amNid();
        newNodes.push({id:cqId,type:'cq',text:esc(cq.text),x:CQ_X,y:bandY+300+ci*120,cqSchematic:cq.schematic||null});
        newEdges.push({id:amEid(),from:cqId,to:warrantId,type:'question'})
      });
    }
    // Qualifier
    if(arg.qualifier?.text){
      const qualId=amNid();
      newNodes.push({id:qualId,type:'qualifier',text:esc(arg.qualifier.text),x:CLAIM_X,y:bandY});
      newEdges.push({id:amEid(),from:qualId,to:mainEdgeId,type:'qualify'})
    }
    // Rebuttal
    if(arg.rebuttal?.text){
      const rebId=amNid();
      newNodes.push({id:rebId,type:'rebuttal',text:esc(arg.rebuttal.text),x:CLAIM_X,y:bandY+300});
      newEdges.push({id:amEid(),from:rebId,to:mainEdgeId,type:'attack'})
    }
    argNodeMap[arg.id]=map;
  });

  // Serial links — fromArg's claim (type:'data' → auto-promotes to 'claim-data') → toArg's claim
  (analysis.serialLinks||[]).forEach(sl=>{
    const fromMap=argNodeMap[sl.fromArgId],toMap=argNodeMap[sl.toArgId];
    if(fromMap?.claimNodeId&&toMap?.claimNodeId){
      const serialEdgeId=amEid();
      newEdges.push({id:serialEdgeId,from:fromMap.claimNodeId,to:toMap.claimNodeId,type:'support'});
      // Register serial edge in toMap so it can participate in link structure
      toMap.supportEdgeIds.push(serialEdgeId);
      // If toArg has linked premises, chain the serial edge into the link group
      const toArg=analysis.arguments.find(a=>a.id===sl.toArgId);
      if(toArg?.linkedPremiseIds?.length>1&&toMap.supportEdgeIds.length>1){
        const prevEdgeId=toMap.supportEdgeIds[toMap.supportEdgeIds.length-2];
        newEdges.push({id:amEid(),from:prevEdgeId,to:serialEdgeId,type:'link'});
      }
    }
  });

  // Create Warrantee tabs for each warrant with a scheme
  if(activeTab.startsWith('w-'))saveCurrentWarranteeState();
  const warrantArgs=analysis.arguments.filter(a=>a.warrant?.schemeType);
  const tabsToAdd=[];let tabOffset=wTabCounter;
  warrantArgs.forEach((arg,wi)=>{
    const tabId='w-'+(tabOffset+wi);
    const stLabel=arg.warrant.schemeSubtype?AM_WALTON_TYPES[arg.warrant.schemeType]?.subs?.[arg.warrant.schemeSubtype]||arg.warrant.schemeSubtype:AM_WALTON_TYPES[arg.warrant.schemeType]?.short||arg.warrant.schemeType;
    const tabLabel='W'+(wi+1)+': '+stLabel;
    tabsToAdd.push({id:tabId,label:tabLabel});
    warranteeStatesRef.current[tabId]=aaaCreateWarranteeState(arg);
    // Link ArgMap warrant node to this tab
    const wNodeId=argNodeMap[arg.id]?.warrantNodeId;
    if(wNodeId){const idx=newNodes.findIndex(n=>n.id===wNodeId);if(idx>=0)newNodes[idx].linkedWarranteeTabId=tabId}
  });
  if(tabsToAdd.length>0){setWarranteeTabs(prev=>[...prev,...tabsToAdd]);setWTabCounter(tabOffset+warrantArgs.length)}

  // Apply to ArgMap canvas
  amNodeElsRef.current={};amMeasuredHRef.current={};
  amHistory.reset({nodes:amApplyAutoClaimData(newNodes,newEdges),edges:newEdges});
  setAmSelectedNodeId(null);setAmEditNodeId(null);setAmCqModal(null);setAmZoomLevel(1);
  setAmHeightVersion(v=>v+1);
  setActiveTab('argmap');
  setTimeout(()=>amZoomFit(),300);
}

async function aiAnalyzeArgument(){
  if(!aiApiKey.trim()){setAiError('Please enter an API key.');return}
  const editorText=edRef.current?.innerText?.trim()||'';
  if(!editorText||editorText==='Paste or type your text here...'){setAiError('Please enter argumentative text in the editor first.');return}
  setAiAnalyzing(true);setAiError('');
  const provider=AI_PROVIDERS[aiProvider];const model=aiModel||provider.defaultModel;
  const userPrompt=`Analyze the following argumentative text and identify ALL argument units with their micro-structure (claim, premises, warrant with scheme type/subtype, backing, qualifier, rebuttal, critical questions) and macro-structure (serial links between arguments).\n\nTEXT:\n"""\n${editorText}\n"""\n\nProvide the complete analysis as JSON.`;
  const effectiveSystemPrompt=aaaShowPrompt?aaaCustomPrompt:AAA_SYSTEM_PROMPT;
  try{
    let responseText='';
    if(provider.type==='gemini'){
      const url=`${provider.endpoint}${encodeURIComponent(model)}:generateContent?key=${aiApiKey.trim()}`;
      const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:effectiveSystemPrompt+'\n\n'+userPrompt}]}],generationConfig:{maxOutputTokens:4096}})});
      if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err.error?.message||`Gemini API error: ${res.status}`)}
      const data=await res.json();responseText=data.candidates?.[0]?.content?.parts?.[0]?.text||'';
    }else{
      const effectiveEndpoint=(aiProvider==='alibaba')?ALIBABA_REGIONS[aiAlibabaRegion].endpoint:provider.endpoint;
      const headers2={'Content-Type':'application/json','Authorization':`Bearer ${aiApiKey.trim()}`};
      const res=await fetch(effectiveEndpoint,{method:'POST',headers:headers2,body:JSON.stringify({model,messages:[{role:'system',content:effectiveSystemPrompt},{role:'user',content:userPrompt}],max_tokens:4096})});
      if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err.error?.message||`API error: ${res.status}`)}
      const data=await res.json();responseText=data.choices?.[0]?.message?.content||'';
    }
    let jsonStr=responseText.trim();
    if(jsonStr.startsWith('```'))jsonStr=jsonStr.replace(/^```(?:json)?\s*\n?/,'').replace(/\n?```\s*$/,'');
    const parsed=JSON.parse(jsonStr);
    aaaApplyToArgMap(parsed);
  }catch(err){setAiError(err.message||'Analysis failed. The AI may have returned invalid JSON.')}finally{setAiAnalyzing(false)}
}


/* ═══ ArgMap Zoom ═══ */
function amZoomIn2(){setAmZoomLevel(c=>{const n=AM_ZOOM_LEVELS.find(l=>l>c+.001);return n||c})}
function amZoomOut2(){setAmZoomLevel(c=>{const n=AM_ZOOM_LEVELS.slice().reverse().find(l=>l<c-.001);return n||c})}
function amZoomReset(){setAmZoomLevel(1)}
function amZoomFit(){if(!amNodes.length||!amScrollRef.current)return;const c=amScrollRef.current;const minX=Math.min(...amNodes.map(n=>n.x));const minY=Math.min(...amNodes.map(n=>n.y));const maxX=Math.max(...amNodes.map(n=>n.x+AM_NODE_WIDTH+150));const maxY=Math.max(...amNodes.map(n=>n.y+amGh(n.id)+200));const fz=Math.max(.25,Math.min(2,Math.round(Math.min(c.clientWidth/(maxX-minX+80),c.clientHeight/(maxY-minY+80),2)*100)/100));setAmZoomLevel(fz);setTimeout(()=>{c.scrollLeft=(minX-40)*fz;c.scrollTop=(minY-40)*fz},50)}

function amDlCanvas(){if(!amNodes.length)return;function toXH(html){if(!html)return'';const d=document.createElement('div');d.innerHTML=html;const ser=new XMLSerializer();let r='';for(const c of d.childNodes)r+=ser.serializeToString(c);return r}let mnX=Infinity,mnY=Infinity,mxXv=0,mxYv=0;amNodes.forEach(n=>{mnX=Math.min(mnX,n.x);mnY=Math.min(mnY,n.y);mxXv=Math.max(mxXv,n.x+AM_NODE_WIDTH);mxYv=Math.max(mxYv,n.y+amGh(n.id))});const pd=60,W=mxXv-mnX+pd*2,H=mxYv-mnY+pd*2,ox=-mnX+pd,oy=-mnY+pd;const rcCSS='img{max-width:100%;height:auto;border-radius:4px;margin:2px 0;max-height:120px;object-fit:contain}a{color:#3b82f6;text-decoration:underline}ul,ol{margin:2px 0;padding-left:18px;font-size:inherit}ul{list-style-type:disc}ol{list-style-type:decimal}li{margin:1px 0}p{margin:0}';let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#f8fafc"/>`;s+=`<defs>`;Object.entries(AM_EDGE_STYLES).filter(([,c])=>c.arrow).forEach(([t,c])=>{s+=`<marker id="amd-${t}" viewBox="0 0 10 6" refX="9" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,3 L0,6z" fill="${c.color}"/></marker>`});s+=`</defs>`;const{edgeLines,targetedEdgeIds}=amEdgeGeometry;edgeLines.forEach(e=>{const st=AM_EDGE_STYLES[e.type]||AM_EDGE_STYLES.support;const x1=e.x1+ox,y1=e.y1+oy,x2=e.x2+ox,y2=e.y2+oy,mx2=(e.mx||((e.x1+e.x2)/2))+ox,my2=(e.my||((e.y1+e.y2)/2))+oy;if(e.type==='link'){s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st.color}" stroke-width="3" stroke-linecap="round"/>`;s+=`<circle cx="${x1}" cy="${y1}" r="4" fill="${st.color}"/><circle cx="${x2}" cy="${y2}" r="4" fill="${st.color}"/>`}else{s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st.color}" stroke-width="2.5" ${st.dash?`stroke-dasharray="${st.dash}"`:''} ${st.arrow?`marker-end="url(#amd-${e.type})"`:''}/>`}if(targetedEdgeIds.has(e.id)){s+=`<circle cx="${mx2}" cy="${my2}" r="${AM_JUNCTION_RADIUS}" fill="white" stroke="${st.color}" stroke-width="2.5"/>`}else{const lw2=st.label.length*5.5+12;s+=`<rect x="${mx2-lw2/2}" y="${my2-10}" width="${lw2}" height="18" rx="4" fill="white" fill-opacity="0.92" stroke="${st.color}" stroke-width="0.5"/><text x="${mx2}" y="${my2+3}" text-anchor="middle" font-size="9" fill="${st.color}" font-weight="600">${esc(st.label)}</text>`}});amNodes.forEach(n=>{const tc=AM_NODE_TYPES[n.type]||AM_NODE_TYPES.data;const nx=n.x+ox,ny=n.y+oy,nh=amGh(n.id);const wLabel=amIsWarrantType(n.type)?amGetWarrantTag(n):null;const xh=toXH(n.text||'');s+=`<foreignObject x="${nx}" y="${ny}" width="${AM_NODE_WIDTH}" height="${nh}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${AM_NODE_WIDTH}px;height:${nh}px;border:2px solid ${tc.color};border-radius:${AM_CORNER_RADIUS}px;overflow:hidden;background:white;font-family:system-ui,-apple-system,sans-serif;box-sizing:border-box;"><style>${rcCSS}</style><div style="padding:2px 10px;background:${tc.color};color:white;font-size:10px;font-weight:600;line-height:20px;">${esc(tc.label)}</div>${wLabel?`<div style="padding:1px 10px;font-size:9px;font-weight:500;color:${tc.color};">${esc(wLabel)}</div>`:''}<div style="padding:6px 10px;font-size:11px;color:#374151;line-height:1.5;word-break:break-word;">${xh}</div></div></foreignObject>`});s+=`</svg>`;toImg(s,W,H,'argmap-canvas.png')}

/* ═══ ArgMap Interaction Handlers ═══ */
function amHandleNodeClick(e,id){
  e.stopPropagation();
  if(amJustDragConnRef.current){amJustDragConnRef.current=false;return}
  if(amTouchHandledRef.current){amTouchHandledRef.current=false;return}
  if(amDidDragRef.current){amDidDragRef.current=false;return}
  if(amInteractionMode==='delete'){amDeleteNode(id);return}
  if(amInteractionMode==='connect'){
    if(!amLinkFromNodeId){setAmLinkFromNodeId(id);return}
    if(amLinkFromNodeId===id){setAmLinkFromNodeId(null);return}
    if(!amEdges.some(e2=>e2.from===amLinkFromNodeId&&e2.to===id&&e2.type===amLinkEdgeType))amSetEdges(p=>[...p,{id:amEid(),from:amLinkFromNodeId,to:id,type:amLinkEdgeType}]);
    setAmLinkFromNodeId(null);return}
  setAmSelectedNodeId(id)}
function amHandleEdgeClick(e,id){
  e.stopPropagation();
  if(amInteractionMode==='delete'){amDeleteEdge(id);return}
  if(amInteractionMode==='connect'){
    if(amLinkFromNodeId){
      if(amLinkFromNodeId===id){setAmLinkFromNodeId(null);return}
      if(amLinkEdgeType==='link'){const te=amEdges.find(x=>x.id===id);if(te?.type==='link')return}
      if(!amEdges.some(x=>x.from===amLinkFromNodeId&&x.to===id))amSetEdges(p=>[...p,{id:amEid(),from:amLinkFromNodeId,to:id,type:amLinkEdgeType}]);
      setAmLinkFromNodeId(null)
    } else if(amLinkEdgeType==='link'){
      const te=amEdges.find(x=>x.id===id);
      if(te?.type==='link')return;
      setAmLinkFromNodeId(id)
    }
  }}
function amHandleNodeMouseDown(e,id){if(amInteractionMode!=='select')return;e.preventDefault();const n=amCommittedNodes.find(x=>x.id===id);if(!n)return;amDragInfoRef.current={id,mouseX:e.clientX,mouseY:e.clientY,nodeX:n.x,nodeY:n.y};amDidDragRef.current=false;setAmSelectedNodeId(id)}
function amOnConnDragStart(nid,e){if(amInteractionMode!=='connect'||amLinkFromNodeId)return;const n=amCommittedNodes.find(x=>x.id===nid);if(!n)return;amDragConnRef.current={fromId:nid,startX:e.clientX,startY:e.clientY,active:false,anchorX:n.x+AM_NODE_WIDTH/2,anchorY:n.y+amGh(nid)/2}}
function amOnConnDragEnd(nid){const dr=amDragConnRef.current;if(!dr.active||!dr.fromId||dr.fromId===nid)return;if(!amEdges.some(e2=>e2.from===dr.fromId&&e2.to===nid&&e2.type===amLinkEdgeType))amSetEdges(p=>[...p,{id:amEid(),from:dr.fromId,to:nid,type:amLinkEdgeType}]);amDragConnRef.current={fromId:null,startX:0,startY:0,active:false,anchorX:0,anchorY:0};setAmDragLine(null);amJustDragConnRef.current=true;setTimeout(()=>{amJustDragConnRef.current=false},100);setAmLinkFromNodeId(null)}
function amOnConnDragEndEdge(edgeId){const dr=amDragConnRef.current;if(!dr.active||!dr.fromId)return;if(amLinkEdgeType==='link'){const te=amEdges.find(x=>x.id===edgeId);if(te?.type==='link')return}if(!amEdges.some(x=>x.from===dr.fromId&&x.to===edgeId))amSetEdges(p=>[...p,{id:amEid(),from:dr.fromId,to:edgeId,type:amLinkEdgeType}]);amDragConnRef.current={fromId:null,startX:0,startY:0,active:false,anchorX:0,anchorY:0};setAmDragLine(null);amJustDragConnRef.current=true;setTimeout(()=>{amJustDragConnRef.current=false},100);setAmLinkFromNodeId(null)}

function amOnConnDragStartEdge(edgeId,e){if(amInteractionMode!=='connect'||amLinkEdgeType!=='link')return;if(amLinkFromNodeId)return;const te=amEdges.find(x=>x.id===edgeId);if(!te||te.type==='link')return;const geo=amEdgeGeometry.edgeLines.find(el=>el.id===edgeId);if(!geo)return;amDragConnRef.current={fromId:edgeId,startX:e.clientX,startY:e.clientY,active:false,anchorX:geo.mx,anchorY:geo.my}}


/* ═══ Tab Management ═══ */
const saveCurrentWarranteeState=useCallback(()=>{
  const wid=activeWarranteeId;
  warranteeStatesRef.current[wid]={
    nodes:JSON.parse(JSON.stringify(nodes)),
    edges:JSON.parse(JSON.stringify(edges)),
    detailId,detailType,descState:JSON.parse(JSON.stringify(descState)),
    zoom,mode,connFrom,
    history:{past:JSON.parse(JSON.stringify(historyRef2.current.past)),future:JSON.parse(JSON.stringify(historyRef2.current.future))}
  }},[nodes,edges,detailId,detailType,descState,zoom,mode,connFrom,activeWarranteeId]);

const loadWarranteeState=useCallback((wid)=>{
  const st=warranteeStatesRef.current[wid];
  if(st){
    setNodes(st.nodes);setEdges(st.edges);setDetailId(st.detailId);setDetailType(st.detailType);
    setDescState(st.descState||{});setZoom(st.zoom||1);setMode(st.mode||'select');setConnFrom(st.connFrom||null);
    historyRef2.current={past:st.history?.past||[],future:st.history?.future||[]};
    _nid=st.nodes.length?Math.max(0,...st.nodes.map(n=>n.id)):0;
    _eid=st.edges.length?Math.max(0,...st.edges.map(e=>e.id)):0;
  }else{
    setNodes([]);setEdges([]);setDetailId(null);setDetailType('cause');setDescState({});setZoom(1);setMode('select');setConnFrom(null);
    historyRef2.current={past:[],future:[]};
  }
  setEditModal(null);setShowNav(false);setActiveWarranteeId(wid);setHistoryTick(t=>t+1)},[]);

const switchTab=useCallback((tabId)=>{
  if(tabId===activeTab)return;
  // Save current warrantee state if currently on a warrantee tab
  if(activeTab.startsWith('w-')){saveCurrentWarranteeState()}
  // If switching to a different warrantee tab, load its state
  if(tabId.startsWith('w-')){loadWarranteeState(tabId)}
  setActiveTab(tabId)},[activeTab,saveCurrentWarranteeState,loadWarranteeState]);

const addWarranteeTab=useCallback(()=>{
  const newId='w-'+wTabCounter;
  const newLabel='Warrantee '+(wTabCounter+1);
  setWarranteeTabs(p=>[...p,{id:newId,label:newLabel}]);
  setWTabCounter(c=>c+1);
  // Save current warrantee state before switching
  if(activeTab.startsWith('w-')){saveCurrentWarranteeState()}
  // Initialize empty state for new tab
  warranteeStatesRef.current[newId]={nodes:[],edges:[],detailId:null,detailType:'cause',descState:{},zoom:1,mode:'select',connFrom:null,history:{past:[],future:[]}};
  loadWarranteeState(newId);
  setActiveTab(newId)},[wTabCounter,activeTab,saveCurrentWarranteeState,loadWarranteeState]);

const closeWarranteeTab=useCallback((tabId)=>{
  if(warranteeTabs.length<=1)return; // keep at least one
  const idx=warranteeTabs.findIndex(t=>t.id===tabId);
  const newTabs=warranteeTabs.filter(t=>t.id!==tabId);
  setWarranteeTabs(newTabs);
  delete warranteeStatesRef.current[tabId];
  if(activeTab===tabId){
    // Switch to adjacent tab
    const newActive=newTabs[Math.min(idx,newTabs.length-1)]?.id||'argmap';
    if(newActive.startsWith('w-')){loadWarranteeState(newActive)}
    setActiveTab(newActive)}
},[warranteeTabs,activeTab,loadWarranteeState]);

const renameWarranteeTab=useCallback((tabId,newLabel)=>{
  setWarranteeTabs(p=>p.map(t=>t.id===tabId?{...t,label:newLabel}:t))},[]);
const pushHistory=()=>{const h=historyRef2.current;h.past.push({nodes:JSON.parse(JSON.stringify(stateRef.current.nodes)),edges:JSON.parse(JSON.stringify(stateRef.current.edges))});if(h.past.length>50)h.past.shift();h.future=[];setHistoryTick(t=>t+1)};
const undo=()=>{const h=historyRef2.current;if(!h.past.length)return;const s=stateRef.current;h.future.push({nodes:JSON.parse(JSON.stringify(s.nodes)),edges:JSON.parse(JSON.stringify(s.edges))});const prev=h.past.pop();setNodes(prev.nodes);setEdges(prev.edges);_nid=prev.nodes.length?Math.max(0,...prev.nodes.map(n=>n.id)):0;_eid=prev.edges.length?Math.max(0,...prev.edges.map(e=>e.id)):0;setHistoryTick(t=>t+1)};
const redo=()=>{const h=historyRef2.current;if(!h.future.length)return;const s=stateRef.current;h.past.push({nodes:JSON.parse(JSON.stringify(s.nodes)),edges:JSON.parse(JSON.stringify(s.edges))});const next=h.future.pop();setNodes(next.nodes);setEdges(next.edges);_nid=next.nodes.length?Math.max(0,...next.nodes.map(n=>n.id)):0;_eid=next.edges.length?Math.max(0,...next.edges.map(e=>e.id)):0;setHistoryTick(t=>t+1)};
const clearCanvas=()=>{if(!nodes.length&&!edges.length)return;pushHistory();setNodes([]);setEdges([]);setDetailId(null);setEditModal(null);setConnFrom(null)};

const saveEdit=useCallback(()=>{if(!editModal||!emRef.current)return;emRef.current.querySelectorAll('img').forEach(i=>{i.style.outline=''});pushHistory();const html=emRef.current.innerHTML;const div=document.createElement('div');div.innerHTML=html;const text=div.textContent||div.innerText||'';setNodes(p=>p.map(n=>n.id===editModal.nid?{...n,html,text}:n));setEditModal(null);setWCropModal(null);wEditImgRef.current=null},[editModal]);

const isHierarchyEdge=t=>t==='whole'||t==='attribute';
const isAnalysisEdge=t=>!isHierarchyEdge(t);

useEffect(()=>{if(detailId!==null){setSlidersOpen(false)}},[detailId]);
useEffect(()=>{if(editModal&&!nodes.find(n=>n.id===editModal.nid))setEditModal(null)},[nodes,editModal]);
useEffect(()=>{if(detailId===null){const id=requestAnimationFrame(()=>setDimTick(t=>t+1));return()=>cancelAnimationFrame(id)}},[detailId]);
useEffect(()=>{if(detailId!==null)return;const obs=new ResizeObserver(()=>setDimTick(t=>t+1));Object.values(nodeElsRef.current).forEach(el=>el&&obs.observe(el));return()=>obs.disconnect()},[nodes,detailId]);
useEffect(()=>{if(activePage==='workspace')setTimeout(()=>setDimTick(t=>t+1),60)},[activePage]);
useEffect(()=>{if(!resizing)return;const mv=e=>{const cx=(e.touches?.[0]||e).clientX;const r=ctnRef.current?.getBoundingClientRect();if(r)setRatio(Math.min(65,Math.max(18,((cx-r.left)/r.width)*100)))};const up=()=>setResizing(false);window.addEventListener('mousemove',mv);window.addEventListener('mouseup',up);window.addEventListener('touchmove',mv);window.addEventListener('touchend',up);return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseup',up);window.removeEventListener('touchmove',mv);window.removeEventListener('touchend',up)}},[resizing]);
/* ═══ ArgMap mouse move/up for node dragging ═══ */
useEffect(()=>{
  const handleAmMouseMove=e=>{
    if(!amDragInfoRef.current)return;
    amDidDragRef.current=true;
    setAmDragDelta({id:amDragInfoRef.current.id,dx:(e.clientX-amDragInfoRef.current.mouseX)/amZoomLevel,dy:(e.clientY-amDragInfoRef.current.mouseY)/amZoomLevel})};
  const handleAmMouseUp=()=>{
    if(amDragInfoRef.current&&amDidDragRef.current){
      const info=amDragInfoRef.current;
      setAmDragDelta(prev=>{
        if(prev&&prev.id===info.id){amHistory.push(old=>({...old,nodes:old.nodes.map(n=>n.id!==info.id?n:{...n,x:Math.max(0,info.nodeX+prev.dx),y:Math.max(0,info.nodeY+prev.dy)})}))}
        return null})}
    else setAmDragDelta(null);
    amDragInfoRef.current=null};
  window.addEventListener('mousemove',handleAmMouseMove);
  window.addEventListener('mouseup',handleAmMouseUp);
  return()=>{window.removeEventListener('mousemove',handleAmMouseMove);window.removeEventListener('mouseup',handleAmMouseUp)}},[amZoomLevel,amHistory.push]);

/* ═══ ArgMap drag-to-connect mouse tracking ═══ */
useEffect(()=>{
  const onMM=e=>{const dr=amDragConnRef.current;if(!dr.fromId)return;const dx=e.clientX-dr.startX,dy=e.clientY-dr.startY;if(!dr.active&&dx*dx+dy*dy>64)dr.active=true;if(dr.active&&amScrollRef.current){const cr=amScrollRef.current.getBoundingClientRect();setAmDragLine({x1:dr.anchorX,y1:dr.anchorY,x2:(e.clientX-cr.left+amScrollRef.current.scrollLeft)/amZoomRef.current,y2:(e.clientY-cr.top+amScrollRef.current.scrollTop)/amZoomRef.current})}};
  const onMU=()=>{const dr=amDragConnRef.current;if(dr.active){amJustDragConnRef.current=true;setTimeout(()=>{amJustDragConnRef.current=false},100);setAmLinkFromNodeId(null)}amDragConnRef.current={fromId:null,startX:0,startY:0,active:false,anchorX:0,anchorY:0};setAmDragLine(null)};
  document.addEventListener('mousemove',onMM);document.addEventListener('mouseup',onMU);
  return()=>{document.removeEventListener('mousemove',onMM);document.removeEventListener('mouseup',onMU)}
},[]);

/* ═══ ArgMap layout measurement ═══ */
useLayoutEffect(()=>{if(activeTab!=='argmap')return;let ch=false;amNodes.forEach(n=>{const el=amNodeElsRef.current[n.id];if(el){const h=el.offsetHeight;if(amMeasuredHRef.current[n.id]!==h){amMeasuredHRef.current[n.id]=h;ch=true}}});if(ch)setAmHeightVersion(v=>v+1)},[amNodes,activeTab]);

/* ═══ ArgMap wheel zoom ═══ */
useEffect(()=>{const c=amScrollRef.current;if(!c)return;function h(e){if(e.ctrlKey||e.metaKey){e.preventDefault();if(e.deltaY<0)amZoomIn2();else amZoomOut2()}}c.addEventListener('wheel',h,{passive:false});return()=>c.removeEventListener('wheel',h)},[]);

/* ═══ ArgMap keyboard shortcuts ═══ */
useEffect(()=>{
  const h=e=>{
    if(activeTab!=='argmap')return;
    const tag=e.target.tagName;
    const isEd=e.target.isContentEditable||tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT';
    if(e.key==='z'&&(e.ctrlKey||e.metaKey)&&!e.shiftKey&&!isEd){e.preventDefault();amHistory.undo();return}
    if((e.key==='z'&&(e.ctrlKey||e.metaKey)&&e.shiftKey)||(e.key==='y'&&(e.ctrlKey||e.metaKey))){if(!isEd){e.preventDefault();amHistory.redo()}return}
    if(isEd)return;
    if((e.key==='Delete'||e.key==='Backspace')&&amSelectedNodeId){e.preventDefault();amDeleteNode(amSelectedNodeId);return}
    if(e.key==='Escape'){
      if(amCqModal){setAmCqModal(null);return}
      if(amEditNodeId){setAmEditNodeId(null);return}
      if(amLinkFromNodeId){setAmLinkFromNodeId(null);return}
      if(amSelectedNodeId){setAmSelectedNodeId(null);return}
      if(amInteractionMode!=='select'){setAmInteractionMode('select');return}
      return}
    if(e.key==='v'||e.key==='V'){setAmInteractionMode('select');setAmLinkFromNodeId(null);return}
    if((e.key==='c'||e.key==='C')&&!e.ctrlKey&&!e.metaKey){setAmInteractionMode('connect');setAmLinkFromNodeId(null);return}
    if((e.key==='x'||e.key==='X')&&!e.ctrlKey&&!e.metaKey){setAmInteractionMode('delete');setAmLinkFromNodeId(null);return}
    if(e.key==='Enter'&&amSelectedNodeId&&!amEditNodeId&&!amCqModal){e.preventDefault();amStartEditing(amSelectedNodeId);return}
  };
  window.addEventListener('keydown',h);
  return()=>window.removeEventListener('keydown',h);
},[activeTab,amSelectedNodeId,amEditNodeId,amCqModal,amLinkFromNodeId,amInteractionMode]);

/* ═══ ArgMap global touch handlers ═══ */
useEffect(()=>{
  let pinch=null;
  function onTM(e){
    if(e.touches.length===2&&amScrollRef.current&&amScrollRef.current.contains(e.target)){
      e.preventDefault();
      if(!pinch)pinch={d:amTouchDist(e.touches[0],e.touches[1]),z:amZoomRef.current};
      else{const d=amTouchDist(e.touches[0],e.touches[1]);setAmZoomLevel(Math.max(.25,Math.min(2,Math.round(pinch.z*(d/pinch.d)*100)/100)))}
      return}
    if(e.touches.length!==1){pinch=null;return}
    pinch=null;
    if(amDragInfoRef.current){
      const t=e.touches[0],z=amZoomRef.current;
      const dx=(t.clientX-amDragInfoRef.current.mouseX)/z,dy=(t.clientY-amDragInfoRef.current.mouseY)/z;
      if(!amDidDragRef.current&&(Math.abs(dx)>AM_TOUCH_DRAG_THRESHOLD||Math.abs(dy)>AM_TOUCH_DRAG_THRESHOLD))amDidDragRef.current=true;
      if(amDidDragRef.current){e.preventDefault();setAmDragDelta({id:amDragInfoRef.current.id,dx,dy})}
    }
  }
  function onTE(){
    pinch=null;
    if(amDragInfoRef.current){
      if(amDidDragRef.current){
        const info=amDragInfoRef.current;
        setAmDragDelta(prev=>{
          if(prev&&prev.id===info.id){amHistory.push(old=>({...old,nodes:old.nodes.map(n=>n.id!==info.id?n:{...n,x:Math.max(0,info.nodeX+prev.dx),y:Math.max(0,info.nodeY+prev.dy)})}))}
          return null})}
      else setAmDragDelta(null);
      amDragInfoRef.current=null}
  }
  document.addEventListener('touchmove',onTM,{passive:false});
  document.addEventListener('touchend',onTE);
  return()=>{document.removeEventListener('touchmove',onTM);document.removeEventListener('touchend',onTE)}
},[amHistory.push]);

/* ═══ ArgMap computed values ═══ */
const amCqWarrantMap=useMemo(()=>{const m={};amNodes.forEach(n=>{if(amIsCqType(n.type))m[n.id]=amFindLinkedWarrant(n.id,amEdges,amNodes)});return m},[amNodes,amEdges]);
const amCqLinkedCqMap=useMemo(()=>{const m={};amNodes.forEach(n=>{if(amIsCqType(n.type))m[n.id]=amFindLinkedCQ(n.id,amEdges,amNodes)});return m},[amNodes,amEdges]);
const amLinkGroupMap=useMemo(()=>{const m={};amNodes.forEach(n=>{const p=amFindLinkedPeers(n.id,amEdges);if(p.size>0)m[n.id]=p});return m},[amNodes,amEdges]);

const amEdgeGeometry=useMemo(()=>{
  const pm={};
  for(let pass=0;pass<5;pass++){for(const edge of amEdges){if(pm[edge.id])continue;
    const fromIsEdge=amIsEdge(edge.from);
    const fn=fromIsEdge?null:amNodes.find(n=>n.id===edge.from);
    if(!fn&&!fromIsEdge)continue;
    if(fromIsEdge){
      const fep=pm[edge.from];if(!fep)continue;
      const fg={x:fep.mx,y:fep.my};
      if(amIsEdge(edge.to)){
        const tep=pm[edge.to];if(!tep)continue;
        const tg={x:tep.mx,y:tep.my};
        const dx2=tg.x-fg.x,dy2=tg.y-fg.y,len=Math.sqrt(dx2*dx2+dy2*dy2);
        let x1=fg.x,y1=fg.y,x2=tg.x,y2=tg.y;
        if(len>AM_JUNCTION_RADIUS*2){const r1=AM_JUNCTION_RADIUS/len;x1=fg.x+dx2*r1;y1=fg.y+dy2*r1;const r2=(len-AM_JUNCTION_RADIUS)/len;x2=fg.x+dx2*r2;y2=fg.y+dy2*r2}
        pm[edge.id]={...edge,x1,y1,x2,y2,mx:(x1+x2)/2,my:(y1+y2)/2,toEdge:true,fromEdge:true}
      } else {
        const tn=amNodes.find(n=>n.id===edge.to);if(!tn)continue;
        const th=amGh(tn.id);const tp=amGetBorderPoint(tn,fg.x,fg.y,th);
        const dx2=fg.x-tp.x,dy2=fg.y-tp.y,len=Math.sqrt(dx2*dx2+dy2*dy2);
        let x1=fg.x,y1=fg.y;if(len>AM_JUNCTION_RADIUS){const r=AM_JUNCTION_RADIUS/len;x1=fg.x-dx2*r;y1=fg.y-dy2*r}
        pm[edge.id]={...edge,x1,y1,x2:tp.x,y2:tp.y,mx:(x1+tp.x)/2,my:(y1+tp.y)/2,toEdge:false,fromEdge:true}
      }
    } else if(!amIsEdge(edge.to)){
      const tn=amNodes.find(n=>n.id===edge.to);if(!tn)continue;const fh=amGh(fn.id),th=amGh(tn.id);const fc={x:fn.x+AM_NODE_WIDTH/2,y:fn.y+fh/2},tc={x:tn.x+AM_NODE_WIDTH/2,y:tn.y+th/2};const fp=amGetBorderPoint(fn,tc.x,tc.y,fh),tp=amGetBorderPoint(tn,fc.x,fc.y,th);pm[edge.id]={...edge,x1:fp.x,y1:fp.y,x2:tp.x,y2:tp.y,mx:(fp.x+tp.x)/2,my:(fp.y+tp.y)/2,toEdge:false,fromEdge:false}
    } else {
      const tep=pm[edge.to];if(!tep)continue;const tg={x:tep.mx,y:tep.my};const fh=amGh(fn.id);const fp=amGetBorderPoint(fn,tg.x,tg.y,fh);const dx2=tg.x-fp.x,dy2=tg.y-fp.y,len=Math.sqrt(dx2*dx2+dy2*dy2);let ex=tg.x,ey=tg.y;if(len>AM_JUNCTION_RADIUS){const r=(len-AM_JUNCTION_RADIUS)/len;ex=fp.x+dx2*r;ey=fp.y+dy2*r}pm[edge.id]={...edge,x1:fp.x,y1:fp.y,x2:ex,y2:ey,mx:(fp.x+ex)/2,my:(fp.y+ey)/2,toEdge:true,fromEdge:false}
    }
  }}
  const tids=new Set(amEdges.filter(e=>amIsEdge(e.to)).map(e=>e.to));
  amEdges.forEach(e=>{if(amIsEdge(e.from))tids.add(e.from)});
  return{edgeLines:Object.values(pm),targetedEdgeIds:tids}},[amEdges,amNodes,amHeightVersion]);

const amCanvasW=amNodes.length?Math.max(1200,Math.max(...amNodes.map(n=>n.x+AM_NODE_WIDTH+150))):1200;
const amCanvasH=amNodes.length?Math.max(700,Math.max(...amNodes.map(n=>n.y+amGh(n.id)+200))):700;
const amSelectedNode=amNodes.find(n=>n.id===amSelectedNodeId);
const amEditingNode=amEditNodeId?amCommittedNodes.find(n=>n.id===amEditNodeId):null;
useEffect(()=>{if(dragId===null)return;const mv=e=>{e.preventDefault();const{clientX:cx,clientY:cy}=e.touches?.[0]||e;const cv=cvRef.current;if(!cv)return;const r=cv.getBoundingClientRect();setNodes(p=>p.map(n=>n.id===dragId?{...n,x:Math.max(0,(cx-r.left+cv.scrollLeft)/zoom-dOff.current.x),y:Math.max(0,(cy-r.top+cv.scrollTop)/zoom-dOff.current.y)}:n))};const up=()=>setDragId(null);window.addEventListener('mousemove',mv);window.addEventListener('mouseup',up);window.addEventListener('touchmove',mv,{passive:false});window.addEventListener('touchend',up);return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseup',up);window.removeEventListener('touchmove',mv);window.removeEventListener('touchend',up)}},[dragId,zoom]);
useEffect(()=>{const el=rpRef.current;if(!el)return;const h=e=>{if((e.ctrlKey||e.metaKey)&&detailIdRef.current===null){e.preventDefault();setZoom(z=>Math.min(3,Math.max(0.25,+(z+(e.deltaY>0?-0.1:0.1)).toFixed(2))))}};el.addEventListener('wheel',h,{passive:false});return()=>el.removeEventListener('wheel',h)},[]);
useEffect(()=>{if(editModal&&emRef.current){emRef.current.innerHTML=editModal.html;emRef.current.focus();wEditImgRef.current=null;setWCropModal(null)}else{wEditImgRef.current=null;setWCropModal(null)}},[editModal]);

useEffect(()=>{
  const onMM=e=>{const dr=dragConnRef.current;if(!dr.fromId)return;const dx=e.clientX-dr.startX,dy=e.clientY-dr.startY;if(!dr.active&&dx*dx+dy*dy>64)dr.active=true;if(dr.active&&cvRef.current){const cr=cvRef.current.getBoundingClientRect();setDragLine({x1:dr.anchorX,y1:dr.anchorY,x2:(e.clientX-cr.left+cvRef.current.scrollLeft)/zoom,y2:(e.clientY-cr.top+cvRef.current.scrollTop)/zoom})}};
  const onMU=()=>{const dr=dragConnRef.current;if(dr.active){justDraggedRef.current=true;setTimeout(()=>{justDraggedRef.current=false},100);setConnFrom(null)}dragConnRef.current={fromId:null,startX:0,startY:0,active:false,anchorX:0,anchorY:0};setDragLine(null)};
  document.addEventListener('mousemove',onMM);document.addEventListener('mouseup',onMU);
  return()=>{document.removeEventListener('mousemove',onMM);document.removeEventListener('mouseup',onMU)}
},[zoom]);

const adActive=adXY!==null;
useEffect(()=>{if(!adActive)return;const mv=e=>{e.preventDefault();const{clientX,clientY}=e.touches?.[0]||e;setAdXY({x:clientX,y:clientY});const r=(adRef.current?.vennEl||vennRef.current)?.getBoundingClientRect();if(r)setAdHover(getVennZone(clientX-r.left,clientY-r.top))};const up=e=>{const{clientX,clientY}=e.changedTouches?.[0]||e;const info=adRef.current;const r=(info?.vennEl||vennRef.current)?.getBoundingClientRect();if(info&&r){const zone=getVennZone(clientX-r.left,clientY-r.top);setEdges(p=>p.map(ed=>ed.id===info.edgeId?{...ed,analogyPositions:{...(ed.analogyPositions||{}),[info.nodeId]:{pos:zone,defaultWhenSet:info.defaultPos}}}:ed))}adRef.current=null;setAdXY(null);setAdHover(null)};window.addEventListener('mousemove',mv);window.addEventListener('mouseup',up);window.addEventListener('touchmove',mv,{passive:false});window.addEventListener('touchend',up);return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseup',up);window.removeEventListener('touchmove',mv);window.removeEventListener('touchend',up)}},[adActive]);

useEffect(()=>{if(!showNav)return;if(navBtnRef.current&&ctnRef.current){const btnR=navBtnRef.current.getBoundingClientRect();const ctnR=ctnRef.current.getBoundingClientRect();const panelRight=ctnR.left+ctnR.width*ratio/100+6;const spaceLeft=btnR.left-panelRight;setNavFlip(spaceLeft<310)}const h=()=>setShowNav(false);const id=setTimeout(()=>document.addEventListener('mousedown',h),0);return()=>{clearTimeout(id);document.removeEventListener('mousedown',h)}},[showNav,ratio]);

const childCounts=useMemo(()=>{const c={};for(const e of edges)if(isHierarchyEdge(e.type))c[e.from]=(c[e.from]||0)+1;return c},[edges]);
const visibleNodeIds=useMemo(()=>{const hidden=new Set();for(const nd of nodes){if(nd.collapsed!==true)continue;const q=[];edges.forEach(e=>{if(isHierarchyEdge(e.type)&&e.from===nd.id&&!hidden.has(e.to)){hidden.add(e.to);q.push(e.to)}});while(q.length){const nid=q.shift();edges.forEach(e=>{if(isHierarchyEdge(e.type)&&e.from===nid&&!hidden.has(e.to)){hidden.add(e.to);q.push(e.to)}})}}const childSet=new Set(edges.filter(e=>isHierarchyEdge(e.type)).map(e=>e.to));const vis=new Set(),q=[];nodes.forEach(n=>{if(!childSet.has(n.id)&&!hidden.has(n.id)){vis.add(n.id);q.push(n.id)}});while(q.length){const nid=q.shift();const nd=nodes.find(n=>n.id===nid);if(!nd||nd.collapsed===true)continue;edges.forEach(e=>{if(isHierarchyEdge(e.type)&&e.from===nid&&!vis.has(e.to)&&!hidden.has(e.to)){vis.add(e.to);q.push(e.to)}})}return vis},[nodes,edges]);
const visibleChildCounts=useMemo(()=>{const c={};for(const e of edges)if(isHierarchyEdge(e.type)&&visibleNodeIds.has(e.to))c[e.from]=(c[e.from]||0)+1;return c},[edges,visibleNodeIds]);
const navEdges=useMemo(()=>edges.map(e=>{const fn=nodes.find(n=>n.id===e.from),tn=nodes.find(n=>n.id===e.to);return{...e,fromText:fn?.text?.trim()||'?',toText:tn?.text?.trim()||'?'}}),[edges,nodes]);

const toggleCollapse=useCallback(nid=>{const nd=nodes.find(n=>n.id===nid);if(!nd)return;const cc=childCounts[nid]||0;if(cc===0)return;const vcc=visibleChildCounts[nid]||0;const app=nd.collapsed===true||(cc>0&&vcc===0);if(app){setNodes(prev=>{const toE=new Set();const self=prev.find(n=>n.id===nid);if(self?.collapsed)toE.add(nid);const dc=edges.filter(e=>isHierarchyEdge(e.type)&&e.from===nid).map(e=>e.to);for(const cid of dc){const vis2=new Set(),queue=[cid];while(queue.length){const cur=queue.shift();if(vis2.has(cur))continue;vis2.add(cur);for(const e of edges){if(isHierarchyEdge(e.type)&&e.to===cur&&!vis2.has(e.from)){const pn=prev.find(n=>n.id===e.from);if(pn?.collapsed)toE.add(e.from);queue.push(e.from)}}}}if(toE.size===0)return prev;return prev.map(n=>toE.has(n.id)?{...n,collapsed:false}:n)})}else{setNodes(prev=>prev.map(n=>n.id===nid?{...n,collapsed:true}:n))}},[nodes,edges,childCounts,visibleChildCounts]);
const expandAll=useCallback(()=>{setNodes(p=>p.map(n=>n.collapsed?{...n,collapsed:false}:n))},[]);
const collapseAll=useCallback(()=>{setNodes(p=>{const par=new Set();edges.forEach(e=>{if(isHierarchyEdge(e.type))par.add(e.from)});return p.map(n=>par.has(n.id)?{...n,collapsed:true}:n)})},[edges]);
const getNodeWithChildrenLabel=useCallback((nid)=>{const nd=nodes.find(n=>n.id===nid);if(!nd)return'';const parts=[nd.text?.trim()||''];const cids=edges.filter(e=>isHierarchyEdge(e.type)&&e.from===nid).map(e=>e.to);for(const cid of cids){const cn=nodes.find(n=>n.id===cid);if(cn)parts.push(cn.text?.trim()||'')}return parts.filter(Boolean).join(' | ')},[nodes,edges]);

const exec=(c,v)=>{document.execCommand(c,false,v||null)};
const uploadFile=()=>{const i=document.createElement('input');i.type='file';i.accept='.txt,.html,.htm';i.onchange=e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=ev=>{if(!edRef.current)return;const raw=ev.target.result;const ext=f.name.split('.').pop().toLowerCase();if(ext==='txt'){const escaped=raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');edRef.current.innerHTML=escaped.replace(/\n/g,'<br>')}else{const doc=new DOMParser().parseFromString(raw,'text/html');doc.querySelectorAll('style,script,link[rel="stylesheet"]').forEach(el=>el.remove());edRef.current.innerHTML=doc.body?doc.body.innerHTML:raw}};r.readAsText(f)}};i.click()};
const saveProject=()=>{
  // Save current warrantee tab state first
  if(activeTab.startsWith('w-')){saveCurrentWarranteeState()}
  if(edRef.current){edRef.current.querySelectorAll('img').forEach(i=>{i.style.outline=''})}srcCropImgRef.current=null;
  const d={v:13,
    text:edRef.current?.innerHTML||'',
    activeTab,
    // ArgMap state
    argmap:{nodes:amCommittedNodes,edges:amEdges},
    // All warrantee tab states
    warranteeTabs,activeWarranteeId,
    warranteeStates:Object.fromEntries(
      warranteeTabs.map(t=>{
        const st=t.id===activeWarranteeId?
          {nodes:JSON.parse(JSON.stringify(nodes)),edges:JSON.parse(JSON.stringify(edges)),detailId,detailType,descState:JSON.parse(JSON.stringify(descState)),zoom,mode,connFrom}
          :warranteeStatesRef.current[t.id]||{nodes:[],edges:[]};
        return[t.id,st]})
    )
  };
  const b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});
  const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='argwarrantee-project.json';a.click();URL.revokeObjectURL(u)};
const loadProject=()=>{const i=document.createElement('input');i.type='file';i.accept='.json';i.onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);
  if(d.text&&edRef.current)edRef.current.innerHTML=d.text;
  // v13+: ArgWarrantee format
  if(d.v>=13&&d.argmap){
    // Load ArgMap
    const amN=d.argmap.nodes||[],amE=d.argmap.edges||[];
    amHistory.reset({nodes:amApplyAutoClaimData(amN,amE),edges:amE});
    setAmSelectedNodeId(null);setAmEditNodeId(null);setAmCqModal(null);setAmZoomLevel(1);
    // FIX: Restore amIdCounter to avoid ID collisions with loaded nodes/edges
    let maxAmId=10000;
    [...amN,...amE].forEach(item=>{if(typeof item.id==='string'){const num=parseInt(item.id.replace(/\D/g,''),10);if(!isNaN(num)&&num>maxAmId)maxAmId=num}});
    amIdCounter=maxAmId;
    // FIX: Clear stale DOM refs from previous session
    amNodeElsRef.current={};
    amMeasuredHRef.current={};
    setAmHeightVersion(v=>v+1);
    // Load Warrantee tabs
    const tabs=d.warranteeTabs||[{id:'w-0',label:'Warrantee 1'}];
    setWarranteeTabs(tabs);
    const wStates=d.warranteeStates||{};
    warranteeStatesRef.current={};
    tabs.forEach(t=>{if(wStates[t.id])warranteeStatesRef.current[t.id]=wStates[t.id]});
    const firstWId=tabs[0]?.id||'w-0';
    const firstSt=wStates[firstWId]||{nodes:[],edges:[]};
    setNodes(firstSt.nodes||[]);setEdges(firstSt.edges||[]);
    setDetailId(firstSt.detailId||null);setDetailType(firstSt.detailType||'cause');
    setDescState(firstSt.descState||{});setZoom(firstSt.zoom||1);
    setActiveWarranteeId(firstWId);
    _nid=(firstSt.nodes||[]).length?Math.max(0,...firstSt.nodes.map(n=>n.id)):0;
    _eid=(firstSt.edges||[]).length?Math.max(0,...firstSt.edges.map(e=>e.id)):0;
    const maxTabNum=tabs.reduce((m,t)=>{const n=parseInt(t.id.replace('w-',''));return isNaN(n)?m:Math.max(m,n+1)},1);
    setWTabCounter(maxTabNum);
    setActiveTab(d.activeTab||'argmap');
  }
  // Legacy v12: old Warrantee-only format
  else if(d.nodes&&Array.isArray(d.nodes)){
    setNodes(d.nodes);_nid=Math.max(0,...d.nodes.map(n=>n.id));
    if(d.edges&&Array.isArray(d.edges)){setEdges(d.edges);_eid=Math.max(0,...d.edges.map(e=>e.id))}
    if(d.descState)setDescState(d.descState);
    setActiveTab('w-0');setActiveWarranteeId('w-0');
    setWarranteeTabs([{id:'w-0',label:'Warrantee 1'}]);
  }
  setDetailId(null);setEditModal(null);setMode('select');setConnFrom(null);setLastDeleted(null);setShowNav(false);
  historyRef2.current={past:[],future:[]};setActivePage('workspace');setHistoryTick(t=>t+1);
}catch(err){console.error(err)}};r.readAsText(f)};i.click()};
const addExpr=e=>{e.preventDefault();const s=window.getSelection();if(!s?.toString().trim())return;pushHistory();const txt=s.toString().trim();let html=txt;if(s.rangeCount>0){const f=s.getRangeAt(0).cloneContents();const d=document.createElement('div');d.appendChild(f);html=d.innerHTML||txt}setNodes(p=>[...p,{id:++_nid,text:txt,html,type:'expressed',x:30+(p.length%3)*200+Math.random()*30,y:30+Math.floor(p.length/3)*120+Math.random()*30}])};
const addUnexpr=()=>{pushHistory();setNodes(p=>[...p,{id:++_nid,text:'unexpressed',html:'<em>unexpressed</em>',type:'unexpressed',x:30+(p.length%3)*200+Math.random()*30,y:30+Math.floor(p.length/3)*120+Math.random()*30}])};
const undelete=()=>{if(!lastDeleted)return;if(lastDeleted.type==='node'){setNodes(p=>[...p,lastDeleted.node]);setEdges(p=>[...p,...lastDeleted.edges])}else if(lastDeleted.type==='edge'){setEdges(p=>[...p,lastDeleted.edge])}setLastDeleted(null)};

const nodeDown=(nid,e)=>{if(justDraggedRef.current)return;if(mode==='delete'){pushHistory();const dn=nodes.find(n=>n.id===nid);const de=edges.filter(ed=>ed.from===nid||ed.to===nid);if(dn)setLastDeleted({type:'node',node:dn,edges:de});setNodes(p=>p.filter(n=>n.id!==nid));setEdges(p=>p.filter(ed=>ed.from!==nid&&ed.to!==nid));return}if(mode.startsWith('connect-')){if(!connFrom){setConnFrom(nid)}else if(connFrom!==nid){if(!edges.some(ed=>(ed.from===connFrom&&ed.to===nid)||(ed.from===nid&&ed.to===connFrom))){pushHistory();const tp=mode.replace('connect-','');const ne={id:++_eid,from:connFrom,to:nid,type:tp,pPQ:75,pXPXQ:50,pPrior:50,srcIdentifiability:50,srcAccuracy:50,srcCredibility:50,srcTrustworthiness:50,srcConsistency:50,srcEvidentiality:50,thresholdReject:35,thresholdAccept:65};if(tp==='mean-goal'){ne.pPR=50;ne.pXPXR=50;ne.ramificationText='';ne.goalText=''}if(tp==='link'){ne.linkLabel=linkLabel;ne.linkScheme=DEFAULT_LINK_SCHEME;ne.linkCQs=DEFAULT_LINK_CQS;ne.linkBacking=DEFAULT_LINK_BACKING}setEdges(p=>[...p,ne])}setConnFrom(null)}return}const{clientX:cx,clientY:cy}=e.touches?.[0]||e;const cv=cvRef.current;if(!cv)return;const r=cv.getBoundingClientRect();const nd=nodes.find(n=>n.id===nid);if(!nd)return;dOff.current={x:(cx-r.left+cv.scrollLeft)/zoom-nd.x,y:(cy-r.top+cv.scrollTop)/zoom-nd.y};setDragId(nid)};
const nodeDbl=nid=>{if(mode!=='select')return;const nd=nodes.find(n=>n.id===nid);if(!nd)return;setEditModal({nid,html:nd.html})};

const onConnDragStart=(nid,e)=>{if(!mode.startsWith('connect-')||connFrom)return;const nd=nodes.find(n=>n.id===nid);if(!nd)return;const d=getNodeDims(nid);dragConnRef.current={fromId:nid,startX:e.clientX,startY:e.clientY,active:false,anchorX:nd.x+d.w/2,anchorY:nd.y+d.h/2}};

const onConnDragEnd=(nid)=>{const dr=dragConnRef.current;if(!dr.active||!dr.fromId||dr.fromId===nid||!mode.startsWith('connect-'))return;if(!edges.some(ed=>(ed.from===dr.fromId&&ed.to===nid)||(ed.from===nid&&ed.to===dr.fromId))){pushHistory();const tp=mode.replace('connect-','');const ne={id:++_eid,from:dr.fromId,to:nid,type:tp,pPQ:75,pXPXQ:50,pPrior:50,srcIdentifiability:50,srcAccuracy:50,srcCredibility:50,srcTrustworthiness:50,srcConsistency:50,srcEvidentiality:50,thresholdReject:35,thresholdAccept:65};if(tp==='mean-goal'){ne.pPR=50;ne.pXPXR=50;ne.ramificationText='';ne.goalText=''}if(tp==='link'){ne.linkLabel=linkLabel;ne.linkScheme=DEFAULT_LINK_SCHEME;ne.linkCQs=DEFAULT_LINK_CQS;ne.linkBacking=DEFAULT_LINK_BACKING}setEdges(p=>[...p,ne])}setConnFrom(null);dragConnRef.current={fromId:null,startX:0,startY:0,active:false,anchorX:0,anchorY:0};setDragLine(null);justDraggedRef.current=true;setTimeout(()=>{justDraggedRef.current=false},100)};

const edgeClick=(edge,e)=>{e.stopPropagation();if(mode==='delete'){pushHistory();setLastDeleted({type:'edge',edge});setEdges(p=>p.filter(ed=>ed.id!==edge.id));return}if(mode==='select'){if(isAnalysisEdge(edge.type)){setDetailType(edge.type);setDetailId(edge.id)}else if(edge.type==='whole'||edge.type==='attribute'){setDetailType('description');setDetailId(edge.id)}}};
const setProb=(eid,f,v)=>setEdges(p=>p.map(e=>e.id===eid?{...e,[f]:v}:e));
const setAnalogyPos=(eid,nid,pos,curDefault)=>setEdges(p=>p.map(e=>e.id===eid?{...e,analogyPositions:{...(e.analogyPositions||{}),[nid]:{pos,defaultWhenSet:curDefault}}}:e));
const resetAnalogyPositions=(eid)=>setEdges(p=>p.map(e=>e.id===eid?{...e,analogyPositions:{}}:e));

const getVennItems=useCallback((edge)=>{
  const bId=edge.from,tId=edge.to;const bR=new Map(),tR=new Map();
  edges.forEach(e=>{if(e.type!=='whole'&&e.type!=='attribute')return;
    if(e.from===bId&&e.to!==tId&&e.to!==bId){if(!bR.has(e.to))bR.set(e.to,[]);bR.get(e.to).push({type:e.type,dir:'child'})}
    if(e.to===bId&&e.from!==tId&&e.from!==bId){if(!bR.has(e.from))bR.set(e.from,[]);bR.get(e.from).push({type:e.type,dir:'parent'})}
    if(e.from===tId&&e.to!==bId&&e.to!==tId){if(!tR.has(e.to))tR.set(e.to,[]);tR.get(e.to).push({type:e.type,dir:'child'})}
    if(e.to===tId&&e.from!==bId&&e.from!==tId){if(!tR.has(e.from))tR.set(e.from,[]);tR.get(e.from).push({type:e.type,dir:'parent'})}});
  const all=new Set([...bR.keys(),...tR.keys()]);const items=[];
  all.forEach(nid=>{const nd=nodes.find(n=>n.id===nid);if(!nd)return;const inB=bR.has(nid),inT=tR.has(nid);const def=(inB&&inT)?'common':inB?'base':'target';const saved=edge.analogyPositions?.[nid];let position=def,isMoved=false;if(saved!=null&&typeof saved==='object'&&saved.defaultWhenSet!==undefined){if(saved.defaultWhenSet===def){position=saved.pos;isMoved=saved.pos!==def}}items.push({nodeId:nid,text:nd.text?.trim()||'unnamed',baseRels:bR.get(nid)||[],targetRels:tR.get(nid)||[],defaultPos:def,position,isMoved})});
  return items;
},[edges,nodes]);

const getNodeDims=useCallback(id=>{const el=nodeElsRef.current[id];if(el)return{w:el.offsetWidth,h:el.offsetHeight};return{w:160,h:60}},[]);
const rectIntersect=(cx,cy,w,h,tx,ty,gap)=>{const dx=tx-cx,dy=ty-cy;if(dx===0&&dy===0)return{x:cx,y:cy};const sx=(w/2+gap)/(Math.abs(dx)||1e-4),sy=(h/2+gap)/(Math.abs(dy)||1e-4);const s=Math.min(sx,sy);return{x:cx+dx*s,y:cy+dy*s}};
const epts=(fid,tid)=>{const fn=nodes.find(n=>n.id===fid),tn=nodes.find(n=>n.id===tid);if(!fn||!tn)return null;const fd=getNodeDims(fid),td=getNodeDims(tid);const fc={x:fn.x+fd.w/2,y:fn.y+fd.h/2},tc={x:tn.x+td.w/2,y:tn.y+td.h/2};const p1=rectIntersect(fc.x,fc.y,fd.w,fd.h,tc.x,tc.y,6);const p2=rectIntersect(tc.x,tc.y,td.w,td.h,fc.x,fc.y,6);return{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,mx:(fc.x+tc.x)/2,my:(fc.y+tc.y)/2}};
const perp=(x1,y1,x2,y2,o)=>{const dx=x2-x1,dy=y2-y1,l=Math.sqrt(dx*dx+dy*dy)||1;return{ox:(-dy/l)*o,oy:(dx/l)*o}};
const csz=useMemo(()=>{void dimTick;const vis=nodes.filter(n=>visibleNodeIds.has(n.id));if(!vis.length)return{w:800,h:500};let mx=800,my=500;for(const n of vis){const d=getNodeDims(n.id);mx=Math.max(mx,n.x+d.w+80);my=Math.max(my,n.y+d.h+80)}return{w:mx,h:my}},[nodes,dimTick,getNodeDims,visibleNodeIds]);
const zoomIn=()=>setZoom(z=>Math.min(3,+(z+0.15).toFixed(2)));
const zoomOut=()=>setZoom(z=>Math.max(0.25,+(z-0.15).toFixed(2)));
const zoomFit=()=>{const vis=nodes.filter(n=>visibleNodeIds.has(n.id));if(!vis.length||!cvRef.current)return;const cv=cvRef.current;const vw=cv.clientWidth-20,vh=cv.clientHeight-20;if(vw<=0||vh<=0)return;let mnX=Infinity,mnY=Infinity,mxX=0,mxY=0;for(const n of vis){const d=getNodeDims(n.id);mnX=Math.min(mnX,n.x);mnY=Math.min(mnY,n.y);mxX=Math.max(mxX,n.x+d.w);mxY=Math.max(mxY,n.y+d.h)}const cw=mxX-mnX+60,ch=mxY-mnY+60;const nz=+(Math.max(0.25,Math.min(2,Math.min(vw/cw,vh/ch))).toFixed(2));setZoom(nz);setTimeout(()=>{if(cvRef.current){cvRef.current.scrollLeft=Math.max(0,(mnX-30)*nz);cvRef.current.scrollTop=Math.max(0,(mnY-30)*nz)}},80)};

const reliabilityColor=v=>{if(v<=50){const t=v/50;return`rgb(${Math.round(220+(253-220)*t)},${Math.round(38+(224-38)*t)},${Math.round(38+(71-38)*t)})`}else{const t=(v-50)/50;return`rgb(${Math.round(253-(253-34)*t)},${Math.round(224-(224-197)*t)},${Math.round(71-(71-94)*t)})`}};
const reliabilityLabel=(v,tR,tA)=>{if(v<tR)return'Reject';if(v<tA)return'Neutral';return'Accept'};
const reliabilityEmoji=(v,tR,tA)=>{if(v<tR)return'❌';if(v<tA)return'⚖️';return'✅'};
const CQ_DEFS=[{key:'srcIdentifiability',label:'Identifiability',icon:'🔍',q:'Is the source identifiable?',color:'#4338ca'},{key:'srcAccuracy',label:'Accuracy',icon:'🎯',q:'Did the source actually assert the claim?',color:'#6366f1'},{key:'srcCredibility',label:'Credibility',icon:'🏛️',q:'Is the source in a position to know?',color:'#7c3aed'},{key:'srcTrustworthiness',label:'Trustworthiness',icon:'🤝',q:'Is the source reliable and honest?',color:'#9333ea'},{key:'srcConsistency',label:'Consistency',icon:'🔄',q:'Is it consistent with other sources?',color:'#a855f7'},{key:'srcEvidentiality',label:'Evidentiality',icon:'📋',q:'Is the assertion backed by evidence?',color:'#c084fc'}];
const getWeights=edge=>{const b=edge.srcWeights||[17,33,50,67,83];return[b[0],b[1]-b[0],b[2]-b[1],b[3]-b[2],b[4]-b[3],100-b[4]]};
const getSliders=edge=>{const w=getWeights(edge);return CQ_DEFS.map((d,i)=>({...d,val:edge[d.key]??50,weight:w[i]}))};
const getReliability=edge=>{const v=CQ_DEFS.map(d=>edge[d.key]??50);const w=getWeights(edge);const tw=w.reduce((a,b)=>a+b,0);return tw>0?Math.round(w.reduce((s,wi,i)=>s+wi*v[i],0)/tw):0};

const sw=pr=>pr===0?0:Math.max(0.8,(pr/100)*8);
const op=pr=>Math.max(0.12,pr/100);
const suffLabel=v=>v>=90?'✅ High':v>=60?'⚡ Mod':'❌ Low';

const NAV_GROUPS=[
  {key:'temporal',label:'Temporal',types:['sequence','cause','mean-goal']},
  {key:'description',label:'Description',types:['whole','attribute']},
  {key:'comparison',label:'Comparison',types:['comparison','analogy']},
  {key:'source',label:'Source & Other',types:['source','link']},
];

const renderNavDD=()=>{if(!showNav)return null;return(<div onMouseDown={e=>e.stopPropagation()} className="absolute top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 overflow-auto" style={{zIndex:50,width:320,maxHeight:400,...(navFlip?{left:0}:{right:0})}}>{NAV_GROUPS.map((grp,gi)=>{const items=navEdges.filter(e=>grp.types.includes(e.type));return(<div key={grp.key}><div className={'px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100 mb-1'+(gi>0?' mt-1 border-t':'')}>{grp.label} ({items.length})</div>{items.length===0?<div className="px-4 py-2 text-xs text-gray-400 text-center italic">No connections yet.</div>:items.map(ae=>{const m=TYPE_META[ae.type]||TYPE_META.link;const lbl=ae.type==='mean-goal'?'action-goal':ae.type;const isDesc=ae.type==='whole'||ae.type==='attribute';const dType=isDesc?'description':ae.type;const dispLabel=isDesc?(ae.type==='whole'?'whole-part':'obj-attr'):lbl;return(<button key={ae.id+'-'+ae.type} onClick={()=>{setDetailType(dType);setDetailId(ae.id);setShowNav(false)}} className={'w-full px-3 py-2 text-left hover:bg-indigo-50 flex items-center gap-2 text-xs transition-colors '+(detailId===ae.id&&detailType===dType?'bg-indigo-100 font-bold':'')}><span className="text-sm flex-shrink-0">{m.icon}</span><span className={'font-bold flex-shrink-0 uppercase '+m.cls} style={{minWidth:50}}>{dispLabel}</span><span className="text-gray-600 truncate">{ae.fromText}{m.sep}{ae.toText}</span></button>)})}</div>)})}</div>)};
const renderNavBtn=()=>{const ct=navEdges.length;return(<div className="relative" ref={navBtnRef} onMouseDown={e=>e.stopPropagation()}><button onClick={()=>setShowNav(v=>!v)} className={'p-1.5 bg-white border rounded-lg hover:bg-gray-50 relative transition-colors '+(showNav?'border-indigo-400 bg-indigo-50':'border-gray-300')} title="Analysis Navigation"><List size={14}/>{ct>0&&<span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center" style={{fontSize:9,fontWeight:700,padding:'0 3px'}}>{ct}</span>}</button>{renderNavDD()}</div>)};

const renderEdges=()=>edges.map(edge=>{if(!visibleNodeIds.has(edge.from)||!visibleNodeIds.has(edge.to))return null;if(!nodes.find(n=>n.id===edge.from)||!nodes.find(n=>n.id===edge.to))return null;const pts=epts(edge.from,edge.to);if(!pts)return null;const{x1,y1,x2,y2,mx,my}=pts,lp=perp(x1,y1,x2,y2,-16),lx=mx+lp.ox,ly=my+lp.oy;const hit=<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="20" style={{cursor:'pointer'}}/>;
  if(edge.type==='sequence')return(<g key={edge.id} onClick={e=>edgeClick(edge,e)}>{hit}<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0d9488" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#ah-seq)"/><rect x={lx-36} y={ly-9} width="72" height="17" rx="8" fill="white" fillOpacity=".95" stroke="#5eead4" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#0d9488" fontWeight="700">sequence →</text></g>);
  if(edge.type==='cause')return(<g key={edge.id} onClick={e=>edgeClick(edge,e)}>{hit}<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#ah)"/><rect x={lx-42} y={ly-9} width="84" height="17" rx="8" fill="white" fillOpacity=".95" stroke="#fca5a5" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#dc2626" fontWeight="700">cause → effect</text></g>);
  if(edge.type==='mean-goal')return(<g key={edge.id} onClick={e=>edgeClick(edge,e)}>{hit}<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b45309" strokeWidth="2.5" markerEnd="url(#ah-mg)"/><circle cx={x1} cy={y1} r="5" fill="#b45309" stroke="#78350f" strokeWidth="1.5"/><rect x={lx-42} y={ly-9} width="84" height="17" rx="8" fill="white" fillOpacity=".95" stroke="#fcd34d" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#b45309" fontWeight="700">action → goal</text></g>);
  if(edge.type==='whole')return(<g key={edge.id} onClick={e=>edgeClick(edge,e)}>{hit}<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2563eb" strokeWidth="2.5"/><circle cx={x1} cy={y1} r="7" fill="#3b82f6" stroke="#1e40af" strokeWidth="1.5"/><rect x={lx-38} y={ly-9} width="76" height="17" rx="8" fill="white" fillOpacity=".95" stroke="#93c5fd" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="700">whole ○─ part</text></g>);
  if(edge.type==='attribute')return(<g key={edge.id} onClick={e=>edgeClick(edge,e)}>{hit}<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0891b2" strokeWidth="2" strokeDasharray="4 2 1 2"/><polygon points={`${x1},${y1-6} ${x1+6},${y1} ${x1},${y1+6} ${x1-6},${y1}`} fill="#06b6d4" stroke="#0e7490" strokeWidth="1.5"/><rect x={lx-30} y={ly-9} width="60" height="17" rx="8" fill="white" fillOpacity=".95" stroke="#67e8f9" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#0891b2" fontWeight="700">obj ◆ attr</text></g>);
  if(edge.type==='comparison')return(<g key={edge.id} onClick={e=>edgeClick(edge,e)}>{hit}<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#be185d" strokeWidth="2.5" markerStart="url(#ah-cmp-s)" markerEnd="url(#ah-cmp-e)"/><rect x={lx-42} y={ly-9} width="84" height="17" rx="8" fill="white" fillOpacity=".95" stroke="#f9a8d4" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#be185d" fontWeight="700">⇌ comparison</text></g>);
  if(edge.type==='analogy'){const{ox,oy}=perp(x1,y1,x2,y2,3);return(<g key={edge.id} onClick={e=>edgeClick(edge,e)}>{hit}<line x1={x1+ox} y1={y1+oy} x2={x2+ox} y2={y2+oy} stroke="#059669" strokeWidth="2"/><line x1={x1-ox} y1={y1-oy} x2={x2-ox} y2={y2-oy} stroke="#059669" strokeWidth="2"/><circle cx={x1} cy={y1} r="6" fill="#059669" stroke="#047857" strokeWidth="1.5"/><rect x={lx-28} y={ly-9} width="56" height="17" rx="8" fill="white" fillOpacity=".95" stroke="#6ee7b7" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#059669" fontWeight="700">analogy</text></g>)}
  if(edge.type==='source')return(<g key={edge.id} onClick={e=>edgeClick(edge,e)}>{hit}<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6 4"/><circle cx={x1} cy={y1} r="5" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1.5"/><rect x={lx-25} y={ly-9} width="50" height="17" rx="8" fill="white" fillOpacity=".95" stroke="#c4b5fd" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#8b5cf6" fontWeight="700">source</text></g>);
  if(edge.type==='link'){const lb=edge.linkLabel||'';const lw=Math.max(lb.length*6+16,32);return(<g key={edge.id} onClick={e=>edgeClick(edge,e)}>{hit}<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6b7280" strokeWidth="1.5"/>{lb?<><rect x={lx-lw/2} y={ly-9} width={lw} height="17" rx="8" fill="white" fillOpacity=".95" stroke="#d1d5db" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="600">{lb}</text></>:<><rect x={lx-14} y={ly-9} width="28" height="17" rx="8" fill="white" fillOpacity=".95" stroke="#d1d5db" strokeWidth=".5"/><text x={lx} y={ly+4} textAnchor="middle" fontSize="10" fill="#9ca3af" fontWeight="600">link</text></>}</g>)}
  return null});

const dlCanvas=()=>{const vis=nodes.filter(n=>visibleNodeIds.has(n.id));if(!vis.length)return;function toXH(html){if(!html)return'';const d=document.createElement('div');d.innerHTML=html;const ser=new XMLSerializer();let r='';for(const c of d.childNodes)r+=ser.serializeToString(c);return r}let mnX=Infinity,mnY=Infinity,mxX=0,mxY=0;for(const n of vis){const d=getNodeDims(n.id);mnX=Math.min(mnX,n.x);mnY=Math.min(mnY,n.y);mxX=Math.max(mxX,n.x+d.w);mxY=Math.max(mxY,n.y+d.h)}const pd=50,W=mxX-mnX+pd*2,H=mxY-mnY+pd*2,ox=-mnX+pd,oy=-mnY+pd;const rcCSS='img{max-width:100%;height:auto;border-radius:4px;margin:2px 0;object-fit:contain}a{color:#3b82f6;text-decoration:underline}ul,ol{margin:2px 0;padding-left:18px;font-size:inherit}ul{list-style-type:disc}ol{list-style-type:decimal}li{margin:1px 0}p{margin:0}';let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="font-family:sans-serif"><rect width="${W}" height="${H}" fill="#fff"/>`;s+=`<defs><marker id="ah" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#dc2626"/></marker><marker id="ah-seq" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0d9488"/></marker><marker id="ah-mg" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#b45309"/></marker><marker id="ah-cmp-s" viewBox="0 0 10 7" refX="1" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="10 0,0 3.5,10 7" fill="#be185d"/></marker><marker id="ah-cmp-e" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#be185d"/></marker></defs>`;for(const edge of edges){if(!visibleNodeIds.has(edge.from)||!visibleNodeIds.has(edge.to))continue;const pts=epts(edge.from,edge.to);if(!pts)continue;const x1=pts.x1+ox,y1=pts.y1+oy,x2=pts.x2+ox,y2=pts.y2+oy,lp2=perp(pts.x1,pts.y1,pts.x2,pts.y2,-16),lx=pts.mx+ox+lp2.ox,ly=pts.my+oy+lp2.oy;const eR={sequence:()=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#0d9488" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ah-seq)"/><rect x="${lx-36}" y="${ly-9}" width="72" height="17" rx="8" fill="#fff" stroke="#5eead4" stroke-width=".5"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="10" fill="#0d9488" font-weight="700">sequence →</text>`,cause:()=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#dc2626" stroke-width="2.5" marker-end="url(#ah)"/><rect x="${lx-42}" y="${ly-9}" width="84" height="17" rx="8" fill="#fff" stroke="#fca5a5" stroke-width=".5"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="10" fill="#dc2626" font-weight="700">cause → effect</text>`,'mean-goal':()=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b45309" stroke-width="2.5" marker-end="url(#ah-mg)"/><circle cx="${x1}" cy="${y1}" r="5" fill="#b45309" stroke="#78350f" stroke-width="1.5"/><rect x="${lx-42}" y="${ly-9}" width="84" height="17" rx="8" fill="#fff" stroke="#fcd34d" stroke-width=".5"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="10" fill="#b45309" font-weight="700">action → goal</text>`,whole:()=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2563eb" stroke-width="2.5"/><circle cx="${x1}" cy="${y1}" r="7" fill="#3b82f6" stroke="#1e40af" stroke-width="1.5"/><rect x="${lx-38}" y="${ly-9}" width="76" height="17" rx="8" fill="#fff" stroke="#93c5fd" stroke-width=".5"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="10" fill="#2563eb" font-weight="700">whole ○─ part</text>`,attribute:()=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#0891b2" stroke-width="2" stroke-dasharray="4 2 1 2"/><polygon points="${x1},${y1-6} ${x1+6},${y1} ${x1},${y1+6} ${x1-6},${y1}" fill="#06b6d4" stroke="#0e7490" stroke-width="1.5"/><rect x="${lx-30}" y="${ly-9}" width="60" height="17" rx="8" fill="#fff" stroke="#67e8f9" stroke-width=".5"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="10" fill="#0891b2" font-weight="700">obj ◆ attr</text>`,comparison:()=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#be185d" stroke-width="2.5" marker-start="url(#ah-cmp-s)" marker-end="url(#ah-cmp-e)"/><rect x="${lx-42}" y="${ly-9}" width="84" height="17" rx="8" fill="#fff" stroke="#f9a8d4" stroke-width=".5"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="10" fill="#be185d" font-weight="700">⇌ comparison</text>`,analogy:()=>{const pp2=perp(pts.x1,pts.y1,pts.x2,pts.y2,3);return`<line x1="${x1+pp2.ox}" y1="${y1+pp2.oy}" x2="${x2+pp2.ox}" y2="${y2+pp2.oy}" stroke="#059669" stroke-width="2"/><line x1="${x1-pp2.ox}" y1="${y1-pp2.oy}" x2="${x2-pp2.ox}" y2="${y2-pp2.oy}" stroke="#059669" stroke-width="2"/><circle cx="${x1}" cy="${y1}" r="6" fill="#059669" stroke="#047857" stroke-width="1.5"/><rect x="${lx-28}" y="${ly-9}" width="56" height="17" rx="8" fill="#fff" stroke="#6ee7b7" stroke-width=".5"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="10" fill="#059669" font-weight="700">analogy</text>`},source:()=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6 4"/><circle cx="${x1}" cy="${y1}" r="5" fill="#8b5cf6" stroke="#6d28d9" stroke-width="1.5"/><rect x="${lx-25}" y="${ly-9}" width="50" height="17" rx="8" fill="#fff" stroke="#c4b5fd" stroke-width=".5"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="10" fill="#8b5cf6" font-weight="700">source</text>`,link:()=>{const lb2=esc(edge.linkLabel||'link');const lw2=Math.max(lb2.length*6+16,32);return`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b7280" stroke-width="1.5"/><rect x="${lx-lw2/2}" y="${ly-9}" width="${lw2}" height="17" rx="8" fill="#fff" stroke="#d1d5db" stroke-width=".5"/><text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="10" fill="#6b7280" font-weight="600">${lb2}</text>`}};const fn2=eR[edge.type];if(fn2)s+=fn2()}for(const n of vis){const d=getNodeDims(n.id),nx=n.x+ox,ny=n.y+oy,isE=n.type==='expressed',bg=isE?'#ecfdf5':'#fffbeb',bc=isE?'#34d399':'#fbbf24',hf=isE?'#10b981':'#f59e0b',ht=isE?'Expressed':'Unexpressed';const xh=toXH(n.html||'');s+=`<foreignObject x="${nx}" y="${ny}" width="${d.w}" height="${d.h}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${d.w}px;height:${d.h}px;border:2px solid ${bc};border-radius:8px;overflow:hidden;background:${bg};font-family:system-ui,-apple-system,sans-serif;box-sizing:border-box;"><style>${rcCSS}</style><div style="padding:2px 8px;background:${hf};color:white;font-size:10px;font-weight:700;text-align:center;line-height:20px;">${esc(ht)}</div><div style="padding:8px;font-size:13px;color:#1f2937;line-height:1.5;word-break:break-word;">${xh}</div></div></foreignObject>`}s+=`</svg>`;toImg(s,W,H,'warrantee-canvas.png')};

/* ── Description Detail (Redesigned) ── */
const renderDescriptionDetail=()=>{
  const edge=edges.find(e=>e.id===detailId);if(!edge)return null;
  const fromNode=nodes.find(n=>n.id===edge.from),toNode=nodes.find(n=>n.id===edge.to);
  if(!fromNode||!toNode)return null;
  const rootId=edge.from;const nodeSet=new Set([rootId]);const edgeList=[];const q2=[rootId];
  while(q2.length){const nid=q2.shift();for(const e of edges){if((e.type==='whole'||e.type==='attribute')&&e.from===nid&&!nodeSet.has(e.to)){nodeSet.add(e.to);edgeList.push(e);q2.push(e.to)}}}
  const exNodes=nodes.filter(n=>nodeSet.has(n.id));
  const wpCh={},atCh={},wpPar={},allCh={};
  for(const e of edgeList){if(e.type==='whole'){if(!wpCh[e.from])wpCh[e.from]=[];wpCh[e.from].push(e.to);wpPar[e.to]=e.from}else if(e.type==='attribute'){if(!atCh[e.from])atCh[e.from]=[];atCh[e.from].push(e.to)}if(!allCh[e.from])allCh[e.from]=[];allCh[e.from].push({id:e.to,type:e.type})}
  const compMap={};edges.forEach(e2=>{if(e2.type==='comparison'&&nodeSet.has(e2.from)&&nodeSet.has(e2.to)){if(!compMap[e2.from])compMap[e2.from]=[];if(!compMap[e2.from].includes(e2.to))compMap[e2.from].push(e2.to);if(!compMap[e2.to])compMap[e2.to]=[];if(!compMap[e2.to].includes(e2.from))compMap[e2.to].push(e2.from)}});
  const getCompSuffix=id=>{const cps=compMap[id]||[];if(!cps.length)return'';return' (↔ '+cps.map(cid=>{const cn=nodes.find(n=>n.id===cid);return'◆'+(cn?.text?.trim()||'?')}).join(', ')+')'};
  const getCompItems=id=>(compMap[id]||[]).map(cid=>{const cn=nodes.find(n=>n.id===cid);return cn?{id:cid,text:cn.text?.trim()||'?'}:null}).filter(Boolean);

  /* ── Unified State ── */
  const sk='desc_'+detailId;const stEntry=descState[sk]||{};
  const removed=stEntry.removed||{};const oldDotted=stEntry.dotted||{};
  const copied=stEntry.copied||{};const promoCopies=stEntry.promoCopies||{};
  const converted=stEntry.converted||stEntry.starred||{};

  const updateRemoved=fn=>setDescState(p=>{const prev=p[sk]||{};return{...p,[sk]:{...prev,removed:fn(prev.removed||{})}}});
  const updateCopied=fn=>setDescState(p=>{const prev=p[sk]||{};return{...p,[sk]:{...prev,copied:fn(prev.copied||{})}}});
  const updatePromoCopies=fn=>setDescState(p=>{const prev=p[sk]||{};return{...p,[sk]:{...prev,promoCopies:fn(prev.promoCopies||{})}}});
  const updateConverted=fn=>setDescState(p=>{const prev=p[sk]||{};return{...p,[sk]:{...prev,converted:fn(prev.converted||prev.starred||{})}}});
  const resetAllDesc=()=>setDescState(p=>{const next={...p};delete next[sk];return next});

  /* Toggle unified remove */
  const toggleRemove=nid=>{setDescState(p=>{const prev=p[sk]||{};const nRm={...(prev.removed||{})};const nDt={...(prev.dotted||{})};if(nRm[nid]||nDt[nid]){delete nRm[nid];delete nDt[nid]}else{nRm[nid]=true}return{...p,[sk]:{...prev,removed:nRm,dotted:nDt}}})};
  const toggleConvert=nid=>{updateConverted(prev=>{const next={...prev};if(next[nid])delete next[nid];else next[nid]=true;return next})};

  /* Copied/promo helpers */
  const addCopy=(targetNid,attrNid,attrText,sourceNid)=>updateCopied(prev=>{const next={...prev};const arr=next[targetNid]||[];if(arr.some(cc=>cc.an===attrNid))return prev;if((atCh[targetNid]||[]).includes(attrNid))return prev;if(targetNid===attrNid)return prev;next[targetNid]=[...arr,{an:attrNid,t:attrText,sn:sourceNid}];return next});
  const removeCp=(nid,an,sn)=>updateCopied(prev=>{const next={...prev};next[nid]=(next[nid]||[]).filter(cc=>!(cc.an===an&&cc.sn===sn));if(!next[nid].length)delete next[nid];return next});
  const removePromoCopy=(boxNid,aid,fromPid)=>updatePromoCopies(prev=>{const next={...prev};next[boxNid]=(next[boxNid]||[]).filter(x=>!(x.aid===aid&&x.fromPid===fromPid));if(!next[boxNid].length)delete next[boxNid];return next});
  const updateCopyText=(parentNid,an,sn,newText)=>{updateCopied(prev=>{const next={...prev};next[parentNid]=(next[parentNid]||[]).map(cc=>(cc.an===an&&cc.sn===sn)?{...cc,t:newText}:cc);return next});const cvKey='cp_'+parentNid+'_'+an;updateConverted(prev=>({...prev,[cvKey]:true}))};
  const updatePromoCopyText=(boxNid,aid,fromPid,newText)=>{updatePromoCopies(prev=>{const next={...prev};next[boxNid]=(next[boxNid]||[]).filter(x=>!(x.aid===aid&&x.fromPid===fromPid));if(!next[boxNid].length)delete next[boxNid];return next});updateCopied(prev=>{const next={...prev};const arr=next[boxNid]||[];next[boxNid]=[...arr,{an:aid,t:newText,sn:fromPid}];return next});const cvKey='cp_'+boxNid+'_'+aid;updateConverted(prev=>({...prev,[cvKey]:true}))};

  /* Computed removed set (includes children) */
  const _removedSet=new Set();const _directRemoved=new Set();
  const markRemoved=nid2=>{if(_removedSet.has(nid2))return;_removedSet.add(nid2);const eq=[nid2];while(eq.length){const cur=eq.shift();(allCh[cur]||[]).forEach(kid=>{if(!_removedSet.has(kid.id)){_removedSet.add(kid.id);eq.push(kid.id)}})}};
  Object.keys(removed).forEach(k=>{if(removed[k]){const n=+k;if(!isNaN(n))_directRemoved.add(n);markRemoved(+k)}});
  Object.keys(oldDotted).forEach(k=>{if(oldDotted[k]){const n=+k;if(!isNaN(n))_directRemoved.add(n);markRemoved(+k)}});
  /* backward compat: old removed keys like o_parentNid_attrNid */
  Object.keys(removed).forEach(k=>{if(!removed[k])return;if(k.startsWith('o_')){const parts=k.split('_');const aid=+parts[2];if(!isNaN(aid)){_directRemoved.add(aid);markRemoved(aid)}}});
  const isRemoved=nid=>_removedSet.has(nid);
  const isDirectRemoved=nid=>_directRemoved.has(nid);
  const isConverted=nid=>!!converted[nid];
  const isAttrNode=nid=>edgeList.some(e=>e.type==='attribute'&&e.to===nid);
  const hasWpKids=nid=>(wpCh[nid]||[]).length>0;

  /* ── Drag-to-copy ── */
  const onChipDragStart=(e,attrNid,text,sourceBoxNid)=>{descDragRef.current={attrNid,text,sourceBoxNid};e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/plain',text)};
  const onBoxDragOver=e=>{e.preventDefault();e.dataTransfer.dropEffect='copy'};
  const onBoxDrop=(e,targetNid)=>{e.preventDefault();const info=descDragRef.current;if(!info)return;if(targetNid===info.sourceBoxNid)return;addCopy(targetNid,info.attrNid,info.text,info.sourceBoxNid);descDragRef.current=null};

  /* ── Virtual nodes for copies ── */
  const virtualNodes={};const augCh={};for(const k in allCh)augCh[k]=[...allCh[k]];
  Object.keys(copied).forEach(nid2=>{if(!nodeSet.has(+nid2))return;(copied[nid2]||[]).forEach((cp,ci)=>{const vid='cp_'+nid2+'_'+cp.an+'_'+cp.sn+'_'+ci;virtualNodes[vid]={text:cp.t,type:'copied',parentNid:+nid2,cpAn:cp.an,cpSn:cp.sn,ctxKey:'cpk_'+nid2+'_'+cp.an};if(!augCh[nid2])augCh[nid2]=[];augCh[nid2].push({id:vid,type:'attribute'})})});
  /* Process nested copies stored under copy-context keys */
  const _pCtx=new Set();const _procCtx=(ctxKey,parentVid)=>{if(_pCtx.has(ctxKey))return;_pCtx.add(ctxKey);(copied[ctxKey]||[]).forEach((cp,ci)=>{const vid='cpn_'+ctxKey+'_'+cp.an+'_'+ci;const nCtx='cpk_'+ctxKey+'_'+cp.an;virtualNodes[vid]={text:cp.t,type:'copied',parentNid:0,cpAn:cp.an,cpSn:cp.sn,ctxKey:nCtx};if(!augCh[parentVid])augCh[parentVid]=[];augCh[parentVid].push({id:vid,type:'attribute'});_procCtx(nCtx,vid)})};
  Object.keys(virtualNodes).forEach(vid=>{const vn=virtualNodes[vid];if(vn.ctxKey)_procCtx(vn.ctxKey,vid)});
  Object.keys(promoCopies).forEach(nid2=>{if(!nodeSet.has(+nid2))return;(promoCopies[nid2]||[]).forEach((pc,pi)=>{const vid='pr_'+nid2+'_'+pc.aid+'_'+pc.fromPid+'_'+pi;const pn=nodes.find(n=>n.id===pc.aid);virtualNodes[vid]={text:(pn?.text?.trim()||'?'),type:'promo',parentNid:+nid2,prAid:pc.aid,prFromPid:pc.fromPid};if(!augCh[nid2])augCh[nid2]=[];augCh[nid2].push({id:vid,type:'attribute'})})});

  /* ── Tree Layout ── */
  const NW=154,WP_H=38,AT_H=28,GH=24,GV=32;
  const getNH=nid=>{if(typeof nid==='string')return AT_H;const ia=isAttrNode(nid);return ia?AT_H:WP_H};
  const stw=nid=>{const kids=augCh[nid]||[];if(!kids.length)return NW;return kids.reduce((s2,k)=>s2+stw(k.id),0)+(kids.length-1)*GH};
  const tPos={};const layT=(nid,x,y)=>{const h=getNH(nid),tw=stw(nid);tPos[nid]={x:x+tw/2-NW/2,y,w:NW,h};const kids=augCh[nid]||[];if(kids.length){let cx=x;for(const kid of kids){layT(kid.id,cx,y+h+GV);cx+=stw(kid.id)+GH}}};
  layT(rootId,20,20);let tW=0,tH=0;Object.values(tPos).forEach(p=>{tW=Math.max(tW,p.x+p.w);tH=Math.max(tH,p.y+p.h)});tW+=40;tH+=40;
  const treeConns=[];const nsArr=Array.from(nodeSet);
  for(const nid of nsArr){const kids=augCh[nid]||[];for(const kid of kids){const p1=tPos[nid],p2=tPos[kid.id];if(p1&&p2){const midY=p1.y+p1.h+(GV/2);treeConns.push({x1:p1.x+NW/2,y1:p1.y+p1.h,cx:p2.x+NW/2,cy:p2.y,midY,type:kid.type,fromNid:nid,toNid:kid.id})}}}
  Object.keys(virtualNodes).forEach(vid=>{const kids=augCh[vid]||[];for(const kid of kids){const p1=tPos[vid],p2=tPos[kid.id];if(p1&&p2){const midY=p1.y+p1.h+(GV/2);treeConns.push({x1:p1.x+NW/2,y1:p1.y+p1.h,cx:p2.x+NW/2,cy:p2.y,midY,type:kid.type,fromNid:vid,toNid:kid.id})}}});

  const ATTR_DASH='4 2 1 2';
  const BOX_COLORS=['#2563eb','#7c3aed','#059669','#b45309','#be185d','#0891b2'];
  const BOX_BGS=['#eff6ff','#f5f3ff','#ecfdf5','#fffbeb','#fdf2f8','#ecfeff'];

  /* ── Render Tree Node ── */
  const renderTreeNode=(nid)=>{const p=tPos[nid];if(!p)return null;
    const vn=virtualNodes[nid];
    if(vn){const rm=isRemoved(vn.parentNid);const lbl=(vn.text||'?');const dispLbl=lbl.length>15?lbl.slice(0,12)+'…':lbl;const isHov=descHoverId===nid;
      const vnCvKey=vn.type==='copied'?('cp_'+vn.parentNid+'_'+vn.cpAn):vn.type==='promo'?('cp_'+vn.parentNid+'_'+vn.prAid):null;
      const vnCv=vnCvKey?isConverted(vnCvKey):false;
      const vnFill=rm?'#f1f5f9':vnCv?(isHov?'#fef3c7':'#fffbeb'):(isHov?'#ede9fe':'#f5f3ff');
      const vnStroke=rm?'#94a3b8':vnCv?'#f59e0b':'#a78bfa';
      const vnTc=rm?'#94a3b8':vnCv?'#b45309':'#7c3aed';
      return(<g key={nid} opacity={rm?0.25:0.85} onMouseEnter={()=>setDescHoverId(nid)} onMouseLeave={()=>setDescHoverId(null)}>
        <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.h/2} fill={vnFill} stroke={vnStroke} strokeWidth={1.5} strokeDasharray="3 2"/>
        <text x={p.x+16} y={p.y+p.h/2+4} fontSize="10" fontWeight="600" fontStyle="italic" fill={vnTc} style={{pointerEvents:'none'}}>{'◆ '+dispLbl}</text>
        <rect x={p.x+p.w-22} y={p.y+2} width={20} height={p.h-4} rx="4" fill="transparent" style={{cursor:'pointer'}} onClick={()=>{if(vn.type==='copied')removeCp(vn.parentNid,vn.cpAn,vn.cpSn);else if(vn.type==='promo')removePromoCopy(vn.parentNid,vn.prAid,vn.prFromPid)}}/>
        <text x={p.x+p.w-10} y={p.y+p.h/2+3} textAnchor="middle" fontSize="9" fill={vnTc} opacity={0.5} style={{pointerEvents:'none'}}>✕</text>
        {isHov&&<title>{lbl}</title>}
      </g>)
    }
    const nd=nodes.find(n=>n.id===nid);if(!nd)return null;
    const ia=isAttrNode(nid);const rm=isRemoved(nid);const dr=isDirectRemoved(nid);
    const cv=isConverted(nid);const isHl=nid===edge.from||nid===edge.to;
    const isHov=descHoverId===nid;const ndLabel=(nd.text?.trim()||'')+getCompSuffix(nid);
    const compItems=getCompItems(nid);

    if(ia){
      /* ── Attribute Chip in Tree ── */
      const chipBg=rm?'#f1f5f9':cv?'#fffbeb':isHov?'#e0f2fe':'#ecfeff';
      const chipBd=rm?'#94a3b8':cv?'#f59e0b':isHl?'#4f46e5':'#06b6d4';
      const chipTc=rm?'#94a3b8':cv?'#b45309':'#0891b2';
      const truncLbl=ndLabel.length>16?ndLabel.slice(0,13)+'…':ndLabel;
      return(<g key={nid} opacity={rm&&!dr?0.35:1} onMouseEnter={()=>setDescHoverId(nid)} onMouseLeave={()=>setDescHoverId(null)}>
        {isHl&&<rect x={p.x-3} y={p.y-3} width={p.w+6} height={p.h+6} rx={p.h/2+3} fill="none" stroke="#818cf8" strokeWidth="2.5" opacity="0.6"/>}
        <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.h/2} fill={chipBg} stroke={chipBd} strokeWidth={isHl?3:2} style={{cursor:'pointer'}} onClick={()=>toggleRemove(nid)}/>
        <text x={p.x+12} y={p.y+p.h/2+4} fontSize="10" fontWeight="bold" fill={chipTc} style={{pointerEvents:'none'}}>{truncLbl}</text>
        {dr&&<text x={p.x+p.w-10} y={p.y+p.h/2+3} textAnchor="middle" fontSize="10" fill="#16a34a" style={{cursor:'pointer',pointerEvents:'auto'}} onClick={e=>{e.stopPropagation();toggleRemove(nid)}}>↻</text>}
        {compItems.length>0&&<text x={p.x+p.w/2} y={p.y+p.h+10} textAnchor="middle" fontSize="8" fill="#be185d" opacity={0.7} style={{pointerEvents:'none'}}>{'↔ '+compItems.map(c=>'◆'+c.text.slice(0,8)).join(', ')}</text>}
        {isHov&&<title>{ndLabel}</title>}
      </g>)
    }

    /* ── Whole/Part Node in Tree ── */
    const nodeBg=rm?'#f1f5f9':isHov?'#dbeafe':'#eff6ff';
    const nodeBd=rm?'#94a3b8':isHl?'#4f46e5':'#2563eb';
    const nodeTc=rm?'#94a3b8':'#1e40af';
    return(<g key={nid} opacity={rm&&!dr?0.35:1} onMouseEnter={()=>setDescHoverId(nid)} onMouseLeave={()=>setDescHoverId(null)}>
      {isHl&&<rect x={p.x-3} y={p.y-3} width={p.w+6} height={p.h+6} rx="11" fill="none" stroke="#818cf8" strokeWidth="2.5" opacity="0.7"/>}
      <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="8" fill={nodeBg} stroke={nodeBd} strokeWidth={isHl?3:2} style={{cursor:'pointer'}} onClick={()=>toggleRemove(nid)}/>
      <text x={p.x+p.w/2} y={p.y+p.h/2+5} textAnchor="middle" fontSize="11" fontWeight="bold" fill={nodeTc} style={{pointerEvents:'none'}}>{ndLabel.length>17?ndLabel.slice(0,14)+'…':ndLabel}</text>
      {dr&&<text x={p.x+p.w-10} y={p.y+14} textAnchor="middle" fontSize="11" fill="#16a34a" style={{cursor:'pointer',pointerEvents:'auto'}} onClick={e=>{e.stopPropagation();toggleRemove(nid)}}>↻</text>}
      {isHov&&<title>{ndLabel}</title>}
    </g>)
  };

  /* ── Attribute Chip Component (Box Model) ── */
  const AttrChip=({nid,text,isCopy,onRemove,parentNid,editKey,onEditText,dropTargetKey})=>{
    const rm=typeof nid==='number'?isRemoved(nid):false;
    const dr=typeof nid==='number'?isDirectRemoved(nid):false;
    const cvKey=isCopy?('cp_'+parentNid+'_'+nid):nid;
    const cv=isConverted(cvKey);
    const hovId=isCopy?('cp_'+parentNid+'_'+nid):nid;
    const isHov=descHoverId===hovId;
    const isEditing=isCopy&&editKey&&descEditId===editKey;
    const compItems=typeof nid==='number'&&!isCopy?getCompItems(nid):[];
    const fullText=typeof nid==='number'&&!isCopy?(text+getCompSuffix(nid)):text;
    const chipStyle={
      background:rm?'#f1f5f9':cv?'#fffbeb':isCopy?'#f5f3ff':'#ecfeff',
      borderColor:rm?'#cbd5e1':cv?'#f59e0b':isCopy?'#a78bfa':'#06b6d4',
      color:rm?'#94a3b8':cv?'#92400e':isCopy?'#6d28d9':'#0e7490',
      opacity:rm&&!dr?0.4:1,
      cursor:'pointer',
      transition:'all 0.15s'
    };
    const startEdit=()=>{if(!isCopy||rm||!editKey)return;descEditTextRef.current=text;setDescEditId(editKey)};
    const finishEdit=()=>{const val=descEditTextRef.current.trim();if(val&&val!==text){onEditText?.(val)}setDescEditId(null);descEditTextRef.current=''};
    return(<div className={'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border-2 select-none group '+(isHov?'shadow-md ring-2 ring-indigo-200':'')}
      style={chipStyle}
      draggable={!rm&&!isEditing}
      onDragStart={e=>{if(typeof nid==='number')onChipDragStart(e,nid,isCopy?text:fullText,dropTargetKey||parentNid)}}
      onDragOver={e=>{e.preventDefault();e.stopPropagation();e.dataTransfer.dropEffect='copy'}}
      onDrop={e=>{e.preventDefault();e.stopPropagation();const info=descDragRef.current;if(!info)return;const dtk=dropTargetKey||nid;if(typeof nid==='number'&&info.attrNid===nid)return;addCopy(dtk,info.attrNid,info.text,info.sourceBoxNid);descDragRef.current=null}}
      onMouseEnter={()=>setDescHoverId(hovId)}
      onMouseLeave={()=>setDescHoverId(null)}
      onClick={e=>{e.stopPropagation();if(!isCopy&&typeof nid==='number'){toggleRemove(nid)}}}
      onDoubleClick={e=>{e.stopPropagation();startEdit()}}
      title={isCopy?(text+' · Double-click to edit'):fullText}
    >
      {isEditing?(<input type="text" defaultValue={descEditTextRef.current} onChange={e=>{descEditTextRef.current=e.target.value}} onBlur={finishEdit} onKeyDown={e=>{if(e.key==='Enter'){e.target.blur()}if(e.key==='Escape'){setDescEditId(null);descEditTextRef.current=''}}} autoFocus className="bg-transparent outline-none border-none text-[11px] font-semibold" style={{color:'inherit',minWidth:40,maxWidth:140,width:Math.max(40,(text.length+2)*7)}} onClick={e=>e.stopPropagation()}/>):(<>
        <span className={'truncate '+(rm?'line-through':'')} style={{maxWidth:140}}>{text}</span>
        {compItems.length>0&&<span className="text-[9px] text-pink-500 font-normal flex-shrink-0 ml-0.5">{'↔'+compItems.map(c=>'◆'+c.text.slice(0,6)).join(',')}</span>}
        {dr&&!isCopy&&<span className="flex-shrink-0 ml-0.5 text-green-600 hover:text-green-800 cursor-pointer" onClick={e=>{e.stopPropagation();toggleRemove(nid)}} title="Restore">↻</span>}
        {isCopy&&<span className="flex-shrink-0 ml-0.5 text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer" onClick={e=>{e.stopPropagation();onRemove?.()}} title="Remove copy">✕</span>}
      </>)}
    </div>)
  };

  /* ── Recursive copy-with-nested renderer ── */
  const renderCpWithNested=(cp,parentNid,keyPrefix)=>{const ctxKey='cpk_'+parentNid+'_'+cp.an;const nestedCps=copied[ctxKey]||[];return(<div key={keyPrefix} className="flex flex-col gap-1"><AttrChip nid={cp.an} text={cp.t} isCopy={true} parentNid={parentNid} onRemove={()=>removeCp(parentNid,cp.an,cp.sn)} editKey={'ek_'+parentNid+'_'+cp.an+'_'+cp.sn} onEditText={nt=>updateCopyText(parentNid,cp.an,cp.sn,nt)} dropTargetKey={ctxKey}/>{nestedCps.length>0&&<div className="flex flex-col gap-1 pl-4">{nestedCps.map((nc,ni)=>renderCpWithNested(nc,ctxKey,keyPrefix+'_nc'+ni))}</div>}</div>)};

  /* ── Render Box Model ── */
  const renderBox=(nid,depth)=>{const nd=nodes.find(n=>n.id===nid);if(!nd)return null;
    const kids=wpCh[nid]||[];const origAttrs=(atCh[nid]||[]).map(aid=>{const n2=nodes.find(nn=>nn.id===aid);return n2?{id:aid,text:n2.text?.trim()||'?'}:null}).filter(Boolean);
    const cpAttrs=copied[nid]||[];const promos=promoCopies[nid]||[];
    const rm=isRemoved(nid);const dr=isDirectRemoved(nid);
    const isHl=nid===edge.from||nid===edge.to;const isHov=descHoverId===nid;
    const bc=BOX_COLORS[depth%BOX_COLORS.length],bg=BOX_BGS[depth%BOX_BGS.length];
    const effectiveBc=rm?'#94a3b8':isHl?'#4f46e5':bc;
    const effectiveBg=rm?'#f8fafc':bg;
    const ndText=(nd.text?.trim()||'unnamed')+getCompSuffix(nid);
    return(<div key={nid} className={'relative transition-all duration-150 '+(isHov&&!rm?'shadow-lg':'')}
      style={{border:(isHl?'3':'2.5')+'px solid '+effectiveBc,borderRadius:14,padding:'12px 14px',margin:depth>0?'8px 0':'0px',background:effectiveBg,minWidth:120,cursor:'default',opacity:rm&&!dr?0.35:1,boxShadow:isHl?'0 0 0 3px rgba(79,70,229,0.2)':'none'}}
      onMouseEnter={()=>setDescHoverId(nid)} onMouseLeave={()=>setDescHoverId(null)}
      onDragOver={onBoxDragOver} onDrop={e=>onBoxDrop(e,nid)}
      onClick={ev=>{ev.stopPropagation();const rect=ev.currentTarget.getBoundingClientRect();const xp=ev.clientX-rect.left,yp=ev.clientY-rect.top,wp=rect.width,hp=rect.height;if(xp<10||xp>wp-10||yp<10||yp>hp-10)toggleRemove(nid)}}
    >
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className={'font-bold text-sm '+(rm?'line-through':'')} style={{color:rm?'#94a3b8':bc}}>{ndText}</span>
        {rm&&dr&&<span className="text-green-600 hover:text-green-800 cursor-pointer text-sm" onClick={ev=>{ev.stopPropagation();toggleRemove(nid)}} title="Restore">↻</span>}
      </div>
      {/* Attribute chips — vertical layout */}
      {(origAttrs.length>0||cpAttrs.length>0||promos.length>0)&&(
        <div className="flex flex-col gap-1.5 mb-2">
          {origAttrs.map(attr=>{
            if(hasWpKids(attr.id)){return <div key={'wpa-'+attr.id} className="mt-1">{renderBox(attr.id,depth+1)}</div>}
            const subAttrs=(atCh[attr.id]||[]).map(aid=>{const n2=nodes.find(nn=>nn.id===aid);return n2?{id:aid,text:n2.text?.trim()||'?'}:null}).filter(Boolean);
            const attrCopies=copied[attr.id]||[];
            return(<div key={'attr-'+attr.id} className="flex flex-col gap-1">
              <AttrChip nid={attr.id} text={attr.text} isCopy={false} parentNid={nid}/>
              {(subAttrs.length>0||attrCopies.length>0)&&<div className="flex flex-col gap-1 pl-4">
                {subAttrs.map(sa=>{
                  const saCopies=copied[sa.id]||[];
                  return(<div key={'sa-'+sa.id} className="flex flex-col gap-1">
                    <AttrChip nid={sa.id} text={sa.text} isCopy={false} parentNid={attr.id}/>
                    {saCopies.length>0&&<div className="flex flex-col gap-1 pl-4">{saCopies.map((sc,si)=>renderCpWithNested(sc,sa.id,'sacp-'+si))}</div>}
                  </div>)
                })}
                {attrCopies.map((ac,ai)=>renderCpWithNested(ac,attr.id,'acp-'+ai))}
              </div>}
            </div>)
          })}
          {promos.map((pc,i)=>{const pn=nodes.find(n=>n.id===pc.aid);if(!pn)return null;
            return(<AttrChip key={'pr-'+i} nid={pc.aid} text={(pn.text?.trim()||'?')} isCopy={true} parentNid={nid} onRemove={()=>removePromoCopy(nid,pc.aid,pc.fromPid)} editKey={'ek_pr_'+nid+'_'+pc.aid+'_'+pc.fromPid} onEditText={nt=>updatePromoCopyText(nid,pc.aid,pc.fromPid,nt)}/>)
          })}
          {cpAttrs.map((c2,i)=>renderCpWithNested(c2,nid,'cp-'+i))}
        </div>
      )}
      {kids.length>0&&<div className="mt-2 space-y-1">{kids.map(kid=>renderBox(kid,depth+1))}</div>}
    </div>)
  };

  /* ── Download helpers ── */
  const ATTR_DASH_SVG='stroke-dasharray="4 2 1 2"';
  const dlTree=()=>{let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${tW}" height="${tH}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${tW}" height="${tH}" fill="#fff"/>`;
    for(const cn of treeConns){const col=cn.type==='whole'?'#2563eb':'#0891b2';const da=cn.type==='whole'?'':ATTR_DASH_SVG;s+=`<line x1="${cn.x1}" y1="${cn.y1}" x2="${cn.x1}" y2="${cn.midY}" stroke="${col}" stroke-width="2" ${da}/><line x1="${cn.x1}" y1="${cn.midY}" x2="${cn.cx}" y2="${cn.midY}" stroke="${col}" stroke-width="2" ${da}/><line x1="${cn.cx}" y1="${cn.midY}" x2="${cn.cx}" y2="${cn.cy}" stroke="${col}" stroke-width="2" ${da}/>`}
    for(const nid of nsArr){const p=tPos[nid];if(!p)continue;const nd=nodes.find(n=>n.id===nid);if(!nd)continue;const ia=isAttrNode(nid);const rm=isRemoved(nid);const cv=isConverted(nid);
      const bg2=rm?'#f1f5f9':cv?'#fffbeb':ia?'#ecfeff':'#eff6ff';const bd2=rm?'#94a3b8':cv?'#f59e0b':ia?'#06b6d4':'#2563eb';const tc=rm?'#94a3b8':cv?'#b45309':ia?'#0891b2':'#1e40af';const rx=ia?p.h/2:8;
      s+=`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${rx}" fill="${bg2}" stroke="${bd2}" stroke-width="2" ${rm?'opacity="0.4"':''}/>`;
      const ndDlLabel=((nd.text?.trim()||'')+getCompSuffix(nid)).slice(0,18);s+=`<text x="${p.x+p.w/2}" y="${p.y+p.h/2+4}" text-anchor="middle" font-size="${ia?10:11}" font-weight="bold" fill="${tc}">${esc(ndDlLabel)}</text>`}
    Object.keys(virtualNodes).forEach(vid=>{const p=tPos[vid];if(!p)return;const vn=virtualNodes[vid];const lbl=(vn.text||'?').slice(0,14);
      s+=`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${p.h/2}" fill="#f5f3ff" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.8"/>`;
      s+=`<text x="${p.x+p.w/2}" y="${p.y+p.h/2+4}" text-anchor="middle" font-size="10" font-weight="600" font-style="italic" fill="#7c3aed">◆ ${esc(lbl)}</text>`});
    s+=`</svg>`;toImg(s,tW,tH,'description-tree.png')};

  const dlBox=()=>{const PAD=16,GAP2=8,HDR=24,CHIP_H=20,CHIP_GAP=4;
    const bSize=(nid2)=>{const origA=(atCh[nid2]||[]).filter(aid=>!hasWpKids(aid));const cpA=copied[nid2]||[];const prA=promoCopies[nid2]||[];const nChips=origA.length+cpA.length+prA.length;const kids2=wpCh[nid2]||[];const wpAttrs2=(atCh[nid2]||[]).filter(aid=>hasWpKids(aid));
      let cH=HDR+(nChips>0?Math.ceil(nChips/3)*(CHIP_H+CHIP_GAP)+4:0),cW=240;
      wpAttrs2.forEach(waId=>{const waS=bSize(waId);cW=Math.max(cW,waS.w);cH+=waS.h+GAP2});
      if(kids2.length>0){let kW=0,mH=0;for(const k of kids2){const ks=bSize(k);kW+=ks.w+GAP2;mH=Math.max(mH,ks.h)}kW-=GAP2;cW=Math.max(cW,kW+PAD*2);cH+=mH+GAP2}return{w:cW+PAD*2,h:cH+PAD*2}};
    const bSvg=(nid2,x,y,d)=>{const kids2=wpCh[nid2]||[];const sz=bSize(nid2);const rm2=isRemoved(nid2);const bc2=BOX_COLORS[d%BOX_COLORS.length],bg2=rm2?'#f8fafc':BOX_BGS[d%BOX_BGS.length];const nd2=nodes.find(n=>n.id===nid2);const titleRaw=(nd2?.text?.trim()||'')+getCompSuffix(nid2);
      let s2=`<rect x="${x}" y="${y}" width="${sz.w}" height="${sz.h}" rx="12" fill="${bg2}" stroke="${rm2?'#94a3b8':bc2}" stroke-width="2.5" ${rm2?'opacity="0.4"':''}/>`;
      s2+=`<text x="${x+PAD}" y="${y+PAD+14}" font-size="11" font-weight="bold" fill="${rm2?'#94a3b8':bc2}">${esc(titleRaw.slice(0,24))}</text>`;
      let py2=y+PAD+HDR+4;
      const origA=(atCh[nid2]||[]).filter(aid=>!hasWpKids(aid));const cpA=copied[nid2]||[];const prA=promoCopies[nid2]||[];
      [...origA.map(aid=>({t:(nodes.find(n=>n.id===aid)?.text?.trim()||'?'),rm:isRemoved(aid),cv:isConverted(aid)})),...prA.map(pc=>({t:(nodes.find(n=>n.id===pc.aid)?.text?.trim()||'?')+'↻',rm:false,cv:false})),...cpA.map(cc=>({t:cc.t+'↻',rm:false,cv:false}))].forEach(chip=>{
        const tw=Math.min(chip.t.length*6+24,sz.w-PAD*2-4);s2+=`<rect x="${x+PAD+2}" y="${py2-2}" width="${tw}" height="18" rx="9" fill="${chip.rm?'#f1f5f9':chip.cv?'#fffbeb':'#ecfeff'}" stroke="${chip.rm?'#cbd5e1':chip.cv?'#f59e0b':'#06b6d4'}" stroke-width="1.5" ${chip.rm?'opacity="0.4"':''}/>`;
        s2+=`<text x="${x+PAD+14}" y="${py2+11}" font-size="9" font-weight="600" fill="${chip.rm?'#94a3b8':chip.cv?'#b45309':'#0891b2'}" ${chip.rm?'text-decoration="line-through"':''}>${esc(chip.t.slice(0,20))}</text>`;py2+=CHIP_H+CHIP_GAP});
      const wpAttrs3=(atCh[nid2]||[]).filter(aid=>hasWpKids(aid));
      wpAttrs3.forEach(waId=>{py2+=GAP2;s2+=bSvg(waId,x+PAD,py2,d+1);py2+=bSize(waId).h});
      if(kids2.length>0){let cx2=x+PAD;const cy2=py2+GAP2;for(const k of kids2){s2+=bSvg(k,cx2,cy2,d+1);cx2+=bSize(k).w+GAP2}}return s2};
    const ts=bSize(rootId);const W2=ts.w+40,H2=ts.h+40;let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${W2}" height="${H2}" fill="#fff"/>`;s+=bSvg(rootId,20,20,0);s+=`</svg>`;toImg(s,W2,H2,'description-box-model.png')};

  /* ── Main Render ── */
  const fromText=fromNode.text?.trim()||'?',toText=toNode.text?.trim()||'?';const isW=edge.type==='whole';const tc2=isW?'#2563eb':'#0891b2';const hasAnyState=Object.keys(stEntry).length>0;

  return(<div className="flex flex-col h-full bg-slate-50">
    {/* Header */}
    <div className="flex items-center gap-3 px-4 py-2 bg-white border-b shadow-sm flex-shrink-0">
      <button onClick={()=>{setDetailId(null);setShowNav(false);setDescHoverId(null)}} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"><ChevronLeft size={16}/> Back</button>
      <div className="text-sm font-bold text-gray-700 truncate flex-1">Description: <span style={{color:tc2}}>{fromText}</span>{isW?' ○─ ':' ◆ '}<span style={{color:tc2}}>{toText}</span></div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {hasAnyState&&<button onClick={resetAllDesc} className="flex items-center gap-1 px-2 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-700 rounded-lg text-xs font-semibold transition-colors" title="Reset all changes"><RotateCcw size={12}/> Reset All</button>}
        <button onClick={dlTree} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download tree"><Download size={14}/></button>
        <button onClick={dlBox} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download box model"><Download size={14}/></button>
        {renderNavBtn()}
      </div>
    </div>

    {/* Split View */}
    <div className="flex-1 overflow-hidden flex">
      {/* Tree Diagram */}
      <div className="flex-1 overflow-auto p-3 border-r border-gray-200" style={{minWidth:0}}>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">🌳 Tree Diagram <span className="text-[10px] font-normal text-gray-400 normal-case">· {exNodes.length} nodes · Click border to remove · Synced with box model</span></div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 overflow-auto" style={{minHeight:180}}>
          {exNodes.length<=1?<div className="text-gray-400 text-xs text-center py-6 italic">No children to display.</div>:
          <svg width={tW} height={tH} style={{fontFamily:'system-ui,sans-serif',display:'block'}}>
            {treeConns.map((cn,i)=>{const isEdgeHl=cn.fromNid===edge.from&&cn.toNid===edge.to;const col=isEdgeHl?'#4f46e5':cn.type==='whole'?'#2563eb':'#0891b2';const sw2=isEdgeHl?3.5:2;const da=cn.type==='whole'?undefined:ATTR_DASH;
              const isHovConn=descHoverId===cn.fromNid||descHoverId===cn.toNid;
              return(<g key={i} opacity={isHovConn?1:undefined}>
                {(isEdgeHl||isHovConn)&&<><line x1={cn.x1} y1={cn.y1} x2={cn.x1} y2={cn.midY} stroke={isEdgeHl?'#818cf8':'#93c5fd'} strokeWidth={sw2+4} opacity={0.2}/><line x1={cn.x1} y1={cn.midY} x2={cn.cx} y2={cn.midY} stroke={isEdgeHl?'#818cf8':'#93c5fd'} strokeWidth={sw2+4} opacity={0.2}/><line x1={cn.cx} y1={cn.midY} x2={cn.cx} y2={cn.cy} stroke={isEdgeHl?'#818cf8':'#93c5fd'} strokeWidth={sw2+4} opacity={0.2}/></>}
                <line x1={cn.x1} y1={cn.y1} x2={cn.x1} y2={cn.midY} stroke={col} strokeWidth={sw2} strokeDasharray={da}/>
                <line x1={cn.x1} y1={cn.midY} x2={cn.cx} y2={cn.midY} stroke={col} strokeWidth={sw2} strokeDasharray={da}/>
                <line x1={cn.cx} y1={cn.midY} x2={cn.cx} y2={cn.cy} stroke={col} strokeWidth={sw2} strokeDasharray={da}/>
                {cn.type==='whole'?<circle cx={cn.cx} cy={cn.cy-3} r="3" fill={col}/>:<polygon points={cn.cx+','+(cn.cy-7)+' '+(cn.cx+4)+','+(cn.cy-3)+' '+cn.cx+','+(cn.cy+1)+' '+(cn.cx-4)+','+(cn.cy-3)} fill={col}/>}
              </g>)})}
            {[...nsArr,...Object.keys(virtualNodes)].map(nid=>renderTreeNode(nid))}
          </svg>}
        </div>
        <div className="mt-2 flex gap-3 text-[10px] text-gray-400 flex-wrap">
          <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-blue-600 rounded" style={{height:2}}/><span>whole─part</span></div>
          <div className="flex items-center gap-1"><svg width="24" height="4" className="flex-shrink-0"><line x1="0" y1="2" x2="24" y2="2" stroke="#0891b2" strokeWidth="2" strokeDasharray="4 2 1 2"/></svg><span>obj◆attr</span></div>
          <div className="flex items-center gap-1"><div className="w-6 h-3 rounded-full border-2 border-cyan-500 bg-cyan-50" style={{width:20}}/><span>attr chip</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-gray-200 opacity-40"/><span>removed</span></div>
          <div className="flex items-center gap-1"><div className="w-5 h-3 rounded-full border-2 border-amber-400 bg-amber-50" style={{width:20}}/><span>edited (converted)</span></div>
        </div>
      </div>

      {/* Box Model */}
      <div className="flex-1 overflow-auto p-3" style={{minWidth:0}}>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">📦 Box Model <span className="text-[10px] font-normal text-gray-400 normal-case">· Click border to remove · Drag chips to copy · Double-click copy to edit</span></div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          {renderBox(rootId,0)}
        </div>
      </div>
    </div>

    {/* CQ Panel */}
    <div className="bg-white border-t border-gray-200 flex-shrink-0">
      <button onClick={()=>setSlidersOpen(v=>!v)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"><span>⚙️ Critical Questions</span>{slidersOpen?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>
      {slidersOpen&&<div className="px-4 pb-3 overflow-auto" style={{maxHeight:360}}>
        <div className="mb-3"><label className="block text-xs font-semibold text-indigo-700 mb-1">Subtype of Argument from Whole and Part</label><select value={edge.descArgType||''} onChange={e2=>{const val=e2.target.value;setEdges(es=>es.map(x=>x.id===edge.id?{...x,descArgType:val}:x))}} className="w-full rounded-lg px-2 py-1.5 text-sm border border-indigo-200 bg-indigo-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"><option value="">— Select subtype —</option><option value="whole-to-part">Argument from Whole to Part</option><option value="part-to-whole">Argument from Part to Whole (e.g., Argument from Example)</option></select></div>
        <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-3 text-xs text-indigo-800 leading-relaxed">
          <div className="font-bold mb-1.5">📦 Critical Questions for Argument from Whole and Part</div>
          <div className="space-y-1.5">
            <div className="font-bold text-indigo-700">I. Positive: Establish Generalisation</div>
            <div><strong>CQ1 Membership:</strong> Is the example truly a part of the whole? Click the border of any element to <em>remove</em> it (greyed out with all children).</div>
            <div><strong>CQ2 Truth of Attribution:</strong> Is the attribution actually true? Remove the attribution by clicking its border. Use ↻ to restore.</div>
            <div><strong>CQ3 Typicality &amp; Relevance:</strong> Drag attribute chips between boxes to test if properties transfer to other parts.</div>
            <div><strong>CQ4 Transitivity:</strong> Double-click a copied chip to edit its text. Edited copies automatically show <em>converted</em> (amber) styling, indicating the property has changed in some aspect.</div>
            <div className="font-bold text-pink-700 mt-2 pt-1.5 border-t border-indigo-200">II. Negative: Dissociation — Counter-Example</div>
            <div>Comparison (⇌) edges between attributes are shown as <strong>↔ ◆counter-attr</strong> in the chip. The same CQ1–CQ4 apply.</div>
            <div className="font-bold text-indigo-700 mt-2 pt-1.5 border-t border-indigo-200">Interactions</div>
            <div><strong>Remove:</strong> Click border of any node/chip → element + children turn grey. ↻ to restore.</div>
            <div><strong>Copy:</strong> Drag an attribute chip from one box and drop into another.</div>
            <div><strong>Edit &amp; Convert:</strong> Double-click a copied chip to edit its text → amber style indicates conversion.</div>
            <div><strong>Reset All:</strong> Restores the entire network to its original structure.</div>
          </div>
        </div>
      </div>}
    </div>
  </div>)
};

const getAnalogyChain=(edgeId)=>{const ce=edges.find(x=>x.id===edgeId);if(!ce||ce.type!=='analogy')return{chainNodes:[],chainPairs:[],cyclic:false};const aEs=edges.filter(x=>x.type==='analogy');const adj={};aEs.forEach(x=>{if(!adj[x.from])adj[x.from]=[];if(!adj[x.to])adj[x.to]=[];adj[x.from].push(x.to);adj[x.to].push(x.from)});const vis=new Set();const q=[ce.from];vis.add(ce.from);while(q.length){const c=q.shift();(adj[c]||[]).forEach(nb=>{if(!vis.has(nb)){vis.add(nb);q.push(nb)}})}const comp=[...vis];const deg={};comp.forEach(n=>{deg[n]=(adj[n]||[]).filter(nb=>vis.has(nb)).length});let start=comp.find(n=>deg[n]===1)||comp[0];const chain=[start];const cv=new Set([start]);let cur=start;while(true){const nx=(adj[cur]||[]).find(nb=>vis.has(nb)&&!cv.has(nb));if(!nx)break;chain.push(nx);cv.add(nx);cur=nx}const eMap={};aEs.forEach(x=>{const k=[x.from,x.to].sort().join('|');eMap[k]=x});const pairs=[];for(let i=0;i<chain.length-1;i++){const a=chain[i],b=chain[i+1];const k=[a,b].sort().join('|');const e2=eMap[k];if(e2)pairs.push({baseId:e2.from,targetId:e2.to,edge:e2})}let cyclic=false;if(chain.length>2){const ck=[chain[chain.length-1],chain[0]].sort().join('|');const ce2=eMap[ck];if(ce2){pairs.push({baseId:ce2.from,targetId:ce2.to,edge:ce2});cyclic=true}}return{chainNodes:chain,chainPairs:pairs,cyclic}};

/* ── Venn detail ── */
const renderVennDetail=(isCmp)=>{const edge=edges.find(e=>e.id===detailId);if(!edge)return null;let allPairs,chainTitle;if(!isCmp){const ch=getAnalogyChain(detailId);allPairs=ch.chainPairs.length>0?ch.chainPairs:[{baseId:edge.from,targetId:edge.to,edge:edge}];if(ch.chainNodes.length>1){const names=ch.chainNodes.map(nid=>nodes.find(n=>n.id===nid)?.text?.trim()||'?');chainTitle=names.join(' ═ ')+(ch.cyclic?' ═ '+names[0]:'')}else{chainTitle=(nodes.find(n=>n.id===edge.from)?.text?.trim()||'?')+' ═ '+(nodes.find(n=>n.id===edge.to)?.text?.trim()||'?')}}else{allPairs=[{baseId:edge.from,targetId:edge.to,edge:edge}];const b0=nodes.find(n=>n.id===edge.from),t0=nodes.find(n=>n.id===edge.to);chainTitle=(b0?.text?.trim()||'?')+' ⇌ '+(t0?.text?.trim()||'?')}const pageTl=isCmp?'Comparison':'Analogy';const pageTc=isCmp?'text-pink-700':'text-emerald-700';const isChain=allPairs.length>1;const firstDlRef={current:null};const renderPairCard=(pair,pi)=>{const pEdge=pair.edge;if(!pEdge)return null;const bN=nodes.find(n=>n.id===pair.baseId),tN=nodes.find(n=>n.id===pair.targetId);if(!bN||!tN)return null;const items=getVennItems(pEdge);const bI=items.filter(i=>i.position==='base'),cI=items.filter(i=>i.position==='common'),tI=items.filter(i=>i.position==='target'),xI=items.filter(i=>i.position==='irrelevant');const relC=bI.length+cI.length+tI.length;const sim=relC>0?Math.round(cI.length/relC*100):0;const metric=isCmp?100-sim:sim;const metricLabel=isCmp?'Difference':'Similarity';const metricCol=metric>=70?isCmp?'#be185d':'#16a34a':metric>=30?'#ca8a04':isCmp?'#16a34a':'#dc2626';const bTxt=bN.text?.trim()||'Base',tTxt=tN.text?.trim()||'Target';const anyMoved=items.some(it=>it.isMoved);let pairVennEl=null;const dlVenn=()=>{const W=640,H=460;let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${W}" height="${H}" fill="#fff"/>`;const ec1=isCmp?'#ec4899':'#3b82f6',ec2=isCmp?'#f472b6':'#22c55e',ef1=isCmp?'#fce7f3':'#dbeafe',ef2=isCmp?'#fdf2f8':'#dcfce7';s+=`<text x="${W/2}" y="22" text-anchor="middle" font-size="13" font-weight="bold" fill="${isCmp?'#be185d':'#059669'}">${isCmp?'Comparison':'Analogy'}: ${esc(bTxt)} ${isCmp?'⇌':'═'} ${esc(tTxt)}</text>`;s+=`<ellipse cx="215" cy="190" rx="185" ry="120" fill="${ef1}" fill-opacity="0.25" stroke="${ec1}" stroke-width="2"/>`;s+=`<ellipse cx="425" cy="190" rx="185" ry="120" fill="${ef2}" fill-opacity="0.25" stroke="${ec2}" stroke-width="2"/>`;s+=`<text x="105" y="75" text-anchor="middle" font-size="11" font-weight="bold" fill="${isCmp?'#be185d':'#1e40af'}">${isCmp?'A only':'Base only'}</text>`;s+=`<text x="320" y="75" text-anchor="middle" font-size="11" font-weight="bold" fill="#7c3aed">${isCmp?'A and B':'B and T'}</text>`;s+=`<text x="535" y="75" text-anchor="middle" font-size="11" font-weight="bold" fill="${isCmp?'#9f1239':'#15803d'}">${isCmp?'B only':'Target only'}</text>`;const plc=(arr,cx,sy,mw)=>{let y=sy;arr.forEach(it=>{const t=it.text.length>18?it.text.slice(0,15)+'...':it.text;const st=originSt(it);const tw=Math.min(t.length*6.5+16,mw);s+=`<rect x="${cx-tw/2}" y="${y-10}" width="${tw}" height="18" rx="9" fill="${st.bg}" stroke="${st.bd}" stroke-width="1"/>`;s+=`<text x="${cx}" y="${y+3}" text-anchor="middle" font-size="9" font-weight="600" fill="${st.c}">${esc(t)}</text>`;y+=22})};plc(bI,115,95,170);plc(cI,320,95,150);plc(tI,525,95,170);if(xI.length>0){s+=`<line x1="30" y1="330" x2="610" y2="330" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4 4"/>`;s+=`<text x="320" y="348" text-anchor="middle" font-size="10" font-weight="bold" fill="#9ca3af">Irrelevant</text>`;let xi=50,yi=368;xI.forEach(it=>{const t=it.text.length>14?it.text.slice(0,11)+'...':it.text;const tw2=t.length*6.5+16;if(xi+tw2>600){xi=50;yi+=22}const st=originSt(it);s+=`<rect x="${xi}" y="${yi-10}" width="${tw2}" height="18" rx="9" fill="${st.bg}" stroke="${st.bd}" stroke-width="1" opacity="0.55"/>`;s+=`<text x="${xi+tw2/2}" y="${yi+3}" text-anchor="middle" font-size="9" font-weight="600" fill="${st.c}" opacity="0.55">${esc(t)}</text>`;xi+=tw2+8})}s+=`<text x="20" y="${H-18}" font-size="10" fill="#6b7280">${isCmp?'A':'B'}: ${bI.length}  Common: ${cI.length}  ${isCmp?'B':'T'}: ${tI.length}${xI.length?' | Irrelevant: '+xI.length:''}</text>`;s+=`<text x="${W-20}" y="${H-18}" text-anchor="end" font-size="12" font-weight="bold" fill="${metricCol}">${metricLabel}: ${metric}%</text>`;s+=`</svg>`;toImg(s,W,H,(isCmp?'comparison':'analogy')+'-venn-'+(pi+1)+'.png')};if(pi===0)firstDlRef.current=dlVenn;const startDrag=(item,e)=>{e.preventDefault();e.stopPropagation();const pt=e.touches?.[0]||e;const st=originSt(item);adRef.current={nodeId:item.nodeId,edgeId:pEdge.id,defaultPos:item.defaultPos,text:item.text,icons:getRelIcons(item),bg:st.bg,bd:st.bd,c:st.c,vennEl:pairVennEl};setAdXY({x:pt.clientX,y:pt.clientY})};const draggingId=adXY?adRef.current?.nodeId:null;const pill=(item,dimmed)=>{const st=originSt(item);const ic=getRelIcons(item);const isD=draggingId===item.nodeId;return(<div key={item.nodeId} className={'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold select-none whitespace-nowrap '+(isD?'opacity-20':'cursor-grab hover:shadow-md active:shadow-lg')} style={{background:st.bg,border:'1.5px solid '+st.bd,color:st.c,opacity:isD?0.2:dimmed?0.55:1,transition:'opacity 0.15s',touchAction:'none'}} onMouseDown={e=>startDrag(item,e)} onTouchStart={e=>startDrag(item,e)} title={item.text}>{ic&&<span className="flex-shrink-0">{ic}</span>}<span className="truncate" style={{maxWidth:105}}>{item.text}</span>{item.isMoved&&<button className="flex-shrink-0 ml-0.5 hover:opacity-70" style={{color:'#d97706'}} onMouseDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setAnalogyPos(pEdge.id,item.nodeId,item.defaultPos,item.defaultPos)}} title="Reset">↻</button>}</div>)};const zH=z=>adXY&&adHover===z;return(<div key={pi} className="mb-5">{isChain&&(<div className="flex items-center gap-2 mb-2"><span className="text-sm font-bold text-indigo-600">Pair {pi+1}: {bTxt}{isCmp?' ⇌ ':' ═ '}{tTxt}</span><button onClick={dlVenn} className="ml-auto p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download Venn diagram"><Download size={14}/></button></div>)}<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4" style={{maxWidth:680}}><div className="mb-3 space-y-1"><div className="flex items-center gap-2"><span className={'w-3 h-3 rounded-full flex-shrink-0 '+(isCmp?'bg-pink-500':'bg-blue-500')}/><span className="text-xs font-bold" style={{color:isCmp?'#be185d':'#1e40af'}}>{isCmp?'Node A':'Base (B)'}:</span><span className="text-xs break-words" style={{color:isCmp?'#9f1239':'#2563eb'}}>{bTxt}</span></div><div className="flex items-center gap-2"><span className={'w-3 h-3 rounded-full flex-shrink-0 '+(isCmp?'bg-rose-400':'bg-green-500')}/><span className="text-xs font-bold" style={{color:isCmp?'#be185d':'#15803d'}}>{isCmp?'Node B':'Target (T)'}:</span><span className="text-xs break-words" style={{color:isCmp?'#9f1239':'#16a34a'}}>{tTxt}</span></div></div><div ref={el=>{pairVennEl=el;if(!isChain)vennRef.current=el}} className="relative select-none" style={{width:640,height:450,minWidth:640}}><svg className="absolute inset-0 pointer-events-none" width="640" height="450"><ellipse cx="215" cy="170" rx="185" ry="120" fill={zH('base')?isCmp?'#fce7f3':'#bfdbfe':isCmp?'#fce7f3':'#dbeafe'} fillOpacity={zH('base')?0.45:0.2} stroke={isCmp?'#ec4899':'#3b82f6'} strokeWidth="2"/><ellipse cx="425" cy="170" rx="185" ry="120" fill={zH('target')?isCmp?'#fdf2f8':'#bbf7d0':isCmp?'#fdf2f8':'#dcfce7'} fillOpacity={zH('target')?0.45:0.2} stroke={isCmp?'#f472b6':'#22c55e'} strokeWidth="2"/>{zH('common')&&<><ellipse cx="215" cy="170" rx="185" ry="120" fill="#ddd6fe" fillOpacity="0.35"/><ellipse cx="425" cy="170" rx="185" ry="120" fill="#ddd6fe" fillOpacity="0.35"/></>}<text x="105" y="58" textAnchor="middle" fontSize="11" fontWeight="bold" fill={isCmp?'#be185d':'#1e40af'}>{isCmp?'A only':'Base only'}</text><text x="320" y="58" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c3aed">{isCmp?'A and B':'B and T'}</text><text x="535" y="58" textAnchor="middle" fontSize="11" fontWeight="bold" fill={isCmp?'#9f1239':'#15803d'}>{isCmp?'B only':'Target only'}</text><line x1="30" y1="320" x2="610" y2="320" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4"/><text x="320" y="340" textAnchor="middle" fontSize="11" fontWeight="bold" fill={zH('irrelevant')?'#6b7280':'#9ca3af'}>✕ Irrelevant</text>{zH('irrelevant')&&<rect x="15" y="326" width="610" height="118" rx="10" fill="rgba(156,163,175,0.08)" stroke="rgba(156,163,175,0.3)" strokeWidth="2" strokeDasharray="4 4"/>}</svg><div className="absolute flex flex-col items-center gap-1.5 overflow-auto p-1" style={{left:15,top:70,width:200,height:188,borderRadius:12,...(zH('base')?{background:isCmp?'rgba(236,72,153,0.06)':'rgba(59,130,246,0.06)',border:'2px dashed '+(isCmp?'rgba(236,72,153,0.25)':'rgba(59,130,246,0.25)')}:{})}}>{bI.map(it=>pill(it,false))}{!bI.length&&items.length>0&&<span className="text-[10px] text-gray-300 italic" style={{marginTop:72}}>empty</span>}</div><div className="absolute flex flex-col items-center gap-1.5 overflow-auto p-1" style={{left:238,top:70,width:164,height:188,borderRadius:12,...(zH('common')?{background:'rgba(139,92,246,0.06)',border:'2px dashed rgba(139,92,246,0.25)'}:{})}}>{cI.map(it=>pill(it,false))}{!cI.length&&items.length>0&&<span className="text-[10px] text-gray-300 italic" style={{marginTop:72}}>empty</span>}</div><div className="absolute flex flex-col items-center gap-1.5 overflow-auto p-1" style={{left:425,top:70,width:200,height:188,borderRadius:12,...(zH('target')?{background:isCmp?'rgba(244,114,182,0.06)':'rgba(34,197,94,0.06)',border:'2px dashed '+(isCmp?'rgba(244,114,182,0.25)':'rgba(34,197,94,0.25)')}:{})}}>{tI.map(it=>pill(it,false))}{!tI.length&&items.length>0&&<span className="text-[10px] text-gray-300 italic" style={{marginTop:72}}>empty</span>}</div><div className="absolute flex flex-wrap gap-1.5 justify-center overflow-auto p-1.5 content-start" style={{left:20,top:350,width:600,height:92}}>{xI.map(it=>pill(it,true))}</div></div>{items.length===0&&<div className="text-center text-gray-400 text-sm py-2 -mt-2">No whole-part or object-attribute relations found.</div>}{items.length>0&&(<div className="mt-3 pt-3 border-t border-gray-200"><div className="flex items-center gap-3 text-xs mb-2 flex-wrap"><span className="flex items-center gap-1"><span className={'w-2.5 h-2.5 rounded-full '+(isCmp?'bg-pink-400':'bg-blue-400')}/>{isCmp?'A':'B'}: <strong>{bI.length}</strong></span><span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-400"/>Common: <strong>{cI.length}</strong></span><span className="flex items-center gap-1"><span className={'w-2.5 h-2.5 rounded-full '+(isCmp?'bg-rose-400':'bg-green-400')}/>{isCmp?'B':'T'}: <strong>{tI.length}</strong></span>{xI.length>0&&<span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-300"/>✕: <strong>{xI.length}</strong></span>}{anyMoved&&<button onClick={()=>resetAnalogyPositions(pEdge.id)} className="ml-auto text-[10px] text-amber-500 hover:text-amber-700 flex items-center gap-0.5 font-semibold" title="Reset all"><RefreshCw size={9}/> Reset all</button>}</div><div className="flex items-center gap-2"><div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden flex">{relC>0&&bI.length>0&&<div className={'h-full transition-all '+(isCmp?'bg-pink-400':'bg-blue-400')} style={{width:(bI.length/relC*100)+'%'}}/>}{relC>0&&cI.length>0&&<div className="h-full bg-purple-400 transition-all" style={{width:(cI.length/relC*100)+'%'}}/>}{relC>0&&tI.length>0&&<div className={'h-full transition-all '+(isCmp?'bg-rose-400':'bg-green-400')} style={{width:(tI.length/relC*100)+'%'}}/>}</div><span className="text-sm font-bold" style={{color:metricCol}}>{metric}%</span></div><div className="text-[10px] text-gray-400 mt-1">{metric>=70?(isCmp?'🔴 Strong differences':'✅ Strong similarity'):metric>=30?'⚖️ Moderate':(isCmp?'🟢 Few differences':'❌ Weak similarity')}</div></div>)}</div></div>)};return(<div className="flex flex-col h-full bg-slate-50"><div className="flex items-center gap-3 px-4 py-2 bg-white border-b shadow-sm flex-shrink-0"><button onClick={()=>{setDetailId(null);setShowNav(false)}} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"><ChevronLeft size={16}/> Back</button><div className="text-sm font-bold text-gray-700 truncate flex-1">{pageTl}: <span className={pageTc}>{chainTitle}</span></div><div className="flex items-center gap-1.5 flex-shrink-0">{!isChain&&<button onClick={()=>firstDlRef.current?.()} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download Venn diagram"><Download size={14}/></button>}{renderNavBtn()}</div></div><div className="flex-1 overflow-auto p-4">{allPairs.map((p,pi)=>renderPairCard(p,pi))}</div><div className="bg-white border-t border-gray-200 flex-shrink-0"><button onClick={()=>setSlidersOpen(v=>!v)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"><span>⚙️ Critical Questions</span>{slidersOpen?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>{slidersOpen&&<div className="px-4 pb-3 overflow-auto" style={{maxHeight:360}}>{isCmp?<div className="bg-pink-50 rounded-lg border border-pink-200 p-3 text-xs text-pink-800 leading-relaxed"><div className="font-bold mb-1.5">⇌ Comparison / Dissociation — Critical Questions</div><div className="space-y-1.5"><div><strong>CQ1 — Relevant Differences:</strong> Are there respects in which A and B are <em>different</em> that would tend to support the force of the dissociation cited? Are A and B truly mutually exclusive? <span className="text-pink-500">(Attributes in "A and B" zone challenge the dissociation.)</span></div><div><strong>CQ2 — Right Conclusion:</strong> Is the conclusion / property the right one to be drawn in the target case? <span className="text-pink-500">(Attributes in "Irrelevant" zone weaken the comparison.)</span></div><div className="border-t border-pink-200 pt-1.5 mt-1.5"><strong>Venn Diagram:</strong> Drag attribute chips between zones (A only / Common / B only / Irrelevant) to test the strength of the comparison. The difference bar shows 1 − Jaccard ratio.</div></div></div>:<div className="bg-indigo-50 rounded-lg border border-indigo-200 p-3 text-xs text-indigo-800 leading-relaxed"><div className="font-bold mb-1.5">🔗 Analogy — Critical Questions (Walton)</div><div className="space-y-1.5"><div><strong>CQ1 — Relevant Differences:</strong> Are there respects in which Base and Target are <em>different</em> that would tend to undermine the force of the similarity cited? <span className="text-indigo-500">(Attributes in "Base only" or "Target only" zones challenge the analogy.)</span></div><div><strong>CQ2 — Right Conclusion:</strong> Is the conclusion / property the right one to be drawn in the target case?<span className="text-indigo-500">(Attributes in "Irrelevant" zone weaken the analogy.)</span></div><div><strong>CQ3 — Counter-Analogy:</strong> Is there some other case that is also similar to the base, but in which a <em>different</em> conclusion should be drawn?{isChain&&<span className="text-indigo-500"> When multiple analogies form a chain, each pair may reinforce or challenge the analogy depending on whether its shared properties support or contradict the conclusion.</span>}</div><div className="border-t border-indigo-200 pt-1.5 mt-1.5"><strong>Venn Diagram:</strong> Drag attribute chips between zones (Base only / Common / Target only / Irrelevant) to test the strength of the analogy. The similarity bar shows the Jaccard ratio: common ÷ (base + common + target).</div></div></div>}</div>}</div></div>)};

/* ── Source detail ── */
const renderSourceDetail=()=>{const edge=edges.find(e=>e.id===detailId);if(!edge)return null;const srcNode=nodes.find(n=>n.id===edge.from),assertNode=nodes.find(n=>n.id===edge.to);if(!srcNode||!assertNode)return null;const srcLabel=getNodeWithChildrenLabel(edge.from),assertLabel=getNodeWithChildrenLabel(edge.to);const sliders=getSliders(edge),reliability=getReliability(edge),tR2=edge.thresholdReject??35,tA=edge.thresholdAccept??65;const relColor=reliabilityColor(reliability),relLabel2=reliabilityLabel(reliability,tR2,tA),relEmoji=reliabilityEmoji(reliability,tR2,tA);const sliderH=280,fillPct=reliability,acceptMid=(tA+100)/200*100,neutralMid=(tR2+tA)/200*100,rejectMid=tR2/200*100;
  const dlSourceCard=()=>{const W=380,barH=45,H=68+sliders.length*barH+40;let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${W}" height="${H}" fill="#fff" rx="12" stroke="#e9d5ff" stroke-width="1"/>`;s+=`<rect x="0" y="0" width="${W}" height="50" fill="#7c3aed" rx="12"/><rect x="0" y="38" width="${W}" height="12" fill="#7c3aed"/>`;s+=`<text x="16" y="20" font-size="9" fill="rgba(255,255,255,0.7)" font-weight="600">SOURCE</text>`;const sl2=srcLabel.length>42?srcLabel.slice(0,39)+'...':srcLabel;s+=`<text x="16" y="38" font-size="12" fill="#fff" font-weight="bold">${esc(sl2)}</text>`;let cy=68;sliders.forEach(sl=>{s+=`<text x="16" y="${cy}" font-size="10" font-weight="bold" fill="#374151">${sl.icon} ${esc(sl.label)}</text>`;s+=`<text x="${W-16}" y="${cy}" text-anchor="end" font-size="10" font-weight="bold" fill="${sl.color}">${sl.val}%</text>`;s+=`<rect x="16" y="${cy+4}" width="${W-32}" height="7" rx="3.5" fill="#e5e7eb"/>`;s+=`<rect x="16" y="${cy+4}" width="${Math.max(1,(W-32)*sl.val/100)}" height="7" rx="3.5" fill="${sl.color}"/>`;s+=`<text x="16" y="${cy+22}" font-size="8" fill="#9ca3af" font-style="italic">${esc(sl.q)}</text>`;cy+=barH});cy+=8;s+=`<line x1="16" y1="${cy}" x2="${W-16}" y2="${cy}" stroke="#e5e7eb" stroke-width="1"/>`;cy+=16;s+=`<text x="16" y="${cy}" font-size="11" font-weight="bold" fill="#374151">Reliability:</text>`;s+=`<text x="${W-16}" y="${cy}" text-anchor="end" font-size="13" font-weight="bold" fill="${relColor}">${reliability}% ${relLabel2}</text>`;s+=`</svg>`;toImg(s,W,cy+16,'source-card.png')};
  const dlAssertCard=()=>{const W=300,thermH2=220,thermY2=75,H=thermY2+thermH2+80;let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${W}" height="${H}" fill="#fff" rx="12" stroke="#c7d2fe" stroke-width="1"/>`;s+=`<rect x="0" y="0" width="${W}" height="50" fill="#4f46e5" rx="12"/><rect x="0" y="38" width="${W}" height="12" fill="#4f46e5"/>`;s+=`<text x="16" y="20" font-size="9" fill="rgba(255,255,255,0.7)" font-weight="600">ASSERTION</text>`;const al2=assertLabel.length>35?assertLabel.slice(0,32)+'...':assertLabel;s+=`<text x="16" y="38" font-size="12" fill="#fff" font-weight="bold">${esc(al2)}</text>`;const tx=W/2-25,tw=50,fH2=thermH2*reliability/100;s+=`<rect x="${tx}" y="${thermY2}" width="${tw}" height="${thermH2}" fill="#e5e7eb" rx="10"/>`;if(fH2>0)s+=`<rect x="${tx}" y="${thermY2+thermH2-fH2}" width="${tw}" height="${Math.max(fH2,1)}" fill="${relColor}" rx="${fH2>=thermH2?10:0}"/>`;const trY=thermY2+thermH2-thermH2*tR2/100,taY=thermY2+thermH2-thermH2*tA/100;s+=`<line x1="${tx}" y1="${trY}" x2="${tx+tw}" y2="${trY}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/>`;s+=`<line x1="${tx}" y1="${taY}" x2="${tx+tw}" y2="${taY}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/>`;s+=`<text x="${tx+tw+8}" y="${(thermY2+taY)/2+4}" font-size="9" fill="#16a34a" font-weight="600">${tA}%-100% Accept</text>`;s+=`<text x="${tx+tw+8}" y="${(taY+trY)/2+4}" font-size="9" fill="#ca8a04" font-weight="600">${tR2}%-${tA-1}% Neutral</text>`;s+=`<text x="${tx+tw+8}" y="${(trY+thermY2+thermH2)/2+4}" font-size="9" fill="#dc2626" font-weight="600">0%-${tR2-1}% Reject</text>`;const vY2=thermY2+thermH2-thermH2*reliability/100;s+=`<text x="${tx-8}" y="${vY2+5}" text-anchor="end" font-size="16" font-weight="bold" fill="${relColor}">${reliability}%</text>`;const bY=thermY2+thermH2+30;s+=`<text x="${W/2}" y="${bY+5}" text-anchor="middle" font-size="14" font-weight="bold" fill="${relColor}">${relLabel2}</text>`;s+=`</svg>`;toImg(s,W,H,'assertion-card.png')};
  return(<div className="flex flex-col h-full bg-slate-50"><div className="flex items-center gap-3 px-4 py-2 bg-white border-b shadow-sm flex-shrink-0"><button onClick={()=>{setDetailId(null);setShowNav(false)}} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"><ChevronLeft size={16}/> Back</button><div className="text-sm font-bold text-gray-700 truncate flex-1">Source: <span className="text-purple-600">{srcNode.text?.trim()}</span> → <span className="text-indigo-600">{assertNode.text?.trim()}</span></div><div className="flex items-center gap-1.5 flex-shrink-0"><button onClick={dlSourceCard} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download source card"><Download size={14}/></button><button onClick={dlAssertCard} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download assertion card"><Download size={14}/></button>{renderNavBtn()}</div></div><div className="flex-1 overflow-auto p-4"><div className="flex flex-wrap gap-5 items-stretch"><div className="flex-1 min-w-[320px]"><div className="bg-white rounded-2xl border border-purple-200 shadow-sm overflow-hidden h-full flex flex-col"><div className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-3"><div className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Source</div><div className="text-white font-bold text-sm leading-snug break-words">{srcLabel}</div></div><div className="p-4 space-y-3 flex-1"><div className="mb-3"><label className="block text-xs font-semibold text-purple-700 mb-1">Subtype of Argument from Source</label><select value={edge.sourceArgType||''} onChange={e=>{const val=e.target.value;setEdges(es=>es.map(x=>x.id===edge.id?{...x,sourceArgType:val}:x))}} className="w-full rounded-lg px-2 py-1.5 text-sm border border-purple-200 bg-purple-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"><option value="">— Select subtype —</option><option value="genealogy">Argument from genealogy — Orthodoxy (e.g. Tradition, Religious)</option><option value="authority">Argument from authority — Power (e.g. Government)</option><option value="expert">Argument from expert opinion — Knowledge (e.g. Scientist, Doctor, Teacher)</option><option value="popularity">Argument from popularity — Experience (e.g. Consensus, Common sense, User comment, Eyewitness)</option></select></div><div className="text-xs text-gray-500 font-medium mb-1">Critical Questions (Walton)</div>{sliders.map(sl=>(<div key={sl.key}><div className="flex items-start gap-2 mb-1.5"><span className="text-base flex-shrink-0">{sl.icon}</span><div className="flex-1"><div className="flex items-center gap-2"><span className="text-sm font-bold text-gray-700">{sl.label}</span><span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{background:sl.color+'15',color:sl.color,border:'1px solid '+sl.color+'30'}}>w:{Math.round(sl.weight)}%</span><span className="text-sm font-bold" style={{color:sl.color}}>{sl.val}%</span></div><div className="text-xs text-gray-400 mt-0.5 italic">{sl.q}</div></div></div><input type="range" min="0" max="100" value={sl.val} onChange={e=>setProb(edge.id,sl.key,+e.target.value)} className="w-full h-2 rounded-lg appearance-none cursor-pointer" style={{background:'linear-gradient(to right, '+sl.color+' '+sl.val+'%, #e5e7eb '+sl.val+'%)',accentColor:sl.color}}/></div>))}<div className="mt-3 pt-3 border-t border-gray-100"><div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-gray-500">⚖️ CQ Weighting</span><button onClick={()=>setEdges(p=>p.map(x=>x.id===edge.id?{...x,srcWeights:[17,33,50,67,83]}:x))} className="text-[10px] text-amber-500 hover:text-amber-700 font-semibold flex items-center gap-0.5"><RefreshCw size={9}/> Equal</button></div><WeightSlider boundaries={edge.srcWeights||[17,33,50,67,83]} onChange={nb=>setEdges(p=>p.map(x=>x.id===edge.id?{...x,srcWeights:nb}:x))} colors={CQ_DEFS.map(d=>d.color)}/><div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">{sliders.map((sl,i)=>(<div key={i} className="flex items-center gap-1 text-[10px]"><span style={{color:sl.color}}>{sl.icon}</span><span className="text-gray-500">{sl.label}:</span><span className="font-bold" style={{color:sl.color}}>{Math.round(sl.weight)}%</span></div>))}</div></div></div></div></div><div className="flex-1 min-w-[300px] max-w-[420px]"><div className="bg-white rounded-2xl border border-indigo-200 shadow-sm overflow-hidden h-full flex flex-col"><div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3"><div className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">📜 Assertion</div><div className="text-white font-bold text-sm leading-snug break-words">{assertLabel}</div></div><div className="flex-1 flex flex-col items-center justify-center p-6"><div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-5">Integrated Reliability</div><div className="relative flex items-start"><div className="relative flex-shrink-0" style={{width:130,height:sliderH}}><div className="absolute right-2 text-xs font-semibold text-green-600 whitespace-nowrap" style={{top:((1-acceptMid/100)*100)+'%',transform:'translateY(-50%)'}}>{tA}%-100% Accept ✅</div><div className="absolute right-2 text-xs font-semibold text-yellow-600 whitespace-nowrap" style={{top:((1-neutralMid/100)*100)+'%',transform:'translateY(-50%)'}}>{tR2}%-{tA-1}% Neutral ⚖️</div><div className="absolute right-2 text-xs font-semibold text-red-600 whitespace-nowrap" style={{top:((1-rejectMid/100)*100)+'%',transform:'translateY(-50%)'}}>0%-{tR2-1}% Reject ❌</div></div><div className="relative flex-shrink-0" style={{width:56,height:sliderH}}><div className="absolute inset-0 bg-gray-200 rounded-xl overflow-hidden"/><div className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out" style={{height:fillPct+'%',backgroundColor:relColor,borderRadius:fillPct>=100?'0 0 12px 12px':'12px'}}/><div className="absolute left-0 right-0" style={{bottom:tR2+'%'}}><div className="w-full border-t border-dashed border-gray-400" style={{opacity:0.5}}/></div><div className="absolute left-0 right-0" style={{bottom:tA+'%'}}><div className="w-full border-t border-dashed border-gray-400" style={{opacity:0.5}}/></div></div><div className="relative flex-shrink-0" style={{width:90,height:sliderH}}><div className="absolute flex items-center transition-all duration-500 ease-out" style={{bottom:fillPct+'%',transform:'translateY(50%)',left:0}}><span style={{fontSize:22,color:relColor,lineHeight:1}}>◀</span><span className="text-xl font-black ml-0.5" style={{color:relColor}}>{reliability}%</span></div></div></div><div className="mt-5 text-center"><div className="text-2xl mb-1">{relEmoji}</div><div className="text-lg font-bold" style={{color:relColor}}>{relLabel2}</div></div><div className="w-full mt-5 pt-4 border-t border-gray-100"><div className="flex items-center gap-2 mb-2"><span className="text-base">⚙️</span><div><div className="text-sm font-bold text-gray-700">Reliability Benchmarks</div><div className="text-xs text-gray-400 italic">Adjust thresholds</div></div></div><DualRangeSlider min={0} max={100} low={tR2} high={tA} onLowChange={v=>setProb(edge.id,'thresholdReject',v)} onHighChange={v=>setProb(edge.id,'thresholdAccept',v)}/></div></div></div></div></div></div><div className="bg-white border-t border-gray-200 flex-shrink-0"><button onClick={()=>setSlidersOpen(v=>!v)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"><span>⚙️ Critical Questions Summary</span>{slidersOpen?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>{slidersOpen&&<div className="px-4 pb-3 overflow-auto" style={{maxHeight:360}}><div className="bg-purple-50 rounded-lg border border-purple-200 p-3 text-xs text-purple-900 leading-relaxed"><div className="font-bold mb-2">📋 Source — Critical Questions (Walton)</div><div className="space-y-2">{sliders.map(sl=>(<div key={sl.key} className="flex items-start gap-2"><span className="text-base flex-shrink-0">{sl.icon}</span><div className="flex-1"><div className="flex items-center gap-2"><span className="font-bold text-gray-700">{sl.label}</span><span className="font-bold" style={{color:sl.color}}>{sl.val}%</span><span className="text-[10px] text-gray-400">w:{Math.round(sl.weight)}%</span></div><div className="text-gray-500 italic">{sl.q}</div></div></div>))}<div className="border-t border-purple-200 pt-2 mt-2 flex items-center justify-between"><span className="font-bold text-gray-700">Integrated Reliability:</span><span className="text-lg font-black" style={{color:relColor}}>{reliability}% {relEmoji} {relLabel2}</span></div><div className="border-t border-purple-200 pt-2 mt-2"><div className="font-bold text-purple-700 mb-1">Thresholds</div><div className="text-gray-600">Reject: &lt;{tR2}% · Neutral: {tR2}%–{tA-1}% · Accept: ≥{tA}%</div></div></div></div></div>}</div></div>)};

/* ── Cause detail ── */
const renderCauseDetail=()=>{const edge=edges.find(e=>e.id===detailId);if(!edge)return null;const fn=nodes.find(n=>n.id===edge.from),tn=nodes.find(n=>n.id===edge.to);if(!fn||!tn)return null;const cT=fn.text?.trim()||'cause',eT=tn.text?.trim()||'effect';const pq=edge.pPQ,pxq=100-pq,xpxq=edge.pXPXQ,xpq=100-xpxq,prior=edge.pPrior??50;const nw2=140,nh2=54,aw=580,ah=425;const Ps={P:{x:35,y:55},Q:{x:400,y:55},XP:{x:35,y:316},XQ:{x:400,y:316}};const ct2=p=>({x:p.x+nw2/2,y:p.y+nh2/2});const[pc,qc,xpc,xqc]=[ct2(Ps.P),ct2(Ps.Q),ct2(Ps.XP),ct2(Ps.XQ)];const cTShort=cT.length>30?cT.slice(0,27)+'…':cT,eTShort=eT.length>30?eT.slice(0,27)+'…':eT;const pp=prior/100,pqp=pq/100,pnqnp=xpxq/100,pqnp=1-pnqnp;const jPQ=pp*pqp*100,jPnQ=pp*(1-pqp)*100,jnPQ=(1-pp)*pqnp*100,jnPnQ=(1-pp)*pnqnp*100;const totalQ=jPQ+jnPQ,pPgQ=totalQ>0?jPQ/totalQ*100:0;const SQ=250,MX=48,MY=28,pW2=SQ*pp,npW=SQ-pW2,pQH=SQ*pqp,npQH=SQ*pqnp;const mR=[{x:MX,y:MY,w:pW2,h:pQH,fill:'#34d399',lab:'P ∧ Q',pct:jPQ},{x:MX,y:MY+pQH,w:pW2,h:SQ-pQH,fill:'#fb7185',lab:'P ∧ ¬Q',pct:jPnQ},{x:MX+pW2,y:MY,w:npW,h:npQH,fill:'#fbbf24',lab:'¬P ∧ Q',pct:jnPQ},{x:MX+pW2,y:MY+npQH,w:npW,h:SQ-npQH,fill:'#94a3b8',lab:'¬P ∧ ¬Q',pct:jnPnQ}];const mosaicW=SQ+MX+25;
  const dlCauseConditional=()=>{const W=aw,H=ah;let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${W}" height="${H}" fill="#fff" rx="12"/>`;s+=`<defs><marker id="da" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#dc2626"/></marker><marker id="dal" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#fca5a5"/></marker></defs>`;s+=`<text x="${W/2}" y="28" text-anchor="middle" font-size="11" fill="#9ca3af" font-weight="600">Conditional Probabilities</text>`;if(pq>0){s+=`<line x1="${pc.x+nw2/2+5}" y1="${pc.y}" x2="${qc.x-nw2/2-5}" y2="${qc.y}" stroke="#dc2626" stroke-width="${sw(pq)}" marker-end="url(#da)" opacity="${op(pq)}"/>`;s+=`<text x="${(pc.x+qc.x)/2}" y="${pc.y-16}" text-anchor="middle" font-size="13" fill="#dc2626" font-weight="bold">${pq}%</text>`}if(pxq>0){s+=`<line x1="${pc.x+40}" y1="${pc.y+nh2/2+3}" x2="${xqc.x-40}" y2="${xqc.y-nh2/2-3}" stroke="#fca5a5" stroke-width="${sw(pxq)}" marker-end="url(#dal)" opacity="${op(pxq)}" stroke-dasharray="6 3"/>`;s+=`<text x="${(pc.x+xqc.x)/2+35}" y="${(pc.y+xqc.y)/2-3}" text-anchor="middle" font-size="11" fill="#f87171">${pxq}%</text>`}if(xpq>0){s+=`<line x1="${xpc.x+40}" y1="${xpc.y-nh2/2-3}" x2="${qc.x-40}" y2="${qc.y+nh2/2+3}" stroke="#fca5a5" stroke-width="${sw(xpq)}" marker-end="url(#dal)" opacity="${op(xpq)}" stroke-dasharray="6 3"/>`;s+=`<text x="${(xpc.x+qc.x)/2-35}" y="${(xpc.y+qc.y)/2+6}" text-anchor="middle" font-size="11" fill="#f87171">${xpq}%</text>`}if(xpxq>0){s+=`<line x1="${xpc.x+nw2/2+5}" y1="${xpc.y}" x2="${xqc.x-nw2/2-5}" y2="${xqc.y}" stroke="#dc2626" stroke-width="${sw(xpxq)}" marker-end="url(#da)" opacity="${op(xpxq)}"/>`;s+=`<text x="${(xpc.x+xqc.x)/2}" y="${xpc.y+34}" text-anchor="middle" font-size="13" fill="#dc2626" font-weight="bold">${xpxq}%</text>`}const nds=[{p:Ps.P,l:cT,sub:'P (cause)',bg:'#dbeafe',bd:'#3b82f6',c:'#1e40af'},{p:Ps.Q,l:eT,sub:'Q (effect)',bg:'#dcfce7',bd:'#22c55e',c:'#166534'},{p:Ps.XP,l:'¬ '+cT,sub:'¬P',bg:'#fee2e2',bd:'#f87171',c:'#991b1b'},{p:Ps.XQ,l:'¬ '+eT,sub:'¬Q',bg:'#fff7ed',bd:'#fb923c',c:'#9a3412'}];nds.forEach(it=>{const tl2=it.l.length>20?it.l.slice(0,17)+'...':it.l;s+=`<rect x="${it.p.x}" y="${it.p.y}" width="${nw2}" height="${nh2}" rx="10" fill="${it.bg}" stroke="${it.bd}" stroke-width="2"/>`;s+=`<text x="${it.p.x+nw2/2}" y="${it.p.y+nh2/2-4}" text-anchor="middle" font-size="11" font-weight="bold" fill="${it.c}">${esc(tl2)}</text>`;s+=`<text x="${it.p.x+nw2/2}" y="${it.p.y+nh2/2+10}" text-anchor="middle" font-size="9" fill="${it.c}" opacity="0.5">${esc(it.sub)}</text>`});s+=`</svg>`;toImg(s,W,H,'cause-effect-conditional.png')};
  const dlCauseMosaic=()=>{const pd=20,W=mosaicW+pd*2,H=SQ+MY+55+pd*2;let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${W}" height="${H}" fill="#fff" rx="8"/>`;const ox=pd,oy=pd;s+=`<rect x="${MX+ox}" y="${MY+oy}" width="${SQ}" height="${SQ}" fill="none" stroke="#334155" stroke-width="2" rx="2"/>`;mR.forEach(r=>{s+=`<rect x="${r.x+ox}" y="${r.y+oy}" width="${Math.max(r.w,0.5)}" height="${Math.max(r.h,0.5)}" fill="${r.fill}" fill-opacity="0.65" stroke="#fff" stroke-width="2.5" rx="1"/>`;if(r.w>42&&r.h>34){s+=`<text x="${r.x+r.w/2+ox}" y="${r.y+r.h/2-7+oy}" text-anchor="middle" font-size="10" font-weight="600" fill="#1e293b">${esc(r.lab)}</text>`;s+=`<text x="${r.x+r.w/2+ox}" y="${r.y+r.h/2+12+oy}" text-anchor="middle" font-size="14" font-weight="bold" fill="#0f172a">${r.pct.toFixed(1)}%</text>`}else if(r.w>18&&r.h>16){s+=`<text x="${r.x+r.w/2+ox}" y="${r.y+r.h/2+4+oy}" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e293b">${Math.round(r.pct)}%</text>`}});s+=`<line x1="${MX+pW2+ox}" y1="${MY+oy}" x2="${MX+pW2+ox}" y2="${MY+SQ+oy}" stroke="#475569" stroke-width="1" stroke-dasharray="4 3"/>`;if(pW2>20)s+=`<text x="${MX+pW2/2+ox}" y="${MY-8+oy}" text-anchor="middle" font-size="11" font-weight="bold" fill="#2563eb">P (${prior}%)</text>`;if(npW>20)s+=`<text x="${MX+pW2+npW/2+ox}" y="${MY-8+oy}" text-anchor="middle" font-size="11" font-weight="bold" fill="#dc2626">¬P (${100-prior}%)</text>`;s+=`<text x="${MX-6+ox}" y="${MY+14+oy}" text-anchor="end" font-size="11" font-weight="bold" fill="#059669">Q</text>`;s+=`<text x="${MX-6+ox}" y="${MY+SQ-4+oy}" text-anchor="end" font-size="11" font-weight="bold" fill="#ea580c">¬Q</text>`;const sy2=MY+SQ+18+oy;s+=`<text x="${MX+ox}" y="${sy2}" font-size="10" fill="#374151">P(${esc(eTShort)}) = ${totalQ.toFixed(1)}%</text>`;s+=`<text x="${MX+ox}" y="${sy2+16}" font-size="10" fill="#374151">P(${esc(cTShort)} | ${esc(eTShort)}) = ${pPgQ.toFixed(1)}%</text>`;s+=`</svg>`;toImg(s,pd*2+mosaicW,SQ+MY+55+pd*2,'cause-effect-mosaic.png')};
  return(<div className="flex flex-col h-full bg-slate-50"><div className="flex items-center gap-3 px-4 py-2 bg-white border-b shadow-sm flex-shrink-0"><button onClick={()=>{setDetailId(null);setShowNav(false)}} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"><ChevronLeft size={16}/> Back</button><div className="text-sm font-bold text-gray-700 truncate flex-1">Cause→Effect: <span className="text-blue-600">{cT}</span> → <span className="text-green-600">{eT}</span></div><div className="flex items-center gap-1.5 flex-shrink-0"><button onClick={dlCauseConditional} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download conditional"><Download size={14}/></button><button onClick={dlCauseMosaic} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download mosaic"><Download size={14}/></button>{renderNavBtn()}</div></div><div className="flex-1 overflow-auto p-4"><div className="flex flex-wrap gap-5 items-start"><div className="flex-shrink-0"><div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Conditional Probabilities</div><div className="relative bg-white rounded-xl border border-gray-200 shadow-sm" style={{width:aw,height:ah}}><svg className="absolute inset-0" width={aw} height={ah}><defs><marker id="da" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#dc2626"/></marker><marker id="dal" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#fca5a5"/></marker></defs>{pq>0&&<line x1={pc.x+nw2/2+5} y1={pc.y} x2={qc.x-nw2/2-5} y2={qc.y} stroke="#dc2626" strokeWidth={sw(pq)} markerEnd="url(#da)" opacity={op(pq)}/>}{pq>0&&<text x={(pc.x+qc.x)/2} y={pc.y-16} textAnchor="middle" fontSize="13" fill="#dc2626" fontWeight="bold">{pq}%</text>}{pxq>0&&<line x1={pc.x+40} y1={pc.y+nh2/2+3} x2={xqc.x-40} y2={xqc.y-nh2/2-3} stroke="#fca5a5" strokeWidth={sw(pxq)} markerEnd="url(#dal)" opacity={op(pxq)} strokeDasharray="6 3"/>}{pxq>0&&<text x={(pc.x+xqc.x)/2+35} y={(pc.y+xqc.y)/2-3} textAnchor="middle" fontSize="11" fill="#f87171">{pxq}%</text>}{xpq>0&&<line x1={xpc.x+40} y1={xpc.y-nh2/2-3} x2={qc.x-40} y2={qc.y+nh2/2+3} stroke="#fca5a5" strokeWidth={sw(xpq)} markerEnd="url(#dal)" opacity={op(xpq)} strokeDasharray="6 3"/>}{xpq>0&&<text x={(xpc.x+qc.x)/2-35} y={(xpc.y+qc.y)/2+6} textAnchor="middle" fontSize="11" fill="#f87171">{xpq}%</text>}{xpxq>0&&<line x1={xpc.x+nw2/2+5} y1={xpc.y} x2={xqc.x-nw2/2-5} y2={xqc.y} stroke="#dc2626" strokeWidth={sw(xpxq)} markerEnd="url(#da)" opacity={op(xpxq)}/>}{xpxq>0&&<text x={(xpc.x+xqc.x)/2} y={xpc.y+34} textAnchor="middle" fontSize="13" fill="#dc2626" fontWeight="bold">{xpxq}%</text>}</svg>{[{p:Ps.P,l:cT,sub:'P (cause)',c:'bg-blue-100 border-blue-500 text-blue-800'},{p:Ps.Q,l:eT,sub:'Q (effect)',c:'bg-green-100 border-green-500 text-green-800'},{p:Ps.XP,l:'¬ '+cT,sub:'¬P',c:'bg-red-100 border-red-400 text-red-700'},{p:Ps.XQ,l:'¬ '+eT,sub:'¬Q',c:'bg-orange-100 border-orange-400 text-orange-700'}].map((it,i)=>(<div key={i} className={'absolute border-2 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-lg overflow-hidden '+it.c} style={{left:it.p.x,top:it.p.y,width:nw2,height:nh2}}><span className="truncate max-w-full px-1">{it.l}</span><span style={{fontSize:10}} className="opacity-50">{it.sub}</span></div>))}</div></div><div className="flex-shrink-0" style={{maxWidth:mosaicW+28}}><div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bayesian Joint Probability</div><div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 overflow-hidden" style={{maxWidth:mosaicW+24}}><div className="mb-2 pb-2 border-b border-gray-100 text-xs px-1 space-y-0.5"><div className="flex items-start gap-1.5"><span className="font-bold text-blue-600 w-3 flex-shrink-0">P</span><span className="text-gray-300 flex-shrink-0">=</span><span className="text-gray-700" style={{wordBreak:'break-word'}}>{cT}</span></div><div className="flex items-start gap-1.5"><span className="font-bold text-green-600 w-3 flex-shrink-0">Q</span><span className="text-gray-300 flex-shrink-0">=</span><span className="text-gray-700" style={{wordBreak:'break-word'}}>{eT}</span></div></div><svg width={mosaicW} height={SQ+MY+25}><rect x={MX} y={MY} width={SQ} height={SQ} fill="none" stroke="#334155" strokeWidth="2" rx="2"/>{mR.map((r,i)=>(<g key={i}><rect x={r.x} y={r.y} width={Math.max(r.w,0.5)} height={Math.max(r.h,0.5)} fill={r.fill} fillOpacity="0.65" stroke="#fff" strokeWidth="2.5" rx="1"/>{r.w>42&&r.h>34&&<><text x={r.x+r.w/2} y={r.y+r.h/2-7} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">{r.lab}</text><text x={r.x+r.w/2} y={r.y+r.h/2+12} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">{r.pct.toFixed(1)}%</text></>}{r.w>18&&r.h>16&&!(r.w>42&&r.h>34)&&<text x={r.x+r.w/2} y={r.y+r.h/2+4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">{Math.round(r.pct)}%</text>}</g>))}<line x1={MX+pW2} y1={MY} x2={MX+pW2} y2={MY+SQ} stroke="#475569" strokeWidth="1" strokeDasharray="4 3"/>{pW2>20&&<text x={MX+pW2/2} y={MY-8} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2563eb">P ({prior}%)</text>}{npW>20&&<text x={MX+pW2+npW/2} y={MY-8} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">¬P ({100-prior}%)</text>}<text x={MX-6} y={MY+14} textAnchor="end" fontSize="11" fontWeight="bold" fill="#059669">Q</text><text x={MX-6} y={MY+SQ-4} textAnchor="end" fontSize="11" fontWeight="bold" fill="#ea580c">¬Q</text></svg><div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-1 px-1">{[{c:'#34d399',l:'P∧Q',v:jPQ},{c:'#fbbf24',l:'¬P∧Q',v:jnPQ},{c:'#fb7185',l:'P∧¬Q',v:jPnQ},{c:'#94a3b8',l:'¬P∧¬Q',v:jnPnQ}].map((it,i)=>(<div key={i} className="flex items-center gap-1.5 text-gray-600"><span className="w-3 h-3 rounded-sm flex-shrink-0" style={{background:it.c,opacity:0.75}}/><span>{it.l}: <strong>{it.v.toFixed(1)}%</strong></span></div>))}</div><div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1 px-1" style={{wordBreak:'break-word'}}><div>P(<span className="text-emerald-700 font-semibold">{eTShort}</span>) = <strong className="text-emerald-600">{totalQ.toFixed(1)}%</strong></div><div>P(<span className="text-purple-700 font-semibold">{cTShort}</span> | <span className="text-emerald-700 font-semibold">{eTShort}</span>) = <strong className="text-purple-600">{pPgQ.toFixed(1)}%</strong></div></div><div className="flex gap-3 mt-3"><div className="flex-1 rounded-lg p-2.5 bg-sky-50 border border-sky-200"><div className="font-bold text-sky-700 text-xs mb-0.5">⚡ Sufficiency of P</div><div style={{fontSize:11}} className="text-sky-600">{suffLabel(pq)}: {pq}%</div></div><div className="flex-1 rounded-lg p-2.5 bg-violet-50 border border-violet-200"><div className="font-bold text-violet-700 text-xs mb-0.5">🔗 Necessity of P</div><div style={{fontSize:11}} className="text-violet-600">{suffLabel(xpxq)}: {xpxq}%</div></div></div></div></div></div></div><div className="bg-white border-t border-gray-200 flex-shrink-0"><button onClick={()=>setSlidersOpen(v=>!v)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"><span>⚙️ Probability Controls & Critical Questions</span>{slidersOpen?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>{slidersOpen&&<div className="px-4 pb-3 overflow-auto" style={{maxHeight:480}}><div className="mb-3"><label className="block text-xs font-semibold text-red-700 mb-1">Subtype of Argument from Cause</label><select value={edge.causeArgType||'cause-to-effect'} onChange={e=>{const val=e.target.value;setEdges(es=>es.map(x=>x.id===edge.id?{...x,causeArgType:val}:x))}} className="w-full rounded-lg px-2 py-1.5 text-sm border border-red-200 bg-red-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"><option value="cause-to-effect">Argument from Cause to Effect</option><option value="effect-to-cause">Argument from Effect to Cause (Abductive)</option></select></div><div className="space-y-2.5"><div><div className="flex justify-between text-sm mb-1"><span className="font-semibold text-gray-700">P({cTShort}) = <span className="text-blue-600 font-bold">{prior}%</span></span><span className="text-gray-400 text-xs">Prior</span></div><input type="range" min="1" max="99" value={prior} onChange={e=>setProb(edge.id,'pPrior',+e.target.value)} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-200 accent-blue-600"/></div><div><div className="flex justify-between text-sm mb-1"><span className="font-semibold text-gray-700">P({eTShort}|{cTShort}) = <span className="text-red-600 font-bold">{pq}%</span></span><span className="text-gray-400 text-xs flex-shrink-0 ml-2">¬: {pxq}%</span></div><input type="range" min="0" max="100" value={pq} onChange={e=>setProb(edge.id,'pPQ',+e.target.value)} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-red-200 accent-red-600"/></div><div><div className="flex justify-between text-sm mb-1"><span className="font-semibold text-gray-700">P(¬{eTShort}|¬{cTShort}) = <span className="text-red-600 font-bold">{xpxq}%</span></span><span className="text-gray-400 text-xs flex-shrink-0 ml-2">¬: {xpq}%</span></div><input type="range" min="0" max="100" value={xpxq} onChange={e=>setProb(edge.id,'pXPXQ',+e.target.value)} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-red-200 accent-red-600"/></div></div><div className="mt-3 border border-amber-200 rounded-xl overflow-hidden"><button onClick={()=>setCqsOpen(v=>!v)} className="w-full flex items-center justify-between px-3 py-2 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 transition-colors"><span>⚡ Critical Questions</span>{cqsOpen?<ChevronDown size={12}/>:<ChevronUp size={12}/>}</button>{cqsOpen&&<div className="px-3 pb-3 bg-amber-50 border-t border-amber-200">{(edge.causeArgType||'cause-to-effect')==='cause-to-effect'?(<div className="space-y-2 text-xs text-gray-700 leading-relaxed"><div><strong className="text-amber-700">CQ1 Occurrence of Cause:</strong> Has the cause P actually occurred? Is P true? <em className="text-gray-500">(The prior probability is</em> <strong className="text-blue-600">P(P) = {prior}%</strong><em className="text-gray-500">.)</em></div><div><strong className="text-amber-700">CQ2 Strength of Causal Link:</strong> How strong is the generalisation that if cause P occurs, effect Q will follow? Is it a genuine causal relationship, or merely a correlation (sign)? → <strong className="text-red-600">P(Q|P) = {pq}%</strong></div><div><strong className="text-amber-700">CQ3 Interfering Factors:</strong> Are there other factors in this specific case that could prevent effect Q from occurring even if cause P is present? Could something interfere with the causal mechanism? → <strong className="text-orange-600">P(¬Q|P) = {pxq}%</strong> <em className="text-gray-500">(The higher this value, the more likely interfering factors could prevent Q despite P.)</em></div></div>):(<div className="space-y-2 text-xs text-gray-700 leading-relaxed"><div><strong className="text-amber-700">CQ1 Occurrence of Effect:</strong> Has the effect Q actually occurred? Is Q true? <em className="text-gray-500">(The probability of Q is</em> <strong className="text-emerald-600">P(Q) = {totalQ.toFixed(1)}%</strong><em className="text-gray-500">, derived from P(P)×P(Q|P) + P(¬P)×P(Q|¬P) = {prior}%×{pq}% + {100-prior}%×{xpq}%.)</em></div><div><strong className="text-amber-700">CQ2 Strength of Causal Link:</strong> How strong is the generalisation that if cause P occurs, effect Q will follow? Is it a genuine causal relationship, or merely a correlation (sign)? → <strong className="text-red-600">P(Q|P) = {pq}%</strong></div><div><strong className="text-amber-700">CQ3 Alternative Causes:</strong> Are there other, more plausible causes of Q? Could Q have been caused by some factor other than P? Could Q have occurred independently, without P? → <strong className="text-orange-600">P(Q|¬P) = {xpq}%</strong> <em className="text-gray-500">(The higher this value, the more likely Q can occur without P, weakening the abductive inference.)</em></div></div>)}</div>}</div></div>}</div></div>)};

/* ── Action-Goal detail ── */
const renderActionGoalDetail=()=>{const edge=edges.find(e=>e.id===detailId);if(!edge)return null;const aNode=nodes.find(n=>n.id===edge.from),gNode=nodes.find(n=>n.id===edge.to);if(!aNode||!gNode)return null;const aT=aNode.text?.trim()||'Action';const gT=edge.goalText||gNode.text?.trim()||'Goal';const rT=edge.ramificationText||'Side effects';const aTShort=aT.length>18?aT.slice(0,15)+'…':aT,gTShort=gT.length>18?gT.slice(0,15)+'…':gT,rTShort=rT.length>18?rT.slice(0,15)+'…':rT;const prior=edge.pPrior??50,pPQ=edge.pPQ??75,pXPXQ=edge.pXPXQ??50,pPR=edge.pPR??50,pXPXR=edge.pXPXR??50;const pp=prior/100;const pQgivenNotP=100-pXPXQ,pRgivenNotP=100-pXPXR;const jPQ=prior*pPQ/100,jPnQ=prior*(100-pPQ)/100,jnPQ=(100-prior)*pQgivenNotP/100,jnPnQ=(100-prior)*pXPXQ/100;const jPR=prior*pPR/100,jPnR=prior*(100-pPR)/100,jnPR=(100-prior)*pRgivenNotP/100,jnPnR=(100-prior)*pXPXR/100;const totalQ=jPQ+jnPQ,pPgQ=totalQ>0?jPQ/totalQ*100:0;const totalR=jPR+jnPR,pPgR=totalR>0?jPR/totalR*100:0;const ramifDelta=pPR-pRgivenNotP;const nw3=120,nh3=50,aw2=680,ah2=420;const NP={R:{x:10,y:60},P:{x:280,y:60},Q:{x:550,y:60},XR:{x:10,y:310},XP:{x:280,y:310},XQ:{x:550,y:310}};const ct3=p=>({x:p.x+nw3/2,y:p.y+nh3/2});const[rc2,pc2,qc2,xrc2,xpc2,xqc2]=[ct3(NP.R),ct3(NP.P),ct3(NP.Q),ct3(NP.XR),ct3(NP.XP),ct3(NP.XQ)];const gArrows=[{x1:pc2.x+nw3/2+5,y1:pc2.y,x2:qc2.x-nw3/2-5,y2:qc2.y,p:pPQ,solid:true,lx:(pc2.x+qc2.x)/2,ly:pc2.y-18,col:'#dc2626',lcol:'#dc2626',mk:'url(#dag)'},{x1:pc2.x+35,y1:pc2.y+nh3/2+3,x2:xqc2.x-35,y2:xqc2.y-nh3/2-3,p:100-pPQ,solid:false,lx:(pc2.x+xqc2.x)/2+38,ly:(pc2.y+xqc2.y)/2-5,col:'#fca5a5',lcol:'#f87171',mk:'url(#dagl)'},{x1:xpc2.x+35,y1:xpc2.y-nh3/2-3,x2:qc2.x-35,y2:qc2.y+nh3/2+3,p:pQgivenNotP,solid:false,lx:(xpc2.x+qc2.x)/2-38,ly:(xpc2.y+qc2.y)/2+8,col:'#fca5a5',lcol:'#f87171',mk:'url(#dagl)'},{x1:xpc2.x+nw3/2+5,y1:xpc2.y,x2:xqc2.x-nw3/2-5,y2:xqc2.y,p:pXPXQ,solid:true,lx:(xpc2.x+xqc2.x)/2,ly:xpc2.y+34,col:'#dc2626',lcol:'#dc2626',mk:'url(#dag)'}];const rArrows=[{x1:pc2.x-nw3/2-5,y1:pc2.y,x2:rc2.x+nw3/2+5,y2:rc2.y,p:pPR,solid:true,lx:(pc2.x+rc2.x)/2,ly:pc2.y-18,col:'#b45309',lcol:'#b45309',mk:'url(#dar)'},{x1:pc2.x-35,y1:pc2.y+nh3/2+3,x2:xrc2.x+35,y2:xrc2.y-nh3/2-3,p:100-pPR,solid:false,lx:(pc2.x+xrc2.x)/2-38,ly:(pc2.y+xrc2.y)/2-5,col:'#fbbf24',lcol:'#d97706',mk:'url(#darl)'},{x1:xpc2.x-35,y1:xpc2.y-nh3/2-3,x2:rc2.x+35,y2:rc2.y+nh3/2+3,p:pRgivenNotP,solid:false,lx:(xpc2.x+rc2.x)/2+38,ly:(xpc2.y+rc2.y)/2+8,col:'#fbbf24',lcol:'#d97706',mk:'url(#darl)'},{x1:xpc2.x-nw3/2-5,y1:xpc2.y,x2:xrc2.x+nw3/2+5,y2:xrc2.y,p:pXPXR,solid:true,lx:(xpc2.x+xrc2.x)/2,ly:xpc2.y+34,col:'#b45309',lcol:'#b45309',mk:'url(#dar)'}];const allArrows=[...rArrows,...gArrows];const nodeBoxesMeta=[{p:NP.R,l:rTShort,sub:'R (ramification)',bg:'#f3e8ff',bd:'#c084fc',tc2:'#6b21a8'},{p:NP.P,l:aTShort,sub:'P (action)',bg:'#dbeafe',bd:'#3b82f6',tc2:'#1e40af'},{p:NP.Q,l:gTShort,sub:'Q (goal)',bg:'#dcfce7',bd:'#22c55e',tc2:'#166534'},{p:NP.XR,l:'¬ '+rTShort,sub:'¬R',bg:'#fce7f3',bd:'#f472b6',tc2:'#9d174d'},{p:NP.XP,l:'¬ '+aTShort,sub:'¬P',bg:'#fee2e2',bd:'#f87171',tc2:'#991b1b'},{p:NP.XQ,l:'¬ '+gTShort,sub:'¬Q',bg:'#fff7ed',bd:'#fb923c',tc2:'#9a3412'}];const SQ2=220,MX2=40,MY2=36;const pW3=SQ2*pp,npW3=SQ2-pW3;const gPQH=SQ2*(pPQ/100),gNPQH=SQ2*(pQgivenNotP/100);const rPRH=SQ2*(pPR/100),rNPRH=SQ2*(pRgivenNotP/100);const rY=MY2+SQ2+24+16;const mosaicW2=MX2+SQ2+20;const mosaicH=rY+SQ2+30;const topR=[{x:MX2,y:MY2,w:pW3,h:gPQH,fill:'#34d399',lab:'P∧Q',pct:jPQ},{x:MX2,y:MY2+gPQH,w:pW3,h:SQ2-gPQH,fill:'#fb7185',lab:'P∧¬Q',pct:jPnQ},{x:MX2+pW3,y:MY2,w:npW3,h:gNPQH,fill:'#fbbf24',lab:'¬P∧Q',pct:jnPQ},{x:MX2+pW3,y:MY2+gNPQH,w:npW3,h:SQ2-gNPQH,fill:'#94a3b8',lab:'¬P∧¬Q',pct:jnPnQ}];const botR=[{x:MX2,y:rY,w:pW3,h:rPRH,fill:'#38bdf8',lab:'P∧R',pct:jPR},{x:MX2,y:rY+rPRH,w:pW3,h:SQ2-rPRH,fill:'#f472b6',lab:'P∧¬R',pct:jPnR},{x:MX2+pW3,y:rY,w:npW3,h:rNPRH,fill:'#a78bfa',lab:'¬P∧R',pct:jnPR},{x:MX2+pW3,y:rY+rNPRH,w:npW3,h:SQ2-rNPRH,fill:'#d4d4d8',lab:'¬P∧¬R',pct:jnPnR}];const allR=[...topR,...botR];const deltaLabel=ramifDelta>5?'⚠️ P increases R by +'+ramifDelta+'%':ramifDelta<-5?'✅ P decreases R by '+ramifDelta+'%':'≈ Similar — R is not attributable to P';
  const dlActionConditional=()=>{const W=aw2,H=ah2;let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${W}" height="${H}" fill="#fff" rx="12"/>`;s+=`<defs><marker id="dag2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#dc2626"/></marker><marker id="dagl2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#fca5a5"/></marker><marker id="dar2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#b45309"/></marker><marker id="darl2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#fbbf24"/></marker></defs>`;s+=`<text x="${W/2}" y="28" text-anchor="middle" font-size="10" fill="#9ca3af" font-weight="600">← Ramification (R)                    Goal (Q) →</text>`;allArrows.forEach(a=>{if(a.p>0){const mk2=a.mk.replace('dag','dag2').replace('dagl','dagl2').replace('dar','dar2').replace('darl','darl2');s+=`<line x1="${a.x1}" y1="${a.y1}" x2="${a.x2}" y2="${a.y2}" stroke="${a.col}" stroke-width="${sw(a.p)}" opacity="${op(a.p)}" ${a.solid?'':'stroke-dasharray="6 3"'} marker-end="${mk2}"/>`;s+=`<text x="${a.lx}" y="${a.ly}" text-anchor="middle" font-size="${a.solid?13:11}" fill="${a.lcol}" font-weight="bold">${a.p}%</text>`}});nodeBoxesMeta.forEach(it=>{const tl2=it.l.length>17?it.l.slice(0,14)+'...':it.l;s+=`<rect x="${it.p.x}" y="${it.p.y}" width="${nw3}" height="${nh3}" rx="10" fill="${it.bg}" stroke="${it.bd}" stroke-width="2"/><text x="${it.p.x+nw3/2}" y="${it.p.y+nh3/2-4}" text-anchor="middle" font-size="11" font-weight="bold" fill="${it.tc2}">${esc(tl2)}</text><text x="${it.p.x+nw3/2}" y="${it.p.y+nh3/2+10}" text-anchor="middle" font-size="9" fill="${it.tc2}" opacity="0.5">${esc(it.sub)}</text>`});s+=`</svg>`;toImg(s,W,H,'action-goal-conditional.png')};
  const dlActionMosaic=()=>{const pd=20,W=mosaicW2+pd*2+80,H=mosaicH+pd*2+120;let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${W}" height="${H}" fill="#fff" rx="8"/>`;const ox=pd+40,oy=pd+30;s+=`<text x="${ox+MX2}" y="${oy-22}" font-size="10" fill="#1e40af" font-weight="bold">P = ${esc(aTShort)} (action)</text>`;s+=`<text x="${ox+MX2}" y="${oy-10}" font-size="10" fill="#166534" font-weight="bold">Q = ${esc(gTShort)} (goal)   R = ${esc(rTShort)} (ramification)</text>`;s+=`<text x="${ox+MX2+SQ2/2}" y="${oy+MY2-10}" text-anchor="middle" font-size="10" font-weight="bold" fill="#059669">Action → Goal</text>`;s+=`<rect x="${ox+MX2}" y="${oy+MY2}" width="${SQ2}" height="${SQ2}" fill="none" stroke="#334155" stroke-width="2" rx="2"/>`;s+=`<text x="${ox+MX2+SQ2/2}" y="${oy+rY-6}" text-anchor="middle" font-size="10" font-weight="bold" fill="#7c3aed">── Action → Ramification ──</text>`;s+=`<rect x="${ox+MX2}" y="${oy+rY}" width="${SQ2}" height="${SQ2}" fill="none" stroke="#334155" stroke-width="2" rx="2"/>`;allR.forEach(r=>{s+=`<rect x="${r.x+ox}" y="${r.y+oy}" width="${Math.max(r.w,0.5)}" height="${Math.max(r.h,0.5)}" fill="${r.fill}" fill-opacity="0.65" stroke="#fff" stroke-width="2.5" rx="1"/>`;if(r.w>40&&r.h>32){s+=`<text x="${r.x+r.w/2+ox}" y="${r.y+r.h/2-6+oy}" text-anchor="middle" font-size="9" font-weight="600" fill="#1e293b">${esc(r.lab)}</text>`;s+=`<text x="${r.x+r.w/2+ox}" y="${r.y+r.h/2+10+oy}" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">${r.pct.toFixed(1)}%</text>`}else if(r.w>16&&r.h>14){s+=`<text x="${r.x+r.w/2+ox}" y="${r.y+r.h/2+4+oy}" text-anchor="middle" font-size="8" font-weight="bold" fill="#1e293b">${Math.round(r.pct)}%</text>`}});s+=`<line x1="${ox+MX2+pW3}" y1="${oy+MY2}" x2="${ox+MX2+pW3}" y2="${oy+MY2+SQ2}" stroke="#475569" stroke-width="1" stroke-dasharray="4 3"/>`;s+=`<line x1="${ox+MX2+pW3}" y1="${oy+rY}" x2="${ox+MX2+pW3}" y2="${oy+rY+SQ2}" stroke="#475569" stroke-width="1" stroke-dasharray="4 3"/>`;if(pW3>20)s+=`<text x="${ox+MX2+pW3/2}" y="${oy+MY2-2}" text-anchor="middle" font-size="10" font-weight="bold" fill="#2563eb">P (${prior}%)</text>`;if(npW3>20)s+=`<text x="${ox+MX2+pW3+npW3/2}" y="${oy+MY2-2}" text-anchor="middle" font-size="10" font-weight="bold" fill="#dc2626">¬P (${100-prior}%)</text>`;s+=`</svg>`;toImg(s,W,H,'action-goal-mosaic.png')};
  return(<div className="flex flex-col h-full bg-slate-50"><div className="flex items-center gap-3 px-4 py-2 bg-white border-b shadow-sm flex-shrink-0"><button onClick={()=>{setDetailId(null);setShowNav(false)}} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"><ChevronLeft size={16}/> Back</button><div className="text-sm font-bold text-gray-700 truncate flex-1">Action→Goal: <span className="text-blue-600">{aT}</span> → <span className="text-green-600">{gT}</span></div><div className="flex items-center gap-1.5 flex-shrink-0"><button onClick={dlActionConditional} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download conditional diagram"><Download size={14}/></button><button onClick={dlActionMosaic} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download mosaic diagram"><Download size={14}/></button>{renderNavBtn()}</div></div><div className="flex-1 overflow-auto p-4"><div className="flex flex-wrap gap-5 items-start"><div className="flex-shrink-0"><div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Dual Conditional Probabilities</div><div className="relative bg-white rounded-xl border border-gray-200 shadow-sm" style={{width:aw2,height:ah2}}><svg className="absolute inset-0" width={aw2} height={ah2}><defs><marker id="dag" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#dc2626"/></marker><marker id="dagl" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#fca5a5"/></marker><marker id="dar" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#b45309"/></marker><marker id="darl" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#fbbf24"/></marker></defs><text x={aw2/2} y={28} textAnchor="middle" fontSize="10" fill="#9ca3af" fontWeight="600">{'← Ramification (R)                    Goal (Q) →'}</text>{allArrows.map((a,i)=>a.p>0?<g key={i}><line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke={a.col} strokeWidth={sw(a.p)} opacity={op(a.p)} strokeDasharray={a.solid?undefined:'6 3'} markerEnd={a.mk}/><text x={a.lx} y={a.ly} textAnchor="middle" fontSize={a.solid?13:11} fill={a.lcol} fontWeight="bold">{a.p}%</text></g>:null)}</svg>{nodeBoxesMeta.map((it,i)=>(<div key={i} className="absolute border-2 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-lg overflow-hidden" style={{left:it.p.x,top:it.p.y,width:nw3,height:nh3,background:it.bg,borderColor:it.bd,color:it.tc2}}><span className="truncate max-w-full px-1">{it.l}</span><span style={{fontSize:9}} className="opacity-50">{it.sub}</span></div>))}</div></div><div className="flex-shrink-0" style={{maxWidth:mosaicW2+60}}><div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Stacked Bayesian Joint</div><div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-hidden"><div className="mb-2 pb-2 border-b border-gray-100 text-xs px-1 space-y-0.5"><div className="flex items-start gap-1.5"><span className="font-bold text-blue-600 w-3 flex-shrink-0">P</span><span className="text-gray-300 flex-shrink-0">=</span><span className="text-gray-700" style={{wordBreak:'break-word'}}>{aT} <span className="text-gray-400">(action)</span></span></div><div className="flex items-start gap-1.5"><span className="font-bold text-green-600 w-3 flex-shrink-0">Q</span><span className="text-gray-300 flex-shrink-0">=</span><span className="text-gray-700" style={{wordBreak:'break-word'}}>{gT} <span className="text-gray-400">(goal)</span></span></div><div className="flex items-start gap-1.5"><span className="font-bold text-purple-600 w-3 flex-shrink-0">R</span><span className="text-gray-300 flex-shrink-0">=</span><span className="text-gray-700" style={{wordBreak:'break-word'}}>{rT} <span className="text-gray-400">(ramification)</span></span></div></div><svg width={mosaicW2} height={mosaicH}><text x={MX2+SQ2/2} y={MY2-10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">Action → Goal</text><rect x={MX2} y={MY2} width={SQ2} height={SQ2} fill="none" stroke="#334155" strokeWidth="2" rx="2"/><text x={MX2+SQ2/2} y={rY-6} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7c3aed">── Action → Ramification ──</text><rect x={MX2} y={rY} width={SQ2} height={SQ2} fill="none" stroke="#334155" strokeWidth="2" rx="2"/>{allR.map((r,i)=>(<g key={i}><rect x={r.x} y={r.y} width={Math.max(r.w,0.5)} height={Math.max(r.h,0.5)} fill={r.fill} fillOpacity="0.65" stroke="#fff" strokeWidth="2.5" rx="1"/>{r.w>40&&r.h>32&&<><text x={r.x+r.w/2} y={r.y+r.h/2-6} textAnchor="middle" fontSize="9" fontWeight="600" fill="#1e293b">{r.lab}</text><text x={r.x+r.w/2} y={r.y+r.h/2+10} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">{r.pct.toFixed(1)}%</text></>}{r.w>16&&r.h>14&&!(r.w>40&&r.h>32)&&<text x={r.x+r.w/2} y={r.y+r.h/2+4} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">{Math.round(r.pct)}%</text>}</g>))}<line x1={MX2+pW3} y1={MY2} x2={MX2+pW3} y2={MY2+SQ2} stroke="#475569" strokeWidth="1" strokeDasharray="4 3"/><line x1={MX2+pW3} y1={rY} x2={MX2+pW3} y2={rY+SQ2} stroke="#475569" strokeWidth="1" strokeDasharray="4 3"/>{pW3>20&&<text x={MX2+pW3/2} y={MY2-2} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563eb">P ({prior}%)</text>}{npW3>20&&<text x={MX2+pW3+npW3/2} y={MY2-2} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#dc2626">¬P ({100-prior}%)</text>}<text x={MX2-6} y={MY2+14} textAnchor="end" fontSize="10" fontWeight="bold" fill="#059669">Q</text><text x={MX2-6} y={MY2+SQ2-4} textAnchor="end" fontSize="10" fontWeight="bold" fill="#ea580c">¬Q</text><text x={MX2-6} y={rY+14} textAnchor="end" fontSize="10" fontWeight="bold" fill="#7c3aed">R</text><text x={MX2-6} y={rY+SQ2-4} textAnchor="end" fontSize="10" fontWeight="bold" fill="#9d174d">¬R</text></svg><div className="mt-2 pt-2 border-t border-gray-100"><div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs px-1"><div className="font-bold text-green-700 col-span-2 mt-1">Goal (P→Q)</div>{[{c:'#34d399',l:'P∧Q',v:jPQ},{c:'#fbbf24',l:'¬P∧Q',v:jnPQ},{c:'#fb7185',l:'P∧¬Q',v:jPnQ},{c:'#94a3b8',l:'¬P∧¬Q',v:jnPnQ}].map((it,i)=>(<div key={i} className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{background:it.c,opacity:0.75}}/><span>{it.l}: <strong>{it.v.toFixed(1)}%</strong></span></div>))}<div className="font-bold text-purple-700 col-span-2 mt-2">Ramification (P→R)</div>{[{c:'#38bdf8',l:'P∧R',v:jPR},{c:'#a78bfa',l:'¬P∧R',v:jnPR},{c:'#f472b6',l:'P∧¬R',v:jPnR},{c:'#d4d4d8',l:'¬P∧¬R',v:jnPnR}].map((it,i)=>(<div key={i} className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{background:it.c,opacity:0.75}}/><span>{it.l}: <strong>{it.v.toFixed(1)}%</strong></span></div>))}</div></div><div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-0.5 px-1" style={{wordBreak:'break-word'}}><div>P(<span className="text-emerald-700 font-semibold">{gTShort}</span>) = <strong className="text-emerald-600">{totalQ.toFixed(1)}%</strong></div><div>P(<span className="text-blue-700 font-semibold">{aTShort}</span> | <span className="text-emerald-700 font-semibold">{gTShort}</span>) = <strong className="text-blue-600">{pPgQ.toFixed(1)}%</strong></div><div>P(<span className="text-purple-700 font-semibold">{rTShort}</span>) = <strong className="text-purple-600">{totalR.toFixed(1)}%</strong></div><div>P(<span className="text-blue-700 font-semibold">{aTShort}</span> | <span className="text-purple-700 font-semibold">{rTShort}</span>) = <strong className="text-blue-600">{pPgR.toFixed(1)}%</strong></div></div><div className="flex gap-3 mt-3"><div className="flex-1 rounded-lg p-2.5 bg-sky-50 border border-sky-200"><div className="font-bold text-sky-700 text-xs mb-1">⚡ Sufficiency of P</div><div className="text-xs text-sky-600 space-y-0.5"><div>Goal: {suffLabel(pPQ)}: {pPQ}%</div><div>Ramif: {suffLabel(pPR)}: {pPR}%</div></div></div><div className="flex-1 rounded-lg p-2.5 bg-violet-50 border border-violet-200"><div className="font-bold text-violet-700 text-xs mb-1">🔗 Necessity of P</div><div className="text-xs text-violet-600 space-y-0.5"><div>Goal: {suffLabel(pXPXQ)}: {pXPXQ}%</div><div>Ramif: {suffLabel(pXPXR)}: {pXPXR}%</div></div></div></div></div></div></div></div><div className="bg-white border-t border-gray-200 flex-shrink-0"><button onClick={()=>setSlidersOpen(v=>!v)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"><span>⚙️ Probability Controls & Critical Questions</span>{slidersOpen?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>{slidersOpen&&<div className="px-4 pb-3 overflow-auto" style={{maxHeight:420}}><div className="mb-2"><div className="flex justify-between text-sm mb-1"><span className="font-semibold text-gray-700">P({aTShort}) = <span className="text-blue-600 font-bold">{prior}%</span></span><span className="text-gray-400 text-xs">Prior</span></div><input type="range" min="1" max="99" value={prior} onChange={e=>setProb(edge.id,'pPrior',+e.target.value)} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-200 accent-blue-600"/></div><div className="flex gap-4"><div className="flex-1 space-y-2"><div className="text-xs font-bold text-green-700 border-b border-green-200 pb-0.5">Goal (P→Q)</div><div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-500 flex-shrink-0">Q =</span><input type="text" value={edge.goalText||''} onChange={e=>setEdges(p=>p.map(x=>x.id===edge.id?{...x,goalText:e.target.value}:x))} placeholder={gNode.text?.trim()||'goal…'} className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-400"/></div><div><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-600">P(Q|P) = <span className="text-red-600 font-bold">{pPQ}%</span></span></div><input type="range" min="0" max="100" value={pPQ} onChange={e=>setProb(edge.id,'pPQ',+e.target.value)} className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-red-200 accent-red-600"/></div><div><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-600">P(¬Q|¬P) = <span className="text-red-600 font-bold">{pXPXQ}%</span></span></div><input type="range" min="0" max="100" value={pXPXQ} onChange={e=>setProb(edge.id,'pXPXQ',+e.target.value)} className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-red-200 accent-red-600"/></div></div><div className="flex-1 space-y-2"><div className="text-xs font-bold text-purple-700 border-b border-purple-200 pb-0.5">Ramification (P→R)</div><div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-500 flex-shrink-0">R =</span><input type="text" value={edge.ramificationText||''} onChange={e=>setEdges(p=>p.map(x=>x.id===edge.id?{...x,ramificationText:e.target.value}:x))} placeholder="Side effects" className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"/></div><div><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-600">P(R|P) = <span className="text-amber-700 font-bold">{pPR}%</span></span></div><input type="range" min="0" max="100" value={pPR} onChange={e=>setProb(edge.id,'pPR',+e.target.value)} className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-amber-200 accent-amber-600"/></div><div><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-600">P(¬R|¬P) = <span className="text-amber-700 font-bold">{pXPXR}%</span></span></div><input type="range" min="0" max="100" value={pXPXR} onChange={e=>setProb(edge.id,'pXPXR',+e.target.value)} className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-amber-200 accent-amber-600"/></div></div></div><div className="mt-3 border border-amber-200 rounded-xl overflow-hidden"><button onClick={()=>setCqsOpen(v=>!v)} className="w-full flex items-center justify-between px-3 py-2 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 transition-colors"><span>🎯 Critical Questions</span>{cqsOpen?<ChevronDown size={12}/>:<ChevronUp size={12}/>}</button>{cqsOpen&&<div className="px-3 pb-3 bg-amber-50 border-t border-amber-200"><div className="space-y-2 text-xs text-gray-700 leading-relaxed"><div><strong className="text-amber-700">CQ1 Feasibility:</strong> How feasible is P? → <strong className="text-blue-600">P(P) = {prior}%</strong></div><div><strong className="text-amber-700">CQ2 Causality:</strong> How likely will Q occur if P? → <strong className="text-red-600">P(Q|P) = {pPQ}%</strong></div><div><strong className="text-amber-700">CQ3 Need of Goal:</strong> How strongly does Q need to be fulfilled? <em className="text-gray-500">(Note: The slider P(¬Q|¬P) = {pXPXQ}% measures how necessary the action P is for achieving Q — a different concept. When both the need of Q is high and P's necessity for Q is high, P is well-justified.)</em></div><div><strong className="text-amber-700">CQ4 Alternativity:</strong> Can alternative actions (¬P) also achieve Q? → <strong className="text-orange-600">P(Q|¬P) = {pQgivenNotP}%</strong> <em className="text-gray-500">(The lower this value, the more indispensable P is.)</em></div><div><strong className="text-amber-700">CQ5 Ramification:</strong> Does P cause negative R beyond baseline? → <strong className="text-amber-700">P(R|P) = {pPR}%</strong> vs <strong className="text-purple-600">P(R|¬P) = {pRgivenNotP}%</strong> <span className="text-gray-500">(Δ = {Math.abs(ramifDelta)}%. {deltaLabel})</span></div></div></div>}</div></div>}</div></div>)};

/* ── Event Detail (Sugiyama Layout) ── */
const renderEventDetail=()=>{
  const ce=edges.find(e=>e.id===detailId);if(!ce)return null;
  const fN=nodes.find(n=>n.id===ce.from),tN=nodes.find(n=>n.id===ce.to);
  if(!fN||!tN)return null;
  const isEvT=t=>t==='sequence'||t==='cause'||t==='mean-goal';
  const evEs=edges.filter(e=>isEvT(e.type));
  // Connected component via BFS
  const au={};evEs.forEach(e=>{if(!au[e.from])au[e.from]=new Set();if(!au[e.to])au[e.to]=new Set();au[e.from].add(e.to);au[e.to].add(e.from)});
  const cpS=new Set([ce.from,ce.to]);const bq2=[ce.from,ce.to];
  while(bq2.length){const c=bq2.shift();(au[c]||new Set()).forEach(nb=>{if(!cpS.has(nb)){cpS.add(nb);bq2.push(nb)}})}
  const sN=nodes.filter(n=>cpS.has(n.id)),sE=evEs.filter(e=>cpS.has(e.from)&&cpS.has(e.to));
  if(!sN.length)return null;
  // Sugiyama Step 1: Cycle removal (DFS)
  const oa2={};sN.forEach(n=>{oa2[n.id]=[]});sE.forEach(e=>{oa2[e.from].push(e)});
  const cl3={};const bkS=new Set();sN.forEach(n=>{cl3[n.id]=0});
  const id4={};sN.forEach(n=>{id4[n.id]=0});sE.forEach(e=>{id4[e.to]++});
  const dfv3=nid=>{cl3[nid]=1;oa2[nid].forEach(e=>{if(cl3[e.to]===1)bkS.add(e.id);else if(!cl3[e.to])dfv3(e.to)});cl3[nid]=2};
  sN.filter(n=>!id4[n.id]).forEach(n=>{if(!cl3[n.id])dfv3(n.id)});
  sN.forEach(n=>{if(!cl3[n.id])dfv3(n.id)});
  // Step 2: Layer assignment (longest path on DAG)
  const dg3={},di3={};sN.forEach(n=>{dg3[n.id]=[];di3[n.id]=0});
  sE.forEach(e=>{if(bkS.has(e.id)){dg3[e.to].push(e.from);di3[e.from]++}else{dg3[e.from].push(e.to);di3[e.to]++}});
  const tp4=[],ti4={...di3};let kq3=sN.filter(n=>!ti4[n.id]).map(n=>n.id);
  while(kq3.length){const nid=kq3.shift();tp4.push(nid);dg3[nid].forEach(to=>{ti4[to]--;if(!ti4[to])kq3.push(to)})}
  const ts4=new Set(tp4);sN.forEach(n=>{if(!ts4.has(n.id))tp4.push(n.id)});
  const ly4={};tp4.forEach(nid=>{ly4[nid]=0});
  tp4.forEach(nid=>{dg3[nid].forEach(to=>{ly4[to]=Math.max(ly4[to],ly4[nid]+1)})});
  const nL3=Math.max(0,...Object.values(ly4))+1;
  const lrs3=Array.from({length:nL3},()=>[]);
  sN.forEach(n=>{lrs3[ly4[n.id]].push(n.id)});
  // Step 3: Crossing minimization (barycenter, 4 sweeps)
  for(let ps=0;ps<4;ps++){
    for(let l=1;l<nL3;l++){const pp3={};lrs3[l-1].forEach((nid,i)=>{pp3[nid]=i});
      const bc3=lrs3[l].map(nid=>{const pr3=[];sE.forEach(e=>{const f=bkS.has(e.id)?e.to:e.from,t=bkS.has(e.id)?e.from:e.to;if(t===nid&&ly4[f]===l-1&&pp3[f]!==undefined)pr3.push(pp3[f])});return{nid,v:pr3.length?pr3.reduce((a,b)=>a+b,0)/pr3.length:Infinity}});
      bc3.sort((a,b)=>a.v-b.v);lrs3[l]=bc3.map(b=>b.nid)}
    for(let l=nL3-2;l>=0;l--){const np3={};lrs3[l+1].forEach((nid,i)=>{np3[nid]=i});
      const bc3=lrs3[l].map(nid=>{const ch3=[];sE.forEach(e=>{const f=bkS.has(e.id)?e.to:e.from,t=bkS.has(e.id)?e.from:e.to;if(f===nid&&ly4[t]===l+1&&np3[t]!==undefined)ch3.push(np3[t])});return{nid,v:ch3.length?ch3.reduce((a,b)=>a+b,0)/ch3.length:Infinity}});
      bc3.sort((a,b)=>a.v-b.v);lrs3[l]=bc3.map(b=>b.nid)}
  }
  // Step 4: Coordinate assignment
  const EN=160,EH=52,EHG=50,EVG=80,EPD=50;
  const emxL=Math.max(1,...lrs3.map(l=>l.length));
  const baseW2=emxL*EN+(emxL-1)*EHG+EPD*2;
  const esvH=nL3*EH+(nL3-1)*EVG+EPD*2;
  const ePo={};
  lrs3.forEach((lns,li)=>{const lw3=lns.length*EN+(lns.length-1)*EHG;const sx3=(baseW2-lw3)/2;
    lns.forEach((nid,ni)=>{ePo[nid]={x:sx3+ni*(EN+EHG),y:EPD+li*(EH+EVG)}})});
  // Identify long forward edges (span > 1 layer) and assign curve offsets
  const longEInfo={};const longEdgeList=sE.filter(e=>!bkS.has(e.id)&&Math.abs(ly4[e.from]-ly4[e.to])>1);
  longEdgeList.sort((a,b)=>Math.abs(ly4[b.to]-ly4[b.from])-Math.abs(ly4[a.to]-ly4[a.from]));
  const LONG_STEP=40;let maxLeftOff=0,maxRightOff=0;
  longEdgeList.forEach((e,i)=>{const side=i%2===0?'left':'right';const off=(i+1)*LONG_STEP;longEInfo[e.id]={side,offset:off};if(side==='left')maxLeftOff=Math.max(maxLeftOff,off);else maxRightOff=Math.max(maxRightOff,off)});
  // Shift all nodes right to accommodate left curves
  if(maxLeftOff>0){const shift=maxLeftOff+30;Object.values(ePo).forEach(p=>{p.x+=shift})}
  // Compute canvas width accounting for back-edge and long-edge curves
  let mxX=0;sN.forEach(n=>{mxX=Math.max(mxX,ePo[n.id].x+EN)});
  sE.forEach(e=>{if(bkS.has(e.id)){const fp=ePo[e.from],tp=ePo[e.to];const ox3=Math.max(60,Math.abs((fp.y+EH/2)-(tp.y+EH/2))*0.3);mxX=Math.max(mxX,Math.max(fp.x,tp.x)+EN+ox3)}});
  longEdgeList.forEach(e=>{const info=longEInfo[e.id];if(info&&info.side==='right'){mxX=Math.max(mxX,Math.max(ePo[e.from].x,ePo[e.to].x)+EN+info.offset)}});
  const esvW=mxX+EPD;
  // Edge styling
  const evSt=type=>type==='sequence'?{stroke:'#0d9488',sw:2,dash:'6 4',lbl:'sequence →',mk:'ev-s'}:type==='cause'?{stroke:'#dc2626',sw:2.5,dash:'',lbl:'cause → effect',mk:'ev-c'}:{stroke:'#b45309',sw:2.5,dash:'',lbl:'action → goal',mk:'ev-m'};
  const fT3=fN.text?.trim()||'?',tT3=tN.text?.trim()||'?';
  // Render helpers
  const renderEvEdge=(e,asSvgStr)=>{
    const st=evSt(e.type);const fp=ePo[e.from],tp=ePo[e.to];const hl=e.id===ce.id;const ib=bkS.has(e.id);const longInfo=longEInfo[e.id];
    if(ib){
      const fx=fp.x+EN,fy=fp.y+EH/2,tx=tp.x+EN,ty=tp.y+EH/2;
      const ox3=Math.max(60,Math.abs(fy-ty)*0.3);
      const d2=`M ${fx} ${fy} C ${fx+ox3} ${fy}, ${tx+ox3} ${ty}, ${tx} ${ty}`;
      const lx3=(fx+tx)/2+0.75*ox3,ly3b=(fy+ty)/2;const lw3=st.lbl.length*5.5+12;
      if(asSvgStr){let s2='';if(hl)s2+=`<path d="${d2}" fill="none" stroke="#818cf8" stroke-width="${st.sw+6}" opacity="0.25"/>`;s2+=`<path d="${d2}" fill="none" stroke="${st.stroke}" stroke-width="${hl?st.sw+1.5:st.sw}" ${st.dash?`stroke-dasharray="${st.dash}"`:''} marker-end="url(#${st.mk})" opacity="${hl?1:0.6}"/>`;s2+=`<rect x="${lx3-lw3/2}" y="${ly3b-8}" width="${lw3}" height="15" rx="7" fill="#fff" fill-opacity="0.92" stroke="${st.stroke}" stroke-width="0.5"/><text x="${lx3}" y="${ly3b+3}" text-anchor="middle" font-size="9" fill="${st.stroke}" font-weight="600">${st.lbl}</text>`;return s2}
      return(<g key={'be-'+e.id}>{hl&&<path d={d2} fill="none" stroke="#818cf8" strokeWidth={st.sw+6} opacity={0.25}/>}<path d={d2} fill="none" stroke={st.stroke} strokeWidth={hl?st.sw+1.5:st.sw} strokeDasharray={st.dash||undefined} markerEnd={`url(#${st.mk})`} opacity={hl?1:0.6}/><rect x={lx3-lw3/2} y={ly3b-8} width={lw3} height={15} rx={7} fill="white" fillOpacity={0.92} stroke={st.stroke} strokeWidth={0.5}/><text x={lx3} y={ly3b+3} textAnchor="middle" fontSize="9" fill={st.stroke} fontWeight="600">{st.lbl}</text></g>)
    }
    if(longInfo){
      const isL=longInfo.side==='left';const fx=isL?fp.x:fp.x+EN,fy=fp.y+EH/2,tx=isL?tp.x:tp.x+EN,ty2=tp.y+EH/2;
      const offX=isL?-longInfo.offset:longInfo.offset;
      const d2=`M ${fx} ${fy} C ${fx+offX} ${fy+(ty2-fy)*0.15}, ${tx+offX} ${ty2-(ty2-fy)*0.15}, ${tx} ${ty2}`;
      const lx3=(fx+tx)/2+offX*0.6,ly3b=(fy+ty2)/2;const lw3=st.lbl.length*5.5+12;
      if(asSvgStr){let s2='';if(hl)s2+=`<path d="${d2}" fill="none" stroke="#818cf8" stroke-width="${st.sw+6}" opacity="0.25"/>`;s2+=`<path d="${d2}" fill="none" stroke="${st.stroke}" stroke-width="${hl?st.sw+1.5:st.sw}" ${st.dash?`stroke-dasharray="${st.dash}"`:''} marker-end="url(#${st.mk})" opacity="${hl?1:0.6}"/>`;s2+=`<rect x="${lx3-lw3/2}" y="${ly3b-8}" width="${lw3}" height="15" rx="7" fill="#fff" fill-opacity="0.92" stroke="${st.stroke}" stroke-width="0.5"/><text x="${lx3}" y="${ly3b+3}" text-anchor="middle" font-size="9" fill="${st.stroke}" font-weight="600">${st.lbl}</text>`;return s2}
      return(<g key={'le-'+e.id}>{hl&&<path d={d2} fill="none" stroke="#818cf8" strokeWidth={st.sw+6} opacity={0.25}/>}<path d={d2} fill="none" stroke={st.stroke} strokeWidth={hl?st.sw+1.5:st.sw} strokeDasharray={st.dash||undefined} markerEnd={`url(#${st.mk})`} opacity={hl?1:0.6}/><rect x={lx3-lw3/2} y={ly3b-8} width={lw3} height={15} rx={7} fill="white" fillOpacity={0.92} stroke={st.stroke} strokeWidth={0.5}/><text x={lx3} y={ly3b+3} textAnchor="middle" fontSize="9" fill={st.stroke} fontWeight="600">{st.lbl}</text></g>)
    }
    const fx=fp.x+EN/2,fy=fp.y+EH,tx=tp.x+EN/2,ty2=tp.y;
    const mx2=(fx+tx)/2,my2=(fy+ty2)/2;const lw3=st.lbl.length*5.5+12;
    if(asSvgStr){let s2='';if(hl)s2+=`<line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty2}" stroke="#818cf8" stroke-width="${st.sw+6}" opacity="0.25"/>`;s2+=`<line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty2}" stroke="${st.stroke}" stroke-width="${hl?st.sw+1.5:st.sw}" ${st.dash?`stroke-dasharray="${st.dash}"`:''} marker-end="url(#${st.mk})" opacity="${hl?1:0.6}"/>`;s2+=`<rect x="${mx2-lw3/2}" y="${my2-8}" width="${lw3}" height="15" rx="7" fill="#fff" fill-opacity="0.92" stroke="${st.stroke}" stroke-width="0.5"/><text x="${mx2}" y="${my2+3}" text-anchor="middle" font-size="9" fill="${st.stroke}" font-weight="600">${st.lbl}</text>`;return s2}
    return(<g key={'e-'+e.id}>{hl&&<line x1={fx} y1={fy} x2={tx} y2={ty2} stroke="#818cf8" strokeWidth={st.sw+6} opacity={0.25}/>}<line x1={fx} y1={fy} x2={tx} y2={ty2} stroke={st.stroke} strokeWidth={hl?st.sw+1.5:st.sw} strokeDasharray={st.dash||undefined} markerEnd={`url(#${st.mk})`} opacity={hl?1:0.6}/><rect x={mx2-lw3/2} y={my2-8} width={lw3} height={15} rx={7} fill="white" fillOpacity={0.92} stroke={st.stroke} strokeWidth={0.5}/><text x={mx2} y={my2+3} textAnchor="middle" fontSize="9" fill={st.stroke} fontWeight="600">{st.lbl}</text></g>)
  };
  const renderEvNode=(n,asSvgStr)=>{
    const p=ePo[n.id];const hl=n.id===ce.from||n.id===ce.to;const isE2=n.type==='expressed';
    const txt=(n.text||'').trim();const tr=txt.length>18?txt.slice(0,15)+'…':txt;
    if(asSvgStr){let s2='';if(hl)s2+=`<rect x="${p.x-3}" y="${p.y-3}" width="${EN+6}" height="${EH+6}" rx="13" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-dasharray="4 2" opacity="0.7"/>`;s2+=`<rect x="${p.x}" y="${p.y}" width="${EN}" height="${EH}" rx="10" fill="${isE2?'#ecfdf5':'#fffbeb'}" stroke="${hl?'#4f46e5':isE2?'#34d399':'#fbbf24'}" stroke-width="${hl?3:2}"/>`;s2+=`<text x="${p.x+EN/2}" y="${p.y+EH/2+4}" text-anchor="middle" font-size="11" font-weight="${hl?'bold':'600'}" fill="#1f2937">${esc(tr)}</text>`;return s2}
    return(<g key={'en-'+n.id}>{hl&&<rect x={p.x-3} y={p.y-3} width={EN+6} height={EH+6} rx={13} fill="none" stroke="#818cf8" strokeWidth={2.5} strokeDasharray="4 2" opacity={0.7}/>}<rect x={p.x} y={p.y} width={EN} height={EH} rx={10} fill={isE2?'#ecfdf5':'#fffbeb'} stroke={hl?'#4f46e5':isE2?'#34d399':'#fbbf24'} strokeWidth={hl?3:2}/><text x={p.x+EN/2} y={p.y+EH/2+4} textAnchor="middle" fontSize="11" fontWeight={hl?'bold':'600'} fill="#1f2937">{tr}</text></g>)
  };
  const mkDefs=`<marker id="ev-s" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0d9488"/></marker><marker id="ev-c" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#dc2626"/></marker><marker id="ev-m" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#b45309"/></marker>`;
  // Download
  const dlEv=()=>{let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${esvW}" height="${esvH}" style="font-family:system-ui,-apple-system,sans-serif"><rect width="${esvW}" height="${esvH}" fill="#fff"/><defs>${mkDefs}</defs>`;lrs3.forEach((_,li)=>{s+=`<text x="12" y="${EPD+li*(EH+EVG)+EH/2+4}" font-size="10" fill="#94a3b8" font-weight="600">L${li}</text>`});sE.forEach(e=>{s+=renderEvEdge(e,true)});sN.forEach(n=>{s+=renderEvNode(n,true)});s+=`</svg>`;toImg(s,esvW,esvH,'event-analysis.png')};
  // ── Directed Network Metrics ──
  const nIds5=sN.map(n=>n.id);const N5=nIds5.length;
  const inDeg5={},outDeg5={};nIds5.forEach(id=>{inDeg5[id]=0;outDeg5[id]=0});
  sE.forEach(e=>{outDeg5[e.from]++;inDeg5[e.to]++});
  const maxInDeg5=Math.max(0,...nIds5.map(id=>inDeg5[id]));
  const maxOutDeg5=Math.max(0,...nIds5.map(id=>outDeg5[id]));
  const avgDeg5=N5>0?((sE.length*2)/N5):0;
  const density5=N5>1?(sE.length/(N5*(N5-1))):0;
  const etCounts5={};sE.forEach(e=>{etCounts5[e.type]=(etCounts5[e.type]||0)+1});
  // BFS shortest paths (directed)
  const adjOut5={};nIds5.forEach(id=>{adjOut5[id]=[]});sE.forEach(e=>{adjOut5[e.from].push(e.to)});
  const distMap5={};nIds5.forEach(src=>{const d={};d[src]=0;const q=[src];while(q.length){const cur=q.shift();(adjOut5[cur]||[]).forEach(nb=>{if(d[nb]===undefined){d[nb]=d[cur]+1;q.push(nb)}})}distMap5[src]=d});
  let maxDist5=0,totalDist5=0,pathCount5=0;
  nIds5.forEach(s5=>{nIds5.forEach(t5=>{if(s5!==t5&&distMap5[s5][t5]!==undefined){const dd=distMap5[s5][t5];if(dd>maxDist5)maxDist5=dd;totalDist5+=dd;pathCount5++}})});
  const diameter5=maxDist5;const avgPathLen5=pathCount5>0?(totalDist5/pathCount5):0;const longestPath5=Math.max(0,nL3-1);
  // Betweenness centrality (Brandes' algorithm)
  const between5={};nIds5.forEach(id=>{between5[id]=0});
  nIds5.forEach(src=>{const S5=[],P5={},sig5={},dd5={};nIds5.forEach(id=>{P5[id]=[];sig5[id]=0;dd5[id]=-1});sig5[src]=1;dd5[src]=0;const Q5=[src];while(Q5.length){const v=Q5.shift();S5.push(v);(adjOut5[v]||[]).forEach(w=>{if(dd5[w]<0){Q5.push(w);dd5[w]=dd5[v]+1}if(dd5[w]===dd5[v]+1){sig5[w]+=sig5[v];P5[w].push(v)}})}const del5={};nIds5.forEach(id=>{del5[id]=0});while(S5.length){const w=S5.pop();P5[w].forEach(v=>{if(sig5[w]>0)del5[v]+=sig5[v]/sig5[w]*(1+del5[w])});if(w!==src)between5[w]+=del5[w]}});
  const betNorm5=N5>2?((N5-1)*(N5-2)):1;
  // Closeness centrality
  const close5={};nIds5.forEach(v=>{let td=0,rc=0;nIds5.forEach(t5=>{if(v!==t5&&distMap5[v][t5]!==undefined){td+=distMap5[v][t5];rc++}});close5[v]=td>0?(rc/td):0});
  // Degree centrality
  const degCent5={};nIds5.forEach(id=>{degCent5[id]=N5>1?((inDeg5[id]+outDeg5[id])/(N5-1)):0});
  const focusNids5=[...new Set([ce.from,ce.to])];
  const maxInDegNode5=nIds5.reduce((a,b)=>inDeg5[a]>=inDeg5[b]?a:b,nIds5[0]);
  const maxOutDegNode5=nIds5.reduce((a,b)=>outDeg5[a]>=outDeg5[b]?a:b,nIds5[0]);
  // Source nodes (no incoming) and Sink nodes (no outgoing)
  const sourceNodes5=nIds5.filter(id=>inDeg5[id]===0);
  const sinkNodes5=nIds5.filter(id=>outDeg5[id]===0);
  // Longest path(s) in DAG using DP on topological order — track ALL predecessors
  const lpDist5={},lpPrev5={};nIds5.forEach(id=>{lpDist5[id]=0;lpPrev5[id]=[]});
  tp4.forEach(nid=>{(dg3[nid]||[]).forEach(to=>{const nd2=lpDist5[nid]+1;if(nd2>lpDist5[to]){lpDist5[to]=nd2;lpPrev5[to]=[nid]}else if(nd2===lpDist5[to]&&!lpPrev5[to].includes(nid)){lpPrev5[to].push(nid)}})});
  const maxLpDist5=Math.max(0,...Object.values(lpDist5));
  const lpEndpoints5=nIds5.filter(id=>lpDist5[id]===maxLpDist5&&maxLpDist5>0);
  const longestPaths5r=[];const _buildLp=(nid,suffix)=>{if(longestPaths5r.length>=20)return;if(!lpPrev5[nid].length){longestPaths5r.push([nid,...suffix]);return}lpPrev5[nid].forEach(prev=>_buildLp(prev,[nid,...suffix]))};
  lpEndpoints5.forEach(end=>{if(longestPaths5r.length<20)_buildLp(end,[])});
  // Eigenvector centrality (power iteration, based on in-links)
  const eigen5={};nIds5.forEach(id=>{eigen5[id]=1.0/Math.max(N5,1)});
  const adjIn5={};nIds5.forEach(id=>{adjIn5[id]=[]});sE.forEach(e=>{adjIn5[e.to].push(e.from)});
  for(let iter=0;iter<100;iter++){const nx5={};let nm=0;nIds5.forEach(id=>{let s=0;adjIn5[id].forEach(fr=>{s+=eigen5[fr]});nx5[id]=s;nm+=s*s});nm=Math.sqrt(nm)||1;nIds5.forEach(id=>{nx5[id]/=nm});let df=0;nIds5.forEach(id=>{df+=Math.abs(nx5[id]-eigen5[id])});nIds5.forEach(id=>{eigen5[id]=nx5[id]});if(df<1e-8)break}
  return(<div className="flex flex-col h-full bg-slate-50"><div className="flex items-center gap-3 px-4 py-2 bg-white border-b shadow-sm flex-shrink-0"><button onClick={()=>{setDetailId(null);setShowNav(false)}} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"><ChevronLeft size={16}/> Back</button><div className="text-sm font-bold text-gray-700 truncate flex-1">Event Analysis: <span className="text-teal-600">{fT3}</span> ⟫ <span className="text-teal-600">{tT3}</span></div><div className="flex items-center gap-1.5 flex-shrink-0"><button onClick={dlEv} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors" title="Download event graph"><Download size={14}/></button>{renderNavBtn()}</div></div>
  <div className="flex-1 overflow-auto p-4"><div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">📊 Hierarchical Event Graph <span className="text-[10px] font-normal text-gray-400 normal-case">· Sugiyama layout · {sN.length} events · {sE.length} connections{bkS.size>0?` · ${bkS.size} cycle edge${bkS.size>1?'s':''}`:''}  · {nL3} layer{nL3>1?'s':''}</span></div>
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 overflow-auto"><svg width={esvW} height={esvH} style={{fontFamily:'system-ui,sans-serif',display:'block'}}><defs dangerouslySetInnerHTML={{__html:mkDefs}}/>{lrs3.map((_,li)=>(<text key={'ly'+li} x={12} y={EPD+li*(EH+EVG)+EH/2+4} fontSize="10" fill="#94a3b8" fontWeight="600">L{li}</text>))}{sE.map(e=>renderEvEdge(e,false))}{sN.map(n=>renderEvNode(n,false))}</svg></div>
  <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-gray-400"><div className="flex items-center gap-1.5"><svg width="24" height="4"><line x1="0" y1="2" x2="24" y2="2" stroke="#0d9488" strokeWidth="2" strokeDasharray="6 4"/></svg><span>sequence</span></div><div className="flex items-center gap-1.5"><svg width="24" height="4"><line x1="0" y1="2" x2="24" y2="2" stroke="#dc2626" strokeWidth="2.5"/></svg><span>cause→effect</span></div><div className="flex items-center gap-1.5"><svg width="24" height="4"><line x1="0" y1="2" x2="24" y2="2" stroke="#b45309" strokeWidth="2.5"/></svg><span>action→goal</span></div><div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border-2 border-indigo-400 bg-indigo-50"/><span>highlighted (clicked)</span></div>{bkS.size>0&&<div className="flex items-center gap-1.5"><svg width="30" height="12"><path d="M 2 6 C 15 6, 15 1, 28 6" fill="none" stroke="#94a3b8" strokeWidth="1.5"/></svg><span>cycle (back edge)</span></div>}{longEdgeList.length>0&&<div className="flex items-center gap-1.5"><svg width="30" height="14"><path d="M 4 12 C -6 7, 22 5, 26 2" fill="none" stroke="#94a3b8" strokeWidth="1.5"/></svg><span>long edge (curved)</span></div>}</div>
  <div className="mt-4"><div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">📋 Event Connections ({sE.length})</div><div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">{sE.map(e=>{const fn4=nodes.find(n=>n.id===e.from),tn4=nodes.find(n=>n.id===e.to);const st=evSt(e.type);const hl=e.id===ce.id;const m=TYPE_META[e.type];return(<div key={e.id} className={'flex items-center gap-2 px-3 py-2 text-xs border-b border-gray-50 cursor-pointer '+(hl?'bg-indigo-50 font-bold':'hover:bg-gray-50')} onClick={()=>{setDetailType(e.type);setDetailId(e.id)}}><span className="text-sm flex-shrink-0">{m?.icon}</span><span className="font-bold uppercase flex-shrink-0" style={{color:st.stroke,minWidth:90}}>{st.lbl}</span><span className="text-gray-600 truncate">{fn4?.text?.trim()||'?'} → {tn4?.text?.trim()||'?'}</span>{bkS.has(e.id)&&<span className="text-[9px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-200 flex-shrink-0">cycle</span>}{hl&&<span className="text-[9px] text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full border border-indigo-200 flex-shrink-0">clicked</span>}</div>)})}</div></div></div>
<div className="bg-white border-t border-gray-200 flex-shrink-0"><button onClick={()=>setSlidersOpen(v=>!v)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"><span>📊 Directed Network Metrics</span>{slidersOpen?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>{slidersOpen&&<div className="px-4 pb-3 overflow-auto" style={{maxHeight:420}}><div className="flex flex-wrap gap-4"><div className="flex-1 min-w-[280px]"><div className="bg-teal-50 rounded-lg border border-teal-200 p-3 text-xs text-teal-900 leading-relaxed"><div className="font-bold mb-2 text-teal-700">🌐 Network-Level Metrics</div><div className="space-y-1"><div className="flex justify-between"><span className="text-gray-600">Nodes</span><strong>{N5}</strong></div><div className="flex justify-between"><span className="text-gray-600">Edges</span><strong>{sE.length}</strong></div>{Object.entries(etCounts5).map(([t,c])=>{const m=TYPE_META[t];return(<div key={t} className="flex justify-between pl-3"><span className="text-gray-500">{m?.icon||'•'} {t==='mean-goal'?'action→goal':t}</span><strong>{c}</strong></div>)})}<div className="border-t border-teal-200 my-1.5"/><div className="flex justify-between"><span className="text-gray-600">Layers</span><strong>{nL3}</strong></div><div className="flex justify-between"><span className="text-gray-600">Longest Path (DAG)</span><strong>{longestPath5}</strong></div><div className="flex justify-between"><span className="text-gray-600">Diameter</span><strong>{diameter5}</strong></div><div className="flex justify-between"><span className="text-gray-600">Avg Path Length</span><strong>{avgPathLen5.toFixed(2)}</strong></div><div className="border-t border-teal-200 my-1.5"/><div className="flex justify-between"><span className="text-gray-600">Density</span><strong>{(density5*100).toFixed(2)}%</strong></div><div className="flex justify-between"><span className="text-gray-600">Avg Degree</span><strong>{avgDeg5.toFixed(2)}</strong></div><div className="flex justify-between"><span className="text-gray-600">Max In-Degree</span><strong className="flex items-center gap-1">{maxInDeg5}<span className="text-gray-400 font-normal text-[10px]">({(nodes.find(n=>n.id===maxInDegNode5)?.text?.trim()||'?').slice(0,14)})</span></strong></div><div className="flex justify-between"><span className="text-gray-600">Max Out-Degree</span><strong className="flex items-center gap-1">{maxOutDeg5}<span className="text-gray-400 font-normal text-[10px]">({(nodes.find(n=>n.id===maxOutDegNode5)?.text?.trim()||'?').slice(0,14)})</span></strong></div>{bkS.size>0&&<><div className="border-t border-teal-200 my-1.5"/><div className="flex justify-between"><span className="text-gray-600">Cycle Edges</span><strong className="text-orange-600">{bkS.size}</strong></div></>}<div className="border-t border-teal-200 my-1.5"/><div><span className="text-gray-600 font-semibold">🟢 Source Nodes</span><span className="text-gray-400 text-[10px] ml-1">(in-degree = 0)</span>{sourceNodes5.length===0?<div className="text-gray-400 italic mt-0.5">none (cyclic network)</div>:<div className="flex flex-wrap gap-1 mt-0.5">{sourceNodes5.map(id=>{const nt=(nodes.find(n=>n.id===id)?.text?.trim()||'?');return(<span key={id} className="px-1.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded text-[10px] font-semibold">{nt.length>14?nt.slice(0,11)+'…':nt}</span>)})}</div>}</div><div className="mt-1"><span className="text-gray-600 font-semibold">🔴 Sink Nodes</span><span className="text-gray-400 text-[10px] ml-1">(out-degree = 0)</span>{sinkNodes5.length===0?<div className="text-gray-400 italic mt-0.5">none (cyclic network)</div>:<div className="flex flex-wrap gap-1 mt-0.5">{sinkNodes5.map(id=>{const nt=(nodes.find(n=>n.id===id)?.text?.trim()||'?');return(<span key={id} className="px-1.5 py-0.5 bg-rose-100 border border-rose-300 text-rose-700 rounded text-[10px] font-semibold">{nt.length>14?nt.slice(0,11)+'…':nt}</span>)})}</div>}</div>{longestPaths5r.length>0&&<><div className="border-t border-teal-200 my-1.5"/><div><span className="text-gray-600 font-semibold">🛤️ Longest Path{longestPaths5r.length>1?'s':''}</span><span className="text-gray-400 text-[10px] ml-1">({maxLpDist5} edge{maxLpDist5!==1?'s':''})</span>{longestPaths5r.map((path,pi)=>(<div key={pi} className="flex flex-wrap items-center gap-0.5 mt-1">{path.map((nid,ni)=>{const nt=(nodes.find(n=>n.id===nid)?.text?.trim()||'?');return(<React.Fragment key={nid}>{ni>0&&<span className="text-gray-400 text-[10px]">→</span>}<span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded text-[10px] font-semibold">{nt.length>12?nt.slice(0,9)+'…':nt}</span></React.Fragment>)})}</div>))}{longestPaths5r.length>=20&&<div className="text-[10px] text-gray-400 italic mt-0.5">Capped at 20 paths</div>}</div></>}</div></div></div><div className="flex-1 min-w-[280px]"><div className="bg-indigo-50 rounded-lg border border-indigo-200 p-3 text-xs text-indigo-900 leading-relaxed"><div className="font-bold mb-2 text-indigo-700">🔍 Node-Level Centralities — Focused Edge</div><div className="text-[10px] text-indigo-500 italic mb-2">Metrics for the two endpoint nodes of the clicked edge.</div>{focusNids5.map(nid=>{const nd5=nodes.find(n=>n.id===nid);const txt5=(nd5?.text?.trim()||'?');const isFrom5=nid===ce.from;return(<div key={nid} className="mb-3 last:mb-0 p-2 rounded-lg" style={{background:isFrom5?'rgba(13,148,136,0.06)':'rgba(79,70,229,0.06)'}}><div className="flex items-center gap-2 mb-1.5"><span className={'w-2.5 h-2.5 rounded-full flex-shrink-0 '+(isFrom5?'bg-teal-500':'bg-indigo-500')}/><span className="font-bold text-gray-700 truncate">{txt5.length>22?txt5.slice(0,19)+'…':txt5}</span><span className="text-[9px] text-gray-400 flex-shrink-0">({isFrom5?'from':'to'})</span></div><div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4"><div className="flex justify-between"><span className="text-gray-500">In-Degree</span><strong>{inDeg5[nid]}</strong></div><div className="flex justify-between"><span className="text-gray-500">Out-Degree</span><strong>{outDeg5[nid]}</strong></div><div className="flex justify-between"><span className="text-gray-500">Degree Centrality</span><strong>{degCent5[nid]?.toFixed(3)}</strong></div><div className="flex justify-between"><span className="text-gray-500">Betweenness</span><strong>{(between5[nid]/betNorm5).toFixed(3)}</strong></div><div className="flex justify-between"><span className="text-gray-500">Closeness</span><strong>{close5[nid]?.toFixed(3)}</strong></div><div className="flex justify-between"><span className="text-gray-500">Eigenvector</span><strong>{eigen5[nid]?.toFixed(3)}</strong></div><div className="flex justify-between"><span className="text-gray-500">Layer</span><strong>L{ly4[nid]}</strong></div></div></div>)})}<div className="mt-3 pt-2 border-t border-indigo-200"><div className="text-[10px] text-indigo-600 leading-relaxed space-y-1"><div><strong>Degree Centrality</strong> = (in + out) / (N−1). Measures direct connectivity.</div><div><strong>Betweenness Centrality</strong> = fraction of all shortest paths passing through node. Normalized by (N−1)(N−2). Identifies bottlenecks.</div><div><strong>Closeness Centrality</strong> = reachable nodes / sum of distances. Measures how quickly a node can reach others.</div><div><strong>Eigenvector Centrality</strong> = based on in-links; a node is important if pointed to by other important nodes. Source nodes (in-degree=0) will have value 0.</div></div></div></div></div></div></div>}</div>
</div>)
};

/* ── Simple detail ── */
const renderSimpleDetail=(tn,tc,ti,fl,tl,extra)=>{const edge=edges.find(e=>e.id===detailId);if(!edge)return null;const fn2=nodes.find(n=>n.id===edge.from),tn2=nodes.find(n=>n.id===edge.to);if(!fn2||!tn2)return null;const fT=fn2.text?.trim()||'?',tT=tn2.text?.trim()||'?';return(<div className="flex flex-col h-full bg-slate-50"><div className="flex items-center gap-3 px-4 py-2 bg-white border-b shadow-sm flex-shrink-0"><button onClick={()=>{setDetailId(null);setShowNav(false)}} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"><ChevronLeft size={16}/> Back</button><div className="text-sm font-bold text-gray-700 truncate flex-1">{tn}: <span style={{color:tc}}>{fT}</span> → <span style={{color:tc}}>{tT}</span></div><div className="flex items-center gap-1.5 flex-shrink-0">{renderNavBtn()}</div></div><div className="flex-1 overflow-auto p-4"><div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{maxWidth:600,borderColor:tc+'40'}}><div className="px-5 py-4" style={{background:'linear-gradient(135deg,'+tc+','+tc+'cc)'}}><div className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">{ti} {tn}</div></div><div className="p-5 space-y-4"><div className="flex items-start gap-3 p-3 rounded-xl border" style={{background:tc+'08',borderColor:tc+'30'}}><div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:tc}}>1</div><div className="min-w-0"><div className="text-xs font-medium uppercase" style={{color:tc+'99'}}>{fl}</div><div className="text-sm font-bold break-words" style={{color:tc}}>{fT}</div></div></div><div className="flex justify-center text-xl" style={{color:tc}}>↓</div><div className="flex items-start gap-3 p-3 rounded-xl border" style={{background:tc+'08',borderColor:tc+'30'}}><div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:tc}}>2</div><div className="min-w-0"><div className="text-xs font-medium uppercase" style={{color:tc+'99'}}>{tl}</div><div className="text-sm font-bold break-words" style={{color:tc}}>{tT}</div></div></div>{extra?.(edge,fn2,tn2)}</div></div></div></div>)};
const renderLinkDetail=()=>{const edge=edges.find(e=>e.id===detailId);if(!edge)return null;const fn2=nodes.find(n=>n.id===edge.from),tn2=nodes.find(n=>n.id===edge.to);if(!fn2||!tn2)return null;const fT=fn2.text?.trim()||'?',tT=tn2.text?.trim()||'?';const tc='#6b7280';return(<div className="flex flex-col h-full bg-slate-50"><div className="flex items-center gap-3 px-4 py-2 bg-white border-b shadow-sm flex-shrink-0"><button onClick={()=>{setDetailId(null);setShowNav(false)}} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"><ChevronLeft size={16}/> Back</button><div className="text-sm font-bold text-gray-700 truncate flex-1">Link: <span style={{color:tc}}>{fT}</span> — <span style={{color:tc}}>{tT}</span></div><div className="flex items-center gap-1.5 flex-shrink-0">{renderNavBtn()}</div></div><div className="flex-1 overflow-auto p-4"><div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{maxWidth:600,borderColor:tc+'40'}}><div className="px-5 py-4" style={{background:'linear-gradient(135deg,'+tc+','+tc+'cc)'}}><div className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">🔗 Link</div></div><div className="p-5 space-y-4"><div className="flex items-start gap-3 p-3 rounded-xl border" style={{background:tc+'08',borderColor:tc+'30'}}><div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:tc}}>1</div><div className="min-w-0"><div className="text-xs font-medium uppercase" style={{color:tc+'99'}}>From</div><div className="text-sm font-bold break-words" style={{color:tc}}>{fT}</div></div></div><div className="flex justify-center text-xl" style={{color:tc}}>↓</div><div className="flex items-start gap-3 p-3 rounded-xl border" style={{background:tc+'08',borderColor:tc+'30'}}><div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:tc}}>2</div><div className="min-w-0"><div className="text-xs font-medium uppercase" style={{color:tc+'99'}}>To</div><div className="text-sm font-bold break-words" style={{color:tc}}>{tT}</div></div></div><div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200"><div className="text-xs font-bold text-gray-500 uppercase mb-2">Custom Label</div><input type="text" value={edge.linkLabel||''} onChange={e=>setEdges(p=>p.map(x=>x.id===edge.id?{...x,linkLabel:e.target.value}:x))} placeholder="Enter custom label..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"/></div></div></div></div><div className="bg-white border-t border-gray-200 flex-shrink-0"><button onClick={()=>setSlidersOpen(v=>!v)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"><span>⚙️ Argumentation Scheme, Critical Questions & Backing</span>{slidersOpen?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>{slidersOpen&&<div className="px-4 pb-3 overflow-auto" style={{maxHeight:480}}><div className="mb-3"><label className="block text-xs font-bold text-gray-700 mb-1.5">📜 Argumentation Scheme</label><div className="text-[10px] text-gray-400 italic mb-1">Describe the argumentation scheme for this custom link connection.</div><textarea value={edge.linkScheme||''} onChange={e=>setEdges(p=>p.map(x=>x.id===edge.id?{...x,linkScheme:e.target.value}:x))} placeholder="Enter the argumentation scheme..." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"/></div><div className="border border-amber-200 rounded-xl overflow-hidden"><button onClick={()=>setCqsOpen(v=>!v)} className="w-full flex items-center justify-between px-3 py-2 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 transition-colors"><span>❓ Critical Questions</span>{cqsOpen?<ChevronDown size={12}/>:<ChevronUp size={12}/>}</button>{cqsOpen&&<div className="px-3 pb-3 bg-amber-50 border-t border-amber-200"><div className="text-[10px] text-amber-600 italic mb-1.5 mt-1">List the critical questions for evaluating this argument.</div><textarea value={edge.linkCQs||''} onChange={e=>setEdges(p=>p.map(x=>x.id===edge.id?{...x,linkCQs:e.target.value}:x))} placeholder="Enter critical questions..." rows={4} className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y bg-white"/><div className="mt-3 border border-indigo-200 rounded-xl overflow-hidden"><button onClick={()=>setLinkBackingOpen(v=>!v)} className="w-full flex items-center justify-between px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-800 transition-colors"><span>📋 Backing</span>{linkBackingOpen?<ChevronDown size={12}/>:<ChevronUp size={12}/>}</button>{linkBackingOpen&&<div className="px-3 pb-3 bg-indigo-50 border-t border-indigo-200"><div className="text-[10px] text-indigo-600 italic mb-1.5 mt-1">Provide the backing for this warrant or argumentation scheme.</div><textarea value={edge.linkBacking||''} onChange={e=>setEdges(p=>p.map(x=>x.id===edge.id?{...x,linkBacking:e.target.value}:x))} placeholder="Enter backing for the scheme..." rows={4} className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y bg-white"/></div>}</div></div>}</div></div>}</div></div>)};

/* ═══════════════════════════════════════════════════════
   ArgMap Canvas Panel Rendering
   ═══════════════════════════════════════════════════════ */
const renderArgMapPanel=()=>{
  const {edgeLines,targetedEdgeIds}=amEdgeGeometry;
  const linkEdgesArr=edgeLines.filter(e=>e.type==='link'&&!e.toEdge&&!e.fromEdge);
  const n2nEdges=edgeLines.filter(e=>!e.toEdge&&!e.fromEdge&&e.type!=='link');
  const e2eEdges=edgeLines.filter(e=>e.toEdge||e.fromEdge);
  const junctionEdgesArr=edgeLines.filter(e=>targetedEdgeIds.has(e.id));
  const amModes=[{mode:'select',Icon:MousePointer,label:'Select'},{mode:'connect',Icon:Link2,label:'Connect'},{mode:'delete',Icon:Trash2,label:'Delete'}];

  function renderAmEdge(edge){
    const s=AM_EDGE_STYLES[edge.type]||AM_EDGE_STYLES.support;
    const isLink=edge.type==='link',isHov=amHoveredEdgeId===edge.id;
    const isLinkToLink=isLink&&amLinkEdgeType==='link';
    const isEdgeSrc=amInteractionMode==='connect'&&amLinkFromNodeId===edge.id;
    const canBeSrc=amInteractionMode==='connect'&&!amLinkFromNodeId&&amLinkEdgeType==='link'&&!isLink;
    const isCT=amInteractionMode==='connect'&&amLinkFromNodeId&&isHov&&!isLinkToLink&&amLinkFromNodeId!==edge.id;
    const isDT=amInteractionMode==='delete'&&isHov;
    return <g key={edge.id}>
      <line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="transparent" strokeWidth={22} style={{pointerEvents:'stroke',cursor:amInteractionMode==='delete'?'pointer':(amInteractionMode==='connect'&&((amLinkFromNodeId&&!isLinkToLink)||canBeSrc))?'crosshair':'default'}} onMouseEnter={()=>setAmHoveredEdgeId(edge.id)} onMouseLeave={()=>setAmHoveredEdgeId(null)} onMouseDown={ev=>{if(canBeSrc){ev.preventDefault();ev.stopPropagation();amOnConnDragStartEdge(edge.id,ev)}}} onClick={ev=>{if(isLinkToLink&&amInteractionMode==='connect'&&!isEdgeSrc)return;amHandleEdgeClick(ev,edge.id)}} onMouseUp={()=>{if(!isLinkToLink)amOnConnDragEndEdge(edge.id)}}/>
      {isEdgeSrc&&<line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="#fbbf24" strokeWidth={5} strokeLinecap="round" opacity={0.5} style={{pointerEvents:'none'}}/>}
      {isLink?<><line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={isDT?'#ef4444':s.color} strokeWidth={isDT?4:3} strokeLinecap="round" style={{pointerEvents:'none'}}/><circle cx={edge.x1} cy={edge.y1} r={4} fill={isDT?'#ef4444':s.color} style={{pointerEvents:'none'}}/><circle cx={edge.x2} cy={edge.y2} r={4} fill={isDT?'#ef4444':s.color} style={{pointerEvents:'none'}}/></>
      :<line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={isDT?'#ef4444':isCT?AM_EDGE_STYLES[amLinkEdgeType].color:s.color} strokeWidth={isDT||isCT?4:2.5} strokeDasharray={s.dash||undefined} markerEnd={s.arrow?`url(#am-arr-${edge.type})`:undefined} style={{pointerEvents:'none'}}/>}
      {isDT&&<g style={{pointerEvents:'all',cursor:'pointer'}} onClick={ev=>{ev.stopPropagation();amDeleteEdge(edge.id)}}><circle cx={edge.mx} cy={edge.my} r={10} fill="#ef4444"/><line x1={edge.mx-4} y1={edge.my-4} x2={edge.mx+4} y2={edge.my+4} stroke="white" strokeWidth={2} strokeLinecap="round"/><line x1={edge.mx+4} y1={edge.my-4} x2={edge.mx-4} y2={edge.my+4} stroke="white" strokeWidth={2} strokeLinecap="round"/></g>}
      {isHov&&!isDT&&!isCT&&<g style={{pointerEvents:'none'}}><rect x={edge.mx-28} y={edge.my-11} width={56} height={22} rx={4} fill="white" stroke={s.color} strokeWidth={1} opacity={.95}/><text x={edge.mx} y={edge.my+3.5} textAnchor="middle" fill={s.color} fontSize={10} fontWeight={600}>{s.label}</text></g>}
    </g>;
  }

  function renderAmNode(node){
    const tc=AM_NODE_TYPES[node.type]||AM_NODE_TYPES.data;
    const IC=tc.Icon;
    const isSel=amSelectedNodeId===node.id,isLS=amLinkFromNodeId===node.id;
    const isDragSrc=amDragLine&&amDragConnRef.current.fromId===node.id;
    const wLabel=amIsWarrantType(node.type)?amGetWarrantTag(node):null;
    let cqWL=null;if(amIsCqType(node.type)){const lw=amCqWarrantMap[node.id];if(lw)cqWL=amGetWarrantTag(lw)}
    let cqLinkedCQ=null;if(amIsCqType(node.type)){cqLinkedCQ=amCqLinkedCqMap?.[node.id]||null}
    const hasCQM=amIsCqType(node.type)&&(cqWL||cqLinkedCQ||node.cqSchematic);
    const hasLP=amLinkGroupMap[node.id]&&amLinkGroupMap[node.id].size>0;
    const hasImg=node.text&&node.text.indexOf('<img')>=0;
    const isDual=node.type.startsWith('claim-')&&node.type!=='claim';
    return <motion.div key={node.id} initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:500,damping:30}}
      style={{position:'absolute',left:node.x,top:node.y,width:AM_NODE_WIDTH,zIndex:isSel?10:1,touchAction:'none'}}
      className="cursor-pointer"
      onMouseDown={e=>{amHandleNodeMouseDown(e,node.id);amOnConnDragStart(node.id,e)}}
      onClick={e=>amHandleNodeClick(e,node.id)}
      onDoubleClick={e=>{e.stopPropagation();amStartEditing(node.id)}}
      onMouseUp={()=>amOnConnDragEnd(node.id)}
      onTouchStart={e=>{
        if(e.touches.length!==1)return;
        e.preventDefault();e.stopPropagation();
        amTouchHandledRef.current=true;
        const now=Date.now();
        if(amDoubleTapRef.current.nodeId===node.id&&now-amDoubleTapRef.current.time<350){
          amStartEditing(node.id);amDoubleTapRef.current={time:0,nodeId:null};return}
        amDoubleTapRef.current={time:now,nodeId:node.id};
        if(amInteractionMode!=='select'){amHandleNodeClick(e,node.id);return}
        const n2=amCommittedNodes.find(x=>x.id===node.id);if(!n2)return;
        amDragInfoRef.current={id:node.id,mouseX:e.touches[0].clientX,mouseY:e.touches[0].clientY,nodeX:n2.x,nodeY:n2.y};
        amDidDragRef.current=false;setAmSelectedNodeId(node.id)}}
      onTouchEnd={e=>{
        if(amDragInfoRef.current&&amDragInfoRef.current.id===node.id&&!amDidDragRef.current){
          amTouchHandledRef.current=true}}}>
      <div ref={el=>{if(el)amNodeElsRef.current[node.id]=el}} className={"rounded-xl overflow-hidden border-2 shadow-md hover:shadow-lg transition-shadow "+(amInteractionMode==='delete'?"hover:border-red-400":"")} style={{borderColor:amInteractionMode==='delete'?undefined:tc.color,boxShadow:isDragSrc?'0 0 0 4px rgba(99,102,241,0.5)':isSel?`0 0 0 3px ${tc.color}55`:isLS?'0 0 0 3px #fbbf2488':undefined}}>
        <div className="px-2.5 py-1 flex items-center gap-1.5" style={{background:tc.color}}>
          {isDual?(()=>{const bk=node.type.replace('claim-','');const bTC=AM_NODE_TYPES[bk];const BI=bTC?.Icon;return<><Target size={11} color="white"/>{BI&&<BI size={11} color="white" style={{marginLeft:-4}}/>}</>})():<IC size={12} color="white"/>}
          <span className="text-white text-xs font-semibold truncate flex-1">{tc.label}</span>
          {hasImg&&<ImageIcon size={10} color="white" style={{opacity:.8}}/>}
          {hasLP&&<span title="Linked premise"><LinkIcon size={10} color="white"/></span>}
        </div>
        {wLabel&&<div className="px-2.5 py-0.5 text-xs font-medium truncate" style={{background:tc.color+'18',color:tc.color}}>{wLabel}</div>}
        {hasCQM&&<div className="px-2.5 py-1" style={{background:tc.color+'0D'}}>{cqWL&&<div className="text-xs font-semibold truncate" style={{color:tc.color}}>{cqWL}</div>}{cqLinkedCQ&&<div className="text-xs truncate" style={{color:'#a21caf'}}>↳ CQ: {(cqLinkedCQ.text||'').replace(/<[^>]*>/g,'').slice(0,40)}</div>}{node.cqSchematic&&<div className="text-xs italic break-words mt-0.5" style={{color:tc.color+'BB'}}>{node.cqSchematic}</div>}</div>}
        <div className="px-2.5 py-2 bg-white"><div className="rc text-xs text-gray-700 leading-relaxed break-words" dangerouslySetInnerHTML={{__html:node.text}}/></div>
      </div>
    </motion.div>;
  }

  return <>
    {/* ArgMap toolbar */}
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-b border-gray-200 flex-shrink-0" style={{zIndex:10}}>
      <button onClick={amHistory.undo} disabled={!amHistory.canUndo} title="Undo" className={"p-1.5 rounded-lg "+(amHistory.canUndo?"hover:bg-gray-100 text-gray-600":"text-gray-300 cursor-not-allowed")}><Undo2 size={15}/></button>
      <button onClick={amHistory.redo} disabled={!amHistory.canRedo} title="Redo" className={"p-1.5 rounded-lg "+(amHistory.canRedo?"hover:bg-gray-100 text-gray-600":"text-gray-300 cursor-not-allowed")}><Redo2 size={15}/></button>
      <div className="w-px h-5 bg-gray-200"/>
      <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">{amModes.map(({mode,Icon:MI,label})=><button key={mode} onClick={()=>{setAmInteractionMode(mode);setAmLinkFromNodeId(null)}} className={"flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all "+(amInteractionMode===mode?"bg-white shadow text-blue-600":"text-gray-500 hover:text-gray-700")}><MI size={12}/><span className="hidden sm:inline">{label}</span></button>)}</div>
      <div className="w-px h-5 bg-gray-200"/>
      <button onClick={amClearAll} className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-gray-500 hover:text-red-600 hover:bg-red-50"><RotateCcw size={12}/><span className="hidden sm:inline">Clear</span></button>
      <div className="flex-1"/>
      <button onClick={amZoomOut2} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"><ZoomOut size={14}/></button>
      <button onClick={amZoomReset} className="px-2 py-1 rounded-lg hover:bg-gray-100 text-xs font-semibold text-gray-600 min-w-8 text-center">{Math.round(amZoomLevel*100)}%</button>
      <button onClick={amZoomIn2} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"><ZoomIn size={14}/></button>
      <button onClick={amZoomFit} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"><Maximize size={14}/></button>
      <div className="w-px h-5 bg-gray-200"/>
      <button onClick={amDlCanvas} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" title="Download Image"><Download size={14}/></button>
    </div>
    {/* ArgMap connect sub-toolbar */}
    {amInteractionMode==='connect'&&<div className="px-3 py-1 flex flex-wrap items-center justify-center gap-2 text-xs border-b flex-shrink-0" style={{background:'#dbeafe',borderColor:'#bfdbfe'}}><span className="font-medium text-blue-700">{amLinkFromNodeId?"Source selected — click target":"Click source node, or drag from source to target"}</span><div className="flex gap-1 flex-wrap">{Object.entries(AM_EDGE_STYLES).map(([t,c])=><button key={t} onClick={()=>setAmLinkEdgeType(t)} className={"px-2 py-0.5 rounded text-xs font-medium transition-all "+(amLinkEdgeType===t?"shadow":"opacity-50 hover:opacity-80")} style={{background:amLinkEdgeType===t?c.color+'22':'transparent',color:c.color,border:`1.5px solid ${c.color}`}}>{c.label}</button>)}</div></div>}
    {amInteractionMode==='delete'&&<div className="px-3 py-1 text-xs text-center font-medium border-b flex-shrink-0" style={{background:'#fee2e2',color:'#b91c1c',borderColor:'#fecaca'}}>Click any node or hover edges to delete</div>}
    {/* ArgMap canvas */}
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 overflow-auto" ref={amScrollRef} style={{touchAction:'pan-x pan-y pinch-zoom'}} onClick={()=>{setAmSelectedNodeId(null);setAmLinkFromNodeId(null)}}>
        <div style={{width:amCanvasW*amZoomLevel,height:amCanvasH*amZoomLevel,position:'relative',transformOrigin:'0 0'}}>
          <div style={{width:amCanvasW,height:amCanvasH,position:'absolute',top:0,left:0,transform:`scale(${amZoomLevel})`,transformOrigin:'0 0',backgroundImage:'radial-gradient(circle,#d1d5db 1px,transparent 1px)',backgroundSize:'24px 24px'}}>
            <svg style={{position:'absolute',top:0,left:0,width:amCanvasW,height:amCanvasH,pointerEvents:'none'}}>
              <defs>{Object.entries(AM_EDGE_STYLES).filter(([,c])=>c.arrow).map(([t,c])=><marker key={t} id={`am-arr-${t}`} viewBox="0 0 10 6" refX="9" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,3 L0,6z" fill={c.color}/></marker>)}</defs>
              {linkEdgesArr.map(renderAmEdge)}
              {n2nEdges.map(renderAmEdge)}
              {junctionEdgesArr.map(e=>{const s=AM_EDGE_STYLES[e.type]||AM_EDGE_STYLES.support;return <circle key={`j-${e.id}`} cx={e.mx} cy={e.my} r={AM_JUNCTION_RADIUS} fill="white" stroke={s.color} strokeWidth={2.5} style={{pointerEvents:'none'}}/>})}
              {e2eEdges.map(renderAmEdge)}
              {amDragLine&&amInteractionMode==='connect'&&(()=>{const dcc=AM_EDGE_STYLES[amLinkEdgeType]?.color||'#059669';return <g><defs><marker id="am-drag-arr" viewBox="0 0 10 6" refX="9" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,3 L0,6z" fill={dcc}/></marker></defs><line x1={amDragLine.x1} y1={amDragLine.y1} x2={amDragLine.x2} y2={amDragLine.y2} stroke={dcc} strokeWidth={2.5} strokeDasharray="8 4" strokeLinecap="round" markerEnd="url(#am-drag-arr)"/><circle cx={amDragLine.x1} cy={amDragLine.y1} r={6} fill={dcc} opacity={0.4}/></g>})()}
            </svg>
            {amNodes.map(renderAmNode)}
            {!amNodes.length&&<div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-center"><Layers size={48} className="mx-auto text-gray-300 mb-3"/><p className="text-sm font-medium text-gray-400">ArgMap Canvas</p><p className="text-xs text-gray-300 mt-1">Add nodes from the left panel or load a scheme</p></div></div>}
          </div>
        </div>
      </div>
    </div>
  </>;
};

const renderDetail=()=>{switch(detailType){case'cause':return renderCauseDetail();case'source':return renderSourceDetail();case'analogy':return renderVennDetail(false);case'comparison':return renderVennDetail(true);case'mean-goal':return renderActionGoalDetail();case'description':return renderDescriptionDetail();case'sequence':return renderEventDetail();case'link':return renderLinkDetail();default:return renderSimpleDetail(detailType,TYPE_META[detailType]?.color||'#6b7280',TYPE_META[detailType]?.icon||'•','From','To')}};

// Define the logo component (put above renderHelp or in a separate file)
const KeystoneLogo = ({ width = 120, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={width * 1799 / 2185}
    viewBox="0 0 2185 1799"
    className={className}
  >
    <g>
      <path d="M0 0 C721.05 0 1442.1 0 2185 0 C2185 593.67 2185 1187.34 2185 1799 C1463.95 1799 742.9 1799 0 1799 C0 1205.33 0 611.66 0 0 Z " fill="rgb(247,249,253)" transform="translate(0,0)"/>
<path d="M0 0 C191.4 0 382.8 0 580 0 C577.75015981 6.74952056 577.75015981 6.74952056 576.23510742 10.07641602 C575.72694237 11.19829315 575.72694237 11.19829315 575.20851135 12.34283447 C574.84450729 13.13848816 574.48050323 13.93414185 574.10546875 14.75390625 C573.72184677 15.59894714 573.33822479 16.44398804 572.94297791 17.31463623 C572.120776 19.12494998 571.2972339 20.93465554 570.47247314 22.74380493 C568.7363513 26.55213205 567.00669382 30.36338297 565.27667236 34.17448425 C564.40749957 36.08903413 563.53799284 38.00343244 562.66815186 39.91767883 C559.12998188 47.70539844 555.61865185 55.50470915 552.125 63.3125 C551.60921387 64.46459961 551.09342773 65.61669922 550.56201172 66.80371094 C549.54321092 69.07996799 548.52465158 71.35633313 547.50634766 73.6328125 C544.94404447 79.36041146 542.37842682 85.0865237 539.8125 90.8125 C539.29518311 91.96766113 538.77786621 93.12282227 538.24487305 94.31298828 C535.35273053 100.76706003 532.45235366 107.21731354 529.54151917 113.66297913 C527.9095311 117.27681119 526.2789593 120.8912818 524.64828491 124.50570679 C523.84993661 126.2739854 523.05082073 128.04191769 522.25088501 129.80947876 C521.12237945 132.30311825 519.99651526 134.79793617 518.87109375 137.29296875 C518.53929108 138.02421967 518.2074884 138.75547058 517.8656311 139.50888062 C515.41183071 144.95840077 513.22546687 150.43633283 511 156 C565.45 156 619.9 156 676 156 C674.69094295 162.54528523 673.36968982 168.42082242 671.171875 174.62109375 C670.76464203 175.7974514 670.76464203 175.7974514 670.34918213 176.99757385 C669.48890442 179.4797277 668.62004987 181.95875657 667.75 184.4375 C666.6161397 187.68493561 665.48648646 190.93380997 664.359375 194.18359375 C664.07944702 194.98864349 663.79951904 195.79369324 663.5111084 196.62313843 C661.25293976 203.16091664 659.14981754 209.74170473 657.14154053 216.36045837 C655.65682762 221.18222144 653.89159956 225.82270533 651.98791504 230.49385071 C650.41987039 234.47167658 649.11940691 238.52559826 647.8203125 242.59765625 C647.22285736 244.44752215 646.62536214 246.29737511 646.02783203 248.1472168 C645.71831604 249.10977386 645.40880005 250.07233093 645.08990479 251.0640564 C639.91178478 267.15507496 634.62308305 283.20301875 629.125 299.1875 C623.71379464 314.93264784 618.39229609 330.70610615 613.125 346.5 C612.6015097 348.0668605 612.6015097 348.0668605 612.06744385 349.66537476 C608.94726005 359.0073767 605.83229494 368.34972971 602.85449219 377.73828125 C602.50063446 378.85352173 602.14677673 379.96876221 601.78219604 381.11779785 C601.11197358 383.23700592 600.44514514 385.35729186 599.78250122 387.47888184 C599.47641937 388.44813599 599.17033752 389.41739014 598.85498047 390.41601562 C598.46123734 391.67460388 598.46123734 391.67460388 598.05953979 392.95861816 C597.14233943 395.59141831 596.14208244 398.15334333 595.09362793 400.73548889 C593.08766642 405.70567645 591.3313745 410.72933724 589.64697266 415.81616211 C589.18239655 417.20704292 589.18239655 417.20704292 588.70843506 418.62602234 C587.69071597 421.67549552 586.67731173 424.72638274 585.6640625 427.77734375 C584.94125001 429.94697785 584.21821271 432.11653707 583.4949646 434.286026 C581.97508987 438.84721274 580.45722449 443.40906139 578.94091797 447.97143555 C577.04365662 453.6798815 575.14262267 459.38706112 573.24019241 465.09378624 C565.3082072 488.89037727 557.42489398 512.70168706 549.69619751 536.56517029 C548.13686488 541.37876795 546.57190674 546.19049331 545 551 C544.70664009 551.89760418 544.41328018 552.79520836 544.11103058 553.72001266 C543.1959962 556.51250273 542.27576294 559.30322902 541.35400391 562.09350586 C541.0781011 562.93612504 540.8021983 563.77874422 540.5179348 564.64689732 C539.13672824 568.8103829 537.66428507 572.90398102 536.0124054 576.96824646 C533.94697892 582.0524042 532.17280027 587.20655674 530.44750977 592.41455078 C530.11667892 593.40514496 529.78584808 594.39573914 529.44499207 595.41635132 C528.35753493 598.67503708 527.27439258 601.93513845 526.19140625 605.1953125 C525.42135746 607.50665492 524.65108424 609.81792258 523.88059998 612.12911987 C522.26237224 616.98536564 520.64615461 621.84227404 519.03149414 626.69970703 C517.00418122 632.7983558 514.97307274 638.89573113 512.94056129 644.99264908 C503.41089727 673.5526166 503.41089727 673.5526166 494.04638672 702.16699219 C493.58998826 703.5764187 493.58998826 703.5764187 493.12436962 705.01431847 C491.72396874 709.34311372 490.3285665 713.67343436 488.9410553 718.00637817 C488.45543439 719.51451265 487.96979416 721.0226409 487.48413086 722.53076172 C487.27425726 723.1919891 487.06438366 723.85321648 486.84815025 724.53448105 C485.45523088 728.84891372 483.80243079 732.79432815 482 737 C355.28 737 228.56 737 98 737 C95.86615855 732.02103661 93.99003736 727.18144704 92.35424805 722.04589844 C92.10316347 721.26807762 91.8520789 720.49025681 91.5933857 719.68886566 C91.04325054 717.9845134 90.49445908 716.27972697 89.94684792 714.57456207 C88.39982246 709.76098984 86.83939494 704.95176795 85.27880859 700.14257812 C84.94059617 699.10007023 84.60238375 698.05756233 84.25392246 696.98346329 C79.96559848 683.7866506 75.5882173 670.6193378 71.20703125 657.453125 C70.99605222 656.81909697 70.78507319 656.18506893 70.56770086 655.53182793 C67.97793203 647.75007998 65.38507998 639.96936136 62.79134738 632.18893385 C61.00737047 626.83664072 59.22680517 621.48321675 57.44687444 616.12957692 C55.70178178 610.88121997 53.95437485 605.63363731 52.20516604 600.3866508 C51.17268849 597.28947081 50.14139357 594.1919063 49.1119175 591.09372711 C47.97695133 587.67904204 46.83819991 584.26564203 45.69848633 580.85253906 C45.36658798 579.85122452 45.03468964 578.84990997 44.69273376 577.81825256 C42.99988653 572.7624661 41.14984012 567.8777181 39 563 C38.49762166 561.61825411 38.01502887 560.22891962 37.56469727 558.8293457 C37.20269981 557.71309563 37.20269981 557.71309563 36.83338928 556.57429504 C36.58028488 555.78278549 36.32718048 554.99127594 36.06640625 554.17578125 C35.78836655 553.3166362 35.51032684 552.45749115 35.22386169 551.5723114 C34.33361152 548.82003983 33.44772303 546.06639215 32.5625 543.3125 C26.99854067 526.03885454 21.28719734 508.81710155 15.53755188 491.60463715 C12.52875685 482.59427482 9.53549769 473.57876035 6.54137993 464.5635128 C4.63837212 458.83511899 2.73307243 453.1074871 0.82781887 447.3798399 C-0.79724548 442.49405553 -2.42112515 437.60788284 -4.04272461 432.72094727 C-5.64896877 427.8804831 -7.25814614 423.04100315 -8.86935234 418.20218849 C-9.47360934 416.38575025 -10.07681833 414.56896299 -10.67891121 412.75180626 C-11.51238847 410.23683492 -12.34962581 407.72314465 -13.18774414 405.2097168 C-13.42927719 404.47792709 -13.67081024 403.74613739 -13.91966248 402.99217224 C-15.40597224 398.55094871 -17.13059037 394.29368676 -19 390 C-19.50237834 388.61825411 -19.98497113 387.22891962 -20.43530273 385.8293457 C-20.79803284 384.71090523 -20.79803284 384.71090523 -21.16809082 383.56987 C-21.42070679 382.77982071 -21.67332275 381.98977142 -21.93359375 381.17578125 C-22.34405945 379.90677727 -22.34405945 379.90677727 -22.76281738 378.61213684 C-23.35055916 376.79437652 -23.93689222 374.97616022 -24.52194214 373.15753174 C-26.09042812 368.28357174 -27.67066241 363.41342109 -29.25 358.54296875 C-29.56903793 357.5583667 -29.88807587 356.57376465 -30.21678162 355.55932617 C-33.07963681 346.73306214 -35.9947379 337.92490236 -38.9375 329.125 C-39.17580536 328.41203766 -39.41411072 327.69907532 -39.65963745 326.96450806 C-40.64677987 324.011596 -41.6343458 321.05882627 -42.62266541 318.10630798 C-45.60196871 309.20559715 -48.56795211 300.30045089 -51.53494263 291.39562988 C-52.49471318 288.51586297 -53.4551375 285.63631493 -54.41577148 282.75683594 C-57.41155818 273.77586775 -60.40182277 264.79316806 -63.375 255.8046875 C-69.54878243 237.07042281 -69.54878243 237.07042281 -76.27490234 218.52978516 C-80.94025655 206.06730676 -84.80319675 193.29648034 -88.85760498 180.62547302 C-90.03694319 176.94935735 -91.23586587 173.28186814 -92.47949219 169.62695312 C-92.83018265 168.59365875 -92.83018265 168.59365875 -93.18795776 167.53948975 C-93.82550945 165.66914334 -94.46894672 163.80080611 -95.11279297 161.93261719 C-96 159 -96 159 -96 156 C-41.55 156 12.9 156 69 156 C63.82733171 143.93044065 58.67227626 131.91859159 53.17120361 120.00601196 C51.43163641 116.23756131 49.70215621 112.46448541 47.97265625 108.69140625 C47.62893982 107.94177109 47.28522339 107.19213593 46.93109131 106.41978455 C43.94808382 99.90503411 41.02327555 93.36538818 38.125 86.8125 C33.5347629 76.43471108 28.89719154 66.07915681 24.23696899 55.7326355 C23.07119372 53.14430238 21.90600565 50.55570568 20.7409668 47.96704102 C17.48263885 40.72815905 14.22284084 33.48996796 10.95210266 26.25668335 C9.72849508 23.54937694 8.50738575 20.84094875 7.28683472 18.13226318 C6.45866119 16.29689662 5.6269593 14.46312345 4.79516602 12.62939453 C4.05931274 10.99526611 4.05931274 10.99526611 3.30859375 9.328125 C2.88376709 8.3887207 2.45894043 7.44931641 2.02124023 6.48144531 C1 4 1 4 0 0 Z " fill="#032D61" transform="translate(815,118)"/>
<path d="M0 0 C0.99 0.33 1.98 0.66 3 1 C4.02734375 3.58984375 4.02734375 3.58984375 4.9375 6.9375 C6.0056145 10.81692886 7.18744008 14.53875 8.73046875 18.25 C11.68234012 25.49240585 14.04039254 32.93904239 16.48587036 40.36358643 C18.02140648 45.02463818 19.56696848 49.68235789 21.11328125 54.33984375 C21.43165451 55.29910767 21.75002777 56.25837158 22.07804871 57.2467041 C26.06658155 69.2409385 30.1737808 81.19471842 34.29248047 93.14477539 C37.26282893 101.78376884 40.11695101 110.436253 42.74194336 119.18701172 C43.66890673 122.13437306 44.77401039 124.97729651 45.93969727 127.83837891 C47.97021422 132.83484844 49.67689108 137.89397082 51.3125 143.03125 C51.60809814 143.94781372 51.90369629 144.86437744 52.20825195 145.80871582 C53.45619693 149.67859747 54.69600122 153.55107367 55.93652344 157.42333984 C56.85067003 160.27273381 57.76900228 163.1207562 58.6875 165.96875 C58.96053955 166.82633911 59.2335791 167.68392822 59.51489258 168.56750488 C61.15721182 173.6581991 63.01598714 178.60740074 65.03363037 183.56051636 C66.54348029 187.37195049 67.82580471 191.2497124 69.1015625 195.14453125 C69.3829306 195.99383713 69.66429871 196.84314301 69.95419312 197.71818542 C70.84738028 200.41533613 71.7365449 203.11378721 72.625 205.8125 C76.54423429 217.69831883 80.5221141 229.56017989 84.6171875 241.38671875 C88.64101839 253.0111245 92.60212762 264.65574661 96.53125 276.3125 C96.81417278 277.15172689 97.09709557 277.99095379 97.38859177 278.8556118 C99.72077734 285.77454942 102.05046695 292.6943269 104.38006592 299.61413574 C106.40848251 305.63897659 108.43799716 311.6634462 110.46875 317.6875 C110.74980968 318.52148001 111.03086937 319.35546001 111.32044601 320.21471214 C115.00514933 331.14443952 118.73198698 342.05846456 122.5078125 352.95703125 C126.14590293 363.45923872 129.63819211 373.99273482 132.97509766 384.59399414 C135.12105416 391.39527784 137.34749003 398.08923362 140.06689453 404.68334961 C141.62297558 408.54668114 142.93835527 412.48583566 144.25 416.4375 C144.518125 417.22576172 144.78625 418.01402344 145.0625 418.82617188 C145.44148437 419.9621582 145.44148437 419.9621582 145.828125 421.12109375 C146.0540332 421.7958374 146.27994141 422.47058105 146.51269531 423.16577148 C147 425 147 425 147 428 C146.40276123 428.25056152 145.80552246 428.50112305 145.19018555 428.75927734 C132.32420451 434.1841723 119.79200896 439.92604684 107.53857422 446.62109375 C104.77677091 448.12125389 102.00088422 449.59299376 99.22265625 451.0625 C67.41268172 467.96315281 36.75777217 487.7640399 8.81738281 510.53417969 C6.39663061 512.48665097 3.93980299 514.39059161 1.48168945 516.2956543 C-4.93491518 521.27334691 -11.0189829 526.50166148 -17 532 C-18.3292238 533.17134665 -19.66238407 534.33824593 -21 535.5 C-28.46891832 542.02405516 -35.75206133 548.63145469 -42.67578125 555.73828125 C-45 558 -45 558 -47.5703125 560.02734375 C-50.60861179 562.49413015 -52.83767599 565.33267077 -55.25390625 568.390625 C-57 570 -57 570 -61 570 C-62.76416016 568.76586914 -62.76416016 568.76586914 -64.5390625 567.03515625 C-65.19672607 566.40456299 -65.85438965 565.77396973 -66.53198242 565.12426758 C-67.56802612 564.10369263 -67.56802612 564.10369263 -68.625 563.0625 C-70.0709243 561.67115728 -71.51753655 560.28052914 -72.96484375 558.890625 C-74.01067627 557.87838867 -74.01067627 557.87838867 -75.07763672 556.84570312 C-77.40143252 554.61457583 -79.7807059 552.45363478 -82.1875 550.3125 C-86.51541933 546.44854522 -90.78254568 542.52300126 -95.04150391 538.58349609 C-98.70728896 535.19283299 -102.38030088 531.81033155 -106.0625 528.4375 C-106.79895752 527.76291748 -106.79895752 527.76291748 -107.55029297 527.07470703 C-108.53884515 526.16937398 -109.52745177 525.26410037 -110.51611328 524.35888672 C-113.01164407 522.07357504 -115.50574527 519.7867042 -118 517.5 C-118.99999325 516.58332596 -119.99999324 515.6666593 -121 514.75 C-139 498.25 -139 498.25 -140.50048828 496.87451172 C-141.49880661 495.95941367 -142.49717886 495.04437445 -143.49560547 494.12939453 C-146.0217842 491.81421148 -148.54696832 489.4979599 -151.0703125 487.1796875 C-155.67349765 482.95233249 -160.28413776 478.73473917 -164.9375 474.5625 C-169.90512383 470.10356085 -174.80683252 465.57561669 -179.70703125 461.04296875 C-182.81782841 458.16605238 -185.93798345 455.29950383 -189.0625 452.4375 C-189.79895752 451.76291748 -189.79895752 451.76291748 -190.55029297 451.07470703 C-191.53884515 450.16937398 -192.52745177 449.26410037 -193.51611328 448.35888672 C-196.01164407 446.07357504 -198.50574527 443.7867042 -201 441.5 C-201.99999325 440.58332596 -202.99999324 439.6666593 -204 438.75 C-222 422.25 -222 422.25 -223.50048828 420.87451172 C-224.49880661 419.95941367 -225.49717886 419.04437445 -226.49560547 418.12939453 C-229.0217842 415.81421148 -231.54696832 413.4979599 -234.0703125 411.1796875 C-238.67349765 406.95233249 -243.28413776 402.73473917 -247.9375 398.5625 C-252.90512383 394.10356085 -257.80683252 389.57561669 -262.70703125 385.04296875 C-265.81782841 382.16605238 -268.93798345 379.29950383 -272.0625 376.4375 C-272.79895752 375.76291748 -272.79895752 375.76291748 -273.55029297 375.07470703 C-274.53884515 374.16937398 -275.52745177 373.26410037 -276.51611328 372.35888672 C-279.01164407 370.07357504 -281.50574527 367.7867042 -284 365.5 C-284.99999325 364.58332596 -285.99999324 363.6666593 -287 362.75 C-305 346.25 -305 346.25 -306.50048828 344.87451172 C-307.49880661 343.95941367 -308.49717886 343.04437445 -309.49560547 342.12939453 C-312.0217842 339.81421148 -314.54696832 337.4979599 -317.0703125 335.1796875 C-321.67349765 330.95233249 -326.28413776 326.73473917 -330.9375 322.5625 C-335.90512383 318.10356085 -340.80683252 313.57561669 -345.70703125 309.04296875 C-348.81782841 306.16605238 -351.93798345 303.29950383 -355.0625 300.4375 C-355.55347168 299.98777832 -356.04444336 299.53805664 -356.55029297 299.07470703 C-357.53884515 298.16937398 -358.52745177 297.26410037 -359.51611328 296.35888672 C-361.51116439 294.5318952 -363.50529029 292.70389578 -365.49926758 290.87573242 C-366.49500951 289.96292849 -367.49093873 289.05032882 -368.48706055 288.13793945 C-371.06556588 285.77582401 -373.64074982 283.41022778 -376.2109375 281.0390625 C-376.74074219 280.55115234 -377.27054687 280.06324219 -377.81640625 279.56054688 C-379.28210404 278.21056207 -380.74656294 276.85923255 -382.2109375 275.5078125 C-385.08341613 272.92499558 -388.01775348 270.45441528 -391 268 C-389.67810416 265.0984802 -388.22797838 262.94439418 -386.04296875 260.62890625 C-385.43517578 259.98228027 -384.82738281 259.3356543 -384.20117188 258.66943359 C-383.53666016 257.97414551 -382.87214844 257.27885742 -382.1875 256.5625 C-381.14625977 255.46542725 -381.14625977 255.46542725 -380.08398438 254.34619141 C-374.13347021 248.11275402 -368.08216247 241.97976674 -362 235.875 C-361.12883545 234.9991626 -360.2576709 234.1233252 -359.36010742 233.22094727 C-354.92874398 228.80062507 -350.42711012 224.54034838 -345.6796875 220.46142578 C-343.68893781 218.72935781 -341.83249249 216.89793865 -340 215 C-336.87154036 211.82910002 -333.63144648 208.8743004 -330.25390625 205.97265625 C-328.04015714 204.0351462 -325.87757752 202.0485561 -323.72119141 200.04760742 C-318.51116531 195.21493915 -313.17626231 190.62879735 -307.63671875 186.171875 C-305.07579972 184.06243651 -302.62876545 181.87112352 -300.1875 179.625 C-295.8122041 175.64244719 -291.25270734 171.9818193 -286.58129883 168.35888672 C-282.78487785 165.41224454 -279.04190563 162.41206051 -275.33105469 159.35839844 C-247.42268252 136.41027614 -217.53651572 115.29132263 -187 96 C-186.1445459 95.45585449 -185.2890918 94.91170898 -184.40771484 94.35107422 C-159.50561263 78.52342969 -134.10245138 63.75853655 -108 50 C-106.99179199 49.46503906 -105.98358398 48.93007813 -104.94482422 48.37890625 C-93.48304859 42.29767877 -81.95163595 36.45110544 -70.19140625 30.96875 C-66.50990586 29.25077198 -62.87558447 27.45800925 -59.25 25.625 C-55.2142989 23.58755867 -51.17447959 21.73280285 -47 20 C-45.5399668 19.3580188 -44.08175084 18.71189495 -42.625 18.0625 C-41.85800781 17.72089844 -41.09101562 17.37929688 -40.30078125 17.02734375 C-38.83935612 16.37478889 -37.37836682 15.72125642 -35.91796875 15.06640625 C-33.61521961 14.03679114 -31.30837185 13.0169504 -29 12 C-27.948125 11.53464844 -26.89625 11.06929688 -25.8125 10.58984375 C-18.51269547 7.40432637 -11.19879125 4.56318146 -3.66796875 1.98046875 C-1.11374704 1.25367955 -1.11374704 1.25367955 0 0 Z " fill="#156082" transform="translate(699,379)"/>
<path d="M0 0 C4.99980749 1.62099895 9.9185429 3.29440142 14.75 5.375 C19.06959917 7.21207091 23.41472158 8.9215379 27.8125 10.5625 C32.53838634 12.3593507 36.67556104 14.40533663 41 17 C42.66443011 17.73619024 44.32999293 18.47062805 46.01147461 19.16699219 C54.06401401 22.54025977 61.89687702 26.38003021 69.6875 30.3125 C71.62883441 31.28920531 73.57024104 32.26576707 75.51171875 33.2421875 C76.45063965 33.71495117 77.38956055 34.18771484 78.35693359 34.67480469 C80.63535393 35.81717173 82.9185964 36.9481907 85.20703125 38.0703125 C109.7398193 50.12139714 133.73407062 63.65929404 157 78 C157.8667334 78.53318848 158.7334668 79.06637695 159.62646484 79.61572266 C173.95457795 88.4492505 188.06289518 97.56287786 202 107 C202.80775879 107.54366211 203.61551758 108.08732422 204.44775391 108.64746094 C215.69546072 116.21868869 226.70295286 124.06703656 237.56445312 132.18212891 C240.06449761 134.04814046 242.57096083 135.90528722 245.078125 137.76171875 C255.01291494 145.13935707 264.74882876 152.70563964 274.28808594 160.58789062 C276.74377591 162.61351966 279.2170999 164.61735497 281.6875 166.625 C286.21919564 170.33460393 290.69208405 174.11005469 295.15161133 177.90576172 C298.68464242 180.90728418 302.26436698 183.84170929 305.875 186.75 C309.58808307 189.76990258 313.01743718 192.8997936 316.34375 196.3359375 C318.68472612 198.68795596 321.19359606 200.82309853 323.703125 202.9921875 C330.93935465 209.31773519 337.98432778 215.82934657 344.671875 222.734375 C346.63182786 224.64171168 348.62848091 226.42380335 350.69921875 228.20703125 C355.35670968 232.25217842 359.71301562 236.56588084 364.0625 240.9375 C364.82626953 241.69740234 365.59003906 242.45730469 366.37695312 243.24023438 C370.58794472 247.45843041 374.63042935 251.75716349 378.48999023 256.30004883 C379.91396296 257.90314051 381.41007106 259.31485492 383 260.75 C385 263 385 263 384.98828125 264.79296875 C383.49462267 268.12860945 380.88338712 270.19552955 378.1875 272.5625 C376.99348744 273.63671637 375.79947707 274.71093517 374.60546875 275.78515625 C373.69740479 276.59364014 373.69740479 276.59364014 372.77099609 277.41845703 C370.15659031 279.75318554 367.57969683 282.12695446 365 284.5 C364.0131472 285.40378383 363.02616684 286.3074284 362.0390625 287.2109375 C359.36671264 289.66044646 356.70409147 292.12033693 354.04296875 294.58203125 C348.92542769 299.31605635 343.77703261 304.01055653 338.5859375 308.6640625 C334.45666055 312.39413443 330.37789794 316.17854657 326.29296875 319.95703125 C321.70429271 324.20071432 317.09368397 328.42040541 312.48388672 332.64111328 C309.98835593 334.92642496 307.49425473 337.2132958 305 339.5 C304.00000675 340.41667404 303.00000676 341.3333407 302 342.25 C301.505 342.70375 301.01 343.1575 300.5 343.625 C298.25 345.6875 298.25 345.6875 296 347.75 C295.50483887 348.20391113 295.00967773 348.65782227 294.49951172 349.12548828 C293.50119339 350.04058633 292.50282114 350.95562555 291.50439453 351.87060547 C288.9782158 354.18578852 286.45303168 356.5020401 283.9296875 358.8203125 C279.36970022 363.00787779 274.80264097 367.18557229 270.1875 371.3125 C265.90562185 375.15308958 261.69831526 379.06870802 257.5 383 C252.52965499 387.65421872 247.52531694 392.26165874 242.44921875 396.80078125 C238.11123675 400.69597083 233.82547426 404.6484373 229.53222656 408.59277344 C227.02322888 410.89708552 224.51149532 413.19841091 222 415.5 C220.99998648 416.41665192 219.99998649 417.3333186 219 418.25 C213 423.75 207 429.25 201 434.75 C200.50483887 435.20391113 200.00967773 435.65782227 199.49951172 436.12548828 C198.50119339 437.04058633 197.50282114 437.95562555 196.50439453 438.87060547 C193.9782158 441.18578852 191.45303168 443.5020401 188.9296875 445.8203125 C184.32650235 450.04766751 179.71586224 454.26526083 175.0625 458.4375 C168.98331877 463.89516749 162.99451992 469.44977571 157 475 C150.23337682 481.2651016 143.45265291 487.50846325 136.5859375 493.6640625 C132.45666055 497.39413443 128.37789794 501.17854657 124.29296875 504.95703125 C119.70429271 509.20071432 115.09368397 513.42040541 110.48388672 517.64111328 C107.98835593 519.92642496 105.49425473 522.2132958 103 524.5 C102.00000675 525.41667404 101.00000676 526.3333407 100 527.25 C99.505 527.70375 99.01 528.1575 98.5 528.625 C97 530 95.5 531.375 94 532.75 C93.50483887 533.20391113 93.00967773 533.65782227 92.49951172 534.12548828 C91.50119339 535.04058633 90.50282114 535.95562555 89.50439453 536.87060547 C86.9782158 539.18578852 84.45303168 541.5020401 81.9296875 543.8203125 C72.69652523 552.30010759 63.38098418 560.68400678 54 569 C50.56029691 566.2046217 47.40162877 563.48401416 44.5625 560.0625 C42.57597382 557.68835895 40.82681429 555.90970585 38.5 553.9375 C34.67992877 550.69295739 31.19256435 547.19976588 27.6875 543.625 C22.94620461 538.8126842 18.04589191 534.43903186 12.7421875 530.2421875 C9.73125057 527.78025331 6.89579055 525.16064621 4.0625 522.5 C-0.6816802 518.07433906 -5.64184433 514.13069603 -10.88671875 510.30078125 C-13.6281382 508.2748138 -16.3001763 506.19244617 -18.96240234 504.06542969 C-26.79184752 497.81162434 -34.90417992 492.01742864 -43.13183594 486.30126953 C-45.55709165 484.61195786 -47.9645151 482.89779643 -50.375 481.1875 C-60.43336175 474.17355878 -70.98154616 467.87867597 -81.46972656 461.53417969 C-83.17989527 460.49725378 -84.88752004 459.45612237 -86.59277344 458.41113281 C-98.64672891 451.03125075 -110.84338524 444.48747346 -123.65625 438.5234375 C-130.58580914 435.28914756 -137.30533298 431.69105654 -144 428 C-143.43856943 422.87663874 -142.272278 418.66226909 -140.3515625 413.8359375 C-137.93961646 407.6283795 -135.75051957 401.37866384 -133.7109375 395.0390625 C-133.29995819 393.76298126 -133.29995819 393.76298126 -132.88067627 392.46112061 C-132.04260602 389.84998057 -131.20818994 387.23770109 -130.375 384.625 C-129.26196333 381.13667392 -128.14401778 377.64997154 -127.0234375 374.1640625 C-126.65610001 373.00434433 -126.65610001 373.00434433 -126.28134155 371.82119751 C-125.00345204 367.84610585 -123.60894166 363.96204478 -122.03173828 360.09521484 C-119.92305634 354.90926769 -118.17165999 349.6433689 -116.46875 344.3125 C-116.15095581 343.32934814 -115.83316162 342.34619629 -115.5057373 341.33325195 C-114.500537 338.22321676 -113.49970504 335.11180562 -112.5 332 C-111.18106974 327.89453444 -109.85753509 323.79059469 -108.53125 319.6875 C-108.08888 318.30268433 -108.08888 318.30268433 -107.63757324 316.88989258 C-105.94526663 311.65601824 -104.0490516 306.56456899 -101.9720459 301.47216797 C-100.35703895 297.36478122 -99.02597381 293.1727584 -97.6875 288.96875 C-97.39190186 288.05218628 -97.09630371 287.13562256 -96.79174805 286.19128418 C-95.85784422 283.29524519 -94.92834916 280.39782398 -94 277.5 C-92.77486705 273.67577112 -91.54506915 269.8530878 -90.3125 266.03125 C-90.03946045 265.17366089 -89.7664209 264.31607178 -89.48510742 263.43249512 C-87.84828759 258.35884739 -85.99045298 253.43157511 -83.97973633 248.49523926 C-82.36370631 244.37945684 -81.02846653 240.18058778 -79.6875 235.96875 C-79.39190186 235.05218628 -79.09630371 234.13562256 -78.79174805 233.19128418 C-77.85784422 230.29524519 -76.92834916 227.39782398 -76 224.5 C-74.77486705 220.67577112 -73.54506915 216.8530878 -72.3125 213.03125 C-72.03946045 212.17366089 -71.7664209 211.31607178 -71.48510742 210.43249512 C-70.13139292 206.23638854 -68.67906989 202.12423724 -67.01367188 198.04101562 C-64.90906699 192.87390854 -63.16587941 187.62527311 -61.46875 182.3125 C-61.15095581 181.32934814 -60.83316162 180.34619629 -60.5057373 179.33325195 C-59.500537 176.22321676 -58.49970504 173.11180562 -57.5 170 C-56.18106974 165.89453444 -54.85753509 161.79059469 -53.53125 157.6875 C-53.23633667 156.76428955 -52.94142334 155.8410791 -52.63757324 154.88989258 C-50.94526663 149.65601824 -49.0490516 144.56456899 -46.9720459 139.47216797 C-45.35703895 135.36478122 -44.02597381 131.1727584 -42.6875 126.96875 C-42.39190186 126.05218628 -42.09630371 125.13562256 -41.79174805 124.19128418 C-40.85784422 121.29524519 -39.92834916 118.39782398 -39 115.5 C-37.77486705 111.67577112 -36.54506915 107.8530878 -35.3125 104.03125 C-35.03946045 103.17366089 -34.7664209 102.31607178 -34.48510742 101.43249512 C-33.13139292 97.23638854 -31.67906989 93.12423724 -30.01367188 89.04101562 C-27.90906699 83.87390854 -26.16587941 78.62527311 -24.46875 73.3125 C-24.15095581 72.32934814 -23.83316162 71.34619629 -23.5057373 70.33325195 C-22.500537 67.22321676 -21.49970504 64.11180562 -20.5 61 C-19.18106974 56.89453444 -17.85753509 52.79059469 -16.53125 48.6875 C-16.08888 47.30268433 -16.08888 47.30268433 -15.63757324 45.88989258 C-13.92648098 40.59791902 -12.01455744 35.44222026 -9.91381836 30.29302979 C-8.68248297 27.20325959 -7.64767774 24.0676917 -6.640625 20.8984375 C-6.24746094 19.66738281 -5.85429688 18.43632812 -5.44921875 17.16796875 C-5.05347656 15.91628906 -4.65773438 14.66460937 -4.25 13.375 C-3.83497209 12.07150734 -3.41960962 10.76812115 -3.00390625 9.46484375 C-1.99932389 6.31092238 -0.99810387 3.15597633 0 0 Z " fill="#156082" transform="translate(1507,383)"/>
<path d="M0 0 C4.13782214 0.51248256 5.95085585 2.67430982 8.75 5.625 C12.2976891 9.28113375 15.88902326 12.72630565 19.75390625 16.0390625 C22.63655094 18.55573665 25.44300113 21.14954303 28.25 23.75 C28.80719727 24.26602783 29.36439453 24.78205566 29.93847656 25.3137207 C31.07152232 26.36320515 32.20449747 27.41276582 33.33740234 28.46240234 C35.90513176 30.83708074 38.4831282 33.20048145 41.0625 35.5625 C41.79871582 36.23684082 41.79871582 36.23684082 42.54980469 36.92480469 C43.53851282 37.83030793 44.52728217 38.73574434 45.51611328 39.64111328 C48.01164407 41.92642496 50.50574527 44.2132958 53 46.5 C53.99999325 47.41667404 54.99999324 48.3333407 56 49.25 C86 76.75 86 76.75 87.50048828 78.12548828 C88.49880661 79.04058633 89.49717886 79.95562555 90.49560547 80.87060547 C93.0217842 83.18578852 95.54696832 85.5020401 98.0703125 87.8203125 C102.67349765 92.04766751 107.28413776 96.26526083 111.9375 100.4375 C116.90512383 104.89643915 121.80683252 109.42438331 126.70703125 113.95703125 C129.81782841 116.83394762 132.93798345 119.70049617 136.0625 122.5625 C136.55347168 123.01222168 137.04444336 123.46194336 137.55029297 123.92529297 C138.53884515 124.83062602 139.52745177 125.73589963 140.51611328 126.64111328 C143.01164407 128.92642496 145.50574527 131.2132958 148 133.5 C148.99999325 134.41667404 149.99999324 135.3333407 151 136.25 C169 152.75 169 152.75 170.50048828 154.12548828 C171.49880661 155.04058633 172.49717886 155.95562555 173.49560547 156.87060547 C176.0217842 159.18578852 178.54696832 161.5020401 181.0703125 163.8203125 C185.67349765 168.04766751 190.28413776 172.26526083 194.9375 176.4375 C199.90512383 180.89643915 204.80683252 185.42438331 209.70703125 189.95703125 C212.81782841 192.83394762 215.93798345 195.70049617 219.0625 198.5625 C219.55347168 199.01222168 220.04444336 199.46194336 220.55029297 199.92529297 C221.53884515 200.83062602 222.52745177 201.73589963 223.51611328 202.64111328 C226.01164407 204.92642496 228.50574527 207.2132958 231 209.5 C231.99999325 210.41667404 232.99999324 211.3333407 234 212.25 C264 239.75 264 239.75 265.50048828 241.12548828 C266.49880661 242.04058633 267.49717886 242.95562555 268.49560547 243.87060547 C271.0217842 246.18578852 273.54696832 248.5020401 276.0703125 250.8203125 C280.67349765 255.04766751 285.28413776 259.26526083 289.9375 263.4375 C294.90512383 267.89643915 299.80683252 272.42438331 304.70703125 276.95703125 C307.32483727 279.37802131 309.94831422 281.79267296 312.57739258 284.20141602 C314.05070013 285.55168555 315.52145502 286.90473862 316.9921875 288.2578125 C319.10268556 290.19231933 321.23607174 292.09800448 323.3828125 293.9921875 C323.93573975 294.48517334 324.48866699 294.97815918 325.05834961 295.48608398 C326.11802355 296.43015136 327.18367308 297.36756815 328.25610352 298.29711914 C330.27828743 300.10856624 331.83835814 301.64697417 332.9765625 304.1328125 C333.01459195 307.16249164 330.9300881 308.67326217 328.98046875 310.796875 C299.972879 343.06567306 277.33707496 384.18681985 257.9375 422.75 C257.61785278 423.38143921 257.29820557 424.01287842 256.96887207 424.66345215 C253.49481691 431.54465874 250.34616497 438.40899696 247.82543945 445.703125 C246.82476119 448.48762104 245.54581535 451.03221267 244.125 453.625 C241.25379997 459.18613744 239.15296317 464.85001817 237.18017578 470.77392578 C235.96447643 474.39686515 234.63802693 477.88906582 233.05078125 481.3671875 C230.81587411 486.2859976 229.05167614 491.32606511 227.3125 496.4375 C226.70556105 498.20742051 226.09754202 499.97697113 225.48828125 501.74609375 C225.22571533 502.51622803 224.96314941 503.2863623 224.69262695 504.07983398 C224 506 224 506 223 508 C213.73949251 506.67980834 204.75625713 504.57857577 195.70263672 502.27856445 C193.40072425 501.69403224 191.0970546 501.11691408 188.79296875 500.54101562 C182.19309588 498.88289387 175.60919258 497.18988861 169.06472778 495.3240509 C159.69029891 492.65439504 150.24655227 490.29034568 140.78125 487.96875 C140.04738697 487.78874262 139.31352394 487.60873524 138.55742264 487.42327309 C133.205868 486.11174449 127.85305708 484.80538058 122.5 483.5 C116.40542058 482.01379398 110.31134501 480.5255727 104.21875 479.03125 C103.48276077 478.85078125 102.74677155 478.6703125 101.98847961 478.484375 C93.58504965 476.42038079 85.21402651 474.28788719 76.89575195 471.90075684 C69.52916798 469.81383323 62.09194572 468.00856499 54.65625 466.1875 C53.96487442 466.01813431 53.27349884 465.84876862 52.56117249 465.67427063 C47.5417081 464.44570802 42.52098245 463.22234129 37.5 462 C31.78041137 460.60758539 26.06133271 459.21313141 20.34375 457.8125 C19.65072281 457.64277176 18.95769562 457.47304352 18.2436676 457.298172 C10.84002933 455.48171308 3.45320532 453.634256 -3.875 451.53125 C-12.26792782 449.12452263 -20.74017829 447.04774407 -29.21875 444.96875 C-30.32146492 444.69828857 -30.32146492 444.69828857 -31.44645691 444.42236328 C-36.79671906 443.11114057 -42.14823325 441.80506593 -47.5 440.5 C-53.59457942 439.01379398 -59.68865664 437.5255794 -65.78125 436.03125 C-66.5179039 435.85061508 -67.2545578 435.66998016 -68.01353455 435.48387146 C-76.37096217 433.43113646 -84.69575052 431.31048723 -92.96801758 428.93481445 C-100.66906311 426.75452314 -108.44638154 424.87461263 -116.21875 422.96875 C-116.95407455 422.78839706 -117.68939911 422.60804413 -118.44700623 422.42222595 C-123.79708523 421.11104885 -129.14841662 419.80502121 -134.5 418.5 C-170.1979264 409.79480981 -170.1979264 409.79480981 -183.28222656 406.05517578 C-189.36925072 404.32756097 -195.49655386 402.76130165 -201.625 401.1875 C-202.8315625 400.87619141 -204.038125 400.56488281 -205.28125 400.24414062 C-208.18712146 399.49461029 -211.09336447 398.74656069 -214 398 C-212.90178975 391.15226601 -210.98255817 384.63711655 -209 378 C-208.71334473 377.03513672 -208.71334473 377.03513672 -208.42089844 376.05078125 C-205.96783113 367.84385823 -203.24107846 359.79932859 -200.16503906 351.80493164 C-198.2003101 346.65990886 -196.55316328 341.46190626 -195.0546875 336.16015625 C-194.19220301 333.57589717 -193.22872752 331.22102996 -192.1015625 328.75 C-189.53358665 323.09559448 -187.6078311 317.25846401 -185.64453125 311.37304688 C-184.0433665 306.67460643 -182.23237191 302.29865366 -179.94189453 297.89672852 C-178.43516136 294.86256315 -177.3213302 291.6864678 -176.1875 288.5 C-171.93080926 276.86403966 -166.77503482 265.65546181 -161.57519531 254.41577148 C-160.08326605 251.18056033 -158.60611034 247.93904176 -157.1328125 244.6953125 C-145.71437933 219.67763171 -133.14695667 195.35740907 -119.43457031 171.51806641 C-117.65364891 168.39205834 -115.92809099 165.23775975 -114.20507812 162.07958984 C-108.69906865 152.00680509 -102.71256304 142.26192975 -96.59960938 132.54785156 C-95.11372397 130.18113909 -93.64072933 127.80699405 -92.171875 125.4296875 C-79.77633891 105.46018948 -66.43231038 86.0437526 -52.52832031 67.09765625 C-50.92676835 64.89948781 -49.34789179 62.68639767 -47.7734375 60.46875 C-42.05061312 52.42449925 -36.17266667 44.59269719 -29.88378906 36.98144531 C-25.87623044 32.12255257 -22.04188296 27.15348708 -18.25 22.125 C-13.99653461 16.49522657 -9.63533199 11.13011807 -4.8046875 5.98046875 C-3.06250366 4.06859168 -1.51540571 2.09427186 0 0 Z " fill="#156082" transform="translate(273,684)"/>
<path d="M0 0 C1.875 1.94921875 1.875 1.94921875 4 4.6875 C4.79921875 5.69941406 5.5984375 6.71132813 6.421875 7.75390625 C7.05512695 8.55852295 7.05512695 8.55852295 7.70117188 9.37939453 C9.38555488 11.48107392 11.1405007 13.5202976 12.90014648 15.55908203 C19.38476671 23.08166371 25.4120334 30.9266848 31.38574219 38.85791016 C32.94229008 40.92342001 34.50557789 42.98365725 36.0703125 45.04296875 C42.7354322 53.84097008 49.15618059 62.79294592 55.48242188 71.83691406 C57.02788184 74.03974149 58.58270135 76.23565996 60.140625 78.4296875 C65.89460132 86.53506999 71.55564528 94.68196433 77 103 C77.46486816 103.70431152 77.92973633 104.40862305 78.40869141 105.13427734 C86.13157384 116.8367214 93.52560347 128.69331738 100.66699219 140.75878906 C101.85170171 142.75066331 103.04955299 144.73329301 104.2578125 146.7109375 C115.32410669 164.84595401 125.40430716 183.53813441 135.1171875 202.42578125 C136.7554217 205.60958935 138.40671759 208.7809131 140.1328125 211.91796875 C146.50696585 223.5061262 151.92155435 235.54687112 157.4230957 247.56616211 C158.49529456 249.90096268 159.57483883 252.23240105 160.66088867 254.56079102 C161.19174072 255.69959717 161.72259277 256.83840332 162.26953125 258.01171875 C162.74495361 259.02709717 163.22037598 260.04247559 163.71020508 261.08862305 C164.96461348 263.92012413 166.0435488 266.76399999 167.0625 269.6875 C168.30243757 273.23823032 169.70633112 276.53631717 171.4375 279.875 C173.80189133 284.46806232 175.6713157 289.14066769 177.48046875 293.9765625 C178.67691418 297.17319789 179.92046793 300.34946444 181.17578125 303.5234375 C188.65120706 322.42814405 188.65120706 322.42814405 191.1484375 330.5 C192.00627792 333.13756406 192.00627792 333.13756406 193.3828125 336.1328125 C195.47044579 340.91896743 196.95229534 345.89395925 198.5 350.875 C199.09314987 352.76841727 199.68689341 354.66164868 200.28125 356.5546875 C200.56943604 357.47378906 200.85762207 358.39289063 201.15454102 359.33984375 C202.16781014 362.52799863 203.22895143 365.69863522 204.29443359 368.86962891 C205.6610879 372.9960737 206.92197773 377.15590861 208.19335938 381.3125 C209.07864303 384.17648975 209.97281126 386.94020226 211.21484375 389.671875 C212.165263 392.49003357 211.80664237 394.1767517 211 397 C209.93523438 397.24234375 208.87046875 397.4846875 207.7734375 397.734375 C200.98655199 399.29579196 194.23694342 400.87686474 187.5625 402.875 C180.85328124 404.84829964 174.0699012 406.39496128 167.25 407.9375 C159.845438 409.61427096 152.48272412 411.33254017 145.1875 413.4375 C133.63604463 416.76718174 121.91675226 419.43605415 110.22607422 422.22607422 C105.07492624 423.46181957 99.93698708 424.74650434 94.80078125 426.04296875 C91.94577325 426.76185566 89.08926223 427.4722611 86.23046875 428.17578125 C78.30659848 430.13112132 70.41124505 432.13589045 62.5625 434.375 C53.32071302 437.00673911 43.98049252 439.21628416 34.62719727 441.41357422 C27.4497083 443.11302507 20.36852123 445.01984593 13.28613281 447.07836914 C8.64376489 448.38037055 3.96196205 449.42304902 -0.75 450.4375 C-7.41117625 451.91094514 -14.00669542 453.48674361 -20.5625 455.375 C-29.75954771 458.02373269 -39.05725085 460.22533111 -48.37329102 462.41357422 C-54.32431518 463.8228226 -60.22136532 465.32151193 -66.09375 467.03125 C-73.61692348 469.21788906 -81.21150985 470.93686555 -88.859375 472.62304688 C-95.95293834 474.21822932 -102.94547463 476.06091203 -109.94158936 478.03063965 C-118.59455049 480.46255165 -127.29267868 482.70942248 -136 484.9375 C-136.84251312 485.15377045 -137.68502625 485.37004089 -138.55307007 485.59286499 C-150.15379938 488.56769505 -161.77375477 491.38892923 -173.45751953 494.02099609 C-180.19589451 495.5494114 -186.84818251 497.27210645 -193.4921875 499.16601562 C-199.24365995 500.80395815 -205.01703323 502.33764349 -210.8125 503.8125 C-211.65538574 504.03172119 -212.49827148 504.25094238 -213.36669922 504.47680664 C-217.32199488 505.47306532 -220.88419528 506.29219709 -225 506 C-225.32613281 505.0821875 -225.65226562 504.164375 -225.98828125 503.21875 C-228.2762814 496.79345165 -230.56682974 490.37201519 -233 484 C-233.32226562 483.14277344 -233.64453125 482.28554687 -233.9765625 481.40234375 C-236.73137801 474.14050014 -239.62701239 466.94044387 -242.5625 459.75 C-242.93842285 458.82751465 -243.3143457 457.9050293 -243.70166016 456.95458984 C-247.98605544 446.49976456 -252.71081848 436.29869102 -257.625 426.125 C-257.93369019 425.48582642 -258.24238037 424.84665283 -258.5604248 424.18811035 C-272.97928917 394.37771734 -289.57635841 366.08635147 -308.6171875 338.97265625 C-310.09655597 336.86225772 -311.56405076 334.74387404 -313.03125 332.625 C-318.15885197 325.25250592 -323.3686196 318.06925385 -329.16015625 311.19921875 C-330.84893718 309.18056978 -332.44226396 307.12065623 -334 305 C-332.6374818 301.91625125 -331.12774154 299.92531716 -328.65625 297.64453125 C-327.65996582 296.71785645 -327.65996582 296.71785645 -326.64355469 295.77246094 C-325.58249512 294.80228027 -325.58249512 294.80228027 -324.5 293.8125 C-323.77458008 293.1412207 -323.04916016 292.46994141 -322.30175781 291.77832031 C-317.70694151 287.53553448 -313.07895217 283.32969976 -308.4140625 279.1640625 C-305.63278338 276.67081229 -302.87655249 274.15092871 -300.125 271.625 C-299.62194336 271.16319336 -299.11888672 270.70138672 -298.60058594 270.22558594 C-297.5776935 269.28624821 -296.55490759 268.34679446 -295.53222656 267.40722656 C-293.02322888 265.10291448 -290.51149532 262.80158909 -288 260.5 C-286.99998648 259.58334808 -285.99998649 258.6666814 -285 257.75 C-283 255.91666667 -281 254.08333333 -279 252.25 C-278.2572583 251.5691333 -278.2572583 251.5691333 -277.49951172 250.87451172 C-276.50119339 249.95941367 -275.50282114 249.04437445 -274.50439453 248.12939453 C-271.9782158 245.81421148 -269.45303168 243.4979599 -266.9296875 241.1796875 C-262.32650235 236.95233249 -257.71586224 232.73473917 -253.0625 228.5625 C-246.98331877 223.10483251 -240.99451992 217.55022429 -235 212 C-228.23337682 205.7348984 -221.45265291 199.49153675 -214.5859375 193.3359375 C-210.45666055 189.60586557 -206.37789794 185.82145343 -202.29296875 182.04296875 C-197.7073279 177.80209267 -193.09955083 173.58545151 -188.49267578 169.36767578 C-186.97185124 167.97420848 -185.45252676 166.57912249 -183.93359375 165.18359375 C-179.32926052 160.95476524 -174.71723405 156.73596914 -170.0625 152.5625 C-163.98331877 147.10483251 -157.99451992 141.55022429 -152 136 C-145.23337682 129.7348984 -138.45265291 123.49153675 -131.5859375 117.3359375 C-127.45666055 113.60586557 -123.37789794 109.82145343 -119.29296875 106.04296875 C-114.7073279 101.80209267 -110.09955083 97.58545151 -105.49267578 93.36767578 C-103.97185124 91.97420848 -102.45252676 90.57912249 -100.93359375 89.18359375 C-96.32926052 84.95476524 -91.71723405 80.73596914 -87.0625 76.5625 C-80.98331877 71.10483251 -74.99451992 65.55022429 -69 60 C-62.23337682 53.7348984 -55.45265291 47.49153675 -48.5859375 41.3359375 C-44.45666055 37.60586557 -40.37789794 33.82145343 -36.29296875 30.04296875 C-32.20376941 26.26120995 -28.0970494 22.49875647 -23.98828125 18.73828125 C-21.91916897 16.84415832 -19.85471215 14.94510939 -17.79296875 13.04296875 C-17.2626001 12.55449463 -16.73223145 12.06602051 -16.18579102 11.56274414 C-14.71941319 10.21197001 -13.25419762 8.85993445 -11.7890625 7.5078125 C-10.86867188 6.68023438 -9.94828125 5.85265625 -9 5 C-8.47889648 4.52788086 -7.95779297 4.05576172 -7.42089844 3.56933594 C-3.34989898 0 -3.34989898 0 0 0 Z " fill="#156082" transform="translate(1928,686)"/>
<path d="M0 0 C6.90476254 28.04828511 13.57292976 56.30291779 17.44140625 84.95703125 C18.04789007 89.43649947 18.73484995 93.90357138 19.41040039 98.37304688 C27.17026862 149.92818807 30.37322674 201.12533553 30.31567383 253.22680664 C30.31103 257.78582593 30.31803197 262.34457921 30.33618164 266.90356445 C30.43702013 292.46890083 30.1000035 317.72639228 27.38679504 343.16070557 C26.814527 348.84098908 26.37835897 354.53014194 25.94281006 360.22225952 C24.85047379 374.4720557 23.28571865 388.64163439 21.4375 402.8125 C21.33149475 403.63690582 21.2254895 404.46131165 21.11627197 405.31069946 C20.81283505 407.65220832 20.50015698 409.99226458 20.18359375 412.33203125 C20.04930717 413.36559753 20.04930717 413.36559753 19.91230774 414.42004395 C19.34818041 418.46941524 18.4093229 422.16365438 17 426 C10.31589884 425.29725101 3.86542009 423.97754239 -2.6875 422.5 C-3.84378906 422.24154297 -5.00007813 421.98308594 -6.19140625 421.71679688 C-17.12443498 419.24712424 -28.0093486 416.58559215 -38.89398193 413.91195679 C-50.09706769 411.1611672 -61.31977462 408.55493913 -72.59155273 406.09765625 C-80.77945822 404.30154323 -88.90560284 402.30831448 -97.03027344 400.24707031 C-111.18990963 396.66641914 -125.43887208 393.46468561 -139.69140625 390.27734375 C-142.33605438 389.6854165 -144.98058564 389.09297073 -147.625 388.5 C-148.61083069 388.27899628 -148.61083069 388.27899628 -149.61657715 388.05352783 C-159.19040919 385.90320027 -168.71988486 383.61033542 -178.23071289 381.19702148 C-192.32314802 377.63223485 -206.506269 374.44961342 -220.69140625 371.27734375 C-223.33605438 370.6854165 -225.98058564 370.09297073 -228.625 369.5 C-229.61083069 369.27899628 -229.61083069 369.27899628 -230.61657715 369.05352783 C-240.19040919 366.90320027 -249.71988486 364.61033542 -259.23071289 362.19702148 C-273.32314907 358.63223458 -287.50627344 355.44963705 -301.69140625 352.27734375 C-304.33604555 351.68537727 -306.98056823 351.09289284 -309.625 350.5 C-310.61132919 350.27899628 -310.61132919 350.27899628 -311.61758423 350.05352783 C-321.17413555 347.90836846 -330.68259222 345.61074936 -340.17358398 343.19262695 C-348.4072731 341.1103155 -356.68552822 339.27726954 -364.9831543 337.46948242 C-376.81553134 334.86691518 -388.5756215 331.97659763 -400.33666992 329.07104492 C-407.86322029 327.21619758 -415.3787213 325.43136903 -423 324 C-422.93941406 323.06542969 -422.87882812 322.13085938 -422.81640625 321.16796875 C-422.5878232 317.5844899 -422.36715008 314.00065417 -422.1492157 310.41651917 C-422.05682592 308.92028464 -421.96215644 307.42418663 -421.86384583 305.92832947 C-420.87997218 290.93586537 -420.80050151 275.95803315 -420.8125 260.9375 C-420.81277191 259.65819611 -420.81304382 258.37889221 -420.81332397 257.06082153 C-420.85927572 209.98234059 -425.76709136 164.16050359 -435.73046875 118.11572266 C-437 112.2081871 -437 112.2081871 -437 110 C-425.58399869 106.04269603 -413.94844277 103.24805004 -402.17724609 100.58764648 C-394.67068731 98.88600844 -387.23109418 97.02634063 -379.80151367 95.01538086 C-375.93266231 93.98201417 -372.05499856 92.99719155 -368.16796875 92.03515625 C-367.51808487 91.874245 -366.86820099 91.71333374 -366.19862366 91.54754639 C-364.87318197 91.21980378 -363.54767585 90.89232165 -362.22210693 90.56509399 C-352.90674581 88.26398881 -343.59903001 85.96119759 -334.375 83.3125 C-327.05271559 81.21168718 -319.66535927 79.49268816 -312.22216797 77.87426758 C-306.43413155 76.60405728 -300.71197625 75.15289133 -294.99073792 73.60922241 C-290.18422501 72.31238349 -285.36925187 71.05292541 -280.546875 69.81640625 C-279.83326813 69.63332916 -279.11966125 69.45025208 -278.38442993 69.2616272 C-276.17307756 68.69476513 -273.9615503 68.12858931 -271.75 67.5625 C-262.3019724 65.14224894 -252.85876246 62.71032288 -243.4375 60.1875 C-236.91244719 58.44544502 -230.35839175 56.90233461 -223.74780273 55.51831055 C-218.44807011 54.39050277 -213.22920263 53.0121729 -207.99830627 51.60067749 C-203.39973547 50.36333568 -198.79055514 49.17940353 -194.16796875 48.03515625 C-193.51858337 47.87436584 -192.869198 47.71357544 -192.20013428 47.5479126 C-190.87418848 47.22005023 -189.54817887 46.89244583 -188.22210693 46.56509399 C-178.90674581 44.26398881 -169.59903001 41.96119759 -160.375 39.3125 C-153.05271559 37.21168718 -145.66535927 35.49268816 -138.22216797 33.87426758 C-132.40010796 32.59659065 -126.64741449 31.12986896 -120.89309692 29.57516479 C-116.32982599 28.34529585 -111.75559603 27.17069557 -107.16796875 26.03515625 C-106.51859848 25.87437088 -105.86922821 25.71358551 -105.20018005 25.54792786 C-103.87458533 25.22015145 -102.54892665 24.89263362 -101.22320557 24.56536865 C-87.37793323 21.14565072 -87.37793323 21.14565072 -73.625 17.375 C-65.76197311 15.12083289 -57.81487514 13.31870906 -49.8359375 11.52441406 C-43.09191945 9.99079466 -36.38589276 8.35307608 -29.69140625 6.6171875 C-28.89845657 6.41158203 -28.1055069 6.20597656 -27.28852844 5.99414062 C-23.34898112 4.96986283 -19.41190067 3.93675532 -15.47680664 2.89550781 C-14.0288189 2.51623668 -12.58082132 2.13700312 -11.1328125 1.7578125 C-10.47040054 1.57999237 -9.80798859 1.40217224 -9.12550354 1.21896362 C-5.9173509 0.38224079 -3.35493508 0 0 0 Z " fill="#156082" transform="translate(2154,1131)"/>
<path d="M0 0 C7.45118424 0.63038285 14.46701737 2.17612736 21.71484375 3.984375 C22.92459366 4.28184631 24.13434357 4.57931763 25.38075256 4.88580322 C28.58550266 5.67536532 31.78890655 6.47012327 34.99182129 7.26708984 C38.19172911 8.06129496 41.39390822 8.84625565 44.59570312 9.6328125 C65.14571548 14.6996605 65.14571548 14.6996605 74.66015625 17.421875 C83.1261767 19.83810181 91.66940443 21.9345426 100.21875 24.03125 C100.95358171 24.21148964 101.68841343 24.39172928 102.44551277 24.57743073 C107.7960892 25.88872372 113.14792045 27.19485779 118.5 28.5 C124.59457942 29.98620602 130.68865499 31.4744273 136.78125 32.96875 C137.51723923 33.14921875 138.25322845 33.3296875 139.01152039 33.515625 C147.41495035 35.57961921 155.78597349 37.71211281 164.10424805 40.09924316 C171.47083202 42.18616677 178.90805428 43.99143501 186.34375 45.8125 C187.03512558 45.98186569 187.72650116 46.15123138 188.43882751 46.32572937 C193.4582919 47.55429198 198.47901755 48.77765871 203.5 50 C209.21958863 51.39241461 214.93866729 52.78686859 220.65625 54.1875 C221.34927719 54.35722824 222.04230438 54.52695648 222.7563324 54.701828 C230.15997067 56.51828692 237.54679468 58.365744 244.875 60.46875 C253.26792782 62.87547737 261.74017829 64.95225593 270.21875 67.03125 C270.95389328 67.21155762 271.68903656 67.39186523 272.44645691 67.57763672 C277.79671906 68.88885943 283.14823325 70.19493407 288.5 71.5 C294.59457942 72.98620602 300.68865499 74.4744273 306.78125 75.96875 C307.88523384 76.23945312 307.88523384 76.23945312 309.01152039 76.515625 C317.41495035 78.57961921 325.78597349 80.71211281 334.10424805 83.09924316 C341.47083202 85.18616677 348.90805428 86.99143501 356.34375 88.8125 C357.03512558 88.98186569 357.72650116 89.15123138 358.43882751 89.32572937 C363.4582919 90.55429198 368.47901755 91.77765871 373.5 93 C379.21958876 94.39241464 384.93864051 95.78697762 390.65625 97.1875 C391.34015871 97.35494343 392.02406742 97.52238686 392.72870064 97.69490433 C402.03839879 99.9782321 411.304266 102.37417079 420.51538086 105.02880859 C424.94674467 106.26386536 429.4103327 107.27598249 433.91015625 108.2265625 C434.59980469 108.48179688 435.28945313 108.73703125 436 109 C437.11919821 112.35759464 436.86089693 113.55851146 436.109375 116.9453125 C435.89587402 117.93120361 435.68237305 118.91709473 435.46240234 119.93286133 C435.22730957 120.98626709 434.9922168 122.03967285 434.75 123.125 C434.27673948 125.3186 433.80539244 127.51261367 433.3359375 129.70703125 C433.10487305 130.7842041 432.87380859 131.86137695 432.63574219 132.97119141 C431.39400593 138.88708234 430.36726827 144.83048469 429.37106323 150.79212952 C429.13114588 152.2196664 428.88843648 153.64673807 428.6423645 155.07322693 C426.36963871 168.27476821 424.99212579 181.4683098 423.875 194.8125 C423.70501598 196.77544171 423.53444487 198.73833267 423.36328125 200.70117188 C422.89375262 206.13298976 422.43117608 211.56499038 422 217 C421.91076767 218.09102524 421.82153534 219.18205048 421.729599 220.30613708 C421.10998294 228.2977002 420.83996384 236.23191461 420.83203125 244.24609375 C420.82870285 245.4591066 420.82537445 246.67211945 420.82194519 247.92189026 C420.8169205 250.47225572 420.81453547 253.02262764 420.81469727 255.57299805 C420.81252298 259.39708804 420.79435199 263.22088314 420.77539062 267.04492188 C420.74553238 280.56458193 421.17386104 293.8739922 422.5690918 307.32446289 C422.96852086 311.24371528 423.08476171 315.06243307 423 319 C416.5 320.625 416.5 320.625 414.35302734 321.16064453 C410.06940202 322.22995827 405.7876159 323.30610937 401.5078125 324.390625 C390.16773477 327.25673542 378.807979 330.00409064 367.40551758 332.61108398 C361.22766469 334.02382593 355.05410603 335.452505 348.88671875 336.91015625 C348.18888275 337.07508575 347.49104675 337.24001526 346.77206421 337.40994263 C345.34131653 337.7482182 343.91058137 338.08654672 342.4798584 338.42492676 C330.62654212 341.22819767 318.76203925 343.96837761 306.875 346.625 C296.79860144 348.87954824 286.76843999 351.26450356 276.76074219 353.80566406 C268.66606255 355.85443481 260.54158264 357.75106072 252.40185547 359.61181641 C246.22525882 361.02446647 240.05289474 362.45279129 233.88671875 363.91015625 C233.18888275 364.07508575 232.49104675 364.24001526 231.77206421 364.40994263 C230.34131653 364.7482182 228.91058137 365.08654672 227.4798584 365.42492676 C215.62654212 368.22819767 203.76203925 370.96837761 191.875 373.625 C181.79860144 375.87954824 171.76843999 378.26450356 161.76074219 380.80566406 C153.66674746 382.85426145 145.54280653 384.75001401 137.40405273 386.61181641 C128.34419021 388.68496573 119.29576736 390.80390389 110.25 392.9375 C107.33858744 393.62389225 104.42712771 394.310084 101.515625 394.99609375 C100.79825165 395.16512207 100.0808783 395.33415039 99.34176636 395.50830078 C92.2303443 397.1829289 85.11543524 398.84251322 78 400.5 C68.12701286 402.80055274 58.25654125 405.11149024 48.38876343 407.43426514 C46.25905217 407.93537009 44.129176 408.43576892 41.99926758 408.93603516 C35.35307765 410.49802212 28.7086946 412.06683459 22.06948853 413.65827942 C19.01118801 414.39088887 15.95198254 415.11967796 12.8927002 415.84817505 C11.44994315 416.19285142 10.00762144 416.53935647 8.5657959 416.88790894 C-0.2395925 419.01604714 -9.01727771 420.78495502 -18 422 C-20.12376035 415.52580544 -20.9605474 408.99588327 -21.8125 402.25 C-21.93597809 401.27759872 -21.93597809 401.27759872 -22.06195068 400.28555298 C-29.18414161 343.77581442 -31.53708633 287.92568195 -31 231 C-30.9926886 230.09231873 -30.9853772 229.18463745 -30.97784424 228.24945068 C-30.73375036 198.39009865 -27.86497609 168.70776416 -24.9296875 139.01171875 C-24.85013321 138.20203644 -24.77057892 137.39235413 -24.68861389 136.55813599 C-24.12735193 130.96352513 -23.3975125 125.40793166 -22.55859375 119.84765625 C-22.12442095 116.8570254 -21.7235795 113.8692044 -21.34765625 110.87109375 C-19.7236672 97.92289118 -17.79683123 85.05471533 -15.55664062 72.19848633 C-15.15343802 69.88166294 -14.75719552 67.56362474 -14.36523438 65.24487305 C-12.54017919 54.54588188 -10.37751317 43.9322815 -8.09326172 33.32250977 C-7.49565515 30.5422866 -6.90580531 27.76048894 -6.31640625 24.97851562 C-5.93015082 23.17437991 -5.54344807 21.37033989 -5.15625 19.56640625 C-4.98428101 18.7526503 -4.81231201 17.93889435 -4.63513184 17.10047913 C-3.37831151 11.30455868 -1.77412257 5.65811713 0 0 Z " fill="#156082" transform="translate(45,1131)"/>
<path d="M0 0 C29.7 0 59.4 0 90 0 C95.72744015 20.61878453 95.72744015 20.61878453 97.28125 27.21875 C97.55249695 28.34839172 97.55249695 28.34839172 97.82922363 29.50085449 C98.57496999 32.60703058 99.31334881 35.71494278 100.05224609 38.82275391 C102.04223036 47.17436485 104.09690302 55.48901545 106.4375 63.75 C109.68347518 75.22071091 112.41382758 86.81515763 115.19775391 98.40478516 C115.88974416 101.2808848 116.58544739 104.15607066 117.28125 107.03125 C117.48036987 107.86619995 117.67948975 108.7011499 117.88464355 109.56140137 C119.0037623 114.18415625 120.20912463 118.77198779 121.50993443 123.34711075 C125.8431309 138.62806215 129.59580089 154.06446319 133.45240712 169.47077465 C134.54566431 173.83550774 135.64189399 178.19949405 136.73789978 182.5635376 C139.75110365 194.56362393 142.75983116 206.5648316 145.76847076 218.56606293 C148.53233244 229.59070879 151.29717419 240.61510643 154.06567949 251.63858724 C155.36368975 256.80748012 156.65952038 261.97691271 157.95360386 267.14679003 C158.76195491 270.37420351 159.57222227 273.60113376 160.38297844 276.8279438 C160.7546091 278.30865431 161.12547235 279.7895577 161.49545288 281.27068138 C163.818746 290.56924127 166.30788581 299.80185937 169 309 C172.81553652 294.7460037 176.6294797 280.4915815 180.44231415 266.23686218 C181.06227875 263.91911381 181.68227874 261.6013749 182.30231476 259.28364563 C192.00239682 223.02713118 192.00239682 223.02713118 201.625 186.75 C201.83427753 185.95778297 202.04355507 185.16556595 202.25917435 184.34934235 C204.17826151 177.08397404 206.09494823 169.81798615 208.00418282 162.55002213 C210.97991466 151.22673793 213.95475375 139.91697243 217.32772827 128.70477295 C219.27414835 122.19364831 220.90639825 115.61762608 222.50979614 109.01574707 C226.96783247 90.68403971 226.96783247 90.68403971 229.5625 82.25 C232.55482927 72.44405611 234.91859422 62.48130798 237.37890625 52.53125 C238.97557851 46.07533842 240.64961427 39.64722089 242.39746094 33.23046875 C243.18296021 30.32272103 243.95413997 27.41124813 244.7265625 24.5 C245.35929168 22.1249778 245.99210485 19.74997798 246.625 17.375 C247.07746094 15.66449463 247.07746094 15.66449463 247.5390625 13.91943359 C247.8278125 12.84000488 248.1165625 11.76057617 248.4140625 10.6484375 C248.80005615 9.19703369 248.80005615 9.19703369 249.19384766 7.71630859 C249.97254303 5.09251552 250.98353848 2.54115379 252 0 C281.04 0 310.08 0 340 0 C342.31 9.24 344.62 18.48 347 28 C349.28205948 36.03663953 349.28205948 36.03663953 351.6015625 44.0625 C353.02665324 49.01219787 354.27826563 53.99679993 355.5 59 C357.33393808 66.49802184 359.37018596 73.91461184 361.52522278 81.32618713 C363.64542995 88.66175684 365.63053141 96.02916012 367.5859375 103.41015625 C368.29896309 106.09390896 369.01288587 108.7774228 369.72680664 111.4609375 C370.00451102 112.50529764 370.00451102 112.50529764 370.28782558 113.57075596 C372.39430909 121.48930591 374.51909261 129.40292724 376.64453125 137.31640625 C377.0573713 138.85397993 377.47019764 140.3915573 377.88301086 141.92913818 C378.74390656 145.13551993 379.60488885 148.34187841 380.46594238 151.54821777 C387.13705414 176.38984233 393.79950369 201.23371936 400.43175316 226.08575249 C401.36605746 229.58659775 402.30058612 233.08738305 403.23518372 236.58815002 C403.85300228 238.90243385 404.47081541 241.21671912 405.08862305 243.53100586 C405.39264573 244.66986142 405.69666842 245.80871698 406.00990391 246.98208332 C407.82781609 253.7927132 409.64398644 260.60380488 411.45898533 267.41521168 C412.59414777 271.67382086 413.73081503 275.93202737 414.86786079 280.19013405 C415.39857658 282.17895694 415.92863348 284.16795579 416.45799065 286.15714073 C417.18481375 288.88809452 417.91391446 291.61843057 418.64355469 294.34863281 C418.8543205 295.14284417 419.06508631 295.93705553 419.28223896 296.7553339 C420.38968992 300.88903311 421.59706988 304.95388566 423 309 C426.50332481 295.33418409 430.00279948 281.66738441 433.5 268 C433.89032536 266.47477219 433.89032536 266.47477219 434.28853607 264.91873169 C439.87378884 243.09216672 445.45730035 221.26535871 450.9140625 199.40625 C451.0986628 198.66683167 451.28326309 197.92741333 451.47345734 197.16558838 C453.33531341 189.70464375 455.1894533 182.24181676 457.03710938 174.77734375 C461.88784579 155.21704866 461.88784579 155.21704866 464.4609375 146.1875 C466.69213937 138.34799858 468.65720614 130.44807727 470.59375 122.53125 C470.75198116 121.88445786 470.91021233 121.23766571 471.07323837 120.5712738 C472.21934193 115.88178457 473.36018736 111.19102162 474.5 106.5 C475.79861728 101.15540081 477.09933926 95.81132798 478.40625 90.46875 C478.56465614 89.82099043 478.72306229 89.17323086 478.88626862 88.50584221 C480.82411862 80.59674003 482.85921606 72.73298069 485.09820557 64.9044342 C488.69190915 52.18770834 491.62440285 39.2843489 494.73291016 26.44250488 C495.82327204 21.93858558 496.91878402 17.4359407 498.015625 12.93359375 C498.30101135 11.7484166 498.58639771 10.56323944 498.88043213 9.34214783 C499.14450867 8.25913895 499.40858521 7.17613007 499.68066406 6.06030273 C500.02777435 4.62617287 500.02777435 4.62617287 500.38189697 3.16307068 C501 1 501 1 502 0 C504.76938966 -0.09517803 507.51377159 -0.12554265 510.28344727 -0.11352539 C511.58576797 -0.11374443 511.58576797 -0.11374443 512.91439819 -0.1139679 C515.79842586 -0.11326846 518.6823898 -0.10547463 521.56640625 -0.09765625 C523.56037867 -0.09579218 525.55435155 -0.09436823 527.54832458 -0.09336853 C532.80745702 -0.08954248 538.06656203 -0.07971145 543.32568359 -0.06866455 C548.68782175 -0.0584523 554.04996431 -0.05387131 559.41210938 -0.04882812 C569.94141833 -0.03808926 580.47070689 -0.0210118 591 0 C583.46899365 26.23990356 575.63811108 52.38942483 567.80484772 78.5403595 C566.37355928 83.31943697 564.9432628 88.09881109 563.51297188 92.87818718 C554.99271247 121.34886161 546.46044132 149.81592745 537.91540527 178.2791748 C530.55107949 202.80980631 523.2090202 227.34707308 515.87453461 251.88664246 C515.01120731 254.77500465 514.14774145 257.66332539 513.28424072 260.55163574 C511.92325236 265.10412466 510.56268977 269.65674062 509.20245743 274.20945549 C508.7033767 275.87972422 508.20418306 277.54995921 507.70486069 279.22015572 C505.27535343 287.34720465 502.85537898 295.47678635 500.46679688 303.6159668 C498.25078426 311.16626602 496.00028608 318.70584922 493.73506165 326.24151611 C493.06912191 328.45693153 492.40381794 330.6725371 491.73864746 332.88818359 C490.08866476 338.38374695 488.43766275 343.87900395 486.78668213 349.37426758 C485.38252015 354.04814682 483.97876687 358.72214847 482.57551575 363.39630127 C481.93073833 365.54345225 481.28539465 367.69043243 480.64001465 369.83740234 C478.20331577 377.9494853 475.79460463 386.06935976 473.4095459 394.19677734 C471.27647004 401.46552845 469.13748683 408.73254479 467 416 C436.97 416 406.94 416 376 416 C372.75774278 404.97632546 369.6595417 394.02240885 366.9375 382.875 C366.28192345 380.20524006 365.62411011 377.53603858 364.96484375 374.8671875 C364.80406845 374.21576782 364.64329315 373.56434814 364.47764587 372.89318848 C362.74352964 365.9039822 360.87205853 358.95336024 359 352 C358.18278125 348.91790164 357.3721782 345.83408676 356.5625 342.75 C356.13672571 341.1302065 355.71094425 339.51041489 355.28515625 337.890625 C355.07262207 337.08173828 354.86008789 336.27285156 354.64111328 335.43945312 C353.59510519 331.45936444 352.54748409 327.47970044 351.5 323.5 C351.08332532 321.91666878 350.66665866 320.33333544 350.25 318.75 C350.04375 317.96625 349.8375 317.1825 349.625 316.375 C347.74999999 309.24999998 347.74999999 309.24999998 347.15979862 307.00722408 C346.74433116 305.42845444 346.32885747 303.84968643 345.9133749 302.27092075 C344.8884597 298.37637174 343.86364274 294.48179695 342.83912659 290.58714294 C340.10859492 280.20784118 337.37374681 269.82968501 334.63561821 259.45238495 C333.4366106 254.90815774 332.23785937 250.36386289 331.0390625 245.81958008 C330.66158072 244.38868577 330.66158072 244.38868577 330.27647305 242.92888451 C321.34142302 209.05927011 312.41275789 175.18798794 303.5 141.3125 C303.2810545 140.48033588 303.06210899 139.64817177 302.83652878 138.79079056 C300.22391187 128.86064293 297.61171203 118.93038566 295 109 C292.96768185 114.88280572 291.18468618 120.77731601 289.63769531 126.80493164 C289.42013895 127.64205059 289.20258259 128.47916954 288.97843361 129.34165573 C288.25875553 132.11374425 287.54346362 134.88694506 286.828125 137.66015625 C286.31247741 139.64946454 285.79652957 141.63869502 285.28030396 143.62785339 C284.17656468 147.8830864 283.07468182 152.13879392 281.9743042 156.39489746 C279.34798069 166.55293334 276.7129291 176.70870677 274.07885361 186.86473465 C273.17486692 190.35062002 272.27127103 193.83660655 271.3677063 197.32260132 C267.41252433 212.57812001 263.43756672 227.82836143 259.4453125 243.07421875 C259.185793 244.06552858 258.9262735 245.05683842 258.65888977 246.07818794 C256.42461193 254.61245149 254.18966246 263.14653836 251.95031738 271.67947388 C250.59798923 276.83274596 249.24721471 281.98642235 247.8984375 287.140625 C247.68690096 287.94896475 247.47536442 288.7573045 247.25741768 289.59013939 C243.92657794 302.33110209 240.68724299 315.09339283 237.52999878 327.878479 C235.96615309 334.19881364 234.35224543 340.48976489 232.5625 346.75 C229.52492466 357.38772225 226.93851631 368.14422222 224.29711914 378.88574219 C222.2974648 386.98942946 220.19395569 395.03471577 217.83496094 403.04272461 C217.06012526 405.78704759 216.40661556 408.52424482 215.8125 411.3125 C215 415 215 415 214 416 C211.16959328 416.09520906 208.36365007 416.12553631 205.53295898 416.11352539 C204.64523804 416.11367142 203.75751709 416.11381744 202.84289551 416.1139679 C199.89393716 416.11326843 196.94504113 416.10547448 193.99609375 416.09765625 C191.95728083 416.09579219 189.91846746 416.09436823 187.87965393 416.09336853 C182.50215426 416.08954241 177.12468142 416.07971132 171.74719238 416.06866455 C166.26440799 416.05845245 160.78161928 416.05387134 155.29882812 416.04882812 C144.53254027 416.03808914 133.76627236 416.02101159 123 416 C118.72098533 404.43378727 118.72098533 404.43378727 117.32421875 399.30078125 C117.05778564 398.33325928 116.79135254 397.3657373 116.5168457 396.36889648 C116.24316162 395.36028564 115.96947754 394.3516748 115.6875 393.3125 C115.07130348 391.08045535 114.45409263 388.84869051 113.8359375 386.6171875 C113.3733252 384.94414551 113.3733252 384.94414551 112.90136719 383.23730469 C108.04257379 365.78670868 102.75630416 348.45518572 97.52661133 331.11303711 C94.87276048 322.3034662 92.25860609 313.48366925 89.69140625 304.6484375 C85.92068979 291.6770472 82.05583906 278.73410764 78.18411255 265.79260254 C75.98234423 258.43275785 73.78432628 251.07179221 71.5859375 243.7109375 C71.35734354 242.94560699 71.12874958 242.18027649 70.89322853 241.39175415 C56.22289482 192.27381947 41.64566826 143.12807219 27.12619019 93.96534729 C24.43067494 84.83892421 21.73180374 75.71350059 19.03042316 66.58881187 C16.86822439 59.28497704 14.70801596 51.98055531 12.54916668 44.67572975 C11.24321316 40.2570895 9.93633929 35.83872627 8.62722778 31.42102051 C7.40646176 27.30130977 6.18823111 23.180858 4.97196579 19.05981636 C4.52243494 17.53835792 4.07196042 16.01717794 3.62050247 14.49629021 C3.00386129 12.41842135 2.39054486 10.33959992 1.77807617 8.26049805 C1.43282394 7.09342819 1.08757172 5.92635834 0.7318573 4.72392273 C0 2 0 2 0 0 Z " fill="rgb(247,249,253)" transform="translate(810,358)"/>
<path d="M0 0 C0.17160645 0.81049805 0.34321289 1.62099609 0.52001953 2.45605469 C2.40809421 11.32538234 4.36005135 20.17846726 6.36962891 29.02099609 C6.70482387 30.49941639 7.03817693 31.97825558 7.36962891 33.45751953 C11.16733183 50.40256197 15.84940679 66.99742521 21.22949219 83.50683594 C22.00589509 85.89311862 22.77273641 88.28233976 23.5390625 90.671875 C26.32503712 99.29448396 29.36100073 107.69224721 33 116 C33.77424486 117.85274471 34.54555214 119.7067228 35.3125 121.5625 C35.63863281 122.34753906 35.96476562 123.13257813 36.30078125 123.94140625 C37 126 37 126 37 129 C36.20078125 129.30292969 35.4015625 129.60585937 34.578125 129.91796875 C25.18609294 133.50061009 15.85983254 137.18171256 6.75 141.4375 C1.56196636 143.82909354 -3.73804856 145.80316616 -9.09667969 147.76928711 C-12.97631595 149.20460536 -16.7528741 150.73930229 -20.5 152.5 C-25.57412801 154.88064352 -30.75960613 156.82911834 -36.01416016 158.76513672 C-41.1577999 160.6657012 -46.2229477 162.71429323 -51.2734375 164.8515625 C-53.83787499 165.93171239 -56.41363239 166.97366365 -59 168 C-62.68251357 169.46356309 -66.34433293 170.97058827 -70 172.5 C-73.65566707 174.02941173 -77.31748643 175.53643691 -81 177 C-84.57834879 178.4222372 -88.13630568 179.88624831 -91.6875 181.375 C-96.27432776 183.2945197 -100.88035056 185.16117879 -105.5 187 C-113.823213 190.31808758 -122.13039629 193.64351851 -130.25 197.4375 C-135.43803364 199.82909354 -140.73804856 201.80316616 -146.09667969 203.76928711 C-149.97631595 205.20460536 -153.7528741 206.73930229 -157.5 208.5 C-162.57412801 210.88064352 -167.75960613 212.82911834 -173.01416016 214.76513672 C-178.1577999 216.6657012 -183.2229477 218.71429323 -188.2734375 220.8515625 C-190.83787499 221.93171239 -193.41363239 222.97366365 -196 224 C-199.68251357 225.46356309 -203.34433293 226.97058827 -207 228.5 C-211.4625965 230.36700466 -215.94224226 232.18217321 -220.4375 233.96875 C-223.30212066 235.12158514 -226.15136673 236.30822486 -229 237.5 C-233.4625965 239.36700466 -237.94224226 241.18217321 -242.4375 242.96875 C-245.30212066 244.12158514 -248.15136673 245.30822486 -251 246.5 C-255.4625965 248.36700466 -259.94224226 250.18217321 -264.4375 251.96875 C-267.30212066 253.12158514 -270.15136673 254.30822486 -273 255.5 C-277.4625965 257.36700466 -281.94224226 259.18217321 -286.4375 260.96875 C-289.30212066 262.12158514 -292.15136673 263.30822486 -295 264.5 C-299.4625965 266.36700466 -303.94224226 268.18217321 -308.4375 269.96875 C-311.30212066 271.12158514 -314.15136673 272.30822486 -317 273.5 C-320.65566707 275.02941173 -324.31748643 276.53643691 -328 278 C-331.57834879 279.4222372 -335.13630568 280.88624831 -338.6875 282.375 C-343.90880782 284.56004024 -349.15785491 286.6707184 -354.41699219 288.76245117 C-358.44038783 290.36612082 -362.4441265 292.01058528 -366.4375 293.6875 C-370.92273092 295.56899064 -375.4317238 297.33082216 -380 299 C-383.41294517 292.00799286 -386.19977889 284.9069468 -388.68017578 277.54321289 C-390.06486661 273.47915016 -391.6093758 269.5375258 -393.30859375 265.59375 C-396.70493269 257.53777645 -399.34847879 249.24136597 -402.0625 240.9375 C-403.09270745 237.80000627 -404.12574481 234.66345373 -405.16015625 231.52734375 C-405.40688583 230.77752228 -405.65361542 230.02770081 -405.90782166 229.25515747 C-407.2790526 225.10763375 -408.70905984 220.99146986 -410.2265625 216.89453125 C-411.82816805 212.5613328 -413.14004282 208.21604902 -414.3125 203.75 C-415.902547 197.844469 -417.60634711 191.99257423 -419.44042969 186.15820312 C-425.83511582 165.74963036 -430.73855004 144.91779654 -435.4375 124.0625 C-435.68443604 122.97420898 -435.93137207 121.88591797 -436.18579102 120.76464844 C-437.49287161 114.84343832 -438.45205771 109.03996154 -439 103 C-432.15638753 100.57207939 -425.34864708 98.87688374 -418.25 97.375 C-406.95328758 94.92853794 -395.72339352 92.26147649 -384.5 89.5 C-372.49852883 86.54961603 -360.48267398 83.72859147 -348.40625 81.09765625 C-341.23579578 79.52557128 -334.11342124 77.81194225 -327 76 C-318.80017555 73.91132736 -310.58016122 71.98866905 -302.3125 70.1875 C-291.33142106 67.79303261 -280.41340909 65.18204076 -269.5 62.5 C-257.49829617 59.55050378 -245.4827054 56.72859832 -233.40625 54.09765625 C-226.23579578 52.52557128 -219.11342124 50.81194225 -212 49 C-203.80017555 46.91132736 -195.58016122 44.98866905 -187.3125 43.1875 C-176.33142106 40.79303261 -165.41340909 38.18204076 -154.5 35.5 C-142.49829617 32.55050378 -130.4827054 29.72859832 -118.40625 27.09765625 C-111.23579578 25.52557128 -104.11342124 23.81194225 -97 22 C-88.80017119 19.91132625 -80.58014111 17.9887746 -72.3125 16.1875 C-58.82893818 13.24574046 -45.42985539 9.98604618 -32.02833557 6.69407654 C-29.09744257 5.97489365 -26.16584565 5.25863499 -23.23376465 4.54431152 C-21.70010297 4.17059725 -20.16666733 3.7959545 -18.63342285 3.42053223 C-16.30102603 2.85104195 -13.96716128 2.28799134 -11.6328125 1.7265625 C-10.92446259 1.55264984 -10.21611267 1.37873718 -9.48629761 1.19955444 C-6.18680484 0.41247847 -3.42002519 0 0 0 Z " fill="#156082" transform="translate(475,1500)"/>
<path d="M0 0 C17.43655054 3.40820842 34.75124496 7.37067757 51.96655273 11.75561523 C59.17916377 13.57922993 66.41871554 15.22894339 73.6875 16.8125 C85.4731847 19.38241483 97.18538964 22.21087435 108.89837646 25.0894165 C120.09999624 27.8396929 131.32128917 30.44539105 142.59155273 32.90234375 C149.78179321 34.47960726 156.92741087 36.1901095 164.0625 38 C179.68325954 41.95992208 195.384511 45.54720073 211.12109375 49.015625 C211.91139984 49.19010162 212.70170593 49.36457825 213.51596069 49.54434204 C217.410352 50.4038768 221.3054358 51.25993645 225.20214844 52.10888672 C233.33179668 53.89086259 241.36481192 55.86384982 249.39672852 58.04882812 C255.26840141 59.59880018 261.19428779 60.88576161 267.125 62.1875 C279.0380265 64.8295348 290.90045517 67.64974567 302.75 70.5625 C314.66789912 73.49123506 326.60084685 76.28824938 338.5925293 78.90258789 C346.78012286 80.69855603 354.90592923 82.69176832 363.03027344 84.75292969 C374.64367432 87.68969565 386.31815186 90.35095047 398 93 C398.65145996 93.14777893 399.30291992 93.29555786 399.97412109 93.44781494 C407.39953798 95.13189135 414.82611846 96.81078689 422.25390625 98.484375 C423.4155127 98.74927734 424.57711914 99.01417969 425.77392578 99.28710938 C427.79732469 99.73423552 429.82662144 100.15621637 431.86279297 100.54101562 C433.92797471 100.93670982 435.96940692 101.45388532 438 102 C439.07645404 105.22936212 438.9402181 106.19513558 438.21484375 109.41015625 C438.01721436 110.30355713 437.81958496 111.19695801 437.6159668 112.11743164 C437.39207275 113.0893042 437.16817871 114.06117676 436.9375 115.0625 C436.70780518 116.08400146 436.47811035 117.10550293 436.24145508 118.15795898 C435.74990878 120.33660198 435.25459679 122.51439819 434.75585938 124.69140625 C434.02853729 127.87508485 433.31716653 131.06193048 432.609375 134.25 C427.51053616 157.01324266 421.57746832 179.58755281 414.66162109 201.86816406 C414.03512335 203.88682763 413.41694562 205.90785023 412.80078125 207.9296875 C410.26883734 216.15640225 407.58912274 224.33166524 404.875 232.5 C404.53807129 233.51545898 404.20114258 234.53091797 403.85400391 235.57714844 C402.00991088 241.09756545 400.071924 246.5611995 398 252 C397.37249662 253.74910392 396.7472087 255.49900561 396.125 257.25 C394.71186928 261.15625869 393.18647951 264.98927551 391.5625 268.8125 C389.17355653 274.45306097 387.11440833 280.18047362 385.11328125 285.96875 C384.20947878 288.42962971 383.23729695 290.69489883 382 293 C375.06372909 292.52707244 369.31176699 289.76626825 363 287 C361.0645057 286.18273364 359.12700882 285.37019303 357.1875 284.5625 C356.20136719 284.15128906 355.21523437 283.74007813 354.19921875 283.31640625 C350.00125898 281.58904063 345.78473452 279.90933415 341.56713867 278.23071289 C336.72073443 276.29821926 331.90512836 274.2989248 327.09375 272.28125 C322.93720192 270.5598513 318.7573246 268.89834353 314.57739258 267.23486328 C309.61809693 265.25725739 304.68839227 263.21494676 299.765625 261.1484375 C297.16693629 260.069321 294.55621156 259.02936775 291.9375 258 C288.52568748 256.64825177 285.19868255 255.18034474 281.875 253.625 C276.66526787 251.22277557 271.3547378 249.21363945 265.97631836 247.23095703 C260.94748924 245.37230846 255.99624494 243.37154467 251.05859375 241.28125 C247.55496418 239.81357376 244.02977823 238.4031859 240.5 237 C235.00786144 234.81451575 229.54479769 232.56717323 224.09375 230.28125 C220.57446086 228.82376662 217.03908626 227.40848483 213.5 226 C208.00795503 223.81427705 202.54480155 221.56717484 197.09375 219.28125 C193.57446086 217.82376662 190.03908626 216.40848483 186.5 215 C181.00795503 212.81427705 175.54480155 210.56717484 170.09375 208.28125 C166.57446086 206.82376662 163.03908626 205.40848483 159.5 204 C154.00795503 201.81427705 148.54480155 199.56717484 143.09375 197.28125 C139.57446086 195.82376662 136.03908626 194.40848483 132.5 193 C127.00795503 190.81427705 121.54480155 188.56717484 116.09375 186.28125 C112.57446086 184.82376662 109.03908626 183.40848483 105.5 182 C100.00795503 179.81427705 94.54480155 177.56717484 89.09375 175.28125 C84.93720192 173.5598513 80.7573246 171.89834353 76.57739258 170.23486328 C71.61809693 168.25725739 66.68839227 166.21494676 61.765625 164.1484375 C59.16693629 163.069321 56.55621156 162.02936775 53.9375 161 C50.52568748 159.64825177 47.19868255 158.18034474 43.875 156.625 C38.66526787 154.22277557 33.3547378 152.21363945 27.97631836 150.23095703 C22.94858767 148.37271443 17.99808855 146.37351036 13.0625 144.28125 C9.53908634 142.80716878 5.98945122 141.40332793 2.4375 140 C-1.91016788 138.27884336 -6.20213952 136.48413284 -10.4375 134.5 C-15.71673054 132.03954414 -21.13013906 130.02441616 -26.60717773 128.0546875 C-29.69655984 126.93086164 -32.24849758 125.83433494 -35 124 C-34.50011998 116.83505307 -31.65520875 110.60925026 -29 104 C-28.47372398 102.60620963 -27.95188652 101.21072193 -27.4375 99.8125 C-26.3761612 96.95046279 -25.2287908 94.13329635 -24.0625 91.3125 C-12.45335927 62.38547151 -5.96756293 30.51247857 0 0 Z " fill="#156082" transform="translate(1723,1504)"/>
    </g>
  </svg>
);

const renderHelp=()=>(<div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-indigo-50"><div className="max-w-3xl mx-auto py-10 px-6">
<div className="text-center mb-10"><div className="mb-3 inline-block"><KeystoneLogo width={120}/></div><h1 className="text-3xl font-bold text-gray-800 mb-1">ArgWarrantee</h1><p className="text-base text-gray-500">Argumentation Structure and Scheme Analysis</p><p className="text-xs text-gray-400 mt-2">Version {APP_VERSION} · {APP_DATE}</p></div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">🌐 Platform Overview</h2><p className="text-sm text-gray-600 leading-relaxed mb-3">ArgWarrantee is an integrated argumentation analysis platform combining two complementary modules that share a common source-text editor:</p>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div className="p-3 rounded-xl bg-blue-50 border border-blue-200"><h3 className="text-sm font-bold text-blue-700 mb-1.5">𝒜 ArgMap Module</h3><p className="text-xs text-blue-600 leading-relaxed">Toulmin-model argument mapping with a visual node-and-edge canvas. Supports 8 node types (Claim, Data/Grounds, Claim-Data, Warrant, Backing, Qualifier, Rebuttal, Critical Question), with automatic dual-role promotion (e.g. Claim‑Premise, Claim‑Warrant), 5 edge types (Support, Attack, Qualify, Question, Link), and pre-built argumentation scheme templates based on Walton's classification.</p></div>
<div className="p-3 rounded-xl bg-purple-50 border border-purple-200"><h3 className="text-sm font-bold text-purple-700 mb-1.5">🆆 Warrantee Module</h3><p className="text-xs text-purple-600 leading-relaxed">Fine-grained argumentation scheme analysis with 9 relation types across 4 categories. Features Bayesian probability diagrams, Venn-based similarity analysis, source reliability assessment with weighted CQs, hierarchical description trees with box-model decomposition, and directed network metrics with Sugiyama layout.</p></div>
</div></div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">𝒜 ArgMap — Toulmin Argument Mapping</h2>
<div className="mb-4"><h3 className="text-sm font-semibold text-gray-600 mb-2">Node Types</h3><div className="grid grid-cols-2 gap-2 text-xs">
<div className="p-2 rounded-lg bg-blue-50 border border-blue-200"><strong className="text-blue-700">🎯 Claim</strong> – the conclusion being argued</div>
<div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200"><strong className="text-emerald-700">📄 Premise</strong> – evidence supporting the claim</div>
<div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200"><strong className="text-cyan-700">📄🎯 Claim‑Premise</strong> – auto-detected dual-role node (Premise supported by another Premise)</div>
<div className="p-2 rounded-lg bg-violet-50 border border-violet-200"><strong className="text-violet-700">→ Warrant</strong> – logical bridge from data to claim; can be tagged with a Walton scheme</div>
<div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200"><strong className="text-indigo-700">🛡 Backing</strong> – support for the warrant's authority</div>
<div className="p-2 rounded-lg bg-amber-50 border border-amber-200"><strong className="text-amber-700">❓ Qualifier</strong> – degree of certainty (e.g. "probably", "presumably")</div>
<div className="p-2 rounded-lg bg-red-50 border border-red-200"><strong className="text-red-700">⚠ Rebuttal</strong> – exceptions or counterarguments</div>
<div className="p-2 rounded-lg bg-pink-50 border border-pink-200"><strong className="text-pink-700">❓ Critical Question</strong> – scheme-specific challenge; links to a warrant</div>
</div></div>

<div className="mb-4"><h3 className="text-sm font-semibold text-gray-600 mb-2">Edge Types</h3><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
<div className="p-2 rounded-lg bg-green-50 border border-green-200"><strong className="text-green-700">Support</strong> – solid green arrow</div>
<div className="p-2 rounded-lg bg-red-50 border border-red-200"><strong className="text-red-700">Attack</strong> – dashed red arrow</div>
<div className="p-2 rounded-lg bg-amber-50 border border-amber-200"><strong className="text-amber-700">Qualify</strong> – dashed amber arrow</div>
<div className="p-2 rounded-lg bg-pink-50 border border-pink-200"><strong className="text-pink-700">Question</strong> – dashed pink arrow</div>
<div className="p-2 rounded-lg bg-teal-50 border border-teal-200"><strong className="text-teal-700">Link</strong> – bidirectional link for linked premises</div>
</div>
<p className="text-xs text-gray-400 mt-2">Edges can target other edges — enabling warrants, qualifiers, and rebuttals to attach to the inference between nodes (junction circles appear on targeted edges).</p></div>

<div className="mb-4"><h3 className="text-sm font-semibold text-gray-600 mb-2">Walton Argumentation Schemes</h3><p className="text-xs text-gray-500 mb-2">Warrants can be classified using Walton, Reed & Macagno's typology. Each scheme unlocks preset Critical Questions:</p><div className="grid grid-cols-2 gap-2 text-xs">
<div className="p-2 rounded-lg bg-gray-50 border border-gray-200"><strong>Cause and Effect</strong> – 3 subtypes (cause→effect, effect→cause, from consequence)</div>
<div className="p-2 rounded-lg bg-gray-50 border border-gray-200"><strong>Whole and Part</strong> – 4 subtypes (from syllogism, from definition, from example, from paradigm)</div>
<div className="p-2 rounded-lg bg-gray-50 border border-gray-200"><strong>Analogy</strong> – 2 subtypes (same domain, different domains)</div>
<div className="p-2 rounded-lg bg-gray-50 border border-gray-200"><strong>Information Source</strong> – 4 subtypes (orthodox, authority, expert opinion, popular opinion)</div>
<div className="p-2 rounded-lg bg-gray-50 border border-gray-200"><strong>Custom</strong> – includes From Sign; or user-defined scheme name</div>
</div></div>

<div><h3 className="text-sm font-semibold text-gray-600 mb-2">Pre-built Scheme Templates</h3><p className="text-xs text-gray-500 mb-2">Load complete argument structures from the <em>Scheme</em> sidebar tab:</p><ul className="text-xs text-gray-600 space-y-1 pl-4 list-disc">
<li>Basic Toulmin Layout (Data → Claim with Warrant, Backing, Qualifier, Rebuttal)</li>
<li>Linked Argument (multiple linked premises supporting a claim)</li>
<li>Serial Argument Chain (intermediate conclusions become new premises)</li>
<li>Argument from Expert Opinion (with 3 CQ nodes)</li>
<li>Cause to Effect (with 3 CQ nodes)</li>
<li>Argument from Analogy (with 3 CQ nodes)</li>
<li>Argument from Definition (with 3 CQ nodes)</li>
</ul></div></div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">🆆 Warrantee — Argumentation Scheme Analysis</h2><p className="text-sm text-gray-600 leading-relaxed mb-3">Nine relation types in four categories, each with a specialised analysis panel:</p>
<div className="space-y-2 mb-4">
<div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Temporal</div>
<div className="grid grid-cols-1 gap-2 text-xs">
<div className="p-2 rounded-lg bg-teal-50 border border-teal-200"><strong className="text-teal-700">⏱ Sequence</strong> – Temporal ordering. Analysis: Sugiyama hierarchical layout, layer assignment, directed network metrics (degree centrality, betweenness, closeness, eigenvector), longest paths, source/sink identification.</div>
<div className="p-2 rounded-lg bg-red-50 border border-red-200"><strong className="text-red-700">⚡ Cause → Effect</strong> – Bayesian conditional probability analysis. Sliders for P(Q|P), P(¬Q|¬P), and prior P(P). Mosaic plot of joint probabilities. Sufficiency & necessity metrics. Subtypes: cause-to-effect and effect-to-cause (abductive).</div>
<div className="p-2 rounded-lg bg-amber-50 border border-amber-200"><strong className="text-amber-700">🎯 Action → Goal</strong> – Dual conditional analysis: goal achievement P(Q|P) and ramification P(R|P). Stacked mosaic plots. CQs: feasibility, causality, need of goal, alternativity, ramification delta.</div>
</div>
<div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3">Description</div>
<div className="grid grid-cols-1 gap-2 text-xs">
<div className="p-2 rounded-lg bg-blue-50 border border-blue-200"><strong className="text-blue-700">🔵 Whole ○─ Part</strong> – Tree diagram + nested box model. Click borders to remove elements (cascading to children). CQs for generalisation: membership, truth of attribution, typicality, transitivity.</div>
<div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200"><strong className="text-cyan-700">◆ Object ◆ Attribute</strong> – Attribute chips with drag-to-copy between boxes and double-click-to-edit. Edited copies show "converted" (amber) styling. Comparison edges shown inline.</div>
</div>
<div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3">Comparison</div>
<div className="grid grid-cols-1 gap-2 text-xs">
<div className="p-2 rounded-lg bg-pink-50 border border-pink-200"><strong className="text-pink-700">⇌ Comparison</strong> – Venn diagram (A only / Common / B only / Irrelevant). Drag attribute pills between zones. Difference metric = 1 − Jaccard ratio. CQs: relevant differences, right conclusion.</div>
<div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200"><strong className="text-emerald-700">🟰 Analogy</strong> – Venn diagram (Base / Common / Target / Irrelevant). Supports analogy chains (multiple connected pairs). Similarity = Jaccard ratio. CQs: relevant differences, right conclusion, counter-analogy.</div>
</div>
<div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3">Source & Other</div>
<div className="grid grid-cols-1 gap-2 text-xs">
<div className="p-2 rounded-lg bg-purple-50 border border-purple-200"><strong className="text-purple-700">📋 Source</strong> – 6 Walton CQs (Identifiability, Accuracy, Credibility, Trustworthiness, Consistency, Evidentiality) with per-CQ sliders and adjustable weights. Integrated reliability thermometer with configurable Accept/Neutral/Reject thresholds. Subtypes: genealogy, authority, expert, popularity.</div>
<div className="p-2 rounded-lg bg-gray-50 border border-gray-200"><strong className="text-gray-700">🔗 Link</strong> – Custom-labelled connection with editable argumentation scheme text, critical questions, and backing fields.</div>
</div></div></div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">📋 Workflow</h2><div className="space-y-3 text-sm text-gray-600">
<div className="flex gap-3"><div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black flex-shrink-0">1</div><div><strong className="text-gray-700">Import Source Text</strong> — Paste or upload (.txt/.html) into the shared text editor on the left panel. Use the formatting toolbar to highlight and annotate key passages.</div></div>
<div className="flex gap-3"><div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black flex-shrink-0">2</div><div><strong className="text-gray-700">ArgMap: Build Argument Structure</strong> — On the 𝒜 ArgMap tab, select text from the editor and create Toulmin nodes (Claim, Premise, Warrant, etc.) via the left panel's <em>Text</em> or <em>Layout</em> tabs. Connect nodes with typed edges. Assign Walton schemes to warrants via the edit modal. Load pre-built scheme templates from the <em>Scheme</em> tab.</div></div>
<div className="flex gap-3"><div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black flex-shrink-0">3</div><div><strong className="text-gray-700">Warrantee: Analyse Argument Schemes</strong> — Switch to a 🆆 Warrantee tab. Select text → <em>✦ Expressed</em> or add <em>✧ Unexpressed</em> nodes. Connect with relation types (sequence, cause, analogy, etc.). Click any edge to open its specialised analysis panel.</div></div>
<div className="flex gap-3"><div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black flex-shrink-0">4</div><div><strong className="text-gray-700">Multiple Canvases</strong> — Add multiple Warrantee tabs (one per warrant or sub-argument). Each tab has independent state. Use the ArgMap tab for structural overview and Warrantee tabs for detailed scheme analysis.</div></div>
<div className="flex gap-3"><div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black flex-shrink-0">5</div><div><strong className="text-gray-700">Save & Export</strong> — Save the entire project (all tabs, source text, all states) as a single JSON file. Download individual diagrams as PNG from each analysis view.</div></div>
</div></div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">✨ AI Discourse Generation</h2>
<p className="text-sm text-gray-600 leading-relaxed mb-3">The AI tab in the ArgMap sidebar provides an integrated discourse generation tool. It connects to external AI providers to generate argumentative text that can be inserted directly into the source text editor for analysis.</p>

<div className="mb-4"><h3 className="text-sm font-semibold text-gray-600 mb-2">Supported Providers</h3><div className="grid grid-cols-1 gap-2 text-xs">
<div className="p-2 rounded-lg bg-gray-50 border border-gray-200"><strong className="text-gray-700">OpenAI</strong> — Models: gpt-4o-mini, gpt-4o, gpt-3.5-turbo. Highest quality generation. Requires a paid API key from platform.openai.com.</div>
<div className="p-2 rounded-lg bg-blue-50 border border-blue-200"><strong className="text-blue-700">Google Gemini</strong> — Models: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash, gemini-flash-latest, gemini-pro-latest. Free tier available. Get an API key from aistudio.google.com.</div>
<div className="p-2 rounded-lg bg-orange-50 border border-orange-200"><strong className="text-orange-700">Alibaba Cloud (Qwen)</strong> — Models: qwen-turbo, qwen-plus, qwen-max, qwen-long, and their -latest variants. Excellent multilingual support (especially Chinese). Get an API key from modelstudio.console.alibabacloud.com → API Key.</div>
<div className="p-2 rounded-lg bg-gray-50 border border-gray-200"><strong className="text-gray-700">DeepSeek</strong> — Models: deepseek-chat, deepseek-reasoner. Cost-effective alternative. Get a key from platform.deepseek.com.</div>
</div></div>

<div className="mb-4"><h3 className="text-sm font-semibold text-gray-600 mb-2">Generation Options</h3><div className="space-y-2 text-xs text-gray-600">
<div className="p-2 rounded-lg bg-amber-50 border border-amber-200"><strong className="text-amber-700">Text Length</strong> — Choose from three output sizes: <em>1–2 Sentences</em> (20–40 words, a single argumentative statement), <em>Paragraph</em> (100–200 words, 5–8 sentences developing one point), or <em>Passage</em> (300–500 words, 3–5 paragraphs with a full argument).</div>
<div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200"><strong className="text-indigo-700">Argument Structure</strong> — By default, the AI generates natural argumentative prose freely. Alternatively, you can require specific Toulmin elements to appear in the output: <em>Claim</em> (thesis statement), <em>Premises</em> (≥2 supporting reasons), <em>Warrant</em> (explicit reasoning principle), <em>Critical Question / Rebuttal</em> (counterargument), and/or <em>Qualifier</em> (degree of certainty). Multiple elements can be selected simultaneously.</div>
</div></div>

<div className="mb-4"><h3 className="text-sm font-semibold text-gray-600 mb-2">Workflow</h3><div className="space-y-2 text-xs text-gray-600">
<div className="flex gap-2"><div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black flex-shrink-0">1</div><div>Select a provider and model, then enter your API key (stored in browser memory only — never transmitted to any server other than the chosen provider).</div></div>
<div className="flex gap-2"><div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black flex-shrink-0">2</div><div>Enter an argumentation topic and configure text length and structure constraints.</div></div>
<div className="flex gap-2"><div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black flex-shrink-0">3</div><div>Click <strong>Generate Discourse</strong>. The generated text appears in a preview panel with a word count.</div></div>
<div className="flex gap-2"><div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black flex-shrink-0">4</div><div>Click <strong>Insert to Editor</strong> to append the text to the shared source text panel (separated by a dashed line if existing content is present), or <strong>Copy</strong> to clipboard.</div></div>
<div className="flex gap-2"><div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black flex-shrink-0">5</div><div>Select passages in the editor and use the <em>Text</em> tab to create ArgMap nodes (Claim, Premise, Warrant, etc.) or switch to a Warrantee tab to create expressed nodes.</div></div>
</div></div>

<div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500"><strong className="text-gray-600">Privacy Note:</strong> Your API key is held in browser memory for the duration of the session. It is sent only to the selected provider's API endpoint. ArgWarrantee does not store, log, or transmit your key to any other server. Keys are lost when the page is closed or refreshed.</div>
</div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">⌨️ Keyboard Shortcuts</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div><h3 className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">ArgMap Canvas</h3><div className="space-y-1.5 text-xs">
<div className="flex justify-between"><span className="text-gray-600">Select mode</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">V</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Connect mode</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">C</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Delete mode</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">X</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Edit selected node</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">Enter</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Delete selected node</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">Delete / Backspace</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Undo</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">Ctrl+Z</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Redo</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">Ctrl+Shift+Z / Ctrl+Y</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Cancel / Deselect</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">Escape</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Zoom in/out</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">Ctrl+Scroll</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Pinch zoom</span><span className="text-gray-400 text-[10px]">Two-finger pinch (touch)</span></div>
</div></div>
<div><h3 className="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wider">Warrantee Canvas</h3><div className="space-y-1.5 text-xs">
<div className="flex justify-between"><span className="text-gray-600">Move node</span><span className="text-gray-400 text-[10px]">Drag (in Select mode)</span></div>
<div className="flex justify-between"><span className="text-gray-600">Edit node text</span><span className="text-gray-400 text-[10px]">Double-click</span></div>
<div className="flex justify-between"><span className="text-gray-600">Open edge detail</span><span className="text-gray-400 text-[10px]">Click edge label</span></div>
<div className="flex justify-between"><span className="text-gray-600">Connect nodes</span><span className="text-gray-400 text-[10px]">Select type → click/drag</span></div>
<div className="flex justify-between"><span className="text-gray-600">Delete node/edge</span><span className="text-gray-400 text-[10px]">Delete mode → click</span></div>
<div className="flex justify-between"><span className="text-gray-600">Zoom canvas</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">Ctrl+Scroll</kbd></div>
<div className="flex justify-between"><span className="text-gray-600">Expand / Collapse children</span><span className="text-gray-400 text-[10px]">Click child count bar</span></div>
<div className="flex justify-between"><span className="text-gray-600">Undo / Redo</span><span className="text-gray-400 text-[10px]">Toolbar buttons</span></div>
<div className="flex justify-between"><span className="text-gray-600">Fit to view</span><span className="text-gray-400 text-[10px]">Toolbar fit button</span></div>
</div></div>
</div></div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">📚 Theoretical Foundation</h2><div className="space-y-2 text-sm text-gray-600 leading-relaxed">
<p><strong>Toulmin Model</strong> (1958) — The ArgMap module implements Toulmin's layout for everyday argumentation: Data, Claim, Warrant, Backing, Qualifier, and Rebuttal, extended with Critical Questions and support for edge-targeting (warrants can attach to inference edges, not just nodes).</p>
<p><strong>Walton's Argumentation Schemes</strong> (2008) — Warrants are classified using Walton, Reed & Macagno's scheme typology (Cause-Effect, Analogy, Expert Opinion, etc.), each with scheme-specific Critical Questions that can be auto-generated.</p>
<p><strong>Warrantee Analysis</strong> — The Warrantee module provides fine-grained scheme analysis: Bayesian probability modelling for causal and means-end reasoning, Venn-based similarity/difference analysis for analogy and comparison, weighted multi-criteria source reliability assessment, and hierarchical description analysis with whole-part/attribute decomposition supporting drag-copy and edit-convert operations.</p>
<p><strong>Dual Role (Claim‑X)</strong> — When any node (Premise, Warrant, Backing, Critical Question, Rebuttal, or Qualifier) receives a support edge from a Premise node, it is automatically promoted to a dual-role "Claim‑X" node (e.g. Claim‑Premise, Claim‑Warrant), reflecting its dual role as both an intermediate conclusion and its original function in the argument.</p>
</div></div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">ℹ️ About</h2><div className="space-y-2 text-sm text-gray-600">
<div className="flex"><span className="font-semibold text-gray-500 flex-shrink-0" style={{width:112}}>Designer</span><span>LAM Wai Ip 林葦葉 (HKU)</span></div>
<div className="flex"><span className="font-semibold text-gray-500 flex-shrink-0" style={{width:112}}>Developer</span><span>Claude (Anthropic)</span></div>
<div className="flex"><span className="font-semibold text-gray-500 flex-shrink-0" style={{width:112}}>Version</span><span>{APP_VERSION}</span></div>
</div></div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">📜 License</h2><p className="text-sm text-gray-600 mb-3">Free for educational and research purposes.</p><div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-900 italic">Lam, W. I. (2026). <em>ArgWarrantee: Post-Toulmin Argumentation Structure and Scheme Analysis Platform.</em></div></div>

<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5"><h2 className="text-base font-bold text-gray-700 mb-3">📧 Feedback</h2><div className="space-y-3 text-sm"><div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><span className="text-lg">🌐</span><a href="https://web.edu.hku.hk/faculty-academics/jwilam" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">web.edu.hku.hk/faculty-academics/jwilam</a></div><div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><span className="text-lg">📧</span><a href="mailto:jwilam@hku.hk" className="text-indigo-600 hover:underline">jwilam@hku.hk</a></div></div></div>

</div></div>);

const mBtn=(m,icon,label)=>(<button onClick={()=>{setMode(m);setConnFrom(null)}} className={'flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap '+(mode===m?'bg-gray-800 text-white shadow-lg':'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50')}>{icon} {label}</button>);

return(
  <div className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden">
    <style>{`[contenteditable] ul{list-style-type:disc;padding-left:1.5em;margin:0.25em 0}[contenteditable] ol{list-style-type:decimal;padding-left:1.5em;margin:0.25em 0}[contenteditable] li{display:list-item;margin:0.1em 0}`}</style>
    <div className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4"><h1 className="text-white font-bold text-sm tracking-wide cursor-pointer select-none" onClick={()=>setActivePage('workspace')}>𝒜rg🆆arrantee</h1><span className="text-white/40 text-xs hidden md:inline">Argumentation Structure & Scheme Analysis</span><nav className="flex bg-white/10 rounded-lg p-0.5"><button onClick={()=>setActivePage('workspace')} className={'px-3 py-1 rounded-md text-xs font-semibold transition-all '+(activePage==='workspace'?'bg-white/25 text-white shadow-sm':'text-white/60 hover:text-white hover:bg-white/10')}>Canvas</button><button onClick={()=>setActivePage('help')} className={'px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 '+(activePage==='help'?'bg-white/25 text-white shadow-sm':'text-white/60 hover:text-white hover:bg-white/10')}><HelpCircle size={11}/>Help</button></nav></div>
      <div className="flex items-center gap-1"><span className="text-white/30 text-xs mr-2 hidden sm:inline">v{APP_VERSION}</span><button onClick={saveProject} className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors" title="Save"><Save size={14}/></button><button onClick={loadProject} className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors" title="Load"><FolderOpen size={14}/></button></div>
    </div>
    <div ref={ctnRef} className="flex flex-1 overflow-hidden" style={{display:activePage==='workspace'?'flex':'none',userSelect:dragId||adXY?'none':'auto'}}>
      <div style={{width:ratio+'%'}} className="flex flex-col h-full bg-white flex-shrink-0">
        {/* Shared toolbar */}
        <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 border-b border-gray-200 flex-shrink-0">
          <button onClick={uploadFile} className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"><Upload size={13}/> Upload</button>
          <span className="w-px h-5 bg-gray-300 mx-0.5"/>
          <RichToolbar compact={false} editorRef={edRef}/>
          <span className="w-px h-5 bg-gray-300 mx-0.5"/>
          <select onChange={e=>exec('fontSize',e.target.value)} defaultValue="3" className="text-xs border rounded px-1 py-1"><option value="1">S</option><option value="3">M</option><option value="5">L</option><option value="7">XL</option></select>
          <input type="color" onChange={e=>exec('foreColor',e.target.value)} defaultValue="#000000" className="w-6 h-6 rounded cursor-pointer border" title="Text color"/>
          <input type="color" onChange={e=>exec('hiliteColor',e.target.value)} defaultValue="#ffff00" className="w-6 h-6 rounded cursor-pointer border" title="Highlight color"/>
          <span className="w-px h-5 bg-gray-300 mx-0.5"/>
          <button onMouseDown={e=>{e.preventDefault();if(srcCropImgRef.current)setSrcCropModal({imgEl:srcCropImgRef.current,src:srcCropImgRef.current.src})}} className={'hover:bg-gray-200 rounded transition-colors p-1.5 text-xs font-bold '+(srcCropImgRef.current?'text-blue-600':'text-gray-300 cursor-not-allowed')} title="Crop selected image (click an image first)">✂</button>
        </div>

        {/* Shared text editor — always shown */}
        <div className="overflow-auto p-2" style={{flex:activeTab==='argmap'?'0 0 auto':'1 1 0%',maxHeight:activeTab==='argmap'?'60%':undefined,minHeight:120,resize:activeTab==='argmap'?'vertical':'none'}}>
          <div ref={edRef} contentEditable suppressContentEditableWarning className="w-full h-full min-h-32 p-3 border border-gray-300 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white overflow-auto" style={{wordBreak:'break-word'}} onFocus={()=>{if(edRef.current?.textContent?.trim()==='Paste or type your text here...')edRef.current.innerHTML=''}} onClick={e=>{const t=e.target;if(t.tagName==='IMG'){srcCropImgRef.current=t;t.style.outline='3px solid #3b82f6';edRef.current?.querySelectorAll('img').forEach(i=>{if(i!==t)i.style.outline=''})}else{srcCropImgRef.current=null;edRef.current?.querySelectorAll('img').forEach(i=>{i.style.outline=''})}}} onDoubleClick={e=>{const t=e.target;if(t.tagName==='IMG'){e.preventDefault();e.stopPropagation();srcCropImgRef.current=t;setSrcCropModal({imgEl:t,src:t.src})}}}><p style={{color:'#aaa'}}>Paste or type your text here...</p></div>
        </div>

        {/* ═══ Reactive Controls ═══ */}
{activeTab==='argmap' ? (
          /* ─── ArgMap Controls ─── */
          <div className="flex-1 overflow-hidden flex flex-col border-t border-gray-200">
            {/* Top-level Human / AI toggle */}
            <div className="flex flex-shrink-0 border-b border-gray-200 bg-gray-50">
              <button onClick={()=>{setLeftPanelMode('human');if(!['text','layout','scheme'].includes(amSidebarTab))setAmSidebarTab('text')}} className={"flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all "+(leftPanelMode==='human'?"text-indigo-700 bg-white border-b-2 border-indigo-600 shadow-sm":"text-gray-400 hover:text-gray-600")}>🧠 Human</button>
              <button onClick={()=>setLeftPanelMode('ai')} className={"flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all "+(leftPanelMode==='ai'?"text-amber-700 bg-amber-50 border-b-2 border-amber-500 shadow-sm":"text-gray-400 hover:text-gray-600")}><Sparkles size={12}/>AI</button>
            </div>

            {leftPanelMode==='human' ? (<>
              {/* Human sub-tabs */}
              <div className="flex border-b border-gray-200 flex-shrink-0">{['text','layout','scheme'].map(t=><button key={t} onClick={()=>setAmSidebarTab(t)} className={"flex-1 px-2 py-2 text-xs font-semibold uppercase tracking-wider transition-colors "+(amSidebarTab===t?"text-blue-600 border-b-2 border-blue-600 bg-blue-50":"text-gray-400 hover:text-gray-600")}>{t==='text'?'Text':t==='layout'?'Layout':'Scheme'}</button>)}</div>
              <div className="flex-1 overflow-y-auto p-3">
              {amSidebarTab==='text'&&<div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 mb-1">Create Node from Selection</h3>
                <p className="text-xs text-gray-400 mb-2">Select text/images above, then click a type:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[['claim','Claim'],['data','Premise']].map(([k,l])=>{const c=AM_NODE_TYPES[k];const I=c.Icon;return <button key={k} onClick={()=>amAddNodeFromSelection(k)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border hover:shadow-sm bg-white" style={{borderColor:c.color,color:c.color}}><I size={12}/>{l}</button>})}
                </div>
                <button onClick={()=>amAddNodeFromSelection('warrant')} className="mt-1.5 w-full flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border hover:shadow-sm bg-white" style={{borderColor:AM_NODE_TYPES.warrant.color,color:AM_NODE_TYPES.warrant.color}}><ArrowRight size={12}/>Warrant</button>
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  {[['backing','Backing'],['cq','Critical Q'],['rebuttal','Rebuttal'],['qualifier','Qualifier']].map(([k,l])=>{const c=AM_NODE_TYPES[k];const I=c.Icon;return <button key={k} onClick={()=>amAddNodeFromSelection(k)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border hover:shadow-sm bg-white" style={{borderColor:c.color,color:c.color}}><I size={12}/>{l}</button>})}
                </div>
                <div className="mt-3 p-2 rounded-lg bg-cyan-50 border border-cyan-100">
                  <p className="text-xs text-cyan-700 font-medium flex items-center gap-1"><Info size={11}/>Dual Role (Serial Argument)</p>
                  <p className="text-xs text-cyan-600 mt-0.5">When any node (Premise, Warrant, Backing, etc.) is supported by a Premise node, it automatically becomes a <b style={{color:'#0891b2'}}>Claim‑X</b> dual-role node (e.g. Claim‑Premise, Claim‑Warrant).</p>
                </div>
              </div>}

              {amSidebarTab==='layout'&&<>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Add Nodes</h3>
                <div className="grid grid-cols-2 gap-1.5 mb-1.5"><AmNodeTypeButton type="claim" onClick={()=>amAddNode('claim')}/><AmNodeTypeButton type="data" onClick={()=>amAddNode('data')}/></div>
                <div className="mb-1.5 rounded-lg border border-purple-200 overflow-hidden">
                  <div className="flex items-center"><button onClick={()=>amAddNode('warrant')} className="flex-1 flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium hover:bg-purple-50" style={{color:AM_NODE_TYPES.warrant.color}}><ArrowRight size={13}/>Add Warrant</button><button onClick={()=>setAmWarrantTreeOpen(p=>({...p,_main:!p._main}))} className="px-2 py-2 hover:bg-purple-50" style={{color:AM_NODE_TYPES.warrant.color}}>{amWarrantTreeOpen._main?<ChevronDown size={14}/>:<ChevronRight size={14}/>}</button></div>
                  {amWarrantTreeOpen._main&&<div className="border-t border-purple-100">{Object.entries(AM_WALTON_TYPES).map(([k,d],i)=>{const hs=Object.keys(d.subs).length>0,io=amWarrantTreeOpen[k];return <div key={k} className={i>0?"border-t border-purple-50":""}><button onClick={()=>{if(hs)setAmWarrantTreeOpen(p=>({...p,[k]:!p[k]}));else amAddNode('warrant',k,null,`Warrant (${d.short})`)}} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50">{hs?(io?<ChevronDown size={12}/>:<ChevronRight size={12}/>):<Plus size={12}/>}<span className="flex-1 text-left">{d.label}</span></button>{hs&&io&&<div className="bg-purple-50 border-t border-purple-100">{Object.entries(d.subs).map(([sk,sl])=><button key={sk} onClick={()=>amAddNode('warrant',k,sk,`Warrant (${d.short} > ${sl})`)} className="flex items-center gap-1.5 w-full px-4 py-1.5 text-xs text-purple-500 hover:bg-purple-100"><Plus size={11}/>{sl}</button>)}</div>}</div>})}</div>}
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-1.5"><AmNodeTypeButton type="backing" onClick={()=>amAddNode('backing')}/><AmNodeTypeButton type="cq" label="Critical Q" onClick={()=>amAddNode('cq')}/></div>
                <div className="grid grid-cols-2 gap-1.5 mb-3"><AmNodeTypeButton type="rebuttal" onClick={()=>amAddNode('rebuttal')}/><AmNodeTypeButton type="qualifier" onClick={()=>amAddNode('qualifier')}/></div>

                {amSelectedNode&&<div className="mb-4"><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Selected Node</h3>
                  <div className="p-3 rounded-lg border-2" style={{borderColor:(AM_NODE_TYPES[amSelectedNode.type]||AM_NODE_TYPES.data).color,background:(AM_NODE_TYPES[amSelectedNode.type]||AM_NODE_TYPES.data).color+"11"}}>
                    <div className="text-xs font-bold mb-0.5" style={{color:(AM_NODE_TYPES[amSelectedNode.type]||AM_NODE_TYPES.data).color}}>{(AM_NODE_TYPES[amSelectedNode.type]||AM_NODE_TYPES.data).label}</div>
                    {amIsWarrantType(amSelectedNode.type)&&amGetWarrantTag(amSelectedNode)&&<div className="text-xs text-purple-500 mb-0.5 font-medium">{amGetWarrantTag(amSelectedNode)}</div>}
                    <div className="text-xs text-gray-700 mb-2 break-words leading-relaxed rc" dangerouslySetInnerHTML={{__html:amSelectedNode.text}}/>
                    <div className="flex gap-1.5"><button onClick={()=>amStartEditing(amSelectedNodeId)} className="flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs text-gray-600 hover:text-blue-600 shadow-sm border border-gray-200"><Edit3 size={11}/>Edit</button><button onClick={()=>amDeleteNode(amSelectedNodeId)} className="flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs text-gray-600 hover:text-red-600 shadow-sm border border-gray-200"><Trash2 size={11}/>Delete</button></div>
                    {amIsWarrantType(amSelectedNode.type)&&<div className="mt-3 pt-3 border-t border-purple-200">
                      <div className="text-xs font-semibold text-purple-700 mb-1.5 flex items-center gap-1">🆆 Linked Warrantee Canvas</div>
                      <div className="flex items-center gap-1.5">
                        <select value={amSelectedNode.linkedWarranteeTabId||''} onChange={e=>{const val=e.target.value||null;amSetNodes(p=>p.map(n=>n.id!==amSelectedNodeId?n:{...n,linkedWarranteeTabId:val}))}} className="flex-1 border rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 border-purple-200 focus:ring-purple-400">
                          <option value="">— Not linked —</option>
                          {warranteeTabs.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                        <button onClick={()=>{if(amSelectedNode.linkedWarranteeTabId)switchTab(amSelectedNode.linkedWarranteeTabId)}} disabled={!amSelectedNode.linkedWarranteeTabId} className={"flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all "+(amSelectedNode.linkedWarranteeTabId?"bg-purple-600 text-white hover:bg-purple-700 shadow-sm":"bg-gray-100 text-gray-300 cursor-not-allowed")}>Go →</button>
                      </div>
                      <p className="text-[10px] text-purple-400 mt-1 italic">Link this warrant to a Warrantee canvas for detailed scheme analysis.</p>
                    </div>}
                  </div>
                </div>}

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 mb-1.5">Edge Legend</h4>
                  {Object.entries(AM_EDGE_STYLES).map(([k,c])=><div key={k} className="flex items-center gap-2 mb-1"><svg width="28" height="10">{c.arrow?<line x1="0" y1="5" x2="28" y2="5" stroke={c.color} strokeWidth="2" strokeDasharray={c.dash||undefined}/>:<><line x1="4" y1="5" x2="24" y2="5" stroke={c.color} strokeWidth="3" strokeLinecap="round"/><circle cx="4" cy="5" r="3" fill={c.color}/><circle cx="24" cy="5" r="3" fill={c.color}/></>}</svg><span className="text-xs text-gray-500">{c.label}</span></div>)}
                </div>
              </>}

              {amSidebarTab==='scheme'&&<>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Argumentation Schemes</h3>
                <p className="text-xs text-gray-400 mb-3">Load a pre-built Toulmin layout.</p>
                <div className="space-y-2">{AM_SCHEMES.map((s,i)=><button key={i} onClick={()=>amLoadScheme(s.generate)} className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"><div className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">{s.name}</div><div className="text-xs text-gray-400 mt-0.5">{s.desc}</div></button>)}</div>
              </>}
              </div>
            </>) : (<>
              {/* ═══ AI Sub-tabs ═══ */}
              <div className="flex border-b border-gray-200 flex-shrink-0">{[{k:'provider',l:'Provider'},{k:'generate',l:'Generate'},{k:'analyse',l:'Analyse'}].map(t=><button key={t.k} onClick={()=>setAiSubTab(t.k)} className={"flex-1 px-2 py-2 text-xs font-semibold uppercase tracking-wider transition-colors "+(aiSubTab===t.k?"text-amber-600 border-b-2 border-amber-500 bg-amber-50":"text-gray-400 hover:text-gray-600")}>{t.l}</button>)}</div>
              <div className="flex-1 overflow-y-auto p-3">

              {/* ── AI Provider sub-tab ── */}
              {aiSubTab==='provider'&&<div className="space-y-3">
                <div className="flex items-center gap-2 mb-1"><Sparkles size={16} className="text-amber-500"/><h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">AI Provider & Model</h3></div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                  <div><label className="text-xs font-semibold text-gray-600 mb-1 block">AI Provider</label><select value={aiProvider} onChange={e=>{const v=e.target.value;setAiProvider(v);setAiModel(AI_PROVIDERS[v].defaultModel);setAiError('')}} className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">{Object.entries(AI_PROVIDERS).map(([k,p])=><option key={k} value={k}>{p.label}</option>)}</select></div>
                  <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Model</label><select value={aiModel} onChange={e=>setAiModel(e.target.value)} className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">{AI_PROVIDERS[aiProvider].models.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
                  {aiProvider==='alibaba'&&<div><label className="text-xs font-semibold text-gray-600 mb-1 block">Region</label><select value={aiAlibabaRegion} onChange={e=>setAiAlibabaRegion(e.target.value)} className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">{Object.entries(ALIBABA_REGIONS).map(([k,r])=><option key={k} value={k}>{r.label}</option>)}</select><p className="text-xs text-gray-400 mt-1 italic">Select the region matching your API key. Keys are region-locked.</p></div>}
                  <div><label className="text-xs font-semibold text-gray-600 mb-1 block">API Key</label><div className="flex gap-1"><input type={aiShowKey?'text':'password'} value={aiApiKey} onChange={e=>setAiApiKey(e.target.value)} placeholder={aiProvider==='gemini'?'AIza...':'sk-...'} className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"/><button onClick={()=>setAiShowKey(v=>!v)} className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-500" title={aiShowKey?'Hide':'Show'}>{aiShowKey?<EyeOff size={13}/>:<Eye size={13}/>}</button></div><p className="text-xs text-gray-400 mt-1 italic">Your key is stored in memory only — never sent to our servers.</p></div>
                </div>
                {aiError&&<div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700"><strong>Error:</strong> {aiError}</div>}
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500 space-y-1">
                  <div className="font-bold text-gray-600">Provider Notes</div>
                  <div><strong>OpenAI</strong> — Best quality. Get key at platform.openai.com</div>
                  <div><strong>Gemini</strong> — Free tier available. Get key at aistudio.google.com</div>
                  <div><strong>Alibaba (Qwen)</strong> — Great for Chinese text. Get key at modelstudio.console.alibabacloud.com. Select the region matching where your API key was created.</div>
                  <div><strong>DeepSeek</strong> — Cost-effective. Get key at platform.deepseek.com</div>
                </div>
              </div>}

              {/* ── Generate Discourse sub-tab ── */}
              {aiSubTab==='generate'&&<div className="space-y-3">
                <div className="flex items-center gap-2 mb-1"><Send size={16} className="text-amber-500"/><h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Generate Discourse</h3></div>
                {!aiApiKey.trim()&&<div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center gap-1.5"><Info size={12}/>Set your API key in the <button onClick={()=>setAiSubTab('provider')} className="font-bold underline">Provider</button> tab first.</div>}
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-2"><label className="text-xs font-semibold text-amber-700 block">Topic</label><textarea value={aiTopic} onChange={e=>setAiTopic(e.target.value)} placeholder="e.g. Should social media platforms be held legally responsible for misinformation spread by their users?" rows={3} className="w-full border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"/></div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-2"><label className="text-xs font-semibold text-gray-600 block">Text Length</label><div className="space-y-1.5">{Object.entries(AI_TEXT_LENGTHS).map(([k,v])=>(<label key={k} className={"flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all "+(aiTextLength===k?"border-amber-400 bg-amber-50 shadow-sm":"border-gray-200 bg-white hover:border-gray-300")}><input type="radio" name="aiLen" value={k} checked={aiTextLength===k} onChange={()=>setAiTextLength(k)} className="mt-0.5 accent-amber-500"/><div className="flex-1"><div className="text-xs font-semibold text-gray-700">{v.label}</div><div className="text-xs text-gray-400">{v.words} · {v.desc}</div></div></label>))}</div></div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-2"><label className="text-xs font-semibold text-gray-600 block">Output Language</label><div className="flex gap-2">{[{k:'en',label:'🔤 English'},{k:'zh',label:'🈑  中文'}].map(opt=>(<label key={opt.k} className={"flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border cursor-pointer transition-all text-xs font-semibold "+(aiLang===opt.k?"border-amber-400 bg-amber-50 shadow-sm text-amber-700":"border-gray-200 bg-white hover:border-gray-300 text-gray-600")}><input type="radio" name="aiLang" value={opt.k} checked={aiLang===opt.k} onChange={()=>setAiLang(opt.k)} className="accent-amber-500"/>{opt.label}</label>))}</div></div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-2"><label className="text-xs font-semibold text-gray-600 block">Reader Level</label><div className="space-y-1.5">{[{k:'regular',label:'Regular',desc:'Standard academic / essay-level prose'},{k:'secondary',label:'Secondary Students',desc:'Ages 12–17 · Clear vocabulary, concrete examples'},{k:'primary',label:'Primary Students',desc:'Ages 6–11 · Simple words, short sentences, friendly tone'}].map(opt=>(<label key={opt.k} className={"flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all "+(aiReaderLevel===opt.k?"border-amber-400 bg-amber-50 shadow-sm":"border-gray-200 bg-white hover:border-gray-300")}><input type="radio" name="aiReader" value={opt.k} checked={aiReaderLevel===opt.k} onChange={()=>setAiReaderLevel(opt.k)} className="mt-0.5 accent-amber-500"/><div className="flex-1"><div className="text-xs font-semibold text-gray-700">{opt.label}</div><div className="text-xs text-gray-400">{opt.desc}</div></div></label>))}</div></div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-2"><label className="text-xs font-semibold text-gray-600 block">Argument Structure</label><label className={"flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all "+(aiStructure.useDefault?"border-amber-400 bg-amber-50":"border-gray-200 bg-white")}><input type="checkbox" checked={aiStructure.useDefault} onChange={e=>setAiStructure(p=>({...p,useDefault:e.target.checked}))} className="accent-amber-500"/><div><div className="text-xs font-semibold text-gray-700">Default (free generation)</div><div className="text-xs text-gray-400">AI generates natural argumentative prose without structural constraints</div></div></label><div className={"space-y-1 transition-opacity "+(aiStructure.useDefault?"opacity-40 pointer-events-none":"opacity-100")}>{[{key:'claim',label:'Claim',desc:'A clear thesis statement or position'},{key:'premises',label:'Premises',desc:'Supporting evidence or reasons (≥2)'},{key:'warrant',label:'Warrant',desc:'The reasoning principle connecting evidence to claim'},{key:'backing',label:'Backing',desc:'The underlying knowledge base that validates the warrant'},{key:'criticalQuestion',label:'Critical Question / Rebuttal',desc:'A counterargument or challenge'},{key:'qualifier',label:'Qualifier',desc:'Degree of certainty (e.g. "probably")'}].map(item=>(<label key={item.key} className={"flex items-center gap-2 px-2 py-1.5 rounded-lg border cursor-pointer transition-all "+(aiStructure[item.key]?"border-blue-300 bg-blue-50":"border-gray-100 bg-white hover:border-gray-200")}><input type="checkbox" checked={aiStructure[item.key]} onChange={e=>setAiStructure(p=>({...p,[item.key]:e.target.checked}))} disabled={aiStructure.useDefault} className="accent-blue-500"/><div><div className="text-xs font-semibold text-gray-700">{item.label}</div><div className="text-xs text-gray-400">{item.desc}</div></div></label>))}</div>{!aiStructure.useDefault&&!aiStructure.claim&&!aiStructure.premises&&!aiStructure.warrant&&!aiStructure.criticalQuestion&&!aiStructure.qualifier&&(<div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">⚠ No elements selected — the AI will generate freely (same as Default).</div>)}</div>
                <button onClick={aiGenerateDiscourse} disabled={aiGenerating||!aiApiKey.trim()||!aiTopic.trim()} className={"w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all "+(aiGenerating||!aiApiKey.trim()||!aiTopic.trim()?"bg-gray-200 text-gray-400 cursor-not-allowed":"bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 active:scale-98")}>{aiGenerating?<><Loader2 size={15} className="animate-spin"/>Generating...</>:<><Send size={14}/>Generate Discourse</>}</button>
                {aiError&&<div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700"><strong>Error:</strong> {aiError}</div>}
                {aiResult&&<div className="p-3 rounded-lg bg-green-50 border border-green-200 space-y-2"><div className="flex items-center justify-between"><span className="text-xs font-bold text-green-700">✅ Generated Discourse</span><span className="text-xs text-green-500">{aiResult.split(/\s+/).length} words</span></div><div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-white rounded-lg p-3 border border-green-100 max-h-52 overflow-y-auto">{aiResult}</div><div className="flex gap-1.5"><button onClick={aiContinueDiscourse} disabled={aiContinuing||aiGenerating} className={"flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors "+(aiContinuing?"bg-amber-300 text-amber-800 cursor-wait":"bg-amber-500 hover:bg-amber-600 text-white")}>{aiContinuing?<><Loader2 size={12} className="animate-spin"/>Continuing...</>:<><ArrowRight size={12}/>Continue</>}</button><button onClick={aiInsertToEditor} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"><Upload size={12}/>Insert to Editor</button><button onClick={aiCopyResult} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold transition-colors"><Copy size={12}/>Copy</button></div><p className="text-xs text-green-500 italic">After inserting, select text in the editor to create ArgMap or Warrantee nodes. Click Continue if the text appears cut off.</p></div>}
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 leading-relaxed space-y-1.5"><div className="font-bold flex items-center gap-1"><Info size={11}/>How it works</div><div>1. Set your API key in the <strong>Provider</strong> tab</div><div>2. Type a topic and select length & structure options</div><div>3. Click <strong>Generate</strong> — the AI creates argumentative text</div><div>4. <strong>Insert to Editor</strong> to add it to the source text panel</div><div>5. Select text in the editor to create ArgMap nodes via the <strong>Human › Text</strong> tab</div></div>
              </div>}

              {/* ── Analyse Text (AAA) sub-tab ── */}
              {aiSubTab==='analyse'&&<div className="space-y-3">
                <div className="flex items-center gap-2 mb-1"><Target size={16} className="text-indigo-500"/><h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Analyse Text (AAA)</h3></div>
                {!aiApiKey.trim()&&<div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center gap-1.5"><Info size={12}/>Set your API key in the <button onClick={()=>setAiSubTab('provider')} className="font-bold underline">Provider</button> tab first.</div>}
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 space-y-2">
                  <p className="text-xs text-indigo-700 leading-relaxed">Analyse the argumentative text in the editor. The AI identifies macro-structure (serial/convergent arguments) and micro-structure (claims, premises, warrants with Walton scheme types, backing, qualifiers, rebuttals, CQs) and builds the ArgMap + Warrantee canvases automatically.</p>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700"><strong>⚠ Note:</strong> This will replace the current ArgMap canvas. New Warrantee tabs will be created for each identified warrant scheme.</div>
                </div>
                {/* Prompt toggle */}
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                  <button onClick={()=>setAaaShowPrompt(v=>!v)} className="flex items-center gap-2 w-full text-left text-xs font-semibold text-gray-600 hover:text-indigo-600 transition-colors">{aaaShowPrompt?<ChevronDown size={13}/>:<ChevronRight size={13}/>}<span>System Prompt</span><span className="text-[10px] font-normal text-gray-400 ml-auto">{aaaShowPrompt?'(editable — this prompt will be sent)':'(using default)'}</span></button>
                  {aaaShowPrompt&&<><textarea value={aaaCustomPrompt} onChange={e=>setAaaCustomPrompt(e.target.value)} rows={12} className="w-full border border-indigo-200 rounded-lg px-2.5 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y font-mono leading-relaxed" style={{minHeight:200}}/><div className="flex items-center justify-between"><span className="text-[10px] text-gray-400">Edit the prompt above to customise AI analysis behaviour.</span><button onClick={()=>setAaaCustomPrompt(AAA_SYSTEM_PROMPT)} className="text-[10px] text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-0.5"><RotateCcw size={9}/>Reset to default</button></div></>}
                </div>
                <button onClick={aiAnalyzeArgument} disabled={aiAnalyzing||!aiApiKey.trim()} className={"w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all "+(aiAnalyzing||!aiApiKey.trim()?"bg-gray-200 text-gray-400 cursor-not-allowed":"bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 active:scale-98")}>{aiAnalyzing?<><Loader2 size={15} className="animate-spin"/>Analysing...</>:<><Target size={14}/>🔍 Analyse Argument Structure</>}</button>
                {aiError&&<div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700"><strong>Error:</strong> {aiError}</div>}
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-600 leading-relaxed space-y-1"><div className="font-semibold">What it creates:</div><div>• <strong>ArgMap</strong> — Nodes for claims, premises, warrants (with Walton scheme type), backing, qualifiers, rebuttals, CQs; edges for support, attack, qualify, question, link</div><div>• <strong>Warrantee tabs</strong> — One per warrant, pre-populated with scheme-appropriate nodes and edges</div><div>• <strong>Serial structure</strong> — Arguments where one claim becomes another's premise are connected</div></div>
              </div>}

              </div>
            </>)}
          </div>
        ) : (
          /* ─── Warrantee Controls ─── */
          <div className="flex gap-2 px-3 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button onMouseDown={addExpr} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors">✦ Expressed</button>
            <button onClick={addUnexpr} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors">✧ Unexpressed</button>
          </div>
        )}
      </div>
      <div className="w-1.5 bg-gray-300 hover:bg-indigo-400 cursor-col-resize flex-shrink-0 transition-colors flex items-center justify-center" onMouseDown={e=>{e.preventDefault();setResizing(true)}} onTouchStart={e=>{e.preventDefault();setResizing(true)}}><div className="w-0.5 h-8 bg-gray-500 rounded-full"/></div>
      <div ref={rpRef} className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        {/* ═══ Tab Bar ═══ */}
        <div className="flex items-center bg-white border-b border-gray-200 px-1 flex-shrink-0 overflow-x-auto" style={{minHeight:36}}>
          {/* ArgMap tab — always shown */}
          <button onClick={()=>switchTab('argmap')} className={"flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap "+(activeTab==='argmap'?"border-blue-600 text-blue-600 bg-blue-50":"border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50")}>𝒜 ArgMap</button>
          <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0"/>
          {/* Warrantee tabs */}
          {warranteeTabs.map(tab=>(
            <div key={tab.id} className="flex items-center group">
              <button onClick={()=>switchTab(tab.id)} className={"flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap "+(activeTab===tab.id?"border-purple-600 text-purple-600 bg-purple-50":"border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50")}><span className="text-sm">🆆</span>{tab.label}</button>
              {warranteeTabs.length>1&&<button onClick={e=>{e.stopPropagation();closeWarranteeTab(tab.id)}} className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" title="Close tab"><X size={11}/></button>}
            </div>
          ))}
          {/* Add tab button */}
          <button onClick={addWarranteeTab} className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-all ml-1 whitespace-nowrap" title="Add Warrantee canvas"><Plus size={13}/>New</button>
        </div>

        {/* ═══ Content Area ═══ */}
		<div className="flex-1 flex flex-col overflow-hidden">
        {activeTab==='argmap' ? renderArgMapPanel() : (
          detailId!==null?renderDetail():(<>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
            {mBtn('select',<MousePointer size={13}/>,'Select')}
            <span className="w-px h-5 bg-gray-300"/>
            {mBtn('connect-sequence',<Clock size={13}/>,'Sequence')}
            {mBtn('connect-cause',<ArrowRight size={13}/>,'Cause→Effect')}
            {mBtn('connect-mean-goal',<Target size={13}/>,'Action→Goal')}
            <span className="w-px h-5 bg-gray-300"/>
            {mBtn('connect-whole',<CircleDot size={13}/>,'Whole○─Part')}
            {mBtn('connect-attribute',<Tag size={13}/>,'Obj◆Attr')}
            <span className="w-px h-5 bg-gray-300"/>
            {mBtn('connect-comparison',<span style={{fontSize:12,fontWeight:700}}>⇌</span>,'Comparison')}
            {mBtn('connect-analogy',<Equal size={13}/>,'Analogy ●═')}
            <span className="w-px h-5 bg-gray-300"/>
            {mBtn('connect-source',<MessageSquare size={13}/>,'Source ⊙')}
            {mBtn('connect-link',<Link2 size={13}/>,'Link')}
            <input type="text" value={linkLabel} onChange={e=>setLinkLabel(e.target.value)} placeholder="label…" className={'px-2 py-1 border rounded-lg text-xs transition-colors '+(mode==='connect-link'?'border-gray-500 bg-white w-20':'border-gray-200 bg-gray-50 text-gray-400 w-16')}/>
            <span className="w-px h-5 bg-gray-300"/>
            {mBtn('delete',<Trash2 size={13}/>,'Delete')}
            <button onClick={clearCanvas} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all whitespace-nowrap" title="Clear Canvas"><X size={13}/> Clear</button>
            <button onClick={undo} disabled={!historyRef2.current.past.length} className={'flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap '+(historyRef2.current.past.length?'bg-orange-50 text-orange-700 border border-orange-300 hover:bg-orange-100':'bg-gray-50 text-gray-300 border border-gray-200 cursor-not-allowed')} title="Undo"><Undo2 size={13}/></button>
            <button onClick={redo} disabled={!historyRef2.current.future.length} className={'flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap '+(historyRef2.current.future.length?'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100':'bg-gray-50 text-gray-300 border border-gray-200 cursor-not-allowed')} title="Redo"><Redo2 size={13}/></button>
            <span className="w-px h-5 bg-gray-300 ml-auto"/>
            <button onClick={zoomOut} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"><ZoomOut size={14}/></button>
            <span className="text-xs font-mono text-gray-600 select-none" style={{minWidth:36,textAlign:'center'}}>{Math.round(zoom*100)}%</span>
            <button onClick={zoomIn} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"><ZoomIn size={14}/></button>
            <button onClick={expandAll} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" title="Expand All"><ChevronsDown size={14}/></button>
            <button onClick={collapseAll} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" title="Collapse All"><ChevronsUp size={14}/></button>
            <button onClick={zoomFit} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" title="Fit"><Maximize size={14}/></button>
            {renderNavBtn()}
            <button onClick={dlCanvas} className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" title="Download"><Download size={14}/></button>
          </div>
          <div className="px-3 py-1.5 text-xs border-b flex-shrink-0" style={{background:mode==='delete'?'#fef2f2':mode.startsWith('connect-')?'#eff6ff':'#f9fafb',color:mode==='delete'?'#b91c1c':mode.startsWith('connect-')?'#1d4ed8':'#6b7280'}}>
            {mode==='select'&&'🖱️ Drag to move · Double-click to edit · Click edge for details · Ctrl+Scroll to zoom'}
            {mode==='connect-sequence'&&(connFrom?'⏱ Now click the LATER event.':'⏱ Click EARLIER first, or drag EARLIER → LATER.')}
            {mode==='connect-cause'&&(connFrom?'⚡ Now click the EFFECT node.':'⚡ Click CAUSE first, or drag CAUSE → EFFECT.')}
            {mode==='connect-mean-goal'&&(connFrom?'🎯 Now click the GOAL node.':'🎯 Click ACTION first, or drag ACTION → GOAL.')}
            {mode==='connect-whole'&&(connFrom?'🔵 Now click the PART node.':'🔵 Click WHOLE first, or drag WHOLE → PART.')}
            {mode==='connect-attribute'&&(connFrom?'◆ Now click the ATTRIBUTE node.':'◆ Click OBJECT first, or drag OBJECT → ATTR.')}
            {mode==='connect-comparison'&&(connFrom?'⇌ Now click the second node.':'⇌ Click first node, or drag Node A → Node B.')}
            {mode==='connect-analogy'&&(connFrom?'🟰 Now click the TARGET node.':'🟰 Click BASE first, or drag BASE → TARGET.')}
            {mode==='connect-source'&&(connFrom?'📋 Now click the ASSERTION node.':'📋 Click SOURCE first, or drag SOURCE → ASSERTION.')}
            {mode==='connect-link'&&(connFrom?'🔗 Now click the second node.':'🔗 Click first node, or drag FROM → TO.')}
            {mode==='delete'&&'🗑️ Click any node or edge to remove it.'}
          </div>
          <div ref={cvRef} className="flex-1 relative overflow-auto" style={{backgroundImage:'radial-gradient(circle,#d1d5db 1px,transparent 1px)',backgroundSize:'24px 24px'}} onMouseDown={e=>{if(!e.target.closest('[data-node]'))setConnFrom(null)}}>
            <div style={{width:csz.w*zoom,height:csz.h*zoom,position:'relative'}}><div style={{transform:'scale('+zoom+')',transformOrigin:'0 0',width:csz.w,height:csz.h,position:'absolute',top:0,left:0}}>
              <svg className="absolute top-0 left-0 pointer-events-none" style={{width:csz.w,height:csz.h,zIndex:1}}>
                <defs>
                  <marker id="ah" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#dc2626"/></marker>
                  <marker id="ah-seq" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0d9488"/></marker>
                  <marker id="ah-mg" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#b45309"/></marker>
                  <marker id="ah-cmp-s" viewBox="0 0 10 7" refX="1" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="10 0,0 3.5,10 7" fill="#be185d"/></marker>
                  <marker id="ah-cmp-e" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#be185d"/></marker>
                </defs>
                <g style={{pointerEvents:'auto'}}>{renderEdges()}</g>
              </svg>
			                {dragLine&&mode.startsWith('connect-')&&(()=>{const cc2=TYPE_META[mode.replace('connect-','')]?.color||'#6b7280';return(
                <svg className="absolute top-0 left-0 pointer-events-none" style={{width:csz.w,height:csz.h,zIndex:10}}>
                  <defs><marker id="drag-arr" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill={cc2}/></marker></defs>
                  <line x1={dragLine.x1} y1={dragLine.y1} x2={dragLine.x2} y2={dragLine.y2} stroke={cc2} strokeWidth={2.5} strokeDasharray="8 4" strokeLinecap="round" markerEnd="url(#drag-arr)"/>
                  <circle cx={dragLine.x1} cy={dragLine.y1} r={6} fill={cc2} opacity={0.4}/>
                </svg>)})()}
              {nodes.filter(n=>visibleNodeIds.has(n.id)).map(nd=>{const cc=childCounts[nd.id]||0;const vcc=visibleChildCounts[nd.id]||0;const showH=nd.collapsed===true||(cc>0&&vcc===0);return(
                <div key={nd.id} data-node="1" ref={el=>{if(el)nodeElsRef.current[nd.id]=el;else delete nodeElsRef.current[nd.id]}}
  className={'absolute rounded-lg shadow-md border-2 transition-shadow '+(nd.type==='expressed'?'bg-emerald-50 border-emerald-400':'bg-amber-50 border-amber-400')+' '+(connFrom===nd.id?'ring-2 ring-blue-500 ring-offset-2':'')+' '+(mode==='delete'?'hover:border-red-500 hover:bg-red-50':'hover:shadow-lg')+(dragLine&&dragConnRef.current.fromId===nd.id?' ring-4 ring-indigo-400':'')+(dragLine&&dragConnRef.current.fromId&&dragConnRef.current.fromId!==nd.id?' hover:ring-4 hover:ring-green-400':'')}
  style={{left:nd.x,top:nd.y,minWidth:120,maxWidth:240,zIndex:dragId===nd.id?20:2,cursor:mode==='select'?(dragId===nd.id?'grabbing':'grab'):mode==='delete'?'pointer':'crosshair',touchAction:'none'}}
  onMouseDown={e=>{e.stopPropagation();nodeDown(nd.id,e);onConnDragStart(nd.id,e)}} onTouchStart={e=>{e.preventDefault();e.stopPropagation();nodeDown(nd.id,e)}} onMouseUp={()=>onConnDragEnd(nd.id)} onDoubleClick={()=>nodeDbl(nd.id)}>
                  <div className={'px-2 py-0.5 text-xs font-bold rounded-t-md '+(nd.type==='expressed'?'bg-emerald-500 text-white':'bg-amber-500 text-white')}>{nd.type==='expressed'?'✦ Expressed':'✧ Unexpressed'}</div>
                  <div className="px-2 py-2 text-sm" style={{wordBreak:'break-word'}} dangerouslySetInnerHTML={{__html:nd.html}}/>
                  {cc>0&&(<div className={'px-2 py-1 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer border-t transition-colors select-none '+(showH?'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100':'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100')+' rounded-b-md'} onMouseDown={e=>e.stopPropagation()} onTouchStart={e=>{e.preventDefault();e.stopPropagation()}} onClick={e=>{e.stopPropagation();toggleCollapse(nd.id)}}>{showH?'▶':'▼'} {cc} {cc===1?'child':'children'}{showH?' (hidden)':''}</div>)}
                </div>)})}
            </div></div>
            {nodes.length===0&&(<div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-center text-gray-400"><div className="text-4xl mb-3">🆆️</div><div className="text-base font-medium mb-1">Warrantee Canvas</div><div className="text-xs">Select text → <strong>✦ Expressed</strong> · Or <strong>✧ Unexpressed</strong></div></div></div>)}
          </div>
        </>)
        )}
		</div>
      </div>
    </div>
    {activePage==='help'&&renderHelp()}
    {adXY&&adRef.current&&detailId!==null&&(<div className="fixed pointer-events-none" style={{zIndex:200,left:adXY.x,top:adXY.y,transform:'translate(-50%,-50%)'}}><div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-xl" style={{background:adRef.current.bg,border:'2px solid '+adRef.current.c,color:adRef.current.c,opacity:0.9}}>{adRef.current.icons&&<span>{adRef.current.icons}</span>}<span className="truncate" style={{maxWidth:100}}>{adRef.current.text}</span></div></div>)}
	{/* ═══ ArgMap CSS ═══ */}
    <style dangerouslySetInnerHTML={{__html:AM_RICH_CONTENT_CSS}}/>

    {/* ═══ ArgMap Edit Modal ═══ */}
    <AnimatePresence>{amEditNodeId&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 flex items-center justify-center" style={{zIndex:100,background:'rgba(0,0,0,.4)'}} onClick={()=>setAmEditNodeId(null)}>
      <motion.div initial={{scale:.92,y:16}} animate={{scale:1,y:0}} exit={{scale:.92,y:16}} className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-lg mx-4" style={{maxHeight:'90vh',overflow:'visible'}} onClick={e=>e.stopPropagation()}>
        <div style={{maxHeight:'85vh',overflowY:'auto',overflowX:'visible'}}>
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-gray-800">Edit {amEditingNode?AM_NODE_TYPES[amEditingNode.type]?.label||'Node':'Node'}</h3><div className="flex items-center gap-2"><span className="text-xs text-gray-400">Ctrl+Enter to save</span><button onClick={()=>setAmEditNodeId(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} className="text-gray-400"/></button></div></div>
          {amEditingNode&&amIsWarrantType(amEditingNode.type)&&<div className="mb-4 p-3 rounded-lg bg-purple-50 border border-purple-200 space-y-2.5">
            <div><label className="text-xs font-semibold text-purple-700 mb-1 block">Warrant Type</label><select value={amEditWarrantType||''} onChange={e=>{setAmEditWarrantType(e.target.value||null);setAmEditWarrantSubtype(null);setAmEditCustomTypeName('');setAmEditCustomSubtypeName('')}} className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 border-purple-300 focus:ring-purple-400"><option value="">(not assigned)</option>{Object.entries(AM_WALTON_TYPES).map(([k,d])=><option key={k} value={k}>{d.label}</option>)}</select></div>
            {amEditWarrantType&&AM_WALTON_TYPES[amEditWarrantType]&&Object.keys(AM_WALTON_TYPES[amEditWarrantType].subs).length>0&&<div><label className="text-xs font-semibold text-purple-700 mb-1 block">Subtype</label><select value={amEditWarrantSubtype||''} onChange={e=>setAmEditWarrantSubtype(e.target.value||null)} className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 border-purple-300 focus:ring-purple-400"><option value="">(not assigned)</option>{Object.entries(AM_WALTON_TYPES[amEditWarrantType].subs).map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></div>}
            {amEditWarrantType==='custom'&&!amEditWarrantSubtype&&<><div><label className="text-xs font-semibold text-purple-700 mb-1 block">Custom Type Name</label><input value={amEditCustomTypeName} onChange={e=>setAmEditCustomTypeName(e.target.value)} placeholder="Enter type name..." className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 border-purple-300 focus:ring-purple-400"/></div><div><label className="text-xs font-semibold text-purple-700 mb-1 block">Custom Subtype</label><input value={amEditCustomSubtypeName} onChange={e=>setAmEditCustomSubtypeName(e.target.value)} placeholder="Enter subtype..." className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 border-purple-300 focus:ring-purple-400"/></div></>}
            <div className="pt-2.5 mt-1 border-t border-purple-200">
              <label className="text-xs font-semibold text-purple-700 mb-1.5 block flex items-center gap-1">🆆 Linked Warrantee Canvas</label>
              <div className="flex items-center gap-1.5">
                <select value={amEditingNode?.linkedWarranteeTabId||''} onChange={e=>{const val=e.target.value||null;amSetNodes(p=>p.map(n=>n.id!==amEditNodeId?n:{...n,linkedWarranteeTabId:val}))}} className="flex-1 border rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 border-purple-200 focus:ring-purple-400">
                  <option value="">— Not linked —</option>
                  {warranteeTabs.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <button onClick={()=>{if(amEditingNode?.linkedWarranteeTabId){setAmEditNodeId(null);switchTab(amEditingNode.linkedWarranteeTabId)}}} disabled={!amEditingNode?.linkedWarranteeTabId} className={"flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all "+(amEditingNode?.linkedWarranteeTabId?"bg-purple-600 text-white hover:bg-purple-700 shadow-sm":"bg-gray-100 text-gray-300 cursor-not-allowed")}>Go →</button>
              </div>
              <p className="text-[10px] text-purple-400 mt-1 italic">Link this warrant to a Warrantee canvas for detailed scheme analysis.</p>
            </div>
          </div>}
          <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Content</label><AmRichTextEditor key={amEditNodeId} initialValue={amEditText} onChange={setAmEditText} onSave={amSaveEdit} placeholder="Type here…" minHeight={140}/></div>
          <div className="flex justify-end gap-2 mt-4"><button onClick={()=>setAmEditNodeId(null)} className="px-4 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg font-medium">Cancel</button><button onClick={amSaveEdit} className="px-4 py-1.5 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-sm">Save</button></div>
        </div>
      </motion.div>
    </motion.div>}</AnimatePresence>

    {/* ═══ ArgMap CQ Modal ═══ */}
    <AnimatePresence>{amCqModal&&(()=>{const modalLW=amFindLinkedWarrant(amCqModal.nodeId,amEdges,amCommittedNodes);const modalLWT=modalLW?amGetWarrantTag(modalLW):null;const modalCQs=amGetPresetCQs(modalLW?.warrantType,modalLW?.warrantSubtype);const modalLinkedCQ=amFindLinkedCQ(amCqModal.nodeId,amEdges,amCommittedNodes);return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 flex items-center justify-center" style={{zIndex:100,background:'rgba(0,0,0,.4)'}} onClick={()=>setAmCqModal(null)}>
      <motion.div initial={{scale:.92,y:16}} animate={{scale:1,y:0}} exit={{scale:.92,y:16}} className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-lg mx-4" style={{maxHeight:'92vh',overflow:'visible'}} onClick={e=>e.stopPropagation()}>
        <div style={{maxHeight:'87vh',overflowY:'auto',overflowX:'visible'}}>
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-gray-800">Edit Critical Question</h3><button onClick={()=>setAmCqModal(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} className="text-gray-400"/></button></div>
          <div className="mb-4 p-3 rounded-lg border" style={{background:modalLW?'#fdf2f8':'#f9fafb',borderColor:modalLW?'#fbcfe8':'#e5e7eb'}}>
            <h4 className="text-xs font-semibold mb-1.5" style={{color:modalLW?'#be185d':'#6b7280'}}>Linked Warrant</h4>
            {modalLW?<div className="space-y-1"><div className="px-2.5 py-1.5 bg-white rounded-lg border border-pink-100"><div className="text-xs text-gray-700 break-words rc" dangerouslySetInnerHTML={{__html:modalLW.text}}/></div>{modalLWT?<div className="text-xs font-medium text-pink-600">Scheme: {modalLWT}</div>:<div className="text-xs text-gray-400 italic">No scheme assigned</div>}</div>:<div className="text-xs text-gray-400 italic">No warrant linked.</div>}
          </div>
		  
		  <div className="mb-4 p-3 rounded-lg border" style={{background:modalLinkedCQ?'#fdf4ff':'#f9fafb',borderColor:modalLinkedCQ?'#f0abfc':'#e5e7eb'}}>
            <h4 className="text-xs font-semibold mb-1.5" style={{color:modalLinkedCQ?'#a21caf':'#6b7280'}}>Linked Critical Question</h4>
            {modalLinkedCQ?<div className="space-y-1"><div className="px-2.5 py-1.5 bg-white rounded-lg border border-purple-100"><div className="text-xs text-gray-700 break-words rc" dangerouslySetInnerHTML={{__html:modalLinkedCQ.text}}/></div>{modalLinkedCQ.cqSchematic&&<div className="text-xs font-medium text-purple-600">Schematic: {modalLinkedCQ.cqSchematic}</div>}</div>:<div className="text-xs text-gray-400 italic">No CQ linked. Connect this CQ to another CQ to see its info here.</div>}
          </div>
		  
          <div className="mb-4 p-3 rounded-lg bg-purple-50 border border-purple-200 space-y-2.5">
            <h4 className="text-xs font-semibold text-purple-700">Schematic CQ</h4>
            <select value={amCqFormData.selectedSchematic||''} onChange={e=>setAmCqFormData(p=>({...p,selectedSchematic:e.target.value||null}))} className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 border-purple-300 focus:ring-purple-400"><option value="">(none)</option>{modalCQs.map(cq=><option key={cq} value={cq}>{cq}</option>)}<option value="__custom__">Custom...</option></select>
            {amCqFormData.selectedSchematic==='__custom__'&&<input value={amCqFormData.customSchematic} onChange={e=>setAmCqFormData(p=>({...p,customSchematic:e.target.value}))} placeholder="e.g. CQ4: ..." className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 border-purple-300 focus:ring-purple-400"/>}
          </div>
          <div><label className="text-xs font-semibold text-gray-500 mb-1 block">Content</label><AmRichTextEditor key={amCqModal.nodeId} initialValue={amCqFormData.text} onChange={v=>setAmCqFormData(p=>({...p,text:v}))} onSave={amSaveCqEdit} placeholder="Enter the specific question…" minHeight={100}/></div>
          <div className="flex justify-end gap-2 mt-4"><button onClick={()=>setAmCqModal(null)} className="px-4 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg font-medium">Cancel</button><button onClick={amSaveCqEdit} className="px-4 py-1.5 text-xs text-white bg-pink-500 hover:bg-pink-600 rounded-lg font-semibold shadow-sm">Save</button></div>
        </div>
      </motion.div>
    </motion.div>})()}</AnimatePresence>
    {editModal&&(<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center" style={{zIndex:100}} onClick={()=>{setEditModal(null);setWCropModal(null);wEditImgRef.current=null}}><div className="bg-white rounded-xl shadow-2xl w-96 max-w-full mx-4" onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between px-4 py-2.5 border-b"><span className="font-bold text-sm text-gray-700">Edit Node</span><button onClick={()=>{setEditModal(null);setWCropModal(null);wEditImgRef.current=null}} className="p-1 hover:bg-gray-100 rounded"><X size={16}/></button></div><div className="px-4 py-1.5 border-b border-gray-100 flex flex-wrap items-center gap-1 bg-gray-50"><RichToolbar compact={true}/><span className="w-px h-4 bg-gray-300 mx-0.5"/><input type="color" onChange={e=>document.execCommand('foreColor',false,e.target.value)} defaultValue="#000000" className="w-5 h-5 rounded cursor-pointer border" title="Text color"/><span className="w-px h-4 bg-gray-300 mx-0.5"/><button onMouseDown={e=>{e.preventDefault();if(wEditImgRef.current)setWCropModal({imgEl:wEditImgRef.current,src:wEditImgRef.current.src})}} className={'hover:bg-gray-200 rounded transition-colors p-1 text-xs font-bold '+(wEditImgRef.current?'text-blue-600':'text-gray-300 cursor-not-allowed')} title="Crop selected image (click an image first)">✂</button></div><div ref={emRef} contentEditable suppressContentEditableWarning className="px-4 py-3 min-h-24 text-sm focus:outline-none" style={{wordBreak:'break-word'}} onClick={e=>{const t=e.target;if(t.tagName==='IMG'){wEditImgRef.current=t;t.style.outline='3px solid #3b82f6';emRef.current?.querySelectorAll('img').forEach(i=>{if(i!==t)i.style.outline=''})}else{wEditImgRef.current=null;emRef.current?.querySelectorAll('img').forEach(i=>{i.style.outline=''})}}} onDoubleClick={e=>{const t=e.target;if(t.tagName==='IMG'){e.preventDefault();e.stopPropagation();wEditImgRef.current=t;setWCropModal({imgEl:t,src:t.src})}}}/><div className="flex justify-end gap-2 px-4 py-2.5 border-t bg-gray-50"><button onClick={()=>{setEditModal(null);setWCropModal(null);wEditImgRef.current=null}} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button><button onClick={saveEdit} className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-1"><Check size={14}/> Save</button></div></div></div>)}
    {wCropModal&&<ImageCropModal src={wCropModal.src} onApply={dataUrl=>{if(wCropModal.imgEl){wCropModal.imgEl.src=dataUrl;wCropModal.imgEl.style.outline='3px solid #3b82f6'}setWCropModal(null)}} onCancel={()=>setWCropModal(null)}/>}
    {srcCropModal&&<ImageCropModal src={srcCropModal.src} onApply={dataUrl=>{if(srcCropModal.imgEl){srcCropModal.imgEl.src=dataUrl;srcCropModal.imgEl.style.outline='3px solid #3b82f6'}setSrcCropModal(null)}} onCancel={()=>setSrcCropModal(null)}/>}
  </div>);
}
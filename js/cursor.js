/* Curseur personnalisé — partagé par toutes les pages (souris uniquement).
   Un point jaune suit la souris ; un anneau le rattrape avec un effet ressort
   et s'étire dans le sens du déplacement. */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;

  var css=document.createElement('style');
  css.textContent=
   'html.has-cur,html.has-cur *{cursor:none!important}'+
   '.cur-dot,.cur-ring{position:fixed;top:0;left:0;z-index:10000;pointer-events:none;border-radius:50%;opacity:0;will-change:transform}'+
   'html.cur-on .cur-dot,html.cur-on .cur-ring{opacity:1}'+
   '.cur-dot{width:9px;height:9px;margin:-4.5px 0 0 -4.5px;background:#FFC940;box-shadow:0 0 0 2px rgba(16,21,74,.35);transition:opacity .25s,width .25s,height .25s,margin .25s}'+
   '.cur-ring{width:40px;height:40px;margin:-20px 0 0 -20px;mix-blend-mode:difference;transition:opacity .25s}'+
   '.cur-ring i{position:absolute;inset:0;border-radius:50%;border:1.5px solid #F7F2E8;display:flex;align-items:center;justify-content:center;'+
     'font:700 11px/1 "Bricolage Grotesque",sans-serif;font-style:normal;letter-spacing:.02em;color:transparent;'+
     'transition:transform .35s cubic-bezier(.22,1,.36,1),background .25s,border-color .25s,color .2s}'+
   '.cur-ring.is-hover i{transform:scale(1.55);background:rgba(247,242,232,.16)}'+
   '.cur-ring.is-down i{transform:scale(.75)}'+
   '.cur-ring.is-label{mix-blend-mode:normal}'+
   '.cur-ring.is-label i{transform:scale(1.9);background:#FFC940;border-color:#FFC940;color:#14110f;font-size:6.5px;box-shadow:0 10px 26px rgba(5,10,70,.35)}'+
   '.cur-ring.is-label.is-down i{transform:scale(1.65)}'+
   'html.cur-label .cur-dot{opacity:0}';
  document.head.appendChild(css);

  var dot=document.createElement('div'),ring=document.createElement('div'),lab=document.createElement('i');
  dot.className='cur-dot';ring.className='cur-ring';ring.appendChild(lab);
  function mount(){document.body.appendChild(ring);document.body.appendChild(dot);document.documentElement.classList.add('has-cur');}
  if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount);

  var LABELS=[['.proj-card','Voir'],['.reel,.tvc','Lire'],['.result-card','Zoom'],['.art-card,.card','Lire']];
  var HOVER='a,button,[onclick],summary,.acc-q,label,input,select,textarea';

  var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,vx=0,vy=0,seen=false,raf=0;
  function frame(){
    // ressort : l'anneau accélère vers le point puis se stabilise
    vx=(vx+(mx-rx)*.16)*.72; vy=(vy+(my-ry)*.16)*.72;
    rx+=vx; ry+=vy;
    var sp=Math.min(Math.hypot(vx,vy)/38,.5), ang=Math.atan2(vy,vx);
    dot.style.transform='translate3d('+mx+'px,'+my+'px,0)';
    ring.style.transform='translate3d('+rx+'px,'+ry+'px,0) rotate('+ang+'rad) scale('+(1+sp)+','+(1-sp*.55)+') rotate('+(-ang)+'rad)';
    raf=(Math.abs(mx-rx)>.1||Math.abs(my-ry)>.1||Math.abs(vx)>.05||Math.abs(vy)>.05)?requestAnimationFrame(frame):0;
  }
  addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    if(!seen){seen=true;rx=mx;ry=my;document.documentElement.classList.add('cur-on');}
    if(!raf)raf=requestAnimationFrame(frame);
  },{passive:true});
  addEventListener('mouseover',function(e){
    var t=e.target,txt='';
    if(!t.closest)return;
    for(var i=0;i<LABELS.length;i++){if(t.closest(LABELS[i][0])){txt=LABELS[i][1];break;}}
    // un bouton à l'intérieur d'une carte garde l'état « survol » simple
    if(txt&&t.closest('button,.btn'))txt='';
    lab.textContent=txt;
    ring.classList.toggle('is-label',!!txt);
    document.documentElement.classList.toggle('cur-label',!!txt);
    ring.classList.toggle('is-hover',!txt&&!!t.closest(HOVER));
  },{passive:true});
  addEventListener('mousedown',function(){ring.classList.add('is-down');});
  addEventListener('mouseup',function(){ring.classList.remove('is-down');});
  document.addEventListener('mouseleave',function(){document.documentElement.classList.remove('cur-on');seen=false;});
})();

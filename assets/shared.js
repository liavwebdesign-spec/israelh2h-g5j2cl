// לב אל לב: התנהגות משותפת לשלוש הסקיצות
function headroom(el,opt){
  opt=opt||{};
  var tol=opt.tol||6,last=0,raf=0;
  function upd(){
    raf=0;
    var y=window.scrollY,d=y-last,top=opt.top!=null?opt.top:el.offsetHeight+24;
    el.classList.toggle("is-scrolled",y>8);
    // תפריט פתוח או מיקוד מקלדת בתוך ההדר משאירים אותו על המסך
    var hold=el.classList.contains("menu-open")||!!el.querySelector(":focus-visible");
    if(y<=top||hold){el.classList.remove("is-hidden");last=y;return;}
    if(Math.abs(d)<tol)return;
    el.classList.toggle("is-hidden",d>0);
    last=y;
  }
  addEventListener("scroll",function(){if(!raf)raf=requestAnimationFrame(upd);},{passive:true});
  upd();
}
function setupHeader(){
  var hd=document.querySelector(".hd");
  if(!hd)return;
  headroom(hd);
  var b=hd.querySelector(".hd-burger");
  if(b)b.addEventListener("click",function(){
    var on=hd.classList.toggle("menu-open");
    b.setAttribute("aria-expanded",String(on));
    b.setAttribute("aria-label",on?"סגירת התפריט":"פתיחת התפריט");
    document.documentElement.style.overflow=on?"hidden":"";
    // המקלדת וקורא המסך נכנסים לתפריט כשהוא נפתח, וחוזרים לכפתור כשהוא נסגר
    if(on){var first=hd.querySelector(".hd-nav a");if(first)first.focus();}
    else b.focus();
  });
  addEventListener("keydown",function(e){if(e.key==="Escape"&&hd.classList.contains("menu-open"))b.click();});
}
function stagger(root){
  [].forEach.call((root||document).querySelectorAll(".rv"),function(el,i){el.style.setProperty("--i",i);});
}
function pauseButton(btn,root,labels){
  btn.addEventListener("click",function(){
    var on=!root.classList.contains("paused");
    root.classList.toggle("paused",on);
    btn.setAttribute("aria-pressed",String(on));
    btn.setAttribute("aria-label",on?labels[1]:labels[0]);
    if(labels[2])labels[2](on);
  });
}
var calm=matchMedia("(prefers-reduced-motion:reduce)").matches;
document.addEventListener("DOMContentLoaded",function(){setupHeader();stagger();});
// גילוי בגלילה
document.addEventListener("DOMContentLoaded",function(){
  var els=[].slice.call(document.querySelectorAll("[data-sr]"));
  if(calm||!els.length||!("IntersectionObserver" in window))return;
  document.documentElement.classList.add("sr-on");
  els.forEach(function(el){var sib=[].slice.call(el.parentNode.querySelectorAll(":scope > [data-sr]"));el.style.setProperty("--i",sib.indexOf(el));});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px"});
  els.forEach(function(el){io.observe(el);});
});
// קרוסלת השותפים: עותק שני לשם הלולאה, בלי להכפיל לקורא מסך
document.addEventListener("DOMContentLoaded",function(){
  [].forEach.call(document.querySelectorAll(".mq-row"),function(row){
    var tr=row.querySelector(".mq-track");
    [].slice.call(tr.children).forEach(function(im){var c=im.cloneNode(true);c.alt="";c.setAttribute("aria-hidden","true");tr.appendChild(c);});
    var b=row.querySelector(".hpp");if(b)pauseButton(b,row,["עצירת הלוגואים","הפעלת הלוגואים"]);
  });
});
// שנה בפוטר, ובסקיצה קישור בלי יעד מסביר את עצמו במקום לקפוץ לראש העמוד
document.addEventListener("DOMContentLoaded",function(){
  [].forEach.call(document.querySelectorAll("[data-year]"),function(e){e.textContent=new Date().getFullYear();});
  var t=document.createElement("div"),timer=0;t.className="toast";t.setAttribute("role","status");document.body.insertBefore(t,document.body.firstChild);
  document.addEventListener("click",function(e){
    var a=e.target.closest&&e.target.closest('a[href="#"]');
    if(!a||a.classList.contains("hd-logo")||a.hasAttribute("aria-current"))return;
    e.preventDefault();
    t.textContent=a.dataset.missing||"בסקיצה הזו בנוי רק דף הבית";
    t.classList.add("on");clearTimeout(timer);timer=setTimeout(function(){t.classList.remove("on");},2600);
  });
});

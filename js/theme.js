/* Thème clair / sombre — partagé par toutes les pages.
   Chargé dans le <head> pour appliquer le thème avant le premier affichage. */
(function(){
  var KEY='theme',root=document.documentElement;
  function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function apply(t){
    if(t==='dark')root.setAttribute('data-theme','dark');else root.removeAttribute('data-theme');
    var m=document.querySelector('meta[name="theme-color"]');
    if(m)m.setAttribute('content',t==='dark'?'#0b0d19':'#2539F5');
    document.querySelectorAll('[data-theme-toggle]').forEach(function(b){
      b.setAttribute('aria-pressed',t==='dark'?'true':'false');
      b.setAttribute('aria-label',t==='dark'?'Passer au thème normal':'Passer au thème sombre');
    });
  }
  apply(get());
  document.addEventListener('DOMContentLoaded',function(){
    apply(get());
    document.querySelectorAll('[data-theme-toggle]').forEach(function(b){
      b.addEventListener('click',function(){
        var t=root.getAttribute('data-theme')==='dark'?'light':'dark';
        try{localStorage.setItem(KEY,t)}catch(e){}
        apply(t);
      });
    });
  });
  // garde les onglets ouverts synchronisés
  addEventListener('storage',function(e){if(e.key===KEY)apply(e.newValue)});
})();

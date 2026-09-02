(function(){
  const h=document.getElementById('navHamburger'),m=document.getElementById('mobileMenu');
  if(h&&m){
    h.addEventListener('click',()=>{const o=m.classList.toggle('open');h.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';});
    m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');h.setAttribute('aria-expanded','false');document.body.style.overflow='';}));
  }
})();

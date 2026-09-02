document.addEventListener('DOMContentLoaded',()=>{

  // Scroll reveal
  const reveals=document.querySelectorAll('.reveal');
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -48px 0px'});
  reveals.forEach(el=>obs.observe(el));

  // Back to top
  const btt=document.getElementById('backToTop');
  if(btt){
    window.addEventListener('scroll',()=>{btt.style.opacity=window.scrollY>600?'1':'0';btt.style.pointerEvents=window.scrollY>600?'auto':'none';},{passive:true});
    btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  // Cookie banner
  const banner=document.getElementById('cookieBanner');
  if(banner){
    if(!localStorage.getItem('henrisol_cookies'))banner.style.display='flex';
    ['cookieAccept','cookieDecline'].forEach(id=>{const b=document.getElementById(id);if(b)b.addEventListener('click',()=>{localStorage.setItem('henrisol_cookies','1');banner.style.display='none';});});
  }

  // Property filter
  const filterBtns=document.querySelectorAll('.filter-tab');
  const listings=document.querySelectorAll('.listing-card');
  filterBtns.forEach(btn=>btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    listings.forEach(c=>c.toggleAttribute('hidden',f!=='all'&&c.dataset.type!==f));
  }));

  // Property search
  const searchForm=document.getElementById('propertySearch');
  if(searchForm){
    searchForm.addEventListener('submit',e=>{
      e.preventDefault();
      const location=searchForm.querySelector('[name="location"]').value;
      const type=searchForm.querySelector('[name="type"]').value;
      // In production, this would route to /properties/?location=...&type=...
      const url=new URL('/properties/',window.location.origin);
      if(location)url.searchParams.set('location',location);
      if(type)url.searchParams.set('type',type);
      window.location.href=url.toString();
    });
  }

  // ROI Calculator
  function fmtNaira(n){return '₦'+Math.round(n).toLocaleString('en-NG');}
  function calcROI(){
    const price=parseFloat(document.getElementById('propPrice')?.value)||0;
    const rent=parseFloat(document.getElementById('propRent')?.value)||0;
    const growth=parseFloat(document.getElementById('propGrowth')?.value)/100||0;
    const years=parseFloat(document.getElementById('propYears')?.value)||0;
    if(!price||!rent||!years)return;
    const annualRent=rent*12;
    const yieldPct=(annualRent/price)*100;
    const futureValue=price*Math.pow(1+growth,years);
    const capitalGain=futureValue-price;
    const totalRent=annualRent*years;
    const totalReturn=capitalGain+totalRent;
    const el=document.getElementById('roiResults');
    if(el){
      document.getElementById('roiYield').textContent=yieldPct.toFixed(1)+'%';
      document.getElementById('roiFuture').textContent=fmtNaira(futureValue);
      document.getElementById('roiGain').textContent=fmtNaira(capitalGain);
      document.getElementById('roiTotal').textContent=fmtNaira(totalReturn);
      el.style.display='grid';
    }
  }
  ['propPrice','propRent','propGrowth','propYears'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.addEventListener('input',calcROI);
  });

  // Form validation
  const form=document.querySelector('[data-validate]');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      let valid=true;
      form.querySelectorAll('[required]').forEach(field=>{
        const g=field.closest('.form-group');
        const ok=field.type==='checkbox'?field.checked:field.value.trim()!=='';
        if(!ok){g?.classList.add('error');valid=false;}else{g?.classList.remove('error');}
      });
      if(valid){
        const s=form.querySelector('.form-success');
        if(s){form.querySelectorAll('.form-group,button[type=submit]').forEach(el=>el.style.display='none');s.style.display='block';}
      }
    });
    form.querySelectorAll('[required]').forEach(f=>f.addEventListener('input',()=>f.closest('.form-group')?.classList.remove('error')));
  }
});

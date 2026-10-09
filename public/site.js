const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
function closeMenu() {nav?.classList.remove('is-open');menuButton?.setAttribute('aria-expanded','false');}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav?.addEventListener('click', event => {if(event.target.closest('a')) closeMenu();});
document.addEventListener('keydown', event => {if(event.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
matchMedia('(min-width: 641px)').addEventListener('change', event => {if(event.matches) closeMenu();});
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const videos = [...document.querySelectorAll('video[data-motion]')];
function loadVideo(video) {
  const source=video.querySelector('source');
  if(!source.src){source.src=source.dataset.src;video.load();}
}
function setButton(video) {
  const button=video.parentElement.querySelector('.motion-toggle');
  const playing=!video.paused;
  const label=playing?'Pause animation':'Play animation';
  button.querySelector('.motion-icon').innerHTML=playing?'<path d="M7 5h4v14H7zm6 0h4v14h-4z" fill="currentColor"/>':'<path d="M8 5v14l11-7z" fill="currentColor"/>';
  button.title=label;
  button.setAttribute('aria-label',label);
  button.setAttribute('aria-pressed',String(playing));
}
const observer = new IntersectionObserver(entries => {
  for(const entry of entries){
    const video=entry.target;
    if(entry.isIntersecting){
      // Reduced motion disables automatic playback. It must not interrupt a
      // visitor who explicitly presses Play while the media is visible.
      if(!reducedMotion.matches&&video.dataset.userPaused!=='true'){
        loadVideo(video);video.play().catch(()=>setButton(video));
      }
    }else video.pause();
  }
},{threshold:.2});
for(const video of videos){
  observer.observe(video);
  video.addEventListener('play',()=>setButton(video));
  video.addEventListener('pause',()=>setButton(video));
  video.parentElement.querySelector('.motion-toggle').addEventListener('click',()=>{
    if(video.paused){video.dataset.userPaused='false';loadVideo(video);video.play().catch(()=>setButton(video));}
    else{video.dataset.userPaused='true';video.pause();}
    setButton(video);
  });
}
reducedMotion.addEventListener('change',()=>{for(const video of videos){if(reducedMotion.matches)video.pause();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const video of videos)video.pause();});

// Reveal each section once, without hiding content when JavaScript is absent.
const sections=[...document.querySelectorAll('main > .section, main > .contact, .case-main section, .identity-strip, .case-finale')];
const revealObserver=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
    entry.target.classList.add('is-revealed');
    revealObserver.unobserve(entry.target);
  }
},{rootMargin:'0px 0px -60px 0px',threshold:0});
if(!reducedMotion.matches){
  for(const section of sections){section.classList.add('reveal-block');revealObserver.observe(section);}
}
function revealAll(){for(const section of sections)section.classList.add('is-revealed');revealObserver.disconnect();}
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)revealAll();});
document.addEventListener('focusin',event=>event.target.closest('.reveal-block')?.classList.add('is-revealed'));

// A small scroll threshold avoids jitter from trackpads and touch scrolling.
const header=document.querySelector('.site-header');
let previousY=Math.max(0,scrollY),scrollTick=false;
function updateHeader(){
  const y=Math.max(0,Math.min(scrollY,document.documentElement.scrollHeight-innerHeight));
  header.classList.toggle('is-scrolled',y>16);
  const menuOpen=menuButton?.getAttribute('aria-expanded')==='true';
  const keyboardFocus=header.querySelector(':focus-visible');
  if(y<100||menuOpen||keyboardFocus)header.classList.remove('is-collapsed');
  else if(Math.abs(y-previousY)>8)header.classList.toggle('is-collapsed',y>previousY);
  if(Math.abs(y-previousY)>8||y<100)previousY=y;
  scrollTick=false;
}
window.addEventListener('scroll',()=>{if(!scrollTick){scrollTick=true;requestAnimationFrame(updateHeader);}},{passive:true});
header.addEventListener('focusin',()=>header.classList.remove('is-collapsed'));
menuButton?.addEventListener('click',()=>header.classList.remove('is-collapsed'));
updateHeader();

// Replace browser validation popups with accessible, field-specific feedback.
const form=document.querySelector('.contact form');
if(form){
  form.noValidate=true;
  const controls=[...form.querySelectorAll('input:not([type="hidden"]):not([name="_honey"]),textarea')];
  const summary=form.querySelector('.form-error-summary');
  let attempted=false;
  function errorFor(control){
    if(control.validity.valueMissing)return control.type==='email'?'Add your email address so I can reply.':'Tell me a little about your project.';
    if(control.validity.typeMismatch)return 'That email doesn’t look quite right. Try a format like name@example.com.';
    if(control.validity.tooLong)return 'Please shorten this a little before sending.';
    return control.validity.valid?'':'Please check this field and try again.';
  }
  function validate(control){
    const message=errorFor(control);
    const feedback=document.getElementById(`${control.id}-error`);
    feedback.textContent=message;feedback.hidden=!message;
    if(message)control.setAttribute('aria-invalid','true');else control.removeAttribute('aria-invalid');
    return !message;
  }
  form.addEventListener('submit',event=>{
    attempted=true;
    const invalid=controls.filter(control=>!validate(control));
    summary.hidden=invalid.length===0;
    if(invalid.length){event.preventDefault();invalid[0].focus();return;}
  });
  for(const control of controls)control.addEventListener('input',()=>{
    if(!attempted)return;
    validate(control);
    summary.hidden=controls.every(field=>field.validity.valid);
  });
}

// Touch screens use the centre of the viewport as the service highlight zone.
const mobileServices=matchMedia('(max-width:900px) and (hover:none)');
const serviceCards=[...document.querySelectorAll('.service-card')];
let serviceTick=false;
function updateServiceHighlight(){
  const centre=innerHeight/2;
  for(const card of serviceCards){
    const bounds=card.getBoundingClientRect();
    card.classList.toggle('is-centred',mobileServices.matches&&bounds.top<=centre&&bounds.bottom>=centre);
  }
  serviceTick=false;
}
function queueServiceHighlight(){if(!serviceTick){serviceTick=true;requestAnimationFrame(updateServiceHighlight);}}
window.addEventListener('scroll',queueServiceHighlight,{passive:true});
window.addEventListener('resize',queueServiceHighlight);
mobileServices.addEventListener('change',queueServiceHighlight);
updateServiceHighlight();

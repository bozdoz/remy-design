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
  button.textContent=playing?'Pause animation':'Play animation';
  button.setAttribute('aria-label',button.textContent);
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
  });
}
reducedMotion.addEventListener('change',()=>{for(const video of videos){if(reducedMotion.matches)video.pause();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const video of videos)video.pause();});

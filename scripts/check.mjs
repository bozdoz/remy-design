import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../public');
const projects=JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname,'../content/projects.json'),'utf8'));
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
let count=0;
for(const file of walk(root).filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(file,'utf8');
 assert(html.includes('<html lang="en-CA">'),`${file}: document language missing`);
 assert(html.includes('name="viewport"'),`${file}: viewport missing`);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: expected one primary heading`);
 for(const m of html.matchAll(/(?:src|href|poster|data-src)="(\/[^"#]*)(?:#[^"]*)?"/g)){
  const route=decodeURIComponent(m[1].split('?')[0]);
  const resolved=path.join(root,route.endsWith('/')?`${route}index.html`:route);
  assert(fs.existsSync(resolved),`${file}: broken local reference ${route}`);
  assert(fs.statSync(resolved).size>0,`${file}: empty local reference ${route}`);count++;
 }
 assert(!/figma\.com\/api\/mcp/.test(html),`${file}: temporary Figma URL`);
}
assert.equal(projects.length,9);
for(const p of projects){
 assert(fs.existsSync(path.join(root,'projects',p.slug,'index.html')),`Missing ${p.slug}`);
 assert.equal(p.placements.length,7);
 assert(p.placements.every(Boolean),`Missing image for ${p.slug}`);
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(home.includes('action="https://formsubmit.co/e821d94bc8a38489dfc9f1fb05de10db"'));
assert(home.includes('name="email" type="email" autocomplete="email" required'));
assert(home.includes('name="message" rows="6" required'));
const pando=fs.readFileSync(path.join(root,'projects/pando/index.html'),'utf8');
const collab=fs.readFileSync(path.join(root,'projects/collab/index.html'),'utf8');
assert(pando.includes('/assets/pando/pando-rating.svg'));
assert(collab.includes('/assets/collab/collab-rating.svg'));
assert(collab.includes('/assets/collab/collab-app-stores.svg'));
assert(!collab.includes('decreased monthly churn by 8%'));
console.log(`Verified 9 case studies and ${count} local links/assets; form destination and updated SVGs are correct.`);

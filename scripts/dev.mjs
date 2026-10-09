import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const publicDir=path.join(root,'public');
function build(){execFileSync(process.execPath,[path.join(root,'scripts/build.mjs')],{stdio:'inherit'});}
build();
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4','.pdf':'application/pdf','.otf':'font/otf','.xml':'application/xml','.txt':'text/plain'};
const server=http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 let file=path.resolve(publicDir,`.${name}`);
 if(!file.startsWith(publicDir+path.sep)&&file!==publicDir){res.writeHead(403);res.end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 const exists=fs.existsSync(file)&&fs.statSync(file).isFile();
 if(!exists)file=path.join(publicDir,'404.html');
 const stat=fs.statSync(file);const type=types[path.extname(file)]||'application/octet-stream';
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range&&exists){const start=Number(range[1]);const end=Math.min(range[2]?Number(range[2]):stat.size-1,stat.size-1);if(start> end){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}res.writeHead(206,{'Content-Type':type,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes'});fs.createReadStream(file,{start,end}).pipe(res);}
 else{res.writeHead(exists?200:404,{'Content-Type':type,'Content-Length':stat.size,'Accept-Ranges':'bytes'});if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);}
});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}`));
let timer;for(const file of ['content/projects.json','scripts/build.mjs','public/style.scss'])fs.watch(path.join(root,file),()=>{clearTimeout(timer);timer=setTimeout(()=>{try{build();}catch(e){console.error('Build failed:',e.message);}},150);});

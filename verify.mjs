import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {Script} from 'node:vm';
import {validateCodes} from './lib/codes.mjs';
import {verifyIcons} from './scripts/icons.mjs';
const root=new URL('./dist/',import.meta.url),config=JSON.parse(await readFile('data/game.config.json','utf8'));
await verifyIcons(root);validateCodes(JSON.parse(await readFile('data/codes.json','utf8')));
new Script(await readFile(new URL('app.js',root),'utf8'));
let count=0;const routes=new Set();
async function walk(url){for(const entry of await readdir(url,{withFileTypes:true})){const file=new URL(entry.name+(entry.isDirectory()?'/':''),url);if(entry.isDirectory())await walk(file);else if(entry.name.endsWith('.html')){const html=await readFile(file,'utf8');assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1,file.pathname+' h1');assert(!/[\u3400-\u9fff]/.test(html),'Unexpected non-English text');assert(html.includes('<title>')&&html.includes('name="description"')&&html.includes('rel="canonical"'));assert(html.includes('og:image')&&html.includes('/assets/og-default.jpg'));assert(!html.includes('/lib/hub.css'));for(const [,href]of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){if(!href)continue;await readFile(new URL(href.slice(1)+(href.endsWith('/')?'index.html':''),root));}for(const[,body]of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(body);count++;}}}
await walk(root);
for(const p of config.routes){routes.add(p.path);const file=p.path==='/'?'index.html':p.path.slice(1)+'index.html';await readFile(new URL(file,root));}
assert.equal(count,routes.size+4,'Canonical routes, three aliases and 404');
const codes=await readFile(new URL('codes/index.html',root),'utf8');assert.equal((codes.match(/data-copy=/g)||[]).length,3);assert(codes.includes('id="expired"'));const schemas=[...codes.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));const faq=schemas.find(s=>s['@type']==='FAQPage');assert(faq);for(const q of faq.mainEntity){assert(codes.includes(q.name)&&codes.includes(q.acceptedAnswer.text));}
const calculator=await readFile(new URL('calculator/index.html',root),'utf8');const rewards=JSON.parse(calculator.match(/<script type="application\/json" id="reward-data">(.*?)<\/script>/s)[1]);assert.equal(rewards.reduce((n,r)=>n+r.gems,0),100);assert.equal(rewards.reduce((n,r)=>n+r.gemBoost,0),4);
const abilities=JSON.parse(await readFile('data/abilities.json','utf8'));assert.equal(abilities.items.length,11);for(const a of abilities.items){assert(['Runner','Chaser'].includes(a.role));assert(['S','A','B','C'].includes(a.tier));await readFile(new URL(`wiki/abilities/${a.id}/index.html`,root));}
const sitemap=await readFile(new URL('sitemap.xml',root),'utf8');for(const p of config.routes)assert(sitemap.includes('https://hussvalleyhub.org'+p.path));assert.equal((sitemap.match(/<loc>/g)||[]).length,routes.size);assert((await readFile(new URL('404.html',root),'utf8')).includes('noindex'));assert(!(await readdir(root)).includes('_redirects'));
const css=await readFile(new URL('style.css',root),'utf8');assert(!css.includes('#f6f5ef'));assert(!css.includes('Georgia'));console.log(`Verified ${count} HTML pages, ${routes.size} canonical routes, local links, metadata, JSON-LD, calculator reward inputs, ability detail pages and replacement styles.`);

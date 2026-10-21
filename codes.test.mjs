import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateCodes,renderCodeTable} from './lib/codes.mjs';
const original=JSON.parse(await readFile(new URL('./data/codes.json',import.meta.url),'utf8'));
test('a source report cannot become working without redemption evidence',()=>{
  const data=structuredClone(original);data.codes[0].status='working';
  assert.throws(()=>validateCodes(data),/redemption date and evidence/);
  data.codes[0].verifiedAt='2026-10-17';assert.throws(()=>validateCodes(data),/evidence/);
});
test('duplicate codes and impossible source dates block publication',()=>{
  const data=structuredClone(original);data.codes.push({...data.codes[0]});
  assert.throws(()=>validateCodes(data),/duplicate/);
  data.codes.pop();data.codes[0].sourceCheckedAt='2026-02-30';
  assert.throws(()=>validateCodes(data),/source-review date/);
});
test('confirmed expiry preserves the code even when the original expiry is unknown',()=>{
  const data=structuredClone(original);Object.assign(data.codes[0],{status:'expired',verifiedAt:'2026-10-17',evidenceUrl:'https://example.org/expiry-evidence'});
  validateCodes(data);
  const html=renderCodeTable([data.codes[0]],{id:'archive',caption:'Archive',archive:true});
  assert(html.includes(data.codes[0].code));assert(html.includes('Expired: Unknown'));assert(html.includes('Verification evidence'));
});
test('rendered code strings and rewards are escaped rather than interpreted as HTML',()=>{
  const item={...original.codes[0],code:'<CODE>',reward:'<img src=x>'};
  const html=renderCodeTable([item],{id:'codes',caption:'Codes'});
  assert(html.includes('&lt;CODE&gt;'));assert(!html.includes('<img'));
});

test('primary evidence requires exact spelling, publication and a message permalink',()=>{
  const data=structuredClone(original);
  data.codes[0].sourceUrl='https://discord.com/invite/hussvalleyhq';
  assert.throws(()=>validateCodes(data),/message permalink/);
  data.codes[0]=structuredClone(original.codes[0]);
  data.codes[0].sourceQuote='Redeem TUESDAYSROCK for a free reward!';
  assert.throws(()=>validateCodes(data),/exact code excerpt/);
});

test('all primary announcements with unknown rewards stay out of calculator totals',()=>{
  const unknown=original.codes.filter(c=>c.rewardUnits===null);
  assert(unknown.length>0);
  for(const item of unknown){
    assert.equal(item.rewardSource,null);
    assert.equal(item.verifiedAt,null);
    assert(item.sourceType==='primary');
    assert(item.sourceQuote.includes(item.code));
    assert(item.sourceUrl.startsWith('https://discord.com/channels/'));
    assert.equal(item.status,'unverified');
    if(item.requirements)assert(item.requirements.sourceUrl.startsWith('https://discord.com/channels/'));
  }
  const known=original.codes.filter(c=>c.status!=='expired'&&c.rewardUnits);
  assert(known.every(c=>Object.values(c.rewardUnits).every(value=>Number.isInteger(value)&&value>=0)));
});

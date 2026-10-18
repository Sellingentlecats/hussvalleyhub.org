export function validateCodes(data){
  const seen=new Set();
  const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
  const validUrl=value=>{try{return new URL(value).protocol==='https:'}catch{return false}};
  if(!validDate(data.sourceReviewedAt)||!Array.isArray(data.codes))throw Error('Invalid code dataset');
  for(const item of data.codes){
    if(!item.code||item.code.trim()!==item.code||seen.has(item.code))throw Error('Empty, padded or duplicate code');
    seen.add(item.code);
    if(!item.reward||!item.sourceName||!validUrl(item.sourceUrl)||!validDate(item.sourceCheckedAt))throw Error('Every code needs a reward, source and source-review date');
    if(item.sourceType==='primary'){
      if(!item.sourceQuote||!item.sourceQuote.includes(item.code)||!item.sourceAuthor||!item.sourceAuthorRole||!item.publishedAt||Number.isNaN(Date.parse(item.publishedAt)))throw Error('Primary sources need an exact code excerpt, author, role and publication timestamp');
      const expected=`https://discord.com/channels/${item.sourceServerId}/${item.sourceChannelId}/${item.sourceMessageId}`;
      if(item.sourceUrl!==expected||!/^\d+$/.test(item.sourceMessageId||'')||!/^\d+$/.test(item.sourceServerId||'')||!/^\d+$/.test(item.sourceChannelId||''))throw Error('Primary Discord evidence needs a message permalink, not an invite');
    }
    if(item.rewardSource&&(!validUrl(item.rewardSource.url)||!item.rewardSource.name))throw Error('Numeric reward evidence needs a separate valid source');
    if(item.rewardUnits)for(const value of Object.values(item.rewardUnits))if(!Number.isInteger(value)||value<0)throw Error('Reward units must be non-negative integers');
    if(!['unverified','working','expired'].includes(item.status))throw Error('Unknown code status');
    for(const key of ['verifiedAt','expiresAt','expiredAt'])if(item[key]!=null&&!validDate(item[key]))throw Error('Invalid '+key);
    if(item.status==='working'&&(!item.verifiedAt||!validUrl(item.evidenceUrl)))throw Error('Working codes need a redemption date and evidence');
    if(item.status==='expired'&&(!item.verifiedAt||!validUrl(item.evidenceUrl)))throw Error('Expired codes need a confirmation date and evidence; actual expiry may be unknown');
    if(item.expiresAt&&!validUrl(item.evidenceUrl))throw Error('A stated expiry needs evidence');
    if(item.status==='unverified'&&(item.verifiedAt||item.expiredAt))throw Error('Unverified codes cannot claim a verification or expiry result');
  }
  return data;
}
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderCodeTable(items,{id,caption,archive=false}){
  const e=escapeHtml;
  return `<table id="${e(id)}" class="codes"><caption>${e(caption)}</caption><thead><tr><th scope="col">Code</th><th scope="col">Status</th><th scope="col">Last verified</th><th scope="col">Reported reward</th><th scope="col">Source</th></tr></thead><tbody>${items.map(item=>`<tr><td data-label="Code"><div class="code-control"><code>${e(item.code)}</code><button type="button" data-copy="${e(item.code)}" aria-label="Copy ${e(item.code)}">Copy</button></div></td><td data-label="Status"><span class="status status-${item.status}">${{unverified:'Unverified',working:'Working',expired:'Expired'}[item.status]}</span></td><td data-label="Last verified">${item.verifiedAt?`<time datetime="${item.verifiedAt}">${item.verifiedAt}</time>`:'Not yet verified'}<small>Source checked ${e(item.sourceCheckedAt)}</small></td><td data-label="Reported reward">${e(item.reward)}<small>${archive?'Expired: '+e(item.expiredAt||'Unknown'):'Expiry: '+e(item.expiresAt||'Not announced in our source record')}</small></td><td data-label="Source"><a href="${e(item.sourceUrl)}">${e(item.sourceName)}</a>${item.evidenceUrl?`<small><a href="${e(item.evidenceUrl)}">Verification evidence</a></small>`:'<small>Source report only; our own test is pending.</small>'}</td></tr>`).join('')}</tbody></table>`;
}

import {escapeHtml as e} from '../lib/codes.mjs';


export function announcementEvidence(code,{compact=false}={}){
  if(!['primary','primary-screenshot'].includes(code.sourceType))return `<a href="${e(code.sourceUrl)}">${e(code.sourceName)}</a>`;
  const body=`<a class="announcement-link" href="${e(code.sourceUrl)}">${code.sourceType==='primary-screenshot'?'Discord announcement channel':'Original Discord announcement'}</a>${code.sourceType==='primary-screenshot'?'<small>Announcement transcribed from a supplied Discord screenshot; link opens the channel.</small>':''}<blockquote class="source-quote"><p>${e(code.sourceQuote)}</p></blockquote><small>${e(code.sourceAuthor)} · ${e(code.sourceAuthorRole)} · #${e(code.sourceChannelName)}</small>${code.requirements?`<p class="code-requirement">${e(code.requirements.text)}</p><blockquote class="source-quote"><p>${e(code.requirements.quote)}</p></blockquote><small><a href="${e(code.requirements.sourceUrl)}">Original follow-up</a></small>`:''}<small>Discord access may be required.</small>`;
  return compact?`<details class="announcement-details"><summary>Developer source & original text</summary>${body}</details>`:body;
}

export function rewardEvidence(code){
  if(code.rewardInAnnouncement)return '<small class="reward-source">Reward stated in the developer announcement. Excluded from calculator totals.</small>';
  return code.rewardSource?`<small class="reward-source">Reward amounts: <a href="${e(code.rewardSource.url)}">${e(code.rewardSource.name)}</a> (secondary source). Not stated in the linked announcement.</small>`:'<small class="reward-source">No numeric reward is stated in this announcement. Excluded from calculator totals.</small>';
}

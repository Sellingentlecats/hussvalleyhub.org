import json, urllib.request, pathlib, datetime
out=pathlib.Path('research/live-20261018')
urls={'universe':'https://apis.roblox.com/universes/v1/places/107535308163741/universe','game':'https://games.roblox.com/v1/games?universeIds=10764627709','community':'https://groups.roblox.com/v1/groups/281831224','discord':'https://discord.com/api/v10/invites/robloxhussvalley?with_counts=true','ign':'https://www.ign.com/wikis/huss-valley-roblox/Huss_Valley_Codes'}
records=[]
for name,url in urls.items():
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'HussValleyHubResearch/1.0'})
  with urllib.request.urlopen(req,timeout=25) as r: body=r.read().decode(); status=r.status
  (out/(name+('.html' if name=='ign' else '.json'))).write_text(body,encoding='utf-8')
  records.append({'name':name,'url':url,'status':status,'bytes':len(body),'observedOn':'2026-10-18'})
 except Exception as e: records.append({'name':name,'url':url,'error':str(e),'observedOn':'2026-10-18'})
(out/'collection.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print(json.dumps(records,indent=2))

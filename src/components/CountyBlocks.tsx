// src/components/CountyBlocks.tsx
import { useAppStore } from '../store/useAppStore';
import { Star } from 'lucide-react';

const REGIONS = [
  { name: '北區', color: 'bg-yellow-50 border-yellow-300', titleColor: 'text-yellow-800', titleBg: 'bg-yellow-200', counties: ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '金門縣', '連江縣'] },
  { name: '中區', color: 'bg-blue-50 border-blue-300', titleColor: 'text-blue-800', titleBg: 'bg-blue-200', counties: ['苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣'] },
  { name: '南區', color: 'bg-green-50 border-green-300', titleColor: 'text-green-800', titleBg: 'bg-green-200', counties: ['嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '澎湖縣'] },
  { name: '東區', color: 'bg-pink-50 border-pink-300', titleColor: 'text-pink-800', titleBg: 'bg-pink-200', counties: ['宜蘭縣', '花蓮縣', '臺東縣'] },
];

// 直接從物件所有數值中計算 ★ 的數量，完全不依賴特定 Key 名稱
const getStarCount = (team: any): number => {
  if (!team) return 0;
  const values = Object.values(team);
  for (const val of values) {
    if (typeof val === 'string' && val.includes('★')) {
      const match = val.match(/★/g);
      return match ? match.length : 0;
    }
  }
  return 0;
};

// 模糊取欄位值
const getFieldValue = (team: any, keyword: string) => {
  if (!team) return '';
  const cleanKeyword = keyword.replace(/[\s\(\)（）]/g, '');
  const key = Object.keys(team).find(k => k.replace(/[\s\(\)（）]/g, '').includes(cleanKeyword));
  return key ? team[key] : '';
};

export default function CountyBlocks() {
  const { teams, setSelectedTeam, selectedTeam, rateTeam } = useAppStore();

  return (
    <div className="space-y-8">
      {REGIONS.map((region) => (
        <div key={region.name} className="space-y-3">
          <h3 className={`text-xl font-bold px-3 py-1 rounded-lg inline-block ${region.titleBg} ${region.titleColor}`}>
            {region.name}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {region.counties.map((county) => {
              const countyTeams = teams.filter((t) => t.縣市 === county);

              return (
                <div key={county} className={`border-2 rounded-xl flex overflow-hidden shadow-sm ${region.color}`}>
                  <div className="w-16 flex items-center justify-center bg-white/60 border-r border-inherit">
                    <span className="text-xl font-bold tracking-widest text-slate-700 [writing-mode:vertical-rl]">
                      {county}
                    </span>
                  </div>

                  <div className="flex-1 p-3 bg-white/40 space-y-2">
                    {countyTeams.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-slate-400 font-bold text-lg">─</div>
                    ) : (
                      countyTeams.map((team) => {
                        const isSelected = selectedTeam?.rowIndex === team.rowIndex;
                        const currentRating = getStarCount(team);
                        const grantType = getFieldValue(team, '補助類型');

                        return (
                          <div
                            key={team.rowIndex}
                            onClick={() => setSelectedTeam(team)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3
                              ${isSelected ? 'border-slate-800 bg-white shadow-md' : 'border-transparent bg-white/80 hover:bg-white hover:border-slate-400'}`}
                          >
                            <div className="flex-1">
                              <div className="font-bold text-lg text-slate-800 mb-1">{team.團隊名稱}</div>
                              {grantType && (
                                <div className="text-sm text-slate-600 flex flex-wrap gap-2 items-center">
                                  <span className="bg-slate-200 px-2 py-0.5 rounded-md font-semibold">{team.鄉鎮}</span>
                                  <span className="line-clamp-2 max-w-[250px] text-sm">{grantType}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200" onClick={(e) => e.stopPropagation()}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={24}
                                  className={`cursor-pointer transition-colors ${
                                    star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 hover:text-yellow-200'
                                  }`}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const success = await rateTeam(team.rowIndex, star);
                                    if (!success) {
                                      alert('評分更新失敗，請確認 Google Apps Script 部署與跨網域設定。');
                                    }
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
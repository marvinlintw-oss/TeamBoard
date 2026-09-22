// src/components/RegionDashboard.tsx
import { useAppStore } from '../store/useAppStore';
import { Users, MapPin } from 'lucide-react';

const REGIONS = [
  { 
    name: '北區', 
    counties: ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '金門縣', '連江縣'],
    cardBg: 'bg-yellow-50/80 border-yellow-200',
    tagBg: 'bg-yellow-200 text-yellow-800',
    barColor: 'bg-yellow-400'
  },
  { 
    name: '中區', 
    counties: ['苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣'],
    cardBg: 'bg-blue-50/80 border-blue-200',
    tagBg: 'bg-blue-200 text-blue-800',
    barColor: 'bg-blue-400'
  },
  { 
    name: '南區', 
    counties: ['嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '澎湖縣'],
    cardBg: 'bg-green-50/80 border-green-200',
    tagBg: 'bg-green-200 text-green-800',
    barColor: 'bg-green-400'
  },
  { 
    name: '東區', 
    counties: ['宜蘭縣', '花蓮縣', '臺東縣'],
    cardBg: 'bg-pink-50/80 border-pink-200',
    tagBg: 'bg-pink-200 text-pink-800',
    barColor: 'bg-pink-400'
  },
];

export default function RegionDashboard() {
  const { teams } = useAppStore();
  const totalTeams = teams.length;



  return (
    <div className="mb-6 rounded-2xl bg-white shadow-md border border-slate-200 p-3">
      {/* 標題與全台關鍵統計指標 */}
      <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
            <MapPin size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">區域量能總覽</h2>
            <p className="text-xs text-slate-400">跨區輔導及團隊配置監測</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Users size={16} className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-600">全台團隊：</span>
            <span className="text-lg font-extrabold text-slate-800">{totalTeams}</span>
          </div>

        </div>
      </div>

      {/* 四大區域量能細部指標卡片 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {REGIONS.map((region) => {
          const regionTeamsCount = teams.filter((t) =>
            region.counties.includes(t.縣市)
          ).length;
          const percentage = totalTeams > 0 ? Math.round((regionTeamsCount / totalTeams) * 100) : 0;

          return (
            <div
              key={region.name}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${region.cardBg}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${region.tagBg}`}>
                  {region.name}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {region.counties.length} 縣市
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <div className="text-2xl font-black text-slate-800">
                  {regionTeamsCount}
                  <span className="text-xs font-semibold text-slate-500 ml-1">隊</span>
                </div>
                <div className="text-xs font-bold text-slate-600">
                  {percentage}%
                </div>
              </div>

              <div className="w-full bg-white/70 h-2 rounded-full overflow-hidden border border-slate-200/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${region.barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
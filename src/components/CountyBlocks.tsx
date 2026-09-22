// src/components/CountyBlocks.tsx
import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Star } from 'lucide-react';
import type { TeamData } from '../types';

const REGIONS = [
  { name: '北區', color: 'bg-yellow-50 border-yellow-300', titleColor: 'text-yellow-800', titleBg: 'bg-yellow-200', counties: ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '金門縣', '連江縣'] },
  { name: '中區', color: 'bg-blue-50 border-blue-300', titleColor: 'text-blue-800', titleBg: 'bg-blue-200', counties: ['苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣'] },
  { name: '南區', color: 'bg-green-50 border-green-300', titleColor: 'text-green-800', titleBg: 'bg-green-200', counties: ['嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '澎湖縣'] },
  { name: '東區', color: 'bg-pink-50 border-pink-300', titleColor: 'text-pink-800', titleBg: 'bg-pink-200', counties: ['宜蘭縣', '花蓮縣', '臺東縣'] },
];

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

const getFieldValue = (team: any, keyword: string) => {
  if (!team) return '';
  const cleanKeyword = keyword.replace(/[\s\(\)（）]/g, '');
  const key = Object.keys(team).find((k) => k.replace(/[\s\(\)（）]/g, '').includes(cleanKeyword));
  return key ? team[key] : '';
};

function TeamItemCard({ team, isSelected, onSelect }: { team: TeamData; isSelected: boolean; onSelect: () => void }) {
  const { rateTeam, saveNote } = useAppStore();
  const currentRating = getStarCount(team);
  const grantType = getFieldValue(team, '補助類型');
  
  const initialNote = team['備註'] || getFieldValue(team, '備註') || (team as any)['長官備註'] || '';
  const [noteValue, setNoteValue] = useState(initialNote);

  useEffect(() => {
    setNoteValue(initialNote);
  }, [initialNote]);

  const handleBlurOrSubmit = () => {
    if (noteValue !== initialNote) {
      saveNote(team.rowIndex, noteValue);
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
        isSelected ? 'border-slate-800 bg-white shadow-md' : 'border-transparent bg-white/80 hover:bg-white hover:border-slate-400'
      }`}
    >
      {/* 左邊：團隊基本資訊 (保留最大可讀空間，補助類型上限 250px 且最多 2 行) */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="font-bold text-base text-slate-800 leading-snug">
          {team.團隊名稱}
        </div>
        {grantType && (
          <div className="text-xs text-slate-600 flex items-start gap-1.5 mt-1.5">
            <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-semibold shrink-0">
              {team.鄉鎮}
            </span>
            <span className="max-w-[250px] line-clamp-2 leading-tight">
              {grantType}
            </span>
          </div>
        )}
      </div>

      {/* 右邊：操作區 (強制 shrink-0，鎖定右側不被擠壓也不會越界) */}
      <div 
        className="shrink-0 flex items-center gap-2" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 星星 (16px) */}
        <div className="flex gap-0.5 bg-slate-50 px-1.5 py-1 rounded-md border border-slate-200 shrink-0">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={`cursor-pointer transition-colors ${
                star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 hover:text-yellow-200'
              }`}
              onClick={async (e) => {
                e.stopPropagation();
                await rateTeam(team.rowIndex, star);
              }}
            />
          ))}
        </div>

        {/* 兩行高度備註框 (固定寬度 130px，Enter 儲存，Shift+Enter 換行) */}
        <textarea
          rows={2}
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
          onBlur={handleBlurOrSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).blur();
            }
          }}
          placeholder="備註..."
          className="w-32 text-xs leading-tight p-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white resize-none shrink-0"
        />
      </div>
    </div>
  );
}

export default function CountyBlocks() {
  const { teams, setSelectedTeam, selectedTeam } = useAppStore();

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

                  <div className="flex-1 p-3 bg-white/40 space-y-2 overflow-hidden">
                    {countyTeams.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-slate-400 font-bold text-lg">─</div>
                    ) : (
                      countyTeams.map((team) => (
                        <TeamItemCard
                          key={team.rowIndex}
                          team={team}
                          isSelected={selectedTeam?.rowIndex === team.rowIndex}
                          onSelect={() => setSelectedTeam(team)}
                        />
                      ))
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
// src/components/DetailPanel.tsx
import { useAppStore } from '../store/useAppStore';
import React from 'react';

// 自製的文字解析器，取代 react-linkify，避免套件相容性錯誤
const renderTextWithLinks = (text: string) => {
  if (!text) return null;

  // 先用換行符號切割段落
  const paragraphs = text.split('\n');

  return paragraphs.map((paragraph, pIndex) => {
    // 用網址正則表達式找出所有連結
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = paragraph.split(urlRegex);

    return (
      <div key={pIndex} className="mb-1">
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            // 判斷是否為 Google Drive 圖片
            const driveRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
            const match = part.match(driveRegex);
            
            if (match) {
              const renderUrl = `https://drive.google.com/uc?id=${match[1]}`;
              return (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="block my-2">
                  <img 
                    src={renderUrl} 
                    alt="場地圖片" 
                    className="max-w-full h-auto max-h-64 object-cover rounded-xl shadow-md border border-slate-200" 
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </a>
              );
            }
            
            // 一般網址
            return (
              <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all font-semibold">
                {part}
              </a>
            );
          }
          // 純文字
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </div>
    );
  });
};

// 模糊取值工具：忽略空格、全半形括號差異
const getFieldValue = (team: any, possibleKeywords: string[]) => {
  if (!team) return '';
  const rawTeam = team as Record<string, any>;
  const keys = Object.keys(rawTeam);

  for (const keyword of possibleKeywords) {
    const cleanKeyword = keyword.replace(/[\s\(\)（）]/g, '');
    const matchedKey = keys.find(k => k.replace(/[\s\(\)（）]/g, '').includes(cleanKeyword));
    if (matchedKey && rawTeam[matchedKey] !== undefined) {
      return rawTeam[matchedKey];
    }
  }
  return '';
};

export default function DetailPanel() {
  const { selectedTeam, teams } = useAppStore();

  if (!selectedTeam) {
    return (
      <div className="w-3/5 h-full overflow-y-auto border-r border-slate-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="text-slate-400 text-2xl font-bold mb-4">目前已成功載入 {teams.length} 筆資料</div>
        <div className="text-slate-500 text-xl">請由右側點選團隊以檢視詳細資料...</div>
      </div>
    );
  }

  // 1. 解析推薦星等：支援各種空格、換行或合併欄位名稱，並計算包含的 ★ 數量
  const starCount = Object.values(selectedTeam as Record<string, any>).reduce((count, val) => {
    if (typeof val === 'string' && val.includes('★')) {
      const matches = val.match(/★/g);
      return matches ? matches.length : count;
    }
    return count;
  }, 0);

  // 2. 取得補助類型
  const grantType = getFieldValue(selectedTeam, ['補助類型']);

  // 3. 取得可容納人數或環境
  const capacity = getFieldValue(selectedTeam, ['最多可容納人數', '場域環境']);

  return (
    <div className="w-3/5 h-full overflow-y-auto border-r border-slate-200 bg-slate-100 p-6 shadow-sm space-y-4">
      
      {/* Block 1: 團隊基本資料 */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2 leading-snug">
          {selectedTeam.團隊名稱} <span className="text-xl text-slate-500 font-bold ml-1">({selectedTeam.縣市} / {selectedTeam.鄉鎮})</span>
        </h2>
        {grantType && (
          <div className="text-lg text-slate-700 mb-3 font-bold bg-slate-50 p-2 rounded-lg inline-block border border-slate-100">
            {grantType} <span className="text-slate-500 ml-1">({selectedTeam.獲補助經費})</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-slate-700">推薦星等：</span>
          {starCount > 0 ? (
            <span className="text-yellow-400 text-3xl tracking-widest leading-none drop-shadow-sm">
              {'★'.repeat(starCount)}
            </span>
          ) : (
            <span className="text-slate-400 text-base font-normal">尚無評分</span>
          )}
        </div>
      </div>

      {/* Block 2: 場域環境 */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-3 border-b-2 pb-2 border-slate-100 flex items-center gap-2">
          <span>📍</span> 場域環境
        </h3>
        {capacity && (
          <div className="mb-4 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <div className="text-base font-bold text-blue-900 mb-1">站點 / 周邊可容納人數</div>
            <div className="text-lg font-semibold text-blue-800 whitespace-pre-wrap">{capacity}</div>
          </div>
        )}
        <div>
          <div className="text-base font-bold text-slate-700 mb-1">場地簡介</div>
          <div className="text-lg text-slate-700 whitespace-pre-wrap leading-relaxed">
            {renderTextWithLinks(getFieldValue(selectedTeam, ['場地簡介']))}
          </div>
        </div>
      </div>

      {/* Block 3: 負責人 */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-3 border-b-2 pb-2 border-slate-100 flex items-center gap-2">
          <span>👤</span> 負責人
        </h3>
        <div className="mb-3 text-xl font-bold text-slate-800">
          {selectedTeam.姓名} <span className="text-slate-400 text-lg font-medium ml-2">/ {selectedTeam.聯繫電話}</span>
        </div>
        <div>
          <div className="text-base font-bold text-slate-700 mb-1">簡介 (表達能力/獲獎情形)</div>
          <div className="text-lg text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-xl">
            {getFieldValue(selectedTeam, ['簡介(含表達能力', '表達能力', '獲獎情形']) || selectedTeam['簡介(含表達能力、獲獎情形)']}
          </div>
        </div>
      </div>

      {/* Block 4: 團隊介紹 */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-3 border-b-2 pb-2 border-slate-100 flex items-center gap-2">
          <span>📖</span> 團隊介紹
        </h3>
        <div className="mb-5">
          <div className="text-base font-bold text-slate-700 mb-2 bg-yellow-50 inline-block px-2 py-1 rounded-md text-yellow-800">團隊簡介</div>
          <div className="text-lg text-slate-700 whitespace-pre-wrap leading-relaxed">
            {getFieldValue(selectedTeam, ['團隊簡介']) || selectedTeam['團隊簡介(請以講故事的描述方式呈現)']}
          </div>
        </div>
        <div>
          <div className="text-base font-bold text-slate-700 mb-2 bg-green-50 inline-block px-2 py-1 rounded-md text-green-800">與其他團隊串聯情形</div>
          <div className="text-lg text-slate-700 whitespace-pre-wrap leading-relaxed">
            {selectedTeam.與其他團隊串聯情形}
          </div>
        </div>
      </div>
    </div>
  );
}
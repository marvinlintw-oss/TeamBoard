// src/App.tsx
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import CountyBlocks from './components/CountyBlocks';
import DetailPanel from './components/DetailPanel';
import RegionDashboard from './components/RegionDashboard'; // 引入新元件

function App() {
  const { loadTeams, isLoading } = useAppStore();

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-2xl font-bold text-slate-500">
        讀取試算表資料中，請稍候...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-lg font-sans overflow-hidden">
      
      {/* 左側面板：團隊詳細資料區 (已抽離元件，具備獨立捲軸) */}
      <DetailPanel />

      {/* 右側面板：Dashboard 與縣市列表 (具備獨立捲軸) */}
      <div className="w-2.5/5 h-full flex flex-col bg-slate-200">
        
        {/* 上層：區域量能總覽 Dashboard */}
        <div className="p-8 pb-0">
          <RegionDashboard />
        </div>

        {/* 下層：各縣市團隊區塊 */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
          <CountyBlocks />
        </div>
        
      </div>
    </div>
  );
}

export default App;
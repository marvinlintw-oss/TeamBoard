// src/App.tsx
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import CountyBlocks from './components/CountyBlocks';
import DetailPanel from './components/DetailPanel';
import RegionDashboard from './components/RegionDashboard';
import { RefreshCw } from 'lucide-react';

function App() {
  const { loadTeams, refreshTeams, isLoading, isRefreshing } = useAppStore();

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
      {/* 左側面板：團隊詳細資料區 (維持唯讀) */}
      <DetailPanel />

      {/* 右側面板：Dashboard 與縣市列表 */}
      <div className="w-2.5/5 h-full flex flex-col bg-slate-200">
        {/* 上層工具列與 Dashboard */}
        <div className="p-8 pb-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-slate-500">資料即時連線中</span>
            <button
              onClick={() => refreshTeams()}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-blue-600' : ''} />
              {isRefreshing ? '更新中...' : '重新整理'}
            </button>
          </div>
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
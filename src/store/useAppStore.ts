import { create } from 'zustand';
import type { TeamData } from '../types';
import { fetchTeams, updateRating } from '../utils/api';

interface AppState {
  teams: TeamData[];
  selectedTeam: TeamData | null;
  isLoading: boolean;
  loadTeams: () => Promise<void>;
  setSelectedTeam: (team: TeamData) => void;
  rateTeam: (rowIndex: number, rating: number) => Promise<boolean>;
}

export const useAppStore = create<AppState>((set, get) => ({
  teams: [],
  selectedTeam: null,
  isLoading: false,
  
  loadTeams: async () => {
    set({ isLoading: true });
    const data = await fetchTeams();
    set({ teams: data, isLoading: false });
  },
  
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  
  rateTeam: async (rowIndex, rating) => {
    const starString = '★ '.repeat(rating).trim(); // 保持與試算表格式相仿
    const success = await updateRating(rowIndex, rating);
    if (success) {
      const updatedTeams = get().teams.map((t) => {
        if (t.rowIndex === rowIndex) {
          const updatedItem = { ...t } as Record<string, any>;
          // 找出原本放星星的 key 或關鍵字 key
          let targetKey = Object.keys(updatedItem).find(k => k.includes('星等') || (typeof updatedItem[k] === 'string' && updatedItem[k].includes('★')));
          if (!targetKey) targetKey = '參訪推薦星等';
          updatedItem[targetKey] = starString;
          return updatedItem as TeamData;
        }
        return t;
      });

      set({ teams: updatedTeams });

      if (get().selectedTeam?.rowIndex === rowIndex) {
        set({ selectedTeam: updatedTeams.find((t) => t.rowIndex === rowIndex) });
      }
      return true;
    }
    return false;
  }
}));
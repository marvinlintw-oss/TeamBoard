// src/store/useAppStore.ts
import { create } from 'zustand';
import type { TeamData } from '../types';
import { fetchTeams, updateRating, updateNote } from '../utils/api';

interface AppState {
  teams: TeamData[];
  selectedTeam: TeamData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  loadTeams: () => Promise<void>;
  refreshTeams: () => Promise<void>;
  setSelectedTeam: (team: TeamData) => void;
  rateTeam: (rowIndex: number, rating: number) => Promise<boolean>;
  saveNote: (rowIndex: number, note: string) => Promise<boolean>;
}

export const useAppStore = create<AppState>((set, get) => ({
  teams: [],
  selectedTeam: null,
  isLoading: false,
  isRefreshing: false,

  loadTeams: async () => {
    set({ isLoading: true });
    const data = await fetchTeams();
    set({ teams: data, isLoading: false });
  },

  refreshTeams: async () => {
    set({ isRefreshing: true });
    const data = await fetchTeams();
    set((state) => {
      const currentSelected = state.selectedTeam;
      const updatedSelected = currentSelected
        ? data.find((t) => t.rowIndex === currentSelected.rowIndex) || currentSelected
        : null;
      return { teams: data, selectedTeam: updatedSelected, isRefreshing: false };
    });
  },

  setSelectedTeam: (team) => set({ selectedTeam: team }),

  rateTeam: async (rowIndex, rating) => {
    const starString = '★ '.repeat(rating).trim();

    // 1. 樂觀更新
    const updatedTeams = get().teams.map((t) => {
      if (t.rowIndex === rowIndex) {
        const item = { ...t } as Record<string, any>;
        let targetKey = Object.keys(item).find(
          (k) => k.includes('星等') || (typeof item[k] === 'string' && item[k].includes('★'))
        );
        if (!targetKey) targetKey = '參訪推薦星等 (1~5顆星)';
        item[targetKey] = starString;
        return item as TeamData;
      }
      return t;
    });

    set({ teams: updatedTeams });
    if (get().selectedTeam?.rowIndex === rowIndex) {
      set({ selectedTeam: updatedTeams.find((t) => t.rowIndex === rowIndex) });
    }

    // 2. 存回 Sheet 並同步最新資料
    const success = await updateRating(rowIndex, rating);
    if (success) {
      get().refreshTeams();
    }
    return success;
  },

  saveNote: async (rowIndex, note) => {
    // 1. 樂觀更新
    const updatedTeams = get().teams.map((t) => {
      if (t.rowIndex === rowIndex) {
        return { ...t, 備註: note };
      }
      return t;
    });

    set({ teams: updatedTeams });
    if (get().selectedTeam?.rowIndex === rowIndex) {
      set({ selectedTeam: updatedTeams.find((t) => t.rowIndex === rowIndex) });
    }

    // 2. 存回 Sheet 並同步最新資料
    const success = await updateNote(rowIndex, note);
    if (success) {
      get().refreshTeams();
    }
    return success;
  },
}));
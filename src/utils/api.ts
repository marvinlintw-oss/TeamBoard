// src/utils/api.ts
import type { TeamData } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbzqLgzbpUm3-pVUihIrrXrM_S7x5GIC06e3r_JTUIqr9h-rIsFUqf5d-gIFsS_3fQqZNQ/exec';

export const fetchTeams = async (): Promise<TeamData[]> => {
  try {
    const response = await fetch(`${API_URL}?t=${Date.now()}`);
    const data = await response.json();
    return data as TeamData[];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

export const updateRating = async (rowIndex: number, rating: number): Promise<boolean> => {
  const targetUrl = `${API_URL}?action=rate&rowIndex=${rowIndex}&rating=${rating}`;

  try {
    // 方案一：優先使用瀏覽器專為背景傳輸設計的 sendBeacon（完全免疫 CORS 與 302 轉址限制）
    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon(targetUrl);
      if (sent) return true;
    }

    // 方案二：若瀏覽器不支援 sendBeacon，使用 no-cors 模式發送
    await fetch(targetUrl, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
    });

    return true;
  } catch (error) {
    console.error("Update Error:", error);
    return false;
  }
};
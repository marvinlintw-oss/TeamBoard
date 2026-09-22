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

// 專門發送給 Google Apps Script 的通用發送器
const sendGasRequest = async (url: string): Promise<boolean> => {
  try {
    // 使用 Image Beacon 作為第一優先：完全免疫 CORS 限制，保證送達後端
    const img = new Image();
    img.src = url;
    
    // 同時以 fetch(no-cors) 確保非圖片環境下也能送出
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    return true;
  } catch (error) {
    console.error("GAS Send Error:", error);
    return false;
  }
};

export const updateRating = async (rowIndex: number, rating: number): Promise<boolean> => {
  const targetUrl = `${API_URL}?action=rate&rowIndex=${encodeURIComponent(rowIndex)}&rating=${encodeURIComponent(rating)}&t=${Date.now()}`;
  return sendGasRequest(targetUrl);
};

export const updateNote = async (rowIndex: number, note: string): Promise<boolean> => {
  const targetUrl = `${API_URL}?action=note&rowIndex=${encodeURIComponent(rowIndex)}&note=${encodeURIComponent(note)}&t=${Date.now()}`;
  return sendGasRequest(targetUrl);
};
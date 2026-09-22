// src/types/index.ts
export interface TeamData {
  rowIndex: number;
  分區: string;
  縣市: string;
  鄉鎮: string;
  團隊名稱: string;
  '補助類型 (受國發會資源補助獎勵者，請填國發會計畫；若是多元徵案者，則填寫對接部會計畫)': string;
  獲補助經費: string;
  姓名: string;
  聯繫電話: string;
  '簡介(含表達能力、獲獎情形)': string;
  '團隊簡介(請以講故事的描述方式呈現)': string;
  與其他團隊串聯情形: string;
  '站點最多可容納人數/ 周邊場域最多可容納人數': string;
  '場地簡介(網址、照片等)': string;
  '參訪推薦星等 (1~5顆星)': string;
  備註?: string;
  [key: string]: any; // 支援動態欄位取值
}
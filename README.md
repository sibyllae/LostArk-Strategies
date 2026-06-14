# LostArk Strategies (失落的方舟攻略網)

LostArk Strategies 是一個為《失落的方舟》（Lost Ark）玩家打造的實用攻略與資料查詢網站。提供遊戲內多項重要系統的資訊整理，幫助玩家更有效率地規劃遊戲進度。

## 🌟 主要功能 (Features)

*   **好友度 (Rapport/Favorability):** 提供各個 NPC 的好感度需求、獎勵以及對話/樂譜/表情動作等相關資訊。
*   **冒險之書 (Adventurer's Tome):** 整理各大陸冒險之書的收集進度與攻略（包含料理、怪物、觀景點、隱藏故事等）。
*   **收集品 (Collectibles):** 追蹤各類收集品的進度，如島之心、巨人之心、偉大藝術品、摩可可種子等。
*   **副本開箱收益 (Raid Chests):** 提供各個深淵地牢、討伐星辰護衛與軍團長副本的通關寶箱收益分析，幫助玩家決定是否花費金幣開啟寶箱。
*   **雜項攻略 (Misc Guide):** 其他實用的小技巧、日常/週常任務建議及各式遊戲相關指南。

## 🛠️ 技術棧 (Tech Stack)

*   **前端框架:** React 18
*   **路由管理:** React Router DOM
*   **狀態管理:** Redux Toolkit & React Redux
*   **UI 組件庫:** Ant Design & Tailwind CSS
*   **建構工具:** Vite
*   **開發語言:** TypeScript

## 🚀 本地開發 (Local Development)

請確保您的系統已安裝 Node.js (建議 v18 以上)。

1.  **安裝依賴 (Install Dependencies)**
    ```bash
    npm install
    ```

2.  **啟動開發伺服器 (Start Dev Server)**
    ```bash
    npm run dev
    ```
    伺服器啟動後，預設可在瀏覽器訪問 `http://localhost:5173`。

3.  **編譯打包 (Build for Production)**
    ```bash
    npm run build
    ```

## 📦 部署 (Deployment)

專案目前配置為部署至 GitHub Pages，包含一個自動部署命令。

執行以下命令即可自動打包、處理 404 重新導向，並推送到 `gh-pages` 分支：
```bash
npm run deploy
```
*(請注意：執行前需確保已正確設定 GitHub Repository 權限與遠端連結。)*

## 📄 授權條款 (License)

This project is private and intended for personal/community use.

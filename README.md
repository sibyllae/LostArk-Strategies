# LostArk Strategies (失落的方舟攻略網)

LostArk Strategies 是一個為《失落的方舟》（Lost Ark）玩家打造的實用攻略與資料查詢網站。提供遊戲內多項重要系統的資訊整理，幫助玩家更有效率地規劃遊戲進度。

## 🌟 主要功能 (Features)

*   **好友度 (Rapport/Favorability):** 提供各大陸 NPC 的好感度需求、階段獎勵查詢，支援地區篩選、需求排序與關鍵獎勵快捷過濾。
*   **冒險之書 (Adventurer's Tome):** 整理 20 個大陸冒險之書 10%～90% 完成度里程碑獎勵一覽（涵蓋庫爾贊、里姆雷克等後期大陸）。
*   **收集品 (Collectibles):** 涵蓋島之心、巨人心臟、偉大藝術品、奧菲斯之星、伊格涅亞標誌、航海冒險物、記憶八音盒、血爪海圖與世界樹／摩可可等 9 大類追蹤。
*   **副本開箱收益 (Raid Chests):** 涵蓋 T3 軍團長／象牙塔至 T4 貝希莫斯／卡札羅斯第 1～4 幕與終幕（普通／困難），提供互動式逐關開箱試算。
*   **養成與配裝 (Systems & Gear):** T4 飾品研磨詞條、艾利西爾 40 覺、超越／卡爾瑪、單人模式商店與各大洲流浪商人傳說卡攻略。
*   **雜項攻略 (Misc Guide):** 裝等解鎖路線、T4 方舟星圖速查、副本戰鬥道具、曲譜、技能／悟性點數、符文、T3/T4 屬性卡組、日常限制與艾波娜委託推薦。
*   **全站快速搜尋 (`Ctrl / ⌘ + K`):** 可直接搜尋功能頁面、NPC、大陸、副本、樂譜與符文並跳轉定位。

## 🛠️ 技術棧 (Tech Stack)

*   **前端框架:** React 18
*   **路由管理:** React Router v7 (Data Router)
*   **狀態與資料快取:** Redux Toolkit & RTK Query
*   **UI 組件庫:** Ant Design 6 & Tailwind CSS
*   **建構與檢查:** Vite 5, TypeScript, ESLint 9

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
    伺服器啟動後，預設可在瀏覽器訪問 `http://localhost:5173/LostArk-Strategies/`。

3.  **程式碼檢查與編譯打包 (Lint & Build)**
    ```bash
    npm run lint
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

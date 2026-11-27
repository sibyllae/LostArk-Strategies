# ARKESIA CODEX · LostArk Strategies (失落的方舟・戰術與收集法典)

專為《失落的方舟》（Lost Ark）冒險者打造的低噪訊戰術法典與互動追蹤工具，完整涵蓋至 **2026 T4 卡達魯姆群島＆暗影襲擊戰紀元**。

## 🌟 主要功能 (Features)

*   **I · NPC 好友度圖鑑 (Rapport):** 收錄各大陸與島嶼重點 NPC 五階好感度獎勵、需求量尺排序與本機完成標記。
*   **II · 大陸冒險之書 (Adventurer's Tome):** 20 座大陸 10%～90% 里程碑橫軸（補齊庫爾贊北部 90% 微縮地圖等缺漏獎勵），並與伊格涅亞標誌即時連動。
*   **III · 收集品互動追蹤 (Collectibles):** 巨人心臟、血爪海圖、奧菲斯之星、島之心、偉大藝術品、伊格涅亞、記憶八音盒、航海冒險物與世界樹（至 108 片）／摩可可（至 1450 顆），支援瀏覽器本機勾選與「待收集」篩選。
*   **IV · 副本開箱與每週 3 本排程台 (Raid Gold Ledger):** 涵蓋 T3 單人／軍團長至 T4 卡札羅斯第 1～4 幕與終幕（普通／困難）、卡達魯姆地平線大聖堂（1～3 階綁金）、暗影襲擊戰「賽爾卡」（普／困／惡夢）與 1750「貝爾加丁」，內建遠征隊 1～6 角週收排程試算。
*   **V · 養成與配裝戰術 (Systems & Gear):** T4 飾品研磨精確下／中／上數值、T4 手鐲 S 級詞條（飛躍點／優越／匕首／弱點曝光／應援）、八大養成系統（含減負鍊金超越、進階精煉 1–40、T4 寶石、遺物書與 1750 新部位「護腕」），以及全 19 大陸流浪商人必蹲傳說卡（韋毅、巴亨圖爾、瓦爾格里斯、瓦爾坎等）。
*   **VI · 雙欄百科速查台 (Tactical Encyclopedia):** 12 章節獨立目錄（含新手快車→1780 路線、T4 守護者討伐＆殘影道具、龍騎士／女聖騎／幻獸師流派、方舟星圖 17 點、悟性點、技能點、卡組、符文、樂譜與日常委託）。
*   **星盤全站快速檢索 (`Ctrl / ⌘ + K`):** 跨全站章節、副本、NPC、手鐲詞條、守護者、商人與島嶼即時搜尋跳轉。

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

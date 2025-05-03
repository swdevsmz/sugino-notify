import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import axios from "axios";

const SITE_URL = "https://topcoat.co.jp/yosuke_sugino";
const DATA_DIR = path.resolve(__dirname, "../data");
const DATA_FILE = path.resolve(DATA_DIR, "appearances.txt");
const LINE_API_URL = "https://api.line.me/v2/bot/message/broadcast";
const LINE_ACCESS_TOKEN =
  process.env.LINE_ACCESS_TOKEN || "YOUR_LINE_ACCESS_TOKEN";

async function scrapeSite() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(SITE_URL);

  // 出演情報の一覧を取得
  const appearances = await page.evaluate(() => {
    const items = document.querySelectorAll(".contents-list-item");
    return Array.from(items).map((item) => {
      const title =
        item
          .querySelector(".contents-list-title.title.hidden-xs")
          ?.textContent?.trim() || "";
      const body = item.querySelector(".body")?.textContent?.trim() || "";
      return {
        title,
        body,
        text: `【${title}】\n${body}\n\n`,
      };
    });
  });

  await browser.close();
  return appearances;
}

function loadPreviousData(): string {
  if (fs.existsSync(DATA_FILE)) {
    return fs.readFileSync(DATA_FILE, "utf-8");
  }
  return "";
}

function saveCurrentData(data: { text: string }[]) {
  // データディレクトリが存在しない場合は作成
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const content = data.map((item) => item.text).join("---\n");
  fs.writeFileSync(DATA_FILE, content, "utf-8");
}

async function sendLineNotification(message: string) {
  try {
    await axios.post(
      LINE_API_URL,
      { messages: [{ type: "text", text: message }] },
      { headers: { Authorization: `Bearer ${LINE_ACCESS_TOKEN}` } }
    );
  } catch (error) {
    console.error("LINE通知の送信に失敗しました:", error);
  }
}

async function main() {
  try {
    const currentData = await scrapeSite();
    const previousData = loadPreviousData();
    const currentContent = currentData.map((item) => item.text).join("---\n");

    if (currentContent !== previousData) {
      console.log("新しい出演情報が見つかりました");
      const message = `出演情報が更新されました:\n\n${currentContent}\n詳細はこちら：${SITE_URL}`;
      await sendLineNotification(message);
      saveCurrentData(currentData);
      console.log("出演情報を保存し、LINE通知を送信しました");
    } else {
      console.log("出演情報に変更はありません");
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

main().catch(console.error);

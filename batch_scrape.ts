import { exec } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const baseUrl = process.env.SENKYOKU_URL || 'https://sangiin.go2senkyo.com/2025/prefecture/';
const resultsDir = path.join(__dirname, 'results');

// 結果保存ディレクトリ作成
mkdirSync(resultsDir, { recursive: true });

function runScrape(id: number): Promise<void> {
  const url = `${baseUrl}${id}`;
  return new Promise((resolve, reject) => {
    exec(`ts-node scrape.ts ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error scraping ${url}:`, stderr);
        return reject(error);
      }
      try {
        const json = JSON.parse(stdout);
        const filePath = path.join(resultsDir, `${id}.json`);
        writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
        console.log(`Saved: ${filePath}`);
        resolve();
      } catch (e) {
        console.error(`Failed to parse/save result for ${url}`);
        reject(e);
      }
    });
  });
}

(async () => {
  for (let i = 1; i <= 47; i++) {
    try {
      await runScrape(i);
    } catch (e) {
      console.error(`Failed for id ${i}`);
    }
  }
})();
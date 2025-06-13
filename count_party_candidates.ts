import { readdirSync, readFileSync } from 'fs';
import path from 'path';

const process = (yearDir : string) => {
  const resultsDir = path.join(__dirname, `results/${yearDir}`);
  const files = readdirSync(resultsDir).filter(f => f.endsWith('.json'));

  const partyCounts: Record<string, number> = {};

  for (const file of files) {
    const data = JSON.parse(readFileSync(path.join(resultsDir, file), 'utf-8'));
    if (Array.isArray(data.candidates)) {
      for (const candidate of data.candidates) {
        const party = candidate.party || '無所属';
        partyCounts[party] = (partyCounts[party] || 0) + 1;
      }
    }
  }

  // 出力
  console.log(`${yearDir}年 各政党の小選挙区立候補者人数:`);
  Object.entries(partyCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([party, count]) => {
      console.log(`   ${party}: ${count}`);
    });
}

process('2022');
process('2025');


import { readdirSync, readFileSync } from 'fs';
import path from 'path';

const resultsDir = path.join(__dirname, 'results');
const files = readdirSync(resultsDir).filter(f => f.endsWith('.json'));

const groupA = [
  '自由民主党',
  '公明党',
];
const groupB = [
  '社会民主党',
  '無所属連合',
  '日本共産党',
  '立憲民主党',
  '国民民主党',
  '無所属',
  '日本維新の会',
  'れいわ新選組',
  '日本改革党',
];

const found: { name: string, seats: number, A: string[], B: string[] }[] = [];

for (const file of files) {
  const data = JSON.parse(readFileSync(path.join(resultsDir, file), 'utf-8'));
  const num = typeof data.numOfSeats === 'string' ? parseInt(data.numOfSeats, 10) : data.numOfSeats;
  if (num >= 2) {
    const Aset = new Set<string>();
    const Bset = new Set<string>();
    if (Array.isArray(data.candidates)) {
      for (const candidate of data.candidates) {
        const party = (candidate.party || '').replace(/:|：|\s+$/g, '');
        if (groupA.includes(party)) Aset.add(party);
        if (groupB.includes(party)) Bset.add(party);
      }
    }
    found.push({ name: data.name, seats: num, A: Array.from(Aset), B: Array.from(Bset) });
  }
}

console.log('numOfSeatsが2以上の選挙区でチームAとチームBのパーティ:');
found.forEach(({ name, seats, A, B }) => {
  console.log(`${name}（${seats}）`);
  console.log('  A政党:', A.join(', '));
  console.log('  B政党:', B.join(', '));
});
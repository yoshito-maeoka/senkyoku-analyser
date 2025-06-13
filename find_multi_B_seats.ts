import { readdirSync, readFileSync } from 'fs';
import path from 'path';

const process = (yearDir: string) => {

  const resultsDir = path.join(__dirname, `results/${yearDir}/`);
  const files = readdirSync(resultsDir).filter(f => f.endsWith('.json'));

  const groupB = [
    '社会民主党',
    '無所属連合',
    '日本共産党',
    '立憲民主党',
    '国民民主党',
    '無所属',
    '日本維新の会',
    'れいわ新選組',
  ];

  const found: { name: string, parties: string[] }[] = [];
  const found2: { name: string, parties: string[] }[] = [];

  for (const file of files) {
    const data = JSON.parse(readFileSync(path.join(resultsDir, file), 'utf-8'));
    if (data.numOfSeats === '1') {
      const partiesSet = new Set<string>();
      const partiesList: string[] = [];
      if (Array.isArray(data.candidates)) {
        for (const candidate of data.candidates) {
          const party = (candidate.party || '').replace(/:|：|\s+$/g, '');
          if (groupB.includes(party)) {
            partiesSet.add(party);
            partiesList.push(party);
          }
        }
      }
      const uniqueParties = Array.from(partiesSet);
      if (uniqueParties.length >= 2) {
        found.push({ name: data.name, parties: uniqueParties });
      } else {
        found2.push({ name: data.name, parties: uniqueParties });
      }
    }
  }

  console.log('1人選挙区でグループBが2つ以上ある選挙区:', found.length);
  found.forEach(({ name, parties }) => {
    console.log(name);
    console.log('  B政党:', parties.join(', '));
  });

  console.log('1人選挙区でグループBに衝突のない選挙区:', found2.length);
  found2.forEach(({ name, parties }) => {
      console.log(name);
      console.log('  B政党:', parties.join(', '));
    });
  }

  process('2022');
  process('2025')
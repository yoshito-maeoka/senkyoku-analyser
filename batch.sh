#/bin/env sh

find results -size 0 -name '*.json' | xargs rm

for i in $(seq 1 1 47); do
  npx ts-node scrape https://sangiin.go2senkyo.com/2022/prefecture/$i > results/2022/$i.json;
  echo "saved results/2022/$i.json";
done;

for i in $(seq 1 1 47); do
  npx ts-node scrape https://sangiin.go2senkyo.com/2025/prefecture/$i > results/2025/$i.json;
  echo "saved results/2025/$i.json";
done;


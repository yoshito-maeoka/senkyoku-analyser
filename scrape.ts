#!/usr/bin/env ts-node
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Command } from 'commander';

const program = new Command();

program
  .argument('<url>', 'URL to scrape')
  .parse(process.argv);

const url = program.args[0];

if (!url) {
  console.error('URL is required.');
  process.exit(1);
}

async function scrape(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // 選挙区名
    const name = $(".m_page_head_ttl").clone().children().remove().end().text().trim() + "選挙区";

    // 議席数、候補者数、前回投票率
    let numOfSeats = '';
    let numOfCandidates = '';
    let votedRate = '';
    $(".m_page_head_data_para").each((_, el) => {
      const text = $(el).text();
      if (text.includes('議席数')) numOfSeats = $(el).find('.big').text().trim();
      if (text.includes('候補者数')) numOfCandidates = $(el).find('.big').text().trim();
      if (text.includes('前回投票率')) votedRate = $(el).find('.big').text().trim();
    });

    // 候補者情報
    const candidates: any[] = [];
    $(".p_senkyoku_list_block").each((_, el) => {
      // 名前
      const name = $(el).find('.p_senkyoku_list_block_name .text').text().replace(/\s+/g, ' ').trim();
      // 年齢・肩書き
      let age = '';
      let position = '';
      const paraText = $(el).find('.p_senkyoku_list_block_data_para').text().replace(/\s+/g, ' ').trim();
      const ageMatch = paraText.match(/(\d+)歳/);
      if (ageMatch) age = ageMatch[1];
      // 肩書き（年齢以外の部分を抽出）
      position = paraText.replace(/(\d+)歳/, '').replace(/^[\s\|｜]*|[\s\|｜]*$/g, '').trim();
      // 政党名
      const party = $(el).find('.p_senkyoku_list_block_data_party').first().text().trim();
      if (name) {
        candidates.push({ name, age, position, party });
      }
    });

    const result = {
      name,
      numOfSeats,
      numOfCandidates,
      votedRate,
      candidates,
    };
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

scrape(url);
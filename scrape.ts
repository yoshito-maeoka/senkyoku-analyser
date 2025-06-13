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

// 2022年ページ用のscrape関数
async function scrape2022(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // 選挙区名（h1や大きな見出しから取得）
    let name = $('h1').first().text().trim();
    if (!name) {
      name = $('title').text().replace(/\s*\|.*/, '').trim();
    }
    if (!name.endsWith('選挙区')) name += '選挙区';

    // 議席数・候補者数・投票率
    let numOfSeats = '';
    let numOfCandidates = '';
    let votedRate = '';
    const infoText = $('body').text();
    const seatsMatch = infoText.match(/議席数\s*[:：]\s*(\d+)/);
    if (seatsMatch) numOfSeats = seatsMatch[1];
    const candMatch = infoText.match(/候補者数\s*[:：]\s*(\d+)/);
    if (candMatch) numOfCandidates = candMatch[1];
    const voteMatch = infoText.match(/投票率\s*[:：]\s*([\d.]+)/);
    if (voteMatch) votedRate = voteMatch[1];

    // 候補者情報
    const candidates: any[] = [];
    $('.p_senkyoku_graph_block').each((_, el) => {
      const $el = $(el);
      // 名前
      const name = $el.find('.p_senkyoku_graph_block_profile_ttl').text().replace(/\s+/g, ' ').trim();
      // 年齢
      let age = '';
      let party = '';

      const ageText = $($el.find('.p_senkyoku_graph_block_profile_data_para')[0]).text();

      const ageMatch = ageText.match(/(\d+)歳/);
      if (ageMatch) age = ageMatch[1];
      // 政党名
      const partyMatch = ageText.match(/｜(.+)/);
      if (partyMatch) party = partyMatch[1].trim();

      const position = $( $el.filter('.p_senkyoku_graph_block_profile_data_para')[1] ).text().replace(/\s+/g, ' ').trim();
      // 肩書き
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

if (url.includes('2022')) {
  scrape2022(url);
} else {
  scrape(url);
}
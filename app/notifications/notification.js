const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const targetURL = "https://booth.pm/ja/items?sort=new&tags%5B%5D=VRChat";

const scrapeBoothData = () => {
    const getLatestItem = ($) => {
        const items = $('.l-cards-5cols li');
        const itemData = [];
        let index = 0;
        const itemPromises = items.map((i, el) => {
            if(index > 4) {
              return
            }
            const item = {};
    
            item.index = index;
            index += 1;
            item.name = $(el).find('.item-card__title > a').text();
            item.shop_name = $(el).find('.item-card__shop-name').text();
            item.url = $(el).find('.item-card__thumbnail-images > a').attr('href');
            item.image = ''; // 画像のURLを格納するためのプロパティを追加
    
            // 画像のURLを取得してitemオブジェクトに格納
            return axios.get(item.url)
            .then((response) => {
                const body = response.data;
                const $ = cheerio.load(body);
                item.data_product_id = $('.market').attr('data-product-id');
                item.data_product_brand = $('.market').attr('data-product-brand');
                item.data_shop_tracking_product_id = $('.market').attr('data-shop-tracking-product-id');
                item.data_product_category = $('.market').attr('data-product-category');
                item.img = $('.market-item-detail-item-image-wrapper > img').attr('src');// 画像のURLを取得
                itemData.push(item);
            })
            .catch((error) => {
                console.error(error);
            });
        }).get();
        return Promise.all(itemPromises).then(() => itemData);
    };
    return axios.get(targetURL).then((response) => {
        const body = response.data;
        const $ = cheerio.load(body);
        return getLatestItem($);
    }).then((itemData) => {
        return itemData;
    }).catch((error) => {
        console.error(error);
    });
};

module.exports = scrapeBoothData;

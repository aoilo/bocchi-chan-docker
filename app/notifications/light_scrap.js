const axios = require('axios')
const cheerio = require('cheerio')
const jsonfile = require('jsonfile')
const _ = require('lodash')
// const util = require('util')
const path = require('path')

const url = 'https://booth.pm/ja/items?sort=new&tags%5B%5D=VRChat'
const dataFile = path.join(__dirname, '../temp/data.json')
const diffFile = path.join(__dirname, '../temp/differences.json')

const scrapeBoothData = async () => {
	try {
		const response = await axios.get(url)
		const $ = cheerio.load(response.data)

		const items = $('.l-cards-5cols li')
		const itemData = []
		let index = 0

		items.each((i, el) => {
			if (index > 59) {
				return
			}
			const item = {}

			let regex = /(https:\/\/booth.pximg.net)\/c\/[a-zA-Z0-9_]*\/(.*)/

			item.index = index
			index += 1
			item.name = $(el).find('.item-card__title > a').text()
			item.shop_name = $(el).find('.item-card__shop-name').text()
			let img = $(el).find('.item-card__thumbnail-images > a').attr('data-original')
			item.img = img.replace(regex, '$1/$2')
			item.url = $(el).find('.item-card__thumbnail-images > a').attr('href')
			item.data_product_brand = $(el).attr('data-product-brand')
			item.data_product_id = $(el).attr('data-product-id')
			item.data_product_category = $(el).attr('data-product-category')
			itemData.push(item)
		})

		return itemData
	} catch (error) {
		console.error('Error:', error)
	}
}

const compareAndWriteData = async () => {
	try {
		const newData = await scrapeBoothData()
		let oldData = []

		try {
			oldData = jsonfile.readFileSync(dataFile)
		} catch (error) {
			console.log('No existing data, writing new data.')
		}

		const newItem = _.differenceBy(newData, oldData, 'url')

		if (newItem.length > 0) {
			console.log('New items found, writing new data.')
			jsonfile.writeFileSync(dataFile, newData, { spaces: 2 })
			console.log('New items: ', newItem);
			jsonfile.writeFileSync(diffFile, newItem, { spaces: 2 })
			return 0
		} else {
			console.log('No new items found.')
			return 1
		}

	} catch (error) {
		console.error('Error:', error)
	}
}

module.exports = compareAndWriteData
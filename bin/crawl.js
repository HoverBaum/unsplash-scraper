/**
*	A simple app that sracpes unsplash page by page.
*
*	Scrapes one page after another so you can go back and continue if you need to take a break.
*
*/


const request = require('request')
const cheerio = require('cheerio')
const http = require('https')
const fs = require('fs')
const path = require('path')

//Some counters to provide feedback.
let pagesToProcess = 0
let pagesProcessed = 0
const imagesToProcess = []
const imagesProcessed = []

//Other things we need to remember.
let startPage = 1
let endPage = 1

/**
 *	Scrape wultiple pages into a given folder.
 */
module.exports = function scrapeImages(theStartPage, theEndPage, theFolder) {

	startPage = theStartPage
	endPage = theEndPage
	folder = theFolder

	//remember how many pages we need to process.
	pagesToProcess = endPage - startPage + 1

	//Make sure folder is set, else set to default.
	if (folder === undefined) {
		folder = 'photos'
	}
	const absFolder = path.resolve(folder)

	//make sure the folder actually exists.
	if (!fs.existsSync(folder)){
		fs.mkdirSync(folder)
	}

	console.log('Starting to scrape images, processing ' + pagesToProcess + ' pages.')
	console.log('Scrapring images from page ' + theStartPage + ' to page ' + theEndPage + ' into folder ' + absFolder)

	//scrape all pages seperately.
	scrapeNextPage(absFolder)
}

/**
*	Starts the scraping of the next page.
*/
function scrapeNextPage(folder) {
	console.log('Processed pages: ' + pagesProcessed + '/' + pagesToProcess);
	console.log(' ');
	if(startPage + pagesProcessed > endPage) {
		console.log('Finished scraping images.');
	} else {
		scrapePage(startPage + pagesProcessed, folder, scrapeNextPage);
	}
}

/**
 *	Scrape page into a given folder.
 */
function scrapePage(index, folder, callback) {
	var url = 'http://unsplash.com/?page=' + index
	console.log('Getting all images for page ' + index)

	//Get the contents of the url and work with it.
	request(url, function (err, resp, body) {
		if (err) throw err
		$ = cheerio.load(body)

		//make sure to remember how many images there are to craw and how many we finished.
		imagesToProcess[index] = $('.cV68d').length
		imagesProcessed[index] = 0

		//Iterate over all images on this page and get the links to download them.
		$('.cV68d').each(function () {
			//console.log(this.attribs.src.split('?')[0]);

			//generate the link to the non-cropped image.
			const link = this.attribs.style.split(';')
			 	.filter(string => /^background-image/.test(string))[0]
				.split('"')[1].split('?')[0]

			//also generate a name for this iamge.
			var name = link.split('/')[3]
			var filePath = path.join(folder, name) + '.jpg'


			downloadImage(link, filePath, function() {
				imagesProcessed[index] += 1
				console.log('Processing page: ' + index + ' scraped image: ' + imagesProcessed[index] + '/' + imagesToProcess[index])
				if(imagesProcessed[index] === imagesToProcess[index]) {
					pagesProcessed += 1
					callback(folder)
				}
			});

		});

	});
}

/**
 *	Downloads an image and saves it at a given path.
 *	Path needs to include filename and ending.
 */
function downloadImage(link, path, callback) {
	var request = http.get(link, function (res) {
		var imagedata = ''
		res.setEncoding('binary')

		res.on('data', function (chunk) {
			imagedata += chunk
		})

		res.on('end', function () {

			//When all data is here, save image at provided path.
			fs.writeFile(path, imagedata, 'binary', function (err) {
				if (err) throw err
				callback()
			});
		});

	});
}

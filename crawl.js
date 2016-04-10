/**
*	A simple app that sracpes unsplash page by page.
*
*	Scrapes one page after another so you can go back and continue if you need to take a break.
*
*/


var request = require('request');
var cheerio = require('cheerio');
var http = require('https');
var fs = require('fs');

//Some counters to provide feedback.
var pagesToProcess = 0;
var pagesProcessed = 0;
var imagesToProcess = [];
var imagesProcessed = [];

//Other things we need to remember.
var startPage = 1;
var endPage = 1;
var folder = '';

/**
 *	Scrape wultiple pages into a given folder.
 */
module.exports = function scrapeImages(theStartPage, theEndPage, theFolder) {

	startPage = theStartPage;
	endPage = theEndPage;
	folder = theFolder;

	//remember how many pages we need to process.
	pagesToProcess = endPage - startPage + 1;

	//Make sure folder is set, else set to default.
	if (folder === undefined) {
		folder = 'photos';
	}
	folder += '/';

	//make sure the folder actually exists.
	if (!fs.existsSync(folder)){
		fs.mkdirSync(folder);
	}

	console.log('Starting to scrape images, processing ' + pagesToProcess + ' pages.');
	console.log('Scrapring images from page ' + theStartPage + ' to page ' + theEndPage + ' into folder ' + folder);

	//scrape all pages seperately.
	scrapeNextPage();
}

/**
*	Starts the scraping of the next page.
*/
function scrapeNextPage() {
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
	var url = 'http://unsplash.com/?page=' + index;
	console.log('Getting all images for page ' + index);

	//Get the contents of the url and work with it.
	request(url, function (err, resp, body) {
		if (err) throw err;
		$ = cheerio.load(body);

		//make sure to remember how many images there are to craw and how many we finished.
		imagesToProcess[index] = $('.photo img').length;
		imagesProcessed[index] = 0;

		//Iterate over all images on this page and get the links to download them.
		$('.photo img').each(function () {
			//console.log(this.attribs.src.split('?')[0]);

			//generate the link to the non-cropped image.
			var link = this.attribs.src.split('?')[0];

			//also generate a name for this iamge.
			var name = link.split('/')[3];
			var path = folder + name + '.jpg';

			downloadImage(link, path, function() {
				imagesProcessed[index] += 1;
				console.log('Processing page: ' + index + ' scraped image: ' + imagesProcessed[index] + '/' + imagesToProcess[index]);
				if(imagesProcessed[index] === imagesToProcess[index]) {
					pagesProcessed += 1;
					callback();
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
				callback();
			});
		});

	});
}

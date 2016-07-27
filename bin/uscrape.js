#! /usr/bin/env node

//Use commander to handle commanline interaction.
const cli = require('commander')

//Get the npm packe so we can read from it.
const packageInfo = require('./../package.json');

const scrape = require('./crawl')

cli
    .version(packageInfo.version)
    .usage('[cmd] <startIndex> <endIndex> [folder]')
    .description(packageInfo.description)
	.action(function (startIndex, endIndex, folder) {
		//Make sure user supplied all we need.
		if(isNaN(startIndex) || isNaN(endIndex)) {
			console.log('\nPlease supply all parameters.\nLike: uscrape 1 2 images\n\nUse --help for help ;)')
			return
		}

		startIndex = parseInt(startIndex)
		endIndex = parseInt(endIndex)
		if(typeof folder !== 'string') {
			folder = './'
		}


		//Start the scraper.
		scrape(startIndex, endIndex, folder)
	})

//Runn commander.js
cli.parse(process.argv)

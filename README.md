# unsplash-scraper

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

A simple command line scraper for https://unsplash.com/.

##Usage:

```
git clone git@github.com:HoverBaum/unsplash-scraper.git

cd unsplash-scraper

npm install

node crawl.js [startPage] [endPage] [folder]
```

###Commandline variables:
**startPage** The page to start with (this page will be scraped)

**endPage** The last page to scrape (this page will be scraped)

**folder** The folder to save the images into. No trailing '/'.

###Example call

`node crawl.js 1 4 images`

This will scrape pages 1-4 into the folder images. The folder will be inside the currently active folder and will be created if it does not exist.

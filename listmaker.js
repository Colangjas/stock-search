const puppeteer = require("puppeteer");
const chalk = require("chalk");
const fs = require("fs");

const error = chalk.bold.red;
const success = chalk.keyword("green");

console.log('Launching Listmaker\n');

(async () => {
    console.log('Launching Async function\n');

    try {
        //  open headless browser
        let browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--unhandled-rejections=strict']});

        // open new page
        let page = await browser.newPage();
        // page url
        await page.goto(`https://www.barchart.com/stocks/highs-lows/highs?timeFrame=1y&page=all`);

        let xPath = '//*[@id="main-content-column"]/div/div[7]/div/div[2]/div/div/ng-transclude/table/tbody/tr[1]/td[1]/div/span[2]';
        await page.waitForXPath(xPath);

        let stocks = await page.evaluate(() => {
            let symbolNodeList = document.querySelectorAll("td.symbol > div > span:nth-child(2) > a");
            let priceNodeList = document.querySelectorAll("td.lastPrice > div > span > span > span");
            let symbolLinkArray = [];

            for (let i = 0; i < symbolNodeList.length; i++){
                symbolLinkArray[i] = {
                    "symbol": symbolNodeList[i].textContent.trim(),
                    "price": priceNodeList[i].textContent.trim()
                };
            }
            return symbolLinkArray;
        });
        await browser.close();
        fs.writeFile("barchart-stocks.json", JSON.stringify(stocks), function(err) {
            if (err) throw err;
            console.log("Saved!");
        })
        console.log(success("Browser Closed"));
    } catch (err) {
        console.log(error(err));
        await browser.close();
        console.log(error("Browser Closed"));
    }
})();
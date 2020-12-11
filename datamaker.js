const puppeteer = require("puppeteer");
const chalk = require("chalk");
const fs = require("fs");
const stocks = require('./barchart-stocks.json');

const error = chalk.bold.red;
const success = chalk.keyword("green");

console.log('Launching Datamaker\n');

for(let i = 0; i<stocks.length; i++){
    MakeData(stocks[i]);
}


function MakeData(stock){

    (async () => {
        console.log('Launching Async function\n');
    
        try {
            //  open headless browser
            let browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--unhandled-rejections=strict']});
    
            // open new page
            let page = await browser.newPage();
            // page url
            await page.goto(`https://ca.finance.yahoo.com/quote/`+stock.symbol+`/key-statistics`);
    
                let xPath = '//*[@id="Col1-0-KeyStatistics-Proxy"]/section/div[2]/div[2]/div/div[2]/div/div/table/tbody/tr[4]/td[2]';
            await page.waitForXPath(xPath);
    
            let stocks = await page.evaluate(() => {
                let priceNodeList = document.querySelector("#quote-header-info > div.My\\(6px\\).Pos\\(r\\).smartphone_Mt\\(6px\\) > div.D\\(ib\\).Va\\(m\\).Maw\\(65\\%\\).Ov\\(h\\) > div > span.Trsdu\\(0\\.3s\\).Fw\\(b\\).Fz\\(36px\\).Mb\\(-4px\\).D\\(ib\\)")
                let symbolLinkArray = [];
    
                for (let i = 0; i < priceNodeList.length; i++){
                    symbolLinkArray[i] = {
                        "price": priceNodeList[i].textContent.trim()
                    };
                }
                return symbolLinkArray;
            });
            await browser.close();
            fs.writeFile(stock.symbol+"-.json", JSON.stringify(stocks), function(err) {
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
}
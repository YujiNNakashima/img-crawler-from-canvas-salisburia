const puppeteer = require('puppeteer');
const fs = require('fs');
const nodeHtmlToImage = require('node-html-to-image');

(async () => {

  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto('http://www.bl.uk/manuscripts/Viewer.aspx?ref=add_ms_18852_fs001r', {
    waitUntil: ['domcontentloaded', 'networkidle0', 'networkidle2'],
  });

  for(let i = 0; i < 5; i++) {
    await page.evaluate(async() => {
      const nextBtn = document.querySelector('#nextpage')
      nextBtn.click()
    })
    await page.waitForTimeout(3000)

    await page.waitForSelector('canvas')
    const canvas = await page.$('canvas');
    
    const imgSrc = await canvas.evaluate((domElement) => {
      return domElement.toDataURL(); 
    })

    nodeHtmlToImage({
      output: `./pages/${i}.png`,
      html: '<html><body><img src="' + imgSrc + '" /></body></html>'
    }).then(() => console.log('The image was created successfully!'))

  }

  await browser.close();
})();

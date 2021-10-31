const puppeteer = require('puppeteer');
const fs = require('fs');
const nodeHtmlToImage = require('node-html-to-image');

(async () => {

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('http://www.bl.uk/manuscripts/Viewer.aspx?ref=add_ms_18852_fs001r', {
    waitUntil: ['domcontentloaded', 'networkidle0', 'networkidle2'],
  });
  // await page.screenshot({ path: 'pages/0.png' });


  // for(let i = 1; i < 2; i++) {
  //   await page.evaluate(async() => {
  //     const nextBtn = document.querySelector('#nextpage')
  //     nextBtn.click()
  //   })
    await page.waitForSelector('canvas')
    const canvas = await page.$('canvas');
    
    const imgSrc = await canvas.evaluate((domElement) => {
      return domElement.toDataURL(); 
      
    })

    nodeHtmlToImage({
      output: './image.png',
      html: '<html><body><img src="' + imgSrc + '" /></body></html>'
    }).then(() => console.log('The image was created successfully!'))

  await browser.close();
})();

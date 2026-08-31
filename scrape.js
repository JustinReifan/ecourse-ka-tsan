const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://gumpreneur.id/', {waitUntil: 'networkidle2'});
    const texts = await page.evaluate(() => {
        // find elements that are likely captions, e.g. p tags inside testimonials
        const pTags = Array.from(document.querySelectorAll('#testimonials p'));
        return pTags.map(p => p.innerText);
    });
    console.log(texts);
    await browser.close();
})();

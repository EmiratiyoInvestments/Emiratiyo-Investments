import puppeteer from 'puppeteer-core';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const routes = ['/', '/properties', '/contact'];
const distDir = path.resolve(__dirname, 'dist');

async function prerender() {
  const app = express();
  app.use(express.static(distDir));
  
  // Serve index.html for all routes so SPA works
  app.use((req, res) => {
    res.sendFile(path.resolve(distDir, 'index.html'));
  });

  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Server started on port ${port}`);

    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: "new"
    });
    const page = await browser.newPage();

    for (const route of routes) {
      console.log(`Prerendering ${route}...`);
      await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0' });
      
      const html = await page.content();
      
      const routePath = route === '/' ? '' : route;
      const targetDir = path.join(distDir, routePath.slice(1));
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(targetDir, 'index.html'), html);
      console.log(`Saved ${routePath}/index.html`);
    }

    await browser.close();
    server.close();
    console.log('Prerendering complete!');
  });
}

prerender().catch(console.error);

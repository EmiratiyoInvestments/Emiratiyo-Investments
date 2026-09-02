import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
const routes = [{
  path: '/',
  file: 'index.html'
}, {
  path: '/properties',
  file: 'properties/index.html'
}, {
  path: '/contact',
  file: 'contact/index.html'
}];
const distPath = path.resolve('dist');
async function prerender() {
  console.log('Starting lightweight pre-rendering...');
  const templatePath = path.join(distPath, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html not found. Run vite build first.');
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');
  for (const route of routes) {
    const targetDir = path.join(distPath, path.dirname(route.file));
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, {
        recursive: true
      });
    }
    const dom = new JSDOM(template);
    const document = dom.window.document;
    if (route.path === '/properties') {
      document.title = 'Properties - Emiratiyo Investments';
    } else if (route.path === '/contact') {
      document.title = 'Contact Us - Emiratiyo Investments';
    }
    fs.writeFileSync(path.join(distPath, route.file), dom.serialize());
    console.log(`Pre-rendered ${route.path} -> ${route.file}`);
  }
  console.log('Pre-rendering complete!');
}
prerender().catch(err => {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
});

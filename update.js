const fs = require('fs');
const path = require('path');

const baseDir = 'e:/openrise-projekt/public';
const dirs = [
    { path: baseDir, lang: 'de' },
    { path: path.join(baseDir, 'en'), lang: 'en' },
    { path: path.join(baseDir, 'fa'), lang: 'fa' }
];

const texts = {
    de: { features: 'Features', blog: 'Blog', pricing: 'Preise', demo: 'Demo' },
    en: { features: 'Features', blog: 'Blog', pricing: 'Pricing', demo: 'Demo' },
    fa: { features: 'ویژگی‌ها', blog: 'وبلاگ', pricing: 'قیمت‌گذاری', demo: 'دمو' }
};

for (const dir of dirs) {
    if (!fs.existsSync(dir.path)) continue;
    const files = fs.readdirSync(dir.path).filter(f => f.endsWith('.html'));
    
    for (const file of files) {
        const filePath = path.join(dir.path, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const t = texts[dir.lang];
        
        // Update header
        const headerRegex = /<div class="nav-links">[\s\S]*?(<div class="lang-switcher-nav">)/;
        const newNav = `<div class="nav-links">
                <a href="features.html">${t.features}</a>
                <a href="blog-fachkraeftemangel.html">${t.blog}</a>
                <a href="pricing.html">${t.pricing}</a>
                <a href="demo.html" class="btn btn-primary">${t.demo}</a>
                $1`;
        
        content = content.replace(headerRegex, newNav);
        
        fs.writeFileSync(filePath, content, 'utf8');
    }
}
console.log('Update complete.');

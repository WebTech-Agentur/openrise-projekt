const fs = require('fs');
const path = require('path');

const baseDir = 'e:/openrise-projekt/public';
const dirs = [
    { path: baseDir, lang: 'de' },
    { path: path.join(baseDir, 'en'), lang: 'en' },
    { path: path.join(baseDir, 'fa'), lang: 'fa' }
];

const texts = {
    de: {
        platform: 'Plattform', home: 'Home', features: 'Features', pricing: 'Preise', demo: 'Demo', blog: 'Blog',
        company: 'Unternehmen', team: 'Team & Vision', contact: 'Kontakt', privacy: 'Datenschutz', imprint: 'Impressum', cookies: 'Cookies'
    },
    en: {
        platform: 'Platform', home: 'Home', features: 'Features', pricing: 'Pricing', demo: 'Demo', blog: 'Blog',
        company: 'Company', team: 'Team & Vision', contact: 'Contact', privacy: 'Privacy Policy', imprint: 'Imprint', cookies: 'Cookies'
    },
    fa: {
        platform: 'پلتفرم', home: 'خانه', features: 'ویژگی‌ها', pricing: 'قیمت‌گذاری', demo: 'دمو', blog: 'وبلاگ',
        company: 'شرکت', team: 'تیم و چشم‌انداز', contact: 'تماس', privacy: 'حریم خصوصی', imprint: 'اطلاعات حقوقی', cookies: 'تنظیمات کوکی'
    }
};

for (const dir of dirs) {
    if (!fs.existsSync(dir.path)) continue;
    const files = fs.readdirSync(dir.path).filter(f => f.endsWith('.html'));
    
    for (const file of files) {
        const filePath = path.join(dir.path, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const t = texts[dir.lang];
        
        // Find the two footer-col blocks
        const colRegex = /<div class="footer-col">[\s\S]*?<\/div>\s*<div class="footer-col">[\s\S]*?<\/div>/;
        
        const newCols = `<div class="footer-col">
                    <h4 class="footer-heading">${t.platform}</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">${t.home}</a></li>
                        <li><a href="features.html">${t.features}</a></li>
                        <li><a href="pricing.html">${t.pricing}</a></li>
                        <li><a href="demo.html">${t.demo}</a></li>
                        <li><a href="blog-fachkraeftemangel.html">${t.blog}</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-heading">${t.company}</h4>
                    <ul class="footer-links">
                        <li><a href="team.html">${t.team}</a></li>
                        <li><a href="contact.html">${t.contact}</a></li>
                        <li><a href="datenschutz.html">${t.privacy}</a></li>
                        <li><a href="impressum.html">${t.imprint}</a></li>
                        <li><a href="#" class="cookie-settings-trigger">${t.cookies}</a></li>
                    </ul>
                </div>`;
                
        if (colRegex.test(content)) {
            content = content.replace(colRegex, newCols);
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
}
console.log('Footer update complete.');

const fs = require('fs');
let content = fs.readFileSync('c:/Users/gpilc/Desktop/ai-programy/Alif AI/data/islamic-faq.js', 'utf8');

const map = {
  'Ä…': 'ą',
  'Ä‡': 'ć',
  'Ä™': 'ę',
  'Ĺ‚': 'ł',
  'Ĺ„': 'ń',
  'Ăł': 'ó',
  'Ĺ›': 'ś',
  'Ĺş': 'ź',
  'ĹĽ': 'ż',
  'Ä„': 'Ą',
  'Ä†': 'Ć',
  'Ä': 'Ę',
  'Ĺ': 'Ł',
  'Ĺƒ': 'Ń',
  'Ă“': 'Ó',
  'Ĺš': 'Ś',
  'Ĺą': 'Ź',
  'Ĺ»': 'Ż'
};

for (const [bad, good] of Object.entries(map)) {
  content = content.split(bad).join(good);
}

fs.writeFileSync('c:/Users/gpilc/Desktop/ai-programy/Alif AI/data/islamic-faq.js', content, 'utf8');
console.log('Fixed encoding in data/islamic-faq.js');

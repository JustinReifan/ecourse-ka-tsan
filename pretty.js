import fs from 'fs';
const data = fs.readFileSync('extracted.txt', 'utf8');
try {
  const json = JSON.parse(data);
  console.log(JSON.stringify(json.props, null, 2));
} catch(e) { console.error(e.message) }

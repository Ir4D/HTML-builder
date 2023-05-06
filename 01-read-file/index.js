const fs = require('fs');
const path = require('path');

const reader = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8'
);

reader.on('error', function (error) {
  console.log(`error: ${error.message}`);
})

reader.on('data', (chunk) => {
  console.log(chunk);
})

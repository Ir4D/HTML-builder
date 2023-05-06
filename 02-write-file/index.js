const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

const output = fs.createWriteStream(
  path.join(__dirname, 'newText.txt'),
  'utf-8'
);

stdout.write('Please write your text below: \n');

stdin.on('data', (data) => {
  if (data.toString().includes('exit')) {
    stdout.write('Your data has been added to the file newText.txt');
    process.exit();
  }
  
  output.write(data);

  process.on('SIGINT', () => {
    stdout.write('\nYour data has been added to the file newText.txt');
    process.exit();
  });
});

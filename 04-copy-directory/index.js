const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const dirFiles = path.join(__dirname, 'files');
const dirFilesCopy = path.join(__dirname, 'files-copy');

async function delDir() {
  await fsPromises.rm(dirFilesCopy, 
    { recursive: true, force: true }, 
    (err) => {
      if (err) throw err;
      console.log('Directory deleted successfully!');
    }
  );
  await copyDir();
} 

async function copyDir() {
  await fsPromises.mkdir(dirFilesCopy, { recursive: true }, err => {
    if (err) throw err;
    console.log('Directory created successfully!');
  });

  const files = await fsPromises.readdir(dirFiles);

  files.forEach(file => {
    const startFile = path.join(__dirname, 'files', file);
    const endFile = path.join(__dirname, 'files-copy', file);
    fsPromises.copyFile(startFile, endFile);
  });
}

delDir();

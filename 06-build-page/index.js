const fs = require('fs');
const fsPromises = require('fs').promises;
const { readFile, writeFile } = require('fs/promises');
const path = require('path');

const dirStyles = path.join(__dirname, 'styles');
const dirProject = path.join(__dirname, 'project-dist');
const dirProjectAssets = path.join(__dirname, 'project-dist', 'assets');
const dirAssets = path.join(__dirname, 'assets');
const dirComponents = path.join(__dirname, 'components');

// DELETE DIRECTORY
async function delDir() {
  await fsPromises.rm(dirProject, 
    { recursive: true, force: true }, 
    (err) => {
      if (err) throw err;
    }
  );
  await copyAssets(dirAssets, dirProjectAssets);
  await createStyles();
  await copyTemp();
} 
delDir();

// MAKE DIRECTORY
async function makeDir() {
  await fsPromises.mkdir(dirProject, { recursive: true }, err => {
    if (err) throw err;
    console.log('Directory created successfully!');
  });
}
makeDir();

// COPY FILES
async function copyAssets(dirOrigin, dirCopy) {
  await fsPromises.mkdir(dirCopy, { recursive: true }, err => {
    if (err) throw err;
  });
  
  const files = await fsPromises.readdir(dirOrigin, { withFileTypes: true });

  for (let file of files) {
    const fileName = file.name;
    const startFile = path.join(dirOrigin, fileName);
    const endFile = path.join(dirCopy, fileName);
    
    if (file.isFile()) {
      await fsPromises.copyFile(startFile, endFile);
    } else {
      await copyAssets(startFile, endFile);
    }
  };
}

// CREATE COMMON STYLE.CSS
async function createStyles() {
  const stylesFile = fs.createWriteStream(
    path.join(dirProject, 'style.css'),
    'utf-8',
    { flags: 'a' }
  );

  fs.readdir(dirStyles, 
    { withFileTypes: true },
    (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.stat(path.join(dirStyles, file.name), (error) => {
            if (error) {
              console.log(error);
            } else if (path.extname(file.name) === '.css') {
              fs.createReadStream(path.join(dirStyles, file.name),
              'utf-8')
                .pipe(stylesFile);
            };
          });
        }
      })
    }
  })
}

// COPY TEMPLATES
async function copyTemp() {
  const templateFile = await readFile(path.join(__dirname, 'template.html'), 'utf-8');
  await writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateFile);
  let htmlFile = await readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
  const components = await fsPromises.readdir(dirComponents);

  for (let file of components) {
    const tagName = file.split('.')[0];
    if (file.split('.')[1] === 'html') {
      const componentsFile = await readFile(path.join(dirComponents, file));
      htmlFile = htmlFile.replace(`{{${tagName}}}`, `${componentsFile.toString()}`);
    }
  }

  await writeFile(path.join(__dirname, 'project-dist', 'index.html'), htmlFile)
}

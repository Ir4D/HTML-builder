const fs = require('fs');
const path = require('path');
const dirStyles = path.join(__dirname, 'styles');

const bundleFile = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  'utf-8',
  { flags: 'a' }
);

async function readDir() {
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
                .pipe(bundleFile);
            };
          });
        }
      })
    }
  })
}

readDir();

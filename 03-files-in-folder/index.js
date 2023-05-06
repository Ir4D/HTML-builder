const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, 
  { withFileTypes: true },
  (err, files) => {
  if (err)
    console.log(err);
  else {
    console.log("Files in the directory 'secret-folder':");
    files.forEach(file => {
      if (file.isFile()) {
        fs.stat(path.join(dir, file.name), (error, stats) => {
          if (error) {
            console.log(error);
          }
          else {
            console.log(`${file.name.split('.')[0]} - ${path.extname(file.name).slice(1)} - ${stats.size} bytes`);
          }
        });
      }
    })
  }
})

const fs   = require('fs');
const path = require('path');

fs.readdir('accounts', (err, fileList) => {
  const lastItem = fileList[fileList.length - 1];

  fs.readFile(path.join('accounts', lastItem), (err, fileContents) => {
    console.log(fileContents.toString());
  });
});
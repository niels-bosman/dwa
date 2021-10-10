const fs = require('fs');

const read = (fileName, callback) => {
  fs.readFile(fileName, (err, fileData) => {
    const result = JSON.parse(fileData.toString());
    callback(result);
  });
};

read('tsconfig.json', data => console.log(data?.target));
const fs = require('fs');

//Promise-based interface definitie
function readFileP(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, value) => err ? reject(err) : resolve(value));
  });
}

//Gebruik van de functie
readFileP('test.txt').then(value => {
  console.log(value.toString());
});
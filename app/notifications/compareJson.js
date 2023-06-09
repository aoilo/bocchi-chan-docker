const fs = require('fs');
const path = require('path');

function compareJsonFiles(directoryPath, predefinedJson) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      let mismatchCount = 0;

      files.forEach(file => {
        if (path.extname(file) === '.json') {
          const filePath = path.join(directoryPath, file);

          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              reject(err);
              return;
            }

            try {
              const json = JSON.parse(data);
              const index0Item = json.find(item => item.index === 0);

              if (!index0Item || JSON.stringify(index0Item) !== JSON.stringify(predefinedJson[0])) {
                mismatchCount++;
              }
            } catch (error) {
              reject(error);
            }

            if (mismatchCount > 0) {
              resolve(0); // 一致しなかった場合、0を返す
            } else {
              resolve(1); // 一致した場合、1を返す
            }
          });
        }
      });
    });
  });
}

module.exports = compareJsonFiles;
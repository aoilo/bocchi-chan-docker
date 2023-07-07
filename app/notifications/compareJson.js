const fs = require('fs');
const path = require('path');

function compareJsonFiles(directoryPath, predefinedJson) {
  console.log(predefinedJson);
  return new Promise((resolve, reject) => {
    fs.promises.readdir(directoryPath).then((files) => {
      console.log(files);
      let readPromises = [];

      files.forEach(file => {
        if (path.extname(file) === '.json') {
          const filePath = path.join(directoryPath, file);

          // Push each read file promise into the array
          readPromises.push(fs.promises.readFile(filePath, 'utf8'));
        }
      });

      // Wait for all readFile promises to resolve
      Promise.all(readPromises).then((fileContents) => {
        let mismatchFound = false;

        // Loop through each file content
        fileContents.forEach(data => {
          try {
            const json = JSON.parse(data);

            // Compare entire JSON data
            if (JSON.stringify(json) !== JSON.stringify(predefinedJson)) {
              mismatchFound = true; // Set the flag if mismatch is found
            }
          } catch (error) {
            reject(error);
          }
        });

        // Check if any mismatch was found
        if (mismatchFound) {
          resolve(0); // If any mismatch was found, return 0
        } else {
          resolve(1); // If no mismatch was found (all matched), return 1
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = compareJsonFiles;
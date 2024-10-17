const actions = require("@actions/core");
const path = require("path");
const fs = require("fs");

function processJsonFiles(directoryPath: string): Map<string, any[]> {
  const result: Map<string, any[]> = new Map();
  
  const files = fs.readdirSync(directoryPath);
  
  for (const file of files) {
    if (file === "template.json"){
      continue
    }
    if (path.extname(file).toLowerCase() === '.json') {
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      try {
        let jsonData = JSON.parse(fileContent);
        if (!Array.isArray(jsonData)) {
          jsonData = [jsonData];
        }
        for (const data of jsonData) {
          
          if (result.has(data.Network)) {
            result.get(data.Network).push(data);
          } else {
            result.set(data.Network, [data]);
          }
        }
      } catch (error) {
        actions.setFailed(`Error processing file ${file}:`, error);
      }
    }
  }
  
  return result;
}

async function main() {
  const assetsDir = "./assets";
  const outputFile = './combined_output.json';
  
  const combinedData = processJsonFiles(assetsDir);
  const obj = Object.fromEntries(combinedData);
  fs.writeFileSync(outputFile, JSON.stringify(obj, null, 2));
  actions.setOutput("json_filename", outputFile)
  console.log(`Combined JSON data has been written to ${outputFile}`);
  
  return combinedData;
}

main().then();


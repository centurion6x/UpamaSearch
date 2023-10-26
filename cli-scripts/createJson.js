import * as d3 from 'd3'
import * as fs from 'fs'
function createJson(fileName) {
  fs.readFile(fileName, 'utf8', (err, text) => {
    if (err) throw err
    const data = d3.csvParse(text)
    const json = JSON.stringify(data)
    fs.writeFile(`${fileName}.json`, json, 'utf8', (err) => {
      if (err) throw err
      console.log('The file has been saved')
    })
  })
}

export default createJson

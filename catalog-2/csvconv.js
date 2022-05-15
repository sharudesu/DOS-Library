const fs = require('fs')

const csvconv = {
  csvToJson: (path) => {
    try{
      const data = fs.readFileSync(path)
      const [dataHeaders, ...dataBooks]  = data.toString().trim().split(/\r?\n/)
      const headers = dataHeaders.split(',')
      let jsonArray = []
      dataBooks.forEach((row) => {
        const rowData = row.split(',')
        let rowJson = {}
        headers.forEach((header, j) => {
          rowJson[header] = rowData[j]
        })
        jsonArray.push(rowJson)
      });
      return jsonArray
    }
    catch(err){
      console.log(err)
    }
  },
  jsonToCsv: (path, jsonArray) => {
    try {
      const headers = Object.keys(jsonArray[0])
      const headersString = headers.join(',') + '\n'
      fs.writeFileSync(path, headersString)
      jsonArray.forEach((jsonData, i) => {
        let jsonDataString = ""
        headers.forEach((header, i) => {
          jsonDataString += jsonData[header]
          if(i == headers.length - 1){
            jsonDataString += '\n'
          }
          else{
            jsonDataString += ','
          }
        })
        fs.appendFileSync(path, jsonDataString)
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = csvconv

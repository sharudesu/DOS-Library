const express = require("express")
const fs = require("fs")
const app = express()
const port = 3001

const csvToJson = (path) => {
  try{
    const data = fs.readFileSync(path)
    const stringifiedData = data.toString()
    const rows = stringifiedData.split('\r\n')
    const headers = rows[0].split(',')
    let jsonArray = []
    rows.forEach((row, i) => {
      if(i == 0) return
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
}

const jsonToCsv = (path, jsonArray) => {
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

app.get('/', (req, res) => {
  try{
    const jsonData = csvToJson('../catalog/lib.csv')
    jsonToCsv('test.csv', jsonData)
    res.json(jsonData)
  }
  catch(err){
    console.log(err);
  }
})

app.listen(port, () => {
  console.log("Frontend Server is Running!")
})
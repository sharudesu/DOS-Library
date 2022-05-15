const express = require("express")
const axios = require("axios")
const app = express()
const port = 3001
// const catalogServer = "http://172.15.0.3:3002"
// const orderServer = "http://172.15.0.4:3003"
const catalogServers = ["http://localhost:3002", "http://localhost:3004"]
const orderServers = ["http://localhost:3003", "http://localhost:3005"]

let lastInfo = 0
let lastSearch = 0
let lastPurchase = 0

let searchCache = {}
let infoCache = {}

app.use((req, res, next) => {
  console.log(req.url, new Date());
  next()
})

app.get('/search/:title', async (req, res) => {
  try{
    if(searchCache[req.params.title] === undefined){
      const catalogResponse = await axios.get(catalogServers[lastSearch] + '/search/' + req.params.title)
      searchCache[req.params.title] = catalogResponse.data
      res.json(catalogResponse.data)
    }
    else{
      res.json(searchCache[req.params.title])
    }
  }
  catch(err){
    if(err.response){
      return res.status(404).json(err.response.data)
    }
    console.log(err);
  }
  finally{
    lastSearch = (lastSearch + 1) % catalogServers.length
  }
})

app.get('/info/:id', async (req, res) => {
  try{
    if(infoCache[req.params.id] === undefined){
      const catalogResponse = await axios.get(catalogServers[lastInfo] + '/info/' + req.params.id)
      infoCache[req.params.id] = catalogResponse.data
      res.json(catalogResponse.data)
    }
    else{
      res.json(infoCache[req.params.id])
    }
  }
  catch(err){
    if(err.response){
      return res.status(404).json(err.response.data)
    }
    console.log(err);
  }
  finally{
    lastInfo = (lastInfo + 1) % catalogServers.length
  }
})

app.get('/purchase/:id', async (req, res) => {
  try{
    const catalogResponse = await axios.get(orderServers[lastPurchase] + '/purchase/' + req.params.id)
    res.json(catalogResponse.data)
  }
  catch(err){
    if(err.response){
      return res.status(404).json(err.response.data)
    }
    console.log(err);
  }
  finally{
    lastPurchase = (lastPurchase + 1) % orderServers.length
  }
})

app.put('/invalidate/:id', async (req, res) => {
  delete infoCache[req.params.id]
  const keys = Object.keys(searchCache)
  let toDelete = ""
  keys.forEach((key) => {
    searchCache[key].forEach((item) => {
      if(item.id === req.params.id){
        toDelete = key
      }
    })
  })
  delete searchCache[toDelete]
  res.status(200).json({success: true})
})

app.listen(port, () => {
  console.log("Frontend Server is Running!")
})


const express = require("express")
const axios = require("axios")
const app = express()
const port = 3001
const catalogServer = "http://localhost:3002"
const orderServer = "http://localhost:3003"

app.get('/search/:title', async (req, res) => {
  try{
    const catalogResponse = await axios.get(catalogServer + '/search/' + req.params.title)
    res.json(catalogResponse.data)
  }
  catch(err){
    console.log(err);
  }
})

app.get('/info/:id', async (req, res) => {
  try{
    const catalogResponse = await axios.get(catalogServer + '/info/' + req.params.id)
    res.json(catalogResponse.data)
  }
  catch(err){
    console.log(err);
  }
})

app.get('/purchase/:id', async (req, res) => {
  try{
    const catalogResponse = await axios.get(orderServer + '/purchase/' + req.params.id)
    res.json(catalogResponse.data)
  }
  catch(err){
    console.log(err);
  }
})

app.listen(port, () => {
  console.log("Frontend Server is Running!")
})
const express = require("express")
const axios = require("axios")
const fs = require("fs")
const app = express()
const port = 3001
const catalogServer = "http://localhost:3002"

app.get('/search/:title', async (req, res) => {
  try{
    const catalogResponse = await axios.get(catalogServer + '/search/' + req.params.title)
    res.json(catalogResponse.data)
  }
  catch(err){
    console.log(err);
  }
})

app.listen(port, () => {
  console.log("Frontend Server is Running!")
})

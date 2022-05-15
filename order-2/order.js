const express = require("express")
const axios = require("axios")
const app = express()
const port = 3005
const catalogServers = ["http://localhost:3002", "http://localhost:3004"]

let lastPurchase = 0

app.use((req, res, next) => {
  console.log(req.url, new Date());
  next()
})

app.get('/purchase/:id', async (req, res) => {
  try {
    // Get the quantity for the book Id
    const bookId = req.params.id;
    const bookResponse = await axios.get(catalogServers[lastPurchase] + '/quantity/' + bookId)
    const bookQuantity = bookResponse.data.quantity

    // If the quantity is greater than 0, purchase the book, otherwise return a {success: false} json message
    const success = (bookQuantity > 0) ? await axios.put(catalogServers[lastPurchase] + '/decrement/' + bookId) : {data: {success: false}}
    res.json(success.data)
  } catch (err) {
    if(err.response){
      return res.status(404).json(err.response.data)
    }
    console.log(err);
  }
  finally{
    lastPurchase = (lastPurchase + 1) % catalogServers.length
  }
})

app.listen(port, () => {
  console.log("Order Server is Running!")
})

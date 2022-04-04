const express = require("express")
const axios = require("axios")
const app = express()
const port = 3003
const catalogServer = "http://localhost:3002"

app.get('/purchase/:id', async (req, res) => {
  try {
    // Get the quantity for the book Id
    const bookId = req.params.id;
    const bookResponse = await axios.get(catalogServer + `/quantity/${bookId}`)
    const bookQuantity = bookResponse.data.quantity

    // If the quantity is greater than 0, purchase the book, otherwise return a {success: false} json message
    const success = (bookQuantity > 0) ? await axios.put(catalogServer + `/decrement/${bookId}`) : {data: {success: false}}
    res.json(success.data)
  } catch (err) {
    console.log(err)
  }
})

app.listen(port, () => {
  console.log("Order Server is Running!")
})
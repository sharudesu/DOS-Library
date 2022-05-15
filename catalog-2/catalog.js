const csvconv = require("./csvconv")
const express = require("express")
const axios = require("axios")
const app = express()
const port = 3004
const catalogServers = ["http://localhost:3002"]
const frontendServer = "http://localhost:3001"

app.use((req, res, next) => {
  console.log(req.url, new Date());
  next()
})

app.get('/search/:title', (req, res) => {
  try{
    // match the book title with the search parameter and add it to the found books list
    const data = csvconv.csvToJson('./lib.csv')
    if(req.params.title.toLowerCase().trim() === "distributed systems"){
      const books = data.slice(0, 2)
      return res.status(200).json(books)
    }

    if(req.params.title.toLowerCase().trim() === "undergraduate school"){
      const books = data.slice(2, 4)
      return res.status(200).json(books)
    }

    if(req.params.title.toLowerCase().trim() === "new"){
      const books = data.slice(4, 7)
      return res.status(200).json(books)
    }

    res.status(404).json({msg: "No books found"})
  }
  catch(err){
    console.log(err)
  }
})

app.get('/info/:id', (req, res) => {
  try{
    // look for the book with the specified id
    const data = csvconv.csvToJson('./lib.csv')
    const foundBook = data.find(book => {
      return book.id === req.params.id
    })

    // return the data of the book excluding the
    if(foundBook === undefined){
      return res.status(404).json({msg: "Book not found"})
    }

    const {id, ...reducedBook} = foundBook
    res.status(200).json(reducedBook)
  }
  catch(err){
    console.log(err)
  }
})

app.get('/quantity/:id', (req, res) => {
  try{
    // look for the book with the specified id
    const data = csvconv.csvToJson('./lib.csv')
    const foundBook = data.find(book => {
      return book.id === req.params.id
    })
    
    // return the quantity of the book excluding the rest of the data
    if(foundBook === undefined){
      return res.status(404).json({msg: "Book not found"})
    }
    
    const quantity = (({quantity}) => ({quantity}))(foundBook)
    res.json(quantity)
  }
  catch(err){
    console.log(err)
  }
})

app.put('/decrement/:id', async (req, res) => {
  try{
    // look for the book with the specified id and decremnt its id
    const data = csvconv.csvToJson('./lib.csv')
    data.forEach(book => {
      book.quantity -= (book.id === req.params.id) ? 1 : 0
    })
    csvconv.jsonToCsv('./lib.csv', data)
    
    catalogServers.forEach(async (server) => {
      await axios.put(server + '/decrementInternally/' + req.params.id)
    })

    await axios.put(frontendServer + '/invalidate/' + req.params.id)

    // return a success message
    res.json({success: true})
  }
  catch(err){
    console.log(err)
  }
})

app.put('/decrementInternally/:id', (req, res) => {
  try{
    // look for the book with the specified id and decremnt its id
    const data = csvconv.csvToJson('./lib.csv')
    data.forEach(book => {
      book.quantity -= (book.id === req.params.id) ? 1 : 0
    })
    csvconv.jsonToCsv('./lib.csv', data)
    
    // return a success message
    res.json({success: true})
  }
  catch(err){
    console.log(err)
  }
})

app.listen(port, () => {
  console.log("Catalog Server is Running!")
})

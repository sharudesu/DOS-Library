const csvconv = require("./csvconv")
const express = require("express")
const app = express()
const port = 3002

app.get('/search/:title', (req, res) => {
  try{
    // match the book title with the search parameter and add it to the found books list
    const data = csvconv.csvToJson('./lib.csv')
    const foundBooks = data.filter((book) => {
      return book.title.toLowerCase().includes(req.params.title.toLowerCase())
    })

    // return the id and the title only from the found books list
    const searchResult = foundBooks.map(book => {
      return (({id, title}) => ({id, title}))(book)
    })
    res.json(searchResult)
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
    const {id, ...reducedBook} = foundBook ?? {}
    res.json(reducedBook)
  }
  catch(err){
    console.log(err)
  }
})

app.listen(port, () => {
  console.log("Catalog Server is Running!")
})

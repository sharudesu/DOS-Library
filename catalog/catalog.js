const csvconv = require("./csvconv")
const express = require("express")
const app = express()
const port = 3002

app.get('/search/:title', (req, res) => {
  try{
    // convert both the search parameter and the book title to lower case and search for the book
    const data = csvconv.csvToJson('./lib.csv')
    const foundBook = data.find((book) => {
      return book.title.toLowerCase().includes(req.params.title.toLowerCase())
    })

    // return the id and the title of the book, otherwise return an empty json object
    if(foundBook){
      res.json({
        id: foundBook.id,
        title: foundBook.title
      })
      return;
    }
    res.json({})
  }
  catch(err){
    console.log(err);
  }
})

app.listen(port, () => {
  console.log("Catalog Server is Running!");
})

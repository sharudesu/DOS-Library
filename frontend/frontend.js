const express = require("express")
const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.json({
        msg: "Hello!"
    })
})

app.listen(port, () => {
    console.log("Frontend Server is Running!")
})
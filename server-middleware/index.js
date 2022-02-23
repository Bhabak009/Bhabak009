const axios = require('axios')
const app = require('express')()

app.get("/", (req, resp) => {
    resp.send("<h1>this is index file</h1>")
})
module.exports = app


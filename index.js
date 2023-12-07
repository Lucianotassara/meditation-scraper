const express = require('express')
const app = express()
const port = 3000
const scraper = require('./scrape.js');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/scrape', (req, res) => {
    scraper.run();
    res.send('Calling scraper')

  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
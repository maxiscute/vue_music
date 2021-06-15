const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const registerRouter = require('./router')

const port = process.env.PORT || 9002

const app = express()

app.use(cookieParser())

registerRouter(app)

app.use(compression())

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})

const express = require("express")
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser")
const route = require('./Route/route')
const PORT = process.env.PORT || 8000
const methodOverride = require("method-override")
const expression = require('cookie-session')

const fileUpload = require('express-fileupload');
app.use(fileUpload()); // Don't forget this line!

// app.post('/upload', function (req, res) {
//     console.log(req.files);
//     res.send('UPLOADED!!!');
// });
app.use(methodOverride("X-HTTP-Method"))
app.use(methodOverride("X-HTTP-Method-Override"))
app.use(methodOverride("X-Method-Override"))
app.use(methodOverride("_method"))
app.use(expression({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}))

app.use(express.static("Vue"))
// app.use(express.static('Vue/assets/js'))
// app.use(express.static("Vue/assets/fontawesome/css"))

app.use(express.static('Vue/assets/js'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', "html")
app.set('views', __dirname + '/Vue');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/", route)

const server = app.listen(process.env.PORT || PORT, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
})
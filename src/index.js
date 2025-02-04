import express from 'express'
import dotenv from 'dotenv'
import {dbConnect} from './db/index.js'
import cookieParser from 'cookie-parser'
import {router} from './routes/user.routes.js'
const app = express()
const port = 5000
const hostname = '127.0.0.1'


dotenv.config()

dbConnect().then(() => {
    app.listen(port, hostname, () => {
        console.log(`Running on http://${hostname}:${port}`);
    })
}).catch((err) => {
    console.log("Error  while connecting", err);
})
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))


app.use('/api/v1/auth', router)

// mongoose.connect('mongodb+srv://sarojsimkhada2:Org2059@cluster0.cq1ol.mongodb.net').then((val) => {
//     console.log("Database Connected Successfully")
// })
// .catch((err) => {
//     console.log(err)
// })


app.get('/', (req, res) => {
    res.send('Hello everyone ! This is ecommerce home page')
})
app.get('/products',(req, res) => {
    res.send('Here is the page for all the required products globally available')
})
app.get('/contact', (req,res) => {
    res.send('For any other enquiry, please feel free to ask or make contact')
})
app.get('/add-to-cart', (req, res) => {
    res.send('For making any purchases of products in future or present.')
})


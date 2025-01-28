import express from 'express'
import dotenv from 'dotenv'
import {dbConnect} from './db/index.js'
// import mongoose from 'mongoose'
const app = express()
const port = 3000
const hostname = '127.0.0.1'


dotenv.config()

dbConnect()

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
    res.send('Here is the page for the all required products globally available')
})
app.get('/contact', (req,res) => {
    res.send('For any other enquiry, please feel free to ask or make contact')
})
app.get('/add-to-cart', (req, res) => {
    res.send('For making any purchases of products in future or present.')
})
app.listen(port, hostname, () => {
    console.log(`Running on http://${hostname}:${port}`);
})

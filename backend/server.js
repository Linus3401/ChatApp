import {config} from 'dotenv'
import pkg from'pg'
const {Client} = pkg;

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';

const app = express()

config()

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.use(cors())
app.use(express.json())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

const client = new Client({
    database: process.env.DATABASE,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    user: process.env.USER
})

client.connect(function (err){
    if (err) throw err
    console.log('Database Connected')
})

app.get('/', (req, res) => {
    res.json('Hejsan')
})

app.get('/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.post('/users/submit-form', async (req, res) => {
    const { Firstname, Lastname, Email, Password } = req.body
    try {
        await client.query(
            'INSERT INTO users (Firstname, Lastname, Email, Password) VALUES ($1, $2, $3, $4)',
            [Firstname, Lastname, Email, Password]
        )
        res.sendStatus(201)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})


app.listen(8800, () => {
    console.log('Server is running is running')
})

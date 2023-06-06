import pkg from 'pg'
const { Client } = pkg
import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'

config()

const app = express()
const client = new Client({
    database: process.env.DATABASE,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    user: process.env.USER
})

app.use(cors())
app.use(express.json())

client.connect((err) => {
    if (err) throw err
    console.log('Database Connected')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const result = await client.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        )
        const user = result.rows[0]

        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' })
            return
        }

        if (user.password !== password) {
            res.status(401).json({ message: 'Invalid username or password' })
            return
        }

        res.status(200).json({ message: 'Login successful', user })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body
    try {
        const result = await client.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        )
        const existingUser = result.rows[0]

        if (existingUser) {
            res.status(400).json({
                message: 'Username or email already exists'
            })
            return
        }

        await client.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
            [username, password, email]
        )

        res.status(201).json({ message: 'User created successfully' })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.post('/conversations', async (req, res) => {
    const { user1_id, user2_id } = req.body

    try {
        const result = await client.query(
            'INSERT INTO conversations (user1_id, user2_id, created_at) VALUES ($1, $2, NOW()) RETURNING conversation_id',
            [user1_id, user2_id]
        )
        const conversation_id = result.rows[0].conversation_id

        res.status(201).json({
            message: 'Conversation created successfully',
            conversation_id
        })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.post('/messages', async (req, res) => {
    const { conversation_id, sender_id, content } = req.body

    try {
        await client.query(
            'INSERT INTO messages (conversation_id, sender_id, content, sent_at) VALUES ($1, $2, $3, NOW())',
            [conversation_id, sender_id, content]
        )

        res.status(201).json({ message: 'Message sent successfully' })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.get('/conversations/:conversation_id/messages', async (req, res) => {
    const { conversation_id } = req.params

    try {
        const result = await client.query(
            'SELECT messages.*, users.username AS sender_username FROM messages JOIN users ON messages.sender_id = users.user_id WHERE conversation_id = $1',
            [conversation_id]
        )
        const messages = result.rows

        res.status(200).json({ messages })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.get('/conversations', async (req, res) => {
    try {
        const conversations = await client.query('SELECT * FROM conversations')
        res.status(200).json(conversations.rows)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

app.listen(8800, () => {
    console.log('Server is running')
})

const { config } = require('dotenv');
config()
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const { getDateFromDB, getMessages, createMessage } = require("./dbutils");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/date',async  (req, res) => {
    try {
        const date = await getDateFromDB()
        res.status(200).send({ date })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

app.get('/messages', async (req, res) => {
    try {
        const messages = await getMessages()
        res.status(200).send({ messages })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

app.post('/messages', async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: 'no payload provided'})
            return
        }
        const { message } = req.body
        if (!message) {
            res.status(400).json({ error: 'Mensaje no puede estar vacío'})
            return
        }
        if (typeof message !== 'string') {
            res.status(400).json({ error: 'Mensaje debe ser un texto'})
            return
        }

        const result = await createMessage(message)
        if (!result.rowCount) {
            res.status(500).json({ error: 'No se pudo crear el mensaje'})
            return
        }
        res.status(201).send({ message: result.rows[0]  })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'development'
})

const getDateFromDB = async () => {
    const { rows } = await pool.query('SELECT NOW()')
    return rows[0].now
}

const getMessages = async () => {
    const { rows } = await pool.query('SELECT * FROM messages')
    return rows
}

const createMessage = (message) => {
    return pool.query('INSERT INTO messages (text) VALUES ($1) RETURNING id, text', [message])
}

module.exports = {
    pool,
    getDateFromDB,
    getMessages,
    createMessage
}

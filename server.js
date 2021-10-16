// подключаем модули
const express = require('express')
const app = express()
const port = 3000 || process.env.port
const config = require('config')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')

app.use(express.json()) // заставляем express читать json
app.use('/auth',authRouter) // подключаем роутер

async function startApp() {
    try {
        await mongoose.connect(config.get('url')) // подключаем бд
        app.listen(port)
    } catch (e) {
        console.log(e)
    }
}

startApp()

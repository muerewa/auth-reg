const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req, res, next) {
    if(req.method === "OPTIONS") {
        next()
    } // проверяем на метод

    try {
        const token = req.headers.authorization // проверяем есть ли в headers authorization
        if(!token) {
            return res.status(400).json({message: "Пользователь не авторизован"})
        }
        const finalToken = token.split(' ')[1] // берем токен
        const decoded = jwt.verify(finalToken, config.get("token")) // верефицируем токен
        req.user = decoded
        next() // используем следущий middleware
    } catch (e) {
        console.log(e)
        res.status(400).json({message: "Ошибка"})
    }

}

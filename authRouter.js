const Router = require('express');
const router = new Router()
const authController = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middlewares/authMiddleware')

router.post('/reg', [
    check('username', 'Имя пользователя не должно быть пустым').notEmpty(),
    check('password', 'Пароль может быть от 8 до 50 символов').isLength({min: 8, max: 50})
] ,authController.registration) // в роутере пишем запрос + валидация полей в регистрации
router.post('/auth', authController.login)
router.get('/users', authMiddleware ,authController.users)

module.exports = router 
const User = require('./models/User')
const Role = require('./models/Roles')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {validationResult} = require('express-validator')

// функция для создания jwt токена
function generateJwt(id, roles) {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload,config.get('token'), {expiresIn: '24h'} )
}


class authController {
    async registration(req,res) {
        try {
            const errors = validationResult(req) // собираем ошибки
            if(!errors.isEmpty()) {
                return res.status('400').json({message: 'ошибка валидаци'})
            }
            const {username, password} = req.body // берем имя пользователя, пароль с req.body
            const candidate = await User.findOne({username}) // проверка на имя пользователя
            if (candidate) {
                return res.status(400).json({message:'Пользователь с таким именем уже существует'})
            }
            const hashPassword = bcrypt.hashSync(password, 7) // хешируем пароль
            const userRole = await Role.findOne({value: 'user'}) // для всех новый пользователей роль - user
            const user = await new User({username, password: hashPassword, roles: [userRole.value]}) // создаем пользователя
            await user.save() // сохраняем пользователя
            return res.json({message: 'Пользователь создан успешно'})
        } catch (error) {
            console.log(error)
            return res.status(400).json({message: 'reg error'})
            
        }
    }

    async login(req,res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message: 'Пользователь не найден'})
            }
            const validPassword = bcrypt.compareSync(password, user.password) // сравниваем пароль req.body с реальным паролем пользователя
            if(!validPassword) {
                return res.status(400).json({message: 'Неверный пароль'})
            }

            const token = generateJwt(user._id, user.roles) // генерируем jwt токен
            res.send(token)

        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'auth error'})
            
        }
    }

    async users(req,res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'error'})
            
        }
    }
}

module.exports = new authController()
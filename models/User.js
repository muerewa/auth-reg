const {Schema, model} = require('mongoose')


// модель пользователей
const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    username: [{type:String, ref: 'Roles'}]
})

module.exports = model('User', User)
const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
* Criar usuário
*/
async function createUser({ name, email, password }) {
    try {
        const existentUser = await User.findOne({ where: { email } });
        if (existentUser) throw new Error('E-mail já está em uso');

        const hashedPassword = await bcrypt.hash(password, 10); 
        const user = await User.create({ 
            name, 
            email,
            password: hashedPassword, 
        });
        return user;
    } catch(error) {
        throw error;
    }
}

/**
* Autenticar usuário
*/
async function loginUser({ email, password }) {
    try {
        const existentUser = await User.findOne({ where: { email } });
        if(!existentUser) throw new Error('Usuário não encontrado');

        const isPasswordMatch = await bcrypt.compare(password, existentUser.password);
        if(!isPasswordMatch) throw new Error('Senha incorreta');  
        
        return existentUser;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    createUser,
    loginUser,
};
const userService = require('../services/userService');
const sessionService = require('../services/sessionService');

/**
* Criar usuário
*/
async function createUser(req, res) {
  try {
    const user = await userService.createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    sessionService.setUser(req, {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    req.flash('success_msg', 'Usuário cadastrado!');
    return res.status(201).redirect('/ideas');
  } catch (error) {
    req.flash('error_msg', error.message);
    return res.status(400).redirect('/users/signup');
  }
}

/**
* Renderizar cadastro
*/
async function renderSignup(req, res) {
  return res.status(200).render('signup');
}

/**
* Autenticar usuário
*/
async function loginUser(req, res) {
  try {
    const user = await userService.loginUser({
      email: req.body.email,
      password: req.body.password,
    });

    sessionService.setUser(req, {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    req.flash('success_msg', `Olá, ${user.name}!`);
    return res.status(200).redirect('/ideas');
  } catch (error) {
    req.flash('error_msg', error.message);
    return res.status(401).redirect('/users/login');
  }
}

/**
* Renderizar login
*/
async function renderLogin(req, res) {
  return res.status(200).render('login');
}

/**
* Encerrar sessão do usuário
*/
async function logoutUser(req, res) {
  try {
    sessionService.clearUser(req, res);
    req.flash('success_msg', 'Até breve!');
    return res.status(200).redirect('/users/login');
  } catch (error) {
    req.flash('error_msg', 'Não foi possível sair');
    return res.status(500).redirect('/');
  }
}

module.exports = {
  createUser,
  renderSignup,
  loginUser,
  renderLogin,
  logoutUser,
};

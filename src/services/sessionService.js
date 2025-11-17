/**
* Adicionar usuário autenticado
*/
function setUser(req, { id, name, email }) {
    req.session.user = {
        id,
        name,
        email,
    };
}

/**
* Obter usuário autenticado
*/
function getUser(req) {
    return req.session.user;
}

/**
* Limpar usuário autenticado
*/
function clearUser(req, res) {
    if (req.session) {
        delete req.session.user;
    }
}

module.exports = {
    setUser,
    getUser,
    clearUser,
}
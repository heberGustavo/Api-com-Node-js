const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {
    try {
        //Pega o TOKEN do HEADERS da requisição
        //Usa o SPLIT(' ')[1], por causa do espaço da requisição
        const token = req.headers.authorization.split(' ')[1];

        //Recebe o JSON com o id_usuario e o email do Token
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuario = decode;
        next(); //Avança
    }
    catch (error) {
        return res.status(401).send({ mensagem: "Falha na autenticação" })
    }
}

//Mesmo se não passar o TOKEN ele continua
exports.opcional = (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1];

        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuario = decode;
        next();
    }
    catch (error) {
        next();
    }
}
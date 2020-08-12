const express = require('express');
const router = express.Router();

//Req = Requisição
//Res = Resposta
//Next = Chama outro metodo

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os pedidos'
    });
});


// INSERE UM PEDIDOS
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'O pedido foi criado'
    });
});


// RETORNA DADOS DE UM PEDIDO
router.post('/:id_pedido', (req, res, next) => {

    //Pega o id do parametro
    const id = req.params.id_pedido

    res.status(200).send({
        mensagem: 'Usando o GET em um PEDIDO exclusivo',
        id_pedido: id
    });
});


// DELETA UM PEDIDO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Pedido excluido'
    });
});


module.exports = router;
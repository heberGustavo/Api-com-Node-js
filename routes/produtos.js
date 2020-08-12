const express = require('express');
const router = express.Router();

//Req = Requisição
//Res = Resposta
//Next = Chama outro metodo

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os produtos'
    });
});


// INSERE UM PRODUTO
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'O produto foi criado'
    });
});


// RETORNA DADOS DE UM PRODUTO
router.post('/:id_produto', (req, res, next) => {

    //Pega o id do parametro
    const id = req.params.id_produto

    res.status(200).send({
        mensagem: 'Usando o GET em um produto exclusivo',
        id_produto: id
    });
});


// ALTERAR UM PRODUTO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Pedido atualizado'
    });
});


// DELETA UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto excluido'
    });
});


module.exports = router;
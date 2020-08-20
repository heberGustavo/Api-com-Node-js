const mysql = require('../mysql').pool;

//Req = Requisição
//Res = Resposta
//Next = Chama outro metodo

exports.getPedidos = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            `SELECT pedidos.id_pedido,
                    pedidos.quantidade,
                    produtos.id_produto,
                    produtos.nome,
                    produtos.preco
            FROM pedidos 
            INNER JOIN produtos
            ON produtos.id_produto = pedidos.id_produto;
            `,
            (error, result, fields) => {
                //Pega o erro
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                //Boas praticas para o retorno
                const response = {
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido especifico',
                                url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
                            }
                        }
                    })
                }

                return res.status(200).send({ response });
            }
        );
    });
};

exports.postPedido = (req, res, next) => {


    //Verifica se encontra o produto
    mysql.getConnection((error, conn) => {

        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, result, fields) => {

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: "Produto não encontrado"
                    });
                }

                //Else
                conn.query(
                    'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, fields) => {

                        //MUITO IMPORTANTE, NUNCA DEIXAR DE FAZER
                        conn.release(); //Libera a conexão, para não acumular os dados na api

                        if (error) {
                            return res.status(500).send({
                                error: error,
                                response: null
                            });
                        }

                        //Boas praticas para a documentação
                        const response = {
                            mensagem: "Pedido inserido com sucesso",
                            pedidoCriado: {
                                id_pedido: result.id_pedido,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os pedidos',
                                    url: 'http://localhost:3000/pedidos/'
                                }
                            }
                        }

                        return res.status(201).send({ response });
                    }
                );

            });
    })
};

exports.getUmPedido = (req, res, next) => {

    //Pega o id do parametro
    const id = req.params.id_pedido;

    mysql.getConnection((error, conn) => {
        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [id],
            (error, result, fields) => {
                //Pega o erro
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                //Se tem registro, por causa do id
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado pedido com esse id"
                    })
                }

                //Boas praticas para a documentação
                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos/'
                        }
                    }
                }

                return res.status(200).send({ response });
            }
        );
    });
};

exports.deletePedido = (req, res, next) => {

    mysql.getConnection((error, conn) => {

        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            `DELETE FROM pedidos WHERE id_pedido = ?`, [req.body.id_pedido],
            (error, result, fields) => {

                //MUITO IMPORTANTE, NUNCA DEIXAR DE FAZER
                conn.release(); //Libera a conexão, para não acumular os dados na api

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                const response = {
                    mensagem: "Pedido excluido com sucesso",
                    request: {
                        tipo: "GET",
                        descricao: "Retorna todos os pedidos",
                        url: 'http://localhost:3000/pedidos'
                    }
                }

                //Sucesso
                //Retorna 202 por recomendação
                res.status(202).send({ response });
            }
        );
    });
};
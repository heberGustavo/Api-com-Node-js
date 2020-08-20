const mysql = require('../mysql').pool;

//Req = Requisição
//Res = Resposta
//Next = Chama outro metodo

exports.getProdutos = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT * FROM produtos',
            (error, result, fields) => {
                //Pega o erro
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                //Boas praticas para o retorno
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }
                    })
                }

                return res.status(200).send({ response });
            }
        );
    });
};

exports.getUmProduto = (req, res, next) => {

    //Pega o id do parametro
    const id = req.params.id_produto

    mysql.getConnection((error, conn) => {
        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
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
                        mensagem: "Não foi encontrado produto com esse id"
                    })
                }

                //Boas praticas para a documentação
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }

                return res.status(200).send({ response });
            }
        );
    });
};

exports.postProduto = (req, res, next) => {

    mysql.getConnection((error, conn) => {

        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
            [
                req.body.nome,
                req.body.preco,
                req.file.path /*URL da imagem*/
            ],
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
                    mensagem: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path, /*URL do arquivo*/
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }

                return res.status(201).send({ response });
            }
        );
    });
};

exports.uploadProduto = (req, res, next) => {

    mysql.getConnection((error, conn) => {

        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            `UPDATE produtos
                SET nome     = ?,
                    preco    = ?
            WHERE id_produto = ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
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
                    mensagem: "Produto atualizado com sucesso",
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes do produto atualizado',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produto
                        }
                    }
                }
                //Sucesso
                //Retorna 202 por recomendação
                return res.status(202).send({ response });
            }
        );
    });
}

exports.deleteProduto = (req, res, next) => {

    mysql.getConnection((error, conn) => {

        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`, [req.body.id_produto],
            (error, resultado, fields) => {

                //MUITO IMPORTANTE, NUNCA DEIXAR DE FAZER
                conn.release(); //Libera a conexão, para não acumular os dados na api

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                const response = {
                    mensagem: "Produto excluido com sucesso",
                    request: {
                        tipo: "GET",
                        descricao: "Retorna todos os produtos",
                        url: 'http://localhost:3000/produtos'
                    }
                }

                //Sucesso
                //Retorna 202 por recomendação
                res.status(202).send({ response });
            }
        );
    });
};
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt'); /*Usa para criptografar a senha*/
const jwt = require('jsonwebtoken'); /*Usa para enviar Token ao Usuario, permite acesso*/

exports.cadastrarUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        //Pega o erro
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        //Verifica se já existe o usuario cadastrado
        conn.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [req.body.email],
            (error, results) => {

                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                //Se tiver dados na resposta
                if (results.length > 0) {
                    res.status(409).send({
                        mensagem: "Usuário já cadastrado"
                    });
                }
                else {

                    //Passa a senha, e o SALT('qtd de caracters inseridos aleatoriamente')
                    bcrypt.hash(req.body.senha, 10,
                        //hash é a senha já criptografada
                        (errBcrypt, hash) => {
                            if (errBcrypt) {
                                return res.status(500).send({ error: errBcrypt });
                            }

                            conn.query(`INSERT INTO usuarios (email, senha) VALUES (?,?)`,
                                //Passa o email e a senha criptografada
                                [req.body.email, hash],
                                (error, results) => {
                                    conn.release(); //Libera a conexão

                                    if (error) {
                                        return res.status(500).send({ error: errBcrypt });
                                    }

                                    //Se tudo certo
                                    const response = {
                                        mensagem: "Usuário criado com sucesso!",
                                        usuarioCriado: {
                                            id_usuario: results.insertId,
                                            email: req.body.email
                                        }
                                    }
                                    return res.status(201).send(response);

                                }
                            );
                        });
                }
            });
    });
};

exports.loginUsuario = (req,res, next) => {
    mysql.getConnection( (error, conn) => {
        if(error) {
            return res.status(500).send({
                error: error
            })
        }

        const query = `SELECT * FROM usuarios WHERE email = ?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();            

            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            //Verifica se tem o registro
            if(results.length < 1){
                //Para ter mais segurança usa ERROR(401), com isso a mensagem é mais generica
                return res.status(401).send({mensagem: "Falha na autenticação"});
            }

            //Compara se a senha é a mesma, não tem como desconverter uma senha criptografada
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if(err){
                    //Para ter mais segurança usa ERROR(401), com isso a mensagem é mais generica
                    return res.status(401).send({mensagem: "Falha na autenticação"});
                }   
                //Se a senha esta correta
                if(result){
                    //Dados do Usuário que esta logando
                    const token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    }, 
                    //Linha abaixo, chave privada nossa. No arquivo (nodemon.json)
                    process.env.JWT_KEY, 
                    //Linha abaixo. Tempo de expiração
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).send({
                        mensagem: "Autenticado com sucesso.",
                        token: token
                    });
                }
                //Se errar a senha
                return res.status(401).send({mensagem: "Falha na autenticação"});

                   
            })
        });
    }) 
};
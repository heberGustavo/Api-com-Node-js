const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');
const ProdutosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //Erro e local que vai salvar o arquivo
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        //Erro e dados do arquivo, pegando data atual e nome do arquivo
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname);
    }
});

//Para aceitar somente jpeg ou png
const meuFileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); //Passa sem erro
    }
    else {
        cb(null, false); //Não valida o arquivo
    }
}


const upload = multer({
    storage: storage, /*Destino do arquivo*/
    limits: {
        fileSize: 1024 * 1024 * 5 /*Limita para arquivos até 5mb*/
    },
    fileFilter: meuFileFilter
})

router.get('/', ProdutosController.getProdutos);
router.get('/:id_produto', ProdutosController.getUmProduto);

/* 
    - Só pode inserir um produto se o usuário estiver logado
    - Login. Vai entrar o metodo e fazer a validação. Localização do arquivo (middleware/login.js)
*/
router.post(
    '/',
    login.obrigatorio,
    upload.single('produto_imagem'),
    ProdutosController.postProduto
);

router.patch('/', login.obrigatorio, ProdutosController.uploadProduto);
router.delete('/', login.obrigatorio, ProdutosController.deleteProduto);


module.exports = router;
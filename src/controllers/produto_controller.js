const Produtos = require("../models/produto")
const Categoria = require("../models/categoria")

class ProdutoController {

    // GET - listar produtos
    static async index(req, res) {
        const produtos = await Produtos.findAll({
            include: [{
                model: Categoria,
                as: "categoria"
            }]
        })

        res.status(200).json(produtos)
    }


    // CREATE - criar produto
    static async register(req, res) {
        const {
            nome,
            descricao,
            preco,
            quantidade,
            min_estoque,
            categoria_id
        } = req.body

        const newProduto = await Produtos.create({
            nome,
            descricao,
            preco,
            quantidade,
            min_estoque,
            categoria_id
        })

        res.status(201).json(newProduto)
    }


    // UPDATE - atualizar produto
    static async update(req, res) {
        const { id } = req.params

        const {
            nome,
            descricao,
            preco,
            quantidade,
            min_estoque,
            categoria_id
        } = req.body

        const produto = await Produtos.findByPk(id)

        if (!produto) {
            return res.status(404).json({
                mensagem: "Produto não encontrado"
            })
        }

        await produto.update({
            nome,
            descricao,
            preco,
            quantidade,
            min_estoque,
            categoria_id
        })

        res.status(200).json(produto)
    }
}

module.exports = ProdutoController
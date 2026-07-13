const Categoria = require("../models/categoria")
const { Sequlize } = require('sequelize')

class CategoriaController{
    static async register(req, res) {
        const { nome, descricao} = req.body
        let newCategoria = await Categoria.create({ nome, descricao })
        res.status(newCategoria ? 200 : 400).json({})
    }
    static async index(req, res) {
        const categoria = await Categoria.findAll()
        res.status(200).json(categoria)
    }
}

module.exports = CategoriaController
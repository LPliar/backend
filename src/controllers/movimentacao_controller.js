const Movimento = require("../models/stock_movement")
const { Sequlize } = require('sequelize')

class MovimentoController{
    static async register(req, res) {
        const { type, quantidade, produto_id, user_id } = req.body
        let newMovimento = await Movimento.create({ type, quantidade, produto_id, user_id })
        res.status(newMovimento ? 200 : 400).json({})
    }
    static async index(req, res) {
        const movimento = await Movimento.findAll()
        res.status(200).json(movimento)
    }
}

module.exports = MovimentoController
const express = require("express")
const UserController = require("../controllers/user_controller")
const CategoriaController = require("../controllers/categoria_controller")
const ProdutoController = require("../controllers/produto_controller")
const MovimentoController = require("../controllers/movimentacao_controller")

function Routes(app) {

    //user
    app.post("/user", (req, res) => {
        UserController.register(req, res)
    })
    app.get("/user", (req, res) => {
        UserController.index(req, res)
    })
    app.post("/authenticate", (req, res) => {
        UserController.authenticate(req, res)
    })

    //categoria
    app.post("/categoria", (req, res) => {
        CategoriaController.register(req, res)
    })
    app.get("/categoria", (req, res) => {
        CategoriaController.index(req, res)
    })

    //produto
    app.get("/produto", (req, res) => {
        ProdutoController.index(req, res)
    })
    app.post("/produto", (req, res) => {
        ProdutoController.register(req, res)
    })
    app.put("/produto/:id", (req, res) => {
        ProdutoController.update(req, res)
    })

    //movimento
    app.post("/movimento", (req, res) => {
        MovimentoController.register(req, res)
    })
    app.get("/movimento", (req, res) => {
        MovimentoController.index(req, res)
    })
}

module.exports = Routes
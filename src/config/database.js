const { Sequelize } = require("sequelize")
const URI = "postgres://postgres:senai@localhost:5433/estoque_db"

let database = new Sequelize(URI, {dialect: "postgres"})

module.exports = database
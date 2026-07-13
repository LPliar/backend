const User = require("../models/user")
const { Sequlize } = require('sequelize')
const crypto = require('crypto')

class UserController {
    static async register(req, res) {
        const { nome, email, senha } = req.body
        let accessKey = email + senha
        let hash = crypto.createHash('sha256').update(accessKey)
        accessKey = hash.digest('hex')

        let newUser = await User.create({ nome, email, senha: accessKey })
        res.status(newUser ? 200 : 400).json({})
    }
    static async index(req, res) {
        const users = await User.findAll()
        res.status(200).json(users)
    }
    static async authenticate(req, res) {
    const { email, senha } = req.body;

    let accessKey = email + senha;
    let hash = crypto.createHash("sha256").update(accessKey);
    accessKey = hash.digest("hex");

    const user = await User.findOne({
        where: {
            email,
            senha: accessKey
        }
    });
    if(user) {
        let n = Math.random()
        let hash = crypto.createHash('sha-1').update(""+n).digest("hex")
        user.hash = hash
        await user.save()
        res.status(200).json({hash});
        return
    }
    res.status(user ? 200 : 401).json();
}
}

module.exports = UserController
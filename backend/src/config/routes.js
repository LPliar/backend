const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");
const categoriaController = require("../controllers/categoria_controller");
const produtoController = require("../controllers/produto_controller");
const cursoController = require("../controllers/curso_controller");
const clienteController = require("../controllers/cliente_controller");
const agendamentoController = require("../controllers/agendamento_controller");

const {
    verificarToken,
    exigirPerfil
} = require("../middleware/auth_middleware");


router.get("/", (req, res) => {
    res.json({
        mensagem: "API Alvo Certo funcionando!"
    });
});


router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);

router.get(
    "/auth/me",
    verificarToken,
    userController.perfil
);

router.post(
    "/auth/logout",
    verificarToken,
    userController.logout
);


router.get(
    "/usuarios",
    verificarToken,
    exigirPerfil("ADMIN"),
    userController.listar
);

router.post(
    "/usuarios",
    verificarToken,
    exigirPerfil("ADMIN"),
    userController.criarAtendente
);


router.get("/categorias", categoriaController.listar);

router.post(
    "/categorias",
    verificarToken,
    exigirPerfil("ADMIN"),
    categoriaController.criar
);

router.put(
    "/categorias/:id",
    verificarToken,
    exigirPerfil("ADMIN"),
    categoriaController.atualizar
);

router.delete(
    "/categorias/:id",
    verificarToken,
    exigirPerfil("ADMIN"),
    categoriaController.excluir
);


router.get("/produtos", produtoController.listar);

router.post(
    "/produtos",
    verificarToken,
    exigirPerfil("ADMIN"),
    produtoController.criar
);

router.put(
    "/produtos/:id",
    verificarToken,
    exigirPerfil("ADMIN"),
    produtoController.atualizar
);

router.delete(
    "/produtos/:id",
    verificarToken,
    exigirPerfil("ADMIN"),
    produtoController.excluir
);

// CURSOS
router.get("/cursos", cursoController.listar);

router.post(
    "/cursos",
    verificarToken,
    exigirPerfil("ADMIN"),
    cursoController.criar
);

router.put(
    "/cursos/:id",
    verificarToken,
    exigirPerfil("ADMIN"),
    cursoController.atualizar
);

router.delete(
    "/cursos/:id",
    verificarToken,
    exigirPerfil("ADMIN"),
    cursoController.excluir
);

// CLIENTES
router.get(
    "/clientes",
    verificarToken,
    exigirPerfil("ADMIN", "ATENDENTE"),
    clienteController.listar
);

router.get(
    "/clientes/:id",
    verificarToken,
    exigirPerfil("ADMIN", "ATENDENTE"),
    clienteController.buscarPorId
);

// AGENDAMENTOS
// O cliente pode enviar uma solicitação sem fazer login.
router.post(
    "/agendamentos",
    agendamentoController.criar
);


router.get(
    "/agendamentos",
    verificarToken,
    exigirPerfil("ADMIN", "ATENDENTE"),
    agendamentoController.listar
);

router.get(
    "/agendamentos/:id",
    verificarToken,
    exigirPerfil("ADMIN", "ATENDENTE"),
    agendamentoController.buscarPorId
);

router.put(
    "/agendamentos/:id",
    verificarToken,
    exigirPerfil("ADMIN", "ATENDENTE"),
    agendamentoController.atualizar
);

router.delete(
    "/agendamentos/:id",
    verificarToken,
    exigirPerfil("ADMIN"),
    agendamentoController.excluir
);

module.exports = router;
const express = require("express");
const api = require("./usecases.js");
const bodyParser = require("body-parser");

const router = express.Router();

router.post("/login", async (req, res) => {
  const {
    body: { user, pass },
  } = req;
  const loginResponse = await api.validaUsuario(user, pass);
  console.log(loginResponse);
  if (loginResponse === api.userCodes.NONE_EXISTENT_USER) {
    res.json({ response: loginResponse });
  } else if (loginResponse === api.userCodes.INVALID_USER) {
    res.json({ response: loginResponse });
  } else if (loginResponse.code === api.userCodes.VALID_USER) {
    res.status(200).json({ response: loginResponse });
  }
});
router.post("/alta", async (req, res) => {
  const { body } = req;
  const newUser = await api.createUser(body);
  res.json(newUser);
});
router.post("/listar", async (req, res) => {
  const { direccion, orden } = req.body;
  const infoUser = await api.listUser(25, direccion, orden);
  res.json(infoUser);
});

module.exports = router;

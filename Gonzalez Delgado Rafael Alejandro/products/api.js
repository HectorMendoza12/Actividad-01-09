const express = require("express");
const api = require("./usecases.js");
const bodyParser = require("body-parser");

const router = express.Router();

router.post("/altaProductos", async (req, res) => {
  const responseProducts = await api.altaProductos(req.body);
  res.json({ responseProducts });
});
router.post("/listProducts", async (req, res) => {
  console.log(req.body);
  const listedProducts = await api.listarProductos(req.body);
  res.json({ listedProducts });
});
router.post("/registroEntrada", async (req, res) => {
  const registredEntry = await api.registrarEntrada(req.body);
  console.log(registredEntry);
  res.json({ registredEntry });
});
router.post("/registroSalida", async (req, res) => {
  const registredOutputs = await api.registrarSalida(req.body);
  res.json({ registredOutputs });
});
router.post("/graficaEstatus", async (req, res) => {
  const listedEstatus = await api.listEstatus(req.body);
  res.json(listedEstatus);
});
router.post("/graficaVendedora", async (req, res) => {
  const listedVendedora = await api.listVendedora(req.body);
  res.json({ listedVendedora });
});
router.post("/graficaPorDia", async (req, res) => {
  const listedSalidasPorDia = await api.listSalidasDia(req.body);
  res.json(listedSalidasPorDia);
});
router.post("/readID", async (req, res) => {
  const readedID = await api.readID(req.body);
  res.json({ readedID });
});
module.exports = router;

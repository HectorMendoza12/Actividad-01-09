const db = require("./firestore.js");
var bcrypt = require("bcryptjs");
const moment = require("moment");
const Categorias = "Categorias";
const PRODUCTS_COLLECTION = "Productos";
const ENTRY_COLLECTION = "Entradas";
const OUTPUTS_COLLECTION = "Salidas";
const userCodes = {
  DUPLICATED_PRODUCTS: "PRODUCTO DUPLICADO",
  CREATED_PRDUCT: "PRODUCTO CREADO",
  EMPTYPRODUCTS: "NO EXISTEN PRODUCTOS",
  NOT_EXISTING_PRODUCT: "NO EXISTE EL PRODUCTO",
  REGISTRED_ENTRY: "SE REGISTRO LA ENTRADA",
};
const folioProductos = async (fields) => {
  const { categoria } = fields;
  try {
    const lastProducts = await db.read(categoria, Categorias);
    let { folio, iniciales } = lastProducts;
    folio++;
    const uploadID = await db.update(
      categoria,
      { folio, iniciales },
      Categorias
    );
    let num_folio = folio.toString();
    num_folio = num_folio.padStart(5, "0");
    originalFolio = iniciales.concat(num_folio);
    return originalFolio;
  } catch (error) {
    console.error(error);
  }
};
const folioEntradas = async () => {
  const categoria = "Entradas";
  try {
    const lastProducts = await db.read(categoria, Categorias);
    let { folio } = lastProducts;
    folio++;
    const uploadID = await db.update(categoria, { folio }, Categorias);
    let num_folio = folio.toString();
    num_folio = num_folio.padStart(5, "0");
    return num_folio;
  } catch (error) {
    console.error(error);
  }
};
const folioSalidas = async () => {
  const categoria = "Salidas";
  try {
    const lastProducts = await db.read(categoria, Categorias);
    let { folio } = lastProducts;
    folio++;
    const uploadID = await db.update(categoria, { folio }, Categorias);
    let num_folio = folio.toString();
    num_folio = num_folio.padStart(5, "0");
    return num_folio;
  } catch (error) {
    console.error(error);
  }
};
const altaProductos = async (fields) => {
  let folio = await folioProductos(fields);
  fields.id = folio;
  try {
    const duplicatedProducts = await db.read(folio, PRODUCTS_COLLECTION);
    if (duplicatedProducts.id === folio) {
      return userCodes.DUPLICATED_PRODUCTS;
    }
  } catch (error) {
    const createProducts = await db.create({ ...fields }, PRODUCTS_COLLECTION);
    return userCodes.CREATED_PRDUCT;
  }
  console.log(folio);
};
const listarProductos = async (datas) => {
  let limit = 10000;
  const { ordenar, direccion } = datas;
  try {
    const listedProducts = await db.list(
      ordenar,
      direccion,
      limit,
      PRODUCTS_COLLECTION
    );
    return listedProducts;
  } catch (error) {
    return userCodes.EMPTYPRODUCTS;
  }
};
const registrarEntrada = async (datas) => {
  let folio = await folioEntradas();
  datas.id = folio;
  const { productos } = datas;
  for (let i = 0; i < productos.length; i++) {
    const { nombre, piezas } = productos[i];
    const piezasEntrada = parseInt(piezas);
    try {
      const readedProduct = await db.read(nombre, PRODUCTS_COLLECTION);
      console.log(readedProduct);
      let {
        NOMBRE,
        STOCK_ACTUAL,
        STOCK_MINIMO,
        MEDIDA,
        ID,
        ESPECIFICACION,
        CATEGORIA,
        FABRICANTE,
      } = readedProduct;
      STOCK_ACTUAL += piezasEntrada;
      const updateChanges = await db.update(
        NOMBRE,
        {
          NOMBRE,
          STOCK_ACTUAL: parseInt(STOCK_ACTUAL),
          MEDIDA,
          STOCK_MINIMO: parseInt(STOCK_MINIMO),
          ID,
          ESPECIFICACION,
          CATEGORIA,
          FABRICANTE,
        },
        PRODUCTS_COLLECTION
      );
      const createEntry = await db.create(datas, ENTRY_COLLECTION);
    } catch (error) {
      console.error(error);
      return userCodes.NOT_EXISTING_PRODUCT;
    }
  }
  return userCodes.REGISTRED_ENTRY;
};
const registrarSalida = async (datas) => {
  let folio = await folioSalidas();
  datas.id = folio;
  const { productos } = datas;
  for (let i = 0; i < productos.length; i++) {
    const { nombre, piezas } = productos[i];
    const piezasEntrada = parseInt(piezas);
    try {
      const readedProduct = await db.read(nombre, PRODUCTS_COLLECTION);
      console.log(readedProduct);
      let {
        FABRICANTE,
        ID,
        NOMBRE,
        CATEGORIA,
        STOCK_ACTUAL,
        MEDIDA,
        STOCK_MINIMO,
        ORIGEN,
        ESPECIFICACION,
      } = readedProduct;
      STOCK_ACTUAL -= piezasEntrada;
      const updateChanges = await db.update(
        NOMBRE,
        {
          NOMBRE,
          STOCK_ACTUAL: parseInt(STOCK_ACTUAL),
          MEDIDA,
          STOCK_MINIMO: parseInt(STOCK_MINIMO),
          ID,
          ESPECIFICACION,
          CATEGORIA,
          FABRICANTE,
          ORIGEN,
        },
        PRODUCTS_COLLECTION
      );
      const createOutputs = await db.create(datas, OUTPUTS_COLLECTION);
    } catch (error) {
      console.error(error);
      return userCodes.NOT_EXISTING_PRODUCT;
    }
  }
  return userCodes.REGISTRED_ENTRY;
};
const listEstatus = async (datas) => {
  let limit = 10000;
  const { orderBy, direction } = datas;
  try {
    const listedEstatus = await db.listEstatus(
      orderBy,
      direction,
      limit,
      OUTPUTS_COLLECTION
    );
    const salidaProductos = {};
    for (let i = 0; i < listedEstatus.salidas.length; i++) {
      const { estatus } = listedEstatus.salidas[i];
      updateOrCreateKey(salidaProductos, estatus, "count", 1);
    }
    return salidaProductos;
  } catch (error) {
    console.error(error);
    return userCodes.NOT_EXISTING_PRODUCT;
  }
};
const listVendedora = async (datas) => {
  let limit = 10000;
  const { orderBy, direction } = datas;
  try {
    const listedVendedora = await db.listEstatus(
      orderBy,
      direction,
      limit,
      OUTPUTS_COLLECTION
    );
    const salidasVendedora = {};
    for (let i = 0; i < listedVendedora.salidas.length; i++) {
      const { vendedora } = listedVendedora.salidas[i];
      updateOrCreateKey(salidasVendedora, vendedora, "count", 1);
    }
    return salidasVendedora;
  } catch (error) {
    console.error(error);
    return userCodes.NOT_EXISTING_PRODUCT;
  }
};
const listSalidasDia = async (datas) => {
  let limit = 10000;
  const ultimo = "";
  const { orderBy, direction, inferior, actual } = datas;
  try {
    const listedSalidasPorDia = await db.listSalidasPorDia(
      orderBy,
      direction,
      inferior,
      actual,
      limit,
      OUTPUTS_COLLECTION,
      ultimo
    );
    return listedSalidasPorDia;
  } catch (error) {
    console.error(error);
  }
};
const readID = async (data) => {
  const { nombre } = data;
  const dataProduct = await db.read(nombre, PRODUCTS_COLLECTION);
  const { ID } = dataProduct;
  return ID;
};
const updateOrCreateKey = (objectToUpdate, key, innerKey, value) => {
  if (key in objectToUpdate && innerKey in objectToUpdate[key]) {
    objectToUpdate[key][innerKey] += value;
  } else {
    objectToUpdate[key] = { ...objectToUpdate[key], [innerKey]: value };
  }
  return objectToUpdate;
};
module.exports = {
  altaProductos,
  listarProductos,
  registrarEntrada,
  registrarSalida,
  listEstatus,
  listVendedora,
  listSalidasDia,
  readID,
};

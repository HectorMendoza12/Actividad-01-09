const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();

async function read(id, collection) {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) {
    throw new Error("No se encontro el producto");
  }
  return doc.data();
}
async function update(id, data, collection) {
  let ref;
  if (id === null) {
    ref = db.collection(collection).doc();
  } else {
    ref = db.collection(collection).doc(id);
  }

  data.id = ref.id;
  data = { ...data };
  await ref.set(data);
  return data;
}
async function create(data, collection) {
  const { id } = data;
  return await update(id, data, collection);
}
async function list(ordenar, direccion, limit, collection) {
  const snapshot = await db
    .collection(collection)
    .select(
      "ID",
      "CATEGORIA",
      "ESPECIFICACION",
      "FABRICANTE",
      "MEDIDA",
      "NOMBRE",
      "STOCK_ACTUAL",
      "STOCK_MINIMO"
    )
    .orderBy(ordenar, direccion)
    .get();
  if (snapshot.empty) {
    return {
      productos: [],
      nextPageToken: false,
    };
  }
  const productos = [];
  snapshot.forEach((doc) => {
    let producto = doc.data();
    producto.id = doc.id;
    productos.push(producto);
  });
  const q = await snapshot.query.offset(limit).get();
  return {
    productos,
    nextPageToken: q.empty ? false : productos[productos.length - 1].nombre,
  };
}
async function listEstatus(ordenar, direccion, limit, collection) {
  const snapshot = await db
    .collection(collection)
    .select(
      "id",
      "productos",
      "estatus",
      "fecha",
      "notaVenta",
      "personalizado",
      "vendedora"
    )
    .orderBy(ordenar, direccion)
    .get();
  if (snapshot.empty) {
    return {
      salidas: [],
      nextPageToken: false,
    };
  }
  const salidas = [];
  snapshot.forEach((doc) => {
    let producto = doc.data();
    producto.id = doc.id;
    salidas.push(producto);
  });
  const q = await snapshot.query.offset(limit).get();
  return {
    salidas,
    nextPageToken: q.empty ? false : salidas[salidas.length - 1].nombre,
  };
}

async function listSalidasPorDia(
  ordenar,
  direccion,
  inferior,
  actual,
  limit,
  collection
) {
  const snapshot = await db
    .collection(collection)
    .select(
      "id",
      "productos",
      "estatus",
      "fecha",
      "notaVenta",
      "personalizado",
      "vendedora"
    )
    .where("fecha", ">", inferior)
    .where("fecha", "<=", actual)
    .orderBy(ordenar, direccion)
    .get();
  if (snapshot.empty) {
    return {
      salidas: [],
      nextPageToken: false,
    };
  }
  const salidas = [];
  snapshot.forEach((doc) => {
    let producto = doc.data();
    producto.id = doc.id;
    salidas.push(producto);
  });
  const q = await snapshot.query.offset(limit).get();
  return {
    salidas,
    nextPageToken: q.empty ? false : salidas[salidas.length - 1].nombre,
  };
}
module.exports = { read, update, create, list, listEstatus, listSalidasPorDia };

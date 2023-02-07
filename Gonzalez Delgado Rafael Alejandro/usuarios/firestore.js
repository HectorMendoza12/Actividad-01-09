const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();

async function read(id, collection) {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) {
    throw new Error("No se encontro el usuario");
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
async function list(limit, token, orden, direccion, collection) {
  const snapshot = await db
    .collection(collection)
    .select("nombre", "apellidos", "perfil", "usuario", "correo")
    .orderBy(orden)
    .limit(limit)
    .get();
  if (snapshot.empty) {
    return {
      usuarios: [],
      nextPageToken: false,
    };
  }
  const usuarios = [];
  snapshot.forEach((doc) => {
    let usuario = doc.data();
    usuario.id = doc.id;
    usuarios.push(usuario);
  });
  const q = await snapshot.query.offset(limit).get();
  return {
    usuarios,
    nextPageToken: q.empty ? false : usuarios[usuarios.length - 1].nombre,
  };
}
module.exports = { read, update, create, list };

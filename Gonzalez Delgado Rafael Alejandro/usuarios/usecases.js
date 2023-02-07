const db = require("./firestore.js");
var bcrypt = require("bcryptjs");
const moment = require("moment");
const collection = "Usuarios";

const userCodes = {
  NONE_EXISTENT_USER: "El usuario no existe",
  INVALID_USER: "Usuario o contraseña incorrectos",
  VALID_USER: "Usuario valido",
  DUPLICARTED_USER: "Usuario repetido",
  CREATED_USER: "Usuario creado",
  NONE_USERS: "No existen Usuarios,",
};

const validaUsuario = async (user, pass) => {
  const salt = bcrypt.genSaltSync(10);
  const encryptedPass = bcrypt.hashSync(pass, salt);
  try {
    const userResponse = await db.read(user, collection);
    const isPassValid = bcrypt.compareSync(pass, userResponse.contraseña);
    if (isPassValid) {
      return {
        code: userCodes.VALID_USER,
        rol: userResponse.perfil,
      };
    }
    return userCodes.INVALID_USER;
  } catch (error) {
    return userCodes.NONE_EXISTENT_USER;
  }
};
const createUser = async (body) => {
  const date = moment().format();
  body.id = body.usuario;
  const salt = bcrypt.genSaltSync(10);
  const encryptedPass = bcrypt.hashSync(body.contraseña, salt);
  body.contraseña = encryptedPass;
  try {
    const duplicatedUser = await db.read(body.usuario, collection);
    if (duplicatedUser.usuario === body.usuario) {
      return userCodes.DUPLICARTED_USER;
    }
  } catch (error) {
    const createdUser = await db.create({ ...body, date }, collection);
    return userCodes.CREATED_USER;
  }
};
const listUser = async (limit, token, orden, direccion) => {
  const listedUsers = await db.list(limit, token, orden, direccion, collection);
  try {
    return listedUsers;
  } catch (error) {
    console.error(error);
    return userCodes.NONE_USERS;
  }
};
module.exports = {
  validaUsuario,
  userCodes,
  createUser,
  listUser,
};

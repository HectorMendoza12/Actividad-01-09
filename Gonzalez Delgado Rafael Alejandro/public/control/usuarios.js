const userCodes = {
  DUPLICARTED_USER: "Usuario repetido",
  CREATED_USER: "Usuario creado",
};
$(document).ready(function () {
  postListUsers();
  $("#newUser").click(function () {
    $("#myModal").show();
  });
  $(".close").click(function () {
    $("#myModal").hide();
  });
  $("#postUser").click(function (event) {
    $(".loading").show();
    event.preventDefault();
    let fields = {
      nombre: $("#nombre").val(),
      apellidos: $("#apellidos").val(),
      correo: $("#correo").val(),
      telefono: $("#telefono").val(),
      usuario: $("#usuario").val(),
      contraseña: $("#contraseña").val(),
      perfil: $("#perfil").val(),
      sucursal: $("#sucursal").val(),
    };
    validateInputsNewUSer(fields);
  });
  $("#salir").click(function () {
    window.location.href = "../index.html";
  });
});
function validateInputsNewUSer(fields) {
  const {
    nombre,
    apellidos,
    correo,
    telefono,
    usuario,
    contraseña,
    perfil,
    sucursal,
  } = fields;
  if (
    nombre === "" ||
    apellidos === "" ||
    telefono === "" ||
    usuario === "" ||
    contraseña === "" ||
    perfil === "" ||
    sucursal == ""
  ) {
    swal("Ooops!", "Debes llenar todos los campos", "error");
    $(".loading").hide();
  } else {
    postNewUser(fields);
    $(".loading").hide();
  }
}
function postNewUser(fields) {
  $.post("/usuarios/alta", fields, function (result) {
    if (result === userCodes.DUPLICARTED_USER) {
      swal("Ooops!", "Ya existe el nombre de usuario", "error");
      $(".loading").hide();
    } else if (result === userCodes.CREATED_USER) {
      swal("Usuario creado correctamente");
      $(".loading").hide();
    }
  });
}
function postListUsers() {
  const orderBy = "nombre";
  const direction = "desc";
  $.post(
    "/usuarios/listar",
    { orden: orderBy, direccion: direction },
    function (result) {
      fillTableUsers(result.usuarios);
      $(".loading").hide();
    }
  );
}
function fillTableUsers(arrayUsers) {
  if (arrayUsers.length === 0) {
    swal("Ooops!", "No existen usuarios", "error");
    $(".loading").hide();
  } else {
    for (let i = 0; i < arrayUsers.length; i++) {
      const { nombre, apellidos, perfil, usuario, correo } = arrayUsers[i];
      $("#tableUsuarios > tbody:last-child").append(
        `
        <tr>
        <td>${nombre} ${apellidos}</td>
        <td>${perfil}</td>
        <td>${correo}</td>
        <td>${usuario}</td>
        <td><button class="btn btn-primary">Editar</button></td>

        </tr>
        `
      );
    }
  }
}

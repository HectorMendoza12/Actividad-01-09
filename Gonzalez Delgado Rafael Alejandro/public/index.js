const userCodes = {
  NONE_EXISTENT_USER: "El usuario no existe",
  INVALID_USER: "Usuario o contraseña incorrectos",
  VALID_USER: "Usuario valido",
};

$(document).ready(function () {
  $(".loading").hide();
  $("#entrar").click(function () {
    postUser();
    $(".loading").show();
  });
  $("#password").keypress(function (event) {
    if (event.keyCode === 13) {
      $("#entrar").click();
    }
  });
});
function postUser() {
  const user = $("#usuario").val();
  const pass = $("#password").val();
  if (user != "" && pass != "") {
    $.post("/usuarios/login", { user, pass }, function (result) {
      const { response } = result;
      if (response === userCodes.NONE_EXISTENT_USER) {
        swal("Ooops!", "El Usurario no existe", "error");
        $(".loading").hide();
      } else if (response === userCodes.INVALID_USER) {
        swal("Ooops!", "Usuario o contraseña incorrectos", "error");
        $(".loading").hide();
      } else if (response.code === userCodes.VALID_USER) {
        window.location.href = "./control/dashboard.html";
        $(".loading").hide();
      }
    });
  } else {
    swal("Ooops!", "Debes de llenar todos los campos", "error");
    $(".loading").hide();
  }
}

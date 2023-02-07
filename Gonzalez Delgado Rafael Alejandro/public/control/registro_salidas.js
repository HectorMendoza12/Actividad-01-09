let num_productos = 1;
let productoInicial = 0;
$(document).ready(function () {
  $("#salir").click(function () {
    window.location.href = "../index.html";
  });
  $("#enviar").click(function () {
    $(".loading").show();
    getFieldsOutputProducts();
  });
  listNameProducts();
  fillId();
  deleteRow();
});
function getFieldsOutputProducts() {
  const fields = {
    fecha: moment($("#fechaSurtido").val()).format(),
    notaVenta: $("#notaVenta").val(),
    vendedora: $("#vendedora").val(),
    personalizado: $("#personalizado").val(),
    estatus: $("#estatus").val(),
    productos: [],
  };
  for (let i = 0; i < num_productos; i++) {
    const datosProductos = {
      idProducto: $(`#idProducto${i}`).val(),
      piezas: $(`#cantidad${i}`).val(),
      nombre: $(`#nombreProducto${i}`).val(),
    };
    fields.productos.push(datosProductos);
  }
  validateInputs(fields);
}
function addRow() {
  $("#addRow").click(function () {
    $("#salidaProductos > tbody:last-child").append(
      `
    <tr>
        <td>
          <div class="form-floating mb-3">
          <input list="nombres" id="nombreProducto${num_productos}" class="form-select nombreProducto"/>
          <label for="floatingInput">Nombre</label>
          <datalist id="nombres" >
          </datalist>
        </td>
        <td>
            <div class="form-floating mb-3">
            <input type="text" class="form-control " id="idProducto${num_productos}" style="min-width: 5rem;">
            <label for="floatingInput">ID del Producto</label>
            </div>
        </td>
        <td>
            <div class="form-floating mb-3">
            <input type="text" class="form-control" id="cantidad${num_productos}">
            <label for="floatingInput">Piezas</label>
            </div>
        </td>
    </tr>
    `
    );
    num_productos++;
    productoInicial++;
    fillId();
  });
}
function deleteRow() {
  $("#deleteRow").click(function () {
    num_productos--;
    $("#salidaProductos tr:last").remove();
  });
}
function postDataOutputs(fields) {
  console.log(fields);
  $.post("/products/registroSalida", fields, function (result) {
    if (result.registredOutputs === "SE REGISTRO LA ENTRADA") {
      swal("Salida registrada con exito");
      resetForm();
    } else {
      swal("No se encontro el producto");
    }
  });
}
function resetForm() {
  $("#formSalidas")[0].reset();
}
function validateInputs(fields) {
  if (
    Object.values(fields).some((x) => x === null || x === "") ||
    Object.values(fields.productos[0]).some((x) => x === null || x === "")
  ) {
    swal("Ooops!", "Debes de llenar todos los campos", "error");
    $(".loading").hide();
  } else {
    postDataOutputs(fields);
    $(".loading").hide();
  }
}
function listNameProducts() {
  let orderBy = "CATEGORIA";
  let direction = "asc";
  $.post(
    "/products/listProducts",
    { ordenar: orderBy, direccion: direction },
    function (result) {
      fillDataListNames(result.listedProducts.productos);
      $(".loading").hide();
      addRow();
    }
  );
}
function fillDataListNames(productos) {
  for (let i = 0; i < productos.length; i++) {
    const { NOMBRE } = productos[i];
    $("#nombres").append(
      `
      <option val="${NOMBRE}">${NOMBRE}</option>
      `
    );
  }
}
function fillId() {
  $(".nombreProducto").blur(function () {
    let producto = $(`#nombreProducto${productoInicial}`).val();
    if (producto === "") {
      swal("Ooops!", "Debes ingresar un producto", "error");
    } else {
      $.post("/products/readID", { nombre: producto }, function (result) {
        console.log(result);
        const { readedID } = result;
        $(`#idProducto${productoInicial}`).val(readedID);
      });
    }
  });
}

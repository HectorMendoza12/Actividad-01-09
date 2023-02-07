const userCodes = {
  DUPLICATED_PRODUCTS: "PRODUCTO DUPLICADO",
  CREATED_PRDUCT: "PRODUCTO CREADO",
};
$(document).ready(function () {
  $("#salir").click(function () {
    window.location.href = "../index.html";
  });
  $(".loading").show();
  $("#altaProductos").click(function () {
    $("#myModal").show();
  });
  $(".close").click(function () {
    $("#myModal").hide();
  });
  getFieldsProducts();
  postListProducts();
});
function getFieldsProducts() {
  $("#guardar").click(function () {
    const fields = {
      nombre: $("#nombre").val(),
      descripcion: $("#descripcion").val(),
      stockMinimo: parseInt($("#stockMin").val()),
      stockActual: parseInt($("#stockActual").val()),
      categoria: $("#categoria").val(),
      fabricante: $("#fabricante").val(),
      medida: $("#medida").val(),
    };
    postDataProducts(fields);
  });
}
function postDataProducts(fields) {
  $.post("/products/altaProductos", fields, function (result) {
    response(result.responseProducts);
  });
  console.log(fields);
}
function response(responseProducts) {
  console.log(responseProducts);
  if (responseProducts === userCodes.CREATED_PRDUCT) {
    swal("Producto creado correctamente");
    limpiarFormulario();
  } else {
    swal("Ooops!", "No se pudo crear el producto", "error");
  }
}
function postListProducts() {
  let orderBy = "ID";
  let direction = "asc";
  $.post(
    "/products/listProducts",
    { ordenar: orderBy, direccion: direction },
    function (result) {
      console.log(result);
      fillListProducts(result.listedProducts);
      $(".loading").hide();
    }
  );
}
function fillListProducts(listedProducts) {
  const { productos } = listedProducts;
  for (let i = 0; i < productos.length; i++) {
    const { NOMBRE, ID, MEDIDA, STOCK_ACTUAL, CATEGORIA } = productos[i];
    $("#productsTable > tbody:last-child").append(
      `
      <tr>
      <td>${ID}</td>
      <td>${NOMBRE}</td>
      <td>${MEDIDA}</td>
      <td>${STOCK_ACTUAL}</td>
      <td>${CATEGORIA}</td>
      </tr>
      `
    );
  }
}
function limpiarFormulario() {
  $("#formNewProduct")[0].reset();
}

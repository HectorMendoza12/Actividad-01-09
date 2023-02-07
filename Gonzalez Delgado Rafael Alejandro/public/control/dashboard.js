$(document).ready(function () {
  $(".loading").show();
  listaSalidas();
  listaNotasVendedora();
  listaSalidasDia();
});
function listaSalidas() {
  let orderBy = "estatus";
  let direction = "asc";
  $.post(
    "/products/graficaEstatus",
    {
      orderBy,
      direction,
    },
    function (result) {
      graficaEstatus(result);
      $(".loading").hide();
    }
  );
}
function graficaEstatus(dataSalidas) {
  const salidas = Object.keys(dataSalidas);
  const values = Object.values(dataSalidas).reduce(
    (total, current) => total + current.count,
    0
  );
  const cxt = $("#grafica");
  const myChart = new Chart(cxt, {
    type: "doughnut",
    data: {
      labels: salidas,
      datasets: [
        {
          data: Object.keys(dataSalidas).map((estatus) =>
            parseInt((dataSalidas[estatus].count / values) * 100)
          ),
          backgroundColor: ["rgb(0, 82, 220)", "rgb(121, 184, 255)"],
        },
      ],
    },
  });
}
function listaNotasVendedora() {
  let orderBy = "vendedora";
  let direction = "asc";
  $.post(
    "/products/graficaVendedora",
    { orderBy, direction },
    function (result) {
      graficaVendedora(result.listedVendedora);
    }
  );
}
function graficaVendedora(datosVendedora) {
  const vendedoras = Object.keys(datosVendedora);
  const cxt = $("#graficaVendedora");
  const myChart = new Chart(cxt, {
    type: "bar",
    data: {
      labels: vendedoras,
      datasets: [
        {
          label: "Notas de venta surtidas por vendedora",
          data: Object.keys(datosVendedora).map(
            (vendedora) => datosVendedora[vendedora].count
          ),
          backgroundColor: ["rgb(0, 82, 220)"],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
function listaSalidasDia() {
  let orderBy = "fecha";
  let direction = "asc";
  const lowerBoundsDate = moment().subtract(8, "days").format();
  const date = moment().add(1, "days").format();
  $.post(
    "/products/graficaPorDia",
    { orderBy, direction, inferior: lowerBoundsDate, actual: date },
    function (result) {
      formatoFecha(result.salidas);
    }
  );
}
function formatoFecha(salidas) {
  const datesObject = {};
  for (let i = 0; i < salidas.length; i++) {
    const { fecha } = salidas[i];
    moment.locale("es-mx");
    let dateDay = moment(fecha).format("l");
    if (dateDay in datesObject) {
      datesObject[dateDay] = datesObject[dateDay] + 1;
    } else {
      datesObject[dateDay] = 1;
    }
  }
  graficaPorDia(datesObject);
}
function graficaPorDia(datosFechas) {
  console.log(datosFechas);
  const fechas = Object.keys(datosFechas);
  const cxt = $("#graficaPorDía");
  const myChart = new Chart(cxt, {
    type: "bar",
    data: {
      labels: fechas,
      datasets: [
        {
          label: "Notas de venta surtidas por día",
          data: Object.values(datosFechas),
          backgroundColor: ["rgb(0, 82, 220)"],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
  });
}
function listaProductoPrincipal() {
  let orderBy = "productos";
  let direccion = "asc";
  $.post(
    "/products/graficaProductos",
    orderBy,
    direccion,
    function (result) {}
  );
}

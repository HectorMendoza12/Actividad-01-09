const Firestore = require("@google-cloud/firestore");
const csv = require("csvtojson");
const csvFilePath = "PRODUCTOS LR.csv";
const run = async () => {
  const array = await csv().fromFile(csvFilePath);
  const db = new Firestore({});
  //console.log(array);
  const length = array.length;
  for (let i = 0; i < length; i++) {
    const row = array[i];
    console.log(row, i);
    const doc = db.collection("Productos").doc(row.NOMBRE); // Aqui cambia el nombre de la collecction
    doc.set({
      // Aqui van los nombres de las columnas
      FABRICANTE: row.FABRICANTE,
      ORIGEN: row.ORIGEN,
      CATEGORIA: row.CATEGORIA,
      ESPECIFICACION: row.ESPECIFICACION,
      MEDIDA: row.MEDIDA,
      NOMBRE: row.NOMBRE,
      ID: row.ID,
      STOCK_ACTUAL: parseFloat(row.STOCK_ACTUAL.replace(/\$|,/g, "")),
      STOCK_MINIMO: parseFloat(row.STOCK_MINIMO.replace(/\$|,/g, "")),
    });
  }
};

run();

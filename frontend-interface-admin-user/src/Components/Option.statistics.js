import React, { useEffect, Fragment } from 'react';
import Bar from '../graphics/Bar';
import Line from '../graphics/Line'

export default function OpcionEstadisticas(props) {
  const [valuesXLine, setXValuesLine] = React.useState([]);
  const [valuesYLine, setYValuesLine] = React.useState([]);
  const [valuesYBar1, setYValuesBar1] = React.useState([]);
  const [valuesYBar2, setYValuesBar2] = React.useState([]);
  const [valuesYBar3, setYValuesBar3] = React.useState([]);
  useEffect(() => {
    var data = props.data["reporte_2020"]
    var fechas_list = []
    var values_list = []
    var values_list1 = []
    var values_list2 = []
    var values_list3 = []
    var fecha_hoy = new Date()
    var fecha = new Date();
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']
    fecha.setDate(fecha_hoy.getDate() - 1)
    var count = 0;
    for (var i = fecha.getMonth(); i > 0; i--) {
      if (data[i]) {
        for (var j = fecha.getDate(); j > 0; j--) {
          if (data[i][j]) {
            if (count < 10) {
              fechas_list.unshift(j < 10 ? ("0" + j) : j + "/" + meses[i])
              values_list.unshift(data[i][j].personas)
              values_list1.unshift(data[i][j].inseguro)
              values_list2.unshift(data[i][j].peligroso)
              values_list3.unshift(data[i][j].maximo)
              count++;
            }
            if (count == 10) {
              break;
            }
          }
        }
      }
    }
    console.log(fechas_list)
    console.log(values_list)
    setYValuesLine(fechas_list);
    setXValuesLine(values_list);
    setYValuesBar1(values_list1);
    setYValuesBar2(values_list2);
    setYValuesBar3(values_list3);
  }, []);
  return (
    <div className="option">
      <div className="header">Estadisticas</div>
      <div className="st-container">
        <Line xvalues={valuesXLine} yvalues={valuesYLine} />
      </div>
      <div className="st-container">
        <Bar xvalues={valuesYLine} yvalues1={valuesYBar1} yvalues2={valuesYBar2} yvalues3={valuesYBar3} />
      </div>
    </div >

  );
}


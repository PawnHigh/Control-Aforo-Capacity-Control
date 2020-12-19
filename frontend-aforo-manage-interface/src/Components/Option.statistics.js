import React, { useEffect, Fragment } from 'react';
import Bar from '../graphics/Bar';
import Line from '../graphics/Line'

export default function OpcionEstadisticas(props) {
  const [valuesXLine, setXValuesLine] = React.useState([]);
  const [valuesYLine, setYValuesLine] = React.useState([]);
  const [valuesYBar1, setYValuesBar1] = React.useState([]);
  const [valuesYBar2, setYValuesBar2] = React.useState([]);
  const [valuesYBar3, setYValuesBar3] = React.useState([]);
  const [valuesYBar4, setYValuesBar4] = React.useState([]);

  useEffect(() => {
    var fecha_hoy = new Date()
    var data = props.data["reporte_" + fecha_hoy.getUTCFullYear()]
    var fechas_list = []
    var values_list = []
    var values_list1 = []
    var values_list2 = []
    var values_list3 = []
    var values_list4 = []

    var fecha = new Date();
    fecha.setDate(fecha_hoy.getDate() - 1)
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']
    var count = 0;
    for (var i = fecha.getMonth(); i >= 0; i--) {
      if (data[i] != null) {
        for (var j = 31; j > 0; j--) {
          if (data[i][j]) {
            if (count < 10) {
              fechas_list.unshift(j < 10 ? ("0" + j) + "/" + meses[i] : j + "/" + meses[i])
              values_list.unshift(data[i][j].personas)
              values_list1.unshift(data[i][j].inseguro)
              values_list2.unshift(data[i][j].peligroso)
              values_list3.unshift(data[i][j].maximo)
              if (data[i][j].inseguro + data[i][j].peligroso + data[i][j].maximo == 0) {
                values_list4.unshift(4)
              }
              else {
                values_list4.unshift(0)
              }
              count++;
            }
            if (count == 10) {
              break;
            }
          }
        }
      }
    }
    setYValuesLine(fechas_list);
    setXValuesLine(values_list);
    setYValuesBar1(values_list1);
    setYValuesBar2(values_list2);
    setYValuesBar3(values_list3);
    setYValuesBar4(values_list4);

  }, [props.data]);
  return (
    <div className="option">
      <div className="header">Estadisticas</div>
      <div className="st-container">
        <Line xvalues={valuesXLine} yvalues={valuesYLine} />
      </div>
      <div className="st-container">
        <Bar xvalues={valuesYLine} yvalues1={valuesYBar1} yvalues2={valuesYBar2} yvalues3={valuesYBar3} yvalues4={valuesYBar4} />
      </div>
    </div >

  );
}

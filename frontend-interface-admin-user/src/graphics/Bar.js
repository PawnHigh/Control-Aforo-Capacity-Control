import React, { useEffect, Component } from 'react'
import ReactApexChart from "react-apexcharts";


export default function Bar(props) {

  return (
    <div id="chart" className="chart-container">
      <ReactApexChart options={
        {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
          },
          title: {
            text: "Nro de Alarmas por tipo",
            align: 'center',
          },
          subtitle: {
            text: "Grafico que contabiliza la cantidad de alarmas por tipo",
            align: 'center',
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          colors: ['rgb(216,223,99)', 'rgb(240,145,80)', 'rgb(242,71,71)'],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            show: true,
            width: 1,
            colors: ["transparent"]
          },
          xaxis: {
            categories: props.xvalues,
            labels: {
              formatter: function (val) {
                return val + " alarmas "
              }
            }
          },
          yaxis: {
            title: {
              text: ''
            }

          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + " alarmas"
              }
            }
          },
          responsive: [
            {
              breakpoint: 1000,
              options: {
                plotOptions: {
                  bar: {
                    horizontal: true
                  }
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        }
      }
        series={
          [{
            name: 'Aforo Inseguro',
            data: props.yvalues1,

          }, {
            name: 'Aforo peligroso',
            data: props.yvalues2,

          }, {
            name: 'Aforo maximo',
            data: props.yvalues3,
          }]}
        type="bar" height={400} />
    </div>


  );

}
import React, { Component } from 'react'
import ReactApexChart from "apexcharts";


export default class Bar extends React.Component {
  constructor(props) {
    super(props);  

    this.state = {
    
      series: [{
        name: 'Aforo Inseguro',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        
      }, {
        name: 'Aforo peligroso',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
     
      }, {
        name: 'Aforo maximo',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      }],
      colors: ['rgb(216,223,99)', 'rgb(240,145,80)', 'rgb(242,71,71)'],
      options: {
        chart: {
          
          type: 'bar',
          height: 350
        },
        title: {
          text: "Nro de Alarmas por tipo",
          align: 'center',
      },
      subtitle: {
        text: "Grafico que contabiliza \n\n/la cantidad de alarmas por tipo",
        align: 'center',
    },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
            
          },
        },
        colors: ['rgb(216,223,99)', 'rgb(240,145,80)', 'rgb(242,71,71)'],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        },
        yaxis: {
          title: {
            text: 'Nro de Alarmas'
          }
        },
        fill: {
          opacity: 1,
        },/*
        legend: {
          position: 'top',
          horizontalAlign: 'center',
        },*/
        tooltip: {
          y: {
            formatter: function (val) {
              return   val + " alarmas"
            }
          }
        },
        responsive: [
          {
            breakpoint: 1000,
            options: {
              plotOptions: {
                bar: {
                  horizontal: false
                }
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      },
    };
  }



  render() {
    return (
      

<div id="chart" /*style={{border:"solid 1px rgb(0, 0, 0)",padding:"10px"}}*/>
<ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={400} />
</div>


    );
  }
}
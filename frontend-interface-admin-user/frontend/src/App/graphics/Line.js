import React, { Component } from 'react'
import ReactApexChart from "apexcharts";

export default  class Line extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        series: [{
            name: "Nro de clientes",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }],
        options: {
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'straight'
          },
          title: {
            text: 'Clientes promedio por dia',
            align: 'center'
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          }
        },
      };
    }

  

    render() {
      return (
        

  <div id="chart" /*style={{border:"solid 1px rgb(0, 0, 0)",padding:"10px"}} */>
<ReactApexChart options={this.state.options} series={this.state.series} type="line"  height={400} />
</div>
      );}
    
    }
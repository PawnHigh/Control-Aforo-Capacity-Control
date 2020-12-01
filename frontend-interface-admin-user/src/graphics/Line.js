import React, { useEffect, Fragment } from 'react';
import ReactApexChart from "react-apexcharts";

export default function Line(props) {
  return (
    <div id="chart" className="chart-container" >
      <ReactApexChart options={
        {
          chart: {
            height: 350,
            type: 'area',
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: true
          },
          stroke: {
            curve: 'straight'
          },
          title: {
            text: 'Clientes promedio por dia',
            align: 'center'
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 0.5,
              opacityFrom: 0.5,
              opacityTo: 0.5,
              stops: [100, 100]
            }
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'],
              opacity: 0.5
            },
          },
          xaxis: {
            categories: props.yvalues
          },
          yaxis: {
            min: 0,
            max: Math.max(...props.xvalues) + 2
          }
        }
      } series={[{
        name: "Nro de clientes",
        data: props.xvalues
      }]} type="area" height={400} />
    </div>
  );
}
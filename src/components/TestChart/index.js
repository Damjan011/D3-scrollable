// import * as d3 from 'd3';
// import React, { useRef, useEffect, useState } from 'react';
// import './style.css';

// const TestChart = ({ data, width, height }) => {
//   useEffect(() => {
//     data.sort(function (a, b) {
//       return b.timestamp - a.timestamp;
//     });

//     var offset = 0,
//       limit = 2,
//       current_index = 2;

//     var chart_data = data.slice(offset, limit),
//       date_extent = d3.extent(chart_data, function (d) { return d.timestamp; }),
//       age_extent = d3.extent(chart_data, function (d) { return d.rx; }),
//       now = new Date(2020, 8, 16),
//       scale = 1.25,
//       min_translate_x = 0,
//       max_translate_x; // Calculated after initial scaling

//     var chart_container = d3.select('#chart');
//     var viz = chart_container.append('svg')
//       .attr('width', width)
//       .attr('height', height);

//     var x_scale = d3.scaleUtc()
//       .domain([new Date(date_extent[0]), new Date(date_extent[1])])
//       .range([0, width]);

//     var y_scale = d3.scaleLinear()
//       .domain([age_extent[0] - 5, age_extent[1] + 5])
//       .range([height, 0]);

//     // Start adding to the viz
//     const x_axis = g => g
//       .classed('x axis', true)
//       .call(d3.axisBottom(x_scale)).outerTickSize(0).orient('top')
//       .attr('transform', 'translate(0, ' + height + ')');

//     viz.call(x_axis)
    
//   })

//   return (
//     <div id="chart" className="chart">
//     </div>
//   )
// }

// export default TestChart;


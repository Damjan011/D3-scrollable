import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import './style.css';

const BarChart = ({ width, height, data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
  }, []);

  useEffect(() => {
    drawGraph();
  }, [data]);

  const margin = ({ top: 20, right: 40, bottom: 30, left: 40 });

  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.timestamp))
    .range([margin.left, 2000])

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.rx)]).nice()
    .range([height - margin.bottom, margin.top])

  const line = d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.rx))

  const line2 = d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.tx))

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    
  
    // xAxis().innerTickSize(-height)

  const yAxis = g => g
    .attr("transform", `translate(960,0)`)
    .call(d3.axisRight(y))
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("y", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .style("fill", "#ffffff")
      .text(data.y));

  const xGridlines = d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(10);

  const yGridlines = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(10);

  const drawGraph = () => {
    const svg = d3.select(ref.current)
      .attr("viewBox", [0, 0, width, height])

    const nestedSvg = svg.append("svg")
      .attr("viewBox", [width, height])
      .attr("width", 960);




    nestedSvg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6EE294")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

    nestedSvg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#5F72FF")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line2);

      



      nestedSvg.append("g")
      .call(xAxis)


      // nestedSvg.append("g")
      // .call(xGridlines)


    svg.append("g")
      .call(yAxis);

    nestedSvg.append("g")			
      .call(yGridlines);


    const zoom = d3.zoom()
      .translateExtent([
        // Top Left corner
        [-10, height],
        // Bottom right corner
        [width * 2, 0]
      ])
      .on('zoom', function (event) {
        const burgija = event.transform
        d3.select(this)
          .selectAll('path')
          .attr("transform", burgija)

        d3.select(this)
          .select('g:first-of-type')
          //.attr( 'transform', burgija )
          .attr("transform", `translate(${burgija.x}, ${370})`)


        d3.select(xGridlines).attr("transform", `translate(${burgija.x}, ${370})`)

      });

    svg.call(zoom)
  }

  return (
    <div className="chart">
      <svg style={{padding: '10px'}} ref={ref} />
    </div>
  )
}

export default BarChart;

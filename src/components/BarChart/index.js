import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';
import './style.css';

const BarChart = ({ width, height, data }) => {
  const [delta, setDelta] = useState({ value: 0 });
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
    .range([0, 2000])

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

  const xGridlines = d3.axisBottom(x).tickSize(-350).tickFormat('').ticks(10);

  const yGridlines = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(5);

  const drawGraph = () => {
    const svg = d3.select(ref.current)
      .attr("viewBox", [0, 0, width, height])
      .attr('id', 'bakalar')
      .attr("cursor", "grab");

    const nestedSvg = svg.append("svg")
      .attr("viewBox", [width, height])
      .attr("id", "svg-inner")
      .attr("width", 960)
      .attr('class', 'svg-inner')

    const tooltip = d3.select("body").append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .text("bugraaa");

    // d3.select('#bakalar')
    // .on("mouseover", function(){
    //   return tooltip.style("visibility", "visible");
    // })
    // .on("mousemove", function(event){
    //   let calcPageY = event.pageY;
    //   let calcPageX = event.pageX;
    //   if(calcPageX < 200) {
    //     return tooltip.style('visibility', 'hidden')
    //   } else {
    //   return tooltip.style("top", (calcPageY-10)+"px")
    //                 .style("left",(calcPageX+10)+"px")
    //                 .style("visibility", "visible");
    //   }
    // })
    // .on("mouseout", function(){
    //   return tooltip.style("visibility", "hidden")
    // });

    nestedSvg.append('g')
      .call(xAxis)
      .attr('class', 'x-axis')

    nestedSvg.append('g')
      .call(xGridlines)
      .attr('transform', `translate(0, ${height - 30})`)
      .attr('stroke-dasharray', '5 5')
      .attr('class', 'x-axis-grid')
      .attr('id', 'coban')

    nestedSvg.append("g")
      .call(yGridlines)
      .attr('class', 'y-axis-grid');

    nestedSvg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6EE294")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("id", 'thisisline')
      .attr("d", line);

    nestedSvg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#5F72FF")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line2);

    svg.append('g')
      .call(yAxis);

    const zoom = d3.zoom()
      .translateExtent([
        // Top Left corner
        [-10, height],
        // Bottom right corner
        [width * 2, 0]
      ])
      .on('zoom', function (event) {
        const burgija = event.transform;
        const patka = event.sourceEvent;
        console.log(burgija)
        burgija.k = 1;
        tooltip.style("visibility", "hidden")
        if (patka.deltaY) {
          if (patka.deltaY === 100 && delta.value < 10) {
            setDelta(delta.value += 50)
            burgija.x = delta.value
          } else if (patka.deltaY === -100 && delta.value > -1000) {
            setDelta(delta.value -= 50)
            burgija.x = delta.value
          }
        } else {
          setDelta(delta.value = burgija.x)
        }
        d3.select(this)
          .selectAll('path')
          .attr("transform", `translate(${delta.value}, ${0})`)
        d3.select(this)
          .select('g:first-of-type')
          .attr("transform", `translate(${delta.value}, ${370})`);
        d3.select(this)
          .select('#coban')
          .attr("transform", `translate(${delta.value}, ${370})`)
      });
    svg.call(zoom);

    //     const bisect = d3.bisector(d => d.timestamp).left;


    //     const callout = (g, rx) => {
    //       if (!rx) return g.style("display", "none");

    //       g
    //       .attr('id', 'newg')
    //           .style("display", null)
    //           .style("pointer-events", "none")
    //           .style("font", "10px sans-serif");

    //       const path = g.selectAll("path")
    //         .data([null])
    //         .join("path")
    //           .attr("fill", "white")
    //           .attr("stroke", "black");

    //       const text = g.selectAll("text")
    //         .data([null])
    //         .join("text")
    //         .call(text => text
    //           .selectAll("tspan")
    //           .data((rx + "").split(/\n/))
    //           .join("tspan")
    //             .attr("x", 0)
    //             .attr("y", (d, i) => `${i * 1.1}em`)
    //             .style("font-weight", (_, i) => i ? null : "bold")
    //             .text(d => d));

    //       const {x, y, width: w, height: h} = text.node().getBBox();

    //       text.attr("transform", `translate(${-w / 2},${15 - y})`);
    //       path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
    //     }

    // /////////////////////////////////
    //     const tooltip2 = nestedSvg.append("g");

    //     nestedSvg.on("touchmove mousemove", function(event) {
    //       const {timestamp, rx} = bisect(d3.pointer(event, this)[0]);
    //       console.log(bisect(d3.pointer(event, this)[0]))
    //       tooltip2
    //           .attr("transform", `translate(${x(timestamp)},${y(rx)})`)
    //           .call(callout, `${rx} ${timestamp}`);
    //     });

    //     nestedSvg.on("touchend mouseleave", () => tooltip2.call(callout, null));

  }

  return (
    <div className="chart">
      <svg style={{ padding: '10px', position: 'relative' }} ref={ref} />
    </div>
  )
}

export default BarChart;

import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';
import './style.css';
import Tooltip from './Tooltip';

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

  const xGridlines = d3.axisBottom(x).tickSize(-350).tickFormat('').ticks(20);

  const yGridlines = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(5);

  const drawGraph = () => {
    const svg = d3.select(ref.current)
      .attr("viewBox", [0, 0, width, height])
      .attr('id', 'svg-main')
      .attr("cursor", "grab")

    const nestedSvg = svg.append("svg")
      .attr("viewBox", [width, height])
      .attr("id", "svg-inner")
      .attr("width", 960)
      .attr('class', 'svg-inner')

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
      .attr("d", line)

    nestedSvg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#5F72FF")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line2);

    // var pathEl = d3.select('#thisisline').node();
    // var pathLength = pathEl.getTotalLength();
    // var BBox = pathEl.getBBox();

    // var pos = pathEl.getPointAtLength(1800);
    // console.log('fsda', pos)

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
        burgija.k = 1;
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

    var focus = nestedSvg.append('g')
      .append('circle')
      .style('fill', 'none')
      .attr('stroke', 'black')
      .attr('r', 8.5)
      .style('opacity', 0)

    var focusText = nestedSvg.append('g')
      .append('text')
      .style('opacity', 0)
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle')

    // d3.select('#svg-main')
    // .on("mouseover", function(){
    //   return tooltip.style("visibility", "visible");
    // })
    // .on("mousemove", (event) => {

    //   var x0 = x.invert(d3.pointer(event, this)[0]);
    //   var i = bisect(data, x0, 1);
    //   var selectedData = data[i]

    //   console.log(selectedData.timestamp)
    //   console.log(selectedData.rx)

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

    nestedSvg.call(zoom);

    const butka = (patak) => <Tooltip patak={patak} />

    nestedSvg.append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', () => {
        focus.style('opacity', 1);
        focusText.style('opacity', 1);
      })
      .on('mousemove', (event) => {
        var x0 = x.invert(d3.pointer(event)[0]);
        var i = bisect(data, x0, 1);
        var selectedData = data[i];
        focus
          .attr('cx', x(selectedData.timestamp))
          .attr('cy', y(selectedData.rx))
        focusText
          .html("x:" + selectedData.timestamp + "  -oip  " + "y:" + selectedData.rx)
          .attr("x", x(selectedData.timestamp) + 15)
          .attr("y", y(selectedData.rx))
      })
      .on('mouseout', mouseout)

    // const tooltip = d3.select("body").append("div")
    //   .attr("class", "svg-tooltip")
    //   .style("position", "absolute")
    //   .style("visibility", "hidden")
    //   .text("bugraaa");

    function mouseout() {
      focus.style("opacity", 0)
      focusText.style("opacity", 0)
    }

    var bisect = d3.bisector(function (d) {
      return d.timestamp;
    }).right;

  }

  return (
    <div className="chart">
      <svg style={{ padding: '10px', position: 'relative' }} ref={ref} />
    </div>
  )
}

export default BarChart;

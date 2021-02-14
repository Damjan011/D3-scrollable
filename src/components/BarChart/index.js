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

      const nestedSvg = svg.append("svg")
      .attr("viewBox", [width, height])
      .attr("width", 960)
      .attr('id', 'svg-inner')
      .attr('class', 'svg-inner');

      const tooltip = d3.select("body").append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .text("bugraaa");

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

      svg.append('line').classed('hoverLine', true)
      svg.append('circle').classed('hoverPoint', true);
      svg.append("text").classed('hoverText', true);
    
      svg.append('rect')
        .attr('fill', 'transparent')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height);
    
      svg.on('mousemove', mouseMove);

      mouseMove = (event) => {
        eventParam = event;
        eventParam.preventDefault();
        const mouse = eventParam.mouse(eventParam.target);
        const [
          xCoord,
          yCoord,
        ] = mouse;
      
        const mouseDate = xScale.invert(xCoord);
        const mouseDateSnap = d3.timeYear.floor(mouseDate);
        
        if (xScale(mouseDateSnap) < margin.left ||
           xScale(mouseDateSnap) > width - margin.right) {
          return;
        }
        
        const bisectDate = d3.bisector(d => d.date).right;
        const xIndex = bisectDate(data, mouseDateSnap, 1);
        const mousePopulation = data[xIndex].population;
      
        svg.selectAll('.hoverLine')
          .attr('x1', xScale(mouseDateSnap))
          .attr('y1', margin.top)
          .attr('x2', xScale(mouseDateSnap))
          .attr('y2', height - margin.bottom)
          .attr('stroke', '#147F90')
          .attr('fill', '#A6E8F2')
        ;
      
        svg.selectAll('.hoverPoint')
          .attr('cx', xScale(mouseDateSnap))
          .attr('cy', yScale(mousePopulation))
          .attr('r', '7')
          .attr('fill', '#147F90')
        ;
        
        const isLessThanHalf = xIndex > data.length / 2;
        const hoverTextX = isLessThanHalf ? '-0.75em' : '0.75em';
        const hoverTextAnchor = isLessThanHalf ? 'end' : 'start';
      
        svg.selectAll('.hoverText')
          .attr('x', xScale(mouseDateSnap))
          .attr('y', yScale(mousePopulation))
          .attr('dx', hoverTextX)
          .attr('dy', '-1.25em')
          .style('text-anchor', hoverTextAnchor)
          .text(d3.format('.5s')(mousePopulation));
      };

      d3.select('#svg-inner')
      .on("mouseover", function(){
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(event){
        let calcPageY = event.pageY;
        let calcPageX = event.pageX;
        return tooltip.style("top", (calcPageY-10)+"px").style("left",(calcPageX+10)+"px");
      })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
      });

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
          .attr("transform", `translate(${burgija.x}, ${370})`);

        d3.select(this)
          .select('#coban')
          .attr("transform", `translate(${burgija.x}, ${370})`)
      });
      svg.call(zoom);

  }

  return (
    <div className="chart">
      <svg style={{padding: '10px', position: 'relative'}} ref={ref} />
    </div>
  )
}

export default BarChart;

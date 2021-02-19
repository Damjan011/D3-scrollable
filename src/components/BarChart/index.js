import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';
import './style.css';

const BarChart = ({ width, height, data }) => {
  const [delta, setDelta] = useState({ value: 0 });
  //const [translateCurrentX, setTranslateCurrentX] = useState(0);
  const ref = useRef();

  var translateCurrentX;

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
  }, []);

  useEffect(() => {
    drawGraph();
  }, [data]);

  const margin = ({ top: 20, right: 40, bottom: 30, left: 40 });

  data.sort((a, b) => a.timestamp - b.timestamp);

  var offset = 0,
    limit = 5,
    current_index = 5;

  // Useful datapoints (data variable included from external file)
  var chart_data = data.slice(offset, limit),
    date_extent = d3.extent(chart_data, function (d) { return d.timestamp; }),
    age_extent = d3.extent(chart_data, function (d) { return d.rx; }),
    now = new Date(2020, 12, 12),
    scale = 1.25,
    min_translate_x = -1000,
    max_translate_x;

  var x = d3.scaleUtc()
    .domain([new Date(date_extent[0]), new Date(date_extent[1])])
    .range([0, width])
  // old domain console.log(d3.extent(data, d => d.timestamp))
  // old range was 2000

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
    .attr("transform", `translate(0, ${height - margin.bottom})`)
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

    const drawLines = () => {
      nestedSvg.append("path")
      .datum(chart_data)
      .attr("fill", "none")
      .attr("stroke", "#6EE294")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("id", 'thisisline')
      .attr("d", line)

    nestedSvg.append("path")
      .datum(chart_data)
      .attr("fill", "none")
      .attr("stroke", "#5F72FF")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line2);
    }

    drawLines()

    svg.append('g')
      .call(yAxis);

    var referenceX = x.copy();

    const zoom = d3.zoom()
      .translateExtent([
        // Top Left corner
        [-10, height],
        // Bottom right corner
        [width * 2, 0]
      ])
      .scaleExtent([scale, scale])
      .on('zoom', function (event) {
        var current_domain = x.domain()
        var current_max = current_domain[1].getTime();
        translateCurrentX = event.transform.x;
        console.log('JA SAM TRANSLATECURRENTX', translateCurrentX);
        console.log('JA SAM MIN TRANSLATE X', min_translate_x)
        if(translateCurrentX < min_translate_x) {
          updateData();
          console.log('offset reached')
          drawLines()
          //setTranslateCurrentX(event.transform.x)
        }
        const transformByX = event.transform;
        const wheelTrigger = event.sourceEvent;
        transformByX.k = 1;
        if (wheelTrigger.deltaY) {
          if (wheelTrigger.deltaY === 100 && delta.value < 10) {
            setDelta(delta.value += 50)
            transformByX.x = delta.value
          } else if (wheelTrigger.deltaY === -100 && delta.value > -1000) {
            setDelta(delta.value -= 50)
            transformByX.x = delta.value
          }
        } else {
          setDelta(delta.value = transformByX.x)
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
        x = event.transform.rescaleX(referenceX)
      });

    nestedSvg.call(zoom);

    max_translate_x = width - x(new Date(now));

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
          .html("x:" + selectedData.timestamp + " - " + "y:" + selectedData.rx)
          .attr("x", x(selectedData.timestamp) + 15)
          .attr("y", y(selectedData.rx))
      })
      .on('mouseout', () => {
        focus.style("opacity", 0)
        focusText.style("opacity", 0)
      })

    var bisect = d3.bisector(d => d.timestamp).right;

  }

  function fetchData() {
    offset += 1; 
    current_index = offset * limit;
    return data.slice(current_index, current_index + limit);
  }

  function updateData() {
    if (chart_data.length < 50) {
      var new_data = fetchData();
      console.log('adding new data: ', new_data)
      chart_data = chart_data.concat(new_data);

      date_extent = d3.extent(chart_data, function (d) { return d.timestamp; });
      age_extent = d3.extent(chart_data, function (d) { return d.rx; });
      min_translate_x = translateCurrentX - x(new Date(date_extent[0]));
      console.log('jasam min',min_translate_x)
    } 
  };

  return (
    <>
      <div className="chart">
        <svg style={{ padding: '10px', position: 'relative' }} ref={ref} />
      </div>

      <button style={{marginTop: '20px', padding: '10px'}} onClick={() => {
        updateData();
        }}>
        KLIKNI ME
      </button>
    </>
  )
}

export default BarChart;

    // const tooltip = d3.select("body").append("div")
    //   .attr("class", "svg-tooltip")
    //   .style("position", "absolute")
    //   .style("visibility", "hidden")
    //   .text("Tooltip area");

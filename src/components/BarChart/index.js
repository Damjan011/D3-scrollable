import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';
import './style.css';

const BarChart = ({ height, data }) => {
  const [translateCurrentX, setTranslateCurrentX] = useState({ value: 0 });
  const [timeStamp, setTimestamp] = useState(0);
  const [rx, setRx] = useState(0);
  const [tx, setTx] = useState(0);
  const [width, setWidth] = useState(0);
  const [leftOffset, setLeftOffset] = useState(false);
  const [rightOffset, setRightOffset] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setWidth(parseInt(d3.select('#bandwidth-usage').style('width'), 10) - 40);
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
  }, [width]);
  useEffect(() => {

    console.log(width)
    drawGraph();
  }, [data, width]);

  const margin = ({ top: 10, right: 10, bottom: 0, left: 40 });
  data.sort((a, b) => a.timestamp - b.timestamp);
  var offset = 0,
    limit = 10,
    current_index = 10;

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
    .range([height - 30, margin.top])

  const line = d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.rx))

  const line2 = d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.tx))

  const xAxis = g => g
    .attr("transform", `translate(0, ${height - 30})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSize(0).tickPadding(5))

  const yAxis = g => g
    .attr("transform", `translate(${width - 20},0)`)
    .call(d3.axisRight(y).ticks(5).tickSize(0).tickPadding(5))
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("y", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .style("fill", "#ffffff")
      .text(data.y));

  const emptyAxis = g => g
    .attr("transform", `translate(${0},0)`)
    .call(d3.axisRight(y).tickSize(0));

  const xGridlines = d3.axisBottom(x).tickSize(-(height - 40)).tickFormat('').ticks(10);

  const yGridlines = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(5);

  const drawGraph = () => {
    const svg = d3.select(ref.current)
      .attr("viewBox", [0, 0, width, height])
      .attr('id', 'svg-main')
      .attr("cursor", "grab")

    const nestedSvg = svg.append("svg")
      .attr("viewBox", [width, height])
      .attr("id", "svg-inner")
      .attr("width", width - 20)
      .attr('class', 'svg-inner')

    nestedSvg.append('g')
      .call(xAxis)

    nestedSvg.append('g')
      .call(xGridlines)
      .attr('transform', `translate(0, ${height - 30})`)
      .attr('stroke-dasharray', '5 5')
      .attr('class', 'x-axis-grid')
      .attr('id', 'x-grid-lines')

    nestedSvg.append("g")
      .call(yGridlines)
      .attr('class', 'y-axis-grid');

    const drawLines = () => {
      nestedSvg.selectAll('path').remove()

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

    drawLines();

    svg.append('g')
      .call(yAxis);

    svg.append('g')
      .call(emptyAxis)
      .attr('class', 'empty-axis')

    var referenceX = x.copy();

    // Drag behavior, zoom should be disabled

    const zoom = d3.zoom()
      .translateExtent([
        // Top Left corner
        [0, height],
        // Bottom right corner
        [width * 2, 0]
      ])
      .scaleExtent([scale, scale])
      .on('zoom', function (event) {
        setTranslateCurrentX(translateCurrentX.value = event.transform.x);
        d3.select('#tooltip')
          .style("opacity", 0)
        x = event.transform.rescaleX(referenceX)

        if (translateCurrentX.value < min_translate_x) {
          updateData();
          console.log('offset reached')
          drawLines();
        }

        const transformByX = event.transform;
        transformByX.k = 1;
        d3.select(this)
          .selectAll('path')
          .attr("transform", `translate(${transformByX.x}, ${0})`)
        d3.select(this)
          .select('g:first-of-type')
          .attr("transform", `translate(${transformByX.x}, ${height - 30})`);
        d3.select(this)
          .select('#x-grid-lines')
          .attr("transform", `translate(${transformByX.x}, ${height - 30})`)
      });

    nestedSvg.call(zoom);

    max_translate_x = width - x(new Date(now));

    // Tooltip movement and reading data

    nestedSvg.append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', () => {
        d3.select('#tooltip')
          .style('opacity', 0)
      })
      .on('mousemove', (event) => {
        console.log(event)
        var x0 = x.invert(d3.pointer(event)[0]);
        var i = bisect(data, x0, 1);
        var selectedData = data[i];
        if (selectedData) {
          setTimestamp(selectedData.timestamp)
          setRx(selectedData.rx)
          setTx(selectedData.tx)
          d3.select('#tooltip')
            .style('position', 'absolute')
            .style('left', event.offsetX - 100 + 'px')
            .style('opacity', 1)
          console.log('jasam ofsetx s',event.offsetX)
          if(event.offsetX < 80) {
            d3.select('#tooltip')
            .style('left', event.offsetX + 'px')
            setLeftOffset(true)
          } else {
            setLeftOffset(false)
          }
          if (event.offsetX > width - 100) {
            d3.select('#tooltip')
            .style('left', event.offsetX - 200 + 'px')
            setRightOffset(true)
          } else {
            setRightOffset(false)
          }
        } else {
          d3.select('#tooltip')
            .style("opacity", 0)
        }
      })
      .on('mouseout', () => {
        d3.select('#tooltip')
          .style("opacity", 0)
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
      min_translate_x -= 1000;
    }
  };

  return (
    <>
      <div id="bandwidth-usage" className="ui-box" style={{ padding: '20px', overflow: 'visible' }}>
        <div className="ui-graph-labels">
          <div className="ui-graph-labels-inner">
            <div className="ui-graph-main-label">
              <p>Bandwidth Usage</p>
            </div>
            <div className="ui-graph-time-label">
              <p>1 hour</p>
            </div>
          </div>
          <div className="ui-graph-date-label">
            <p>24 Jan 2020</p>
          </div>
        </div>
        <div className="chart" style={{ position: 'relative' }}>
          <svg ref={ref} />
          <div id="tooltip" className="custom-tooltip" >
            <div className="ui-tooltip-top">
              <div className="ui-tooltip-label">
                <p>{timeStamp}</p>
              </div>
              <div className="ui-tooltip-values">
                {rx &&
                  <div className="ui-tooltip-green">
                    <p>{rx} Kb</p>
                  </div>
                }
                {tx &&
                  <div className="ui-tooltip-blue">
                    <p>{tx} Mb</p>
                  </div>
                }
              </div>
            </div>
            <div className="ui-tooltip-body">
              <div className="ui-tooltip-row">
                <div className="ui-tooltip-image-wrapper">
                  <img className="ui-tooltip-image" src='' alt="Tooltip user" />
                </div>
                <div className="ui-tooltip-row-label">
                  <p>Alice</p>
                </div>
              </div>
              <div className="ui-tooltip-row">
                <div className="ui-tooltip-image-wrapper">
                  <img className="ui-tooltip-image" src='' alt="Tooltip service" />
                </div>
                <div className="ui-tooltip-row-label">
                  <p>Netflix Streaming Services</p>
                </div>
              </div>
            </div>
            <div className={`ui-tooltip-line ${leftOffset ? 'left-offset' : ''} ${rightOffset ? 'right-offset' : ''}`}>
              <div className="ui-tooltip-line-bottom"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BarChart;

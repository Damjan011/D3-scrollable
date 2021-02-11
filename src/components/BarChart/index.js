import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import './style.css';

const BarChart = ({ width, height, data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      // .style("border", "1px solid black")
  }, []);

  useEffect(() => {
    charty();
  }, [data]);

  const hourFormatter = (tickTimestamp) => {
    let fullDate = new Date(tickTimestamp);
    let fullHours = fullDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    return fullHours;
  }

  const margin = ({top: 20, right: 30, bottom: 30, left: 40});

  // const x = d3.scaleUtc()
  //     .domain(d3.extent(data, d => d.timestamp))
  //     .range([margin.left, width - margin.right])
/* unscrollable */
  const x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.timestamp))
      .range([margin.left, 4000])

  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.rx)]).nice()
      .range([height - margin.bottom, margin.top])


/* scrollable*/
//   const x = d3.scaleTime()
//   .domain(d3.extent(data, d => d.timestamp))
//   .range([0, width])

// const y = d3.scaleLinear()
//   .domain(d3.extent(data, d => d.rx))
//   .range([height - 0])

  const line = d3.line()
    // .defined(d => !isNaN(d.value))
    .x(d => x(d.timestamp))
    .y(d => y(d.rx))

  const line2 = d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.tx))

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

  const yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y))
  // .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))



    function wheeled() {
        var event = event,
            dx = Math.abs(event.deltaX),
            dy = Math.abs(event.deltaY),
            t = d3.zoomTransform(this);
        if (dx > dy) {
            event.zoom.translateBy(event.canvas, -event.deltaX * 2 / t.k);
            event.updateView(d3.zoomTransform(this));
        } else if (dx < dy) {
            // Rescale
            let k = t.k * Math.pow(2, -event.deltaY * (event.deltaMode ? 120 : 1) / 500);
            event.zoom.scaleTo(event.canvas, k);
            // Retranslate
            let t2 = d3.zoomTransform(this), // reaccess the transform so that the zoom's extents apply
                p = event.mouse(this), // We're going to shift by a point
                w = event.scales.x.range()[1], // My scales reference
                dw = (w / t2.k) - (w / t.k), // The change in width
                x = dw / 2 - dw*(p[0] / w); // Account for shift by scale
            event.zoom.translateBy(event.canvas, -x, 0);
            event.updateView(d3.zoomTransform(this));
        }
        console.log('eeee')
        return event.preventDefault && event.preventDefault();
    }

  const charty = () => {
    const svg = d3.select(ref.current)
    .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .call(xAxis);
  
    svg.append("g")
        .call(yAxis);
  
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#6EE294")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#5F72FF")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line2);

        const zoom = d3.zoom()
        .translateExtent( [
          // Top Left corner
          [ -( width * 55 ), height ],
          // Bottom right corner
          [ width *55, 0 ]
        ] )
        .on( 'zoom', function (event) {
          const burgija = event.transform
          console.log(burgija)
          console.log(burgija.k)
            d3.select(this)
            .selectAll( 'path' )
            //.attr( 'transform', burgija )
            .attr("transform", burgija)

            d3.select(this)
            .select( 'g:first-of-type' )
            //.attr( 'transform', burgija )
            .attr("transform", `translate(${burgija.x}, ${370})`)
        } );

        svg.call(zoom)
        // .on('wheel.zoom', wheeled)

  }

  const draw = () => {
    const svg = d3.select(ref.current);
    var selection = svg.selectAll("rect").data(data);
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, height - 100]);

    selection
      .transition().duration(300)
      .attr("height", (d) => yScale(d))
      .attr("y", (d) => height - yScale(d))

    selection
      .enter()
      .append("rect")

      .attr("x", (d, i) => i * 45)
      .attr("y", (d) => height)
      .attr("width", 40)
      .attr("height", 0)
      .attr("fill", "orange")

      .transition().duration(300)
      .attr("height", (d) => yScale(d))
      .attr("y", (d) => height - yScale(d))

    selection
      .exit()
      .transition().duration(300)
      .attr("y", (d) => height)
      .attr("height", 0)
      .remove()
  }

  return (
    <div className="chart">
      <svg ref={ref}>

      </svg>
    </div>
  )
}

export default BarChart;

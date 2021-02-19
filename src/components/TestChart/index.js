// data.sort(function(a, b) {
//   return b.registered - a.registered;
// });

// var offset = 0,
//     limit = 10,
//     current_index = 10;

// // Useful datapoints (data variable included from external file)
// var chart_data = data.slice(offset, limit),
//     date_extent = d3.extent(chart_data, function(d) { return d.registered; }),
//     age_extent = d3.extent(chart_data, function(d) { return d.age; }),
//     now = new Date(2015, 8, 16),
//     scale = 1.25,
//     min_translate_x = 0,
//     max_translate_x;

// // Create scales
// var x_scale = d3.time.scale()
//                 .domain([new Date(date_extent[0]), new Date(date_extent[1])])
//                 .range([0, width]);

// var y_scale = d3.scale.linear()
//                 .domain([age_extent[0] - 5, age_extent[1] + 5])
//                 .range([height, 0]);

// // Axis generators
// var x_axis_generator = d3.svg.axis()
//                 .scale(x_scale)
//                 .outerTickSize(0)
//                 .orient('top');

// // Start adding to the viz
// var x_axis = viz.append('g')
//                 .classed('x axis', true)
//                 .call(x_axis_generator)
//                 .attr('transform', 'translate(0, ' + height + ')');

// var group = viz.append('g').classed('point-group', true),
//     circles = group.selectAll('.point')
//                 .data(chart_data)
//                 .enter()
//                 .append('circle')
//                 .classed('point', true)
//                 .attr({
//                   cx: function(d) { return x_scale(new Date(d.registered)); },
//                   cy: function(d) { return y_scale(d.age); },
//                   fill: function(d) { return d.color; },
//                   r: 4
//                 });

// // Zoom/Pan behavior
// var pan = d3.behavior.zoom()
//                 .x(x_scale)
//                 .scale(scale)
//                 .size([width, height])
//                 .scaleExtent([scale, scale])
//                 .on('zoom', function(e) {
//                   if (pan.translate()[0] > min_translate_x) {
//                     updateData();
//                     addNewPoints();
//                   }

//                   // Redraw any components defined by the x axis
//                   x_axis.call(x_axis_generator);
//                   circles.attr('cx', function(d) { 
//                     return x_scale(new Date(d.registered));
//                   });
//                 });

// viz.call(pan);

// // Now that we've scaled in, find the farthest point that
// // we'll allow users to pan forward in time (to the right)
// max_translate_x = width - x_scale(new Date(now));
// viz.call(pan.translate([max_translate_x, 0]).event); 

// /* Functions */

// // Fetches data from the global variable (this is where you would make an ajax call)
// function fetchData() {
//     offset += 1; current_index = offset * limit;
//     return data.slice(current_index, current_index + limit);
// }

// // Updates the chart_data and any variables the rely on it
// function updateData() {
//   if (chart_data.length < 50) {
//     var new_data = fetchData();
//     console.log('adding new data: ', new_data)
//     // Update the chart data
//     chart_data = chart_data.concat(new_data);

//     date_extent = d3.extent(chart_data, function(d) { return d.registered; });
//     age_extent = d3.extent(chart_data, function(d) { return d.age; });
//     min_translate_x = pan.translate()[0] - x_scale(new Date(date_extent[0]));
      
//   } else console.warn('No more data exists. External dataset only holds 50 items.');
// };

// // Binds the current data again and adds any new points to the selection
// function addNewPoints() {
//   // Add new points
//   group.selectAll('circle.point')
//       .data(chart_data)
//       .enter()
//       .append('circle')
//       .classed('point', true)
//       .attr({
//         cx: function(d) { return x_scale(new Date(d.registered)); },
//         cy: function(d) { return y_scale(d.age); },
//         fill: function(d) { return d.color; },
//         r: 4
//       });
  
//   // Update selection
//   circles = group.selectAll('circle.point');
// };

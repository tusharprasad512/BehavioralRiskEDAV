
var originalData = [
      { year: 2011, value: 0.27417966964096 },
      { year: 2012, value: 0.277588524071185 },
      { year: 2013, value: 0.283089469728565 },
      { year: 2014, value: 0.289731023614721 },
      { year: 2015, value: 0.289869512829641 },
      { year: 2016, value: 0.294600385690368 },
      { year: 2017, value: 0.302801368122764 },
      { year: 2018, value: 0.309843162581622 },
      { year: 2019, value: 0.315949620307404 },
      { year: 2020, value: 0.318412412764087 },
      { year: 2021, value: 0.331196701606728 }
    ];

    var removedYears = []; // Track the removed years separately
    var data = originalData.slice(); // Create a copy of the original data

    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", 800)
                .attr("height", 600)
                .style("background-color", "lightgray");

    var margin = { top: 50, right: 50, bottom: 50, left: 75 };
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    var xScale = d3.scaleLinear()
                   .domain([d3.min(data, function(d) { return d.year; }), d3.max(data, function(d) { return d.year; })])
                   .range([margin.left, width]);

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) { return d.value; })])
                   .range([height, margin.top]);

    var line = d3.line()
                 .x(function(d) { return xScale(d.year); })
                 .y(function(d) { return yScale(d.value); });

    var path = svg.append("path")
                  .datum(data)
                  .attr("fill", "none")
                  .attr("stroke", "steelblue")
                  .attr("stroke-width", 2)
                  .attr("d", line);

    var circles = svg.selectAll("circle")
                     .data(data)
                     .enter()
                     .append("circle")
                     .attr("cx", function(d) { return xScale(d.year); })
                     .attr("cy", function(d) { return yScale(d.value); })
                     .attr("r", 5)
                     .attr("fill", "steelblue");

    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

    svg.append("g")
       .attr("transform", "translate(" + margin.left + ",0)")
       .call(d3.axisLeft(yScale));

    svg.append("text")
     .attr("x", width / 2)
     .attr("y", height + margin.top) // Adjust the position as needed
     .style("text-anchor", "middle")
     .text("Year");

    svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", -height / 2)
     .attr("y", margin.left - 50) // Adjust the position as needed
     .style("text-anchor", "middle")
     .text("Percentages");

    var tooltip = d3.select("#tooltip");

  circles
    .on("mouseover", function(event, d) {
        tooltip.transition()
               .duration(200)
               .style("opacity", .9);
        tooltip.html("Year: " + d.year + "<br/>Value: " + d.value.toFixed(3))
               .style("left", (event.pageX) + "px")
               .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
               .duration(500)
               .style("opacity", 0);
    });

    var addButton = d3.select("#addButton");
    addButton.on("click", function() {
      if (removedYears.length > 0) {
        var yearToAdd = removedYears.pop();
        var index = originalData.findIndex(function(d) {
          return d.year === yearToAdd;
        });

        data.push(originalData[index]);

        path.datum(data)
            .attr("d", line);

        var circles = svg.selectAll("circle")
                         .data(data);

        circles.enter()
               .append("circle")
               .attr("r", 5)
               .attr("fill", "steelblue")
               .merge(circles)
               .attr("cx", function(d) { return xScale(d.year); })
               .attr("cy", function(d) { return yScale(d.value); });

        circles.on("mouseover", function(event, d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html("Year: " + d.year + "<br/>Value: " + d.value.toFixed(3))
                   .style("left", (event.pageX) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
        });

        circles.exit().remove();
      } else {
        alert("No more years to add");
      }
    });

    var removeButton = d3.select("#removeButton");
removeButton.on("click", function() {
  if (data.length > 1) {
    var removedYear = data[data.length - 1].year;
    removedYears.push(removedYear);

    data.pop();

    path.datum(data)
        .attr("d", line);

    var circles = svg.selectAll("circle")
                     .data(data);

    circles.exit().remove();

    circles.attr("cx", function(d) { return xScale(d.year); })
           .attr("cy", function(d) { return yScale(d.value); });
  } else {
    alert("No more years to remove");
  }
});

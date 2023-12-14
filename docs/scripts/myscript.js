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

    var removedYears = [];
    var data = originalData.slice();

    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", 800)
                .attr("height", 600)
                .style("background-color", "lightgray");

    var margin = { top: 50, right: 50, bottom: 50, left: 75 };
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    var xScale = d3.scaleLinear()
                   .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
                   .range([margin.left, width]);

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, d => d.value)])
                   .range([height, margin.top]);

    var line = d3.line()
                 .x(d => xScale(d.year))
                 .y(d => yScale(d.value));

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
                     .attr("r", 5)
                     .attr("fill", "steelblue")
                     .attr("cx", d => xScale(d.year))
                     .attr("cy", d => yScale(d.value))
                     .on("mouseover", handleMouseOver)
                     .on("mouseout", handleMouseOut);

    svg.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(yScale));

    svg.append("text")
       .attr("x", width / 2)
       .attr("y", height + margin.top)
       .style("text-anchor", "middle")
       .text("Year");

    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -height / 2)
       .attr("y", margin.left - 50)
       .style("text-anchor", "middle")
       .text("Percentages");

    var tooltip = d3.select("#tooltip");

    var addButton = d3.select("#addButton");
    addButton.on("click", handleAddButtonClick);

    var removeButton = d3.select("#removeButton");
removeButton.on("click", handleRemoveButtonClick);

    function handleMouseOver(event, d) {
      d3.select(this)
        .attr("r", 8)
        .attr("fill", "orange");

      tooltip.html(`Year: ${d.year}<br>Value: ${d.value.toFixed(3)}`)
             .style("left", event.pageX + "px")
             .style("top", event.pageY + "px")
             .style("opacity", 0.9);
    }

    function handleMouseOut() {
      d3.select(this)
        .attr("r", 5)
        .attr("fill", "steelblue");

      tooltip.style("opacity", 0);
    }

    function handleAddButtonClick() {
  if (removedYears.length > 0) {
    var yearToAdd = removedYears.pop();
    var yearData = originalData.find(d => d.year === yearToAdd);
    data.push(yearData);

    updateChart();
  }
  else {
        alert("No more years to add");
      }
}

    function handleRemoveButtonClick() {
      if (data.length > 1) {
        var lastYear = data[data.length - 1];
        removedYears.push(lastYear.year);

        data.pop();

        updateChart();
      }
      else {
    alert("No more years to remove");
  }
    }

   function updateChart() {
  xScale.domain([d3.min(data, d => d.year), d3.max(data, d => d.year)]);
  yScale.domain([0, d3.max(data, d => d.value)]);

  var updatedPath = svg.select("path")
                       .datum(data)
                       .attr("d", line);

  var updatedCircles = svg.selectAll("circle")
                          .data(data, d => d.year);

  updatedCircles.exit().remove();

  updatedCircles.enter()
                 .append("circle")
                 .attr("r", 5)
                 .attr("fill", "steelblue")
                 .merge(updatedCircles)
                 .transition()
                 .attr("cx", d => xScale(d.year))
                 .attr("cy", d => yScale(d.value));

  svg.select(".x-axis")
     .transition()
     .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

  svg.select(".y-axis")
     .transition()
     .call(d3.axisLeft(yScale));

  // Add event listeners for tooltips on all circles
  updatedCircles.on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);

}

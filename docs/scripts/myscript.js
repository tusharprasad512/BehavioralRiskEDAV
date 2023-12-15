var originalData = [
      { year: 2011, value: 0.2741797, value1: null, value2: 0.2543301 },
      { year: 2012, value: 0.2775885, value1: null, value2: 0.2303598 },
      { year: 2013, value: 0.2830895, value1: null, value2: 0.2611416 },
      { year: 2014, value: 0.2897310, value1: null, value2: 0.2333953 },
      { year: 2015, value: 0.2898695, value1: null, value2: 0.2581531 },
      { year: 2016, value: 0.2946004, value1: null, value2: 0.2406533 },
      { year: 2017, value: 0.3028014, value1: 0.3623483, value2: 0.2671982 },
      { year: 2018, value: 0.3098432, value1: null, value2: 0.2408115 },
      { year: 2019, value: 0.3159496, value1: 0.3938638, value2: 0.2612754 },
      { year: 2020, value: 0.3184124, value1: null, value2: 0.2320348 },
      { year: 2021, value: 0.3311967, value1: 0.4008818, value2: 0.2370788 }
    ];

    var removedYears = [];
    var data = originalData.slice();

    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", 800)
                .attr("height", 600)
                .style("background-color", "aliceblue");

    var margin = { top: 50, right: 50, bottom: 50, left: 75 };
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;



    var xScale = d3.scaleLinear()
                   .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
                   .range([margin.left, width]);

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, d => Math.max(d.value, d.value1 || 0, d.value2 || 0))])
                   .range([height, margin.top]);

    // Line generator for value
    var line = d3.line()
                 .x(d => xScale(d.year))
                 .y(d => yScale(d.value));

    // Line generator for value1, skipping null values
    var line1 = d3.line()
                 .defined(d => d.value1 != null)
                 .x(d => xScale(d.year))
                 .y(d => yScale(d.value1));

    // Line generator for value2
    var line2 = d3.line()
                 .x(d => xScale(d.year))
                 .y(d => yScale(d.value2));

// Path for 'value'
var path = svg.append("path")
              .datum(data)
              .attr("class", "line value")
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-width", 2)
              .attr("d", line);

// Path for 'value1', initially hidden
var path1 = svg.append("path")
               .datum(data.filter(d => d.value1 != null)) // Filter out null values
               .attr("class", "line value1")
               .attr("fill", "none")
               .attr("stroke", "green")
               .attr("stroke-width", 2)
               .attr("d", line1)
               .style("display", "none"); // Initially hidden

// Path for 'value2'
var path2 = svg.append("path")
               .datum(data)
               .attr("class", "line value2")
               .attr("fill", "none")
               .attr("stroke", "red")
               .attr("stroke-width", 2)
               .attr("d", line2)
               .style("display", "none"); // Initially hidden


    var tooltip = d3.select("#tooltip");

    var addButton = d3.select("#addButton");
    addButton.on("click", handleAddButtonClick);

    var removeButton = d3.select("#removeButton");
    removeButton.on("click", handleRemoveButtonClick);

    var seriesSelector = d3.select("#seriesSelector");
    seriesSelector.on("change", handleSeriesChange);

    // Create x-axis
    svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", `translate(0, ${height})`)
       .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

    // Create y-axis
    var yAxis = d3.axisLeft(yScale)
              .tickFormat(d => `${(d * 100).toFixed(0)}%`);

// When creating the y-axis:
svg.append("g")
   .attr("class", "y-axis")
   .attr("transform", `translate(${margin.left}, 0)`)
   .call(yAxis);



    svg.append("text")
       .attr("x", width / 2 + 40)
       .attr("y", height + margin.top)
       .style("text-anchor", "middle")
       .text("Year");

    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -height / 2 - 20)
       .attr("y", margin.left - 50)
       .style("text-anchor", "middle")
       .text("Percentages");


    function handleMouseOver(event, d) {
      var seriesValue = seriesSelector.property("value");
      var value = d[seriesValue] * 100;

      d3.select(this)
        .attr("r", 8)
        .attr("fill", "orange");

      tooltip.html(`Year: ${d.year}<br>Value: ${value.toFixed(1)}%`)
             .style("left", event.pageX + "px")
             .style("top", event.pageY + "px")
             .style("opacity", 0.9);
    }


    function handleMouseOut() {
      d3.select(this)
        .attr("r", 5)
        .attr("fill", "black");

      tooltip.style("opacity", 0);
    }

    function handleAddButtonClick() {
      if (removedYears.length > 0) {
        var yearToAdd = removedYears.pop();
        var yearData = originalData.find(d => d.year === yearToAdd);
        data.push(yearData);
        updateChart(seriesSelector.property("value"));
      } else {
        alert("No more years to add");
      }
    }

    function handleRemoveButtonClick() {
      if (data.length > 1) {
        var lastYear = data[data.length - 1];
        removedYears.push(lastYear.year);
        data.pop();
        updateChart(seriesSelector.property("value"));
      } else {
        alert("No more years to remove");
      }
    }

    function handleSeriesChange() {
      updateChart(seriesSelector.property("value"));
    }

    function updateChart(selectedSeries) {
      // Update yScale domain based on selected series
      yScale.domain([0, d3.max(data, d => d[selectedSeries] || 0)]);

      // Select the appropriate line generator based on the selected series
     // Update and display the appropriate path
  svg.selectAll(".line").style("display", "none"); // Hide all paths
  if (selectedSeries === "value1") {
    path1.datum(data.filter(d => d.value1 != null))
         .transition()
         .attr("d", line1)
         .style("display", null); // Show path for value1
  } else if (selectedSeries === "value2") {
    path2.datum(data)
         .transition()
         .attr("d", line2)
         .style("display", null); // Show path for value2
  } else {
    path.datum(data)
        .transition()
        .attr("d", line)
        .style("display", null); // Show path for value
  }

          // Update circles for selected series
      var circleData = selectedSeries === "value1" ? data.filter(d => d.value1 != null) : data;
      var updatedCircles = svg.selectAll("circle")
                              .data(circleData, d => d.year);

      // Remove old circles
      updatedCircles.exit().remove();

      // Add new circles and update existing ones
      updatedCircles.enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("fill", "black")
                    .merge(updatedCircles)
                    .transition()
                    .attr("cx", d => xScale(d.year))
                    .attr("cy", d => yScale(d[selectedSeries] || 0));

      // Reapply tooltip event listeners
      svg.selectAll("circle")
         .on("mouseover", handleMouseOver)
         .on("mouseout", handleMouseOut);

  svg.select(".x-axis")
       .transition()
       .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));


    // When updating the y-axis in the updateChart function:
    svg.select(".y-axis")
       .transition()
       .call(yAxis);
    }

    // Initial rendering of the chart
    updateChart("value");

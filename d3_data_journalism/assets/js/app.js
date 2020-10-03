// make the graph responsive for tooltips
function makeResponsive() {
  // define svg area dimensions
  var svgWidth = 960;
  var svgHeight = 500;

  // define the margins
  var chartMargin = {
    top: 20,
    bottom: 60,
    left: 100,
    right: 50,
  };

  // define the dimensions of the chart area
  var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

  // select the body and append svg to it
  var svg = d3
    .select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // append a group to the svg and shift (transform and translate)
  var chartGroup = svg
    .append("g")
    .attr("transform", `translate (${chartMargin.left}, ${chartMargin.top})`);

  // load in the csv data
  d3.csv("./assets/data/data.csv").then(function (healthData) {
    console.log(healthData);

    //cast the data into integers
    healthData.forEach(function (d) {
      d.smokes = +d.smokes;
      d.smokesLow = +d.smokesLow;
      d.smokeshigh = +d.smokesHigh;
      d.age = +d.age;
    });

    // configure a linear scale for the xaxis (age)
    var xLinearScale = d3
      .scaleLinear()
      .domain([30, d3.max(healthData, (d) => d.age)])
      .range([0, chartWidth]);

    // create a linear scale for for the vertical axis (smokers)
    var yLinearScale = d3
      .scaleLinear()
      .domain([8, d3.max(healthData, (d) => d.smokes)])
      .range([chartHeight, 0]);

    // create functions that pass the scales to help create the chart axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    //append the svg group elements to the chartGroup area
    chartGroup.append("g").call(leftAxis);

    chartGroup
      .append("g")
      .attr("transform", `translate (0, ${chartHeight})`)
      .call(bottomAxis);

    // create the scatter plot
    var circlesGroup = chartGroup
      .selectAll("#scatter")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xLinearScale(d.age);
      })
      .attr("cy", function (d) {
        return yLinearScale(d.smokes);
      })
      .attr("r", 15)
      .attr("stroke", "grey")
      .attr("stroke-width", "2")
      .style("fill", "lightblue");

    // create axis labels
    // xaxis label
    chartGroup
      .append("text")
      .attr(
        "transform",
        `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`
      )
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "black")
      .text("Age (Years)");
    // yaxis label
    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", 0 - chartHeight / 2)
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .text("Smokers");

    // add texts to circles
    circlesGroup
      .append("text")
      //We return the abbreviation to .text, which makes the text the abbreviation.
      .text(function (d) {
        return d.abbr;
      })
      //Now place the text using our scale.
      .attr("dx", function (d) {
        return xLinearScale(d["age"]);
      })
      .attr("dy", function (d) {
        // When the size of the text is the radius,
        // adding a third of the radius to the height
        // pushes it into the middle of the circle.
        return yLinearScale(d["smokes"]) + 10 / 2.5;
      })
      .attr("font-size", 15)
      .attr("stroke", "grey")
      .attr("class", "stateText");

    // append a div to the body to create tooltips and assign it to a class
    // var toolTip = d3.select("body").append("div").attr("class", "tooltip");

    // add an onmouseover event to display the tooltip
    circlesGroup
      .on("mouseover", function (d, i) {
        toolTip.style("display", "block");
        toolTip
          .html(
            `<strong>${d.state}</strong> <hr> <h1> Age: ${d.age} </h1> <h1> Smokes: ${d.smokes} </h1>`
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })
      // Step 3: Add an onmouseout event to make the tooltip invisible
      .on("mouseout", function () {
        toolTip.style("display", "none");
      });
  });
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);

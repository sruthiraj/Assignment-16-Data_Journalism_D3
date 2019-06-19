// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv")
  .then(function (dData) {
    var svgW = 960;
    var svgH = 500;
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    var circleData = dData;
    var x = dData.map(data => Number(data.poverty));
    var y = dData.map(data => Number(data.healthcare));
    var ytext = "Lacks Healthcare(%)";
    var xtext = "In Poverty(%)";

    bubblePlot(x, y, xtext, ytext, circleData, "#scatter", svgW, svgH);
  });

function bubblePlot(x, y, xtext, ytext, circleData, thetag, svgWidth, svgHeight) {
  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select(thetag)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data


  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(x)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([2, d3.max(y)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Create Circles
  // ==============================

  var circlesGroup = chartGroup.selectAll("circle")
    .data(circleData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(Number(d.poverty)))
    .attr("cy", d => yLinearScale(Number(d.healthcare)))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

  var textGroup = chartGroup.selectAll("text")
    .data(circleData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(Number(d.poverty)) - 7.5)
    .attr("y", d => yLinearScale(Number(d.healthcare)) + 7.5)
    .text(d => (d.abbr))
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "blue")
    .attr("text-anchor", "middle");

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.select("body").append("div")
    .attr("class", "tooltip");

  // Step 2: Create "mouseover" event listener to display tooltip
  circlesGroup.on("click", function (d, i) {
    toolTip.style("display", "block");
    toolTip.html(`${circleData[i]}<br>Poverty: ${x[i]}<br>Healthcare: ${y[i]}`)
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY + "px");
  })
    // Step 3: Add an onmouseout event to make the tooltip invisible
    .on("mouseout", function () {
      toolTip.style("display", "none");
    });


  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text(ytext);

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text(xtext);

}
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const svgWidth = 800, svgHeight = 600;
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const container = d3.select('#chart');

d3.csv('./data/2019.csv').then(csvData => {
  const top10 = csvData.sort((a, b) => a["Overall rank"] - b["Overall rank"]).slice(0, 10);
  console.log(top10);

  const xScale = d3.scaleBand()
    .domain(top10.map(d => d["Country or region"]))
    .range([0, width])
    .padding(0.1);

  var yScale = d3.scaleLinear()
    .domain([d3.min(top10, d => Math.floor(d.Score)), d3.max(top10, d => Math.ceil(d.Score))])
    .range([height, 0]);

  const svg = container.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  chart.append('g')
    .call(d3.axisLeft(yScale));

  const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background-color', 'rgba(0, 0, 0, 0.75)')
    .style('color', 'white')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('font', '12px sans-serif');

  const mouseover = function (event, d) {
    tooltip.style("visibility", "visible");
    tooltip.html(`<strong>${d["Country or region"]}</strong><br/>Score: ${d.Score}`);
  }

  const mousemove = function (event, d) {
    tooltip.style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px");
  }

  const mouseleave = function (event, d) {
    tooltip.style("visibility", "hidden");
  }

  chart.selectAll()
    .data(top10)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d["Country or region"]))
    .attr('y', d => yScale(d.Score))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d.Score))
    .attr('fill', 'steelblue')
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  chart.append('text')
    .attr('x', -(height / 2))
    .attr('y', -30)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Score');

  chart.append('text')
    .attr('x', width / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .text('Top 10 Happiest Countries in 2019');

  chart.append('text')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .text('Country');

  const colour = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(top10.map(d => d["Country or region"]));

  chart.selectAll(".bar")
    .attr("fill", d => colour(d["Country or region"]));
});


const container = d3.select('#chart');

d3.csv('./data/2019.csv').then(csvData => {
  const top10 = csvData.sort((a, b) => a["Overall rank"] - b["Overall rank"]).slice(0, 10);
  console.log(top10);
});

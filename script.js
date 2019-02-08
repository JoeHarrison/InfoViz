console.log('test')
d3.select("body").style("background-color", "black");
d3.csv("./data/meteo.csv").then(function(data) {
  console.log(data[0]);
});

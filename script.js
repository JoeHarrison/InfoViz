let data_location = "https://joeharrison.github.io/InfoViz/data/meteo.csv"
let ymdt = {};

d3.csv(data_location).then(function(data) {
    for (let key in data){
        let value = data[key];

        let year = parseInt(value["year"]);

        if (isNaN(year)){
            continue
        }

        let month = parseInt(value["month"]);
        let day = parseInt(value["day"]);
        let temperature = value["temperature"];

        if (!ymdt[year]){
            ymdt[year] = {};
        }
        if (!ymdt[year][month]){
            ymdt[year][month] = {};
        }
        if (!ymdt[year][month][day]){
            ymdt[year][month][day] = [];
        }

        ymdt[year][month][day].push(temperature);

    }
});

console.log(ymdt.map((s)=>s));

let svg = d3.select('svg');
let chart = svg.append('g');
let yScale = d3.scaleLinear().range([100,0]).domain([0,140]);
chart.append('g').call(d3.axisLeft(yScale));

let xScale = d3.scaleBand().range([0,100]).domain([])

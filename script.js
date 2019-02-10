let data_location = "https://joeharrison.github.io/InfoViz/data/meteo.csv"
let ymdt = {};
let current_index = 0;

let months = {1:"January", 2:"February", 3:"March", 4:"April", 5:"May", 6:"June", 7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12:"December"};
let years = [2011,2012,2013,2014,2015];

let margin = 50;
let height = 500 - 2*margin;
let width = 1000 - 2*margin;

let svg = d3.select('svg');

let chart = svg.append('g').attr('transform', 'translate(50, 50)');

let yAxis = d3.scaleLinear().range([height,0]);


let xAxis = d3.scaleBand().range([0,width]).domain(Object.keys(months).map(function(key){ return months[key]})).padding(0.1);
chart.append('g').attr('transform', 'translate(0, 400)').call(d3.axisBottom(xAxis));

d3.select("body").on("keydown", function(event){
    console.log(current_index);
    console.log(years[current_index]);
    keyCode = d3.event.keyCode;
    if(keyCode == 39){
        if(current_index + 1 == years.length){
            current_index = 0;
        }
        else{
            current_index = current_index + 1;
        }
    }
    if(keyCode == 37){
        if(current_index - 1 < 0){
            current_index = years.length - 1;
        }
        else{
            current_index = current_index - 1;
        }
    }
    drawYear(years[current_index]);
});

function drawYear(year){
    chart.selectAll('rect').remove();
    chart.selectAll('text').remove();
    chart.select('.yAxis').remove();

    let min = Math.min.apply(null,Object.keys(months).map((d) => ymdt[year][d]["minTemperature"])) - 10;
    let max = Math.max.apply(null,Object.keys(months).map((d) => ymdt[year][d]["maxTemperature"])) + 10;

    yAxis.domain([min - 10,max + 10]);
    chart.append('g').attr('class', 'yAxis').call(d3.axisLeft(yAxis));
    chart.selectAll().data(Object.keys(months)).enter().append('rect').attr('x',(d) => xAxis(months[d])).attr('y', (d) => yAxis(ymdt[year][d]["totalTemperature"] / ymdt[year][d]["totalDays"]))
    .attr('height', (d) => height - yAxis(ymdt[year][d]["totalTemperature"] / ymdt[year][d]["totalDays"])).attr('width', xAxis.bandwidth());
    chart.selectAll().data(Object.keys(months)).enter().append('text').attr('x',(d) => xAxis(months[d])).attr('y', (d) => yAxis(ymdt[year][d]["totalTemperature"] / ymdt[year][d]["totalDays"])).attr("text-anchor", "middle").text((d) => yAxis(ymdt[year][d]["totalTemperature"] / ymdt[year][d]["totalDays"]));
}

d3.csv(data_location).then(function(data) {
    for (let key in data){
        let value = data[key];

        let year = parseInt(value["year"]);

        if (isNaN(year)){
            continue
        }

        let month = parseInt(value["month"]);
        let day = parseInt(value["day"]);

        let temperature = parseFloat(value["temperature"]);

        if (!ymdt[year]){
            ymdt[year] = {};
        }
        if (!ymdt[year][month]){
            ymdt[year][month] = {"totalTemperature":0, "totalDays":0, "minTemperature":Number.MAX_VALUE, "maxTemperature":Number.MIN_VALUE};
        }

        ymdt[year][month]["totalTemperature"] = ymdt[year][month]["totalTemperature"] + temperature;
        ymdt[year][month]["totalDays"] = ymdt[year][month]["totalDays"] + 1;
        if(temperature>ymdt[year][month]["maxTemperature"]){
            ymdt[year][month]["maxTemperature"] = temperature
        }
        if(temperature<ymdt[year][month]["minTemperature"]){
            ymdt[year][month]["minTemperature"] = temperature
        }
    }
    drawYear(years[current_index]);
});

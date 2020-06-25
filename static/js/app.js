// Fetch JSON data and console log it
    var data = d3.json("./Resources/Clean_US_Mass_Shootings_Data_1982_2019.json").then((data) => {

    // Reduce years to return a list of years for dropdown
    const getDataByYear = data =>
        data.reduce((acc, item) => {
            acc[item.year] = { item };
            return acc;
        }, {});
    const dataByYear = getDataByYear(data);
    // console.log("dataByYear", dataByYear);

    // Looping through years dataset and putting the key values in the dropdown
    Object.keys(dataByYear).forEach(key => d3.select('#selDataset').append("option").text(key));
 
    // On dropdown selection change, update information
    d3.selectAll("#selDataset").on("change", collectData);
   
    // Filter data to match selected value within year
    function filterCases(caseObject) {
        return d3.select('#selDataset').property("value") == caseObject.year;
    }
    
    // Update the content of the "Summary of Shootings" section
    function updateSummary(filteredData) {
        // clear out the summary area
        var div_shootings_data = d3.select('#case-summary');
        div_shootings_data.html("");
        console.log(filteredData);
        Object.entries(filteredData).forEach( d => {
            Object.entries(d).forEach(( [key, value] ) => {
                Object.entries(value).forEach(( [k, v] ) => {
                    var row = div_shootings_data.append("tr");
                    var cell = row.append("td");
                    if (k != 0) {
                        cell.text(`${k}: ${v}`);
                    };
                })
            div_shootings_data.append("p");
            })
        });
    }

    // Extract only the relevant data from the year array
    function summarizeData(data) {
        cleanedData = [];
        data.forEach((d) => {
            cleanedData.push( {
                "Case Name": d.case, 
                "City, State": d.city_state, 
                "Total Victims": d.total_victims} 
            );
        });
        return cleanedData;
    }
     
    // Assign the value of the dropdown menu option to a variable
    function collectData() {
        pieChart(data);
        var filteredYear = data.filter(filterCases);
        console.log("filteredYear", filteredYear);
        let summarizedData = summarizeData(filteredYear);
        updateSummary(summarizedData);
        updateBarChart(filteredYear[0]);
        // updateMap(filteredYear[0]);
    };

    function pieChart(data) {
        const race = data.map(d => d.race);
        var total = race.length;
        var black = 0;
        var white = 0;
        var asian = 0;
        var native = 0;
        var latino = 0;
        var other = 0;
        for (var i = 0; i < race.length; i++) {
            if (race[i] == "Black") {
                black++;
            }
            else if (race[i] == "White"){
                white++;
            }
            else if (race[i] == "Asian"){
                asian++;
            }
            else if (race[i] == "Latino"){
                latino++;
            }
            else if (race[i] == "Native American"){
                native++;
            }
            else if(race[i] == "Other\/Unknown"){
                other++;
            }
        }
        // var totalCheck = black + white + asian + latino + native + other;
        // console.log("total: \n", totalCheck);
        // console.log(black);
        // console.log(white);
        // console.log(asian);
        // console.log(latino);
        // console.log(native);
        // console.log(other);
        var percentBlack = (black/total)*100;
        var percentWhite = (white/total)*100;
        var percentAsian = (asian/total)*100;
        var percentLatino = (latino/total)*100;
        var percentNative = (native/total)*100;
        var percentOther = (other/total)*100;
        // console.log(percentBlack);
        var percentTotal = percentBlack + percentWhite + percentAsian + percentLatino + percentNative + percentOther;
        console.log("total: \n", percentTotal)
        
        var pieData = [{
            values: [percentBlack, percentWhite, percentAsian, percentLatino, percentNative, percentOther],
            labels: ["Black", "White", "Asian", "Latino", "Native American", "Other"],
            type: 'pie'
        }];
        
        var layout2 = {
        height: 400,
        width: 500
      };
      
      Plotly.newPlot('pie', pieData, layout2);
    };
    });

// Build charts using the filtered datasets

// Create a horizontal bar chart with victims information.
// Array containing all traces
    function updateBarChart(data) {
        var injuredTrace = {
            x: [data.case],
            y: [data.injured],
            name: 'Injured',
            type: "bar",
        };
        var fatalitiesTrace = {
            x: [data.case],
            y: [data.fatalities],
            name: 'Fatalities',
            type: "bar",
        };
        var data1 = [injuredTrace, fatalitiesTrace];
        var layout1 = {
            barmode: 'stack',
            title: "Vicitim Summary: Injured VS. Fatalities"
        };
        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot('bar1', data1, layout1);
    }

// Create Map with filtered Year data
    // function updateMap(data) {
        var myMap = L.map("map", {
            center: [15.5994, -28.6731],
            zoom: 3
          });

          L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets-basic",
            accessToken: API_KEY
          }).addTo(myMap);
    // }
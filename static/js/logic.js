const API_BASE_URL = "https://script.google.com/macros/s/AKfycbyrtWLsl5f1PXdvarZYoh2GyR_UYKN05k4q9hbtLpP9FHMsjEU/exec?action=get&resource=";

// Initializing map tile, view tile, and geojson tile
function initializeMap() {
    var map = L.map("map", {
        center: [39.5, -98.35],
        zoom: 4,
        attributionControl: false,
    });

    // Adding tile layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    }).addTo(map);

    // adding markers
    /*d3.csv(HIKE_DATA_FILE_NAME, function(dataset){
        // console.log(dataset);

        // make markers for each hike location, then add a popup to the marker
        for (let i = 0; i < dataset.length; i++){
            lat = dataset[i].Lat;
            lon = dataset[i].Lon;
            let m = L.marker([lat,lon]).addTo(map);
            let p = L.popup({keepInView: true})
                        .setLatLng([dataset[i].Lat,dataset[i].Lon])
                        .setContent('<h3>' + dataset[i].Hike + ', ' + dataset[i].Park + '</h3>' + 
                                    '<h6 id="popText">' + 'Distance: '+ formatNumber(dataset[i].Distance) + '</h6>' +
                                    '<h6 id="popText">' + 'Elevation: '+ formatNumber(dataset[i].Elevation_Gain) + '</h6>' +
                                    "<a href='" + dataset[i].Url + "'>Visit the Hike Here!</a>"
            );
            m.bindPopup(p);
        }
        
    });*/
//    return map
}

// function graphScatter(state = 'All'){
//     d3.csv(HIKE_DATA_FILE_NAME, function(dataset){
//         if(state == 'All'){
//             dataset = dataset;
//             let x_axis = [];
//             let y_axis = [];
//             var myDiv = document.getElementById("scatter");
//             for (let i = 0; i < dataset.length; i++){
//                 x_axis.push(parseFloat(dataset[i].Distance))
//                 y_axis.push(parseFloat(dataset[i].Elevation_Gain))
//             };
//             var trace1 = {
//                 x: x_axis,
//                 y: y_axis,
//                 mode: 'markers',
//                 type: 'scatter',
//             };
//             var data = [trace1]
//             var layout = {
//                 autosize: false,
//                 height: myDiv.clientHeight,
//                 width: myDiv.clientWidth,
//                 margin: {
//                     l: 50,
//                     r: 45,
//                     b: 35,
//                     t: 40,
//                     pad: 4
//                 },
//                 title: 'Miles Hiked vs Feet Hiked',
//                 paper_bgcolor: '#648ca6',
//             };
//             Plotly.newPlot('scatter', data, layout);
//         } else{
//             stateDF = dataset.filter(d => d.State == state);
//             otherDF = dataset.filter(d => d.State !== state);
//             var myDiv = document.getElementById("scatter");

//             let x_axis_state = [];
//             let y_axis_state = [];
//             let x_axis_other = [];
//             let y_axis_other = [];

//             for (let i = 0; i < stateDF.length; i++){
//                 x_axis_state.push(parseFloat(stateDF[i].Distance));
//                 y_axis_state.push(parseFloat(stateDF[i].Elevation_Gain));
//             };
            
//             for (let i = 0; i < otherDF.length; i++){
//                 x_axis_other.push(parseFloat(otherDF[i].Distance));
//                 y_axis_other.push(parseFloat(otherDF[i].Elevation_Gain));
//             };
//             var traceState = {
//                 x: x_axis_state,
//                 y: y_axis_state,
//                 mode: 'markers',
//                 type: 'scatter',
//                 name: `${state}`
//             };
//             var traceOther = {
//                 x: x_axis_other,
//                 y: y_axis_other,
//                 mode: 'markers',
//                 type: 'scatter',
//                 name: 'Other State'
//             };
//             data = [traceOther, traceState];
//             var layout = {
//                 autosize: false,
//                 height: myDiv.clientHeight,
//                 width: myDiv.clientWidth,
//                 margin: {
//                     l: 50,
//                     r: 45,
//                     b: 35,
//                     t: 40,
//                     pad: 4
//                 },
//                 title: 'Miles Hiked vs Feet Hiked',
//                 paper_bgcolor: '#648ca6',
//                 showlegend: false,
//             };
//             Plotly.newPlot('scatter', data, layout)
//         };

//     })
// };

function graphPie(state = "All") {
    var httpRequest = new XMLHttpRequest();

    if (state == "All") {
        httpRequest.onreadystatechange = function() {
            if (this.status == "200") {            
                var responseBody = JSON.parse(this.responseText);

                var hikesByState = new Map();
                for (i in responseBody) {
                    hikesByState.set(STATE_ABBREVIATIONS[responseBody[i]["state"]], parseInt(responseBody[i]["count"]));
                }

                graphPieHelper("Hikes by State", hikesByState);
            }
        };

        httpRequest.open("GET", API_BASE_URL + "hikesByState", true);
    } else {
        httpRequest.onreadystatechange = function() {
            if (this.status == "200") {            
                var responseBody = JSON.parse(this.responseText);

                var hikesByPark = new Map();
                for (i in responseBody) {
                    hikesByPark.set(responseBody[i]["park"], parseInt(responseBody[i]["count"]));
                }

                graphPieHelper("State Hikes by Park", hikesByPark);
            }
        };

        httpRequest.open("GET", API_BASE_URL + "hikesByPark&state=" + state, true);
    }

    httpRequest.send();
}

function graphPieHelper(title, hikesByEntity) {
    var hikesByStatePieChart = document.getElementById("pie");

    let data = [{
        values: [...hikesByEntity.values()],
        labels: [...hikesByEntity.keys()],
        type: "pie",
        textinfo: "label",
        textposition: "outside",
    }];

    let layout = {
        showlegend: false,
        autosize: false,
        height: hikesByStatePieChart.clientHeight,
        width: hikesByStatePieChart.clientWidth,
        margin: {
            l: 30,
            r: 40,
            b: 30,
            t: 40,
            pad: 4
        },
        title: title,
        plot_bgcolor: "cyan",
        paper_bgcolor: "#648ca6",
        colorway : ['F18A3F', 'F16A45', 'F04C4B', 'EF506F', 'EE5692', 'ED5BB2', 'EC61D0', 'EA66EB', 'CF6BEA', 'B770E9', 'A276E8', '8F7BE7', '8082E6', '859BE5', '8AB1E4', '8FC4E3', '94D5E2', '99E1DF', '9EE0D0', 'A3E0C5']
    };

    Plotly.newPlot("pie", data, layout);
}

function populateLog(state = "All") {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            var responseBody = JSON.parse(this.responseText);
            
            var dates = [];
            var hikes = [];
            var states = [];
            var parks = [];
            var distances = [];
            var elevations = [];
            for (i in responseBody) {
                dates.push(responseBody[i]["date"]);
                hikes.push(responseBody[i]["hike"]);
                states.push(responseBody[i]["state"]);
                parks.push(responseBody[i]["park"]);
                distances.push(responseBody[i]["distance"]);
                elevations.push(responseBody[i]["elevation"]);
            }

            var cellValues = [dates, hikes, states, parks, distances, elevations];
            var headers = ["Date", "Hike", "State", "Park", "Distance", "Elevation"];

            var data = [{
                type: "table",
                columnwidth: [500, 1000, 1000, 1000, 400, 600],
                columnorder: [0, 1, 2, 3, 4, 5],
                header: {
                    values: headers,
                    align: "center",
                    line: {width: 1, color: "rgb(50, 50, 50)"},
                    fill: {color: ["F18A3F"]},
                    font: {family: "Arial", size: 8, color: "white"}
                },
                cells: {
                    values: cellValues,
                    align: ["center", "center"],
                    line: {color: "black", width: 1},
                    fill: {color: ["rgba(228, 222, 249, 0.65)', 'rgba(228, 222, 249, 0.65)"]},
                    font: {family: "Arial", size: 9, color: ["black"]}
                }
            }];

            var layout = {
                title: "Log",
                margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 30,
                    pad: 4
                },
                paper_bgcolor: "#648ca6",
            };

            var config = {responsive: true, autosize: true}

            Plotly.newPlot("log", data, layout, config);
        }
    };

    if (state == "All") {
        httpRequest.open("GET", API_BASE_URL + "allHikes", true);
    } else {
        httpRequest.open("GET", API_BASE_URL + "stateHikes&state=" + state, true);
    }

    httpRequest.send();
}

function cumulativeMiles(state = "All") {
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            var responseBody = JSON.parse(this.responseText);

            var cumulativeMilesByDate = new Map();
            for (i in responseBody) {
                cumulativeMilesByDate.set(responseBody[i]["date"], parseInt(responseBody[i]["cumulativeMiles"]));
            }

            let data = [{
                x: [...cumulativeMilesByDate.keys()],
                y: [...cumulativeMilesByDate.values()],
                type: "scatter",
            }];
        
            var layout = {
                title: "Cumulative Miles Hiked",
                margin: {
                    l: 30,
                    r: 20,
                    b: 40,
                    t: 30,
                    pad: 4
                },
                paper_bgcolor: "#648ca6",
            };
        
            Plotly.newPlot("cumulative", data, layout);
        }
    }

    if (state == "All") {
        httpRequest.open("GET", API_BASE_URL + "cumulativeMilesByDate", true);
    } else {
        httpRequest.open("GET", API_BASE_URL + "stateCumulativeMilesByDate&state=" + state, true);
    }

    httpRequest.send();
}

function addTotals(state = "All") {
    if (state == "All") {
        getDataFromBackend("totalHikes", "totalHikes");
        getDataFromBackend("totalMiles", "totalMiles", "miles");
        getDataFromBackend("totalElevation", "totalElevation", "feet");
        getDataFromBackend("totalStates", "totalStates");

        document.getElementById("totalCounts").textContent = "Total States Visited:"
    } else {
        var params = new Map();
        params.set("state", state);

        getDataFromBackend("totalHikes", "stateHikeCount", "", params);
        getDataFromBackend("totalMiles", "stateMiles", "miles", params);
        getDataFromBackend("totalElevation", "stateElevation", "feet", params);
        getDataFromBackend("totalStates", "totalParks", "", params);

        document.getElementById("totalCounts").textContent = "Total Parks Visited:"
    }
}

// function adjustMap(state = 'All', map) {
//     map.flyTo([MAP_ZOOMS[`${state}`][0][0], MAP_ZOOMS[`${state}`][0][1]], MAP_ZOOMS[`${state}`][1]);
// }

function populateDropdown() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            var states = JSON.parse(this.responseText);
            states.unshift("All");
            
            var stateDropdown = document.getElementById("stateDropdown");

            for (j = stateDropdown.options.length - 1; j >= 0; j--) {
                stateDropdown.remove(j);
            }

            for (i = 0; i < states.length; i++) {
                var newOption = document.createElement("option");
                newOption.text = states[i];
                newOption.value = states[i];

                stateDropdown.add(newOption);
            }
        }
    };

    httpRequest.open("GET", API_BASE_URL + "states", true);
    httpRequest.send();
}

function getDataFromBackend(documentId, resource, unit = "", extraParameters = new Map()) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            document.getElementById(documentId).innerHTML = formatNumber(this.responseText) + " " + unit;
        }
    };  

    var url = API_BASE_URL + resource;

    for (const [k, v] of extraParameters.entries()) {
        url += "&" + k + "=" + v;
    }

    httpRequest.open("GET", url, true);
    httpRequest.send();
}

// applies filter to dataset to display state specific data, or total data
function selectFilter(state) {
    // adjustMap(state, map);
//     graphScatter(state);
    graphPie(state);
    populateLog(state);
    cumulativeMiles(state);
    addTotals(state);
}

// Helper function to add commas to big numbers
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// initializing the page to display total hikes
addTotals();
populateDropdown();
initializeMap();
graphPie();
cumulativeMiles();
populateLog();

//graphScatter();

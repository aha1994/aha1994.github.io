var ss = SpreadsheetApp.openById("1ATW6D3DzMMeOuWaWqEXTbb8xyrEaCOmTQpsKpa-RZVw");
var sheet = ss.getActiveSheet();

const DATE_COL = "A";
const HIKE_COL = "B";
const STATE_COL = "C";
const PARK_COL = "D";
const DISTANCE_COL = "E";
const ELEVATION_COL = "F";
const LAT_COL = "G";
const LON_COL = "H";
const LINK_COL = "I";

// This single method receives all GET requests, and has to conditional on the different endpoints due to limitations in the Google Script internal routing
function doGet(request) {  
  if (request.parameter.resource == "totalHikes") {
    return ContentService.createTextOutput(JSON.stringify(getTotalHikeCount()));
  } else if (request.parameter.resource == "totalMiles") {
    return ContentService.createTextOutput(JSON.stringify(getTotalDistanceHiked()));
  } else if (request.parameter.resource == "totalElevation") {
    return ContentService.createTextOutput(JSON.stringify(getTotalElevationHiked()));
  } else if (request.parameter.resource == "totalStates") {
    return ContentService.createTextOutput(JSON.stringify(getTotalStatesVisited()));
  } else if (request.parameter.resource == "states") {
    return ContentService.createTextOutput(JSON.stringify(getStatesVisited()));
  } else if (request.parameter.resource == "stateHikes") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getStateHikeCount(request.parameter.state)));
    }
  } else if (request.parameter.resource == "stateMiles") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getStateDistanceHiked(request.parameter.state)));
    }
  } else if (request.parameter.resource == "stateElevation") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getStateElevationHiked(request.parameter.state)));
    }
  } else if (request.parameter.resource == "totalParks") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getTotalParksVisited(request.parameter.state)));
    }
  } else if (request.parameter.resource == "hikesByState") {
    return ContentService.createTextOutput(JSON.stringify(getHikesByState()));
  } else {
    return ContentService.createTextOutput("I don't recognize that resource.");
  }
}

function getTotalHikeCount() {
  var hikeCount = parseInt(sheet.getLastRow() - 1);
  
  return hikeCount;
}

function getTotalDistanceHiked() {
  var totalDistance = 0.0;
  
  for (i = 2; i <= sheet.getLastRow(); i++) {
    var currentCell = DISTANCE_COL + i;
    var currentValue = sheet.getRange(currentCell).getValue();
    
    totalDistance += currentValue;
  }
  
  return round(totalDistance, 1);
}

function getTotalElevationHiked() {
  var totalElevation = 0.0;
  
  for (i = 2; i <= sheet.getLastRow(); i++) {
    var currentCell = ELEVATION_COL + i;
    var currentValue = sheet.getRange(currentCell).getValue();
    
    totalElevation += currentValue;
  }
  
  return parseInt(totalElevation);
}

function getTotalStatesVisited() {
  return parseInt(getStatesVisited().length);
}

function getStatesVisited() {
  var statesVisited = new Set();
  
  for (i = 2; i <= sheet.getLastRow(); i++) {
    var currentCell = STATE_COL + i;
    var currentValue = sheet.getRange(currentCell).getValue();
    
    statesVisited.add(currentValue);
  }
    
  return [...statesVisited].sort();
}

function getStateHikeCount(state) {
  var stateHikeCount = 0;
  
  for (i = 2; i <= sheet.getLastRow(); i++) {
    var currentStateCell = STATE_COL + i;
    var currentStateValue = sheet.getRange(currentStateCell).getValue();
    
    if (currentStateValue == state) {
      stateHikeCount++;
    }
  }
  
  return parseInt(stateHikeCount);
}

function getStateDistanceHiked(state) {
  var stateDistance = 0.0;
  
  for (i = 2; i <= sheet.getLastRow(); i++) {
    var currentCell = DISTANCE_COL + i;
    var currentValue = sheet.getRange(currentCell).getValue();
    
    var currentStateCell = STATE_COL + i;
    var currentStateValue = sheet.getRange(currentStateCell).getValue();
    
    if (currentStateValue == state) {
      stateDistance += currentValue;
    }
  }
  
  return round(stateDistance, 1);
}

function getStateElevationHiked(state) {
  var stateElevation = 0.0;
  
  for (i = 2; i <= sheet.getLastRow(); i++) {
    var currentCell = ELEVATION_COL + i;
    var currentValue = sheet.getRange(currentCell).getValue();
    
    var currentStateCell = STATE_COL + i;
    var currentStateValue = sheet.getRange(currentStateCell).getValue();
    
    if (currentStateValue == state) {
      stateElevation += currentValue;
    }
  }
  
  return parseInt(stateElevation);
}

function getTotalParksVisited(state) {
  var parksVisited = new Set();
  
  for (i = 2; i <= sheet.getLastRow(); i++) {
    var currentCell = PARK_COL + i;
    var currentValue = sheet.getRange(currentCell).getValue();
    
    var currentStateCell = STATE_COL + i;
    var currentStateValue = sheet.getRange(currentStateCell).getValue();
    
    if (currentStateValue == state && currentValue != null && currentValue != "") {
      parksVisited.add(currentValue);
    }
  }
  
  return parksVisited.size;
}

function getHikesByState() {
  var hikesByState = new Map();
  
  for (i = 2; i <= sheet.getLastRow(); i++) {
    var currentStateCell = STATE_COL + i;
    var currentStateValue = sheet.getRange(currentStateCell).getValue();
    
    if (hikesByState.has(currentStateValue)) {
      hikesByState.set(currentStateValue, hikesByState.get(currentStateValue) + 1);
    } else {
      hikesByState.set(currentStateValue, 1);
    }
  }
  
  var response = [];
    
  for (const [k, v] of hikesByState.entries()) {
    response.push({
      "state": k,
      "count": v,
    });
  }
  
  return response;
}

function getHikesByPark(state) {
  // TODO
}

// Taken from: https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var d3 = require("d3");



d3.json(data.graph.json).then(function(data) {
    console.log("json");
    for (var i = 0; i < data.length; i++) {
        console.log(data[i].name);
        }
    });
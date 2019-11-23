// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var d3 = require("d3");
var bandData = require("./graph.json");

var width = 960,
    height = 900;

var colors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "yellow"];

var force = d3.forceSimulation(bandData.nodes)
    .force("charge", d3.forceManyBody().strength(-20))
    .force("link", d3.forceLink(bandData.edges))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", tick) ;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var defs = svg.append("defs");

var gradient = defs.append("linearGradient")
    .attr("id", "svgGradient")
    .attr("x1", "40%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "100%");

gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", "0%")
    .attr("stop-color", "orange")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr('class', 'end')
    .attr("offset", "100%")
    .attr("stop-color", "blue")
    .attr("stop-opacity", 1);

var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(bandData.edges)
    .enter().append("line")
    .attr("stroke-width", 2);

var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(bandData.nodes)
    .enter().append("g")
    .attr("class", function(d){
        return d.group;
    })
    
    
var circles = node.append("circle")
    .attr("r", function(d){
        if(d.group == 3){ return 80; }
        else if (d.group == 2) { return 60; }
        else return 30;
    } );
    // .attr("border", "10px solid")
    // .attr("border-image", "conic-gradient(red, yellow, lime, aqua, blue, magenta, red) 1");
    
    
circles.attr("fill", function(d){
    if(d.member<5) return colors[d.member];
    else return "url(#svgGradient)";
});

var lables = node.append("text")
    .text(function(d) {
      return d.name;
    })
    .attr("text-anchor", "middle");

node.append("title")
    .text(function(d) { return d.name; });






function tick() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
}






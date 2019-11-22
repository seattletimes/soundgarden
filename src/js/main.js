// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var d3 = require("d3");
var bandData = require("./graph.json");

var width = 960,
    height = 500;


function makeDisplay(data){

  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var numBins=3;
  var binWidth =width / numBins - (margin.right+margin.left);
  var binHeight = height-margin.top-margin.bottom;
  var binStart= (binWidth + margin.right + margin.left);
  var radius = 20;

  var force = d3.forceSimulation(bandData.nodes)
    .force("charge", d3.forceManyBody().strength(-200))
    .force("link", d3.forceLink(bandData.edges))
    .on("tick", tick); 

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bins = svg.selectAll("g")
              .data([{label:"Soundgarden"},{label:"Members"},{label:"Projects"}])
              .enter().append("g")
              .attr("class", "iRect")
              .attr("transform", function(d, i) { return "translate(" + binStart * i + ")"; });  

  bins.append("rect")
      .attr("id", function(d, i) { return "bin"+i;})
      .attr("width", binWidth)
      .attr("height", binHeight)
      .style("fill", "yellow");

  svg.selectAll("#bin0")
    .style("fill", "red");
  
  var link = svg.selectAll("line")
    .data(data.edges)
    .enter()
    .append("line")
    .attr("class","edge")
    .style("stroke", "#ccc")
    .style("stroke-width", 2);


  var node = svg.selectAll("g")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("cx", function(d) { return d.cx; })
    .attr("cy", function(d) { return d.cy; })
    .attr("width", 40)
    .attr("height", 40)
    .on("click", click);

  node
    .append("circle")
    .attr("r", radius)
    .style("fill", "blue")
    .style("stroke", "#ccc");

  node
    .append("text")
    .text(function(d){
        return d.name;
    })
    .attr("text-anchor", "middle");

  node
    .append("title")
        .text(function(d){
            return d.name;
    });

// var node = svg.selectAll(".node").data(data.nodes);

// var nodeEnter = svg.selectAll("g").data(data.nodes).enter().append("g")
//     .attr("class", "node")
//     .on("click", click);

// nodeEnter.append("circle")
//     .attr("r", 20)

// nodeEnter.append("text")
//     .attr("dy", ".35em")
//     .text(function(d){ return d.name });

// node.select("circle")
//     .style("fill", "#f46f08");





    function click(){
        console.log("clicked " + this);
    }
    // ADD LATER style edges on hover
    // node.on('mouseover', function(d) {
    // link.attr('class', function(l) {
    //     if (d === l.source || d === l.target)
    //     return "link active";
    //     else
    //     return "link inactive";
    // });
    // });

    // // Set the stroke width back to normal when mouse leaves the node.
    // node.on('mouseout', function() {
    //     link.attr('class', "link");
    //     })
    //     .on('click', click);



  function tick(e) {
    link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    // Push different nodes in different directions for clustering.
    // the Math.max bits will keep the nodes confined in there appropriate "bins"
    // fyi: binStart * (d.group-1) → left border
    // and: binStart * (d.group-1) + binWidth → right border
    node
        .attr("cx", (function(d) 
            { d.x = Math.max(binStart * (d.group-1), Math.min((binStart * (d.group-1) + binWidth) - radius, d.x)); return d.x; }))
        .attr("cy", (function(d) {return d.y = Math.max(radius, Math.min(binHeight - radius, d.y));}));
  }
}

makeDisplay(bandData);
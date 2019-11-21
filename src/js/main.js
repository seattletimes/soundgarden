// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var d3 = require("d3");
var bandData = require("./graph.json");


var width = 960,
    height = 800;

// var force = d3.forceSimulation();

function makeDisplay(data){

  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var numBins=3;
  var binWidth =width / numBins - (margin.right+margin.left);
  var binHeight = height-margin.top-margin.bottom;
  var binStart= (binWidth + margin.right + margin.left);
  var radius = 20;
  var padding = 10;
  
  data.nodes.forEach(function(d,i){
    d.cx = binStart * (d.group-1) + binWidth/2;
    d.cy = binHeight/2 + margin.top;
    return d.radius = radius;
  })

  var force = d3.forceSimulation(bandData.nodes)
  .force("charge", d3.forceManyBody().strength(-200))
  .force("link", d3.forceLink(bandData.edges))
  .on("tick", tick); 


    
  var nodes = data.nodes;
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
  
  var link = svg.selectAll(".edge")
                .data(data.edges)
                .enter()
                .append("line")
                .attr("class","edge")
                .style("stroke", "#ccc")
                .style("stroke-width", 2);

  var node = svg.selectAll(".node")
      .data(data.nodes)
      .enter()
      .append("circle");

  node.append("text")
    .text(function(d){
        return d.name;
    })
    .attr('x', 6)
    .attr('y', 3)


      
  var circleAttributes = svg.selectAll("circle")    
      .attr("class", "node")
      .attr("cx", function(d) { return d.cx; })
      .attr("cy", function(d) { return d.cy; })
      .attr("r", radius)
      .style("fill", "blue")
      .style("stroke", "#ccc")
      .on("mousedown", function() { d3.event.stopPropagation(); });


  svg.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

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
  
//   function gravity(alpha){
//     return function(d){
//       // note that if the gravity is not equal to 0 in the force declaration (i.e. force.gravity(0)) then 
//       // the nodes will be pulled slightly toward the center of the graph, in opposition to the code below 
//       // (tug-of-war type scenario)
//       d.y += (d.cy-d.y) * alpha; //(d.cy > d.y) ?  : -1;
//       d.x += (d.cx-d.x) * alpha;//(d.cx > d.x) ? 1 : -1;
//     }
//   }
  // Resolve collisions between nodes.
//   function collide(alpha) {
//     var quadtree = d3.quadtree(nodes);
//     return function(d) {
//       var r = d.radius +  padding,
//           nx1 = d.x - r,
//           nx2 = d.x + r,
//           ny1 = d.y - r,
//           ny2 = d.y + r;
//       quadtree.visit(function(quad, x1, y1, x2, y2) {
//         if (quad.point && (quad.point !== d)) {
//           var x = d.x - quad.point.x,
//               y = d.y - quad.point.y,
//               l = Math.sqrt(x * x + y * y),
//               r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
//           if (l < r) {
//             l = (l - r) / l * alpha;
//             d.x -= x *= l;
//             d.y -= y *= l;
//             quad.point.x += x;
//             quad.point.y += y;
//           }
//         }
//         return x1 > nx2
//             || x2 < nx1
//             || y1 > ny2
//             || y2 < ny1;
//       });
//     };
//   }

  function mousedown() {
    nodes.forEach(function(o, i) {
      o.x += (Math.random() - .5) * 30;
      o.y += (Math.random() - .5) * 30;
    });
    force.resume();
  }
}

makeDisplay(bandData);
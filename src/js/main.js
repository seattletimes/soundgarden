// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var d3 = require("d3");
var bandData = require("./graph.json");

var legendValues = [1, 2, 3],
    legendLabels = ["<tspan class='bold'>1</tspan>", "<tspan class='bold'>2</tspan>", "<tspan class='bold'>3</tspan> Soundgarden members connected to the band"],
    legendHeight = 120,
    legendWidth = 310;

var scale = d3.scaleSqrt()
    .domain([1, 3])  
    .range([30, 50]);

var width = 600,
    height = 600;

var colors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"];
var filterButtons = document.querySelectorAll(".filter-buttons")

var legend = d3.select("#legend")
    .attr("width", legendWidth)
    .attr("height", legendHeight)

legend.selectAll("circle")
    .data(legendValues)
    .enter()
    .append("circle")
    .attr("cx", "50%")
    .attr("cy", function(d) {return legendHeight - scale(d);})
    .attr("r", function(d) {return scale(d)})
    .style("fill", "none")
    .attr("stroke", "#999");

legend.selectAll("text")
    .data(legendLabels)
    .enter()
    .append("text")
    .html(function(d) {return d})
    .attr("text-anchor", "middle")
    .attr("x", "50%")
    .attr("y", function(d, i) {
        return legendHeight - 2 * scale(i + 1) - 3;
    })
    .attr("class", "legend-labels");

function filterByCategory(){
    var selectedCategory = document.querySelector(".checked");
    if(selectedCategory) {
        var selected = parseInt(selectedCategory.dataset.category); 

        showCircles.transition().duration(500).attr("fill-opacity", function(d){
            var members = d.member;
            if(members.indexOf(selected) == -1){
                return ".3";
            }
        }); 
        text.transition().duration(500).attr("fill-opacity", function(d){
            var members = d.member;
            if(members.indexOf(selected) == -1){
                return ".3";
            }
        });
    }
    else{
        showCircles.transition().duration(500).attr("fill-opacity", "1");
        text.transition().duration(500).attr("fill-opacity", "1");
    }
}

function catButton() {
    if (this.classList.length == 1){
      for(var x = 0; x < filterButtons.length; x++){
            filterButtons[x].classList.remove("checked");
            }
      this.classList.add("checked");
    }
    else{
      this.classList.remove("checked");
    }  filterByCategory();
  }
  
  function catlistener(){
    for(var x = 0; x < filterButtons.length; x++){
    filterButtons[x].addEventListener("click", catButton);
    filterButtons[x].style.border = "2px solid" + colors[x];
    }
  }
  catlistener();



var force = d3.forceSimulation(bandData.nodes)
    .force("charge", d3.forceManyBody().strength(function(d){
        return (-1*d.radius)/2;
    }))
    .force("link", d3.forceLink(bandData.edges))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(function(d) {
         return d.radius + 0.5; }).iterations(0))
    .on("tick", tick) ;

var svg = d3.select(".svg-container").append("svg")
    .attr("width", function() {
        if (window.innerWidth > 600) {
            return width;
        } else {
            return 300;
        }
    })
    .attr("height", function() {
        if (window.innerWidth > 600) {
            return height;
        } else {
            return 730;
        }
    });

var defs = svg.append("defs");

var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(bandData.edges)
    .enter().append("line")
    .attr("stroke-width", 2);

var nodes = svg.append("g")
    .attr("class", "nodes")


var node = nodes
    .selectAll("g")
    .data(bandData.nodes)
    .enter().append("g")
    .attr("class", function(d){
        return d.group;
    })   

var hideCircles = node.append("circle")
    .attr("r", function(d){
        return d.radius;
    })
    .attr("fill", "none");
    
var showCircles = node.append("circle")
    .attr("r", function(d){
        return scale(d.group);
    } );

showCircles
    .attr("fill", function(d){
    if(d.member.length==1) return colors[d.member];
    else {
        var gradient = defs.append("linearGradient")
            .attr("id", "svgGradient" + d.member)
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%");

        var members = d.member;
        var length = members.length;

        var offset = [];
        if (length == 2) {
            offset = [["0%", "50%"], ["50%","100%"]];
        } else if (length == 3) {
            offset = [["0%", "33%"], ["33%", "66%"], ["66%","100%"]];
        }

        for(var x = 0; x < length; x++){
            for(var y = 0; y<2; y++){
            
            gradient.append("stop")
                .attr("offset", offset[x][y])
                .attr("stop-color", function(d){
                    return colors[members[x]];
                })
            }
        }
        return "url(#svgGradient"+d.member+")";
        }
    });



var text = node.append("text")
    .attr("x", "0")
    .attr("y", function(d) {
        var lines = d.name.split("\n").length;
        return -4 + (-9 * lines);
    })
    .attr("text-anchor", "middle")
    .attr("class", "bubble-labels");

node.append("title")
    .text(function(d) { return d.name; });

text.selectAll("tspan")
    .data(function(d) {
        return d.name.split("\n");
    })
    .enter()
    .append("tspan")
    .text(d => d)
    .attr("x", 0)
    .attr("dy", 18);


function tick() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("transform", function(d) {
        if (window.innerWidth > 600) {
            return "translate(" + d.x + "," + d.y + ")";
        } else {
            return "translate(" + d.mobile_cx + "," + d.mobile_cy + ")";
        }
      })


      svg
      .attr("width", function() {
          if (window.innerWidth > 600) {
              return width;
          } else {
              return 300;
          }
      })
      .attr("height", function() {
          if (window.innerWidth > 600) {
              return height;
          } else {
              return 730;
          }
      });
}



window.addEventListener('resize', tick );



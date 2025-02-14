// var width = 750;
var width = parseInt(d3.select('.po-worldmap').style('width'));
var height = 600;
var map = void 0; // Update global
var tooltip;
var activeCircle;

//var color = d3.scale.category20c()
//var vals = ["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"]
var vals = ["Full","CMT 1","CMT 2","Training 1", "Training 2", "Zero"]
var colorScale = d3.scale.ordinal()
 .domain(vals)
  .range((['#CECE06','#B8B800','#9AB900','#33A626','#337F33','#296629']).reverse())

var projection = d3.geo.mercator()
    .center([0,40])
    // .rotate([4.4, 0])
    //.rotate([0,0])
    // .parallels([50, 60])
    .scale(width/5.8)
    //.translate([width / 2 , height / 2 ]);
   .translate([width / 2 - 40 , height / 2 - 50]);
// var projection = d3.geo.mercator()
//     .center([30, 10])
//     .rotate([0,0])
//     // .parallels([50, 60])
//     .scale(130)
//     .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection);
var svg = d3.select(".po-worldmap").append("svg").attr("width", width).attr("height", height)

//REPLACED WITH MAPSHAPER_OUTPUT.JSON FILE
// d3.json("/data/world.json", function(error, world) {
//   svg.selectAll(".subunit")
//       .data(topojson.feature(world, world.objects.subunits).features)
//     .enter().append("path")
//       .attr("class", function(d) { console.log(d); return "subunit " + d.id; })
//       .attr("d", path).style({ stroke:"white", "stroke-width": 0.75, fill: "lightgrey" })

d3.json("/data/countries_noaa.json", function(error, world) {
  //var worldmap = topojson.feature(world, world.objects)
 //console.log(worldmap)
  console.log(world)
  svg.selectAll(".subunit")
      .data(world.features)
    .enter().append("path")
      .attr("class", function(d) { 
        //console.log(d.properties.adm0_a3); 
        return "subunit " + d.properties.adm0_a3; })
      .attr("d", path).style({ stroke:"white", "stroke-width": 0.75, fill: "lightgrey" })

    d3.csv("/data/cm_sampledata.csv", function(data) {

      data = data.filter(function(d) { return !(d.Region == "TBD" || d.Region == "Sample Region")})
      data.forEach(function(d){
        if (d.Engagement === "Full") { 
          d.enabled = true;
          d.Engagement = "Full"}
        else if ( d.Engagement === "Partial: CMT 1") {  d.enabled = true;d.Engagement = "CMT 1" }
        else if ( d.Engagement === "Partial: CMT 2") {  d.enabled = true;d.Engagement = "CMT 2" }
        else if ( d.Engagement === "Partial: Training 1") {  d.enabled = true;d.Engagement = "Training 1" }
        else if ( d.Engagement === "Partial: Training 2") {  d.enabled = true;d.Engagement = "Training 2" }
        else if ( d.Engagement === "Zero") { d.enabled = true;d.Engagement = "Zero" }  
       });

      //var currentData = data
      var legendVals = d3.set(data.map(function(d) { return d.Engagement } )).values();

      // var legend = svg.append('g').attr("transform","translate(30,40)")
      //   .selectAll('.legend')
      //   .data(colorScale.domain())//.slice().sort())
      //   .enter().append('g')
      //   .attr("class", "legend")
      //   .attr("transform", function(d,i ) {
      //       {return "translate(" + i * 100 + ",50)"}
      //     // {return "translate(0," + i * 20 + ")"}
      //   })

      //createLegend(colorScale.domain())

      console.log(colorScale.domain())

      //if .enter() appended here then error legend.html is not a function
      var legend = d3.select('.po-worldmap').append("div").attr("class","wrapper")
        .style({position: "absolute", top:"0", width: "100%"})
        .append("div").attr("class","row1")
        .style({ overflow: "hidden", "font-size": ".8em", "line-height": "1.5", "padding-left": "5px"})

      .selectAll(".legend").data(colorScale.domain())
        
      legend.enter().append("div").attr("class","legend")
      //.style({float:"left" } ) //, width:"15%" })

      legend.html(function(d,i) { return d})
      .style("background-color", function(d){ return colorScale(d)})
      .style({ "text-align": "center", display:"inline-block", width: "16%",color: "white"})
      .style("border",function(d) { return "1px solid " + colorScale(d)})
      .on("click", function(d) {
          //var legendChoice = d;
          var rect = d3.select(this); 
          var enabled = true;
          if(rect.attr("class") !== "disabled") {
              rect.attr('class','disabled')
            RemoveLegendChoice(d,false)
          } else { rect.attr("class","enabled") 
            AddLegendChoice(d,true)
            }
          })
       // .style({padding: "0 20px 20px 20px"})

       /*
       1. Setting postion absolute to wrapper then removes the width defined on legend divs
       RESOLUTION: needed to add width: 100% to wrapper

       */

   

      // function createLegend(data) {
      //   console.log(width)
      //   var legend = svg.append('g').attr("transform","translate(0,0)")
      //     .selectAll('.legend').data(data)

  
      //   legend.enter()
      //     .append("rect")
      //     .attr("x",function(d,i) {return i * 100 }).attr("y", 0)
      //     .attr("width",100).attr("height",25)
      //     .style("fill", function(d,i) { return colorScale(d)})


      //   legend.append('text')
      //   .attr("x",function(d,i) {return i * 100 }).attr("y", 0)
      //   .attr("dy", ".35em")
      //   .text(function(d,i) { return d})
      //   .attr("class","textselected")
      //   .style("text-anchor", "middle")
      //   .style("font-size", 13)
      //   .style("fill","black")
      // }

      // legend.append('rect')
      //   .attr("x", 120)
      //   .attr("y", height - 150)
      //   .attr("width", 10)
      //   .attr("height", 10)
      //   .attr("class","rect enabled")
      //   .style("fill", function(d,i) { return colorScale(d) } )
      //   .style("stroke",function(d,i) { return colorScale(d) } )
      //   .on("click", function(d) {
      //     //var legendChoice = d;
      //     var rect = d3.select(this); 
      //     var enabled = true;
      //     if(rect.attr("class") !== "disabled") {
      //         rect.attr('class','disabled')
      //       RemoveLegendChoice(d,false)
      //     } else { rect.attr("class","enabled") 
      //       AddLegendChoice(d,true)
      //       }
      //   })

      // legend.append('text')
      //   .attr("x", 110)
      //   .attr("y", height - 145)
      //   .attr("dy", ".35em")
      //   .text(function(d,i) { return d})
      //   .attr("class","textselected")
      //   .style("text-anchor", "end")
      //   .style("font-size", 13)
    
      populateMap(data)
      render_barchart(data)
      render_pie(data)

     function RemoveLegendChoice(circledata,enabled) {
      console.log(circledata)
        //DATA JOIN...Join new data with old elements if any
        var circle =  svg.selectAll("circle").filter(function(d) { return d.Engagement === circledata})
        //.transition().duration(1000).attr("r", 12)
        .transition().duration(500)
          .attr("r",0)
        console.log(circledata)
        render_barchart(data,circledata,false)
        redraw_pie(circledata,false)
        //render_pie(data,circledata,false)
      }

      function AddLegendChoice(circledata) {
         var circle =  svg.selectAll("circle").filter(function(d) { return d.Engagement === circledata})
          .transition().duration(500)
          //delay(function(d,i) { return i * 2})
          .attr("opacity",1)
          .attr("r",5)
        render_barchart(data,circledata,true)
        redraw_pie(circledata,true)
      }
      
      function populateMap(circledata) {

        //DATA JOIN...Join new data with old elements if any
         var circle = svg.selectAll("circle").data(circledata).attr("opacity",0)
         //UPDATEs
         // circle.attr("class", function (d) { return circleEngagement(d) })
         //  .on("mouseover", mouseover)
         //  .on("mouseout", mouseout)
         //  .transition().duration(2000).attr("opacity",.7)

        //ENTER
        circle.enter().append("circle")
          .attr("class", function (d) { return circleEngagement(d) })
          .on("mouseover", mouseover)
          .on("mouseout", mouseout)
          // .transition().duration(2000).attr("opacity",.1)
             .attr("opacity",0)
          .transition().duration(2000).attr("opacity",.7)

        //ENTER + UPDATE
        circle
         .attr("class", function (d) { return circleEngagement(d) + " enabled" })
         .on("mouseover", mouseover)
         .on("mouseout", mouseout)
         .attr("transform", function(d) { 
          return "translate(" + projection([+d.Longitude, +d.Latitude]) + ")" })
           //original code below, however cities not being mapped correctly
           //Longitude must be first in the sequence
           // .attr("cx", function(d) { return projection([d.Longitude, d.Latitude])[0];})
           // .attr("cy", function(d) { return projection([d.Longitude, d.Latitude])[1]; })
           // .attr("cx", function(d) { return projection([d.Longitude])[0];})
           // .attr("cy", function(d) { return projection([d.Latitude])[0];})
         .attr("r", 5)
         .style("fill", function(d,i) { return colorScale(d.Engagement)})
         // .attr("opacity",0)
         //  .transition().duration(2000).attr("opacity",.7)

          circle.exit()
            .transition().duration(2000).attr("opacity",.2)
            .remove()

         var tooltip = d3.select("body").data(circledata).append('div').attr("class","tooltip")
            .style("position", 'absolute')
            .style("padding", '10px 10px')
            .style("background", "white")
            //.style("opacity", 0)

        function circleEngagement(d) {
            //console.log(d)
               if (d.Engagement === "Full") { return "full"}
              else if ( d.Engagement === "Partial: CMT 1") { return "partialcmt1" }
              else if ( d.Engagement === "Partial: CMT 2") { return "partialcmt2" }
              else if ( d.Engagement === "Partial: Training 1") { return "partialt1" }
              else if ( d.Engagement === "Partial: Training 2") { return "partialt2" }
              else if ( d.Engagement === "Zero") { return "zero" }
        }//circleEngagement

        function mouseover(d) {

          tooltipcolor = this.style.fill
              
          activeCircle = d3.select(this)
          //d3.select(this).transition().duration(1000).attr("r",10)
          d3.select(this).transition().duration(1000).ease("bounce")
                    .attr("r", 20)
                    .attr("stroke-width",10)
                    .attr("stroke","rgba(239, 239, 239, .8)")
                    .style("opacity",1)
           var string = "";
                    string = string + "City: "
                    string = string + d["City"]
                    string = string + "<br>"
                    string = string + "Country: "
                    string = string + d["Country"]
                    // string = string + "<hr>"
                    string = string + "<br>"
                    string = string + "Engagement: "
                    string = string + d["Engagement"]

            tooltip.style("opacity",0)
                  tooltip.style("border" , "3px solid " + tooltipcolor )
            tooltip.transition().duration(1000).style("opacity",1)   

            tooltip.html(function() { 
              return string
            //return "<strong>" + "Site: " + "</strong>" + d["Site Code"] + "<br>" + "City: " + d["City"] + "</strong>";
            })
           .style('left', (d3.event.pageX + 25) + 'px')
           .style('top',  (d3.event.pageY - 30) + 'px')
           .style({ "font-size": "15px", "line-height": "normal"})
        }//mouseover

        function mouseout(d) {
          activeCircle.transition().duration(500).attr("r", 4).attr("stroke-width",0).style("opacity",.7)
          tooltip.transition().duration(20)
            .style('opacity',0)
        }//mouseout
      }
    
  });//csv
})//json




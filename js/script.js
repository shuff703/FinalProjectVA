//Get data from server on page load
var jsonData = null;
var AllFoodTable = null;
var CurrentFoodTable = null;
$(document).ready(function () {
    $.ajax({
        url: '/Data/menu.csv',
        type: 'GET',
        dataType: 'text',
        success: function (data) {
            if (data != null) {
                var objectArray = [];
                var temp = data.split('\n').map(function (x) {
                    return x.split(',');
                });
                for (var i = 1; i < temp.length; i++) {
                    if (i < 260) {
                        objectArray.push(new MenuData(temp[i]));
                    }

                }
                jsonData = objectArray;
                if (jsonData != null) {
                    AllFoodTable = $('#AllFood').DataTable({
                        stateSave: true,
                        paging: false,
                        scrollY: 400,
                        data: jsonData,
                        columns: [
                            {
                                render: function (data, type, row) {
                                    return '<input type="checkbox" />';
                                }
                            },
                            {
                                data: 'item'
                            },
                            {
                                data: 'category'
                            },
                            {
                                data: 'servingSize',
                                orderable: false
                            },
                            {
                                data: 'calories'
                            },
                            {
                                data: 'fat'
                            },
                            {
                                data: 'cholesterol'
                            },
                            {
                                data: 'sodium'
                            },
                            {
                                data: 'sugar'
                            },
                            {
                                data: 'protein'
                            }
                        ]
                    });
                    scatterplot(jsonData);
                    $('div.col-md-10').eq('0').hide();
                }
            }
        }
    });
    CurrentFoodTable = $('#CurrentFood').DataTable({
        stateSave: true,
        paging: false,
        data: null,
        columns: [
            {
                width: '5%',
                render: function (data, type, row) {
                    return '<img src="/Images/close_red.png" class="removeItem" width="15px" />';
                }
            },
            {
                width: '25%',
                data: 'item'
            },
            {
                width: '13%',
                data: 'category'
            },
            {
                width: '15%',
                data: 'servingSize'
            },
            {
                width: '7%',
                data: 'calories'
            },
            {
                width: '7%',
                data: 'fat'
            },
            {
                width: '7%',
                data: 'cholesterol'
            },
            {
                width: '7%',
                data: 'sodium'
            },
            {
                width: '7%',
                data: 'sugar'
            },
            {
                width: '7%',
                data: 'protein'
            }
        ]
    });

});


//JSON Object for UI
class MenuData {
    constructor(text) {
        if (text.length != 24 && text.length != 25) {
            console.log('Whats going on (length): ' + text.length);
        } else {
            var count = 0;
            this.category = text[count++];
            this.item = text[count++];
            if (text.length == 25) {
                this.item += text[count++];
            }
            this.servingSize = text[count++];
            this.calories = Number(text[count++]);
            this.caloriesFat = Number(text[count++]);
            this.fat = Number(text[count++]);
            this.fatPercent = Number(text[count++]);
            this.saturatedFat = Number(text[count++]);
            this.saturatedPercent = Number(text[count++]);
            this.transFat = Number(text[count++]);
            this.cholesterol = Number(text[count++]);
            this.cholesterolPercent = Number(text[count++]);
            this.sodium = Number(text[count++]);
            this.sodiumPercent = Number(text[count++]);
            this.carbs = Number(text[count++]);
            this.carbPercent = Number(text[count++]);
            this.fiber = Number(text[count++]);
            this.fiberPercent = Number(text[count++]);
            this.sugar = Number(text[count++]);
            this.protein = Number(text[count++]);
            this.vitaminA = Number(text[count++]);
            this.vitaminC = Number(text[count++]);
            this.calcium = Number(text[count++]);
            this.iron = Number(text[count++]);
        }
    }
    equals(data) {
        return this.category == data.category &&
            this.servingSize == data.servingSize &&
            this.calories == data.calories &&
            this.fat == data.fat &&
            this.cholesterol == data.cholesterol &&
            this.sodium == data.sodium &&
            this.protein == data.protein;
    }
}


//Psychopath D3 function for scatterplot
function scatterplot(jData) {
    $('#plot').html('');
    var xVal = $('#xLabel').val();
    var yVal = $('#yLabel').val();
    var xLabelName = $('#xLabel option[value="' + xVal + '"]').text();
    var yLabelName = $('#yLabel option[value="' + yVal + '"]').text();
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // setup x 
    var xValue = function (d) {
            return d[xVal];
        },
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function (d) {
            return xScale(xValue(d));
        },
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function (d) {
            return d[yVal];
        },
        yScale = d3.scale.linear().range([height, 0]),

        yMap = function (d) {
            return yScale(yValue(d));
        },
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // setup fill color
    var cValue = function (d) {
            return d.category;
        },
        color = d3.scale.category10();

    // add the graph canvas to the body of the webpage
    var svg = d3.select("#plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("#plot").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(jData, xValue) - 1, d3.max(jData, xValue)*1.25]);
    yScale.domain([d3.min(jData, yValue) - 1, d3.max(jData, yValue)*1.25]);
    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(xLabelName);
    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabelName);

    // draw dots
    svg.selectAll(".dot")
        .data(jData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr('class', function (d) {
            return d.category;
        })
        .attr("r", 5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function (d) {
            return color(cValue(d));
        })
        .on("mouseover", function(d) {
            d3.select(this).attr("r", 15);
            tooltip.transition()
                .duration(200)
                .style("opacity", .8);
            var x = Number(d3.select(this).attr("cx")) + 65;
            var y = Number(d3.select(this).attr('cy')) -150;
            //Most rediculous string of all time
            tooltip.html(d["item"] + "<br/>Calories: " + d.calories + 'g, ' + d.caloriesFat + ' from fat<br/>Fat:' +
                d.fat + 'g (' + d.fatPercent + '% daily value), Trans Fat: ' + d.transFat + 'g<br/>Saturated Fat: ' + + d.saturatedFat + 'g (' + d.saturatedPercent + '% daily value)<br/>Cholesterol: ' + d.cholesterol +
                'g (' + d.cholesterolPercent + '% daily value)<br/>Sodium: ' + d.sodium + 'g (' + d.sodiumPercent + '% daily value)<br/>Carbs: ' + d.carbs + 'g (' + d.carbPercent + '% daily value)<br/>Fiber: ' + 
                d.fiber + 'g (' + d.fiberPercent + '% daily value)<br/>Sugar: ' + d.sugar + 'g<br/>Protein: ' + d.protein + 'g')
                .style("left", x + "px")
                .style("top", y + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(cValue(d))).attr("r", 5);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


    // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr('y', 40)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 49)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });
}

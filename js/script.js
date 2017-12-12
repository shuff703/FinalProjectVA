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

function changeXAxis() {
    // d3.select("#xlabel").text(elem);
    xLabel = elem;
    xScale.domain([d3.min(cerealData, xValue) - 1, d3.max(cerealData, xValue) + 1]);
    svg.selectAll(".x.axis")
        .call(xAxis).select(".label").text(xLabel);
    changePos();
};

function changeYAxis() {
    // d3.select("#ylabel").text(x);
    yScale.domain([d3.min(cerealData, yValue) - 1, d3.max(cerealData, yValue) + 1]);
    svg.selectAll(".y.axis")
        .call(yAxis).select(".label").text(yLabel);
    changePos();
};

function changePos() {
    svg.selectAll("circle")
        .transition()
        .duration(500)
        .attr("cx", xMap)
        .attr("cy", yMap);
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
        xScale = d3.scale.linear().range([0, width]),
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
    xScale.domain([d3.min(jData, xValue) - 1, d3.max(jData, xValue) * 1.25]);
    yScale.domain([d3.min(jData, yValue) - 1, d3.max(jData, yValue) * 1.25]);
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
        .on("mouseover", function (d) {
            d3.select(this).attr("r", 15);
            tooltip.transition()
                .duration(200)
                .style("opacity", .8);
            var x = Number(d3.select(this).attr("cx")) + 65;
            var y = Number(d3.select(this).attr('cy')) - 150;
            //Most rediculous string of all time
            tooltip.html(d["item"] + "<br/>Calories: " + d.calories + 'g, ' + d.caloriesFat + ' from fat<br/>Fat:' +
                    d.fat + 'g (' + d.fatPercent + '% daily value), Trans Fat: ' + d.transFat + 'g<br/>Saturated Fat: ' + +d.saturatedFat + 'g (' + d.saturatedPercent + '% daily value)<br/>Cholesterol: ' + d.cholesterol +
                    'g (' + d.cholesterolPercent + '% daily value)<br/>Sodium: ' + d.sodium + 'g (' + d.sodiumPercent + '% daily value)<br/>Carbs: ' + d.carbs + 'g (' + d.carbPercent + '% daily value)<br/>Fiber: ' +
                    d.fiber + 'g (' + d.fiberPercent + '% daily value)<br/>Sugar: ' + d.sugar + 'g<br/>Protein: ' + d.protein + 'g')
                .style("left", x + "px")
                .style("top", y + "px");
        })
        .on("mouseout", function (d) {
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

var barChart = {
    margin: {
        top: 20,
        right: 50,
        bottom: 300,
        left: 100
    },
    width: function () {
        return $('#vis1').outerWidth();
    },
    height: function () {
        return 1000 - this.margin.top - this.margin.bottom
    },
    svg: function () {
        return d3.select('#vis1').append('svg').attr('width', this.width() + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom).append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
    },
    draw: function (jData) {
        var headers = ['fat', 'cholesterol', 'sodium', 'carbs', 'fiber', 'sugar', 'protein', 'vitaminA', 'vitaminC', 'calcium', 'iron'];
        var layers = d3.layout.stack()(headers.map(function (header) {
            return jData.map(function (d) {
                return {
                    x: d.item,
                    y: +d[header]
                };
            });
        }));
        /*var layers = d3.layout.stack(function (d){
            return { x: d.item, y: d.fat+d.cholesterol+d.sodium+d.carbs+d.fiber+d.sugar+d.protein+d.vitaminA+d.vitaminC+d.calcium+d.iron };                                             
        });*/
        var svg = d3.select('#vis1').append('svg').attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 1000 1000").append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        var yGroupMax = d3.max(layers, function (layer) {
            return d3.max(layer, function (d) {
                return d.y;
            })
        });
        var yMax = d3.max(layers, function (layer) {
            return d3.max(layer, function (d) {
                return d.y0 + d.y;
            })
        });

        var xScale = d3.scale.ordinal()
            .domain(layers[0].map(function (d) {
                return d.x;
            }))
            .rangeRoundBands([25, 500], .08);

        var y = d3.scale.linear()
            .domain([0, yMax])
            .range([this.height(), 0]);

        var color = d3.scale.ordinal().domain(headers).range(['#edc948', '#4e79a7', '#f28e2b', '#b07aa1', '#e15759', '#ff9da7', '#76b7b2', '#9c755f', '#59a14f', '#bab0ac', '#000000']);

        var xAxis = d3.svg.axis().scale(xScale).tickSize(0).tickPadding(6).orient('bottom');

        var yAxis = d3.svg.axis().scale(y).orient('left');

        var layer = svg.selectAll('.layer').data(layers).enter().append('g').attr('class', 'layer')
            .style('fill', function (d, i) {
                return color(i);
            });

        var rect = layer.selectAll('rect').data(function (d) {
                return d;
            }).enter().append('rect')
            .attr('x', function (d) {
                return xScale(d.x)
            })
            .attr('y', 380)
            .attr('width', xScale.rangeBand())
            .attr('height', 0);

        rect.transition().delay(function (d, i) {
                return i * 10
            })
            .attr('y', function (d) {
                return y(d.y0 + d.y);
            })
            .attr('height', function (d) {
                return y(d.y0) - y(d.y0 + d.y);
            });

        svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + this.height() + ')')
            .call(xAxis).selectAll('text').style('text-anchor', 'end').attr('dx', '-.8em').attr('dy', '.15em')
            .attr('transform', function (d) {
                return 'rotate(-45)';
            });

        svg.append('g').attr('class', 'y axis').attr('transform', 'translate(20, 0)').call(yAxis).append('text')
            .attr('transform', 'rotate(-90)').attr({
                'x': -150,
                'y': -70
            }).attr('dy', '.75em')
            .style('text-anchor', 'end').text('Items');

        var legend = svg.selectAll('.legend').data(headers.slice().reverse()).enter().append('g').attr('class', 'legend')
            .attr('transform', function (d, i) {
                return 'translate(-20, ' + i * 20 + ')'
            });

        legend.append('rect').attr('x', jData.length * this.width() / jData.length - 18).attr('width', 18).attr('height', 18).style('fill', color);

        legend.append('text').attr('x', jData.length * this.width() / jData.length - 24).attr('y', 9).attr('dy', '.35em').style('text-anchor', 'end')
            .text(function (d) {
                return d;
            });
    }

}
var bubbleChart = {
    metric: function () {
        return $('#DiameterSelect').val();
    },
    diameter: 960,
    format: function () {
        d3.format(",d")
    },
    tooltip: function () {
        return d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "rgba(0, 0, 0, 0.75)")
            .style("border-radius", "6px")
            .style("font", "12px sans-serif")
            .text("tooltip");
    },

    draw: function (jData) {

        var svg = d3.select("#vis2").append("svg")
            .attr("width", $('#vis2').width())
            .attr("height", 500)
            .attr("class", "bubble")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 1000 1000").append('g');

        var pack = d3.layout.pack()
            .size([500, 500])
            .padding(1.5);

        console.log(jData.children);
        var nodes = pack.nodes(jData);
        console.log(nodes);

        var nodes = pack.nodes(jData);

        console.log(nodes);

        //.sum(function(d) { return d.calories; });
        var node = svg.selectAll(".node")
            .data(pack.nodes(jData))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                console.log(d);
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("circle")
            .attr("r", function (d) {
                console.log(d);
                return d.r;
            })
            .attr('class', function (d) {
                return d.category;
            })
            .on("mouseover", function (d) {
                tooltip.text(d.className + ": " + format(d.value));
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .text(function (d) {
                return d.item;
            });



    },

    // Returns a flattened hierarchy containing all leaf nodes under the root.
    classes: function (root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) {
                recurse(node.name, child);
            });
            else classes.push({
                packageName: name,
                className: node.name,
                value: node.size
            });
        }

        recurse(null, root);
        return {
            children: classes
        };
    },
    final: function () {
        d3.select(self.frameElement).style("height", diameter + "px");
    }


}

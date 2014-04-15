define(['loadFileAngular', 'loadFilePreprocess', 'loadFileD3', 'topojson', 'loadFileUnderscore', 'MUUSMapGDPByState', 'zmMashUp'], function (angular, app, d3, topojson, _) {

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("d3-map directive")
    }

    var MapControlsService = function () {
        this.zoomReset = false;
        this.reset = function() {
            this.zoomReset = true;
        }

        this.hideIndeedIconsToggle = false;
        this.hideIndeedIcons = function() {
            this.hideIndeedIconsToggle = true;
        }
    };

    angular.module('ftd.directivesModule')


        .service("MapControls", MapControlsService)

        .controller('mapControlsController', ['$scope', "MapControls", function($scope, MapControls) {
            $scope.reset = function() {
                MapControls.reset();
            }

            $scope.hideIndeedIcons = function() {
                MapControls.hideIndeedIcons();
            }

        }])
        .controller('WorldMapController', ['$scope', function ($scope) {

//            console.log("data", $scope.data);

            /**
             * this works
             */
//            GeoFactory.all("us").getList().then(function (data) {
//                $scope.d3Data = data[0].raw;
//            })


            $scope.title = "World Map";

        }])
        .directive('d3Map', function () {
            return {
                restrict: 'EA',
                scope: {
                    geoData: '='
                },
                templateUrl: "app/ng/directives/d3-map/d3-map.html",
                transclude:true
            }
        })
        .directive('usMap', ["MapControls", '$filter', '$timeout', 'indeedData', 'd3MapData', 'MUUSMapGDPByState', 'ZillowMapZipcodeMU',
            function (MapControls, $filter, $timeout, indeedData, d3MapData, MUUSMapGDPByState, ZillowMapZipcodeMU) {

                return {
                    restrict: 'EA',
                    scope: {
                        data: "=",
                        label: "@",
                        onClick: "&"
                    },
                    link: function ($scope, $element, $attr) {

                        //init service call
//                    d3MapData.getStatesAbbr();



                        var svg = d3.select($element[0])
                            .append("svg")
                            .attr("width", "100%");

                        // on window resize, re-render d3 canvas
                        window.onresize = function () {
                            return $scope.$apply();
                        };

                        //Watch for window reszie
                        $scope.$watch(function () {
                                return angular.element(window)[0].innerWidth;
                            }, function () {
                                return $scope.render($scope.data);
                            }
                        );

                        // watch for data changes and re-render
                        $scope.$watch('data', function (newVals, oldVals) {
                            return $scope.render(newVals);
                        }, true);

                        //Watch for reset
                        $scope.MapControls = MapControls;



                        // watch for data changes and re-render
                        $scope.indeedData = indeedData.params()

                        //newVals is an array
                        $scope.$watch('indeedData.indeedResults', function (newVals, oldVals) {

                            $scope.renderCircles(newVals);
//
                        }, true);

                        // define render function
                        $scope.render = function (data) {
                            // remove all previous items before render
                            svg.selectAll("*").remove();

                            svg.on("click", stopped, true);

                            // setup variables
                            var width, height, max;
                            width = d3.select($element[0])[0][0].offsetWidth + 70;

                            // 20 is for margins and can be changed
//                            height = 600;
                            height = 550;
                            // 35 = 30(bar height) + 5(margin between bars)
                            max = 98;
                            // this can also be found dynamically when the data is not static
                            // max = Math.max.apply(Math, _.map(data, ((val)-> val.count)))

                            // set the height based on the calculations above
                            svg.attr('height', "100%");

                            var active = d3.select(null);

                            $scope.projection = d3.geo.albersUsa()
                                .scale(1100)
                                .translate([width / 2, (height / 2) + 20]);


//                        var coords = projection([d.lon, d.lat]);
//                        var x = coords[0];
//                        var y = coords[1];

                            var zoom = d3.behavior.zoom()
                                .translate([0, 0])
                                .scale(1)
                                .scaleExtent([1, 8])
                                .on("zoom", zoomed);



                            var path = d3.geo.path()
                                .projection($scope.projection);

//                        var svg = d3.select("body").append("svg")
//                            .attr("width", width)
//                            .attr("height", height)
//                            .on("click", stopped, true);

                            svg.append("rect")
                                .attr("class", "background")
                                .attr("width", width)
                                .attr("height", height)
                                .on("click", resteState);

                            var g = svg.append("g");
                            g.attr("class", "nation-graphic");
                            var z = svg.append("g"); //zipcodes
                            z.attr("class", "zipcodes-graphic")
                            var j = svg.append("g"); //Job circles
                            j.attr("class", "jobs-graphic");

                            svg.call(zoom) // delete this line to disable free zooming
                                .call(zoom.event);

                            $scope.$watch('MapControls.zoomReset', function (newVals, oldVals) {

                                if (newVals == true) {
                                    svg.transition()
                                        .duration(750)
                                        .call(zoom.translate([0, 0]).scale(1).event);


                                    z.selectAll('path')
                                        .transition()
                                        .duration(750)
                                        .style("opacity", 0);

                                    $timeout(function(){
                                        z.selectAll('path').remove();
                                    }, 750)

                                    $timeout(function() {
                                        MapControls.zoomReset = false;
                                    }, 100);
                                }
//
                            }, true);

                            $scope.$watch('MapControls.hideIndeedIconsToggle', function (newVals, oldVals) {

//                                console.log(newVals)

                                if (newVals == true) {

                                    j.selectAll("circle")
                                        .transition()
                                        .duration(750)
                                        .style("opacity", 0);

                                    $timeout(function(){
                                        j.selectAll("circle").remove();
                                        d3.selectAll(".popover-wrapper").remove();
                                    }, 750)

                                    $timeout(function() {
                                        MapControls.hideIndeedIconsToggle = false;
                                    }, 100);
                                }
//
                            }, true);



                            MUUSMapGDPByState.UsGDPByState('2012').then(function (result) {
//                                    console.log('MUUSMapGDPByState', result);


                                    var stateQantize = d3.scale.quantize()
                                        .domain([result.bea.meta.min, result.bea.meta.max])
                                        .range(d3.range(49).map(function (i) {
                                            return 'q' + i + "-49";
                                        }));

                                    g.selectAll("path")
                                        .data(topojson.feature(result.map, result.map.objects.states).features)
                                        .enter().append("path")
                                        .attr("class", function (d) {
                                            var value;
                                            if (!result.bea.data[d.properties.name]) {
                                                value = result.bea.meta.min;
                                            } else {
                                                value = result.bea.data[d.properties.name]
                                            }
//                                            console.log(Number(value));
                                            return stateQantize(Number(value)) + " state";
                                        })
                                        .attr("d", path);
//                                    .attr("class", "feature state")

                                    g.selectAll("path.state")
                                        .on("click", stateClicked);

                                    g.append("path")
                                        .datum(topojson.mesh(result.map, result.map.objects.states, function (a, b) {
                                            return a !== b;
                                        }))
                                        .attr("class", "mesh")
                                        .attr("d", path);

                                    $scope.renderCircles();

                                }
                            )


                            var stateZoomScale = {};


                            function stateClicked(d) {

                                //TODO pull zipcode data when zoomed in
                                //http://www.zillow.com/webservice/GetDemographics.htm?zws-id=X1-ZWz1dshk18nnyj_76gmj&zip=78723


                                z.selectAll('path')
                                    .transition()
                                    .duration(750)
                                    .style("opacity", 0);


                                function drawZipCodes() {
                                    z.selectAll('path').remove();

//                                      //TODO replace with mashup
                                    ZillowMapZipcodeMU.getMashUpByState(d.properties.name)
                                        .then(function (mashData) {
//                                            console.log("mashed data", mashData);


                                          var zipQuantize = d3.scale.quantize()
                                                .domain([mashData.zillow.meta.min, mashData.zillow.meta.max]) //0 to 1 million
                                                .range(d3.range(9).map(function (i) {
//                                                        console.log("q" + i + "-9")
                                                    return "q" + i + "-49";
                                                }));

                                            z.selectAll("path")
                                                .data(topojson.feature(mashData.map, mashData.map.objects.counties).features)
                                                .enter().append("path")
                                                .attr("class", function (d) {
                                                    var name = d.properties.name.replace(" Parish", "");
                                                    name = name.replace(" County", "");
//                                                    console.log(name, mashData.zillow.data)
//                                                    console.log(quantize(rate));
                                                    return zipQuantize(mashData.zillow.data[name]);
                                                })
                                                .attr("d", path)
                                                .attr("data", d.properties.name)
//                                                .attr("class", "feature")
                                                .style("opacity", 0)
                                                .transition()
                                                .duration(750)
//                                        .delay(750)
                                                .style("opacity", 1);

                                            z.selectAll("path")
                                                .on("click", zipCodeClicked);

                                            z.append("path")
                                                .datum(topojson.mesh(mashData.map, mashData.map.objects.counties, function (a, b) {
                                                    return a !== b;
                                                }))
                                                .attr("class", "mesh")
                                                .attr("d", path)
                                                .style("opacity", 0)
                                                .transition()
                                                .duration(750)
                                                .style("opacity", 1);


                                        }, function (error) { //Not a state
//                                svg.on("click", stopped, true)
//                                            console.log("error", error)

                                            z.selectAll("path").remove();
                                        })
                                }

                                $timeout(drawZipCodes, 750);

                                if (active.node() === this) return resteState();
                                active.classed("active", false);
                                active = d3.select(this).classed("active", true);

                                var bounds = path.bounds(d),
                                    dx = bounds[1][0] - bounds[0][0],
                                    dy = bounds[1][1] - bounds[0][1],
                                    x = (bounds[0][0] + bounds[1][0]) / 2,
                                    y = (bounds[0][1] + bounds[1][1]) / 2,
                                    scale = .9 / Math.max(dx / width, dy / height),
                                    translate = [width / 2 - scale * x, height / 2 - scale * y];

                                stateZoomScale.bounds = bounds;
                                stateZoomScale.dx = dx;
                                stateZoomScale.dy = dy;
                                stateZoomScale.x = x;
                                stateZoomScale.y = y;
                                stateZoomScale.scale = scale;
                                stateZoomScale.translate = translate;

                                svg.transition()
                                    .duration(750)
                                    .call(zoom.translate(translate).scale(scale).event);


                            }


                            function zipCodeClicked(d) {
//                            console.log("zipCodeClicked", d)

                                if (active.node() === this) return resetZipCode();
                                active.classed("active", false);
                                active = d3.select(this).classed("active", true);

                                var bounds = path.bounds(d),
                                    dx = bounds[1][0] - bounds[0][0],
                                    dy = bounds[1][1] - bounds[0][1],
                                    x = (bounds[0][0] + bounds[1][0]) / 2,
                                    y = (bounds[0][1] + bounds[1][1]) / 2,
                                    scale = .9 / Math.max(dx / width, dy / height),
                                    translate = [width / 2 - scale * x, height / 2 - scale * y];

                                svg.transition()
                                    .duration(750)
                                    .call(zoom.translate(translate).scale(scale).event);
                            }

                            function resetZipCode() {
                                active.classed("active", false);
                                active = d3.select(null);

                                svg.transition()
                                    .duration(750)
                                    .call(zoom.translate(stateZoomScale.translate).scale(stateZoomScale.scale).event);
                            }


                            function resteState() {
                                active.classed("active", false);
                                active = d3.select(null);

                                svg.transition()
                                    .duration(750)
                                    .call(zoom.translate([0, 0]).scale(1).event);
                            }

                            function zoomed() {


                                //nation zoom
                                g.style("stroke-width", 1.5 / d3.event.scale + "px");
                                g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

                                //zipcodes zoom
                                z.style("stroke-width", 1.5 / d3.event.scale + "px");
                                z.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

                                //jobs zoom
                                j.style("stroke-width", 1.5 / d3.event.scale + "px");
                                j.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

                            }

                            // If the drag behavior prevents the default click,
                            // also stop propagation so we don’t click-to-zoom.
                            function stopped() {
                                if (d3.event.defaultPrevented) d3.event.stopPropagation();
                            }


                        };


                        $scope.renderCircles = function (data) {

                            if (!data) {
                                return;
                            }

                            var htmlFormatFactory = function (data) {
                                var html = "";

                                var date = Date(Date.parse(data.date));

                                //Header
                                html += '<h3>' + data.jobtitle + '</h3>';
                                html += '<p>' + data.company + '</p>';
                                html += '<p>' + data.formattedLocation + '</p>';
//                            html += '<p>' + Date(Date.parse(data.date)) + '</p>';
                                html += '<p>' + $filter('date')(Date.parse(data.date), 'MMM d, y h:mm:ss a') + " " + date.substr(date.length - 5) + '</p>';
                                html += '<p>' + data.snippet + '</p>';


                                return html;
                            }


                            var popoverFactory = function (data, iter) {
//                            console.log(data);

                                d3.select("body")
                                    .append("div")
                                    .attr("id", "popover-" + iter)
                                    .attr("class", "popover-wrapper")
                                    .style("position", "absolute")
                                    .style("z-index", "10")
                                    .style("visibility", "hidden")


                                d3.select("#popover-" + iter)
                                    .append("div")
                                    .attr("class", "d3-tip")
                                    .html(htmlFormatFactory(data))

                                d3.select("#popover-" + iter)
                                    .append("div")
                                    .attr("class", "arrow-bottom")


                            };


                            var j = svg.select("g.jobs-graphic");
                            j.selectAll("circle").remove();
                            d3.selectAll(".popover-wrapper").remove();

                            var len = data.length, i = 0;

                            for (i; i < len; i++) {
                                if (data[i].longitude && data[i].latitude) {
                                    popoverFactory(data[i], i)

                                    j.append("circle")
                                        .attr("cx", function (d) {

                                            if ($scope.projection([data[i].longitude, data[i].latitude])) {
                                                return $scope.projection([data[i].longitude, data[i].latitude])[0];
                                            }
                                        })
                                        .attr("cy", function (d) {
                                            if ($scope.projection([data[i].longitude, data[i].latitude])) {
                                                return $scope.projection([data[i].longitude, data[i].latitude])[1];
                                            }
                                        })
                                        .attr("r", 2)
                                        .attr("id", "c-" + i)
                                        .style("fill", "red")
                                        .on("mouseover", function () {
                                            var id = "#popover-" + this.id.split("-")[1];
//                                    var contentSelect = id + " > t3-tip";
                                            var arrowSelect = id + " > arrow-bottom";

                                            d3.select(id).style("visibility", "visible")

//                                    var padding = 20;
//                                    var margin = 10;

//                                    var xPos = this.cx.baseVal.value;
//                                    var yPos = this.cy.baseVal.value;

//                                    console.log(this, event, d3.event);


                                            var verticalOffset = $(id).height();
                                            var horizontalOffset = $(id).width() / 2;

                                            d3.select(id).style("top", (event.pageY - verticalOffset) + "px").style("left", (event.pageX - horizontalOffset) + "px");

                                        })
                                        .on("mouseout", function () {
                                            var id = "#popover-" + this.id.split("-")[1];
                                            return d3.select(id).style("visibility", "hidden");
                                        });
                                }
                            }


                        }
                    }
                };

            }])
});

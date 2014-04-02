define(['angular', 'preprocess', 'd3', 'topojson', "factoriesModule", "indeed"], function (angular, p, d3, topojson) {
    p.loadOrder('d3-map directive');
    p.log("d3 version: " + d3.version);


    angular.module('app.directivesModule')
        .controller('WorldMapController', ['$scope', "GeoFactory", function ($scope, GeoFactory) {

//            console.log("data", $scope.data);

            /**
             * this works
             */
            GeoFactory.all("us").getList().then(function (data) {
                $scope.d3Data = data[0].raw;
            })


            $scope.title = "World Map";

        }])
        .directive('d3Map', function () {
            return {
                restrict: 'EA',
                scope: {
                    geoData: '='
                },
                templateUrl: "app/ng/directives/d3-map/d3-map.html"
            }
        })
        .directive('worldMap', ['$filter', 'indeedData', function ($filter, indeedData) {
            p.loadOrder('d3 directive');
            return {
                restrict: 'EA',
                scope: {
                    data: "=",
                    label: "@",
                    onClick: "&"
                },
                link: function ($scope, $element, $attr) {

                    var svg = d3.select($element[0])
                        .append("svg")
                        .attr("width", "100%");


                    // on window resize, re-render d3 canvas
                    window.onresize = function () {
                        return $scope.$apply();
                    };

                    $scope.$watch(function () {
                            return angular.element(window)[0].innerWidth;
                        }, function () {
                            return $scope.render($scope.data);
                        }
                    );

                    // watch for data changes and re-render
                    $scope.$watch('data', function (newVals, oldVals) {
//                        console.log(newVals);
                        return $scope.render(newVals);
                    }, true);

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

                        svg.on("click", stopped, true)

                        // setup variables
                        var width, height, max;
                        width = d3.select($element[0])[0][0].offsetWidth - 20;

                        // 20 is for margins and can be changed
                        height = 600;
                        // 35 = 30(bar height) + 5(margin between bars)
                        max = 98;
                        // this can also be found dynamically when the data is not static
                        // max = Math.max.apply(Math, _.map(data, ((val)-> val.count)))

                        // set the height based on the calculations above
                        svg.attr('height', "100%");

                        var active = d3.select(null);

                        $scope.projection = d3.geo.albersUsa()
                            .scale(1000)
                            .translate([width / 2, height / 2]);

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
                            .on("click", reset);

                        var g = svg.append("g");

                        svg.call(zoom) // delete this line to disable free zooming
                            .call(zoom.event);

                        d3.json("app/data/us.json", function (error, us) {
                            g.selectAll("path")
                                .data(topojson.feature(us, us.objects.states).features)
                                .enter().append("path")
                                .attr("d", path)
                                .attr("class", "feature")
                                .on("click", clicked);

                            g.append("path")
                                .datum(topojson.mesh(us, us.objects.states, function (a, b) {
                                    return a !== b;
                                }))
                                .attr("class", "mesh")
                                .attr("d", path);

                            $scope.renderCircles();

                        });

                        function clicked(d) {

                            if (active.node() === this) return reset();
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

                        function reset() {
                            active.classed("active", false);
                            active = d3.select(null);

                            svg.transition()
                                .duration(750)
                                .call(zoom.translate([0, 0]).scale(1).event);
                        }

                        function zoomed() {
                            g.style("stroke-width", 1.5 / d3.event.scale + "px");
                            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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


                        var htmlFormatFactory = function(data) {
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


                        var popoverFactory = function(data, iter) {
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


                        var g = svg.select("g");
                        g.selectAll("circle").remove();
                        d3.selectAll(".popover-wrapper").remove();

                        var len = data.length, i = 0;
                        for (i; i < len; i++) {

                            popoverFactory(data[i], i)



                            g.append("circle")
                                .attr("cx", function (d) {
                                    return $scope.projection([data[i].longitude, data[i].latitude ])[0];
                                })
                                .attr("cy", function (d) {
                                    return $scope.projection([data[i].longitude, data[i].latitude])[1];
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
            };

        }]).factory('GeoFactory', ['$q', 'Restangular', function ($q, Restangular) {
            return Restangular.withConfig(function (RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(p.getRestangularPath("app/data"));
                RestangularConfigurer.setRequestSuffix(".json");
                RestangularConfigurer.addResponseInterceptor(function (data, operation, what, url, response, deferred) {

                    var raw = {};
                    raw.type = data.type;
                    raw.objects = data.objects;
                    raw.arcs = data.arcs;
                    raw.transform = data.tranform;
                    data.raw = raw;


                    var newResponse;
                    if (operation === "getList") {
                        // Here we're returning an Array which has one special property metadata with our extra information
                        newResponse = [ data ];
                    } else {
                        // This is an element
                        newResponse = data;
                    }
                    return newResponse;


                    /*var newResponse = data;
                     if (angular.isArray(data)) {
                     angular.forEach(newResponse, function(value, key) {
                     newResponse[key].originalElement = angular.copy(value);
                     });
                     } else {
                     newResponse.originalElement = angular.copy(data);
                     }

                     return newResponse;*/

                });
            });
        }])
});


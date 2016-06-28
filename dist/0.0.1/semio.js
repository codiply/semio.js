var semio;
(function (semio) {
    var core;
    (function (core) {
        var ColorPalette = (function () {
            function ColorPalette() {
            }
            ColorPalette.qualitative = function (values, offset) {
                var allColors = this._qualitativeColors20;
                if (offset) {
                    offset = offset % allColors.length;
                    allColors = allColors.slice(offset, allColors.length).concat(allColors.slice(0, offset));
                }
                var colors = allColors.slice(0, values.length);
                var mapping = {};
                _.zip(values, colors).forEach(function (x) {
                    mapping[x[0]] = x[1];
                });
                return function (x) { return mapping[x]; };
            };
            ColorPalette.sequential = function (extent) {
                return d3.scale.quantile()
                    .domain(extent)
                    .range(ColorPalette._sequentialColors9);
            };
            ColorPalette._qualitativeColors20 = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
                "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
                "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
                "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5"];
            ColorPalette._sequentialColors9 = ["#fff7fb", "#ece7f2", "#d0d1e6",
                "#a6bddb", "#74a9cf", "#3690c0",
                "#0570b0", "#045a8d", "#023858"];
            return ColorPalette;
        }());
        core.ColorPalette = ColorPalette;
    })(core = semio.core || (semio.core = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var core;
    (function (core) {
        var DrawingSurface = (function () {
            function DrawingSurface(containerId) {
                this.containerId = containerId;
                this.svg = d3.select("#" + containerId)
                    .append("svg");
            }
            DrawingSurface.prototype.setWidth = function (width) {
                this._width = width;
                this.svg.attr("width", width);
                return this;
            };
            DrawingSurface.prototype.setHeight = function (height) {
                this._height = height;
                this.svg.attr("height", height);
                return this;
            };
            DrawingSurface.prototype.setX = function (x) {
                this._x = x;
                this.svg.attr("x", x);
                return this;
            };
            DrawingSurface.prototype.setY = function (y) {
                this._y = y;
                this.svg.attr("y", y);
                return this;
            };
            DrawingSurface.prototype.getWidth = function () { return this._width; };
            DrawingSurface.prototype.getHeight = function () { return this._height; };
            DrawingSurface.prototype.splitRows = function (n, verticalSpacingRatio) {
                var _this = this;
                var rowHeight = n > 1 ? this._height * (1 - verticalSpacingRatio) / n : this._height;
                var marginHeight = n > 1 ? this._height * verticalSpacingRatio / (n - 1) : 0;
                return _.range(0, n).map(function (row) {
                    var id = _this.containerId + "_row_" + row.toString();
                    _this.svg.append("g").attr("id", id);
                    return new DrawingSurface(id)
                        .setHeight(rowHeight)
                        .setWidth(_this._width)
                        .setY(row * (rowHeight + marginHeight));
                });
            };
            DrawingSurface.prototype.splitColumns = function (n, horizontalSpacingRatio) {
                var _this = this;
                var columnWidth = n > 1 ? this._width * (1 - horizontalSpacingRatio) / (n - 1) : this._width;
                var marginWidth = n > 1 ? this._width * horizontalSpacingRatio / (n - 1) : 0;
                return _.range(0, n).map(function (col) {
                    var id = _this.containerId + "_column_" + col.toString();
                    _this.svg.append("g").attr("id", id);
                    return new DrawingSurface(id)
                        .setHeight(_this._height)
                        .setWidth(columnWidth)
                        .setX(col * (columnWidth + marginWidth));
                });
            };
            DrawingSurface.prototype.splitGrid = function (n, maxColumns, verticalSpacingRatio, horizontalSpacingRatio) {
                var _this = this;
                var nColumns = Math.ceil(Math.sqrt(n));
                if (maxColumns) {
                    nColumns = Math.min(nColumns, maxColumns);
                }
                var nRows = Math.ceil(n / nColumns);
                var cellWidth = this._width * (1 - horizontalSpacingRatio) / nColumns;
                var cellHeight = this._height * (1 - verticalSpacingRatio) / nRows;
                var marginWidth = this._width * horizontalSpacingRatio / (nColumns - 1);
                var marginHeight = this._height * verticalSpacingRatio / (nRows - 1);
                return _.flatMap(_.range(0, nRows), function (row) {
                    return _.range(0, nColumns)
                        .filter(function (col) {
                        var i = row * nColumns + col;
                        return i < n;
                    }).map(function (col) {
                        var id = _this.containerId + "_row_" + row.toString() + "_column_" + col.toString();
                        _this.svg.append("g").attr("id", id);
                        return new DrawingSurface(id)
                            .setHeight(cellHeight)
                            .setWidth(cellWidth)
                            .setX(col * (cellWidth + marginWidth))
                            .setY(row * (cellHeight + marginHeight));
                    });
                });
            };
            DrawingSurface.prototype.splitHeader = function (headerHeightRatio) {
                var headerHeight = Math.max(Math.min(headerHeightRatio * this._height, this._height), 0);
                var bodyHeight = this._height - headerHeight;
                var headerId = this.containerId + "_header";
                var bodyId = this.containerId + "_body";
                this.svg.append("g").attr("id", headerId);
                this.svg.append("g").attr("id", bodyId);
                var headerSurface = new DrawingSurface(headerId)
                    .setWidth(this._width)
                    .setHeight(headerHeight)
                    .setY(0);
                var bodySurface = new DrawingSurface(bodyId)
                    .setWidth(this._width)
                    .setHeight(bodyHeight)
                    .setY(headerHeight);
                return {
                    body: bodySurface,
                    header: headerSurface
                };
            };
            DrawingSurface.prototype.splitLeftRight = function (leftWidthRatio) {
                var leftWidth = Math.max(Math.min(leftWidthRatio * this._width, this._width), 0);
                var rightWidth = this._width - leftWidth;
                var leftId = this.containerId + "_left";
                var rightId = this.containerId + "_right";
                this.svg.append("g").attr("id", leftId);
                this.svg.append("g").attr("id", rightId);
                var leftSurface = new DrawingSurface(leftId)
                    .setWidth(leftWidth)
                    .setHeight(this._height)
                    .setX(0);
                var rightSurface = new DrawingSurface(rightId)
                    .setWidth(rightWidth)
                    .setHeight(this._height)
                    .setX(leftWidth);
                return {
                    left: leftSurface,
                    right: rightSurface
                };
            };
            DrawingSurface.prototype.addCenteredColumn = function (idSuffix, cx, width) {
                var id = this.containerId + "_column_" + idSuffix;
                this.svg.append("g").attr("id", id);
                var surface = new DrawingSurface(id)
                    .setWidth(width)
                    .setHeight(this._height)
                    .setX(cx - width / 2);
                return surface;
            };
            DrawingSurface.prototype.addCenteredRow = function (idSuffix, cy, height) {
                var id = this.containerId + "_row_" + idSuffix;
                this.svg.append("g").attr("id", id);
                var surface = new DrawingSurface(id)
                    .setWidth(this._width)
                    .setHeight(height)
                    .setY(cy - height / 2);
                return surface;
            };
            DrawingSurface.prototype.addSurface = function (idSuffix, x, y, width, height) {
                var id = this.containerId + "_" + idSuffix;
                this.svg.append("g").attr("id", id);
                var surface = new DrawingSurface(id)
                    .setWidth(width)
                    .setHeight(height)
                    .setX(x)
                    .setY(y);
                return surface;
            };
            DrawingSurface.prototype.marginFromRatio = function (marginRatio) {
                return {
                    bottom: this._height * marginRatio.bottom,
                    left: this._width * marginRatio.left,
                    right: this._width * marginRatio.right,
                    top: this._height * marginRatio.top
                };
            };
            return DrawingSurface;
        }());
        core.DrawingSurface = DrawingSurface;
    })(core = semio.core || (semio.core = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var core;
    (function (core) {
        var PlotContext = (function () {
            function PlotContext() {
                this._categoryColours = {};
                this._categoryValues = {};
                this._numericRange = {};
                this._slicedColumns = {};
                this._yScale = {};
                this._xScale = {};
            }
            PlotContext.prototype.setCategoryValues = function (column, values) {
                var clone = this.clone();
                clone._categoryValues[column] = values.slice(0);
                return clone;
            };
            PlotContext.prototype.setCategoryColours = function (column, colours) {
                var clone = this.clone();
                clone._categoryColours[column] = colours;
                return clone;
            };
            PlotContext.prototype.setNumericRange = function (column, range) {
                var clone = this.clone();
                clone._numericRange[column] = range;
                return clone;
            };
            PlotContext.prototype.setSlicedColumnValue = function (column, value) {
                var clone = this.clone();
                clone._slicedColumns[column] = value;
                return clone;
            };
            PlotContext.prototype.setXScale = function (column, scale) {
                var clone = this.clone();
                clone._xScale[column] = scale;
                return clone;
            };
            PlotContext.prototype.setYScale = function (column, scale) {
                var clone = this.clone();
                clone._yScale[column] = scale;
                return clone;
            };
            PlotContext.prototype.setTooltip = function (tooltip) {
                var clone = this.clone();
                clone._tooltip = tooltip;
                return clone;
            };
            PlotContext.prototype.getCategoryValues = function (column) {
                return this._categoryValues[column];
            };
            PlotContext.prototype.getCategoryColours = function (column) {
                return this._categoryColours[column];
            };
            PlotContext.prototype.getNumericRange = function (column) {
                return this._numericRange[column];
            };
            PlotContext.prototype.fixNumericRangeIfNotFixed = function (data, column) {
                if (!this._numericRange[column]) {
                    var extent = d3.extent(data, function (d) { return +d[column]; });
                    return this.setNumericRange(column, extent);
                }
                return this;
            };
            PlotContext.prototype.getOrCalculateNumericRange = function (data, column) {
                return this._numericRange[column] || d3.extent(data, function (d) { return +d[column]; });
            };
            PlotContext.prototype.getSlicedColumns = function () {
                return _.keys(this._slicedColumns);
            };
            PlotContext.prototype.getSlicedColumnValue = function (column) {
                return this._slicedColumns[column];
            };
            PlotContext.prototype.getXScale = function (column) {
                return this._xScale[column];
            };
            PlotContext.prototype.getYScale = function (column) {
                return this._yScale[column];
            };
            PlotContext.prototype.getTooltip = function () {
                return this._tooltip;
            };
            PlotContext.prototype.clone = function () {
                var clone = new PlotContext();
                clone._categoryColours = _.clone(this._categoryColours);
                clone._categoryValues = _.clone(this._categoryValues);
                clone._numericRange = _.clone(this._numericRange);
                clone._slicedColumns = _.clone(this._slicedColumns);
                clone._yScale = _.clone(this._yScale);
                clone._xScale = _.clone(this._xScale);
                clone._tooltip = this._tooltip;
                return this;
            };
            return PlotContext;
        }());
        core.PlotContext = PlotContext;
    })(core = semio.core || (semio.core = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var core;
    (function (core) {
        var PlotTooltip = (function () {
            function PlotTooltip(containerId) {
                this.containerId = containerId;
                this._container = d3.select("#" + containerId);
                this._tooltip = this._container
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .style("background", "#eee")
                    .style("text-align", "left")
                    .style("box-shadow", "0 0 5px #999999")
                    .style("padding", "10px");
            }
            PlotTooltip.prototype.addOn = function (selection, html) {
                var that = this;
                return selection.on("mouseover", function (d) {
                    return that._tooltip
                        .style("visibility", "visible")
                        .html(html(d));
                })
                    .on("mousemove", function (d) {
                    var mouse = d3.mouse(document.body);
                    return that._tooltip
                        .style("top", (mouse[1] - 10) + "px")
                        .style("left", (mouse[0] + 20) + "px");
                })
                    .on("mouseout", function (d) {
                    return that._tooltip.style("visibility", "hidden");
                });
            };
            return PlotTooltip;
        }());
        core.PlotTooltip = PlotTooltip;
    })(core = semio.core || (semio.core = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var ColorPalette = semio.core.ColorPalette;
    var DrawingSurface = semio.core.DrawingSurface;
    var PlotContext = semio.core.PlotContext;
    var PlotTooltip = semio.core.PlotTooltip;
    var Visualization = (function () {
        function Visualization(containerId) {
            this.containerId = containerId;
            this._width = 800;
            this._height = 800;
        }
        Visualization.prototype.width = function (width) {
            this._width = width;
            return this;
        };
        Visualization.prototype.height = function (height) {
            this._height = height;
            return this;
        };
        Visualization.prototype.add = function (plotable) {
            this._plotable = plotable;
            return this;
        };
        Visualization.prototype.plot = function (data) {
            if (!data || !this._plotable) {
                return;
            }
            var surface = new DrawingSurface(this.containerId)
                .setWidth(this._width)
                .setHeight(this._height);
            var context = new PlotContext();
            var tooltip = new PlotTooltip(this.containerId);
            context = context.setTooltip(tooltip);
            var colorsOffset = 0;
            this._plotable.getCategoricalColumns().forEach(function (column) {
                var values = d3.set(data.map(function (d) { return d[column]; })).values();
                context = context.setCategoryValues(column, values);
                var colors = ColorPalette.qualitative(values, colorsOffset);
                colorsOffset += values.length;
                context = context.setCategoryColours(column, colors);
            });
            this._plotable.plot(data, surface, context);
        };
        return Visualization;
    }());
    semio.Visualization = Visualization;
})(semio || (semio = {}));
var semio;
(function (semio) {
    var math;
    (function (math) {
        var Extent = (function () {
            function Extent() {
            }
            Extent.widen = function (extent, times) {
                var a = extent[0];
                var b = extent[1];
                var range = b - a;
                var delta = range * times / 2;
                return [a - delta, b + delta];
            };
            return Extent;
        }());
        math.Extent = Extent;
    })(math = semio.math || (semio.math = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var shape;
    (function (shape) {
        var Text = (function () {
            function Text() {
            }
            Text.placeTitle = function (surface, text) {
                surface.svg.append("text")
                    .attr("x", surface.getWidth() / 2)
                    .attr("y", surface.getHeight() / 2)
                    .attr("text-anchor", "middle")
                    .attr("font-size", surface.getHeight() / 2)
                    .text(text);
            };
            Text.placeVerticalText = function (surface, text) {
                var cx = surface.getWidth() / 2;
                var cy = surface.getHeight() / 2;
                surface.svg.append("text")
                    .attr("text-anchor", "middle")
                    .attr("font-size", surface.getWidth() * 0.7)
                    .attr("transform", "translate(" + cx + "," + cy + ") rotate(-90)")
                    .text(text);
            };
            return Text;
        }());
        shape.Text = Text;
    })(shape = semio.shape || (semio.shape = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var shape;
    (function (shape) {
        var Text = semio.shape.Text;
        var Legend = (function () {
            function Legend() {
                this._horizontalSpacingRatio = 0.1;
                this._columns = [];
            }
            Legend.prototype.addColumn = function (column) {
                if (column) {
                    this._columns.push(column);
                }
                return this;
            };
            Legend.prototype.draw = function (surface, context) {
                if (!this._columns) {
                    return;
                }
                var nColumns = this._columns.length;
                var subSurfaces = surface.splitRows(nColumns, this._horizontalSpacingRatio);
                for (var i = 0; i < nColumns; i++) {
                    var column = this._columns[i];
                    var subSurface = subSurfaces[i];
                    this.drawLegend(column, subSurface, context);
                }
            };
            Legend.prototype.drawLegend = function (column, surface, context) {
                var split = surface.splitLeftRight(0.7);
                Text.placeVerticalText(split.right, column);
                var legendSurface = split.left;
                var colors = context.getCategoryColours(column);
                var values = context.getCategoryValues(column);
                var blockHeight = legendSurface.getHeight() / (values.length + 1);
                var rects = legendSurface.svg.append("g")
                    .selectAll("rect")
                    .data(values)
                    .enter()
                    .append("rect")
                    .attr("width", legendSurface.getWidth() * 0.8)
                    .attr("height", blockHeight * 0.8)
                    .attr("x", legendSurface.getWidth() * 0.1)
                    .attr("y", function (d, i) { return (i + 0.6) * blockHeight; })
                    .attr("fill", function (d) { return colors(d); });
                context.getTooltip().addOn(rects, function (value) {
                    return column + ": " + value;
                });
            };
            return Legend;
        }());
        shape.Legend = Legend;
    })(shape = semio.shape || (semio.shape = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var ColorPalette = semio.core.ColorPalette;
        var Extent = semio.math.Extent;
        var Legend = semio.shape.Legend;
        var CategoricalPlot = (function () {
            function CategoricalPlot() {
                this._valueExtentWidening = 0.12;
                this._background = "#e6e6e6";
                this._yTickStrokeRatio = 0.05;
                this._marginRatioWithLegend = {
                    bottom: 0.08,
                    left: 0.08,
                    right: 0.12,
                    top: 0.02
                };
                this._marginRatioWithoutLegend = {
                    bottom: 0.08,
                    left: 0.08,
                    right: 0.02,
                    top: 0.02
                };
                this._plotables = [];
            }
            CategoricalPlot.prototype.background = function (colour) {
                this._background = colour;
                return this;
            };
            CategoricalPlot.prototype.value = function (column) {
                this._valueColumn = column;
                this._numericAccessor = function (d) {
                    return +d[column];
                };
                return this;
            };
            CategoricalPlot.prototype.splitOn = function (column) {
                this._splitOnColumn = column;
                this._categoricalAccessor = function (d) {
                    return d[column].toString();
                };
                return this;
            };
            CategoricalPlot.prototype.marginRatio = function (marginRatio) {
                this._marginRatioOverride = marginRatio;
                return this;
            };
            CategoricalPlot.prototype.getCategoricalColumns = function () {
                var columns = [];
                this._plotables.forEach(function (pl) {
                    columns = columns.concat(pl.getCategoricalColumns());
                });
                columns.push(this._splitOnColumn);
                return _.union(columns);
            };
            CategoricalPlot.prototype.getNumericColumns = function () {
                if (this._valueColumn) {
                    return [this._valueColumn];
                }
                return [];
            };
            CategoricalPlot.prototype.add = function (plotable) {
                this._plotables.push(plotable);
                return this;
            };
            CategoricalPlot.prototype.plot = function (data, surface, context) {
                var _this = this;
                if (!data) {
                    return;
                }
                var legendColumns = [];
                this._plotables.forEach(function (pl) {
                    pl.value(_this._valueColumn).splitOn(_this._splitOnColumn);
                    var legendCol = pl.getLegendColumn();
                    if (legendCol) {
                        legendColumns.push(legendCol);
                    }
                });
                var marginRatio = this._marginRatioOverride ||
                    (legendColumns.length ? this._marginRatioWithLegend : this._marginRatioWithoutLegend);
                var plotAreaX = marginRatio.left * surface.getWidth();
                var plotAreaY = marginRatio.top * surface.getHeight();
                var plotAreaWidth = (1 - marginRatio.left - marginRatio.right) * surface.getWidth();
                var plotAreaHeight = (1 - marginRatio.top - marginRatio.bottom) * surface.getHeight();
                var xAxisAreaHeight = marginRatio.bottom * surface.getHeight();
                var yAxisAreaWidth = marginRatio.left * surface.getWidth();
                surface.svg.append("g")
                    .append("rect")
                    .attr("width", plotAreaWidth)
                    .attr("height", plotAreaHeight)
                    .attr("x", plotAreaX)
                    .attr("y", plotAreaY)
                    .attr("fill", this._background);
                var yExtent = context.getOrCalculateNumericRange(data, this._valueColumn);
                yExtent = Extent.widen(yExtent, this._valueExtentWidening);
                var yScale = d3.scale.linear()
                    .domain(yExtent)
                    .range([plotAreaHeight, 0]);
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickSize(-plotAreaWidth, 0);
                var yAxisGroup = surface.svg.append("g")
                    .attr("transform", "translate(" + plotAreaX + "," + plotAreaY + ")")
                    .call(yAxis);
                yAxisGroup.selectAll(".tick line")
                    .style({
                    "stroke": "white",
                    "stroke-width": plotAreaHeight * this._yTickStrokeRatio / yAxis.ticks()[0]
                });
                yAxisGroup.selectAll(".tick text")
                    .attr("font-size", yAxisAreaWidth / 3);
                surface.svg.append("svg").append("text")
                    .attr("font-size", yAxisAreaWidth / 3)
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + yAxisAreaWidth / 4 + "," + (plotAreaY + plotAreaHeight / 2) + ")rotate(-90)")
                    .text(this._valueColumn);
                var updatedContext = context.setYScale(this._valueColumn, yScale);
                if (this._splitOnColumn) {
                    var categories = context.getCategoryValues(this._splitOnColumn);
                    var categoryColor = context.getCategoryColours(this._splitOnColumn) || ColorPalette.qualitative(categories);
                    var categoryWidth = plotAreaWidth / categories.length;
                    var xScale = d3.scale.ordinal()
                        .domain(categories)
                        .rangePoints([categoryWidth / 2, plotAreaWidth - categoryWidth / 2]);
                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .tickSize(0);
                    var xAxisGroup = surface.svg.append("g")
                        .attr("transform", "translate(" + plotAreaX + "," + (plotAreaY + plotAreaHeight) + ")")
                        .call(xAxis);
                    xAxisGroup.selectAll(".tick text")
                        .attr("font-size", xAxisAreaHeight / 3);
                    surface.svg.append("g").append("text")
                        .attr("font-size", xAxisAreaHeight / 3)
                        .attr("text-anchor", "middle")
                        .attr("transform", "translate(" + (plotAreaX + plotAreaWidth / 2) + "," +
                        (plotAreaY + plotAreaHeight + xAxisAreaHeight * 3 / 4) + ")")
                        .text(this._splitOnColumn);
                    updatedContext = updatedContext.setXScale(this._splitOnColumn, xScale);
                }
                var plotSurface = surface.addSurface("plotablearea", plotAreaX, plotAreaY, plotAreaWidth, plotAreaHeight);
                this._plotables.forEach(function (pl) {
                    pl.plot(data, plotSurface, updatedContext);
                });
                if (legendColumns) {
                    var legendAreaX = (1 - marginRatio.right) * surface.getWidth();
                    var legendAreaY = plotAreaY;
                    var legendAreaWidth = marginRatio.right * surface.getWidth();
                    var legendAreaHeight = plotAreaHeight;
                    var legendSurface = surface.addSurface("legendarea", legendAreaX, legendAreaY, legendAreaWidth, legendAreaHeight);
                    var legend_1 = new Legend();
                    legendColumns.forEach(function (col) { return legend_1.addColumn(col); });
                    legend_1.draw(legendSurface, context);
                }
            };
            return CategoricalPlot;
        }());
        chart.CategoricalPlot = CategoricalPlot;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var ChordDiagram = (function () {
            function ChordDiagram() {
            }
            ChordDiagram.prototype.getCategoricalColumns = function () {
                return [];
            };
            ChordDiagram.prototype.getNumericColumns = function () {
                return [];
            };
            ChordDiagram.prototype.plot = function (data, surface, context) {
                if (!data) {
                    return;
                }
            };
            return ChordDiagram;
        }());
        chart.ChordDiagram = ChordDiagram;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var CirclePack = (function () {
            function CirclePack() {
            }
            CirclePack.prototype.getCategoricalColumns = function () {
                return [];
            };
            CirclePack.prototype.getNumericColumns = function () {
                return [];
            };
            CirclePack.prototype.plot = function (data, surface, context) {
                if (!data) {
                    return;
                }
            };
            return CirclePack;
        }());
        chart.CirclePack = CirclePack;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var ColorPalette = semio.core.ColorPalette;
        var HeatMap = (function () {
            function HeatMap() {
                this._delay = 500;
                this._marginRatio = {
                    bottom: 0.02,
                    left: 0.16,
                    right: 0.02,
                    top: 0.16
                };
            }
            HeatMap.prototype.delay = function (delay) {
                this._delay = delay;
                return this;
            };
            HeatMap.prototype.xColumn = function (column) {
                this._xColumn = column;
                return this;
            };
            HeatMap.prototype.yColumn = function (column) {
                this._yColumn = column;
                return this;
            };
            HeatMap.prototype.areaColumn = function (column) {
                this._areaColumn = column;
                return this;
            };
            HeatMap.prototype.colorColumn = function (column) {
                this._colorColumn = column;
                return this;
            };
            HeatMap.prototype.marginRatio = function (marginRatio) {
                this._marginRatio = marginRatio;
                return this;
            };
            HeatMap.prototype.getCategoricalColumns = function () {
                return _.filter([this._xColumn, this._yColumn], _.negate(_.isNil));
            };
            HeatMap.prototype.getNumericColumns = function () {
                return _.filter([this._areaColumn, this._colorColumn], _.negate(_.isNil));
            };
            HeatMap.prototype.plot = function (data, surface, context) {
                var _this = this;
                if (!data) {
                    return;
                }
                var margin = surface.marginFromRatio(this._marginRatio);
                var width = surface.getWidth() - margin.left - margin.right;
                var height = surface.getHeight() - margin.top - margin.bottom;
                var xNames = _.chain(data).map(function (d) { return d[_this._xColumn]; }).uniq().value();
                var yNames = _.chain(data).map(function (d) { return d[_this._yColumn]; }).uniq().value();
                var xScale = d3.scale.ordinal().rangeBands([0, width]).domain(xNames);
                var yScale = d3.scale.ordinal().rangeBands([0, height]).domain(yNames);
                var xAxis = d3.svg.axis().orient("top").scale(xScale);
                var yAxis = d3.svg.axis().orient("left").scale(yScale);
                var plotableArea = surface.svg
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                var xAxisGroup = plotableArea.append("g")
                    .attr("class", "x axis")
                    .call(xAxis);
                xAxisGroup.selectAll("text")
                    .attr("y", -10)
                    .attr("dy", ".5em")
                    .attr("x", 0)
                    .attr("transform", "rotate(-45)")
                    .style("text-anchor", "start")
                    .style("font-weight", "bold");
                this.styleAxis(xAxisGroup);
                var yAxisGroup = plotableArea.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);
                yAxisGroup.selectAll("text")
                    .style("text-anchor", "end");
                this.styleAxis(yAxisGroup);
                var tileWidth = width / xNames.length;
                var tileHeight = height / yNames.length;
                var colorColumnExtent = context.getOrCalculateNumericRange(data, this._colorColumn);
                var color = ColorPalette.sequential(colorColumnExtent);
                var lightestColor = color(colorColumnExtent[0]);
                var tiles;
                if (this._areaColumn) {
                    var maxRadius = d3.min([tileWidth, tileHeight]) / 2;
                    var sizeColumnExtent = context.getOrCalculateNumericRange(data, this._areaColumn);
                    var areaScale_1 = d3.scale.linear().domain([0, sizeColumnExtent[1]]).range([0, maxRadius * maxRadius]);
                    tiles = plotableArea.selectAll(".tile")
                        .data(data)
                        .enter().append("circle")
                        .attr("class", "tile")
                        .attr("cx", function (d) { return tileWidth / 2 + xScale(d[_this._xColumn]); })
                        .attr("cy", function (d) { return tileHeight / 2 + yScale(d[_this._yColumn]); })
                        .attr("r", function (d) { return 0; })
                        .style("fill", function (d) { return color(d[_this._colorColumn]); });
                    tiles.transition()
                        .delay(this._delay)
                        .attr("r", function (d) { return Math.sqrt(areaScale_1(d[_this._areaColumn])); });
                }
                else {
                    tiles = plotableArea.selectAll(".tile")
                        .data(data)
                        .enter().append("rect")
                        .attr("class", "tile")
                        .attr("x", function (d) { return xScale(d[_this._xColumn]); })
                        .attr("y", function (d) { return yScale(d[_this._yColumn]); })
                        .attr("width", tileWidth)
                        .attr("height", tileHeight)
                        .style("fill", lightestColor);
                    tiles.transition()
                        .delay(this._delay)
                        .style("fill", function (d) { return color(d[_this._colorColumn]); });
                }
                var tooltipColumns = [this._yColumn, this._xColumn, this._colorColumn, this._areaColumn];
                tooltipColumns = _.filter(tooltipColumns, _.negate(_.isNil));
                context.getTooltip().addOn(tiles, function (d) {
                    return tooltipColumns.map(function (col) { return col + ": " + d[col]; }).join("<br/>");
                });
            };
            HeatMap.prototype.styleAxis = function (axisGroup) {
                axisGroup.selectAll(".axis path")
                    .style({
                    "fill": "none",
                    "stroke": "none"
                });
            };
            return HeatMap;
        }());
        chart.HeatMap = HeatMap;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var Legend = semio.shape.Legend;
        var Plot2D = (function () {
            function Plot2D() {
                this._valueExtentWidening = 0.12;
                this._background = "#e6e6e6";
                this._xTickStrokeRatio = 0.05;
                this._yTickStrokeRatio = 0.05;
                this._marginRatioWithLegend = {
                    bottom: 0.08,
                    left: 0.08,
                    right: 0.12,
                    top: 0.02
                };
                this._marginRatioWithoutLegend = {
                    bottom: 0.08,
                    left: 0.08,
                    right: 0.02,
                    top: 0.02
                };
                this._plotables = [];
            }
            Plot2D.prototype.background = function (colour) {
                this._background = colour;
                return this;
            };
            Plot2D.prototype.xColumn = function (column) {
                this._xColumn = column;
                return this;
            };
            Plot2D.prototype.yColumn = function (column) {
                this._yColumn = column;
                return this;
            };
            Plot2D.prototype.marginRatio = function (marginRatio) {
                this._marginRatioOverride = marginRatio;
                return this;
            };
            Plot2D.prototype.add = function (plotable) {
                this._plotables.push(plotable);
                return this;
            };
            Plot2D.prototype.getCategoricalColumns = function () {
                var columns = _.flatMap(this._plotables, function (pl) { return pl.getCategoricalColumns(); });
                return _.union(columns);
            };
            Plot2D.prototype.getNumericColumns = function () {
                var columns1 = [this._xColumn, this._yColumn];
                var columns2 = _.flatMap(this._plotables, function (pl) { return pl.getNumericColumns(); });
                return _.union(columns1, columns2);
            };
            Plot2D.prototype.plot = function (data, surface, context) {
                var _this = this;
                if (!data) {
                    return;
                }
                var legendColumns = [];
                this._plotables.forEach(function (pl) {
                    var legendCol = pl.getLegendColumn();
                    if (legendCol) {
                        legendColumns.push(legendCol);
                    }
                });
                var marginRatio = this._marginRatioOverride ||
                    (legendColumns.length ? this._marginRatioWithLegend : this._marginRatioWithoutLegend);
                var plotAreaX = marginRatio.left * surface.getWidth();
                var plotAreaY = marginRatio.top * surface.getHeight();
                var plotAreaWidth = (1 - marginRatio.left - marginRatio.right) * surface.getWidth();
                var plotAreaHeight = (1 - marginRatio.top - marginRatio.bottom) * surface.getHeight();
                var xAxisAreaHeight = marginRatio.bottom * surface.getHeight();
                var yAxisAreaWidth = marginRatio.left * surface.getWidth();
                var xColumnExtent = context.getOrCalculateNumericRange(data, this._xColumn);
                var yColumnExtent = context.getOrCalculateNumericRange(data, this._yColumn);
                var xPadding = d3.max(this._plotables.map(function (pl) { return pl.getXPadding(); }));
                var yPadding = d3.max(this._plotables.map(function (pl) { return pl.getYPadding(); }));
                var xScale = d3.scale.linear()
                    .domain(xColumnExtent)
                    .range([0 + 2 * xPadding, plotAreaWidth - 2 * xPadding]);
                var yScale = d3.scale.linear()
                    .domain(yColumnExtent)
                    .range([plotAreaHeight - 2 * yPadding, 0 + 2 * yPadding]);
                surface.svg.append("g")
                    .append("rect")
                    .attr("width", plotAreaWidth)
                    .attr("height", plotAreaHeight)
                    .attr("x", plotAreaX)
                    .attr("y", plotAreaY)
                    .attr("fill", this._background);
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickSize(-plotAreaHeight, 0);
                var xAxisGroup = surface.svg.append("g")
                    .attr("transform", "translate(" + plotAreaX + "," + (plotAreaY + plotAreaHeight) + ")")
                    .call(xAxis);
                xAxisGroup.selectAll(".tick line")
                    .style({
                    "stroke": "white",
                    "stroke-width": plotAreaWidth * this._xTickStrokeRatio / xAxis.ticks()[0]
                });
                xAxisGroup.selectAll(".tick text")
                    .attr("font-size", xAxisAreaHeight / 3);
                surface.svg.append("svg").append("text")
                    .attr("font-size", xAxisAreaHeight / 3)
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + (plotAreaX + plotAreaWidth / 2) + "," +
                    (plotAreaY + plotAreaHeight + xAxisAreaHeight * 3 / 4) + ")")
                    .text(this._xColumn);
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickSize(-plotAreaWidth, 0);
                var yAxisGroup = surface.svg.append("g")
                    .attr("transform", "translate(" + plotAreaX + "," + plotAreaY + ")")
                    .call(yAxis);
                yAxisGroup.selectAll(".tick line")
                    .style({
                    "stroke": "white",
                    "stroke-width": plotAreaHeight * this._yTickStrokeRatio / yAxis.ticks()[0]
                });
                yAxisGroup.selectAll(".tick text")
                    .attr("font-size", yAxisAreaWidth / 3);
                surface.svg.append("svg").append("text")
                    .attr("font-size", yAxisAreaWidth / 3)
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + yAxisAreaWidth / 4 + "," + (plotAreaY + plotAreaHeight / 2) + ")rotate(-90)")
                    .text(this._yColumn);
                var updatedContext = context.setXScale(this._xColumn, xScale)
                    .setYScale(this._yColumn, yScale);
                var plotSurface = surface.addSurface("plotablearea", plotAreaX, plotAreaY, plotAreaWidth, plotAreaHeight);
                this._plotables.forEach(function (pl) {
                    pl.xColumn(_this._xColumn)
                        .yColumn(_this._yColumn)
                        .plot(data, plotSurface, updatedContext);
                });
                if (legendColumns) {
                    var legendAreaX = (1 - marginRatio.right) * surface.getWidth();
                    var legendAreaY = plotAreaY;
                    var legendAreaWidth = marginRatio.right * surface.getWidth();
                    var legendAreaHeight = plotAreaHeight;
                    var legendSurface = surface.addSurface("legendarea", legendAreaX, legendAreaY, legendAreaWidth, legendAreaHeight);
                    var legend_2 = new Legend();
                    legendColumns.forEach(function (col) { return legend_2.addColumn(col); });
                    legend_2.draw(legendSurface, context);
                }
            };
            return Plot2D;
        }());
        chart.Plot2D = Plot2D;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var RadarChart = (function () {
            function RadarChart() {
            }
            RadarChart.prototype.dimensionColumns = function (columns) {
                this._dimensionColumns = columns;
                return this;
            };
            RadarChart.prototype.getCategoricalColumns = function () {
                return [];
            };
            RadarChart.prototype.getNumericColumns = function () {
                return [];
            };
            RadarChart.prototype.plot = function (data, surface, context) {
                if (!data) {
                    return;
                }
            };
            return RadarChart;
        }());
        chart.RadarChart = RadarChart;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var SankeyDiagram = (function () {
            function SankeyDiagram() {
            }
            SankeyDiagram.prototype.sourceColumn = function (column) {
                this._sourceColumn = column;
                return this;
            };
            SankeyDiagram.prototype.targetColumn = function (column) {
                this._targetColumn = column;
                return this;
            };
            SankeyDiagram.prototype.valueColumn = function (column) {
                this._valueColumn = column;
                return this;
            };
            SankeyDiagram.prototype.getCategoricalColumns = function () {
                return [];
            };
            SankeyDiagram.prototype.getNumericColumns = function () {
                return [];
            };
            SankeyDiagram.prototype.plot = function (data, surface, context) {
                if (!data) {
                    return;
                }
            };
            return SankeyDiagram;
        }());
        chart.SankeyDiagram = SankeyDiagram;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var Text = semio.shape.Text;
        var SmallMultiple = (function () {
            function SmallMultiple() {
                this._headerRatio = 0.1;
                this._horizontalSpacingRatio = 0.05;
                this._verticalSpacingRatio = 0.05;
            }
            SmallMultiple.prototype.maxColumns = function (maxColumns) {
                this._maxColumns = maxColumns;
                return this;
            };
            SmallMultiple.prototype.splitOn = function (column) {
                this._categoricalAccessor = function (d) {
                    return d[column].toString();
                };
                this._splitOnColumn = column;
                return this;
            };
            SmallMultiple.prototype.headerRatio = function (ratio) {
                this._headerRatio = ratio;
                return this;
            };
            SmallMultiple.prototype.horizontalSpacingRatio = function (ratio) {
                this._horizontalSpacingRatio = ratio;
                return this;
            };
            SmallMultiple.prototype.verticalSpacingRatio = function (ratio) {
                this._verticalSpacingRatio = ratio;
                return this;
            };
            SmallMultiple.prototype.getCategoricalColumns = function () {
                var columns = this._plotable.getCategoricalColumns().slice(0);
                columns.push(this._splitOnColumn);
                return columns;
            };
            SmallMultiple.prototype.getNumericColumns = function () {
                return this._plotable.getNumericColumns().slice(0);
            };
            SmallMultiple.prototype.add = function (plotable) {
                this._plotable = plotable;
                return this;
            };
            SmallMultiple.prototype.plot = function (data, surface, context) {
                var _this = this;
                if (!data || !this._plotable) {
                    return;
                }
                var groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
                var categories = groupedData.map(function (g) { return g.key; });
                var subSurfaces = surface.splitGrid(categories.length, this._maxColumns, this._horizontalSpacingRatio, this._verticalSpacingRatio);
                var updatedContext = this.fixNumericRanges(data, context);
                categories.forEach(function (cat, i) {
                    var splitSurface = subSurfaces[i].splitHeader(_this._headerRatio);
                    var title = _this._splitOnColumn + ": " + cat;
                    Text.placeTitle(splitSurface.header, title);
                    var updatedContextWithSlice = updatedContext.setSlicedColumnValue(_this._splitOnColumn, cat);
                    _this._plotable.plot(groupedData[i].values, splitSurface.body, updatedContextWithSlice);
                });
            };
            SmallMultiple.prototype.fixNumericRanges = function (data, context) {
                var newContext = context;
                this._plotable.getNumericColumns().forEach(function (col) {
                    newContext = newContext.fixNumericRangeIfNotFixed(data, col);
                });
                return newContext;
            };
            return SmallMultiple;
        }());
        chart.SmallMultiple = SmallMultiple;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var TreeMap = (function () {
            function TreeMap() {
            }
            TreeMap.prototype.getCategoricalColumns = function () {
                return [];
            };
            TreeMap.prototype.getNumericColumns = function () {
                return [];
            };
            TreeMap.prototype.plot = function (data, surface, context) {
                if (!data) {
                    return;
                }
            };
            return TreeMap;
        }());
        chart.TreeMap = TreeMap;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var math;
    (function (math) {
        var Kde = (function () {
            function Kde() {
            }
            Kde.estimate = function (kernel, sample, bandwidth, support) {
                var estimator = Kde.estimator(kernel, sample, bandwidth);
                return support.map(function (v) {
                    return { density: estimator(v), value: v };
                });
            };
            Kde.estimator = function (kernel, sample, bandwidth) {
                return function (x) {
                    return d3.mean(sample, function (s) { return kernel((x - s) / bandwidth); }) / bandwidth;
                };
            };
            Kde.epanechnikovKernel = function (x) {
                return Math.abs(x) <= 1 ? 0.75 * (1 - x * x) : 0;
            };
            return Kde;
        }());
        math.Kde = Kde;
    })(math = semio.math || (semio.math = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var shape;
    (function (shape) {
        var SwarmPoint = (function () {
            function SwarmPoint(datum, x, y, color) {
                this.datum = datum;
                this.x = x;
                this.y = y;
                this.color = color;
            }
            SwarmPoint.prototype.setX = function (newX) {
                return new SwarmPoint(this.datum, newX, this.y, this.color);
            };
            SwarmPoint.prototype.distance = function (p) {
                var dx = p.x - this.x;
                var dy = p.y - this.y;
                return Math.sqrt(dx * dx + dy * dy);
            };
            SwarmPoint.prototype.placeNextTo = function (p, diameter) {
                var dy = p.y - this.y;
                var dx = Math.sqrt(diameter * diameter - dy * dy) * 1.1;
                return [this.setX(p.x - dx), this.setX(p.x + dx)];
            };
            return SwarmPoint;
        }());
        var VerticalSwarm = (function () {
            function VerticalSwarm() {
            }
            VerticalSwarm.prototype.value = function (column) {
                this._valueColumn = column;
                this._numericAccessor = function (d) {
                    return +d[column];
                };
                return this;
            };
            VerticalSwarm.prototype.color = function (column) {
                this._colorColumn = column;
                return this;
            };
            VerticalSwarm.prototype.id = function (column) {
                this._idColumn = column;
                return this;
            };
            VerticalSwarm.prototype.diameter = function (diameter) {
                this._diameter = diameter;
                return this;
            };
            VerticalSwarm.prototype.delay = function (delay) {
                this._delay = delay;
                return this;
            };
            VerticalSwarm.prototype.draw = function (data, surface, context) {
                var _this = this;
                var that = this;
                var centre = surface.getWidth() / 2;
                var yScale = context.getYScale(this._valueColumn);
                var colors = context.getCategoryColours(this._colorColumn);
                var startingPositions = _.chain(data).map(function (d) {
                    return new SwarmPoint(d, centre, yScale(_this._numericAccessor(d)), colors(d[_this._colorColumn]));
                }).orderBy(function (p) { return -p.y; }).value();
                var swarm = [];
                startingPositions.forEach(function (p) {
                    var neighbors = _.chain(swarm).filter(function (p2) { return Math.abs(p.y - p2.y) < _this._diameter; })
                        .sortBy(function (p) { return Math.abs(p.x - centre); })
                        .value();
                    swarm.push(_this.findPosition(p, neighbors, centre));
                });
                var startingX = function (d) { return centre; };
                var startingY = function (d) { return _this._diameter / 2; };
                var circles = surface.svg.append("g")
                    .selectAll("circle")
                    .data(swarm)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) { return startingX(d); })
                    .attr("cy", function (d) { return startingY(d); })
                    .attr("r", this._diameter / 2)
                    .style("fill", function (d) { return d.color; });
                var tooltipColumns = [];
                if (that._idColumn) {
                    tooltipColumns.push(that._idColumn);
                }
                tooltipColumns.push(that._valueColumn);
                tooltipColumns.push(that._colorColumn);
                context.getSlicedColumns().forEach(function (column) {
                    tooltipColumns.push(column);
                });
                context.getTooltip().addOn(circles, function (swarmPoint) {
                    return tooltipColumns.map(function (col) { return col + ": " + swarmPoint.datum[col]; }).join("<br/>");
                });
                var circleCount = swarm.length;
                circles.transition()
                    .delay(function (d, i) { return i * _this._delay / circleCount; })
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; });
            };
            VerticalSwarm.prototype.findPosition = function (p, neighbors, centre) {
                var _this = this;
                var candidatePositions = _.flatMap(neighbors, function (n) { return p.placeNextTo(n, _this._diameter); });
                candidatePositions.push(p);
                var goodCandidates = _.chain(candidatePositions)
                    .filter(function (c) { return _.findIndex(neighbors, function (n) { return c.distance(n) < _this._diameter; }) === -1; })
                    .sortBy(function (c) { return Math.abs(c.x - centre); })
                    .value();
                return goodCandidates[0];
            };
            return VerticalSwarm;
        }());
        shape.VerticalSwarm = VerticalSwarm;
    })(shape = semio.shape || (semio.shape = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var shape;
    (function (shape) {
        var Kde = semio.math.Kde;
        var VerticalViolin = (function () {
            function VerticalViolin() {
                this._defaultFill = "#1f77b4";
                this._extend = 1;
            }
            VerticalViolin.prototype.value = function (column) {
                this._valueColumn = column;
                this._numericAccessor = function (d) {
                    return +d[column];
                };
                return this;
            };
            VerticalViolin.prototype.fill = function (fill) {
                this._fill = fill;
                return this;
            };
            VerticalViolin.prototype.extend = function (extend) {
                this._extend = extend;
                return this;
            };
            VerticalViolin.prototype.bandwidth = function (bandwidth) {
                this._bandwidth = bandwidth;
                return this;
            };
            VerticalViolin.prototype.delay = function (delay) {
                this._delay = delay;
                return this;
            };
            VerticalViolin.prototype.preDraw = function (data) {
                if (!data) {
                    return;
                }
                var values = data.map(this._numericAccessor);
                if (!this._bandwidth) {
                    this._bandwidth = 1.06 * d3.deviation(values) / Math.pow(values.length, 0.2);
                }
                var yMin = d3.min(data, this._numericAccessor);
                var yMax = d3.max(data, this._numericAccessor);
                var support = _.range(yMin - this._extend * this._bandwidth / 2, yMax + this._extend * this._bandwidth / 2, this._bandwidth / 10);
                var kernel = Kde.epanechnikovKernel;
                this._densities = Kde.estimate(kernel, values, this._bandwidth, support);
                this._maxDensity = d3.max(this._densities, function (d) { return d.density; });
                return {
                    count: data.length,
                    maxDensity: this._maxDensity
                };
            };
            VerticalViolin.prototype.draw = function (surface, context, widthRatio) {
                var _this = this;
                if (!this._densities) {
                    return;
                }
                var centre = surface.getWidth() / 2;
                var yScale = context.getYScale(this._valueColumn);
                this._densities.forEach(function (d) {
                    d.density = 0.45 * (surface.getWidth() * widthRatio) * (d.density / _this._maxDensity);
                });
                var area0 = d3.svg.area()
                    .y(function (d) { return yScale(d.value); })
                    .x0(function (d) { return centre - d.density / 100; })
                    .x1(function (d) { return centre + d.density / 100; });
                var area = d3.svg.area()
                    .y(function (d) { return yScale(d.value); })
                    .x0(function (d) { return centre - d.density; })
                    .x1(function (d) { return centre + d.density; });
                var violin = surface.svg.append("g")
                    .append("path")
                    .datum(this._densities)
                    .attr("d", area0)
                    .style("fill", this._fill || this._defaultFill);
                violin.transition()
                    .duration(this._delay)
                    .attr("d", area);
                var tooltipLines = [];
                context.getSlicedColumns().forEach(function (column) {
                    tooltipLines.push(column + ": " + context.getSlicedColumnValue(column));
                });
                if (tooltipLines.length > 0) {
                    context.getTooltip().addOn(violin, function () {
                        return tooltipLines.join("<br/>");
                    });
                }
            };
            return VerticalViolin;
        }());
        shape.VerticalViolin = VerticalViolin;
    })(shape = semio.shape || (semio.shape = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var categorical;
        (function (categorical) {
            var SwarmPlot = (function () {
                function SwarmPlot() {
                    this._diameter = 5;
                    this._delay = 2000;
                }
                SwarmPlot.prototype.value = function (column) {
                    this._valueColumn = column;
                    this._numericAccessor = function (d) {
                        return +d[column];
                    };
                    return this;
                };
                SwarmPlot.prototype.splitOn = function (column) {
                    this._splitOnColumn = column;
                    this._categoricalAccessor = function (d) {
                        return d[column].toString();
                    };
                    return this;
                };
                SwarmPlot.prototype.getLegendColumn = function () {
                    return this._colorColumn;
                };
                SwarmPlot.prototype.color = function (column) {
                    this._colorColumn = column;
                    return this;
                };
                SwarmPlot.prototype.id = function (column) {
                    this._idColumn = column;
                    return this;
                };
                SwarmPlot.prototype.diameter = function (diameter) {
                    this._diameter = diameter;
                    return this;
                };
                SwarmPlot.prototype.delay = function (delay) {
                    this._delay = delay;
                    return this;
                };
                SwarmPlot.prototype.getCategoricalColumns = function () {
                    if (this._colorColumn) {
                        return [this._colorColumn];
                    }
                    return [];
                };
                SwarmPlot.prototype.getNumericColumns = function () {
                    return [];
                };
                SwarmPlot.prototype.plot = function (data, surface, context) {
                    var _this = this;
                    if (!data) {
                        return;
                    }
                    var yScale = context.getYScale(this._valueColumn);
                    if (this._splitOnColumn) {
                        var xScale_1 = context.getXScale(this._splitOnColumn);
                        var categories = context.getCategoryValues(this._splitOnColumn);
                        var categoryWidth_1 = surface.getWidth() / categories.length;
                        var groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
                        _.forOwn(groupedData, function (group) {
                            if (group.values) {
                                var category = group.key;
                                var subSurface = surface
                                    .addCenteredColumn("_swarm_" + category, xScale_1(category), categoryWidth_1);
                                var updatedContext = context.setSlicedColumnValue(_this._splitOnColumn, category);
                                _this.constructVerticalSwarm().draw(group.values, subSurface, context);
                            }
                        });
                    }
                    else {
                        this.constructVerticalSwarm().draw(data, surface, context);
                    }
                };
                SwarmPlot.prototype.constructVerticalSwarm = function () {
                    return new semio.shape.VerticalSwarm()
                        .color(this._colorColumn)
                        .value(this._valueColumn)
                        .diameter(this._diameter)
                        .delay(this._delay)
                        .id(this._idColumn);
                };
                return SwarmPlot;
            }());
            categorical.SwarmPlot = SwarmPlot;
        })(categorical = chart.categorical || (chart.categorical = {}));
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var categorical;
        (function (categorical) {
            var VerticalViolin = semio.shape.VerticalViolin;
            var SCALE_METHOD_WIDTH = "width";
            var SCALE_METHOD_COUNT = "count";
            var SCALE_METHOD_AREA = "area";
            var ViolinPlot = (function () {
                function ViolinPlot() {
                    this._scaleMethod = SCALE_METHOD_WIDTH;
                    this._extend = 1;
                    this._delay = 2000;
                }
                ViolinPlot.prototype.value = function (column) {
                    this._valueColumn = column;
                    this._numericAccessor = function (d) {
                        return +d[column];
                    };
                    return this;
                };
                ViolinPlot.prototype.splitOn = function (column) {
                    this._splitOnColumn = column;
                    this._categoricalAccessor = function (d) {
                        return d[column].toString();
                    };
                    return this;
                };
                ViolinPlot.prototype.getLegendColumn = function () {
                    return this._splitOnColumn;
                };
                ViolinPlot.prototype.scale = function (method) {
                    var methodLower = method.toLowerCase();
                    if (methodLower === SCALE_METHOD_WIDTH) {
                        this._scaleMethod = SCALE_METHOD_WIDTH;
                    }
                    else if (methodLower === SCALE_METHOD_AREA) {
                        this._scaleMethod = SCALE_METHOD_AREA;
                    }
                    return this;
                };
                ViolinPlot.prototype.extend = function (extend) {
                    this._extend = extend;
                    return this;
                };
                ViolinPlot.prototype.delay = function (delay) {
                    this._delay = delay;
                    return this;
                };
                ViolinPlot.prototype.getCategoricalColumns = function () {
                    return [];
                };
                ViolinPlot.prototype.getNumericColumns = function () {
                    return [];
                };
                ViolinPlot.prototype.plot = function (data, surface, context) {
                    var _this = this;
                    if (!data) {
                        return;
                    }
                    var yScale = context.getYScale(this._valueColumn);
                    if (this._splitOnColumn) {
                        var xScale_2 = context.getXScale(this._splitOnColumn);
                        var categories = context.getCategoryValues(this._splitOnColumn);
                        var categoryWidth_2 = surface.getWidth() / categories.length;
                        var groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
                        var preDrawResults_1 = {};
                        var violins_1 = {};
                        _.forOwn(groupedData, function (group) {
                            if (group.values) {
                                var category = group.key;
                                var categoryColor = context.getCategoryColours(_this._splitOnColumn)(category);
                                var violin = _this.constructVerticalViolin().fill(categoryColor);
                                var preDrawResult = violin.preDraw(group.values);
                                preDrawResults_1[category] = preDrawResult;
                                violins_1[category] = violin;
                            }
                        });
                        var scaleForCategory_1 = function (cagetory) { return 1; };
                        if (this._scaleMethod === SCALE_METHOD_COUNT) {
                            var counts = _.values(preDrawResults_1).map(function (d) { return d.count; });
                            var maxCount_1 = d3.max(counts);
                            scaleForCategory_1 = function (category) {
                                return preDrawResults_1[category].count / maxCount_1;
                            };
                        }
                        else if (this._scaleMethod === SCALE_METHOD_AREA) {
                            var maxDensities = _.values(preDrawResults_1).map(function (d) { return d.maxDensity; });
                            var maxMaxDensity_1 = d3.max(maxDensities);
                            scaleForCategory_1 = function (category) {
                                return preDrawResults_1[category].maxDensity / maxMaxDensity_1;
                            };
                        }
                        _.forOwn(groupedData, function (group) {
                            var category = group.key;
                            var subSurface = surface
                                .addCenteredColumn("_violin_" + category, xScale_2(category), categoryWidth_2);
                            var updatedContext = context.setSlicedColumnValue(_this._splitOnColumn, category);
                            violins_1[category].draw(subSurface, updatedContext, scaleForCategory_1(category));
                        });
                    }
                    else {
                        var violin = this.constructVerticalViolin();
                        violin.preDraw(data);
                        violin.draw(surface, context, 1);
                    }
                };
                ViolinPlot.prototype.constructVerticalViolin = function () {
                    return new VerticalViolin()
                        .value(this._valueColumn)
                        .extend(this._extend)
                        .delay(this._delay);
                };
                return ViolinPlot;
            }());
            categorical.ViolinPlot = ViolinPlot;
        })(categorical = chart.categorical || (chart.categorical = {}));
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var plot2d;
        (function (plot2d) {
            var BubbleChart = (function () {
                function BubbleChart() {
                    this._radius = 4;
                }
                BubbleChart.prototype.xColumn = function (column) {
                    this._xColumn = column;
                    this._xAccessor = function (d) { return +d[column]; };
                    return this;
                };
                BubbleChart.prototype.yColumn = function (column) {
                    this._yColumn = column;
                    this._yAccessor = function (d) { return +d[column]; };
                    return this;
                };
                BubbleChart.prototype.colorColumn = function (column) {
                    this._colorColumn = column;
                    return this;
                };
                BubbleChart.prototype.areaColumn = function (column) {
                    this._areaColumn = column;
                    return this;
                };
                BubbleChart.prototype.radius = function (r) {
                    this._radius = r;
                    return this;
                };
                BubbleChart.prototype.getLegendColumn = function () {
                    return this._colorColumn;
                };
                BubbleChart.prototype.getXPadding = function () {
                    return this._radius;
                };
                BubbleChart.prototype.getYPadding = function () {
                    return this._radius;
                };
                BubbleChart.prototype.getCategoricalColumns = function () {
                    return _.filter([this._colorColumn], _.negate(_.isNil));
                };
                BubbleChart.prototype.getNumericColumns = function () {
                    return _.filter([this._xColumn, this._yColumn, this._areaColumn], _.negate(_.isNil));
                };
                BubbleChart.prototype.plot = function (data, surface, context) {
                    var _this = this;
                    if (!data) {
                        return;
                    }
                    var xScale = context.getXScale(this._xColumn);
                    var yScale = context.getYScale(this._yColumn);
                    var xAccessor = function (d) { return +d[_this._xColumn]; };
                    var yAccessor = function (d) { return +d[_this._yColumn]; };
                    var bubbles = surface.svg.selectAll(".bubble")
                        .data(data)
                        .enter().append("circle")
                        .attr("class", "bubble")
                        .attr("cx", function (d) { return xScale(xAccessor(d)); })
                        .attr("cy", function (d) { return yScale(yAccessor(d)); });
                    if (this._colorColumn) {
                        var color_1 = context.getCategoryColours(this._colorColumn);
                        bubbles.attr("fill", function (d) { return color_1(d[_this._colorColumn]); });
                    }
                    if (this._areaColumn) {
                        var areaColumnExtent = context.getOrCalculateNumericRange(data, this._areaColumn);
                        var areaScale_2 = d3.scale.linear().domain([0, areaColumnExtent[1]]).range([0, this._radius * this._radius]);
                        bubbles.attr("r", function (d) { return Math.sqrt(areaScale_2(d[_this._areaColumn])); });
                    }
                    else {
                        bubbles.attr("r", this._radius);
                    }
                    var tooltipColumns = [this._xColumn, this._yColumn, this._colorColumn, this._areaColumn];
                    tooltipColumns = _.filter(tooltipColumns, _.negate(_.isNil));
                    context.getSlicedColumns().forEach(function (column) {
                        tooltipColumns.push(column);
                    });
                    context.getTooltip().addOn(bubbles, function (d) {
                        return tooltipColumns.map(function (col) { return col + ": " + d[col]; }).join("<br/>");
                    });
                };
                return BubbleChart;
            }());
            plot2d.BubbleChart = BubbleChart;
        })(plot2d = chart.plot2d || (chart.plot2d = {}));
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));

var semio;
(function (semio) {
    var core;
    (function (core) {
        var ColorPalette = (function () {
            function ColorPalette() {
            }
            ColorPalette.qualitative = function (values) {
                var colors = ColorPalette._qualitativeColors12.slice(0, values.length);
                var mapping = {};
                _.zip(values, colors).forEach(function (x) {
                    mapping[x[0]] = x[1];
                });
                return function (x) { return mapping[x]; };
            };
            ColorPalette._qualitativeColors12 = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c',
                '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'];
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
                this.svg = d3.select('#' + containerId)
                    .append('svg');
            }
            DrawingSurface.prototype.setWidth = function (width) {
                this._width = width;
                this.svg.attr('width', width);
                return this;
            };
            DrawingSurface.prototype.setHeight = function (height) {
                this._height = height;
                this.svg.attr('height', height);
                return this;
            };
            DrawingSurface.prototype.setX = function (x) {
                this._x = x;
                this.svg.attr('x', x);
                return this;
            };
            DrawingSurface.prototype.setY = function (y) {
                this._y = y;
                this.svg.attr('y', y);
                return this;
            };
            DrawingSurface.prototype.getWidth = function () { return this._width; };
            DrawingSurface.prototype.getHeight = function () { return this._height; };
            DrawingSurface.prototype.splitRows = function (n, marginRatioTop) {
                var _this = this;
                var rowHeight = this._height * (1 - marginRatioTop) / n;
                var marginHeight = this._height * marginRatioTop / (n - 1);
                return _.range(0, n).map(function (row) {
                    var id = _this.containerId + '_row_' + row.toString();
                    _this.svg.append('g').attr('id', id);
                    return new DrawingSurface(id)
                        .setHeight(rowHeight)
                        .setWidth(_this._width)
                        .setY(row * (rowHeight + marginHeight));
                });
            };
            DrawingSurface.prototype.splitColumns = function (n, marginRatioRight) {
                var _this = this;
                var columnWidth = this._width * (1 - marginRatioRight) / n;
                var marginWidth = this._width * marginRatioRight / (n - 1);
                return _.range(0, n).map(function (col) {
                    var id = _this.containerId + '_column_' + col.toString();
                    _this.svg.append('g').attr('id', id);
                    return new DrawingSurface(id)
                        .setHeight(_this._height)
                        .setWidth(columnWidth)
                        .setX(col * (columnWidth + marginWidth));
                });
            };
            DrawingSurface.prototype.splitGrid = function (n, maxColumns, marginRatioTop, marginRatioRight) {
                var _this = this;
                var nColumns = Math.ceil(Math.sqrt(n));
                if (maxColumns) {
                    nColumns = Math.min(nColumns, maxColumns);
                }
                var nRows = Math.ceil(n / nColumns);
                var cellWidth = this._width * (1 - marginRatioRight) / nColumns;
                var cellHeight = this._height * (1 - marginRatioTop) / nRows;
                var marginWidth = this._width * marginRatioRight / (nColumns - 1);
                var marginHeight = this._height * marginRatioTop / (nRows - 1);
                return _.flatMap(_.range(0, nRows), function (row) {
                    return _.range(0, nColumns)
                        .filter(function (col) {
                        var i = row * nColumns + col;
                        return i < n;
                    }).map(function (col) {
                        var id = _this.containerId + '_row_' + row.toString() + '_column_' + col.toString();
                        _this.svg.append('g').attr('id', id);
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
                var headerId = this.containerId + '_header';
                var bodyId = this.containerId + '_body';
                this.svg.append('g').attr('id', headerId);
                this.svg.append('g').attr('id', bodyId);
                var headerSurface = new DrawingSurface(headerId)
                    .setWidth(this._width)
                    .setHeight(headerHeight)
                    .setY(0);
                var bodySurface = new DrawingSurface(bodyId)
                    .setWidth(this._width)
                    .setHeight(bodyHeight)
                    .setY(headerHeight);
                return {
                    header: headerSurface,
                    body: bodySurface
                };
            };
            DrawingSurface.prototype.addCenteredColumn = function (idSuffix, cx, width) {
                var id = this.containerId + '_column_' + idSuffix;
                this.svg.append('g').attr('id', id);
                var surface = new DrawingSurface(id)
                    .setWidth(width)
                    .setHeight(this._height)
                    .setX(cx - width / 2);
                return surface;
            };
            DrawingSurface.prototype.addCenteredRow = function (idSuffix, cy, height) {
                var id = this.containerId + '_row_' + idSuffix;
                this.svg.append('g').attr('id', id);
                var surface = new DrawingSurface(id)
                    .setWidth(this._width)
                    .setHeight(height)
                    .setY(cy - height / 2);
                return surface;
            };
            DrawingSurface.prototype.addSurface = function (idSuffix, x, y, width, height) {
                var id = this.containerId + '_' + idSuffix;
                this.svg.append('g').attr('id', id);
                var surface = new DrawingSurface(id)
                    .setWidth(width)
                    .setHeight(height)
                    .setX(x)
                    .setY(y);
                return surface;
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
                return this;
            };
            PlotContext.prototype.setSlicedColumn = function (column, value) {
                var clone = this.clone();
                clone._slicedColumns[column] = value;
                return this;
            };
            PlotContext.prototype.setXScale = function (column, scale) {
                this._xScale[column] = scale;
                return this;
            };
            PlotContext.prototype.setYScale = function (column, scale) {
                this._yScale[column] = scale;
                return this;
            };
            PlotContext.prototype.getCategoryValues = function () {
                return this._categoryValues;
            };
            PlotContext.prototype.getCategoryColours = function () {
                return this._categoryColours;
            };
            PlotContext.prototype.getNumericRange = function (column) {
                return this._numericRange[column];
            };
            PlotContext.prototype.getSlicedColumns = function () {
                return this._slicedColumns;
            };
            PlotContext.prototype.getXScale = function (column) {
                return this._xScale[column];
            };
            PlotContext.prototype.getYScale = function (column) {
                return this._yScale[column];
            };
            PlotContext.prototype.clone = function () {
                var clone = new PlotContext();
                clone._categoryColours = _.clone(this._categoryColours);
                clone._categoryValues = _.clone(this._categoryValues);
                clone._numericRange = _.clone(this._numericRange);
                clone._slicedColumns = _.clone(this._slicedColumns);
                clone._yScale = _.clone(this._yScale);
                clone._xScale = _.clone(this._xScale);
                return this;
            };
            return PlotContext;
        }());
        core.PlotContext = PlotContext;
    })(core = semio.core || (semio.core = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var ColorPalette = semio.core.ColorPalette;
    var DrawingSurface = semio.core.DrawingSurface;
    var PlotContext = semio.core.PlotContext;
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
            if (!data || !this._plotable)
                return;
            var surface = new DrawingSurface(this.containerId)
                .setWidth(this._width)
                .setHeight(this._height);
            var context = new PlotContext();
            this._plotable.getCategoricalColumns().forEach(function (column) {
                var values = d3.set(data.map(function (d) { return d[column]; })).values();
                context = context.setCategoryValues(column, values);
                var colors = ColorPalette.qualitative(values);
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
    var chart;
    (function (chart) {
        var CategoricalPlot = (function () {
            function CategoricalPlot() {
                this._background = '#e6e6e6';
                this._xAxisHeightRatio = 0.1;
                this._yAxisWidthRatio = 0.1;
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
            CategoricalPlot.prototype.xAxisHeightRatio = function (ratio) {
                this._xAxisHeightRatio = ratio;
                return this;
            };
            CategoricalPlot.prototype.yAxisWidthRatio = function (ratio) {
                this._yAxisWidthRatio = ratio;
                return this;
            };
            CategoricalPlot.prototype.getCategoricalColumns = function () {
                var columns = _.flatMap(this._plotables, function (p) { return p.getCategoricalColumns(); });
                columns.push(this._splitOnColumn);
                return columns;
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
                if (!data)
                    return;
                var plotAreaX = this._yAxisWidthRatio * surface.getWidth();
                var plotAreaY = 0;
                var plotAreaWidth = (1 - this._yAxisWidthRatio) * surface.getWidth();
                var plotAreaHeight = (1 - this._xAxisHeightRatio) * surface.getHeight();
                var xAxisAreaHeight = this._xAxisHeightRatio * surface.getHeight();
                var yAxisAreaWidth = this._yAxisWidthRatio * surface.getWidth();
                surface.svg.append('g')
                    .append('rect')
                    .attr('width', plotAreaWidth)
                    .attr('height', plotAreaHeight)
                    .attr('x', plotAreaX)
                    .attr('y', plotAreaY)
                    .attr('fill', this._background);
                var yExtent = context.getNumericRange(this._valueColumn) || d3.extent(data, this._numericAccessor);
                var yScale = d3.scale.linear()
                    .domain(yExtent)
                    .range([plotAreaY + plotAreaHeight, plotAreaY]);
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .tickSize(-plotAreaWidth, 0);
                var yAxisGroup = surface.svg.append('g')
                    .attr('transform', 'translate(' + plotAreaX + ',0)')
                    .call(yAxis);
                yAxisGroup.selectAll('.tick line')
                    .style({
                    'stroke': 'white',
                    'stroke-width': 2
                });
                var updatedContext = context.setYScale(this._valueColumn, yScale);
                var categories = context.getCategoryValues()[this._splitOnColumn];
                var categoryColor = context.getCategoryColours()[this._splitOnColumn] || d3.scale.category20().domain(categories);
                var categoryWidth = plotAreaWidth / categories.length;
                var xScale = d3.scale.ordinal()
                    .domain(categories)
                    .rangePoints([plotAreaX + categoryWidth / 2,
                    plotAreaX + plotAreaWidth - categoryWidth / 2]);
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .tickSize(0);
                var xAxisGroup = surface.svg.append('g')
                    .attr('transform', 'translate(0,' + plotAreaHeight + ')')
                    .call(xAxis);
                updatedContext = updatedContext.setXScale(this._splitOnColumn, function (x) { return xScale(x) - plotAreaX; });
                var plotSurface = surface.addSurface('plotablearea', plotAreaX, plotAreaY, plotAreaWidth, plotAreaHeight);
                this._plotables.forEach(function (pl) {
                    pl.value(_this._valueColumn).splitOn(_this._splitOnColumn);
                    pl.plot(data, plotSurface, updatedContext);
                });
            };
            return CategoricalPlot;
        }());
        chart.CategoricalPlot = CategoricalPlot;
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var shape;
    (function (shape) {
        var Text = (function () {
            function Text() {
            }
            Text.placeTitle = function (surface, text) {
                surface.svg.append('text')
                    .attr('x', surface.getWidth() / 2)
                    .attr('y', surface.getHeight() / 2)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', surface.getHeight() / 2)
                    .text(text);
            };
            return Text;
        }());
        shape.Text = Text;
    })(shape = semio.shape || (semio.shape = {}));
})(semio || (semio = {}));
var semio;
(function (semio) {
    var chart;
    (function (chart) {
        var Text = semio.shape.Text;
        var SmallMultiple = (function () {
            function SmallMultiple() {
                this._headerRatio = 0.1;
                this._betweenMarginRatioRight = 0.05;
                this._betweenMarginRatioTop = 0.05;
            }
            SmallMultiple.prototype.width = function (width) {
                this._width = width;
                return this;
            };
            SmallMultiple.prototype.height = function (height) {
                this._height = height;
                return this;
            };
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
            SmallMultiple.prototype.beetweenMarginRatioRight = function (ratio) {
                this._betweenMarginRatioRight = ratio;
                return this;
            };
            SmallMultiple.prototype.betweenMarginRatioTop = function (ratio) {
                this._betweenMarginRatioTop = ratio;
                return this;
            };
            SmallMultiple.prototype.getCategoricalColumns = function () {
                var columns = this._plotable.getCategoricalColumns().slice(0);
                columns.push(this._splitOnColumn);
                return columns;
            };
            SmallMultiple.prototype.getNumericColumns = function () {
                return this._plotable.getNumericColumns();
            };
            SmallMultiple.prototype.add = function (plotable) {
                this._plotable = plotable;
                return this;
            };
            SmallMultiple.prototype.plot = function (data, surface, context) {
                var _this = this;
                if (!data || !this._plotable)
                    return;
                var groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
                var categories = groupedData.map(function (g) { return g.key; });
                var subSurfaces = surface.splitGrid(categories.length, this._maxColumns, this._betweenMarginRatioTop, this._betweenMarginRatioRight);
                var updatedContext = this.contextWithNumericRanges(data, context);
                categories.forEach(function (cat, i) {
                    var splitSurface = subSurfaces[i].splitHeader(_this._headerRatio);
                    var title = _this._splitOnColumn + ': ' + cat;
                    Text.placeTitle(splitSurface.header, title);
                    var updatedContextWithSlice = updatedContext.setSlicedColumn(_this._splitOnColumn, cat);
                    _this._plotable.plot(groupedData[i].values, splitSurface.body, updatedContextWithSlice);
                });
            };
            SmallMultiple.prototype.contextWithNumericRanges = function (data, context) {
                var newContext = context;
                this._plotable.getNumericColumns().forEach(function (col) {
                    if (!context.getNumericRange(col)) {
                        var extent = d3.extent(data, function (d) { return +d[col]; });
                        newContext = newContext.setNumericRange(col, extent);
                    }
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
    var math;
    (function (math) {
        var Kde = (function () {
            function Kde() {
            }
            Kde.estimate = function (kernel, sample, bandwidth, support) {
                var estimator = Kde.estimator(kernel, sample, bandwidth);
                return support.map(function (v) {
                    return { value: v, density: estimator(v) };
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
            function SwarmPoint(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
            }
            SwarmPoint.prototype.setX = function (newX) {
                return new SwarmPoint(newX, this.y, this.color);
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
            VerticalSwarm.prototype.diameter = function (d) {
                this._diameter = d;
                return this;
            };
            VerticalSwarm.prototype.draw = function (data, surface, context) {
                var _this = this;
                var centre = surface.getWidth() / 2;
                var yScale = context.getYScale(this._valueColumn);
                var colors = context.getCategoryColours()[this._colorColumn];
                var startingPositions = _.chain(data).map(function (d) {
                    return new SwarmPoint(centre, yScale(_this._numericAccessor(d)), colors(d[_this._colorColumn]));
                }).orderBy(function (p) { return -p.y; }).value();
                var swarm = [];
                startingPositions.forEach(function (p) {
                    var neighbors = _.chain(swarm).filter(function (p2) { return Math.abs(p.y - p2.y) < _this._diameter; })
                        .sortBy(function (p) { return Math.abs(p.x - centre); })
                        .value();
                    swarm.push(_this.findPosition(p, neighbors, centre));
                });
                surface.svg.append('g')
                    .selectAll('circle')
                    .data(swarm)
                    .enter()
                    .append('circle')
                    .attr('cx', function (d) { return d.x; })
                    .attr('cy', function (d) { return d.y; })
                    .attr('r', this._diameter / 2)
                    .style('fill', function (d) { return d.color; });
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
            function VerticalViolin(_data) {
                this._data = _data;
                this._cut = 1;
            }
            VerticalViolin.prototype.cx = function (cx) {
                this._cx = cx;
                return this;
            };
            VerticalViolin.prototype.yAccessor = function (accessor) {
                this._yAccessor = accessor;
                return this;
            };
            VerticalViolin.prototype.yScale = function (scale) {
                this._yScale = scale;
                return this;
            };
            VerticalViolin.prototype.width = function (width) {
                this._width = width;
                return this;
            };
            VerticalViolin.prototype.fill = function (fill) {
                this._fill = fill;
                return this;
            };
            VerticalViolin.prototype.cut = function (cut) {
                this._cut = cut;
                return this;
            };
            VerticalViolin.prototype.bandwidth = function (bandwidth) {
                this._bandwidth = bandwidth;
                return this;
            };
            VerticalViolin.prototype.draw = function (svg) {
                var _this = this;
                var yMin = d3.min(this._data, this._yAccessor);
                var yMax = d3.max(this._data, this._yAccessor);
                var support = _.range(this._yScale(yMax + this._cut), this._yScale(yMin - this._cut), 5);
                var kernel = Kde.epanechnikovKernel;
                var values = this._data.map(this._yAccessor).map(this._yScale);
                var bandwidth = 1.06 * d3.deviation(values) / Math.pow(values.length, 0.2);
                var densities = Kde.estimate(kernel, values, bandwidth, support);
                var maxDensity = d3.max(densities, function (d) { return d.density; });
                densities.forEach(function (d) {
                    d.density = 0.5 * _this._width * d.density / maxDensity;
                });
                var area = d3.svg.area()
                    .y(function (d) { return d.value; })
                    .x0(function (d) { return _this._cx - d.density; })
                    .x1(function (d) { return _this._cx + d.density; });
                svg.append('g')
                    .append('path')
                    .datum(densities)
                    .attr('d', area)
                    .style('fill', this._fill);
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
                SwarmPlot.prototype.color = function (column) {
                    this._colorColumn = column;
                    return this;
                };
                SwarmPlot.prototype.diameter = function (d) {
                    this._diameter = d;
                    return this;
                };
                SwarmPlot.prototype.getCategoricalColumns = function () {
                    if (this._colorColumn) {
                        return [this._colorColumn];
                    }
                    return [];
                };
                SwarmPlot.prototype.getNumericColumns = function () {
                    if (this._valueColumn) {
                        return [this._valueColumn];
                    }
                    return [];
                };
                SwarmPlot.prototype.plot = function (data, surface, context) {
                    var _this = this;
                    if (!data)
                        return;
                    var yScale = context.getYScale(this._valueColumn);
                    var xScale = context.getXScale(this._splitOnColumn);
                    var categories = context.getCategoryValues()[this._splitOnColumn];
                    var categoryWidth = surface.getWidth() / categories.length;
                    var groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
                    _.forOwn(groupedData, function (group) {
                        if (group.values) {
                            var category = group.key;
                            var subSurface = surface
                                .addCenteredColumn('_swarm_' + category, xScale(category), categoryWidth);
                            var swarm = new semio.shape.VerticalSwarm()
                                .color(_this._colorColumn)
                                .value(_this._valueColumn)
                                .diameter(_this._diameter);
                            swarm.draw(group.values, subSurface, context);
                        }
                    });
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
            var ViolinPlot = (function () {
                function ViolinPlot() {
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
                ViolinPlot.prototype.getCategoricalColumns = function () {
                    return [];
                };
                ViolinPlot.prototype.getNumericColumns = function () {
                    if (this._valueColumn) {
                        return [this._valueColumn];
                    }
                    return [];
                };
                ViolinPlot.prototype.plot = function (data, surface, context) {
                    var _this = this;
                    if (!data)
                        return;
                    var yScale = context.getYScale(this._valueColumn);
                    var xScale = context.getXScale(this._splitOnColumn);
                    var categories = context.getCategoryValues()[this._splitOnColumn];
                    var categoryWidth = surface.getWidth() / categories.length;
                    var groupedData = d3.nest().key(this._categoricalAccessor).entries(data);
                    _.forOwn(groupedData, function (group) {
                        if (group.values) {
                            var category = group.key;
                            var categoryColor = context.getCategoryColours()[_this._splitOnColumn](category);
                            var violin = new VerticalViolin(group.values);
                            violin.cx(xScale(category))
                                .yScale(yScale)
                                .yAccessor(_this._numericAccessor)
                                .width(0.9 * categoryWidth)
                                .cut(1)
                                .fill(categoryColor);
                            violin.draw(surface.svg);
                        }
                    });
                };
                return ViolinPlot;
            }());
            categorical.ViolinPlot = ViolinPlot;
        })(categorical = chart.categorical || (chart.categorical = {}));
    })(chart = semio.chart || (semio.chart = {}));
})(semio || (semio = {}));

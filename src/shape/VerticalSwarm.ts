/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.shape {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;

    class SwarmPoint {
        constructor(public datum: any,
                    public x: number,
                    public y: number, 
                    public color: string) { }

        public setX(newX: number): SwarmPoint {
            return new SwarmPoint(this.datum, newX, this.y, this.color);
        }

        public distance(p: SwarmPoint): number {
            let dx = p.x - this.x;
            let dy = p.y - this.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        public placeNextTo(p: SwarmPoint, diameter: number): Array<SwarmPoint> {
            let dy = p.y - this.y;
            let dx = Math.sqrt(diameter * diameter - dy * dy) * 1.1;
            return [this.setX(p.x - dx), this.setX(p.x + dx)];
        }
    }

    export class VerticalSwarm {
        private _delay: number;
        private _valueColumn: string;
        private _colorColumn: string;
        private _idColumn: string;
        private _numericAccessor: (d: any) => number;
        private _diameter: number;

        public value(column: string): VerticalSwarm {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        }

        public color(column: string): VerticalSwarm {
            this._colorColumn = column;
            return this;
        }

        public id(column: string): VerticalSwarm {
            this._idColumn = column;
            return this;
        }

        public diameter(diameter: number): VerticalSwarm {
            this._diameter = diameter;
            return this;
        }

        public delay(delay: number): VerticalSwarm {
            this._delay = delay;
            return this;
        }

        public draw(data: Array<any>, surface: Surface, context: Context): void {
            let that = this;
            let centre = surface.getWidth() / 2;

            var yScale = context.getYScale(this._valueColumn);
            let colors = context.getCategoryColours(this._colorColumn);

            let startingPositions: Array<SwarmPoint> = _.chain(data).map((d) => {
                return new SwarmPoint(d, centre, 
                                      yScale(this._numericAccessor(d)), 
                                      colors(d[this._colorColumn]));
            }).orderBy((p) => -p.y).value();

            let swarm: Array<SwarmPoint> = [];
            startingPositions.forEach((p) => {
                let neighbors = _.chain(swarm).filter((p2) => Math.abs(p.y - p2.y) < this._diameter)
                    .sortBy((p) => Math.abs(p.x - centre))
                    .value();
                swarm.push(this.findPosition(p, neighbors, centre));
            });

            let startingX = (d: SwarmPoint) => centre;
            let startingY = (d: SwarmPoint) => this._diameter / 2;

            let circles = surface.svg.append("g")
                .selectAll("circle")
                .data(swarm)
                .enter()
                .append("circle")
                .attr("cx", d => startingX(d))
                .attr("cy", d => startingY(d))
                .attr("r", this._diameter / 2)
                .style("fill", d => d.color);

            let tooltipColumns: Array<string> = [];
            if (that._idColumn) {
                tooltipColumns.push(that._idColumn);
            }
            tooltipColumns.push(that._valueColumn);
            tooltipColumns.push(that._colorColumn);
            context.getSlicedColumns().forEach((column) => {
                tooltipColumns.push(column);
            });
            context.getTooltip().addOn(circles, (swarmPoint: SwarmPoint) => {
                return tooltipColumns.map((col) => col + ": " + swarmPoint.datum[col]).join("<br/>");
            });

            let circleCount = swarm.length;
            circles.transition()
                .delay((d, i) => i * this._delay / circleCount)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }

        public findPosition(p: SwarmPoint, neighbors: Array<SwarmPoint>, centre: number): SwarmPoint {
            let candidatePositions = _.flatMap(neighbors, (n) => p.placeNextTo(n, this._diameter));
            candidatePositions.push(p);
            let goodCandidates = _.chain(candidatePositions)
                .filter((c) => _.findIndex(neighbors, (n) => c.distance(n) < this._diameter) === -1)
                .sortBy((c) => Math.abs(c.x - centre))
                .value();
            return goodCandidates[0];
        }
    }
}

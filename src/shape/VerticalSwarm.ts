/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../interfaces/Context.ts"/>
/// <reference path="../interfaces/Surface.ts"/>

module semio.shape {
    import Context = semio.interfaces.Context;
    import Surface = semio.interfaces.Surface;
    
    class SwarmPoint {
        
        constructor(public x: number, 
                    public y: number, 
                    public color: string) { }
        
        setX(newX: number): SwarmPoint {
            return new SwarmPoint(newX, this.y, this.color);    
        }
        
        distance(p: SwarmPoint): number {
            let dx = p.x - this.x;
            let dy = p.y - this.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
        placeNextTo(p: SwarmPoint, diameter: number): Array<SwarmPoint> { 
            let dy = p.y - this.y;
            let dx = Math.sqrt(diameter * diameter - dy * dy) * 1.05;
            return [this.setX(p.x - dx), this.setX(p.x + dx)];
        }
    }
    
    export class VerticalSwarm {        
        private _valueColumn: string;
        private _colorColumn: string;
        private _numericAccessor: (d: any) => number;        
        private _diameter: number;
                
        value(column: string): VerticalSwarm {
            this._valueColumn = column;
            this._numericAccessor = function (d) {
                return +d[column];
            };
            return this;
        } 
        
        color(column: string): VerticalSwarm {
            this._colorColumn = column;
            return this;
        } 
        
        diameter(d: number): VerticalSwarm {
            this._diameter = d;
            return this;
        }
        
        draw(data: Array<any>, surface: Surface, context: Context): void {
            let centre = surface.getWidth() / 2;

            var yScale = context.getYScale(this._valueColumn);            
            let colors = context.getCategoryColours()[this._colorColumn];
            
            let startingPositions: Array<SwarmPoint> = _.chain(data).map((d) => {
                return new SwarmPoint(centre, 
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
            
            surface.svg.append('g')
                .selectAll('circle')
                .data(swarm)
                .enter()
                .append('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', this._diameter / 2)
                .style('fill', d => d.color);
        }
        
        findPosition(p: SwarmPoint, neighbors: Array<SwarmPoint>, centre: number): SwarmPoint {
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
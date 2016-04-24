/// <reference path="../interfaces/Environment.ts"/>

module semio.core {
    
    import Environment = semio.interfaces.Environment;
    
    export class PlotEnvironment implements Environment {
        private countryColours: { [column: string]: (value: string) => string } = { };
        
        getCategoryColours(): { [column: string]: (value: string) => string } {
            return this.countryColours;
        }
        
        setCategoryColours(column: string, colours: (value: string) => string): Environment {
            this.countryColours[column] = colours;
            return this;
        }
    }
}
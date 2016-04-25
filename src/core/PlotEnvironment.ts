/// <reference path="../interfaces/Environment.ts"/>

module semio.core {
    
    import Environment = semio.interfaces.Environment;
    
    export class PlotEnvironment implements Environment {
        private categoryColours: { [column: string]: (value: string) => string } = { };
        private categoryValues: { [column: string]: Array<string> } = { };

        setCategoryValues(column: string, values: Array<string>): Environment {
            this.categoryValues[column] = values;
            return this;
        }
        
        setCategoryColours(column: string, colours: (value: string) => string): Environment {
            this.categoryColours[column] = colours;
            return this;
        }
        
        getCategoryValues(): { [column: string]: Array<string>} {
            return this.categoryValues;
        }
        
        getCategoryColours(): { [column: string]: (value: string) => string } {
            return this.categoryColours;
        }
    }
}
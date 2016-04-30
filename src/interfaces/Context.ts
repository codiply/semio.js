module semio.interfaces {
    export interface Context {
        setCategoryColours(column: string, colours: (value: string) => string): Context;
        setCategoryValues(column: string, values: Array<string>): Context;
        setNumericRange(column: string, range: [number, number]): Context;
        setSlicedColumn(column: string, value: string): Context
        
        // TODO: do not return the dictionary, pass in the column and return one value.
        getCategoryColours(): { [column: string]: (value: string) => string };
        getCategoryValues(): { [column: string]: Array<string> };
        getNumericRange(column: string): [number, number];
        getSlicedColumns(): { [column: string]: string};
    }
}
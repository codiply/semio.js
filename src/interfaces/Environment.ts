module semio.interfaces {
    export interface Environment {
        setCategoryColours(column: string, colours: (value: string) => string): Environment;
        setCategoryValues(column: string, values: Array<string>): Environment;
        setNumericRange(column: string, range: [number, number]): Environment;
        setSlicedColumn(column: string, value: string): Environment
        
        // TODO: do not return the dictionary, pass in the column and return one value.
        getCategoryColours(): { [column: string]: (value: string) => string };
        getCategoryValues(): { [column: string]: Array<string> };
        getNumericRange(column: string): [number, number];
        getSlicedColumns(): { [column: string]: string};
    }
}
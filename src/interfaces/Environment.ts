
module semio.interfaces {
    export interface Environment {
        setCategoryColours(column: string, colours: (value: string) => string): Environment;
        setCategoryValues(column: string, values: Array<string>): Environment;
        getCategoryColours(): { [column: string]: (value: string) => string };
        getCategoryValues(): { [column: string]: Array<string> };
    }
}

module semio.interfaces {
    export interface Environment {
        getCategoryColours(): { [column: string]: (value: string) => string }
    }
}
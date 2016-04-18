## Development Environment

Download and install [node.js](https://nodejs.org/en/download/) (I am currently using version 4.4.3)

Install `tsc` (TypeScript compiler) command line tool and `tsd` (TypeScript declaration) command line tool

    npm install typescript tsd -g  

Install gulp

    npm install -g gulp
    
To install npm packages, run the following from the top folder of the project

    npm install
    
To run the code, first get the typings

    gulp tsd
    
and then 

    gulp compile

to compile, or
 
    gulp watch
    
to serve the examples.
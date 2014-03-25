# indeedjobs-geo-census-housing

Seed project for Angularjs, Requirejs, Twitter Bootstrap, Less.

# Dependencies

 * node.js
 * expressjs

# Install

    npm install express

# Optimisation

To run the requirejs optimisation script, type the following in the command line from the rood directory of the project.

    node tools/r.js -o tools/app.build.js

This will make a "build" directory with all files optimised in one js file.

# Run Application

In the command line, run:

    node server

Then in your browser, navigate to these urls to view the dev and build versions:

Dev:
http://localhost:8080/dev/index.html#/home

Build:
http://localhost:8080/build/index.html#/home
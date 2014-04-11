/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  appFiles: {
    main: [ 'public/javascripts/app/main.js' ],
    controllers: [ 'public/javascripts/app/controllers/*.js'],
    services: [ 'public/javascripts/app/services/*.js'],
    directives: [ 'public/javascripts/app/directives/*.js'],
    partials: [
      'public/javascripts/app/partials/*.html',
      'public/javascripts/app/partials/**/*.html'
    ],
  },
  vendorFiles: {
    css: [
      'public/javascripts/vendor/bootstrap-css/css/bootstrap.css',
      'public/javascripts/vendor/angular/progressbar.css',
      'public/stylesheets/style.css'
    ],
    js: [
      'public/javascripts/vendor/jquery/jquery.min.js',
      'public/javascripts/vendor/angular/angular.min.js',
      'public/javascripts/vendor/angular/angular-route.js',
      'public/javascripts/vendor/angular/angular-resource.js',
      'public/javascripts/vendor/angular/progressbar.js',
      'public/javascripts/vendor/bootstrap-javascript/bootstrap.min.js',
      'public/javascripts/vendor/angular-bootstrap/ui-bootstrap.min.js',
      'public/javascripts/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js'
    ]
  }
};
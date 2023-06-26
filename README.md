# Ng App Contentful

This is a sample Angular app to exercise integration with [Contentful CRM](https://www.contentful.com/).

App is using Angular Material design under the hood and implements following functionality:
- Fetch all content types using Content Delivery API
- Fetch info for a single content type and display JSON data
- Fetch entries using Content Delivery API / Content Preview API
- Search entries by "Title" using pagination and ordering
- Fetch a single entry
- Only for 'Category' content type:
    - Update entry, create an image asset for the entry, if necessary
    - Create entry, create an immage asset for the entry, if nesessray
    - Publish entry

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.5.  

## Setup

1. Create a demo space in Contentful CRM
2. Setup the space by cloning repo from [https://github.com/contentful/ls-jumpstart-shop](https://github.com/contentful/ls-jumpstart-shop) and executing `npm run setup` with API keys for your demo space.<br/>**Be careful**: this script will overwrite (= destroy) all the data in the demo space.
4. Run `npm install` for this project
3. Fill in configuration options in `src/environments/environment.ts` file

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

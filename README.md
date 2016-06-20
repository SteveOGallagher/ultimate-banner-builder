# ultimate-banner-builder
A banner build template that also works to generate static versions

### How to run:
- `npm i`
- `npm run generate`
- sudo npm install gulp -g
- gulp


##Requirements of the banner template builder
## Completed
- Look at required sizes in sizes.json and build src folder structure according to base-template files
- Create Gulp watch task to copy changes in html, js, and scss files into minified versions in relative production folder

##To Do
- Create ability to make DoubleClick js versions with Enabler and GDN js versions with pure JS
- Build most ideal template files for html, scss, and js (for DoubleClick & GDN)
- Create an img folder in each size's src directory and build these out into GDN sizes

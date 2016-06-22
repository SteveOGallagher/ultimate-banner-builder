# ultimate-banner-builder
A banner build template that also works to generate static versions

### How to run:
- run `npm i`
- Edit the 'sizes.json' file with the correct sizes for the banners you wish to build. 
- run `npm run generate`
- sudo npm install gulp -g
- run `gulp`


#Requirements of the banner template builder
## Completed
- Look at required sizes in sizes.json and build src folder structure according to base-template files
- Create Gulp watch task to copy changes in html, js, and scss files into minified versions in relative production folder
- Setup automated localhost serving
- Create ability to make DoubleClick js versions with Enabler and GDN js versions with pure JS
- Build most ideal template files for html, scss, and js (for DoubleClick & GDN)
- Add lint for css and js
- Create an img folder in each size's src directory and build these out into GDN sizes

## To Do
- Ensure that gulp connect doesn't open new tab if localhost running already.
- Make final improvements on base level banner build template

## Nice To Have
- For `npm run generate`, if src is empty, build out again. 

### Troubleshooting
- If `gulp` throws an error, ensure that you have first run `npm run generate`.

### General Tips
- The prefix field in sizes.json is optional.
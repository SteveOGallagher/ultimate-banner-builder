# ultimate-banner-builder
A banner build template that also works to generate static versions

### Setup:
- run `npm i` to install all necessary packages locally
- sudo npm install gulp -g

### Workflow for building the banners
- In the 'sizes.json' file's `dimensions` array, enter the dimensions of the 'Master' ad size. 
- run `npm run generate` to create the 'src' folder structure where you will build the Master version.
- run `gulp` to create the 'prod' output folder structure when the final ad files will be automatically created.
- Once the client is satisfied that the Master banner matches the brief, run `gulp master` to create new template files consisting of the work you've done.

- Complete the 'sizes.json' file's `dimensions` array to contain all required ad sizes including the Master size. 
- If Google Display Network builds are required, complete the 'sizes.json' file's `versions` array to label each variation needed per ad size. 
- run `npm run generate`
- run `gulp`
- Make adjustments in the code for each size as needed. (Typically, only image-paths.js and overwrite.scss will need adjusting)


#Requirements of the banner template builder
## Completed
- Look at required sizes in sizes.json and build src folder structure according to base-template files
- Create Gulp watch task to copy changes in html, js, and scss files into minified versions in relative production folder
- Setup automated localhost serving
- Create ability to make DoubleClick js versions with Enabler and GDN js versions with pure JS
- Build most ideal template files for html, scss, and js (for DoubleClick & GDN)
- Add lint for css and js
- Create an img folder in each size's src directory and build these out into GDN sizes
- Allow for a master to be worked on before creating all versions using the same general animation and style/structure adjustments.
- Ensure that GDN folders are only created if 'GDN' is set to 'true'.

## To Do
- npm or gulp auto zip GDN folders by banner size
- For dynamic ads requiring GDN versions, allow for multiple versions of the same ad size with different content.
- Make final improvements on base level banner build template

## Nice To Have
- For `npm run generate`, if src is empty, build out again. 
- Ensure that gulp connect doesn't open new tab if localhost running already.

### Troubleshooting
- If `gulp` throws an error, ensure that you have first run `npm run generate`.

### General Tips
- The prefix field in sizes.json is optional.
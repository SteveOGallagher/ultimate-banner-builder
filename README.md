# ultimate-banner-builder
A banner build template for creating DoubleClick banners which also works to generate static Google Display Network versions. This build template assumes that you will be building a dynamic DoubleClick banner as standard.

## Setup:
- clone the repo
- run `npm i` to install all necessary packages locally
- sudo `npm install gulp -g` to ensure you have Gulp installed.

# Workflow for building the banners
### 1. Create the Master
- In the 'sizes.json' file's `dimensions` array, enter the dimensions of the 'Master' ad size and save the file (leave GDN set to false). 
- Run `npm run generate` (This creates the 'src' folder structure where you will build the Master version)
- Run `gulp` (This creates the 'prod' output folder structure where the final ad files will be automatically served)
- Edit the code in the src folder to create the final working version of the Master ad size.

### 2. Prepare to apply your Master code to all required sizes
- Once the client is satisfied that the Master banner matches the brief, ensure that `gulp` is no longer running.
- Run `gulp master` (This overwrites the base-template files to consist of the global work you've done to the Master)
- Complete the 'sizes.json' file's `dimensions` array to contain all required ad sizes and save the file. 

##### If Google Display Network or static versions of the ads are required:
- Set the `GDN` property in 'sizes.json' to equal `"true"`. 
- Complete the 'sizes.json' file's `versions` array to contain a reference label for each variation of the ad. (e.g. brand names, differing messages, etc.) 

### 3. Create all required ad sizes
- Run `npm run generate` again
- Run `gulp` again
- Make adjustments in the src code for each size as needed. (Typically only DoubleClick.js and overwrite.scss will need adjusting. If GDN versions are required then image-paths.js and the img folders will need editing.)


# Banner template builder features
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
- Auto zip GDN folders by banner size and by containing GDN folder.
- For dynamic ads requiring GDN versions, allow for multiple versions of the same ad size with different content.
- Rename DoubleClick to dynamic. Rename GDN to static

## To Do
- Make final improvements on base level banner build template
- Include example image files for static setup.
- Allow for either DoubleClick or Static master ad build
- Refactor and add further clarity to code

'use strict';

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import fse from 'fs-extra';
const appRoot = process.cwd();
const sourceDirectory = `${appRoot}/src/`;
const DoubleClick = "doubleclick";
const Dynamic = null;
const Static = "static";
const img = "img";
var versions;

class GenerateTemplates {
	constructor() {
		this.loadSizes();
		this.setupSource();

		this.formatFiles = ['doubleclick.js', 'main.js', 'static.js', 'image-paths.js', 'overwrite.scss'];
	}

	loadSizes() {
		const sizesFile = fs.readFileSync(`${appRoot}/sizes.json`, `utf8`);
		let sizes = JSON.parse(sizesFile);
		this.sizes = sizes.dimensions;
		this.DoubleClick = sizes.DoubleClick;
		this.Master = sizes.Master;
		this.Static = sizes.Static;
    this.Dynamic = sizes.Dynamic;
		versions = sizes.versions;
		
		versions = this.Master === true ? [versions[0]] : size.versions;
	}

	processSizes() {
		this.sizes.map((size) => {
			this.checkTemplate(`${sourceDirectory}${size.prefix}${size.width}x${size.height}`, size);
		});
	}

	setupSource() {
		let that = this;
		fs.access(sourceDirectory, fs.F_OK, function(err) {
			if (!err) {
				console.info(chalk.blue(`Source directory already exists`));
				that.processSizes();
			} else {
				that.createSource();
			}
		});
	}

	createSource() {
		let that = this;
		fs.mkdir(sourceDirectory, (err, folder) => {
			if (err) {
				console.log(err);
				console.error(chalk.red(`src could not be created`));
			} else {
				console.info(chalk.blue(`src has been created`));
				that.populateSrc();
			}
		});
	}

	populateSrc() {
		let globalSass = `${appRoot}/base-template/global.scss`;
		let normalizeSass = `${appRoot}/base-template/normalize.scss`;
		fs.createReadStream(globalSass).pipe(fs.createWriteStream(`${sourceDirectory}global.scss`));
		fs.createReadStream(normalizeSass).pipe(fs.createWriteStream(`${sourceDirectory}normalize.scss`));
		this.processSizes();
	}

	checkTemplate(dir, data) {
		let that = this;
		fs.access(dir, fs.F_OK, function(err) {
			if (!err) {
				console.info(chalk.blue(`${dir} Already exists`));
			} else {
				console.info(chalk.blue(`Creating ${dir}`));
				that.generateTemplate(dir, data);
			}
		});
	}

	// Build folders to house each ad by size name and their DoubleClick and Static subfolders
	generateTemplate(dir, data) {
		let that = this;

		fs.mkdir(dir, (err, folder) => {
			if (err) {
				console.log(err);
				console.error(chalk.red(`${dir} Could not be created`));
			} else {
				console.info(chalk.blue(`${dir} has been created`));

        if (this.DoubleClick) {
          fs.mkdir(`${dir}/${DoubleClick}`);
        }

				if (this.Master && this.Static && !this.DoubleClick ||
						!this.Master && this.Static) {
					var totalVersions = this.Master === true ? 1 : this.versions
					var version = 0;

					// Make Static assets folder
					fs.mkdir(`${dir}/${Static}`, function (err) {
				    if (err) {
				        return console.log('failed to write directory', err);
				    }
				    makeVersionDirectory(version);
					});

					// Make a folder inside Static assets folder for a particular version
					function makeVersionDirectory (version) {
						fs.mkdir(`${dir}/${Static}/${versions[version]}`, function (err) {
					    if (err) {
					        return console.log('failed to write directory', err);
					    }
					    makeImgDirectory(version);
						});
					}

					// Make an image folder inside the Static assets folder for a particular version
					function makeImgDirectory (version) {
						fs.mkdir(`${dir}/${Static}/${versions[version]}/${img}`, function (err) {
					    if (err) {
					        return console.log('failed to write directory', err);
					    }
					    copyImages(version); // Copy global images for this version before incrementing

					    version++;

					    if (version == totalVersions) {
					    	that.populateTemplate(dir, data); // Build files into folders when complete
					    } else {
					    	makeVersionDirectory(version); // Otherwise perform these tasks for each version
					    }
						});
					};

					// Copy global images into image directory
					// TODO: allow all images from inside this folder to be copied, regardless of name
					function copyImages (version) {
						var images = ['blue.jpg', 'green.jpg', 'orange.jpg', 'red.jpg'];

						for (var image in images) {
							var templateImages = fs.createReadStream(`${appRoot}` + '/base-template/global-images/' + images[image]);
							var srcImages = fs.createWriteStream(`${dir}/${Static}/${versions[version]}/${img}/` + images[image]);
							templateImages.pipe(srcImages);
						};
					};

	      } else {
					that.populateTemplate(dir, data); // If static is false, build as normal
	      }

			}
		});
	}

	populateTemplate(dir, data) {
		fs.createReadStream(`${appRoot}/base-template/index.html`).pipe(fs.createWriteStream(`${dir}/index.html`));

		this.formatFiles.map((file) => {
			this.formatPopulate(file, data, dir);
		});
	}

	format(str, obj) {
		return str.toString().replace(/\{{([^}]+)\}}/g, function(match, group) {
			return obj[group];
		});
	}

	// Copy files and their contents into their correct subfolders
	formatPopulate(file, data, dir) {

		let fileData = fs.readFileSync(`${appRoot}/base-template/${file}`, 'utf8');
		let processedData = this.format(fileData, data);
    if (!this.Dynamic) {
      fse.copy(`${appRoot}/base-template/global-images`, `${dir}/${DoubleClick}/img`, (err) => {
       if (err) return console.error("error:", err);
       console.info(chalk.green("images folder copied successfully."));
      });
    }

		// Create individual folders for specific js files.
    switch(file) {
	    case 'static.js':
	    		if (this.Master && this.Static && !this.DoubleClick ||
						!this.Master && this.Static) {
		        fs.writeFileSync(`${dir}/${file}`, processedData, 'utf8');
	    		}
	        break;
	    case 'image-paths.js':
	    		if (this.Master && this.Static && !this.DoubleClick ||
						!this.Master && this.Static) {
		    		for (var version in versions) {
			        fs.writeFileSync(`${dir}/${Static}/${versions[version]}/${file}`, processedData, 'utf8');
		        }
	    		}
	        break;
	    case 'doubleclick.js':
          if (this.DoubleClick) {
            fs.writeFileSync(`${dir}/${DoubleClick}/${file}`, processedData, 'utf8');
          }
        	break;
	    case 'doubleclick.js':
        if (this.DoubleClick) {
          fs.writeFileSync(`${dir}/${DoubleClick}/${file}`, processedData, 'utf8');
        }
        break;
	    default:
        fs.writeFileSync(`${dir}/${file}`, processedData, 'utf8');
		}
	}
}

new GenerateTemplates();

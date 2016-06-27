'use strict';

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
const appRoot = process.cwd();
const sourceDirectory = `${appRoot}/src/`;
const Dynamic = "dynamic";
const Static = "static";
const img = "img";
var versions;

class GenerateTemplates {
	constructor() {
		this.loadSizes();
		this.setupSource();

		this.formatFiles = ['dynamic.js', 'main.js', 'static.js', 'image-paths.js', 'overwrite.scss'];
	}

	loadSizes() {
		const sizesFile = fs.readFileSync(`${appRoot}/sizes.json`, `utf8`);
		let sizes = JSON.parse(sizesFile);
		this.sizes = sizes.dimensions;
		this.Dynamic = sizes.Dynamic;
		this.Static = sizes.Static;
		versions = sizes.versions;
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

	// Build folders to house each ad by size name and their Dynamic and Static subfolders
	generateTemplate(dir, data) {
		let that = this;

		fs.mkdir(dir, (err, folder) => {
			if (err) {
				console.log(err);
				console.error(chalk.red(`${dir} Could not be created`));
			} else {
				console.info(chalk.blue(`${dir} has been created`));
				fs.mkdir(`${dir}/${Dynamic}`);

				if (this.Static === true) {

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
					    makeImgDirectory(version)
						});
					};

					// Make an image folder inside the Static assets folder for a particular version
					function makeImgDirectory (version) {
						fs.mkdir(`${dir}/${Static}/${versions[version]}/${img}`, function (err) {
					    if (err) {
					        return console.log('failed to write directory', err);
					    }
					    version++;

					    if (version == versions.length) {
					    	that.populateTemplate(dir, data); // Build files into folders when complete
					    } else {
					    	makeVersionDirectory(version); // Otherwise perform these tasks for each version
					    };
						});
					};
	      } else {
					that.populateTemplate(dir, data); // If Static not true, build as normal
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

		// Create individual folders for specific js files.
		switch(file) {
	    case 'static.js':
	    		if (this.Static === true) {
		        fs.writeFileSync(`${dir}/${Static}/${file}`, processedData, 'utf8');
	    		}
	        break;
	    case 'image-paths.js':
	    		if (this.Static === true) {
		    		for (var version in versions) {
			        fs.writeFileSync(`${dir}/${Static}/${versions[version]}/${file}`, processedData, 'utf8');
		        };
	    		}
	        break;
	    case 'dynamic.js':
	        fs.writeFileSync(`${dir}/${Dynamic}/${file}`, processedData, 'utf8');
	        break;
	    default:
	        fs.writeFileSync(`${dir}/${file}`, processedData, 'utf8');
		}
	}
}

new GenerateTemplates();

const fs = require('fs');
const { type } = require('os');

function sampleFilter() {
    return true;
}

// class stufffffff! reusable code yay!
class FileLoader {

    // constructor
    constructor(fancyprinter) {
        this.fancyprinter = fancyprinter;
    }

    // main thing we use with this bitch
    loadDirectory(dir, filter=sampleFilter, recurse=false, dirFilter=sampleFilter) {

        // if the user only supplies a string to filter, it will work as if you supplied
        // a function that searches for that string
        if (filter != null && typeof(filter) == "string") {
            filterFunc = function(fileName) {
                return fileName.includes(filter);
            }
            filter = filterFunc;
        }

        // same as filter but for dirFilter
        if (dirFilter != null && typeof (dirFilter) == "string") {
            dirFilterFunc = function (fileName) {
                return fileName.includes(dirFilter);
            }
            dirFilter = dirFilterFunc;
        }

        // we need to check if the directory exists and if it's a directory
        if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {

            // this will be populated with the files we recursively(?) find
            let filesToInclude = [];

            // loop through all the files in the directory
            let files = fs.readdirSync(dir);
            for (let file of files) {

                // find the stats of the thing we're looping over and see if it's a file or a directory
                let stats = fs.statSync(dir + "/" + file);
                if (stats.isFile()) {

                    // check it through our filter
                    if (filter(file)) {
                        filesToInclude.push(dir + "/" + file);
                    } else {
                        this.fancyprinter.p(`$fFile was filtered out ${dir + ' / ' + file}`);
                    }

                } else if (stats.isDirectory() && recurse) {

                    // filter again for directories
                    if (dirFilter(file)) {
                        // rercurse
                        for (let recursiveFile of this.loadDirectory(dir + "/" + file, filter, recurse, dirFilter)) {
                            filesToInclude.push(recursiveFile);
                        }
                    } else {
                        this.fancyprinter.p(`$fDirectory was filtered out ${dir + ' / ' + file}`);
                    }

                }

            }

            return filesToInclude;

        } else {
            // throw error when we have an invalid directory
            let error_string = `$eInvalid directory ${dir}`
            this.fancyprinter.p(error_string);
            throw new Error(error_string);
        }

    }

}

module.exports = { FileLoader }
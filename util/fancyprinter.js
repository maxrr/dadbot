const ch = require('chalk');
const mm = require('moment');

class FancyPrinter {
    // constructor needs them codes
    constructor(inf, upd, err, fs) {
        this.codes = {
            inf: inf,
            upd: upd,
            err: err,
            fs: fs
        };
    }

    // do the thing!
    print(code, content) {
        
        if (content == null) { 
            content = code;
            // allows use of "$iMessage" or "$eError"
            if (content.substring(0, 1) == "$") {
                let prefix = content.substring(1, 2);
                content = content.substring(2);
                switch (prefix) {

                    case "i":
                        code = this.codes.inf;
                        break;
                    case "u":
                        code = this.codes.upd;
                        break;
                    case "e":
                        code = this.codes.err;
                        break;
                    case "f":
                        code = this.codes.fs;
                        break;
                        
                }
            } else {
                // if no code specified, assume informative
                code = this.codes.inf;
            }
        }

        // get a nice looking timestamp using moment.js (https://momentjs.com/)
        let timestamp = mm().format('HH:mm:ss');

        // split lines at \n
        let contentLines = content.split('\n');
        for (let i = 0; i < contentLines.length; i++) {
            let line = contentLines[i];
            switch (code) {
                case this.codes.upd:
                    if (i == 0) { console.log(ch.hex('#83b5cc')(`[${timestamp}] UPD ${line}`)); }
                           else { console.log(ch.hex('#83b5cc')(`               ${line}`)); }
                    break;
                case this.codes.err:
                    if (i == 0) { console.log(ch.bold.hex('#f2ec3a')(`[${timestamp}] ERR `) + ch.bgHex('#eb4d4d')(line)); } 
                           else { console.log(`               ${ch.bgHex('#eb4d4d')(line)}`); }
                    break;
                case this.codes.fs:
                    if (i == 0) { console.log(ch.hex('#6cad57')(`[${timestamp}] FS  ${line}`)); } 
                           else { console.log(ch.hex('#6cad57')(`               ${line}`)); }
                    break;
                default:
                    if (i == 0) { console.log(ch.hex('#a1a1a1')(`[${timestamp}] INF ${line}`)); }
                           else { console.log(ch.hex('#a1a1a1')(`               ${line}`)); }
                    break;
            }
        }
    }

    // establish pnt() and p() as aliases for print()
    pnt(...a) { this.print(...a); }
    p(...a) { this.print(...a); }

    // simple little warmup
    warmup() {
        this.print(this.codes.inf, "information");
        this.print(this.codes.upd, "update");
        this.print(this.codes.err, "error");
        this.print(this.codes.fs, "fs operation");
        this.print('FancyPrinter warmup complete!\n');
    }
}

module.exports = { FancyPrinter }
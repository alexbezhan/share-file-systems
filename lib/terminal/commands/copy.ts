
/* lib/terminal/commands/copy - A command driven utility to perform bit by bit file artifact copy. */
import { Stats } from "fs";
import { Stream, Writable } from "stream";

import commas from "../../common/commas.js";
import error from "../utilities/error.js";
import log from "../utilities/log.js";
import mkdir from "./mkdir.js";
import remove from "./remove.js";
import vars from "../utilities/vars.js";

// bit-by-bit copy stream for the file system
const copy = function terminal_copy(params:nodeCopyParams):void {
    // parameters
    // * callback:Function - the instructions to execute when copy is complete
    // * destination:string - the file system location where to put the copied items
    // * exclusions:string[] - file system objects to exclude from copy
    // * target:string - the file system path of the source item
    const numb:any  = {
            dirs : 0,
            files: 0,
            link : 0,
            size : 0
        },
        util:any  = {},
        testLog = {
            complete: true,
            link: true,
            lstat: true,
            mkdir: true,
            utimes: true
        },
        mkdirRecursion = {
            dir: true,
            file: true,
            link: true
        };
    let start:string = "",
        dest:string  = "",
        dirs:any  = {},
        target:string        = "",
        destination:string   = "",
        excludeLength:number = 0
    util.complete = function terminal_copy_complete(item:string):void {
        delete dirs[item];
        if (testLog.complete === true) {
            testLog.complete = false;
            vars.testLogger("copy", "complete", `completion test for ${item}`);
        }
        if (Object.keys(dirs).length < 1) {
            params.callback([numb.files, numb.size]);
        }
    };
    util.errorOut     = function terminal_copy_errorOut(er:Error):void {
        const filename:string[] = target.split(vars.sep);
        vars.testLogger("copy", "error", "Error, partially created tree will be removed.");
        remove(
            destination + vars.sep + filename[filename.length - 1],
            function terminal_copy_errorOut_remove() {
                error([er.toString()]);
            }
        );
    };
    util.dir      = function terminal_copy_dir(item:string):void {
        vars.node.fs.readdir(item, function terminal_copy_dir_readdir(er:Error, files:string[]):void {
            const place:string = dest + item.replace(start, "");
            if (er !== null) {
                util.errorOut(er);
                return;
            }
            mkdir(place, function terminal_copy_dir_readdir_mkdir():void {
                const a = files.length;
                let b = 0;
                if (testLog.mkdir === true) {
                    testLog.mkdir = false;
                    vars.testLogger("copy", "mkdir", `directory ${place} created and each item contained will get a stat or if empty run the completion test.`);
                }
                if (a > 0) {
                    delete dirs[item];
                    do {
                        dirs[item + vars.sep + files[b]] = true;
                        b = b + 1;
                    } while (b < a);
                    b = 0;
                    do {
                        util.stat(item + vars.sep + files[b], item);
                        b = b + 1;
                    } while (b < a);
                } else {
                    util.complete(item);
                }
            }, mkdirRecursion.dir);
            mkdirRecursion.dir = false;

        });
    };
    util.file     = function terminal_copy_file(item:string, dir:string, prop:nodeFileProps):void {
        const place:string       = dest + item.replace(start, ""),
            readStream:Stream  = vars.node
                .fs
                .createReadStream(item),
            writeStream:Writable = vars.node
                .fs
                .createWriteStream(place, {mode: prop.mode});
        let errorFlag:boolean   = false;
        readStream.on("error", function terminal_copy_file_readError(error:Error):void {
            errorFlag = true;
            util.errorOut(error);
            return;
        });
        writeStream.on("error", function terminal_copy_file_writeError(error:Error):void {
            errorFlag = true;
            util.errorOut(error);
            return;
        });
        if (errorFlag === false) {
            writeStream.on("open", function terminal_copy_file_write():void {
                readStream.pipe(writeStream);
            });
            writeStream.once("finish", function terminal_copy_file_finish():void {
                const filename:string[] = item.split(vars.sep);
                vars.node.fs.utimes(
                    dest + vars.sep + filename[filename.length - 1],
                    prop.atime,
                    prop.mtime,
                    function terminal_copy_file_finish_utimes():void {
                        if (testLog.utimes === true) {
                            testLog.utimes = false;
                            vars.testLogger("copy", "utimes", `stream complete for file ${item} and ready for completion test.`);
                        }
                        util.complete(item);
                    }
                );
            });
        }
    };
    util.link     = function terminal_copy_link(item:string, dir:string):void {
        vars.node.fs.readlink(item, function terminal_copy_link_readlink(err:Error, resolvedLink:string):void {
            if (err !== null) {
                util.errorOut(err);
                return;
            }
            resolvedLink = vars.node.path.resolve(resolvedLink);
            if (testLog.link === true) {
                testLog.link = false;
                vars.testLogger("copy", "link", "stat object represented by the symbolic link.");
            }
            vars.node.fs.stat(resolvedLink, function terminal_copy_link_readlink_stat(ers:Error, stats:Stats):void {
                let type  = "file",
                    place = dest + item.replace(start, "");
                if (ers !== null) {
                    util.errorOut(ers);
                    return;
                }
                if (stats === undefined || stats.isFile === undefined) {
                    util.errorOut(`Error in performing stat against ${item}`);
                    return;
                }
                if (item === dir) {
                    place = dest + item
                        .split(vars.sep)
                        .pop();
                }
                if (stats.isDirectory() === true) {
                    type = "junction";
                }
                vars.node.fs.symlink(
                    resolvedLink,
                    place,
                    type,
                    function terminal_copy_link_readlink_stat_makeLink(erl:Error):void {
                        if (erl !== null) {
                            util.errorOut(erl);
                            return;
                        }
                        util.complete(item);
                    }
                );
            });
        });
    };
    util.stat     = function terminal_copy_stat(item:string, dir:string):void {
        let a    = 0;
        if (excludeLength > 0) {
            do {
                if (item.replace(start + vars.sep, "") === params.exclusions[a]) {
                    params.exclusions.splice(a, 1);
                    excludeLength = excludeLength - 1;
                    util.complete(item);
                    return;
                }
                a = a + 1;
            } while (a < excludeLength);
        }
        vars.node.fs.lstat(item, function terminal_copy_stat_callback(er:Error, stats:Stats):void {
            if (er !== null) {
                util.errorOut(er);
                return;
            }
            if (stats === undefined || stats.isFile === undefined) {
                util.errorOut("stats object is undefined");
                return;
            }
            if (stats.isFile() === true) {
                if (testLog.lstat === true) {
                    testLog.lstat = false;
                    vars.testLogger("copy", "lstat", `stat ${item} is a file or points to a file.`);
                }
                numb.files = numb.files + 1;
                numb.size  = numb.size + stats.size;
                if (item === dir) {
                    mkdir(dest, function terminal_copy_stat_callback_file():void {
                        util.file(item, dir, {
                            atime: (Date.parse(stats.atime.toString()) / 1000),
                            mode : stats.mode,
                            mtime: (Date.parse(stats.mtime.toString()) / 1000)
                        });
                    }, mkdirRecursion.file);
                    mkdirRecursion.file = false;
                } else {
                    util.file(item, dir, {
                        atime: (Date.parse(stats.atime.toString()) / 1000),
                        mode : stats.mode,
                        mtime: (Date.parse(stats.mtime.toString()) / 1000)
                    });
                }
            } else if (stats.isDirectory() === true) {
                numb.dirs = numb.dirs + 1;
                util.dir(item);
            } else if (stats.isSymbolicLink() === true) {
                numb.link = numb.link + 1;
                if (item === dir) {
                    mkdir(dest, function terminal_copy_stat_callback_symbolic() {
                        util.link(item, dir);
                    }, mkdirRecursion.link);
                    mkdirRecursion.link = false;
                } else {
                    util.link(item, dir);
                }
            } else {
                util.complete(item);
            }
        });
    };
    if (vars.command === "copy") {
        vars.testLogger("copy", "command", "format output when the command is 'copy'.");
        if (vars.verbose === true) {
            log.title("Copy");
        }
        if (process.argv[0] === undefined || process.argv[1] === undefined) {
            error([
                "The copy command requires a source path and a destination path.",
                `Please execute ${vars.text.cyan + vars.version.command} commands copy${vars.text.none} for examples.`
            ]);
            return;
        }
        params = {
            callback: function terminal_copy_callback() {
                const out:string[] = [`${vars.version.name} copied `];
                out.push("");
                out.push(vars.text.green);
                out.push(vars.text.bold);
                out.push(numb.dirs);
                out.push(vars.text.none);
                out.push(" director");
                if (numb.dirs === 1) {
                    out.push("y, ");
                } else {
                    out.push("ies, ");
                }
                out.push(vars.text.green);
                out.push(vars.text.bold);
                out.push(numb.files);
                out.push(vars.text.none);
                out.push(" file");
                if (numb.files !== 1) {
                    out.push("s");
                }
                out.push(", and ");
                out.push(vars.text.green);
                out.push(vars.text.bold);
                out.push(numb.link);
                out.push(vars.text.none);
                out.push(" symbolic link");
                if (numb.link !== 1) {
                    out.push("s");
                }
                out.push(" at ");
                out.push(vars.text.green);
                out.push(vars.text.bold);
                out.push(commas(numb.size));
                out.push(vars.text.none);
                out.push(" bytes.");
                vars.verbose = true;
                log([out.join(""), `Copied ${vars.text.cyan + target + vars.text.none} to ${vars.text.green + destination + vars.text.none}`]);
            },
            exclusions: vars.exclusions,
            destination: process.argv[1].replace(/(\\|\/)/g, vars.sep),
            target: process.argv[0].replace(/(\\|\/)/g, vars.sep)
        };
    }
    vars.flags.write = target;
    target           =  vars.node.path.resolve(params.target.replace(/(\\|\/)/g, vars.sep));
    destination      = params.destination.replace(/(\\|\/)/g, vars.sep);
    excludeLength    = params.exclusions.length;
    dest             = vars.node.path.resolve(destination) + vars.sep;
    start            = target.slice(0, target.lastIndexOf(vars.sep) + 1);
    vars.testLogger("copy", "start", "begin with a stat wrapper.");
    util.stat(target, start);
};

export default copy;
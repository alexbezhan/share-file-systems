
import * as http from "http";
import * as fs from "fs";

import base64 from "../base64.js";
import copy from "../copy.js";
import directory from "../directory.js";
import error from "../error.js";
import hash from "../hash.js";
import log from "../log.js";
import makeDir from "../makeDir.js";
import readFile from "../readFile.js";
import remove from "../remove.js";
import vars from "../vars.js";

import httpClient from "./httpClient.js";
import serverVars from "./serverVars.js";

const library = {
        base64: base64,
        copy: copy,
        directory: directory,
        error: error,
        hash: hash,
        httpClient: httpClient,
        log: log,
        makeDir: makeDir,
        readFile: readFile,
        remove: remove
    },
    fileService = function terminal_server_fileService(request:http.IncomingMessage, response:http.ServerResponse, data:fileService):void {
        const fileCallback = function terminal_server_fileService_fileCallback(message:string):void {
                if (data.agent === "localhost") {
                    response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                    response.write(message);
                    response.end();
                } else {
                    library.directory({
                        callback: function terminal_server_fileService_fileCallback_dir(directory:directoryList):void {
                            const location:string = (data.name.indexOf("\\") < 0 || data.name.charAt(data.name.indexOf("\\") + 1) === "\\")
                                ? data.name
                                : data.name.replace(/\\/g, "\\\\");
                            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
                            response.write(`fsUpdateRemote:{"agent":"${data.agent}", "dirs":${JSON.stringify(directory)},"location":"${location}"}`);
                            response.end();
                        },
                        depth: 2,
                        exclusions: [],
                        hash: false,
                        path: data.name,
                        recursive: true,
                        symbolic: true
                    });
                }
            },
            remoteCopyList = function terminal_server_fileService_remoteCopyList(config:remoteCopyList):void {
                const list: [string, string, string, number][] = [],
                    callback = function terminal_server_fileService_remoteCopyList_callback(dir:directoryList):void {
                        const dirLength:number = dir.length,
                            location:string = (function terminal_server_fileServices_remoteCopyList_callback_location():string {
                                let backSlash:number = data.location[config.index].indexOf("\\"),
                                    forwardSlash:number = data.location[config.index].indexOf("/"),
                                    remoteSep:string = ((backSlash < forwardSlash && backSlash > -1 && forwardSlash > -1) || forwardSlash < 0)
                                        ? "\\"
                                        : "/",
                                    address:string[] = data.location[config.index].replace(/(\/|\\)$/, "").split(remoteSep);
                                address.pop();
                                return address.join(remoteSep) + remoteSep;
                            }());
                        let b:number = 0,
                            size:number;
                        // list schema:
                        // 0. full item path
                        // 1. item type: directory, file
                        // 2. relative path from point of user selection
                        // 3. size in bytes from Stats object
                        do {
                            if (dir[b][1] === "file") {
                                size = dir[b][5].size;
                                fileCount = fileCount + 1;
                                fileSize = fileSize + size;
                            } else {
                                size = 0;
                                directories = directories + 1;
                            }
                            list.push([dir[b][0], dir[b][1], dir[b][0].replace(location, ""), size]);
                            b = b + 1;
                        } while (b < dirLength);
                        config.index = config.index + 1;
                        if (config.index < config.length) {
                            library.directory({
                                callback: terminal_server_fileService_remoteCopyList_callback,
                                depth: 0,
                                exclusions: [],
                                hash: false,
                                path: data.location[config.index],
                                recursive: true,
                                symbolic: false
                            });
                        } else {
                            // sort directories ahead of files and then sort shorter directories before longer directories
                            // * This is necessary to ensure directories are written before the files and child directories that go in them.
                            config.files.sort(function terminal_server_fileService_sortFiles(itemA:[string, string, string, number], itemB:[string, string, string, number]):number {
                                if (itemA[1] === "directory" && itemB[1] !== "directory") {
                                    return -1;
                                }
                                if (itemA[1] !== "directory" && itemB[1] === "directory") {
                                    return 1;
                                }
                                if (itemA[1] === "directory" && itemB[1] === "directory") {
                                    if (itemA[2].length < itemB[2].length) {
                                        return -1;
                                    }
                                    return 1;
                                }
                                if (itemA[2] < itemB[2]) {
                                    return -1;
                                }
                                return 1;
                            });
                            config.callback({
                                directories: directories,
                                fileCount: fileCount,
                                fileSize: fileSize,
                                list: config.files
                            });
                        }
                    };
                let directories:number =0,
                    fileCount:number = 0,
                    fileSize:number = 0;
                library.directory({
                    callback: callback,
                    depth: 0,
                    exclusions: [],
                    hash: false,
                    path: data.location[config.index],
                    recursive: true,
                    symbolic: false
                });
            },
            requestFiles = function terminal_server_fileService_requestFiles(fileData:remoteCopyListData):void {
                let writeActive:boolean = false,
                    writtenSize:number = 0,
                    writtenFiles:number = 0;
                const listLength = fileData.list.length,
                    files:fileStore = [],
                    writeFile = function terminal_server_fileService_requestFiles_writeFile(index:number):void {
                        const fileName:string = files[index][1];
                        vars.node.fs.writeFile(data.name + vars.sep + fileName, files[index][3], function terminal_server_fileServices_requestFiles_fileCallback_end_writeFile(wr:nodeError):void {
                            if (wr !== null) {
                                library.log([`error: Error writing file ${fileName} from remote agent ${data.agent}`, wr.toString()]);
                                vars.ws.broadcast(`error: Error writing file ${fileName} from remote agent ${data.agent}`);
                            }
                            writtenFiles = writtenFiles + 1;
                            writtenSize = writtenSize + fileData.list[index][3];
                            // status update schema:
                            // 0. total file size
                            // 1. file size written
                            // 2. total files
                            // 3. files written
                            // 4. directories created
                            vars.ws.broadcast(`copyStatus:[${fileData.fileSize},${writtenSize},${fileData.fileCount},${writtenFiles},${fileData.directories}]`);
                            files[index][3] = Buffer.from("");
                            if (files.length > index + 1) {
                                terminal_server_fileService_requestFiles_writeFile(index + 1);
                            } else {
                                writeActive = false;
                            }
                        });
                    },
                    respond = function terminal_server_fileService_requestFiles_respond():void {
                        library.log([``]);
                        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
                        response.write(`${data.location.join(", ")} copied from ${data.agent} to localhost.`);
                        response.end();
                    },
                    fileCallback = function terminal_server_fileService_requestFiles_fileCallback(fileResponse:http.IncomingMessage):void {
                        const fileChunks:Buffer[] = [];
                        fileResponse.on("data", function terminal_server_fileServices_requestFiles_fileCallback_data(fileChunk:string):void {
                            fileChunks.push(Buffer.from(fileChunk, "binary"));
                        });
                        fileResponse.on("end", function terminal_server_fileServices_requestFiles_fileCallback_end():void {
                            const file:Buffer = Buffer.concat(fileChunks),
                                fileName:string = <string>fileResponse.headers.filename;
                            files.push([false, fileName, <string>fileResponse.headers.hash, file]);
                            library.hash({
                                callback: function terminal_server_fileService_requestFiles_fileCallback_end_hash(output:hashOutput):void {
                                    if (files[output.parent][2] === output.hash) {
                                        if (writeActive === false) {
                                            writeActive = true;
                                            writeFile(output.parent);
                                        }
                                    } else {
                                        library.log([`Hashes do not match for file ${output.id} from agent ${data.agent}`]);
                                        library.error([`Hashes do not match for file ${output.id} from agent ${data.agent}`]);
                                        vars.ws.broadcast(`error:Hashes do not match for file ${output.id} from agent ${data.agent}`);
                                    }
                                },
                                directInput: true,
                                id: fileName,
                                parent: files.length - 1,
                                source: file
                            });
                            activeRequests = activeRequests - 1;
                            if (a < listLength) {
                                requestFile();
                            }
                        });
                        fileResponse.on("error", function terminal_server_fileServices_requestFiles_fileCallback_error(fileError:nodeError):void {
                            library.error([fileError.toString()]);
                        });
                    },
                    requestFile = function terminal_server_fileService_requestFiles_requestFile():void {
                        data.location = [fileData.list[a][0]];
                        data.remoteWatch = fileData.list[a][2];
                        library.httpClient({
                            callback: fileCallback,
                            data: data,
                            errorMessage: `error: Error on requesting file ${fileData.list[a][2]} from ${data.agent}`,
                            response: response
                        });
                        a = a + 1;
                        if (a < listLength) {
                            activeRequests = activeRequests + 1;
                            if (activeRequests < 8) {
                                terminal_server_fileService_requestFiles_requestFile();
                            }
                        } else {
                            respond();
                        }
                        countFile = countFile + 1;
                    },
                    dirCallback = function terminal_server_fileService_requestFiles_dirCallback():void {
                        a = a + 1;
                        countDir = countDir + 1;
                        if (a < listLength) {
                            if (fileData.list[a][1] === "directory") {
                                makeDir();
                            } else {
                                data.action = <serviceFS>data.action.replace(/((list)|(request))/, "file");
                                requestFile();
                            }
                        } else {
                            respond();
                        }
                    },
                    makeDir = function terminal_server_fileService_requestFiles_makeLists():void {
                        library.makeDir(data.name + vars.sep + fileData.list[a][2], dirCallback);
                    };
                let a:number = 0,
                    activeRequests:number = 0,
                    countDir:number = 0,
                    countFile:number = 0;
                if (fileData.list[0][1] === "directory") {
                    makeDir();
                } else {
                    data.action = <serviceFS>data.action.replace(/((list)|(request))/, "file");
                    requestFile();
                }
            },
            copySameAgent = function terminal_server_fileService_copySameAgent():void {
                let count:number = 0;
                const length:number = data.location.length;
                data.location.forEach(function terminal_server_fileService_copySameAgent_each(value:string):void {
                    const callback = (data.action === "fs-copy")
                        ? function terminal_server_fileService_copySameAgent_each_copy():void {
                            count = count + 1;
                            if (count === length) {
                                fileCallback(`Path(s) ${data.location.join(", ")} copied.`);
                            }
                        }
                        : function terminal_server_fileService_copySameAgent_each_cut():void {
                            library.remove(value, function terminal_server_fileService_copySameAgent_each_cut_callback():void {
                                count = count + 1;
                                if (count === length) {
                                    fileCallback(`Path(s) ${data.location.join(", ")} cut and pasted.`);
                                }
                            });
                        }
                    library.copy({
                        callback: callback,
                        destination:data.name,
                        exclusions:[""],
                        target:value
                    });
                });
            };
        if (data.agent !== "localhost" && (data.action === "fs-base64" || data.action === "fs-destroy" || data.action === "fs-details" || data.action === "fs-hash" || data.action === "fs-new" || data.action === "fs-read" || data.action === "fs-rename" || data.action === "fs-write")) {
            library.httpClient({
                callback: function terminal_server_fileService_remoteString(fsResponse:http.IncomingMessage):void {
                    const chunks:string[] = [];
                    fsResponse.setEncoding("utf8");
                    fsResponse.on("data", function terminal_server_fileService_remoteString_data(chunk:string):void {
                        chunks.push(chunk);
                    });
                    fsResponse.on("end", function terminal_server_fileService_remoteString_end():void {
                        const body:string = chunks.join("");
                        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
                        response.write(body);
                        response.end();
                    });
                    fsResponse.on("error", function terminal_server_fileService_remoteString_error(errorMessage:nodeError):void {
                        if (errorMessage.code !== "ETIMEDOUT") {
                            library.log([errorMessage.toString()]);
                            vars.ws.broadcast(errorMessage.toString());
                        }
                    });
                },
                data: data,
                errorMessage: `error:Error requesting ${data.action} from remote.`,
                response: response
            });
        } else if (data.action === "fs-directory" || data.action === "fs-details") {
            if (data.agent === "localhost" || (data.agent !== "localhost" && typeof data.remoteWatch === "string" && data.remoteWatch.length > 0)) {
                const callback = function terminal_server_fileService_putCallback(result:directoryList):void {
                        count = count + 1;
                        if (result.length > 0) {
                            output = output.concat(result);
                        }
                        if (count === pathLength) {
                            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
                            if (output.length < 1) {
                                response.write(`{"id":"${data.id}","dirs":"missing"}`);
                            } else {
                                response.write(`{"id":"${data.id}","dirs":${JSON.stringify(output)}}`);
                            }
                            response.end();
                        }
                    },
                    windowsRoot = function terminal_server_fileService_windowsRoot():void {
                        //cspell:disable
                        vars.node.child("wmic logicaldisk get name", function terminal_server_fileService_windowsRoot(erw:Error, stdout:string, stderr:string):void {
                        //cspell:enable
                            if (erw !== null) {
                                library.error([erw.toString()]);
                            } else if (stderr !== "" && stderr.indexOf("The ESM module loader is experimental.") < 0) {
                                library.error([stderr]);
                            }
                            const drives:string[] = stdout.replace(/Name\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ").split(" "),
                                length:number = drives.length,
                                date:Date = new Date(),
                                driveList = function terminal_server_fileService_windowsRoot_driveList(result:directoryList):void {
                                    let b:number = 1;
                                    const resultLength:number = result.length,
                                        masterIndex:number = masterList.length;
                                    if (resultLength > 0) {
                                        do {
                                            result[b][3] = masterIndex; 
                                            b = b + 1;
                                        } while (b < resultLength);
                                        masterList = masterList.concat(result);
                                    }
                                    a = a + 1;
                                    if (a === length) {
                                        callback(masterList);
                                    }
                                };
                            let masterList:directoryList = [["\\", "directory", "", 0, length, {
                                    dev: 0,
                                    ino: 0,
                                    mode: 0,
                                    nlink: 0,
                                    uid: 0,
                                    gid: 0,
                                    rdev: 0,
                                    size: 0,
                                    blksize: 0,
                                    blocks: 0,
                                    atimeMs: 0,
                                    mtimeMs: 0,
                                    ctimeMs: 0,
                                    birthtimeMs: 0,
                                    atime: date,
                                    mtime: date,
                                    ctime: date,
                                    birthtime: date,
                                    isBlockDevice: function terminal_server_create_windowsRoot_isBlockDevice() {},
                                    isCharacterDevice: function terminal_server_create_windowsRoot_isCharacterDevice() {},
                                    isDirectory: function terminal_server_create_windowsRoot_isDirectory() {},
                                    isFIFO: function terminal_server_create_windowsRoot_isFIFO() {},
                                    isFile: function terminal_server_create_windowsRoot_isFile() {},
                                    isSocket: function terminal_server_create_windowsRoot_isSocket() {},
                                    isSymbolicLink: function terminal_server_create_windowsRoot_isSymbolicLink() {}
                                }]],
                                a:number = 0;
                            drives.forEach(function terminal_server_fileService_windowsRoot_each(value:string) {
                                library.directory({
                                    callback: driveList,
                                    depth: 1,
                                    exclusions: [],
                                    hash: false,
                                    path: `${value}\\`,
                                    recursive: true,
                                    symbolic: true
                                });
                            });
                        });
                    },
                    pathList:string[] = data.location,
                    pathLength:number = pathList.length;
                let count:number = 0,
                    output:directoryList = [];
                if (pathList[0] === "defaultLocation") {
                    pathList[0] = vars.projectPath;
                }
                pathList.forEach(function terminal_server_fileService_pathEach(value:string):void {
                    if (value === "\\" || value === "\\\\") {
                        windowsRoot();
                    } else {
                        vars.node.fs.stat(value, function terminal_server_fileService_putStat(erp:nodeError):void {
                            if (erp !== null) {
                                library.error([erp.toString()]);
                                callback([]);
                                return;
                            }

                            // please note
                            // watch is ignored on all operations other than fs-directory
                            // fs-directory will only read from the first value in data.location
                            if (data.watch !== "no" && data.watch !== vars.projectPath) {
                                if (data.watch !== "yes" && serverVars.watches[data.watch] !== undefined) {
                                    serverVars.watches[data.watch].close();
                                    delete serverVars.watches[data.watch];
                                }
                                if (serverVars.watches[value] === undefined) {
                                    serverVars.watches[value] = vars.node.fs.watch(value, {
                                        recursive: false
                                    }, function terminal_server_fileService_watch():void {
                                        if (value !== vars.projectPath && value + vars.sep !== vars.projectPath) {
                                            if (data.agent === "localhost") {
                                                vars.ws.broadcast(`fsUpdate:${value}`);
                                            } else {
                                                // create directoryList object and send to remote
                                                library.directory({
                                                    callback: function terminal_server_fileService_watch_remote(result:directoryList):void {
                                                        const remoteData:string[] = data.remoteWatch.split("_"),
                                                            remoteAddress:string = remoteData[0],
                                                            remotePort:number = Number(remoteData[1]),
                                                            location:string = (value.indexOf("\\") < 0 || value.charAt(value.indexOf("\\") + 1) === "\\")
                                                                ? value
                                                                : value.replace(/\\/g, "\\\\"),
                                                            payload:string = `fsUpdateRemote:{"agent":"${data.agent}","dirs":${JSON.stringify(result)},"location":"${location}"}`,
                                                            fsRequest:http.ClientRequest = http.request({
                                                                headers: {
                                                                    "Content-Type": "application/x-www-form-urlencoded",
                                                                    "Content-Length": Buffer.byteLength(payload)
                                                                },
                                                                host: remoteAddress,
                                                                method: "POST",
                                                                path: "/",
                                                                port: remotePort,
                                                                timeout: 4000
                                                            }, function terminal_server_fileService_watch_remote_callback(fsResponse:http.IncomingMessage):void {
                                                                const chunks:string[] = [];
                                                                fsResponse.setEncoding("utf8");
                                                                fsResponse.on("data", function terminal_server_fileService_watch_remote_callback_data(chunk:string):void {
                                                                    chunks.push(chunk);
                                                                });
                                                                fsResponse.on("end", function terminal_server_fileService_watch_remote_callback_end():void {
                                                                    if (response.finished === false) {
                                                                        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
                                                                        response.write(chunks.join(""));
                                                                        response.end();
                                                                    }
                                                                });
                                                                fsResponse.on("error", function terminal_server_fileService_watch_remote_callback_error(errorMessage:nodeError):void {
                                                                    if (errorMessage.code !== "ETIMEDOUT") {
                                                                        library.log([errorMessage.toString()]);
                                                                        vars.ws.broadcast(errorMessage.toString());
                                                                    }
                                                                });
                                                            });
                                                        fsRequest.on("error", function terminal_server_create_end_fsRequest_error(errorMessage:nodeError):void {
                                                            if (errorMessage.code !== "ETIMEDOUT") {
                                                                library.log(["watch-remote", errorMessage.toString()]);
                                                                vars.ws.broadcast(errorMessage.toString());
                                                            }
                                                            response.writeHead(500, {"Content-Type": "application/json; charset=utf-8"});
                                                            response.write("Error sending directory watch to remote.");
                                                            response.end();
                                                        });
                                                        fsRequest.write(payload);
                                                        setTimeout(function () {
                                                            fsRequest.end();
                                                        }, 100);
                                                    },
                                                    depth: 2,
                                                    exclusions: [],
                                                    hash: false,
                                                    path: value,
                                                    recursive: true,
                                                    symbolic: true
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                            library.directory({
                                callback: callback,
                                depth: data.depth,
                                exclusions: [],
                                hash: false,
                                path: value,
                                recursive: true,
                                symbolic: true
                            });
                        });
                    }
                });
            } else {
                // remote file server access
                library.httpClient({
                    callback: function terminal_server_fileService_remoteCopy(fsResponse:http.IncomingMessage):void {
                        const chunks:string[] = [];
                        fsResponse.setEncoding("utf8");
                        fsResponse.on("data", function terminal_server_fileService_remoteCopy_data(chunk:string):void {
                            chunks.push(chunk);
                        });
                        fsResponse.on("end", function terminal_server_fileService_remoteCopy_end():void {
                            const body:string = chunks.join("");
                            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
                            if (body.indexOf("fsUpdateRemote:") === 0) {
                                vars.ws.broadcast(body);
                                response.write("Terminal received file system response from remote.");
                            } else {
                                response.write(body);
                            }
                            response.end();
                        });
                        fsResponse.on("error", function terminal_server_fileService_remoteCopy_error(errorMessage:nodeError):void {
                            if (errorMessage.code !== "ETIMEDOUT") {
                                library.log([errorMessage.toString()]);
                                vars.ws.broadcast(errorMessage.toString());
                            }
                        });
                    },
                    data: data,
                    errorMessage: `error: Error on reading from remote file system at agent ${data.agent}`,
                    response: response
                });
            }
        } else if (data.action === "fs-close") {
            if (serverVars.watches[data.location[0]] !== undefined) {
                serverVars.watches[data.location[0]].close();
                delete serverVars.watches[data.location[0]];
            }
            fileCallback(`Watcher ${data.location[0]} closed.`);
        } else if (data.action === "fs-copy" || data.action === "fs-cut") {
            if (data.agent === "localhost") {
                if (data.copyAgent === "localhost") {
                    // * data.agent === "localhost"
                    // * data.copyAgent === "localhost"
                    copySameAgent();
                } else {
                    // copy from local to remote
                    // * data.agent === "localhost"
                    // * data.copyAgent === remoteAgent
                    // * response here is just for maintenance.  A list of files is pushed and the remote needs to request from that list, but otherwise a response isn't needed here.
                    remoteCopyList({
                        callback: function terminal_server_fileService_remoteListCallback(listData:remoteCopyListData):void {
                            data.action = <serviceType>`${data.action}-request`;
                            data.agent = data.copyAgent;
                            data.remoteWatch = JSON.stringify(listData);
                            library.httpClient({
                                callback: function terminal_server_fileServices_remoteListCallback_http(fsResponse:http.IncomingMessage):void {
                                    const chunks:string[] = [];
                                    fsResponse.on("data", function terminal_server_fileService_remoteListCallback_http_data(chunk:string):void {
                                        chunks.push(chunk);
                                    });
                                    fsResponse.on("end", function terminal_server_fileService_remoteListCallback_http_end():void {
                                        library.log([chunks.join("")]);
                                    });
                                    fsResponse.on("error", function terminal_server_fileService_remoteListCallback_http_error(errorMessage:nodeError):void {
                                        if (errorMessage.code !== "ETIMEDOUT") {
                                            library.log([errorMessage.toString()]);
                                            vars.ws.broadcast(errorMessage.toString());
                                        }
                                    });
                                },
                                data: data,
                                errorMessage: "error:Error sending list of files to remote for copy from localhost.",
                                response: response
                            });
                        },
                        files: [],
                        index: 0,
                        length: data.location.length
                    });
                }
            } else if (data.copyAgent === "localhost") {
                // data.agent === remoteAgent
                // data.copyAgent === "localhost"
                const action:serviceType = <serviceType>`${data.action}-list`,
                    callback = function terminal_server_fileService_response(fsResponse:http.IncomingMessage):void {
                        const chunks:string[] = [];
                        fsResponse.on("data", function terminal_server_fileService_response_data(chunk:string):void {
                            chunks.push(chunk);
                        });
                        fsResponse.on("end", function terminal_server_fileService_response_end():void {
                            requestFiles(JSON.parse(chunks.join("")));
                        });
                        fsResponse.on("error", function terminal_server_fileService_response_error(errorMessage:nodeError):void {
                            if (errorMessage.code !== "ETIMEDOUT") {
                                library.log([errorMessage.toString()]);
                                vars.ws.broadcast(errorMessage.toString());
                            }
                        });
                    };
                data.action = action;
                library.httpClient({
                    callback: callback,
                    data: data,
                    errorMessage: "copy from remote to localhost",
                    response: response
                });
            } else if (data.agent === data.copyAgent) {
                // * data.agent === sameRemoteAgent
                // * data.agent === sameRemoteAgent
                const action:serviceType = <serviceType>`${data.action}-self`;
                data.action = action;
                library.httpClient({
                    callback: function terminal_server_fileService_selfResponse(fsResponse:http.IncomingMessage):void {
                        const chunks:string[] = [];
                        fsResponse.setEncoding("utf8");
                        fsResponse.on("data", function terminal_server_fileService_remoteString_data(chunk:string):void {
                            chunks.push(chunk);
                        });
                        fsResponse.on("end", function terminal_server_fileService_remoteString_end():void {
                            const body:string = chunks.join("");
                            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
                            response.write(body);
                            response.end();
                        });
                        fsResponse.on("error", function terminal_server_fileService_remoteString_error(errorMessage:nodeError):void {
                            if (errorMessage.code !== "ETIMEDOUT") {
                                library.log([errorMessage.toString()]);
                                vars.ws.broadcast(errorMessage.toString());
                            }
                        });
                    },
                    data: data,
                    errorMessage: `error:Error copying files to and from agent ${data.agent}.`,
                    response: response
                });
            } else {
                // * data.agent === remoteAgent
                // * data.copyAgent === differentRemoteAgent
            }
        } else if (data.action === "fs-copy-file" || data.action === "fs-cut-file") {
            // request a single file
            // * generated internally from function requestFiles
            // * fs-copy-list and fs-cut-list (copy from remote to localhost)
            // * fs-copy-request and fs-cut-request (copy from localhost to remote)
            library.hash({
                callback: function terminal_server_fileService_fileHashCallback(output:hashOutput):void {
                    response.setHeader("hash", output.hash);
                    response.setHeader("fileName", data.remoteWatch);
                    response.writeHead(200, {"Content-Type": "application/octet-stream; charset=binary"});
                    const readStream:fs.ReadStream = vars.node.fs.ReadStream(output.filePath);
                    readStream.pipe(response);
                },
                directInput: false,
                source: data.location[0]
            });
        } else if (data.action === "fs-copy-list" || data.action === "fs-cut-list") {
            remoteCopyList({
                callback: function terminal_server_fileService_remoteListCallback(listData:remoteCopyListData):void {
                    response.writeHead(200, {"Content-Type": "application/octet-stream; charset=utf-8"});
                    response.write(JSON.stringify(listData));
                    response.end();
                },
                files: [],
                index: 0,
                length: data.location.length
            });
        } else if (data.action === "fs-copy-request" || data.action === "fs-cut-request") {
            requestFiles(JSON.parse(data.remoteWatch));
        } else if (data.action === "fs-copy-self" || data.action === "fs-cut-self") {
            copySameAgent();
        } else if (data.action === "fs-destroy") {
            let count:number = 0;
            data.location.forEach(function terminal_server_fileService_destroyEach(value:string):void {
                if (serverVars.watches[value] !== undefined) {
                    serverVars.watches[value].close();
                    delete serverVars.watches[value];
                }
                library.remove(value, function terminal_server_fileService_destroy():void {
                    count = count + 1;
                    if (count === data.location.length) {
                        fileCallback(`Path(s) ${data.location.join(", ")} destroyed.`);
                    }
                });
            });
        } else if (data.action === "fs-rename") {
            const newPath:string[] = data.location[0].split(vars.sep);
            newPath.pop();
            newPath.push(data.name);
            vars.node.fs.rename(data.location[0], newPath.join(vars.sep), function terminal_server_fileService_rename(erRename:Error):void {
                if (erRename === null) {
                    fileCallback(`Path ${data.location[0]} renamed to ${newPath.join(vars.sep)}.`);
                } else {
                    library.error([erRename.toString()]);
                    library.log([erRename.toString()]);
                    response.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
                    response.write(erRename.toString());
                    response.end();
                }
            });
        } else if (data.action === "fs-base64" || data.action === "fs-hash" || data.action === "fs-read") {
            const length:number = data.location.length,
                storage:stringDataList = [],
                type:string = data.action.replace("fs-", ""),
                callback = function terminal_server_fileService_callback(output:base64Output):void {
                    b = b + 1;
                    storage.push({
                        content: output[type],
                        id: output.id,
                        path: output.filePath
                    });
                    if (b === length) {
                        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
                        response.write(JSON.stringify(storage));
                        response.end();
                    }
                },
                fileReader = function terminal_server_fileService_fileReader(input:base64Input):void {
                    vars.node.fs.readFile(input.source, "utf8", function terminal_server_fileService_fileReader(readError:nodeError, fileData:string) {
                        if (readError !== null) {
                            library.error([readError.toString()]);
                            vars.ws.broadcast(`error:${readError.toString()}`);
                            return;
                        }
                        input.callback({
                            id: input.id,
                            filePath: input.source,
                            read: fileData
                        });
                    });
                };
            let a:number = 0,
                b:number = 0,
                id:string,
                index:number,
                location:string;
            do {
                index = data.location[a].indexOf(":");
                id = data.location[a].slice(0, index);
                location = data.location[a].slice(index + 1);
                if (data.action === "fs-base64") {
                    library[type]({
                        callback: callback,
                        id: id,
                        source: location
                    });
                } else if (data.action === "fs-hash") {
                    library.hash({
                        callback: callback,
                        directInput: false,
                        id: id,
                        source: location
                    });
                } else if (data.action === "fs-read") {
                    fileReader({
                        callback: callback,
                        id: id,
                        source: location
                    });
                }
                a = a + 1;
            } while (a < length);
        } else if (data.action === "fs-new") {
            const slash:string = (data.location[0].indexOf("/") < 0 || (data.location[0].indexOf("\\") < data.location[0].indexOf("/") && data.location[0].indexOf("\\") > -1 && data.location[0].indexOf("/") > -1))
                    ? "\\"
                    : "/",
                dirs = data.location[0].split(slash);
            dirs.pop();
            if (data.name === "directory") {
                library.makeDir(data.location[0], function terminal_server_fileService_newDirectory():void {
                    fileCallback(`${data.location[0]} created.`);
                    vars.ws.broadcast(`fsUpdate:${dirs.join(slash)}`);
                });
            } else if (data.name === "file") {
                vars.node.fs.writeFile(data.location[0], "", "utf8", function terminal_server_fileService_newFile(erNewFile:Error):void {
                    if (erNewFile === null) {
                        fileCallback(`${data.location[0]} created.`);
                        vars.ws.broadcast(`fsUpdate:${dirs.join(slash)}`);
                    } else {
                        library.error([erNewFile.toString()]);
                        library.log([erNewFile.toString()]);
                        response.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
                        response.write(erNewFile.toString());
                        response.end();
                    }
                });
            }
        } else if (data.action === "fs-write") {
            vars.node.fs.writeFile(data.location[0], data.name, "utf8", function terminal_server_fileService_write(erw:nodeError):void {
                let message:string = `File ${data.location[0]} saved to disk on ${data.copyAgent}.`;
                if (erw !== null) {
                    library.error([erw.toString()]);
                    vars.ws.broadcast(`error:${erw.toString()}`);
                    message = `Error writing file: ${erw.toString()}`;
                }
                response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                response.write(message);
                response.end();
            });
        }
    };

export default fileService;
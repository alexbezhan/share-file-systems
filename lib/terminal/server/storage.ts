
import { ServerResponse } from "http";

import error from "../error.js";
import log from "../log.js";
import vars from "../vars.js";

import httpClient from "./httpClient.js";
import serverVars from "./serverVars.js";

const library = {
        error: error,
        log: log
    },
    storage = function terminal_server_storage(dataString:string, response:ServerResponse, task:storageType):void {
        const fileName:string = `${vars.projectPath}storage${vars.sep + task}-${Math.random()}.json`,
            rename = function terminal_server_storage_rename():void {
                const respond = function terminal_server_storage_rename_respond(message:string):void {
                    if (parsed.send === true) {
                        response.writeHead(200, {"Content-Type": "text/plain"});
                        response.write(message);
                        response.end();
                    }
                };
                if (vars.command.indexOf("test") === 0) {
                    if (testSend === true) {
                        respond(`${task} written.`);
                    } else {
                        respond(`${task} written with false response for testing.`);
                    }
                } else {
                    vars.node.fs.rename(fileName, `${vars.projectPath}storage${vars.sep + task}.json`, function terminal_server_storage_renameNode(erName:Error) {
                        if (erName !== null) {
                            library.error([erName.toString()]);
                            vars.node.fs.unlink(fileName, function terminal_server_storage_rename_renameNode_unlink(erUnlink:Error) {
                                if (erUnlink !== null) {
                                    library.error([erUnlink.toString()]);
                                }
                            });
                            respond(erName.toString());
                            return;
                        }
                        respond(`${task} written.`);
                    });
                }
            },
            writeCallback = function terminal_server_storage_writeStorage(erSettings:Error):void {
                if (erSettings !== null) {
                    library.error([erSettings.toString()]);
                    library.log([erSettings.toString()]);
                    if (parsed.send === true) {
                        response.writeHead(200, {"Content-Type": "text/plain"});
                        response.write(erSettings.toString());
                        response.end();
                    }
                    return;
                }
                if (task === "users") {
                    serverVars.users = (dataString.indexOf("{\"share-update\":") === 0)
                        ? parsed["share-update"]
                        : parsed.users;
                    if (parsed.send === true) {
                        const keys:string[] = Object.keys(serverVars.users),
                            length:number = keys.length;
                        let a:number = 0;
                        do {
                            if (keys[a] !== "localhost") {
                                httpClient({
                                    callback: function terminal_server_storage_callback():void {
                                        return;
                                    },
                                    callbackType: "body",
                                    errorMessage: `Error on sending shares update from ${serverVars.name} to ${keys[a]}.`,
                                    id: "",
                                    payload: JSON.stringify({
                                        "share-update": {
                                            user: serverVars.name,
                                            shares: serverVars.users.localhost.shares
                                        }
                                    }),
                                    remoteName: keys[a],
                                    response: response
                                });
                            }
                            a = a + 1;
                        } while (a < length);
                    }
                    rename();
                } else if (task === "settings") {
                    const settings:ui_data = parsed.settings;
                    if (vars.command.indexOf("test") !== 0) {
                        serverVars.brotli = settings.brotli;
                        serverVars.hash = settings.hash;
                    }
                    rename();
                } else {
                    rename();
                }
            };
        let testSend:boolean = true,
            parsed:storage = JSON.parse(dataString);
        if (task === "share-update") {
            parsed.send = false;
            testSend = false;
        }
        if (vars.command.indexOf("test") === 0) {
            if (parsed.send === false) {
                parsed.send = true;
                testSend = false;
            }
            writeCallback(null);
        } else {
            vars.node.fs.writeFile(fileName, JSON.stringify(parsed[task]), "utf8", writeCallback);
        }
    };

export default storage;

/* lib/terminal/fileService/routeCopy - A library to handle file system asset movement. */

import { ServerResponse } from "http";

import error from "../utilities/error.js";
import httpClient from "../server/httpClient.js";
import serverVars from "../server/serverVars.js";
import serviceCopy from "./serviceCopy.js";
import serviceFile from "./serviceFile.js";
import user from "./user.js";

const routeCopy = function terminal_fileService_routeCopy(serverResponse:ServerResponse, dataString:string):void {
    const data:systemDataCopy = JSON.parse(dataString),
        route = function terminal_fileService_routeCopy_route(serverResponse:ServerResponse, data:systemDataCopy):void {
            const net:[string, number] = (data.tempSource !== "")
                ? [
                    serverVars.device[data.tempSource].ip,
                    serverVars.device[data.tempSource].port
                ]
                : (serverVars[data.agentSource.type][data.agentSource.id] === undefined)
                    ? ["", 0]
                    : [
                        serverVars[data.agentSource.type][data.agentSource.id].ip,
                        serverVars[data.agentSource.type][data.agentSource.id].port
                    ];
            if (net[0] !== "") {
                httpClient({
                    agentType: data.agentSource.type,
                    callback: function terminal_fileService_routeCopy_route_callback(message:string|Buffer):void {
                        const status:fileStatusMessage = JSON.parse(message.toString());
                        serviceFile.respond.status(serverResponse, status);
                        serviceFile.statusBroadcast({
                            action: "fs-directory",
                            agent: data.agentSource,
                            depth: 2,
                            location: data.location,
                            name: ""
                        }, status);
                    },
                    errorMessage: "",
                    ip: net[0],
                    payload: dataString,
                    port: net[1],
                    requestError: function terminal_fileService_routeCopy_route_requestError(errorMessage:nodeError):void {
                        if (errorMessage.code !== "ETIMEDOUT" && errorMessage.code !== "ECONNREFUSED") {
                            error(["Error at client request in route of routeCopy", JSON.stringify(data), errorMessage.toString()]);
                        }
                    },
                    requestType: "copy",
                    responseStream: httpClient.stream,
                    responseError: function terminal_fileService_routeCopy_route_requestError(errorMessage:nodeError):void {
                        if (errorMessage.code !== "ETIMEDOUT" && errorMessage.code !== "ECONNREFUSED") {
                            error(["Error at client response in route of routeCopy", JSON.stringify(data), errorMessage.toString()]);
                        }
                    }
                });
            }
        },
        menu = function terminal_fileService_routeCopy_menu():void {
            if (data.action === "copy") {
                if (data.agentSource.id === data.agentWrite.id) {
                    serviceCopy.actions.sameAgent(serverResponse, data);
                } else {
                    serviceCopy.actions.requestList(serverResponse, data, 0);
                }
            } else {
                const status:fileStatusMessage = {
                    address: data.agentWrite.modalAddress,
                    agent: data.agentWrite.id,
                    agentType: data.agentWrite.type,
                    fileList: "missing",
                    message: `Requested action "${data.action.replace("copy-", "")}" is not supported.`
                };
                serviceFile.respond.status(serverResponse, status);
                serviceFile.statusBroadcast({
                    action: "fs-directory",
                    agent: data.agentSource,
                    depth: 2,
                    location: data.location,
                    name: ""
                }, status);
            }
        };
    // service tests must be regarded as local device tests even they have a non-matching agent
    // otherwise there is an endless loop of http requests because service tests are only differentiated by port and not ip.
    if (data.agentSource.id === serverVars.hashDevice || serverVars.testType === "service") {
        menu();
    } else if (data.agentSource.id === serverVars.hashUser) {
        user({
            action: (data.cut === true)
                ? "cut"
                : (data.agentSource.share === data.agentWrite.share)
                    ? "copy"
                    : "fs-read",
            callback: function terminal_fileService_routeCopy_user(sourceDevice:string):void {
                if (sourceDevice !== null) {
                    if (data.agentSource.id === data.agentWrite.id) {
                        user({
                            action: "copy",
                            callback: function terminal_fileService_routeCopy_user_writeUser(writeDevice:string):void {
                                if (sourceDevice === serverVars.hashDevice) {
                                    if (sourceDevice === writeDevice) {
                                        serviceCopy.actions.sameAgent(serverResponse, data);
                                    } else {
                                        data.tempWrite = writeDevice;
                                        serviceCopy.actions.requestList(serverResponse, data, 0);
                                    }
                                } else {
                                    data.tempSource = sourceDevice;
                                    route(serverResponse, data);
                                }
                            },
                            location: data.agentWrite.modalAddress,
                            serverResponse: serverResponse,
                            share: data.agentWrite.share
                        });
                    } else {
                        serviceCopy.actions.requestList(serverResponse, data, 0);
                    }
                }
            },
            location: data.agentSource.modalAddress,
            serverResponse: serverResponse,
            share: data.agentSource.share
        });
    } else {
        route(serverResponse, data);
    }
};

export default routeCopy;
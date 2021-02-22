/* lib/typescript/fileService.d - TypeScript interfaces used by the file services. */

import { ServerResponse, IncomingHttpHeaders, IncomingMessage } from "http";
declare global {
    interface copyFileRequest {
        brotli: number;
        file_name: string;
        file_location: string;
        size: number;
    }
    interface copyStatusConfig {
        agent: fileAgent;
        countFile: number;
        failures: number;
        location: string[];
        message: string;
        serverResponse: ServerResponse;
        totalSize: number;
        writtenSize: number;
    }
    interface fileAgent {
        id: string;
        modalAddress: string;
        share: string;
        type: agentType;
    }
    interface fileServiceRequest {
        callback: (message:Buffer|string, headers:IncomingHttpHeaders) => void;
        data: systemDataFile;
        errorMessage: string;
        serverResponse: ServerResponse;
        stream: (message:IncomingMessage) => void;
    }
    interface fileServiceWatch {
        data: systemDataFile;
        serverResponse: ServerResponse;
        value: string;
    }
    interface fileStatusMessage {
        address: string;
        agent: string;
        agentType: agentType;
        fileList: directoryResponse;
        message: string;
    }
    interface fileUser {
        action: copyTypes | "cut" | fileAction;
        callback: (device:string) => void;
        location: string;
        serverResponse: ServerResponse;
        share: string;
    }
    interface fsDetails {
        dirs: directoryResponse;
        id: string;
    }
    interface remoteCopyListData {
        directories: number;
        fileCount: number;
        fileSize: number;
        list: [string, string, string, number][];
        stream: boolean;
    }
    interface systemDataCopy {
        action     : copyTypes;
        agentSource: fileAgent;
        agentWrite : fileAgent;
        cut        : boolean;
        location   : string[];
        tempSource : string;
        tempWrite  : string;
    }
    interface systemDataFile {
        action  : fileAction;
        agent   : fileAgent;
        depth   : number;
        location: string[];
        name    : string;
    }
    interface systemRequestFiles {
        data: systemDataCopy;
        fileData: remoteCopyListData;
    }
    interface systemServiceCopy {
        actions: {
            requestFiles: (serverResponse:ServerResponse, config:systemRequestFiles) => void;
            requestList: (serverResponse:ServerResponse, data:systemDataCopy, index:number) => void;
            sameAgent: (serverResponse:ServerResponse, data:systemDataCopy) => void;
            sendFile: (serverResponse:ServerResponse, data:copyFileRequest) => void;
        };
        percent: (numerator:number, denominator:number) => string;
        cutStatus: (data:systemDataCopy, fileList:remoteCopyListData) => void;
        status: (config:copyStatusConfig) => void;
    }
    interface systemServiceFile {
        actions: {
            close: (serverResponse:ServerResponse, data:systemDataFile) => void;
            destroy: (serverResponse:ServerResponse, data:systemDataFile) => void;
            directory: (serverResponse:ServerResponse, data:systemDataFile) => void;
            newArtifact: (serverResponse:ServerResponse, data:systemDataFile) => void;
            read: (serverResponse:ServerResponse, data:systemDataFile) => void;
            rename: (serverResponse:ServerResponse, data:systemDataFile) => void;
            write: (serverResponse:ServerResponse, data:systemDataFile) => void;
        };
        menu: (serverResponse:ServerResponse, data:systemDataFile) => void;
        respond: {
            details: (serverResponse:ServerResponse, details:fsDetails) => void;
            error: (serverResponse:ServerResponse, message:string) => void;
            read: (serverResponse:ServerResponse, list:stringDataList) => void;
            status: (serverResponse:ServerResponse, status:fileStatusMessage) => void;
            write: (serverResponse:ServerResponse) => void;
        };
        statusBroadcast: (data:systemDataFile|systemDataCopy, status:fileStatusMessage) => void;
        statusMessage: (serverResponse:ServerResponse, data:systemDataFile, dirs:directoryResponse) => void;
    }
}
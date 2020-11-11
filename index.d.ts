
import { Stats } from "fs";
import { ServerResponse, IncomingHttpHeaders, IncomingMessage } from "http";
import { Server } from "net";

declare global {
    type agency = [string, boolean, agentType];
    type agentTextList = [agentType, string][];
    type agentType = "device" | "user";
    type brotli = 0|1|2|3|4|5|6|7|8|9|10|11;
    type browserDOM = [domMethod, string, number];
    type certKey = "crt" | "key";
    type color = [string, string];
    type colorScheme = "dark" | "default";
    type contextType = "" | "Base64" | "copy" | "cut" | "directory" | "Edit" | "file" | "Hash";
    type directoryItem = [string, "error" | "file" | "directory" | "link", string, number, number, Stats];
    type directoryMode = "array" | "hash" | "list" | "read" | "search";
    type domMethod = "activeElement" | "childNodes" | "documentElement" | "firstChild" | "getAncestor" | "getElementById" | "getElementsByAttribute" | "getElementsByClassName" | "getElementsByName" | "getElementsByTagName" | "getElementsByText" | "getModalsByModalType" | "getNodesByType" | "lastChild" | "nextSibling" | "parentNode" | "previousSibling";
    type dragFlag = "" | "control" | "shift";
    type eventCallback = (event:Event, callback:Function) => void;
    type eventName = "blur" | "click" | "contextmenu" | "dblclick" | "focus" | "keydown" | "keyup" | "move" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseover" | "mouseout" | "mouseup" | "refresh" | "refresh-interaction" | "select" | "setValue" | "touchend" | "touchend" | "touchstart";
    type hash = "blake2d512" | "blake2s256" | "sha3-224" | "sha3-256" | "sha3-384" | "sha3-512" | "sha384" | "sha512" | "sha512-224" | "sha512-256" | "shake128" | "shake256";
    type heartbeatStatus = "" | "active" | "deleted" | "idle" | "offline";
    type inviteAction = "invite" | "invite-request" | "invite-response" | "invite-complete";
    type inviteStatus = "accepted" | "declined" | "invited";
    type modalStatus = "hidden" | "maximized" | "minimized" | "normal";
    type modalType = "details" | "export" | "fileEdit" | "fileNavigate" | "invite-accept" | "invite-request" | "message" | "shares" | "share_delete" | "settings" | "textPad";
    type primitive = boolean | null | number | string | undefined;
    type qualifier = "begins" | "contains" | "ends" | "greater" | "is" | "lesser" | "not" | "not contains";
    type qualifierFile = "file begins" | "file contains" | "file ends" | "file is" | "file not" | "file not contains" | "filesystem contains" | "filesystem not contains";
    type selector = "class" | "id" | "tag";
    type serviceFS = "fs-base64" | "fs-close" | "fs-copy" | "fs-copy-file" | "fs-copy-list" | "fs-copy-list-remote" | "fs-copy-request" | "fs-copy-self" | "fs-cut" | "fs-cut-file" | "fs-cut-list" | "fs-cut-list-remote" | "fs-cut-remove" | "fs-cut-request" | "fs-cut-self" | "fs-destroy" | "fs-details" | "fs-directory" | "fs-hash" | "fs-new" | "fs-read" | "fs-rename" | "fs-search" | "fs-write";
    type serverTask = "delete-agents" | "fs" | "fs-update-remote" | "hashDevice" | "hashShare" | "heartbeat-complete" | "heartbeat-delete-agents" | "heartbeat-status" | "heartbeat-update" | "message" | "invite" | "storage" | "test-browser";
    type serviceType = serviceFS | "invite-status" | "settings";
    type shareType = "directory" | "file" | "link";
    type storageType = "device" | "message" | "settings" | "user";
    type testListType = "browser" | "service" | "simulation";
    type testLogFlag = "" | testListType;
    type testServiceFileTarget = fsRemote | string | stringData[] | testTemplateCopyStatus;
    type ui_input = "cancel" | "close" | "confirm" | "maximize" | "minimize" | "save" | "text";

    interface addAgent {
        type: agentType;
        hash: string;
        name: string;
        save: boolean;
    }
    interface agent {
        ip: string;
        name: string;
        port: number;
        shares: agentShares;
    }
    interface agentCounts {
        count: number;
        total: number;
    }
    interface agentsConfiguration {
        complete?: (counts:agentCounts) => void;
        countBy: "agent" | "agentType" | "share";
        perAgent?: (agentNames:agentNames, counts:agentCounts) => void;
        perAgentType?: (agentNames:agentNames, counts:agentCounts) => void;
        perShare?: (agentNames:agentNames, counts:agentCounts) => void;
        source: browser | serverVars | storageItems;
    }
    interface agentData {
        device: agents;
        user: agents;
    }
    interface agentList {
        device: string[];
        user: string[];
    }
    interface agentNames {
        agent?: string;
        agentType: agentType;
        share?: string;
    }
    interface agents {
        [key:string]: agent;
    }
    interface agentShare {
        execute: boolean;
        name: string;
        readOnly: boolean;
        type: shareType;
    }
    interface agentShares {
        [key:string]: agentShare;
    }
    interface appName {
        command: string,
        name: string
    }
    interface audio {
        [key:string]: {
            data: string;
            licenseAddress: string;
            licenseName: string;
            seconds: number;
            url: string;
        }
    }
    interface base64Input {
        callback: Function;
        id: string;
        source: string;
    }
    interface base64Output {
        base64: string;
        filePath: string;
        id: string;
    }
    interface browser {
        content: HTMLElement;
        data: ui_data;
        device: agents;
        loadTest: boolean;
        localNetwork: localNetwork;
        menu: {
            export: HTMLElement;
            fileNavigator: HTMLElement;
            systemLog: HTMLElement;
            settings: HTMLElement;
            textPad: HTMLElement;
            "user-delete": HTMLElement;
            "user-invite": HTMLElement;
        };
        pageBody: Element;
        socket?: WebSocket;
        style: HTMLStyleElement;
        testBrowser: testBrowserItem;
        user: agents;
    }
    interface certificate {
        certificate: {
            cert: string;
            key: string;
        };
        flag: {
            crt: boolean;
            key: boolean;
        };
    }
    interface certificate_input {
        caDomain: string;
        callback: (logs:string[]) => void;
        caName: string;
        days: number;
        domain: string;
        location: string;
        mode: "create" | "remove";
        name: string;
        organization: string;
        selfSign: boolean;
    }
    interface certificate_remove {
        ca: certificate_remove_item;
        root: certificate_remove_item;
    }
    interface certificate_remove_item {
        command: string;
        flag: boolean;
        logs: string[];
    }
    interface clipboard {
        agent: string;
        agentType: agentType;
        data: string[];
        id: string;
        share: string;
        type: string;
    }
    interface colorList {
        [key:string]: color;
    }
    interface colors {
        device: colorList;
        user: colorList;
    }
    interface commandExample {
        code: string;
        defined: string;
    }
    interface commandList {
        [key:string]: {
            description: string;
            example: commandExample[];
        }
    }
    interface context extends EventHandlerNonNull {
        (Event:Event, element?:Element): void;
    }
    interface contextFunctions {
        base64: Function;
        copy: Function;
        cut: Function;
        destroy: Function;
        details: Function;
        edit: Function;
        hash: Function;
        newDirectory: Function;
        newFile: Function;
        paste: Function;
        rename: Function;
        share: Function;
    }
    interface contextNew extends EventHandlerNonNull {
        (Event:Event, element?:Element, type?:string): void;
    }
    interface completeStatus {
        countFile: number;
        failures: number;
        percent: number;
        writtenSize: number;
    }
    interface copyLog {
        file: boolean;
        link: boolean;
        mkdir: boolean;
    }
    interface copyStats {
        dirs: number;
        error: number;
        files: number;
        link: number;
        size: number;
    }
    interface copyStatus {
        failures: string[];
        fileList?: directoryList;
        message: string;
        target: string;
    }
    interface directoryList extends Array<directoryItem> {
        [index:number]: directoryItem;
        failures?: string[];
    }
    interface docItem {
        description: string;
        name: string;
        namePadded: string;
        path: string;
    }
    interface Document {
        getElementsByAttribute: (name:string, value:string) => Element[];
        getModalsByModalType: (type:modalType|"all") => Element[];
        getNodesByType: (typeValue:string|number) => Node[];
        getElementsByText: (textValue:string, caseSensitive?:boolean) => Element[];
    }
    interface Element {
        getAncestor: (identifier:string, selector:selector) => Element;
        getElementsByAttribute: (name:string, value:string) => Element[];
        getNodesByType: (typeValue:string|number) => Node[];
        getElementsByText: (textValue:string, caseSensitive?:boolean) => Element[];
    }
    interface fileService {
        action      : serviceType;
        agent       : string;
        agentType   : agentType;
        copyAgent   : string;
        copyShare?  : string;
        copyType    : agentType;
        depth       : number;
        id          : string;
        location    : string[];
        name        : string;
        remoteWatch?: string;
        share       : string;
        watch       : string;
    }
    interface fileServiceRequest {
        callback: (message:Buffer|string, headers:IncomingHttpHeaders) => void;
        data: fileService;
        errorMessage:string;
        serverResponse: ServerResponse;
        stream?:(message:IncomingMessage) => void;
    }
    interface fileServiceRequestFiles {
        data: fileService;
        fileData: remoteCopyListData;
        logRecursion: boolean;
        serverResponse: ServerResponse;
    }
    interface fileServiceWatch {
        data: fileService;
        logRecursion: boolean;
        serverResponse: ServerResponse;
        value: string;
    }
    interface fileStore extends Array<[number, string, string, Buffer]> {
        [index:number]: [number, string, string, Buffer];
    }
    interface flags {
        error: boolean;
        write: string;
    }
    interface fsDetails {
        directories: number;
        files: number;
        links: number;
        size: number;
    }
    interface fsRemote {
        dirs: directoryList | "missing" | "noShare" | "readOnly";
        fail: string[];
        id: string;
    }
    interface fsUpdateRemote {
        agent: string;
        agentType: agentType;
        dirs: directoryList;
        fail: string[];
        location: string;
        status?: copyStatus;
    }
    interface FSWatcher extends Function {
        close: Function;
        time: number;
    }
    interface hashInput {
        algorithm?: hash;
        callback: Function;
        directInput: boolean;
        id?: string;
        parent?: number;
        source: Buffer | string;
        stat?: Stats;
    }
    interface hashOutput {
        filePath: string;
        hash: string;
        id?: string;
        parent?: number;
        stat?: Stats;
    }
    interface hashShare {
        device: string;
        share: string;
        type: shareType;
    }
    interface hashShareConfiguration {
        callback:(string) => void;
        device: string;
        share: string;
        type: shareType;
    }
    interface hashShareResponse {
        device: string;
        hash: string;
        share: string;
        type: shareType;
    }
    interface hashUser {
        device: string;
        user: string;
    }
    interface heartbeat {
        agentTo: string;
        agentFrom: string;
        agentType: agentType;
        shares: agents;
        shareType: agentType;
        status: heartbeatStatus | agentList;
    }
    interface heartbeatBroadcast {
        deleted: agentList;
        list: heartbeatShare;
        requestType: "heartbeat-complete" | "heartbeat-delete-agents";
        response: ServerResponse;
        sendShares: boolean;
        status: heartbeatStatus;
    }
    interface heartbeatObject {
        delete: (deleted:agentList, serverResponse:ServerResponse) => void;
        deleteResponse: (data:heartbeat, serverResponse:ServerResponse) => void;
        parse: (data:heartbeat, serverResponse:ServerResponse) => void;
        update: (data:heartbeatUpdate) => void;
    }
    interface heartbeatShare {
        distribution: string[];
        payload: agents;
        type: agentType;
    }
    interface heartbeatUpdate {
        agentFrom: "localhost-browser" | "localhost-terminal";
        broadcastList: heartbeatShare;
        response: ServerResponse;
        shares: agents;
        status: heartbeatStatus;
        type: agentType;
    }
    interface httpConfiguration {
        agentType: agentType,
        callback: (message:Buffer|string, headers:IncomingHttpHeaders) => void;
        errorMessage: string;
        id: string;
        ip: string;
        payload: Buffer|string;
        port: number;
        remoteName: string;
        requestError: (error:nodeError, agent?:string, type?:agentType) => void;
        requestType: string;
        response: ServerResponse;
        responseError: (error:nodeError, agent?:string, type?:agentType) => void;
        stream?: (message:IncomingMessage) => void;
    }
    interface httpServer extends Server {
        port: number;
    }
    interface invite {
        action: inviteAction;
        deviceName: string;
        deviceHash: string;
        ip: string;
        message: string;
        modal: string;
        port: number;
        shares: agents;
        status: inviteStatus;
        type: agentType;
        userHash: string;
        userName: string;
    }
    interface inviteIndexes {
        ip: number,
        port: number,
        type: number
    }
    interface invitePayload {
        action: inviteAction;
        ip: string;
        message: string;
        modal: string;
        port: number;
        status: inviteStatus;
        type: agentType;
    }
    interface inviteSaved {
        ip: string;
        message: string;
        port: string;
        type: agentType;
    }
    interface localNetwork {
        family: "ipv4" | "ipv6";
        ip: string;
        httpPort: number;
        wsPort: number;
    }
    interface messageError {
        error: string;
        stack: string[];
    }
    interface messageItem {
        agentFrom: string;
        agentTo: string;
        agentType: agentType;
        date: number;
        message: string;
    }
    interface methodList {
        [key:string]: Function;
    }
    interface modalSettings extends EventHandlerNonNull {
        (Event:Event, user?:string, configuration?:ui_modal): void;
    }
    interface modalTop extends EventHandlerNonNull {
        (event:Event, elementInput?: Element): void;
    }
    interface modifyFile {
        end: string;
        source: string;
        target: string;
        start: string;
    }
    interface module_common {
        agents: (agents:agentsConfiguration) => void;
        capitalize: (input:string) => string;
        commas: (number:number) => string;
        deviceShare: (devices:agents, deleted:agentList) => agentShares;
        prettyBytes: (an_integer:number) => string; 
    }
    interface module_context {
        copy?: EventHandlerNonNull;
        dataString?: EventHandlerNonNull;
        destroy?: EventHandlerNonNull;
        details?: context;
        element: Element;
        fsNew?: EventHandlerNonNull;
        menu?: EventHandlerNonNull;
        menuRemove?: () => void;
        paste?: EventHandlerNonNull;
        type: contextType;
    }
    interface module_fileBrowser {
        back?: EventHandlerNonNull;
        directory?: EventHandlerNonNull;
        drag?: EventHandlerNonNull;
        dragFlag?: dragFlag;
        expand?: EventHandlerNonNull;
        list?: (location:string, dirData:fsRemote) => [Element, number, string];
        listFail?: (count:number, box: Element) => void;
        listFocus?: EventHandlerNonNull;
        listItem?: (item:directoryItem, extraClass:string) => Element;
        navigate?: navigate;
        parent?: EventHandlerNonNull;
        rename?: EventHandlerNonNull;
        saveFile?: EventHandlerNonNull;
        search?: (event?:Event|KeyboardEvent, searchElement?:HTMLInputElement, callback?:Function) => void;
        searchBlur?: EventHandlerNonNull;
        searchFocus?: EventHandlerNonNull;
        select?: EventHandlerNonNull;
        text?: EventHandlerNonNull;
    }
    interface module_invite {
        accept?: (box:Element) => void;
        addAgents?: (invitation:invite) => void;
        complete?: (invitation:invite) => void;
        decline?: EventHandlerNonNull;
        payload?: (config:invitePayload) => invite;
        portValidation?: EventHandlerNonNull;
        request?: (event:MouseEvent, options:ui_modal) => void;
        respond?: (invitation:invite) => void;
        start?: sharesDeleteList;
        typeToggle?: EventHandlerNonNull;
    }
    interface module_message {
        footer?: () => Element;
        modal?: (configuration:ui_modal) => void;
        mousedown: boolean;
        post?: (item:messageItem) => void;
        shareButton?: EventHandlerNonNull;
        submit?: EventHandlerNonNull;
        textareaDown?: EventHandlerNonNull;
        textareaResize?: EventHandlerNonNull;
        textareaUp?: EventHandlerNonNull;
    }
    interface module_modal {
        close?: EventHandlerNonNull;
        closeEnduring?: EventHandlerNonNull;
        confirm?: EventHandlerNonNull;
        create?: (options:ui_modal) => Element;
        export?: EventHandlerNonNull;
        importSettings?: EventHandlerNonNull;
        maximize?: EventHandlerNonNull;
        minimize?: EventHandlerNonNull;
        move?: EventHandlerNonNull;
        resize?: EventHandlerNonNull;
        textPad?: textPad;
        textSave?: EventHandlerNonNull;
        textTimer?: EventHandlerNonNull;
        unMinimize?: EventHandlerNonNull;
        zTop?: modalTop;
    }
    interface module_network {
        deleteAgents?: (deleted:agentList) => void;
        fileBrowser?: (localService, callback:Function, id?:string) => void;
        hashDevice?: (callback:Function) => void;
        hashShare?: (configuration:hashShareConfiguration) => void;
        heartbeat?: (status:heartbeatStatus, update:boolean) => void;
        inviteAccept?:(configuration:invite) => void;
        inviteRequest?: (configuration:invite) => void;
        message?: (message:messageItem) => void;
        storage?: (type:storageType) => void;
        testBrowserLoaded?: (payload?:[boolean, string, string][], index?:number) => void;
        xhr?: (config:networkConfig) => void;
    }
    interface module_remote {
        delay?: (config:testBrowserItem) => void;
        domFailure: boolean;
        error?: (message:string, source:string, line:number, col:number, error:Error) => void;
        evaluate?: (test:testBrowserTest, config:testBrowserItem) => [boolean, string, string];
        event?: (event:testBrowserItem, pageLoad:boolean) => void;
        getProperty?: (test:testBrowserTest, config:testBrowserItem) => primitive;
        index: number;
        keyAlt: boolean;
        keyControl: boolean;
        keyShift: boolean;
        node?: (dom:testBrowserDOM, config:testBrowserItem) => Element;
        stringify?: (primitive:primitive) => string;
        test?: (test:testBrowserTest[], index:number, config:testBrowserItem) => void;
    }
    interface module_settings {
        addUserColor?: (agent:string, type:agentType, settingsBody:Element) => void;
        agentColor?: EventHandlerNonNull;
        applyAgentColors?: (agent:string, type:agentType, colors:[string, string]) => void;
        audio?: EventHandlerNonNull;
        colorDefaults?: colorList;
        colorScheme?: EventHandlerNonNull;
        compressionText?: (event:KeyboardEvent|FocusEvent) => void;
        compressionToggle?: EventHandlerNonNull;
        modal?: EventHandlerNonNull;
        modalContent?: () => Element;
        radio?:(element:Element) => void;
        styleText?: (input:styleText) => void;
    }
    interface module_share {
        addAgent?: (input:addAgent) => void;
        content?: (agent:string, agentType:agentType|"") => Element;
        context?: EventHandlerNonNull;
        deleteAgent?: (agent:string, agentType:agentType) => void;
        deleteAgentList?: (box:Element) => void;
        deleteItem?: EventHandlerNonNull;
        deleteList?: (event:MouseEvent, configuration?:ui_modal) => void;
        deleteListContent?: () => Element;
        deleteToggle?: EventHandlerNonNull;
        modal?: (agent:string, agentType:agentType|"", configuration:ui_modal|null) => void;
        readOnly?: EventHandlerNonNull;
        update?: (exclusion:string) => void;
    }
    interface module_util {
        audio?: (name:string) => void;
        dateFormat?: (date:Date) => string;
        delay?: () => Element;
        dragBox?: eventCallback;
        dragList?: (event:Event, dragBox:Element) => void;
        fileListStatus?: (data:copyStatus) => void;
        fixHeight?: () => void;
        formKeys?: (event:KeyboardEvent, submit:Function) => void;
        getAgent?: (element:Element) => agency;
        keys?: (event:KeyboardEvent) => void;
        login?: EventHandlerNonNull;
        menu?: EventHandlerNonNull;
        menuBlur?: EventHandlerNonNull;
        minimizeAll?: EventHandlerNonNull;
        minimizeAllFlag?: boolean;
        selectedAddresses?: (element:Element, type:string) => [string, shareType, string][];
        selectExpression?: RegExp;
        selectNone?:(element:Element) => void;
        time?: (date:Date) => string;
    }
    interface navConfig {
        agentName: string;
        agentType: agentType;
        path: string;
        readOnly: boolean;
        share: string;
    }
    interface navigate extends EventHandlerNonNull {
        (Event:Event, config?: navConfig): void;
    }
    interface networkConfig {
        callback: (responseText:string) => void;
        error: string;
        payload: string;
        type: string;
    }
    interface nodeCopyParams {
        callback: Function;
        destination: string;
        exclusions: string[];
        target: string;
    }
    interface nodeError extends Error {
        address: string;
        code: string;
        Error: Error;
        port: number;
    }
    interface nodeFileProps {
        atime: number;
        mode: number;
        mtime: number;
    }
    interface nodeLists {
        empty_line: boolean;
        heading: string;
        obj: any;
        property: "each" | string;
        total: boolean;
    }
    interface perimeter {
        bottom: number;
        left: number;
        right: number;
        top: number;
    }
    interface readDirectory {
        callback: Function;
        depth: number;
        exclusions: string[];
        logRecursion: boolean;
        mode: directoryMode;
        path: string;
        search?: string;
        symbolic: boolean;
    }
    interface readFile {
        callback: Function;
        id?: string;
        index: number;
        path: string;
        stat: Stats;
    }
    interface remoteCopyList {
        callback: Function;
        files: [string, string, string, number][];
        id: string;
        index: number;
        length: number;
    }
    interface remoteCopyListData {
        directories: number;
        fileCount: number;
        fileSize: number;
        id: string;
        list: [string, string, string, number][];
        stream: boolean;
    }
    interface selection {
        [key:string]: string;
    }
    interface serverCallback {
        agent: string;
        agentType: agentType;
        callback:(output:serverOutput) => void;
    }
    interface serverError {
        stack: string[];
        error: string;
    }
    interface serverOutput {
        agent: string;
        agentType: agentType;
        server: httpServer;
        webPort: number;
        wsPort: number;
    }
    interface serverVars {
        addresses: [[string, string, string][], number];
        brotli: brotli;
        device: agents;
        hashDevice: string;
        hashType: hash;
        hashUser: string;
        ipAddress: string;
        nameDevice: string;
        nameUser: string;
        secure: boolean;
        status: heartbeatStatus;
        storage: string;
        testBrowser?: string;
        timeStore: number;
        user: agents;
        watches: {
            [key:string]: FSWatcher;
        };
        webPort: number;
        wsPort: number;
    }
    interface serviceFlags {
        local: boolean;
        remote: boolean;
    }
    interface shareButton {
        index: number;
        name: string;
        type: agentType;
    }
    interface sharesDeleteList extends EventHandlerNonNull {
        (event:MouseEvent, configuration?:ui_modal): void;
    }
    interface shareUpdate {
        user: string;
        shares: agentShares;
    }
    interface SocketEvent extends Event {
        data: string;
    }
    interface socketError {
        error: string;
        stack: string[];
    }
    interface storage {
        data: agents | ui_data;
        response: ServerResponse;
        type: storageType;
    }
    interface storageFlag {
        [key:string]: boolean;
    }
    interface storageItems {
        device: agents;
        settings: ui_data;
        user: agents;
    }
    interface stringData {
        content: string;
        id: string;
        path: string;
    }
    interface stringDataList extends Array<stringData> {
        [index:number]: stringData;
    }
    interface styleText{
        agent: string;
        colors: [string, string];
        replace: boolean;
        type: agentType;
    }
    interface terminalVariables {
        binary_check: RegExp;
        cli: string;
        command: string;
        commands: commandList;
        cwd: string;
        exclusions: string[];
        flags: {
            error: boolean;
            write: string;
        },
        js: string;
        node: {
            child : any;
            crypto: any;
            fs    : any;
            http  : any;
            https : any;
            http2 : any;
            net   : any;
            os    : any;
            path  : any;
            zlib  : any;
        };
        projectPath: string;
        sep: string;
        startTime: [number, number];
        testLogFlag: testLogFlag;
        testLogger: (library:string, container:string, message:string) => void;
        testLogStore: string[];
        text: {
            [key:string]: string;
        };
        verbose: boolean;
        version: version;
        ws: any;
    }
    interface testAgentOutput {
        agent: string;
        agentType: agentType;
        status: "bad" | "good";
        type: "request" | "response";
    }
    interface testBrowserApplication {
        [index:number]: testBrowserItem;
        args: testBrowserArgs;
        execute?: (args:testBrowserArgs) => void;
        index: number;
        iterate?: (index:number) => void;
        result?: (item:testBrowserResult, serverResponse:ServerResponse) => void;
        server?: httpServer;
    }
    interface testBrowserArgs {
        demo: boolean;
        noClose: boolean;
    }
    interface testBrowserDOM extends Array<browserDOM> {
        nodeString?: string;
    }
    interface testBrowserEvent {
        coords?: [number, number];
        event: eventName;
        node: testBrowserDOM;
        value?: string;
    }
    interface testBrowserItem {
        delay?: testBrowserTest;
        index?: number;
        interaction: testBrowserEvent[];
        name: string;
        unit: testBrowserTest[];
    }
    interface testBrowserResult {
        index: number;
        payload: [boolean, string, string][];
    }
    interface testBrowserTest {
        node: testBrowserDOM;
        qualifier: qualifier;
        target: string[];
        type: "attribute" | "element" | "property";
        value: boolean | null | number | string;
    }
    interface testComplete {
        callback: Function;
        fail: number;
        testType: testListType | "selected";
        total: number;
    }
    interface testEvaluation {
        callback: Function;
        fail: number;
        index: number;
        list: number[];
        test: testItem;
        testType: testListType;
        values: [string, string, string];
    }
    interface testExecute {
        complete: Function;
        fail: number;
        index: number;
        list: number[];
    }
    interface testItem {
        artifact?: string;
        command: string;
        file?: string;
        qualifier: qualifier | qualifierFile;
        test: string;
    }
    interface testServiceApplication {
        addServers?: (callback:Function) => void;
        execute?: (config:testExecute) => void;
        killServers?: (complete:testComplete) => void;
        populate?:() => void;
        serverRemote: {
            device: {
                [key:string]: httpServer;
            };
            user: {
                [key:string]: httpServer;
            };
        };
        tests?: testServiceInstance[];
    }
    interface testServiceInstance {
        artifact?: string;
        command: any;
        file?: string;
        name: string;
        qualifier: qualifier;
        shares?: testServiceShares;
        test: object | string;
    }
    interface testServiceShares {
        local?: agentShares;
        remote?: agentShares;
    }
    interface testSimulationApplication {
        execute?: (config:testExecute) => void;
        tests: testItem[]
    }
    interface testTemplateCopyStatus {
        "file-list-status": copyStatus;
    }
    interface testTemplate {
        command: {
            [key: string]: any;
        };
        name: string;
        qualifier: qualifier;
        test: string;
    }
    interface testTemplateFileService {
        command: {
            "fs": fileService;
        };
        name: string;
        qualifier: qualifier;
        test: testServiceFileTarget;
    }
    interface testTemplateHeartbeatComplete {
        command: {
            "heartbeat-complete": heartbeat;
        };
        name: string;
        qualifier: qualifier;
        test: {
            "heartbeat-status": heartbeat;
        };
    }
    interface testTemplateHeartbeatUpdate {
        command: {
            "heartbeat-update": heartbeatUpdate;
        };
        name: string;
        qualifier: qualifier;
        test: string;
    }
    interface testTemplateInvite extends testTemplate {
        command: {
            "invite": invite;
        };
    }
    interface testTemplateStorage extends testTemplate {
        command: {
            "storage": {
                data: agents | ui_data;
                response: ServerResponse;
                type: storageType;
            };
        };
    }
    interface testTemplateUpdateRemote extends testTemplate{
        command: {
            "fs-update-remote": fsUpdateRemote;
        };
    }
    interface testTypeCollection {
        service: testServiceApplication;
        simulation: testSimulationApplication;
    }
    interface textPad extends EventHandlerNonNull {
        (Event:Event, value?:string, title?:string): void;
    }
    interface ui_data {
        audio: boolean;
        brotli: brotli;
        color: colorScheme;
        colors: colors;
        hashDevice: string;
        hashType: hash;
        hashUser: string;
        modals: {
            [key:string]: ui_modal;
        };
        modalTypes: string[];
        nameDevice: string;
        nameUser: string;
        zIndex: number;
    }
    interface ui_modal {
        agent: string;
        agentType: agentType;
        content: Element;
        focus?: Element;
        height?: number;
        history?: string[];
        id?: string;
        inputs?: ui_input[];
        left?: number;
        move?: boolean;
        read_only: boolean;
        resize?: boolean;
        scroll?: boolean;
        search?: [string, string];
        selection?: selection;
        share?: string;
        single?: boolean;
        status?: modalStatus;
        status_bar?: boolean;
        status_text?: string;
        text_event?: EventHandlerNonNull;
        text_placeholder?: string;
        text_value?: string;
        timer?: number;
        title: string;
        top?: number;
        type: modalType;
        width?: number;
        zIndex?: number;
    }
    interface userExchange {
        agent: string;
        shares: agentShares;
        status: string;
        user: string;
    }
    interface version {
        command: string;
        date: string;
        hash: string;
        name: string;
        number: string;
        port: number;
    }
    interface watches {
        [key:string]: any;
    }
    interface WebSocketLocal extends WebSocket {
        new (address:string): WebSocket;
    }
}
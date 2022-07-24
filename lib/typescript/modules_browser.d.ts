/* lib/typescript/modules_browser.d - TypeScript interfaces that define master library modules used in the browser. */

/**
 * Extends the DOM's Document interface to include custom methods.
 */
interface Document {
    getElementsByAttribute: (name:string, value:string) => Element[];
    getModalsByModalType: (type:modalType|"all") => Element[];
    getNodesByType: (typeValue:number | string) => Node[];
    getElementsByText: (textValue:string, caseSensitive?:boolean) => Element[];
}

/**
 * Extends the DOM's Element interface to include custom methods.
 */
interface Element {
    getAncestor: (identifier:string, selector:selector) => Element;
    getElementsByAttribute: (name:string, value:string) => Element[];
    getNodesByType: (typeValue:number | string) => Node[];
    getElementsByText: (textValue:string, caseSensitive?:boolean) => Element[];
}

interface module_agentHash {
    receive: (socketData:socketData) => void;
    send: (nameDevice:HTMLInputElement, nameUser:HTMLInputElement) => void;
}

/**
 * Manages agent data in the browser.
 * ```typescript
 * interface module_agentManagement {
 *     addAgent   : (input:addAgent) => void;                    // Adds an agent into the browser user interface whether the agent is new or the page is loading.
 *     deleteAgent: (agent:string, agentType:agentType) => void; // Removes an agent from the browser user interface.
 *     deleteShare: (event:MouseEvent) => void;                  // Removes a share from a device of the local user.
 *     receive    : (socketData:socketData) => void;             // Receives agent data from the terminal for processing in the browser.
 * }
 * ``` */
interface module_agentManagement {
    addAgent: (input:addAgent) => void;
    deleteAgent: (agent:string, agentType:agentType) => void;
    deleteShare: (event:MouseEvent) => void;
    receive: (socketData:socketData) => void;
}

/**
 * Manages local agent activity status from the browser.
 * ```typescript
 * interface module_agentStatus {
 *     active    : (event:KeyboardEvent|MouseEvent) => void; // Converts local agent status to "active".
 *     idle      : () => void;                               // Converts local agent status to "idle".
 *     idleDelay : NodeJS.Timeout                            // Stores the current delay timer.
 *     receive   : (socketData:socketData) => void;          // Receives status data from remote agents.
 *     selfStatus: service_agentStatus;                      // Stores the configuration for a network transmission.
 *     start     : () => void;                               // Initiates local agent status timer on page load.
 * }
 * ``` */
interface module_agentStatus {
    active: (event:KeyboardEvent|MouseEvent) => void;
    idle: () => void;
    idleDelay: NodeJS.Timeout;
    receive: (socketData:socketData) => void;
    selfStatus: service_agentStatus;
    start: () => void;
}

/**
 * Module definition for browser-side websocket handling.
 * ```typescript
 * interface module_browserSocket {
 *     error: () => void;                     // An error handling method.
 *     hash : string;                         // Stores a hash value used to authenticate a client hash tunnel at the server.
 *     send : (data:socketData) => void;      // Packages microservice data for transmission in the application's microservice format.
 *     sock : WebSocketLocal;                 // Provides a web socket object in a way that allows for explicit type declarations, reuse, and without angering the TypeScript gods.
 *     start: (callback: () => void) => void; // Initiates a web socket client from the browser.
 * }
 * ``` */
 interface module_browserSocket {
    error: () => void;
    hash: string;
    send: (data:socketData) => void;
    sock: WebSocketLocal;
    start: (callback: () => void, hashDevice:string) => void;
}

/**
 * Provides globally available utilities, such as string formatting tools.
 * ```typescript
 * interface module_common {
 *     agents     : (config:agentsConfiguration) => void; // Provides a means to loop through agent types, agents, and shares against a supplied function.
 *     capitalize : (input:string) => string;             // Converts the first character of a string to a capital letter if that first character is a lowercase letter.
 *     commas     : (input:number) => string;             // Converts a number into a string with commas separating character triplets from the right.
 *     dateFormat : (date:Date) => string;                // Converts a date object into US Army date format.
 *     prettyBytes: (input:number) => string;             // Converts a number into an abbreviated exponent of 2 describing storage size, example: 2134321 => 2.0MB.
 *     selfShares : (devices:agents) => agentShares;      // Converts the list of shares from all devices into a single package for distribution to external users.
 *     time       : (date:Date) => string;                // Produce a formatted time string from a date object.
 * }
 * ``` */
interface module_common {
    agents: (config:config_agentIdentity) => void;
    capitalize: (input:string) => string;
    commas: (input:number) => string;
    dateFormat: (date:Date) => string;
    prettyBytes: (input:number) => string;
    selfShares: (devices:agents) => agentShares;
    time: (date:Date) => string;
}

/**
 * Methods for generating the configuration modal and its interactions.
 * ```typescript
 * interface module_configuration {
 *     colorDefaults: colorList;     // An object associating color information to color scheme names.
 *     content      : () => Element; // Generates the configuration modal content to populate into the configuration modal.
 *     events: {
 *         agentColor       : (event:Event) => void;      // Specify custom agent color configurations.
 *         audio            : (event:MouseEvent) => void; // Assign changes to the audio option to settings.
 *         colorScheme      : (event:MouseEvent) => void; // Changes the color scheme of the page by user interaction.
 *         configurationText: (event:Event) => void;      // Processes settings changes from either text input or select lists.
 *         detailsToggle    : (event:MouseEvent) => void; // Shows and hides text explaining compression.
 *         modal            : (event:MouseEvent) => void; // Generates the configuration modal and fills it with content.
 *     };
 *     tools: {
 *         addUserColor    : (agent:string, type:agentType, configurationBody:Element) => void; // Add agent color options to the configuration modal content.
 *         applyAgentColors: (agent:string, type:agentType, colors:[string, string]) => void;   // Update the specified color information against the default colors of the current color scheme.
 *         radio           : (element:Element) => void; // Sets a class on a grandparent element to apply style changes to the corresponding label.
 *         styleText       : (input:styleText) => void; // Generates the CSS code for an agent specific style change and populates it into an HTML style tag.
 *     };
 * }
 * ``` */
interface module_configuration {
    colorDefaults: colorList;
    content: () => Element;
    events: {
        agentColor: (event:Event) => void;
        audio: (event:MouseEvent) => void;
        colorScheme: (event:MouseEvent) => void;
        configurationText: (event:Event) => void;
        detailsToggle: (event:MouseEvent) => void;
    };
    tools: {
        addUserColor: (agent:string, type:agentType, configurationBody:Element) => void;
        applyAgentColors: (agent:string, type:agentType, colors:[string, string]) => void;
        radio: (element:Element) => void;
        styleText: (input:styleText) => void;
    };
}

/**
 * Creates and populates the right click context menu for the file navigate modal types.
 * ```typescript
 * interface module_context {
 *     clipboard: string;                      // Stores a file copy state pending a paste or cut action.
 *     content: (event:MouseEvent) => Element; // Creates the HTML content of the context menu.
 *     element: Element;                       // Stores a reference to the element.target associated with a given menu item.
 *     events: {
 *         copy      : (event:Event) => void;      // Handler for the *Copy* menu button, which stores file system address information in the application's clipboard.
 *         dataString: (event:Event) => void;      // Handler for the *Base64*, *Edit*, and *Hash* menu buttons.
 *         destroy   : (event:Event) => void;      // Handler for the *Destroy* menu button, which is responsible for deleting file system artifacts.
 *         details   : (Event:Event) => void;      // Handler for the *Details* menu button, which will generate a details modal.
 *         fsNew     : (event:Event) => void;      // Handler for the *New Directory* and *New File* menu buttons.
 *         menu      : (event:MouseEvent) => void; // Generates the context menu which populates with different menu items depending upon event.target of the right click.
 *         paste     : (event:Event) => void;      // Handler for the *Paste* menu item which performs the file copy operation over the network.
 *     };
 *     type: contextType; // Stores a context action type for awareness to the context action event handler.
 * }
 * type contextType = "" | "Base64" | "copy" | "cut" | "directory" | "Edit" | "file" | "Hash";
 * ``` */
interface module_context {
    clipboard: string;
    content:(event:MouseEvent) => Element;
    element: Element;
    events: {
        copy: (event:Event) => void;
        dataString: (event:Event) => void;
        destroy: (event:Event) => void;
        details: (Event:Event) => void;
        fsNew: (event:Event) => void;
        menu: (event:MouseEvent) => void;
        paste: (event:Event) => void;
    };
    type: contextType;
}

/**
 * Generates the user experience associated with file system interaction.
 * ```typescript
 * interface module_fileBrowser {
 *     content: {
 *         dataString: (socketData:socketData) => void; // Populate content into modals for string output operations, such as: Base64, Hash, File Read.
 *         details   : (socketData:socketData) => void; // Generates the contents of a details type modal.
 *         list      : (location:string, dirs:directory_response, message:string) => Element; // Generates the contents of a file system list for population into a file navigate modal.
 *         status    : (socketData:socketData) => void; // Translates messaging into file system lists for the appropriate modals.
 *     };
 *     dragFlag: dragFlag; // Allows the drag handler to identify whether the shift or control/command keys are pressed while selecting items from the file list.
 *     events: {
 *         back       : (event:Event) => void;                 // Handler for the back button, which steps back to the prior file system location of the given agent stored in the modal's navigation history.
 *         directory  : (event:Event) => void;                 // Handler for navigation into a directory by means of double click.
 *         drag       : (event:MouseEvent|TouchEvent) => void; // Move file system artifacts from one location to another by means of double click.
 *         execute    : (event:Event) => void;                 // Allows operating system execution of a file by double click interaction.
 *         expand     : (event:Event) => void;                 // Opens a directory into a child list without changing the location of the current modal.
 *         keyExecute : (event:KeyboardEvent) => void;         // Allows file execution by keyboard control, such as pressing the *Enter* key.
 *         listFocus  : (event:Event) => void;                 // When clicking on a file list give focus to an input field in that list so that the list can receive focus.
 *         parent     : (event:Event) => void;                 // Handler to navigate into the parent directory by click the parent navigate button.
 *         rename     : (event:Event) => void;                 // Converts a file system item text into a text input field so that the artifact can be renamed.
 *         saveFile   : (event:Event) => void;                 // A handler for an interaction that allows writing file changes to the file system.
 *         search     : (event?:Event, searchElement?:HTMLInputElement, callback?:eventCallback) => void; // Sends a search query in order to receive a filtered list of file system artifacts.
 *         searchFocus: (event:Event) => void;                 // Provides an interaction that enlarges and reduces the width of the search field.
 *         select     : (event:Event) => void;                 // Select a file system item for interaction by click.
 *         text       : (event:Event) => void;                 // Allows changing file system location by changing the text address of the current location.
 *     };
 *     tools: {
 *         listFail    : (count:number, box: Element) => void; // Display status information when the Operating system locks files from access.
 *         listItem    : (item:directory_item, extraClass:string) => Element; // Generates the HTML content for a single file system artifacts that populates a file system list.
 *         modalAddress: (config:config_modalHistory) => void; // Updates the file system address of the current file navigate modal in response to navigating to different locations.
 *     };
 * }
 * type eventCallback = (event:Event, callback:(event:MouseEvent, dragBox:Element) => void) => void;
 * type dragFlag = "" | "control" | "shift";
 * ``` */
interface module_fileBrowser {
    content: {
        dataString: (socketData:socketData) => void;
        details: (socketData:socketData) => void;
        list: (location:string, dirs:directory_response, message:string) => Element;
        status: (socketData:socketData) => void;
    };
    dragFlag: dragFlag;
    events: {
        back: (event:Event) => void;
        directory: (event:Event) => void;
        drag: (event:MouseEvent|TouchEvent) => void;
        execute: (event:Event) => void;
        expand: (event:Event) => void;
        keyExecute: (event:KeyboardEvent) => void;
        listFocus: (event:Event) => void;
        parent: (event:Event) => void;
        rename: (event:Event) => void;
        saveFile: (event:Event) => void;
        search: (event?:Event, searchElement?:HTMLInputElement, callback?:eventCallback) => void;
        searchFocus: (event:Event) => void;
        select: (event:Event) => void;
        text: (event:Event) => void;
    };
    tools: {
        listFail: (count:number, box: Element) => void;
        listItem: (item:directory_item, extraClass:string) => Element;
        modalAddress: (config:config_modalHistory) => void;
    };
}

/**
 * Provides a common location to store events associated with the application at large opposed to content or utility specific events.
 * ```typescript
 * interface module_globalEvents {
 *     contextMenuRemove: () => void;            // Removes a context menu if one is visible.
 *     fullscreen       : (event:Event) => void; // An event handler that launches the browser into fullscreen mode.
 *     fullscreenChange : (event:Event) => void; // An event handler that executes when the browser moves in or out of fullscreen mode.
 *     menu             : (event:Event) => void; // Displays the primary modal in the top left corner of the application.
 *     menuBlur         : (event:Event) => void; // Destroys the menu, if present.
 *     minimizeAll      : (event:Event) => void; // Forcefully minimizes all modals to the tray at the bottom of the application.
 *     minimizeAllFlag  : boolean;               // A flag that halts state saving until all modals are minimized.
 *     modal: {
 *         configuration: (event:MouseEvent) => void;                              // Displays a configuration modal from the main menu.
 *         deleteList   : (event:MouseEvent, configuration?:config_modal) => void; // Displays a Delete Agent modal from the main menu.
 *         export       : (event:MouseEvent) => void;                              // Displays an Import/Export modal from the main menu.
 *         fileNavigate : (Event:Event, config?: navConfig) => void;               // Displays a File Navigate modal from the main menu.
 *         invite       : (event:Event, settings?:config_modal) => void;           // Displays an Invitation modal from the main menu.
 *         textPad      : (event:Event, config?:config_modal) => Element;          // Displays a TextPad modal from the main menu.
 *     };
 *     shareAll: (event:MouseEvent) => void; // Displays a Share modal associated with multiple agents.
 * }
 * ``` */
interface module_globalEvents {
    contextMenuRemove: () => void;
    fullscreen: (event:Event) => void;
    fullscreenChange: (event:Event) => void;
    menu: (event:Event) => void;
    menuBlur: (event:Event) => void;
    minimizeAll: (event:Event) => void;
    minimizeAllFlag: boolean;
    modal: {
        configuration: (event:MouseEvent) => void;
        deleteList: (event:MouseEvent, configuration?:config_modal) => void;
        export: (event:MouseEvent) => void;
        fileNavigate: (Event:Event, config?: config_fileNavigate) => void;
        invite: (event:Event, settings?:config_modal) => void;
        textPad: (event:Event, config?:config_modal) => Element;
    };
    shareAll: (event:MouseEvent) => void;
}

/**
 * Provides invite modal content, invite messaging handling, and all associated interactions.
 * ```typescript
 * interface module_invite {
 *     content: {
 *         remote: (invitation:service_invite, name:string) => Element; // Prepares content for the recipient agent of an invitation.
 *         start : (settings?:config_modal) => Element;                 // Starts the invitation process by creating an *invite* modal and populating it with content.
 *     };
 *     events: {
 *         decline       : (event:MouseEvent) => void;                  // Event handler for when a remote user declines an invitation request.
 *         portValidation: (event:KeyboardEvent) => void;               // A form validation control to assert input is formatted like an IP address.
 *         request       : (event:Event, options:config_modal) => void; // Issues an invitation request to the network.
 *         typeToggle    : (event:Event) => void;                       // Toggles informational text when the user clicks on an agent type radio button.
 *     },
 *     tools: {
 *         accept             : (box:Element) => void;               // Event handler for when a remote user accepts an invitation request.
 *         complete           : (invitation:service_invite) => void; // Provides messaging at the final stage of the invitation process.
 *         receive            : (invitation:service_invite) => void; // Receives an invitation request at the remote agent.
 *         transmissionReceipt: (socketData:socketData) => void;     // Routes invitation message traffic from the network to the appropriate method.
 *     }
 * }
 * ``` */
interface module_invite {
    content: {
        remote: (invitation:service_invite, name:string) => Element;
        start: (settings?:config_modal) => Element;
    };
    events: {
        decline: (event:MouseEvent) => void;
        portValidation: (event:KeyboardEvent) => void;
        request: (event:Event, options:config_modal) => void;
        typeToggle: (event:Event) => void;
    };
    tools: {
        accept: (box:Element) => void;
        complete: (invitation:service_invite) => void;
        receive: (invitation:service_invite) => void;
        transmissionReceipt: (socketData:socketData) => void;
    };
}

/**
 * Provides audio/video access from browser APIs and all associated interactions.
 * ```typescript
 * interface module_media {
 *     content: (mediaType:mediaType, height:number, width:number) => Element; // Creates an audio or video HTML element to populate into a media modal.
 *     events: {
 *         selfDrag   : (event:Event) => void; // Allows dragging a thumbnail of local webcam video from one corner of a video modal to another.
 *         videoButton: (event:Event) => void; // Creates a button where a user may initiate a video call with another agent.
 *     };
 *     tools: {
 *         kill : (modal:config_modal) => void;               // Destroys a media stream to the local hardware and closes the corresponding modal.
 *         modal: (mediaConfig:config_mediaModal) => Element; // Creates a media modal populated with content from method *media.element*.
 *     };
 * }
 * type mediaType = "audio" | "video";
 * ``` */
interface module_media {
    content: (mediaType:mediaType, height:number, width:number) => Element;
    events: {
        selfDrag: (event:Event) => void;
        videoButton: (event:Event) => void;
    };
    tools: {
        kill: (modal:config_modal) => void;
        modal: (mediaConfig:config_mediaModal) => Element;
    };
}

/**
 * Generates text message modals and all associated interactions.
 * ```typescript
 * interface module_message {
 *     content: {
 *         footer: (mode:messageMode, value:string) => Element;                                    // Called from modal.create to supply the footer area modal content.
 *         modal : (configuration:config_modal, agentType:agentType, agentName:string) => Element; // Generates a message modal.
 *     };
 *     events: {
 *         keySubmit  : (event:Event) => void; // Submits a text message on key press, such as pressing the 'Enter' key.
 *         modeToggle : (event:Event) => void; // Toggles between code type input and text type input.
 *         shareButton: (event:Event) => void; // Creates a message button for the *share* modals.
 *         submit     : (event:Event) => void; // Submit event handler to take message text into a data object for transmission across a network.
 *     };
 *     tools: {
 *         populate:(modalId:string) => void;                                          // Populate stored messages into message modals.
 *         post    : (item:message_item, target:messageTarget, modalId:string) => void; // Visually display the submitted and received messages as modal content.
 *         receive : (socketData:socketData) => void;                                  // Receives message updates from the network.
 *     };
 * }
 * type messageMode = "code" | "text";
 * type messageTarget = "agentFrom" | "agentTo";
 * ``` */
interface module_message {
    content: {
        footer: (mode:messageMode, value:string) => Element;
        modal: (configuration:config_modal, agentType:agentType, agentName:string) => Element;
    };
    events: {
        keySubmit: (event:Event) => void;
        modeToggle: (event:Event) => void;
        shareButton: (event:Event) => void;
        submit: (event:Event) => void;
    };
    tools: {
        populate:(modalId:string) => void;
        post: (item:message_item, target:messageTarget, modalId:string) => void;
        receive: (socketData:socketData) => void;
    };
}

/**
 * Provides generic modal specific interactions such as resize, move, generic modal buttons, and so forth.
 * ```typescript
 * interface module_modal {
 *     content: (options:config_modal) => Element; // Creates a new modal.
 *     events: {
 *         close         : (event:MouseEvent) => void;                  // Closes a modal by removing it from the DOM, removing it from state, and killing any associated media.
 *         closeEnduring : (event:MouseEvent) => void;                  // Modal types that are enduring are hidden, not destroyed, when closed.
 *         confirm       : (event:MouseEvent) => void;                  // Handling for an optional confirmation button.
 *         footerResize  : (event:MouseEvent) => void;                  // If a resizable textarea element is present in the modal outside the body this ensures the body is the correct size.
 *         importSettings: (event:MouseEvent) => void;                  // Handler for import/export modals that modify saved settings from an imported JSON string then reloads the page.
 *         maximize      : (event:Event, callback?:() => void) => void; // Maximizes a modal to fill the view port.
 *         minimize      : (event:Event, callback?:() => void) => void; // Minimizes a modal to the tray at the bottom of the page.
 *         move          : (event:Event) => void;                       // Allows dragging a modal around the screen.
 *         resize        : (event:MouseEvent|TouchEvent) => void;       // Resizes a modal respective to the event target, which could be any of 4 corners or 4 sides.
 *         textSave      : (event:Event) => void;                       // Handler to push the text content of a textPad modal into settings so that it is saved.
 *         textTimer     : (event:KeyboardEvent) => void;               // A timing event so that contents of a textPad modal are automatically save after a brief duration of focus blur.
 *         unMinimize    : (event:MouseEvent) => void;                  // Restores a minimized modal to its prior size and location.
 *         zTop          : (event:KeyboardEvent|MouseEvent, elementInput?:Element) => void; // Processes visual overlapping or depth of modals.
 *     };
 *     tools: {
 *         forceMinimize: (id:string) => void; // Modals that do not have a minimize button still need to conform to minimize from other interactions.
 *     };
 * }
 * ``` */
interface module_modal {
    content: (options:config_modal) => Element;
    events: {
        close: (event:MouseEvent) => void;
        closeEnduring: (event:MouseEvent) => void;
        confirm: (event:MouseEvent) => void;
        footerResize: (event:MouseEvent) => void;
        importSettings: (event:MouseEvent) => void;
        maximize: (event:Event, callback?:() => void) => void;
        minimize: (event:Event, callback?:() => void) => void;
        move: (event:Event) => void;
        resize: (event:MouseEvent|TouchEvent) => void;
        textSave: (event:Event) => void;
        textTimer: (event:KeyboardEvent) => void;
        unMinimize: (event:MouseEvent) => void;
        zTop: (event:KeyboardEvent|MouseEvent, elementInput?:Element) => void;
    };
    tools: {
        forceMinimize: (id:string) => void;
    };
}

/**
 * Builds HTTP request bodies for transfer to the terminal.
 * ```typescript
 * interface module_network {
 *     configuration: () => void;                                         // A convenience method for setting state changes to a file.
 *     http         : (socketData:socketData) => void;                    // Prepares XHR and manages response text.
 *     receive      : (dataString:string) => void;                        // Receives data from the network.
 *     send         : (data:socketDataType, service:requestType) => void; // Provides a means for allowing arbitrary HTTP requests.
 * }
 * ``` */
interface module_network {
    configuration: () => void;
    http: (socketData:socketData) => void;
    receive: (dataString:string) => void;
    send: (data:socketDataType, service:requestType) => void;
}

/**
 * A browser remote control interface used for browser test automation.
 * ```typescript
 * interface module_remote {
 *     action     : testBrowserAction;                                    // A property holding the action property value of the current test item.
 *     delay      : (config:testBrowserItem) => void;                     // A utility to delay execution of evaluation criteria if the current test item features a delay property.
 *     domFailure : boolean;                                              // A flag indicating whether an event resulted in a DOM failure for reporting to the terminal.
 *     error      : (message:string, source:string, line:number, col:number, error:Error) => void; // Gathers JavaScript errors from the page for reporting to the terminal as a test failure.
 *     evaluate   : (test:testBrowserTest) => [boolean, string, string];  // Executes the units of evaluation provided in a test item.
 *     event      : (item:service_testBrowser, pageLoad:boolean) => void; // Executes the events provided in a test item.
 *     getProperty: (test:testBrowserTest) => primitive;                  // Retrieve the value of the specified DOM property or attribute.
 *     index      : number;                                               // A property holding the index of the current test item.
 *     keyAlt     : boolean;                                              // A flag indicating whether the Alt key is pressed and not released while executing further events.
 *     keyControl : boolean;                                              // A flag indicating whether the Control/Command key is pressed and not released while executing further events.
 *     keyShift   : boolean;                                              // A flag indicating whether the Shift key is pressed and not released while executing further events.
 *     node       : (dom:testBrowserDOM, property:string) => Element;     // Retrieves a DOM node from the page by reading instructions from the test item.
 *     receive    : (socketData:socketData) => void;                      // Receives test instructions from the terminal and will either close the browser or execute *remote.event*.
 *     report     : (test:testBrowserTest[], index:number) => void;       // Generates the evaluation report for sending to the terminal.
 *     sendTest   : (payload:[boolean, string, string][], index:number, task:testBrowserAction) => void; // Sends test results to terminal.
 *     stringify  : (primitive:primitive) => string;                      // Converts a primitive of any type into a string for presentation.
 * }
 * type primitive = boolean | number | string | null | undefined;
 * type testBrowserAction = "close" | "nothing" | "request" | "reset-browser" | "reset-complete" | "reset-request" | "reset-response" | "respond" | "result";
 * ``` */
interface module_remote {
    action: testBrowserAction;
    delay: (config:testBrowserItem) => void;
    domFailure: boolean;
    error: (message:string, source:string, line:number, col:number, error:Error) => void;
    evaluate: (test:testBrowserTest) => [boolean, string, string];
    event: (item:service_testBrowser, pageLoad:boolean) => void;
    getProperty: (test:testBrowserTest) => primitive;
    index: number;
    keyAlt: boolean;
    keyControl: boolean;
    keyShift: boolean;
    node: (dom:testBrowserDOM, property:string) => Element;
    receive: (socketData:socketData) => void;
    report: (test:testBrowserTest[], index:number) => void;
    sendTest: (payload:[boolean, string, string][], index:number, task:testBrowserAction) => void;
    stringify: (primitive:primitive) => string;
}

/**
 * Populates the various agent modals, device details, and share data lists.
 * ```typescript
 * interface module_share {
 *     content: (agent:string, agentType:agentType|"") => Element; // Generates the content of the share modal.
 *     events: {
 *         context     : (event:Event) => void;                                   // Handler for the File Navigate context menu item *Add a Share*.
 *         deleteList  : (event:MouseEvent, configuration?:config_modal) => void; // Creates a confirmation modal listing users for deletion.
 *         deleteToggle: (event:MouseEvent) => void;                              // Changes visual state of items in the shares delete list as they are checked or unchecked.
 *         readOnly    : (event:MouseEvent) => void;                              // Toggle a share between read only and full access.
 *     }
 *     tools: {
 *         deleteAgentList  : (box:Element) => void;      // Process termination of one or more agents from a *share_delete* modal.
 *         deleteListContent: () => Element;              // Creates the HTML content of the share_delete type modal.
 *         hash             : (socketData) => void;       // Generates a hash identifier for a new share
 *         modal            : (agent:string, agentType:agentType|"", configuration:config_modal) => void; // Creates a share modal displaying device details, shares, and available features.
 *         update           : (exclusion:string) => void; // Updates the content of device shares in response to messaging from the network and local user interaction.
 *     }
 * }
 * ``` */
interface module_share {
    content: (agent:string, agentType:agentType|"") => Element;
    events: {
        context: (event:Event) => void;
        deleteToggle: (event:MouseEvent) => void;
        readOnly: (event:MouseEvent) => void;
    };
    tools: {
        deleteAgentList: (box:Element) => void;
        deleteListContent: () => Element;
        hash: (socketData:socketData) => void;
        modal: (agent:string, agentType:agentType|"", configuration:config_modal) => void;
        update: (exclusion:string) => void;
    };
}

/**
 * A list of common tools that only apply to the browser side of the application.
 * ```typescript
 * interface module_util {
 *     audio            : (name:string) => void;                            // Plays audio in the browser.
 *     delay            : () => Element;                                    // Create a div element with a spinner and class name of 'delay'.
 *     dragBox          : eventCallback;                                    // Draw a selection box to capture a collection of items into a selection.
 *     dragList         : (event:MouseEvent, dragBox:Element) => void;      // Selects list items in response to drawing a drag box.
 *     fileAgent        : (element:Element, copyElement:Element, address?:string) => [fileAgent, fileAgent, fileAgent]; // Produces fileAgent objects for service_fileSystem and service_copy.
 *     fixHeight        : () => void;                                       // Resizes the interactive area to fit the browser viewport.
 *     formKeys         : (event:KeyboardEvent, submit:() => void) => void; // Provides form execution on key down of 'Enter' key to input fields not in a form.
 *     getAgent         : (element:Element) => agency;                      // Get the agent of a given modal.
 *     keys             : (event:KeyboardEvent) => void;                    // Executes shortcut key combinations.
 *     name             : (item:Element) => string;                         // Get a lowercase node name for a given element.
 *     sanitizeHTML     : (input:string) => string;                         // Make a string safe to inject via innerHTML.
 *     screenPosition   : (node:Element) => DOMRect;                        // Gathers the view port position of an element.
 *     selectedAddresses: (element:Element, type:string) => [string, fileType, string][]; // Gather the selected addresses and types of file system artifacts in a fileNavigator modal.
 *     selectNone       : (element:Element) => void;                        // Remove selections of file system artifacts in a given fileNavigator modal.
 * }
 * type agency = [string, boolean, agentType];
 * type eventCallback = (event:Event, callback:(event:MouseEvent, dragBox:Element) => void) => void;
 * type fileType = "directory" | "file" | "link";
 * ``` */
interface module_util {
    audio: (name:string) => void;
    delay: () => Element;
    dragBox: eventCallback;
    dragList: (event:MouseEvent, dragBox:Element) => void;
    fileAgent: (element:Element, copyElement:Element, address?:string) => [fileAgent, fileAgent, fileAgent];
    fixHeight: () => void;
    formKeys: (event:KeyboardEvent, submit:() => void) => void;
    getAgent: (element:Element) => agency;
    keys: (event:KeyboardEvent) => void;
    name: (item:Element) => string;
    sanitizeHTML: (input:string) => string;
    screenPosition: (node:Element) => DOMRect;
    selectedAddresses: (element:Element, type:string) => [string, fileType, string][];
    selectNone: (element:Element) => void;
}
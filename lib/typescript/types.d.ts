/* lib/typescript/types.d - TypeScript static types. */

type actionFile = "fs-base64" | "fs-destroy" | "fs-details" | "fs-directory" | "fs-execute" | "fs-hash" | "fs-new" | "fs-read" | "fs-rename" | "fs-search" | "fs-write";
type actionCopy = "copy-request-list" | "copy-send-list";
type activityStatus = "" | "active" | "deleted" | "idle" | "offline";
type agency = [string, boolean, agentType];
type agentTextList = [agentType, string][];
type agentType = "device" | "user";
type brotli = 0|1|2|3|4|5|6|7|8|9|10|11;
type browserDOM = [domMethod, string, number];
type buildPhase = "browserSelf" | "certificate" | "clearStorage" | "commands" | "configurations" | "libReadme" | "lint" | "os_specific" | "service" | "shellGlobal" | "simulation" | "typescript" | "version";
type byte = [0|1, 0|1, 0|1, 0|1, 0|1, 0|1, 0|1, 0|1];
type certKey = "ca" | "crt" | "key";
type color = [string, string];
type colorScheme = "dark" | "default";
type commands = "agent_data" | "agent_online" | "base64" | "build" | "certificate" | "commands" | "copy" | "directory" | "get" | "hash" | "lint" | "mkdir" | "remove" | "service" | "test_browser" | "test_service" | "test_simulation" | "test" | "update" | "version";
type contextType = "" | "Base64" | "copy" | "cut" | "directory" | "Edit" | "file" | "Hash";
type directoryItem = [string, fileType, string, number, number, directoryData, string];
type directoryMode = "array" | "hash" | "list" | "read" | "search";
type directoryResponse = directoryList | "missing" | "noShare" | "readOnly";
type domMethod = "activeElement" | "childNodes" | "documentElement" | "firstChild" | "getAncestor" | "getElementById" | "getElementsByAttribute" | "getElementsByClassName" | "getElementsByName" | "getElementsByTagName" | "getElementsByText" | "getModalsByModalType" | "getNodesByType" | "lastChild" | "nextSibling" | "parentNode" | "previousSibling" | "window";
type dragFlag = "" | "control" | "shift";
type eslintCustom = ["error", ...{selector:string;message:string;}[]];
type eslintDelimiter = ["error", ...eslintDelimiterItem[]];
type eventCallback = (event:Event, callback:(event:MouseEvent, dragBox:Element) => void) => void;
type eventName = "blur" | "click" | "contextmenu" | "dblclick" | "focus" | "keydown" | "keyup" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "move" | "refresh-interaction" | "refresh" | "resize" | "select" | "setValue" | "touchend" | "touchstart" | "wait";
type fileSystemReadType = "base64" | "hash" | "read";
type fileType = "directory" | "error" | "file" | "link";
type hash = "blake2d512" | "blake2s256" | "sha1" | "sha3-224" | "sha3-256" | "sha3-384" | "sha3-512" | "sha384" | "sha512-224" | "sha512-256" | "sha512" | "shake128" | "shake256";
type hashTypes = "agent-hash" | "hash-share";
type inviteAction = "invite-complete" | "invite-request" | "invite-response" | "invite-start";
type inviteStatus = "accepted" | "declined" | "ignored" | "invited";
type mediaType = "audio" | "video";
type messageMode = "code" | "text";
type messageTarget = "agentFrom" | "agentTo";
type mimeType = "application/javascript" | "application/json" | "application/octet-stream" | "application/x-www-form-urlencoded" | "application/xhtml+xml" | "image/jpeg" | "image/png" | "image/svg+xml" | "text/css" | "text/html" | "text/plain";
type modalStatus = "hidden" | "maximized" | "minimized" | "normal";
type modalType = "configuration" | "details" | "document" | "export" | "fileEdit" | "fileNavigate" | "invite-accept" | "invite-request" | "media" | "message" | "share_delete" | "shares" | "textPad";
type posix = "arch" | "darwin" | "fedora" | "ubuntu";
type primitive = boolean | number | string | null | undefined;
type qualifier = "begins" | "contains" | "ends" | "greater" | "is" | "lesser" | "not contains" | "not";
type qualifierFile = "file begins" | "file contains" | "file ends" | "file is" | "file not contains" | "file not" | "filesystem contains" | "filesystem not contains";
type requestType = "agent-hash" | "agent-management" | "agent-online" | "agent-resolve" | "agent-status" | "copy-file-request" | "copy-file" | "copy-list" | "copy" | "error" | "file-system-details" | "file-system-status" | "file-system-string" | "file-system" | "GET" | "hash-share" | "invite" | "log" | "message" | "response-no-action" | "settings" | "test-browser";
type resizeDirection = "b" | "bl" | "br" | "l" | "r" | "t" | "tl" | "tr";
type searchType = "fragment" | "negation" | "regex";
type selector = "class" | "id" | "tag";
// eslint-disable-next-line
type service_log = any[];
type service_message = messageItem[];
type settingsType = "configuration" | "device" | "message" | "user";
type socketDataType = Buffer | service_agentHash | service_agentManagement | service_agentResolve | service_agentStatus | service_copy | service_copy_file | service_copy_fileRequest | service_copy_list | service_error | service_fileSystem | service_fileSystem_details | service_fileSystem_status | service_fileSystem_string | service_hashShare | service_invite | service_log | service_message | service_settings | service_testBrowser;
type socketStatus = "closed" | "end" | "open" | "pending";
type testBrowserAction = "close" | "nothing" | "request" | "reset-browser" | "reset-complete" | "reset-request" | "reset-response" | "respond" | "result";
type testBrowserMode = "device" | "remote" | "self" | "user";
type testCallback = (message:string, failCount:number) => void;
type testListType = "" | "browser_device" | "browser_remote" | "browser_self" | "browser_user" | "service" | "simulation";
type testLogFlag = testListType | "";
type ui_input = "cancel" | "close" | "confirm" | "maximize" | "minimize" | "save" | "text";
type websocketClientType = "browser" | "device" | "user";
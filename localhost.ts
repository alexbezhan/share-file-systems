import { start } from "repl";
import { unlink } from "fs";

(function local():void {
    "use strict";
    const content:HTMLElement = document.getElementById("content-area"),
        ws = new WebSocket(`ws://localhost:${(function local_webSocketsPort() {
            const uri:string = location.href;
            let domain:string = uri.slice(location.href.indexOf("host:") + 5),
                index:number = domain.indexOf("/");
            if (index > 0) {
                domain = domain.slice(0, index);
            }
            index = domain.indexOf("?");
            if (index > 0) {
                domain = domain.slice(0, index);
            }
            index = domain.indexOf("#");
            if (index > 0) {
                domain = domain.slice(0, index);
            }
            index = Number(domain);
            if (isNaN(index) === true) {
                return 8080;
            }
            return index;
        }()) + 1}`),
        network:any = {},
        ui:any = {
            fs: {},
            modal: {},
            systems: {},
            util: {}
        };
    let loadTest:boolean = true,
        data:ui_data = {
            modals: {},
            modalTypes: [],
            name: "",
            zIndex: 0
        },
        messages:messages = {
            status: [],
            users: [],
            errors: []
        },
        characterKey:characterKey = "";
    network.error = function local_network_error():void {};
    network.fs = function local_network_fs(configuration:readFS):void {
        const xhr:XMLHttpRequest = new XMLHttpRequest(),
            loc:string = location.href.split("?")[0];
        xhr.onreadystatechange = function local_network_fs_callback():void {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    const list:directoryList = JSON.parse(xhr.responseText),
                        local:directoryList = [],
                        length:number = list.length,
                        output:HTMLElement = document.createElement("ul"),
                        buildItem = function local_network_fs_callback_buildItem():void {
                            const driveLetter = function local_network_fs_callback_driveLetter(drive:string):string {
                                    return drive.replace("\\\\", "\\");
                                },
                                label:HTMLLabelElement = document.createElement("label"),
                                input:HTMLInputElement = document.createElement("input");
                            li = document.createElement("li");
                            if (a === localLength - 1) {
                                li.setAttribute("class", `${local[a][1]} last`);
                            } else if (a < localLength - 1 && local[a + 1][1] !== local[a][1]) {
                                li.setAttribute("class", `${local[a][1]} lastType`);
                            } else {
                                li.setAttribute("class", local[a][1]);
                            }
                            input.type = "checkbox";
                            input.checked = false;
                            label.innerHTML = "Selected";
                            label.appendChild(input);
                            li.textContent = local[a][0].replace(/^\w:\\\\/, driveLetter);
                            if (local[a][1] === "file") {
                                span = document.createElement("span");
                                if (local[a][4].size === 1) {
                                    plural = "";
                                } else {
                                    plural = "s";
                                }
                                span.textContent = `file - ${ui.util.commas(local[a][4].size)} byte${plural}`;
                                li.appendChild(span);
                            } else if (local[a][1] === "directory") {
                                if (local[a][3] > 0) {
                                    button = document.createElement("button");
                                    button.setAttribute("class", "expansion");
                                    button.innerHTML = "+<span>Expand this folder</span>";
                                    button.onclick = ui.fs.expand;
                                    li.insertBefore(button, li.firstChild);
                                }
                                span = document.createElement("span");
                                if (local[a][3] === 1) {
                                    plural = "";
                                } else {
                                    plural = "s";
                                }
                                span.textContent = `directory - ${ui.util.commas(local[a][3])} item${plural}`;
                                li.appendChild(span);
                            } else {
                                span = document.createElement("span");
                                if (local[a][1] === "link") {
                                    span.textContent = "symbolic link";
                                } else {
                                    span.textContent = local[a][1];
                                }
                                li.appendChild(span);
                            }
                            li.appendChild(label);
                            li.onclick = ui.fs.select;
                        };
                    let a:number = 0,
                        button:HTMLElement,
                        li:HTMLElement,
                        span:HTMLElement,
                        plural:string,
                        localLength:number = 0;
                    do {
                        if (list[a][2] === 0) {
                            local.push(list[a]);
                        }
                        a = a + 1;
                    } while (a < length);
                    local.sort(function local_network_fs_callback_sort(a:directoryItem, b:directoryItem):number {
                        // when types are the same
                        if (a[1] === b[1]) {
                            if (a[0] < b[0]) {
                                return -1;
                            }
                            return 1;
                        }

                        // when types are different
                        if (a[1] === "directory") {
                            return -1;
                        }
                        if (a[1] === "link" && b[1] === "file") {
                            return -1;
                        }
                        return 1;
                    });
                    if (configuration.location === "\\" || configuration.location === "/") {
                        a = 0;
                    } else {
                        a = 1;
                    }
                    localLength = local.length;
                    do {
                        if (local[a][0] !== "\\" && local[a][0] !== "/") {
                            buildItem();
                            output.appendChild(li);
                        }
                        a = a + 1;
                    } while (a < localLength);
                    output.setAttribute("class", "fileList");
                    output.title = local[0][0];
                    configuration.callback(output, configuration.id);
                } else {
                    network.error("something");
                }
            }
        };
        xhr.withCredentials = true;
        xhr.open("POST", loc, true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.send(`fs:{"action":"fs-read","agent":"${configuration.agent}","depth":${configuration.depth},"location":"${configuration.location.replace(/\\/g, "\\\\")}"}`);
    };
    network.messages = function local_network_messages():void {
        if (loadTest === true) {
            return;
        }
        const xhr:XMLHttpRequest = new XMLHttpRequest(),
            loc:string = location.href.split("?")[0];
        xhr.onreadystatechange = function local_network_messages_callback():void {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200 && xhr.status !== 0) {
                    network.error("something");
                }
            }
        };
        xhr.withCredentials = true;
        xhr.open("POST", loc, true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.send(`messages:${JSON.stringify(messages)}`);
    };
    network.settings = function local_network_settings():void {
        if (loadTest === true) {
            return;
        }
        const xhr:XMLHttpRequest = new XMLHttpRequest(),
            loc:string = location.href.split("?")[0];
        xhr.onreadystatechange = function local_network_settings_callback():void {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200 && xhr.status !== 0) {
                    network.error("something");
                }
            }
        };
        xhr.withCredentials = true;
        xhr.open("POST", loc, true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.send(`settings:${JSON.stringify(data)}`);
    };
    ui.fs.expand = function local_ui_fs_expand(event:MouseEvent):void {
        const button:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            li:HTMLElement = <HTMLElement>button.parentNode;
        if (button.innerHTML.indexOf("+") === 0) {
            button.innerHTML = "-<span>Collapse this folder</span>";
            network.fs({
                agent: "self",
                depth: 2,
                callback: function local_ui_fs_expand_callback(files:HTMLElement) {
                    li.appendChild(files);
                },
                id: "",
                location: li.firstChild.nextSibling.textContent
            });
        } else {
            const ul:HTMLCollectionOf<HTMLUListElement> = li.getElementsByTagName("ul");
            button.innerHTML = "+<span>Expand this folder</span>";
            if (ul.length > 0) {
                li.removeChild(li.getElementsByTagName("ul")[0]);
            }
        }
        event.stopPropagation();
    };
    ui.fs.navigate = function local_ui_fs_navigate(event:MouseEvent):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target;
        network.fs({
            agent: "self",
            depth: 2,
            callback: function local_ui_fs_navigate_callback(files:HTMLElement) {
                const value:string = files.getAttribute("title");
                files.removeAttribute("title");
                ui.modal.create({
                    content: files,
                    inputs: ["close", "maximize", "minimize", "text"],
                    text_event: ui.fs.text,
                    text_placeholder: "Optionally type a file system address here.",
                    text_value: value,
                    title: element.innerHTML,
                    type: "fileNavigate",
                    width: 800
                });
            },
            id: "",
            location: "default"
        });
    };
    ui.fs.parent = function local_ui_fs_parent():boolean {
        const element:HTMLElement = <HTMLInputElement>event.srcElement || <HTMLInputElement>event.target,
            input:HTMLInputElement = <HTMLInputElement>element.nextSibling,
            slash:string = (input.value.indexOf("/") > -1 && (input.value.indexOf("\\") < 0 || input.value.indexOf("\\") > input.value.indexOf("/")))
                ? "/"
                : "\\",
            value:string = input.value;
        let body:HTMLElement = <HTMLElement>element.parentNode,
            box:HTMLElement,
            id:string = "";
        if (input.value === "\\" || input.value === "/") {
            return false;
        }
        body = <HTMLElement>body.parentNode;
        box = <HTMLElement>body.parentNode;
        id = box.getAttribute("id");
        body = body.getElementsByTagName("div")[0];
        if ((/^\w:\\$/).test(value) === true) {
            input.value = "\\";
        } else if (value.indexOf(slash) === value.lastIndexOf(slash)) {
            input.value = value.slice(0, value.lastIndexOf(slash) + 1);
        } else {
            input.value = value.slice(0, value.lastIndexOf(slash));
        }
        network.fs({
            agent: "self",
            depth: 2,
            callback: function local_ui_fs_parent_callback(files:HTMLElement) {
                body.innerHTML = "";
                body.appendChild(files);
                data.modals[id].text_value = input.value;
                network.settings();
            },
            id: "",
            location: input.value
        });
    };
    ui.fs.select = function local_ui_fs_select(event:MouseEvent):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            input:HTMLInputElement = element.getElementsByTagName("input")[0];
        let state:boolean = input.checked,
            body:HTMLElement = element,
            box:HTMLElement;
        event.stopPropagation();
        do {
            body = <HTMLElement>body.parentNode;
        } while (body !== document.documentElement && body.getAttribute("class") !== "body");
        box = <HTMLElement>body.parentNode.parentNode;
        if (characterKey === "") {
            const inputs = body.getElementsByTagName("input"),
                inputsLength = inputs.length;
            let a:number = 0,
                li:HTMLElement;
            do {
                if (inputs[a].checked === true) {
                    inputs[a].checked = false;
                    li = <HTMLElement>inputs[a].parentNode.parentNode;
                    li.setAttribute("class", li.getAttribute("class").replace(/\s*selected/, ""));
                }
                a = a + 1;
            } while (a < inputsLength);
            if (state === false) {
                input.checked = true;
                element.setAttribute("class", `${element.getAttribute("class")} selected`);
            }
        } else if (characterKey === "control") {
            if (state === true) {
                input.checked = false;
                element.setAttribute("class", element.getAttribute("class").replace(/\s*selected/, ""));
            } else {
                input.checked = true;
                element.setAttribute("class", `${element.getAttribute("class")} selected`);
            }
        } else if (characterKey === "shift") {
            const liList = body.getElementsByTagName("li"),
                shift = function local_ui_fs_select_shift(index:number, end:number):void {
                    if (state === true) {
                        do {
                            liList[index].getElementsByTagName("input")[0].checked = false;
                            liList[index].setAttribute("class", liList[index].getAttribute("class").replace(/\s*selected/, ""));
                            index = index + 1;
                        } while (index < end);
                    } else {
                        do {
                            liList[index].getElementsByTagName("input")[0].checked = true;
                            liList[index].setAttribute("class", `${liList[index].getAttribute("class")} selected`);
                            index = index + 1;
                        } while (index < end);
                    }
                };
            let a:number = 0,
                focus:HTMLElement = data.modals[box.getAttribute("id")].focus,
                elementIndex:number = -1,
                focusIndex:number = -1,
                listLength:number = liList.length;
            if (focus === null || focus === undefined) {
                data.modals[box.getAttribute("id")].focus = liList[0];
                focus = liList[0];
            }
            do {
                if (liList[a] === element) {
                    elementIndex = a;
                    if (focusIndex > -1) {
                        break;
                    }
                } else if (liList[a] === focus) {
                    focusIndex = a;
                    if (elementIndex > -1) {
                        break;
                    }
                }
                a = a + 1;
            } while (a < listLength);
            if (focusIndex === elementIndex) {
                if (state === true) {
                    input.checked = false;
                    element.setAttribute("class", element.getAttribute("class").replace(/\s*selected/, ""));
                } else {
                    input.checked = true;
                    element.setAttribute("class", `${element.getAttribute("class")} selected`);
                }
            } else if (focusIndex > elementIndex) {
                shift(elementIndex, focusIndex);
            } else {
                shift(focusIndex + 1, elementIndex + 1);
            }
        }
        data.modals[box.getAttribute("id")].focus = element;
    };
    ui.fs.share = function local_ui_fs_share(event:MouseEvent):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target;
        network.fs({
            agent: "self",
            depth: 2,
            callback: function local_ui_fs_share_callback(files:HTMLElement) {
                const value:string = files.getAttribute("title");
                files.removeAttribute("title");
                ui.modal.create({
                    content: files,
                    inputs: ["cancel", "close", "confirm", "maximize", "minimize", "text"],
                    single: true,
                    text_event: ui.fs.text,
                    text_placeholder: "Optionally type a file system address here.",
                    text_value: value,
                    title: element.innerHTML,
                    type: "fileShare",
                    width: 800
                });
            },
            id: "",
            location: "default"
        });
    };
    ui.fs.text = function local_ui_fs_text(event:KeyboardEvent):void {
        const element:HTMLInputElement = <HTMLInputElement>event.srcElement || <HTMLInputElement>event.target;
        let parent:HTMLElement = <HTMLElement>element.parentNode,
            box:HTMLElement,
            id:string;
        parent = <HTMLElement>parent.parentNode;
        box = <HTMLElement>parent.parentNode;
        id = box.getAttribute("id");
        parent = parent.getElementsByTagName("div")[0];
        if (event.type === "blur" || (event.type === "keyup" && event.keyCode === 13)) {
            network.fs({
                agent: "self",
                depth: 2,
                callback: function local_ui_fs_text_callback(files:HTMLElement) {
                    parent.innerHTML = "";
                    parent.appendChild(files);
                    data.modals[id].text_value = element.value;
                    network.settings();
                },
                id: "",
                location: element.value
            });
        }
    };
    ui.modal.close = function local_ui_modal_close(event:MouseEvent):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            keys:string[] = Object.keys(data.modals),
            keyLength:number = keys.length;
        let parent:HTMLElement = <HTMLElement>element.parentNode,
            id:string,
            type:string,
            a:number = 0,
            count:number = 0;
        do {
            parent = <HTMLElement>parent.parentNode;
        } while (parent.getAttribute("class") !== "box");
        parent.onclick = null;
        parent.parentNode.removeChild(parent);
        id = parent.getAttribute("id");
        type = id.split("-")[0];
        do {
            if (data.modals[keys[a]].type === type) {
                count = count + 1;
                if (count > 1) {
                    break;
                }
            }
            a = a + 1;
        } while (a < keyLength);
        if (count === 1) {
            data.modalTypes.splice(data.modalTypes.indexOf(type), 1);
        }
        delete data.modals[id];
        network.settings();
    };
    ui.modal.create = function local_ui_modal_create(options:ui_modal):void {
        let button:HTMLElement = document.createElement("button"),
            h2:HTMLElement = document.createElement("h2"),
            input:HTMLInputElement,
            extra:HTMLElement;
        const id:string = (options.type === "systems")
                ? "systems-modal"
                : (options.id || `${options.type}-${Math.random().toString() + data.zIndex + 1}`),
            box:HTMLElement = document.createElement("div"),
            body:HTMLElement = document.createElement("div"),
            border:HTMLElement = document.createElement("div");
        data.zIndex = data.zIndex + 1;
        if (options.zIndex === undefined) {
            options.zIndex = data.zIndex;
        }
        if (data.modalTypes.indexOf(options.type) > -1) {
            if (options.single === true) {
                return;
            }
        } else {
            data.modalTypes.push(options.type);
        }
        if (options.left === undefined) {
            options.left = 200;
        }
        if (options.top === undefined) {
            options.top = 200;
        }
        if (options.width === undefined) {
            options.width = 400;
        }
        if (options.height === undefined) {
            options.height = 400;
        }
        if (options.status === undefined) {
            options.status = "normal";
        }
        if (options.type === "systems") {
            button.innerHTML = document.getElementById("systemLog").innerHTML;
        } else {
            button.innerHTML = options.title;
        }
        button.onmousedown = ui.modal.move;
        button.ontouchstart = ui.modal.move;
        button.onblur  = function local_ui_modal_create_blur():void {
            button.onclick = null;
        };
        box.setAttribute("id", id);
        box.onmousedown = ui.modal.zTop;
        data.modals[id] = options;
        box.style.zIndex = data.zIndex.toString();
        box.setAttribute("class", "box");
        border.setAttribute("class", "border");
        body.setAttribute("class", "body");
        body.style.height = `${options.height / 10}em`;
        body.style.width = `${options.width / 10}em`;
        box.style.left = `${options.left / 10}em`;
        box.style.top = `${options.top / 10}em`;
        h2.appendChild(button);
        h2.setAttribute("class", "heading");
        border.appendChild(h2);
        if (Array.isArray(options.inputs) === true) {
            if (options.inputs.indexOf("close") > -1 || options.inputs.indexOf("maximize") > -1 || options.inputs.indexOf("minimize") > -1) {
                h2 = document.createElement("p");
                h2.setAttribute("class", "buttons");
                if (options.inputs.indexOf("minimize") > -1) {
                    button = document.createElement("button");
                    button.innerHTML = "🗕 <span>Minimize</span>";
                    button.setAttribute("class", "minimize");
                    button.onclick = ui.modal.minimize;
                    h2.appendChild(button);
                }
                if (options.inputs.indexOf("maximize") > -1) {
                    button = document.createElement("button");
                    button.innerHTML = "🗖 <span>Maximize</span>";
                    button.setAttribute("class", "maximize");
                    button.onclick = ui.modal.maximize;
                    h2.appendChild(button);
                }
                if (options.inputs.indexOf("close") > -1) {
                    button = document.createElement("button");
                    button.innerHTML = "🗙 <span>close</span>";
                    button.setAttribute("class", "close");
                    if (options.type === "systems") {
                        button.onclick = function local_ui_modal_create_systemsHide(event:MouseEvent):void {
                            let box:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target;
                            do {
                                box = <HTMLElement>box.parentNode;
                            } while (box !== document.documentElement && box.getAttribute("class") !== "box");
                            if (box.getAttribute("class") === "box") {
                                box.style.display = "none";
                                data.modals["systems-modal"].text_placeholder = data.modals["systems-modal"].status;
                                data.modals["systems-modal"].status = "hidden";
                            }
                        };
                        if (options.status === "hidden") {
                            box.style.display = "none";
                        }
                    } else {
                        button.onclick = ui.modal.close;
                    }
                    h2.appendChild(button);
                }
                border.appendChild(h2);
            }
            if (options.inputs.indexOf("text") > -1) {
                extra = document.createElement("p");
                if (options.type === "fileNavigate" || options.type === "fileShare") {
                    extra.style.paddingLeft = "5em";
                    button = document.createElement("button");
                    button.innerHTML = "▲<span>Parent directory</span>";
                    button.setAttribute("class", "parentDirectory");
                    button.onclick = ui.fs.parent;
                    extra.appendChild(button);
                }
                input = document.createElement("input");
                input.type = "text";
                input.spellcheck = false;
                if (options.text_event !== undefined) {
                    input.onblur = options.text_event;
                    input.onkeyup = options.text_event;
                }
                if (options.text_placeholder !== undefined) {
                    input.placeholder = options.text_placeholder;
                }
                if (options.text_value !== undefined) {
                    input.value = options.text_value;
                }
                extra.setAttribute("class", "header");
                extra.appendChild(input);
                border.appendChild(extra);
            }
        }
        border.appendChild(body);
        if (options.resize !== false) {
            button = document.createElement("button");
            button.innerHTML = "resize box width and height";
            button.setAttribute("class", "corner-tl");
            button.onmousedown = ui.modal.resize;
            border.appendChild(button);
            button = document.createElement("button");
            button.innerHTML = "resize box width and height";
            button.setAttribute("class", "corner-tr");
            button.onmousedown = ui.modal.resize;
            border.appendChild(button);
            button = document.createElement("button");
            button.innerHTML = "resize box width and height";
            button.setAttribute("class", "corner-bl");
            button.onmousedown = ui.modal.resize;
            border.appendChild(button);
            button = document.createElement("button");
            button.innerHTML = "resize box width and height";
            button.setAttribute("class", "corner-br");
            button.onmousedown = ui.modal.resize;
            border.appendChild(button);
            button = document.createElement("button");
            button.innerHTML = "resize box height";
            button.setAttribute("class", "side-t");
            button.style.width = `${(options.width / 10) + 1}em`;
            button.onmousedown = ui.modal.resize;
            border.appendChild(button);
            button = document.createElement("button");
            button.innerHTML = "resize box width";
            button.setAttribute("class", "side-r");
            button.style.height = `${(options.height / 10) + 3}em`;
            button.onmousedown = ui.modal.resize;
            border.appendChild(button);
            button = document.createElement("button");
            button.innerHTML = "resize box height";
            button.setAttribute("class", "side-b");
            button.style.width = `${(options.width / 10) + 1}em`;
            button.onmousedown = ui.modal.resize;
            border.appendChild(button);
            button = document.createElement("button");
            button.innerHTML = "resize box width";
            button.setAttribute("class", "side-l");
            button.style.height = `${(options.height / 10) + 3}em`;
            button.onmousedown = ui.modal.resize;
            border.appendChild(button);
        }
        body.appendChild(options.content);
        if (options.type === "export" || options.type === "textPad") {
            body.style.overflow = "hidden";
        }
        if (Array.isArray(options.inputs) === true && (options.inputs.indexOf("cancel") > -1 || options.inputs.indexOf("confirm") > -1)) {
            extra = document.createElement("p");
            extra.setAttribute("class", "footer");
            if (options.inputs.indexOf("confirm") > -1) {
                button = document.createElement("button");
                button.innerHTML = "✓ Confirm";
                button.setAttribute("class", "confirm");
                if (options.type === "export") {
                    button.onclick = ui.modal.import;
                }
                extra.appendChild(button);
            }
            if (options.inputs.indexOf("cancel") > -1) {
                button = document.createElement("button");
                button.innerHTML = "🗙 Cancel";
                button.setAttribute("class", "cancel");
                button.onclick = ui.modal.close;
                extra.appendChild(button);
            }
            border.appendChild(extra);
        }
        box.appendChild(border);
        content.appendChild(box);
        network.settings();
    };
    ui.modal.export = function local_ui_modal_export():void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            textArea:HTMLTextAreaElement = document.createElement("textarea");
        textArea.onblur = ui.modal.textSave;
        textArea.value = JSON.stringify(data);
        ui.modal.create({
            content: textArea,
            inputs: ["cancel", "close", "confirm", "maximize", "minimize"],
            single: true,
            title: element.innerHTML,
            type: "export"
        });
    };
    ui.modal.import = function local_ui_modal_import(event:MouseEvent):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            dataString:string = JSON.stringify(data);
        let box:HTMLElement = element,
            textArea:HTMLTextAreaElement,
            button:HTMLButtonElement;
        do {
            box = <HTMLElement>box.parentNode;
        } while (box !== document.documentElement && box.getAttribute("class") !== "box");
        textArea = box.getElementsByTagName("textarea")[0];
        if (textArea.value !== dataString) {
            data = JSON.parse(textArea.value);
        }
        button = <HTMLButtonElement>document.getElementsByClassName("cancel")[0];
        button.click();
        if (textArea.value !== dataString) {
            network.settings();
            location.replace(location.href);
        }
    };
    ui.modal.maximize = function local_ui_modal_maximize(event:Event):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            contentArea:HTMLElement = document.getElementById("content-area");
        let box:HTMLElement = element,
            body:HTMLElement,
            title:HTMLElement,
            id:string;
        do {
            box = <HTMLElement>box.parentNode;
        } while (box !== document.documentElement && box.getAttribute("class") !== "box");
        if (box === document.documentElement) {
            return;
        }
        id = box.getAttribute("id");
        body = box.getElementsByTagName("div")[1];
        title = <HTMLElement>box.getElementsByTagName("h2")[0];
        if (title !== undefined) {
            title = title.getElementsByTagName("button")[0];
        }
        if (data.modals[id].status === "maximized") {
            title.style.cursor = "move";
            title.onmousedown = ui.modal.move;
            data.modals[id].status = "normal";
            box.style.top = `${data.modals[id].top / 10}em`;
            box.style.left = `${data.modals[id].left / 10}em`;
            body.style.width = `${data.modals[id].width / 10}em`;
            body.style.height = `${data.modals[id].height / 10}em`;
        } else {
            data.modals[id].status = "maximized";
            title.style.cursor = "default";
            title.onmousedown = null;
            box.style.top = "0em";
            box.style.left = "0em";
            body.style.width = `${(contentArea.clientWidth - 20) / 10}em`;
            body.style.height = (function local_ui_modal_maximize_maxHeight():string {
                let height:number = contentArea.clientHeight,
                    footer:HTMLElement = <HTMLElement>box.getElementsByClassName("footer")[0],
                    header:HTMLElement = <HTMLElement>box.getElementsByClassName("header")[0];
                height = (height - title.clientHeight) - 27;
                if (footer !== undefined) {
                    height = height - footer.clientHeight;
                }
                if (header !== undefined) {
                    height = height - header.clientHeight;
                }
                return `${height / 10}em`;
            }());
        }
        network.settings();
    };
    ui.modal.minimize = function local_ui_modal_minimize(event:Event):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target;
        let border:HTMLElement = element,
            box:HTMLElement,
            title:HTMLElement,
            id:string,
            children:NodeListOf<ChildNode>,
            child:HTMLElement,
            a:number = 1;
        do {
            border = <HTMLElement>border.parentNode;
        } while (border !== document.documentElement && border.getAttribute("class") !== "border");
        if (border === document.documentElement) {
            return;
        }
        box = <HTMLElement>border.parentNode;
        id = box.getAttribute("id");
        title = <HTMLElement>border.getElementsByTagName("h2")[0];
        title.getElementsByTagName("button")[0].onmousedown = ui.modal.move;
        children = border.childNodes;
        if (data.modals[id].status === "minimized") {
            const li:HTMLElement = <HTMLElement>box.parentNode,
                body:HTMLElement = <HTMLElement>border.getElementsByClassName("body")[0];
            do {
                child = <HTMLElement>children[a];
                child.style.display = "block";
                a = a + 1;
            } while (a < children.length);
            document.getElementById("tray").removeChild(li);
            li.removeChild(box);
            box.style.zIndex = data.modals[id].zIndex.toString();
            title.getElementsByTagName("button")[0].style.cursor = "move";
            content.appendChild(box);
            data.modals[id].status = "normal";
            box.style.top = `${data.modals[id].top / 10}em`;
            box.style.left = `${data.modals[id].left / 10}em`;
            body.style.width = `${data.modals[id].width / 10}em`;
            body.style.height = `${data.modals[id].height / 10}em`;
        } else {
            const li:HTMLLIElement = document.createElement("li");
            do {
                child = <HTMLElement>children[a];
                child.style.display = "none";
                a = a + 1;
            } while (a < children.length);
            box.style.zIndex = "0";
            box.parentNode.removeChild(box);
            title.getElementsByTagName("button")[0].style.cursor = "pointer";
            li.appendChild(box);
            document.getElementById("tray").appendChild(li);
            data.modals[id].status = "minimized";
        }
        network.settings();
    };
    ui.modal.move = function local_ui_modal_move(event:Event):boolean {
        const x:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            heading:HTMLElement = <HTMLElement>x.parentNode,
            box:HTMLElement        = <HTMLElement>heading.parentNode.parentNode,
            settings:ui_modal = data.modals[box.getAttribute("id")],
            border:HTMLElement = box.getElementsByTagName("div")[0],
            minifyTest:boolean = (box.parentNode.nodeName === "li"),
            touch:boolean      = (event !== null && event.type === "touchstart"),
            mouseEvent = <MouseEvent>event,
            touchEvent = <TouchEvent>event,
            mouseX = (touch === true)
                ? 0
                : mouseEvent.clientX,
            mouseY = (touch === true)
                ? 0
                : mouseEvent.clientY,
            touchX = (touch === true)
                ? touchEvent.touches[0].clientX
                : 0,
            touchY = (touch === true)
                ? touchEvent.touches[0].clientY
                : 0,   
            drop       = function local_ui_modal_move_drop(e:Event):boolean {
                const headingWidth:number = box.getElementsByTagName("h2")[0].clientWidth;
                boxLeft = box.offsetLeft;
                boxTop  = box.offsetTop;
                if (touch === true) {
                    document.ontouchmove = null;
                    document.ontouchend  = null;
                } else {
                    document.onmousemove = null;
                    document.onmouseup   = null;
                }
                if (boxTop < 10) {
                    boxTop = 10;
                } else if (boxTop > (max - 40)) {
                    boxTop = max - 40;
                }
                if (boxLeft < ((headingWidth * -1) + 40)) {
                    boxLeft = (headingWidth * -1) + 40;
                }
                box.style.top = `${boxTop / 10}em`;
                box.style.left = `${boxLeft / 10}em`;
                border.style.opacity = "1";
                box.style.height   = "auto";
                settings.top = boxTop;
                settings.left = boxLeft;
                network.settings();
                e.preventDefault();
                return false;
            },
            boxMoveTouch    = function local_ui_modal_move_touch(f:TouchEvent):boolean {
                f.preventDefault();
                box.style.right = "auto";
                box.style.left      = `${(boxLeft + (f.touches[0].clientX - touchX)) / 10}em`;
                box.style.top       = `${(boxTop + (f.touches[0].clientY - touchY)) / 10}em`;
                document.ontouchend = drop;
                return false;
            },
            boxMoveClick = function local_ui_modal_move_click(f:MouseEvent):boolean {
                f.preventDefault();
                box.style.right = "auto";
                box.style.left     = `${(boxLeft + (f.clientX - mouseX)) / 10}em`;
                box.style.top      = `${(boxTop + (f.clientY - mouseY)) / 10}em`;
                document.onmouseup = drop;
                return false;
            };
        let boxLeft:number    = box.offsetLeft,
            boxTop:number     = box.offsetTop,
            max:number        = content.clientHeight;
        if (minifyTest === true) {
            const button:HTMLButtonElement = <HTMLButtonElement>box.getElementsByClassName("minimize")[0];
            button.click();
            return false;
        }
        event.preventDefault();
        border.style.opacity = ".5";
        //heading.style.top  = `${box.clientHeight / 20}0em`;
        box.style.height   = ".1em";
        if (touch === true) {
            document.ontouchmove  = boxMoveTouch;
            document.ontouchstart = null;
        } else {
            document.onmousemove = boxMoveClick;
            document.onmousedown = null;
        }
        // update settings
        return false;
    };
    ui.modal.resize = function local_ui_modal_resize(event:MouseEvent):void {
        let bodyWidth:number  = 0,
            bodyHeight:number = 0,
            computedHeight:number = 0,
            computedWidth:number = 0;
        const node:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            parent:HTMLElement     = <HTMLElement>node.parentNode,
            box:HTMLElement        = <HTMLElement>parent.parentNode,
            top:number = box.offsetTop,
            left:number = box.offsetLeft,
            body:HTMLDivElement       = box.getElementsByTagName("div")[1],
            offX:number = event.clientX,
            offY:number = event.clientY,
            mac:boolean        = (navigator.userAgent.indexOf("macintosh") > 0),
            direction:string = node.getAttribute("class").split("-")[1],
            offsetWidth:number    = (mac === true)
                ? 20
                : -16,
            offsetHeight:number    = (mac === true)
                ? 18
                : -20,
            drop       = function local_ui_modal_resize_drop():void {
                const settings:ui_modal = data.modals[box.getAttribute("id")];
                document.onmousemove = null;
                document.onmouseup = null;
                bodyWidth            = body.clientWidth;
                bodyHeight           = body.clientHeight;
                settings.width = bodyWidth - offsetWidth;
                settings.height = bodyHeight - offsetHeight;
                if (box.getAttribute("id") === "systems-modal") {
                    const tabs:HTMLElement = <HTMLElement>box.getElementsByClassName("tabs")[0];
                    tabs.style.width = `${body.clientWidth / 10}em`;
                }
                network.settings();
            },
            side:any    = {
                b: function local_ui_modal_resize_sizeB(f:MouseEvent):void {
                    computedHeight = (bodyHeight + ((f.clientY - offsetHeight) - offY)) / 10;
                    if (computedHeight > 10) {
                        body.style.height  = `${computedHeight}em`;
                    }
                    document.onmouseup = drop;
                },
                bl: function local_ui_modal_resize_sizeBL(f:MouseEvent):void {
                    computedWidth = left + (f.clientX - offX);
                    if (((bodyWidth - offsetWidth) + (left - computedWidth)) / 10 > 35) {
                        box.style.left = `${computedWidth / 10}em`;
                        body.style.width  = `${((bodyWidth - offsetWidth) + (left - computedWidth)) / 10}em`;
                    }
                    computedHeight = (bodyHeight + ((f.clientY - offsetHeight) - offY)) / 10;
                    if (computedHeight > 10) {
                        body.style.height  = `${computedHeight}em`;
                    }
                    document.onmouseup = drop;
                },
                br: function local_ui_modal_resize_sizeBR(f:MouseEvent):void {
                    computedWidth = (bodyWidth + ((f.clientX - offsetWidth) - offX)) / 10;
                    if (computedWidth > 35) {
                        body.style.width = `${computedWidth}em`;
                    }
                    computedHeight = (bodyHeight + ((f.clientY - offsetHeight) - offY)) / 10;
                    if (computedHeight > 10) {
                        body.style.height  = `${computedHeight}em`;
                    }
                    document.onmouseup = drop;
                },
                l: function local_ui_modal_resize_sizeL(f:MouseEvent):void {
                    computedWidth = left + (f.clientX - offX);
                    if (((bodyWidth - offsetWidth) + (left - computedWidth)) / 10 > 35) {
                        box.style.left = `${computedWidth / 10}em`;
                        body.style.width  = `${((bodyWidth - offsetWidth) + (left - computedWidth)) / 10}em`;
                    }
                    document.onmouseup = drop;
                },
                r: function local_ui_modal_resize_sizeR(f:MouseEvent):void {
                    computedWidth = (bodyWidth + ((f.clientX - offsetWidth) - offX)) / 10;
                    if (computedWidth > 35) {
                        body.style.width = `${computedWidth}em`;
                    }
                    document.onmouseup = drop;
                },
                t: function local_ui_modal_resize_sizeT(f:MouseEvent):void {
                    computedHeight = top + (f.clientY - offY);
                    if (((bodyHeight - offsetHeight) + (top - computedHeight)) / 10 > 10) {
                        box.style.top = `${computedHeight / 10}em`;
                        body.style.height  = `${((bodyHeight - offsetHeight) + (top - computedHeight)) / 10}em`;
                    }
                    document.onmouseup = drop;
                },
                tl: function local_ui_modal_resize_sizeTL(f:MouseEvent):void {
                    computedHeight = top + (f.clientY - offY);
                    if (((bodyHeight - offsetHeight) + (top - computedHeight)) / 10 > 10) {
                        box.style.top = `${computedHeight / 10}em`;
                        body.style.height  = `${((bodyHeight - offsetHeight) + (top - computedHeight)) / 10}em`;
                    }
                    computedWidth = left + (f.clientX - offX);
                    if (((bodyWidth - offsetWidth) + (left - computedWidth)) / 10 > 35) {
                        box.style.left = `${computedWidth / 10}em`;
                        body.style.width  = `${((bodyWidth - offsetWidth) + (left - computedWidth)) / 10}em`;
                    }
                    document.onmouseup = drop;
                },
                tr: function local_ui_modal_resize_sizeTR(f:MouseEvent):void {
                    computedHeight = top + (f.clientY - offY);
                    if (((bodyHeight - offsetHeight) + (top - computedHeight)) / 10 > 10) {
                        box.style.top = `${computedHeight / 10}em`;
                        body.style.height  = `${((bodyHeight - offsetHeight) + (top - computedHeight)) / 10}em`;
                    }
                    computedWidth = (bodyWidth + ((f.clientX - offsetWidth) - offX)) / 10;
                    if (computedWidth > 35) {
                        body.style.width = `${computedWidth}em`;
                    }
                    document.onmouseup = drop;
                }
            };
        bodyWidth  = body.clientWidth;
        bodyHeight = body.clientHeight;
        document.onmousemove = side[direction];
        document.onmousedown = null;
    };
    ui.modal.systems = function local_ui_modal_systems() {
        document.getElementById("systems-modal").style.display = "block";
        if (data.modals["systems-modal"].text_placeholder === "maximized" || data.modals["systems-modal"].text_placeholder === "normal") {
            data.modals["systems-modal"].status = data.modals["systems-modal"].text_placeholder;
        } else {
            data.modals["systems-modal"].status = "normal";
        }
    };
    ui.modal.textPad = function local_ui_modal_textPad(event:MouseEvent):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            textArea:HTMLTextAreaElement = document.createElement("textarea");
        textArea.onblur = ui.modal.textSave;
        ui.modal.create({
            content: textArea,
            inputs: ["close", "maximize", "minimize"],
            title: element.innerHTML,
            type: "textPad",
            width: 800
        });
    };
    ui.modal.textSave = function local_ui_modal_textSave(event:MouseEvent):void {
        const element:HTMLTextAreaElement = <HTMLTextAreaElement>event.srcElement || <HTMLTextAreaElement>event.target;
        let box:HTMLElement = element;
            do {
                box = <HTMLElement>box.parentNode;
            } while (box !== document.documentElement && box.getAttribute("class") !== "box");
        data.modals[box.getAttribute("id")].text_value = element.value;
        network.settings();
    };
    ui.modal.zTop     = function local_ui_modal_zTop(event:MouseEvent):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target;
        let box:HTMLElement = element;
        if (element.nodeName === "li") {
            event.preventDefault();
        }
        if (element.getAttribute("class") !== "box") {
            do {
                box = <HTMLElement>box.parentNode;
            } while (box.getAttribute("class") !== "box" && box !== document.documentElement);
        }
        data.zIndex = data.zIndex + 1;
        data.modals[box.getAttribute("id")].zIndex = data.zIndex;
        box.style.zIndex = data.zIndex.toString();
    };
    ui.systems.expand = function local_ui_systems_expand(event:MouseEvent):void {
        const button:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            li:HTMLElement = <HTMLElement>button.parentNode,
            ul:HTMLElement = li.getElementsByTagName("ul")[0],
            modal:HTMLElement = document.getElementById("systems-modal"),
            tabs:HTMLElement = <HTMLElement>modal.getElementsByClassName("tabs")[0];
        if (button.innerHTML.indexOf("+") === 0) {
            ul.style.display = "block";
            button.innerHTML = "-<span>Collapse stack trace</span>";
        } else {
            ul.style.display = "none";
            button.innerHTML = "+<span>Expand stack trace</span>";
        }
        tabs.style.width = `${modal.getElementsByClassName("body")[0].scrollWidth / 10}em`;
    };
    ui.systems.message = function local_ui_systems_message(type:messageType, content:string, timeStore?:string):void {
        const date:Date = new Date(),
            time:string[] = [],
            li:HTMLElement = document.createElement("li"),
            span:HTMLElement = document.createElement("span"),
            text:Text = document.createTextNode("");
        let dateString:string[],
            list:HTMLElement,
            ul:HTMLElement;
        if (loadTest === true) {
            span.innerHTML = timeStore;
        } else {
            time.push(date.getFullYear().toString());
            time.push((date.getMonth() + 1).toString());
            time.push(date.getDate().toString());
            time.push(date.getHours().toString());
            time.push(date.getMinutes().toString());
            time.push(date.getSeconds().toString());
            time.push(date.getMilliseconds().toString());
            if (time[1].length === 1) {
                // month
                time[1] = `0${time[1]}`;
            }
            if (time[2].length === 1) {
                // day
                time[2] = `0${time[2]}`;
            }
            if (time[3].length === 1) {
                // hour
                time[3] = `0${time[3]}`;
            }
            if (time[4].length === 1) {
                // minute
                time[4] = `0${time[4]}`;
            }
            if (time[5].length === 1) {
                // second
                time[5] = `0${time[5]}`;
            }
            if (time[6].length === 1) {
                // milliseconds
                time[6] = `00${time[6]}`;
            } else if (time[6].length === 2) {
                time[6] = `0${time[6]}`;
            }
            dateString = time.slice(0, 3);
            span.innerHTML = `[${dateString.join(":")}::${time.slice(3).join(":")}]`;
        }
        if (type === "errors") {
            const messageContent:messageError = JSON.parse(content),
                button:HTMLButtonElement = document.createElement("button");
            let stackItem:HTMLElement;
            ul = document.createElement("ul");
            ul.setAttribute("class", "stack");
            button.setAttribute("class", "expansion");
            button.innerHTML = "+<span>Expand this folder</span>";
            button.onclick = ui.systems.expand;
            messageContent.stack.forEach(function local_ui_systems_message_stack(value:string) {
                if (value.replace(/\s+/, "") !== "") {
                    stackItem = document.createElement("li");
                    stackItem.innerHTML = value;
                    ul.appendChild(stackItem);
                }
            });
            li.appendChild(button);
            text.textContent = messageContent.error.replace(/^\s*Error:\s*/, "");
            if (loadTest === false) {
                messages.errors.push([`[${dateString.join(":")}::${time.slice(3).join(":")}]`, messageContent.error.replace(/^\s*Error:\s*/, ""), messageContent.stack]);
            }
        } else {
            text.textContent = content;
            if (loadTest === false) {
                messages[type].push([`[${dateString.join(":")}::${time.slice(3).join(":")}]`, content]);
            }
        }
        li.appendChild(span);
        list = document.getElementById(`system-${type}`);
        if (loadTest === false && list.getElementsByTagName("li").length > 49) {
            list.removeChild(list.getElementsByTagName("li")[0]);
            messages[type].splice(0, 1);
        }
        li.appendChild(text);
        if (type === "errors") {
            li.appendChild(ul);
        }
        list.appendChild(li);
        if (loadTest === false) {
            network.messages();
        }
    };
    ui.systems.tabs = function local_ui_systems_tabs(event:MouseEvent):void {
        const element:HTMLElement = <HTMLElement>event.srcElement || <HTMLElement>event.target,
            parent:HTMLElement = <HTMLElement>element.parentNode.parentNode,
            className:string = element.getAttribute("class").replace(" active", "");
        if (className === "status") {
            element.setAttribute("class", "status active");
            parent.getElementsByClassName("users")[0].setAttribute("class", "users");
            parent.getElementsByClassName("errors")[0].setAttribute("class", "errors");
            document.getElementById("system-status").setAttribute("class", "messageList active");
            document.getElementById("system-users").setAttribute("class", "messageList");
            document.getElementById("system-errors").setAttribute("class", "messageList");
        } else if (className === "users") {
            element.setAttribute("class", "users active");
            parent.getElementsByClassName("status")[0].setAttribute("class", "status");
            parent.getElementsByClassName("errors")[0].setAttribute("class", "errors");
            document.getElementById("system-status").setAttribute("class", "messageList");
            document.getElementById("system-users").setAttribute("class", "messageList active");
            document.getElementById("system-errors").setAttribute("class", "messageList");
        } else if (className === "errors") {
            element.setAttribute("class", "errors active");
            parent.getElementsByClassName("status")[0].setAttribute("class", "status");
            parent.getElementsByClassName("users")[0].setAttribute("class", "users");
            document.getElementById("system-status").setAttribute("class", "messageList");
            document.getElementById("system-users").setAttribute("class", "messageList");
            document.getElementById("system-errors").setAttribute("class", "messageList active");
        }
        data.modals["systems-modal"].text_value = className;
        network.settings();
    };
    ui.util.addUser = function local_ui_util_addUser(userName:string, ip:string):void {
        const li:HTMLLIElement = document.createElement("li");
        li.innerHTML = `${userName}@${ip}`;
        if (ip === "localhost") {
            li.setAttribute("class", "local");
        } else {
            li.setAttribute("class", "offline");
        }
        document.getElementById("users").getElementsByTagName("ul")[0].appendChild(li);
    };
    ui.util.commas = function local_ui_util_commas(number:number):string {
        const str:string = String(number);
        let arr:string[] = [],
            a:number   = str.length;
        if (a < 4) {
            return str;
        }
        arr = String(number).split("");
        a   = arr.length;
        do {
            a      = a - 3;
            arr[a] = "," + arr[a];
        } while (a > 3);
        return arr.join("");
    };
    ui.util.fixHeight = function local_ui_util_fixHeight():void {
        const height:number   = window.innerHeight || document.getElementsByTagName("body")[0].clientHeight;
        content.style.height = `${(height - 51) / 10}em`;
        document.getElementById("users").style.height = `${(height - 102) / 10}em`;
    };
    ui.util.login = function local_ui_util_login():void {
        const input:HTMLInputElement = document.getElementById("login").getElementsByTagName("input")[0];
        if (input.value.replace(/\s+/, "") === "") {
            input.focus();
        } else {
            data.name = input.value;
            ui.util.addUser(input.value, "localhost");
            document.getElementsByTagName("body")[0].removeAttribute("class");
        }
    };
    ui.util.menu = function local_ui_util_menu():void {
        const menu:HTMLElement = document.getElementById("menu"),
            move = function local_ui_util_menu_move(event:MouseEvent):void {
                const menu:HTMLElement = document.getElementById("menu");
                if (event.clientX > menu.clientWidth || event.clientY > menu.clientHeight + 51) {
                    menu.style.display = "none";
                    document.onmousemove = null;
                }
            };
        menu.style.display = "block";
        document.onmousemove = move;
    };
    ws.addEventListener("message", function local_webSockets(event) {
        if (event.data === "reload") {
            location.reload();
        }
        if (event.data.indexOf("error-") === 0) {
            const data:string = event.data.slice(6),
                modal:HTMLElement = document.getElementById("systems-modal"),
                tabs:HTMLElement = <HTMLElement>modal.getElementsByClassName("tabs")[0];
            ui.systems.message("errors", data, "websocket");
            tabs.style.width = `${modal.getElementsByClassName("body")[0].scrollWidth / 10}em`;
        }
    });
    ui.util.fixHeight();
    window.onresize = ui.util.fixHeight;
    (function local_load():void {
        const systems:HTMLElement = (function local_systems():HTMLElement {
            const systemsElement:HTMLElement = document.createElement("div");
            let ul:HTMLElement = document.createElement("ul"),
                li:HTMLElement = document.createElement("li"),
                button:HTMLButtonElement = document.createElement("button");
            ul.setAttribute("class", "tabs");
            button.innerHTML = "⎔ System";
            button.setAttribute("class", "status active");
            button.onclick = ui.systems.tabs;
            li.appendChild(button);
            ul.appendChild(li);
            li = document.createElement("li");
            button = document.createElement("button");
            button.innerHTML = "⎋ Users";
            button.setAttribute("class", "users");
            button.onclick = ui.systems.tabs;
            li.appendChild(button);
            ul.appendChild(li);
            li = document.createElement("li");
            button = document.createElement("button");
            button.innerHTML = "⌁ Errors";
            button.setAttribute("class", "errors");
            button.onclick = ui.systems.tabs;
            li.appendChild(button);
            ul.appendChild(li);
            systemsElement.appendChild(ul);
            ul = document.createElement("ul");
            ul.setAttribute("id", "system-status");
            ul.setAttribute("class", "messageList active");
            systemsElement.appendChild(ul);
            ul = document.createElement("ul");
            ul.setAttribute("id", "system-users");
            ul.setAttribute("class", "messageList");
            systemsElement.appendChild(ul);
            ul = document.createElement("ul");
            ul.setAttribute("id", "system-errors");
            ul.setAttribute("class", "messageList");
            systemsElement.appendChild(ul);
            return systemsElement;
        }());

        // getNodesByType
        (function local_nodes():void {
            const getNodesByType = function local_nodes_getNodesByType(typeValue:string|number):Node[] {
                    "use strict";
                    let types:number     = 0;
                    const valueTest:string = (typeof typeValue === "string") ? typeValue.toUpperCase() : "",
                        root:HTMLElement = (this === document)
                            ? document.documentElement
                            : this;
        
                    // Normalize string input for case insensitivity.
                    if (typeof typeValue === "string") {
                        typeValue = typeValue.toLowerCase();
                    }
        
                    // If input is a string and supported standard value
                    // associate to the standard numeric type
                    if (typeValue === "all") {
                        types = 0;
                    } else if (typeValue === "element_node") {
                        types = 1;
                    } else if (typeValue === "attribute_node") {
                        types = 2;
                    } else if (typeValue === "text_node") {
                        types = 3;
                    } else if (typeValue === "cdata_section_node") {
                        types = 4;
                    } else if (typeValue === "entity_reference_node") {
                        types = 5;
                    } else if (typeValue === "entity_node") {
                        types = 6;
                    } else if (typeValue === "processing_instruction_node") {
                        types = 7;
                    } else if (typeValue === "comment_node") {
                        types = 8;
                    } else if (typeValue === "document_node") {
                        types = 9;
                    } else if (typeValue === "document_type_node") {
                        types = 10;
                    } else if (typeValue === "document_fragment_node") {
                        types = 11;
                    } else if (typeValue === "notation_node") {
                        types = 12;
                    }
        
                    // If input is type string but the value is a supported number
                    if (isNaN(Number(valueTest)) === false && (valueTest.length === 1 || valueTest === "10" || valueTest === "11" || valueTest === "12")) {
                        types = Number(valueTest);
                    }
        
                    // If input is a supported number
                    if (valueTest === "" && (typeValue === 0 || typeValue === 1 || typeValue === 2 || typeValue === 3 || typeValue === 4 || typeValue === 5 || typeValue === 6 || typeValue === 7 || typeValue === 8 || typeValue === 9 || typeValue === 10 || typeValue === 11 || typeValue === 12)) {
                        types = typeValue;
                    }
        
                    // A handy dandy function to trap all the DOM walking
                    return (function local_nodes_getNodesByType_walking():Node[] {
                        var output:Node[] = [],
                            child  = function local_nodes_getNodesByType_walking_child(x:HTMLElement):void {
                                const children:NodeListOf<ChildNode> = x.childNodes;
                                let a:NamedNodeMap    = x.attributes,
                                    b:number    = a.length,
                                    c:number    = 0;
                                // Special functionality for attribute types.
                                if (b > 0 && (types === 2 || types === 0)) {
                                    do {
                                        output.push(a[c]);
                                        c = c + 1;
                                    } while (c < b);
                                }
                                b = children.length;
                                c = 0;
                                if (b > 0) {
                                    do {
                                        if (children[c].nodeType === types || types === 0) {
                                            output.push(<HTMLElement>children[c]);
                                        }
                                        if (children[c].nodeType === 1) {
                                            //recursion magic
                                            local_nodes_getNodesByType_walking_child(<HTMLElement>children[c]);
                                        }
                                        c = c + 1;
                                    } while (c < b);
                                }
                            };
                        child(root);
                        return output;
                    }());
                },
                getElementsByAttribute = function local_nodes_getElementsByAttribute(name:string, value:string):Element[] {
                    const attrs:Attr[] = this.getNodesByType(2),
                        out:Element[]   = [];
                    if (typeof name !== "string") {
                        name = "";
                    }
                    if (typeof value !== "string") {
                        value = "";
                    }
                    attrs.forEach(function local_nodes_getElementsByAttribute_loop(item) {
                        if (item.name === name || name === "") {
                            if (item.value === value || value === "") {
                                out.push(item.ownerElement);
                            }
                        }
                    });
                    return out;
                };
        
            // Create a document method
            document.getNodesByType         = getNodesByType;
            document.getElementsByAttribute = getElementsByAttribute;
        
            (function local_nodes_addToExistingElements() {
                var el = document.getNodesByType(1);
                el.forEach(function local_nodes_addToExistingElements_loop(item) {
                    item.getNodesByType         = getNodesByType;
                    item.getElementsByAttribute = getElementsByAttribute;
                });
            }());
            // Add this code as a method onto each DOM element
        
            // Ensure dynamically created elements get this method too
            Element.prototype.getNodesByType         = getNodesByType;
            Element.prototype.getElementsByAttribute = getElementsByAttribute;
        
        }());

        // restore state
        (function local_restore():void {
            let storage:any;
            const comments:Comment[] = document.getNodesByType(8),
                commentLength:number = comments.length,
                loadComplete = function load_restore_complete():void {
                    // assign key default events
                    document.getElementById("login").getElementsByTagName("button")[0].onclick = ui.util.login;
                    document.getElementById("menuToggle").onclick = ui.util.menu;
                    document.getElementById("shareFiles").onclick = ui.fs.share;
                    document.getElementById("systemLog").onclick = ui.modal.systems;
                    document.getElementById("fileNavigator").onclick = ui.fs.navigate;
                    document.getElementById("textPad").onclick = ui.modal.textPad;
                    document.getElementById("export").onclick = ui.modal.export;
            
                    // determine if keyboard control keys are held
                    document.onkeydown = function load_keydown(event:KeyboardEvent) {
                        const key:string = event.key.toLowerCase();
                        if (key === "shift") {
                            characterKey = "shift";
                        } else if (key === "control" && characterKey !== "shift") {
                            characterKey = "control";
                        }
                    };
                    document.onkeyup = function load_keyup(event:KeyboardEvent) {
                        const key:string = event.key.toLowerCase();
                        if (key === "shift" && characterKey === "shift") {
                            characterKey = "";
                        } else if (key === "control" && characterKey === "control") {
                            characterKey = "";
                        }
                    };
            
                    // building logging utility
                    if (document.getElementById("systems-modal") === null) {
                        ui.modal.create({
                            content: systems,
                            inputs: ["close", "maximize", "minimize"],
                            single: true,
                            title: "",
                            type: "systems",
                            width: 800
                        });
                    }
                    if (storage !== undefined && storage.messages !== undefined) {
                        if (storage.messages.status.length > 0) {
                            storage.messages.status.forEach(function local_restore_statusEach(value:messageList):void {
                                ui.systems.message("status", value[1], value[0]);
                                messages.status.push([value[0], value[1]]);
                            });
                        }
                        if (storage.messages.users.length > 0) {
                            storage.messages.users.forEach(function local_restore_usersEach(value:messageList):void {
                                ui.systems.message("users", value[1], value[0]);
                                messages.users.push([value[0], value[1]]);
                            });
                        }
                        if (storage.messages.errors.length > 0) {
                            storage.messages.errors.forEach(function local_restore_errorsEach(value:messageListError):void {
                                ui.systems.message("errors", JSON.stringify({
                                    error:value[1],
                                    stack:value[2]
                                }), value[0]);
                                messages.errors.push([value[0], value[1], value[2]]);
                            });
                        }
                    }
                    loadTest = false;
                };
            let a:number = 0,
                cString:string = "";
            do {
                cString = comments[a].substringData(0, comments[a].length);
                if (cString.indexOf("storage:") === 0) {
                    if (cString.length > 12) {
                        storage = JSON.parse(cString.replace("storage:", ""));
                        const modalKeys:string[] = Object.keys(storage.settings.modals),
                            indexes:[number, string][] = [],
                            z = function local_restore_z(id:string) {
                                count = count + 1;
                                indexes.push([storage.settings.modals[id].zIndex, id]);
                                if (count === modalKeys.length) {
                                    let cc:number = 0;
                                    data.zIndex = modalKeys.length;
                                    indexes.sort(function local_restore_z_sort(aa:[number, string], bb:[number, string]):number {
                                        if (aa[0] < bb[0]) {
                                            return -1;
                                        }
                                        return 1;
                                    });
                                    do {
                                        if (storage.settings.modals[indexes[cc][1]] !== undefined && document.getElementById(indexes[cc][1]) !== null) {
                                            storage.settings.modals[indexes[cc][1]].zIndex = cc + 1;
                                            document.getElementById(indexes[cc][1]).style.zIndex = `${cc + 1}`;
                                        }
                                        cc = cc + 1;
                                    } while (cc < modalKeys.length);
                                    loadComplete();
                                }
                            };
                        let count:number = 0;
                        if (storage.settings.name === undefined || storage.settings.name === "") {
                            document.getElementsByTagName("body")[0].setAttribute("class", "login");
                        } else {
                            data.name = storage.settings.name;
                            ui.util.addUser(storage.settings.name, "localhost");
                        }
                        if (modalKeys.length < 1) {
                            loadComplete();
                        }
                        modalKeys.forEach(function local_restore_modalKeys(value:string) {
                            if (storage.settings.modals[value].type === "fileNavigate" || storage.settings.modals[value].type === "fileShare") {
                                network.fs({
                                    agent: "self",
                                    depth: 2,
                                    callback: function local_restore_modalKeys_callback(files:HTMLElement, id:string) {
                                        const textValue:string = files.getAttribute("title");
                                        files.removeAttribute("title");
                                        storage.settings.modals[id].content = files;
                                        storage.settings.modals[id].id = id;
                                        storage.settings.modals[id].text_value = textValue;
                                        storage.settings.modals[id].text_event = ui.fs.text;
                                        ui.modal.create(storage.settings.modals[id]);
                                        z(id);
                                        if (storage.settings.modals[id].status === "maximized") {
                                            const button:HTMLButtonElement = <HTMLButtonElement>document.getElementById(id).getElementsByClassName("maximize")[0];
                                            data.modals[id].status = "normal";
                                            button.click();
                                        } else if (storage.settings.modals[id].status === "minimized") {
                                            const button:HTMLButtonElement = <HTMLButtonElement>document.getElementById(id).getElementsByClassName("minimize")[0];
                                            data.modals[id].status = "normal";
                                            button.click();
                                        }
                                    },
                                    id: value,
                                    location: storage.settings.modals[value].text_value
                                });
                            } else if (storage.settings.modals[value].type === "textPad" || storage.settings.modals[value].type === "export") {
                                const textArea:HTMLTextAreaElement = document.createElement("textarea");
                                if (storage.settings.modals[value].type === "textPad") {
                                    if (storage.settings.modals[value].text_value !== undefined) {
                                        textArea.value = storage.settings.modals[value].text_value;
                                    }
                                    textArea.onblur = ui.modal.textSave;
                                } else {
                                    textArea.value = JSON.stringify(storage.settings);
                                }
                                storage.settings.modals[value].content = textArea;
                                storage.settings.modals[value].id = value;
                                ui.modal.create(storage.settings.modals[value]);
                                z(value);
                            } else if (storage.settings.modals[value].type === "systems") {
                                storage.settings.modals[value].content = systems;
                                ui.modal.create(storage.settings.modals[value]);
                                const systemsModal:HTMLElement = document.getElementById("systems-modal");
                                let button:HTMLButtonElement;
                                if (storage.settings.modals[value].text_value === "status") {
                                    button = <HTMLButtonElement>systemsModal.getElementsByClassName("status")[0];
                                    button.click();
                                } else if (storage.settings.modals[value].text_value === "users") {
                                    button = <HTMLButtonElement>systemsModal.getElementsByClassName("users")[0];
                                    button.click();
                                } else if (storage.settings.modals[value].text_value === "errors") {
                                    button = <HTMLButtonElement>systemsModal.getElementsByClassName("errors")[0];
                                    button.click();
                                }
                                z(value);
                            }
                        });
                    } else {
                        loadComplete();
                    }
                }
                a = a + 1;
            } while (a < commentLength);
        }());
    }());
}());
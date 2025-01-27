
/* lib/browser/content/agent_management - Provide control of agent data: delete, invite, and edit. */

import browser from "../utilities/browser.js";
import common from "../../common/common.js";
import configuration from "./configuration.js";
import modal from "../utilities/modal.js";
import modal_configuration from "../utilities/modal_configurations.js";
import network from "../utilities/network.js";
import share from "./share.js";
import util from "../utilities/util.js";

// cspell:words agenttype

/**
 * Manages agent data in the browser.
 * ```typescript
 * interface module_agentManagement {
 *     content: {
 *         deleteAgents: () => HTMLElement;
 *         inviteRemote: (invitation:service_invite, name:string) => HTMLElement;
 *         inviteStart: () => HTMLElement;
 *         modifyAgents: () => HTMLElement;
 *         menu: (view:"delete"|"edit_names"|"invite") => HTMLElement;
 *     };
 *     events: {
 *         confirm: (event:MouseEvent) => void;
 *         confirmInvite: (event:MouseEvent, options:config_modal) => void;
 *         confirmModify: (event:MouseEvent) => void;
 *         deleteShare: (event:MouseEvent) => void;
 *         deleteToggle: (event:MouseEvent) => void;
 *         displayIP: (event:MouseEvent) => void;
 *         inviteDecline: (event:MouseEvent) => void;
 *         invitePortValidation: (event:Event) => void;
 *         inviteTypeToggle: (event:MouseEvent) => void;
 *         modeToggle: (event:MouseEvent) => void;
 *     };
 *     tools: {
 *         addAgent: (input:agentManagement_addAgent) => void;
 *         confirmDelete: (box:modal) => void;
 *         deleteAgent: (agent:string, agentType:agentType) => void;
 *         inviteAccept: (box:modal) => void;
 *         inviteComplete: (invitation:service_invite) => void;
 *         inviteReceive: (invitation:service_invite) => void;
 *         inviteTransmissionReceipt: (socketData:socketData) => void;
 *         modifyReceive: (socketData:socketData) => void;
 *     };
 * }
 * ``` */
const agent_management:module_agentManagement = {
    content: {
        /* Modal content for the agent delete list. */
        deleteAgents: function browser_content_agentManagement_deleteAgents():HTMLElement {
            const content:HTMLElement = document.createElement("div"),
                h3:HTMLElement = document.createElement("h3");
            let li:HTMLElement,
                input:HTMLInputElement,
                label:HTMLElement,
                p:HTMLElement,
                strong:HTMLElement,
                h4:HTMLElement,
                names:string[],
                length:number,
                total:number = 0,
                ul:HTMLElement = document.createElement("ul");
            content.setAttribute("class", "delete-agents");
            common.agents({
                countBy: "agent",
                perAgent: function browser_content_agentManagement_deleteAgents_perAgent(agentNames:agentNames):void {
                    if (agentNames.agentType !== "device" || (agentNames.agentType === "device" && agentNames.agent !== browser.data.hashDevice)) {
                        li = document.createElement("li");
                        li.setAttribute("class", "summary");
                        label = document.createElement("label");
                        input = document.createElement("input");
                        input.type = "checkbox";
                        input.value = agentNames.agent;
                        input.setAttribute("data-type", agentNames.agentType);
                        input.onclick = agent_management.events.deleteToggle;
                        label.appendChild(input);
                        label.appendText(browser[agentNames.agentType][agentNames.agent].name);
                        li.appendChild(label);
                        ul.appendChild(li);
                    }
                },
                perAgentType: function browser_content_agentManagement_deleteAgents_perAgentType(agentNames:agentNames):void {
                    h4 = document.createElement("h4");
                    h4.appendText(`${common.capitalize(agentNames.agentType)}s`);
                    names = Object.keys(browser[agentNames.agentType]);
                    length = names.length;
                    content.appendChild(h4);
                    total = total + length;
                    if ((agentNames.agentType === "device" && length < 2) || (agentNames.agentType !== "device" && length < 1)) {
                        p = document.createElement("p");
                        p.setAttribute("class", "summary");
                        p.appendText(`No ${agentNames.agentType}s to delete.`);
                        content.appendChild(p);
                    } else {
                        ul = document.createElement("ul");
                        content.appendChild(ul);
                    }
                },
                source: browser
            });
            if (total > 1) {
                p = document.createElement("p");
                strong = document.createElement("strong");
                strong.appendText("Please be warned that confirming these change is permanent.");
                p.appendChild(strong);
                p.appendText(" Confirming any selected changes will remove the relationship both locally and on the remote devices/users.");
                content.insertBefore(p, content.firstChild);
                h3.appendText("Delete Agents");
                content.insertBefore(h3, content.firstChild);
            }
            return content;
        },

        /* Modal content for invitation notification on remote agents. */
        inviteRemote: function browser_content_agentManagement_inviteRemote(invitation:service_invite, name:string):HTMLElement {
            const div:HTMLElement = document.createElement("div"),
                agentInvite:agentInvite = invitation.agentRequest,
                strong:HTMLElement = document.createElement("strong"),
                em:HTMLElement = document.createElement("em"),
                ip:string = (agentInvite.ipSelected.indexOf(":") < 0)
                    ? `${agentInvite.ipSelected}:${agentInvite.ports.http}`
                    : `[${agentInvite.ipSelected}]:${agentInvite.ports.http}`;
            let text:HTMLElement = document.createElement("h3"),
                label:HTMLElement = document.createElement("label"),
                textarea:HTMLTextAreaElement = document.createElement("textarea");

            div.setAttribute("class", "agentInvitation");
            div.setAttribute("data-agent", invitation.type);
            div.setAttribute("data-agenttype", (invitation.type === "device")
                ? agentInvite.hashDevice
                : agentInvite.hashUser);
            strong.appendText(name);
            text.appendText(`${common.capitalize(invitation.type)} `);
            text.appendChild(strong);
            text.appendText(` from ${ip} is inviting you to share.`);
            div.appendChild(text);
            text = document.createElement("p");
            label.appendText(`${name} said:`);
            textarea.value = invitation.message;
            label.appendChild(textarea);
            text.appendChild(label);
            div.appendChild(text);
            text = document.createElement("p");
            em.appendText("Confirm");
            text.appendText("Press the ");
            text.appendChild(em);
            text.appendText(" button to accept the invitation or close this modal to ignore it.");
            div.appendChild(text);
            div.setAttribute("data-invitation", JSON.stringify(invitation));
            return div;
        },

        /* Modal content for the invite agents fields. */
        inviteStart: function browser_content_agentManagement_inviteStart():HTMLElement {
            const inviteElement:HTMLElement = document.createElement("div"),
                separator:string = "|spaces|",
                blur = function browser_content_agentManagement_inviteStart_blur(focusEvent:FocusEvent):void {
                    const element:HTMLElement = focusEvent.target,
                        box:modal = element.getAncestor("box", "class"),
                        id:string = box.getAttribute("id"),
                        inputs:HTMLCollectionOf<HTMLInputElement> = box.getElementsByTagName("input"),
                        textArea:HTMLTextAreaElement = box.getElementsByTagName("textarea")[0];
                    agent_management.events.invitePortValidation(focusEvent);
                    browser.data.modals[id].text_value = inputs[0].value + separator + inputs[1].value + separator + textArea.value;
                    network.configuration();
                },
                textInput = function browser_content_agentManagement_inviteStart_textInput(labelText:string):void {
                    const label:HTMLElement = document.createElement("label"),
                        input:HTMLElement = (labelText === "Invitation Message")
                            ? document.createElement("textarea")
                            : document.createElement("input");
                    p = document.createElement("p");
                    label.appendText(labelText);
                    input.setAttribute("type", "text");
                    input.onblur = blur;
                    input.setAttribute("class", (labelText.indexOf("Message") > 0)
                        ? "message"
                        : labelText.slice(0, labelText.indexOf(" ")).toLowerCase());
                    label.appendChild(input);
                    p.appendChild(label);
                    section.appendChild(p);
                },
                ul:HTMLElement = document.createElement("ul"),
                name:string = `invite-type${Math.random()}`;
            let p:HTMLElement = document.createElement("p"),
                h3:HTMLElement = document.createElement("h3"),
                h4:HTMLElement = document.createElement("h4"),
                section:HTMLElement = document.createElement("div");

            h3.appendText("Invite An Agent");
            inviteElement.appendChild(h3);

            // Type
            h4.appendText("Connection Type");
            section.appendChild(h4);
            util.radioListItem({
                defaultValue: "User",
                handler: agent_management.events.inviteTypeToggle,
                list: ["User", "Device"],
                name: name,
                parent: ul
            });
            section.appendChild(ul);

            // type description text
            section.setAttribute("class", "section");
            p.setAttribute("class", "type-description");
            p.appendText("Including a user allows sharing with a different person and the devices they make available.");
            section.appendChild(p);
            inviteElement.appendChild(section);

            section = document.createElement("div");
            section.setAttribute("class", "section");
            h4 = document.createElement("h4");
            h4.appendText("Connection Details");
            section.appendChild(h4);

            // IP address
            textInput("IP Address");

            // Port
            textInput("Port (defaults to 443 if blank)");

            // Message
            textInput("Invitation Message");

            inviteElement.appendChild(section);
            inviteElement.setAttribute("class", "inviteAgent");
            return inviteElement;
        },

        /* The radio buttons at the top of the modal content. */
        menu: function browser_content_agentManagement_menu(view:"delete"|"edit_names"|"invite"):HTMLElement {
            const div:HTMLElement = document.createElement("div"),
                ul:HTMLElement = document.createElement("ul"),
                h3:HTMLElement = document.createElement("h3"),
                name:string = `agent-management-${Math.random()}`,
                bodyDelete:HTMLElement = agent_management.content.deleteAgents() as HTMLElement,
                bodyInvite:HTMLElement = agent_management.content.inviteStart() as HTMLElement,
                bodyModify:HTMLElement = agent_management.content.modifyAgents() as HTMLElement;

            util.radioListItem({
                defaultValue: view,
                handler: agent_management.events.modeToggle,
                list: ["Invite", "Edit Names", "Delete"],
                name: name,
                parent: ul
            });
            ul.setAttribute("class", "section");

            h3.appendText("Select An Action");
            div.appendChild(h3);
            div.appendChild(ul);
            if (view === "delete") {
                bodyInvite.style.display = "none";
                bodyModify.style.display = "none";
            } else if (view === "invite") {
                bodyDelete.style.display = "none";
                bodyModify.style.display = "none";
            } else if (view === "edit_names") {
                bodyInvite.style.display = "none";
                bodyModify.style.display = "none";
            }
            div.appendChild(bodyInvite);
            div.appendChild(bodyModify);
            div.appendChild(bodyDelete);
            div.setAttribute("class", "agent-management");
            return div;
        },

        /* Modal content for the modify agents area. */
        modifyAgents: function browser_content_agentManagement_modifyAgents():HTMLElement {
            const div:HTMLElement = document.createElement("div"),
                h3:HTMLElement = document.createElement("h3"),
                // ipSection = function browser_content_agentManagement_modifyAgents_ipSection():HTMLElement {
                //     const container:HTMLElement = document.createElement("div"),
                //         heading:HTMLElement = document.createElement("h4"),
                //         warning:HTMLElement = document.createElement("p"),
                //         strong:HTMLElement = document.createElement("strong"),
                //         list:HTMLElement = document.createElement("ul");

                //     heading.appendText("Display IP Address Information");
                //     util.radioListItem({
                //         defaultValue: "No",
                //         handler: agent_management.events.displayIP,
                //         list: ["No", "Yes"],
                //         name: `agent-ip-display-${Math.random()}`,
                //         parent: list
                //     });
                //     strong.appendText("Manually modifying IP address data may result in an unrecoverable disconnection.");
                //     warning.appendChild(strong);
                //     container.appendChild(heading);
                //     container.appendChild(warning);
                //     container.appendChild(list);
                //     container.setAttribute("class", "section");
                //     return container;
                // },
                section = function browser_content_agentManagement_modifyAgents_section(agentType:agentType):void {
                    const container:HTMLElement = document.createElement("div"),
                        heading:HTMLElement = document.createElement("h4"),
                        keys:string[] = Object.keys(browser[agentType]),
                        len:number = keys.length,
                        list:HTMLElement = (len < 1)
                            ? document.createElement("p")
                            : document.createElement("ul"),
                        item = function browser_content_agentManagement_modifyAgents_section_item(key:string):HTMLElement {
                            let p:HTMLElement = document.createElement("p"),
                                label:HTMLElement = document.createElement("label"),
                                input:HTMLInputElement = document.createElement("input");
                            const li = document.createElement("li");

                            // agent hash
                            p.appendText(key);
                            p.setAttribute("class", "modify-agent-hash");
                            li.append(p);

                            // agent name
                            p = document.createElement("p");
                            input.type = "text";
                            input.value = browser[agentType][key].name;
                            input.setAttribute("data-agent", key);
                            input.setAttribute("data-type", agentType);
                            label.appendText("Name");
                            label.appendChild(input);
                            p.appendChild(label);
                            li.appendChild(p);

                            // agent IPv6
                            // p = document.createElement("p");
                            // label = document.createElement("label");
                            // textArea.value = browser[agentType][key].ipAll.IPv6.join(",\n");
                            // label.appendText("IPv6 Addresses");
                            // label.appendChild(textArea);
                            // p.appendChild(label);
                            // p.style.display = "none";
                            // p.setAttribute("class", "agent-management-ip");
                            // li.appendChild(p);

                            // agent IPv4
                            // p = document.createElement("p");
                            // label = document.createElement("label");
                            // textArea = document.createElement("textarea");
                            // textArea.value = browser[agentType][key].ipAll.IPv4.join(",\n");
                            // label.appendText("IPv4 Addresses");
                            // label.appendChild(textArea);
                            // p.appendChild(label);
                            // p.style.display = "none";
                            // p.setAttribute("class", "agent-management-ip");
                            // li.appendChild(p);

                            return li;
                        };
                    heading.appendText(common.capitalize(agentType));
                    if (len < 1) {
                        list.appendText(`No agents of type ${agentType}.`);
                    } else {
                        let index:number = 0;
                        do {
                            list.appendChild(item(keys[index]));
                            index = index + 1;
                        } while (index < len);
                        list.setAttribute("class", "modify-agent-list");
                    }
                    container.appendChild(heading);
                    container.appendChild(list);
                    div.appendChild(container);
                };
            h3.appendText("Edit Agent Names");
            div.appendChild(h3);
            // div.appendChild(ipSection());
            section("device");
            section("user");
            div.setAttribute("class", "modify-agents");
            return div;
        }
    },
    events: {
        /* Handles the confirmation button for the agent management modal type. */
        confirm: function browser_content_agentManagement_confirm(event:MouseEvent):void {
            const target:HTMLElement = event.target,
                box = target.getAncestor("box", "class"),
                firstInput = box.getElementsByTagName("input")[0],
                type:string = (function browser_content_agentManagement_confirm_type():string {
                    const radios:NodeListOf<HTMLInputElement> = document.getElementsByName(firstInput.getAttribute("name")) as NodeListOf<HTMLInputElement>;
                    let len:number = radios.length;
                    do {
                        len = len - 1;
                        if (radios[len].checked === true) {
                            return radios[len].value;
                        }
                    } while (len > 0);
                    return null;
                }());
            if (type === "invite") {
                agent_management.events.confirmInvite(event, browser.data.modals[box.getAttribute("id")]);
            } else if (type === "edit_names") {
                agent_management.events.confirmModify(event);
            } else if (type === "delete") {
                agent_management.tools.confirmDelete(box);
            }
        },

        /* Send the invite request to the network */
        confirmInvite: function browser_content_agentManagement_confirmInvite(event:MouseEvent, options:config_modal):void {
            let type:agentType,
                ip:string,
                port:string,
                portNumber:number;
            const element:HTMLElement = event.target,
                box:modal = element.getAncestor("box", "class"),
                body:HTMLElement = box.getElementsByClassName("body")[0] as HTMLElement,
                content:HTMLElement = body.getElementsByClassName("inviteAgent")[0] as HTMLElement,
                input:HTMLElement = (function browser_content_agentManagement_confirmInvite_input():HTMLElement {
                    // value attainment and form validation
                    const inputs:HTMLCollectionOf<HTMLInputElement> = content.getElementsByTagName("input"),
                        length = inputs.length,
                        indexes:invite_indexes = {
                            type: -1,
                            ip: -1,
                            port: -1
                        };
                    let a:number = 0,
                        parentNode:HTMLElement;
                    do {
                        parentNode = inputs[a].parentNode;
                        if (inputs[a].value === "device" || inputs[a].value === "user") {
                            if (inputs[a].value === "device") {
                                indexes.type = a;
                            }
                            if (inputs[a].checked === true) {
                                type = inputs[a].value as agentType;
                            }
                        } else if (parentNode.innerHTML.indexOf("IP Address") === 0) {
                            indexes.ip = a;
                            ip = inputs[a].value;
                        } else if (parentNode.innerHTML.indexOf("Port") === 0) {
                            indexes.port = a;
                            port = inputs[a].value;
                        }
                        a = a + 1;
                    } while (a < length);
                    if (type === undefined) {
                        return inputs[indexes.type];
                    }
                    if (ip === undefined || ip.replace(/\s+/, "") === "" || ((/(\d{1,3}\.){3}\d{1,3}/).test(ip) === false && (/([a-f0-9]{4}:)+/).test(ip) === false)) {
                        return inputs[indexes.ip];
                    }
                    if (port === undefined || port.replace(/^\s+$/, "") === "") {
                        port = "";
                        portNumber = (location.href.indexOf("https") === 0)
                            ? 443
                            : 80;
                    } else {
                        portNumber = Number(port);
                        if (isNaN(portNumber) === true || portNumber < 0 || portNumber > 65535) {
                            return inputs[indexes.port];
                        }
                    }
                    return null;
                }()),
                ipSelected:string = ((/(\d{1,3}\.){3}\d{1,3}/).test(ip) === false && browser.network.addresses.IPv6.length > 0)
                    ? browser.network.addresses.IPv6[0]
                    : browser.network.addresses.IPv4[0],
                footer:HTMLElement = box.getElementsByClassName("footer")[0] as HTMLElement,
                saved:invite_saved = {
                    ip: ip,
                    message: content.getElementsByTagName("textarea")[0].value.replace(/"/g, "\\\""),
                    port: port,
                    type: type
                },
                userData:userData = common.userData(browser.device, type, browser.data.hashDevice),
                invitation:service_invite = {
                    action: "invite-start",
                    agentRequest: {
                        devices: (type === "device")
                            ? browser.device
                            : {},
                        hashDevice: (type === "device")
                            ? browser.data.hashDevice
                            : "",
                        hashUser: browser.data.hashUser,
                        ipAll: userData[1],
                        ipSelected: ipSelected,
                        modal: options.id,
                        nameDevice: (type === "device")
                            ? browser.data.nameDevice
                            : "",
                        nameUser: browser.data.nameUser,
                        ports: browser.network.ports,
                        shares: userData[0]
                    },
                    agentSource: {
                        devices: null,
                        hashDevice: "",
                        hashUser: "",
                        ipAll: null,
                        ipSelected: ip,
                        modal: "",
                        nameDevice: "",
                        nameUser: "",
                        ports: {
                            http: portNumber,
                            ws: 0
                        },
                        shares: null
                    },
                    message: saved.message,
                    status: "invited",
                    type: type
                };
            options.text_value = JSON.stringify(saved);
            network.configuration();
            if (input !== null) {
                const p:HTMLElement = input.parentNode.parentNode,
                    warning:HTMLElement = document.createElement("p"),
                    strong:HTMLElement = document.createElement("strong");
                p.setAttribute("class", "warning");
                input.focus();
                strong.appendText("Please select an invitation type.");
                warning.appendChild(strong);
                warning.setAttribute("class", "inviteWarning");
                p.parentNode.appendChild(warning);
                return;
            }
            content.style.display = "none";
            footer.style.display = "none";
            if (content.getElementsByClassName("error").length > 0) {
                content.removeChild(content.getElementsByClassName("error")[0]);
            }
            body.appendChild(util.delay());
            network.send(invitation, "invite");
        },

        /* Handle confirmation of changes to agent data. */
        confirmModify: function browser_content_agentManagement_confirmModify(event:MouseEvent):void {
            const target:HTMLElement = event.target,
                box:modal = target.getAncestor("box", "class"),
                boxes:HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("box") as HTMLCollectionOf<HTMLDivElement>,
                modify:HTMLElement = box.getElementsByClassName("modify-agents")[0] as HTMLElement,
                inputs:HTMLCollectionOf<HTMLInputElement> = modify.getElementsByTagName("input"),
                flags:flagList = {
                    device: false,
                    user: false
                },
                modifyService:service_agentManagement = {
                    action: "rename",
                    agents: {
                        device: {},
                        user: {}
                    },
                    agentFrom: browser.data.hashDevice,
                    deviceUser: null
                },
                modifyModals = function browser_content_agentManagement_confirmModify_modifyModals(agent:string, type:agentType, name:string):void {
                    const typeString:string = `${common.capitalize(type)}, `;
                    let boxLen:number = boxes.length,
                        button:HTMLElement = null,
                        text:string = "";
                    do {
                        boxLen = boxLen - 1;
                        if (boxes[boxLen].dataset.agent === agent && boxes[boxLen].dataset.agenttype === type) {
                            button = boxes[boxLen].getElementsByTagName("button")[0];
                            text = button.innerHTML;
                            text = text.slice(0, text.indexOf(typeString) + typeString.length) + name;
                            button.appendText(text);
                        }
                    } while (boxLen > 0);
                };
            let len:number = inputs.length,
                agent:string = "",
                name:string = "",
                type:agentType = null,
                value:string = "";
            do {
                len = len - 1;
                agent = inputs[len].dataset.agent;
                type = inputs[len].dataset.type as agentType;
                name = browser[type][agent].name;
                value = inputs[len].value;
                if (value !== name) {
                    flags[type] = true;
                    browser[type][agent].name = value;
                    document.getElementById(agent).lastChild.textContent = ` ${value}`;
                    modifyModals(agent, type, value);
                    modifyService.agents[type][agent] = browser[type][agent];
                }
            } while (len > 0);
            if (flags.user === true || flags.device === true) {
                network.send(modifyService, "agent-management");
                network.configuration();
            }
        },

        /* Removes a share from a device of the local user. */
        deleteShare: function browser_content_agentManagement_deleteShare(event:MouseEvent):void {
            const element:HTMLElement = event.target,
                parent:HTMLElement = element.parentNode,
                box:modal = parent.getAncestor("box", "class"),
                agent:string = (function browser_content_agentManagement_deleteShare_agency():string {
                    const boxAgent:agency = util.getAgent(box);
                    if (boxAgent[0] === null || boxAgent[0] === "") {
                        return element.getAncestor("ul", "tag").getAncestor("div", "tag").dataset.hash;
                    }
                    return boxAgent[0];
                }()),
                address:string = parent.getElementsByClassName("read-only-status")[0].previousSibling.textContent,
                shares:agentShares = (agent === null)
                    ? null
                    : browser.device[agent].shares,
                keys:string[] = (agent === null)
                    ? null
                    : Object.keys(shares),
                length:number = (agent === null)
                    ? 0
                    : keys.length,
                manage:service_agentManagement = {
                    action: "modify",
                    agentFrom: browser.data.hashDevice,
                    agents: {
                        device: {},
                        user: {}
                    },
                    deviceUser: null
                };
            let a:number = 0;
            if (length < 1) {
                return;
            }
            do {
                if (shares[keys[a]].name === address) {
                    delete shares[keys[a]];
                    break;
                }
                a = a + 1;
            } while (a < length);
            if (length === 1) {
                const p:HTMLElement = document.createElement("p"),
                    granny:HTMLElement = parent.parentNode,
                    em:HTMLElement = document.createElement("em");
                em.appendText(browser.device[agent].name);
                p.appendText("Device ");
                p.appendChild(em);
                p.appendText(" has no shares.");
                granny.parentNode.insertBefore(p, granny);
                granny.parentNode.removeChild(granny);
            } else {
                parent.parentNode.removeChild(parent);
            }
            share.tools.update(box.getAttribute("id"));
            manage.agents.device[agent] = browser.device[agent];
            network.send(manage, "agent-management");
        },

        /* Changes visual state of items in the agent delete list as they are checked or unchecked. */
        deleteToggle: function browser_content_agentManagement_deleteToggle(event:MouseEvent):void {
            const element:HTMLInputElement = event.target as HTMLInputElement,
                label:HTMLElement = element.parentNode;
            if (element.checked === true) {
                label.setAttribute("class", "checked");
            } else {
                label.removeAttribute("class");
            }
        },

        /* Shows and hides IP address information from the Modify view of agent management */
        displayIP: function browser_content_agentManagement_displayIP(event:MouseEvent):void {
            const target:HTMLInputElement = event.target as HTMLInputElement,
                body:HTMLElement = target.getAncestor("body", "class"),
                value:string = (target.value === "yes")
                    ? "block"
                    : "none",
                ipList:HTMLCollectionOf<HTMLElement> = body.getElementsByClassName("agent-management-ip") as HTMLCollectionOf<HTMLElement>;
            let len:number = ipList.length;
            if (len > 0) {
                do {
                    len = len - 1;
                    ipList[len].style.display = value;
                } while (len > 0);
            }
        },

        /* Handler for declining an invitation request */
        inviteDecline: function browser_content_invite_decline(event:MouseEvent):void {
            const element:HTMLElement = event.target,
                boxLocal:HTMLElement = element.getAncestor("box", "class"),
                inviteBody:HTMLElement = boxLocal.getElementsByClassName("agentInvitation")[0] as HTMLElement,
                invitation:service_invite = JSON.parse(inviteBody.dataset.invitation);
            invitation.status = "declined";
            network.send(invitation, "invite");
            modal.events.close(event);
        },

        /* Basic form validation on the port field */
        invitePortValidation: function browser_content_agentManagement_invitePortValidation(event:Event):void {
            const portElement:HTMLInputElement = event.target as HTMLInputElement,
                keyboardEvent:KeyboardEvent = event as KeyboardEvent,
                portParent:HTMLElement = portElement.parentNode,
                element:HTMLInputElement = (portParent.innerHTML.indexOf("Port") === 0)
                    ? portElement
                    : (function browser_content_agentManagement_invitePortValidation_findElement():HTMLInputElement {
                        const content:HTMLElement = portParent.getAncestor("inviteAgent", "class");
                        return content.getElementsByClassName("port")[0] as HTMLInputElement;
                    }()),
                value:string = element.value.replace(/\s+/g, ""),
                numb:number = Number(value);
            if (event.type === "blur" || (event.type === "keyup" && keyboardEvent.key === "Enter")) {
                if (value !== "" && (isNaN(numb) === true || numb < 1 || numb > 65535)) {
                    element.style.color = "#f00";
                    element.style.borderColor = "#f00";
                    element.parentNode.firstChild.textContent = "Error: Port must be a number from 1-65535 or empty.";
                    element.focus();
                } else {
                    element.parentNode.firstChild.textContent = "Port";
                    element.removeAttribute("style");
                }
            }
        },

        /* Switch text messaging in the invitation request modal when the user clicks on the type radio buttons */
        inviteTypeToggle: function browser_content_agentManagement_inviteTypeToggle(event:Event):void {
            const element:HTMLInputElement = event.target as HTMLInputElement,
                inviteAgent:HTMLElement = element.getAncestor("inviteAgent", "class"),
                warning:HTMLElement = inviteAgent.getElementsByClassName("inviteWarning")[0] as HTMLElement,
                description:HTMLElement = inviteAgent.getElementsByClassName("type-description")[0] as HTMLElement,
                strong:HTMLElement = document.createElement("strong");
            if (warning !== undefined) {
                warning.parentNode.removeChild(warning);
            }
            if (element.value === "device") {
                strong.appendText("Including a personal device will provide unrestricted access to and from that device.");
                description.appendText("", true);
                description.appendChild(strong);
                description.appendText(" This username will be imposed upon that device.");
            } else {
                description.appendText("Including a user allows sharing with a different person and the devices they make available.", true);
            }
            description.style.display = "block";
            configuration.tools.radio(element);
        },

        /* Changes the content between invite, delete, edit of agent data */
        modeToggle: function browser_content_agentManagement_modeToggle(event:MouseEvent):void {
            const target:HTMLInputElement = event.target as HTMLInputElement,
                box:modal = target.getAncestor("box", "class"),
                body:HTMLElement = box.getElementsByClassName("body")[0] as HTMLElement,
                bodyDelete:HTMLElement = body.getElementsByClassName("delete-agents")[0] as HTMLElement,
                bodyInvite:HTMLElement = body.getElementsByClassName("inviteAgent")[0] as HTMLElement,
                bodyModify:HTMLElement = body.getElementsByClassName("modify-agents")[0] as HTMLElement,
                footer:HTMLElement = box.getElementsByClassName("footer")[0] as HTMLElement;
            footer.style.display = "block";
            if (target.value === "delete") {
                bodyDelete.style.display = "block";
                bodyInvite.style.display = "none";
                bodyModify.style.display = "none";
            } else if (target.value === "invite") {
                bodyDelete.style.display = "none";
                bodyInvite.style.display = "block";
                bodyModify.style.display = "none";
            } else if (target.value === "edit_names") {
                bodyDelete.style.display = "none";
                bodyInvite.style.display = "none";
                bodyModify.style.display = "block";
            }
        }
    },
    tools: {
        /* Adds an agent into the browser user interface whether the agent is new or the page is loading. */
        addAgent: function browser_content_agentManagement_addAgent(input:agentManagement_addAgent):void {
            const li:HTMLLIElement = document.createElement("li"),
                button:HTMLElement = document.createElement("button"),
                addStyle = function browser_content_agentManagement_addUser_addStyle():void {
                    let body:string,
                        heading:string;
                    if (browser.data.colors[input.type][input.hash] === undefined) {
                        body = configuration.colorDefaults[browser.data.color][0];
                        heading = configuration.colorDefaults[browser.data.color][1];
                        browser.data.colors[input.type][input.hash] = [body, heading];
                        if (input.callback === undefined) {
                            network.configuration();
                        } else {
                            network.send({
                                settings: browser.data,
                                type: "configuration"
                            }, "settings");
                            input.callback();
                        }
                    } else {
                        body = browser.data.colors[input.type][input.hash][0];
                        heading = browser.data.colors[input.type][input.hash][1];
                    }
                    if (browser.loading === false) {
                        configuration.tools.styleText({
                            agent: input.hash,
                            colors: [body, heading],
                            replace: false,
                            type: input.type
                        });
                    }
                },
                status = function browser_content_agentManagement_addUser_status(status:activityStatus):HTMLElement {
                    let em:HTMLElement = document.createElement("em"),
                        span:HTMLElement = document.createElement("span");
                    em.setAttribute("class", `status-${status}`);
                    em.appendText("●");
                    span.appendText(` ${common.capitalize(status)}`);
                    em.appendChild(span);
                    return em;
                };
            button.appendChild(status("active"));
            button.appendChild(status("idle"));
            button.appendChild(status("offline"));
            button.appendText(` ${input.name}`);
            if (input.hash === browser.data.hashDevice) {
                button.setAttribute("class", "active");
            } else {
                button.setAttribute("class", browser[input.type][input.hash].status);
            }
            button.setAttribute("id", input.hash);
            button.setAttribute("data-agenttype", input.type);
            button.setAttribute("type", "button");
            button.onclick = modal_configuration.modals.shares;
            li.appendChild(button);
            document.getElementById(input.type).getElementsByTagName("ul")[0].appendChild(li);
            addStyle();
            configuration.tools.addUserColor(input.hash, input.type);
            if (browser.loading === false) {
                share.tools.update("");
            }
        },

        /* Processes agent termination from a delete-agents content of agent-management */
        confirmDelete: function browser_content_agentManagement_confirmDelete(box:modal):void {
            const body:HTMLElement = box.getElementsByClassName("body")[0] as HTMLElement,
                list:HTMLCollectionOf<Element> = body.getElementsByClassName("delete-agents")[0].getElementsByTagName("li"),
                manage:service_agentManagement = {
                    action: "delete",
                    agentFrom: browser.data.hashDevice,
                    agents: {
                        device: {},
                        user: {}
                    },
                    deviceUser: null
                };
            let a:number = list.length,
                count:number = 0,
                input:HTMLInputElement,
                type:agentType,
                subtitle:HTMLElement,
                hash:string,
                parent:HTMLElement;

            // put the deleted agents into a list
            do {
                a = a - 1;
                input = list[a].getElementsByTagName("input")[0];
                if (input.checked === true) {
                    hash = input.value;
                    type = input.dataset.type as agentType;
                    parent = document.getElementById(hash).parentNode;
                    if (list[a].parentNode.childNodes.length < 2) {
                        subtitle = document.createElement("p");
                        subtitle.appendText(`No ${type}s to delete.`);
                        subtitle.setAttribute("class", "summary");
                        list[a].parentNode.parentNode.insertBefore(subtitle, list[a].parentNode);
                        list[a].parentNode.parentNode.removeChild(list[a].parentNode);
                    } else {
                        list[a].parentNode.removeChild(list[a]);
                    }
                    manage.agents[type][hash] = browser[type][hash];
                    parent.parentNode.removeChild(parent);
                    agent_management.tools.deleteAgent(hash, type);
                    count = count + 1;
                }
            } while (a > 0);
            if (count < 1) {
                return;
            }
            network.send(manage, "agent-management");
            share.tools.update("");
            network.configuration();
        },

        /* Removes an agent from the browser interface */
        deleteAgent: function browser_content_agentManagement_deleteAgent(agent:string, agentType:agentType):void {
            const userColors:HTMLCollectionOf<HTMLElement> = document.getElementById("configuration-modal").getElementsByClassName(`${agentType}-color-list`)[0].getElementsByTagName("li"),
                shareModals:HTMLElement[] = document.getModalsByModalType("shares"),
                colorLength:number = userColors.length,
                button:HTMLElement = document.getElementById(agent),
                parent:HTMLElement = (button === null)
                    ? null
                    : button.parentNode;
            let a:number = 0,
                shareLength = shareModals.length,
                closeButton:HTMLButtonElement = null;
    
            // loop through the color swatches in the settings modal to remove the agent's colors
            if (colorLength > 0) {
                do {
                    if (userColors[a].dataset.agent === agent) {
                        userColors[a].parentNode.removeChild(userColors[a]);
                        configuration.tools.styleText({
                            agent: agent,
                            colors: ["", ""],
                            replace: true,
                            type: agentType
                        });
                        break;
                    }
                    a = a + 1;
                } while (a < colorLength);
            }
    
            // remove the agent from the data structures
            delete browser[agentType][agent];
            delete browser.data.colors[agentType][agent];
    
            // remove agent associated share modals
            if (shareLength > 0) {
                do {
                    shareLength = shareLength - 1;
                    if (shareModals[shareLength].dataset.agent === agent && shareModals[shareLength].dataset.agenttype === agentType) {
                        closeButton = shareModals[shareLength].getElementsByClassName("close")[0] as HTMLButtonElement;
                        closeButton.click();
                    }
                } while (shareLength > 0);
            }
    
            // remove the named button for the agent
            if (parent !== null && button.dataset.type === agentType) {
                parent.parentNode.removeChild(parent);
            }
        },

        /* Accept an invitation, handler on a modal's confirm button */
        inviteAccept: function browser_content_agentManagement_inviteAccept(box:modal):void {
            const div:HTMLElement = box.getElementsByClassName("agentInvitation")[0] as HTMLElement,
                invitation:service_invite = JSON.parse(div.dataset.invitation);
            invitation.action = "invite-response";
            invitation.message = `Invite accepted: ${common.dateFormat(new Date())}`;
            invitation.status = "accepted";
            if (invitation.type === "device") {
                browser.data.hashUser = invitation.agentRequest.hashUser;
                browser.data.nameUser = invitation.agentRequest.nameUser;
                network.configuration();
            }
            // this shares definition is what's written to settings when the remote agent accepts an invitation
            network.send(invitation, "invite");
        },

        /* Handles final status of an invitation response */
        inviteComplete: function browser_content_agentManagement_inviteComplete(invitation:service_invite):void {
            const modal:HTMLElement = document.getElementById(invitation.agentRequest.modal);
            if (modal !== null) {
                const error:HTMLElement = modal.getElementsByClassName("error")[0] as HTMLElement,
                    delay:HTMLElement = modal.getElementsByClassName("delay")[0] as HTMLElement,
                    footer:HTMLElement = modal.getElementsByClassName("footer")[0] as HTMLElement,
                    inviteAgent:HTMLElement = modal.getElementsByClassName("inviteAgent")[0] as HTMLElement,
                    prepOutput = function browser_content_agentManagement_inviteComplete_prepOutput(output:HTMLElement):void {
                        if (invitation.status === "accepted") {
                            output.appendText("Invitation accepted!", true);
                            output.setAttribute("class", "accepted");
                            util.audio("invite");
                        } else if (invitation.status === "declined") {
                            output.appendText("Invitation declined. :(", true);
                            output.setAttribute("class", "error");
                        } else if (invitation.status === "ignored") {
                            output.appendText("Invitation ignored.", true);
                            output.setAttribute("class", "error");
                        }
                    };
                footer.style.display = "none";
                if (delay !== undefined) {
                    delay.style.display = "none";
                }
                inviteAgent.style.display = "block";
                if (error === null || error === undefined) {
                    const p:HTMLElement = document.createElement("p");
                    prepOutput(p);
                    modal.getElementsByClassName("inviteAgent")[0].appendChild(p);
                } else {
                    prepOutput(error);
                }
            }
        },

        /* Receive an invitation from another user */
        inviteReceive: function browser_content_agentManagement_inviteReceive(invitation:service_invite):void {
            const agentInvite:agentInvite = invitation.agentRequest,
                name:string = (invitation.type === "device")
                    ? agentInvite.nameDevice
                    : agentInvite.nameUser,
                modals:HTMLElement[] = document.getModalsByModalType("invite-accept");
            let index:number = modals.length;
            if (index > 0) {
                do {
                    index = index - 1;
                    if (modals[index].getElementsByClassName("heading")[0].getElementsByTagName("button")[0].innerHTML.indexOf(`Invitation from ${name}`) > -1) {
                        // there should only be one invitation at a time from a given user otherwise there is spam
                        return;
                    }
                } while (index > 0);
            }
            invitation.agentSource.modal = modal_configuration.modals["invite-accept"](null, null, agent_management.content.inviteRemote(invitation, name)).getAttribute("id");
            util.audio("invite");
        },

        /* Routes invitation messaging from the network to the appropriate method. */
        inviteTransmissionReceipt: function browser_content_agentManagement_inviteTransmissionReceipt(socketData:socketData):void {
            const invitation:service_invite = socketData.data as service_invite;
            if (invitation.action === "invite-complete") {
                agent_management.tools.inviteComplete(invitation);
            } else {
                agent_management.tools.inviteReceive(invitation);
            }
        },

        /* Receives agent data from the terminal for processing in the browser. */
        modifyReceive: function browser_content_agentManagement_modifyReceive(socketData:socketData):void {
            const data:service_agentManagement = socketData.data as service_agentManagement;
            if (data.action === "add") {
                const addAgents = function browser_content_agentManagement_receive_addAgents(agentType:agentType):void {
                    const keys:string[] = Object.keys(data.agents[agentType]),
                        keyLength:number = keys.length;
                    if (keyLength > 0) {
                        let a:number = 0;
                        do {
                            if (browser[agentType][keys[a]] === undefined) {
                                browser[agentType][keys[a]] = data.agents[agentType][keys[a]];
                                agent_management.tools.addAgent({
                                    hash: keys[a],
                                    name: data.agents[agentType][keys[a]].name,
                                    type: agentType
                                });
                            }
                            a = a + 1;
                        } while (a < keyLength);
                    }
                };
                if (data.deviceUser !== null && data.deviceUser.length === 128) {
                    browser.data.hashUser = data.deviceUser;
                }
                addAgents("device");
                addAgents("user");
            } else if (data.action === "delete") {
                const deleteAgents = function browser_content_agentManagement_receive_deleteAgents(agentType:agentType):void {
                    const keys:string[] = Object.keys(data.agents[agentType]),
                        keyLength:number = keys.length,
                        property:"hashDevice"|"hashUser" = `hash${common.capitalize(agentType)}` as "hashDevice"|"hashUser";
                    if (keyLength > 0) {
                        let a:number = 0;
                        do {
                            if (keys[a] === browser.data[property]) {
                                agent_management.tools.deleteAgent(data.agentFrom, agentType);
                            } else {
                                agent_management.tools.deleteAgent(keys[a], agentType);
                            }
                            a = a + 1;
                        } while (a < keyLength);
                    }
                };
                deleteAgents("device");
                deleteAgents("user");
                network.configuration();
            } else if (data.action === "modify") {
                const shareContent = function browser_content_agentManagement_receive_shareContent(agentName:string, agentType:agentType|""):void {
                        const shareModals:HTMLElement[] = document.getModalsByModalType("shares");
                        let shareLength:number = shareModals.length,
                            body:HTMLElement = null;
                        if (shareLength > 0) {
                            do {
                                shareLength = shareLength - 1;
                                if ((shareModals[shareLength].dataset.agent === agentName && shareModals[shareLength].dataset.agenttype === agentType) || (agentType === "" && shareModals[shareLength].getElementsByTagName("button")[0].firstChild.textContent === "⌘ All Shares")) {
                                    body = shareModals[shareLength].getElementsByClassName("body")[0] as HTMLElement;
                                    body.appendText("", true);
                                    body.appendChild(share.content(agentName, agentType));
                                }
                            } while (shareLength > 0);
                        }
                    },
                    modifyAgents = function browser_content_agentManagement_receive_modifyAgents(agentType:agentType):void {
                        const keys:string[] = Object.keys(data.agents[agentType]),
                            keyLength:number = keys.length;
                        if (keyLength > 0) {
                            let a:number = 0;
                            do {
                                if (browser[agentType][keys[a]] !== undefined) {
                                    browser[agentType][keys[a]] = data.agents[agentType][keys[a]];
                                    shareContent(keys[a], agentType);
                                }
                                a = a + 1;
                            } while (a < keyLength);
                            shareContent("", agentType);
                        }
                    };
                modifyAgents("device");
                modifyAgents("user");
                shareContent("", "");
            }
        }
    }
};

export default agent_management;
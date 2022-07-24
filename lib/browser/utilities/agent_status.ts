
/* lib/browser/utilities/agent_status - Receive and process agent activity status notifications from the network. */

import browser from "./browser.js";
import network from "./network.js";
import webSocket from "./webSocket.js";

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
const agent_status:module_agentStatus = {
        active: function browser_utilities_agentStatus_active(event:KeyboardEvent|MouseEvent):void {
            const localDevice:Element = document.getElementById(browser.data.hashDevice),
                currentStatus:activityStatus = localDevice.getAttribute("class") as activityStatus,
                socket = function browser_utilities_agentStatus_active_socket():void {
                    if (agent_status.selfStatus.respond === true || currentStatus !== "active") {
                        localDevice.setAttribute("class", "active");
                        agent_status.selfStatus.status = "active";
                        network.send(agent_status.selfStatus, "agent-status");
                    }
                    agent_status.idleDelay = setTimeout(agent_status.idle, browser.data.statusTime);
                };
            if (event !== null) {
                event.stopPropagation();
            }
            clearTimeout(agent_status.idleDelay);
            if (browser.socket !== null) {
                socket();
            } else {
                webSocket.start(socket, browser.data.hashDevice);
            }
        },
        idle: function browser_utilities_agentStatus_idle():void {
            const localDevice:Element = document.getElementById(browser.data.hashDevice),
                currentStatus:activityStatus = localDevice.getAttribute("class") as activityStatus;
            if (currentStatus === "active") {
                localDevice.setAttribute("class", "idle");
                agent_status.selfStatus.status = "idle";
                network.send(agent_status.selfStatus, "agent-status");
            }
        },
        idleDelay: null,
        receive: function browser_utilities_agentStatus_receive(socketData:socketData):void {
            const data:service_agentStatus = socketData.data as service_agentStatus;

            // do not receive local agent status from a remote agent
            if (browser[data.agentType][data.agent] !== undefined && (data.agentType !== "device" || (data.agentType === "device" && data.agent !== browser.data.hashDevice))) {
                const agent:Element = document.getElementById(data.agent);
                agent.setAttribute("class", data.status);
            }
        },
        selfStatus: {
            agent: "",
            agentType: "device",
            broadcast: true,
            respond: true,
            status: "offline"
        },
        start: function browser_utilities_agentStatus_start():void {

            // watch for local idleness
            document.documentElement.onclick = agent_status.active;
            document.documentElement.onkeydown = agent_status.active;
            agent_status.selfStatus.agent = browser.data.hashDevice;

            agent_status.active(null);
            agent_status.selfStatus.respond = false;
        }
    };

export default agent_status;
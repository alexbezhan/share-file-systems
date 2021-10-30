
/* lib/terminal/server/services/browserLog - This handy utility writes log output to the terminal from the browser's console.log for more direct log visibility. */

import log from "../../utilities/log.js";
import serverVars from "../serverVars.js";

const browserLog = function terminal_server_services_browserLog(socketData:socketData, transmit:transmit):void {
    const logData:logData = socketData.data as logData,
        browserIndex:number = serverVars.testType.indexOf("browser");
    if (browserIndex < 0 || (browserIndex === 0 && logData[0] !== null && logData[0].toString().indexOf("Executing delay on test number") !== 0)) {
        log(logData);
    }
    transmit.socket.destroy();
};

export default browserLog;
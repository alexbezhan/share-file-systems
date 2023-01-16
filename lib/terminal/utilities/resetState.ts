/* lib/terminal/utilities/resetState - A convenience tool to baseline environmental settings */

import vars from "./vars.js";

const resetState = function terminal_utilities_resetState():void {
    const stateKeys:string[] = Object.keys(vars.environment.stateDefault),
        configKeys:string[] = Object.keys(vars.environment.stateDefault.configuration),
        mapValues = function terminal_utilities_resetState_mapValues(configuration:boolean):void {
            let index:number = (configuration === true)
                    ? configKeys.length
                    : stateKeys.length,
                key:string = null;
            // @ts-ignore - there is not a defined type for settings_items.configuration
            const source:settings_item = (configuration === true)
                ? vars.environment.stateDefault.configuration
                : vars.environment.stateDefault;

            do {
                index = index - 1;
                key = (configuration === true)
                    ? configKeys[index]
                    : stateKeys[index];
                if (key !== "configuration") {
                    // @ts-ignore - ignoring warnings about type ambiguity because types are mapped against values of typed objects
                    if (typeof source[key] === "object") {
                        // @ts-ignore - ignoring warnings about type ambiguity because types are mapped against values of typed objects
                        if (source[key].length === undefined) {
                            // @ts-ignore - ignoring warnings about type ambiguity because types are mapped against values of typed objects
                            if (source[key].device === undefined) {
                                // @ts-ignore - ignoring warnings about type ambiguity because types are mapped against values of typed objects
                                vars.settings[key] = {};
                            } else {
                                // @ts-ignore - ignoring warnings about type ambiguity because types are mapped against values of typed objects
                                vars.settings[key] = {
                                    device: {},
                                    user: {}
                                };
                            } 
                        } else {
                            // @ts-ignore - ignoring warnings about type ambiguity because types are mapped against values of typed objects
                            vars.settings[key] = [];
                        }
                    // @ts-ignore - ignoring warnings about type ambiguity because types are mapped against values of typed objects
                    } else if (typeof source[key] === "bigint") {
                        // @ts-ignore - ignoring warnings about type ambiguity because types are mapped against values of typed objects
                        vars.settings[key] = process.hrtime.bigint();
                    } else {
                        // @ts-ignore - ignoring warnings about type ambiguity because types are mapped against values of typed objects
                        vars.settings[key] = source[key];
                    }
                }
            } while (index > 0);
        };
    mapValues(false);
    mapValues(true);
};

export default resetState;
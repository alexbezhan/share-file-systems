
/* lib/terminal/commands/certificate - A command driven utility for creating an HTTPS certificate. */

import { readdir, stat } from "fs";
import { exec } from "child_process";

import error from "../utilities/error.js";
import log from "../utilities/log.js";
import mkdir from "../commands/mkdir.js";
import vars from "../utilities/vars.js";

// cspell:word addstore, CAcreateserial, certutil, delstore, extfile, genpkey

const certificate = function terminal_commands_certificate(config:config_command_certificate):void {
    let index:number = 0;
    const fromCommand:boolean = (vars.environment.command === "certificate"),
        commands:string[] = [],
        crypto = function terminal_commands_certificate_crypto():void {
            exec(commands[index], {
                cwd: config.location
            }, function terminal_commands_certificate_child(erChild:Error):void {
                if (erChild === null) {
                    index = index + 1;
                    if (index < commands.length) {
                        terminal_commands_certificate_crypto();
                    } else {
                       config.callback();
                    }
                } else {
                    error([erChild.toString()]);
                }
            });
        };

    if (fromCommand === true) {
        const indexes:number[] = [];
        let indexLength:number,
            index:number = process.argv.length,
            orgTest:boolean = false;

        config = {
            caDomain: "share-file-ca",
            callback: function terminal_commands_certificate_callback():void {
                vars.settings.verbose = true;
                log([`Certificates created at ${config.location}`], true);
            },
            caName: "share-file-ca",
            days: 16384,
            domain: "share-file",
            location: "",
            name: "share-file",
            organization: "share-file",
            selfSign: false
        };

        // apply configuration values from terminal arguments
        if (index > 0) {
            do {
                index = index - 1;
                if (process.argv[index] === "self-sign") {
                    indexes.push(index);
                    config.selfSign = true;
                } else if (process.argv[index].indexOf("domain:") === 0) {
                    indexes.push(index);
                    config.domain = process.argv[index].replace("domain:", "");
                    if ((config.domain.charAt(0) === "\"" || config.domain.charAt(0) === "\"") && config.domain.charAt(config.domain.length - 1) === config.domain.charAt(0)) {
                        config.domain = config.domain.slice(1, config.domain.length - 1);
                    }
                } else if (process.argv[index].indexOf("organization:") === 0) {
                    orgTest = true;
                    indexes.push(index);
                    config.organization = process.argv[index].replace("organization:", "");
                    if ((config.organization.charAt(0) === "\"" || config.organization.charAt(0) === "\"") && config.organization.charAt(config.organization.length - 1) === config.organization.charAt(0)) {
                        config.organization = config.organization.slice(1, config.organization.length - 1);
                    }
                } else if (process.argv[index].indexOf("ca-domain:") === 0) {
                    indexes.push(index);
                    config.caDomain = process.argv[index].replace("ca-domain:", "");
                    if ((config.caDomain.charAt(0) === "\"" || config.caDomain.charAt(0) === "\"") && config.caDomain.charAt(config.caDomain.length - 1) === config.caDomain.charAt(0)) {
                        config.caDomain = config.caDomain.slice(1, config.caDomain.length - 1);
                    }
                } else if (process.argv[index].indexOf("name:") === 0) {
                    indexes.push(index);
                    config.name = process.argv[index].replace("name:", "");
                    if ((config.name.charAt(0) === "\"" || config.name.charAt(0) === "\"") && config.name.charAt(config.name.length - 1) === config.name.charAt(0)) {
                        config.name = config.name.slice(1, config.name.length - 1);
                    }
                } else if (process.argv[index].indexOf("ca-name:") === 0) {
                    indexes.push(index);
                    config.caName = process.argv[index].replace("ca-name:", "");
                    if ((config.caName.charAt(0) === "\"" || config.caName.charAt(0) === "\"") && config.caName.charAt(config.caName.length - 1) === config.caName.charAt(0)) {
                        config.caName = config.caName.slice(1, config.caName.length - 1);
                    }
                } else if (process.argv[index].indexOf("days:") === 0) {
                    indexes.push(index);
                    if (isNaN(Number(process.argv[index].replace("days:", ""))) === false) {
                        config.days = Number(process.argv[index].replace("days:", ""));
                    }
                }
            } while (index > 0);
        }

        indexLength = indexes.length;
        if (indexLength > 0) {
            do {
                process.argv.splice(indexes[index], 1);
                index = index + 1;
            } while (index < indexLength);
        }

        if (process.argv.length > 0) {
            config.location = process.argv[0];
        } else {
            config.location = `${vars.path.project}lib${vars.path.sep}certificate`;
        }
        if (orgTest === false && config.selfSign === false) {
            config.organization = "share-file-ca";
        }
    } else if (config.location === "") {
        config.location = `${vars.path.project}lib${vars.path.sep}certificate`;
    }

    config.location = config.location.replace(/(\/|\\)$/, "");

    // convert relative path to absolute from shell current working directory
    if ((process.platform === "win32" && (/^\w:\\/).test(config.location) === false) || (process.platform !== "win32" && config.location.charAt(0) !== "/")) {
        config.location = process.cwd() + vars.path.sep + config.location.replace(/^(\\|\/)+/, "");
    }

    stat(config.location, function terminal_commands_certificate_createStat(stats:NodeJS.ErrnoException):void {

        // OpenSSL features used:
        // * file extensions
        //    - crt: certificate
        //    - csr: certificate signing request
        //    - key: private key associated with a certificate
        //    - srl: CA serial number associated with certificate signing
        // * genpkey, command to generate a private key - https://www.openssl.org/docs/man1.0.2/man1/openssl-genpkey.html
        //    - algorithm: public key algorithm to use
        //    - out      : filename of key output
        // * req, a certificate request command - https://www.openssl.org/docs/man1.0.2/man1/openssl-req.html
        //    - days : time to live in days (expiry)
        //    - key  : key filepath to read from
        //    - new  : generate a new certificate
        //    - nodes: not encrypt a created private key
        //    - out  : filename of certificate output
        //    - subj : data to populate into the certificate
        //    - x509 : generate a self-signed cert
        // * x509, command to display and sign certificates - https://www.openssl.org/docs/man1.0.2/man1/openssl-x509.html
        //    - CA            : specifies the CA certificate file to use for signing
        //    - CAcreateserial: creates a CA serial number file, necessary to avoid an OpenSSL error
        //    - CAkey         : specifies the CA private key file to use for signing
        //    - days          : time to live in days (expiry)
        //    - extensions    : specifies the form of extensions "x509_ext" contained in the extensions file
        //    - extfile       : file location of extension details
        //    - in            : specifies certificate request file path of certificate to sign
        //    - out           : file location to output the signed certificate
        //    - req           : use a certificate request as input opposed to an actual certificate
        const create = function terminal_commands_certificate_createStat_create():void {
            const mode:[string, string, string] = (config.selfSign === true)
                    ? ["selfSign", config.name, config.domain]
                    : ["ca", config.caName, config.caDomain],
                confPath:string = `"${vars.path.project}lib${vars.path.sep}certificate${vars.path.sep + mode[0]}.cnf" -extensions x509_ext`,
                key = function terminal_commands_certificate_createState_create_key(type:"caName"|"name"):string {
                    return `openssl genpkey -algorithm RSA -out ${config[type]}.key`;
                },
                cert:string = `openssl req -x509 -key ${mode[1]}.key -days ${config.days} -out ${mode[1]}.crt -subj "/CN=${mode[2]}/O=${config.organization}"`;
            if (fromCommand === true) {
                log.title("Certificate Create");
            }
            if (config.selfSign === true) {
                commands.push(key("name"));
                commands.push(`${cert} -config ${confPath}`);
            } else {
                // 1. generate a private key for root certificate
                commands.push(key("caName"));
                // 2. generate a root certificate
                commands.push(cert);
                // 3. generate a private key for local certificate
                commands.push(key("name"));
                // 4. generate a local certificate signing request
                commands.push(`openssl req -new -key ${config.name}.key -out ${config.name}.csr -subj "/CN=${config.domain}/O=${config.organization}"`);
                // 5. sign the local certificate with the root certificate
                commands.push(`openssl x509 -req -in ${config.name}.csr -days ${config.days} -out ${config.name}.crt -CA ${config.caName}.crt -CAkey ${config.caName}.key -CAcreateserial -extfile ${confPath}`);
            }
            crypto();
        };
        if (stats === null) {
            create();
        } else if (stats.code === "ENOENT") {
            mkdir(config.location, create);
        } else {
            error([stats.toString()]);
        }
    });
};

export default certificate;
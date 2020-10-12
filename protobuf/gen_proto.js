const pbjs = require("protobufjs/cli/pbjs");
const path = require('path');
const process = require('process');
const fs = require('fs');
const os = require('os');


const request_proto_folder = path.join(__dirname, 'AppProtocol/protobuf/request');
const response_proto_folder = path.join(__dirname, 'AppProtocol/protobuf/response');

function _getProtoPathJoin(ret, f) {
    const files = fs.readdirSync(f);
    if (!files) {
        return;
    }

    // let ret;
    for (let t of files) {
        const ext = path.extname(t);
        if ('.proto' != ext) continue;

        // if (ret) {
        //     ret += ' ' + path.join(f, t);
        // } else {
        //     ret = path.join(f, t);
        // }

        ret.push(path.join(f, t));
    }
}

function _getProtoCmdNames(f) {
    const files = fs.readdirSync(f);
    if (!files) {
        return [];
    }

    let ret = [];
    for (let t of files) {
        const ext = path.extname(t);
        if ('.proto' != ext) continue;

        ret.push(t.replace('.proto', ''));
    }

    return ret;
}

function _genRequest() {
    return new Promise((resolve, reject) => {
        const reqParams = [
            "--target", "static-module",
            "--no-decode",
            "--no-create",
            "--no-verify",
            "--no-convert",
            "--es6",
            "-o", path.join(__dirname, '../src/protobuf/request.js'),
        ];
        _getProtoPathJoin(reqParams, request_proto_folder);
        pbjs.main(
            reqParams,
            function(err) {
                resolve(err);
            }
        );
    });
}

function _genReponse() {
    return new Promise((resolve, reject) => {
        const resParams = [
            "--target", "static-module",
            "--no-encode",
            "--no-create",
            "--no-verify",
            "--no-convert",
            "--es6",
            "-o", path.join(__dirname, '../src/protobuf/response.js'),
        ];
        _getProtoPathJoin(resParams, response_proto_folder);
        pbjs.main(
            resParams,
            function(err) {
                resolve(err);
            }
        );
    });
}

function _readCmds() {
    const data = fs.readFileSync(path.join(__dirname, 'AppProtocol/outclient/NetworkServiceConfig.h'), 'utf-8');
    const a = data.split('\n');

    let ret = {};
    for (let l of a) {
        const PREV = 'static const int ';
        const i = l.indexOf(PREV);
        if (i < 0) continue;
        const j = l.indexOf(';', i);
        if (j < 0) continue;

        const s = l.substring(i + PREV.length, j);
        const aa = s.split(' = ');
        if (aa.length != 2) continue;

        const cmdName = aa[0];
        const k = cmdName.indexOf('_');
        if (k < 0) continue;
        const moduleName = cmdName.substring(0, k);
        const subCmdName = cmdName.substr(k + 1);

        if (!ret[moduleName]) {
            ret[moduleName] = {
                [subCmdName]: parseInt(aa[1])
            }
        } else {
            ret[moduleName][subCmdName] = parseInt(aa[1]);
        }
    }

    return ret;
}

function _isSocketCmd(m, c) {
    const cneter_ms = [
        'ServiceCmd',
    ];
    return cneter_ms.indexOf(m) < 0;
}

function _isNeedLoginCmd(m, c) {
    const no_nned_login_ms = [
        'UserCmd',
    ]

    return no_nned_login_ms.indexOf(m) < 0;
}

// function _isLoginCmd(m, c) {
//     if ('UserCmd' != m) return false;

//     return 'login' == c;// || 'logon' == c;
// }

function _genCmd() {

    const cmdNames = _getProtoCmdNames(request_proto_folder);
    const resultNames = _getProtoCmdNames(response_proto_folder);

    const cmds = _readCmds();

    let retServerCmd = '';
    let retResultMap = '';
    const mns = Object.keys(cmds).sort();
    for (let m of mns) {
        if (cmdNames.indexOf(m) >= 0) {
            const cs = Object.keys(cmds[m]).sort();
            for (let c of cs) {
                if (_isSocketCmd(m, c)) {
                    //socket命令
                    const bNeedLogin = _isNeedLoginCmd(m, c);
                    // const bLoginCmd = _isLoginCmd(m, c);
                    // retServerCmd += `export const ${m}_${c} = (params, timeout) => { return requestSocket(${m}.${c}.encode, ${cmds[m][c]}, params, ${bNeedLogin}, ${bLoginCmd}, timeout, '${m}.${c}'); }${os.EOL}`;
                    // retServerCmd += `export const ${m}_${c} = (params, timeout) => { return requestSocket(${m}.${c}.encode, ${cmds[m][c]}, params, ${bNeedLogin}, timeout); }${os.EOL}`;
                    retServerCmd += `export const ${m}_${c} = (params, timeout) => { return requestSocket(${m}.${c}.encode, ${cmds[m][c]}, params, ${bNeedLogin}, timeout, '${m}.${c}'); }${os.EOL}`;
                } else {
                    //中心服命令
                    retServerCmd += `export const ${m}_${c} = (params, timeout) => { return requestCenter(${m}.${c}.encode, ${cmds[m][c]}, params, timeout); }${os.EOL}`;
                }
            }
            continue;
        }

        if (resultNames.indexOf(m) >= 0) {
            const cs = Object.keys(cmds[m]).sort();
            for (let c of cs) {
                retResultMap += `${cmds[m][c]}: ${m}.${c}.decode,${os.EOL}`;
            }
        }
    }


    retServerCmd = `'use strict';${os.EOL}${os.EOL}`
        + `import {${cmdNames.join(', ')}} from '../protobuf/request';${os.EOL}`
        + `import SocketModel from './network/SocketModel';${os.EOL}`
        + `import ApiModel from './network/ApiModel';${os.EOL}${os.EOL}`
        + `const requestSocket = SocketModel.request;${os.EOL}`
        + `const requestCenter = ApiModel.requestCenter;${os.EOL}${os.EOL}`
        + `${retServerCmd}${os.EOL}${os.EOL}${os.EOL}${os.EOL}`
        + `SocketModel.setup(UserCmd_login, UserCmd_logon, UserCmd_heartBeat, UserCmd.login.encode, UserCmd.logon.encode);${os.EOL}${os.EOL}`
        // + `export const connectSocket = SocketModel.connect;${os.EOL}`
        // + `export const disconnectSocket = SocketModel.disconnect;${os.EOL}`
        + `export const checkLogonByLaunch = SocketModel.checkLogonByLaunch;${os.EOL}`
        + `export const checkLogon = SocketModel.checkLogon;${os.EOL}`
        + `export const requestLogin = SocketModel.requestLogin;${os.EOL}`
        + `export const tryRequestLoginByCache = () => { return requestSocket(null, 0, null, true, 0, 'localTryLogin') };${os.EOL}`
        + `export const logout = SocketModel.logout;${os.EOL}`;
    fs.writeFileSync(path.join(__dirname, '../src/model/ServerCmd.js'), retServerCmd, 'utf-8');

    retResultMap = `'use strict';${os.EOL}${os.EOL}`
        + `import {${resultNames.join(', ')}} from './response';${os.EOL}`
        + `export default {${os.EOL}${retResultMap}}`;
    fs.writeFileSync(path.join(__dirname, '../src/protobuf/ResultMap.js'), retResultMap, 'utf-8');
}


async function main() {

    // fs.mkdirSync(path.join(__dirname, '../src/protobuf'));

    let ret = await _genRequest();
    console.log(ret);

    ret = await _genReponse();
    console.log(ret);

    _genCmd();
}

main();

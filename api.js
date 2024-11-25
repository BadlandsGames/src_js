const luainjs = require('lua-in-js');

const luaEnv = luainjs.createEnv();

function execLua(param) {
    const luaScript = luaEnv.parse(param);
    console.log(luaScript.exec());
}

function execLuaFile(param) {
    const luaScript = luaEnv.parseFile(param);
    console.log(luaScript.exec());
}

function runLuaFunc(name, param) {
    execLua(name + '(' + param + ')');
}
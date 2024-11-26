const luainjs = require('lua-in-js');

const luaEnv = luainjs.createEnv();

function execLua(param) {
    const luaScript = luaEnv.parse(param);
    console.log(luaScript.exec());
}

function execLua_return(param) {
    const luaScript = luaEnv.parse(param);
    return luaScript.exec();
}

function execLuaFile(param) {
    const luaScript = luaEnv.parseFile(param);
    console.log(luaScript.exec());
}

function getEntIndex() {
    return parseInt(execLua_return("print(data.entindex)"));
}

function getEntPosX() {
    let new_entindex = getEntIndex().toString();
    return parseFloat(execLua_return("print(ents.GetByIndex(" + new_entindex + "):GetPos.x)"));
}

function getEntPosY() {
    let new_entindex = getEntIndex().toString();
    return parseFloat(execLua_return("print(ents.GetByIndex(" + new_entindex + "):GetPos.y)"));
}

function getEntPosZ() {
    let new_entindex = getEntIndex().toString();
    return parseFloat(execLua_return("print(ents.GetByIndex(" + new_entindex + "):GetPos.z)"));
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lua_hook(event_name_official, hook_name, func_equivalent) {
    const newlib = func_equivalent().name.toString() + getRandomIntInclusive(1000, 9999).toString();
    eval(`
    const ` + newlib + ` = new luainjs.Table({` + func_equivalent().name.toString() + `});
    luaEnv.loadLib('` + newlib + `', ` + newlib + `);
    `);
    execLua(`
    require("gameevent")
    gameevent.Listen("` + event_name_official + `")
    hook.Add("` + event_name_official + `", "` + hook_name + `", function(data)
        ` + newlib + '.' + func_equivalent().name + `()
    end
    `);
}

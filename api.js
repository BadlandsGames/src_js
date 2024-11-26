const luainjs = require('lua-in-js');

const luaEnv = luainjs.createEnv();

function execLua(param) {
    const luaScript = luaEnv.parse(param);
    console.log(luaScript.exec());
}

function setupNextbot(base, model, init_func) {
    const newlib = init_func().name.toString() + getRandomIntInclusive(1000, 9999).toString();
    eval(`
    const ` + newlib + ` = new luainjs.Table({` + init_func().name.toString() + `});
    luaEnv.loadLib('` + newlib + `', ` + newlib + `);
    `);
    execLua("AddCSLuaFile()");
    execLua(`ENT.Base = "` + base + `"`);
    execLua("ENT.Spawnable = true");
    execLua(`function ENT:Initialize()
        self:SetModel("` + model + `")
        `+ newlib + '.' + init_func().name + `
    end
    `);
    execLua(`function ENT:SetEnemy(ent)
        self.Enemy = ent
    end
    function ENT:GetEnemy()
        return self.Enemy
    end`);
    if(base === "base_nextbot") execLuaFile("have_enemy.lua");
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

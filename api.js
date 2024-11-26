const luainjs = require('lua-in-js');

const luaEnv = luainjs.createEnv();

function execLua(param) {
    const luaScript = luaEnv.parse(param);
    console.log(luaScript.exec());
}

function setup_lua_func(input_func, param) {
    const newlib = init_func().name.toString() + getRandomIntInclusive(1000, 9999).toString();
    eval(`
    const ` + newlib + ` = new luainjs.Table({` + init_func().name.toString() + `});
    luaEnv.loadLib('` + newlib + `', ` + newlib + `);
    `);
    return (newlib + '.' + input_func().name + '(' + param + ')');
}

function setupNextbot(name, __class__, category, base, model, init_func, have_enemy_func, find_enemy_func, chase_enemy_func, update_func) {
    execLua("AddCSLuaFile()");
    execLua(`ENT.Base = "` + base + `"`);
    execLua("ENT.Spawnable = true");
    execLua(`function ENT:Initialize()
        self:SetModel("` + model + `")
        ` + setup_lua_func(init_func) + `
    end
    `);
    execLua(`function ENT:SetEnemy(ent)
        self.Enemy = ent
    end
    function ENT:GetEnemy()
        return self.Enemy
    end`);
    execLua(`function ENT:HaveEnemy()
        ` + setup_lua_func(have_enemy_func) + `
    end
    `);
    execLua(`function ENT:FindEnemy()
        ` + setup_lua_func(find_enemy_func) + `
    end
    `);
    execLua(`function ENT:ChaseEnemy()
        ` + setup_lua_func(chase_enemy_func) + `
    end
    `);
    execLua(`function ENT:RunBehaviour()
        ` + setup_lua_func(update_func) + `
    end
    `);
    execLua(`list.Set("NPC", "` + __class__ + `", {
	    Name = "` + name + `",
	    Class = "` + __class__ + `",
	    Category = "` + category + `"
    })`);
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
    execLua(`
    require("gameevent")
    gameevent.Listen("` + event_name_official + `")
    hook.Add("` + event_name_official + `", "` + hook_name + `", function(data)
        ` + setup_lua_func(func_equivalent) + `
    end
    `);
}

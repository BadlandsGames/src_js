const luainjs = require('lua-in-js');

const luaEnv = luainjs.createEnv();

execLuaFile("utils.lua");

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

function setup_lua_func(input_func, param) {
    const newlib = init_func().name.toString() + getRandomIntInclusive(1000, 9999).toString();
    eval(`
    const ` + newlib + ` = new luainjs.Table({` + init_func().name.toString() + `});
    luaEnv.loadLib('` + newlib + `', ` + newlib + `);
    `);
    return (newlib + '.' + input_func().name + '(' + param + ')');
}

class api_vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

function raycast_entity_weapon(distance_input) {
    let new_entindex = getEntIndex().toString();
    // return parseFloat(execLua_return("print(ents.GetByIndex(" + new_entindex + "))"));
    return createRaycast(execLua_return(`print(ents.GetByIndex(` + new_entindex + `):GetActiveWeapon())`), distance_input);
}

function vec3_distance(vector_1, vector_2) {
    let x1 = vector_1.x;
    let y1 = vector_1.y;
    let z1 = vector_1.z;
    let x2 = vector_2.x;
    let y2 = vector_2.y;
    let z2 = vector_2.z;
    const a = x2 - x1;
    const b = y2 - y1;
    const c = z2 - z1;
    return Math.sqrt(a * a + b * b + c * c);
}

function get_player_position() {
    let player_pos_return = new api_vec3(
        parseFloat(execLua_return("print(Entity(1):GetPos().x)")),
        parseFloat(execLua_return("print(Entity(1):GetPos().y)")),
        parseFloat(execLua_return("print(Entity(1):GetPos().z)"))
    );
    return player_pos_return;
}

function createRaycast(entity_input, distance_input) {
    let param = entity_input.toString() + ',' + distance_input.toString();
    let array_cast = [
        parseFloat(get_lua_func_return(`utils_createRaycast_x`, param)),
        parseFloat(get_lua_func_return(`utils_createRaycast_y`, param)),
        parseFloat(get_lua_func_return(`utils_createRaycast_z`, param))
    ];
    let finished_vector = new api_vec3(array_cast[0], array_cast[1], array_cast[2]);
    return finished_vector;
}

function get_lua_func(func_name, func_param) {
    execLua(func_name + '(' + func_param + ')');
}

function get_lua_func_return(func_name, func_param) {
    execLua(func_name + '(' + func_param + ')');
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

function server_console(cmd_name, cmd_param_array) {
    execLua(`RunConsoleCommand("` + cmd_name + `", "` + cmd_param_array.toString().replaceAll(',', '","') + `")`);
}
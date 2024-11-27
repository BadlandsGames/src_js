function utils_createRaycast_x(entity_input, distance_input)
    local forwardAngle = entity_input:GetForward()
    local tr = util.TraceLine({
        start = entity_input:EyePos(),
	    endpos = entity_input:EyePos() + forwardAngle * distance_input,
	    filter = function( ent ) return (ent:GetClass() == "prop_physics") end
    })
    print(tr.HitPos.x)
end

function utils_createRaycast_y(entity_input, distance_input)
    local forwardAngle = entity_input:GetForward()
    local tr = util.TraceLine({
        start = entity_input:EyePos(),
	    endpos = entity_input:EyePos() + forwardAngle * distance_input,
	    filter = function( ent ) return (ent:GetClass() == "prop_physics") end
    })
    print(tr.HitPos.y)
end

function utils_createRaycast_z(entity_input, distance_input)
    local forwardAngle = entity_input:GetForward()
    local tr = util.TraceLine({
        start = entity_input:EyePos(),
	    endpos = entity_input:EyePos() + forwardAngle * distance_input,
	    filter = function( ent ) return (ent:GetClass() == "prop_physics") end
    })
    print(tr.HitPos.z)
end
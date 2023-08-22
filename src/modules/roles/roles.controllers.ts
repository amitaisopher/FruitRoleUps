import { FastifyReply, FastifyRequest } from "fastify";
import { createRoleBody } from "./roles.schemas";
import { createRole } from "./roles.services";

export async function createRoleHandler(req: FastifyRequest<{
    Body: createRoleBody
}>, reply: FastifyReply) {
    
    const user = req.user
    const applicationId = user.applicationId

    const {name, permissions} = req.body

    const role = await createRole({name, permissions, applicationId})

    return role
}
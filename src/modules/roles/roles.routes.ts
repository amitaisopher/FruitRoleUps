import { FastifyInstance } from "fastify";
import { createRoleHandler } from "./roles.controllers";
import { createRoleBody, createRoleJsonSchema } from "./roles.schemas";
import { PERMISSIONS } from "../../config/permissions";

export async function roleRoutes(app: FastifyInstance) {
    app.post<{Body: createRoleBody}>('/', {
        schema: createRoleJsonSchema,
        preHandler: [app.guard.scope([PERMISSIONS["roles: write"]])]
    }, createRoleHandler)
}
import { FastifyInstance } from "fastify";
import { assignRoleToUserHandler, createUserHandler, deleteUserByIdHandler, loginHandler } from "./users.controllers";
import { AssignRoleToUserBody, DeleteUserByIdBody, assignRolesToUserJsonSchema, createUserJsonSchema, deleteUserByUserIdJsonSchema, loginJsonSchema } from "./users.schemas";
import { PERMISSIONS } from "../../config/permissions";
import { deleteUserByUserId } from "./users.services";

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', {
        schema: createUserJsonSchema
    }, createUserHandler)
    app.post('/login', {
        schema: loginJsonSchema
    }, loginHandler)
    app.post<{ Body: AssignRoleToUserBody }>('/roles', {
        schema: assignRolesToUserJsonSchema,
        preHandler: [app.guard.scope(PERMISSIONS['users.roles.write'])]
    }, assignRoleToUserHandler)
    app.delete<{Body: DeleteUserByIdBody}>('/id', {
        schema: deleteUserByUserIdJsonSchema,
        preHandler: [app.guard.scope(PERMISSIONS['users.delete'])]
    }, deleteUserByIdHandler)
}
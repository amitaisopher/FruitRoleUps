import { FastifyReply, FastifyRequest } from "fastify";
import { AssignRoleToUserBody, CreateUserBody, DeleteUserByIdBody, LoginBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import { assignRoleToUser, createUser, deleteUserByUserId, getUserByEmail, getUsersByApplication } from "./users.services";
import jwt from "jsonwebtoken";
import { logger } from "../../utils/logger";

export async function createUserHandler(
    request: FastifyRequest<{
        Body: CreateUserBody
    }>,
    reply: FastifyReply
) {
    const { initialUser, ...data } = request.body
    const roleName = initialUser ? SYSTEM_ROLES.SUPER_ADMIN : SYSTEM_ROLES.APPLICATION_USER
    console.log(roleName)
    if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
        const appUsers = await getUsersByApplication(data.applicationId)

        if (appUsers.length > 0) {
            return reply.code(400).send({
                message: "Application already have super admin user",
                extensions: {
                    code: 'APPLICATION_ALREADY_SUPER_USER',
                    applicationId: data.applicationId
                }
            })
        }
    }
    const role = await getRoleByName({
        name: roleName,
        applicationId: data.applicationId
    })

    if (!role) {
        return reply.code(404).send({
            message: 'Role not found'
        })
    }

    try {
        const user = await createUser(data)

        // assign a role to the user
        await assignRoleToUser({
            userId: user.id,
            applicationId: data.applicationId,
            roleId: role.id
        })

        return user
    } catch (error) {
        logger.error(error)
    }
}

export async function loginHandler(req: FastifyRequest<{
    Body: LoginBody
}>, reply: FastifyReply) {
    const { applicationId, email, password } = req.body
    const user = await getUserByEmail({ email, applicationId })

    if (!user) {
        return reply.code(400).send({
            message: 'Invalid email or password'
        })
    }


    const token = jwt.sign({
        id: user.id,
        email,
        applicationId,
        scopes: user.permissions
    }, 'secret') // Change this secret or signing method or get fired.
    return { token }
}


export async function assignRoleToUserHandler(req: FastifyRequest<{
    Body: AssignRoleToUserBody
}>, reply: FastifyReply) {
    
    const applicationId = req.user.applicationId
    const { roleId, userId } = req.body
    try {
        const result = await assignRoleToUser({
            applicationId,
            roleId,
            userId
        })
        return result
    } catch (error) {
        logger.error(error, 'Error assigning role to user')
        reply.code(400).send({
            messagee: "could not assign role to user"
        })

    }
}

export async function deleteUserByIdHandler(req: FastifyRequest<{
    Body: DeleteUserByIdBody
}>, reply: FastifyReply) {
    const { userId, applicationId } = req.body
    try {
        const result = await deleteUserByUserId({ userId, applicationId })
        return result
    } catch (error) {
        return reply.code(500).send({
            message: error instanceof Error ? error.message : `failed to delete user with ID: ${userId}`
        })
    }
}
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { assignRoleToUser } from "./users.services";

// Create User
const createUserBodySchema = z.object({
    email: z.string().email(),
    name: z.string(),
    applicationId: z.string().uuid(),
    password: z.string().min(6),
    initialUser: z.boolean().optional()
})

export type CreateUserBody = z.infer<typeof createUserBodySchema>

export const createUserJsonSchema = {
    body: zodToJsonSchema(createUserBodySchema, 'createUserBodySchema')
}

// Login
const loginScheam = z.object({
    email: z.string().email(),
    password: z.string(),
    applicationId: z.string()
})

export type LoginBody = z.infer<typeof loginScheam>

export const loginJsonSchema = {
    body: zodToJsonSchema(loginScheam, 'loginSchema')
}

const assignRolesToUserBody = z.object({
    userId: z.string().uuid(),
    roleId: z.string().uuid(),
})

export type AssignRoleToUserBody = z.infer<typeof assignRolesToUserBody>

export const assignRolesToUserJsonSchema = {
    body: zodToJsonSchema(assignRolesToUserBody, 'assignRolesToUserBody')
}

const deleteUserByEmailBody = z.object({
    userId: z.string(),
    applicationId: z.string().uuid()
})

export type DeleteUserByIdBody = z.infer<typeof deleteUserByEmailBody>

export const deleteUserByUserIdJsonSchema = {
    body: zodToJsonSchema(deleteUserByEmailBody, 'deleteUserByEmailBody')
}
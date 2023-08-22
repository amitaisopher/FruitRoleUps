import fastify from "fastify";
import { logger } from "./logger";
import { applicationRoutes } from "../modules/applications/applications.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/roles.routes";
import guard from "fastify-guard";
import jwt from "jsonwebtoken";

declare module 'fastify' {
    interface FastifyRequest {
        user: User
    }
}

type User = {
    id: string
    scopes: Array<string>
    applicationId: string
}


export async function buildServer() {
    const app = fastify({
        logger
    })

    app.decorate('user', null)
    app.addHook('onRequest', async function (req, reply) {
        const authHeader = req.headers.authorization
        if (!authHeader) return

        try {
            const token = authHeader.replace("Bearer ", "")
            const decoded = jwt.verify(token, 'secret') as User // Replace this bad secret
            console.log(decoded)
            req.user = decoded
        } catch (error) {
            reply.code(401).send({
                message: error instanceof Error ? error.message : 'Unauthenticated request'
            })
        }
    })

    // register plugins
    app.register(guard, {
        requestProperty: "user",
        scopeProperty: "scopes",
        
    });
    // register routes
    app.register(applicationRoutes, {
        prefix: '/api/applications'
    })
    app.register(usersRoutes, {
        prefix: '/api/users'
    })
    app.register(roleRoutes, {
        prefix: '/api/roles'
    })

    return app
}

import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationBody } from "./applications.schemas";
import { createApplication, getApplications } from "./applications.services";
import { createRole } from "../roles/roles.services";
import { ALL_PERMISSIONS, SYSTEM_ROLES, USER_ROLE_PERMISSIONS } from "../../config/permissions";

export async function createApplicationHandler(
    req: FastifyRequest<{
        Body: CreateApplicationBody;
    }>,
    reply: FastifyReply
) {
    const { name } = req.body;
    
    const application = await createApplication({ name });
    
    const superAdminRole = await createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.SUPER_ADMIN,
        permissions: ALL_PERMISSIONS as unknown as Array<string>
    })

    const applicationUserRole = await createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.APPLICATION_USER,
        permissions: USER_ROLE_PERMISSIONS
    })

    return {
        application,
        superAdminRole,
        applicationUserRole
    };
}

export async function getApplicationsHandler() {
    return getApplications()
}

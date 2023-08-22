import { InferModel } from "drizzle-orm";
import { db } from "../../db";
import { applications } from "../../db/schema";

export async function createApplication(data: InferModel<typeof applications, 'insert'>) {
    const results = await db.insert(applications).values(data).returning()

    return results[0]
}

export async function getApplications() {
    // SELECT id, name, createdAt FROM applications;
    const results = await db.select({
        id: applications.id,
        name: applications.name,
        createdAt: applications.createdAt
    }).from(applications)

    return results
}
import { usersTable } from "../models/user.model.js";
import db from "../db/index.js";

export const insertUser = async (data = {}) => {

    const {name, email, phone, experince, sector, target_role} = data
    try {
        const [newUser] = await db.insert(usersTable).values({
            name,
            email,
            phone : Number(phone),
            experince,
            sector,
            target_role
        }).returning({
            id: usersTable.id
        });
        return newUser;
    } catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }
    
}
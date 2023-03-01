import model from "../database/models/index.js"
import crypto from "crypto"

export const logActivity = async (obj) => {
    try {
        const { createdBy, target, targetId, action, value } = obj
        const log = await model.logActivities.create({
            uuid: crypto.randomUUID(),
            createdBy,
            target,
            targetId,
            action,
            value
        })
        return log
    } catch (error) {
        console.log(error)
        return false
    }
}
const { Schema, model, SchemaTypes } = require("mongoose")

const sessionSchema = new Schema({
    user: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    refresh_token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    // para inactividad: se actualiza en cada rotación
    lastRotatedAt: { type: Date, default: Date.now }
})

// Indices TTL
// expira cuando llega a expiresAt
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
// expira por inactividad 14 días después de lastRotatedAt
sessionSchema.index({ lastRotatedAt: 1 }, { expireAfterSeconds: 14 * 24 * 60 * 60 })

module.exports = model("Session", sessionSchema)
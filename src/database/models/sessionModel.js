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
    expires_at: {
        type: Date,
        required: true
    },
    // para inactividad
    last_rotated_at: { type: Date, default: Date.now }
})

// Indices TTL
// expira cuando llega a expires_at
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 })
// expira por inactividad 14 días después de last_rotated_at
sessionSchema.index({ last_rotated_at: 1 }, { expireAfterSeconds: 14 * 24 * 60 * 60 })

const Session = model("Session", sessionSchema)

module.exports = Session
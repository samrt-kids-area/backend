const parentSchema = require("../validation/parentValidation")

module.exports = (req, res, nxt) => {
    req.body.email = req.body.email.trim()
    const { error } = parentSchema.validate(req.body)
    if (error) return res.status(400).json({ success: false, message: error.details[0].message.replace(/"/g, "") });
    nxt()
} 

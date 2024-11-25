const adminSchema = require("../validation/adminValidation");

module.exports = (req, res, next) => {
    req.body.email = req.body.email.trim()
    const { error } = adminSchema.validate(req.body)
    if (error) return res.status(400).json({ success: false, message: error.details[0].message.replace(/"/g, "") });
    next()
}
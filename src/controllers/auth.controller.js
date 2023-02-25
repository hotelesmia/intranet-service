
import Joi from "joi"
import AuthService from "../services/auth.service.js"

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

export const login = async (req, res) => {

    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(403).json({ error: error.details[0].message })
    const { email, password } = req.body
    let data = undefined
    const app = 'intranet'
    let token = await AuthService.login(app, email, password)
        .then(response => {
            if (response) {
                res.status(response.status)
                res.send(response.data)
            }
            else {
                res.status(500).json({ error: 'ERR_NETWORK' })
            }

        })
}   
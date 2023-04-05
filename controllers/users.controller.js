const User = require('../database/models/User');

module.exports = {
    profile : async (req, res) => {
        try {
            return res.status(200).json({
                ok : true,
                msg : 'prefil de usuario',
                user : req.user
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message || 'Ups, surgio un Error en Perfil!'
            })
        }
    },
    users : async (req, res) => {
        try {
            let users = await User.find();
            return res.status(200).json({
                ok : true,
                msg : 'Usuarios Creados',
                user : users
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message || 'Ups, surgio un Error en users!'
            })
        }
    }
}
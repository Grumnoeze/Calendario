
const Encriptar = require("bcrypt");

const Saltos = 10;

const EncriptarPassword = async (password) => {
    const hash = await Encriptar.genSalt(Saltos);
    return Encriptar.hash(password, hash);
}

module.exports = {EncriptarPassword};


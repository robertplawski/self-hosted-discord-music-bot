const { join } = require("node:path");

const createFileFromId = (id) => join(__dirname, `../assets/music/${id}.m4a`);
module.exports = { createFileFromId };

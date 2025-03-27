const { join } = require("node:path");
const fs = require("node:fs/promises")

const createFileFromId = (id) => join(__dirname, `../assets/music/${id}.m4a`);

const doesSongExist = async (id) => await fs.access(createFileFromId(id));

module.exports = { createFileFromId, doesSongExist };

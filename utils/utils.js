const fsP = require("node:fs/promises");
const {join} = require("node:path");

module.exports = {
  deleteAllFilesInDir: async function (dirPath) {
    try {
      const files = await fsP.readdir(dirPath);

      const deleteFilePromises = files.map((file) => fsP.unlink(join(dirPath, file)));

      await Promise.all(deleteFilePromises).then(() => {
        console.log("Successfully cleared directroy: ", dirPath);
      });
    } catch (err) {
      console.log(`Error while cleaning directory: ${dirPath}\n${err}`);
    }
  },
};

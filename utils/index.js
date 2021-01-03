const fs = require("fs");
const path = require("path");

exports.isDirectory = (dir) => fs.lstatSync(dir).isDirectory();

exports.nonEmptyDir = (dir) => {
  try {
    if (fs.readdirSync(dir).length > 0) return true;
    else return false;
  } catch (error) {
    console.error(`NonEmptyDir Error: ${new TypeError(error.message)}`)
    return false;
  }
}

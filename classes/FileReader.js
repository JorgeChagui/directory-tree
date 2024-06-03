const { once } = require("node:events");
const { createReadStream } = require("node:fs");
const { createInterface } = require("node:readline");

class FileReader {
  #lines = [];
  constructor(inputFileName) {
    this.inputFileName = inputFileName;
  }

  async readFile() {
    try {
      const rl = createInterface({
        input: createReadStream(this.inputFileName),
        crlfDelay: Infinity,
      });

      rl.on("line", (line) => {
        this.#lines.push(line);
      });

      await once(rl, "close");
    } catch (err) {
      console.error(err);
    }
  }

  get lines() {
    return this.#lines;
  }
}

module.exports = FileReader;

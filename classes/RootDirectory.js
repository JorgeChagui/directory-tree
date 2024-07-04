const Directory = require("./Directory");

class RootDirectory extends Directory {
  list() {
    if (!this.children.length) {
      return "";
    }

    let childrenList = "";
    for (const [index, child] of this.children.entries()) {
      let newline = index === this.children.length - 1 ? "" : "\n";
      childrenList += `${child.list()}${newline}`;
    }

    return childrenList;
  }
}

module.exports = RootDirectory;

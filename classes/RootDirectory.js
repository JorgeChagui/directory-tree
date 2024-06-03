const Directory = require("./Directory");

class RootDirectory extends Directory {
  list() {
    if (!this._children.length) {
      return "";
    }

    let childrenList = "";
    for (const [index, child] of this._children.entries()) {
      let newline = index === this._children.length - 1 ? "" : "\n";
      childrenList += `${child.list()}${newline}`;
    }

    return childrenList;
  }
}

module.exports = RootDirectory;

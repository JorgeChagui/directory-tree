class Directory {
  #children = [];
  #level;

  constructor(name, level) {
    this.name = name;
    this.level = level;
  }

  set level(level) {
    this.#level = level;
    for (const child of this.#children) {
      child.level = this.#level + 1;
    }
  }

  get level() {
    return this.#level;
  }

  get children() {
    return this.#children;
  }

  findChild(childPath) {
    if ([undefined, null].includes(childPath)) {
      throw new Error(`Path is not valid`);
    }
    const [childName, ...childrenNameRest] = childPath.split("/");
    let selectedChild = this.#children.find(
      (currentChild) => currentChild.name === childName
    );
    if (!selectedChild) {
      throw new Error(`${childName} does not exist`);
    }

    if (!childrenNameRest.length) {
      return {
        parent: this,
        child: selectedChild,
      };
    }

    return {
      ...selectedChild.findChild(childrenNameRest.join("/")),
    };
  }

  sortChildren() {
    this.#children = this.#children.sort((childOne, childTwo) =>
      childOne.name.localeCompare(childTwo.name)
    );
  }

  addChild(newChild) {
    const childFound = this.#children.find(
      (currentChild) => currentChild.name === newChild.name
    );

    // If the child doesn't exist just add it
    if (!childFound) {
      newChild.level = this.level + 1;
      this.#children.push(newChild);
      this.sortChildren();
      return;
    }

    // If the child does exist, merge children
    for (const innerChildren of newChild.children) {
      childFound.addChild(innerChildren);
    }
  }

  removeChild(childToRemove) {
    const childFoundIndex = this.#children.findIndex(
      (currentChild) => currentChild.name === childToRemove.name
    );
    this.#children.splice(childFoundIndex, 1);
  }

  createChild(childPath) {
    const [childName, ...children] = childPath.split("/");
    // Validate if the child exists
    let childFound = this.#children.find(
      (currentChild) => currentChild.name === childName
    );
    if (!childFound) {
      childFound = new Directory(childName, this.level + 1);
      this.#children.push(childFound);
      this.sortChildren();
    }

    if (children?.length) {
      childFound.createChild(children.join("/"));
    }
  }

  moveChild(childPathToMove, childPathTarget) {
    if ([undefined, null].includes(childPathToMove)) {
      throw `Source path is not valid`;
    }
    if ([undefined, null].includes(childPathTarget)) {
      throw `Target path is not valid`;
    }
    let targetChild, childToMove;
    try {
      targetChild = this.findChild(childPathTarget);
      childToMove = this.findChild(childPathToMove);
    } catch (error) {
      throw `Cannot move ${childPathToMove} - ${error.message}`;
    }
    targetChild.child.addChild(childToMove.child);
    childToMove.parent.removeChild(childToMove.child);
  }

  deleteChild(childPathToDelete) {
    let childToDelete;
    try {
      childToDelete = this.findChild(childPathToDelete);
    } catch (error) {
      throw `Cannot delete ${childPathToDelete} - ${error.message}`;
    }
    childToDelete.parent.removeChild(childToDelete.child);
  }

  list() {
    let currentDirectory = this.#listCurrentDirectory();
    if (!this.#children.length) {
      return currentDirectory;
    }

    let childrenList = this.#listChildren();

    return `${currentDirectory}\n${childrenList}`;
  }

  #listCurrentDirectory() {
    const tabs = "  ".repeat(this.level - 1);
    return `${tabs}${this.name}`;
  }

  #listChildren() {
    let childrenList = "";
    for (const [index, child] of this.#children.entries()) {
      let newline = index === this.#children.length - 1 ? "" : "\n";
      childrenList += `${child.list()}${newline}`;
    }
    return childrenList;
  }
}

module.exports = Directory;

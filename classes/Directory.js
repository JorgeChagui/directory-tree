class Directory {
  _children = [];
  _level;

  constructor(name, level) {
    this.name = name;
    this.level = level;
  }

  set level(level) {
    this._level = level;
    for (const child of this._children) {
      child.level = this._level + 1;
    }
  }

  get level() {
    return this._level;
  }

  findChild(childPath) {
    const [childName, ...childrenNameRest] = childPath.split("/");
    let selectedChild = this._children.find(
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
    this._children = this._children.sort((childOne, childTwo) =>
      childOne.name.localeCompare(childTwo.name)
    );
  }

  addChild(newChild) {
    const childFound = this._children.find(
      (currentChild) => currentChild.name === newChild.name
    );

    // If the child doesn't exist just add it
    if (!childFound) {
      newChild.level = this.level + 1;
      this._children.push(newChild);
      this.sortChildren();
      return;
    }

    // If the child does exist, merge children
    for (const innerChildren of newChild._children) {
      childFound.addChild(innerChildren);
    }
  }

  removeChild(childToRemove) {
    const childFoundIndex = this._children.findIndex(
      (currentChild) => currentChild.name === childToRemove.name
    );
    this._children.splice(childFoundIndex, 1);
  }

  createChild(childPath) {
    const [childName, ...children] = childPath.split("/");
    // Validate if the child exists
    let childFound = this._children.find(
      (currentChild) => currentChild.name === childName
    );
    if (!childFound) {
      childFound = new Directory(childName, this.level + 1);
      this._children.push(childFound);
      this.sortChildren();
    }

    if (children?.length) {
      childFound.createChild(children.join("/"));
    }
  }

  moveChild(childPathToMove, childPathTarget) {
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
    const tabs = "  ".repeat(this.level - 1);
    if (!this._children.length) {
      return `${tabs}${this.name}`;
    }

    let childrenList = "";
    for (const [index, child] of this._children.entries()) {
      let newline = index === this._children.length - 1 ? "" : "\n";
      childrenList += `${child.list()}${newline}`;
    }

    return `${tabs}${this.name}\n${childrenList}`;
  }
}

module.exports = Directory;

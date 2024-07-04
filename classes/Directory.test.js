const Directory = require("./Directory");

describe("Directory", () => {
  let dir;
  describe("findChild", () => {
    beforeEach(() => {
      dir = new Directory("", 1);
      dir.createChild("grains/cereal");
    });
    afterEach(() => (dir = undefined));

    test("defines findChild()", () => {
      expect(typeof dir.findChild).toBe("function");
    });

    test("findChild() throws error when the provided child path doesn't exist", () => {
      expect(() => {
        dir.findChild("fruits");
      }).toThrow("fruits does not exist");
    });

    test("findChild() throws error when the provided path is undefined", () => {
      expect(() => {
        dir.findChild();
      }).toThrow("Path is not valid");
    });

    test("findChild() finds the provided child", () => {
      const result = dir.findChild("grains/cereal");
      expect(result.parent.name).toEqual("grains");
      expect(result.parent.level).toEqual(2);
      expect(result.child.name).toEqual("cereal");
      expect(result.child.level).toEqual(3);
    });
  });

  describe("createChild", () => {
    beforeEach(() => {
      dir = new Directory("", 1);
    });
    afterEach(() => (dir = undefined));

    test("defines createChild()", () => {
      expect(typeof dir.createChild).toBe("function");
    });

    test("createChild() creates the provided children", () => {
      dir.createChild("grains/cereal");
      expect(dir.children[0].name).toEqual("grains");
      expect(dir.children[0].children[0].name).toEqual("cereal");
    });

    test("createChild() creates the provided children and reorder it", () => {
      dir.createChild("grains/cereal");
      dir.createChild("fruits/apple");
      expect(dir.children[0].name).toEqual("fruits");
      expect(dir.children[0].children[0].name).toEqual("apple");
      expect(dir.children[1].name).toEqual("grains");
      expect(dir.children[1].children[0].name).toEqual("cereal");
    });

    test("createChild() creates the provided children when the one of the child already exists", () => {
      dir.createChild("fruits/orange");
      dir.createChild("fruits/apple");
      expect(dir.children[0].name).toEqual("fruits");
      expect(dir.children[0].children[0].name).toEqual("apple");
      expect(dir.children[0].children[1].name).toEqual("orange");
    });
  });

  describe("moveChild", () => {
    beforeEach(() => {
      dir = new Directory("", 1);
      dir.createChild("grains/cereal");
      dir.createChild("fruits/apple");
      dir.createChild("foods");
      dir.createChild("other_fruit/apple/green_apple");
    });
    afterEach(() => (dir = undefined));

    test("defines moveChild()", () => {
      expect(typeof dir.moveChild).toBe("function");
    });

    test("moveChild() moves the provided child to the target folder", () => {
      dir.moveChild("grains", "foods");
      expect(dir.children[0].name).toEqual("foods");
      expect(dir.children[0].children[0].name).toEqual("grains");
      expect(dir.children[0].children[0].children[0].name).toEqual("cereal");
    });

    test("moveChild() fails when the provided children doesn't exist", () => {
      expect(() => {
        dir.moveChild("meat", "foods");
      }).toThrow("Cannot move meat - meat does not exist");
    });

    test("moveChild() fails when the provided source path is undefined", () => {
      expect(() => {
        dir.moveChild(undefined, "foods");
      }).toThrow("Source path is not valid");
    });

    test("moveChild() fails when the provided target path is undefined", () => {
      expect(() => {
        dir.moveChild("meat");
      }).toThrow("Target path is not valid");
    });

    test("moveChild() moves the provided child to the target folder and the provided child already exist in the target, so children are merged", () => {
      dir.moveChild("other_fruit/apple", "fruits");
      expect(dir.children[1].name).toEqual("fruits");
      expect(dir.children[1].children[0].name).toEqual("apple");
      expect(dir.children[1].children[0].children[0].name).toEqual(
        "green_apple"
      );
    });
  });

  describe("deleteChild", () => {
    beforeEach(() => {
      dir = new Directory("", 1);
      dir.createChild("grains/cereal");
      dir.createChild("fruits/apple");
      dir.createChild("foods");
      dir.createChild("other_fruit/apple/green_apple");
    });
    afterEach(() => (dir = undefined));

    test("defines deleteChild()", () => {
      expect(typeof dir.deleteChild).toBe("function");
    });

    test("deleteChild() deletes the provided directory", () => {
      dir.deleteChild("grains");
      const childrenNames = dir.children.map((child) => child.name);
      ["grains"].map((directoryName) =>
        expect(childrenNames).not.toContain(directoryName)
      );
    });

    test("deleteChild() fails when the provided children doesn't exist", () => {
      expect(() => {
        dir.deleteChild("meat", "foods");
      }).toThrow("Cannot delete meat - meat does not exist");
    });
  });

  describe("list", () => {
    beforeEach(() => {
      dir = new Directory("", 1);
      dir.createChild("grains/cereal");
      dir.createChild("fruits/apple");
      dir.createChild("foods");
      dir.createChild("other_fruit/apple/green_apple");
    });
    afterEach(() => (dir = undefined));

    test("defines list()", () => {
      expect(typeof dir.list).toBe("function");
    });

    test("list() lists the current directory structure", () => {
      const expectedList = `
  foods
  fruits
    apple
  grains
    cereal
  other_fruit
    apple
      green_apple`;
      expect(dir.list()).toEqual(expectedList);
    });
  });
});

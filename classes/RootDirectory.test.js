const RootDirectory = require("./RootDirectory");

describe("RootDirectory", () => {
  let dir;

  describe("list", () => {
    beforeEach(() => {
      dir = new RootDirectory("", 0);
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
      const expectedList = `foods
fruits
  apple
grains
  cereal
other_fruit
  apple
    green_apple`;
      expect(dir.list()).toEqual(expectedList);
    });

    test("list() lists empty directory structure", () => {
      childlessDir = new RootDirectory("", 0);
      expect(childlessDir.list()).toEqual("");
    });
  });
});

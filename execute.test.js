const fs = require("node:fs/promises");
const execute = require("./execute");

describe("directories", () => {
  let logSpy;
  beforeEach(() => {
    logSpy = jest.spyOn(global.console, "log");
  });
  afterEach(() => logSpy.mockClear());

  test("Call execute() function with a not existing fileName", async () => {
    try {
      await execute("inputWrongName.txt");
    } catch (error) {
      expect(error.message).toMatch(
        `ENOENT: no such file or directory, open 'inputWrongName.txt'`
      );
    }
  });

  describe("Test a custom file", () => {
    const testInputFileName = "testInputFile.txt";
    beforeEach(async () => {
      try {
        const content = `CREATE fruits
MOVE vegetables
MOVE vegetables foods
RAMDONCOMMAND grains`;
        await fs.writeFile(testInputFileName, content);
      } catch (err) {
        console.log(err);
      }
    });
    afterEach(async () => {
      try {
        await fs.rm(testInputFileName);
      } catch (err) {
        console.log(err);
      }
    });

    test("Call execute() function", async () => {
      await execute(testInputFileName);
      expect(console.log).toBeCalled();
      expect(logSpy.mock.calls[0][0]).toBe("CREATE fruits");
      expect(logSpy.mock.calls[1][0]).toBe(`MOVE vegetables`);
      expect(logSpy.mock.calls[2][0]).toBe(`Target path is not valid`);
      expect(logSpy.mock.calls[3][0]).toBe(`MOVE vegetables foods`);
      expect(logSpy.mock.calls[4][0]).toBe(
        `Cannot move vegetables - foods does not exist`
      );
      expect(logSpy.mock.calls[5][0]).toBe(`RAMDONCOMMAND grains`);
    });
  });

  test("Call execute() function", async () => {
    await execute("input.txt");
    expect(console.log).toBeCalled();
    expect(logSpy.mock.calls[0][0]).toBe("CREATE fruits");
    expect(logSpy.mock.calls[1][0]).toBe(`CREATE vegetables`);
    expect(logSpy.mock.calls[2][0]).toBe(`CREATE grains`);
    expect(logSpy.mock.calls[3][0]).toBe(`CREATE fruits/apples`);
    expect(logSpy.mock.calls[4][0]).toBe(`CREATE fruits/apples/fuji`);
    expect(logSpy.mock.calls[5][0]).toBe(`LIST`);
    expect(logSpy.mock.calls[6][0]).toBe(`fruits
  apples
    fuji
grains
vegetables`);
    expect(logSpy.mock.calls[7][0]).toBe(`CREATE grains/squash`);
    expect(logSpy.mock.calls[8][0]).toBe(`MOVE grains/squash vegetables`);
    expect(logSpy.mock.calls[9][0]).toBe(`CREATE foods`);
    expect(logSpy.mock.calls[10][0]).toBe(`MOVE grains foods`);
    expect(logSpy.mock.calls[11][0]).toBe(`MOVE fruits foods`);
    expect(logSpy.mock.calls[12][0]).toBe(`MOVE vegetables foods`);
    expect(logSpy.mock.calls[13][0]).toBe(`LIST`);
    expect(logSpy.mock.calls[14][0]).toBe(`foods
  fruits
    apples
      fuji
  grains
  vegetables
    squash`);
    expect(logSpy.mock.calls[15][0]).toBe(`DELETE fruits/apples`);
    expect(logSpy.mock.calls[16][0]).toBe(
      `Cannot delete fruits/apples - fruits does not exist`
    );
    expect(logSpy.mock.calls[17][0]).toBe(`DELETE foods/fruits/apples`);
    expect(logSpy.mock.calls[18][0]).toBe(`LIST`);
    expect(logSpy.mock.calls[19][0]).toBe(`foods
  fruits
  grains
  vegetables
    squash`);
  });
});

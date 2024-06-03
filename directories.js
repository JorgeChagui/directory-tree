const FileReader = require("./classes/FileReader");
const RootDirectory = require("./classes/RootDirectory");

(async () => {
  const rootDirectory = new RootDirectory("", 0);
  const fileReader = new FileReader("input.txt");
  await fileReader.readFile();
  const commands = fileReader.lines;
  // Now Execute every command
  for (const command of commands) {
    console.log(command);
    const [action, ...args] = command.split(" ");
    switch (action.toUpperCase()) {
      case "CREATE":
        rootDirectory.createChild(...args);
        break;
      case "MOVE":
        try {
          rootDirectory.moveChild(...args);
        } catch (error) {
          console.log(error);
        }
        break;
      case "DELETE":
        try {
          rootDirectory.deleteChild(...args);
        } catch (error) {
          console.log(error);
        }
        break;
      case "LIST":
        console.log(rootDirectory.list());
        break;

      default:
        break;
    }
  }
})();

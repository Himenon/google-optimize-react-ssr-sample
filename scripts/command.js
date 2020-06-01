const { spawn } = require("child_process");

const command = async (script, args) => {
  console.log(`${script} ${args.join(" ")}`);
  return new Promise((resolve, reject) => {
    const stream = spawn(script, args);
    stream.stdout.on("data", (data) => {
      console.log(data.toString().trim());
    });
    stream.stderr.on("data", (data) => {
      console.error(data.toString().trim());
    });
    stream.stdout.on("end", () => {
      resolve();
    });
  });
};

module.exports = command;

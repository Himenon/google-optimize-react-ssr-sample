const command = require("./command");
const pkg = require("../package.json");

const main = async () => {
  const name = `d-${pkg.name}`;
  await command("docker", `stop ${name}`.split(" "));
  await command("docker", `rm ${name}`.split(" "));
  await command("docker", `run --name ${name} -p 9000:3000 ${pkg.name}:${pkg.version}`.split(" "));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

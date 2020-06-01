const command = require("./command");
const pkg = require("../package.json");

const main = async () => {
  await command(`docker`, `build -t ${pkg.name}:${pkg.version} .`.split(" "));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const argv = require("yargs").argv;
const { execSync } = require("child_process");
// An env var APP_ENVIRONMENT is required for it to know it' env automatically
let buildEnvironment = argv.buildEnv || process.env.APP_ENVIRONMENT || "prod";
const apiUrl = argv.apiUrl;

// Print node js version
const nodeVersion = execSync("node -v");
console.log(chalk.green(`Node version: ${nodeVersion}`));
console.log(chalk.green(`Build Env: ${buildEnvironment}`));
console.log(chalk.green(`apiUrl: ${apiUrl || "N/A"}`));

// Copy the right environment config as config.json to dist folder
let srcEnvFilePath = path.resolve(
  `./src/environments/config.${buildEnvironment}.json`
);
const distEnvFilePath = path.resolve("./dist/assets/config/config.json");
const assetsEnvFilePath = path.resolve("./src/assets/config/config.json");
console.log(chalk.green(`srcEnvFilePath: ${srcEnvFilePath}`));
console.log(chalk.green(`distEnvFilePath: ${distEnvFilePath}`));
console.log(chalk.green(`assetsEnvFilePath: ${assetsEnvFilePath}`));
try {
  if (!fs.existsSync(srcEnvFilePath)) {
    console.log(
      chalk.bgYellow(
        chalk.red(
          `Can't find the specific config for this env switching to prod config!`
        )
      )
    );
    buildEnvironment = "prod";
    srcEnvFilePath = path.resolve(`./src/environments/config.prod.json`);
    console.log(
      chalk.bgYellow(
        chalk.red(`Environment variable Override: ${buildEnvironment}`)
      )
    );
    console.log(
      chalk.bgYellow(chalk.red(`srcEnvFilePath override: ${srcEnvFilePath}`))
    );
  }
  if (fs.existsSync(srcEnvFilePath)) {
    // Clean out destination config folder
    console.log(chalk.green(`Source file exists`));
    fs.removeSync(distEnvFilePath);
    fs.removeSync(assetsEnvFilePath);
  }
} catch (err) {
  console.error(chalk.red(err));
}

try {
  fs.copySync(srcEnvFilePath, distEnvFilePath);
  console.log(chalk.green(`dist file replaced`));
  console.log(chalk.yellow(`Result:`));
  // Write to config.json destination
  fs.readFile(distEnvFilePath, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(chalk.yellow(data));
    }
  });
  fs.copySync(srcEnvFilePath, assetsEnvFilePath);
} catch (err) {
  console.log(chalk.red("Failed!"));
  console.error(chalk.red(err));
}

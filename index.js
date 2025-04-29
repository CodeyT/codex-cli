#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer').default; // Required for inquirer@9+

// 🎨 Render ASCII banner
const banner = figlet.textSync('Codex Architect', {
  horizontalLayout: 'default',
  verticalLayout: 'default',
});

const centered = banner
  .split('\n')
  .map(line => line.padStart(Math.floor((process.stdout.columns + line.length) / 2)))
  .join('\n');

console.log(chalk.cyan(centered));

// 🔧 CLI arguments
const args = process.argv.slice(2);
const command = args[0];
const projectNameArg = args[1];

function showHelp() {
  console.log(chalk.cyan(`

Codex Architect CLI Commands:

  init                  Prompt for stack + project name
  init <name>           Create Node.js app (default)
  --help, -h            Show help
  --version, -v         Show version
  --author, -a          Show author information

`));
}

// 📦 Copy template files + inject project name
async function initProject(name, templatePath) {
  const projectPath = path.join(process.cwd(), name);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`❌ Folder "${name}" already exists.`));
    process.exit(1);
  }

  try {
    await fs.copy(templatePath, projectPath);

    // Replace placeholders
    const filesToReplace = ['README.md', '.gitignore', 'package.json', 'requirements.txt',
      path.join('src', 'main.js'), path.join('src', 'main.py'), path.join('src', 'index.html')
    ];

    for (const file of filesToReplace) {
      const filePath = path.join(projectPath, file);
      if (fs.existsSync(filePath)) {
        let content = await fs.readFile(filePath, 'utf8');
        content = content.replace(/{{projectName}}/g, name);
        await fs.writeFile(filePath, content);
      }
    }

    console.log(chalk.green(`✅ Project "${name}" created successfully.`));
  } catch (err) {
    console.error(chalk.red('❌ Error creating project:'), err.message);
    process.exit(1);
  }
}

// 📋 Stack + name prompt
async function promptForStackAndName() {
  const response = await inquirer.prompt([
    {
      type: 'list',
      name: 'stack',
      message: 'Select a tech stack:',
      choices: ['node', 'python', 'web'],
    },
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter your project name:',
      validate: input => input ? true : 'Project name cannot be empty.',
    }
  ]);
  return response;
}

// 🧠 Command handler
(async () => {
  if (command === 'init') {
    const { stack, projectName } = await promptForStackAndName();
    const templatePath = path.join(__dirname, 'templates', stack);
    await initProject(projectName, templatePath);
  } else if (command === '--version' || command === '-v') {
    console.log(chalk.blue('\nCodex Architect CLI version 1.0.0\n'));
  } else if (command === '--author' || command === '-a') {
    console.log(chalk.magenta('\nCreated by Codey Travers, 2025.\n'));
  } else {
    showHelp();
  }
})();

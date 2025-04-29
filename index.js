#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');

// 🎨 Centered "Codex Cli" banner
const banner = figlet.textSync('Codex Cli', {
  horizontalLayout: 'default',
  verticalLayout: 'default'
});

const centered = banner
  .split('\n')
  .map(line => line.padStart(Math.floor((process.stdout.columns + line.length) / 2)))
  .join('\n');

console.log(chalk.cyan(centered));

const command = process.argv[2];
const projectName = process.argv[3];

// 🏷️ Version Command
if (command === '--version' || command === '-v') {
  console.log(chalk.blue('Codex Mini CLI version 1.0.0'));
  process.exit(0);
}

// 📜 Help Command
if (command === '--help' || command === '-h') {
  console.log(chalk.yellow(`
Codex Mini CLI Commands:

  init <project-name>    Create a new project folder
  --help, -h             Show help
  --version, -v          Show version
  --author, -a           Show author information
`));
  process.exit(0);
}

// 👤 Author Command
if (command === '--author' || command === '-a') {
  console.log(chalk.magenta('Created by Codey Travers, 2025.'));
  process.exit(0);
}

// 🚀 Init Command
if (command === 'init' && projectName) {
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`❌ Folder "${projectName}" already exists.`));
    process.exit(1);
  }

  fs.mkdirSync(projectPath);
  fs.writeFileSync(
    path.join(projectPath, 'README.md'),
    `# ${projectName}\n\nProject initialized with Codex Mini CLI!`
  );

  console.log(chalk.green(`✅ Project "${projectName}" created successfully.`));
} else if (command !== 'init') {
  console.log(chalk.yellow('⚡ Usage: codex-mini init <project-name>'));
}


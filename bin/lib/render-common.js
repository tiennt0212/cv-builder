/**
 * render-common.js — shared helpers for render-cv / render-letter.
 *
 * Keeps the two CLI scripts thin: arg parsing, YAML/template loading,
 * Handlebars helper registration, output path computation, and a friendly
 * "node_modules missing" error message all live here.
 */

const fs = require('fs');
const path = require('path');

// Friendly message if dependencies aren't installed yet.
function requireDeps() {
  try {
    return {
      Handlebars: require('handlebars'),
      yaml: require('js-yaml'),
      mdHelper: require('./md-helper'),
    };
  } catch (err) {
    if (err && err.code === 'MODULE_NOT_FOUND') {
      console.error('Error: required Node modules not found.');
      console.error('Run: cd bin && npm install');
      process.exit(2);
    }
    throw err;
  }
}

/**
 * Parse argv. Expects a single positional argument (yaml path) and
 * an optional `--theme <name>` flag.
 */
function parseArgs(argv, { scriptName, defaultTheme, validThemes }) {
  const args = argv.slice(2);
  let yamlPath = null;
  let theme = defaultTheme;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--theme') {
      theme = args[++i];
    } else if (a === '-h' || a === '--help') {
      printUsage(scriptName, validThemes, defaultTheme);
      process.exit(0);
    } else if (!yamlPath && !a.startsWith('--')) {
      yamlPath = a;
    } else {
      console.error(`Unexpected argument: ${a}`);
      printUsage(scriptName, validThemes, defaultTheme);
      process.exit(1);
    }
  }

  if (!yamlPath) {
    console.error('Error: missing path to seed YAML.');
    printUsage(scriptName, validThemes, defaultTheme);
    process.exit(1);
  }
  if (!theme) {
    console.error('Error: missing --theme.');
    printUsage(scriptName, validThemes, defaultTheme);
    process.exit(1);
  }
  if (validThemes && !validThemes.includes(theme)) {
    console.error(
      `Error: unknown theme "${theme}". Available: ${validThemes.join(', ')}`
    );
    process.exit(1);
  }

  return { yamlPath: path.resolve(yamlPath), theme };
}

function printUsage(scriptName, validThemes, defaultTheme) {
  const themes = validThemes ? validThemes.join('|') : '<name>';
  console.error(`Usage: ./bin/${scriptName} <path-to-seed.yaml> --theme ${themes}`);
  if (defaultTheme) {
    console.error(`Default theme: ${defaultTheme}`);
  }
}

function loadYaml(filePath, yaml) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: seed file not found: ${filePath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return yaml.load(raw);
}

function loadTemplate(templatePath) {
  if (!fs.existsSync(templatePath)) {
    console.error(`Error: template not found: ${templatePath}`);
    process.exit(1);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

function registerHelpers(Handlebars, mdHelper) {
  Handlebars.registerHelper('md', mdHelper.md);

  // Convert hyphen-minus between dates to en-dash for safety, in case a seed
  // slipped a plain "-" through. Idempotent: en-dash stays en-dash.
  Handlebars.registerHelper('endash', function (value) {
    if (value == null) return '';
    return String(value).replace(/\s-\s/g, ' – ');
  });

  // Equality helper for {{#if (eq kind "education")}} style branching.
  Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });
}

/**
 * Compute relative path from outputFile's directory to targetFile.
 * Used to write a portable <link rel="stylesheet" href="..."> that works
 * whether the output dir is under jobs/ or anywhere else in the repo.
 */
function computeRelativePath(outputFile, targetFile) {
  const outDir = path.dirname(path.resolve(outputFile));
  const target = path.resolve(targetFile);
  return path.relative(outDir, target).split(path.sep).join('/');
}

function writeOutput(outputPath, html) {
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
}

module.exports = {
  requireDeps,
  parseArgs,
  loadYaml,
  loadTemplate,
  registerHelpers,
  computeRelativePath,
  writeOutput,
};

#!/usr/bin/env node
/**
 * build-cv.js — HTML CV → PDF via Puppeteer
 *
 * Called by the `html-to-pdf` shell script at project root.
 * Run `npm install` once in this directory before first use.
 *
 * Usage (via shell script):
 *   ./html-to-pdf <path-to-cv.html>
 *
 * Direct usage:
 *   node bin/build-cv.js <path-to-cv.html>
 *
 * Output: <name>.html.pdf alongside the input HTML file.
 */

const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

// ── Parse args ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: ./html-to-pdf <path-to-cv.html>')
  process.exit(1)
}

const htmlPath = path.resolve(args[0])
if (!fs.existsSync(htmlPath)) {
  console.error(`File not found: ${htmlPath}`)
  process.exit(1)
}

const pdfPath = htmlPath.replace(/\.html$/, '.html.pdf')

const PDF_CONFIG = {
  path:            pdfPath,
  format:          'A4',
  printBackground: true,
  // margins omitted — each theme's @page CSS rule controls them
}

console.log(`\n── html-to-pdf ───────────────────────────────`)
console.log(`  Input : ${htmlPath}`)
console.log(`  Output: ${pdfPath}`)
console.log(`  Format: ${PDF_CONFIG.format}`)

;(async () => {
  console.log('\n  Launching Puppeteer…')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page    = await browser.newPage()

  console.log(`  Loading file://${htmlPath}`)
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })

  console.log('  Rendering PDF…')
  await page.pdf(PDF_CONFIG)
  await browser.close()

  const sizeKb = (fs.statSync(pdfPath).size / 1024).toFixed(1)
  console.log(`\n✓ Done: ${pdfPath} (${sizeKb} KB)`)
  console.log(`──────────────────────────────────────────────\n`)
})()

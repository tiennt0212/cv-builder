/**
 * md-helper.js — Handlebars 'md' helper.
 *
 * Order of operations:
 *   1. Escape HTML entities (&, <, >) so that any user-provided angle brackets
 *      become &lt;/&gt; and cannot inject markup.
 *   2. Convert `**bold**` → <strong>bold</strong> on the already-escaped string.
 *
 * Returns a Handlebars.SafeString so the template can write `{{md field}}`
 * (double-stash) and the <strong> tags pass through verbatim — without the
 * caller needing to use triple-stash.
 */

const Handlebars = require('handlebars');

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function md(value) {
  if (value == null) return new Handlebars.SafeString('');
  const escaped = escapeHtml(value);
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  return new Handlebars.SafeString(withBold);
}

module.exports = { md, escapeHtml };

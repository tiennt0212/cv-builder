# Modern Theme — Cover Letter HTML Structure

Theme stylesheet path: `../../../../themes/modern/letter.css`
Requires Google Fonts CDN — link **before** stylesheet.

---

## Head

```html
<head>
  <meta charset="UTF-8">
  <title>Cover Letter — {contact.name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../../../themes/modern/letter.css">
</head>
```

---

## Full page wrapper

All content lives inside:
```html
<body>
<div class="page">
  <header class="letter-header">...</header>
  <!-- date, recipient, salutation, body, closing, footer -->
</div>
</body>
```

---

## Header

Stacked layout: name-block RIGHT-aligned (role above name), then full-width contact strip.
The `.letter-contact-strip` has `margin: 0 calc(-1 * var(--page-margin))` to bleed edge-to-edge.

```html
<header class="letter-header">
  <div class="letter-name-block">
    <div class="letter-role">{meta.target_role}</div>
    <div class="letter-name">{contact.name}</div>
  </div>
  <div class="letter-contact-strip">
    <span class="contact-item">
      <svg class="contact-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
      {contact.phone}
    </span>
    <span class="contact-item">
      <svg class="contact-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
      <a href="mailto:{contact.email}">{contact.email}</a>
    </span>
    <span class="contact-item">
      <svg class="contact-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      <a href="https://linkedin.com/in/{contact.linkedin}">{contact.linkedin}</a>
    </span>
    <!-- Omit github span entirely if contact.github is absent -->
    <span class="contact-item">
      <svg class="contact-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
      <a href="https://github.com/{contact.github}">{contact.github}</a>
    </span>
  </div>
</header>
```

---

## Date (omit entirely if `letter.date` absent)

```html
<div class="letter-date">{letter.date}</div>
```

---

## Recipient block (omit entirely if `letter.recipient` absent)

```html
<div class="letter-recipient">
  <!-- Omit letter-recipient-name if recipient.name is empty -->
  <p class="letter-recipient-name">{recipient.name}</p>
  <!-- Omit each detail line if the field is empty -->
  <p class="letter-recipient-detail">{recipient.title}</p>
  <p class="letter-recipient-detail">{recipient.company}</p>
</div>
```

---

## Salutation

```html
<div class="letter-salutation">{letter.salutation}</div>
```

---

## Letter body

Render `letter.opening`, then each `letter.proof_points[].paragraph`, then
`letter.closing` — each as its own `<p>` inside the article.

Do NOT render `proof_points[].title` or `proof_points[].jd_mapping` — internal
metadata only.

```html
<article class="letter-body">
  <p class="letter-paragraph">{letter.opening}</p>
  <p class="letter-paragraph">{letter.proof_points[0].paragraph}</p>
  <p class="letter-paragraph">{letter.proof_points[1].paragraph}</p>
  <!-- repeat for each proof point -->
  <p class="letter-paragraph">{letter.closing}</p>
</article>
```

---

## Closing

```html
<div class="letter-closing">
  <p class="letter-sign-off">{letter.sign_off}</p>
  <p class="letter-signature">{letter.signature}</p>
</div>
```

---

## Footer decoration

```html
<footer class="letter-footer">
  <span class="letter-footer-label">{contact.name}</span>
  <span class="letter-footer-label">{meta.company} — Cover Letter</span>
</footer>
```

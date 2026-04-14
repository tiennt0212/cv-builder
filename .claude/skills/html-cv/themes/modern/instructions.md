# Modern Theme — HTML Structure

Theme stylesheet path: `../../../../themes/modern/style.css`
Requires Google Fonts CDN — link **before** stylesheet.

---

## Head

```html
<head>
  <meta charset="UTF-8">
  <title>CV — {name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../../../themes/modern/style.css">
</head>
```

## Header

Stacked layout: name block RIGHT-aligned (role above name), then a full-width dark contact strip.
The `.cv-contact-strip` has `margin: 0 -20mm` to bleed edge-to-edge past page padding.

```html
<header class="cv-header">
  <div class="cv-name-block">
    <div class="cv-role">{meta.target_role}</div>
    <div class="cv-name">{name}</div>
  </div>
  <div class="cv-contact-strip">
    <span class="contact-item">
      <svg class="contact-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
      {phone}
    </span>
    <span class="contact-item">
      <svg class="contact-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
      <a href="mailto:{email}">{email}</a>
    </span>
    <span class="contact-item">
      <svg class="contact-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
      <a href="https://github.com/{github}">{github}</a>
    </span>
    <span class="contact-item">
      <svg class="contact-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      <a href="https://linkedin.com/in/{linkedin}">{linkedin}</a>
    </span>
  </div>
</header>
```

## Section wrapper

**No `<hr>` elements.** Each section uses a `<section class="cv-section">` wrapper.
The `.section-heading` renders an L-shaped corner bracket via CSS `::before` (absolute-positioned) — no extra markup needed.

```html
<section class="cv-section">
  <div class="section-heading">SECTION HEADING</div>
  <!-- section content -->
</section>
```

## Core Competencies (omit `<section>` entirely if `competencies` absent from seed)

```html
<section class="cv-section">
  <div class="section-heading">CORE COMPETENCIES</div>
  <div class="competencies">
    <span class="competency-tag">[phrase]</span>
    <span class="competency-tag">[phrase]</span>
  </div>
</section>
```

## Experience

Each `.job-entry` renders as a timeline item (left border + circle dot) via CSS.

All entries use a **single-row header**: company + title on the left, location (optional) + dates on the right. The CSS injects a `—` separator after `.job-company` automatically — no extra markup needed.

```html
<section class="cv-section">
  <div class="section-heading">EXPERIENCE</div>

  <div class="job-entry">
    <div class="job-header">
      <div class="job-meta-left">
        <span class="job-company">{company}</span>
        <span class="job-title">{role title}</span>
      </div>
      <div class="job-meta-right">
        <span class="job-location">{location}</span>  <!-- omit if no location -->
        <span class="job-dates">{dates}</span>
      </div>
    </div>
    <ul class="bullets"><li>Bullet.</li></ul>
  </div>
</section>
```

**Role progression at the same company** (e.g. intern → full-time): express as a single `.job-title` span with an arrow, and use the full employment span for dates.

```html
<span class="job-title">Frontend Developer Intern → Developer</span>
```

**Multi-project entry**: keep the same single-row `.job-header`, then add one or more `.project-header` blocks before each bullet group.

```html
<div class="job-entry">
  <div class="job-header">
    <div class="job-meta-left">
      <span class="job-company">{company}</span>
      <span class="job-title">{role title}</span>
    </div>
    <div class="job-meta-right">
      <span class="job-dates">{dates}</span>
    </div>
  </div>

  <div class="project-header">
    <span class="project-title">{project title}</span>
    <span class="project-dates">{project dates}</span>  <!-- omit if no project dates -->
  </div>
  <ul class="bullets"><li>Bullet.</li></ul>
</div>
```

## Skills — pill chips per category

Each skill item becomes a `.skill-pill` chip. Category label precedes its pill group.

```html
<section class="cv-section">
  <div class="section-heading">SKILLS</div>
  <div class="skills-section">
    <div class="skills-row">
      <span class="skills-category">{category}:</span>
      <div class="skill-pills">
        <span class="skill-pill">{item}</span>
        <span class="skill-pill">{item}</span>
      </div>
    </div>
  </div>
</section>
```

## Bottom sections

Wrap all bottom entries for a heading inside a single `<section class="cv-section">`.

**education:**
```html
<section class="cv-section">
  <div class="section-heading">{heading}</div>
  <div class="bottom-entry">
    <div class="bottom-row">
      <span class="bottom-degree">{degree}</span>
      <span class="bottom-right">{gpa}</span>  <!-- omit if no gpa -->
    </div>
    <div class="bottom-row">
      <span>{institution}</span>
      <span class="bottom-right">{dates}</span>
    </div>
  </div>
</section>
```

**certification:**
```html
<div class="bottom-entry">
  <div class="bottom-row">
    <span class="bottom-title">{title}</span>
    <span class="bottom-right">{date}</span>
  </div>
  <div class="bottom-row"><span>{issuer}</span></div>
</div>
```

**award / publication:**
```html
<div class="bottom-entry">
  <div class="bottom-row">
    <span class="bottom-title"><a href="{url}">{title}</a></span>  <!-- omit <a> if no url -->
    <span class="bottom-right">{date}</span>
  </div>
  <div class="bottom-row"><span>{issuer or venue}</span></div>
</div>
```

## Full page wrapper

All content lives inside:
```html
<body>
<div class="page">
  <header class="cv-header">...</header>
  <div class="cv-body">
    <!-- all <section class="cv-section"> blocks go here -->
  </div>
</div>
</body>
```

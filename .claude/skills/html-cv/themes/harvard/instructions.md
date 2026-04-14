# Harvard Theme — HTML Structure

Theme stylesheet path: `../../../../themes/harvard/style.css`
Font: EB Garamond via Google Fonts — 3 `<link>` tags placed **before** stylesheet

---

## Head

```html
<head>
  <meta charset="UTF-8">
  <title>CV — {name}</title>

  <!-- Font: EB Garamond (Google Fonts) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet">

  <!-- Theme -->
  <link rel="stylesheet" href="../../../../themes/harvard/style.css">
</head>
```

## Header

```html
<div class="cv-header">
  <div class="cv-name">{name}</div>
  <div class="cv-contact">
    <span>{location}</span>
    <span><a href="mailto:{email}">{email}</a></span>
    <span>{phone}</span>
    <span><a href="https://linkedin.com/in/{linkedin}">LinkedIn: {linkedin}</a></span>
    <span><a href="https://github.com/{github}">GitHub: {github}</a></span>  <!-- omit if no github -->
  </div>
</div>
```

## Section wrapper

Use `<hr class="section-rule">` + `<div class="section-heading">` before each section:

```html
<hr class="section-rule">
<div class="section-heading">SECTION HEADING</div>
```

## Core Competencies (omit section if `competencies` absent from seed)

```html
<hr class="section-rule">
<div class="section-heading">CORE COMPETENCIES</div>
<div class="competencies">
  <span class="competency-tag">[phrase]</span>
  <span class="competency-tag">[phrase]</span>
</div>
```

## Experience — no location

```html
<div class="job-entry">
  <div class="job-company">{company}</div>
  <div class="job-title-row">
    <span class="job-title">{role title}</span>
    <span class="job-dates">{company dates}</span>
  </div>
  <ul class="bullets"><li>Bullet.</li></ul>
</div>
```

## Experience — with location

```html
<div class="job-entry">
  <div class="job-header">
    <span class="job-company">{company}</span>
    <span class="job-location">{location}</span>
  </div>
  <div class="job-title-row">
    <span class="job-title">{role title}</span>
    <span class="job-dates">{company dates}</span>
  </div>
  <ul class="bullets"><li>Bullet.</li></ul>
</div>
```

## Experience — multi-project

```html
<div class="job-entry">
  <div class="job-company">{company}</div>
  <div class="job-title-row">
    <span class="job-title">{role title}</span>
    <span class="job-dates">{company dates}</span>
  </div>

  <div class="project-header">
    <span class="project-title">{project title}</span>
    <span class="project-dates">{project dates}</span>  <!-- omit span if no project dates -->
  </div>
  <ul class="bullets"><li>Bullet.</li></ul>
</div>
```

## Skills

```html
<div class="skills-row"><span class="skills-category">{category}:</span> {items joined by ", "}</div>
```

## Bottom sections

**education:**
```html
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
  <!-- header, sections ... -->
</div>
</body>
```

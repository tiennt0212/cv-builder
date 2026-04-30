---
name: latex-cv
description: >
  Generate a professional LaTeX CV/resume in the Harvard style format — clean, single-column,
  serif font, centered header, bold section titles with horizontal rules, and right-aligned dates.
  Use this skill whenever the user wants to: create a LaTeX CV or resume, convert their resume to LaTeX,
  replicate a Harvard-style resume in LaTeX, or produce a .tex file for a professional CV.
  Trigger even if the user says "make me a CV in LaTeX", "write my resume in LaTeX",
  "generate a .tex resume file", or uploads a resume image and asks for LaTeX output.
  Do NOT trigger for drafting CV content — use /draft-cv to produce the seed first.
---

# LaTeX CV Skill (Harvard Style)

## Overview

This skill produces a complete, compilable LaTeX `.tex` file that replicates the **Harvard resume format**:
- Centered name (large, bold) at top
- Contact info line below name
- Horizontal rules separating sections
- Bold, centered section headings
- Left-aligned company/institution names, right-aligned locations and dates
- Bullet points for achievements
- EB Garamond serif font — loaded from Overleaf's TeX Live (no font upload required)

---

## Document Structure

Preamble, font setup, and all `\newcommand` macro definitions are in `themes/harvard/template.tex` — start from that file. The sections below cover usage decisions and content patterns.

### Header Pattern

Centered block at the top of the document. Name on the first line (large, bold), contact info on the second line (small, bullet-separated). Include only the fields present in the seed — omit any field that is absent (e.g. no GitHub link if not provided).

```latex
\begin{center}
  {\LARGE\textbf{Full Name}}\\[4pt]
  {\small City, Country \textbullet\ email@domain.com \textbullet\ +1 234 567 890 \textbullet\ \href{https://linkedin.com/in/handle}{LinkedIn: handle} \textbullet\ \href{https://github.com/handle}{GitHub: handle}}
\end{center}
```

### Professional Summary

A short prose paragraph — no bullets, no subheadings. Take the `summary` field from the seed verbatim; do not rewrite or shorten it.

```latex
\ressection{PROFESSIONAL SUMMARY}

Summary text from seed.
```

### Core Competencies Pattern (render only if `competencies` field is present in seed)

Insert between Summary and Experience. Render all phrases on one line joined by `\textbullet\ `. If the phrases wrap to a second line, that is fine — do not force a single line.

```latex
\ressection{CORE COMPETENCIES}

\noindent API Architecture \textbullet\ LLM Integration \textbullet\ React Application Architecture \textbullet\ CI/CD Pipelines \textbullet\ Design System \textbullet\ Performance Optimisation
```

Omit the `\ressection{CORE COMPETENCIES}` block entirely if `competencies` is absent from the seed.

### Experience Entry Pattern

Two macros — use whichever matches whether `location` is present in the seed:

```latex
% With location — when location adds signal (foreign company, remote, multi-office)
% Renders as two lines: Company + Location / Title + Dates
\jobentry{Company Name}{City, Country}{Job Title}{Month Year---Month Year}

% Without location (default) — all on ONE line: Company (bold) --- Title (normal weight), Dates
% \par at end is critical — without it the next content continues inline on the same line
\jobentrynoloc{Company Name}{Job Title}{Month Year---Month Year}
```

Example with bullets:
```latex
\jobentrynoloc{TNT Lab}{Frontend Developer}{Jan 2023---Present}
\begin{itemize}
  \item Achievement bullet.
\end{itemize}
\vspace{6pt}
```

### Sub-project Pattern

Use when a single company has multiple named projects. Render in seed order — `draft-cv` has already ordered them by JD relevance.

```latex
% With dates: \subproject{Name}{Dates}
% Without dates: \subprojectnodates{Name}
% Both macros must end with \par — without it the next \begin{itemize} continues inline
% No trailing \vspace — topsep=3pt on the itemize provides the gap to bullets
```

Example:
```latex
\jobentrynoloc{TNT Lab}{Frontend Developer}{Apr 2025---Dec 2025}
\subproject{Project Alpha}{Aug 2025---Dec 2025}
\begin{itemize}
  \item Bullet for Project Alpha.
\end{itemize}
\subprojectnodates{Project Beta}
\begin{itemize}
  \item Bullet for Project Beta.
\end{itemize}
\vspace{6pt}
```

### Skills Section Pattern

```latex
\noindent\textbf{Category:} Skill 1, Skill 2, Skill 3 \\[2pt]
\textbf{Another Category:} Skill A, Skill B \\[2pt]
```

### Education & Certifications Pattern

Merge into one section to save space. Education entry first, then certifications:

```latex
\ressection{EDUCATION \& CERTIFICATIONS}

\noindent\textbf{Degree Name} \hfill \textcolor[gray]{0.4}{GPA: X.XX/10} \\[-2pt]
Institution Name \hfill \textcolor[gray]{0.4}{Sep YYYY---Mon YYYY} \\[6pt]
\href{https://...}{\textbf{Certification Title} --- Issuer} \hfill \textcolor[gray]{0.4}{Mon YYYY} \\[2pt]
\textbf{Another Certification} --- Issuer \hfill \textcolor[gray]{0.4}{Mon YYYY}
```

### Achievement Entry Pattern (Awards & Publications)

Merge into one section. When a URL is available, **wrap the entire display text** (title + org/venue) in `\href{}{}` — never show raw URLs on a second line (wastes space, looks inconsistent).

```latex
\ressection{AWARDS \& PUBLICATIONS}

% \href wraps ALL text before \hfill — \textbf applies to title only, org/venue is normal weight
\noindent\href{https://example.com}{\textbf{Award Title} --- Org Name} \hfill \textcolor[gray]{0.4}{Mon YYYY} \\[3pt]
\href{https://example.com}{\textbf{Publication Title} --- Venue} \hfill \textcolor[gray]{0.4}{Mon YYYY}
```

If no URL exists, omit the `\href{}{}` wrapper:
```latex
\noindent\textbf{Award Title} --- Org Name \hfill \textcolor[gray]{0.4}{Mon YYYY}
```

If the entry has an optional `description` field, render it as a secondary gray line immediately below — indented slightly, small font, no date column:

```latex
\noindent\href{https://example.com}{\textbf{Award Title} --- Org Name} \hfill \textcolor[gray]{0.4}{Mon YYYY} \\[-1pt]
\noindent\hspace{1em}\textcolor[gray]{0.5}{\small One-line context from description field.} \\[3pt]
```

Omit the description line entirely when `description` is absent from the seed entry.

---

## Full Template

See `.claude/skills/latex-cv/themes/harvard/template.tex` for the complete starter template. Copy it as the basis for each generated CV.

---

## Instructions for Use

0. **Read** `.claude/skills/draft-cv/schema.yaml` for the full field specification.
   Read the `draft-cv.yaml` seed file at the path provided as argument — all content
   (name, contact, jobs, education, skills, summary) comes from this file.
1. **Read** `.claude/skills/latex-cv/themes/harvard/template.tex` as the starting point.
2. **Fill in** all content — name, contact, jobs, education, skills, summary.
3. **Save** the output `.tex` file into a `latex-cv/` subfolder inside the seed's parent folder:
   `[parent folder of seed]/latex-cv/cv.tex`

   Example: if seed is `jobs/tnt_lab-frontend_react/2026-04-02_13-16/draft-cv.yaml`,
   save to `jobs/tnt_lab-frontend_react/2026-04-02_13-16/latex-cv/cv.tex`.
4. **Inform the user** to compile via Overleaf:
   - Go to [overleaf.com](https://overleaf.com) and create a new blank project (or open any existing one)
   - Replace the contents of `main.tex` with the generated `cv.tex`
   - Ensure the compiler is set to **XeLaTeX** (Menu → Compiler)
   - Click Recompile — download the resulting PDF

---

## Common Mistakes to Avoid

- Always use `\pagestyle{empty}` to suppress page numbers
- Use `\hfill` for right-aligning dates/locations on the same line
- Use `---` (em dash) for date ranges: `August 2015---Present`
- Escape special chars: `\$`, `\&`, `\%`
- Use `\section*` (starred) to suppress numbering if using titlesec; prefer `\ressection{}` from the template
- Keep bullet text concise; use `\small` inside itemize if content is dense
- **`\color[gray]{0.4}` without `\usepackage{xcolor}` renders as literal text** — always load xcolor and use `\textcolor[gray]{0.4}{text}`
- **Sub-project macros (`\subproject`, `\subprojectnodates`) must end with `\par`** — without it, the following `\begin{itemize}` or next macro continues inline on the same line
- **Never show raw URLs for awards/publications** — hyperlink the title with `\href{}{}` instead
- **Omit the Core Competencies block entirely** if `competencies` is absent from the seed — do not render an empty `\ressection{}`

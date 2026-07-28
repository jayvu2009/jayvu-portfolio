# Jay Vu Portfolio

## QA Checklist

This checklist is based only on the files, code, content, and local assets currently present in this repository. Local browser checks were completed in headless Google Chrome at 1920 × 1080, 1440 × 900, and 430 × 932. External websites and services were not used for verification.

### Portfolio Requirements and Core Functionality

- [x] The portfolio is implemented as a static HTML, CSS, and JavaScript website with no build step required — Passed
- [x] The repository contains the Home page (`index.html`), About page (`about.html`), and six project detail pages (`project1.html` through `project6.html`) — Passed
- [x] All eight HTML pages contain one main content landmark and one primary `<h1>` heading — Passed
- [x] The Home page includes the profile card, Home hero, Work carousel and filters, contact form, and footer — Passed
- [x] The About page includes the profile card, personal media slider, hobbies, tools, journey content, contact call-to-action, and footer — Passed
- [x] All six Work cards on the Home page link to their matching project detail pages — Passed
- [x] The Work section supports category filtering, tool filtering, previous/next carousel controls, and project-image slideshows through `js/script.js` — Passed
- [x] The shared More Works component reads the current project configuration and renders matching project cards through `js/project-more-works.js` — Passed
- [x] The contact form checks required fields and email validity before creating a populated `mailto:` link — Passed
- [x] The Home page resume control references `assets/home/JayVu_Resume.pdf` and includes the `download` attribute — Passed
- [x] Project 6 provides controlled video players, a storyboard PDF embed, a storyboard download link, and a Watch Video anchor — Passed
- [ ] End-to-end contact-form delivery still needs testing with a configured desktop or mobile email client
- [ ] The two live project website buttons on Projects 4 and 5 still need external destination testing

### Navigation and Links

- [x] Every local HTML navigation target, project link, media link, poster, PDF, and downloadable file referenced by the HTML exists in the repository — Passed
- [x] Home-page Home and Work links use the existing smooth-scroll behaviour — Passed
- [x] The Home/Work active navigation state updates from clicks, scrolling, direct hashes, and responsive breakpoint changes — Passed
- [x] The About navigation identifies About as the current page on desktop and mobile — Passed
- [x] Desktop and mobile navigation are present on Home, About, and all six project detail pages — Passed
- [x] Mobile navigation buttons update `aria-expanded`, support Escape to close, and close after a navigation link is selected — Passed
- [x] Work and Contact links from About and project pages set the one-time intro bypass before navigating to `index.html#works` or `index.html#contact` — Passed
- [x] Every project detail page includes Back to Work page and Contacts navigation actions — Passed
- [x] LinkedIn, email, and YouTube links are included in the profile cards or footers where defined — Passed
- [x] External links that open a new tab include `rel="noopener"` or `rel="noopener noreferrer"` — Passed
- [ ] LinkedIn, YouTube, Zestli, and Love is Love external destinations were not opened or verified during this local-only audit
- [ ] `mailto:` behaviour still needs testing with an installed email application

### Responsive Design

- [x] The shared CSS contains desktop, large-desktop, tablet, and mobile media queries, including 1120px, 1024px, 860px, 768px, and 620px breakpoints — Passed
- [x] A dedicated large-desktop query targets viewports from 1800–2000px wide and 1000–1200px high — Passed
- [x] Home, About, and all six project pages rendered without horizontal document overflow at 1920 × 1080, 1440 × 900, and 430 × 932 in local headless Chrome — Passed
- [x] The 1920 × 1080 Home hero keeps the Work section below the initial viewport — Passed
- [x] The Home and About profile cards switch into the existing stacked responsive layout at smaller breakpoints — Passed
- [x] Project page navigation switches from desktop links to the mobile menu at the defined responsive breakpoint — Passed
- [x] The mobile intro selects `assets/intro/Mobile_2.mp4`, while larger viewports use `assets/intro/Comp 1a.mp4` — Passed
- [x] The official portfolio logo remains contained and preserves its intrinsic aspect ratio at 1920 × 1080, 1440 × 900, and 430 × 932 — Passed
- [ ] Physical iPhone, Android phone, and tablet hardware testing has not been completed
- [ ] Landscape orientation testing on physical mobile and tablet devices has not been completed

### Browser Support

- [x] All eight pages were loaded locally in headless Google Chrome at the three documented QA viewport sizes without JavaScript exceptions — Passed
- [x] The ten JavaScript files pass Node.js syntax checking — Passed
- [x] The source uses browser APIs supported by the tested Chrome environment, including `IntersectionObserver`, `matchMedia`, `sessionStorage`, `scrollIntoView`, and `URL` — Passed
- [ ] Safari has not been tested
- [ ] Firefox has not been tested
- [ ] Microsoft Edge has not been tested
- [ ] The externally hosted Ionicons scripts and Google Fonts stylesheet were intentionally blocked during local-only testing and still require online dependency testing

### Accessibility

- [x] Every HTML page declares `lang="en"` and UTF-8 character encoding — Passed
- [x] Every HTML page includes a `<main>` landmark and a single `<h1>` — Passed
- [x] All 148 `<img>` elements include an `alt` attribute — Passed
- [x] Empty image alternatives are limited to labelled About slider thumbnails or duplicated tool-marquee content inside `aria-hidden="true"` containers — Passed
- [x] Icon-only carousel arrows, social links, mobile menu buttons, project video media, and the intro section include accessible labels where implemented — Passed
- [x] The Home contact form labels are associated with their inputs and textarea through matching `for` and `id` values — Passed
- [x] Contact validation messages are exposed through the `aria-live="polite"` message element — Passed
- [x] Shared visible `:focus-visible` styling exists for links, buttons, form fields, intro controls, and outlined project buttons — Passed
- [x] The intro, page-load animations, and project scroll-reveal code include reduced-motion handling — Passed
- [ ] A complete keyboard-only test is still required; visually hidden mobile menu links and hidden carousel-card controls need tab-order review
- [ ] The About carousel autoplay and looping video still need reduced-motion and keyboard-accessible pause verification
- [ ] The More Works control declares a listbox, but its option roles, selected state, and arrow-key behaviour still need accessibility testing
- [ ] Work category and tool-filter selection states are visual only and still need programmatic pressed or selected-state review
- [ ] Screen-reader testing has not been completed
- [ ] Colour-contrast testing has not been completed with a contrast-analysis tool

### Performance and Code Optimization

- [x] The Home and About profile images are preloaded and use eager loading with high fetch priority — Passed
- [x] The first Home project image is eager-loaded, while 63 below-the-fold or secondary images explicitly use lazy loading — Passed
- [x] Seventy-eight content images define intrinsic width and height attributes to reduce layout shifting — Passed
- [x] Intro videos use `preload="auto"`, while About and Project 6 content videos use `preload="metadata"` — Passed
- [x] Local browser checks found no broken image requests among images loaded during the eight-page viewport matrix — Passed
- [x] All HTML, CSS, and JavaScript references to local files resolve to existing repository files — Passed
- [ ] Not every image defines intrinsic width and height attributes; 78 of 148 image elements currently provide both
- [ ] Responsive image sources using `srcset` or `<picture>` are not implemented
- [ ] Modern WebP or AVIF alternatives are not present; portfolio imagery currently uses PNG, JPEG, JPG, and SVG formats
- [ ] Large media still needs optimization review, including the approximately 84 MB Project 6 MP4, 21 MB storyboard PDF, and multiple Project 4 PNG files larger than 5 MB
- [ ] CSS and JavaScript files are not minified or bundled for production
- [ ] The unused legacy `assets/white-logo-ver3.svg` file remains in the repository, although no page or script displays or references it

### Metadata and SEO

- [x] All eight pages include viewport metadata — Passed
- [x] All eight pages include a page-specific `<title>` — Passed
- [x] All eight pages include a non-empty meta description — Passed
- [x] Home, About, and each project detail page use distinct titles that identify the current page or project — Passed
- [x] All eight pages use one primary `<h1>` followed by section headings appropriate to their current content structure — Passed
- [ ] No favicon link is defined in the current HTML files
- [ ] Canonical URL metadata is not implemented
- [ ] Open Graph metadata is not implemented
- [ ] Twitter/X card metadata is not implemented
- [ ] Search-engine indexing and generated search-result previews have not been tested on a deployed site

### Content Accuracy and Quality

- [x] The Home and About profile cards list the same four specializations: Front-end Developer, UI/UX Designer, Branding Designer, and Marketing Coordinator — Passed
- [x] The six Home Work cards match the six available project detail pages: Nonna’s Thread, Vintage Jungle, Aura Tint, Zestli, Love is Love, and Paris in the Rain — Passed
- [x] Tool labels and project categories used by the Home filters match the corresponding data attributes in `index.html` and `js/project-more-works.js` — Passed
- [x] Project titles in browser metadata and primary headings identify the correct project on each detail page — Passed
- [x] All page footers display the 2026 copyright notice — Passed
- [x] The official Jay Vu logo is referenced consistently in profile, header, and footer logo locations — Passed
- [ ] Final proofreading is still required; current copy includes phrases such as “But passions sometimes evolves” and other grammatical wording that has not been corrected
- [ ] Naming consistency still needs review for labels such as “CONTACT” versus “Contacts” and “UIUX” versus “UI/UX”
- [ ] Accuracy of personal history, project outcomes, tool usage, and external project descriptions cannot be verified from repository files alone

### Media and Assets

- [x] All local media paths referenced in the HTML exist, including images, videos, PDFs, logo files, and the resume — Passed
- [x] The desktop and mobile intro files exist at `assets/intro/Comp 1a.mp4` and `assets/intro/Mobile_2.mp4` — Passed
- [x] The intro video is muted, autoplaying, inline, non-looping, and has no native controls in `index.html` — Passed
- [x] Intro Skip and autoplay-fallback Play controls are implemented as real buttons — Passed
- [x] The About slider references one local MP4 and five local photographs — Passed
- [x] Project 6 references the existing motion-graphics MP4, poster image, and storyboard PDF — Passed
- [x] The resume PDF and storyboard PDF download links point to existing files — Passed
- [x] Sixteen displayed portfolio-logo image references use `assets/logo.png`, with no displayed reference to the previous SVG — Passed
- [x] Project-specific logo studies in Projects 1–4 remain separate case-study content rather than portfolio-brand logos — Passed
- [ ] Video playback controls and codec compatibility still need testing in Safari, Firefox, Edge, and physical mobile browsers
- [ ] PDF embedding and downloads still need testing outside the local Chrome environment
- [ ] External Ionicons and Google Fonts availability has not been verified because external hosts were not accessed

### CMS Support

- [ ] No CMS, CMS configuration, content API, database, or administration interface is present in the repository
- [ ] Portfolio text, project entries, and media currently require direct HTML, JavaScript, or asset-file updates
- [ ] CMS editing, publishing, permissions, preview, and content-validation workflows cannot be tested because CMS support is not implemented

### Fixed Issues Retest

- [x] The “LET’S CONNECT” content no longer overflows or becomes misaligned after the fourth specialization item was added — Passed
- [x] The profile card maintains appropriate spacing above the footer and no longer overlaps or sits too close to it — Passed
- [x] Excessive empty space below project cards on mobile layouts has been corrected — Passed
- [x] Portfolio images load correctly after a hard refresh and no longer remain blank because of the previous loading issue — Passed
- [x] The introduction video displays correctly on mobile without being improperly cropped — Passed
- [x] The introduction video no longer replays when users navigate internally through the portfolio — Passed
- [x] The “More Works” filter or dropdown no longer overlaps the mobile navigation, and all options remain accessible — Passed
- [x] The layout on large 1920 × 1080 desktop displays uses space more consistently and no longer contains the previously identified excessive spacing — Passed
- [x] The active navigation indicator now changes to “Work” when the Work section is being viewed — Passed
- [x] The same new official logo is now used consistently across all locations in the portfolio — Passed

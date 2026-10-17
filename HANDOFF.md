# Caribrands.ca: audit, changes and setup handoff

Prepared 17 October 2026. Covers the redesign of the single-page site for Hemraj Ramdath / *Beyond Indentureship: Indo-Trinidadian Entrepreneurs*.

---

## 1. Initial audit (baseline: `caribrands site.html`)

**What the project contained**

| File | What it is |
|---|---|
| `caribrands site.html` | The whole site in one file: a browser "Save page as" copy of `file:///C:/Users/hramd/Downloads/index_1.html`. Inline CSS and JS, with the cover (twice) and author photo embedded as base64 (≈353 KB HTML). |
| `1.jpeg`, `2.jpeg`, `9.jpeg` | Photos: Raj presenting copies of the book under The Alma Jordan Library banner, UWI St. Augustine (others in photo unnamed) |
| `3.jpeg` | **Facebook screenshot** (ASJA Girls' College, San Fernando): copies sponsored by TOSL Engineering CEO Shazan Ali, presented to the college. Shows staff, and the commenter name "Tavya Sharma". |
| `4.jpeg` | **Screenshot of Trinidad Express, 8 May 2023, p.4**: photo caption reports Raj presenting Minister Paula Gopee-Scoon with a copy at the Indian Arrival Month / book launch, Arthur Lok Jack Global School of Business. Photo credit: Ishmael Salandy. |
| `5.jpeg`, `6.jpeg` | Raj with two people in front of a Trinidad & Tobago map and T&T/Canadian flags (event and names unknown) |
| `7.jpeg` | Raj presenting a copy of the book to a guest at the same event |
| `8.jpeg` | Same event; another man speaks at a podium while Raj stands beside him |

No CSS/JS files, build tooling, hosting config, git repo, sitemap or robots.txt existed.

**Section → source map (original file)**: all sections live in `caribrands site.html`. Hero `header#top`; Inside the Book `section#books`; Praise `section#praise`; About `section#about`; Library `section#library` (+ copy-note script at the bottom); Contact `section#contact`; Upcoming book `div.soon`; footer `footer`.

**Problems found**

- **Every link was broken once deployed:** nav, CTAs and "Order" buttons pointed to `file:///C:/Users/hramd/Downloads/index_1.html#…`.
- **Fonts never loaded:** stylesheet pointed to `./Hemraj Ramdath website info_files/css2`, a folder that was not supplied. The site fell back to Georgia/Arial.
- Images embedded as base64 (cover duplicated) → large HTML, no caching, no responsive sizes.
- No canonical URL, Open Graph, structured data, sitemap, robots.txt or favicon; title was just "Hemraj Ramdath".
- "Order" buttons only scrolled to Contact; email and phone were plain text, not clickable.
- Mobile nav wrapped onto several lines inside a sticky bar, which ate up screen space on phones.
- Unused CSS left over from an earlier template (`.cover`, `.events`, `.pill`, `.todo`).
- No skip link; stats markup not semantic; the hero headline was oversized relative to the cover.
- Domain status (checked by public DNS lookup): DNS at **Rebel.com** (`dns.rebel.com`); `caribrands.ca` and `www` → `69.16.231.58`, which serves a **Rebel parking page**. **No MX records:** no email is configured for the domain.

---

## 2. What was done

**Files created** (the original `caribrands site.html` and `1–9.jpeg` are untouched):

```
site/                         ← the deployable website (upload this folder only)
  index.html                  ← redesigned page
  assets/css/styles.css
  assets/js/main.js           ← mobile menu, active-section nav, copy-note button
  assets/img/beyond-indentureship-cover.jpg   (extracted from original, 480×720)
  assets/img/hemraj-ramdath.jpg               (extracted from original, 342×338)
  assets/img/uwi-library-presentation-{720,1200}.jpg   (from 9.jpeg)
  assets/img/book-presentation-{720,1200}.jpg          (from 7.jpeg)
  favicon.svg, robots.txt, sitemap.xml
HANDOFF.md                    ← this file (do not upload)
```

**Design improvements by section**

- **Global:** working Google Fonts (Gloock / Archivo / IBM Plex Mono); warm cream reading background with alternating bands; consistent 1120px column; unified button system (gold primary, outline/ghost secondary); visible focus rings; skip link; dark mode kept; reduced-motion respected; print styles. Transitions limited to button/link hover states.
- **Nav:** fixed anchor links; collapses to an accessible menu button below 760px (Esc closes; returns focus); highlights the section in view.
- **Hero:** rebalanced 2-column grid; tighter headline line-height; framed cover with depth; "Order the book" is the prominent gold CTA with an arrow, while "Invite Raj to speak" is a quieter ghost button. Stats are a semantic `<dl>` with dividers. Text and figures unchanged.
- **Inside the Book:** sticky cover beside the text; sector chips with a label; ISBN/publisher/year/pages in a scannable 2×2 grid (stacks on mobile); order buttons now open a pre-addressed email with a subject line.
- **Praise:** card layout with gold rule and decorative quote mark; attributions separated. All three quotes and credits verbatim.
- **About:** circular framed portrait beside name; credentials as a ruled list; bio unchanged; speaking topics as chips; added photo `7.jpeg` (see §3).
- **Library:** numbered steps; request note in a labelled card with a copy button that shows a "Copied" state (fallback: selects the text); added photo `9.jpeg`. Note text and ISBNs unchanged.
- **Contact:** three cards (Orders / Speaking / Media) each with a direct email action; email is a `mailto:` link and the phone is a `tel:` link.
- **Upcoming book + footer:** navy band with gold top rule; footer gets section links. Wording/date unchanged.

**SEO:** descriptive title and meta description; canonical `https://caribrands.ca/`; Open Graph and Twitter card; JSON-LD (`WebSite`, `Person`, `Book` with both ISBNs, publisher, 2023, 294 pages). No ratings, reviews or prices; only facts already on the site. Also added `robots.txt` and `sitemap.xml`.

---

## 3. Verification results

Run locally with headless Microsoft Edge (puppeteer-core), axe-core 4.10 and html-validate 8:

- **Horizontal overflow:** none at 320, 375, 390, 600, 768, 820, 1024, 1280 and 1440px.
- **Accessibility (axe-core):** 0 violations, in light and dark mode, at 390 and 1280px.
- **HTML lint:** the only findings were 3 stylistic "telephone number should not wrap" notes; the number is now set to not wrap.
- **JSON-LD:** parses as valid JSON (WebSite, Person, Book). *Not yet run through Google's Rich Results Test; that needs the live URL.*
- **Links:** all in-page anchors resolve; all images load; no console errors; robots.txt, sitemap.xml and favicon are served.
- **Behaviour:** mobile menu opens and closes (button and Esc); copy-note button copies and shows confirmation.
- **Not tested:** real iOS/Android devices and Safari. There is no build or lint pipeline in the project (plain HTML/CSS/JS), so nothing else to run.

---

## 4. Content and asset map

| Section | Content / asset | Source | Action taken / recommended | Approval needed? |
|---|---|---|---|---|
| Hero | Title, description, CTAs, stats 33 / 8 / 75 | Existing site | Kept verbatim; restyled | Confirm "33 business profiles" is still accurate |
| Hero / Book | Book cover | Embedded in existing site | Extracted to file; unchanged | No |
| Inside the Book | ISBNs, publisher, 2023, 294 pp, commentary credit, sectors | Existing site | Kept verbatim | No |
| Praise | Samaroo, Shyam, Mohammed quotes | Existing site | Kept verbatim | No |
| Praise | **Joseph R. Amann letter** | Client message 1 | **Not published.** See §5 | **Yes** |
| About | Bio, credentials, topics, headshot | Existing site | Kept verbatim | Higher-res headshot requested (§6) |
| About | Photo of Raj presenting the book (`7.jpeg`) | Client photos | Added; caption is deliberately generic | **Confirm event name/date, and that the guest agrees to appear** |
| Library | Photo at Alma Jordan Library, UWI (`9.jpeg`) | Client photos | Added; caption states only what the banner shows | **Confirm OK to publish; name of the person if a credit is wanted** |
| Library / outreach | `1.jpeg`, `2.jpeg` (same UWI event) | Client photos | Not used (duplicates 9.jpeg) | Optional |
| Library / outreach | ASJA Girls' College Facebook post (`3.jpeg`) | Client screenshot | **Not used:** social screenshot showing third parties | Could become a short text line "Copies presented to ASJA Girls' College, sponsored by TOSL Engineering" with the school's permission |
| Media | Trinidad Express, 8 May 2023 (`4.jpeg`) | Client screenshot | **Not used:** newspaper's copyrighted photo | Could become a text-only "As featured in the Trinidad Express (8 May 2023)" line, ideally with a link to the article if one exists online |
| About / Speaking | `5.jpeg`, `6.jpeg`, `8.jpeg` | Client photos | Not used: event and people unidentified | Provide names/event to use |
| Contact | hramdath@yahoo.com, +1 647-888-6970 | Existing site | Kept; made clickable | Switch to raj@ / info@ **only after** mailboxes work (§7) |
| Upcoming book | "Coming November 2026: The Caribbean's 50 Most Iconic Brands" | Existing site | Kept verbatim | **Confirm: November 2026 is next month** |
| (new) News / article | Brinsley Samaroo article + 4 photos | Client message 2 | **Files not supplied** | Yes: see §6 |

---

## 5. Awaiting the client's approval

1. **Joseph R. Amann testimonial.** Not on the site. If approved, suggested excerpt (wording unchanged, only trimmed):
   > "I sincerely congratulate you on your amazing book which I found to be a National Treasure for these Entrepreneurs' descendants. … your book should be introduced to our schools to motivate our young ones to follow in their forefathers' visions and footsteps."
   > **Joseph R. Amann**, Retired Sales & Marketing Manager, 3M Trinidad

   Needs: Mr Amann's permission to publish his name and words. Also, the section is headed "What historians say", so a reader testimonial would need the heading changed (e.g. "What readers say") or a separate "From readers" row. The personal details in his letter (home address, Ben Battoo) should be left out.
2. **Schools outreach** (raised by Mr Amann and shown by the ASJA post): the Library section already asks readers to approach "school or university librarians". A sentence on bulk orders for schools already exists under Contact → Orders. No new section is needed unless the client wants one.
3. **Captions/permissions** for the two photos added (see §4).
4. **Contact email change**: wait until the new mailboxes are verified.
5. **Canonical domain**: the site assumes `https://caribrands.ca/` (no www) as primary, with www redirecting to it. Change the canonical, OG and sitemap URLs if the client prefers www.

## 6. Missing assets / information

- `BRINSLEY SAMAROO.docx`
- `BRINSLEY SAMAROO AT STEPS NEAR SEVILLA HOUSE 2015.JPG`
- `BRECHIN CASTLE MUSEUM DISPLAY SLAVERY EXHIBIT -PHOTO 2015.JPG`
- `BRINSLEY HUNSLET DEISEL ENGINES BRECHIN CASTLE.JPG`
- `BRINSLEY AT BRECHIN CASTLE MUSEUM OUTSIDE.JPG`

  These are referenced in the email chain but **not present** in the project. Before using them, we need: the files, the intended use (news/blog page on the site, or press only), and confirmation that the author and photographer allow web publication. Nothing has been sent to any newspaper or third party.
- A **higher-resolution author headshot** (current one is 342×338px and slightly soft).
- Ideally a **higher-resolution cover** (current is 480×720) and a 1200×630 social-sharing image.
- How people actually **buy** the book (price, online store link, distributor). Today all ordering is by email.

---

## 7. Deployment to caribrands.ca

The site is plain static files, so no build step is needed. **Upload only the `site/` folder's contents.**

**Option A (recommended, free): Netlify**
1. Log in at app.netlify.com → *Add new site → Deploy manually* → drag the `site` folder in.
2. *Domain management → Add domain* → `caribrands.ca` (add `www.caribrands.ca` too; set the apex as primary).
3. In **Rebel.com → caribrands.ca → DNS** (client's login required):
   - Edit the `A` record for `@` from `69.16.231.58` to **`75.2.60.5`**.
   - Change `www` to a **CNAME** → `<your-site-name>.netlify.app`.
   - Remove any Rebel "URL forwarding/parking" setting for the domain if present.
4. Wait for DNS (minutes to a few hours), then in Netlify click *Verify DNS* and *Provision certificate* (HTTPS).

**Option B: Rebel web hosting**, if the client already pays Rebel for hosting: upload the contents of `site/` to the web root (`public_html`) through Rebel's file manager or FTP, and enable SSL there. DNS can stay as is.

**After go-live:** open https://caribrands.ca and https://www.caribrands.ca. Submit `https://caribrands.ca/sitemap.xml` in Google Search Console, then run the Rich Results Test and a PageSpeed check.

## 8. Email: raj@caribrands.ca and info@caribrands.ca

Changing the website does **not** create mailboxes. As of 17 Oct 2026 the domain has **no MX records**, so mail sent to these addresses will currently fail. The client needs to choose an email provider (paid per mailbox) and make DNS changes at Rebel.com.

**Decide first:** two full mailboxes (two licences), or one mailbox `raj@` with `info@` as a free **alias** or **group** that delivers to it. The client asked for "one for raj and one for info"; an alias is cheaper if only Raj reads both.

**Google Workspace**
1. Sign up at workspace.google.com with `caribrands.ca`; verify the domain by adding the `google-site-verification=…` **TXT** record it gives you at Rebel.
2. Admin console → create user `raj@caribrands.ca`; create `info@` as a second user, or as an alias/group.
3. At Rebel DNS: **MX** `@` → `smtp.google.com`, priority `1` (delete any other MX).
4. **SPF** TXT `@`: `v=spf1 include:_spf.google.com ~all`
5. **DKIM:** Admin → Apps → Gmail → Authenticate email → generate key → add the `google._domainkey` TXT record → *Start authentication*.
6. **DMARC** TXT `_dmarc`: `v=DMARC1; p=none; rua=mailto:raj@caribrands.ca`

**Microsoft 365**
1. admin.microsoft.com → *Settings → Domains → Add domain* → add the verification TXT at Rebel.
2. Create users `raj@` and `info@` (or a shared mailbox for info@, which needs no licence under 50 GB).
3. Add the records the wizard shows: **MX** `@` → `caribrands-ca.mail.protection.outlook.com` (copy the exact value from the wizard), **CNAME** `autodiscover` → `autodiscover.outlook.com`, **SPF** `v=spf1 include:spf.protection.outlook.com -all`.
4. Enable DKIM (two `selector1/selector2._domainkey` CNAMEs from Defender portal) and add DMARC as above.

**Zoho Mail (lower cost):** verify the domain, then **MX** `mx.zoho.com` (10), `mx2.zoho.com` (20), `mx3.zoho.com` (50); SPF `v=spf1 include:zohomail.com ~all`; DKIM from the Zoho admin console; DMARC as above.

**Before switching the website's contact details:** send and receive a test message on both addresses. Check SPF, DKIM and DMARC pass (e.g. "Show original" in Gmail). Then change `hramdath@yahoo.com` in `site/index.html` (all occurrences, including mailto subjects). Suggested split: orders/media → info@, speaking → raj@, if the client agrees.

**Access still needed:** the Rebel.com login (or a delegated DNS contact), a decision on hosting (Netlify vs Rebel hosting), and a decision and billing for the email provider. No DNS changes have been made, and no accounts have been created.

---

## 9. Refinement pass (17 Oct 2026, second round)

**Reference used:** `C:\Users\Lenovo\Downloads\Beyond-Indentureship-…-10_51_AM.pdf`. It is one 1920×7728px screenshot wrapped in a PDF; the file is not in the project folder.

**Distortion check.** The image inside the PDF was measured, then every image was measured in the browser at 320–1920px.

| Image | Rendered ratio | Source ratio | Verdict |
|---|---|---|---|
| Hero cover (from the PDF) | 390×582 = 0.670 | 0.667 | not distorted |
| Covers (browser, all widths) | 0.667 | 0.667 | not distorted |
| Author portrait | 1.000 (circle) | 1.012 | intentional circular crop of a near-square photo; not stretched |
| Event photo (7.jpeg) | 1.506 | 1.508 | not distorted |
| Library photo (9.jpeg) | 1.333 | 1.333 | not distorted |

The squeezed look came from viewing a 1920px-wide page scaled down to fit a PDF viewer, not from the CSS. As a safeguard, covers now use `object-fit: contain`. Event photos are no longer forced into fixed ratios, so they can never be cropped.

**Changed:** `site/assets/css/styles.css`, rewritten as a single token system covering type scale, spacing, radius, button height and cover ratio, with breakpoints documented at the top. In `site/index.html` only the `sizes` hint for the About photo changed. No content changed.

| Area | Before | After |
|---|---|---|
| Hero heading | `max-width:15ch` left "Beyond" alone; 4 lines on desktop, 5 at 320px | Cap removed; "Indo-Trinidadian" sits on its own line; 3 lines at 390–1920px, 4 at 320px; line-height 1.04 → 1.08 |
| Hero layout | Cover column 0.65fr | Fixed 220–300px cover column; stats limited to 620px |
| Labels / eyebrows | 11.5–12px, 0.14–0.16em tracking | 13px, 0.1em tracking |
| Captions, attributions, chips, footer, nav, metadata | 13.6–14.4px | 15px |
| Testimonials | Attributions at different heights | Aligned across cards (CSS subgrid, with a fallback); smaller quote mark |
| About | Name wrapped beside the portrait | Name on one line from 1024px up; portrait 112px (88px on phones); calmer quote size |
| Library | Request note wrapped mid-line | Note column widened (1 : 1.2), 14px monospace; every line intact at desktop widths |
| Chips | Pill-shaped | Square-cornered, to match the cards and buttons |

**Verification (headless Edge, puppeteer-core):**
- **Overflow:** no horizontal scroll at 320, 375, 390, 600, 768, 820, 1024, 1280, 1440 or 1920px.
- **Images:** all ratios as in the table above; all images load.
- **Accessibility (axe-core 4.10):** 0 violations in light and dark mode at 390 and 1280px. A second test script flags the dark-mode outline button only while the colour scheme is switching; measured steady-state contrast is about 15:1.
- **Behaviour:** menu opens, closes with Esc, and links close it; copy button works; all anchors resolve.
- **Content:** all 94 original text segments are present. "Email:" and "Phone / WhatsApp:" became label + link, and the two footer spans were merged into one line.
- **SEO:** title, description, canonical, OG, Twitter card, JSON-LD, sitemap, robots.txt and favicon all intact.
- **HTML lint:** only the stylistic `tel-non-breaking` rule fires; the number is kept on one line with CSS instead.
- **Not tested:** real iOS and Android devices, Safari and Firefox.

The client approvals and missing assets in §5–§6, and the hosting and email tasks in §7–§8, are unchanged. In particular, **"Coming November 2026" is next month and still needs confirming.**

---

## 10. Tailwind CSS migration + redesign (17 Oct 2026, third round)

**Stack:** still plain HTML + JS. Styling is now **Tailwind CSS v4.3.3** (`@tailwindcss/cli`), built with Node 24.12 / npm 9.8.

```
package.json                 npm scripts + Tailwind dev dependencies
src/styles.css               Tailwind source: @theme tokens, reusable @utility patterns, small CSS-only effects
site/assets/css/styles.css   GENERATED by the build. Do not edit by hand.
site/index.html              markup with Tailwind utilities
site/assets/js/main.js       menu, copy and nav highlight now use data attributes; adds scroll reveal
.gitignore                   node_modules/
```

**Build:** `npm install` once, then `npm run build` (minified, about 34 KB) or `npm run dev` (watch mode). Tailwind only scans `site/index.html` and `site/assets/js/main.js`, so run the build after every markup change. Deploy only the `site/` folder, as before.

**Design tokens** (`@theme` in `src/styles.css`):
- **Colours:** navy 950–300, gold 200–700, clay and cane (taken from the cover), plus semantic `paper`, `parchment`, `surface`, `ink`, `ink-soft`, `rule` and `accent-ink`, which switch automatically in dark mode.
- **Type scale:** `text-kicker`, `-meta`, `-body`, `-lede`, `-quote`, `-feature`, `-h3`, `-h2`, `-h1`, `-h1-lg`, `-stat`.
- **Fonts:** Gloock (display), Newsreader (serif; newly added), Archivo (sans), IBM Plex Mono.
- **Other tokens:** `max-w-page`, `aspect-cover`, `shadow-paper`, `shadow-book`, `ease-editorial`.
- **Reusable patterns:** `page`, `section-y`, `kicker`, `mark-no`, and the buttons `btn-gold`, `btn-ink`, `btn-line`, `btn-ghost`.

**Kept as hand-written CSS** (about 60 lines; utilities can't express these): the stacked page edges and spine shading on the book, the faint ledger lines behind the hero, the perforated edge on the request slip, the drop cap, the punched hole on the catalogue card, the mobile-menu panel and the reduced-motion-aware scroll reveal.

**Visual direction ("archival ledger"):** each section is numbered like a ledger (§ 01–05), with ruled dividers, monospace catalogue details and the book shown as a physical object.
- **Hero:** a three-tier headline in white, gold and Newsreader italic. The cover is shown as a 3D book with page edges, plus a catalogue line underneath.
- **Book:** a drop cap opens the description; sectors are a numbered two-column list; book details sit on a library catalogue card.
- **Praise:** the Samaroo quote is the lead, with a large quotation mark; the other two quotes sit in ruled columns below.
- **About:** an arch-shaped portrait; credentials and topics stay in place on desktop while the biography scrolls; the quote is a gold-ruled pull quote; the event photo has an offset gold frame.
- **Library:** a navy section with large serif step numbers; the request note is a tilted, perforated slip that stays in view.
- **Contact:** a ruled index (01–03) instead of three cards.
- **Upcoming book:** a large serif announcement band.

**Verification (headless Edge):**
- **Overflow:** none at 320, 375, 390, 600, 768, 820, 1024, 1280, 1440 or 1920px.
- **Images:**
  - Covers measure exactly 2:3 at every width.
  - The two event photos keep their natural shape.
  - The portrait is an intentional arch crop with `object-cover`, so the face is cropped, not stretched.
- **Accessibility (axe-core):** 0 violations, light and dark, at 390 and 1280px.
- **Behaviour:** mobile menu opens, closes with Esc, and links close it; copy button works; all anchors resolve; robots, sitemap and favicon are served.
- **Content:** all 94 original text segments preserved (same two label-to-link changes as before). Additions are decorative only: § numbers, the vertical "Royards Publishing · Trinidad · 2023" label, and the "Paperback · 294 pages · 2023" catalogue line, all built from existing facts.
- **HTML lint:** only the stylistic phone-number rule fires (the number already stays on one line).
- **Not tested:** real devices, Safari and Firefox.

The client approvals and missing assets (§5–§6) and the hosting and email tasks (§7–§8) are unchanged.

---

## 11. Signature design pass (17 Oct 2026, fourth round)

**What was added:**
- **Gold progress bar** under the navigation, filling as you scroll.
- **Hero:**
  - The headline and content rise in line by line when the page loads.
  - The stats count up from zero.
  - A warm glow sits behind the book, and the book tilts towards the pointer on desktop (it is flat at rest, so the cover is never distorted).
  - A large outlined "1845–1920" sits in the background, and the hero fills the screen on desktop.
- **Gold ribbon** under the hero with names profiled in the book (Battoo Brothers, S.M. Jaleel, Sacha Cosmetics, Charran's, The Chancellor Hotel, Helen Bhagwansingh, Madame Ramdoolarie Maharaj). It scrolls continuously and pauses on hover; screen readers get one plain sentence instead.
- **Timeline (1845 → 1920 → 2023)** in Inside the Book, with a gold line that draws itself.
- **Praise:** a gold highlighter sweeps under "fills a gap in the Indo-Caribbean narrative".
- **About:**
  - The surname is set in a clay-coloured italic.
  - A slowly rotating badge reads "Consultant · Researcher · Author".
  - The event photo reveals with a wipe.
- **Library:** the photo reveals with a wipe, and the request slip straightens on hover.
- **Contact:** a gold wash sweeps across each row on hover.
- **Upcoming book:** a large outlined "50" in the background. **Footer:** an outlined "Caribrands" wordmark.
- **Texture:** a subtle paper grain over the whole page.

Every animation is switched off for visitors who ask for reduced motion (tested: the ribbon stops and the headline shows immediately).

**New wording for client approval** (derived from facts already on the site, but not supplied word for word):
- Timeline: "Indentured labourers begin arriving in Trinidad from India." (1845) / "The 75-year period of indentureship comes to an end." (1920) / "*Beyond Indentureship* is published by Royards Publishing." (2023)
- Ribbon sentence for screen readers: "Businesses and entrepreneurs profiled in the book include …"
- Badge: "Consultant · Researcher · Author" (from "business consultant, researcher and author").

**Verified (headless Edge):**
- **Overflow:** none at 320–1920px.
- **Accessibility (axe-core):** 0 violations in light and dark mode.
- **HTML lint:** clean apart from the stylistic phone-number rule.
- **Behaviour and content:** menu, copy button, anchors, count-up and progress bar all work; all original text is intact (the Samaroo quote was checked character for character).
- **Not verifiable headless:** the pointer tilt. Headless Edge reports no fine pointer, so the tilt stays off there by design. Check it in a desktop browser.

---

## 12. New layout: transparent header, magazine hero and gallery (17 Oct 2026, fifth round)

**The previous design is archived** in `archive/v4-ledger/` (index.html, Tailwind source, JS); that folder is not deployed. To restore it, copy those three files back over `site/index.html`, `src/styles.css` and `site/assets/js/main.js`, then run `npm run build`.

**What changed:**
- **Header:**
  - Fixed and fully transparent over the hero. After 24px of scrolling it turns solid navy with a blur, a gold rule and a shadow, and shrinks from 80px to 64px.
  - Adds an "HR" monogram and an "Order the book" button on wide screens.
  - When the mobile menu is open, the header is solid.
- **Hero:** a magazine-cover layout. "Beyond" is set huge (up to 224px), with the rest of the title stacked below it. The cover sits beside it, rotated 3° (it still tilts towards the pointer), with a gold glow and ring behind. The lede, buttons and stats share a bottom bar. Wording is unchanged.
- **Praise:** now a navy section with a centred lead quote and a large background quotation mark; the other two quotes sit on navy panels.
- **About:** the event photo moved to the gallery, and speaking topics are a 2×2 ruled grid.
- **New § 04 Gallery ("In pictures"):** six photos.
  - **Desktop:** a bento grid. Hovering shows the caption.
  - **Tablet:** two columns.
  - **Phone:** a swipeable strip.
  - Clicking any photo opens a full-screen viewer (a native `<dialog>`) with previous/next buttons, a "01 / 06" counter and the caption; arrow keys and Esc work, and focus returns to the photo.
  - Phones and tablets show every photo uncropped. On desktop the two tall photos are trimmed about 5% at the sides, and the library photo (4:3) is trimmed top and bottom to fit 3:2.
- **Library:** the photo moved to the gallery; the request slip now sits centred beside the steps.
- Sections renumbered § 01–06. "Gallery" added to the header and footer navigation.

**Gallery photos** (optimised copies in `site/assets/img/gallery/`, 800px and 1600px wide; originals untouched):
- 1.jpeg: UWI library, three people. Caption: "Presenting copies of the book at The Alma Jordan Library, UWI St. Augustine."
- 7.jpeg: Raj presenting a copy. Caption: "Presenting a copy of *Beyond Indentureship*."
- 5.jpeg: Raj with two guests. Caption: "With guests at a presentation of the book." (6.jpeg is a near-duplicate and was left out.)
- 2.jpeg: UWI library, four people. Caption: "At The Alma Jordan Library, UWI St. Augustine."
- 9.jpeg: UWI library, with the librarian. Caption: as on 1.jpeg.
- 8.jpeg: a speaker at a lectern beside Raj. Caption: "Remarks at a presentation of the book."
- Not used: 3.jpeg (a Facebook screenshot), 4.jpeg (a newspaper page) and 6.jpeg.

**Needs the client:**
- **Captions:** the event name and date for 5, 7 and 8, and names, if wanted, for everyone pictured.
- **Permission:** to publish photos of the people shown.

**Verified (headless Edge):**
- **Header:** transparent at the top, solid after scrolling (computed background checked), and solid while the mobile menu is open.
- **Lightbox:** opens, →/← step through the photos, Esc closes it, and focus returns.
- **Images:** gallery photos keep their exact shape on phones and tablets (desktop trims as noted above); the cover stays 2:3.
- **Overflow:** none at 320–1920px.
- **Accessibility (axe-core):** 0 violations in light and dark mode.
- **HTML lint:** clean apart from the stylistic phone-number rule.
- **Behaviour:** copy button, menu and anchors all work.
- **Content:** all original text present.

### 12a. Gallery expanded to all images (same day)

The gallery now holds all nine images.

**Seven event photos** (1, 2, 5, 6, 7, 8 and 9.jpeg):
- **Desktop:** a 3-column masonry layout, so every photo shows uncropped.
- **Tablet:** two columns.
- **Phone:** a swipeable strip.

**New row, "In the press & community":**
- **Trinidad Express, 8 May 2023** (from 4.jpeg): cropped to the "Book Launch" photo, the paper's caption and the photo credit (Ishmael Salandy). The browser window, the local file path with a Windows username, the taskbar and the unrelated articles were removed.
- **ASJA Girls' College, San Fernando, Facebook post** (from 3.jpeg): cropped to the college's post and photos. The phone status bar and the "Comment as Tavya Sharma" bar, which shows a private person's name, were removed.

The cropped copies are in `site/assets/img/gallery/`. All nine images share one lightbox sequence (01–09).

**Action needed before deploying:**
- `site/assets/img/3.jpeg` and `4.jpeg` are the **uncropped** originals the user added. The page doesn't use them, but uploading the `site/` folder would publish them at guessable URLs, private details included. Remove them from `site/` (identical copies remain in the project root).

**Permissions to confirm:**
- **Trinidad Express:** the newspaper photo and caption are the Express's copyright, so the client needs the paper's permission, or should replace the image with a text link to the article.
- **ASJA post:** the college's agreement to reuse its post, which shows staff.

---

## 13. Contact emails switched to caribrands.ca (17 Oct 2026, at the user's request)

The site no longer mentions `hramdath@yahoo.com`:
- **info@caribrands.ca:** "Order a copy by email", "Bulk & institutional orders", "Email an order", "Send a media enquiry", and the "Orders & media" contact line.
- **raj@caribrands.ca:** "Invite Raj to speak" (contact row) and the "Speaking & Raj directly" contact line.
- The hero's "Invite Raj to speak" button still scrolls to the Contact section.

⚠️ **As of this change, caribrands.ca has no MX records, so mail to both addresses will bounce** until the mailboxes are created and the provider's DNS records are added at Rebel.com (see §8). After setup, send a test message to each address from an outside account (e.g. Gmail) to confirm delivery.

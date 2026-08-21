$ErrorActionPreference = "Stop"

$indexPath = Join-Path $PSScriptRoot "index.html"
$html = Get-Content -Raw -LiteralPath $indexPath

function Assert-Contains {
  param(
    [string]$Needle,
    [string]$Message
  )
  if (-not $html.Contains($Needle)) {
    throw $Message
  }
}

function Assert-Order {
  param(
    [string]$First,
    [string]$Second,
    [string]$Message
  )
  $firstIndex = $html.IndexOf($First)
  $secondIndex = $html.IndexOf($Second)
  if ($firstIndex -lt 0 -or $secondIndex -lt 0 -or $firstIndex -ge $secondIndex) {
    throw $Message
  }
}

Assert-Contains '<a class="header-nav-link" href="#work">Selected</a>' "Primary nav must relabel Work as Selected."
Assert-Contains '<a class="mobile-menu-link" href="#work">Selected</a>' "Mobile menu must relabel Work as Selected."
Assert-Contains '<a class="header-nav-link" href="#browse">Browse</a>' "Primary nav must include Browse next to Selected."
Assert-Contains '<a class="mobile-menu-link" href="#browse">Browse</a>' "Mobile menu must include Browse."
Assert-Contains '<a class="header-nav-link header-home-link" href="#archive" aria-label="Home">' "Primary nav must include a dedicated home icon link."
Assert-Contains '<a class="mobile-menu-link" href="#archive">Home</a>' "Mobile menu must include a dedicated Home link."
Assert-Contains 'data-room="browse"' "A dedicated Browse room must exist."
Assert-Contains '["archive", "work", "browse", "about", "contact"]' "Router must accept the browse route."
Assert-Contains 'body.classList.toggle("browse-room-active", target === "browse")' "Body state must expose the active Browse room."
Assert-Contains 'window.scrollTo({ top: 0, left: 0, behavior: "auto" });' "Room navigation must reset scroll position to avoid stale offsets."
Assert-Contains 'const archiveHomeLinks = document.querySelectorAll(''[href="#archive"]'');' "Archive home links must be wired for same-hash reset behavior."
Assert-Contains 'function resetRecordWallView()' "Record wall must expose a reset function for returning home."
Assert-Contains 'if (event.detail?.room === "archive") {' "Record wall route listener must detect archive returns."
Assert-Contains 'resetRecordWallView();' "Record wall must reset when returning to archive/home."
Assert-Contains 'id="browse"' "Browse room must have a hash target."
Assert-Order '<a class="header-nav-link header-home-link" href="#archive" aria-label="Home">' '<a class="header-nav-link" href="#work">Selected</a>' "Home icon must sit immediately before the Selected/Browse navigation cluster."
Assert-Order '<section class="room archive active" id="archive"' '<section class="hero-reel-section" id="heroReel"' "Archive record wall must appear before the Director's Reel on the homepage."
Assert-Contains 'aria-label="Selected work"' "Work route should now present itself as a Selected work page."
Assert-Contains 'const selectedWorkSlugs = new Set(["cyberpunk-2077", "doom", "fallout-nuka-cola", "witcher"]);' "Selected page must render only the flagship work set."
Assert-Contains '<div class="selected-screening" id="selectedScreening" data-active-slug="cyberpunk-2077">' "Selected page must use the screening-room shell."
Assert-Contains '<div class="selected-selector" id="selectedSelector" role="listbox" aria-label="Choose selected work project"></div>' "Selected page must include the interactive project selector."
Assert-Contains 'function initSelectedScreeningRoom()' "Selected screening room must initialize its interactive state."
Assert-Contains 'selectedVideo.src = project.loop;' "Selected screening room must load only the active project preview video."
Assert-Contains '.selected-selector::before {' "Selected selector must explicitly own the former timeline line treatment."
Assert-Contains 'content: none;' "Selected selector timeline/circle pseudo-elements must be disabled."
Assert-Contains '.selected-selector-thumb::after {' "Selected selector active state must use the restrained thumbnail underline."
Assert-Contains 'opacity: 0.64;' "Inactive selected-work selector items must rely on restrained opacity hierarchy."
Assert-Order '<span class="selected-selector-number">${project.number}</span>' '<span class="selected-selector-thumb">' "Selected selector must read as an editorial index: number/title before thumbnail."
Assert-Contains '.browse-room .cc-code,' "Browse card code labels must be explicitly hidden."
Assert-Contains 'display: none !important;' "Cleanup CSS must include hard hides for removed noisy metadata."
Assert-Contains 'row.setAttribute("aria-label", g.label);' "Browse page must expose every category row directly without a tab panel gate."
Assert-Contains 'font-size: clamp(1.8rem, 4.2vw, 3.25rem) !important;' "About and Contact hero headlines must use restrained sizing."
Assert-Contains '<div class="about-film-profile" data-od-id="about-film-profile">' "About page must use the editorial filmmaker profile shell."
Assert-Contains 'data-od-id="about-philosophy-quote"' "About page must promote the visual-rhythm philosophy as a major quote."
Assert-Contains 'images/cyberpunk/bts-02-directing.jpg' "About page must use the real Cyberpunk directing BTS image as the hero."
Assert-Contains 'images/doom/bts-01-makeup.jpg' "About page must include real DOOM practical makeup BTS material."
Assert-Contains 'images/doom/process-04-post.jpg' "About page must include real post-production process material."
Assert-Contains 'Fog machines whenever possible.' "About page must include the restrained personal notes section."
Assert-Contains 'loading="lazy" decoding="async"' "Below-fold About BTS images must be lazy loaded."
Assert-Contains '<div class="contact-open-channel" data-od-id="contact-open-channel">' "Contact page must use the open-channel composition shell."
Assert-Contains '<form class="contact-brief-form" id="contactBriefForm" novalidate data-mailto="jmcdaniel.productions@gmail.com"' "Contact page must include the mailto-backed brief form."
Assert-Contains '<input id="contactEmail" name="email" type="email" autocomplete="email" required' "Contact form must preserve proper email input semantics."
Assert-Contains '<p class="contact-form-status" id="contactFormStatus" aria-live="polite"></p>' "Contact form must expose an aria-live submission status."
Assert-Contains 'Email draft ready - send from your mail app' "Contact form must not fake a sent-message state without a backend."
Assert-Contains 'Could not open mail app - use the direct email below' "Contact form must provide a direct-email fallback on failure."
Assert-Contains '<a class="contact-direct-email" href="mailto:jmcdaniel.productions@gmail.com"' "Contact page must preserve Jared's direct email route."
Assert-Contains '<a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">-&gt;</span></a>' "Contact page must preserve the existing Instagram link."
Assert-Contains '<a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">TikTok <span aria-hidden="true">-&gt;</span></a>' "Contact page must preserve the existing TikTok link."

if ($html.Contains('Browse the Archive')) {
  throw "Browse page should not render the extra 'Browse the Archive' heading."
}
if ($html.Contains('category-tabs" role="tablist"') -or $html.Contains('className = "category-tab"')) {
  throw "Browse page should show all category rows directly, not a second tab picker."
}
if ($html.Contains('<div class="cc-code">')) {
  throw "Browse thumbnails should not render T1/01-style code labels."
}
if ($html.Contains('id="workFilters"') -or $html.Contains('id="exploreArchive"')) {
  throw "Selected page should not include Work filter controls or an Explore Archive button."
}
if ($html.Contains('top: -0.73rem')) {
  throw "Selected selector must not use circular timeline nodes."
}
if ($html.Contains('linear-gradient(90deg, transparent, rgba(242, 238, 231, 0.18), transparent)')) {
  throw "Selected selector must not use the old connecting timeline gradient."
}
if ($html.Contains('<figure class="about-welcome-frame')) {
  throw "About page should not keep the old generic welcome-frame markup."
}
if ($html.Contains('<div class="contact-welcome">') -or $html.Contains('<section class="contact-card scroll-focus"')) {
  throw "Contact page should not keep the old placeholder welcome/card structure."
}
if ($html.Contains('MESSAGE SENT')) {
  throw "Contact page must not claim a message was sent without a live backend."
}

$archiveStart = $html.IndexOf('<section class="room archive active" id="archive"')
$archiveEnd = $html.IndexOf('<section class="hero-reel-section" id="heroReel"')
if ($archiveStart -lt 0 -or $archiveEnd -lt 0 -or $archiveEnd -le $archiveStart) {
  throw "Could not isolate the archive homepage after reordering."
}
$archiveHtml = $html.Substring($archiveStart, $archiveEnd - $archiveStart)
if ($archiveHtml.Contains('id="carouselRows"')) {
  throw "Category browser must be removed from the archive homepage."
}

Write-Host "portfolio regression checks passed"

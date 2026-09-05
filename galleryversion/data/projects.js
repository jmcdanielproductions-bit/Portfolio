/* Project data — lifted verbatim from galleryversion/portfolio-data.json
   (the repo's stated single source of truth). Nothing invented: every
   title, client, role, type, year, youtubeId and view count below is
   from that file. `views` is only present where the JSON had it, which
   is why most cards show no count. */

export const REEL = {
  slug: "director-reel",
  title: "Director Reel",
  yt: "mFeMMMmdW24",
  role: "Creative Video Director",
  year: "2026"
};

export const PROJECTS = [
  { slug: "cyberpunk-2077", title: "Cyberpunk 2077", yt: "Hc_t2eTorhI", client: "CD Projekt Red", role: "Creative Direction", type: "Campaign Trailer", year: "2025", track: "brand", filters: ["Gaming"], flagship: 1 },
  { slug: "doom", title: "DOOM", yt: "0WUnGHJXeHc", client: "Bethesda", role: "Trailer Direction", type: "Game Trailer", year: "2025", track: "brand", filters: ["Gaming"], flagship: 1 },
  { slug: "fallout-nuka-cola", title: "Fallout / Nuka-Cola", yt: "VxTBnNhAD3Q", client: "Bethesda", role: "Commercial Direction", type: "Commercial Spot", year: "2025", track: "brand", filters: ["Commercial"], flagship: 1 },
  { slug: "witcher", title: "The Witcher", yt: "tr1ajPqpuDs", client: "CD Projekt Red", role: "Cinematic Direction", type: "Cinematic Trailer", year: "2025", track: "brand", filters: ["Gaming", "Narrative"], flagship: 1 },
  /* still: mpTbAcvWflA has no maxresdefault — YouTube serves a 120x90 grey
     placeholder instead of 404ing, so this one uses a real frame from the repo. */
  { slug: "kairi-animation-storyboard", title: "Kairi & Pixel", yt: "mpTbAcvWflA", still: "assets/still-kairi.jpg", client: "CORSAIR", role: "Short-Form Video Producer", type: "Holiday Animation Campaign", year: "2025", views: "70K", track: "brand", filters: ["Commercial", "Narrative"], flagship: 1 },

  { slug: "corsair-storefront", title: "Product Experience", yt: "OZZsRSgG70g", client: "CORSAIR", role: "Brand Direction", type: "Product Film", year: "2024", track: "brand", filters: ["Commercial"] },
  { slug: "corsair-invincible-novablade-pro", title: "Invincible Novablade Pro", yt: "WcOLQd3IycM", client: "CORSAIR", role: "Campaign Direction", type: "Product Campaign", year: "2025", track: "brand", filters: ["Commercial", "Gaming"] },
  { slug: "corsair-amazon-prime-gaming-week", title: "Prime Gaming Week", yt: "x5VkzsCT6eA", client: "CORSAIR", role: "Campaign Direction", type: "Retail Campaign", year: "2025", track: "brand", filters: ["Commercial", "Gaming"] },
  { slug: "bmw-fanatec-ad", title: "BMW Fanatec", yt: "stQ7DVL4PvE", client: "BMW / Fanatec", role: "Commercial Direction", type: "Commercial Spot", year: "2025", track: "brand", filters: ["Commercial", "Gaming"] },
  { slug: "corsair-experience-store", title: "Experience Store", yt: "1MzUb4VSi1s", client: "CORSAIR", role: "Commercial Direction", type: "Brand Film", year: "2025", views: "134K", track: "brand", filters: ["Commercial"] },
  { slug: "shugo-samurai-trailer-ad", title: "Shugo Samurai", yt: "Lpeyg7lq_DY", client: "Shugo Samurai", role: "Trailer Direction", type: "Trailer", year: "2025", views: "100K", track: "brand", filters: ["Gaming", "Narrative"] },

  { slug: "ashfall", title: "Ashfall", yt: "Nf_lDTJCl2w", client: "Independent", role: "Short Film Direction", type: "Narrative Short", year: "2024", track: "films", filters: ["Narrative"] },
  { slug: "silent-collapse", title: "Silent Collapse", yt: "Yj2ncYs0vGU", client: "Independent", role: "Experimental Direction", type: "Experimental Short", year: "2024", track: "films", filters: ["Experimental"] },
  { slug: "frame-cut", title: "Frame Cut", yt: "nAIy3q5myjY", client: "Personal", role: "Editorial Direction", type: "Editorial Feature", year: "2024", track: "films", filters: ["Experimental"] },
  { slug: "amv-flow-edit-lil-baby-intro", title: "Flow Edit — Lil Baby", yt: "DvQ-cIp07Mg", client: "Personal", role: "Editorial Direction", type: "Editorial Feature", year: "2025", track: "films", filters: ["Experimental"] },
  { slug: "amv-iron-man-edit", title: "Iron Man — Edit", yt: "oB9go7Dd1d0", client: "Personal", role: "Editorial Direction", type: "Editorial Feature", year: "2025", track: "films", filters: ["Experimental"] },
  { slug: "el-beeper-luffy-amv", title: "Luffy — Edit", yt: "KAl31zPic9Y", client: "Personal", role: "Editorial Direction", type: "Editorial Feature", year: "2025", track: "films", filters: ["Experimental"] }
];

/* Local motion previews. Only listed where the file actually exists in
   videos/ — a missing entry means the card stays a poster still. */
export const LOOPS = {
  "cyberpunk-2077": "videos/cyberpunk-loop.mp4",
  "doom": "videos/doom-loop.mp4",
  "fallout-nuka-cola": "videos/fallout-loop.mp4",
  "witcher": "videos/witcher-loop.mp4",
  "kairi-animation-storyboard": "videos/kairi-loop.mp4",
  "corsair-invincible-novablade-pro": "videos/novablade-loop.mp4",
  "corsair-amazon-prime-gaming-week": "videos/primeweek-loop.mp4",
  "bmw-fanatec-ad": "videos/bmw-loop.mp4",
  "shugo-samurai-trailer-ad": "videos/shugo-loop.mp4",
  "frame-cut": "videos/framecut-loop.mp4",
  "amv-flow-edit-lil-baby-intro": "videos/lilbaby-loop.mp4",
  "amv-iron-man-edit": "videos/ironman-loop.mp4",
  "el-beeper-luffy-amv": "videos/luffy-loop.mp4"
};

export const thumb = (yt, big) =>
  `https://img.youtube.com/vi/${yt}/${big ? "maxresdefault" : "hqdefault"}.jpg`;

/* Prefer a real repo still, else maxres. */
export const frame = (p) => p.still || thumb(p.yt, true);

/* maxresdefault does not exist for every upload, and YouTube answers with a
   120x90 grey placeholder rather than an error — so a bad maxres never fires
   onError. Detect it by natural size on load and swap to hqdefault, which
   always exists. Attach to BOTH onLoad and onError. */
export const guardThumb = (yt) => (event) => {
  const img = event.currentTarget;
  if (img.dataset.swapped) return;
  if (event.type === "load" && img.naturalWidth > 320) return;
  img.dataset.swapped = "1";
  img.src = thumb(yt, false);
};

export const embed = (yt) =>
  `https://www.youtube.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1`;

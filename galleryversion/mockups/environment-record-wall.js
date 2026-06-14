(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileShell = matchMedia("(max-width: 899px), (pointer: coarse)");
  const desktopParallax = matchMedia("(min-width: 900px) and (pointer: fine)").matches && !reduced;
  const stage = document.getElementById("stage");
  const wall = document.getElementById("wall");
  const mobile = document.getElementById("mobileIndex");
  const focusLabel = document.getElementById("focusLabel");
  const root = document.documentElement;

  const records = [
    { slug:"director-reel", code:"REC.00", title:"Director Reel", role:"Creative Video Director", client:"Jared McDaniel", year:"2026", yt:"mFeMMMmdW24", tags:["Reel","2026 Cut"], reel:true },
    { slug:"cyberpunk-2077", code:"REC.01", title:"Cyberpunk 2077", role:"Creative Direction", client:"CD Projekt Red", year:"2025", yt:"Hc_t2eTorhI", page:"../work/cyberpunk-2077.html", tags:["Trailer","Campaign"], logo:"cdprojekt.svg", mood:"#ff3d72", soft:"rgba(255,61,114,.14)", world:"Night City grade" },
    { slug:"doom", code:"REC.02", title:"DOOM", role:"Trailer Direction", client:"Bethesda", year:"2025", yt:"0WUnGHJXeHc", page:"../work/doom.html", tags:["Trailer","Gaming"], logo:"bethesda.svg", mood:"#ff6b35", soft:"rgba(255,107,53,.14)", world:"Ember grade" },
    { slug:"fallout-nuka-cola", code:"REC.03", title:"Fallout / Nuka-Cola", role:"Commercial Direction", client:"Bethesda", year:"2025", yt:"VxTBnNhAD3Q", page:"../work/fallout-nuka-cola.html", tags:["Commercial","Brand"], logo:"bethesda.svg", mood:"#cc3333", soft:"rgba(204,51,51,.14)", world:"Nuka broadcast grade" },
    { slug:"witcher", code:"REC.04", title:"The Witcher", role:"Cinematic Direction", client:"CD Projekt Red", year:"2025", yt:"tr1ajPqpuDs", page:"../work/the-witcher.html", tags:["Trailer","Narrative"], logo:"cdprojekt.svg", mood:"#9fc7ff", soft:"rgba(159,199,255,.13)", world:"Candlelight grade" },
    { slug:"corsair-storefront", code:"REC.05", title:"Product Experience", role:"Brand Direction", client:"Corsair", year:"2024", yt:"OZZsRSgG70g", tags:["Product","Commercial"], logo:"corsair.svg" },
    { slug:"corsair-invincible-novablade-pro", code:"REC.06", title:"Novablade Pro", role:"Campaign Direction", client:"CORSAIR", year:"2025", yt:"WcOLQd3IycM", tags:["Product","Commercial"], logo:"corsair.svg" },
    { slug:"corsair-amazon-prime-gaming-week", code:"REC.07", title:"Prime Gaming Week", role:"Campaign Direction", client:"CORSAIR", year:"2025", yt:"x5VkzsCT6eA", tags:["Campaign","Gaming"], logo:"corsair.svg" },
    { slug:"bmw-fanatec-ad", code:"REC.08", title:"BMW Fanatec", role:"Commercial Direction", client:"BMW / Fanatec", year:"2025", yt:"stQ7DVL4PvE", tags:["Commercial","Motorsport"] },
    { slug:"corsair-experience-store", code:"REC.09", title:"Experience Store", role:"Commercial Direction", client:"CORSAIR", year:"2025", yt:"1MzUb4VSi1s", tags:["Commercial","Brand"], logo:"corsair.svg" },
    { slug:"frame-cut", code:"REC.10", title:"Frame Cut", role:"Experimental Edit", client:"Archive", year:"2024", yt:"nAIy3q5myjY", tags:["Music","Edit"] },
    { slug:"amv-flow-edit-lil-baby-intro", code:"REC.11", title:"Flow Edit", role:"Experimental Edit", client:"Archive", year:"2025", yt:"DvQ-cIp07Mg", tags:["AMV","Music"] },
    { slug:"amv-iron-man-edit", code:"REC.12", title:"Iron Man Study", role:"Experimental Edit", client:"Archive", year:"2025", yt:"oB9go7Dd1d0", tags:["AMV","Character"] },
    { slug:"el-beeper-luffy-amv", code:"REC.13", title:"Luffy Study", role:"Experimental Edit", client:"Archive", year:"2025", yt:"KAl31zPic9Y", tags:["AMV","Anime"] },
    { slug:"ashfall", code:"REC.14", title:"Ashfall", role:"Short Film Direction", client:"Independent", year:"2024", yt:"Nf_lDTJCl2w", tags:["Narrative","Short"] },
    { slug:"kairi-animation-storyboard", code:"REC.15", title:"Kairi", role:"Animation Direction", client:"Independent", year:"2025", yt:"mpTbAcvWflA", tags:["Storyboard","Animation"] },
    { slug:"shugo-samurai-trailer-ad", code:"REC.16", title:"Shugo Samurai", role:"Trailer Direction", client:"Shugo Samurai", year:"2025", yt:"Lpeyg7lq_DY", tags:["Trailer","Ad"] },
    { slug:"silent-collapse", code:"REC.17", title:"Silent Collapse", role:"Experimental Direction", client:"Independent", year:"2024", yt:"Yj2ncYs0vGU", tags:["Narrative","Music"] }
  ];

  const flagOrder = ["director-reel","cyberpunk-2077","doom","witcher","fallout-nuka-cola"];
  const thumb = id => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  function logo(rec) {
    return rec.logo ? `../images/logos/${rec.logo}` : "";
  }

  function card(rec) {
    const el = document.createElement(rec.page ? "a" : "button");
    el.className = "rw-card";
    el.dataset.slug = rec.slug;
    if (rec.page) {
      el.href = rec.page;
      el.draggable = false;
    } else {
      el.type = "button";
      el.addEventListener("click", () => window.open(`https://youtu.be/${rec.yt}`, "_blank", "noopener"));
    }
    const logoSrc = logo(rec);
    el.innerHTML = `
      <img src="${thumb(rec.yt)}" alt="${rec.title} still" loading="lazy" decoding="async" draggable="false">
      <span class="shade" aria-hidden="true"></span>
      <span class="c-top">${logoSrc ? `<img class="c-logo" src="${logoSrc}" alt="">` : `<span class="c-logotext">${rec.client}</span>`}<span class="c-code">${rec.code}</span></span>
      <span class="c-tally" aria-hidden="true">Rec</span>
      <span class="c-bottom">
        <span class="c-title">${rec.title}</span>
        <span class="c-expand">
          <span class="c-role">${rec.role} / ${rec.client} / ${rec.year}</span>
          <span class="c-tags">${rec.tags.slice(0, 3).map(t => `<span>${t}</span>`).join("")}</span>
        </span>
      </span>`;
    return el;
  }

  let cols = [];
  let colCenters = [];
  let wallW = 0;
  let bound = 0;
  let curveK = 0.03;

  function layout(n, vw, vh) {
    const gap = 24;
    const stageH = Math.max(340, vh - 300);
    let rows = n <= 24 ? 3 : n <= 46 ? 4 : 5;
    const spread = 1.5 + Math.min(n, 60) / 60 * 0.6;
    let colsN;
    let colW;
    for (;;) {
      colsN = Math.ceil(n / rows);
      colW = (vw * spread - gap * (colsN - 1)) / colsN;
      colW = Math.max(230, Math.min(430, colW));
      const colH = rows * (colW * 9 / 16) + (rows - 1) * gap;
      if (colH <= stageH || rows === 3) break;
      rows--;
    }
    colW = Math.min(colW, ((stageH - (rows - 1) * gap) / rows) * 16 / 9);
    return { rows, cols: colsN, colW, gap, spread };
  }

  function buildWall() {
    if (!wall) return;
    const n = records.length;
    const L = layout(n, innerWidth, innerHeight);
    const order = [...Array(L.cols).keys()].sort((a, b) => Math.abs(a - (L.cols - 1) / 2) - Math.abs(b - (L.cols - 1) / 2));
    const counts = new Array(L.cols).fill(L.rows);
    let excess = L.cols * L.rows - n;
    const trim = [...order].reverse();
    let t = 0;
    while (excess > 0) {
      const c = trim[t % trim.length];
      if (counts[c] > 1) {
        counts[c]--;
        excess--;
      }
      t++;
    }
    const mid = Math.floor((L.rows - 1) / 2);
    const slotRows = count => {
      const seq = [mid];
      for (let d = 1; seq.length < L.rows; d++) {
        if (mid - d >= 0) seq.push(mid - d);
        if (mid + d < L.rows) seq.push(mid + d);
      }
      return seq.slice(0, count);
    };
    const bySlug = Object.fromEntries(records.map(r => [r.slug, r]));
    const ordered = [
      ...flagOrder.map(s => bySlug[s]).filter(Boolean),
      ...records.filter(r => !flagOrder.includes(r.slug))
    ];
    const cells = Array.from({ length: L.cols }, () => ({}));
    let idx = 0;
    for (let ring = 0; ring < L.rows && idx < n; ring++) {
      for (const c of order) {
        const rowsHere = slotRows(counts[c]);
        if (ring >= rowsHere.length) continue;
        cells[c][rowsHere[ring]] = ordered[idx++];
        if (idx >= n) break;
      }
    }
    wall.innerHTML = "";
    wall.style.setProperty("--col-w", `${L.colW.toFixed(1)}px`);
    wall.style.setProperty("--wall-gap", `${L.gap}px`);
    for (let c = 0; c < L.cols; c++) {
      const col = document.createElement("div");
      col.className = "col";
      Object.keys(cells[c]).map(Number).sort((a, b) => a - b).forEach(rIdx => {
        const rec = cells[c][rIdx];
        const cell = document.createElement("div");
        cell.className = `cell ${rIdx === mid ? "row-mid" : "row-edge"}${rec.reel ? " is-reel" : ""}`;
        cell.appendChild(card(rec));
        col.appendChild(cell);
      });
      wall.appendChild(col);
    }
    cols = [...wall.querySelectorAll(".col")];
    curveK = (38 + (L.spread - 1.5) * 26) / (innerWidth * 0.6);
    requestAnimationFrame(measure);
  }

  function measure() {
    wallW = wall.scrollWidth;
    bound = Math.max(0, (wallW - innerWidth) / 2 + 120);
    colCenters = cols.map(c => c.offsetLeft + c.offsetWidth / 2);
    wall.style.marginTop = `${-(wall.offsetHeight / 2)}px`;
  }

  let wallX = 0;
  let wallXT = 0;
  let vel = 0;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;
  let dragDist = 0;
  let pitch = 0;
  let pitchT = 0;
  let focusCard = null;
  let lastInput = performance.now();
  let wallBound = false;
  let desktopStarted = false;

  function recOf(el) {
    return records.find(r => r.slug === el.dataset.slug);
  }

  function pick(x, y) {
    let best = null;
    let bestD = Infinity;
    for (const el of wall.querySelectorAll(".rw-card")) {
      const r = el.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
      const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
      if (d < bestD) {
        bestD = d;
        best = el;
      }
    }
    return best;
  }

  function setFocus(el) {
    if (focusCard === el) return;
    if (focusCard) focusCard.classList.remove("focus");
    focusCard = el;
    wall.classList.toggle("has-focus", !!el);
    stage.style.cursor = el ? "pointer" : "";
    if (!el) {
      root.style.setProperty("--mood", "#6f8cff");
      root.style.setProperty("--mood-soft", "rgba(111,140,255,.13)");
      if (focusLabel) focusLabel.textContent = "Archive plane / environment study";
      return;
    }
    el.classList.add("focus");
    const rec = recOf(el);
    if (!rec) return;
    if (rec.mood) {
      root.style.setProperty("--mood", rec.mood);
      root.style.setProperty("--mood-soft", rec.soft);
    }
    if (focusLabel) focusLabel.textContent = `${rec.code} / ${rec.title} / ${rec.role}${rec.world ? " / " + rec.world : ""}`;
  }

  function frame(now) {
    if (!dragging && now - lastInput > 4200) wallXT += Math.sin(now * 0.00018) * 0.18;
    wallXT = Math.max(-bound, Math.min(bound, wallXT));
    wallX += (wallXT - wallX) * (dragging ? 0.32 : 0.075);
    pitch += (pitchT - pitch) * 0.06;
    wall.style.marginLeft = `${-wallW / 2 + wallX}px`;
    const wallLeft = innerWidth / 2 - wallW / 2 + wallX;
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      const screenX = wallLeft + colCenters[i];
      let a = (screenX - innerWidth / 2) * curveK;
      a = Math.max(-40, Math.min(40, a));
      col.style.transform = `rotateX(${pitch}deg) rotateY(${-a}deg) translateZ(${-Math.abs(a) * 12}px)`;
      col.style.setProperty("--shade", Math.min(0.55, Math.abs(a) / 40 * 0.55).toFixed(3));
    }
    requestAnimationFrame(frame);
  }

  function bindWall() {
    if (!stage || wallBound) return;
    wallBound = true;
    stage.addEventListener("pointerdown", e => {
      dragging = true;
      stage.classList.add("dragging");
      lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      dragDist = 0;
      lastInput = lastT;
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", e => {
      lastInput = performance.now();
      pitchT = ((e.clientY / innerHeight) - 0.5) * -3;
      if (dragging) {
        const dx = e.clientX - lastX;
        const now = performance.now();
        dragDist += Math.abs(dx);
        wallXT += dx;
        vel = dx / Math.max(now - lastT, 1) * 16;
        lastX = e.clientX;
        lastT = now;
        if (dragDist > 8) setFocus(null);
      } else {
        setFocus(pick(e.clientX, e.clientY));
      }
    });
    addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("dragging");
      wallXT += vel * 14;
    });
    stage.addEventListener("pointerleave", () => {
      if (!dragging) setFocus(null);
    });
    stage.addEventListener("click", e => {
      if (dragDist > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
    wall.addEventListener("focusin", e => {
      const el = e.target.closest(".rw-card");
      if (!el) return;
      const r = el.getBoundingClientRect();
      wallXT += innerWidth / 2 - (r.left + r.width / 2);
      setFocus(el);
    });
    let resizeT;
    addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        if (mobileShell.matches) return;
        wallX = wallXT = 0;
        buildWall();
      }, 220);
    });
  }

  function mobileCard(rec) {
    const el = document.createElement(rec.page ? "a" : "button");
    el.className = flagOrder.includes(rec.slug) ? "mobile-card" : "mobile-row";
    if (rec.page) el.href = rec.page;
    else {
      el.type = "button";
      el.addEventListener("click", () => window.open(`https://youtu.be/${rec.yt}`, "_blank", "noopener"));
    }
    if (flagOrder.includes(rec.slug)) {
      const logoSrc = logo(rec);
      el.innerHTML = `
        <img src="${thumb(rec.yt)}" alt="${rec.title} still" loading="lazy" decoding="async">
        <span class="c-top">${logoSrc ? `<img class="c-logo" src="${logoSrc}" alt="">` : `<span class="c-logotext">${rec.client}</span>`}<span class="c-code">${rec.code}</span></span>
        <span class="c-bottom"><span class="c-title">${rec.title}</span><span class="c-role">${rec.role} / ${rec.year}</span></span>`;
    } else {
      el.innerHTML = `
        <span class="mobile-thumb"><img src="${thumb(rec.yt)}" alt="${rec.title} still" loading="lazy" decoding="async"></span>
        <span class="mobile-meta"><span class="m-title">${rec.title}</span><span class="m-role">${rec.role} / ${rec.year}</span></span>
        <span class="m-code">${rec.code}</span>`;
    }
    return el;
  }

  function buildMobile() {
    if (!mobile) return;
    mobile.innerHTML = "";
    const head = document.createElement("div");
    head.className = "mobile-head";
    head.innerHTML = `
      <div class="mobile-kicker">Director archive / environment study</div>
      <p class="mobile-statement">Mobile keeps the same weighted index and receives only the static depth grade.</p>`;
    mobile.appendChild(head);
    const f = document.createElement("div");
    f.className = "mobile-section";
    f.textContent = "Flagship records";
    mobile.appendChild(f);
    records.filter(r => flagOrder.includes(r.slug)).forEach(r => mobile.appendChild(mobileCard(r)));
    const a = document.createElement("div");
    a.className = "mobile-section";
    a.textContent = "The archive";
    mobile.appendChild(a);
    records.filter(r => !flagOrder.includes(r.slug)).forEach(r => mobile.appendChild(mobileCard(r)));
  }

  function startParallax() {
    if (!desktopParallax) return;
    const target = { x:0, y:0 };
    const current = { x:0, y:0 };
    addEventListener("pointermove", e => {
      target.x = (e.clientX / innerWidth - 0.5) * 2;
      target.y = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive:true });
    function tick() {
      current.x += (target.x - current.x) * 0.075;
      current.y += (target.y - current.y) * 0.075;
      root.style.setProperty("--p-far-x", `${(-current.x * 4).toFixed(2)}px`);
      root.style.setProperty("--p-far-y", `${(-current.y * 3).toFixed(2)}px`);
      root.style.setProperty("--p-mid-x", `${(-current.x * 9).toFixed(2)}px`);
      root.style.setProperty("--p-mid-y", `${(-current.y * 6).toFixed(2)}px`);
      root.style.setProperty("--p-near-x", `${(-current.x * 15).toFixed(2)}px`);
      root.style.setProperty("--p-near-y", `${(-current.y * 9).toFixed(2)}px`);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function startDesktop() {
    if (desktopStarted || mobileShell.matches) return;
    desktopStarted = true;
    buildWall();
    bindWall();
    startParallax();
    requestAnimationFrame(frame);
  }

  buildMobile();
  startDesktop();
  if (mobileShell.addEventListener) {
    mobileShell.addEventListener("change", startDesktop);
  } else {
    mobileShell.addListener(startDesktop);
  }
})();

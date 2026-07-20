/* ==========================================================================
   Understanding Module Descriptors — Course engine
   Vanilla JS, no dependencies. Works from file:// or any static host.
   Persists progress, reflections, and quiz results to localStorage.
   ========================================================================== */
(function () {
  "use strict";

  var STORE_KEY = "umd-course-v1";
  var LESSONS = [
    { id: 0, label: "Welcome & orientation" },
    { id: 1, label: "What is a module descriptor" },
    { id: 2, label: "Learning outcomes" },
    { id: 3, label: "NFQ levels" },
    { id: 4, label: "ECTS credits & workload" },
    { id: 5, label: "Bringing it together" },
    { id: 6, label: "Summary & final quiz" }
  ];

  /* ---------- persistence ---------- */
  var state = load();
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  state.visited = state.visited || {};
  state.answers = state.answers || {};
  state.reflections = state.reflections || {};
  state.theme = state.theme || "";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- build nav ---------- */
  var navEl = $("#nav");
  LESSONS.forEach(function (l) {
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.className = "nav__item";
    btn.setAttribute("data-goto", l.id);
    btn.innerHTML =
      '<span class="nav__num"><span>' + (l.id) + "</span></span>" +
      '<span class="nav__label">' + l.label + "</span>";
    btn.addEventListener("click", function () { goTo(l.id); closeSidebar(); });
    li.appendChild(btn);
    navEl.appendChild(li);
  });
  var navItems = $$(".nav__item");

  /* ---------- navigation ---------- */
  var lessons = $$(".lesson");
  var current = state.current != null ? state.current : 0;

  function goTo(i) {
    i = Math.max(0, Math.min(LESSONS.length - 1, i));
    current = i;
    state.current = i;
    state.visited[i] = true;
    lessons.forEach(function (sec) {
      sec.classList.toggle("is-active", +sec.getAttribute("data-lesson") === i);
    });
    navItems.forEach(function (n, idx) {
      n.classList.toggle("is-active", idx === i);
    });
    $("#topTitle").textContent = LESSONS[i].label;
    $("#scroll").scrollTop = 0;
    window.scrollTo(0, 0);
    updateProgress();
    save();
  }

  function updateProgress() {
    var done = 0;
    LESSONS.forEach(function (l) {
      var isDone = !!state.visited[l.id];
      // A lesson counts as "done" once visited (and, for the final, completed)
      navItems[l.id].classList.toggle("is-done", isDone && l.id !== current || (isDone && state.completed && l.id === 6));
      if (isDone) done++;
    });
    // Mark all-but-current visited lessons done
    navItems.forEach(function (n, idx) {
      n.classList.toggle("is-done", !!state.visited[idx] && idx !== current);
    });
    var pct = Math.round((countVisited() / LESSONS.length) * 100);
    $("#progressFill").style.width = pct + "%";
    $("#progressPct").textContent = pct + "%";
  }
  function countVisited() {
    return LESSONS.filter(function (l) { return state.visited[l.id]; }).length;
  }

  // prev / next buttons
  $$("[data-next]").forEach(function (b) {
    b.addEventListener("click", function () { goTo(current + 1); });
  });
  $$("[data-prev]").forEach(function (b) {
    b.addEventListener("click", function () { goTo(current - 1); });
  });

  // keyboard arrows
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft") goTo(current - 1);
  });

  /* ---------- sidebar (mobile) ---------- */
  var sidebar = $("#sidebar"), backdrop = $("#backdrop");
  function openSidebar() { sidebar.classList.add("open"); backdrop.classList.add("show"); }
  function closeSidebar() { sidebar.classList.remove("open"); backdrop.classList.remove("show"); }
  $("#menuBtn").addEventListener("click", openSidebar);
  backdrop.addEventListener("click", closeSidebar);

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  if (state.theme) root.setAttribute("data-theme", state.theme);
  function currentlyDark() {
    return state.theme === "dark" ||
      (!state.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function syncThemeLabel() {
    var lbl = $("#themeLabel"), ic = $("#themeIcon");
    if (lbl) lbl.textContent = currentlyDark() ? "Switch to light mode" : "Switch to dark mode";
    if (ic) ic.textContent = currentlyDark() ? "☀" : "☾";
  }
  function toggleTheme() {
    state.theme = currentlyDark() ? "light" : "dark";
    root.setAttribute("data-theme", state.theme);
    save();
    syncThemeLabel();
  }
  ["#themeBtn", "#themeBtnSide"].forEach(function (sel) {
    var b = $(sel);
    if (b) b.addEventListener("click", toggleTheme);
  });
  syncThemeLabel();

  /* ==========================================================================
     Knowledge checks (single-answer MCQ / TF)
     ========================================================================== */
  $$(".kc[data-type='single']").forEach(function (kc) {
    var id = kc.getAttribute("data-kc");
    var opts = $$(".opt", kc);
    var feedback = $(".kc__feedback", kc);
    var retry = $(".kc__retry", kc);

    function lock(chosen) {
      var correctBtn = opts.filter(function (o) { return o.hasAttribute("data-correct"); })[0];
      var isCorrect = chosen.hasAttribute("data-correct");
      opts.forEach(function (o) {
        o.disabled = true;
        if (o === correctBtn) o.classList.add("is-correct");
        else if (o === chosen) o.classList.add("is-wrong");
        else o.classList.add("is-dim");
      });
      feedback.className = "kc__feedback show " + (isCorrect ? "good" : "bad");
      feedback.innerHTML = "<strong>" + (isCorrect ? "Correct" : "Not quite") + "</strong>" +
        (isCorrect ? feedback.getAttribute("data-good") : feedback.getAttribute("data-bad"));
      retry.classList.toggle("show", !isCorrect);
      state.answers[id] = { chosen: chosen.getAttribute("data-opt"), correct: isCorrect };
      save();
      updateFinalScore();
    }

    opts.forEach(function (o) {
      o.addEventListener("click", function () { if (!o.disabled) lock(o); });
    });
    retry.addEventListener("click", function () {
      opts.forEach(function (o) {
        o.disabled = false;
        o.classList.remove("is-correct", "is-wrong", "is-dim");
      });
      feedback.className = "kc__feedback";
      retry.classList.remove("show");
      delete state.answers[id];
      save();
      updateFinalScore();
    });

    // restore
    var saved = state.answers[id];
    if (saved) {
      var btn = opts.filter(function (o) { return o.getAttribute("data-opt") === saved.chosen; })[0];
      if (btn) lock(btn);
    }
  });

  /* ---------- final quiz score ---------- */
  function updateFinalScore() {
    var finals = ["f1", "f2", "f3", "f4"];
    var answered = finals.filter(function (f) { return state.answers[f]; });
    var correct = finals.filter(function (f) { return state.answers[f] && state.answers[f].correct; });
    var el = $("#finalScore");
    if (!el) return;
    if (answered.length === 0) {
      el.textContent = "Answer the four questions above to see your score.";
    } else {
      el.innerHTML = "Final quiz score: <b>" + correct.length + " / " + finals.length + "</b>" +
        (answered.length < finals.length ? " · " + (finals.length - answered.length) + " unanswered" : "");
    }
  }

  /* ==========================================================================
     Reflections
     ========================================================================== */
  $$("[data-reflect]").forEach(function (r) {
    var id = r.getAttribute("data-reflect");
    var ta = $("textarea", r);
    var btn = $(".reflect__save", r);
    if (state.reflections[id]) ta.value = state.reflections[id];
    function persist() {
      state.reflections[id] = ta.value;
      save();
    }
    ta.addEventListener("input", persist);
    btn.addEventListener("click", function () {
      persist();
      var original = btn.textContent;
      btn.textContent = "✓ Saved";
      setTimeout(function () { btn.textContent = original; }, 1400);
    });
  });

  /* ==========================================================================
     Matching (Bloom) — drag & drop with tap fallback
     ========================================================================== */
  (function () {
    var wrap = $("[data-match='bloom']");
    if (!wrap) return;
    var tokens = $$(".token", wrap);
    var drops = $$(".drop", wrap);
    var selected = null; // for tap mode

    function placeToken(token, drop) {
      // clear any existing token on this drop
      var slot = $(".drop__slot", drop);
      var existing = $(".drop__chip", slot);
      if (existing) {
        var freed = tokens.filter(function (t) { return t.getAttribute("data-token") === existing.getAttribute("data-token"); })[0];
        if (freed) freed.classList.remove("placed");
      }
      slot.innerHTML = "";
      var chip = document.createElement("span");
      chip.className = "drop__chip";
      chip.setAttribute("data-token", token.getAttribute("data-token"));
      chip.textContent = token.textContent;
      chip.title = "Click to remove";
      chip.addEventListener("click", function () {
        token.classList.remove("placed");
        slot.innerHTML = "";
        drop.classList.remove("correct", "incorrect");
        clearScore();
      });
      slot.appendChild(chip);
      token.classList.add("placed");
      drop.classList.remove("correct", "incorrect");
      clearScore();
    }

    // desktop drag
    tokens.forEach(function (t) {
      t.addEventListener("dragstart", function (e) {
        t.classList.add("dragging");
        e.dataTransfer.setData("text/plain", t.getAttribute("data-token"));
      });
      t.addEventListener("dragend", function () { t.classList.remove("dragging"); });
      // tap / click to select
      t.addEventListener("click", function () {
        if (t.classList.contains("placed")) return;
        if (selected === t) { t.style.outline = ""; selected = null; return; }
        tokens.forEach(function (x) { x.style.outline = ""; });
        selected = t;
        t.style.outline = "2px solid var(--brand)";
      });
    });
    drops.forEach(function (d) {
      d.addEventListener("dragover", function (e) { e.preventDefault(); d.classList.add("over"); });
      d.addEventListener("dragleave", function () { d.classList.remove("over"); });
      d.addEventListener("drop", function (e) {
        e.preventDefault();
        d.classList.remove("over");
        var key = e.dataTransfer.getData("text/plain");
        var token = tokens.filter(function (t) { return t.getAttribute("data-token") === key; })[0];
        if (token) placeToken(token, d);
      });
      d.addEventListener("click", function () {
        if (selected) {
          placeToken(selected, d);
          selected.style.outline = "";
          selected = null;
        }
      });
    });

    var scoreEl = $("[data-matchscore]", wrap);
    function clearScore() { scoreEl.textContent = ""; }

    $("[data-check]", wrap).addEventListener("click", function () {
      var right = 0, total = drops.length, filled = 0;
      drops.forEach(function (d) {
        var chip = $(".drop__chip", d);
        d.classList.remove("correct", "incorrect");
        if (!chip) return;
        filled++;
        if (chip.getAttribute("data-token") === d.getAttribute("data-accept")) {
          d.classList.add("correct"); right++;
        } else {
          d.classList.add("incorrect");
        }
      });
      if (filled < total) {
        scoreEl.textContent = "Place all six verbs first (" + filled + "/" + total + ")";
      } else {
        scoreEl.textContent = right + " / " + total + " correct" + (right === total ? " — perfect!" : "");
      }
    });
    $("[data-reset]", wrap).addEventListener("click", function () {
      drops.forEach(function (d) { $(".drop__slot", d).innerHTML = ""; d.classList.remove("correct", "incorrect"); });
      tokens.forEach(function (t) { t.classList.remove("placed"); t.style.outline = ""; });
      selected = null;
      clearScore();
    });
  })();

  /* ==========================================================================
     Tabs (NFQ)
     ========================================================================== */
  $$("[data-tabs]").forEach(function (tabs) {
    var btns = $$(".tabs__btn", tabs);
    var panels = $$(".tabs__panel", tabs);
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-tab");
        btns.forEach(function (x) { x.classList.toggle("is-active", x === b); });
        panels.forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-panel") === k); });
      });
    });
  });

  /* ==========================================================================
     Accordion
     ========================================================================== */
  $$("[data-accordion] .acc").forEach(function (acc) {
    $(".acc__head", acc).addEventListener("click", function () {
      acc.classList.toggle("open");
    });
  });

  /* ==========================================================================
     ECTS calculator
     ========================================================================== */
  (function () {
    var wrap = $("[data-calc]");
    if (!wrap) return;
    var credits = $("#credits"), hpc = $("#hpc"), contact = $("#contact");
    function render() {
      var c = +credits.value, h = +hpc.value, ct = +contact.value;
      var total = c * h;
      var indep = total - ct;
      $("#creditsVal").textContent = c;
      $("#hpcVal").textContent = h;
      $("#contactVal").textContent = ct;
      $("#totalOut").textContent = total;
      var indepEl = $("#indepOut");
      var note = $("#calcNote");
      if (indep < 0) {
        indepEl.textContent = "—";
        note.innerHTML = '<span class="calc__warn">Contact hours exceed total effort — check your figures.</span>';
      } else {
        indepEl.textContent = indep;
        note.innerHTML = c + " credits × " + h + " hours = " + total +
          " total hours, minus " + ct + " contact hours = <strong>" + indep + " hours</strong> on their own.";
      }
    }
    [credits, hpc, contact].forEach(function (el) { el.addEventListener("input", render); });
    render();
  })();

  /* ==========================================================================
     Completion / restart
     ========================================================================== */
  var finishBtn = $("#finishBtn");
  if (finishBtn) {
    if (state.completed) finishBtn.textContent = "✓ Course completed";
    finishBtn.addEventListener("click", function () {
      state.completed = true;
      finishBtn.textContent = "✓ Course completed";
      save();
      updateProgress();
    });
  }
  var restartBtn = $("#restartBtn");
  if (restartBtn) restartBtn.addEventListener("click", function () { goTo(0); });

  /* ---------- init ---------- */
  goTo(current);
  updateFinalScore();
})();

/* ==========================================================================
   Understanding Module Descriptors — Extra interactions (Phase 2)
   New activities that emit tracking events via Course core.
   Each is a self-contained IIFE and a no-op if its markup isn't present.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.Course;
  var $ = C.$, $$ = C.$$;
  var emit = C.emit, state = C.state;

  /* ==========================================================================
     §4 — Workload budget: build an assessment plan within 76 independent hours
     ========================================================================== */
  (function () {
    var wrap = $("[data-budget]");
    if (!wrap) return;
    var BUDGET = 76;
    var items = $$(".budget__item", wrap);
    var fill = $("#budgetFill"), usedEl = $("#budgetUsed"), statusEl = $("#budgetStatus");
    var touched = false;

    // restore
    var saved = (state.interactions["workload-budget"] || {}).on || {};
    items.forEach(function (it, i) { if (saved[i]) it.classList.add("on"); });

    function render() {
      var used = 0, on = {};
      items.forEach(function (it, i) {
        if (it.classList.contains("on")) { used += +it.getAttribute("data-hours"); on[i] = true; }
      });
      var pct = Math.min(100, (used / BUDGET) * 100);
      var over = used > BUDGET;
      fill.style.width = pct + "%";
      fill.classList.toggle("over", over);
      usedEl.textContent = used + " h";
      if (used === 0) { statusEl.textContent = ""; statusEl.className = "budget__status"; }
      else if (over) { statusEl.textContent = "⚠ " + (used - BUDGET) + " h over budget"; statusEl.className = "budget__status is-over"; }
      else { statusEl.textContent = "✓ " + (BUDGET - used) + " h to spare"; statusEl.className = "budget__status is-ok"; }
      state.interactions["workload-budget"] = { on: on, used: used, over: over };
      C.saveSoon();
    }

    items.forEach(function (it) {
      it.addEventListener("click", function () {
        it.classList.toggle("on");
        render();
        if (!touched) { touched = true; emit("interaction.complete", { id: "workload-budget" }); }
      });
    });
    render();
  })();

  /* ==========================================================================
     §5 — Readiness checklist: tick confidence, build a 0–4 readiness score
     ========================================================================== */
  (function () {
    var wrap = $("[data-readiness]");
    if (!wrap) return;
    var boxes = $$('input[type="checkbox"]', wrap);
    var ring = $("#readyRing"), scoreEl = $("#readyScore"), msg = $("#readyMsg");
    var MSGS = [
      "Tick what you're confident about to see your readiness.",
      "A good start — one habit in place.",
      "Halfway there — you're building the method.",
      "Nearly there — three of four in hand.",
      "Descriptor-ready. You've got the full method. 🎓"
    ];
    var touched = false;

    var saved = (state.interactions["readiness"] || {}).checked || [];
    boxes.forEach(function (b, i) { if (saved[i]) b.checked = true; });

    function render() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      var pct = (n / boxes.length) * 100;
      scoreEl.textContent = n + "/" + boxes.length;
      ring.style.setProperty("--pct", pct + "%");
      ring.classList.toggle("full", n === boxes.length);
      msg.textContent = MSGS[n];
      state.interactions["readiness"] = { checked: boxes.map(function (b) { return b.checked; }), score: n };
      C.saveSoon();
    }
    boxes.forEach(function (b) {
      b.addEventListener("change", function () {
        render();
        if (!touched) { touched = true; emit("interaction.complete", { id: "readiness" }); }
      });
    });
    render();
  })();
})();

/* RMF Convention 2026 — interactive glass calendar & validation */
(function () {
  "use strict";

  /* ── Entrance: card + staggered reveals ── */
  window.addEventListener("load", function () {
    var card = document.getElementById("card");
    if (card) card.classList.add("in");

    document.querySelectorAll(".reveal").forEach(function (el) {
      setTimeout(function () { el.classList.add("in"); },
                 parseInt(el.dataset.delay || 0, 10));
    });
  });

  /* ── Animated dot-map with travelling routes ── */
  var canvas = document.getElementById("dotmap");
  if (canvas) {
    var ctx = canvas.getContext("2d"), dots = [], W = 0, H = 0, startTime = Date.now();
    var routes = [
      { s: { x: 0.18, y: 0.28, d: 0   }, e: { x: 0.55, y: 0.20, d: 2   } },
      { s: { x: 0.55, y: 0.20, d: 2   }, e: { x: 0.80, y: 0.45, d: 4   } },
      { s: { x: 0.30, y: 0.75, d: 1   }, e: { x: 0.62, y: 0.60, d: 3   } },
      { s: { x: 0.85, y: 0.75, d: 0.5 }, e: { x: 0.45, y: 0.85, d: 2.5 } },
      { s: { x: 0.10, y: 0.55, d: 1.5 }, e: { x: 0.40, y: 0.35, d: 3.5 } }
    ];
    function build() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = rect.width; H = canvas.height = rect.height;
      dots = []; var gap = 13;
      for (var x = 0; x < W; x += gap)
        for (var y = 0; y < H; y += gap) {
          var inShape =
            (x < W * .30 && x > W * .06 && y < H * .42 && y > H * .12) ||
            (x < W * .34 && x > W * .16 && y < H * .82 && y > H * .42) ||
            (x < W * .58 && x > W * .34 && y < H * .38 && y > H * .14) ||
            (x < W * .86 && x > W * .58 && y < H * .55 && y > H * .18) ||
            (x < W * .90 && x > W * .72 && y < H * .84 && y > H * .62);
          if (inShape && Math.random() > 0.32)
            dots.push({ x: x, y: y, o: Math.random() * .45 + .15,
                        p: Math.random() * Math.PI * 2 });
        }
    }
    function frame() {
      var t = (Date.now() - startTime) / 1000;
      if (t > 20) startTime = Date.now();
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i], tw = d.o + Math.sin(t * 1.6 + d.p) * .12;
        ctx.beginPath(); ctx.arc(d.x, d.y, 1.2, 0, 6.283);
        ctx.fillStyle = "rgba(212,175,55," + Math.max(tw, .05) + ")"; ctx.fill();
      }
      routes.forEach(function (r) {
        var el = t - r.s.d; if (el <= 0) return;
        var p = Math.min(el / 3, 1);
        var sx = r.s.x * W, sy = r.s.y * H, ex = r.e.x * W, ey = r.e.y * H;
        var x = sx + (ex - sx) * p, y = sy + (ey - sy) * p;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(x, y);
        ctx.strokeStyle = "rgba(232,206,122,.55)"; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.beginPath(); ctx.arc(sx, sy, 2.4, 0, 6.283);
        ctx.fillStyle = "#e8ce7a"; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.283);
        ctx.fillStyle = "rgba(232,206,122,.22)"; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.283);
        ctx.fillStyle = "#fff3cf"; ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    new ResizeObserver(build).observe(canvas.parentElement);
    build(); frame();
  }

  /* ── Countdown ── */
  var target = new Date("2026-11-13T08:00:00+01:00").getTime();
  function cd() {
    var ms = Math.max(target - Date.now(), 0);
    function set(id, v) { var e = document.getElementById(id); if (e) e.textContent = String(v).padStart(2, "0"); }
    set("cd-d", Math.floor(ms / 864e5));
    set("cd-h", Math.floor(ms / 36e5) % 24);
    set("cd-m", Math.floor(ms / 6e4) % 60);
    set("cd-s", Math.floor(ms / 1e3) % 60);
  }
  cd(); setInterval(cd, 1000);

  /* ── DOB Glassmorphism Calendar Picker ── */
  document.addEventListener("DOMContentLoaded", function () {
    var MONTHS = ["January","February","March","April","May","June","July",
                  "August","September","October","November","December"];
    var dob = document.getElementById("dob"),
      toggle = document.querySelector(".dob-toggle-btn"),
      cal = document.getElementById("dob-popover"),
      daysEl = document.getElementById("cal-days-grid"),
        monthSelect = document.getElementById("cal-month-select"),
        yearSelect = document.getElementById("cal-year-select"),
      viewY = 2012, viewM = 0,
        MINY = 1940, MAXY = 2012;

    if (!dob || !toggle || !cal || !daysEl) return;

    if (monthSelect && yearSelect) {
      monthSelect.innerHTML = "";
      yearSelect.innerHTML = "";
      MONTHS.forEach(function (m, idx) {
        var opt = document.createElement("option");
        opt.value = idx; opt.textContent = m;
        monthSelect.appendChild(opt);
      });
      for (var y = MAXY; y >= MINY; y--) {
        var opt = document.createElement("option");
        opt.value = y; opt.textContent = y;
        yearSelect.appendChild(opt);
      }
    }

    function renderCal() {
      if (monthSelect) monthSelect.value = viewM;
      if (yearSelect) yearSelect.value = viewY;

      daysEl.innerHTML = "";
      var first = new Date(viewY, viewM, 1).getDay(),
          n = new Date(viewY, viewM + 1, 0).getDate(), i, b;

      for (i = 0; i < first; i++) daysEl.appendChild(document.createElement("span"));

      for (i = 1; i <= n; i++) {
        b = document.createElement("button");
        b.type = "button"; b.className = "cal-day"; b.textContent = i;

        (function (dd) {
          b.addEventListener("click", function (e) {
            e.stopPropagation();
            dob.value = viewY + "-" + String(viewM + 1).padStart(2, "0") + "-" +
                        String(dd).padStart(2, "0");
            dob.classList.remove("invalid");
            closeCalendar();
          });
        })(i);
        daysEl.appendChild(b);
      }
    }

    function closeCalendar() {
      cal.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    function openCalendar() {
      cal.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      renderCal();
    }

    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (cal.hidden) openCalendar(); else closeCalendar();
    });
    dob.addEventListener("click", openCalendar);

    if (monthSelect) {
      monthSelect.addEventListener("change", function (e) {
        viewM = parseInt(e.target.value, 10);
        renderCal();
      });
    }

    if (yearSelect) {
      yearSelect.addEventListener("change", function (e) {
        viewY = parseInt(e.target.value, 10);
        renderCal();
      });
    }

    document.getElementById("cal-prev-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      if (viewM === 0 && viewY === MINY) return;
      viewM--; if (viewM < 0) { viewM = 11; viewY--; } renderCal();
    });
    document.getElementById("cal-next-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      if (viewM === 11 && viewY === MAXY) return;
      viewM++; if (viewM > 11) { viewM = 0; viewY++; } renderCal();
    });
    document.addEventListener("click", function (ev) {
      if (!cal.contains(ev.target) && ev.target !== dob && ev.target !== toggle) closeCalendar();
    });
  });

  /* ── Form validation + submission ── */
  var form = document.getElementById("regForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      ["full_name", "email", "phone", "zone", "area", "dob"].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var bad = !el.value.trim();
        if (id === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) bad = true;
        el.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!form.querySelector('input[name="attendance"]:checked')) {
        ok = false;
        var pills = form.querySelectorAll(".pill span");
        pills.forEach(function (p) { p.style.borderColor = "#c0392b"; });
        setTimeout(function () {
          pills.forEach(function (p) { p.style.borderColor = ""; });
        }, 1600);
      }
      if (!ok) return;

      var btn = document.getElementById("submitBtn");
      if (btn) {
        btn.disabled = true;
        var label = btn.querySelector(".btn-label");
        var spinner = btn.querySelector(".btn-spinner");
        if (label) label.textContent = "Submitting…";
        if (spinner) spinner.hidden = false;
      }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "X-Requested-With": "XMLHttpRequest" },
        credentials: "same-origin"
      }).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
        .then(function (res) {
          if (btn) {
            btn.disabled = false;
            var label = btn.querySelector(".btn-label");
            var spinner = btn.querySelector(".btn-spinner");
            if (label) label.textContent = "Register Now";
            if (spinner) spinner.hidden = true;
          }
          if (res.j.success) {
            var ovText = document.getElementById("ovText");
            var ovCode = document.getElementById("ovCode");
            if (ovText) {
              ovText.textContent = "Thank you" + (res.j.name ? ", " + res.j.name : "") +
                "! Your seat for the Maiden Provincial Convention 2026 is reserved.";
            }
            if (ovCode) {
              ovCode.textContent = "Registration Code: " + res.j.reg_code;
            }
            var ov = document.getElementById("overlay");
            if (ov) {
              ov.hidden = false;
              requestAnimationFrame(function () { ov.classList.add("show"); });
            }
            form.reset();
          } else {
            alert(res.j.message || "Submission failed. Please try again.");
          }
        })
        .catch(function () {
          if (btn) {
            btn.disabled = false;
            var label = btn.querySelector(".btn-label");
            var spinner = btn.querySelector(".btn-spinner");
            if (label) label.textContent = "Register Now";
            if (spinner) spinner.hidden = true;
          }
          alert("Network error. Please check your connection and try again.");
        });
    });
  }

  var ovClose = document.getElementById("ovClose");
  if (ovClose) {
    ovClose.addEventListener("click", function () {
      var ov = document.getElementById("overlay");
      if (ov) {
        ov.classList.remove("show");
        setTimeout(function () { ov.hidden = true; }, 350);
      }
    });
  }
})();
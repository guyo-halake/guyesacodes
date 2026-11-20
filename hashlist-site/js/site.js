/* ConstraintBench example tasks, v2 (18 Nov 2026). Four 2D drawings, one per domain. Each drawing runs as a continuous
   loop, and a red leader line runs from the task's limit in the drawing to the task's title.
   TK.html(k) gives static markup. TK.mountAll(root) adds the motion: only the moving layer redraws each frame, the tabs
   advance with a crossfade until a visitor picks one, motion pauses off screen and resumes where it stopped, and with
   reduced motion the drawing stays still. */
var TK = (function(){
  var W = 640, H = 420, YL = 80, KX = 602, LOOP = 8;
  function n(v){ return (+v).toFixed(1); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  function pts(a){ return a.map(function(p){ return n(p[0]) + ',' + n(p[1]); }).join(' '); }
  function L(x1, y1, x2, y2, c, ex){ return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '" class="' + c + '"' + (ex || '') + '/>'; }
  function R(x, y, w, h, c, rx, ex){ return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '"' + (rx ? ' rx="' + rx + '"' : '') + ' class="' + c + '"' + (ex || '') + '/>'; }
  function Ci(x, y, r, c, ex){ return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" class="' + c + '"' + (ex || '') + '/>'; }
  function PL(a, c, ex){ return '<polyline points="' + pts(a) + '" class="' + c + '"' + (ex || '') + '/>'; }
  function T(x, y, s, c, size, anchor){ return '<text x="' + n(x) + '" y="' + n(y) + '" class="' + (c || 't') + '" font-size="' + (size || 11) + '" text-anchor="' + (anchor || 'start') + '">' + esc(s) + '</text>'; }
  function G(op, s){ return op <= 0.002 ? '' : (op >= 0.998 ? s : '<g opacity="' + op.toFixed(3) + '">' + s + '</g>'); }
  function clamp(v){ return Math.max(0, Math.min(1, v)); }
  function ramp(t, a, b){ return clamp((t - a) / (b - a)); }
  function ease(v){ v = clamp(v); return v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; }
  function bump(t, a, b){ return Math.sin(Math.PI * ramp(t, a, b)); }
  function lerp(a, b, k){ return a + (b - a) * k; }
  function seg(p, i){ return Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); }
  function plen(p){ var s = 0; for (var i = 1; i < p.length; i++) s += seg(p, i); return s; }
  function pat(p, d){ for (var i = 1; i < p.length; i++){ var s = seg(p, i); if (d <= s){ var k = s ? d / s : 0; return [lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]; } d -= s; } return p[p.length - 1].slice(); }
  function part(p, d){ var o = [p[0]]; for (var i = 1; i < p.length; i++){ var s = seg(p, i); if (d >= s){ o.push(p[i]); d -= s; } else { o.push(pat([p[i - 1], p[i]], d)); break; } } return o; }
  /* a trace made of horizontal and vertical segments, clipped to x0..x1 */
  function hv(p, x0, x1, c){
    var d = '', pen = false;
    for (var i = 1; i < p.length; i++){
      var a = p[i - 1], b = p[i];
      if (a[1] === b[1]){
        var l = Math.max(x0, Math.min(a[0], b[0])), r = Math.min(x1, Math.max(a[0], b[0]));
        if (r > l){ var s = a[0] <= b[0] ? l : r, e = a[0] <= b[0] ? r : l; d += (pen ? 'L' : 'M') + n(s) + ' ' + n(a[1]) + 'L' + n(e) + ' ' + n(b[1]); pen = e === b[0]; } else pen = false;
      } else if (a[0] > x0 + 0.5 && a[0] <= x1){ d += (pen ? 'L' : 'M') + n(a[0]) + ' ' + n(a[1]) + 'L' + n(b[0]) + ' ' + n(b[1]); pen = true; } else pen = false;
    }
    return d ? '<path d="' + d + '" class="' + c + '"/>' : '';
  }

  /* ---------------------------------------------------------------- 1. chip design */
  var CP = [[194, 108], [226, 156], [250, 204], [276, 252], [312, 320]], CPL = plen(CP);
  var CELLS = (function(){
    var o = [], seed = 11;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var r = 0; r < 19; r++){
      var y = 100 + r * 12, x = 186 + rnd() * 10;
      while (true){ var w = 6 + Math.round(rnd() * 11); if (x + w > 320) break; o.push([x, y + 2, w]); x += w + 3 + rnd() * 9; }
    }
    return o;
  })();
  var CHIP = {
    tab: 'WhatsApp Commerce', h: 'Odin: Lead qualification, stock lock & M-Pesa STK push.', dot: [558, 246], lab: '400 MHZ', lx: 548, ly: 290, la: 'end',
    base: function(){
      var o = R(24, 44, 330, 330, 'fp', 3), i, q;
      for (i = 0; i < 12; i++){ q = 57 + i * 24; o += R(q - 4, 48, 8, 8, 'lt') + R(q - 4, 362, 8, 8, 'lt'); q = 77 + i * 24; o += R(28, q - 4, 8, 8, 'lt') + R(342, q - 4, 8, 8, 'lt'); }
      o += R(54, 80, 98, 96, 'f', 2) + T(103, 132, 'SRAM', 't2', 11, 'middle') + R(54, 242, 98, 96, 'f', 2) + T(103, 294, 'SRAM', 't2', 11, 'middle');
      o += R(176, 72, 154, 272, 'lt', 2, ' stroke-dasharray="5 4"') + T(322, 89, 'DSP', 't', 10, 'end');
      for (i = 0; i < 20; i++) o += L(184, 100 + i * 12, 322, 100 + i * 12, 'ls');
      CELLS.forEach(function(c){ o += R(c[0], c[1], c[2], 8, 'cl'); });
      o += PL(CP, 'r');
      for (i = 1; i < CP.length - 1; i++) o += R(CP[i][0] - 5, CP[i][1] - 5, 10, 10, 'fr');
      o += R(186, 100, 16, 16, 'fp') + T(180, 112, 'FF', 't', 9, 'end') + R(304, 312, 16, 16, 'fp') + T(312, 304, 'FF', 't', 9, 'middle');
      // timing: clock, launch and capture edges
      o += T(398, 232, 'CLK', 't', 10.5) + PL([[386, 266], [398, 266], [398, 246], [478, 246], [478, 266], [558, 266], [558, 246], [580, 246]], 'l');
      o += L(398, 276, 398, 350, 'ls') + L(558, 238, 558, 350, 'rd') + T(398, 304, 'DATA', 't', 10.5);
      o += T(398, 370, '0', 't', 10, 'middle') + T(558, 370, '2.50 NS', 'tr', 10, 'middle');
      return o;
    },
    dyn: function(t){
      var C = 2.4, u = (t % C) / C, o = '', i;
      for (i = 3; i < CELLS.length; i += 5){ var c = CELLS[i], v = Math.sin(2 * Math.PI * (t / 2.1 + i * 0.173)); if (v > 0.35) o += R(c[0], c[1], c[2], 8, 'fi', 0, ' opacity="' + (0.55 * Math.pow((v - 0.35) / 0.65, 2)).toFixed(2) + '"'); }
      var prog = ease(ramp(u, 0.1, 0.7)), fade = 1 - ramp(u, 0.84, 0.98);
      var lf = bump(u, 0, 0.22), cf = bump(u, 0.66, 0.9);
      if (lf > 0) o += R(186, 100, 16, 16, 'fi', 0, ' opacity="' + lf.toFixed(2) + '"') + L(398, 246, 398, 266, 'ink', ' opacity="' + lf.toFixed(2) + '"');
      if (prog > 0){ o += G(fade, PL(part(CP, CPL * prog), 'ink')); if (prog < 1){ var pp = pat(CP, CPL * prog); o += Ci(pp[0], pp[1], 5, 'fi'); } }
      if (cf > 0) o += R(304, 312, 16, 16, 'fi', 0, ' opacity="' + cf.toFixed(2) + '"');
      var xd = 398 + 64 * 2.38 * prog;
      if (prog > 0) o += G(fade, L(398, 326, xd, 326, 'ink') + Ci(xd, 326, prog >= 1 ? 4 : 3, 'fi'));
      return o;
    }
  };

  /* ---------------------------------------------------------------- 2. RTL: a FIFO between ADC and DMA */
  var FX = 148, SW = 34, DEPTH = 8, STEP = 0.5, OUT = [0, 1, 0, 2, 1, 0, 2, 2], AX0 = 96, AX1 = 560;
  var OCC = (function(){ var a = [3]; for (var s = 0; s < 8; s++) a.push(a[s] - OUT[s] + 1); return a; })();
  function qX(q){ return FX + (DEPTH - 1 - q) * SW + SW / 2; }
  function cY(c){ return 376 - c * 7; }
  var RTL = {
    tab: 'RTL', h: 'Write a FIFO that never drops a sample at the full ADC rate.', dot: [FX + 7 * SW + SW / 2, 114], lab: '8 ENTRIES', lx: FX + 7 * SW + 4, ly: 104, la: 'end',
    base: function(){
      var o = R(24, 110, 84, 62, 'f', 3) + T(66, 145, 'ADC', 't2', 12, 'middle') + T(FX, 104, 'FIFO', 't', 10.5);
      for (var i = 0; i < DEPTH; i++) o += R(FX + i * SW + 2, 114, SW - 4, 54, 'fp', 2);
      o += R(476, 110, 84, 62, 'f', 3) + T(518, 145, 'DMA', 't2', 12, 'middle');
      o += L(108, 141, FX - 2, 141, 'lt') + L(FX + DEPTH * SW + 2, 141, 476, 141, 'lt');
      o += T(24, 258, 'CLK', 't', 10.5) + T(24, 298, 'READ', 't', 10.5) + T(24, 350, 'COUNT', 't', 10.5);
      o += L(AX0, 376, AX1, 376, 'ls') + L(AX0, cY(8), AX1, cY(8), 'rd') + T(AX1, cY(8) - 7, 'FULL', 'tr', 10, 'end');
      return o;
    },
    dyn: function(t){
      var s = Math.floor(t / STEP), f = t / STEP - s, si = s % 8, e = ease(f), o = '', q;
      var occ = OCC[si], out = OUT[si];
      for (q = 0; q < occ; q++){
        if (q < out) o += G(1 - ramp(f, 0.45, 0.85), R(lerp(qX(q), 488, e) - 8, 133, 16, 16, 'fi', 1));
        else o += R(lerp(qX(q), qX(q - out), e) - 8, 133, 16, 16, 'fi', 1);
      }
      o += G(ramp(f, 0, 0.25), R(lerp(118, qX(occ - out), e) - 8, 133, 16, 16, 'fi', 1));
      // logic analyser, newest on the right, ten clocks wide
      var PX = (AX1 - AX0) / 10, ax = function(tau){ return AX1 - (t - tau) / STEP * PX; }, k0 = s - 11, ck = [], rd = [], cn = [], k;
      for (k = k0; k <= s; k++){
        var a = ax(k * STEP), m = ax(k * STEP + STEP / 2), b = ax((k + 1) * STEP), kk = ((k % 8) + 8) % 8, y = OUT[kk] ? 286 : 302;
        ck.push([a, 266], [a, 250], [m, 250], [m, 266], [b, 266]);
        rd.push([a, y], [b, y]);
        cn.push([a, cY(OCC[kk])], [b, cY(OCC[kk])]);
      }
      o += hv(ck, AX0, AX1, 'lt') + hv(rd, AX0, AX1, 'l') + hv(cn, AX0, AX1, 'ink');
      return o;
    }
  };

  /* ---------------------------------------------------------------- 3. CAD: the power path of a motor driver */
  var PP = [[88, 284], [232, 284], [232, 180], [420, 180], [420, 200], [508, 200]], PPL = plen(PP);
  var GATES = [[[452, 266], [452, 111], [394, 111]], [[442, 290], [412, 290], [412, 251], [394, 251]], [[460, 266], [460, 84], [286, 84], [286, 96]], [[442, 304], [246, 304], [246, 251], [262, 251]]];
  var CAD = {
    tab: 'CAD', h: 'Route a 3 A motor driver without overheating the board.', dot: [380, 180], lab: '3 A', lx: 380, ly: 166, la: 'end',
    base: function(){
      var o = R(20, 40, 560, 340, 'fp', 10);
      [[40, 60], [560, 60], [40, 360], [560, 360]].forEach(function(h){ o += Ci(h[0], h[1], 6, 'lt'); });
      GATES.forEach(function(g){ o += PL(g, 'lt'); });
      o += PL([[396, 330], [430, 330], [430, 318], [442, 318]], 'lt') + PL([[396, 342], [470, 342], [470, 318]], 'lt');
      [286, 370].forEach(function(x){ o += L(x, 126, x, 180, 'lt') + L(x, 236, x, 180, 'lt'); });
      o += PL(PP, 'l', ' style="stroke-width:19"') + PL(PP, 'l', ' style="stroke:var(--tk-face);stroke-width:16"');
      o += R(30, 236, 58, 96, 'f', 3) + Ci(59, 262, 11, 'fp') + Ci(59, 306, 11, 'fp') + T(59, 350, '24 V', 't', 10, 'middle');
      o += R(508, 150, 62, 100, 'f', 3) + Ci(539, 176, 11, 'fp') + Ci(539, 224, 11, 'fp') + T(539, 268, 'MOTOR', 't', 10, 'middle');
      o += Ci(130, 118, 24, 'f') + T(130, 122, '+', 't2', 13, 'middle') + Ci(192, 118, 24, 'f') + T(192, 122, '+', 't2', 13, 'middle');
      [[262, 96, 'Q1'], [346, 96, 'Q3'], [262, 236, 'Q2'], [346, 236, 'Q4']].forEach(function(q){ o += R(q[0], q[1], 48, 30, 'f', 2) + T(q[0] + 24, q[1] + 19, q[2], 't2', 10.5, 'middle'); });
      o += R(442, 266, 46, 52, 'f', 2) + T(465, 296, 'DRV', 't2', 10, 'middle');
      o += R(318, 316, 78, 46, 'f', 2) + T(357, 343, 'MCU', 't2', 11, 'middle');
      for (var i = 0; i < 6; i++) o += L(326 + i * 12, 316, 326 + i * 12, 310, 'lt') + L(326 + i * 12, 362, 326 + i * 12, 368, 'lt');
      return o;
    },
    dyn: function(t){
      var o = '', P = 1.6, ph = (t % (2 * P)) < P ? 0 : 1, u = (t % P) / P, d, k;
      // current flowing along the copper
      o += PL(PP, 'ink', ' style="stroke-width:1.6;stroke-dasharray:6 10;stroke-dashoffset:' + n(-(t * 56) % 16) + '"');
      // warm, within limits: faint heat rising off the long runs
      for (d = 30; d < PPL - 20; d += 38){
        var q = pat(PP, d), sq = [], a = 0.5 + 0.5 * Math.sin(t * 1.3 + d * 0.05);
        for (k = 0; k <= 8; k++) sq.push([q[0] + 3 * Math.sin(k * 0.6 - t * 5 + d * 0.11), q[1] - 13 - k * 2.8]);
        o += G(0.18 + 0.22 * a, PL(sq, 'r', ' style="stroke-width:1.1"'));
      }
      // gate drive: Q1 and Q4, then Q2 and Q3
      var pulse = ease(ramp(u, 0, 0.45)), pair = ph ? [0, 3] : [1, 2];
      pair.forEach(function(j){ var p = GATES[j], pl = plen(p); if (pulse < 1){ var x = pat(p, pl * pulse); o += Ci(x[0], x[1], 3.2, 'fi'); } });
      var lit = ph ? [[346, 96], [262, 236]] : [[262, 96], [346, 236]], la = bump(u, 0.35, 1);
      lit.forEach(function(q){ o += R(q[0], q[1], 48, 30, 'fi', 2, ' opacity="' + (0.35 * la).toFixed(2) + '"'); });
      return o;
    }
  };

  /* ---------------------------------------------------------------- 4. embedded coding: a sensor driver in 128 KB of RAM */
  var KB = function(v){ return 370 - v * 1.875; };
  var EMB = {
    tab: 'Embedded coding', h: 'Fit a sensor driver into 128 KB of RAM.', dot: [536, 130], lab: '128 KB', lx: 544, ly: 150, la: 'start',
    base: function(){
      var o = R(30, 160, 78, 78, 'f', 3) + T(69, 204, 'IMU', 't2', 12, 'middle'), i;
      for (i = 0; i < 4; i++){ o += L(108, 176 + i * 15, 190, 176 + i * 15, 'lt'); }
      o += T(149, 166, 'SPI', 't', 10, 'middle');
      o += R(190, 124, 150, 150, 'f', 4);
      for (i = 0; i < 8; i++){ var q = 205 + i * 17; o += L(q + 3, 124, q + 3, 114, 'l') + L(q + 3, 274, q + 3, 284, 'l') + L(340, q - 66, 350, q - 66, 'l'); }
      o += R(240, 174, 50, 50, 'fp', 2) + T(265, 245, 'MCU', 't2', 14, 'middle') + T(265, 203, 'CPU', 't', 9, 'middle');
      o += L(350, 236, 416, 236, 'lt') + T(468, 394, 'RAM', 't', 10.5, 'middle');
      // memory map, bottom up: .data, .bss, sample buffer, heap, free space, stack
      o += R(416, KB(128), 104, 240, 'fp', 2);
      o += R(416, KB(12), 104, KB(0) - KB(12), 'f') + T(468, (KB(0) + KB(12)) / 2 + 4, '.data', 't2', 10, 'middle');
      o += R(416, KB(40), 104, KB(12) - KB(40), 'f') + T(468, (KB(12) + KB(40)) / 2 + 4, '.bss', 't2', 10, 'middle');
      o += R(416, KB(56), 104, KB(40) - KB(56), 'fp') + R(416, KB(80), 104, KB(56) - KB(80), 'f') + T(468, (KB(56) + KB(80)) / 2 + 4, 'heap', 't2', 10, 'middle');
      o += L(400, KB(128), 536, KB(128), 'rd');
      return o;
    },
    dyn: function(t){
      var P = 2, tau = t % P, o = '', k;
      var arrived = 0; [0.45, 0.95, 1.45].forEach(function(a){ arrived += ease(ramp(tau, a, a + 0.12)); });
      var level = 6 - 4 * ease(ramp(tau, 0, 0.35)) + arrived, unit = 2.5;
      // sample buffer filling and draining
      o += R(420, KB(40 + level * unit), 96, KB(40) - KB(40 + level * unit), 'fb') + T(468, (KB(40) + KB(56)) / 2 + 4, 'buffer', 't2', 10, 'middle');
      // stack, deeper while the CPU processes a batch
      var work = bump(tau, 0, 0.6), depth = 14 + 8 * work;
      o += R(416, KB(128), 104, KB(128 - depth) - KB(128), 'f') + T(468, (KB(128) + KB(128 - depth)) / 2 + 4, 'stack', 't2', 10, 'middle');
      o += T(468, (KB(80) + KB(128 - depth)) / 2 + 4, 'free', 't', 10, 'middle');
      if (work > 0) o += R(240, 174, 50, 50, 'fi', 2, ' opacity="' + (0.5 * work).toFixed(2) + '"');
      // samples arriving over SPI
      for (k = 0; k < 4; k++){ var a = k * 0.5, v = ramp(tau, a, a + 0.45); if (v > 0 && v < 1) o += R(lerp(108, 182, ease(v)), 217, 8, 8, 'fi', 1); }
      if (work > 0.05){ var bx = lerp(350, 416, ramp(tau, 0.05, 0.4)); if (bx < 416) o += Ci(bx, 236, 3.2, 'fi'); }
      return o;
    }
  };

  var SC = [CHIP, RTL, CAD, EMB];
  SC.forEach(function(s){ s._b = null; });
  function baseOf(k){ var s = SC[k]; return s._b || (s._b = s.base()); }
  function lead(k){
    var s = SC[k], d = s.dot;
    return '<g class="tk-ll">' + PL([d, [KX, YL], [W - 4, YL]], 'ld') + '</g>' + Ci(d[0], d[1], 3.6, 'fr') + T(s.lx, s.ly, s.lab, 'th tr', 11.5, s.la);
  }
  function side(k){ return '<h3 class="tk-h">' + esc(SC[k].h) + '</h3><p class="tk-sub">Example task · ' + esc(SC[k].tab) + '</p>'; }
  function svgInner(k, t){ return '<g class="tk-b">' + baseOf(k) + '</g><g class="tk-d">' + SC[k].dyn(t) + '</g><g class="tk-lead">' + lead(k) + '</g>'; }
  function html(k){
    k = k || 0;
    return '<div class="tk" data-tk="' + k + '"><div class="tk-tabs" role="tablist" aria-label="Task domains">' + SC.map(function(s, i){
      return '<button type="button" class="tk-tab" role="tab" aria-selected="' + (i === k) + '" data-k="' + i + '"><span class="tk-n">0' + (i + 1) + '</span>' + esc(s.tab) + '<span class="tk-bar" aria-hidden="true"></span></button>'; }).join('') +
      '</div><div class="tk-body"><div class="tk-stage"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(SC[k].h) + '">' + svgInner(k, 0) + '</svg></div>' +
      '<div class="tk-side" style="--y:' + YL + '">' + side(k) + '</div></div></div>';
  }
  function mount(el){
    if (el.__tk) return; el.__tk = true;
    var k = +el.getAttribute('data-tk') || 0, pinned = false, t = 0, lastTs = null, vis = false, raf = 0, swapping = false;
    var reduce = false; try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var svg = el.querySelector('.tk-stage svg'), sd = el.querySelector('.tk-side'), tabs = [].slice.call(el.querySelectorAll('.tk-tab'));
    var dyn = svg.querySelector('.tk-d');
    function bar(v){ tabs.forEach(function(b, i){ var x = b.querySelector('.tk-bar'); if (x) x.style.transform = 'scaleX(' + (i === k && !pinned ? v : 0).toFixed(4) + ')'; }); }
    function show(i){
      k = i; t = 0;
      svg.innerHTML = svgInner(k, reduce ? 1.2 : 0); svg.setAttribute('aria-label', SC[k].h); dyn = svg.querySelector('.tk-d');
      sd.innerHTML = side(k);
      tabs.forEach(function(b, j){ b.setAttribute('aria-selected', String(j === k)); });
      bar(0);
    }
    function frame(ts){
      raf = 0;
      if (!vis || reduce) { lastTs = null; return; }
      var dt = lastTs === null ? 0 : Math.min(0.1, (ts - lastTs) / 1000); lastTs = ts; t += dt;
      if (!pinned && !swapping && t >= LOOP){
        swapping = true; el.classList.add('is-out');
        setTimeout(function(){ if (!pinned) show((k + 1) % SC.length); el.classList.remove('is-out'); swapping = false; }, 280);
      }
      dyn.innerHTML = SC[k].dyn(t);
      if (!pinned && !swapping) bar(Math.min(1, t / LOOP));
      raf = requestAnimationFrame(frame);
    }
    function start(){ if (!raf && vis && !reduce){ lastTs = null; raf = requestAnimationFrame(frame); } }
    function pick(i){ pinned = true; el.classList.remove('is-out'); show(i); start(); }
    el.addEventListener('click', function(e){ var b = e.target.closest('.tk-tab'); if (b) pick(+b.getAttribute('data-k')); });
    el.addEventListener('keydown', function(e){
      if (!e.target.closest('.tk-tab') || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      var i = (k + (e.key === 'ArrowRight' ? 1 : SC.length - 1)) % SC.length; pick(i);
      var nb = el.querySelector('.tk-tab[data-k="' + i + '"]'); if (nb) nb.focus();
    });
    if (reduce){ dyn.innerHTML = SC[k].dyn(1.2); return; }
    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es.forEach(function(en){ vis = en.isIntersecting; if (vis) start(); }); }, {threshold: 0.1}).observe(el);
    } else { vis = true; start(); }
  }
  function mountAll(root){ (root || document).querySelectorAll('[data-tk]').forEach(mount); }
  return {html: html, mountAll: mountAll, scenes: SC, svgInner: svgInner, LOOP: LOOP};
})();

(function(){
'use strict';
/* Biftu site runtime: renders every page from the JSON state, routes by hash and runs the animations.
   The editor (a separate script) reuses these renderers with edit = true. */
var HL = window.HL = window.HL || {};
/* one colour scheme everywhere: phones in dark mode get the same light site as desktop (Calle, v26) */
try { document.documentElement.setAttribute('data-theme', 'light'); } catch (e) {}
var LOGO = {"letters":"M342.5 459.84C342.16 459.79 341.24 459.63 340.46 459.49C339.68 459.35 337.57 459.02 335.77 458.75C303.72 454.05 277.38 429.9 273.87 402C273.78 401.24 273.55 399.95 273.37 399.12C270.18 384.63 273.54 361.71 280.82 348.25C291.66 328.22 317.02 312.76 343.38 310.12C344.34 310.03 345.91 309.78 346.88 309.58C347.84 309.38 350.59 309.12 353 309C355.41 308.88 359.6 308.65 362.31 308.48C366.28 308.23 368.24 308.23 372.31 308.48C375.1 308.66 379.51 308.9 382.12 309.01C384.74 309.13 387.32 309.34 387.88 309.48C388.43 309.62 390.06 309.86 391.5 310.01C396.38 310.51 406.06 312.25 411 313.51C412.03 313.78 413.21 314.06 413.62 314.15C414.04 314.23 416.34 314.87 418.75 315.56C425.02 317.36 425.18 317.37 425.75 316C426.15 315.03 425.96 309.66 425.43 307C425.22 305.97 424.93 304.39 424.78 303.49C422.28 288.44 407.74 276.66 389.75 275.13C388.72 275.04 386.41 274.8 384.62 274.58C380.39 274.08 373.54 274.08 367.48 274.59C364.81 274.81 361.22 275.1 359.5 275.23C347.1 276.16 332.17 279.76 315.04 285.97C310.16 287.74 310.57 288.21 307.49 277.5C306.07 272.58 302.54 260.47 300.75 254.38C300.35 253 299.17 248.95 298.13 245.38C297.09 241.8 295.97 237.97 295.64 236.88C293.12 228.49 293.09 228.07 294.92 227.06C298.76 224.94 315.97 219.19 326.38 216.55C331.01 215.37 332.99 214.92 339.62 213.52C342.96 212.81 350.57 211.61 354.75 211.13C356.61 210.91 358.74 210.63 359.5 210.5C360.26 210.36 362.84 210.14 365.25 210.01C367.66 209.88 370.98 209.6 372.62 209.39C377.66 208.76 403.23 208.83 409 209.49C411.41 209.77 414.73 210.1 416.38 210.24C463.9 214.07 497.52 240.37 506.22 280.5C507.8 287.79 507.97 288.66 508.11 290.5C508.19 291.53 508.42 293.33 508.62 294.5C509.67 300.74 509.75 306.53 509.75 381.38C509.75 456.5 509.79 453.88 508.58 454.53C507.85 454.91 428.31 455.07 426.94 454.68C425.39 454.25 425.38 454.18 425.3 442.85C425.2 429.72 425.44 430.13 420.62 434.71C406.53 448.12 390.03 456.18 370.88 459.01C368.81 459.32 366.56 459.66 365.88 459.77C364.65 459.96 343.74 460.02 342.5 459.84ZM634.12 459.84C631.19 459.45 627.31 459.01 625.62 458.87C610.53 457.69 587.36 451.64 570.38 444.44C556.38 438.52 536.18 426.77 535.62 424.24C535.41 423.26 537.76 419.34 561.54 381.06C566.84 372.55 566.42 372.79 570.85 375.61C588.23 386.63 614.36 396.88 630.12 398.85C630.81 398.94 632.61 399.23 634.12 399.49C651.7 402.58 666.92 399.92 670.25 393.17C675.92 381.64 668.04 375.83 634.25 366.65C615.19 361.46 607.45 359.03 597.62 355.14C566.3 342.71 548.88 323.14 547.01 298.25C546.89 296.67 546.65 293.73 546.48 291.71C546.23 288.81 546.23 287.33 546.47 284.59C546.64 282.68 546.88 279.71 547 277.98C548.4 258.12 559.69 238.57 576.88 226.27C587.64 218.55 603.72 212 616.75 210.01C617.78 209.86 619.24 209.57 620 209.39C620.76 209.2 622.33 208.97 623.5 208.87C624.67 208.78 626.68 208.55 627.97 208.36C634.81 207.36 653.49 207.37 661.36 208.38C662.88 208.58 665.48 208.85 667.12 208.98C668.77 209.12 670.52 209.35 671 209.5C671.48 209.65 672.83 209.88 674 210.01C677.21 210.38 687.21 212.4 691.38 213.52C710.63 218.69 724.47 224.26 738.62 232.56C744.23 235.84 744.18 235.31 739.63 243.62C738.5 245.69 736.73 248.95 735.69 250.88C734.65 252.8 731.39 258.82 728.44 264.25C725.49 269.68 721.46 277.11 719.49 280.75C714.4 290.15 715.27 289.71 708.5 286.27C666.23 264.81 626.32 260.8 623.26 277.69C621.6 286.87 629.87 291.68 664.62 301.75C727.27 319.9 748.75 339.65 748.75 379.05C748.75 423.54 719.64 453.47 671.12 458.88C669.34 459.08 667.31 459.37 666.62 459.53C665.43 459.81 635.97 460.09 634.12 459.84ZM1418.12 459.84C1417.71 459.79 1416.14 459.58 1414.62 459.39C1413.11 459.19 1410.86 458.95 1409.62 458.86C1392.86 457.62 1366.92 450.38 1348.79 441.89C1338.31 436.98 1320.96 426.79 1319.99 424.98C1319.23 423.57 1318.22 425.42 1331.71 403.62C1333.84 400.19 1337 395.07 1338.74 392.25C1352.25 370.34 1349.78 372.5 1356.63 376.58C1377.75 389.19 1394.85 395.55 1418.25 399.51C1437.79 402.81 1452.7 399.59 1455.08 391.57C1458.48 380.13 1451.15 375.44 1414.62 365.62C1355.96 349.86 1333.68 331.14 1330.76 295.15C1330.32 289.7 1330.73 276.3 1331.36 275.27C1331.42 275.18 1331.59 274.16 1331.75 272.99C1334.85 250.26 1351.63 228.79 1374.46 218.34C1382.06 214.86 1394.55 210.87 1400.12 210.13C1400.81 210.04 1402.33 209.76 1403.5 209.51C1404.67 209.25 1406.53 208.97 1407.62 208.88C1408.72 208.79 1410.69 208.56 1412 208.37C1418.89 207.36 1438.12 207.36 1445.38 208.37C1446.75 208.56 1449 208.79 1450.38 208.88C1451.75 208.97 1453.61 209.21 1454.5 209.41C1455.39 209.61 1457.05 209.89 1458.19 210.02C1469.32 211.3 1489.13 216.87 1502.38 222.44C1511.38 226.22 1524.28 232.95 1526.53 235.04C1527.88 236.28 1529.11 233.83 1504.5 279.08C1498.27 290.54 1499.65 289.82 1491.57 285.78C1475.59 277.8 1463.21 273.27 1447.12 269.53C1445.04 269.05 1443.91 268.85 1437.5 267.84C1419.97 265.08 1407.38 269.8 1407.38 279.13C1407.38 287.98 1415.08 292.07 1451.75 302.62C1502.32 317.18 1524.7 333.98 1531.2 362.25C1532.77 369.11 1533.48 380.02 1532.75 386C1532.62 387.03 1532.39 389.23 1532.24 390.88C1532.09 392.52 1531.76 394.72 1531.5 395.75C1531.25 396.78 1530.97 398.13 1530.88 398.75C1526.44 429.53 1494.99 454.51 1455.12 458.9C1453.2 459.12 1451.12 459.41 1450.5 459.55C1449.43 459.81 1419.87 460.07 1418.12 459.84ZM1653.25 459.85C1652.63 459.8 1650.44 459.59 1648.38 459.38C1646.31 459.18 1643.5 458.89 1642.12 458.76C1607.92 455.41 1584.38 433.8 1580.03 401.75C1579.89 400.71 1579.6 399.14 1579.39 398.25C1579.18 397.35 1579 395.84 1579 394.88C1578.99 393.91 1578.8 391.55 1578.58 389.62C1578.23 386.54 1578.17 379.95 1578.08 334.5C1577.99 281.68 1577.99 281.8 1577.04 281.33C1576.81 281.22 1570.79 281.07 1563.67 281L1550.71 280.88L1550.1 280.17L1549.49 279.47L1549.56 246.61L1549.62 213.76L1550.19 213.19L1550.76 212.62L1563.75 212.5L1576.74 212.38L1577.31 211.81L1577.88 211.24L1578 181.87L1578.12 152.51L1578.82 151.82L1579.51 151.12L1620.44 151.12C1642.96 151.12 1661.68 151.21 1662.06 151.32C1663.57 151.74 1663.5 150.23 1663.5 181.8C1663.5 212.63 1663.46 211.35 1664.56 212.31C1664.6 212.34 1676.8 212.42 1691.68 212.5L1718.74 212.62L1719.31 213.19L1719.88 213.76L1719.88 246.75L1719.88 279.74L1719.31 280.31L1718.74 280.88L1691.75 281L1664.76 281.12L1664.19 281.69L1663.62 282.26L1663.55 323.57C1663.46 374.09 1663.4 373.26 1667.45 379.17C1672.11 385.95 1684.05 388.96 1696.5 386.48C1703.98 385 1708.16 383.79 1713.86 381.48C1717.9 379.84 1718.6 379.86 1719.01 381.65C1719.3 382.88 1719.3 442.98 1719.02 444.45C1718.11 449.17 1692.91 457.52 1675.12 458.99C1673.47 459.13 1671.28 459.36 1670.25 459.5C1668.38 459.77 1655.39 460.03 1653.25 459.85ZM0 291.5L0 128L41.99 128.06L83.99 128.12L84.56 128.69L85.12 129.26L85.25 186C85.36 238.05 85.41 242.77 85.78 243.14C86.4 243.76 86.88 243.39 90.16 239.69C105.25 222.7 122.75 211.9 140.12 208.88C141.22 208.69 142.64 208.42 143.27 208.28C160.45 204.37 187.66 209.1 203.69 218.79C221.97 229.83 236.55 253.23 238.89 275.28C238.98 276.16 239.22 277.66 239.43 278.62C240.25 282.46 240.31 287.76 240.41 370.53C240.51 450.66 240.49 453.45 240.05 454C239.28 454.95 238.46 454.97 197.88 454.97C157.87 454.98 156.84 454.96 155.91 454.02L155.38 453.49L155.24 384.93L155.11 316.38L154.44 312.88C150.6 292.9 139.01 282.74 120.42 283.06C100.93 283.4 88.88 294.85 85.75 316C85.26 319.31 85.25 320.74 85.25 386.03C85.25 430.59 85.17 452.92 85 453.41C84.45 454.98 87.64 454.87 41.81 454.94L0 455.01L0 291.5ZM785.89 454.76C784.56 454.5 784.07 453.81 783.88 451.93C783.64 449.49 783.85 129.68 784.09 129.18C784.69 127.95 782.82 128 826.43 128C858.68 128.01 867.25 128.07 867.75 128.32C869.02 128.96 868.97 126.65 868.99 186.51C869 246.14 868.95 243.69 870.13 243.46C870.38 243.41 871.77 242.02 873.22 240.37C887.54 224.03 901.5 214.91 920.25 209.65C929.66 207.01 949.16 206.35 958.12 208.36C958.95 208.55 960.24 208.78 961 208.88C994.26 213.14 1019.18 242.42 1023.55 282.38L1024.12 287.62L1024.12 370.56L1024.12 453.49L1023.43 454.18L1022.74 454.88L983.06 454.95C941.83 455.03 940.63 455.01 939.69 454.25L939.12 453.79L939 385.21L938.87 316.62L938.06 312.57C934.15 293.05 922.83 283 904.77 283C886.11 283 872.3 295.13 869.76 313.75C869.62 314.78 869.39 316.36 869.26 317.25C869.1 318.28 869 343.39 868.98 385.62C868.94 456.66 868.99 453.55 867.92 454.35L867.21 454.88L827.04 454.91C804.95 454.93 786.43 454.86 785.89 454.76ZM1072.38 454.83C1071.13 454.67 1070.51 454.21 1070.24 453.27C1070.06 452.66 1070 401.03 1070.05 290.82L1070.12 129.26L1070.69 128.69L1071.26 128.12L1112.5 128.12L1153.74 128.12L1154.31 128.69L1154.88 129.26L1154.94 291.07C1154.99 412.29 1154.93 453.05 1154.72 453.57C1154.15 454.94 1156.34 454.87 1113.25 454.9C1091.18 454.92 1072.79 454.89 1072.38 454.83ZM1207 454.84C1205.52 454.6 1205.24 454.45 1204.88 453.76C1204.54 453.1 1204.51 440.07 1204.56 333.39L1204.62 213.76L1205.19 213.19L1205.76 212.62L1246.86 212.56C1273.88 212.52 1288.18 212.58 1288.62 212.75C1290.11 213.31 1290 203.87 1290 333.7C1290 458.28 1290.04 453.92 1288.91 454.57C1288.4 454.86 1208.77 455.12 1207 454.84ZM391.75 406.47C414.56 403.32 426.73 388.31 426.75 363.3C426.75 355.31 426.98 355.71 421.38 353.94C384.39 342.23 354.67 353.84 354.66 380C354.66 398.82 369.65 409.52 391.75 406.47ZM1203.77 190.06C1203.47 189.82 1203.12 189.18 1202.99 188.62C1202.66 187.18 1202.68 130.89 1203.01 129.69C1203.52 127.86 1199.9 127.99 1247.51 128.06L1290.29 128.12L1290.9 128.83L1291.5 129.53L1291.5 159.13C1291.5 190.37 1291.53 189.68 1290.34 190.22C1289.16 190.76 1204.43 190.6 1203.77 190.06Z","lb":"M1785 0H1916.5V81H1866V475H1916.5V556H1785Z","rb":"M1915.0 0H2048V556H1915.0V475H1968V81H1915.0Z"};
var SVG = {"car":"\u003csvg class=\"car-svg\" viewBox=\"0 0 600 340\" role=\"img\" aria-label=\"A modern SUV drawn as its electrical network. Camera, lidar and radar send data over wired links to a central computer, which talks to two zone controllers and the battery. Below the car, four readouts show each part working inside its interval: a camera frame within 0 to 33 milliseconds, a lidar sweep within 0 to 100 milliseconds, a radar cycle within 0 to 50 milliseconds and a battery cell between minus 20 and 60 degrees Celsius.\">\u003cdefs>\u003cpattern id=\"cv-dots-%U%\" width=\"14\" height=\"14\" patternUnits=\"userSpaceOnUse\">\u003ccircle class=\"cv-dot\" cx=\"2\" cy=\"2\" r=\"0.85\"/>\u003c/pattern>\u003cradialGradient id=\"cv-rad-%U%\" cx=\"50%\" cy=\"46%\" r=\"60%\">\u003cstop offset=\"0\" stop-color=\"#fff\"/>\u003cstop offset=\"0.65\" stop-color=\"#fff\" stop-opacity=\".5\"/>\u003cstop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/>\u003c/radialGradient>\u003cmask id=\"cv-mask-%U%\">\u003crect width=\"600\" height=\"270\" fill=\"url(#cv-rad-%U%)\"/>\u003c/mask>\u003clinearGradient id=\"cv-tail-%U%\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\u003cstop class=\"cv-ta\" offset=\"0\"/>\u003cstop class=\"cv-tb\" offset=\"0.75\"/>\u003cstop class=\"cv-tc\" offset=\"1\"/>\u003c/linearGradient>\u003clinearGradient id=\"cv-beam-%U%\" gradientUnits=\"userSpaceOnUse\" x1=\"302\" y1=\"0\" x2=\"592\" y2=\"0\">\u003cstop class=\"cv-ba\" offset=\"0\"/>\u003cstop class=\"cv-bb\" offset=\"1\"/>\u003c/linearGradient>\u003cfilter id=\"cv-glow-%U%\" x=\"-100%\" y=\"-100%\" width=\"300%\" height=\"300%\">\u003cfeGaussianBlur stdDeviation=\"2.2\" result=\"b\"/>\u003cfeMerge>\u003cfeMergeNode in=\"b\"/>\u003cfeMergeNode in=\"SourceGraphic\"/>\u003c/feMerge>\u003c/filter>\u003c/defs>\u003cg class=\"cv-grid\" mask=\"url(#cv-mask-%U%)\">\u003crect width=\"600\" height=\"270\" fill=\"url(#cv-dots-%U%)\"/>\u003c/g>\u003cpath class=\"cv-road\" d=\"M8 252H592\"/>\u003cg class=\"cv-body\">\u003cpath class=\"cv-sil\" pathLength=\"1\" d=\"M50 236L89.9 236A44 44 0 1 1 166.1 236L383.9 236A44 44 0 1 1 460.1 236L497 236C505 236 510 232 511 224L513 188C513.5 177 512 167 508 160C503 152.5 494 149 480 147.5C452 144 422 140.5 392 137.5L333 93C328 89.5 320 87 306 86L162 84.5C138 84.5 118 87.5 104 92.5L68 121C58 129 52 136 51 146L48 196C47 214 47 228 50 236Z\"/>\u003cpath class=\"cv-dlo\" pathLength=\"1\" d=\"M378 134.5L331 98C327 95 322 94 314 93.5L166 92.5C148 92.5 134 95 122 100L98 123C95.5 126 97 128.5 101 128.5Z\"/>\u003cpath class=\"cv-det cv-pil\" pathLength=\"1\" d=\"M263 93L265 131\"/>\u003cpath class=\"cv-det cv-pil\" pathLength=\"1\" d=\"M168 92.5L161 129\"/>\u003cpath class=\"cv-det cv-door\" pathLength=\"1\" d=\"M373 137L371 198\"/>\u003cpath class=\"cv-det cv-door\" pathLength=\"1\" d=\"M265 135L266 198\"/>\u003cpath class=\"cv-det cv-door\" pathLength=\"1\" d=\"M161 133C164 148 167 170 167.5 194\"/>\u003cpath class=\"cv-det cv-mirror\" pathLength=\"1\" d=\"M371 131C372 124.5 380 122.5 388 125L387 132Z\"/>\u003cpath class=\"cv-det cv-mould\" pathLength=\"1\" d=\"M84.2 236A49 49 0 1 1 171.8 236M378.2 236A49 49 0 1 1 465.8 236\"/>\u003cpath class=\"cv-det cv-mould\" pathLength=\"1\" d=\"M175 226H375\"/>\u003cpath class=\"cv-lt\" data-k=\"f\" pathLength=\"1\" d=\"M484 150.5C495 151.5 503 154.5 508.5 160.5\"/>\u003cpath class=\"cv-lt\" data-k=\"r\" pathLength=\"1\" d=\"M51.5 141C57 137 65 135.5 76 135.5\"/>\u003c/g>\u003cg class=\"cv-wheels\">\u003cg class=\"cv-wh\" transform=\"translate(128 214)\">\u003ccircle class=\"cv-tyre\" r=\"38\" pathLength=\"1\" transform=\"rotate(-90)\"/>\u003ccircle class=\"cv-wall\" r=\"33\"/>\u003cg class=\"cv-rim\">\u003ccircle class=\"cv-rimc\" r=\"27\"/>\u003cpath class=\"cv-spk\" d=\"M-0.60 -5.97L-3.98 -24.68M0.60 -5.97L3.98 -24.68M5.49 -2.41L22.24 -11.41M5.86 -1.28L24.70 -3.84M3.99 4.48L17.73 17.63M3.02 5.18L11.28 22.31M-3.02 5.18L-11.28 22.31M-3.99 4.48L-17.73 17.63M-5.86 -1.28L-24.70 -3.84M-5.49 -2.41L-22.24 -11.41\"/>\u003ccircle class=\"cv-hub\" r=\"5\"/>\u003c/g>\u003c/g>\u003cg class=\"cv-wh\" transform=\"translate(422 214)\">\u003ccircle class=\"cv-tyre\" r=\"38\" pathLength=\"1\" transform=\"rotate(-90)\"/>\u003ccircle class=\"cv-wall\" r=\"33\"/>\u003cg class=\"cv-rim\">\u003ccircle class=\"cv-rimc\" r=\"27\"/>\u003cpath class=\"cv-spk\" d=\"M-0.60 -5.97L-3.98 -24.68M0.60 -5.97L3.98 -24.68M5.49 -2.41L22.24 -11.41M5.86 -1.28L24.70 -3.84M3.99 4.48L17.73 17.63M3.02 5.18L11.28 22.31M-3.02 5.18L-11.28 22.31M-3.99 4.48L-17.73 17.63M-5.86 -1.28L-24.70 -3.84M-5.49 -2.41L-22.24 -11.41\"/>\u003ccircle class=\"cv-hub\" r=\"5\"/>\u003c/g>\u003c/g>\u003c/g>\u003cg class=\"cv-net\">\u003cpath class=\"cv-ln\" data-k=\"cam\" pathLength=\"1\" d=\"M340 107.5V123L314 149H300\"/>\u003cpath class=\"cv-ln\" data-k=\"li\" pathLength=\"1\" d=\"M292 86V146\"/>\u003cpath class=\"cv-ln\" data-k=\"fz-a\" pathLength=\"1\" d=\"M300 155H452\"/>\u003cpath class=\"cv-ln\" data-k=\"fz-b\" pathLength=\"1\" d=\"M300 161H452\"/>\u003cpath class=\"cv-ln\" data-k=\"rz-a\" pathLength=\"1\" d=\"M232 155H116L106 145H96\"/>\u003cpath class=\"cv-ln\" data-k=\"rz-b\" pathLength=\"1\" d=\"M232 161H113.5L103.5 151H96\"/>\u003cpath class=\"cv-ln\" data-k=\"rd\" pathLength=\"1\" d=\"M506.5 190V178.5L488 160H476\"/>\u003cpath class=\"cv-ln\" data-k=\"rcam\" pathLength=\"1\" d=\"M60 172H72L80 164V156\"/>\u003cpath class=\"cv-ln\" data-k=\"bt\" pathLength=\"1\" d=\"M266 204V178\"/>\u003c/g>\u003cg class=\"cv-chips\">\u003cg class=\"cv-chip cv-cc\" data-k=\"cc\" transform=\"translate(232 146)\">\u003cpath class=\"cv-pins\" pathLength=\"1\" d=\"M6 -3V0M6 32V35M12 -3V0M12 32V35M18 -3V0M18 32V35M24 -3V0M24 32V35M30 -3V0M30 32V35M36 -3V0M36 32V35M42 -3V0M42 32V35M48 -3V0M48 32V35M54 -3V0M54 32V35M60 -3V0M60 32V35M-3 6H0M68 6H71M-3 12H0M68 12H71M-3 18H0M68 18H71M-3 24H0M68 24H71\"/>\u003crect class=\"cv-cbody\" width=\"68\" height=\"32\" rx=\"2.5\"/>\u003crect class=\"cv-out\" width=\"68\" height=\"32\" rx=\"2.5\" pathLength=\"1\"/>\u003cg class=\"cv-die\">\u003crect class=\"cv-cell\" data-c=\"0\" data-r=\"0\" x=\"3.75\" y=\"6.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"1\" data-r=\"0\" x=\"10.75\" y=\"6.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"2\" data-r=\"0\" x=\"17.75\" y=\"6.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"3\" data-r=\"0\" x=\"24.75\" y=\"6.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"4\" data-r=\"0\" x=\"31.75\" y=\"6.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"5\" data-r=\"0\" x=\"38.75\" y=\"6.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"6\" data-r=\"0\" x=\"45.75\" y=\"6.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"7\" data-r=\"0\" x=\"52.75\" y=\"6.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"8\" data-r=\"0\" x=\"59.75\" y=\"6.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"0\" data-r=\"1\" x=\"3.75\" y=\"13.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"1\" data-r=\"1\" x=\"10.75\" y=\"13.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"2\" data-r=\"1\" x=\"17.75\" y=\"13.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"3\" data-r=\"1\" x=\"24.75\" y=\"13.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"4\" data-r=\"1\" x=\"31.75\" y=\"13.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"5\" data-r=\"1\" x=\"38.75\" y=\"13.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"6\" data-r=\"1\" x=\"45.75\" y=\"13.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"7\" data-r=\"1\" x=\"52.75\" y=\"13.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"8\" data-r=\"1\" x=\"59.75\" y=\"13.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"0\" data-r=\"2\" x=\"3.75\" y=\"20.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"1\" data-r=\"2\" x=\"10.75\" y=\"20.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"2\" data-r=\"2\" x=\"17.75\" y=\"20.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"3\" data-r=\"2\" x=\"24.75\" y=\"20.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"4\" data-r=\"2\" x=\"31.75\" y=\"20.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"5\" data-r=\"2\" x=\"38.75\" y=\"20.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"6\" data-r=\"2\" x=\"45.75\" y=\"20.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"7\" data-r=\"2\" x=\"52.75\" y=\"20.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003crect class=\"cv-cell\" data-c=\"8\" data-r=\"2\" x=\"59.75\" y=\"20.75\" width=\"4.5\" height=\"4.5\" rx=\".6\"/>\u003c/g>\u003c/g>\u003cg class=\"cv-chip\" data-k=\"fz\" transform=\"translate(452 152)\">\u003cpath class=\"cv-pins\" pathLength=\"1\" d=\"M4 -3V0M4 14V17M9 -3V0M9 14V17M14 -3V0M14 14V17M19 -3V0M19 14V17\"/>\u003crect class=\"cv-cbody\" width=\"24\" height=\"14\" rx=\"2\"/>\u003crect class=\"cv-out\" width=\"24\" height=\"14\" rx=\"2\" pathLength=\"1\"/>\u003cpath class=\"cv-zl\" d=\"M5 7H19\"/>\u003c/g>\u003cg class=\"cv-chip\" data-k=\"rz\" transform=\"translate(72 140)\">\u003cpath class=\"cv-pins\" pathLength=\"1\" d=\"M4 -3V0M4 16V19M9 -3V0M9 16V19M14 -3V0M14 16V19M19 -3V0M19 16V19\"/>\u003crect class=\"cv-cbody\" width=\"24\" height=\"16\" rx=\"2\"/>\u003crect class=\"cv-out\" width=\"24\" height=\"16\" rx=\"2\" pathLength=\"1\"/>\u003cpath class=\"cv-zl\" d=\"M5 8H19\"/>\u003c/g>\u003cg class=\"cv-chip cv-bt\" data-k=\"bt\" transform=\"translate(182 204)\">\u003crect class=\"cv-cbody\" width=\"186\" height=\"12\" rx=\"2\"/>\u003crect class=\"cv-bc\" data-i=\"0\" x=\"1.60\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"1\" x=\"17.10\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"2\" x=\"32.60\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"3\" x=\"48.10\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"4\" x=\"63.60\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"5\" x=\"79.10\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"6\" x=\"94.60\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"7\" x=\"110.10\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"8\" x=\"125.60\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"9\" x=\"141.10\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"10\" x=\"156.60\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-bc\" data-i=\"11\" x=\"172.10\" y=\"2\" width=\"12.30\" height=\"8\" rx=\".8\"/>\u003crect class=\"cv-out\" width=\"186\" height=\"12\" rx=\"2\" pathLength=\"1\"/>\u003c/g>\u003cg class=\"cv-chip cv-rd\" data-k=\"rd\" transform=\"translate(503 190)\">\u003crect class=\"cv-cbody\" width=\"7\" height=\"14\" rx=\"1.5\"/>\u003crect class=\"cv-out\" width=\"7\" height=\"14\" rx=\"1.5\" pathLength=\"1\"/>\u003cpath class=\"cv-zl\" d=\"M3.5 3V11\"/>\u003c/g>\u003cg class=\"cv-chip cv-lens\" data-k=\"cam\" transform=\"translate(340 103)\">\u003ccircle class=\"cv-cbody\" r=\"4.5\"/>\u003ccircle class=\"cv-out\" r=\"4.5\" pathLength=\"1\"/>\u003ccircle class=\"cv-eye\" r=\"1.7\"/>\u003c/g>\u003cg class=\"cv-chip cv-lens\" data-k=\"rcam\" transform=\"translate(56 172)\">\u003ccircle class=\"cv-cbody\" r=\"4.5\"/>\u003ccircle class=\"cv-out\" r=\"4.5\" pathLength=\"1\"/>\u003ccircle class=\"cv-eye\" r=\"1.7\"/>\u003c/g>\u003cg class=\"cv-chip cv-li\" data-k=\"li\">\u003cpath class=\"cv-cbody\" d=\"M282 86V82C282 79.5 284 78.5 286.5 78.5H297.5C300 78.5 302 79.5 302 82V86Z\"/>\u003cpath class=\"cv-out\" pathLength=\"1\" d=\"M282 86V82C282 79.5 284 78.5 286.5 78.5H297.5C300 78.5 302 79.5 302 82V86\"/>\u003cpath class=\"cv-zl\" d=\"M286 82.5H298\"/>\u003c/g>\u003c/g>\u003cg class=\"cv-fx\">\u003cg class=\"cv-radar\">\u003c/g>\u003cg class=\"cv-beams\">\u003c/g>\u003cg class=\"cv-hits\">\u003c/g>\u003cpath class=\"cv-frame\" d=\"M332 96.5V95H333.5M346.5 95H348V96.5M348 109.5V111H346.5M333.5 111H332V109.5\"/>\u003c/g>\u003cg class=\"cv-ro\">\u003cg class=\"cv-r\" data-k=\"cam\" data-lo=\"0\" data-hi=\"33\" data-u=\"ms\" data-a=\"17\" data-b=\"27\" transform=\"translate(21 0)\">\u003ctext class=\"cv-iv\" x=\"0\" y=\"284\">[0, 33] ms\u003c/text>\u003ctext class=\"cv-nm\" x=\"0\" y=\"301\">Camera frame\u003c/text>\u003crect class=\"cv-track\" x=\"0\" y=\"309\" width=\"126\" height=\"3\"/>\u003cpath class=\"cv-lim\" d=\"M0 305V316M126 305V316\"/>\u003crect class=\"cv-fill\" x=\"0\" y=\"309\" width=\"0\" height=\"3\"/>\u003ctext class=\"cv-val\" x=\"0\" y=\"335\">\u003c/text>\u003c/g>\u003cg class=\"cv-r\" data-k=\"li\" data-lo=\"0\" data-hi=\"100\" data-u=\"ms\" data-a=\"48\" data-b=\"74\" transform=\"translate(165 0)\">\u003ctext class=\"cv-iv\" x=\"0\" y=\"284\">[0, 100] ms\u003c/text>\u003ctext class=\"cv-nm\" x=\"0\" y=\"301\">Lidar sweep\u003c/text>\u003crect class=\"cv-track\" x=\"0\" y=\"309\" width=\"126\" height=\"3\"/>\u003cpath class=\"cv-lim\" d=\"M0 305V316M126 305V316\"/>\u003crect class=\"cv-fill\" x=\"0\" y=\"309\" width=\"0\" height=\"3\"/>\u003ctext class=\"cv-val\" x=\"0\" y=\"335\">\u003c/text>\u003c/g>\u003cg class=\"cv-r\" data-k=\"rd\" data-lo=\"0\" data-hi=\"50\" data-u=\"ms\" data-a=\"22\" data-b=\"38\" transform=\"translate(309 0)\">\u003ctext class=\"cv-iv\" x=\"0\" y=\"284\">[0, 50] ms\u003c/text>\u003ctext class=\"cv-nm\" x=\"0\" y=\"301\">Radar cycle\u003c/text>\u003crect class=\"cv-track\" x=\"0\" y=\"309\" width=\"126\" height=\"3\"/>\u003cpath class=\"cv-lim\" d=\"M0 305V316M126 305V316\"/>\u003crect class=\"cv-fill\" x=\"0\" y=\"309\" width=\"0\" height=\"3\"/>\u003ctext class=\"cv-val\" x=\"0\" y=\"335\">\u003c/text>\u003c/g>\u003cg class=\"cv-r\" data-k=\"bt\" data-lo=\"-20\" data-hi=\"60\" data-u=\"°C\" data-a=\"27\" data-b=\"34\" transform=\"translate(453 0)\">\u003ctext class=\"cv-iv\" x=\"0\" y=\"284\">[−20, 60] °C\u003c/text>\u003ctext class=\"cv-nm\" x=\"0\" y=\"301\">Battery cell\u003c/text>\u003crect class=\"cv-track\" x=\"0\" y=\"309\" width=\"126\" height=\"3\"/>\u003cpath class=\"cv-lim\" d=\"M0 305V316M126 305V316\"/>\u003crect class=\"cv-fill\" x=\"0\" y=\"309\" width=\"0\" height=\"3\"/>\u003ctext class=\"cv-val\" x=\"0\" y=\"335\">\u003c/text>\u003c/g>\u003c/g>\u003cg class=\"cv-pk\" filter=\"url(#cv-glow-%U%)\">\u003c/g>\u003c/svg>","timing":"\u003csvg class=\"inst\" data-x0=\"124\" data-x1=\"604\" data-steps=\"80\" viewBox=\"0 0 800 230\" role=\"img\" aria-labelledby=\"ti-t-%U% ti-d-%U%\">\u003ctitle id=\"ti-t-%U%\">Timing: the response must land within ten microseconds of the interrupt\u003c/title>\u003cdesc id=\"ti-d-%U%\">The interrupt arrives at 2 microseconds. The frontier model responds at 15.6, which is 3.6 late. The engineer responds at 8.4.\u003c/desc>\u003cdefs>\u003cclipPath id=\"clip-ti-%U%\">\u003crect class=\"sweep-rect\" x=\"124\" y=\"0\" width=\"480\" height=\"230\"/>\u003c/clipPath>\u003c/defs>\u003cline class=\"g\" x1=\"124\" y1=\"20\" x2=\"124\" y2=\"196\"/>\u003ctext class=\"t-tick\" x=\"124\" y=\"218\" text-anchor=\"middle\">0\u003c/text>\u003cline class=\"g\" x1=\"244\" y1=\"20\" x2=\"244\" y2=\"196\"/>\u003ctext class=\"t-tick\" x=\"244\" y=\"218\" text-anchor=\"middle\">5\u003c/text>\u003cline class=\"g\" x1=\"364\" y1=\"20\" x2=\"364\" y2=\"196\"/>\u003ctext class=\"t-tick\" x=\"364\" y=\"218\" text-anchor=\"middle\">10\u003c/text>\u003cline class=\"g\" x1=\"484\" y1=\"20\" x2=\"484\" y2=\"196\"/>\u003ctext class=\"t-tick\" x=\"484\" y=\"218\" text-anchor=\"middle\">15\u003c/text>\u003cline class=\"g\" x1=\"604\" y1=\"20\" x2=\"604\" y2=\"196\"/>\u003ctext class=\"t-tick\" x=\"604\" y=\"218\" text-anchor=\"end\">20 µs\u003c/text>\u003crect class=\"band\" x=\"172\" y=\"88\" width=\"240\" height=\"104\"/>\u003cpath class=\"brk\" d=\"M180 84H172V196H180\"/>\u003cpath class=\"brk\" d=\"M404 84H412V196H404\"/>\u003ctext class=\"t-lim\" x=\"292\" y=\"76\" text-anchor=\"middle\">[0, 10] µs\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"49\">Interrupt\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"119\">Model\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"175\">Engineer\u003c/text>\u003cg clip-path=\"url(#clip-ti-%U%)\">\u003cpath class=\"tr\" d=\"M124 52H172V34H604\"/>\u003cpath class=\"tr\" d=\"M124 122H412\"/>\u003cpath class=\"tr-lim\" d=\"M412 122H498.4V104H604\"/>\u003cpath class=\"tr\" d=\"M124 178H325.6V160H604\"/>\u003c/g>\u003cg class=\"res\">\u003ctext class=\"t-res-lim\" x=\"626\" y=\"119\">15.6 µs late\u003c/text>\u003ctext class=\"t-res\" x=\"626\" y=\"175\">8.4 µs\u003c/text>\u003c/g>\u003cline class=\"sweep-line\" x1=\"604\" y1=\"16\" x2=\"604\" y2=\"198\"/>\u003c/svg>","memory":"\u003csvg class=\"inst\" data-x0=\"124\" data-x1=\"619.5\" data-steps=\"38\" viewBox=\"0 0 800 200\" role=\"img\" aria-labelledby=\"me-t-%U% me-d-%U%\">\u003ctitle id=\"me-t-%U%\">Memory: the build must fit 128 kilobytes of RAM\u003c/title>\u003cdesc id=\"me-d-%U%\">The frontier model needs 151 kilobytes, 23 over the limit. The engineer needs 118.\u003c/desc>\u003cdefs>\u003cclipPath id=\"clip-me-%U%\">\u003crect class=\"sweep-rect\" x=\"124\" y=\"0\" width=\"495.5\" height=\"200\"/>\u003c/clipPath>\u003c/defs>\u003cline class=\"g\" x1=\"124\" y1=\"36\" x2=\"124\" y2=\"168\"/>\u003ctext class=\"t-tick\" x=\"124\" y=\"190\" text-anchor=\"middle\">0\u003c/text>\u003cline class=\"g\" x1=\"334\" y1=\"36\" x2=\"334\" y2=\"168\"/>\u003ctext class=\"t-tick\" x=\"334\" y=\"190\" text-anchor=\"middle\">64\u003c/text>\u003cline class=\"g\" x1=\"544\" y1=\"36\" x2=\"544\" y2=\"168\"/>\u003ctext class=\"t-tick\" x=\"544\" y=\"190\" text-anchor=\"middle\">128 KB\u003c/text>\u003cpath class=\"brk2\" d=\"M127 32H117V172H127\"/>\u003cpath class=\"brk2\" d=\"M541 32H551V172H541\"/>\u003ctext class=\"t-lim\" x=\"334\" y=\"22\" text-anchor=\"middle\">[0, 128] KB\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"74\">Model\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"140\">Engineer\u003c/text>\u003cg clip-path=\"url(#clip-me-%U%)\">\u003crect class=\"bar\" x=\"124\" y=\"52\" width=\"420\" height=\"34\"/>\u003crect class=\"bar-lim\" x=\"544\" y=\"52\" width=\"75.5\" height=\"34\"/>\u003crect class=\"bar\" x=\"124\" y=\"118\" width=\"387.2\" height=\"34\"/>\u003c/g>\u003cg class=\"res\">\u003ctext class=\"t-res-lim\" x=\"635.5\" y=\"74\">151 KB, 23 over\u003c/text>\u003ctext class=\"t-res\" x=\"635.5\" y=\"140\">118 KB\u003c/text>\u003c/g>\u003cline class=\"sweep-line\" x1=\"619.5\" y1=\"30\" x2=\"619.5\" y2=\"174\"/>\u003c/svg>","power":"\u003csvg class=\"inst\" data-x0=\"124\" data-x1=\"604\" data-steps=\"100\" viewBox=\"0 0 800 236\" role=\"img\" aria-labelledby=\"po-t-%U% po-d-%U%\">\u003ctitle id=\"po-t-%U%\">Power: average current must stay within 2.5 milliamperes\u003c/title>\u003cdesc id=\"po-d-%U%\">The frontier model keeps the chip awake and averages 3.85 milliamperes. The engineer lets it sleep between wake-ups and averages 0.95.\u003c/desc>\u003cdefs>\u003cclipPath id=\"clip-po-%U%\">\u003crect class=\"sweep-rect\" x=\"124\" y=\"0\" width=\"480\" height=\"236\"/>\u003c/clipPath>\u003c/defs>\u003cline class=\"g\" x1=\"124\" y1=\"26\" x2=\"124\" y2=\"198\"/>\u003ctext class=\"t-tick\" x=\"124\" y=\"220\" text-anchor=\"middle\">0\u003c/text>\u003cline class=\"g\" x1=\"364\" y1=\"26\" x2=\"364\" y2=\"198\"/>\u003ctext class=\"t-tick\" x=\"364\" y=\"220\" text-anchor=\"middle\">250\u003c/text>\u003cline class=\"g\" x1=\"604\" y1=\"26\" x2=\"604\" y2=\"198\"/>\u003ctext class=\"t-tick\" x=\"604\" y=\"220\" text-anchor=\"end\">500 ms\u003c/text>\u003ctext class=\"t-lim\" x=\"364\" y=\"16\" text-anchor=\"middle\">[0, 2.5] mA average\u003c/text>\u003cline class=\"g\" x1=\"124\" y1=\"108\" x2=\"604\" y2=\"108\"/>\u003cline class=\"budget\" x1=\"124\" y1=\"92.6\" x2=\"604\" y2=\"92.6\"/>\u003ctext class=\"t-lane\" x=\"0\" y=\"102\">Model\u003c/text>\u003cline class=\"g\" x1=\"124\" y1=\"198\" x2=\"604\" y2=\"198\"/>\u003cline class=\"budget\" x1=\"124\" y1=\"182.6\" x2=\"604\" y2=\"182.6\"/>\u003ctext class=\"t-lane\" x=\"0\" y=\"192\">Engineer\u003c/text>\u003cg clip-path=\"url(#clip-po-%U%)\">\u003cpath class=\"tr-lim\" d=\"M124 88.9H162.4V34H169.1V88.9H258.4V34H265.1V88.9H354.4V34H361.1V88.9H450.4V34H457.1V88.9H546.4V34H553.1V88.9H604\"/>\u003cpath class=\"tr\" d=\"M124 197.7H162.4V124H169.1V197.7H258.4V124H265.1V197.7H354.4V124H361.1V197.7H450.4V124H457.1V197.7H546.4V124H553.1V197.7H604\"/>\u003c/g>\u003cg class=\"res\">\u003cline class=\"avg-lim\" x1=\"124\" y1=\"84.3\" x2=\"604\" y2=\"84.3\"/>\u003ctext class=\"t-res-lim\" x=\"626\" y=\"89.3\">3.85 mA over\u003c/text>\u003cline class=\"avg\" x1=\"124\" y1=\"192.1\" x2=\"604\" y2=\"192.1\"/>\u003ctext class=\"t-res\" x=\"626\" y=\"197.1\">0.95 mA\u003c/text>\u003c/g>\u003cline class=\"sweep-line\" x1=\"604\" y1=\"22\" x2=\"604\" y2=\"198\"/>\u003c/svg>","schematic":"\u003csvg class=\"inst\" data-x0=\"16\" data-x1=\"636\" data-steps=\"62\" viewBox=\"0 0 640 300\" role=\"img\" aria-labelledby=\"sc-t-%U% sc-d-%U%\">\u003ctitle id=\"sc-t-%U%\">A camera and radar integration, drawn as an integration engineer draws it\u003c/title>\u003cdesc id=\"sc-d-%U%\">A camera feeds a serializer, which sends video over a six gigabit per second link to a deserializer and on to the system on chip. A radar connects to the same chip, which talks to the vehicle network.\u003c/desc>\n\u003cdefs>\u003cclipPath id=\"clip-sc-%U%\">\u003crect class=\"sweep-rect\" x=\"16\" y=\"0\" width=\"620\" height=\"300\"/>\u003c/clipPath>\u003c/defs>\n\u003cg clip-path=\"url(#clip-sc-%U%)\">\n\u003crect class=\"node\" x=\"20\" y=\"40\" width=\"112\" height=\"44\"/>\u003ctext class=\"t-node\" x=\"76\" y=\"67\" text-anchor=\"middle\">Camera\u003c/text>\n\u003crect class=\"node\" x=\"170\" y=\"40\" width=\"124\" height=\"44\"/>\u003ctext class=\"t-node\" x=\"232\" y=\"67\" text-anchor=\"middle\">Serializer\u003c/text>\n\u003crect class=\"node\" x=\"372\" y=\"40\" width=\"136\" height=\"44\"/>\u003ctext class=\"t-node\" x=\"440\" y=\"67\" text-anchor=\"middle\">Deserializer\u003c/text>\n\u003crect class=\"node\" x=\"372\" y=\"146\" width=\"136\" height=\"52\"/>\u003ctext class=\"t-node\" x=\"440\" y=\"168\" text-anchor=\"middle\">System\u003c/text>\u003ctext class=\"t-node\" x=\"440\" y=\"186\" text-anchor=\"middle\">on chip\u003c/text>\n\u003crect class=\"node\" x=\"20\" y=\"150\" width=\"112\" height=\"44\"/>\u003ctext class=\"t-node\" x=\"76\" y=\"177\" text-anchor=\"middle\">Radar\u003c/text>\n\u003crect class=\"node\" x=\"372\" y=\"246\" width=\"136\" height=\"44\"/>\u003ctext class=\"t-node\" x=\"440\" y=\"273\" text-anchor=\"middle\">Vehicle network\u003c/text>\n\u003cpath class=\"link\" d=\"M132 62H170M294 62H372M440 84V146M132 172H372M440 198V246\"/>\n\u003ctext class=\"t-iv\" x=\"333\" y=\"104\" text-anchor=\"middle\">[0, 6] Gbps\u003c/text>\n\u003ctext class=\"t-iv\" x=\"520\" y=\"176\">[0, 33] ms\u003c/text>\u003ctext class=\"t-node\" x=\"520\" y=\"194\" style=\"font-size:11px;fill:var(--gauge)\">per frame\u003c/text>\n\u003c/g>\u003cline class=\"sweep-line\" x1=\"636\" y1=\"20\" x2=\"636\" y2=\"296\"/>\u003c/svg>","pipeline":"\u003csvg class=\"pipe\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"A camera and radar integration, drawn as chips on a board. A camera feeds a serializer, which sends video over a six gigabit per second link to a deserializer and on to the system on chip, which must finish each frame within 33 milliseconds. A radar connects to the same chip, which talks to the vehicle network.\">\u003cdefs>\u003cpattern id=\"pp-dots-%U%\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\">\u003ccircle class=\"pp-dot\" cx=\"2\" cy=\"2\" r=\"0.9\"/>\u003c/pattern>\u003cradialGradient id=\"pp-rad-%U%\" cx=\"55%\" cy=\"50%\" r=\"62%\">\u003cstop offset=\"0\" stop-color=\"#fff\"/>\u003cstop offset=\"0.7\" stop-color=\"#fff\" stop-opacity=\".55\"/>\u003cstop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/>\u003c/radialGradient>\u003cmask id=\"pp-mask-%U%\">\u003crect width=\"640\" height=\"360\" fill=\"url(#pp-rad-%U%)\"/>\u003c/mask>\u003clinearGradient id=\"pp-tail-%U%\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\u003cstop class=\"pp-ta\" offset=\"0\"/>\u003cstop class=\"pp-tb\" offset=\"0.75\"/>\u003cstop class=\"pp-tc\" offset=\"1\"/>\u003c/linearGradient>\u003cfilter id=\"pp-glow-%U%\" x=\"-100%\" y=\"-100%\" width=\"300%\" height=\"300%\">\u003cfeGaussianBlur stdDeviation=\"2.6\" result=\"b\"/>\u003cfeMerge>\u003cfeMergeNode in=\"b\"/>\u003cfeMergeNode in=\"b\"/>\u003cfeMergeNode in=\"SourceGraphic\"/>\u003c/feMerge>\u003c/filter>\u003c/defs>\u003cg class=\"pp-grid\" mask=\"url(#pp-mask-%U%)\">\u003crect width=\"640\" height=\"360\" fill=\"url(#pp-dots-%U%)\"/>\u003c/g>\u003cg class=\"pp-links\">\u003cpath class=\"pp-ln\" data-k=\"cam-ser\" pathLength=\"1\" d=\"M124 70H170\"/>\u003cpath class=\"pp-ln\" data-k=\"ser-des-a\" pathLength=\"1\" d=\"M290 66.5H366\"/>\u003cpath class=\"pp-ln\" data-k=\"ser-des-b\" pathLength=\"1\" d=\"M290 73.5H366\"/>\u003cpath class=\"pp-ln\" data-k=\"des-soc-a\" pathLength=\"1\" d=\"M428 94V148\"/>\u003cpath class=\"pp-ln\" data-k=\"des-soc-b\" pathLength=\"1\" d=\"M444 94V148\"/>\u003cpath class=\"pp-ln\" data-k=\"rad-soc\" pathLength=\"1\" d=\"M124 206H346\"/>\u003cpath class=\"pp-ln\" data-k=\"soc-net\" pathLength=\"1\" d=\"M436 252V290\"/>\u003c/g>\u003cg class=\"pp-chips\">\u003cg class=\"pp-chip\" data-k=\"cam\" transform=\"translate(20 46)\">\u003cpath class=\"pp-pins\" pathLength=\"1\" d=\"M10 -4V0M10 48V52M18 -4V0M18 48V52M26 -4V0M26 48V52M34 -4V0M34 48V52M42 -4V0M42 48V52M50 -4V0M50 48V52M58 -4V0M58 48V52M66 -4V0M66 48V52M74 -4V0M74 48V52M82 -4V0M82 48V52M90 -4V0M90 48V52\"/>\u003crect class=\"pp-body\" width=\"104\" height=\"48\" rx=\"3\"/>\u003cpath class=\"pp-out\" pathLength=\"1\" d=\"M3 0H101Q104 0 104 3V45Q104 48 101 48H3Q0 48 0 45V3Q0 0 3 0Z\"/>\u003ctext class=\"pp-t\" x=\"52\" y=\"23\" text-anchor=\"middle\">Camera\u003c/text>\u003ctext class=\"pp-s\" x=\"52\" y=\"37\" text-anchor=\"middle\">8 MP · 30 fps\u003c/text>\u003c/g>\u003cg class=\"pp-chip\" data-k=\"ser\" transform=\"translate(170 46)\">\u003cpath class=\"pp-pins\" pathLength=\"1\" d=\"M10 -4V0M10 48V52M18 -4V0M18 48V52M26 -4V0M26 48V52M34 -4V0M34 48V52M42 -4V0M42 48V52M50 -4V0M50 48V52M58 -4V0M58 48V52M66 -4V0M66 48V52M74 -4V0M74 48V52M82 -4V0M82 48V52M90 -4V0M90 48V52M98 -4V0M98 48V52M106 -4V0M106 48V52\"/>\u003crect class=\"pp-body\" width=\"120\" height=\"48\" rx=\"3\"/>\u003cpath class=\"pp-out\" pathLength=\"1\" d=\"M3 0H117Q120 0 120 3V45Q120 48 117 48H3Q0 48 0 45V3Q0 0 3 0Z\"/>\u003ctext class=\"pp-t\" x=\"60\" y=\"23\" text-anchor=\"middle\">Serializer\u003c/text>\u003ctext class=\"pp-s\" x=\"60\" y=\"37\" text-anchor=\"middle\">GMSL\u003c/text>\u003c/g>\u003cg class=\"pp-chip\" data-k=\"des\" transform=\"translate(366 46)\">\u003cpath class=\"pp-pins\" pathLength=\"1\" d=\"M10 -4V0M10 48V52M18 -4V0M18 48V52M26 -4V0M26 48V52M34 -4V0M34 48V52M42 -4V0M42 48V52M50 -4V0M50 48V52M58 -4V0M58 48V52M66 -4V0M66 48V52M74 -4V0M74 48V52M82 -4V0M82 48V52M90 -4V0M90 48V52M98 -4V0M98 48V52M106 -4V0M106 48V52M114 -4V0M114 48V52M122 -4V0M122 48V52M130 -4V0M130 48V52\"/>\u003crect class=\"pp-body\" width=\"140\" height=\"48\" rx=\"3\"/>\u003cpath class=\"pp-out\" pathLength=\"1\" d=\"M3 0H137Q140 0 140 3V45Q140 48 137 48H3Q0 48 0 45V3Q0 0 3 0Z\"/>\u003ctext class=\"pp-t\" x=\"70\" y=\"23\" text-anchor=\"middle\">Deserializer\u003c/text>\u003ctext class=\"pp-s\" x=\"70\" y=\"37\" text-anchor=\"middle\">GMSL\u003c/text>\u003c/g>\u003cg class=\"pp-chip\" data-k=\"rad\" transform=\"translate(20 182)\">\u003cpath class=\"pp-pins\" pathLength=\"1\" d=\"M10 -4V0M10 48V52M18 -4V0M18 48V52M26 -4V0M26 48V52M34 -4V0M34 48V52M42 -4V0M42 48V52M50 -4V0M50 48V52M58 -4V0M58 48V52M66 -4V0M66 48V52M74 -4V0M74 48V52M82 -4V0M82 48V52M90 -4V0M90 48V52\"/>\u003crect class=\"pp-body\" width=\"104\" height=\"48\" rx=\"3\"/>\u003cpath class=\"pp-out\" pathLength=\"1\" d=\"M3 0H101Q104 0 104 3V45Q104 48 101 48H3Q0 48 0 45V3Q0 0 3 0Z\"/>\u003ctext class=\"pp-t\" x=\"52\" y=\"23\" text-anchor=\"middle\">Radar\u003c/text>\u003ctext class=\"pp-s\" x=\"52\" y=\"37\" text-anchor=\"middle\">77 GHz\u003c/text>\u003c/g>\u003cg class=\"pp-chip\" data-k=\"net\" transform=\"translate(366 290)\">\u003cpath class=\"pp-pins\" pathLength=\"1\" d=\"M10 -4V0M10 44V48M18 -4V0M18 44V48M26 -4V0M26 44V48M34 -4V0M34 44V48M42 -4V0M42 44V48M50 -4V0M50 44V48M58 -4V0M58 44V48M66 -4V0M66 44V48M74 -4V0M74 44V48M82 -4V0M82 44V48M90 -4V0M90 44V48M98 -4V0M98 44V48M106 -4V0M106 44V48M114 -4V0M114 44V48M122 -4V0M122 44V48M130 -4V0M130 44V48\"/>\u003crect class=\"pp-body\" width=\"140\" height=\"44\" rx=\"3\"/>\u003cpath class=\"pp-out\" pathLength=\"1\" d=\"M3 0H137Q140 0 140 3V41Q140 44 137 44H3Q0 44 0 41V3Q0 0 3 0Z\"/>\u003ctext class=\"pp-t\" x=\"70\" y=\"21\" text-anchor=\"middle\">Vehicle network\u003c/text>\u003ctext class=\"pp-s\" x=\"70\" y=\"35\" text-anchor=\"middle\">Ethernet\u003c/text>\u003c/g>\u003cg class=\"pp-chip pp-soc\" data-k=\"soc\" transform=\"translate(346 148)\">\u003cpath class=\"pp-pins\" pathLength=\"1\" d=\"M10 -4V0M10 104V108M18 -4V0M18 104V108M26 -4V0M26 104V108M34 -4V0M34 104V108M42 -4V0M42 104V108M50 -4V0M50 104V108M58 -4V0M58 104V108M66 -4V0M66 104V108M74 -4V0M74 104V108M82 -4V0M82 104V108M90 -4V0M90 104V108M98 -4V0M98 104V108M106 -4V0M106 104V108M114 -4V0M114 104V108M122 -4V0M122 104V108M130 -4V0M130 104V108M138 -4V0M138 104V108M146 -4V0M146 104V108M154 -4V0M154 104V108M162 -4V0M162 104V108M170 -4V0M170 104V108M-4 10H0M180 10H184M-4 18H0M180 18H184M-4 26H0M180 26H184M-4 34H0M180 34H184M-4 42H0M180 42H184M-4 50H0M180 50H184M-4 58H0M180 58H184M-4 66H0M180 66H184M-4 74H0M180 74H184M-4 82H0M180 82H184M-4 90H0M180 90H184\"/>\u003crect class=\"pp-body\" width=\"180\" height=\"104\" rx=\"3\"/>\u003cpath class=\"pp-out\" pathLength=\"1\" d=\"M3 0H177Q180 0 180 3V101Q180 104 177 104H3Q0 104 0 101V3Q0 0 3 0Z\"/>\u003ctext class=\"pp-t\" x=\"12\" y=\"21\">System on chip\u003c/text>\u003cg class=\"pp-die\">\u003crect class=\"pp-cell\" data-c=\"0\" data-r=\"0\" x=\"15\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"1\" data-r=\"0\" x=\"29\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"2\" data-r=\"0\" x=\"43\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"3\" data-r=\"0\" x=\"57\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"4\" data-r=\"0\" x=\"71\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"5\" data-r=\"0\" x=\"85\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"6\" data-r=\"0\" x=\"99\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"7\" data-r=\"0\" x=\"113\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"8\" data-r=\"0\" x=\"127\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"9\" data-r=\"0\" x=\"141\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"10\" data-r=\"0\" x=\"155\" y=\"34\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"0\" data-r=\"1\" x=\"15\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"1\" data-r=\"1\" x=\"29\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"2\" data-r=\"1\" x=\"43\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"3\" data-r=\"1\" x=\"57\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"4\" data-r=\"1\" x=\"71\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"5\" data-r=\"1\" x=\"85\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"6\" data-r=\"1\" x=\"99\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"7\" data-r=\"1\" x=\"113\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"8\" data-r=\"1\" x=\"127\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"9\" data-r=\"1\" x=\"141\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"10\" data-r=\"1\" x=\"155\" y=\"48\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"0\" data-r=\"2\" x=\"15\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"1\" data-r=\"2\" x=\"29\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"2\" data-r=\"2\" x=\"43\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"3\" data-r=\"2\" x=\"57\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"4\" data-r=\"2\" x=\"71\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"5\" data-r=\"2\" x=\"85\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"6\" data-r=\"2\" x=\"99\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"7\" data-r=\"2\" x=\"113\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"8\" data-r=\"2\" x=\"127\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"9\" data-r=\"2\" x=\"141\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"10\" data-r=\"2\" x=\"155\" y=\"62\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"0\" data-r=\"3\" x=\"15\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"1\" data-r=\"3\" x=\"29\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"2\" data-r=\"3\" x=\"43\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"3\" data-r=\"3\" x=\"57\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"4\" data-r=\"3\" x=\"71\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"5\" data-r=\"3\" x=\"85\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"6\" data-r=\"3\" x=\"99\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"7\" data-r=\"3\" x=\"113\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"8\" data-r=\"3\" x=\"127\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"9\" data-r=\"3\" x=\"141\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003crect class=\"pp-cell\" data-c=\"10\" data-r=\"3\" x=\"155\" y=\"76\" width=\"10\" height=\"10\" rx=\"1\"/>\u003c/g>\u003c/g>\u003c/g>\u003cg class=\"pp-ivs\">\u003ctext class=\"pp-iv\" data-k=\"link\" x=\"328\" y=\"38\" text-anchor=\"middle\">[0, 6] Gbps\u003c/text>\u003ctext class=\"pp-iv\" data-k=\"radar\" x=\"235\" y=\"196\" text-anchor=\"middle\">[0, 50] ms\u003c/text>\u003cg class=\"pp-meter\">\u003ctext class=\"pp-iv\" data-k=\"frame\" x=\"540\" y=\"176\">[0, 33] ms\u003c/text>\u003ctext class=\"pp-s pp-ml\" x=\"540\" y=\"192\">per frame\u003c/text>\u003crect class=\"pp-track\" x=\"540\" y=\"201\" width=\"88\" height=\"3\"/>\u003cpath class=\"pp-lim\" d=\"M540 197V208M628 197V208\"/>\u003crect class=\"pp-fill\" x=\"540\" y=\"201\" width=\"0\" height=\"3\"/>\u003ctext class=\"pp-val\" x=\"540\" y=\"226\">0 ms\u003c/text>\u003c/g>\u003c/g>\u003cg class=\"pp-pk\" filter=\"url(#pp-glow-%U%)\">\u003c/g>\u003c/svg>","timing_c":"\u003csvg class=\"inst inst-c\" data-x0=\"124\" data-x1=\"410\" data-steps=\"60\" viewBox=\"0 0 420 236\" role=\"img\" aria-labelledby=\"tic-t-%U% tic-d-%U%\">\u003ctitle id=\"tic-t-%U%\">Timing: the response must land within ten microseconds of the interrupt\u003c/title>\u003cdesc id=\"tic-d-%U%\">The interrupt arrives at 2 microseconds. The frontier model responds at 15.6, which is 3.6 late. The engineer responds at 8.4.\u003c/desc>\u003cdefs>\u003cclipPath id=\"clip-tic-%U%\">\u003crect class=\"sweep-rect\" x=\"124\" y=\"0\" width=\"286\" height=\"236\"/>\u003c/clipPath>\u003c/defs>\u003cline class=\"g\" x1=\"124\" y1=\"20\" x2=\"124\" y2=\"200\"/>\u003ctext class=\"t-tick\" x=\"124\" y=\"222\" text-anchor=\"middle\">0\u003c/text>\u003cline class=\"g\" x1=\"267\" y1=\"20\" x2=\"267\" y2=\"200\"/>\u003ctext class=\"t-tick\" x=\"267\" y=\"222\" text-anchor=\"middle\">10\u003c/text>\u003cline class=\"g\" x1=\"410\" y1=\"20\" x2=\"410\" y2=\"200\"/>\u003ctext class=\"t-tick\" x=\"410\" y=\"222\" text-anchor=\"end\">20 µs\u003c/text>\u003crect class=\"band\" x=\"152.6\" y=\"88\" width=\"143\" height=\"108\"/>\u003cpath class=\"brk\" d=\"M160.6 84H152.6V200H160.6\"/>\u003cpath class=\"brk\" d=\"M287.6 84H295.6V200H287.6\"/>\u003ctext class=\"t-lim\" x=\"224.1\" y=\"76\" text-anchor=\"middle\">[0, 10] µs\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"49\">Interrupt\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"112\">Model\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"168\">Engineer\u003c/text>\u003cg clip-path=\"url(#clip-tic-%U%)\">\u003cpath class=\"tr\" d=\"M124 52H152.6V34H410\"/>\u003cpath class=\"tr\" d=\"M124 122H295.6\"/>\u003cpath class=\"tr-lim\" d=\"M295.6 122H347.1V104H410\"/>\u003cpath class=\"tr\" d=\"M124 178H244.1V160H410\"/>\u003c/g>\u003cg class=\"res\">\u003ctext class=\"t-res-lim\" x=\"0\" y=\"130\">15.6 µs late\u003c/text>\u003ctext class=\"t-res\" x=\"0\" y=\"186\">8.4 µs\u003c/text>\u003c/g>\u003cline class=\"sweep-line\" x1=\"410\" y1=\"16\" x2=\"410\" y2=\"202\"/>\u003c/svg>","memory_c":"\u003csvg class=\"inst inst-c\" data-x0=\"124\" data-x1=\"408\" data-steps=\"38\" viewBox=\"0 0 420 204\" role=\"img\" aria-labelledby=\"mec-t-%U% mec-d-%U%\">\u003ctitle id=\"mec-t-%U%\">Memory: the build must fit 128 kilobytes of RAM\u003c/title>\u003cdesc id=\"mec-d-%U%\">The frontier model needs 151 kilobytes, 23 over the limit. The engineer needs 118.\u003c/desc>\u003cdefs>\u003cclipPath id=\"clip-mec-%U%\">\u003crect class=\"sweep-rect\" x=\"124\" y=\"0\" width=\"284\" height=\"204\"/>\u003c/clipPath>\u003c/defs>\u003cline class=\"g\" x1=\"124\" y1=\"36\" x2=\"124\" y2=\"168\"/>\u003ctext class=\"t-tick\" x=\"124\" y=\"190\" text-anchor=\"middle\">0\u003c/text>\u003cline class=\"g\" x1=\"244.4\" y1=\"36\" x2=\"244.4\" y2=\"168\"/>\u003ctext class=\"t-tick\" x=\"244.4\" y=\"190\" text-anchor=\"middle\">64\u003c/text>\u003cline class=\"g\" x1=\"364.7\" y1=\"36\" x2=\"364.7\" y2=\"168\"/>\u003ctext class=\"t-tick\" x=\"364.7\" y=\"190\" text-anchor=\"middle\">128 KB\u003c/text>\u003cpath class=\"brk2\" d=\"M127 32H117V172H127\"/>\u003cpath class=\"brk2\" d=\"M361.7 32H371.7V172H361.7\"/>\u003ctext class=\"t-lim\" x=\"244.4\" y=\"22\" text-anchor=\"middle\">[0, 128] KB\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"64\">Model\u003c/text>\u003ctext class=\"t-lane\" x=\"0\" y=\"130\">Engineer\u003c/text>\u003cg clip-path=\"url(#clip-mec-%U%)\">\u003crect class=\"bar\" x=\"124\" y=\"52\" width=\"240.7\" height=\"34\"/>\u003crect class=\"bar-lim\" x=\"364.7\" y=\"52\" width=\"43.3\" height=\"34\"/>\u003crect class=\"bar\" x=\"124\" y=\"118\" width=\"221.9\" height=\"34\"/>\u003c/g>\u003cg class=\"res\">\u003ctext class=\"t-res-lim\" x=\"0\" y=\"82\">151 KB,\u003c/text>\u003ctext class=\"t-res-lim\" x=\"0\" y=\"99\">23 over\u003c/text>\u003ctext class=\"t-res\" x=\"0\" y=\"148\">118 KB\u003c/text>\u003c/g>\u003cline class=\"sweep-line\" x1=\"408\" y1=\"30\" x2=\"408\" y2=\"174\"/>\u003c/svg>","power_c":"\u003csvg class=\"inst inst-c\" data-x0=\"124\" data-x1=\"410\" data-steps=\"80\" viewBox=\"0 0 420 240\" role=\"img\" aria-labelledby=\"poc-t-%U% poc-d-%U%\">\u003ctitle id=\"poc-t-%U%\">Power: average current must stay within 2.5 milliamperes\u003c/title>\u003cdesc id=\"poc-d-%U%\">The frontier model keeps the chip awake and averages 3.85 milliamperes. The engineer lets it sleep between wake-ups and averages 0.95.\u003c/desc>\u003cdefs>\u003cclipPath id=\"clip-poc-%U%\">\u003crect class=\"sweep-rect\" x=\"124\" y=\"0\" width=\"286\" height=\"240\"/>\u003c/clipPath>\u003c/defs>\u003cline class=\"g\" x1=\"124\" y1=\"26\" x2=\"124\" y2=\"198\"/>\u003ctext class=\"t-tick\" x=\"124\" y=\"220\" text-anchor=\"middle\">0\u003c/text>\u003cline class=\"g\" x1=\"267\" y1=\"26\" x2=\"267\" y2=\"198\"/>\u003ctext class=\"t-tick\" x=\"267\" y=\"220\" text-anchor=\"middle\">250\u003c/text>\u003cline class=\"g\" x1=\"410\" y1=\"26\" x2=\"410\" y2=\"198\"/>\u003ctext class=\"t-tick\" x=\"410\" y=\"220\" text-anchor=\"end\">500 ms\u003c/text>\u003ctext class=\"t-lim\" x=\"267\" y=\"16\" text-anchor=\"middle\">[0, 2.5] mA average\u003c/text>\u003cline class=\"g\" x1=\"124\" y1=\"108\" x2=\"410\" y2=\"108\"/>\u003cline class=\"budget\" x1=\"124\" y1=\"92.6\" x2=\"410\" y2=\"92.6\"/>\u003ctext class=\"t-lane\" x=\"0\" y=\"68\">Model\u003c/text>\u003cline class=\"g\" x1=\"124\" y1=\"198\" x2=\"410\" y2=\"198\"/>\u003cline class=\"budget\" x1=\"124\" y1=\"182.6\" x2=\"410\" y2=\"182.6\"/>\u003ctext class=\"t-lane\" x=\"0\" y=\"158\">Engineer\u003c/text>\u003cg clip-path=\"url(#clip-poc-%U%)\">\u003cpath class=\"tr-lim\" d=\"M124 88.9H146.9V34H150.9V88.9H204.1V34H208.1V88.9H261.3V34H265.3V88.9H318.5V34H322.5V88.9H375.7V34H379.7V88.9H410\"/>\u003cpath class=\"tr\" d=\"M124 197.7H146.9V124H150.9V197.7H204.1V124H208.1V197.7H261.3V124H265.3V197.7H318.5V124H322.5V197.7H375.7V124H379.7V197.7H410\"/>\u003c/g>\u003cg class=\"res\">\u003cline class=\"avg-lim\" x1=\"124\" y1=\"84.3\" x2=\"410\" y2=\"84.3\"/>\u003ctext class=\"t-res-lim\" x=\"0\" y=\"86\">3.85 mA over\u003c/text>\u003cline class=\"avg\" x1=\"124\" y1=\"192.1\" x2=\"410\" y2=\"192.1\"/>\u003ctext class=\"t-res\" x=\"0\" y=\"176\">0.95 mA\u003c/text>\u003c/g>\u003cline class=\"sweep-line\" x1=\"410\" y1=\"22\" x2=\"410\" y2=\"198\"/>\u003c/svg>"};
/* v35: the tab icon, the white box on navy that biftu.com used before the new site (svg, 32 px png, 180 px png for iPhones) */
HL.ICONS = {"svg":"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%23040018%22/%3E%3Cg transform=%22translate%2821.3 9.45%29 scale%280.0812%29%22 fill=%22%23EDEDE7%22%3E%3Cpath d=%22M0 0H131.5V81H81V475H131.5V556H0Z%22/%3E%3Cpath d=%22M130 0H263V556H130V475H183V81H130Z%22/%3E%3C/g%3E%3C/svg%3E%0A","png32":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAn0lEQVR4nOzWPQqEMBAF4ImkXUHZhW2XRbyClV5FPINn8AriOcRSr2CZQi9goYj2/lRBEESiQZF53cAkXxXyKIUvyAwFyXk88P5opvnno6KQYRiXC4yVTd2CMGA7VhgFfJxvn43lguf6SZyCMHA8twG6rjd+Nh9Zkem6tucgvgMEEEAAgUcBqvqq6nz9ZZ4GCEc6QLar4/HaQrCbXg5MAAAA//8rmxVuAAAABklEQVQDAFAnJ2NOE7YuAAAAAElFTkSuQmCC","png180":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAACVklEQVR4nOzbMWpUYRRA4T8wxYhCIAlkSJF1pLMUV2GvpbgDK1G0FSwk2LqC7CKQZSQQiDAPXuEGPJW8wCPft4bDvc29m83YDfiXzYAgDpI4SOIgiYMkDpI4SOIgiYMkDpI4SOIgiYMkDpI4SOIgiYMkDpI4SOIgiYMkDpI4SOIgiYO0vjiev3j29t2bsYCj48O72/uxgHmev375MdbmYHXvkKe7k+ubq7GA/X6/3W7HAqZpOj+7GGtjrZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZCeUBwf3n+8/Pl7/J9Xr19e/vo2ngaTgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJg3SwGbuxKqe7k+ubq7GA/X6/3W7HAqZpOj+7GGtjcpDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDWF8fDw5/Pn76PBRwdH97d3o8FzPM8Vmh9Z4I8GmuFJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImD9BcAAP//9kXvQwAAAAZJREFUAwAoVS64dy4ydgAAAABJRU5ErkJggg=="};
HL.FONT_HREF = 'https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300..800;1,300..800&family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap';

var reduce = false;
try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
var sleep = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
HL.esc = esc;

/* ---------- render helpers ---------- */
var R = {edit: false, uid: 0};
function inl(v){ return esc(v).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>'); }
function F(path, val, tag, cls, ph){
  return '<' + tag + (cls ? ' class="' + cls + '"' : '') + ' data-f="' + path + '"' + (ph ? ' data-ph="' + esc(ph) + '"' : '') + '>' + (!R.edit && /^(h[1-3]|p)$/.test(tag) && cls !== 'lab' ? inl(val) : esc(val)) + '</' + tag + '>';
}
function O(path, val, tag, cls, ph){ return (val || R.edit) ? F(path, val, tag, cls, ph) : ''; }
function isExt(h){ return /^https?:/i.test(h || ''); }
function A(path, link, cls, attrs){
  link = link || {t:'', h:''};
  var ext = isExt(link.h);
  return '<a' + (cls ? ' class="' + cls + '"' : '') + ' href="' + esc(link.h || '#') + '"' + (ext ? ' target="_blank" rel="noopener"' : '') +
    ' data-href="' + path + '.h"' + (R.edit ? ' draggable="false"' : '') + (attrs || '') + '>' +
    F(path + '.t', link.t, 'span', '', 'Link text') + (ext ? '<span class="ext" aria-hidden="true"> ↗</span>' : '') + '</a>';
}
function OA(path, link, cls, attrs){ return (link && link.t) || R.edit ? A(path, link, cls, attrs) : ''; }
/* markdown for body text: paragraphs, line breaks, - lists, 1. lists, **bold**, *italic*, `code`, [text](url) */
function inl(t){
  var s = esc(t);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![\w*])/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function(m, txt, u){
    var ok = /^(https?:|mailto:|#)/i.test(u.replace(/&amp;/g, '&')) ? u : '#';
    return '<a href="' + ok + '"' + (/^https?:/i.test(ok) ? ' target="_blank" rel="noopener"' : '') + '>' + txt + '</a>';
  });
  return s;
}
/* long-form extras for blog posts: ## headings, > quotes (a "-- name" line is the source), | tables |, --- rules, ![caption](image url) */
HL.md = function(src){
  var lines = String(src == null ? '' : src).replace(/\r/g, '').split('\n'), out = [], para = [], list = null, quote = null, table = null, fence = null;
  function flushP(){ if (para.length) { out.push('<p>' + para.map(inl).join('<br>') + '</p>'); para = []; } }
  function flushL(){
    if (!list) return;
    out.push('<div class="mdl" role="list">' + list.items.map(function(it){
      return '<p class="li' + (list.ol ? ' ol' : '') + '" role="listitem"' + (list.ol ? ' data-n="' + esc(it.n) + '."' : '') + '>' + inl(it.t) + '</p>';
    }).join('') + '</div>');
    list = null;
  }
  function flushQ(){
    if (!quote) return;
    var paras = [], cur = [];
    quote.forEach(function(l){ if (/^\s*$/.test(l)) { if (cur.length) paras.push(cur); cur = []; } else cur.push(l.trim()); });
    if (cur.length) paras.push(cur);
    out.push('<blockquote>' + paras.map(function(ls){
      var c = ls.length === 1 && ls[0].match(/^(?:--|—|–)\s*(.+)$/);
      return c ? '<p class="cite">' + inl(c[1]) + '</p>' : '<p>' + ls.map(inl).join('<br>') + '</p>';
    }).join('') + '</blockquote>');
    quote = null;
  }
  function cells(l){ return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function(c){ return c.trim(); }); }
  function flushT(){
    if (!table) return;
    var rows = table.map(cells), head = null;
    if (rows.length > 1 && rows[1].every(function(c){ return /^:?-{2,}:?$/.test(c); })) { head = rows[0]; rows = rows.slice(2); }
    var num = function(c){ return /^[~≈<>]?\s?[€$£₹]?\s?\d/.test(c) ? ' class="n"' : ''; };
    var nc = Math.max.apply(null, rows.concat(head ? [head] : []).map(function(r){ return r.length; }).concat([1]));
    out.push('<div class="tblw"><table class="mdt c' + Math.min(9, nc) + '">' + (head ? '<thead><tr>' + head.map(function(c){ return '<th>' + inl(c) + '</th>'; }).join('') + '</tr></thead>' : '') +
      '<tbody>' + rows.map(function(r){ return '<tr>' + r.map(function(c){ return '<td' + num(c) + '>' + inl(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>');
    table = null;
  }
  function flushAll(){ flushP(); flushL(); flushQ(); flushT(); }
  lines.forEach(function(l){
    var m;
    if (fence) { if (/^\s*```\s*$/.test(l)) { out.push(HL.mdChart(fence.join('\n'))); fence = null; } else fence.push(l); return; }
    if (/^\s*```chart\s*$/.test(l)) { flushAll(); fence = []; return; }
    if (table && /^\s*\|/.test(l)) { table.push(l); return; }
    flushT();
    if ((m = l.match(/^\s*>\s?(.*)$/))) { flushP(); flushL(); (quote || (quote = [])).push(m[1]); return; }
    flushQ();
    if (/^\s*$/.test(l)) { flushP(); flushL(); return; }
    if (/^\s*\|/.test(l)) { flushP(); flushL(); table = [l]; return; }
    if ((m = l.match(/^\s*(#{1,4})\s+(.*)$/))) { flushAll(); out.push(m[1].length <= 2 ? '<h2>' + inl(m[2]) + '</h2>' : '<h3>' + inl(m[2]) + '</h3>'); return; }
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(l)) { flushAll(); out.push('<hr>'); return; }
    if ((m = l.match(/^\s*!\[([^\]]*)\]\(([^)\s]+)\)\s*$/))) {
      flushAll();
      var u = /^(https?:|data:image\/|\/|\.\/)/i.test(m[2]) ? m[2] : '';
      if (u) out.push('<figure class="md-img"><img src="' + esc(u) + '" alt="' + esc(m[1]) + '" loading="lazy">' + (m[1] ? '<figcaption>' + inl(m[1]) + '</figcaption>' : '') + '</figure>');
      return;
    }
    if ((m = l.match(/^\s*[-*•]\s+(.*)$/))) { flushP(); if (!list || list.ol) { flushL(); list = {ol: false, items: []}; } list.items.push({t: m[1]}); return; }
    if ((m = l.match(/^\s*(\d+)[.)]\s+(.*)$/))) { flushP(); if (!list || !list.ol) { flushL(); list = {ol: true, items: []}; } list.items.push({n: m[1], t: m[2]}); return; }
    flushL(); para.push(l.trim());
  });
  flushAll();
  if (fence) out.push(HL.mdChart(fence.join('\n')));
  return out.join('');
};
/* v73: charts in blog posts. A ```chart block holds JSON: {type: ci | bars | stack | group | pair, title, rows, ...}.
   Drawn as HTML, so the charts use the site's fonts and colours and reflow on phones. */
HL.mdChart = function(src){
  var c;
  try { c = JSON.parse(src); } catch (e) { return '<pre class="mdc-err">' + esc(src) + '</pre>'; }
  var rows = c.rows || [], max = +c.max || 100, ticks = c.ticks || [0, max / 4, max / 2, max * 3 / 4, max], keys = c.keys || [];
  var pc = function(v){ return (Math.max(0, Math.min(max, +v || 0)) / max * 100).toFixed(2) + '%'; };
  var num = function(v, d){ return (c.pre || '') + (+v || 0).toFixed(d == null ? (c.dec == null ? 1 : c.dec) : d) + (c.unit || ''); };
  var grid = '<span class="mdc-g" aria-hidden="true">' + ticks.map(function(t){ return '<i style="left:' + pc(t) + '"></i>'; }).join('') + '</span>';
  var axis = '<div class="mdc-r mdc-ax" aria-hidden="true"><span class="mdc-n"></span><span class="mdc-t">' + ticks.map(function(t, i){
    return '<i style="left:' + pc(t) + '">' + esc((c.pre || '') + t + (i === ticks.length - 1 ? (c.unit || '') : '')) + '</i>'; }).join('') + '</span><span class="mdc-v"></span></div>';
  var name = function(r){ return '<span class="mdc-n">' + esc(r.n) + (r.tag ? '<b class="mdc-tag">' + esc(r.tag) + '</b>' : '') + (r.sub ? '<small>' + esc(r.sub) + '</small>' : '') + '</span>'; };
  var legend = function(cls){ return keys.length ? '<p class="mdc-lg">' + keys.map(function(k, i){ return '<span><i class="' + cls + i + '"></i>' + esc(k) + '</span>'; }).join('') + '</p>' : ''; };
  var body = '', lg = '', kind = c.type || 'bars', withAxis = true;
  if (kind === 'ci' || kind === 'bars') {
    body = rows.map(function(r){
      var ci = kind === 'ci' && r.lo != null && r.hi != null;
      return '<div class="mdc-r' + (r.hl ? ' hl' : '') + '" role="listitem">' + name(r) + '<span class="mdc-t">' + grid + '<i class="mdc-b" style="width:' + pc(r.v) + '"></i>' +
        (ci ? '<i class="mdc-ci" style="left:' + pc(r.lo) + ';width:' + ((Math.min(max, r.hi) - Math.max(0, r.lo)) / max * 100).toFixed(2) + '%"></i>' : '') + '</span>' +
        '<span class="mdc-v">' + esc(r.lab != null ? r.lab : num(r.v)) + (ci ? '<small>' + esc(r.lo + '–' + r.hi) + '</small>' : '') + '</span></div>';
    }).join('');
  } else if (kind === 'stack') {
    var tot = +c.total || 1;
    lg = legend('k');
    body = rows.map(function(r){
      var p = r.p || [];
      return '<div class="mdc-r' + (r.hl ? ' hl' : '') + '" role="listitem">' + name(r) + '<span class="mdc-t"><span class="mdc-s">' + p.map(function(v, i){
        return '<i class="k' + i + '" style="width:' + (v / tot * 100).toFixed(2) + '%"></i>'; }).join('') + '</span></span>' +
        '<span class="mdc-v">' + esc(r.lab != null ? r.lab : (p[0] || 0) + ' / ' + ((p[0] || 0) + (p[1] || 0))) + '</span></div>';
    }).join('');
    withAxis = false;
  } else if (kind === 'group') {
    lg = legend('k');
    body = rows.map(function(r){
      return '<div class="mdc-r" role="listitem">' + name(r) + '<span class="mdc-t">' + (r.v || []).map(function(v, i){
        return '<span class="mdc-gl"><i class="mdc-b k' + i + '" style="width:calc(' + pc(v) + ' * .82)"></i><em>' + esc(num(v, 0)) + '</em></span>'; }).join('') + '</span></div>';
    }).join('');
    withAxis = false;
  } else if (kind === 'pair') {
    lg = legend('p');
    body = rows.map(function(r){
      var lo = Math.min(r.a, r.b), hi = Math.max(r.a, r.b);
      return '<div class="mdc-r" role="listitem">' + name(r) + '<span class="mdc-t">' + grid + '<i class="mdc-pl" style="left:' + pc(lo) + ';width:' + ((hi - lo) / max * 100).toFixed(2) + '%"></i>' +
        '<i class="mdc-p p0" style="left:' + pc(r.a) + '"></i><i class="mdc-p p1" style="left:' + pc(r.b) + '"></i></span>' +
        '<span class="mdc-v">' + esc(num(r.b)) + '<small>' + esc((keys[0] || 'was') + ' ' + num(r.a)) + '</small></span></div>';
    }).join('');
  }
  return '<figure class="mdc t-' + esc(kind) + '">' + (c.title ? '<figcaption class="mdc-h">' + esc(c.title) + '</figcaption>' : '') + lg +
    '<div class="mdc-rows" role="list">' + body + '</div>' + (withAxis ? axis : '') + (c.note ? '<p class="mdc-note">' + inl(c.note) + '</p>' : '') + '</figure>';
};

function M(path, val, cls, ph){ return '<div class="md' + (cls ? ' ' + cls : '') + '" data-f="' + path + '" data-md="1"' + (ph ? ' data-ph="' + esc(ph) + '"' : '') + '>' + HL.md(val) + '</div>'; }
function OM(path, val, cls, ph){ return (val || R.edit) ? M(path, val, cls, ph) : ''; }
function IT(listPath, i){ return ' data-item="' + listPath + '" data-i="' + i + '"'; }
function each(listPath, arr, fn){ return (arr || []).map(function(it, i){ return fn(it, i, listPath + '.' + i, IT(listPath, i)); }).join(''); }
function svg(name){ var u = ++R.uid; return (SVG[name] || '').replace(/%U%/g, String(u)); }
function btnTag(){ return R.edit ? 'span' : 'button'; }

/* ---------- generated post covers: one quiet instrument drawing per post, the same every time for a given seed ---------- */
var CW = 1200, CH = 630;
HL.COVER_STYLES = [['grid', 'Die grid'], ['trace', 'Traces'], ['wave', 'Signal'], ['bars', 'Distribution'], ['field', 'Dot field'], ['rings', 'Radar']];
function rng(seed){
  var a = (Math.abs(Math.floor(+seed || 1)) * 2654435761) >>> 0;
  return function(){ a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function n1(v){ return Math.round(v * 10) / 10; }
function f2(v){ return (Math.round(v * 100) / 100).toFixed(2); }
function hex2(v){ return ('0' + (Math.max(0, Math.round(v)) % 256).toString(16).toUpperCase()).slice(-2); }
function line(x1, y1, x2, y2, cls, extra){ return '<path class="' + cls + '" d="M' + n1(x1) + ' ' + n1(y1) + 'L' + n1(x2) + ' ' + n1(y2) + '"' + (extra || '') + '/>'; }
/* interval bracket [ ] over x1..x2, label above (or below) */
function bracket(x1, x2, y, lab, below){
  var t = 10;
  return '<path class="ln" d="M' + n1(x1 + t) + ' ' + n1(y - t) + 'H' + n1(x1) + 'V' + n1(y + t) + 'H' + n1(x1 + t) + 'M' + n1(x2 - t) + ' ' + n1(y - t) + 'H' + n1(x2) + 'V' + n1(y + t) + 'H' + n1(x2 - t) + '"/>' +
    line(x1 + 5, y, x2 - 5, y, 'dm', ' stroke-dasharray="2 6"') +
    (lab ? '<text x="' + n1(x1) + '" y="' + n1(below ? y + t + 26 : y - t - 12) + '">' + esc(lab) + '</text>' : '');
}
var COV = {
  grid: function(r){
    var s = 24 + Math.floor(r() * 9), g = 7, st = s + g;
    var x0 = 360 + Math.floor(r() * 140), cols = Math.floor((CW - 72 - x0) / st), rows = Math.floor((CH - 230) / st);
    var y0 = Math.round((CH - rows * st + g) / 2) + 18, o = '';
    var hot = [Math.floor(r() * cols), Math.floor(r() * rows)];
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
      var v = r(), x = x0 + i * st, y = y0 + j * st, cls = 'rl';
      if (i === hot[0] && j === hot[1]) cls = 'af';
      else if (v < 0.07) cls = 'fg';
      else if (v < 0.25) cls = 'df';
      o += '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '"' + (cls === 'rl' ? ' fill="none"' : '') + '/>';
    }
    for (var k = 0; k < rows; k++) {
      if (r() < 0.45) continue;
      var py = y0 + k * st + s / 2, L = 40 + r() * (x0 - 200);
      o += line(x0 - 12 - L, py, x0 - 10, py, k % 3 ? 'rl' : 'dm') + '<rect class="dm" fill="none" x="' + n1(x0 - 18 - L) + '" y="' + n1(py - 3) + '" width="6" height="6"/>';
    }
    var a = 1 + Math.floor(r() * Math.max(1, cols / 3)), b = Math.min(cols, a + 3 + Math.floor(r() * 4));
    return o + bracket(x0 + a * st, x0 + b * st - g, y0 - 30, '[0x' + hex2(a * 16) + ', 0x' + hex2(b * 16 - 1) + ']');
  },
  trace: function(r){
    var w = 220 + Math.floor(r() * 70), h = 220 + Math.floor(r() * 60), cx = 690 + Math.floor(r() * 170), cy = Math.round((CH - h) / 2 + (r() - 0.5) * 50);
    var n = 9 + Math.floor(r() * 5), pins = [], starts = [], o = '';
    for (var i = 0; i < n; i++) pins.push(cy + 22 + i * (h - 44) / (n - 1));
    for (var j = 0; j < n; j++) starts.push(54 + r() * (CH - 108));
    starts.sort(function(p, q){ return p - q; });
    for (var k = 1; k < n; k++) if (starts[k] - starts[k - 1] < 16) starts[k] = starts[k - 1] + 16;
    var B = cx - 70 - Math.floor(r() * 60), acc = Math.floor(r() * n);
    for (var m = 0; m < n; m++) {
      var dy = pins[m] - starts[m], bx = B - Math.abs(dy), cls = m === acc ? 'ac w2' : (m % 3 ? 'rl' : 'dm');
      o += '<path class="' + cls + '" d="M0 ' + n1(starts[m]) + 'H' + n1(bx) + 'L' + n1(B) + ' ' + n1(pins[m]) + 'H' + (cx - 12) + '"/>';
      if (r() < 0.4 && bx > 30) o += '<circle class="dm" fill="none" cx="' + n1(bx) + '" cy="' + n1(starts[m]) + '" r="5"/>';
      o += line(cx - 12, pins[m], cx, pins[m], 'ln');
      if (m === acc) o += '<rect class="af" x="' + n1(Math.max(20, bx * (0.35 + r() * 0.4))) + '" y="' + n1(starts[m] - 3) + '" width="16" height="6"/>';
    }
    o += '<rect class="ln" fill="none" x="' + cx + '" y="' + cy + '" width="' + w + '" height="' + h + '"/>' +
      '<rect class="dm" fill="none" x="' + (cx + 30) + '" y="' + (cy + 30) + '" width="' + (w - 60) + '" height="' + (h - 60) + '"/>';
    var q = 4 + Math.floor(r() * 3), cs = (w - 60) / q;
    for (var u = 1; u < q; u++) o += line(cx + 30 + u * cs, cy + 30, cx + 30 + u * cs, cy + h - 30, 'rl') + line(cx + 30, cy + 30 + u * (h - 60) / q, cx + w - 30, cy + 30 + u * (h - 60) / q, 'rl');
    for (var t = 0; t < 4; t++) { var ry = cy + 40 + t * (h - 80) / 3; o += '<path class="dm" d="M' + (cx + w) + ' ' + n1(ry) + 'H' + n1(cx + w + 50 + r() * 60) + 'L' + n1(cx + w + 90 + r() * 60) + ' ' + n1(ry + (r() - 0.5) * 60) + 'H' + CW + '"/>'; }
    return o + bracket(cx, cx + w, cy + h + 32, '[0, ' + (8 << Math.floor(r() * 3)) + '] GB/s', true);
  },
  wave: function(r){
    var y0 = CH * 0.54, A1 = 70 + r() * 40, k1 = (1.6 + r() * 1.6) * 2 * Math.PI / CW, p1 = r() * 6.28, A2 = 22 + r() * 22, k2 = (6 + r() * 6) * 2 * Math.PI / CW, p2 = r() * 6.28;
    var pts = [], nz = 0, top = CH, o = '';
    for (var x = 0; x <= CW; x += 5) { nz = nz * 0.82 + (r() - 0.5) * 7; var y = y0 - (A1 * Math.sin(k1 * x + p1) + A2 * Math.sin(k2 * x + p2) + nz); pts.push([x, y]); top = Math.min(top, y); }
    var lim = y0 - (A1 + A2) * (0.6 + r() * 0.12); if (lim < top + 8) lim = top + 14;
    for (var gy = 70; gy < CH - 40; gy += 70) o += line(0, gy, CW, gy, 'rl');
    for (var tx = 40; tx < CW; tx += 40) o += line(tx, CH - 52, tx, CH - (tx % 200 ? 46 : 40), 'dm');
    var d = 'M' + pts.map(function(p){ return n1(p[0]) + ' ' + n1(p[1]); }).join('L'), u = 'cw' + (++R.uid);
    o += '<clipPath id="' + u + 'a"><rect x="0" y="' + n1(lim) + '" width="' + CW + '" height="' + CH + '"/></clipPath><clipPath id="' + u + 'b"><rect x="0" y="0" width="' + CW + '" height="' + n1(lim) + '"/></clipPath>' +
      '<path class="ln w2" clip-path="url(#' + u + 'a)" d="' + d + '"/><path class="ac w2" clip-path="url(#' + u + 'b)" d="' + d + '"/>' +
      line(0, lim, CW, lim, 'ac', ' stroke-dasharray="6 7"');
    var xa = -1, xb = -1;
    for (var i = 0; i < pts.length; i++) { if (pts[i][1] < lim && xa < 0) xa = pts[i][0]; if (xa >= 0 && pts[i][1] >= lim) { xb = pts[i][0]; break; } }
    if (xa >= 0) { if (xb < 0) xb = CW - 20; var pad = Math.max(0, 110 - (xb - xa)) / 2; xa = Math.max(14, xa - pad); xb = Math.min(CW - 14, xb + pad); o += bracket(xa, xb, CH - 92, '[' + f2(xa / CW) + ', ' + f2(xb / CW) + ']'); }
    return o;
  },
  bars: function(r){
    var n = 40 + Math.floor(r() * 16), left = 96, right = CW - 96, step = (right - left) / n, bw = Math.max(4, step * 0.44);
    var base = CH - 104, maxH = CH - 250, mu = 0.26 + r() * 0.16, sg = 0.42 + r() * 0.16, hs = [], sum = 0, o = '';
    for (var i = 0; i < n; i++) { var x = (i + 0.5) / n, v = Math.exp(-Math.pow(Math.log(x / mu), 2) / (2 * sg * sg)) * (0.8 + r() * 0.35); hs.push(v); sum += v; }
    var mx = Math.max.apply(null, hs), acc = 0, q1 = -1, q2 = -1, q3 = -1;
    hs.forEach(function(v, i){ acc += v / sum; if (q1 < 0 && acc >= 0.25) q1 = i; if (q2 < 0 && acc >= 0.5) q2 = i; if (q3 < 0 && acc >= 0.75) q3 = i; });
    o += line(left - 20, base, right + 20, base, 'dm');
    hs.forEach(function(v, i){
      var hh = Math.max(3, v / mx * maxH), x = left + i * step + (step - bw) / 2;
      o += '<rect class="' + (i >= q1 && i <= q3 ? 'fg' : 'df') + '" x="' + n1(x) + '" y="' + n1(base - hh) + '" width="' + n1(bw) + '" height="' + n1(hh) + '"/>';
      if (i % 5 === 0) o += line(left + i * step + step / 2, base + 8, left + i * step + step / 2, base + 16, 'dm');
    });
    var mxm = left + q2 * step + step / 2;
    o += line(mxm, base, mxm, base - maxH - 18, 'ac w2') + '<rect class="af" x="' + n1(mxm - 4) + '" y="' + n1(base - maxH - 26) + '" width="8" height="8"/>';
    var lo = 0.3 + r() * 0.3, sc = 1.6 + r();
    return o + bracket(left + q1 * step, left + (q3 + 1) * step, base - maxH - 64, '[' + f2(lo + q1 / n * sc) + ', ' + f2(lo + (q3 + 1) / n * sc) + ']');
  },
  field: function(r){
    var sp = 30, u = 'cf' + (++R.uid), A = 80 + r() * 60, k = (1.2 + r()) * 2 * Math.PI / CW, p = r() * 6.28, B = 26 + r() * 26, k2 = (3 + r() * 3) * 2 * Math.PI / CW, p2 = r() * 6.28;
    var yc = function(x){ return CH * 0.5 + A * Math.sin(k * x + p) + B * Math.sin(k2 * x + p2); };
    var xs = CW * (0.08 + r() * 0.12), xe = CW * (0.72 + r() * 0.2), band = 44 + r() * 20, o = '';
    o += '<pattern id="' + u + '" width="' + sp + '" height="' + sp + '" patternUnits="userSpaceOnUse"><circle class="df" cx="' + sp / 2 + '" cy="' + sp / 2 + '" r="1.5"/></pattern><rect width="' + CW + '" height="' + CH + '" fill="url(#' + u + ')"/>';
    for (var cx = sp / 2; cx < CW; cx += sp) {
      if (cx < xs || cx > xe) continue;
      var c = yc(cx), fade = Math.min(1, (cx - xs) / 120, (xe - cx) / 120);
      for (var cy = sp / 2; cy < CH; cy += sp) { var dd = Math.abs(cy - c); if (dd < band) o += '<circle class="fg" cx="' + cx + '" cy="' + cy + '" r="' + n1(1.6 + 5.2 * (1 - dd / band) * fade) + '"/>'; }
    }
    var hx = Math.round((xs + (xe - xs) * (0.3 + r() * 0.5)) / sp - 0.5) * sp + sp / 2, hy = Math.round(yc(hx) / sp - 0.5) * sp + sp / 2;
    o += '<circle class="ac w2" fill="none" cx="' + hx + '" cy="' + hy + '" r="24"/>' + line(hx - 58, hy, hx - 32, hy, 'ac') + line(hx + 32, hy, hx + 58, hy, 'ac') + line(hx, hy - 58, hx, hy - 32, 'ac') + line(hx, hy + 32, hx, hy + 58, 'ac');
    return o + bracket(xs, xe, CH - 64, '[' + f2(xs / CW) + ', ' + f2(xe / CW) + ']');
  },
  rings: function(r){
    var ox = CW * (0.2 + r() * 0.26), oy = CH - 36, o = '', u = 'cr' + (++R.uid);
    for (var k = 1; k <= 14; k++) o += '<circle class="' + (k % 4 ? 'rl' : 'dm') + '" fill="none" cx="' + n1(ox) + '" cy="' + oy + '" r="' + k * 72 + '"/>';
    for (var a = 180; a <= 360; a += 15) { var t = a * Math.PI / 180; o += line(ox + 40 * Math.cos(t), oy + 40 * Math.sin(t), ox + 1100 * Math.cos(t), oy + 1100 * Math.sin(t), 'rl'); }
    var sw = (200 + r() * 140) * Math.PI / 180, wd = 26 * Math.PI / 180, R0 = 1100;
    o += '<path class="wg" d="M' + n1(ox) + ' ' + oy + 'L' + n1(ox + R0 * Math.cos(sw - wd)) + ' ' + n1(oy + R0 * Math.sin(sw - wd)) + 'A' + R0 + ' ' + R0 + ' 0 0 1 ' + n1(ox + R0 * Math.cos(sw)) + ' ' + n1(oy + R0 * Math.sin(sw)) + 'Z"/>' +
      line(ox, oy, ox + R0 * Math.cos(sw), oy + R0 * Math.sin(sw), 'ln w2');
    var n = 7 + Math.floor(r() * 5), acc = Math.floor(r() * n), lab = '';
    for (var i = 0; i < n; i++) {
      var rr = 140 + r() * 520, th = (196 + r() * 148) * Math.PI / 180, x = ox + rr * Math.cos(th), y = oy + rr * Math.sin(th);
      if (x < 30 || x > CW - 30 || y < 30) continue;
      if (i === acc) { o += '<circle class="ac w2" fill="none" cx="' + n1(x) + '" cy="' + n1(y) + '" r="16"/><rect class="af" x="' + n1(x - 4) + '" y="' + n1(y - 4) + '" width="8" height="8"/>'; lab = '<text x="' + n1(Math.min(x + 26, CW - 190)) + '" y="' + n1(y - 22) + '">[' + (rr / 10).toFixed(1) + ', ' + Math.round(360 - th * 180 / Math.PI) + '°]</text>'; }
      else o += '<rect class="fg" x="' + n1(x - 3.5) + '" y="' + n1(y - 3.5) + '" width="7" height="7"/>';
    }
    return o + '<rect class="fg" x="' + n1(ox - 5) + '" y="' + (oy - 5) + '" width="10" height="10"/>' + lab;
  }
};
/* v30: covers drawn for one post each, in the same language: thin rules, mono labels, one interval bracket, one red accent */
function rc(x, y, w, h, cls, extra){ return '<rect class="' + cls + '" x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(w) + '" height="' + n1(h) + '"' + (extra || '') + '/>'; }
function ci(x, y, r, cls){ return '<circle class="' + cls + '" cx="' + n1(x) + '" cy="' + n1(y) + '" r="' + n1(r) + '"/>'; }
function tx(x, y, s, anchor){ return '<text x="' + n1(x) + '" y="' + n1(y) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + esc(s) + '</text>'; }
function pl(pts, cls, extra){ return '<path class="' + cls + '" d="M' + pts.map(function(p){ return n1(p[0]) + ' ' + n1(p[1]); }).join('L') + '"' + (extra || '') + '/>'; }
/* the bracket device in the accent colour */
function bracketA(x1, x2, y, lab, below){ return bracket(x1, x2, y, lab, below).replace('class="ln"', 'class="ac w2"'); }
function hatch(x, y, w, h, gap, cls){ var o = ''; for (var i = x + gap / 2; i < x + w; i += gap) o += line(i, y, i, y + h, cls); return o; }
var ART = {
  /* v1.3 results: 13 pass rates on one scale, the bottom six inside [0, 7] % */
  'constraintbench-v1-3-results': function(){
    var x0 = 250, W = 820, y0 = 140, h = 17, step = 27, rates = [57.0, 51.8, 39.8, 24.8, 20.5, 13.5, 7.5, 6.5, 6.3, 4.3, 1.5, 1.3, 1.0], n = rates.length, o = '';
    for (var g = 0; g <= 4; g++) o += line(x0 + W * g / 4, y0 - 20, x0 + W * g / 4, y0 + (n - 1) * step + h + 10, 'rl') + tx(x0 + W * g / 4, y0 - 32, g === 4 ? '100 %' : String(g * 25), g === 0 ? '' : (g === 4 ? 'end' : 'middle'));
    rates.forEach(function(v, i){
      var y = y0 + i * step;
      o += tx(x0 - 26, y + h / 2 + 5, (i < 9 ? '0' : '') + (i + 1), 'end') + rc(x0, y, Math.max(3, W * v / 100), h, 'fg');
    });
    o += bracketA(x0, x0 + W * 0.07, y0 + (n - 1) * step + h + 38, '[0, 7] % · SIX OF 13 MODELS', true);
    return o;
  },
  /* v1.0 results: eight pass rates on one scale, the bottom four inside [0, 7] % */
  'constraintbench-v1-0-results-preview': function(){
    var x0 = 250, W = 820, y0 = 168, h = 24, step = 40, rates = [64.6, 59.2, 45.4, 29.2, 6.7, 4.2, 3.3, 1.7], o = '';
    for (var g = 0; g <= 4; g++) o += line(x0 + W * g / 4, y0 - 22, x0 + W * g / 4, y0 + 7 * step + h + 10, 'rl') + tx(x0 + W * g / 4, y0 - 34, g === 4 ? '100 %' : String(g * 25), g === 0 ? '' : (g === 4 ? 'end' : 'middle'));
    rates.forEach(function(v, i){
      var y = y0 + i * step;
      o += tx(x0 - 26, y + h / 2 + 5, '0' + (i + 1), 'end') + rc(x0, y, Math.max(3, W * v / 100), h, 'fg');
    });
    o += bracketA(x0, x0 + W * 0.07, y0 + 7 * step + h + 40, '[0, 7] % · FOUR OF EIGHT MODELS', true);
    return o;
  },
  /* v0.2: 30 tasks in three environments; one task per environment is open, the rest stay with partner labs */
  'constraintbench-v0-2': function(){
    var s = 44, g = 12, st = s + g, x0 = 344, y0 = 186, o = '', envs = ['MEMORY', 'TIMING', 'CURRENT'], open = [2, 7, 4];
    for (var j = 0; j < 3; j++) {
      var y = y0 + j * (s + 30);
      o += tx(x0 - 22, y + s / 2 + 5, envs[j], 'end');
      for (var i = 0; i < 10; i++) {
        var x = x0 + i * st;
        o += i === open[j] ? rc(x, y, s, s, 'fg') : rc(x, y, s, s, 'rl') + line(x + 12, y + s - 12, x + s - 12, y + 12, 'rl');
      }
    }
    var x1 = x0 + 10 * st - g, ty = y0 + 3 * (s + 30) + 52;
    o += bracket(x0, x1, y0 - 34, '[1, 30] TASKS · 3 OPEN, 27 WITH PARTNER LABS');
    o += line(x0, ty, x1, ty, 'dm');
    for (var t = 0; t <= 4; t++) o += line(x0 + t * (x1 - x0) / 4, ty - 6, x0 + t * (x1 - x0) / 4, ty + 6, 'dm');
    o += rc(x0 + (x1 - x0) / 4 - 5, ty - 5, 10, 10, 'df') + tx(x0 + (x1 - x0) / 4, ty + 30, 'v0.1', 'middle');
    o += rc(x0 + 3 * (x1 - x0) / 4 - 7, ty - 7, 14, 14, 'af') + tx(x0 + 3 * (x1 - x0) / 4, ty + 30, 'v0.2 · NOV 2026', 'middle');
    return o;
  },
  /* where failed attempts came from: 43 / 26 / 20 / 11, the first two together 69% */
  'where-frontier-models-fail-on-embedded-code': function(){
    var x = 130, W = 940, y = 252, h = 132, gap = 8, parts = [43, 26, 20, 11], labs = ['WRONG ENGINEERING', 'NO VERIFICATION', 'INCOMPLETE', 'NO DELIVERY'], o = '', xs = [];
    var unit = (W - gap * 3) / 100, cx = x;
    parts.forEach(function(p, i){
      var w = p * unit;
      xs.push([cx, cx + w]);
      if (i === 0) o += rc(cx, y, w, h, 'fg');
      else if (i === 1) o += rc(cx, y, w, h, 'ln') + hatch(cx, y, w, h, 7, 'ln');
      else if (i === 2) o += rc(cx, y, w, h, 'dm') + hatch(cx, y, w, h, 16, 'dm');
      else o += rc(cx, y, w, h, 'rl');
      o += tx(cx, y + h + 34, p + '%') + tx(cx, y + h + 58, labs[i]);
      cx += w + gap;
    });
    o += bracketA(xs[0][0], xs[1][1], y - 40, '[0, 69] % · A WRONG CHOICE OR A SKIPPED CALCULATION');
    return o;
  },
  /* the v0.1 preview: three environments, each a real limit, graded on an emulated target */
  'constraintbench-v0-1-limited-preview': function(){
    var o = '', W = 286, gap = 46, x0 = (CW - 3 * W - 2 * gap) / 2, y0 = 178, H = 270;
    var labs = ['MEMORY', 'TIMING', 'CURRENT'];
    for (var k = 0; k < 3; k++) {
      var x = x0 + k * (W + gap);
      o += line(x, y0, x + W, y0, 'ln') + tx(x, y0 - 16, labs[k]);
    }
    /* memory: two builds against a 128 KB budget, one over */
    var mx = x0, lim = mx + W * 0.74;
    o += rc(mx, y0 + 92, W * 0.74, 28, 'fg') + rc(lim, y0 + 92, W * 0.14, 28, 'af') + rc(mx, y0 + 146, W * 0.6, 28, 'fg');
    o += bracket(mx, lim, y0 + 60, '[0, 128] KB');
    /* timing: an interrupt, a response edge inside its window */
    var tx0 = x0 + W + gap, by = y0 + 200, hy = y0 + 120;
    o += pl([[tx0, by], [tx0 + 60, by], [tx0 + 60, hy], [tx0 + W, hy]], 'dm');
    o += pl([[tx0, by + 30], [tx0 + 150, by + 30], [tx0 + 150, hy + 30], [tx0 + W, hy + 30]], 'ln w2');
    o += bracket(tx0 + 60, tx0 + 200, y0 + 60, '[0, 10] µs');
    /* current: short spikes, the average under its budget */
    var cx0 = x0 + 2 * (W + gap), base = y0 + 210, d = [[cx0, base]];
    for (var i = 0; i < 5; i++) { var px = cx0 + 24 + i * 56; d.push([px, base], [px, base - 110], [px + 8, base - 110], [px + 8, base]); }
    d.push([cx0 + W, base]);
    o += pl(d, 'ln') + line(cx0, base - 40, cx0 + W, base - 40, 'dm', ' stroke-dasharray="4 5"') + line(cx0, base - 62, cx0 + W, base - 62, 'ln', ' stroke-dasharray="1 5"');
    o += bracket(cx0, cx0 + W, y0 + 60, '[0, 2.5] mA AVERAGE');
    return o;
  },
  /* the research team in Helsinki grows: the team's desks and three open seats */
  'we-are-hiring-ai-engineers-in-helsinki': function(){
    var o = '', gx = 130, gy = 120, gw = 400, gh = 390, u = 'ch' + (++R.uid);
    o += '<pattern id="' + u + '" width="26" height="26" patternUnits="userSpaceOnUse"><circle class="df" cx="13" cy="13" r="1.4"/></pattern>' + rc(gx, gy, gw, gh, '', ' fill="url(#' + u + ')"');
    for (var i = 1; i < 4; i++) o += line(gx, gy + i * gh / 4, gx + gw, gy + i * gh / 4, 'rl') + line(gx + i * gw / 4, gy, gx + i * gw / 4, gy + gh, 'rl');
    var hx = gx + gw * 0.56, hy = gy + gh * 0.44;
    o += ci(hx, hy, 22, 'ac w2') + line(hx - 56, hy, hx - 30, hy, 'ac') + line(hx + 30, hy, hx + 56, hy, 'ac') + line(hx, hy - 56, hx, hy - 30, 'ac') + line(hx, hy + 30, hx, hy + 56, 'ac');
    o += tx(gx, gy + gh + 34, '60.17° N, 24.94° E · HELSINKI');
    var s = 46, g = 16, sx = 640, sy = 190, n = 0;
    for (var r = 0; r < 3; r++) for (var c = 0; c < 6; c++) {
      var x = sx + c * (s + g), y = sy + r * (s + g + 18);
      o += (r === 2 && c >= 3) ? rc(x, y, s, s, 'ln', ' stroke-dasharray="4 4"') : rc(x, y, s, s, 'fg');
      n++;
    }
    o += bracket(sx + 3 * (s + g), sx + 6 * (s + g) - g, sy + 3 * (s + g + 18) + 4, '3 OPEN ROLES', true);
    o += tx(sx, sy - 30, 'RESEARCH TEAM');
    return o;
  },
  /* the follower count crosses 20,000 */
  'celebrating-20-000-linkedin-followers': function(){
    var o = '', x0 = 130, x1 = 1070, base = 520, top = 110, lim = 236, pts = [], u = 'cl' + (++R.uid), n = 19;
    for (var i = 0; i < n; i++) { var t = i / (n - 1), x = x0 + t * (x1 - x0), y = base - (Math.pow(4, t * 1.55) - 1) / (Math.pow(4, 1.55) - 1) * (base - top); pts.push([x, y]); }
    for (var gy = base - 70; gy > top; gy -= 70) o += line(x0, gy, x1, gy, 'rl');
    o += line(x0, base, x1, base, 'dm');
    pts.forEach(function(p, i){ o += line(p[0], base + 6, p[0], base + (i % 6 ? 12 : 18), 'dm'); });
    o += '<path class="wg" d="M' + x0 + ' ' + base + 'L' + pts.map(function(p){ return n1(p[0]) + ' ' + n1(p[1]); }).join('L') + 'L' + x1 + ' ' + base + 'Z"/>';
    o += '<clipPath id="' + u + 'a"><rect x="0" y="' + lim + '" width="' + CW + '" height="' + CH + '"/></clipPath><clipPath id="' + u + 'b"><rect x="0" y="0" width="' + CW + '" height="' + lim + '"/></clipPath>';
    o += pl(pts, 'ln w2', ' clip-path="url(#' + u + 'a)"') + pl(pts, 'ac w2', ' clip-path="url(#' + u + 'b)"');
    o += line(x0, lim, x1, lim, 'ac', ' stroke-dasharray="6 7"');
    pts.forEach(function(p){ o += p[1] < lim ? rc(p[0] - 4, p[1] - 4, 8, 8, 'af') : rc(p[0] - 3.5, p[1] - 3.5, 7, 7, 'fg'); });
    o += tx(x0, lim - 16, '20,000 FOLLOWERS') + tx(x1, base + 44, '28 JUL 2026', 'end') + tx(x0, base + 44, 'JAN 2025');
    return o;
  },
  /* revenue quarter by quarter, the investment, and the growth it funds across Europe, the US and Asia */
  'sands-makes-a-strategic-growth-investment-in-biftu': function(){
    var o = '', n = 14, x0 = 150, x1 = 1050, base = 520, step = (x1 - x0) / n, bw = step * 0.56, mk = 9;
    o += line(x0 - 20, base, x1 + 20, base, 'dm');
    for (var i = 0; i < n; i++) {
      var hgt = 40 + Math.pow(i / (n - 1), 1.6) * 330 + (i % 3 === 1 ? 10 : 0), x = x0 + i * step + (step - bw) / 2;
      o += i < mk ? rc(x, base - hgt, bw, hgt, i < mk - 4 ? 'df' : 'fg') : rc(x, base - hgt, bw, hgt, 'ln', ' stroke-dasharray="4 4"');
    }
    var mx = x0 + mk * step;
    o += line(mx, base + 14, mx, 112, 'ac w2') + rc(mx - 6, 106, 12, 12, 'af') + tx(mx + 16, 120, 'SANDS · JUN 2026');
    o += bracket(mx + 10, x1, base + 34, 'EUROPE · US · ASIA', true);
    return o;
  },
  /* ten suppliers to watch, routed into one vehicle programme; number 4 is Biftu */
  '10-successful-new-age-suppliers-for-automotive-in-2026': function(){
    var o = '', bx = 180, s = 26, y0 = 92, gap = 46, cx = 740, cy = 190, cw = 300, ch = 250, hl = 3;
    for (var i = 0; i < 10; i++) {
      var y = y0 + i * gap, py = cy + 24 + i * (ch - 48) / 9, B = cx - 120 - Math.abs(py - (y + s / 2)) * 0.2, cls = i === hl ? 'ac w2' : (i % 3 ? 'rl' : 'dm');
      o += tx(bx - 18, y + s / 2 + 5, '[' + (i + 1) + ']', 'end');
      o += i === hl ? rc(bx, y, s, s, 'af') : rc(bx, y, s, s, i % 2 ? 'ln' : 'fg');
      o += '<path class="' + cls + '" d="M' + (bx + s + 6) + ' ' + n1(y + s / 2) + 'H' + n1(B - Math.abs(py - (y + s / 2))) + 'L' + n1(B) + ' ' + n1(py) + 'H' + (cx - 10) + '"/>' + line(cx - 10, py, cx, py, 'ln');
    }
    o += rc(cx, cy, cw, ch, 'ln') + rc(cx + 28, cy + 28, cw - 56, ch - 56, 'dm');
    for (var u = 1; u < 4; u++) o += line(cx + 28 + u * (cw - 56) / 4, cy + 28, cx + 28 + u * (cw - 56) / 4, cy + ch - 28, 'rl');
    for (var v = 1; v < 3; v++) o += line(cx + 28, cy + 28 + v * (ch - 56) / 3, cx + cw - 28, cy + 28 + v * (ch - 56) / 3, 'rl');
    o += bracket(cx, cx + cw, cy + ch + 34, 'OEM AUTONOMY STACK', true);
    return o;
  },
  /* median pay by region, with Germany's move since 2024 */
  'soc-bsw-engineer-salary-day-rate-benchmark-report-2026': function(){
    var o = '', x0 = 270, x1 = 1060, rows = [['UNITED STATES', 0.50, 0.68, 0.86, 0.36, 0.98], ['GERMANY', 0.34, 0.50, 0.64, 0.22, 0.78], ['FRANCE', 0.26, 0.38, 0.50, 0.16, 0.62], ['INDIA', 0.06, 0.12, 0.20, 0.02, 0.30]];
    var X = function(v){ return x0 + v * (x1 - x0); };
    for (var t = 0; t <= 10; t++) o += line(X(t / 10), 128, X(t / 10), 500, t % 5 ? 'rl' : 'dm', t % 5 ? ' stroke-dasharray="2 6"' : '');
    rows.forEach(function(r, i){
      var y = 170 + i * 92;
      o += tx(x0 - 28, y + 5, r[0], 'end') + line(X(r[4]), y, X(r[5]), y, 'dm') + line(X(r[4]), y - 8, X(r[4]), y + 8, 'dm') + line(X(r[5]), y - 8, X(r[5]), y + 8, 'dm');
      o += rc(X(r[1]), y - 10, X(r[3]) - X(r[1]), 20, i === 1 ? 'ln' : 'fg');
      o += line(X(r[2]), y - 22, X(r[2]), y + 22, i === 1 ? 'ac w2' : 'ln w2');
      if (i === 1) { o += line(X(0.30), y - 22, X(0.30), y + 22, 'dm', ' stroke-dasharray="3 3"') + '<path class="ac" d="M' + n1(X(0.30) + 4) + ' ' + (y - 30) + 'H' + n1(X(r[2]) - 10) + 'M' + n1(X(r[2]) - 18) + ' ' + (y - 36) + 'L' + n1(X(r[2]) - 10) + ' ' + (y - 30) + 'L' + n1(X(r[2]) - 18) + ' ' + (y - 24) + '"/>' + rc(X(r[2]) - 4, y - 4, 8, 8, 'af'); }
    });
    o += bracket(X(0.06), X(0.86), 536, 'MEDIAN BASE SALARY, 2024 TO 2026', true);
    return o;
  },
  /* the vehicle computer as a stack; an early timing assumption in the silicon ripples up through every layer */
  'biftu-building-vehicles-from-the-future': function(){
    var o = '', x0 = 170, x1 = 1030, h = 54, g = 16, y0 = 122, layers = ['APPLICATIONS · PERCEPTION', 'MIDDLEWARE', 'RICH OS', 'HYPERVISOR', 'SILICON'];
    var crack = [640, 690, 662, 716, 730];
    layers.forEach(function(nm, i){
      var y = y0 + i * (h + g);
      o += rc(x0, y, x1 - x0, h, i === 4 || i === 2 ? 'ln' : 'dm');
      if (i === 2) o += line(x0 + (x1 - x0) * 0.6, y, x0 + (x1 - x0) * 0.6, y + h, 'ln') + tx(x0 + (x1 - x0) * 0.6 + 16, y + h / 2 + 5, 'RTOS');
      if (i === 0) o += line(x0 + (x1 - x0) * 0.4, y, x0 + (x1 - x0) * 0.4, y + h, 'rl') + line(x0 + (x1 - x0) * 0.8, y, x0 + (x1 - x0) * 0.8, y + h, 'rl');
      if (i === 4) for (var c = 6; c < 20; c++) o += line(x0 + c * (x1 - x0) / 20, y + 10, x0 + c * (x1 - x0) / 20, y + h - 10, 'rl');
      o += tx(x0 + 16, y + h / 2 + 5, nm);
    });
    var d = [];
    for (var k = 4; k >= 0; k--) { var yb = y0 + k * (h + g) + h, yt = y0 + k * (h + g); d.push([crack[k], yb], [crack[k] + (k % 2 ? 14 : -14), (yb + yt) / 2], [crack[k], yt]); if (k) d.push([crack[k - 1], yt - g]); }
    o += pl(d, 'ac w2') + rc(crack[4] - 6, y0 + 4 * (h + g) + h / 2 - 6, 12, 12, 'af');
    o += bracket(x0, x1, y0 + 5 * (h + g) + 14, 'ONE TIMING BUDGET ACROSS THE STACK', true);
    return o;
  },
  /* 25+ years of leadership: Continental 2007 to 2022, TTTech 2023, Pioneer today, the Biftu advisory board in 2026 */
  'pioneer-electronics-ceo-former-continental-svp-werner-koestler-joins-biftu-advisory-board': function(){
    var o = '', a = 1998, b = 2027, x0 = 130, x1 = 1070, X = function(yr){ return x0 + (yr - a) / (b - a) * (x1 - x0); }, base = 470;
    o += line(x0, base, x1, base, 'dm');
    for (var yr = a; yr <= b; yr++) o += line(X(yr), base, X(yr), base + (yr % 5 ? 7 : 16), 'dm');
    [2000, 2005, 2010, 2015, 2020, 2025].forEach(function(yr){ o += tx(X(yr), base + 40, String(yr), 'middle'); });
    o += rc(X(2007), 300, X(2022) - X(2007), 34, 'fg') + tx(X(2007), 288, 'CONTINENTAL AG');
    o += rc(X(2023), 352, X(2024) - X(2023), 34, 'ln') + tx(X(2023), 410, 'TTTECH');
    o += rc(X(2025.2), 236, X(2026) - X(2025.2), 34, 'fg') + '<path class="ln" d="M' + n1(X(2026) + 6) + ' 253H' + n1(X(2026.7)) + 'M' + n1(X(2026.7) - 7) + ' 246L' + n1(X(2026.7)) + ' 253L' + n1(X(2026.7) - 7) + ' 260"/>' + tx(X(2026.7), 224, 'PIONEER', 'end');
    o += line(X(2026), 160, X(2026), base, 'ac w2') + rc(X(2026) - 7, 153, 14, 14, 'af') + tx(X(2026) - 16, 150, 'HASHLIST ADVISORY BOARD', 'end');
    o += bracket(X(2007), X(2022), 380, '[2007, 2022]', true);
    o += bracket(X(2000.5), X(2026), 120, '25+ YEARS · AUTOMOTIVE, AEROSPACE, DEFENCE');
    return o;
  },
  /* a custom chip on its way to production: board support, RTOS, middleware, functional safety, validation under load */
  'biftu-is-going-to-nvidia-gtc-2026': function(){
    var o = '', cx = 470, cy = 315, rings = [[150, 'BSP'], [214, 'RTOS'], [278, 'MIDDLEWARE'], [342, 'FUNCTIONAL SAFETY · ISO 26262'], [406, 'VALIDATION UNDER LOAD']];
    rings.slice().reverse().forEach(function(r, i){ var s = r[0]; o += rc(cx - s / 2, cy - s / 2, s, s, i % 2 ? 'dm' : 'rl') + tx(cx - s / 2 + 8, cy - s / 2 - 8, r[1]); });
    var d = 100, c = 10;
    o += rc(cx - d / 2, cy - d / 2, d, d, 'ln w2');
    for (var i = 0; i < 6; i++) for (var j = 0; j < 6; j++) o += (i === 4 && j === 1) ? rc(cx - d / 2 + 10 + i * 14, cy - d / 2 + 10 + j * 14, c, c, 'af') : rc(cx - d / 2 + 10 + i * 14, cy - d / 2 + 10 + j * 14, c, c, (i + j) % 3 ? 'df' : 'fg');
    for (var p = 0; p < 7; p++) { var q = cx - d / 2 + 14 + p * 12; o += line(q, cy - d / 2 - 8, q, cy - d / 2, 'ln') + line(q, cy + d / 2, q, cy + d / 2 + 8, 'ln') + line(cx - d / 2 - 8, q - cx + cy, cx - d / 2, q - cx + cy, 'ln') + line(cx + d / 2, q - cx + cy, cx + d / 2 + 8, q - cx + cy, 'ln'); }
    var tx0 = 780, tx1 = 1030, ty = 470, X = function(t){ return tx0 + (t + 40) / 165 * (tx1 - tx0); };
    o += line(tx0, ty, tx1, ty, 'dm');
    for (var t = -40; t <= 125; t += 15) o += line(X(t), ty - 6, X(t), ty + 6, 'dm');
    var pts = [], hot = []; for (var k = 0; k <= 34; k++) { var u = k / 34, t = -30 + u * 170, p = [X(t), ty - 50 - 120 * u - 18 * Math.sin(u * 9)]; if (t <= 126) pts.push(p); if (t >= 124) hot.push(p); }
    o += pl(pts, 'ln') + pl(hot, 'ac w2') + line(X(125), ty - 200, X(125), ty, 'ac', ' stroke-dasharray="4 5"') + rc(hot[hot.length - 1][0] - 5, hot[hot.length - 1][1] - 5, 10, 10, 'af');
    o += bracket(tx0, tx1, ty + 38, '[−40, 125] °C', true);
    return o;
  },
  /* a member-led alliance: one more node joins the network */
  'biftu-joins-covesa': function(){
    var r = rng(121225), o = '', nodes = [], cx = 470, cy = 315;
    while (nodes.length < 30) { var a = r() * 6.283, rr = Math.sqrt(r()), x = cx + Math.cos(a) * rr * 330, y = cy + Math.sin(a) * rr * 200; if (nodes.every(function(n){ return Math.hypot(n[0] - x, n[1] - y) > 48; })) nodes.push([x, y]); }
    nodes.forEach(function(n, i){
      var near = nodes.map(function(m, j){ return [Math.hypot(m[0] - n[0], m[1] - n[1]), j]; }).sort(function(p, q){ return p[0] - q[0]; }).slice(1, 4);
      near.forEach(function(m){ if (m[1] > i) o += line(n[0], n[1], nodes[m[1]][0], nodes[m[1]][1], 'rl'); });
    });
    nodes.forEach(function(n, i){ o += i % 4 ? rc(n[0] - 3.5, n[1] - 3.5, 7, 7, 'fg') : rc(n[0] - 5, n[1] - 5, 10, 10, 'ln'); });
    var hx = 1000, hy = 236, near = nodes.slice().sort(function(p, q){ return Math.hypot(p[0] - hx, p[1] - hy) - Math.hypot(q[0] - hx, q[1] - hy); }).slice(0, 3);
    near.forEach(function(n){ o += line(hx, hy, n[0], n[1], 'ln w2'); });
    o += ci(hx, hy, 22, 'ac w2') + rc(hx - 5, hy - 5, 10, 10, 'af');
    for (var k = 1; k <= 3; k++) o += '<path class="dm" d="M' + n1(hx + 30 + k * 16) + ' ' + n1(hy - 14 - k * 10) + 'A' + (30 + k * 18) + ' ' + (30 + k * 18) + ' 0 0 1 ' + n1(hx + 30 + k * 16) + ' ' + n1(hy + 14 + k * 10) + '"/>';
    o += bracket(cx - 330, cx + 330, cy + 250, 'COVESA · MEMBER-LED ALLIANCE', true);
    return o;
  },
  /* 300+ executives, each with 20+ years in a sub-domain, booked for an hour, two weeks or ongoing */
  'new-product-launch-biftu-executive-consulting': function(){
    var o = '', cols = 25, rows = 12, sx = 260, sy = 96, dx = 28, dy = 22, hot = [[3, 2], [9, 7], [15, 4], [21, 9], [6, 10], [18, 1]], pick = [12, 5];
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
      var x = sx + i * dx, y = sy + j * dy, isHot = hot.some(function(h){ return h[0] === i && h[1] === j; });
      o += (i === pick[0] && j === pick[1]) ? ci(x, y, 11, 'ac w2') + ci(x, y, 3.5, 'af') : ci(x, y, isHot ? 3.4 : 2, isHot ? 'fg' : 'df');
    }
    o += tx(sx, sy - 26, '300+ C-LEVEL EXECUTIVES');
    var ax0 = 260, ax1 = 1010, lanes = [['CONSULTATION', 0.04], ['TWO WEEKS', 0.3], ['ONGOING', 1]], ly = 420;
    lanes.forEach(function(l, i){
      var y = ly + i * 40, w = (ax1 - ax0) * l[1];
      o += tx(ax0 - 20, y + 5, l[0], 'end') + line(ax0, y, ax0 + Math.max(10, w), y, i === 2 ? 'ln w2' : 'ln w2') + rc(ax0 - 4, y - 4, 8, 8, 'fg');
      if (i === 2) o += '<path class="ln" d="M' + (ax1 - 10) + ' ' + (y - 7) + 'L' + ax1 + ' ' + y + 'L' + (ax1 - 10) + ' ' + (y + 7) + '"/>';
      else o += line(ax0 + w, y - 8, ax0 + w, y + 8, 'ln');
    });
    o += line(sx + pick[0] * dx, sy + pick[1] * dy + 12, sx + pick[0] * dx, ly - 22, 'ac', ' stroke-dasharray="3 5"');
    return o;
  },
  /* EV and SDV demand: the short term fell below the plan, the long-term line did not change */
  'biftu-at-iaa-mobility-2025-our-take-on-the-push-for-evs-sdvs': function(){
    var o = '', x0 = 130, x1 = 1070, base = 520, a = 2019, b = 2031, X = function(yr){ return x0 + (yr - a) / (b - a) * (x1 - x0); }, u = 'ci' + (++R.uid);
    var plan = function(yr){ return base - 40 - (yr - a) / (b - a) * 360; };
    var act = function(yr){ var d = Math.exp(-Math.pow((yr - 2025.2) / 1.6, 2)) * 95; return plan(yr) + d + (yr < 2021 ? 6 : 0); };
    for (var gy = base - 80; gy > 100; gy -= 80) o += line(x0, gy, x1, gy, 'rl');
    o += line(x0, base, x1, base, 'dm');
    for (var yr = a; yr <= b; yr++) o += line(X(yr), base, X(yr), base + (yr % 5 ? 8 : 16), 'dm');
    [2020, 2025, 2030].forEach(function(yr){ o += tx(X(yr), base + 40, String(yr), 'middle'); });
    var P = [], Q = [];
    for (var t = a; t <= b + 0.001; t += 0.1) { P.push([X(t), plan(t)]); Q.push([X(t), act(t)]); }
    o += pl(P, 'dm', ' stroke-dasharray="6 6"');
    var gapPts = Q.filter(function(q, i){ return q[1] - P[i][1] > 12; }), gx0 = gapPts[0][0], gx1 = gapPts[gapPts.length - 1][0];
    o += '<clipPath id="' + u + '"><rect x="' + n1(gx0) + '" y="0" width="' + n1(gx1 - gx0) + '" height="' + CH + '"/></clipPath>';
    o += '<path class="wg" d="M' + P.map(function(p){ return n1(p[0]) + ' ' + n1(p[1]); }).join('L') + 'L' + Q.slice().reverse().map(function(p){ return n1(p[0]) + ' ' + n1(p[1]); }).join('L') + 'Z"/>';
    o += pl(Q, 'ln w2') + pl(Q, 'ac w2', ' clip-path="url(#' + u + ')"');
    o += rc(X(2025) - 6, act(2025) - 6, 12, 12, 'af') + tx(X(2025) + 18, act(2025) + 30, 'IAA MOBILITY 2025');
    o += tx(X(b), plan(b) - 18, 'LONG-TERM DIRECTION', 'end');
    o += bracket(gx0, gx1, 140, 'DEMAND BELOW PLAN');
    return o;
  }
};
function hashStr(s){ var h = 5381; s = String(s || ''); for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h >>> 0; }
function coverOf(x){
  var c = (x && x.cover) || {}, hs = hashStr((x && (x.slug || x.h)) || '');
  var art = c.art || (x && x.slug);
  if (c.style === 'art' && ART[art]) return {style: 'art', art: art, seed: c.seed || (hs % 99991) + 1, tone: c.tone === 'paper' ? 'paper' : ''};
  return {style: COV[c.style] ? c.style : HL.COVER_STYLES[hs % HL.COVER_STYLES.length][0], seed: c.seed || (hs % 99991) + 1, tone: c.tone === 'paper' ? 'paper' : ''};
}
HL.cover = function(c, cls){
  c = c || {};
  var style = COV[c.style] ? c.style : 'grid', body = c.style === 'art' && ART[c.art] ? ART[c.art]() : COV[style](rng(c.seed));
  return '<svg class="cov' + (c.tone === 'paper' ? ' paper' : '') + (cls ? ' ' + cls : '') + '" viewBox="0 0 ' + CW + ' ' + CH + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect class="bg" width="' + CW + '" height="' + CH + '"/>' + body + '</svg>';
};
HL.coverOf = coverOf;
HL.ART = ART;
function secH(p, s, cls){
  return '<header class="sec-h' + (cls ? ' ' + cls : '') + '">' + O(p + '.lab', s.lab, 'span', 'lab', 'Label') + F(p + '.h', s.h, 'h2', '', 'Heading') + OM(p + '.p', s.p, '', 'Optional paragraph') + '</header>';
}
function wrapSec(cls, s, si, page, inner, extra){
  return '<section class="' + cls + (s.hidden ? ' is-hidden' : '') + '"' + (s.anchor ? ' id="' + esc(s.anchor) + '"' : '') +
    ' data-sec="' + page + '" data-si="' + si + '" data-type="' + s.type + '"' + (extra || '') + '>' + inner + '</section>';
}

/* ---------- section renderers ---------- */
var T = HL.TYPES = {};
/* a label and a row of logos or names: the clients, and since v45 the memberships (key members) */
function logoRow(p, s, key, cls){
  var list = s[key], labKey = key + 'Lab';
  if (!Array.isArray(list) || (!list.length && !R.edit)) return '';
  return '<div class="hclients' + (cls ? ' ' + cls : '') + '">' + F(p + '.' + labKey, s[labKey], 'span', 'lab', 'Label') +
    '<div class="hcl' + (list.some(function(x){ return x.src; }) ? ' has-logos' : '') + '">' + each(p + '.' + key, list, function(x, i, ip, it){
      if (x.src) return '<span class="cl-logo"' + it + (R.edit ? ' data-href="' + ip + '.src" data-href-lab="Image address (https://… or data:image/…)" title="' + esc(x.t || '') + '"' : '') + '><img src="' + esc(x.src) + '" alt="' + esc(x.t || '') + '" loading="lazy" draggable="false"' + (+x.size ? ' style="--h:' + (+x.size) + 'px"' : '') + '>' +
        (x.sub ? '<span class="cl-sub"' + (R.edit ? '' : ' aria-hidden="true"') + '>' + F(ip + '.sub', x.sub, 'span', '', 'Text') + '</span>' : '') + '</span>';
      return '<span' + it + '>' + F(ip + '.t', x.t, 'span', '', 'Name') + '</span>';
    }) + '</div></div>';
}
function clientRow(p, s, cls){ return logoRow(p, s, 'clients', cls); }
function heroLink(ip, c, it){
  var ext = isExt(c.h);
  return '<a class="hlink" href="' + esc(c.h || '#') + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + ' data-href="' + ip + '.h"' + (R.edit ? ' draggable="false"' : '') + it + '>' +
    '<span class="ht">' + F(ip + '.t', c.t, 'span', '', 'Link text') + '<svg class="chev" viewBox="0 0 10 16" aria-hidden="true"><path d="M2.5 2.5l5.5 5.5-5.5 5.5"/></svg></span>' +
    O(ip + '.sub', c.sub, 'span', 'hs', 'Optional subtitle') + '</a>';
}
function ctaBlock(p, s){
  if (s.ctaStyle === 'links') return '<nav class="hlinks" aria-label="Start here">' + each(p + '.ctas', s.ctas, function(c, i, ip, it){ return heroLink(ip, c, it); }) + '</nav>';
  return '<div class="ctas">' + each(p + '.ctas', s.ctas, function(c, i, ip, it){ return A(ip, c, i === 0 ? 'btn fill' : 'btn', it); }) + '</div>';
}
var FILL = {
  strip: '<div class="vstrip"><div class="vs-h"><span class="lab">Average current</span><span class="vs-iv">[0, 2.5] mA</span></div>' +
    '<svg viewBox="0 0 480 110" preserveAspectRatio="none"><defs><clipPath id="vs-in-%U%"><rect x="0" y="22" width="480" height="88"/></clipPath><clipPath id="vs-out-%U%"><rect x="0" y="0" width="480" height="22"/></clipPath></defs>' +
    '<line class="vs-lim" x1="0" y1="22" x2="480" y2="22"/><line class="vs-zero" x1="0" y1="104" x2="480" y2="104"/>' +
    '<path class="vs-m" clip-path="url(#vs-in-%U%)"/><path class="vs-m vs-over" clip-path="url(#vs-out-%U%)"/><path class="vs-e"/></svg>' +
    '<div class="vs-k"><span><i class="k-e"></i>engineer</span><span><i class="k-m"></i>model</span></div></div>',
  bench: '<div class="vbench"><div class="vb-grid"></div><div class="vb-k"><span class="lab">30 tasks · 3 environments</span><span><i class="k-p"></i>pass</span><span><i class="k-f"></i>fail</span></div></div>',
  readout: '<div class="vread"><span class="lab vr-k">memory</span><span class="vr-box"><i class="bk l"></i><span class="vr-v">0, 128 KB</span><i class="bk r"></i></span></div>'
};
function heroLedger(p, s, anim){
  var n = (s.rows || []).length;
  var fill = FILL[anim] ? FILL[anim].replace(/%U%/g, String(++R.uid)) : '';
  return '<div class="ledger' + (anim === 'needle' ? ' anim-rule' : '') + '" aria-label="ConstraintBench releases"><div class="lh">' + F(p + '.relLab', s.relLab, 'span', 'lab', 'Label') + F(p + '.dateLab', s.dateLab == null ? 'Release date' : s.dateLab, 'span', 'lab', 'Column label') + '</div>' +
    (anim === 'needle' ? '<div class="irule" aria-hidden="true"><i class="ln"></i><i class="ov"></i><i class="bk l"></i><i class="bk r"></i><i class="mk"></i></div>' : '') +
    '<div class="rows">' + each(p + '.rows', s.rows, function(r, i, ip, it){
      return '<div class="row"' + it + '><span class="ix">[' + (n - 1 - i) + ']</span><span class="nm">' + F(ip + '.name', r.name, 'span', '', 'Release') +
        (r.st || R.edit ? F(ip + '.st', r.st, 'span', 'st', 'Status') : '') + '</span>' + F(ip + '.date', r.date, 'span', 'dt', 'Date') +
        (r.hx || R.edit ? F(ip + '.hx', r.hx, 'span', 'hx', 'Hash') : '') + '</div>';
    }) + '</div>' +
    '<div class="lfill" aria-hidden="true">' + fill + '</div>' +
    '<div class="foot">' + O(p + '.note', s.note, 'p', 'note', 'Note') + OA(p + '.more', s.more, 'more') + '</div></div>';
}
T.hero = function(s, p, si, page){
  if (s.layout === 'car') return wrapSec('hero', s, si, page,
    '<div class="wrap"><div class="hero-top">' + F(p + '.h', s.h, 'h1', '', 'Headline') + ctaBlock(p, s) + '</div>' +
    '<figure class="car">' + svg('car') + '</figure>' +
    '<div class="hero-cap"><div class="hc-l">' + O(p + '.cap', s.cap, 'p', '', 'Caption') + clientRow(p, s) + '</div>' +
    '<' + btnTag() + ' class="car-replay" type="button">Replay</' + btnTag() + '></div></div>');
  var anim = s.anim || '';
  return wrapSec('hero hero-l' + (s.tone === 'data' ? ' tone-data' : ''), s, si, page,
    '<div class="wrap">' + (anim === 'sweep' ? '<i class="hsweep" aria-hidden="true"></i>' : '') + '<div class="hero-grid"><div class="hero-main">' +
    F(p + '.h', s.h, 'h1', '', 'Headline') +
    '<div class="hero-acts">' + ctaBlock(p, s) + '</div>' +
    clientRow(p, s, 'hero-cl') + '</div>' + heroLedger(p, s, anim) + '</div></div>',
    ' data-anim="' + esc(anim) + '"');
};
T.label = function(s, p, si, page){
  return wrapSec('vlabel', s, si, page, '<div class="wrap">' + F(p + '.lab', s.lab, 'span', 'lab', 'Label') + F(p + '.h', s.h, 'h2', '', 'Name') + OM(p + '.p', s.p, '', 'Description') + '</div>');
};
T.releases = function(s, p, si, page){
  var n = (s.rows || []).length;
  return wrapSec('rel', s, si, page,
    '<div class="wrap"><div class="rel-grid">' + F(p + '.lab', s.lab, 'span', 'lab', 'Label') +
    '<div class="ledger"><div class="lh"><span class="lab">#</span><span class="lab">Release</span><span class="lab">Date</span><span class="lab">SHA-256</span></div>' +
    each(p + '.rows', s.rows, function(r, i, ip, it){
      return '<div class="row"' + it + '><span class="ix">[' + (n - 1 - i) + ']</span><span class="nm">' + F(ip + '.name', r.name, 'span', '', 'Release') +
        (r.st || R.edit ? F(ip + '.st', r.st, 'span', 'st', 'Status') : '') + '</span>' + F(ip + '.date', r.date, 'span', 'dt', 'Date') +
        F(ip + '.hx', r.hx, 'span', 'hx', 'Hash') + '</div>';
    }) +
    '<div class="foot">' + O(p + '.note', s.note, 'p', 'note', 'Note') + OA(p + '.more', s.more, 'more') + '</div></div></div></div>');
};
T.statement = function(s, p, si, page){
  var cols = s.cols || [], n = cols.length || 1, last = cols.length - 1;
  var lab = s.logo ? '<span class="pair-logo">' + logoSvg() + '</span>' : O(p + '.lab', s.lab, 'span', 'lab', 'Label');
  return wrapSec('sec', s, si, page,
    '<div class="wrap">' + F(p + '.text', s.text, 'p', 'statement', 'Statement') +
    '<div class="pair' + (lab ? '' : ' no-lab') + '" style="--n:' + n + '">' + lab +
    each(p + '.cols', cols, function(c, i, ip, it){ return '<div class="col"' + it + '>' + F(ip + '.lab', c.lab, 'span', 'lab', 'Label') + M(ip + '.text', c.text, '', 'Text') +
      (c.stat ? '<div class="st-stat">' + F(ip + '.stat.v', c.stat.v, 'span', 'v', '0') + F(ip + '.stat.t', c.stat.t, 'p', '', 'Caption') + memLine(ip, c.member, '') + '</div>' : '') +
      (i === last ? '<div class="st-logos">' + clientRow(p, s, 'st-clients') + logoRow(p, s, 'members', 'st-clients st-members') + '</div>' : '') + '</div>'; }) +
    '</div></div>');
};
/* v48: a card can show a few short boxes in place of its paragraph; a box marked hot is filled (Calle, 23 Oct 2026) */
/* v50: a small line icon in the corner of each box (key i); the screen icon carries a cursor and a recording dot */
var CTAG_ICONS = {"screen": ["M3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v9A1.5 1.5 0 0 1 19.5 16h-15A1.5 1.5 0 0 1 3 14.5z", "M9 20h6M12 16v4"], "evals": ["M5.5 3.5h13v17h-13z", "M8 8.5l1.5 1.5L12 7.5", "M14 9h2.5", "M8 14l1.5 1.5L12 13", "M14 14.5h2.5"], "experts": ["M6.4 8a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0", "M3.8 19.5c0-3.1 2.3-5.2 5.2-5.2s5.2 2.1 5.2 5.2", "M14.4 9a2.1 2.1 0 1 0 4.2 0a2.1 2.1 0 1 0 -4.2 0", "M15.6 14.4c2.6.2 4.6 2.1 4.6 5.1"], "dataset": ["M5 6c0-1.4 3.1-2.5 7-2.5s7 1.1 7 2.5-3.1 2.5-7 2.5S5 7.4 5 6z", "M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6", "M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"], "loop": ["M20 12a8 8 0 0 1-13.7 5.6", "M4 12a8 8 0 0 1 13.7-5.6", "M17.7 3.4v3.2h-3.2", "M6.3 20.6v-3.2h3.2", "M10.4 12a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0"], "climb": ["M4 4v16h16", "M7 16l3.5-4 3 2.5L19 8", "M15.4 8H19v3.6"], "doc": ["M6 3h8l4 4v14H6z", "M14 3v4h4", "M10.2 11.5l-2 2.2 2 2.2", "M13.8 11.5l2 2.2-2 2.2"], "branch": ["M4 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M16 7a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M6 7v10", "M18 9c0 4.5-3.5 6-7 6.6-2.2.4-3.8 1.2-4.6 2"], "chip": ["M7 7h10v10H7z", "M10 10h4v4h-4z", "M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3"], "compare": ["M3 20h18", "M6 20v-8", "M10.5 20V6", "M15 20v-6", "M19.5 20V9"], "shield": ["M12 3l7 3v5c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V6z", "M9 12.2l2.1 2.1 4-4.2"], "tune": ["M4 7h9M17 7h3", "M4 17h3M11 17h9", "M4 12h5M13 12h7", "M13 7a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M7 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M9 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"]};
function ctagIcon(k){
  var ps = CTAG_ICONS[k];
  if (!ps) return '';
  var o = '<svg class="ctag-i ic-' + k + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ps.map(function(d){ return '<path pathLength="1" d="' + d + '"/>'; }).join('');
  if (k === 'screen') o += '<g class="ic-cur"><path class="ic-arrow" pathLength="1" d="M10.6 7.2l4.6 4.3-2.1.3 1.2 2.3-1.1.5-1.1-2.3-1.5 1.4z"/></g><path class="ic-rec" d="M5.4 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>';
  return o + '</svg>';
}
function cardTags(ip, tags, ci){
  /* v49: each box has a title and a subtitle; the boxes sit in the cards' shared grid, so all of them take the same height */
  return each(ip + '.tags', tags, function(t, j, tp, tit){
    return '<div class="ctag' + (t.hot ? ' hot' : '') + (t.i ? ' has-i' : '') + '" style="--k:' + ((ci || 0) + j) + '"' + tit + '>' + ctagIcon(t.i) + F(tp + '.t', t.t, 'span', 'ctag-t', 'Title') + O(tp + '.s', t.s, 'span', 'ctag-s', 'Subtitle') + '</div>';
  });
}
T.cards = function(s, p, si, page){
  if (s.mode === 'demo') return cardsDemo(s, p, si, page);
  var c = Math.max(2, Math.min(4, +s.cols || 3));
  return wrapSec('sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<div class="cards c' + c + ((s.items || []).some(function(x){ return Array.isArray(x.tags); }) ? ' has-ctags' : '') + '">' +
    each(p + '.items', s.items, function(x, i, ip, it){ return '<div' + it + '>' + F(ip + '.n', x.n, 'span', 'lab', '00') + F(ip + '.h', x.h, 'h3', '', 'Title') +
      (Array.isArray(x.tags) ? cardTags(ip, x.tags, i) : M(ip + '.p', x.p, '', 'Text')) + '</div>'; }) +
    '</div>' + (s.call ? '<div class="callout tone-data">' + F(p + '.call.t', s.call.t, 'p', '', 'Callout text') + A(p + '.call.link', s.call.link, 'btn fill') + '</div>' : '') + '</div>');
};
/* v51: the data products as tabs (Calle, 27 Oct 2026, option C). The list on the right picks a product; the dark panel on the
   left shows a short looping demo of it, the panel heading and four points. Steps in a demo carry data-at (ms after the loop
   starts, adds .on) and data-off (adds .off); the stage's data-loop is the loop length. Demo texts are fixed examples. */
var DEMOS = {
  cua: '<div class="dm-stage dm-cuaw" data-loop="7000"><div class="dm-cua"><div class="dm-bar">PCB Editor</div><div class="dm-pcb"></div><div class="dm-side"><i></i><i></i><i></i><i></i><i></i></div>' +
    '<div class="dm-cur"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l9 4-4 1-1.5 4z"/></svg></div></div>' +
    '<div class="dm-tracks"><span>STEPS</span><i class="dm-t1"></i><span>ACTIONS</span><i class="dm-t2"></i><span>KEYS</span><i class="dm-t3"></i><span>VOICE</span><i class="dm-t4"></i><b class="dm-ph"></b></div></div>',
  ev: '<div class="dm-stage dm-ev" data-loop="7600"><div class="dm-task"><b>TASK · REAL SCENARIO</b>Customer on WhatsApp: "Nipatie size 42 white sneakers and pay via M-Pesa."<span class="dm-gold">ODIN TRACE · LIVE</span></div><div class="dm-crit"><div class="dm-h"><span>EXECUTION GRADER</span><span>RESULT</span></div><div class="dm-cr">Parses Sheng/Swahili intent &amp; extracts size 42<span class="dm-st dm-pass" data-at="700"></span></div><div class="dm-cr">Queries Supabase inventory &amp; locks 1 pair<span class="dm-st dm-pass" data-at="1500"></span></div><div class="dm-cr">Triggers Safaricom Daraja STK Push to phone<span class="dm-st dm-pass" data-at="2300"></span></div><div class="dm-cr">Verifies HMAC payment webhook signature<span class="dm-st dm-pass" data-at="3100"></span></div><div class="dm-cr dm-last">Syncs transaction ledger to Google Sheets &amp; CRM<span class="dm-st dm-pass" data-at="3900"></span></div><div class="dm-score"><i data-at="4500"></i></div><span class="dm-sct" data-at="5000">5 OF 5 CRITERIA MET · 100% SUCCESS</span></div></div>',
  ots: '<div class="dm-stage dm-rl" data-loop="6400"><div class="dm-loop"><div class="dm-lnk"></div><div class="dm-node dm-n1">AGENT</div><div class="dm-node dm-n2">ENVIRONMENT</div><div class="dm-node dm-n3">GRADER</div><div class="dm-node dm-n4">REWARD</div><div class="dm-dot"></div></div>' +
    '<div class="dm-rw"><div class="dm-h">REWARD BY TRAINING ROUND</div><div class="dm-bars">' +
    [22, 30, 28, 41, 52, 58, 71, 80].map(function(h, i){ return '<i style="height:' + h + '%" data-at="' + (300 + i * 600) + '"></i>'; }).join('') +
    '</div><div class="dm-envs"><span>BOARD</span><span>TOOLCHAIN</span><span>GRADER</span></div></div></div>',
  op: '<div class="dm-stage dm-op" data-loop="7200"><div class="dm-doc"><b>DESIGN REVIEW · PAST PROJECT</b>Reviewed with <span class="dm-pii" data-at="900">Anna Virtanen</span> for <span class="dm-pii" data-at="1300">Client X</span>. ' +
    'The brake signal arrives late on <span class="dm-pii" data-at="1700">prototype P-17</span>, so the timeout moves from 20 ms to 35 ms. Option B was dropped because the bus load passed 70% on <span class="dm-pii" data-at="2100">test track 3</span>.' +
    '<span class="dm-stamp" data-at="2700">ANONYMISED</span></div><i class="dm-arr"></i>' +
    '<div class="dm-rec"><div data-at="3300"><span>REQUIREMENT</span>Brake signal timeout</div><div data-at="3800"><span>DECISION</span>20 ms to 35 ms</div><div data-at="4300"><span>REASON</span>Late signal on a prototype</div><div data-at="4800"><span>REJECTED OPTION</span>Bus load over 70%</div></div></div>',
  hz: '<div class="dm-stage dm-hz" data-loop="9000">' +
    '<div class="dm-eng" data-at="200"><b><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="3.6" r="2.3"/><path d="M1.6 11.4c0-2.6 2-4.3 4.4-4.3s4.4 1.7 4.4 4.3"/></svg>ENGINEER</b>&ldquo;Set the radar speed scaling from the roller check&rdquo;</div>' +
    '<i class="dm-arr dm-a1" data-at="700"></i>' +
    '<div class="dm-ide"><div class="dm-code">' +
      '<div><span class="dm-lno">1</span><span class="dm-cm"># radar speed scaling</span></div>' +
      '<div class="dm-type" data-at="1000"><span class="dm-lno">2</span><span class="dm-kw">check</span> = 101.2 <span class="dm-cm"># true 100.0</span></div>' +
      '<div class="dm-type" data-at="1400"><span class="dm-bad" data-at="3200"><span class="dm-lno">3</span><span class="dm-kw">scale</span> = 0.01 <span class="dm-cm"># sheet value</span></span></div>' +
      '<div class="dm-fix" data-at="4000"><span class="dm-lno">3</span><span class="dm-kw">scale</span> = 0.01 * 100.0 / 101.2</div>' +
    '</div><div class="dm-chk"><span class="dm-lb">checker.py</span><span class="dm-m" data-at="1800" data-off="2500">running &middot;&middot;&middot;</span>' +
      '<span class="dm-m dm-no" data-at="2500" data-off="4000">fail · 1.2% speed error</span><span class="dm-m" data-at="4000" data-off="4700">running &middot;&middot;&middot;</span><span class="dm-m dm-ok" data-at="4700">pass · all rules</span></div></div>' +
    '<i class="dm-arr dm-a2" data-at="5300"></i>' +
    '<div class="dm-eng dm-back" data-at="5700"><b>BACK TO THE ENGINEER</b>Checked and fixed, ready to review<span class="dm-okmark">&#10003; all rules pass</span></div></div>'
};
/* v62: the enterprise card on the homepage, the four steps to your own model as a loop (Calle, 9 Nov 2026) */
DEMOS.om = '<div class="dm-stage dm-rl" data-loop="6400"><div class="dm-loop"><div class="dm-lnk"></div><div class="dm-node dm-n1">BENCHMARK</div><div class="dm-node dm-n2">DATA</div><div class="dm-node dm-n3">TRAINING</div><div class="dm-node dm-n4">YOUR MODEL</div><div class="dm-dot"></div></div>' +
  '<div class="dm-rw"><div class="dm-h">CORRECT ON YOUR TASKS, BY ROUND</div><div class="dm-bars">' +
  [20, 26, 34, 45, 55, 66, 78, 88].map(function(h, i){ return '<i style="height:' + h + '%" data-at="' + (300 + i * 600) + '"></i>'; }).join('') +
  '</div><div class="dm-envs"><span>YOUR SERVERS</span><span>YOUR WEIGHTS</span><span>YOUR DATA</span></div></div></div>';

/* v71: data product 06, forward deployed domain experts (Calle, 14 Nov 2026) */
DEMOS.fde = (function(){
  var P = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="4"/><path d="M4 21c0-4.4 3.6-7.6 8-7.6s8 3.2 8 7.6z"/></svg>';
  var dots = '';
  for (var k = 0; k < 35; k++) dots += k === 9 ? '<i class="pk" data-at="500"></i>' : k === 25 ? '<i class="pk" data-at="900"></i>' : '<i></i>';
  return '<div class="dm-stage dm-fde" data-loop="6400"><div class="dm-net"><div class="dm-h">OUR NETWORK</div><div class="dm-dots">' + dots + '</div>' +
    '<div class="dm-cnt">100,000+</div><div class="dm-sub">ACTIVE CONTRIBUTORS</div></div><div class="dm-arr"></div>' +
    '<div class="dm-team"><div class="dm-h">YOUR RESEARCH TEAM</div><div class="dm-ppl">' + P + P + P +
    '<span class="dm-fd" data-at="1500">' + P + '</span><span class="dm-fd" data-at="1900">' + P + '</span></div>' +
    '<div class="dm-lab"><span>RESEARCHERS</span><span>FDES</span></div><div class="dm-prob" data-at="2600">YOUR RESEARCH PROBLEM</div></div></div>';
})();
function dtIcon(k){
  var ps = CTAG_ICONS[k];
  if (!ps) return '';
  return '<svg class="dt-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ps.map(function(d){ return '<path d="' + d + '"/>'; }).join('') + '</svg>';
}
function cardsDemo(s, p, si, page){
  var items = s.items || [], k = 'dt' + page + si;
  var panels = items.map(function(x, i){
    var ip = p + '.items.' + i;
    return '<div class="dt-panel' + (i === 0 ? ' act' : '') + '" id="' + k + 'p' + i + '" role="tabpanel" aria-labelledby="' + k + 't' + i + '">' +
      '<span class="dt-ix">[ ' + esc(x.n) + ' ] ' + esc(x.h) + (x.new ? '<span class="dt-new">NEW</span>' : '') + '</span>' +
      F(ip + '.ph', x.ph, 'h3', 'dt-ph', 'Panel heading') + (DEMOS[x.demo] || '') +
      '<ul class="dt-inc">' + each(ip + '.inc', x.inc, function(t, j, tp, tit){ return '<li' + tit + '>' + F(tp + '.t', t.t, 'span', '', 'Point') + '</li>'; }) + '</ul></div>';
  }).join('');
  var tag = btnTag();
  var list = each(p + '.items', items, function(x, i, ip, it){
    return '<' + tag + (tag === 'button' ? ' type="button"' : '') + ' class="dt-tab" role="tab" id="' + k + 't' + i + '" aria-controls="' + k + 'p' + i + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '" tabindex="' + (i === 0 ? 0 : -1) + '"' + it + '>' +
      dtIcon(x.i) + '<span class="dt-tt"><span class="dt-n">[ ' + F(ip + '.n', x.n, 'span', '', '00') + ' ]</span>' + F(ip + '.h', x.h, 'span', 'dt-h', 'Title') + '</span>' +
      F(ip + '.p', x.p, 'span', 'dt-p', 'One line') + '<span class="dt-get">YOU GET ' + F(ip + '.get', x.get, 'em', '', 'What you get') + '</span></' + tag + '>';
  });
  return wrapSec('sec dtabs', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<div class="dt-grid"><div class="dt-panels">' + panels + '</div><div class="dt-side">' +
    O(p + '.hint', s.hint, 'p', 'dt-hint', 'Hint above the list') + '<div class="dt-list" role="tablist" aria-label="' + esc(s.h || 'Products') + '">' + list + '</div></div></div></div>');
}
T.instruments = function(s, p, si, page){
  return wrapSec('sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<div class="figs">' +
    each(p + '.figs', s.figs, function(f, i, ip, it){
      return '<figure class="fig" style="margin:0"' + it + '><div class="cap">' + O(ip + '.lab', f.lab, 'span', 'lab', 'Label') + F(ip + '.h', f.h, 'h3', '', 'Title') + M(ip + '.p', f.p, '', 'Text') +
        '<' + btnTag() + ' type="button" class="replay">Run again</' + btnTag() + '></div><div class="viz">' + svg(f.kind) + svg(f.kind + '_c') + '</div></figure>';
    }) + '</div>' + OM(p + '.note', s.note, 'figs-note', 'Note') + '</div>');
};
var RC_COL = ['background:var(--ink);color:var(--paper)', 'background:var(--ink-2);color:var(--paper)', 'background:var(--gauge);color:var(--paper)', 'background:var(--paper-3);color:var(--ink)'];
function pct(v){ var n = parseFloat(String(v).replace(',', '.')); return isFinite(n) && n > 0 ? n : 1; }
/* v39: the ConstraintBench section shows the v1.0 pass rates (Calle, 18 Oct 2026); logos are the makers' marks, matched by model name */
var LOGOS = {"openai":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z\">\u003c/path>"},"claude":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z\">\u003c/path>"},"meta":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M6.897 4c1.915 0 3.516.932 5.43 3.376l.282-.373c.19-.246.383-.484.58-.71l.313-.35C14.588 4.788 15.792 4 17.225 4c1.273 0 2.469.557 3.491 1.516l.218.213c1.73 1.765 2.917 4.71 3.053 8.026l.011.392.002.25c0 1.501-.28 2.759-.818 3.7l-.14.23-.108.153c-.301.42-.664.758-1.086 1.009l-.265.142-.087.04a3.493 3.493 0 01-.302.118 4.117 4.117 0 01-1.33.208c-.524 0-.996-.067-1.438-.215-.614-.204-1.163-.56-1.726-1.116l-.227-.235c-.753-.812-1.534-1.976-2.493-3.586l-1.43-2.41-.544-.895-1.766 3.13-.343.592C7.597 19.156 6.227 20 4.356 20c-1.21 0-2.205-.42-2.936-1.182l-.168-.184c-.484-.573-.837-1.311-1.043-2.189l-.067-.32a8.69 8.69 0 01-.136-1.288L0 14.468c.002-.745.06-1.49.174-2.23l.1-.573c.298-1.53.828-2.958 1.536-4.157l.209-.34c1.177-1.83 2.789-3.053 4.615-3.16L6.897 4zm-.033 2.615l-.201.01c-.83.083-1.606.673-2.252 1.577l-.138.199-.01.018c-.67 1.017-1.185 2.378-1.456 3.845l-.004.022a12.591 12.591 0 00-.207 2.254l.002.188c.004.18.017.36.04.54l.043.291c.092.503.257.908.486 1.208l.117.137c.303.323.698.492 1.17.492 1.1 0 1.796-.676 3.696-3.641l2.175-3.4.454-.701-.139-.198C9.11 7.3 8.084 6.616 6.864 6.616zm10.196-.552l-.176.007c-.635.048-1.223.359-1.82.933l-.196.198c-.439.462-.887 1.064-1.367 1.807l.266.398c.18.274.362.56.55.858l.293.475 1.396 2.335.695 1.114c.583.926 1.03 1.6 1.408 2.082l.213.262c.282.326.529.54.777.673l.102.05c.227.1.457.138.718.138.176.002.35-.023.518-.073.338-.104.61-.32.813-.637l.095-.163.077-.162c.194-.459.29-1.06.29-1.785l-.006-.449c-.08-2.871-.938-5.372-2.2-6.798l-.176-.189c-.67-.683-1.444-1.074-2.27-1.074z\">\u003c/path>"},"kimi":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M21.846 0a1.923 1.923 0 110 3.846H20.15a.226.226 0 01-.227-.226V1.923C19.923.861 20.784 0 21.846 0z\">\u003c/path>\u003cpath d=\"M11.065 11.199l7.257-7.2c.137-.136.06-.41-.116-.41H14.3a.164.164 0 00-.117.051l-7.82 7.756c-.122.12-.302.013-.302-.179V3.82c0-.127-.083-.23-.185-.23H3.186c-.103 0-.186.103-.186.23V19.77c0 .128.083.23.186.23h2.69c.103 0 .186-.102.186-.23v-3.25c0-.069.025-.135.069-.178l2.424-2.406a.158.158 0 01.205-.023l6.484 4.772a7.677 7.677 0 003.453 1.283c.108.012.2-.095.2-.23v-3.06c0-.117-.07-.212-.164-.227a5.028 5.028 0 01-2.027-.807l-5.613-4.064c-.117-.078-.132-.279-.028-.381z\">\u003c/path>"},"qwen":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z\">\u003c/path>"},"zai":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M12.105 2L9.927 4.953H.653L2.83 2h9.276zM23.254 19.048L21.078 22h-9.242l2.174-2.952h9.244zM24 2L9.264 22H0L14.736 2H24z\">\u003c/path>"},"nvidia":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M10.212 8.976V7.62c.127-.01.256-.017.388-.021 3.596-.117 5.957 3.184 5.957 3.184s-2.548 3.647-5.282 3.647a3.227 3.227 0 01-1.063-.175v-4.109c1.4.174 1.681.812 2.523 2.258l1.873-1.627a4.905 4.905 0 00-3.67-1.846 6.594 6.594 0 00-.729.044m0-4.476v2.025c.13-.01.259-.019.388-.024 5.002-.174 8.261 4.226 8.261 4.226s-3.743 4.69-7.643 4.69c-.338 0-.675-.031-1.007-.092v1.25c.278.038.558.057.838.057 3.629 0 6.253-1.91 8.794-4.169.421.347 2.146 1.193 2.501 1.564-2.416 2.083-8.048 3.763-11.24 3.763-.308 0-.603-.02-.894-.048V19.5H24v-15H10.21zm0 9.756v1.068c-3.356-.616-4.287-4.21-4.287-4.21a7.173 7.173 0 014.287-2.138v1.172h-.005a3.182 3.182 0 00-2.502 1.178s.615 2.276 2.507 2.931m-5.961-3.3c1.436-1.935 3.604-3.148 5.961-3.336V6.523C5.81 6.887 2 10.723 2 10.723s2.158 6.427 8.21 7.015v-1.166C5.77 16 4.25 10.958 4.25 10.958h-.002z\">\u003c/path>"},"gemini":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z\">\u003c/path>"},"deepseek":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z\">\u003c/path>"},"xai":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z\">\u003c/path>"},"mistral":{"vb":"0 0 24 24","svg":"\u003cpath clip-rule=\"evenodd\" d=\"M3.428 3.4h3.429v3.428h3.429v3.429h-.002 3.431V6.828h3.427V3.4h3.43v13.714H24v3.429H13.714v-3.428h-3.428v-3.429h-3.43v3.428h3.43v3.429H0v-3.429h3.428V3.4zm10.286 13.715h3.428v-3.429h-3.427v3.429z\">\u003c/path>"},"anthropic":{"vb":"0 0 24 24","svg":"\u003cpath d=\"M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z\">\u003c/path>"}};
var MAKERS = [['gpt', 'openai'], ['openai', 'openai'], ['claude', 'claude'], ['muse', 'meta'], ['llama', 'meta'], ['kimi', 'kimi'], ['qwen', 'qwen'], ['glm', 'zai'],
  ['nemotron', 'nvidia'], ['gemini', 'gemini'], ['gemma', 'gemini'], ['deepseek', 'deepseek'], ['grok', 'xai'], ['mistral', 'mistral'], ['devstral', 'mistral'], ['codestral', 'mistral']];
function makerOf(name){ var n = ' ' + String(name || '').toLowerCase(); for (var i = 0; i < MAKERS.length; i++) if (n.indexOf(' ' + MAKERS[i][0]) >= 0) return MAKERS[i][1]; return ''; }
HL.makerOf = makerOf;
function mlogo(name){
  var g = LOGOS && LOGOS[makerOf(name)];
  return g ? '<svg class="ml" viewBox="' + g.vb + '" aria-hidden="true" focusable="false" fill="currentColor" fill-rule="evenodd">' + g.svg + '</svg>' : '<span class="ml ml-x" aria-hidden="true"></span>';
}
function prNum(path, v){ return R.edit ? '<span data-f="' + path + '" data-num="1">' + esc(v) + '</span>' : esc(v); }
function passRates(s, p){
  var cl = function(v){ v = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isFinite(v) ? Math.max(0, Math.min(100, v)) : 0; };
  var rows = each(p + '.pr', s.pr, function(r, i, ip, it){
    var v = cl(r.pass), lo = cl(r.lo), hi = Math.max(lo, cl(r.hi));
    return '<div class="pr-r" style="--i:' + i + '"' + it + '><span class="pr-k mono">' + (i + 1) + '</span><span class="pr-n">' + mlogo(r.name) + F(ip + '.name', r.name, 'span', 'pr-nm', 'Model') + '</span>' +
      '<span class="pr-t" role="img" aria-label="' + esc((r.name || '') + ': ' + r.pass + '%, 95% confidence interval ' + r.lo + ' to ' + r.hi) + '"><i class="pr-b" style="width:' + v + '%"></i><i class="pr-ci" style="left:' + lo + '%;width:' + (hi - lo) + '%"></i></span>' +
      '<span class="pr-v mono"><b>' + prNum(ip + '.pass', r.pass) + '%</b><small>[' + prNum(ip + '.lo', r.lo) + ', ' + prNum(ip + '.hi', r.hi) + ']</small></span></div>';
  });
  return '<div class="rc-wrap pr-wrap">' + F(p + '.prLab', s.prLab, 'span', 'lab', 'Label') +
    '<div class="pr">' + rows + '<div class="pr-r pr-ax" aria-hidden="true"><span></span><span></span><span class="pr-axs mono"><span style="left:0">0</span><span style="left:25%">25</span><span style="left:50%">50</span><span style="left:75%">75</span><span style="left:100%">100%</span></span></div></div>' +
    O(p + '.src', s.src, 'p', 'rc-src', 'Source') + '</div>';
}
T.bench = function(s, p, si, page){
  var rc = s.rc || [];
  if (Array.isArray(s.pr)) return wrapSec('sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<div class="bench"><span></span><div style="min-width:0">' +
    '<div class="facts" style="--n:' + Math.min(4, (s.facts || []).length || 1) + '">' +
    each(p + '.facts', s.facts, function(f, i, ip, it){ return '<div' + it + '>' + F(ip + '.lab', f.lab, 'span', 'lab', 'Label') + F(ip + '.v', f.v, 'span', 'v', '0') + F(ip + '.p', f.p, 'p', '', 'Text') + '</div>'; }) + '</div>' +
    (window.TK && s.tkLab !== false ? '<div class="bench-tk">' + O(p + '.tkLab', s.tkLab, 'span', 'lab', 'Label') + TK.html(0) + '</div>' : '') +
    passRates(s, p) +
    '<div class="go">' + each(p + '.links', s.links, function(l, i, ip, it){ return A(ip, l, 'btn', it); }) + '</div>' +
    '</div></div></div>');
  return wrapSec('sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<div class="bench"><span></span><div style="min-width:0">' +
    '<div class="facts" style="--n:' + Math.min(4, (s.facts || []).length || 1) + '">' +
    each(p + '.facts', s.facts, function(f, i, ip, it){ return '<div' + it + '>' + F(ip + '.lab', f.lab, 'span', 'lab', 'Label') + F(ip + '.v', f.v, 'span', 'v', '0') + F(ip + '.p', f.p, 'p', '', 'Text') + '</div>'; }) + '</div>' +
    '<div class="rc-wrap">' + F(p + '.rcLab', s.rcLab, 'span', 'lab', 'Label') +
    '<div class="rc">' + rc.map(function(r, i){ return '<div style="flex:' + pct(r.pct) + ';' + RC_COL[i % 4] + '"><span data-f="' + p + '.rc.' + i + '.pct" data-num="1">' + esc(r.pct) + '</span>%</div>'; }).join('') + '</div>' +
    '<div class="rc-lab">' + each(p + '.rc', rc, function(r, i, ip, it){ return '<div style="flex:' + pct(r.pct) + '"' + it + '>' + F(ip + '.name', r.name, 'strong', 'rn', 'Cause') + F(ip + '.sub', r.sub, 'span', '', 'Detail') + '</div>'; }) + '</div>' +
    O(p + '.src', s.src, 'p', 'rc-src', 'Source') + '</div>' +
    '<div class="go">' + each(p + '.links', s.links, function(l, i, ip, it){ return A(ip, l, 'btn', it); }) + '</div>' +
    '</div></div></div>');
};
T.band = function(s, p, si, page){
  var act = '', mode = s.mode || 'reveal', B = btnTag();
  if (mode === 'form') {
    var fc = (R.st && R.st.site && R.st.site.form) || {};
    return wrapSec('band band-form' + toneCls(s.tone), s, si, page,
      '<div class="wrap"><div>' + F(p + '.lab', s.lab, 'span', 'lab', 'Label') + F(p + '.h', s.h, 'h2', '', 'Heading') + OM(p + '.p', s.p, '', 'Optional paragraph') + '</div>' +
      '<div class="fm-card fm-inline" data-inline-form role="group" aria-label="' + esc(fc.title || 'Request access') + '">' + formInner(fc, true) + '</div></div>');
  }
  var addr = function(hide){ return '<div class="addr"' + (hide ? ' hidden' : '') + '>' + F(p + '.mail', s.mail, 'span', 'mail', 'name@biftu.com') + '<' + B + ' type="button" class="copy">Copy</' + B + '></div>'; };
  if (mode === 'reveal') act = '<' + B + ' class="btn fill reveal-btn" type="button" aria-expanded="false">' + F(p + '.btn', s.btn, 'span', '', 'Button') + '</' + B + '>' + addr(!R.edit);
  else if (mode === 'addr') act = addr(false);
  else act = A(p + '.link', s.link, 'btn fill') + (s.mail ? addr(false) : '');
  return wrapSec('band' + toneCls(s.tone), s, si, page,
    '<div class="wrap"><div>' + F(p + '.lab', s.lab, 'span', 'lab', 'Label') + F(p + '.h', s.h, 'h2', '', 'Heading') + OM(p + '.p', s.p, '', 'Optional paragraph') + '</div>' +
    '<div class="reveal">' + act + '</div></div>');
};
function toneCls(t){ return t === 'board' ? ' tone-board' : t === 'data' ? ' tone-board tone-data' : ''; }
T.pghero = function(s, p, si, page){
  var car = s.fig === 'car';
  var fig = s.fig ? '<figure class="schem' + (car ? ' car-fig' : '') + '" style="margin:0">' + svg(s.fig) + (car ? '' : O(p + '.figcap', s.figcap, 'figcaption', 'lab', 'Caption')) + '</figure>' : '';
  var ctas = Array.isArray(s.ctas) && (s.ctas.length || R.edit) ? '<div class="ctas pg-ctas">' + each(p + '.ctas', s.ctas, function(c, i, ip, it){ return A(ip, c, i === 0 ? 'btn fill' : 'btn', it); }) + '</div>' : '';
  return wrapSec('pg-hero' + toneCls(s.tone), s, si, page,
    '<div class="wrap' + (fig ? ' split' : '') + (s.fig === 'pipeline' ? ' fig-pipe' : '') + (car ? ' fig-car' : '') + '"><div class="pg-txt">' + F(p + '.lab', s.lab, 'p', 'lab', 'Label') + F(p + '.h', s.h, 'h1', '', 'Headline') + OM(p + '.p', s.p, '', 'Optional paragraph') + ctas + logoRow(p, s, 'members', 'pg-members') + '</div>' + fig + clientRow(p, s, 'pg-clients') + '</div>');
};
T.vehicle = function(s, p, si, page){
  return wrapSec('vehicle', s, si, page,
    '<div class="wrap">' + O(p + '.lab', s.lab, 'span', 'lab', 'Label') + '<figure class="car">' + svg('car') + '</figure>' +
    '<div class="hero-cap"><div class="hc-l">' + O(p + '.cap', s.cap, 'p', '', 'Caption') + '</div>' +
    '<' + btnTag() + ' class="car-replay" type="button">Replay</' + btnTag() + '></div></div>');
};
T.models = function(s, p, si, page){
  return wrapSec('sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<div class="models" style="--n:' + Math.max(1, Math.min(3, (s.items || []).length)) + '">' +
    each(p + '.items', s.items, function(x, i, ip, it){ return '<div' + it + '>' + F(ip + '.n', x.n, 'span', 'n', '00') + F(ip + '.h', x.h, 'h3', '', 'Title') + M(ip + '.p', x.p, '', 'Text') + '</div>'; }) +
    '</div></div>');
};
/* v63, edited in v64: the enterprise page (Calle, 11 Nov 2026). ehero: page hero with the today vs target board. egap: what a general model
   knows next to your own model. eflow: the four steps, each with a small diagram. eladder: Pilot to SoTA. A [data-ea] block
   animates once when it scrolls into view; without script, or with reduced motion, it shows its end state. */
var ELOGO = {"qwen": "\u003csvg class=\"lg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill-rule=\"evenodd\">\u003cpath d=\"M19.713 2.825h-5.907c0-.251-.066-.503-.196-.728L12.819.728A1.46 1.46 0 0 0 11.559 0h-1.58c-.52 0-1 .275-1.26.728l-2.42 4.19a1.45 1.45 0 0 0 0 1.453l.791 1.37c.26.448.74.727 1.26.727h11.36c.52 0 1-.275 1.26-.728l.79-1.37a1.45 1.45 0 0 0 0-1.451l-.79-1.37a1.46 1.46 0 0 0-1.26-.728zM.195 9.905l2.951 5.115a1.46 1.46 0 0 0-.531.531l-.791 1.37a1.45 1.45 0 0 0 0 1.452l.79 1.37c.26.448.74.727 1.26.727h4.84c.52 0 1-.275 1.26-.728l.79-1.37a1.45 1.45 0 0 0 0-1.451L5.086 7.083a1.46 1.46 0 0 0-1.26-.728h-1.58c-.52 0-1 .276-1.26.728l-.79 1.37a1.45 1.45 0 0 0 0 1.452m15.888 13.367 2.951-5.115c.217.125.469.196.728.196h1.582c.52 0 1-.275 1.26-.728l.79-1.37a1.45 1.45 0 0 0 0-1.451l-2.42-4.191a1.46 1.46 0 0 0-1.259-.728h-1.582c-.52 0-1 .276-1.259.728l-5.678 9.838a1.45 1.45 0 0 0 0 1.452l.79 1.37c.26.448.74.727 1.26.727h1.582c.52 0 1-.275 1.26-.728z\">\u003c/path>\u003c/svg>", "kimi": "\u003csvg class=\"lg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill-rule=\"evenodd\">\u003cpath d=\"M21.846 0a1.923 1.923 0 110 3.846H20.15a.226.226 0 01-.227-.226V1.923C19.923.861 20.784 0 21.846 0z\">\u003c/path>\u003cpath d=\"M11.065 11.199l7.257-7.2c.137-.136.06-.41-.116-.41H14.3a.164.164 0 00-.117.051l-7.82 7.756c-.122.12-.302.013-.302-.179V3.82c0-.127-.083-.23-.185-.23H3.186c-.103 0-.186.103-.186.23V19.77c0 .128.083.23.186.23h2.69c.103 0 .186-.102.186-.23v-3.25c0-.069.025-.135.069-.178l2.424-2.406a.158.158 0 01.205-.023l6.484 4.772a7.677 7.677 0 003.453 1.283c.108.012.2-.095.2-.23v-3.06c0-.117-.07-.212-.164-.227a5.028 5.028 0 01-2.027-.807l-5.613-4.064c-.117-.078-.132-.279-.028-.381z\">\u003c/path>\u003c/svg>", "nvidia": "\u003csvg class=\"lg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill-rule=\"evenodd\">\u003cpath d=\"M10.212 8.976V7.62c.127-.01.256-.017.388-.021 3.596-.117 5.957 3.184 5.957 3.184s-2.548 3.647-5.282 3.647a3.227 3.227 0 01-1.063-.175v-4.109c1.4.174 1.681.812 2.523 2.258l1.873-1.627a4.905 4.905 0 00-3.67-1.846 6.594 6.594 0 00-.729.044m0-4.476v2.025c.13-.01.259-.019.388-.024 5.002-.174 8.261 4.226 8.261 4.226s-3.743 4.69-7.643 4.69c-.338 0-.675-.031-1.007-.092v1.25c.278.038.558.057.838.057 3.629 0 6.253-1.91 8.794-4.169.421.347 2.146 1.193 2.501 1.564-2.416 2.083-8.048 3.763-11.24 3.763-.308 0-.603-.02-.894-.048V19.5H24v-15H10.21zm0 9.756v1.068c-3.356-.616-4.287-4.21-4.287-4.21a7.173 7.173 0 014.287-2.138v1.172h-.005a3.182 3.182 0 00-2.502 1.178s.615 2.276 2.507 2.931m-5.961-3.3c1.436-1.935 3.604-3.148 5.961-3.336V6.523C5.81 6.887 2 10.723 2 10.723s2.158 6.427 8.21 7.015v-1.166C5.77 16 4.25 10.958 4.25 10.958h-.002z\">\u003c/path>\u003c/svg>", "muse": "\u003csvg class=\"lg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">\u003cpath d=\"M5.91 3.869C6.777 3.869 7.396 4.546 7.396 5.607 7.396 6.669 7.225 7.626 6.941 9.659 6.738 11.084 6.389 13.258 6.243 14.162 6.523 13.628 7.178 12.378 7.294 12.144 8.666 9.375 10.096 6.901 10.508 6.246 11.054 5.372 11.535 5.021 12.278 5.021 12.664 5.022 13.124 5.217 13.352 5.477 13.66 5.829 13.725 6.398 13.714 7.019 13.698 7.97 13.574 9.486 13.405 11.177 13.33 11.929 13.185 13.466 13.087 14.496 13.965 12.925 15.591 10.035 16.246 9.025 16.817 8.146 17.392 7.579 18.164 7.579 18.83 7.579 19.651 8.05 19.603 9.302 19.531 11.149 19.264 15.174 19.143 16.979 19.96 15.79 21.033 14.029 21.436 13.367 21.842 12.698 22.26 12.157 22.894 12.139 23.544 12.12 23.979 12.562 23.999 13.244 24.019 13.927 23.612 14.694 23.072 15.565 22.486 16.511 21.831 17.523 21.033 18.468 20.236 19.413 19.502 20.131 18.384 20.131 17.382 20.131 16.677 19.465 16.628 18.246 16.602 17.607 16.723 16.234 16.814 15.16 16.92 13.917 17.048 12.717 17.137 11.923 16.256 13.535 14.402 16.912 13.568 18.23 12.752 19.52 12.355 19.974 11.493 19.975 10.631 19.975 10.253 19.354 10.241 18.42 10.227 17.407 10.988 11.324 11.246 9.297 10.828 10.191 9.801 12.385 9.157 13.69 8.534 14.953 7.489 17.135 6.73 18.393 6.184 19.298 5.57 19.975 4.66 19.975 3.75 19.975 3.236 19.363 3.236 18.379 3.236 17.395 3.521 15.756 3.827 13.723 3.98 12.739 4.155 11.667 4.352 10.53 4.496 9.708 4.746 8.26 4.9 7.371 4.2 8.461 2.941 10.423 2.558 11.014 2.131 11.671 1.749 12.15 1.115 12.15 0.416 12.15 0 11.605 0 10.971 0 10.337 0.322 9.848 0.846 8.988 1.518 7.883 2.726 6.377 3.388 5.586 4.168 4.654 4.947 3.869 5.91 3.869Z\">\u003c/path>\u003c/svg>", "openai": "\u003csvg class=\"lg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill-rule=\"evenodd\">\u003cpath d=\"M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z\">\u003c/path>\u003c/svg>"};
var EI = {
  person: '<circle cx="12" cy="7.5" r="4"/><path d="M4 21c0-4.4 3.6-7.6 8-7.6s8 3.2 8 7.6z"/>',
  people: '<circle cx="12" cy="7" r="3.2"/><path d="M6.4 19.5c0-3.4 2.5-5.8 5.6-5.8s5.6 2.4 5.6 5.8z"/><circle cx="4.9" cy="9.2" r="2.4"/><path d="M.6 18.4c0-2.6 1.8-4.5 4.3-4.5.9 0 1.7.2 2.4.7-1.2 1.1-1.9 2.4-2.1 3.8z"/><circle cx="19.1" cy="9.2" r="2.4"/><path d="M23.4 18.4c0-2.6-1.8-4.5-4.3-4.5-.9 0-1.7.2-2.4.7 1.2 1.1 1.9 2.4 2.1 3.8z"/>',
  robot: '<path fill-rule="evenodd" d="M8 7.5h8a3 3 0 0 1 3 3v5.5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5.5a3 3 0 0 1 3-3zM9.6 11a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8zm4.8 0a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8zM9.5 15.6v1.3h5v-1.3z"/><rect x="11.2" y="4" width="1.6" height="3.5"/><circle cx="12" cy="3.4" r="1.6"/><rect x="2" y="11" width="2" height="5" rx="1"/><rect x="20" y="11" width="2" height="5" rx="1"/>',
  folder: '<path fill-rule="evenodd" d="M2.5 6A1.5 1.5 0 0 1 4 4.5h5.4l2.1 2.3H20A1.5 1.5 0 0 1 21.5 8.3V18.5A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5zM4.6 9v8.9h14.8V9z"/>',
  server: '<path fill-rule="evenodd" d="M4 3.5h16A1.5 1.5 0 0 1 21.5 5v4.5A1.5 1.5 0 0 1 20 11H4a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 4 3.5zm2.8 2.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM4 13h16a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 19v-4.5A1.5 1.5 0 0 1 4 13zm2.8 2.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/>',
  key: '<path fill-rule="evenodd" d="M7 6.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 3.4a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2z"/><path d="M12 10.7h10.5v2.6h-1.8v3h-2.6v-3h-1.4v2.2h-2.6v-2.2H12z"/>',
  data: '<path fill-rule="evenodd" d="M2.5 3.5h19v4.6h-19zm2.3 1.6v1.4h2V5.1zM2.5 9.7h19v4.6h-19zm2.3 1.6v1.4h2v-1.4zM2.5 15.9h19v4.6h-19zm2.3 1.6v1.4h2v-1.4z"/>',
  book: '<path d="M1.8 5.2c3-1 6.1-.6 9.2 1.1v13.4c-3.1-1.6-6.2-2-9.2-1zM22.2 5.2c-3-1-6.1-.6-9.2 1.1v13.4c3.1-1.6 6.2-2 9.2-1z"/>',
  loop: '<path d="M19.4 9.2A8 8 0 0 0 5.3 7.4M4.6 14.8a8 8 0 0 0 14.1 1.8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M20.4 3.4v6.7h-6.7zM3.6 20.6v-6.7h6.7z"/>',
  shield: '<path fill-rule="evenodd" d="M12 2l8.5 3.2v6.3c0 5.2-3.6 9.2-8.5 10.5-4.9-1.3-8.5-5.3-8.5-10.5V5.2zm0 2.6L5.9 6.9v4.6c0 3.9 2.5 7 6.1 8.1 3.6-1.1 6.1-4.2 6.1-8.1V6.9z"/>',
  gauge: '<path fill-rule="evenodd" d="M12 3.5a10 10 0 0 1 8.7 15h-2.9a7.6 7.6 0 1 0-11.6 0H3.3A10 10 0 0 1 12 3.5z"/><path d="M11 14.6l5.6-6.1 1 .9-4.7 6.8a1.6 1.6 0 1 1-1.9-1.6z"/>'
};
function eIc(k, cls){ return '<svg class="ei' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (EI[k] || '') + '</svg>'; }
function eBd(ok){ return '<b class="bd ' + (ok ? 'ok' : 'no') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ok ? 'M6.5 12.6l3.6 3.6 7.4-7.6' : 'M8 8l8 8M16 8l-8 8') + '"/></svg></b>'; }
function eAi(ok, cls){ return '<span class="ait' + (cls ? ' ' + cls : '') + '"><span>AI</span>' + (ok == null ? '' : eBd(ok)) + '</span>'; }
function eArr(){ return '<svg class="ear" viewBox="0 0 26 10" aria-hidden="true"><path d="M1 5h22M19 1.5L23 5l-4 3.5"/></svg>'; }
/* a bar on a track: v is a number or a [low, high] range, drawn solid to low and lighter to high */
function eBar(v, max, cls, d){
  var r = Array.isArray(v) ? v : [v], m = +max || 1, f = function(x){ return Math.max(0, Math.min(1, (+x || 0) / m)).toFixed(3); };
  return '<span class="eb' + (cls ? ' ' + cls : '') + '" style="--d:' + (d || 0) + '">' + (r.length > 1 ? '<i class="hi" style="--v:' + f(r[1]) + '"></i>' : '') + '<i style="--v:' + f(r[0]) + '"></i></span>';
}

T.ehero = function(s, p, si, page){
  var b = s.board || {}, bp = p + '.board';
  var ctas = Array.isArray(s.ctas) && (s.ctas.length || R.edit) ? '<div class="ctas pg-ctas">' + each(p + '.ctas', s.ctas, function(c, i, ip, it){ return A(ip, c, i === 0 ? 'btn fill' : 'btn', it); }) + '</div>' : '';
  var rows = each(bp + '.rows', b.rows, function(r, i, ip, it){
    return '<div class="eh-row"' + it + '><div class="eh-k">' + F(ip + '.h', r.h, 'span', 'eh-h', 'Metric') + F(ip + '.u', r.u, 'span', 'lab', 'Unit') + '</div>' +
      '<div class="eh-l"><span class="lab">' + esc(b.la || 'Today') + '</span>' + eBar(r.av, r.max, 'lim', i * 2) + F(ip + '.a', r.a, 'span', 'eh-v lim', '0') + '</div>' +
      '<div class="eh-l"><span class="lab">' + esc(b.lb || 'Target') + '</span>' + eBar(r.bv, r.max, '', i * 2 + 1) + F(ip + '.b', r.b, 'span', 'eh-v', '0') + '</div></div>';
  });
  var sov = b.sov ? '<div class="eh-sov">' + eIc('shield') + '<div>' + F(bp + '.sov.h', b.sov.h, 'span', 'eh-h', 'Title') + F(bp + '.sov.t', b.sov.t, 'span', '', 'Text') + '</div></div>' : '';
  var board = '<figure class="eh-fig" style="margin:0"><div class="eh-board" data-ea><div class="eh-top">' + eAi(true, 'lt') + '<div>' + F(bp + '.h', b.h, 'span', 'eh-h', 'Title') + O(bp + '.sub', b.sub, 'span', 'lab', 'Subtitle') + '</div></div>' +
    rows + sov + '</div>' + (b.note || R.edit ? '<figcaption class="eh-note">' + M(bp + '.note', b.note, '', 'Sources') + '</figcaption>' : '') + '</figure>';
  return wrapSec('pg-hero ehero' + toneCls(s.tone), s, si, page,
    '<div class="wrap split"><div class="pg-txt">' + F(p + '.lab', s.lab, 'p', 'lab', 'Label') + F(p + '.h', s.h, 'h1', '', 'Headline') + OM(p + '.p', s.p, '', 'Optional paragraph') + ctas + '</div>' + board + '</div>');
};

T.egap = function(s, p, si, page){
  var chips = function(lp, list, own, after){ return each(lp, list, function(c, i, ip, it){ return '<span class="gc' + (own ? ' gy' : '') + '"' + it + ' style="--d:' + (after + i) + '">' + F(ip + '.t', c.t, 'span', '', 'Chip') + '</span>'; }); };
  var panel = function(k, cap, full){
    return '<figure class="eg-p' + (full ? ' eg-full' : '') + '"><figcaption>' + F(p + '.' + k + '.lab', cap.lab, 'span', 'lab', 'Label') + F(p + '.' + k + '.t', cap.t, 'span', 'eg-t', 'Caption') + '</figcaption>' +
      '<div class="eg-f"><span class="eg-rg" aria-hidden="true"></span>' +
      '<div class="eg-c">' + F(p + '.pubLab', s.pubLab, 'span', 'lab', 'Label') + chips(p + '.pub', s.pub, false, 0) + '</div>' +
      '<div class="eg-c">' + F(p + '.ownLab', s.ownLab, 'span', 'lab', 'Label') + chips(p + '.own', s.own, true, 2) + '</div></div></figure>';
  };
  return wrapSec('sec egap-sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<div class="eg" data-ea>' + panel('a', s.a || {}, false) + '<span class="eg-ar">' + eArr() + '</span>' + panel('b', s.b || {}, true) + '</div></div>');
};

var EV = {
  bench: function(x, ip){
    var b = x.bench || {}, bp = ip + '.bench';
    var head = '<div class="bn-r bn-h"><span class="lab">' + esc(b.c0 || 'Model') + '</span><span class="lab">' + esc(b.c1 || 'Correct') + '</span><span class="lab">' + esc(b.c2 || 'Time per task') + '</span><span class="lab">' + esc(b.c3 || 'Cost per task') + '</span></div>';
    return '<div class="ev-bn">' + O(bp + '.cap', b.cap, 'p', 'lab ev-cap', 'Caption') + head + each(bp + '.rows', b.rows, function(r, i, ip2, it){
      return '<div class="bn-r"' + it + '>' + F(ip2 + '.t', r.t, 'span', 'bn-t', 'Model') +
        '<span class="bn-c">' + eBar(r.cv, 100, 'trk', i) + F(ip2 + '.c', r.c, 'span', 'bn-v', '0%') + '</span>' +
        '<span class="bn-c">' + eBar(r.mv, b.mmax || 6, '', i + 1) + F(ip2 + '.m', r.m, 'span', 'bn-v', '0 min') + '</span>' +
        '<span class="bn-c">' + eBar(r.dv, b.dmax || 3, '', i + 2) + F(ip2 + '.d', r.d, 'span', 'bn-v', '$') + '</span></div>';
    }) + '</div>';
  },
  data: function(x, ip){
    var d = x.data || {}, dp = ip + '.data', f = d.fix || {}, r = d.runs || {};
    var node = function(k, ic, lab){ return '<span class="dn">' + ic + F(dp + '.fix.' + k, lab, 'span', 'lab', 'Label') + '</span>'; };
    return '<div class="ev-dt"><div class="dt-p">' + F(dp + '.fix.lab', f.lab, 'span', 'lab dt-h', 'Label') +
      '<div class="dt-fx">' + node('a', eAi(false, 'dk'), f.a) + eArr() + node('b', '<span class="dn-i" style="--d:2">' + eIc('person') + '</span>', f.b) + eArr() +
      node('c', '<span class="dn-i" style="--d:4">' + eIc('folder') + eBd(true) + '</span>', f.c) + '</div></div>' +
      '<div class="dt-p">' + F(dp + '.runs.lab', r.lab, 'span', 'lab dt-h', 'Label') + '<div class="dt-rn">' +
      (r.marks || []).map(function(ok, i){ return '<span class="rb' + (ok ? '' : ' fail') + '" style="--d:' + (i + 1) + '">' + eIc('robot') + '<b class="mk ' + (ok ? 'ok' : 'no') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ok ? 'M5.5 12.6l4.1 4.1L18.5 7.8' : 'M7 7l10 10M17 7L7 17') + '"/></svg></b></span>'; }).join('') +
      '</div>' + O(dp + '.runs.cap', r.cap, 'span', 'lab dt-cap', 'Caption') + '</div></div>';
  },
  train: function(x, ip){
    var t = x.train || {}, tp = ip + '.train';
    var step = function(k, ic){ var q = t[k] || {}; return '<div class="tr-b tr-s" style="--d:' + (k === 's1' ? 1 : 2) + '">' + F(tp + '.' + k + '.n', q.n, 'span', 'lab', '00') + eIc(ic) + F(tp + '.' + k + '.h', q.h, 'span', 'tr-h', 'Title') + F(tp + '.' + k + '.p', q.p, 'span', 'tr-p', 'Text') + '</div>'; };
    var models = each(tp + '.models', t.models, function(m, i, mp, it){ return '<span class="tr-m"' + it + '>' + (ELOGO[m.k] || '') + F(mp + '.t', m.t, 'span', '', 'Model') + '</span>'; });
    return '<div class="ev-tr"><div class="tr-b tr-dk">' + F(tp + '.lab', t.lab, 'span', 'lab', 'Label') + '<div class="tr-ms">' + models + '</div></div>' + eArr() +
      step('s1', 'book') + eArr() + step('s2', 'loop') + eArr() +
      '<div class="tr-b tr-dk tr-out" style="--d:3">' + F(tp + '.out', t.out, 'span', 'lab', 'Label') + eAi(true, 'lt') + '</div></div>';
  },
  own: function(x, ip){
    var o = x.own || {}, op = ip + '.own';
    return '<div class="ev-ow"><div class="ow-h">' + F(op + '.lab', o.lab, 'span', 'lab', 'Label') + (o.opt || R.edit ? '<span class="ow-opt">' + eIc('loop') + F(op + '.optLab', o.optLab, 'span', 'lab', 'Option') + F(op + '.opt', o.opt, 'span', '', 'Option text') + '</span>' : '') + '</div>' +
      '<div class="ow-t">' + each(op + '.tiles', o.tiles, function(t, i, tp, it){ return '<div class="ow-i"' + it + ' style="--d:' + i + '">' + eIc(t.i) + F(tp + '.t', t.t, 'span', '', 'Text') + '</div>'; }) + '</div></div>';
  }
};
T.eflow = function(s, p, si, page){
  return wrapSec('sec eflow-sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<ol class="ef">' + each(p + '.items', s.items, function(x, i, ip, it){
      return '<li class="ef-i"' + it + '><div class="ef-t">' + F(ip + '.n', x.n, 'span', 'ef-n', '00') + F(ip + '.h', x.h, 'h3', '', 'Title') + M(ip + '.p', x.p, '', 'Text') +
        (x.get || R.edit ? '<div class="ef-get">' + F(ip + '.getLab', x.getLab || 'You get', 'span', 'lab', 'Label') + F(ip + '.get', x.get, 'span', '', 'What you get') + '</div>' : '') + '</div>' +
        '<div class="ef-v" data-ea>' + (EV[x.viz] ? EV[x.viz](x, ip) : '') + '</div></li>';
    }) + '</ol></div>');
};

T.eladder = function(s, p, si, page){
  var N = Math.max(4, Math.min(48, +s.cells || 24));
  return wrapSec('sec elad-sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + (s.legend || R.edit ? '<p class="el-leg"><i aria-hidden="true"></i>' + F(p + '.legend', s.legend, 'span', 'lab', 'Legend') + '</p>' : '') +
    '<div class="el" data-ea style="--n:' + Math.max(1, (s.items || []).length) + '">' + each(p + '.items', s.items, function(x, i, ip, it){
      var cells = '';
      for (var c = 0; c < N; c++) cells += '<i' + (c < (+x.f || 0) ? ' class="f" style="--d:' + (i * 4 + c * .25).toFixed(2) + '"' : '') + '></i>';
      return '<div class="el-s"' + it + ' style="--k:' + i + '">' + F(ip + '.n', x.n, 'span', 'lab', '00') + F(ip + '.h', x.h, 'h3', '', 'Stage') +
        '<div class="el-g" role="img" aria-label="' + esc((+x.f || 0) + ' of ' + N) + '">' + cells + '</div>' + F(ip + '.g', x.g, 'p', '', 'Goal') + '</div>';
    }) + '</div></div>');
};

T.clients = function(s, p, si, page){
  return wrapSec('sec', s, si, page,
    '<div class="wrap"><header class="sec-h" style="margin-bottom:0">' + F(p + '.lab', s.lab, 'span', 'lab', 'Label') + '<div><div class="clients">' +
    each(p + '.items', s.items, function(x, i, ip, it){ return '<span' + it + '>' + F(ip + '.t', x.t, 'span', '', 'Name') + '</span>'; }) +
    '</div></div></header></div>');
};
/* v44: memberships as one quiet line, shown where the section has them */
function memLine(p, m, cls){
  if (!m) return '';
  return '<p class="mem' + (cls ? ' ' + cls : '') + '">' + F(p + '.member.lab', m.lab, 'span', 'lab', 'Label') + F(p + '.member.t', m.t, 'span', 'mem-t', 'Memberships') + '</p>';
}
T.kv = function(s, p, si, page){
  return wrapSec('sec', s, si, page,
    '<div class="wrap"><div class="kv" style="--n:' + Math.min(4, (s.items || []).length || 1) + '">' +
    each(p + '.items', s.items, function(x, i, ip, it){ return '<div' + it + '>' + F(ip + '.lab', x.lab, 'span', 'lab', 'Label') + M(ip + '.p', x.p, '', 'Value') + '</div>'; }) +
    '</div>' + memLine(p, s.member, 'kv-mem') + '</div>');
};
/* v46: email and phone under each name */
function ppContact(ip, x){
  if (R.edit) return '<span class="pp-ct mono">' + F(ip + '.email', x.email, 'span', '', 'Email') + F(ip + '.phone', x.phone, 'span', '', 'Phone') + '</span>';
  var a = [];
  if (x.email) a.push('<a href="mailto:' + esc(x.email) + '">' + esc(x.email) + '</a>');
  if (x.phone) a.push('<a href="tel:' + esc(String(x.phone).replace(/[^+\d]/g, '')) + '">' + esc(x.phone) + '</a>');
  return a.length ? '<span class="pp-ct mono">' + a.join('') + '</span>' : '';
}
function shortUrl(u){ return String(u || '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''); }
T.people = function(s, p, si, page){
  var hd = s.heads || ['Name', 'Role', 'LinkedIn'];
  return wrapSec('sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<table class="tbl"><thead><tr>' +
    '<th style="width:26%">' + F(p + '.heads.0', hd[0], 'span', '', 'Name') + '</th><th style="width:34%">' + F(p + '.heads.1', hd[1], 'span', '', 'Role') + '</th><th>' + F(p + '.heads.2', hd[2], 'span', '', 'Link') + '</th></tr></thead><tbody>' +
    each(p + '.items', s.items, function(x, i, ip, it){
      return '<tr' + it + '><td>' + F(ip + '.name', x.name, 'span', '', 'Name') + ppContact(ip, x) + '</td><td>' + F(ip + '.role', x.role, 'span', '', 'Role') + '</td><td class="m">' +
        (x.url || R.edit ? '<a href="' + esc(x.url || '#') + '" target="_blank" rel="noopener" data-href="' + ip + '.url"' + (R.edit ? ' draggable="false"' : '') + '>' + esc(shortUrl(x.url) || 'Add a LinkedIn link') + ' ↗</a>' : '') + '</td></tr>';
    }) + '</tbody></table></div>');
};
/* ---------- blog posts: list items with a slug and a body get their own page at #blog.<slug> ---------- */
function postHas(x){ return !!(x && x.slug && x.body && String(x.body).trim()); }
HL.postHas = postHas;
HL.eachPost = function(st, fn){
  (st.order || []).forEach(function(k){
    ((st.pages[k] || {}).sections || []).forEach(function(s, j){
      if (s.type === 'posts') (s.items || []).forEach(function(x, i){ fn(x, {page: k, si: j, i: i, sec: s, path: 'pages.' + k + '.sections.' + j + '.items.' + i}); });
    });
  });
};
HL.findPost = function(st, slug){
  var hit = null;
  if (slug) HL.eachPost(st, function(x, at){ if (!hit && x.slug === slug) { at.item = x; hit = at; } });
  return hit;
};
function postHref(x){ return postHas(x) ? '#blog.' + x.slug : ((x.link && x.link.h) || ''); }
function linkAttrs(h){ return ' href="' + esc(h || '#') + '"' + (isExt(h) ? ' target="_blank" rel="noopener"' : ''); }
function readMins(t){ var n = String(t || '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length; return Math.max(1, Math.round(n / 220)); }
T.posts = function(s, p, si, page){
  var kinds = [], vis = function(x){ return R.edit || !x.draft; };
  (s.items || []).forEach(function(x){ var k = (x.kind || '').trim(); if (vis(x) && k && kinds.indexOf(k) < 0) kinds.push(k); });
  var chips = '<div class="filters" role="group" aria-label="Filter posts"><button type="button" class="chip" data-kind="" aria-pressed="true">' + esc(s.all || 'All') + '</button>' +
    kinds.map(function(k){ return '<button type="button" class="chip" data-kind="' + esc(k) + '" aria-pressed="false">' + esc(k) + '</button>'; }).join('') + '</div>';
  var tools = R.edit ? '<div class="post-tools"><span class="post-new" role="button" tabindex="0" data-new-post="' + p + '">+ New post</span><span class="lab">Drafts show only here until you publish them</span></div>' : '';
  return wrapSec('sec posts-sec', s, si, page,
    '<div class="wrap"><div class="posts-grid">' + F(p + '.lab', s.lab, 'span', 'lab', 'Label') + '<div style="min-width:0">' + (R.edit ? tools : chips) + '<div class="posts">' +
    each(p + '.items', s.items, function(x, i, ip, it){
      if (!vis(x)) return '';
      var href = postHref(x), own = postHas(x), cov = x.cover || own;
      var thA = !R.edit && href, th = cov ? (R.edit ? '<span class="post-th" data-open-post="' + ip + '">' : thA ? '<a class="post-th"' + linkAttrs(href) + ' tabindex="-1" aria-hidden="true">' : '<span class="post-th">') + HL.cover(coverOf(x), 'th') + (thA ? '</a>' : '</span>') : '';
      var title = R.edit ? F(ip + '.h', x.h, 'h3', '', 'Title') : '<h3>' + (href ? '<a class="post-a"' + linkAttrs(href) + '>' + inl(x.h) + '</a>' : inl(x.h)) + '</h3>';
      var more = own ? (R.edit ? '' : '<a class="more"' + linkAttrs(href) + '>' + esc((x.link && x.link.t) || 'Read the post') + '</a>') : OA(ip + '.link', x.link, 'more');
      var open = R.edit ? '<span class="post-open" role="button" tabindex="0" data-open-post="' + ip + '">' + (x.slug ? 'Open the post' : 'Write a post page') + '</span>' : '';
      return '<article class="post' + (cov ? ' has-cov' : '') + (x.draft ? ' is-draft' : '') + '" data-kind="' + esc((x.kind || '').trim()) + '"' + it + '><div class="meta">' + F(ip + '.date', x.date, 'span', 'dt', 'Date') + F(ip + '.kind', x.kind, 'span', 'lab', 'Kind') + (x.draft && R.edit ? '<span class="post-draft">Draft</span>' : '') + '</div>' +
        '<div class="post-txt">' + title + OM(ip + '.p', x.p, '', 'Summary') + more + open + '</div>' + th + '</article>';
    }) + '</div></div></div></div>');
};
/* the post page */
function article(st, f){
  var x = f.item, p = f.path, pg = st.pages[f.page] || {};
  var back = f.sec.anchor ? '#' + f.sec.anchor : '#' + f.page;
  var fact = function(lab, inner){ return '<div class="af"><span class="lab">' + lab + '</span>' + inner + '</div>'; };
  var list = [], at = -1;
  HL.eachPost(st, function(y, a){ if (a.page !== f.page) return; if (y === x) at = list.length; else if (postHas(y) && !y.draft) list.push(y); });
  var next = list.slice(Math.max(0, at)).concat(list.slice(0, Math.max(0, at))).slice(0, 3);
  var more = next.length ? '<section class="art-more"><div class="wrap"><div class="am-h"><span class="lab">More from ' + esc(pg.label || 'the archive') + '</span><a class="more" href="' + esc(back) + '"' + (R.edit ? ' draggable="false"' : '') + '>All posts</a></div><div class="am-grid">' +
    next.map(function(y){ return '<a class="am"' + linkAttrs('#blog.' + y.slug) + (R.edit ? ' data-open-slug="' + esc(y.slug) + '" draggable="false"' : '') + '><span class="am-cv">' + HL.cover(coverOf(y), 'th') + '</span><span class="dt">' + esc(y.date) + '</span><span class="am-t">' + inl(y.h) + '</span></a>'; }).join('') +
    '</div></div></section>' : '';
  return '<article class="art" data-post="' + esc(x.slug) + '">' +
    '<header class="art-h"><div class="wrap art-g"><a class="art-back lab" href="' + esc(back) + '"' + (R.edit ? ' draggable="false"' : '') + '><span aria-hidden="true">← </span>' + esc(pg.label || 'Back') + '</a>' +
    '<div class="art-hd">' + F(p + '.kind', x.kind, 'p', 'lab art-kind', 'Kind') + F(p + '.h', x.h, 'h1', '', 'Title') + OM(p + '.p', x.p, 'art-lede', 'Summary: shown under the title and in the list') + '</div></div></header>' +
    '<div class="wrap"><figure class="art-cover">' + HL.cover(coverOf(x)) + '</figure></div>' +
    '<div class="wrap art-g art-b"><aside class="art-rail">' +
    fact('Published', F(p + '.date', x.date, 'span', 'v', 'Date')) +
    ((x.author || R.edit) ? fact('Author', F(p + '.author', x.author, 'span', 'v', 'Name')) : '') +
    fact('Reading time', '<span class="v">' + readMins(x.body) + ' min</span>') +
    '</aside>' + M(p + '.body', x.body, 'art-body', 'Write the post here. Markdown works: ## Heading, - list, > quote, **bold**, [link](https://…)') + '</div>' +
    more + '</article>';
}
T.text = function(s, p, si, page){
  return wrapSec('sec text-sec', s, si, page, '<div class="wrap">' + secH(p, s) + '</div>');
};

/* ---------- latest posts: the three newest published posts, kept current automatically ---------- */
function postCard(y){
  return '<a class="am"' + linkAttrs('#blog.' + y.slug) + (R.edit ? ' data-open-slug="' + esc(y.slug) + '" draggable="false"' : '') + '><span class="am-cv">' + HL.cover(coverOf(y), 'th') + '</span>' +
    '<span class="am-m"><span class="dt">' + esc(y.date) + '</span>' + (y.kind ? '<span class="lab">' + esc(y.kind) + '</span>' : '') + '</span><span class="am-t">' + inl(y.h) + '</span>' +
    (y.p ? '<span class="am-p">' + inl(y.p) + '</span>' : '') + '</a>';
}
T.latest = function(s, p, si, page){
  var list = [];
  HL.eachPost(R.st, function(x, at){ if (postHas(x) && !x.draft && !at.sec.hidden && list.length < 3) list.push(x); });
  return wrapSec('sec latest-sec', s, si, page,
    '<div class="wrap">' + secH(p, s) + '<div class="am-grid lat-grid">' + (list.length ? list.map(postCard).join('') : (R.edit ? '<p class="lab">Published posts appear here.</p>' : '')) + '</div>' +
    ((s.more && s.more.t) || R.edit ? '<div class="lat-more">' + A(p + '.more', s.more, 'btn') + '</div>' : '') + '</div>');
};

/* ---------- careers: open roles, each with its own page at #careers.<slug> ---------- */
HL.eachRole = function(st, fn){
  (st.order || []).forEach(function(k){
    ((st.pages[k] || {}).sections || []).forEach(function(s, j){
      if (s.type === 'roles') (s.items || []).forEach(function(x, i){ fn(x, {page: k, si: j, i: i, sec: s, path: 'pages.' + k + '.sections.' + j + '.items.' + i}); });
    });
  });
};
HL.findRole = function(st, slug){
  var hit = null;
  if (slug) HL.eachRole(st, function(x, at){ if (!hit && x.slug === slug) { at.item = x; hit = at; } });
  return hit;
};
var FACTS = [['loc', 'Location'], ['type', 'Employment type'], ['mode', 'Location type'], ['dept', 'Department']];
function roleMeta(x){ return [x.dept, x.loc].filter(function(v){ return v && String(v).trim(); }).map(esc).join(' · '); }
T.roles = function(s, p, si, page){
  var tools = R.edit ? '<div class="post-tools"><span class="post-new" role="button" tabindex="0" data-new-role="' + p + '">+ New role</span><span class="lab">Drafts show only here until you publish them</span></div>' : '';
  var vis = (s.items || []).filter(function(x){ return R.edit || !x.draft; });
  return wrapSec('sec roles-sec', s, si, page,
    '<div class="wrap"><div class="posts-grid">' + F(p + '.lab', s.lab, 'span', 'lab', 'Label') + '<div style="min-width:0">' + tools + '<div class="roles">' +
    each(p + '.items', s.items, function(x, i, ip, it){
      if (!R.edit && x.draft) return '';
      var href = '#careers.' + x.slug;
      var title = R.edit ? F(ip + '.h', x.h, 'h3', '', 'Role title') : '<h3><a class="post-a"' + linkAttrs(href) + '>' + inl(x.h) + '</a></h3>';
      var tbd = !String(x.body || '').trim();
      return '<article class="role' + (x.draft ? ' is-draft' : '') + '"' + it + '><div class="role-txt">' + title +
        '<p class="role-meta">' + roleMeta(x) + (tbd ? '<span class="role-tbd">Job description to be published</span>' : '') + '</p>' +
        (x.draft && R.edit ? '<span class="post-draft">Draft</span>' : '') + '</div>' +
        (R.edit ? '<span class="post-open" role="button" tabindex="0" data-open-role="' + ip + '">Open the role</span>' : '<a class="more"' + linkAttrs(href) + '>View role</a>') + '</article>';
    }) + (vis.length || R.edit ? '' : '<p class="role-none">' + esc(s.none || 'No open roles right now.') + '</p>') + '</div></div></div></div>');
};
T.callouts = function(s, p, si, page){
  return wrapSec('sec callouts-sec', s, si, page,
    '<div class="wrap">' + (s.h || R.edit ? secH(p, s) : '') + '<div class="co-grid">' +
    each(p + '.items', s.items, function(x, i, ip, it){
      return '<div class="callout tone-data co"' + it + '><div class="co-txt">' + O(ip + '.lab', x.lab, 'span', 'lab', 'Label') + F(ip + '.t', x.t, 'p', 'co-t', 'Callout text') + OM(ip + '.p', x.p, 'co-p', 'Optional line') + '</div>' + A(ip + '.link', x.link, 'btn fill') + '</div>';
    }) + '</div></div>');
};
T.logos = function(s, p, si, page){
  return wrapSec('sec logos-sec' + toneCls(s.tone), s, si, page,
    '<div class="wrap"><div class="logos-in">' + O(p + '.lab', s.lab, 'span', 'lab', 'Label') + '<div class="logo-row">' +
    each(p + '.items', s.items, function(x, i, ip, it){
      var img = x.src ? '<img src="' + esc(x.src) + '" alt="' + esc(x.name || '') + '" loading="lazy" draggable="false"' + (+x.size ? ' style="--h:' + (+x.size) + 'px"' : '') + '>' : '<span class="logo-ph">' + esc(x.name || 'Logo') + '</span>';
      return '<div class="logo"' + it + (R.edit ? ' data-href="' + ip + '.src" data-href-lab="Image address (https://… or data:image/…)" title="' + esc(x.name || '') + '"' : '') + '>' + img + '</div>';
    }) + '</div></div></div>');
};
/* v37: a role can be shared, or passed to someone who fits, from its page (Calle, 12 Oct 2026).
   The link uses the site's address and a path, so a shared link opens the role on biftu.com. */
HL.roleUrl = function(st, x){
  var base = (st.site.meta && st.site.meta.url) || '';
  if (base) return base.replace(/\/?$/, '/') + 'careers/' + x.slug;
  return location.href.split('#')[0] + '#careers.' + x.slug;
};
function shareRow(st, x){
  if (R.edit) return '';
  var u = HL.roleUrl(st, x), t = x.h + ' at Biftu';
  var mail = 'mailto:?subject=' + encodeURIComponent('A role at Biftu: ' + x.h) +
    '&body=' + encodeURIComponent('This role at Biftu made me think of you:\n\n' + x.h + '\n' + u + '\n\nIf you apply, you can name me under Referred by.');
  var native = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  return '<div class="job-share"><span class="lab">Share or refer</span><span class="js-l">' +
    '<button type="button" class="js-a" data-copy="' + esc(u) + '">Copy link</button>' +
    '<a class="js-a" href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(u) + '" target="_blank" rel="noopener">LinkedIn</a>' +
    '<a class="js-a" href="https://x.com/intent/post?text=' + encodeURIComponent(t) + '&amp;url=' + encodeURIComponent(u) + '" target="_blank" rel="noopener">X</a>' +
    '<a class="js-a" href="' + esc(mail) + '">Email</a>' +
    (native ? '<button type="button" class="js-a" data-share="' + esc(u) + '" data-share-t="' + esc(t) + '">More</button>' : '') +
    '</span></div>';
}
function rolePage(st, f){
  var x = f.item, p = f.path, pg = st.pages[f.page] || {}, B = btnTag();
  var back = f.sec.anchor ? '#' + f.sec.anchor : '#' + f.page;
  var facts = FACTS.map(function(k){ var v = x[k[0]]; return (v && String(v).trim()) || R.edit ? '<div class="af"><span class="lab">' + k[1] + '</span>' + F(p + '.' + k[0], v || '', 'span', 'v', k[1]) + '</div>' : ''; }).join('');
  var applyBtn = function(t){ return '<' + B + ' type="button" class="btn fill apply" data-apply="' + esc(x.slug) + '">' + esc(t) + '</' + B + '>'; };
  var apply = applyBtn(f.sec.applyLab || 'Apply for this role');
  var others = [];
  HL.eachRole(st, function(y, a){ if (y !== x && !y.draft && a.page === f.page) others.push(y); });
  var more = others.length ? '<section class="art-more role-more"><div class="wrap"><div class="am-h"><span class="lab">Other open roles</span><a class="more" href="' + esc(back) + '"' + (R.edit ? ' draggable="false"' : '') + '>All roles</a></div><div class="roles">' +
    others.map(function(y){ return '<article class="role"><div class="role-txt"><h3><a class="post-a"' + linkAttrs('#careers.' + y.slug) + (R.edit ? ' data-open-rslug="' + esc(y.slug) + '"' : '') + '>' + inl(y.h) + '</a></h3><p class="role-meta">' + roleMeta(y) + '</p></div></article>'; }).join('') +
    '</div></div></section>' : '';
  return '<article class="art job" data-role="' + esc(x.slug) + '">' +
    '<header class="art-h"><div class="wrap art-g"><a class="art-back lab" href="' + esc(back) + '"' + (R.edit ? ' draggable="false"' : '') + '><span aria-hidden="true">← </span>' + esc(pg.label || 'Back') + '</a>' +
    '<div class="art-hd">' + O(p + '.dept', x.dept, 'p', 'lab art-kind', 'Department') + F(p + '.h', x.h, 'h1', '', 'Role title') + OM(p + '.p', x.p, 'art-lede', 'Opening line') + '<div class="job-cta">' + apply + shareRow(st, x) + '</div></div></div></header>' +
    '<div class="wrap art-g art-b"><aside class="art-rail">' + facts + '<div class="af job-rail-cta">' + applyBtn('Apply') + '</div></aside>' +
    '<div class="job-main">' + (String(x.body || '').trim() || R.edit ? M(p + '.body', x.body, 'art-body', 'Job description. Markdown works: ## Heading, - list, **bold**') : '<p class="role-tbd big">Job description to be published.</p>') +
    '<div class="job-end">' + apply + shareRow(st, x) + '</div></div></div>' + more + '</article>';
}

/* ---------- chrome ---------- */
function logoSvg(cls){
  return '<svg viewBox="0 0 2048 556" role="img" aria-label="biftu"' + (cls ? ' class="' + cls + '"' : '') + '><path fill="currentColor" fill-rule="evenodd" d="' + LOGO.letters + '"/><path fill="currentColor" d="' + LOGO.lb + '"/><g class="rbk"><path fill="currentColor" d="' + LOGO.rb + '"/></g></svg>';
}
function header(st, route){
  var s = st.site;
  return '<header class="hdr" id="hdr"><div class="wrap"><a class="home" href="#' + st.order[0] + '" data-top aria-label="Biftu home"' + (R.edit ? ' draggable="false"' : '') + '>' + logoSvg() + '</a>' +
    '<nav id="nav" aria-label="Main">' +
    each('site.nav', s.nav, function(l, i, ip, it){ return A(ip, l, '', it + (l.h === '#' + route ? ' aria-current="page"' : '')); }) +
    A('site.cta', s.cta, 'btn fill nav-cta') + '</nav>' +
    /* phones: the button stays in the bar, the links fold into the menu */
    A('site.cta', s.cta, 'btn fill hdr-cta') +
    '<button class="menu" id="menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span class="hb" aria-hidden="true"><i></i><i></i><i></i></span></button>' +
    '</div></header>';
}
/* v52: LinkedIn and X icons in the footer, under the tagline (site.footer.social: k, h, t) */
var SOCIAL_ICONS = {
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'
};
function socialRow(f){
  var list = (f.social || []).filter(function(x){ return SOCIAL_ICONS[x.k] && (x.h || R.edit); });
  if (!list.length) return '';
  return '<div class="ftr-soc">' + list.map(function(x){
    var i = (f.social || []).indexOf(x);
    return '<a href="' + esc(x.h || '#') + '" target="_blank" rel="noopener" aria-label="' + esc(x.t || x.k) + '" title="' + esc(x.t || x.k) + '" data-href="site.footer.social.' + i + '.h"' + (R.edit ? ' draggable="false"' : '') + '>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + SOCIAL_ICONS[x.k] + '"/></svg></a>';
  }).join('') + '</div>';
}
function footer(st){
  var f = st.site.footer;
  return '<footer class="ftr"><div class="wrap"><div class="top"><div class="brand"><a class="ftr-home" href="#' + st.order[0] + '" data-top aria-label="Biftu home"' + (R.edit ? ' draggable="false"' : '') + '>' + logoSvg() + '</a>' + F('site.footer.tag', f.tag, 'p', '', 'Tagline') + socialRow(f) + '</div>' +
    each('site.footer.cols', f.cols, function(c, i, ip, it){
      return '<div' + it + '>' + F(ip + '.lab', c.lab, 'span', 'lab', 'Label') + '<ul>' + each(ip + '.links', c.links, function(l, j, lp, lt){ return '<li' + lt + '>' + A(lp, l, '') + '</li>'; }) + '</ul></div>';
    }) + '</div><div class="bottom">' + F('site.footer.left', f.left, 'span', 'lab', 'Legal line') + F('site.footer.right', f.right, 'span', 'lab', 'Legal line') + '</div></div></footer>';
}

/* the whole page for one route, as an HTML string */
HL.renderPage = function(st, route, edit, post, role){
  R.edit = !!edit; R.st = st;
  var pg = st.pages[route] || st.pages[st.order[0]];
  var base = 'pages.' + route + '.sections';
  var fp = post ? HL.findPost(st, post) : null, fr = !fp && role ? HL.findRole(st, role) : null;
  var main = fp ? article(st, fp) : fr ? rolePage(st, fr) : (pg.sections || []).map(function(s, i){
    if (s.hidden && !R.edit) return '';
    var fn = T[s.type]; if (!fn) return '';
    return fn(s, base + '.' + i, i, route);
  }).join('');
  var out = st.bare ? '<main>' + main + '</main>' : header(st, route) + '<main>' + main + '</main>' + footer(st);
  R.edit = false;
  return out;
};

/* ---------- state, routing ---------- */
HL.readState = function(){
  var el = document.getElementById('hl-state');
  if (!el) { console.warn('HL: #hl-state not found'); return null; }
  try { return JSON.parse(el.textContent); } catch (e) { console.error('HL.readState JSON parse error:', e); return null; }
};
HL.state = HL.readState();
HL.editing = false;
HL.route = null;

HL.post = null;
HL.role = null;
HL.showDrafts = false;
HL.resolve = function(hash){
  var st = HL.state, h = (hash || '').replace(/^#/, '') || st.order[0], m;
  try { h = decodeURIComponent(h); } catch (e) {}
  if ((m = h.match(/^blog[.\/](.+)$/))) {
    var f = HL.findPost(st, m[1]);
    if (f && (HL.showDrafts ? true : (postHas(f.item) && !f.item.draft && !f.sec.hidden))) return {route: f.page, anchor: null, post: f.item.slug};
    var lp = null; HL.eachPost(st, function(x, at){ if (!lp) lp = at; });
    return {route: lp ? lp.page : (HL.route || st.order[0]), anchor: null};
  }
  if ((m = h.match(/^careers[.\/](.+)$/))) {
    var fr = HL.findRole(st, m[1]);
    if (fr && (HL.showDrafts || (!fr.item.draft && !fr.sec.hidden))) return {route: fr.page, anchor: null, role: fr.item.slug};
    var lr = null; HL.eachRole(st, function(x, at){ if (!lr) lr = at; });
    return {route: lr ? lr.page : (HL.route || st.order[0]), anchor: null};
  }
  if (st.pages[h]) return {route: h, anchor: null};
  for (var i = 0; i < st.order.length; i++) {
    var secs = st.pages[st.order[i]].sections || [];
    for (var j = 0; j < secs.length; j++) if (secs[j].anchor === h && !(secs[j].hidden && !HL.editing)) return {route: st.order[i], anchor: h};
  }
  return {route: HL.route || st.order[0], anchor: null};
};

var cleanups = [], quiet = false;
function onCleanup(fn){ cleanups.push(fn); }
HL.render = function(opts){
  opts = opts || {};
  var app = document.getElementById('app');
  cleanups.splice(0).forEach(function(fn){ try { fn(); } catch (e) {} });
  var y = window.scrollY;
  quiet = !!opts.keepScroll && !opts.anim;
  if (HL.post && !HL.findPost(HL.state, HL.post)) HL.post = null;
  if (HL.role && !HL.findRole(HL.state, HL.role)) HL.role = null;
  app.innerHTML = HL.renderPage(HL.state, HL.route, HL.editing, HL.post, HL.role);
  var pg = HL.state.pages[HL.route], fp = HL.post ? HL.findPost(HL.state, HL.post) : null, fr = HL.role ? HL.findRole(HL.state, HL.role) : null;
  document.title = fp ? (fp.item.h || 'Untitled post') + ' · Biftu' : fr ? (fr.item.h || 'Untitled role') + ' · Careers · Biftu' : (pg && pg.title) || 'Biftu';
  /* v36: the search description follows the page, post or role shown */
  var md = document.querySelector('meta[name="description"]'), dsc = fp ? fp.item.p : fr ? fr.item.p : pg && pg.desc;
  if (md && dsc) md.setAttribute('content', String(dsc).replace(/[*_`]/g, ''));
  boot(app);
  if (opts.keepScroll) window.scrollTo(0, y);
  if (HL.onRender) HL.onRender(app);
};
function go(hash, smooth){
  var r = HL.resolve(hash);
  var changed = r.route !== HL.route || (r.post || null) !== HL.post || (r.role || null) !== HL.role;
  HL.route = r.route; HL.post = r.post || null; HL.role = r.role || null;
  if (changed || !document.getElementById('hdr')) HL.render();
  if (r.anchor) {
    var el = document.getElementById(r.anchor);
    if (el) requestAnimationFrame(function(){ el.scrollIntoView({behavior: (reduce || changed || !smooth) ? 'instant' : 'smooth', block: 'start'}); });
  } else if (changed) { try { window.scrollTo({top: 0, left: 0, behavior: 'instant'}); } catch (e) { window.scrollTo(0, 0); } }
}
HL.go = go;
/* the logo, in the header and the footer, goes to the top of the index page from anywhere */
document.addEventListener('click', function(e){
  var a = e.target.closest && e.target.closest('a[data-top]');
  if (!a || e.defaultPrevented || HL.editing || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  var first = '#' + HL.state.order[0];
  if (location.hash !== first) location.hash = first;
  requestAnimationFrame(function(){ try { window.scrollTo({top: 0, left: 0, behavior: reduce ? 'instant' : 'smooth'}); } catch (x) { window.scrollTo(0, 0); } });
});

/* ---------- runtime for one rendered page ---------- */
function boot(root){
  if (window.TK && !HL.editing) TK.mountAll(root);
  var hdr = root.querySelector('#hdr'), nav = root.querySelector('#nav'), menu = root.querySelector('#menu');
  var first = root.querySelector('main > section');
  var heroOn = !!(first && (first.classList.contains('hero') || first.classList.contains('tone-board')));
  var dataOn = !!(first && first.classList.contains('tone-data'));
  var setHdr = function(v){ if (hdr) { hdr.classList.toggle('board', heroOn && v); hdr.classList.toggle('tone-data', dataOn && heroOn && v); } };
  setHdr(true);
  if (hdr && heroOn && 'IntersectionObserver' in window) {
    var hio = new IntersectionObserver(function(es){ setHdr(es[0].isIntersecting); }, {rootMargin: '-110px 0px 0px 0px'});
    hio.observe(first); onCleanup(function(){ hio.disconnect(); });
  }
  if (menu && nav) menu.addEventListener('click', function(){ if (HL.editing) return; var o = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  if (nav) nav.addEventListener('click', function(e){ if (e.target.closest('a')) { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });

  /* instruments */
  var insts = Array.prototype.slice.call(root.querySelectorAll('svg.inst'));
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if (!e.isIntersecting) return; io.unobserve(e.target); if (e.target._run) e.target._run(); });
  }, {threshold: 0.4}) : null;
  if (io) onCleanup(function(){ io.disconnect(); });
  insts.forEach(function(el){ el._run = function(){ sweep(el); }; if (quiet) return; if (io) io.observe(el); else sweep(el); });
  Array.prototype.forEach.call(root.querySelectorAll('.fig'), function(fig){
    var b = fig.querySelector('.replay'), els = fig.querySelectorAll('svg.inst');
    if (b && els.length) b.addEventListener('click', function(){ if (!HL.editing) Array.prototype.forEach.call(els, function(el){ sweep(el); }); });
  });

  /* ledger hashes resolve once */
  Array.prototype.forEach.call(root.querySelectorAll('.ledger .hx'), function(el, i){
    if (!quiet && /^[0-9a-f]{4} /.test(el.textContent)) { var t = setTimeout(function(){ scramble(el); }, 500 + i * 300); onCleanup(function(){ clearTimeout(t); }); }
  });

  /* root-cause bar */
  Array.prototype.forEach.call(root.querySelectorAll('.rc'), function(rc){
    rc._run = function(){ if (reduce) return; Array.prototype.forEach.call(rc.children, function(p, i){ p.animate([{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], {duration: 512, delay: i * 128, easing: 'steps(8, end)', fill: 'backwards'}); }); };
    if (io && !quiet) io.observe(rc);
  });

  /* v43: the ConstraintBench pass rates play once when scrolled to; off while editing and with reduced motion */
  Array.prototype.forEach.call(root.querySelectorAll('.pr'), function(pr){
    if (quiet || reduce || HL.editing || !('IntersectionObserver' in window)) return;
    pr.classList.add('snap', 'wait'); void pr.offsetWidth;
    var nums = Array.prototype.map.call(pr.querySelectorAll('.pr-v b'), prZero);
    requestAnimationFrame(function(){ pr.classList.remove('snap'); });
    var po = new IntersectionObserver(function(es){
      if (!es[0].isIntersecting) return;
      po.disconnect();
      requestAnimationFrame(function(){
        pr.classList.add('in');
        nums.forEach(function(z, i){ if (z) prTick(z, i * 55, 1100); });
        var t = setTimeout(function(){ pr.classList.remove('wait', 'in'); }, 2600);
        onCleanup(function(){ clearTimeout(t); });
      });
    }, {threshold: 0.25});
    po.observe(pr); onCleanup(function(){ po.disconnect(); });
  });

  /* v50: the service boxes rise in a wave and their icons draw in, once, when scrolled to; off while editing and with reduced motion */
  Array.prototype.forEach.call(root.querySelectorAll('.cards.has-ctags'), function(g){
    if (quiet || reduce || HL.editing || !('IntersectionObserver' in window)) return;
    g.classList.add('ic-snap', 'ic-wait'); void g.offsetWidth;
    requestAnimationFrame(function(){ g.classList.remove('ic-snap'); });
    var go = new IntersectionObserver(function(es){
      if (!es[0].isIntersecting) return;
      go.disconnect();
      requestAnimationFrame(function(){
        g.classList.add('ic-play');
        var t = setTimeout(function(){ g.classList.remove('ic-wait', 'ic-play'); }, 2800);
        onCleanup(function(){ clearTimeout(t); });
      });
    }, {threshold: 0.2});
    go.observe(g); onCleanup(function(){ go.disconnect(); });
  });

  /* v51: the data product tabs. The active panel's demo loops while the section is on screen; it shows its last frame
     when off screen, while editing and with reduced motion. */
  Array.prototype.forEach.call(root.querySelectorAll('.dtabs'), function(sec){
    var tabs = Array.prototype.slice.call(sec.querySelectorAll('.dt-tab'));
    if (!tabs.length) return;
    var timers = [], vis = false, io2 = null;
    function clear(){ timers.forEach(clearTimeout); timers = []; }
    function play(){
      clear();
      var panel = sec.querySelector('.dt-panel.act'), stage = panel && panel.querySelector('[data-loop]');
      if (!stage) return;
      var steps = stage.querySelectorAll('[data-at],[data-off]');
      var still = reduce || HL.editing || !vis;
      (function run(){
        Array.prototype.forEach.call(steps, function(el){ el.classList.remove('on', 'off'); });
        if (still) { Array.prototype.forEach.call(steps, function(el){ if (el.hasAttribute('data-at')) el.classList.add('on'); if (el.hasAttribute('data-off')) el.classList.add('off'); }); return; }
        void stage.offsetWidth;
        Array.prototype.forEach.call(steps, function(el){
          if (el.hasAttribute('data-at')) timers.push(setTimeout(function(){ el.classList.add('on'); }, +el.getAttribute('data-at')));
          if (el.hasAttribute('data-off')) timers.push(setTimeout(function(){ el.classList.add('off'); }, +el.getAttribute('data-off')));
        });
        timers.push(setTimeout(run, +stage.getAttribute('data-loop') || 7000));
      })();
    }
    function select(i, focus){
      tabs.forEach(function(t, j){
        var on = i === j, pn = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
        if (pn) pn.classList.toggle('act', on);
      });
      if (focus) tabs[i].focus();
      play();
      var pn = sec.querySelector('.dt-panel.act');
      if (pn && !HL.editing && window.innerWidth < 900) { /* v70: the list sits above the panel here, so bring the list into view and keep both on screen */ var side = sec.querySelector('.dt-side') || pn, r = pn.getBoundingClientRect(), r0 = side.getBoundingClientRect(); if (r0.top < 70 || r.bottom > window.innerHeight) side.scrollIntoView({block: 'start', behavior: reduce ? 'auto' : 'smooth'}); }
    }
    tabs.forEach(function(t, i){
      t.addEventListener('click', function(){ if (t.getAttribute('aria-selected') !== 'true') select(i); });
      t.addEventListener('keydown', function(e){
        if (HL.editing) return;
        var d = {ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1}[e.key];
        if (d) { e.preventDefault(); select((i + d + tabs.length) % tabs.length, true); }
      });
    });
    if ('IntersectionObserver' in window) {
      io2 = new IntersectionObserver(function(es){ var v = es[0].isIntersecting; if (v !== vis) { vis = v; play(); } }, {threshold: 0.25});
      io2.observe(sec);
    }
    play();
    onCleanup(function(){ clear(); if (io2) io2.disconnect(); });
  });

  /* v42: the request access form open in a band */
  Array.prototype.forEach.call(root.querySelectorAll('[data-inline-form]'), function(card){
    if (card._bound) return; card._bound = true;
    bindForm(card, formCfg(), null, null);
  });

  /* access reveal and copy */
  Array.prototype.forEach.call(root.querySelectorAll('.band'), function(b){
    var btn = b.querySelector('.reveal-btn'), addr = b.querySelector('.addr');
    if (btn && addr) btn.addEventListener('click', function(){ if (HL.editing) return; addr.hidden = !addr.hidden; btn.setAttribute('aria-expanded', addr.hidden ? 'false' : 'true'); });
    var cp = b.querySelector('.copy'), src = b.querySelector('.mail');
    if (cp && src) cp.addEventListener('click', function(){
      if (HL.editing) return;
      var done = function(t){ cp.textContent = t; setTimeout(function(){ cp.textContent = 'Copy'; }, 1500); };
      var fallback = function(){ var r = document.createRange(); r.selectNodeContents(src); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); done('Selected'); };
      try { navigator.clipboard.writeText(src.textContent).then(function(){ done('Copied'); }, fallback); } catch (e) { fallback(); }
    });
  });

  /* post filters */
  Array.prototype.forEach.call(root.querySelectorAll('.posts-sec'), function(sec){
    var chips = sec.querySelectorAll('.chip'), posts = sec.querySelectorAll('.post');
    Array.prototype.forEach.call(chips, function(c){
      c.addEventListener('click', function(){
        var k = c.getAttribute('data-kind');
        Array.prototype.forEach.call(chips, function(x){ x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        Array.prototype.forEach.call(posts, function(p){ p.hidden = !!k && p.getAttribute('data-kind') !== k; });
      });
    });
  });

  /* hero animations: one small motion that shows a value checked against its limit */
  Array.prototype.forEach.call(root.querySelectorAll('.hero-l'), function(sec){
    var kind = sec.getAttribute('data-anim');
    var a = heroAnim(sec, kind);
    if (a) onCleanup(a);
  });

  /* the chip pipeline */
  Array.prototype.forEach.call(root.querySelectorAll('svg.pipe'), function(el){ onCleanup(pipeAnim(el, quiet)); });

  /* the car */
  Array.prototype.forEach.call(root.querySelectorAll('.car-svg'), function(el){
    var hero = el.closest('section'), rp = hero && hero.querySelector('.car-replay');
    var a = carAnim(el, quiet);
    onCleanup(a.stop);
    if (rp) rp.addEventListener('click', function(){ if (!HL.editing) a.start(); });
  });
  /* v63: enterprise visuals animate once when they come into view */
  (function(){
    var els = Array.prototype.slice.call(root.querySelectorAll('[data-ea]'));
    if (!els.length || quiet || reduce || HL.editing || !('IntersectionObserver' in window)) return;
    var eio = new IntersectionObserver(function(es){ es.forEach(function(e){ if (!e.isIntersecting) return; eio.unobserve(e.target); e.target.classList.add('on'); }); }, {threshold: 0.35});
    els.forEach(function(el){ el.classList.add('ea'); eio.observe(el); });
    onCleanup(function(){ eio.disconnect(); });
  })();

}

function sweep(el){
  var rect = el.querySelector('.sweep-rect'), line = el.querySelector('.sweep-line');
  if (!rect) return;
  var x0 = +el.getAttribute('data-x0'), x1 = +el.getAttribute('data-x1'), n = +el.getAttribute('data-steps') || 64;
  var tok = el._t = (el._t || 0) + 1;
  if (reduce) { rect.setAttribute('width', x1 - x0); return; }
  el.classList.add('running');
  var t0 = performance.now();
  (function f(now){
    if (el._t !== tok || !el.isConnected) return;
    var p = Math.min(1, ((now || t0) - t0) / 2048), x = x0 + (x1 - x0) * Math.floor(p * n) / n;
    rect.setAttribute('width', Math.max(0.01, x - x0));
    line.setAttribute('x1', x); line.setAttribute('x2', x);
    if (p < 1) requestAnimationFrame(f); else { rect.setAttribute('width', x1 - x0); el.classList.remove('running'); }
  })(t0);
}
/* v43: a pass rate counts up from zero and ends on its exact text */
function prZero(el){
  var fin = el.textContent, m = fin.match(/^([\d.]+)(.*)$/);
  if (!m) return null;
  var dec = (m[1].split('.')[1] || '').length;
  el.textContent = (0).toFixed(dec) + m[2];
  return {el: el, fin: fin, to: parseFloat(m[1]), dec: dec, post: m[2]};
}
function prTick(z, delay, dur){
  var t0 = 0;
  setTimeout(function(){
    (function step(now){
      if (!t0) t0 = now;
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      z.el.textContent = k < 1 ? (z.to * e).toFixed(z.dec) + z.post : z.fin;
      if (k < 1 && z.el.isConnected) requestAnimationFrame(step); else z.el.textContent = z.fin;
    })(performance.now());
  }, delay);
}
function scramble(el){
  var fin = el.textContent; if (!fin || reduce) return;
  var hex = '0123456789abcdef', n = fin.length, k = 0;
  (function step(){
    if (!el.isConnected || document.activeElement === el) { el.textContent = fin; return; }
    k += Math.max(1, Math.ceil(n / 16)); var s = '';
    for (var i = 0; i < n; i++) { var ch = fin[i]; s += (i < k || ch === ' ' || ch === '…') ? ch : hex[(Math.random() * 16) | 0]; }
    el.textContent = s;
    if (k < n) setTimeout(step, 64); else el.textContent = fin;
  })();
}

/* ---------- hero animations: slow, and each one shows a value held to a limit ---------- */
var LIMITS = [
  {k: 'memory', v: '0, 128 KB'}, {k: 'timing', v: '0, 10 µs'}, {k: 'power', v: '0, 2.5 mA'}, {k: 'temperature', v: '−40, 125 °C'}
];
function heroAnim(sec, kind){
  if (!kind) return null;
  var alive = true, visible = true, io = null, extra = [];
  if ('IntersectionObserver' in window) { io = new IntersectionObserver(function(es){ visible = es[0].isIntersecting; }, {threshold: 0.05}); io.observe(sec); }
  var stop = function(){ alive = false; if (io) io.disconnect(); extra.forEach(function(f){ try { f(); } catch (e) {} }); };
  var nap = function(ms){ return new Promise(function(res){ setTimeout(function(){ res(alive); }, ms); }); };
  var ready = function(){ return new Promise(function(res){ (function chk(){ if (!alive) return res(false); if (visible && !document.hidden) return res(true); setTimeout(chk, 500); })(); }); };
  var ease = 'cubic-bezier(.45,0,.2,1)';

  /* 1 needle: the ledger rule is an interval; a needle drifts inside it and now and then overshoots in red */
  if (kind === 'needle') {
    var ir = sec.querySelector('.irule'); if (!ir) return stop;
    var mk = ir.querySelector('.mk'), ov = ir.querySelector('.ov'), LIM = 0.78;
    mk.style.opacity = '1';
    var go = function(p, ms){
      mk.style.transition = 'left ' + ms + 'ms ' + ease + ', background-color .6s';
      ov.style.transition = 'width ' + ms + 'ms ' + ease + ', opacity .8s';
      mk.style.left = (p * 100).toFixed(2) + '%';
      ov.style.width = (Math.max(0, p - LIM) * 100).toFixed(2) + '%';
      ir.classList.toggle('fail', p > LIM);
    };
    if (reduce) { go(0.58, 0); return stop; }
    go(0.12, 0);
    (async function(){
      var path = [[0.52, 3600, 1200], [0.61, 3000, 900], [0.47, 3200, 1100], [0.9, 3400, 2600], [0.58, 2800, 1600], [0.66, 3000, 900], [0.94, 3400, 2600], [0.5, 2800, 1400]];
      for (var i = 0; alive; i++) {
        if (!(await ready())) return;
        var st = path[i % path.length];
        go(st[0], st[1]);
        if (!(await nap(st[1] + st[2]))) return;
      }
    })();
    return stop;
  }

  /* 2 strip chart: two traces scroll slowly past the limit line; the model's peaks cross it in red */
  if (kind === 'strip') {
    var svgEl = sec.querySelector('.vstrip svg'); if (!svgEl) return stop;
    var pm = svgEl.querySelectorAll('.vs-m'), pe = svgEl.querySelector('.vs-e');
    var N = 960, W = 480, base = 104, scale = 82 / 2.5;
    var em = [], mm = [];
    for (var i = 0; i < N; i++) {
      var t = i / N * Math.PI * 2;
      var e = 0.95 + 0.32 * Math.sin(t * 3) + 0.18 * Math.sin(t * 11 + 1) + 0.09 * Math.sin(t * 29);
      var m = 1.55 + 0.38 * Math.sin(t * 2 + 0.6) + 0.22 * Math.sin(t * 9) + 0.1 * Math.sin(t * 31 + 2);
      var bump = Math.exp(-Math.pow(((i % 320) - 210) / 18, 2)) * 1.6;
      em.push(e); mm.push(m + bump);
    }
    var d = function(arr, off){
      var out = 'M', step = 2;
      for (var x = 0; x <= W; x += step) { var j = Math.floor(off + x) % N; out += x + ' ' + (base - arr[j] * scale).toFixed(1) + (x < W ? 'L' : ''); }
      return out;
    };
    var draw = function(off){ var dm = d(mm, off); pm[0].setAttribute('d', dm); pm[1].setAttribute('d', dm); pe.setAttribute('d', d(em, off + 40)); };
    var off = 0;
    draw(0);
    if (reduce) return stop;
    var last = performance.now(), raf = 0;
    var tick = function(now){
      if (!alive) return;
      if (visible && !document.hidden) { off = (off + (now - last) * 0.022) % N; draw(off); }
      last = now; raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    extra.push(function(){ cancelAnimationFrame(raf); });
    return stop;
  }

  /* 3 benchmark run: thirty tasks in three environments fill in one by one, pass or fail */
  if (kind === 'bench') {
    var grid = sec.querySelector('.vb-grid'); if (!grid) return stop;
    var html = '';
    for (var r = 0; r < 3; r++) { html += '<div class="vb-row"><span class="vb-env">env ' + (r + 1) + '</span>'; for (var c = 0; c < 10; c++) html += '<i></i>'; html += '</div>'; }
    grid.innerHTML = html;
    var cells = grid.querySelectorAll('i');
    var RUNS = ['111011101110110111101101111011', '110111011111011101101110111110', '111101101111011110111011011101'];
    var paint = function(k, v){ cells[k].className = v === '1' ? 'p' : 'f'; };
    if (reduce) { for (var q = 0; q < 30; q++) paint(q, RUNS[0][q]); return stop; }
    (async function(){
      for (var run = 0; alive; run++) {
        var pat = RUNS[run % RUNS.length];
        for (var k = 0; k < 30; k++) {
          if (!(await ready())) return;
          cells[k].classList.add('now');
          if (!(await nap(380))) return;
          cells[k].classList.remove('now'); paint(k, pat[k]);
        }
        if (!(await nap(4200))) return;
        grid.classList.add('clear');
        if (!(await nap(1600))) return;
        Array.prototype.forEach.call(cells, function(x){ x.className = ''; });
        grid.classList.remove('clear');
        if (!(await nap(900))) return;
      }
    })();
    return stop;
  }

  /* 4 limit readout: the logo box holds one limit at a time and eases to the next */
  if (kind === 'readout') {
    var box = sec.querySelector('.vr-box'), val = sec.querySelector('.vr-v'), lab = sec.querySelector('.vr-k');
    if (!box) return stop;
    var fit = function(){ val.style.width = val.scrollWidth + 'px'; };
    var setTo = function(L){ val.style.width = val.getBoundingClientRect().width + 'px'; val.textContent = L.v; lab.textContent = L.k; val.style.width = 'auto'; var w = val.getBoundingClientRect().width; return w; };
    if (reduce) return stop;
    (async function(){
      if (!(await nap(1200))) return;
      for (var i = 1; alive; i++) {
        if (!(await ready())) return;
        box.classList.add('dim');
        if (!(await nap(700))) return;
        var L = LIMITS[i % LIMITS.length];
        var from = val.getBoundingClientRect().width;
        val.textContent = L.v; lab.textContent = L.k;
        val.style.width = 'auto'; var to = val.getBoundingClientRect().width;
        val.style.width = from + 'px'; void val.offsetWidth;
        val.style.width = to + 'px';
        if (!(await nap(900))) return;
        box.classList.remove('dim');
        if (!(await nap(3600))) return;
        val.style.width = 'auto';
      }
    })();
    return stop;
  }

  /* 5 sweep: a faint line crosses the hero slowly; the release rows light as it reaches them */
  if (kind === 'sweep') {
    var line = sec.querySelector('.hsweep'), rows = sec.querySelectorAll('.ledger .row, .ledger .lh');
    if (!line || reduce) return stop;
    (async function(){
      if (!(await nap(1200))) return;
      while (alive) {
        if (!(await ready())) return;
        line.style.transition = 'none'; line.style.left = '0%'; line.style.opacity = '0'; void line.offsetWidth;
        line.style.transition = 'left 9s linear, opacity 1.2s';
        line.style.left = '100%'; line.style.opacity = '1';
        var wrapR = sec.querySelector('.wrap').getBoundingClientRect(), ledR = sec.querySelector('.ledger').getBoundingClientRect();
        var reach = Math.max(0, (ledR.left - wrapR.left) / wrapR.width) * 9000;
        if (!(await nap(reach))) return;
        Array.prototype.forEach.call(rows, function(rw, j){ setTimeout(function(){ if (!alive) return; rw.classList.add('lit'); setTimeout(function(){ rw.classList.remove('lit'); }, 1800); }, j * 260); });
        if (!(await nap(9000 - reach - 1200))) return;
        line.style.opacity = '0';
        if (!(await nap(1200 + 7000))) return;
      }
    })();
    return stop;
  }
  return stop;
}

/* ---------- chip pipeline: chips draw in along the signal chain, then frames flow through and the system on chip times each one ---------- */
function pipeAnim(svgEl, calm){
  var NS = 'http://www.w3.org/2000/svg', alive = true, visible = true, raf = 0, timers = [];
  var all = function(sel){ return Array.prototype.slice.call(svgEl.querySelectorAll(sel)); };
  var chip = {}, link = {};
  all('.pp-chip').forEach(function(g){ chip[g.getAttribute('data-k')] = g; });
  all('.pp-ln').forEach(function(p){ link[p.getAttribute('data-k')] = p; });
  var grid = svgEl.querySelector('.pp-grid'), pk = svgEl.querySelector('.pp-pk'), cells = all('.pp-cell');
  var tg = svgEl.querySelector('linearGradient[id^="pp-tail"]'), tail = tg ? tg.id : '';
  var fill = svgEl.querySelector('.pp-fill'), val = svgEl.querySelector('.pp-val'), meterG = svgEl.querySelector('.pp-meter');
  var EI = 'cubic-bezier(.65,0,.35,1)', EO = 'cubic-bezier(.16,1,.3,1)';
  var later = function(fn, ms){ var t = setTimeout(function(){ if (alive) fn(); }, ms); timers.push(t); return t; };
  var wait = function(ms){ return new Promise(function(res){ later(res, ms); }); };
  var anim = function(el, kf, o){ if (!el || !el.animate) return; var opt = {fill: 'backwards', easing: EO}; for (var k in o) opt[k] = o[k]; el.animate(kf, opt); };
  var io = null;
  var kit = null;
  var stop = function(){ alive = false; timers.forEach(clearTimeout); if (kit) kit.clear(); if (io) io.disconnect(); };
  var setMeter = function(v){ fill.setAttribute('width', Math.max(0, v / 33 * 88).toFixed(1)); val.textContent = Math.round(v) + ' ms'; };
  if (reduce) { setMeter(24); return stop; }

  /* packets */
  kit = flowKit(pk, tail, function(){ return alive; });
  var spawn = kit.spawn, burst = kit.burst;
  var flash = function(k, ms){ var g = chip[k]; if (!g) return; g.classList.add('hot'); later(function(){ g.classList.remove('hot'); }, ms || 280); };
  var hotLinks = function(ks, ms){ ks.forEach(function(k){ link[k].classList.add('hot'); later(function(){ link[k].classList.remove('hot'); }, ms); }); };
  var think = function(ms, row){
    cells.forEach(function(c){
      var x = +c.getAttribute('data-c'), y = +c.getAttribute('data-r');
      if (row != null ? y !== row : Math.random() < 0.3) return;
      later(function(){ c.classList.add('on'); later(function(){ c.classList.remove('on'); }, 140 + Math.random() * 220); }, x / 11 * ms * 0.85 + Math.random() * 90);
    });
    return wait(ms);
  };
  var meterRun = function(v, dur){
    var t0 = performance.now();
    (function f(now){ if (!alive) return; var t = Math.min(1, ((now || t0) - t0) / dur), e = 1 - Math.pow(1 - t, 3); setMeter(v * e); if (t < 1) requestAnimationFrame(f); })(t0);
  };
  var frame = async function(){
    var ms = 18 + Math.round(Math.random() * 9);
    meterRun(ms, 1700);
    hotLinks(['cam-ser'], 700);
    await burst(link['cam-ser'], 4, 440, 70);
    flash('ser');
    hotLinks(['ser-des-a', 'ser-des-b'], 650);
    await Promise.all([burst(link['ser-des-a'], 6, 320, 42, {l: 22, w: 1.7}), burst(link['ser-des-b'], 6, 320, 42, {l: 22, w: 1.7, offset: 21})]);
    flash('des');
    hotLinks(['des-soc-a', 'des-soc-b'], 600);
    await Promise.all([burst(link['des-soc-a'], 3, 300, 70), burst(link['des-soc-b'], 3, 300, 70, {offset: 35})]);
    flash('soc', 520);
    await think(520);
    hotLinks(['soc-net'], 600);
    await burst(link['soc-net'], 2, 340, 100, {l: 14});
    flash('net', 320);
  };
  var radar = async function(){
    hotLinks(['rad-soc'], 1100);
    await burst(link['rad-soc'], 1, 1000, 0, {l: 30, w: 2.6});
    flash('soc', 300);
    think(320, 3);
  };
  var loop = async function(){
    var nextF = 0, nextR = performance.now() + 1500;
    while (alive) {
      if (!visible || document.hidden) { await wait(500); continue; }
      var now = performance.now();
      if (now >= nextF) { nextF = now + 2700; frame(); }
      if (now >= nextR) { nextR = now + 4100; radar(); }
      await wait(120);
    }
  };

  /* entrance: the board appears, chips draw along the signal chain, links follow, readouts type in */
  var typeIn = function(t, delay){
    var full = t.textContent; t.textContent = '';
    later(function(){ var i = 0; (function step(){ if (!alive) return; i++; t.textContent = full.slice(0, i); if (i < full.length) later(step, 38); })(); }, delay);
  };
  var intro = function(){
    anim(grid, [{opacity: 0}, {opacity: 1}], {duration: 1400});
    var order = {cam: 60, ser: 240, rad: 320, des: 420, soc: 600, net: 820};
    Object.keys(order).forEach(function(k){
      var g = chip[k], d = order[k];
      anim(g.querySelector('.pp-out'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], {duration: 760, delay: d, easing: EI});
      anim(g.querySelector('.pp-pins'), [{strokeDashoffset: 1, opacity: 0}, {strokeDashoffset: 0, opacity: 1}], {duration: 700, delay: d + 260, easing: EI});
      anim(g.querySelector('.pp-body'), [{opacity: 0}, {opacity: 1}], {duration: 600, delay: d + 340});
      Array.prototype.forEach.call(g.querySelectorAll('text'), function(t, i){ anim(t, [{opacity: 0, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 620, delay: d + 460 + i * 90}); });
    });
    var lt = {'cam-ser': 760, 'rad-soc': 900, 'ser-des-a': 940, 'ser-des-b': 980, 'des-soc-a': 1120, 'des-soc-b': 1160, 'soc-net': 1360};
    Object.keys(lt).forEach(function(k){ anim(link[k], [{strokeDashoffset: 1}, {strokeDashoffset: 0}], {duration: 560, delay: lt[k], easing: EI}); });
    cells.forEach(function(c){
      var dist = Math.hypot(+c.getAttribute('data-c') - 5, (+c.getAttribute('data-r') - 1.5) * 1.7);
      anim(c, [{opacity: 0, transform: 'scale(.1)'}, {opacity: 1, transform: 'scale(1)'}], {duration: 460, delay: 900 + dist * 55});
    });
    anim(meterG, [{opacity: 0}, {opacity: 1}], {duration: 700, delay: 1500});
    all('.pp-iv').forEach(function(t, i){ typeIn(t, 1450 + i * 180); });
    setMeter(0);
    return 2300;
  };
  var started = false;
  var begin = function(){ if (started) return; started = true; var d = calm ? 0 : intro(); later(loop, d); };
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible) begin(); }, {threshold: 0.2});
    io.observe(svgEl);
  } else begin();
  return stop;
}

/* ---------- glowing packets that run along SVG paths (shared by the chip pipeline and the car) ---------- */
function flowKit(pk, tail, isAlive){
  var NS = 'http://www.w3.org/2000/svg', packets = [], raf = 0;
  var tick = function(now){
    for (var i = packets.length - 1; i >= 0; i--) {
      var p = packets[i], t = (now - p.t0) / p.dur;
      if (t < 0) continue;
      if (t >= 1) { if (p.el.parentNode) p.el.parentNode.removeChild(p.el); packets.splice(i, 1); if (p.done) p.done(); continue; }
      var e = -(Math.cos(Math.PI * t) - 1) / 2, at = (p.rev ? 1 - e : e) * p.len, pt = p.path.getPointAtLength(at);
      if (p.bend) { var bk = p.path.getPointAtLength(Math.max(0, Math.min(p.len, at + (p.rev ? 2 : -2)))); if (bk.x !== pt.x || bk.y !== pt.y) p.ang = Math.round(Math.atan2(pt.y - bk.y, pt.x - bk.x) * 180 / Math.PI); }
      p.el.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ') rotate(' + p.ang + ') translate(' + (-p.L) + ' ' + (-p.W / 2) + ')');
      p.el.style.opacity = t < 0.12 ? (t / 0.12).toFixed(2) : t > 0.88 ? ((1 - t) / 0.12).toFixed(2) : '1';
    }
    raf = packets.length && isAlive() ? requestAnimationFrame(tick) : 0;
  };
  var spawn = function(path, dur, o){
    o = o || {};
    var L = o.l || 16, W = o.w || 2.2, r = document.createElementNS(NS, 'rect');
    r.setAttribute('width', L); r.setAttribute('height', W); r.setAttribute('rx', W / 2); r.style.opacity = '0';
    if (tail) r.setAttribute('fill', 'url(#' + tail + ')');
    pk.appendChild(r);
    var len = path.getTotalLength(), near = Math.min(len, 6);
    var a = path.getPointAtLength(o.rev ? len : 0), b = path.getPointAtLength(o.rev ? len - near : near);
    packets.push({el: r, path: path, len: len, rev: !!o.rev, bend: /[LCQAVH].*[LCQAVH]/i.test(path.getAttribute('d') || ''), ang: Math.round(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI), t0: performance.now() + (o.delay || 0), dur: dur, L: L, W: W, done: o.done});
    if (!raf) raf = requestAnimationFrame(tick);
  };
  var burst = function(path, n, dur, gap, o){
    o = o || {};
    return new Promise(function(res){
      if (!path) return res();
      for (var i = 0; i < n; i++) spawn(path, dur, {l: o.l, w: o.w, rev: o.rev, delay: (o.offset || 0) + i * gap, done: i === n - 1 ? res : null});
    });
  };
  var clear = function(){ if (raf) cancelAnimationFrame(raf); raf = 0; packets.length = 0; while (pk.firstChild) pk.removeChild(pk.firstChild); };
  return {spawn: spawn, burst: burst, clear: clear};
}

/* ---------- the car: an SUV draws itself, wakes up, drives, and its sensors report to the central computer ---------- */
function carAnim(el, calm){
  var NS = 'http://www.w3.org/2000/svg', alive = true, visible = false, timers = [], io = null, motion = [], started = false;
  var all = function(sel){ return Array.prototype.slice.call(el.querySelectorAll(sel)); };
  var chip = {}, link = {}, read = {};
  all('.cv-chip').forEach(function(g){ chip[g.getAttribute('data-k')] = g; });
  all('.cv-ln').forEach(function(p){ link[p.getAttribute('data-k')] = p; });
  all('.cv-r').forEach(function(g){ read[g.getAttribute('data-k')] = g; });
  var cells = all('.cv-cell'), bcells = all('.cv-bc'), rims = all('.cv-rim'), road = el.querySelector('.cv-road');
  var radarG = el.querySelector('.cv-radar'), beamsG = el.querySelector('.cv-beams'), hitsG = el.querySelector('.cv-hits'), frameP = el.querySelector('.cv-frame');
  var gid = function(sel){ var g = el.querySelector(sel); return g ? g.id : ''; };
  var tail = gid('linearGradient[id^="cv-tail"]'), beamId = gid('linearGradient[id^="cv-beam"]');
  var kit = flowKit(el.querySelector('.cv-pk'), tail, function(){ return alive; }), burst = kit.burst;
  var EI = 'cubic-bezier(.65,0,.35,1)', EO = 'cubic-bezier(.16,1,.3,1)';
  var later = function(fn, ms){ var t = setTimeout(function(){ if (alive) fn(); }, ms); timers.push(t); return t; };
  var wait = function(ms){ return new Promise(function(res){ later(res, ms); }); };
  var anim = function(node, kf, o){ if (!node || !node.animate) return null; var opt = {fill: 'backwards', easing: EO}; for (var k in o) opt[k] = o[k]; return node.animate(kf, opt); };
  var rnd = function(a, b){ return a + Math.random() * (b - a); };

  /* readouts */
  var RW = 126, cur = {};
  var setRead = function(k, v){
    var g = read[k]; if (!g) return;
    var lo = +g.getAttribute('data-lo'), hi = +g.getAttribute('data-hi');
    cur[k] = v;
    g.querySelector('.cv-fill').setAttribute('width', Math.max(0, Math.min(1, (v - lo) / (hi - lo)) * RW).toFixed(1));
    g.querySelector('.cv-val').textContent = Math.round(v) + ' ' + g.getAttribute('data-u');
  };
  var readRun = function(k, v, dur){
    var g = read[k]; if (!g) return;
    var from = cur[k] == null ? +g.getAttribute('data-lo') : cur[k], t0 = performance.now();
    g.classList.add('hot'); later(function(){ g.classList.remove('hot'); }, 900);
    (function f(now){ if (!alive) return; var t = Math.min(1, ((now || t0) - t0) / (dur || 900)), e = 1 - Math.pow(1 - t, 3); setRead(k, from + (v - from) * e); if (t < 1) requestAnimationFrame(f); })(t0);
  };
  var sample = function(k){ var g = read[k]; return rnd(+g.getAttribute('data-a'), +g.getAttribute('data-b')); };
  var stop = function(){
    alive = false; timers.forEach(clearTimeout); kit.clear(); if (io) io.disconnect();
    motion.forEach(function(a){ try { a.cancel(); } catch (e) {} }); motion = [];
  };
  if (reduce) { Object.keys(read).forEach(function(k){ setRead(k, sample(k)); }); return {start: function(){}, stop: stop}; }

  var flash = function(k, ms){ var g = chip[k]; if (!g) return; g.classList.add('hot'); later(function(){ g.classList.remove('hot'); }, ms || 300); };
  var hotLinks = function(ks, ms){ ks.forEach(function(k){ if (!link[k]) return; link[k].classList.add('hot'); later(function(){ link[k].classList.remove('hot'); }, ms); }); };
  var think = function(ms, row){
    cells.forEach(function(c){
      var x = +c.getAttribute('data-c'), y = +c.getAttribute('data-r');
      if (row != null ? y !== row : Math.random() < 0.3) return;
      later(function(){ c.classList.add('on'); later(function(){ c.classList.remove('on'); }, 130 + Math.random() * 200); }, x / 9 * ms * 0.85 + Math.random() * 80);
    });
    return wait(ms);
  };

  /* driving: the rims turn and the road runs past at the speed the wheels imply */
  var drive = function(){
    if (motion.length) return;
    rims.forEach(function(r){ var a = r.animate([{transform: 'rotate(0deg)'}, {transform: 'rotate(360deg)'}], {duration: 3600, iterations: Infinity}); motion.push(a); });
    motion.push(road.animate([{strokeDashoffset: 0}, {strokeDashoffset: 23}], {duration: 23 / (2 * Math.PI * 38 / 3600), iterations: Infinity}));
    var t0 = performance.now();
    motion.forEach(function(a){ a.playbackRate = 0; });
    (function f(now){ if (!alive) return; var t = Math.min(1, ((now || t0) - t0) / 1800), r = t * t * (3 - 2 * t); motion.forEach(function(a){ a.playbackRate = Math.max(0.001, r); }); if (t < 1) requestAnimationFrame(f); })(t0);
  };
  var setMotion = function(on){ motion.forEach(function(a){ try { if (on) a.play(); else a.pause(); } catch (e) {} }); };

  /* sensors */
  var RC = [506.5, 197];
  var radarPing = function(){
    for (var i = 0; i < 3; i++) (function(i){
      var p = document.createElementNS(NS, 'path'), R = 24, a = 32 * Math.PI / 180;
      p.setAttribute('d', 'M' + (RC[0] + R * Math.cos(a)).toFixed(1) + ' ' + (RC[1] - R * Math.sin(a)).toFixed(1) + 'A' + R + ' ' + R + ' 0 0 1 ' + (RC[0] + R * Math.cos(a)).toFixed(1) + ' ' + (RC[1] + R * Math.sin(a)).toFixed(1));
      p.style.transformBox = 'view-box'; p.style.transformOrigin = RC[0] + 'px ' + RC[1] + 'px'; p.style.opacity = '0';
      radarG.appendChild(p);
      var an = p.animate([{transform: 'scale(.4)', opacity: 0.95}, {transform: 'scale(3.2)', opacity: 0}], {duration: 1150, delay: i * 170, easing: 'cubic-bezier(.2,.6,.3,1)'});
      an.onfinish = function(){ p.remove(); };
    })(i);
  };
  var LO = [302, 81];
  var lidarSweep = function(){
    var n = 7;
    for (var i = 0; i < n; i++) (function(i){
      var ang = i * 2.7 * Math.PI / 180, x1 = 576 + Math.random() * 6, y1 = LO[1] + (x1 - LO[0]) * Math.tan(ang);
      var b = document.createElementNS(NS, 'path');
      b.setAttribute('d', 'M' + LO[0] + ' ' + LO[1] + 'L' + x1.toFixed(1) + ' ' + y1.toFixed(1)); b.setAttribute('pathLength', '1');
      if (beamId) b.setAttribute('stroke', 'url(#' + beamId + ')');
      b.style.strokeDasharray = '1 1'; b.style.opacity = '0';
      beamsG.appendChild(b);
      var d = i * 70;
      var a1 = b.animate([{strokeDashoffset: 1, opacity: 1}, {strokeDashoffset: 0, opacity: 1, offset: 0.35}, {strokeDashoffset: 0, opacity: 0}], {duration: 900, delay: d, easing: 'ease-out'});
      a1.onfinish = function(){ b.remove(); };
      var h = document.createElementNS(NS, 'circle');
      h.setAttribute('cx', x1.toFixed(1)); h.setAttribute('cy', y1.toFixed(1)); h.setAttribute('r', '1.7'); h.style.opacity = '0';
      hitsG.appendChild(h);
      var a2 = h.animate([{opacity: 0}, {opacity: 1, offset: 0.15}, {opacity: 1, offset: 0.55}, {opacity: 0}], {duration: 1700, delay: d + 260});
      a2.onfinish = function(){ h.remove(); };
    })(i);
    return wait(n * 70 + 420);
  };

  /* events in the loop */
  var nFrames = 0;
  var camFrame = async function(){
    frameP.classList.add('on'); later(function(){ frameP.classList.remove('on'); }, 160);
    flash('cam', 260);
    hotLinks(['cam'], 900);
    await burst(link.cam, 4, 460, 70);
    flash('cc', 520);
    readRun('cam', sample('cam'));
    await think(460);
    if (++nFrames % 2) {
      hotLinks(['fz-a', 'fz-b', 'rz-a', 'rz-b'], 700);
      await Promise.all([burst(link['fz-a'], 2, 420, 80, {l: 14}), burst(link['fz-b'], 2, 420, 80, {l: 14, offset: 40}),
        burst(link['rz-a'], 2, 460, 80, {l: 14}), burst(link['rz-b'], 2, 460, 80, {l: 14, offset: 40})]);
      flash('fz'); flash('rz');
    }
  };
  var radar = async function(){
    radarPing();
    await wait(520);
    flash('rd', 260);
    hotLinks(['rd'], 700);
    await burst(link.rd, 2, 380, 90);
    flash('fz', 260);
    hotLinks(['fz-a', 'fz-b'], 700);
    await Promise.all([burst(link['fz-a'], 3, 400, 60, {l: 18, w: 1.8, rev: true}), burst(link['fz-b'], 3, 400, 60, {l: 18, w: 1.8, rev: true, offset: 30})]);
    flash('cc', 360);
    readRun('rd', sample('rd'));
    think(340, 1);
  };
  var lidar = async function(){
    flash('li', 400);
    await lidarSweep();
    hotLinks(['li'], 800);
    await burst(link.li, 3, 420, 80, {l: 18});
    flash('cc', 420);
    readRun('li', sample('li'));
    think(420, 0);
  };
  var battery = async function(){
    bcells.forEach(function(c, i){ later(function(){ c.classList.add('on'); later(function(){ c.classList.remove('on'); }, 220); }, i * 45); });
    await wait(bcells.length * 45 + 120);
    flash('bt', 300);
    hotLinks(['bt'], 600);
    await burst(link.bt, 2, 340, 100, {l: 12});
    flash('cc', 300);
    readRun('bt', sample('bt'));
    think(300, 2);
  };
  var rearCam = async function(){
    flash('rcam', 260);
    hotLinks(['rcam'], 700);
    await burst(link.rcam, 2, 420, 90, {l: 12});
    flash('rz', 260);
    hotLinks(['rz-a', 'rz-b'], 700);
    await Promise.all([burst(link['rz-a'], 3, 460, 60, {l: 18, w: 1.8, rev: true}), burst(link['rz-b'], 3, 460, 60, {l: 18, w: 1.8, rev: true, offset: 30})]);
    flash('cc', 320);
    think(320);
  };
  var loop = async function(){
    var now = performance.now(), next = {cam: now, rd: now + 1300, li: now + 2500, bt: now + 3700, rc: now + 5200};
    var every = {cam: 2700, rd: 4100, li: 5600, bt: 5300, rc: 6700}, fn = {cam: camFrame, rd: radar, li: lidar, bt: battery, rc: rearCam};
    while (alive) {
      if (!visible || document.hidden) { setMotion(false); await wait(400); if (alive && visible && !document.hidden) setMotion(true); continue; }
      now = performance.now();
      Object.keys(next).forEach(function(k){ if (now >= next[k]) { next[k] = now + every[k]; fn[k](); } });
      await wait(120);
    }
  };

  /* entrance: the outline draws, the wheels spin up, the lights wake, the network and its parts appear */
  var draw = function(node, dur, delay, easing){ return anim(node, [{strokeDashoffset: 1}, {strokeDashoffset: 0}], {duration: dur, delay: delay, easing: easing || EI}); };
  var typeIn = function(t, delay){
    var full = t.textContent; t.textContent = '';
    later(function(){ var i = 0; (function step(){ if (!alive) return; i++; t.textContent = full.slice(0, i); if (i < full.length) later(step, 34); })(); }, delay);
  };
  var intro = function(){
    anim(el.querySelector('.cv-grid'), [{opacity: 0}, {opacity: 1}], {duration: 1400});
    anim(road, [{opacity: 0}, {opacity: 1}], {duration: 900, delay: 300});
    var sil = el.querySelector('.cv-sil');
    draw(sil, 1900, 120);
    anim(sil, [{fillOpacity: 0}, {fillOpacity: 1}], {duration: 900, delay: 1300});
    draw(el.querySelector('.cv-dlo'), 1100, 900);
    all('.cv-det').forEach(function(p, i){ draw(p, 620, 1300 + i * 70); });
    all('.cv-tyre').forEach(function(c, i){ draw(c, 1200, 520 + i * 140); });
    all('.cv-wall').forEach(function(c, i){ anim(c, [{opacity: 0}, {opacity: 1}], {duration: 700, delay: 1100 + i * 140}); });
    rims.forEach(function(r, i){ anim(r, [{opacity: 0, transform: 'rotate(-140deg) scale(.6)'}, {opacity: 1, transform: 'rotate(0deg) scale(1)'}], {duration: 1300, delay: 900 + i * 140}); });
    all('.cv-lt').forEach(function(p, i){ draw(p, 500, 1750 + i * 120); });
    later(function(){ all('.cv-lt').forEach(function(p){ p.classList.add('on'); later(function(){ p.classList.remove('on'); }, 520); }); }, 2350);
    var order = {cc: 1650, fz: 1900, rz: 1950, bt: 1850, li: 2100, cam: 2150, rd: 2200, rcam: 2250};
    Object.keys(order).forEach(function(k){
      var g = chip[k], d = order[k]; if (!g) return;
      draw(g.querySelector('.cv-out'), 640, d);
      if (g.querySelector('.cv-pins')) draw(g.querySelector('.cv-pins'), 600, d + 220);
      anim(g.querySelector('.cv-cbody'), [{opacity: 0}, {opacity: 1}], {duration: 500, delay: d + 260});
      Array.prototype.forEach.call(g.querySelectorAll('.cv-zl,.cv-eye'), function(x){ anim(x, [{opacity: 0}, {opacity: 1}], {duration: 400, delay: d + 420}); });
    });
    var lt = {li: 1850, cam: 1880, 'fz-a': 1800, 'fz-b': 1840, 'rz-a': 1800, 'rz-b': 1840, rd: 2050, rcam: 2080, bt: 1820};
    Object.keys(lt).forEach(function(k){ if (link[k]) draw(link[k], 560, lt[k]); });
    cells.forEach(function(c){
      var dist = Math.hypot(+c.getAttribute('data-c') - 4, (+c.getAttribute('data-r') - 1) * 1.7);
      anim(c, [{opacity: 0, transform: 'scale(.1)'}, {opacity: 1, transform: 'scale(1)'}], {duration: 420, delay: 1950 + dist * 50});
    });
    bcells.forEach(function(c, i){ anim(c, [{transform: 'scaleX(0)', opacity: 0}, {transform: 'scaleX(1)', opacity: 1}], {duration: 360, delay: 2000 + i * 55}); });
    Object.keys(read).forEach(function(k, i){
      var g = read[k], d = 2350 + i * 160;
      anim(g.querySelector('.cv-track'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], {duration: 700, delay: d, easing: EI});
      g.querySelector('.cv-track').style.transformBox = 'fill-box';
      anim(g.querySelector('.cv-lim'), [{opacity: 0}, {opacity: 1}], {duration: 500, delay: d + 200});
      anim(g.querySelector('.cv-nm'), [{opacity: 0, transform: 'translateY(4px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 600, delay: d + 260});
      typeIn(g.querySelector('.cv-iv'), d + 120);
      later(function(){ readRun(k, sample(k), 1100); }, d + 500);
    });
    later(drive, 1500);
    return 3300;
  };
  var begin = function(){
    if (started) return; started = true;
    if (calm) { Object.keys(read).forEach(function(k){ setRead(k, sample(k)); }); drive(); later(loop, 300); return; }
    later(loop, intro());
  };
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible) begin(); }, {threshold: 0.2});
    io.observe(el);
  } else { visible = true; begin(); }
  return {start: function(){ if (!started) { visible = true; begin(); } }, stop: stop};
}

/* ---------- start ---------- */
/* ---------- contact form: links to #contact open the embedded form in a dialog ---------- */
var formEl = null, formBack = null;
function closeForm(){
  if (!formEl) return;
  formEl.remove(); formEl = null;
  document.documentElement.classList.remove('fm-open');
  if (formBack && formBack.focus) formBack.focus();
}
function formCfg(){ return (HL.state.site && HL.state.site.form) || {}; }
function mailtoFor(f, d){
  var lines = ['Interest: ' + d.interest, 'Company: ' + d.company, 'Email: ' + d.email];
  if (d.phone) lines.push('Phone: ' + d.phone);
  if (d.message) lines.push('', d.message);
  return 'mailto:' + (f.to || 'team@biftu.com') + '?subject=' + encodeURIComponent('Website enquiry: ' + d.interest) + '&body=' + encodeURIComponent(lines.join('\n'));
}
var FUID = 0;
function formInner(f, inline){
  var opts = (f.options || []).map(function(o, i){
    var inner = '<span class="fo-t">' + esc(o.t) + (o.href ? ' <span aria-hidden="true">↗</span>' : '') + '</span>' + (o.d ? '<span class="fo-d">' + esc(o.d) + '</span>' : '');
    return o.href ? '<a class="fo" href="' + esc(o.href) + '" target="_blank" rel="noopener">' + inner + '</a>'
                  : '<button type="button" class="fo" data-i="' + i + '">' + inner + '</button>';
  }).join('');
  var u = inline ? '-' + (++FUID) : '';
  return (inline ? '' : '<div class="fm-h"><span class="lab" id="fm-t">' + esc(f.title || 'Request access') + '</span><button type="button" class="fm-x" aria-label="Close">Close</button></div>') +
    '<div class="fm-prog"><span class="lab fm-step">Step 1 of 2</span><i><b></b></i></div>' +
    '<div class="fm-s1"><h2 class="fm-q">I’m interested in…</h2><div class="fm-opts">' + opts + '</div></div>' +
    '<form class="fm-s2" novalidate hidden>' +
      '<div class="fm-pick"><span class="lab">Interested in</span><span class="fm-pv"></span><button type="button" class="fm-back">Change</button></div>' +
      '<label class="fm-f"><span class="lab">Company email *</span><input name="email" type="email" autocomplete="email" required placeholder="you@company.com"></label>' +
      '<label class="fm-f"><span class="lab">Company name *</span><input name="company" type="text" autocomplete="organization" required></label>' +
      '<label class="fm-f"><span class="lab">Phone</span><input name="phone" type="tel" autocomplete="tel"></label>' +
      '<label class="fm-f"><span class="lab">Anything else we should know</span><textarea name="message" rows="4"></textarea></label>' +
      '<input class="fm-hp" name="botcheck" type="checkbox" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div class="fm-act"><button type="submit" class="btn fill fm-send">Send</button><span class="fm-msg" role="status"></span></div>' +
    '</form>' +
    '<div class="fm-done" hidden><h2 class="fm-q">Thank you.</h2><p class="fm-dt"></p></div>' +
    (f.otherEmail ? '<p class="fm-other">' + esc(f.otherT || 'Other questions? Contact') + ' <a href="mailto:' + esc(f.otherEmail) + '">' + esc(f.otherEmail) + '</a></p>' : '');
}
/* work email only: personal mailbox providers are turned away before the form is sent */
var FREE_MAIL = ["gmail.com", "googlemail.com", "ymail.com", "rocketmail.com", "msn.com", "aol.com", "aim.com", "icloud.com", "me.com", "mac.com", "proton.me", "protonmail.com", "protonmail.ch", "pm.me", "web.de", "mail.com", "email.com", "zoho.com", "zohomail.com", "tutanota.com", "tutanota.de", "tuta.io", "tuta.com", "hey.com", "fastmail.com", "fastmail.fm", "qq.com", "163.com", "126.com", "sina.com", "naver.com", "hanmail.net", "daum.net", "seznam.cz", "wp.pl", "o2.pl", "interia.pl", "libero.it", "virgilio.it", "orange.fr", "wanadoo.fr", "free.fr", "laposte.net", "sfr.fr", "t-online.de", "freenet.de", "btinternet.com", "sky.com", "comcast.net", "verizon.net", "att.net", "sbcglobal.net", "cox.net", "inbox.com", "mail.ru", "bk.ru", "list.ru", "rambler.ru", "luukku.com", "suomi24.fi", "kolumbus.fi", "elisanet.fi", "saunalahti.fi", "welho.com", "rediffmail.com", "mailinator.com", "guerrillamail.com", "10minutemail.com", "temp-mail.org", "yopmail.com"];
var FREE_MAIL_RE = /^(yahoo|hotmail|outlook|live|gmx|yandex|windowslive|bigpond)\.[a-z]{2,3}(\.[a-z]{2})?$/;
function workEmail(v){ var m = String(v || '').trim().toLowerCase().match(/@([^@\s]+)$/); if (!m) return true; var d = m[1].replace(/\.+$/, ''); return FREE_MAIL.indexOf(d) < 0 && !FREE_MAIL_RE.test(d); }
HL.workEmail = workEmail;
function bindForm(card, f, root, onClose){
  var s1 = card.querySelector('.fm-s1'), s2 = card.querySelector('.fm-s2'), done = card.querySelector('.fm-done');
  var step = card.querySelector('.fm-step'), bar = card.querySelector('.fm-prog'), msg = card.querySelector('.fm-msg'), send = card.querySelector('.fm-send');
  var chosen = null;
  var emIn = s2.querySelector('input[name=email]'); if (emIn) emIn.addEventListener('input', function(){ emIn.setCustomValidity(''); });
  var show = function(n){
    s1.hidden = n !== 1; s2.hidden = n !== 2; done.hidden = n !== 3;
    var other = card.querySelector('.fm-other'); if (other) other.hidden = n === 3;
    bar.hidden = n === 3; step.textContent = 'Step ' + n + ' of 2'; bar.classList.toggle('two', n === 2);
  };
  (root || card).addEventListener('click', function(e){
    if (onClose && (e.target === root || e.target.closest('.fm-x'))) { onClose(); return; }
    if (HL.editing) { if (e.target.closest('.fo,.fm-back,.fm-send')) e.preventDefault(); return; }
    var o = e.target.closest('button.fo');
    if (o) {
      chosen = (f.options || [])[+o.getAttribute('data-i')];
      card.querySelector('.fm-pv').textContent = chosen.t + (chosen.d ? ': ' + chosen.d : '');
      show(2); var first = s2.querySelector('input[name=email]'); if (first) first.focus();
      return;
    }
    if (e.target.closest('.fm-back')) { show(1); var b1 = s1.querySelector('.fo'); if (b1) b1.focus(); }
  });
  s2.addEventListener('submit', async function(e){
    e.preventDefault();
    if (HL.editing) return;
    var em = s2.querySelector('input[name=email]'), personal = !!(em && em.value.trim() && !workEmail(em.value));
    if (em) em.setCustomValidity(personal ? 'Please use your work email address.' : '');
    msg.textContent = personal ? 'Please use your work email address.' : '';
    if (!s2.reportValidity()) return;
    var fd = new FormData(s2);
    if (fd.get('botcheck')) return;
    var d = {interest: chosen ? chosen.t : '', email: String(fd.get('email') || '').trim(), company: String(fd.get('company') || '').trim(), phone: String(fd.get('phone') || '').trim(), message: String(fd.get('message') || '').trim()};
    var thanks = function(){ card.querySelector('.fm-dt').textContent = 'We have your message and will reply to ' + d.email + '.'; show(3); };
    var fallback = function(why){
      var href = mailtoFor(f, d);
      msg.innerHTML = esc(why) + ' Please email <a href="' + esc(href) + '">' + esc(f.to || 'team@biftu.com') + '</a> instead.';
    };
    if (!f.endpoint) {
      var href = mailtoFor(f, d);
      window.location.href = href;
      card.querySelector('.fm-dt').innerHTML = 'Your email app should open with the message ready to send to ' + esc(f.to || 'team@biftu.com') + '. If it does not, <a href="' + esc(href) + '">open it here</a>.';
      show(3);
      return;
    }
    send.disabled = true; msg.textContent = 'Sending…';
    var body = {subject: 'Website enquiry: ' + d.interest, _subject: 'Website enquiry: ' + d.interest, from_name: d.company, replyto: d.email, page: location.href.split('#')[0]};
    Object.keys(d).forEach(function(k){ body[k] = d[k]; });
    try {
      var r = await fetch(f.endpoint, {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(body)});
      var j = null; try { j = await r.json(); } catch (x) {}
      if (r.status !== 200 || !j || j.ok !== true) throw new Error('status ' + r.status);
      thanks();
    } catch (err) {
      send.disabled = false;
      fallback('Sending failed.');
    }
  });
}
HL.openForm = function(from){
  var f = formCfg();
  closeForm();
  formBack = from || document.activeElement;
  formEl = document.createElement('div');
  formEl.className = 'fmodal';
  formEl.innerHTML = '<div class="fm-card" role="dialog" aria-modal="true" aria-labelledby="fm-t">' + formInner(f, false) + '</div>';
  document.body.appendChild(formEl);
  document.documentElement.classList.add('fm-open');
  var card = formEl.querySelector('.fm-card');
  bindForm(card, f, formEl, closeForm);
  card.querySelector('.fm-x').focus();
};
/* v42: on a page with the form open in a band, Request access scrolls to it; elsewhere it opens the dialog */
HL.toForm = function(from){
  var c = document.querySelector('#app [data-inline-form]');
  if (!c || !c.offsetParent) { HL.openForm(from); return; }
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  c.scrollIntoView({behavior: still ? 'auto' : 'smooth', block: 'center'});
  var t = c.querySelector('.fm-s1:not([hidden]) .fo') || c.querySelector('.fm-s2:not([hidden]) input[name=email]');
  if (t) setTimeout(function(){ try { t.focus({preventScroll: true}); } catch (x) { t.focus(); } }, still ? 0 : 450);
};
/* job application: posts JSON to the forms worker, CV attached as base64 */
var APPLY_ENDPOINT = 'https://biftu-forms.calle-b01.workers.dev/f/job-application';
var CV_MAX = 5 * 1024 * 1024, CL_MAX = 100;
function words(t){ t = String(t || '').trim(); return t ? t.split(/\s+/).length : 0; }
var PLACES = ['Helsinki, Finland', 'Espoo, Finland', 'Tampere, Finland', 'Turku, Finland', 'Oulu, Finland', 'Stockholm, Sweden', 'Gothenburg, Sweden', 'Malmö, Sweden', 'Oslo, Norway', 'Copenhagen, Denmark', 'Tallinn, Estonia', 'Riga, Latvia', 'Vilnius, Lithuania', 'Warsaw, Poland', 'Kraków, Poland', 'Wrocław, Poland', 'Berlin, Germany', 'Munich, Germany', 'Stuttgart, Germany', 'Frankfurt, Germany', 'Hamburg, Germany', 'Ingolstadt, Germany', 'Wolfsburg, Germany', 'Vienna, Austria', 'Graz, Austria', 'Zurich, Switzerland', 'Amsterdam, Netherlands', 'Eindhoven, Netherlands', 'Brussels, Belgium', 'Paris, France', 'Toulouse, France', 'Lyon, France', 'London, United Kingdom', 'Cambridge, United Kingdom', 'Manchester, United Kingdom', 'Dublin, Ireland', 'Madrid, Spain', 'Barcelona, Spain', 'Lisbon, Portugal', 'Porto, Portugal', 'Milan, Italy', 'Turin, Italy', 'Bologna, Italy', 'Prague, Czechia', 'Brno, Czechia', 'Budapest, Hungary', 'Bucharest, Romania', 'Cluj-Napoca, Romania', 'Sofia, Bulgaria', 'Athens, Greece', 'Istanbul, Türkiye', 'Tel Aviv, Israel', 'Dubai, United Arab Emirates', 'Bengaluru, India', 'Pune, India', 'Hyderabad, India', 'Chennai, India', 'Seoul, South Korea', 'Tokyo, Japan', 'Nagoya, Japan', 'Taipei, Taiwan', 'Hsinchu, Taiwan', 'Shanghai, China', 'Shenzhen, China', 'Singapore', 'Sydney, Australia', 'Detroit, United States', 'Ann Arbor, United States', 'San Francisco, United States', 'San Jose, United States', 'Seattle, United States', 'Austin, United States', 'Boston, United States', 'New York, United States', 'Toronto, Canada', 'Waterloo, Canada', 'Montreal, Canada', 'Vancouver, Canada', 'São Paulo, Brazil', 'Mexico City, Mexico', 'Remote'];
function yesNo(name, q, req){
  return '<fieldset class="fm-yn"><legend class="fm-ql">' + esc(q) + (req ? ' *' : '') + '</legend>' +
    '<label><input type="radio" name="' + name + '" value="Yes"' + (req ? ' required' : '') + '> Yes</label><label><input type="radio" name="' + name + '" value="No"> No</label></fieldset>';
}
HL.openApply = function(slug, from){
  var fr = HL.findRole(HL.state, slug); if (!fr) return;
  var x = fr.item, to = (HL.state.site.form && HL.state.site.form.to) || 'team@biftu.com';
  closeForm();
  formBack = from || document.activeElement;
  formEl = document.createElement('div');
  formEl.className = 'fmodal';
  formEl.innerHTML = '<div class="fm-card fm-apply" role="dialog" aria-modal="true" aria-labelledby="ap-t">' +
    '<div class="fm-h"><span class="lab" id="ap-t">Apply · ' + esc(x.h) + '</span><button type="button" class="fm-x" aria-label="Close">Close</button></div>' +
    '<form class="fm-s2 ap-form" novalidate>' +
      '<label class="fm-f"><span class="lab">Name *</span><input name="name" type="text" autocomplete="name" required placeholder="Type here…"></label>' +
      '<label class="fm-f"><span class="lab">Email *</span><input name="email" type="email" autocomplete="email" required placeholder="hello@example.com"></label>' +
      '<label class="fm-f"><span class="lab">Location *</span><input name="location" type="text" list="ap-places" autocomplete="off" required placeholder="Start typing…"></label>' +
      '<datalist id="ap-places">' + PLACES.map(function(c){ return '<option value="' + esc(c) + '">'; }).join('') + '</datalist>' +
      '<label class="fm-f"><span class="lab">LinkedIn profile *</span><input name="linkedin" type="text" inputmode="url" autocomplete="url" required placeholder="linkedin.com/in/…"></label>' +
      '<div class="fm-f"><span class="lab" id="ap-cvl">CV *</span><div class="ap-drop" tabindex="0" role="button" aria-labelledby="ap-cvl"><input class="ap-file" name="cv" type="file" accept=".pdf,.doc,.docx,.odt,.rtf,application/pdf" hidden>' +
        '<span class="ap-up btn">Upload file</span><span class="ap-dz">or drag and drop here · PDF or Word, up to 5 MB</span><span class="ap-fn" hidden></span></div></div>' +
      '<label class="fm-f ap-cl"><span class="lab">Cover letter *</span><span class="ap-q">Why does this role interest you and why are you the best person for it?</span>' +
        '<textarea name="cover_letter" rows="5" required placeholder="Up to ' + CL_MAX + ' words"></textarea><span class="ap-wc" aria-live="polite">0 / ' + CL_MAX + ' words</span></label>' +
      yesNo('authorised', 'Are you legally authorised to work in the country where you are applying?', false) +
      yesNo('sponsorship', 'Will you now or in the future need visa sponsorship for employment (for example an EU Blue Card or H-1B visa)?', true) +
      '<label class="fm-f"><span class="lab">Referred by</span><input name="referred_by" type="text" autocomplete="off" placeholder="Name of the person who sent you this role (optional)"></label>' +
      '<input class="fm-hp" name="botcheck" type="checkbox" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div class="fm-act"><button type="submit" class="btn fill fm-send">Submit application</button><span class="fm-msg" role="status"></span></div>' +
    '</form>' +
    '<div class="fm-done" hidden><h2 class="fm-q">Thank you.</h2><p class="fm-dt"></p></div></div>';
  document.body.appendChild(formEl);
  document.documentElement.classList.add('fm-open');
  var card = formEl.querySelector('.fm-card'), form = card.querySelector('form'), msg = card.querySelector('.fm-msg'), send = card.querySelector('.fm-send');
  var cl = card.querySelector('textarea[name="cover_letter"]'), wc = card.querySelector('.ap-wc');
  var count = function(){
    var n = words(cl.value), over = n > CL_MAX;
    wc.textContent = n + ' / ' + CL_MAX + ' words' + (over ? ' · please shorten' : '');
    wc.classList.toggle('over', over);
    cl.setCustomValidity(over ? 'Please keep this to ' + CL_MAX + ' words or fewer.' : '');
  };
  cl.addEventListener('input', count);
  var drop = card.querySelector('.ap-drop'), file = card.querySelector('.ap-file'), fn = card.querySelector('.ap-fn'), dz = card.querySelector('.ap-dz'), cv = null;
  var pick = function(f){
    if (!f) return;
    if (f.size > CV_MAX) { cv = null; fn.hidden = true; dz.hidden = false; msg.textContent = 'That file is larger than 5 MB. Please upload a smaller PDF.'; return; }
    cv = f; msg.textContent = ''; fn.textContent = f.name + ' · ' + Math.max(1, Math.round(f.size / 1024)) + ' KB'; fn.hidden = false; dz.hidden = true; drop.classList.remove('bad');
  };
  formEl.addEventListener('click', function(e){ if (e.target === formEl || e.target.closest('.fm-x')) closeForm(); });
  drop.addEventListener('click', function(){ file.click(); });
  drop.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); } });
  file.addEventListener('change', function(){ pick(file.files && file.files[0]); });
  ['dragenter', 'dragover'].forEach(function(t){ drop.addEventListener(t, function(e){ e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function(t){ drop.addEventListener(t, function(e){ e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function(e){ pick(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]); });
  var read64 = function(f){ return new Promise(function(ok, bad){ var r = new FileReader(); r.onload = function(){ ok(String(r.result).split(',')[1] || ''); }; r.onerror = bad; r.readAsDataURL(f); }); };
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    count();
    var valid = form.reportValidity();
    if (!cv) { drop.classList.add('bad'); if (valid) { msg.textContent = 'Please add your CV.'; drop.focus(); } return; }
    if (!valid) return;
    var fd = new FormData(form);
    if (fd.get('botcheck')) return;
    var v = function(k){ return String(fd.get(k) || '').trim(); };
    var d = {name: v('name'), email: v('email'), location: v('location'), linkedin: v('linkedin'), authorised: v('authorised'), sponsorship: v('sponsorship'), cover: v('cover_letter'), ref: v('referred_by')};
    var subj = 'Application: ' + x.h;
    var lines = ['Role: ' + x.h, 'Name: ' + d.name, 'Email: ' + d.email, 'Location: ' + d.location, 'LinkedIn: ' + d.linkedin,
      'Authorised to work where applying: ' + (d.authorised || 'not answered'), 'Needs visa sponsorship: ' + d.sponsorship, 'Referred by: ' + (d.ref || 'not given'), 'CV: ' + cv.name + ' (' + Math.round(cv.size / 1024) + ' KB, attached as resume_base64)',
      '', 'Why does this role interest you and why are you the best person for it?', d.cover];
    var fallback = function(){
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(lines.join('\n') + '\n\nPlease attach your CV to this email.');
      msg.innerHTML = 'Sending failed. Please email <a href="' + esc(href) + '">' + esc(to) + '</a> instead.';
    };
    send.disabled = true; msg.textContent = 'Sending…';
    try {
      var b64 = await read64(cv);
      var page = location.href.split('#')[0];
      var body = {subject: subj, _subject: subj, from_name: d.name, replyto: d.email, page: page, interest: subj, email: d.email, company: '', phone: '', message: lines.join('\n'),
        role: x.h, role_url: page + '#careers.' + x.slug, name: d.name, location: d.location, linkedin: d.linkedin, work_authorised: d.authorised, visa_sponsorship: d.sponsorship, cover_letter: d.cover, referred_by: d.ref,
        resume_filename: cv.name, resume_type: cv.type || 'application/octet-stream', resume_base64: b64};
      var r = await fetch(APPLY_ENDPOINT, {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(body)});
      var j = null; try { j = await r.json(); } catch (x2) {}
      if (r.status !== 200 || !j || j.ok !== true) throw new Error('status ' + r.status);
      card.querySelector('.fm-dt').textContent = 'We have your application for ' + x.h + ' and will reply to ' + d.email + '.';
      form.hidden = true; card.querySelector('.fm-done').hidden = false;
    } catch (err) {
      send.disabled = false;
      fallback();
    }
  });
  card.querySelector('.fm-x').focus();
};
document.addEventListener('click', function(e){
  if (HL.editing) return;
  var b = e.target.closest && e.target.closest('[data-apply]');
  if (b) { e.preventDefault(); HL.openApply(b.getAttribute('data-apply'), b); }
});
document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && formEl) closeForm(); });
document.addEventListener('click', function(e){
  if (HL.editing) return;
  var c = e.target.closest && e.target.closest('[data-copy]'), n = e.target.closest && e.target.closest('[data-share]');
  if (n) { navigator.share({title: n.getAttribute('data-share-t'), url: n.getAttribute('data-share')}).catch(function(){}); return; }
  if (!c) return;
  var u = c.getAttribute('data-copy'), done = function(t){ c.textContent = t; clearTimeout(c._t); c._t = setTimeout(function(){ c.textContent = 'Copy link'; }, 1800); };
  var old = function(){
    var ta = document.createElement('textarea'); ta.value = u; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (x) {}
    ta.remove(); done(ok ? 'Copied' : 'Copy failed');
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(function(){ done('Copied'); }, old); else old();
});
document.addEventListener('click', function(e){
  if (HL.editing) return;
  var a = e.target.closest && e.target.closest('a[href="#contact"]');
  if (!a) return;
  e.preventDefault();
  HL.toForm(a);
});

document.addEventListener('click', function(e){
  if (HL.editing || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  var a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a) return;
  var h = a.getAttribute('href');
  if (!h || h === '#' || h === '#contact' || a.hasAttribute('data-top')) return;
  e.preventDefault();
  if (location.hash !== h) {
    location.hash = h;
  } else {
    go(h, true);
  }
});

/* v37: biftu.com serves this page for every path, so /careers/<slug> (the shared role link), /blog/<slug> and /<page> open the right view */
function fromPath(st){
  if (!/^https?:$/.test(location.protocol) || location.hash) return;
  var seg = location.pathname.replace(/\.html$/, '').replace(/^\/+|\/+$/g, '').split('/');
  if (!seg[0] || seg[0] === 'index') return;
  var h = null;
  if (seg.length === 2 && seg[0] === 'careers' && HL.findRole(st, seg[1])) h = '#careers.' + seg[1];
  else if (seg.length === 2 && seg[0] === 'blog' && HL.findPost(st, seg[1])) h = '#blog.' + seg[1];
  else if (seg.length === 1 && st.pages[seg[0]]) h = '#' + seg[0];
  if (h) try { history.replaceState(null, '', '/' + h); } catch (e) {}
}
HL.start = function(){
  if (!HL.state) return;
  fromPath(HL.state);
  HL.render();
  if (location.hash === '#contact') setTimeout(function(){ HL.toForm(); }, 300);
  window.addEventListener('hashchange', function(){ if (location.hash === '#contact') { if (!HL.editing) HL.toForm(); return; } go(location.hash, true); });
  go(location.hash, false);
};
if (!HL.deferStart) HL.start();
})();
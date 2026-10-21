/* ============================================================
 * 《if 人生 · BUG 纪念碑》全部页面逻辑
 * 数据一律从 window.STORY_DATA 读取
 * ============================================================ */
(function () {
  'use strict';

  var D = window.STORY_DATA;
  var ATTR_KEYS = D.attrs.keys;
  var ATTR_NAMES = D.attrs.names;
  var META_KEY = 'ifbug_meta_v2';
  var SAVE_KEY = 'ifbug_save_v2';

  /* ================= 存储 ================= */
  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 忽略 */ }
  }
  function loadMeta() {
    var m = loadJSON(META_KEY, null);
    if (!m || typeof m !== 'object') m = null;
    return m || { achievements: [], collection: {}, endings: [] };
  }
  function saveMeta() { saveJSON(META_KEY, meta); }
  function loadSave() { return loadJSON(SAVE_KEY, null); }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* 忽略 */ } }

  var meta = loadMeta();

  /* ================= 运行状态 ================= */
  function freshState() {
    return {
      idx: 0,
      attrs: { tech: D.attrs.init, guts: D.attrs.init, wealth: D.attrs.init, mindset: D.attrs.init },
      choices: {},          // { 2:'A', 3:'B', ... , 9:'A' }
      streak: { style: null, count: 0 },
      flags: {},            // redPill / gravekeeper
      hiddenId: null,
      events: [],           // 本局抽中的两个随机事件
      endingId: null
    };
  }
  var state = freshState();

  /* 主流程：节点1-3 → 事件 → 节点4-6 → 事件 → 节点7-8 → 隐藏检查点 → 节点9 */
  var FLOW = [
    { t: 'node', id: 1 }, { t: 'node', id: 2 }, { t: 'node', id: 3 },
    { t: 'event', slot: 0 },
    { t: 'node', id: 4 }, { t: 'node', id: 5 }, { t: 'node', id: 6 },
    { t: 'event', slot: 1 },
    { t: 'node', id: 7 }, { t: 'node', id: 8 },
    { t: 'hidden' },
    { t: 'node', id: 9 }
  ];

  /* ================= DOM 工具 ================= */
  var app = document.getElementById('app');
  var attrPanel = document.getElementById('attr-panel');
  var toastEl = document.getElementById('toast');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function clearApp() { app.innerHTML = ''; window.scrollTo(0, 0); }
  function showAttrPanel(show) { attrPanel.classList.toggle('hidden', !show); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function showToast(text) {
    toastEl.textContent = text;
    toastEl.classList.remove('hidden');
    toastEl.style.animation = 'none';
    void toastEl.offsetWidth; /* 重启动画 */
    toastEl.style.animation = '';
    setTimeout(function () { toastEl.classList.add('hidden'); }, 2600);
  }

  /* ================= 打字机（点击跳过） ================= */
  var activeTypers = [];
  function skipAllTypers() {
    activeTypers.slice().forEach(function (t) { t.skip(); });
  }
  function typeLines(container, lines, opts) {
    opts = opts || {};
    var speed = opts.speed || 36;
    var cls = opts.cls || '';
    container.innerHTML = '';
    return new Promise(function (resolve) {
      var ps = lines.map(function () {
        var p = el('p', cls || null);
        container.appendChild(p);
        return p;
      });
      var li = 0, ci = 0, finished = false;
      var typer = {
        skip: function () { finishAll(); }
      };
      activeTypers.push(typer);
      function finishAll() {
        if (finished) return;
        finished = true;
        ps.forEach(function (p, i) {
          p.textContent = lines[i];
          p.classList.remove('type-caret');
        });
        var idx = activeTypers.indexOf(typer);
        if (idx >= 0) activeTypers.splice(idx, 1);
        resolve();
      }
      function step() {
        if (finished) return;
        if (li >= lines.length) { finishAll(); return; }
        var p = ps[li];
        if (!p.isConnected) { /* 页面已切换，静默结束 */
          finished = true;
          var i2 = activeTypers.indexOf(typer);
          if (i2 >= 0) activeTypers.splice(i2, 1);
          resolve();
          return;
        }
        var line = lines[li];
        ci++;
        p.textContent = line.slice(0, ci);
        p.classList.add('type-caret');
        if (ci >= line.length) {
          p.classList.remove('type-caret');
          li++; ci = 0;
          setTimeout(step, speed * 7);
        } else {
          setTimeout(step, speed);
        }
      }
      step();
    });
  }
  /* 点击文字区域跳过打字 */
  app.addEventListener('click', function (e) {
    if (e.target.closest('.narrative') || e.target.closest('.skip-hint')) skipAllTypers();
  });

  /* ================= 属性面板 ================= */
  function renderAttrPanel() {
    attrPanel.innerHTML = '';
    attrPanel.appendChild(el('div', 'attr-title', 'ATTRS'));
    ATTR_KEYS.forEach(function (k) {
      var row = el('div', 'attr-row');
      row.appendChild(el('span', 'attr-name', ATTR_NAMES[k]));
      var val = el('span', 'attr-val', String(state.attrs[k]));
      val.id = 'attr-val-' + k;
      row.appendChild(val);
      var delta = el('span', 'attr-delta');
      delta.id = 'attr-delta-' + k;
      row.appendChild(delta);
      attrPanel.appendChild(row);
    });
  }
  function clampAttr(v) { return Math.max(D.attrs.min, Math.min(D.attrs.max, v)); }

  /* 应用属性变化 + 数值滚动动画 */
  function applyEffects(effects) {
    if (!effects) return;
    ATTR_KEYS.forEach(function (k) {
      var d = effects[k] || 0;
      if (!d) return;
      var oldV = state.attrs[k];
      var newV = clampAttr(oldV + d);
      state.attrs[k] = newV;
      animateAttrValue(k, oldV, newV, d);
    });
  }
  function animateAttrValue(key, from, to, delta) {
    var valEl = document.getElementById('attr-val-' + key);
    var deltaEl = document.getElementById('attr-delta-' + key);
    if (deltaEl) {
      deltaEl.textContent = (delta > 0 ? '+' : '') + delta;
      deltaEl.className = 'attr-delta show ' + (delta > 0 ? 'up' : 'down');
    }
    if (!valEl) return;
    var start = null, dur = 550;
    function tick(ts) {
      if (!valEl.isConnected) return;
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      valEl.textContent = String(Math.round(from + (to - from) * p));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function effectPreviewText(effects) {
    var parts = [];
    ATTR_KEYS.forEach(function (k) {
      var v = effects[k];
      if (!v) return;
      parts.push({ name: ATTR_NAMES[k], v: v });
    });
    return parts;
  }

  /* ================= 成就 ================= */
  function unlockAchievement(id) {
    if (meta.achievements.indexOf(id) >= 0) return;
    var ach = null;
    D.achievements.forEach(function (a) { if (a.id === id) ach = a; });
    if (!ach) return;
    meta.achievements.push(id);
    saveMeta();
    showToast('解锁成就：' + ach.name);
  }
  function checkStatAchievements() {
    D.achievements.forEach(function (a) {
      if (a.cond.type === 'collection' && Object.keys(meta.collection).length >= a.cond.count) unlockAchievement(a.id);
      if (a.cond.type === 'endings' && meta.endings.length >= a.cond.count) unlockAchievement(a.id);
    });
  }

  /* ================= 图鉴 ================= */
  /* 生成 27 块碑的清单（节点 2-8 × 3 + 隐藏节点 × 2），编号 001-027 */
  var STONE_LIST = [];
  (function buildStoneList() {
    var no = 1;
    D.nodes.forEach(function (node) {
      if (!node.choices || node.final) return;
      node.choices.forEach(function (c) {
        STONE_LIST.push({
          no: no++, id: 'n' + node.id + c.key,
          name: c.stone.name, epitaph: c.stone.epitaph,
          from: node.title
        });
      });
    });
    ['H1', 'H2', 'H3'].forEach(function (hid) {
      var h = D.hidden[hid];
      h.choices.forEach(function (c) {
        STONE_LIST.push({
          no: no++, id: hid.toLowerCase() + c.key,
          name: c.stone.name, epitaph: c.stone.epitaph,
          from: h.title
        });
      });
    });
  })();
  function stoneNoOf(id) {
    for (var i = 0; i < STONE_LIST.length; i++) if (STONE_LIST[i].id === id) return STONE_LIST[i].no;
    return 0;
  }
  function collectStone(id) {
    if (meta.collection[id]) return;
    meta.collection[id] = true;
    saveMeta();
    checkStatAchievements();
  }

  /* ================= 墓碑 DOM ================= */
  function makeTombstone(opts) {
    var stone = el('div', 'tombstone' + (opts.size ? ' ' + opts.size : '') + (opts.glow ? ' glow' : '') + (opts.locked ? ' locked' : ''));
    stone.appendChild(el('span', 'stone-no', opts.no));
    stone.appendChild(el('span', 'stone-name', opts.name));
    if (opts.tip) {
      var tip = el('div', 'stone-tip');
      tip.innerHTML = esc(opts.tip).replace(/\n/g, '<br>');
      stone.appendChild(tip);
    }
    return stone;
  }

  /* ================= 开场屏 ================= */
  function renderOpening() {
    clearApp();
    showAttrPanel(false);
    var save = loadSave();
    var screen = el('div', 'screen');
    screen.id = 'screen-opening';

    var title = el('div', 'node-title', D.opening.title);
    screen.appendChild(title);

    var nar = el('div', 'narrative');
    screen.appendChild(nar);

    var cem = el('div', 'opening-cemetery hidden');
    screen.appendChild(cem);

    var btnRow = el('div', 'btn-row hidden');
    screen.appendChild(btnRow);

    app.appendChild(screen);

    var lines = save ? [D.opening.savedText] : D.opening.lines;
    typeLines(nar, lines).then(function () {
      cem.classList.remove('hidden');
      /* 墓园背景小碑 */
      var deco = [
        { no: 'No. 404', name: '404 之魂' },
        { no: 'No. 207', name: '野指针' },
        { no: 'No. 013', name: '死于拼写的变量名' }
      ];
      deco.forEach(function (dt) {
        cem.appendChild(makeTombstone({ no: dt.no, name: dt.name, size: 'small' }));
      });
      /* 中央碑 */
      var center = makeTombstone({
        no: save ? '第 1024 号碑' : '空碑',
        name: D.opening.savedStoneText,
        size: 'large', glow: true
      });
      center.classList.add('big-stone');
      cem.insertBefore(center, cem.children[1]);

      btnRow.classList.remove('hidden');
      if (save) {
        var bMonu = el('button', 'btn', '前往纪念碑');
        bMonu.addEventListener('click', function () { renderMonumentFromSave(save); });
        var bNew = el('button', 'btn ghost', '重新开始');
        bNew.addEventListener('click', function () {
          clearSave();
          startRun();
        });
        btnRow.appendChild(bMonu);
        btnRow.appendChild(bNew);
      } else {
        var bEnter = el('button', 'btn', D.opening.enterText);
        bEnter.addEventListener('click', startRun);
        btnRow.appendChild(bEnter);
        center.addEventListener('click', startRun);
      }
    });
  }

  /* ================= 开启一局 ================= */
  function startRun() {
    state = freshState();
    /* 抽两个不重复的随机事件 */
    var pool = D.events.slice();
    for (var i = 0; i < 2; i++) {
      var idx = Math.floor(Math.random() * pool.length);
      state.events.push(pool.splice(idx, 1)[0]);
    }
    renderAttrPanel();
    showAttrPanel(true);
    state.idx = 0;
    renderCurrent();
  }

  function advance() {
    state.idx++;
    if (state.idx >= FLOW.length) return;
    renderCurrent();
  }

  function renderCurrent() {
    var step = FLOW[state.idx];
    if (step.t === 'node') {
      var node = null;
      D.nodes.forEach(function (n) { if (n.id === step.id) node = n; });
      renderNode(node);
    } else if (step.t === 'event') {
      renderEvent(state.events[step.slot]);
    } else if (step.t === 'hidden') {
      var hid = checkHiddenTrigger();
      if (hid) {
        state.hiddenId = hid;
        unlockAchievement('zhenxiang');
        if (hid === 'H1') unlockAchievement('maoxian');
        if (hid === 'H2') unlockAchievement('wenru');
        renderHiddenNode(D.hidden[hid]);
      } else {
        advance();
      }
    }
  }

  function checkHiddenTrigger() {
    if (state.streak.style === '冒险' && state.streak.count >= 3) return 'H1';
    if (state.streak.style === '稳健' && state.streak.count >= 3) return 'H2';
    if (state.attrs.wealth >= 7 && state.attrs.guts >= 7) return 'H3';
    return null;
  }

  /* ================= 节点屏 ================= */
  function renderNode(node) {
    clearApp();
    var screen = el('div', 'screen');
    screen.appendChild(el('div', 'node-title', node.title));
    var nar = el('div', 'narrative');
    screen.appendChild(nar);
    var choiceBox = el('div', 'choices hidden');
    screen.appendChild(choiceBox);
    var hint = el('div', 'skip-hint', '（点击文字可跳过打字）');
    screen.appendChild(hint);
    app.appendChild(screen);

    typeLines(nar, node.scene).then(function () {
      hint.classList.add('hidden');
      if (node.narrative) {
        /* 纯叙事节点：继续按钮 */
        choiceBox.classList.remove('hidden');
        var btn = el('button', 'btn', '继续');
        btn.style.margin = '0 auto';
        btn.style.display = 'block';
        btn.addEventListener('click', advance);
        choiceBox.appendChild(btn);
        return;
      }
      renderChoices(choiceBox, node.choices, function (choice) {
        onNodeChosen(node, choice);
      });
      choiceBox.classList.remove('hidden');
    });
  }

  function styleTagEl(style) {
    var cls = style === '冒险' ? 'risk' : (style === '稳健' ? 'safe' : 'neutral');
    return el('span', 'style-tag ' + cls, '[' + style + ']');
  }

  function renderChoices(box, choices, onPick) {
    box.innerHTML = '';
    choices.forEach(function (c) {
      var card = el('button', 'choice-card');
      var head = el('div', 'choice-head');
      head.appendChild(el('span', 'choice-key', c.key));
      head.appendChild(el('span', 'choice-label', c.label));
      if (c.style) head.appendChild(styleTagEl(c.style));
      card.appendChild(head);
      /* 属性变化预览 */
      if (c.effectPreview) {
        card.appendChild(el('div', 'choice-effects', c.effectPreview));
      } else if (c.effects) {
        var fx = el('div', 'choice-effects');
        effectPreviewText(c.effects).forEach(function (p, i) {
          if (i > 0) fx.appendChild(document.createTextNode(' · '));
          var s = el('span', p.v > 0 ? 'fx-up' : 'fx-down',
            p.name + ' ' + (p.v > 0 ? '+' : '') + p.v);
          fx.appendChild(s);
        });
        card.appendChild(fx);
      }
      card.addEventListener('click', function () { onPick(c); });
      box.appendChild(card);
    });
  }

  /* ================= 选择处理 ================= */
  function onNodeChosen(node, choice) {
    state.choices[node.id] = choice.key;
    /* 风格连击统计 */
    if (choice.style) {
      if (state.streak.style === choice.style) state.streak.count++;
      else { state.streak.style = choice.style; state.streak.count = 1; }
    }
    /* 属性（含 H3 随机） */
    if (choice.effectsRandom) {
      var pick = choice.effectsRandom[Math.floor(Math.random() * choice.effectsRandom.length)];
      applyEffects(pick);
    } else {
      applyEffects(choice.effects);
    }
    /* 成就 */
    if (choice.achievement) unlockAchievement(choice.achievement);
    /* 图鉴（节点 9 的碑即个人纪念碑，不入 27 图鉴） */
    if (!node.final && choice.stone) {
      collectStone('n' + node.id + choice.key);
    }

    if (node.final) {
      onFinalChoice(node, choice);
      return;
    }
    renderChoiceResult({
      title: node.title,
      choiceLabel: '你选择了 ' + choice.key + ' · ' + choice.label,
      reality: choice.reality,
      parallelCond: choice.parallelCond,
      parallel: choice.parallel,
      stone: choice.stone,
      stoneId: 'n' + node.id + choice.key
    }, advance);
  }

  /* ================= 结局屏（现实 → 平行 → 刻字） ================= */
  function renderChoiceResult(opts, onDone) {
    clearApp();
    var screen = el('div', 'screen fade-block');
    screen.appendChild(el('div', 'node-title', opts.title));

    var summary = el('div', 'narrative');
    var sp = el('p', 'dim', opts.choiceLabel + (opts.styleText || ''));
    summary.appendChild(sp);
    screen.appendChild(summary);

    screen.appendChild(el('div', 'section-label', '现实结局'));
    var realityBox = el('div', 'narrative');
    screen.appendChild(realityBox);

    var parLabel = el('div', 'section-label gray hidden', '平行结局（' + (opts.parallelCond || '') + '）');
    var parBox = el('div', 'narrative hidden');
    screen.appendChild(parLabel);
    screen.appendChild(parBox);

    var engLabel = el('div', 'section-label hidden', '墓碑刻字');
    var engWrap = el('div', 'engrave-wrap hidden');
    var stoneNo = opts.stoneId ? 'No. ' + String(stoneNoOf(opts.stoneId)).padStart(3, '0') : 'No. ???';
    engWrap.appendChild(makeTombstone({ no: stoneNo, name: '', glow: true }));
    var engText = el('div', 'narrative engrave-text');
    engWrap.appendChild(engText);
    screen.appendChild(engLabel);
    screen.appendChild(engWrap);

    var btnRow = el('div', 'btn-row hidden');
    var nextBtn = el('button', 'btn', '继续');
    nextBtn.addEventListener('click', onDone);
    btnRow.appendChild(nextBtn);
    screen.appendChild(btnRow);

    var hint = el('div', 'skip-hint', '（点击文字可跳过打字）');
    screen.appendChild(hint);
    app.appendChild(screen);

    var chain = typeLines(realityBox, opts.reality);
    if (opts.parallel && opts.parallel.length) {
      chain = chain.then(function () {
        parLabel.classList.remove('hidden');
        parBox.classList.remove('hidden');
        return typeLines(parBox, opts.parallel, { cls: 'dim' });
      });
    }
    chain.then(function () {
      engLabel.classList.remove('hidden');
      engWrap.classList.remove('hidden');
      return typeLines(engText, [opts.stone.name, opts.stone.epitaph], { speed: 55 });
    }).then(function () {
      hint.classList.add('hidden');
      btnRow.classList.remove('hidden');
    });
  }

  /* ================= 随机事件屏 ================= */
  function renderEvent(ev) {
    clearApp();
    var screen = el('div', 'screen');
    screen.appendChild(el('div', 'node-title', '墓园夜话'));
    var card = el('div', 'event-card');
    card.appendChild(el('div', 'event-tag', '随机事件'));
    card.appendChild(el('div', 'event-text', ev.text));
    if (ev.note) card.appendChild(el('div', 'event-note', ev.note));
    var fx = el('div', 'event-effects');
    effectPreviewText(ev.effects).forEach(function (p, i) {
      if (i > 0) fx.appendChild(document.createTextNode(' · '));
      fx.appendChild(el('span', p.v > 0 ? 'fx-up' : 'fx-down',
        p.name + ' ' + (p.v > 0 ? '+' : '') + p.v));
    });
    card.appendChild(fx);
    screen.appendChild(card);
    var btnRow = el('div', 'btn-row');
    var btn = el('button', 'btn', '继续');
    btn.addEventListener('click', function () {
      applyEffects(ev.effects);
      advance();
    });
    btnRow.appendChild(btn);
    screen.appendChild(btnRow);
    app.appendChild(screen);
  }

  /* ================= 隐藏节点屏 ================= */
  function renderHiddenNode(h) {
    clearApp();
    var screen = el('div', 'screen');
    screen.appendChild(el('div', 'node-title', h.title));
    var nar = el('div', 'narrative');
    screen.appendChild(nar);
    var choiceBox = el('div', 'choices hidden');
    screen.appendChild(choiceBox);
    var hint = el('div', 'skip-hint', '（点击文字可跳过打字）');
    screen.appendChild(hint);
    app.appendChild(screen);

    typeLines(nar, h.scene).then(function () {
      hint.classList.add('hidden');
      renderChoices(choiceBox, h.choices, function (choice) {
        onHiddenChosen(h, choice);
      });
      choiceBox.classList.remove('hidden');
    });
  }

  function onHiddenChosen(h, choice) {
    if (choice.flag) state.flags[choice.flag] = true;
    applyEffects(choice.effects);
    collectStone(h.id.toLowerCase() + choice.key);
    renderChoiceResult({
      title: h.title,
      choiceLabel: '你选择了 ' + choice.key + ' · ' + choice.label,
      reality: choice.ending,
      parallel: null,
      stone: choice.stone,
      stoneId: h.id.toLowerCase() + choice.key
    }, advance);
  }

  /* ================= 终局判定 ================= */
  function judgeEnding() {
    var a = state.attrs;
    if (state.flags.redPill) return 'E7';
    if (state.flags.gravekeeper) return 'E6';
    if (a.tech >= 8 && a.guts >= 7) return 'E1';
    if (a.tech >= 8) return 'E8';
    if (a.wealth >= 8 && a.mindset >= 7) return 'E2';
    if (a.mindset <= 3 && a.guts >= 6) return 'E4';
    if (a.mindset <= 4 && a.wealth >= 4) return 'E5';
    return 'E3';
  }

  function onFinalChoice(node, choice) {
    var endingId = choice.key === 'B' ? 'E9' : judgeEnding();
    state.endingId = endingId;
    if (meta.endings.indexOf(endingId) < 0) {
      meta.endings.push(endingId);
      saveMeta();
    }
    unlockAchievement('jianzheng');
    checkStatAchievements();
    renderFinalEnding(D.endings[endingId]);
  }

  /* ================= 终局屏 ================= */
  function renderFinalEnding(ending) {
    clearApp();
    var screen = el('div', 'screen');
    screen.id = 'screen-finalending';
    screen.appendChild(el('div', 'node-title', '终局'));

    /* E8 专属：1024 块碑依次亮起 */
    var e8canvas = null;
    if (ending.id === 'E8') {
      var holder = el('div', 'e8-grid-wrap');
      e8canvas = el('canvas');
      e8canvas.id = 'e8-canvas';
      e8canvas.width = 480; e8canvas.height = 300;
      holder.appendChild(e8canvas);
      screen.appendChild(holder);
    }

    var nameEl = el('div', 'ending-name', ending.id + ' ' + ending.name);
    screen.appendChild(nameEl);

    var linesBox = el('div', 'narrative ending-lines');
    screen.appendChild(linesBox);

    var engWrap = el('div', 'engrave-wrap hidden');
    engWrap.appendChild(makeTombstone({ no: '第 1024 号碑', name: '', glow: true, size: 'large' }));
    var engText = el('div', 'narrative engrave-text');
    engWrap.appendChild(engText);
    screen.appendChild(engWrap);

    var btnRow = el('div', 'btn-row hidden');
    var btn = el('button', 'btn', '前往我的纪念碑');
    btn.addEventListener('click', function () {
      var monu = buildMonument();
      saveJSON(SAVE_KEY, monu);
      renderMonument(monu);
    });
    btnRow.appendChild(btn);
    screen.appendChild(btnRow);
    var hint = el('div', 'skip-hint', '（点击文字可跳过打字）');
    screen.appendChild(hint);
    app.appendChild(screen);

    var pre = Promise.resolve();
    if (e8canvas) pre = playE8Grid(e8canvas);
    if (ending.id === 'E1' || ending.id === 'E2' || ending.id === 'E8') {
      setTimeout(function () { launchFireworks(3200); }, 400);
    }
    pre.then(function () {
      return typeLines(linesBox, ending.lines, { speed: 42 });
    }).then(function () {
      engWrap.classList.remove('hidden');
      return typeLines(engText, ['碑文：' + ending.epitaph], { speed: 55 });
    }).then(function () {
      hint.classList.add('hidden');
      btnRow.classList.remove('hidden');
    });
  }

  /* E8：1024 个光点依次亮起（32×32） */
  function playE8Grid(canvas) {
    return new Promise(function (resolve) {
      var ctx = canvas.getContext('2d');
      var COLS = 32, ROWS = 32;
      var cw = canvas.width / COLS, ch = canvas.height / ROWS;
      ctx.fillStyle = '#0b1026';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      var total = COLS * ROWS, lit = 0, batch = 14;
      function step() {
        for (var i = 0; i < batch && lit < total; i++, lit++) {
          var x = lit % COLS, y = Math.floor(lit / COLS);
          ctx.fillStyle = 'rgba(126,231,135,0.9)';
          ctx.shadowColor = '#7ee787';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(x * cw + cw / 2, y * ch + ch / 2, Math.min(cw, ch) * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }
        if (lit < total) requestAnimationFrame(step);
        else resolve();
      }
      step();
    });
  }

  /* ================= 个人纪念碑 ================= */
  function pickTag(attrs, flags) {
    for (var i = 0; i < D.tags.length; i++) {
      var c = D.tags[i].cond;
      if (c.flag) { if (flags[c.flag]) return D.tags[i].name; continue; }
      if (c.mindsetMax !== undefined) { if (attrs.mindset <= c.mindsetMax) return D.tags[i].name; continue; }
      var keys = Object.keys(c);
      if (keys.length === 0) return D.tags[i].name;
      var ok = keys.every(function (k) { return attrs[k] >= c[k]; });
      if (ok) return D.tags[i].name;
    }
    return D.tags[D.tags.length - 1].name;
  }

  function buildEpitaphText(choices, endingName) {
    var pm = D.phraseMap;
    function p(node, key, field) {
      return (pm[node] && pm[node][key]) ? pm[node][key][field] : '';
    }
    return D.monumentTemplate
      .replace('{n2s}', p(2, choices[2], 'short')).replace('{n2e}', p(2, choices[2], 'end'))
      .replace('{n3s}', p(3, choices[3], 'short')).replace('{n3e}', p(3, choices[3], 'end'))
      .replace('{n4s}', p(4, choices[4], 'short')).replace('{n4e}', p(4, choices[4], 'end'))
      .replace('{n5s}', p(5, choices[5], 'short')).replace('{n5e}', p(5, choices[5], 'end'))
      .replace('{n6s}', p(6, choices[6], 'short')).replace('{n6e}', p(6, choices[6], 'end'))
      .replace('{n9s}', p(9, choices[9], 'short'))
      .replace('{endingName}', endingName);
  }

  function buildMonument() {
    var ending = D.endings[state.endingId];
    return {
      endingId: state.endingId,
      endingName: ending.name,
      epitaph: buildEpitaphText(state.choices, ending.name),
      tag: pickTag(state.attrs, state.flags),
      attrs: {
        tech: state.attrs.tech, guts: state.attrs.guts,
        wealth: state.attrs.wealth, mindset: state.attrs.mindset
      }
    };
  }

  function renderMonumentFromSave(save) {
    showAttrPanel(false);
    renderMonument(save);
  }

  function renderMonument(monu) {
    clearApp();
    var screen = el('div', 'screen monument-wrap');
    screen.appendChild(el('div', 'node-title', '个人纪念碑'));

    var zone = el('div', 'monument-stone-zone');
    var big = makeTombstone({
      no: '第 1024 号碑', name: monu.endingId + ' ' + monu.endingName,
      size: 'large', glow: true
    });
    zone.appendChild(big);
    screen.appendChild(zone);

    screen.appendChild(el('div', 'player-tag', monu.tag));

    var epi = el('div', 'monument-epitaph');
    screen.appendChild(epi);

    var attrsBox = el('div', 'monument-attrs');
    ATTR_KEYS.forEach(function (k) {
      var cell = el('div', 'm-attr');
      cell.appendChild(el('div', 'k', ATTR_NAMES[k]));
      cell.appendChild(el('div', 'v', String(monu.attrs[k])));
      attrsBox.appendChild(cell);
    });
    screen.appendChild(attrsBox);

    var stats = el('div', 'monument-stats',
      '成就 ' + meta.achievements.length + ' / ' + D.achievements.length +
      ' · 图鉴 ' + Object.keys(meta.collection).length + ' / ' + D.collection.total +
      ' · 已达成结局 ' + meta.endings.length + ' / 9');
    screen.appendChild(stats);

    var btnRow = el('div', 'btn-row');
    var bShare = el('button', 'btn', '生成分享卡片');
    bShare.addEventListener('click', function () { renderShare(monu); });
    var bCol = el('button', 'btn ghost', '墓碑图鉴');
    bCol.addEventListener('click', function () { renderCollection(monu); });
    var bAch = el('button', 'btn ghost', '成就');
    bAch.addEventListener('click', function () { renderAchievements(monu); });
    var bRe = el('button', 'btn ghost', '重新选择');
    bRe.addEventListener('click', function () {
      clearSave();
      renderOpening();
    });
    btnRow.appendChild(bShare);
    btnRow.appendChild(bCol);
    btnRow.appendChild(bAch);
    btnRow.appendChild(bRe);
    screen.appendChild(btnRow);

    app.appendChild(screen);
    typeLines(epi, [monu.epitaph], { speed: 30 });
  }

  /* ================= 图鉴页 ================= */
  function renderCollection(backData) {
    clearApp();
    var screen = el('div', 'screen');
    var head = el('div', 'page-head');
    head.appendChild(el('div', 'page-title', '墓碑图鉴'));
    var back = el('button', 'btn ghost', '返回');
    back.addEventListener('click', function () { goBack(backData); });
    head.appendChild(back);
    screen.appendChild(head);
    var got = Object.keys(meta.collection).length;
    screen.appendChild(el('div', 'page-sub', '已收集 ' + got + ' / 共 ' + D.collection.total + ' 块'));

    var grid = el('div', 'collection-grid');
    STONE_LIST.forEach(function (s) {
      var owned = !!meta.collection[s.id];
      var cell = el('div', 'cell');
      cell.appendChild(makeTombstone({
        no: 'No. ' + String(s.no).padStart(3, '0'),
        name: owned ? s.name : '？？？',
        locked: !owned,
        glow: owned,
        tip: owned ? (s.name + '\n' + s.epitaph + '\n—— ' + s.from) : '尚未收集'
      }));
      grid.appendChild(cell);
    });
    /* 彩蛋：第 404 号碑 */
    var sp = D.collection.special404;
    var spCell = el('div', 'cell');
    spCell.appendChild(makeTombstone({
      no: 'No. ' + sp.no, name: sp.name, glow: true,
      tip: sp.name + '：' + sp.epitaph
    }));
    grid.appendChild(spCell);

    screen.appendChild(grid);
    app.appendChild(screen);
  }

  /* ================= 成就页 ================= */
  function renderAchievements(backData) {
    clearApp();
    var screen = el('div', 'screen');
    var head = el('div', 'page-head');
    head.appendChild(el('div', 'page-title', '成就'));
    var back = el('button', 'btn ghost', '返回');
    back.addEventListener('click', function () { goBack(backData); });
    head.appendChild(back);
    screen.appendChild(head);
    screen.appendChild(el('div', 'page-sub',
      '已解锁 ' + meta.achievements.length + ' / ' + D.achievements.length));

    var grid = el('div', 'ach-grid');
    D.achievements.forEach(function (a) {
      var unlocked = meta.achievements.indexOf(a.id) >= 0;
      var card = el('div', 'ach-card' + (unlocked ? ' unlocked' : ''));
      card.appendChild(el('div', 'ach-name', a.name));
      card.appendChild(el('div', 'ach-desc', a.desc));
      grid.appendChild(card);
    });
    screen.appendChild(grid);
    app.appendChild(screen);
  }

  function goBack(backData) {
    if (backData) renderMonument(backData);
    else renderOpening();
  }

  /* ================= 分享卡片（Canvas 导出 PNG） ================= */
  function wrapCanvasText(ctx, text, maxWidth) {
    var lines = [], cur = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ctx.measureText(cur + ch).width > maxWidth && cur) {
        lines.push(cur); cur = ch;
      } else cur += ch;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function renderShare(monu) {
    clearApp();
    var W = 900, H = 1200;
    var canvas = el('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    var sc = D.shareCard;

    /* 背景 */
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0b1026');
    grad.addColorStop(1, '#141b3d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* 月亮 */
    ctx.fillStyle = '#e8f4ff';
    ctx.shadowColor = '#e8f4ff'; ctx.shadowBlur = 40;
    ctx.beginPath(); ctx.arc(W - 120, 110, 46, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    /* 标题 / 副标题 */
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7ee787';
    ctx.font = '600 44px Consolas, "Source Code Pro", monospace';
    ctx.fillText(sc.title, W / 2, 100);
    ctx.fillStyle = '#8b93a7';
    ctx.font = '22px Consolas, monospace';
    ctx.fillText(sc.subtitle, W / 2, 146);

    /* 墓碑剪影 */
    var sx = W / 2 - 90, sy = 210, sw = 180, sh = 220;
    ctx.fillStyle = '#2a3145';
    ctx.strokeStyle = 'rgba(126,231,135,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy + sh);
    ctx.lineTo(sx, sy + sw / 2);
    ctx.arc(sx + sw / 2, sy + sw / 2, sw / 2, Math.PI, 0);
    ctx.lineTo(sx + sw, sy + sh);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1c2338';
    ctx.fillRect(sx - 16, sy + sh, sw + 32, 18);
    ctx.fillStyle = '#8b93a7';
    ctx.font = '18px Consolas, monospace';
    ctx.fillText('第 1024 号碑', W / 2, sy + sw / 2 + 10);
    ctx.fillStyle = '#e8f4ff';
    ctx.font = '600 24px Consolas, monospace';
    ctx.fillText(monu.endingId + ' ' + monu.endingName, W / 2, sy + sw / 2 + 52);

    /* 碑文 */
    ctx.fillStyle = '#e8f4ff';
    ctx.font = '20px Consolas, "Microsoft YaHei", monospace';
    var epiLines = wrapCanvasText(ctx, monu.epitaph, W - 200);
    var ty = 520;
    epiLines.forEach(function (line) {
      ctx.fillText(line, W / 2, ty);
      ty += 36;
    });

    /* 玩家标签 */
    ty += 16;
    ctx.font = '600 22px Consolas, "Microsoft YaHei", monospace';
    var tagText = monu.tag;
    var tagW = ctx.measureText(tagText).width + 48;
    ctx.fillStyle = '#7ee787';
    roundRect(ctx, W / 2 - tagW / 2, ty - 26, tagW, 40, 20);
    ctx.fill();
    ctx.fillStyle = '#0b1026';
    ctx.fillText(tagText, W / 2, ty + 2);

    /* 属性面板（四格） */
    var gridY = ty + 70, cellW = 150, cellH = 84, gap = 24;
    var totalW = cellW * 4 + gap * 3;
    var gx = W / 2 - totalW / 2;
    ATTR_KEYS.forEach(function (k, i) {
      var x = gx + i * (cellW + gap);
      ctx.strokeStyle = 'rgba(139,147,167,0.5)';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = 'rgba(22,28,54,0.9)';
      roundRect(ctx, x, gridY, cellW, cellH, 10);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#8b93a7';
      ctx.font = '18px Consolas, "Microsoft YaHei", monospace';
      ctx.fillText(ATTR_NAMES[k], x + cellW / 2, gridY + 30);
      ctx.fillStyle = '#7ee787';
      ctx.font = '600 34px Consolas, monospace';
      ctx.fillText(String(monu.attrs[k]), x + cellW / 2, gridY + 66);
    });

    /* 统计 */
    ctx.fillStyle = '#8b93a7';
    ctx.font = '20px Consolas, "Microsoft YaHei", monospace';
    ctx.fillText(
      '成就 ' + meta.achievements.length + ' / ' + D.achievements.length +
      ' · 图鉴 ' + Object.keys(meta.collection).length + ' / ' + D.collection.total,
      W / 2, gridY + cellH + 56);

    /* 页脚 */
    ctx.fillStyle = '#8b93a7';
    ctx.font = '18px Consolas, monospace';
    ctx.fillText(sc.footer, W / 2, H - 50);

    /* 展示预览与下载 */
    var screen = el('div', 'screen share-preview');
    screen.appendChild(el('div', 'node-title', '分享卡片'));
    var img = el('img');
    img.alt = '分享卡片';
    img.src = canvas.toDataURL('image/png');
    screen.appendChild(img);
    var btnRow = el('div', 'btn-row');
    var dl = el('a', 'btn', '下载 PNG');
    dl.href = img.src;
    dl.download = 'if人生-BUG纪念碑.png';
    dl.style.textDecoration = 'none';
    var back = el('button', 'btn ghost', '返回纪念碑');
    back.addEventListener('click', function () { renderMonument(monu); });
    btnRow.appendChild(dl);
    btnRow.appendChild(back);
    screen.appendChild(btnRow);
    app.appendChild(screen);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ================= 烟花（Canvas 粒子） ================= */
  var fwCanvas = document.getElementById('fireworks-canvas');
  var fwCtx = fwCanvas.getContext('2d');
  var fwParticles = [];
  var fwRunning = false;
  var fwUntil = 0;

  function resizeFw() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeFw);
  resizeFw();

  function spawnBurst() {
    var cx = fwCanvas.width * (0.15 + Math.random() * 0.7);
    var cy = fwCanvas.height * (0.15 + Math.random() * 0.4);
    var colors = ['#7ee787', '#e8f4ff', '#8b93a7'];
    var color = colors[Math.floor(Math.random() * colors.length)];
    for (var i = 0; i < 60; i++) {
      var angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.2;
      var speed = 2 + Math.random() * 3.5;
      fwParticles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, decay: 0.012 + Math.random() * 0.012,
        color: color
      });
    }
  }

  function fwLoop() {
    if (!fwRunning) return;
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    if (Date.now() < fwUntil && Math.random() < 0.12) spawnBurst();
    fwParticles = fwParticles.filter(function (p) { return p.life > 0; });
    fwParticles.forEach(function (p) {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.045;
      p.vx *= 0.985; p.vy *= 0.985;
      p.life -= p.decay;
      fwCtx.globalAlpha = Math.max(0, p.life);
      fwCtx.fillStyle = p.color;
      fwCtx.fillRect(p.x, p.y, 2.5, 2.5);
    });
    fwCtx.globalAlpha = 1;
    if (Date.now() < fwUntil || fwParticles.length > 0) {
      requestAnimationFrame(fwLoop);
    } else {
      fwRunning = false;
      fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    }
  }

  function launchFireworks(duration) {
    fwUntil = Date.now() + duration;
    if (!fwRunning) {
      fwRunning = true;
      spawnBurst();
      fwLoop();
    }
  }

  /* ================= 背景代码雨 ================= */
  var rainCanvas = document.getElementById('rain-canvas');
  var rainCtx = rainCanvas.getContext('2d');
  var rainCols = [];
  var RAIN_CHARS = '01ifelsebugnull{}</>;=1024'.split('');

  function resizeRain() {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
    var colCount = Math.floor(rainCanvas.width / 22);
    rainCols = [];
    for (var i = 0; i < colCount; i++) {
      rainCols.push({ x: i * 22 + 10, y: Math.random() * rainCanvas.height, speed: 0.6 + Math.random() * 1.4 });
    }
  }
  window.addEventListener('resize', resizeRain);
  resizeRain();

  setInterval(function () {
    rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    rainCtx.font = '14px Consolas, monospace';
    rainCols.forEach(function (col) {
      var ch = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
      rainCtx.fillStyle = 'rgba(126,231,135,0.13)';
      rainCtx.fillText(ch, col.x, col.y);
      col.y += col.speed * 14;
      if (col.y > rainCanvas.height + 20) {
        col.y = -20;
        col.speed = 0.6 + Math.random() * 1.4;
      }
    });
  }, 90);

  /* ================= 彩蛋 ================= */
  /* console 彩蛋 */
  try { console.log(D.easterEggs.consoleText); } catch (e) { /* 忽略 */ }

  /* 月亮彩蛋 */
  var moon = document.getElementById('moon');
  moon.addEventListener('click', function () {
    moon.classList.add('blink');
    setTimeout(function () { moon.classList.remove('blink'); }, 260);
    showToast(D.easterEggs.moonText);
  });

  /* 键盘 1-0-2-4 彩蛋 */
  var keyBuf = [];
  document.addEventListener('keydown', function (e) {
    keyBuf.push(e.key);
    if (keyBuf.length > 4) keyBuf.shift();
    var seq = D.easterEggs.konami1024.sequence;
    if (keyBuf.length === 4 && keyBuf.every(function (k, i) { return k === seq[i]; })) {
      launchFireworks(4200);
      showToast(D.easterEggs.konami1024.text);
      keyBuf = [];
    }
  });

  /* ================= 启动 ================= */
  renderAttrPanel();
  renderOpening();
})();

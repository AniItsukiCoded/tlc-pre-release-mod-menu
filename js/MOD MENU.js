/*
 * THE LONG HALLS — MOD MENU
 * Press K to open/close. Works with the project's existing LHMod bridge in main.js.
 * All changes are local to this browser game session.
 */
(function () {
  'use strict';
  const api = window.LHMod;
  if (!api) {
    console.error('[LH Mod Menu] LHMod bridge not found. Load this script after js/main.js.');
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
  #lhmod-root{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.48);backdrop-filter:blur(5px);font-family:Arial,Helvetica,sans-serif;color:#e8e1d6;}
  #lhmod-root.lhm-open{display:flex}
  #lhmod-panel{--red:#b32628;--red2:#e14d45;position:relative;width:min(860px,96vw);height:min(690px,90vh);min-height:440px;display:grid;grid-template-rows:auto 1fr auto;background:linear-gradient(140deg,rgba(25,22,21,.98),rgba(9,10,10,.98) 70%);border:1px solid rgba(190,65,56,.62);box-shadow:0 22px 90px rgba(0,0,0,.7),0 0 34px rgba(140,22,22,.12);overflow:hidden;user-select:none;}
  #lhmod-panel:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,transparent,#8f2524,#e14d45,transparent);pointer-events:none;}
  #lhmod-head{display:flex;align-items:center;gap:14px;padding:18px 22px 16px;border-bottom:1px solid rgba(255,255,255,.09);cursor:move;background:linear-gradient(90deg,rgba(75,18,18,.35),transparent 60%)}
  #lhmod-mark{width:41px;height:41px;display:grid;place-items:center;background:#311716;border:1px solid #78302e;color:#ef8d80;font:22px Georgia,serif;transform:rotate(-3deg);flex:none}
  #lhmod-heading{min-width:0;flex:1}#lhmod-heading strong{display:block;font:600 15px/1.1 Georgia,'Times New Roman',serif;letter-spacing:2.2px;color:#f1e9de}#lhmod-heading small{display:block;margin-top:6px;color:#9d9188;font-size:9px;letter-spacing:2px;text-transform:uppercase}
  #lhmod-live{display:flex;align-items:center;gap:7px;color:#a5a29a;font-size:10px;letter-spacing:1.1px;text-transform:uppercase;white-space:nowrap}#lhmod-live i{width:7px;height:7px;border-radius:100%;background:#7fa66e;box-shadow:0 0 8px #7fa66e}
  #lhmod-close{width:32px;height:32px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#cfc4b9;font-size:22px;line-height:1;cursor:pointer}#lhmod-close:hover{background:#7d2322;color:white;border-color:#aa3937}
  #lhmod-content{min-height:0;display:grid;grid-template-columns:165px 1fr;}
  #lhmod-tabs{padding:17px 10px;border-right:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.12)}
  .lhm-tab{width:100%;display:flex;align-items:center;gap:10px;padding:12px 11px;margin:0 0 5px;border:1px solid transparent;background:transparent;color:#968d85;text-align:left;font-size:11px;letter-spacing:.8px;cursor:pointer;text-transform:uppercase}
  .lhm-tab span{display:inline-grid;place-items:center;width:24px;height:24px;border:1px solid rgba(255,255,255,.1);font-size:12px;color:#b5aaa0}
  .lhm-tab:hover{color:#eee4d8;background:rgba(255,255,255,.035)}.lhm-tab.active{color:#fff;background:linear-gradient(90deg,rgba(133,34,32,.28),rgba(255,255,255,.02));border-color:rgba(187,57,52,.35)}.lhm-tab.active span{background:#68201f;border-color:#a33a36;color:white}
  #lhmod-view{padding:22px 24px;overflow:auto;min-width:0} .lhm-page{display:none}.lhm-page.active{display:block}
  .lhm-page h2{margin:0 0 6px;font:normal 22px Georgia,'Times New Roman',serif;color:#e9ddd0;letter-spacing:.4px}.lhm-desc{margin:0 0 20px;color:#8f8880;font-size:11px;line-height:1.6}
  .lhm-group{margin:17px 0 0}.lhm-group h3{display:flex;align-items:center;gap:9px;margin:0 0 10px;color:#b8a99b;font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase}.lhm-group h3:after{content:"";height:1px;flex:1;background:rgba(255,255,255,.08)}
  .lhm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .lhm-toggle{display:flex;align-items:center;gap:11px;min-height:57px;padding:10px 12px;border:1px solid rgba(255,255,255,.085);background:rgba(255,255,255,.025);cursor:pointer;transition:border-color .15s,background .15s;min-width:0}
  .lhm-toggle:hover{border-color:rgba(197,72,63,.48);background:rgba(122,37,34,.09)}.lhm-toggle input{position:absolute;opacity:0;pointer-events:none}
  .lhm-switch{position:relative;width:30px;height:16px;border-radius:10px;background:#393634;border:1px solid #55504c;flex:none;transition:.15s}
  .lhm-switch:after{content:"";position:absolute;top:2px;left:2px;width:10px;height:10px;border-radius:50%;background:#9b9189;transition:.15s}
  .lhm-toggle input:checked+.lhm-switch{background:#782c29;border-color:#b84a43}.lhm-toggle input:checked+.lhm-switch:after{left:16px;background:#f1d1c8;box-shadow:0 0 8px rgba(238,118,104,.6)}
  .lhm-txt{min-width:0;display:block}.lhm-txt b{display:block;color:#ded5cc;font-size:11px;font-weight:600;line-height:1.3}.lhm-txt small{display:block;margin-top:4px;color:#837a73;font-size:9px;line-height:1.35}
  .lhm-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.lhm-action{min-height:44px;padding:10px 12px;border:1px solid rgba(191,69,60,.38);background:linear-gradient(110deg,rgba(104,29,27,.27),rgba(255,255,255,.025));color:#e7d7cb;text-align:left;font-size:10px;letter-spacing:.45px;cursor:pointer}.lhm-action:hover{background:rgba(143,39,36,.4);border-color:#bc4941}.lhm-action span{float:right;color:#c16a60;font-size:15px;margin-top:-3px}
  .lhm-slider{padding:13px 14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);margin-bottom:9px}.lhm-slider-head{display:flex;justify-content:space-between;gap:10px;color:#d6cbc0;font-size:11px;margin-bottom:10px}.lhm-slider-head output{color:#e17a6c;font-variant-numeric:tabular-nums}.lhm-slider input{width:100%;accent-color:#b64039;cursor:pointer}
  .lhm-note{padding:11px 13px;border-left:2px solid #7f2b29;background:rgba(101,31,29,.12);color:#9d9186;font-size:10px;line-height:1.6;margin-top:13px}
  #lhmod-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:11px 22px;border-top:1px solid rgba(255,255,255,.08);color:#6e6862;font-size:9px;letter-spacing:.7px;text-transform:uppercase}#lhmod-foot b{color:#a44b44;font-weight:500}
  #lhmod-trackers{position:fixed;z-index:9998;top:18px;right:18px;width:245px;display:grid;gap:8px;pointer-events:none;font-family:Arial,Helvetica,sans-serif}
  .lhm-track-card{padding:12px 13px;border:1px solid rgba(189,56,50,.48);background:rgba(9,10,10,.88);box-shadow:0 8px 28px rgba(0,0,0,.35);color:#dcd2c7;backdrop-filter:blur(6px)}
  .lhm-track-card h4{margin:0 0 9px;font-size:9px;letter-spacing:1.8px;color:#d47b70;text-transform:uppercase}.lhm-track-big{font:21px Georgia,serif;color:#efe3d7}.lhm-track-meta{margin-top:5px;color:#92887e;font-size:9px;line-height:1.6}.lhm-track-list{display:grid;gap:5px}.lhm-track-row{display:flex;justify-content:space-between;gap:10px;font-size:10px;color:#c7bcb0}.lhm-track-row span:last-child{color:#dc8c78;font-variant-numeric:tabular-nums;white-space:nowrap}
  @media(max-width:620px){#lhmod-root{padding:6px}#lhmod-panel{width:100%;height:94vh;min-height:0}#lhmod-head{padding:13px}#lhmod-live{display:none}#lhmod-content{grid-template-columns:112px 1fr}#lhmod-tabs{padding:10px 5px}.lhm-tab{padding:10px 6px;font-size:9px;gap:6px}.lhm-tab span{width:20px;height:20px}#lhmod-view{padding:15px 11px}.lhm-grid,.lhm-actions{grid-template-columns:1fr}.lhm-toggle{min-height:50px}#lhmod-trackers{top:8px;right:8px;width:190px}.lhm-track-card{padding:9px}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'lhmod-root';
  root.innerHTML = `
    <section id="lhmod-panel" role="dialog" aria-label="The Long Halls mod menu">
      <header id="lhmod-head">
        <div id="lhmod-mark">†</div>
        <div id="lhmod-heading"><strong>THE LONG HALLS</strong><small>Unofficial modification console · local session</small></div>
        <div id="lhmod-live"><i></i><span id="lhmod-state">Console Ready</span></div>
        <button id="lhmod-close" aria-label="Close mod menu" title="Close (K)">×</button>
      </header>
      <div id="lhmod-content">
        <nav id="lhmod-tabs">
          <button class="lhm-tab active" data-tab="player"><span>01</span> Player</button>
          <button class="lhm-tab" data-tab="enemy"><span>02</span> Entity</button>
          <button class="lhm-tab" data-tab="world"><span>03</span> World</button>
          <button class="lhm-tab" data-tab="settings"><span>04</span> Config</button>
        </nav>
        <main id="lhmod-view">
          <section class="lhm-page active" data-page="player">
            <h2>Player control</h2><p class="lhm-desc">Adjust survival rules, movement, and inventory. Changes take effect immediately.</p>
            <div class="lhm-group"><h3>Survival</h3><div class="lhm-grid">
              <label class="lhm-toggle"><input type="checkbox" data-mod="godMode"><i class="lhm-switch"></i><span class="lhm-txt"><b>God mode</b><small>Prevent getting caught / death</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="infiniteStamina"><i class="lhm-switch"></i><span class="lhm-txt"><b>Infinite stamina</b><small>Sprint without getting tired</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="infiniteFlashlight"><i class="lhm-switch"></i><span class="lhm-txt"><b>Infinite flashlight</b><small>Keep the beam powered and on</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="infiniteItems"><i class="lhm-switch"></i><span class="lhm-txt"><b>Infinite inventory</b><small>99 bottles, batteries and a key</small></span></label>
            </div></div>
            <div class="lhm-group"><h3>Movement</h3><div class="lhm-grid">
              <label class="lhm-toggle"><input type="checkbox" data-mod="superSpeed"><i class="lhm-switch"></i><span class="lhm-txt"><b>Super speed</b><small>Boost walking and sprint speed</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="autoSprint"><i class="lhm-switch"></i><span class="lhm-txt"><b>Auto sprint</b><small>Run whenever you move</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="noclip"><i class="lhm-switch"></i><span class="lhm-txt"><b>Noclip</b><small>Move through walls and props</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="silentMovement"><i class="lhm-switch"></i><span class="lhm-txt"><b>Silent movement</b><small>Stop sprinting from alerting the entity</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="noCameraShake"><i class="lhm-switch"></i><span class="lhm-txt"><b>No camera shake</b><small>Reduce fear and scare shake effects</small></span></label>
            </div></div>
            <div class="lhm-note">Hotkey: <b>K</b> opens/closes this console. Gameplay is held in place behind the menu without showing the game pause screen.</div>
          </section>
          <section class="lhm-page" data-page="enemy">
            <h2>Entity control</h2><p class="lhm-desc">Control The Boiled One's behavior or enable tracking overlays.</p>
            <div class="lhm-group"><h3>AI behavior</h3><div class="lhm-grid">
              <label class="lhm-toggle"><input type="checkbox" data-mod="freezeEnemy"><i class="lhm-switch"></i><span class="lhm-txt"><b>Freeze entity</b><small>Stop enemy movement and detection</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="slowEnemy"><i class="lhm-switch"></i><span class="lhm-txt"><b>Slow entity</b><small>Reduce enemy movement speed</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="enemyESP"><i class="lhm-switch"></i><span class="lhm-txt"><b>Entity tracker</b><small>Show distance, state and bearing</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="itemESP"><i class="lhm-switch"></i><span class="lhm-txt"><b>Item / fuse radar</b><small>Locate uncollected objectives</small></span></label>
            </div></div>
            <div class="lhm-note">The radar reads the current level's actual object positions, so it updates when a new maze is generated.</div>
          </section>
          <section class="lhm-page" data-page="world">
            <h2>World utilities</h2><p class="lhm-desc">Quick actions for testing a level, skipping searches, or wrapping up a run.</p>
            <div class="lhm-group"><h3>Teleport</h3><div class="lhm-actions">
              <button class="lhm-action" data-action="fuse">Teleport to next fuse <span>↗</span></button>
              <button class="lhm-action" data-action="exit">Teleport to exit <span>↗</span></button>
              <button class="lhm-action" data-action="start">Teleport to spawn <span>↗</span></button>
            </div></div>
            <div class="lhm-group"><h3>Level actions</h3><div class="lhm-actions">
              <button class="lhm-action" data-action="collect">Collect all fuses + notes <span>＋</span></button>
              <button class="lhm-action" data-action="doors">Unlock and open all doors <span>⌁</span></button>
              <button class="lhm-action" data-action="win">Complete run instantly <span>✓</span></button>
            </div></div>
            <div class="lhm-note">World actions require an active run. Teleports move your player; they do not automatically make you immune to the enemy.</div>
          </section>
          <section class="lhm-page" data-page="settings">
            <h2>Console configuration</h2><p class="lhm-desc">Fine-tune movement and camera values for this session.</p>
            <div class="lhm-group"><h3>Movement tuning</h3>
              <div class="lhm-slider"><div class="lhm-slider-head"><label for="lhm-speed">Speed multiplier</label><output id="lhm-speed-val">2.0×</output></div><input id="lhm-speed" type="range" min="1" max="6" step="0.25" value="2"></div>
              <div class="lhm-slider"><div class="lhm-slider-head"><label for="lhm-fov">Field of view</label><output id="lhm-fov-val">72°</output></div><input id="lhm-fov" type="range" min="60" max="120" step="1" value="72"></div>
            </div>
            <div class="lhm-group"><h3>World effects</h3><div class="lhm-grid">
              <label class="lhm-toggle"><input type="checkbox" data-mod="noBlackouts"><i class="lhm-switch"></i><span class="lhm-txt"><b>Disable random blackouts</b><small>Stop scripted blackout events</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="fullBright"><i class="lhm-switch"></i><span class="lhm-txt"><b>Fullbright</b><small>Raise ambient light and reduce fog</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="noFog"><i class="lhm-switch"></i><span class="lhm-txt"><b>Remove fog</b><small>Clear level fog completely</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="slowMotion"><i class="lhm-switch"></i><span class="lhm-txt"><b>Slow motion</b><small>Run game simulation at half speed</small></span></label>
              <label class="lhm-toggle"><input type="checkbox" data-mod="showCoordinates"><i class="lhm-switch"></i><span class="lhm-txt"><b>Player coordinates</b><small>Show live X/Z location on screen</small></span></label>
            </div></div>
            <div class="lhm-group"><h3>Reset</h3><div class="lhm-actions"><button class="lhm-action" data-action="reset">Disable all mod toggles <span>↺</span></button></div></div>
          </section>
        </main>
      </div>
      <footer id="lhmod-foot"><span>THE LONG HALLS <b>/</b> DEV CONSOLE</span><span id="lhmod-foot-status">READY</span></footer>
    </section>`;
  document.body.appendChild(root);

  const trackers = document.createElement('div');
  trackers.id = 'lhmod-trackers';
  trackers.innerHTML = `
    <section class="lhm-track-card" id="lhm-enemy-card" hidden><h4>Entity signal</h4><div class="lhm-track-big" id="lhm-enemy-distance">--</div><div class="lhm-track-meta" id="lhm-enemy-meta">Waiting for a live run…</div></section>
    <section class="lhm-track-card" id="lhm-item-card" hidden><h4>Objective radar</h4><div class="lhm-track-list" id="lhm-item-list"></div></section>
    <section class="lhm-track-card" id="lhm-coord-card" hidden><h4>Player coordinates</h4><div class="lhm-track-big" id="lhm-coord-value">X 0.0 · Z 0.0</div><div class="lhm-track-meta" id="lhm-coord-meta">Live local position</div></section>`;
  document.body.appendChild(trackers);

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  let activeTab = 'player';
  let opened = false;
  const setStatus = (text) => { $('#lhmod-foot-status').textContent = text; };
  const showMenu = (force) => {
    opened = typeof force === 'boolean' ? force : !opened;
    if (typeof api.setMenuOpen === 'function') api.setMenuOpen(opened);
    root.classList.toggle('lhm-open', opened);
    if (opened && document.pointerLockElement) document.exitPointerLock();
    if (opened) refreshControls();
  };
  const setTab = (tab) => {
    activeTab = tab;
    $$('.lhm-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    $$('.lhm-page').forEach(p => p.classList.toggle('active', p.dataset.page === tab));
  };
  const refreshControls = () => {
    const flags = api.flags || {};
    $$('[data-mod]').forEach(input => { input.checked = !!flags[input.dataset.mod]; });
    $('#lhm-speed').value = flags.speedMultiplier || 2;
    $('#lhm-speed-val').textContent = `${Number($('#lhm-speed').value).toFixed(2).replace(/0$/, '')}×`;
    const snap = api.getSnapshot();
    $('#lhm-fov').value = snap && snap.fov ? snap.fov : 72;
    $('#lhm-fov-val').textContent = `${$('#lhm-fov').value}°`;
    $('#lhmod-state').textContent = snap && snap.started && ['play','wake','scare','pause'].includes(snap.state) ? 'Run Active' : 'Console Ready';
  };

  $$('.lhm-tab').forEach(button => button.addEventListener('click', () => setTab(button.dataset.tab)));
  $('#lhmod-close').addEventListener('click', () => showMenu(false));
  root.addEventListener('mousedown', e => { if (e.target === root) showMenu(false); });

  // Drag the panel by its header.
  const panel = $('#lhmod-panel');
  const head = $('#lhmod-head');
  let drag = null;
  head.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    const r = panel.getBoundingClientRect();
    drag = { x: e.clientX, y: e.clientY, left: r.left, top: r.top };
    head.setPointerCapture(e.pointerId);
  });
  head.addEventListener('pointermove', e => {
    if (!drag) return;
    const left = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, drag.left + e.clientX - drag.x));
    const top = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, drag.top + e.clientY - drag.y));
    panel.style.position = 'fixed'; panel.style.left = `${left}px`; panel.style.top = `${top}px`; panel.style.margin = '0';
  });
  const endDrag = () => { drag = null; };
  head.addEventListener('pointerup', endDrag); head.addEventListener('pointercancel', endDrag);

  $$('[data-mod]').forEach(input => input.addEventListener('change', () => {
    const name = input.dataset.mod;
    api.toggle(name, input.checked);
    if (name === 'infiniteFlashlight' && input.checked) api.notify('Flashlight locked at full charge.');
    if (name === 'freezeEnemy' && input.checked) api.notify('Entity movement frozen.');
    setStatus(`${name.replace(/([A-Z])/g, ' $1')} ${input.checked ? 'ENABLED' : 'DISABLED'}`.toUpperCase());
    refreshControls();
  }));

  $('#lhm-speed').addEventListener('input', e => {
    const v = api.setSpeedMultiplier(e.target.value);
    $('#lhm-speed-val').textContent = `${v.toFixed(2).replace(/0$/, '')}×`;
  });
  $('#lhm-fov').addEventListener('input', e => {
    $('#lhm-fov-val').textContent = `${e.target.value}°`;
    // setFov is applied immediately and the native options state is retained.
    if (typeof api.setFov === 'function') api.setFov(e.target.value);
  });

  const doAction = action => {
    switch (action) {
      case 'start': api.teleport('start'); break;
      case 'exit': api.teleport('exit'); break;
      case 'fuse': api.teleport('fuse'); break;
      case 'collect': api.collectAll(); break;
      case 'doors': api.unlockDoors(); break;
      case 'win': api.completeRun(); showMenu(false); break;
      case 'reset':
        Object.keys(api.flags).forEach(key => { if (key !== 'speedMultiplier') api.toggle(key, false); });
        api.setSpeedMultiplier(2); if (typeof api.setFov === 'function') api.setFov(72); refreshControls(); setStatus('MOD TOGGLES RESET'); api.notify('All mod toggles and tuning reset.'); break;
    }
  };
  $$('[data-action]').forEach(button => button.addEventListener('click', () => doAction(button.dataset.action)));

  function updateTrackers() {
    const s = api.getSnapshot();
    const enemyCard = $('#lhm-enemy-card');
    const itemCard = $('#lhm-item-card');
    const coordCard = $('#lhm-coord-card');
    const hasRun = !!(s && s.started && ['play', 'pause', 'scare', 'wake'].includes(s.state));
    enemyCard.hidden = !(api.flags.enemyESP && hasRun);
    itemCard.hidden = !(api.flags.itemESP && hasRun);
    coordCard.hidden = !(api.flags.showCoordinates && hasRun);
    if (!hasRun) return;
    if (api.flags.showCoordinates && s.player) {
      const px = Number(s.player.x) || 0, pz = Number(s.player.z) || 0;
      $('#lhm-coord-value').textContent = `X ${px.toFixed(2)} · Z ${pz.toFixed(2)}`;
      $('#lhm-coord-meta').textContent = `DAY ${s.day} · ${String(s.state).toUpperCase()}`;
    }

    if (api.flags.enemyESP) {
      const e = s.enemy, p = s.player;
      const bearing = (Math.atan2(e.x - p.x, -(e.z - p.z)) * 180 / Math.PI + 360) % 360;
      $('#lhm-enemy-distance').textContent = `${e.dist.toFixed(1)} m`;
      $('#lhm-enemy-meta').textContent = `STATE: ${String(e.state).toUpperCase()} · BEARING: ${Math.round(bearing)}° · DAY ${s.day}`;
    }
    if (api.flags.itemESP) {
      const p = s.player;
      const found = [];
      s.remainingFuses.forEach(f => found.push({ label: `Fuse ${f.index}`, dist: Math.hypot(f.x-p.x, f.z-p.z), type: 'FUSE' }));
      s.items.forEach(it => {
        const name = ({key:'Brass key',battery:'Battery',bottle:'Bottle',note:'Note'})[it.type] || it.type;
        found.push({ label: name, dist: Math.hypot(it.x-p.x, it.z-p.z), type: it.type.toUpperCase() });
      });
      found.sort((a,b) => a.dist - b.dist);
      const list = $('#lhm-item-list');
      const rows = found.slice(0, 7);
      list.replaceChildren();
      if (rows.length) rows.forEach(it => { const row=document.createElement('div'); row.className='lhm-track-row'; const label=document.createElement('span'); label.textContent=it.label; const dist=document.createElement('span'); dist.textContent=`${it.dist.toFixed(1)}m`; row.append(label,dist); list.appendChild(row); });
      else { const row=document.createElement('div'); row.className='lhm-track-row'; const label=document.createElement('span'); label.textContent='All tracked items collected'; const check=document.createElement('span'); check.textContent='✓'; row.append(label,check); list.appendChild(row); }
    }
  }
  window.setInterval(updateTrackers, 180);

  window.addEventListener('keydown', e => {
    if (e.repeat || e.code !== 'KeyK') return;
    const target = e.target;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    e.preventDefault();
    showMenu();
  });
  window.addEventListener('storage', e => {
    if (e.key === 'lh-mod-menu-config-v1') refreshControls();
  });
  refreshControls();
  // Re-apply persistent settings once the menu has attached and the game bridge is ready.
  if (api.flags.fullBright || api.flags.noFog) api.toggle(api.flags.fullBright ? 'fullBright' : 'noFog', true);
  console.info('[LH Mod Menu] Ready. Press K.');
})();

/**
 * BENCK. - Site
 * Nav, menu mobile, parallax, telas que se endireitam no scroll, formulário e o hero 3D.
 */

(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* Nav */
  var nav = document.getElementById('nav');
  /* Hero wordmark parallax, frame tilt, process line */
  var word = document.getElementById('heroWord');
  var frames = [].slice.call(document.querySelectorAll('[data-tilt]'));
  var steps = document.getElementById('steps');
  var stepsLine = steps.querySelector('.steps-line');

  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    nav.classList.toggle('is-scrolled', y > 40);
    if (reduce) return;
    if (y < vh * 1.2) word.style.transform = 'translate3d(0,' + (y * 0.32).toFixed(1) + 'px,0)';
    frames.forEach(function (f) {
      var r = f.getBoundingClientRect();
      var t = clamp((vh - r.top) / (vh * 0.75), 0, 1);
      f.style.setProperty('--t', t.toFixed(3));
    });
    var sr = steps.getBoundingClientRect();
    stepsLine.style.setProperty('--p', clamp((vh * 0.85 - sr.top) / (vh * 0.6), 0, 1).toFixed(3));
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* Reveal */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  }

  /* Menu mobile */
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobileMenu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { setMenu(mobileMenu.hidden); });
  mobileMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mobileMenu.hidden) setMenu(false); });
  window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });

  /* Formulário de contato: Cloudflare Worker -> Resend (worker/) */
  var CONTACT_ENDPOINT = 'https://api.benck.tech/contact';
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.innerHTML;

  function showNote(text, isError) {
    note.textContent = text;
    note.classList.toggle('is-error', !!isError);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      showNote('Preencha nome, e-mail e o que vocês precisam resolver para enviar.', true);
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    showNote('');

    fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    })
      .then(function (res) {
        if (!res.ok) throw new Error('request_failed');
        form.reset();
        showNote('Mensagem enviada. A gente responde em breve.');
      })
      .catch(function () {
        showNote('Não foi possível enviar agora. Tente de novo ou escreva para hello@benck.tech.', true);
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitLabel;
      });
  });

  /* Hero 3D: blocks assembling into one system */
  var canvas = document.getElementById('heroCanvas');
  if (!window.THREE) return;
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
  catch (err) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 16, 38);
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  var GREEN = 0x6de067;

  var world = new THREE.Group();
  scene.add(world);
  var cluster = new THREE.Group();
  world.add(cluster);

  var grid = new THREE.GridHelper(80, 80, 0x2b5a28, 0x163015);
  grid.position.y = -0.02;
  world.add(grid);

  var edgeMat = new THREE.LineBasicMaterial({ color: GREEN });
  var faceMat = new THREE.MeshBasicMaterial({ color: 0x000000, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  var hotMat = new THREE.MeshBasicMaterial({ color: GREEN, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  var hotEdge = new THREE.LineBasicMaterial({ color: 0x000000 });

  // [x, y, z, sx, sy, sz] in a 4 x 4 x 3 grid of modules
  var defs = [
    [-1, 0.5, 0, 2, 1, 2], [1, 0.5, -0.5, 2, 1, 1], [1.5, 0.5, 0.5, 1, 1, 1], [0.5, 0.5, 0.5, 1, 1, 1],
    [-1.5, 1.5, -0.5, 1, 1, 1], [-0.5, 1.5, 0.5, 1, 1, 1], [0.5, 1.5, 0, 1, 1, 2], [1.5, 1.5, -0.5, 1, 1, 1],
    [-1.5, 1.5, 0.5, 1, 1, 1], [-1, 2.5, -0.5, 2, 1, 1], [0.5, 2.5, 0.5, 1, 1, 1], [1.5, 2.5, 0, 1, 1, 2],
    [-0.5, 3.5, 0, 1, 1, 2]
  ];
  var HOT = defs.length - 1;
  var blocks = defs.map(function (d, i) {
    var g = new THREE.BoxGeometry(d[3] - 0.06, d[4] - 0.06, d[5] - 0.06);
    var holder = new THREE.Group();
    var hot = i === HOT;
    holder.add(new THREE.Mesh(g, hot ? hotMat : faceMat));
    holder.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), hot ? hotEdge : edgeMat));
    cluster.add(holder);
    var dir = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.6 + 0.2, Math.random() - 0.5).normalize();
    var dist = 9 + Math.random() * 7;
    return {
      o: holder,
      to: new THREE.Vector3(d[0], d[1], d[2]),
      from: new THREE.Vector3(d[0], d[1], d[2]).add(dir.multiplyScalar(dist)),
      rot: new THREE.Euler((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4),
      delay: hot ? 1.5 : i * 0.07
    };
  });
  cluster.position.set(-0.25, 0, 0);

  var mouse = { x: 0, y: 0 }, smooth = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    mouse.x = e.clientX / window.innerWidth * 2 - 1;
    mouse.y = e.clientY / window.innerHeight * 2 - 1;
  }, { passive: true });

  var layout = { x: 4.6, s: 1 };
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    var narrow = w < 860;
    layout.x = narrow ? 2.4 : Math.min(5.2, 2.6 + w / 900);
    layout.s = narrow ? 0.7 : 1;
    camera.position.set(0, narrow ? 9 : 6, narrow ? 26 : 19);
    camera.lookAt(narrow ? 0.6 : 1.2, narrow ? 7.5 : 2.4, 0);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  var easeOut = function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); };
  var start = performance.now();
  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(canvas);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    var t = (now - start) / 1000;
    blocks.forEach(function (b) {
      var k = reduce ? 1 : easeOut(clamp((t - 0.3 - b.delay) / 1.5, 0, 1));
      b.o.position.lerpVectors(b.from, b.to, k);
      b.o.rotation.set(b.rot.x * (1 - k), b.rot.y * (1 - k), b.rot.z * (1 - k));
    });
    smooth.x += (mouse.x - smooth.x) * 0.05;
    smooth.y += (mouse.y - smooth.y) * 0.05;
    var s = clamp(window.scrollY / window.innerHeight, 0, 1.5);
    world.position.x = layout.x;
    world.scale.setScalar(layout.s);
    cluster.rotation.y = (reduce ? 0.6 : 0.6 + t * 0.12) + smooth.x * 0.35 + s * 1.4;
    world.rotation.x = smooth.y * 0.05;
    world.position.y = -s * 2.2;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
})();

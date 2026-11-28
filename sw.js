// HHR FinancialPlan: speichert die App auf dem Gerät (Offline-Nutzung).
// Erzeugt von tool/offline_vorbereiten.py, nicht von Hand ändern.
const CACHE = 'hhr-fp-1.3.0.110-2db6887ca321';
const DATEIEN = [
"./",
"assets/AssetManifest.bin",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json",
"assets/NOTICES",
"assets/assets/fonts/LICENSE-LiberationSans.txt",
"assets/assets/fonts/LiberationSans-Bold.ttf",
"assets/assets/fonts/LiberationSans-Regular.ttf",
"assets/assets/hilfe.json",
"assets/assets/info.json",
"assets/assets/logo.png",
"assets/assets/musterdaten.json",
"assets/assets/uebersetzungen_app.json",
"assets/assets/uebersetzungen_excel.json",
"assets/assets/vorlage.json",
"assets/fonts/MaterialIcons-Regular.otf",
"assets/fonts/fallback/Roboto-Regular.ttf",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf",
"assets/packages/material_ui/shaders/ink_sparkle.frag",
"assets/shaders/ink_sparkle.frag",
"assets/shaders/stretch_effect.frag",
"canvaskit/canvaskit.js",
"canvaskit/canvaskit.wasm",
"canvaskit/chromium/canvaskit.js",
"canvaskit/chromium/canvaskit.wasm",
"favicon.png",
"flutter.js",
"flutter_bootstrap.js",
"icons/Icon-192.png",
"icons/Icon-512.png",
"icons/Icon-maskable-192.png",
"icons/Icon-maskable-512.png",
"icons/apple-touch-icon.png",
"main.dart.js",
"manifest.json",
"version.json"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // Einzeln laden: fehlt eine Datei, funktioniert der Rest trotzdem offline.
      .then((c) => Promise.all(DATEIEN.map((d) =>
        c.add(new Request(d, {cache: 'reload'})).catch((e) => console.warn('Nicht gespeichert:', d, e)))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(namen.filter((n) => n.startsWith('hhr-fp-') && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Seitenaufrufe immer mit der gespeicherten Startseite beantworten.
  const ziel = req.mode === 'navigate' ? './' : req;
  event.respondWith(
    caches.open(CACHE).then((c) =>
      c.match(ziel, {ignoreSearch: true}).then((treffer) => treffer || fetch(req))
    )
  );
});

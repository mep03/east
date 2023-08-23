const CACHE_NAME = "cache",
  urlsToCache = [
    "/",
    "/signin",
    "/signup",
    "/dashboard",
    "/js/signin.js",
    "/js/signup.js",
    "/js/dashboard.js",
    "/favicon.ico",
    "/styles.css",
    "/img/android-chrome-192x192.png",
    "/img/android-chrome-512x512.png",
    "/img/apple-touch-icon.png",
    "/img/favicon-16x16.png",
    "/img/favicon-32x32.png",
  ];
self.addEventListener("install", (n) => {
  n.waitUntil(caches.open("cache").then((n) => n.addAll(urlsToCache)));
}),
  self.addEventListener("fetch", (n) => {
    n.respondWith(caches.match(n.request).then((s) => s || fetch(n.request)));
  });

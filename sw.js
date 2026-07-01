var CACHE = 'alpha-v1';
var ASSETS = [
  '/alpha/dashboard.html',
  '/alpha/manifest.json'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
});

self.addEventListener('fetch', function(e){
  // Network first for API calls (Google Apps Script)
  if(e.request.url.indexOf('script.google.com') > -1){
    e.respondWith(fetch(e.request).catch(function(){
      return new Response('{"error":"offline"}', {headers:{'Content-Type':'application/json'}});
    }));
    return;
  }
  // Cache first for assets
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request);
    })
  );
});

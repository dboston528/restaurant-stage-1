// console.log('Service Worker: Registered');
//
// self.addEventListener('install', function(e){
//
// });
//
// const cacheFiles = [
//   '/',
//   '/index.html',
//   '/css/styles.css',
//   '/js/dbhelper.js',
//   '/js/main.js',
//   '/js/restaurant_info.js',
//   '/data/restaurants.json',
//   '/img/1.jpg',
//   '/img/2.jpg',
//   '/img/3.jpg',
//   '/img/4.jpg',
//   '/img/5.jpg',
//   '/img/6.jpg',
//   '/img/7.jpg',
//   '/img/8.jpg',
//   '/img/9.jpg',
//   '/img/10.jpg',
// ];
//
// self.addEventListener('install', function(e){
//   e.waitUntil (
//     caches.open('v1').then(function(cache) {
//       return cache.addAll(cacheFiles);
//     })
//
//   );
// });
//
// self.addEventListener('fetch', function(e) {
//   e.respondWith(
//     caches.match(e.request).then(function(response) {
//       if (response) {
//         console.log('Found', e.request, 'in cache');
//         return response;
//       }
//       else {
//         console.log('Could not find', e.request, 'in cache, FETCHING!');
//         return fetch(e.request);
//           .then(function(response) {
//             const responseClone = response.clone();
//             caches.open(cacheName).then(function(cache) {
//               cache.put(e.request, responseClone);
//             })
//             return response;
//           })
//           .catch(function(err) {
//             console.error(err);
//           });
//       }
//
//     })
//
//   );
// });
const appName = "restaurant-reviews"
const staticCacheName = appName + "-v1.0";

const contentImgsCache = appName + "-images";

var allCaches = [
  staticCacheName,
  contentImgsCache
];

/** At Service Worker Install time, cache all static assets */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/', // this caches index.html
        '/restaurant.html',
        '/css/styles.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        'js/register-sw.js',
        'data/restaurants.json'
      ]);
    })
  );
});

/** At Service Worker Activation, Delete previous caches, if any */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith(appName) &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/** Hijack fetch requests and respond accordingly */
self.addEventListener('fetch', function(event) {

  // Default behavior: respond with cached elements, if any, falling back to network.
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

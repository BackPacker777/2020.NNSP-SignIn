const VERSION = 'v1.00.0';
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

const cacheResources = async () => {
    let cacheFilesFirst = [
        './',
        './public/icons/favicon.ico',
        './public/images/nsp_logo.png',
        './public/views/index.ejs',
        './public/views/footer.ejs',
        './public/views/header.ejs',
        './public/css/foundation.min.css',
        './public/css/fontawesome.css',
        './public/css/overrides.css',
        './public/javascripts/main.js',
        './public/javascripts/DivContents2.js',
        './public/javascripts/EventHandler.js',
        './public/javascripts/WebStorage.js'
    ];
    const cache = await caches.open(VERSION);
    return cache.addAll(cacheFilesFirst);
};

self.addEventListener('install', async (event) => {
    event.waitUntil(cacheResources());
    await self.skipWaiting();
});

self.addEventListener('activate', async (event) => {
    console.log(`SW activated:  ${event}`);
    await self.clients.claim();
});

self.addEventListener('fetch', async (event) => {
    console.log(`Fetch event: ${event.request.url}`);
    event.respondWith(fromNetwork(event.request, 400).catch(async () => {
        return fromCache(event.request);
    }));
    // await event.respondWith(cachedResource(event.request));
});

self.addEventListener('push', async (event) => {

});

self.addEventListener('sync', async (event) => {

});

function fromNetwork(request, timeout) {
    return new Promise(function (fulfill, reject) {
        let timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function (response) {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(VERSION).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}
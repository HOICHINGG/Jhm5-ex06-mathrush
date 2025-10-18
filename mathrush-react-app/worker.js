addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  let path = url.pathname
  
  // Serve index.html for root
  if (path === '/') {
    path = '/index.html'
  }
  
  // Try to serve the static file
  try {
    const response = await fetch(request)
    
    // If file not found (404) and not an asset, serve index.html for SPA routing
    if (response.status === 404 && !path.includes('.')) {
      return fetch(new URL('/index.html', url.origin))
    }
    
    return response
  } catch (e) {
    // If error, serve index.html
    return fetch(new URL('/index.html', url.origin))
  }
}

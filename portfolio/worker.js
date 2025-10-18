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
    
    // If file not found (404), serve index.html
    if (response.status === 404) {
      return fetch(new URL('/index.html', url.origin))
    }
    
    return response
  } catch (e) {
    // If error, serve index.html
    return fetch(new URL('/index.html', url.origin))
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const API_ENDPOINTS = {
    christian: 'https://bible-api.com/',
    islamic: 'https://api.alquran.cloud/v1/',
    hindu: 'https://bhagavadgitaapi.in/',
    buddhist: 'https://dhammapada-api.vercel.app/',
    taoist: 'https://api.ttc.rest/v1/'
  };

  const url = new URL(request.url);
  const path = url.pathname.replace('/proxy/', '');
  
  const response = await fetch(`${API_ENDPOINTS[path.split('/')[0]]}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'SacredWisdomCross/1.0'
    }
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}

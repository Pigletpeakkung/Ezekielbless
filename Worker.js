// Cloudflare Worker to handle CORS and API requests
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const API_SOURCES = {
    christian: 'https://bible-api.com/',
    islamic: 'https://api.alquran.cloud/v1/',
    hindu: 'https://bhagavadgitaapi.in/',
    buddhist: 'https://dhammapada-api.vercel.app/api/',
    tao: 'https://api.ttc.rest/v1/',
    rumi: 'https://rumi-api.com/',
    watts: 'https://alanwattsapi.org/'
}

async function handleRequest(request) {
    const url = new URL(request.url)
    const path = url.pathname.replace('/proxy/', '').split('/')
    const [service, ...endpoint] = path

    // Rate limiting
    const clientIP = request.headers.get('cf-connecting-ip')
    const cacheKey = `rate_limit_${clientIP}`
    const limit = await QUOTES.get(cacheKey) || 0
    
    if (limit > 100) {
        return new Response(JSON.stringify({
            error: "Rate limit exceeded",
            message: "Maximum 100 requests per hour"
        }), { 
            status: 429,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    // Process request
    try {
        const targetUrl = `${API_SOURCES[service]}${endpoint.join('/')}`
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'SacredWisdomCross/1.0',
                'Accept': 'application/json'
            }
        })

        // Update rate limit
        await QUOTES.put(cacheKey, (parseInt(limit) + 1).toString(), { 
            expirationTtl: 3600 // 1 hour
        })

        // Return response with CORS headers
        return new Response(response.body, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Cache-Control': `public, max-age=${service === 'tao' ? 86400 : 3600}`
            }
        })
    } catch (error) {
        return new Response(JSON.stringify({
            error: "Sacred connection failed",
            message: error.message
        }), { 
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
    }
}

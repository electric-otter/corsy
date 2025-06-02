const rateLimitMap = new Map();

const AI_USER_AGENTS = [
  'bot', 'crawl', 'spider', 'ai', 'gpt', 'openai', 'curl', 'wget'
];

function isAIRequest(headers) {
  const userAgent = (headers['user-agent'] || '').toLowerCase();
  return AI_USER_AGENTS.some(keyword => userAgent.includes(keyword));
}

export async function handler(event) {
  const url = event.queryStringParameters?.url;

  if (!url) {
    return {
      statusCode: 400,
      body: 'Missing "url" query parameter',
    };
  }

  const headers = event.headers || {};
  const clientId = event.requestContext?.identity?.sourceIp || 'unknown';

  if (isAIRequest(headers)) {
    const currentCount = rateLimitMap.get(clientId) || 0;
    if (currentCount >= 20) {
      return {
        statusCode: 429,
        body: 'Rate limit exceeded for AI requests',
      };
    }
    rateLimitMap.set(clientId, currentCount + 1);
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'text/plain';
    const body = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
      },
      body,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error fetching URL: ${error.message}`,
    };
  }
}

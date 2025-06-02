export async function handler(event) {
  const url = event.queryStringParameters?.url;

  if (!url) {
    return {
      statusCode: 400,
      body: 'Missing "url" query parameter',
    };
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

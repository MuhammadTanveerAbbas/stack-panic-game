export const config = {
  runtime: 'edge',
};

export default function handler() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'stack-panic-game',
      version: '1.0.0',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}

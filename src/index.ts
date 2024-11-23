import { Hono } from 'hono';
import type { Context } from 'hono';

const app = new Hono();

function toCodePoints(unicodeSurrogates: string): string[] {
  const codePoints: string[] = [];
  let highSurrogate = 0;
  for (let i = 0; i < unicodeSurrogates.length; i++) {
    const currentCharCode = unicodeSurrogates.charCodeAt(i);
    if (highSurrogate) {
      if (0xdc00 <= currentCharCode && currentCharCode <= 0xdfff) {
        codePoints.push(
          (
            ((highSurrogate - 0xd800) << 10) +
            (currentCharCode - 0xdc00) +
            0x10000
          ).toString(),
        );
        highSurrogate = 0;
        continue;
      }
      highSurrogate = 0; // unmatched surrogate, reset
    }
    if (0xd800 <= currentCharCode && currentCharCode <= 0xdbff) {
      highSurrogate = currentCharCode;
    } else {
      codePoints.push(currentCharCode.toString());
    }
  }
  if (highSurrogate) {
    codePoints.push(highSurrogate.toString()); // unmatched surrogate
  }
  return codePoints.map((cp) => Number(cp).toString(16).toLowerCase());
}

function parse(emoji: string): string {
  // Split emoji by variation selectors or ZWJ (zero-width joiner)
  const parts = Array.from(emoji);
  const codePoints = parts.flatMap((part) => toCodePoints(part));
  return codePoints.join('-');
}

app.get('/', async (c: Context) => {
  return c.text('Hello Hono!');
});

app.get('/emoji/:emoji', async (c: Context) => {
  let emoji: string = c.req.param('emoji');
  const extension = emoji.split('.').pop();
  emoji = emoji.split('.')[0]; // Remove extension

  console.log(emoji);

  if (extension !== 'png' && extension !== 'svg') {
    c.status(400);
    return c.text('Invalid extension');
  }

  let baseUrl: string;

  switch (extension) {
    case 'png':
      baseUrl =
        'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/';
      c.header('Content-Type', 'image/png');
      break;
    case 'svg':
      baseUrl =
        'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/';
      c.header('Content-Type', 'image/svg+xml');
      break;
  }

  const parsed = parse(emoji);
  return fetch(`${baseUrl}${parsed}.${extension}`);
});

export default app;

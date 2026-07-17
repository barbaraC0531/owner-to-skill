import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, normalize } from 'node:path';
import { analyzeInterview, auditAnswer } from './analyzer.js';

const port = process.env.PORT || 3001;
const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      if (req.method === 'POST' && req.url === '/api/analyze') {
        const body = await readJson(req);
        return json(res, analyzeInterview(String(body.text || '')));
      }
      if (req.method === 'POST' && req.url === '/api/audit') {
        const body = await readJson(req);
        return json(res, auditAnswer(String(body.answer || ''), body.structured || {}));
      }
      const url = new URL(req.url || '/', 'http://localhost');
      if (req.method === 'GET' && url.pathname === '/favicon.ico') return empty(res);
      if (req.method?.startsWith('POST')) return notFound(res);
      return await staticFile(url.pathname, res);
    } catch (error) {
      return json(res, { error: error.message }, 400);
    }
  });
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  if (!body) return {};
  return JSON.parse(body);
}

async function staticFile(pathname, res) {
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^[/\\]+/, '');
  const safePath = normalize(requested);
  if (safePath.startsWith('..') || safePath.includes(`..${process.platform === 'win32' ? '\\' : '/'}`)) return notFound(res);
  const fileUrl = new URL(`../public/${safePath}`, import.meta.url);
  try {
    const contents = await readFile(fileUrl);
    res.setHeader('content-type', contentTypes[extname(safePath)] || 'text/plain; charset=utf-8');
    res.end(contents);
  } catch (error) {
    if (error.code === 'ENOENT') return notFound(res);
    throw error;
  }
}

function json(res, payload, status = 200) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload, null, 2));
}

function empty(res) {
  res.writeHead(204);
  res.end();
}

function notFound(res) {
  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  createServer().listen(port, () => console.log(`owner-to-skill http://localhost:${port}`));
}

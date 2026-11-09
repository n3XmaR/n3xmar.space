import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const [projects, rabbitHoles] = await Promise.all([
    getCollection('projects'),
    getCollection('rabbit-holes')
  ]);

  const paths = [
    '/',
    '/projects/',
    '/rabbit-holes/',
    '/certificates/',
    '/log/',
    '/maybe/',
    ...projects.map((project) => `/projects/${project.id}/`),
    ...rabbitHoles.map((post) => `/rabbit-holes/${post.id}/`)
  ];

  const urls = paths.map((path) => {
    const url = new URL(path, site ?? 'https://n3xmar.space');
    return `  <url><loc>${url.href}</loc></url>`;
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>'
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};

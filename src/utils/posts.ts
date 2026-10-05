import type { CollectionEntry } from 'astro:content';
import type { Lang } from '@i18n/config';
import { postLang } from '@i18n/config';

export type Post = CollectionEntry<'blog'>;

export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

export function filterByLang(posts: Post[], lang: Lang): Post[] {
  return posts.filter((post) => postLang(post.id) === lang);
}

export function filterByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}

export function readMinutes(markdown: string | undefined): number {
  if (!markdown) return 1;
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(date: Date, lang: Lang): string {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function getPrevNext(posts: Post[], post: Post): { prev: Post | null; next: Post | null } {
  const sorted = sortPosts(posts);
  const index = sorted.findIndex((p) => p.id === post.id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index < sorted.length - 1 ? sorted[index + 1] : null,
    next: index > 0 ? sorted[index - 1] : null,
  };
}

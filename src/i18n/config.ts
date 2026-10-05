export type Lang = 'es' | 'en';

export const DEFAULT_LANG: Lang = 'es';

export const LANGS: Lang[] = ['es', 'en'];

export function langPrefix(lang: Lang): string {
  return lang === DEFAULT_LANG ? '' : `/${lang}`;
}

export function langPath(lang: Lang, path: string): string {
  const prefix = langPrefix(lang);
  if (path === '/') {
    return prefix === '' ? '/' : `${prefix}/`;
  }
  return `${prefix}${path}`;
}

export function postLang(id: string): Lang {
  return id.startsWith('en/') ? 'en' : 'es';
}

export interface Dictionary {
  siteName: string;
  siteDescription: string;
  author: string;
  nav: {
    home: string;
    thoughts: string;
    trips: string;
    tags: string;
    about: string;
  };
  sections: {
    thoughts: string;
    trips: string;
    tags: string;
    about: string;
    post: string;
  };
  homeLabel: string;
  homeTitle: string;
  homeIntro: string;
  paths: { href: string; title: string; body: string }[];
  latestTitle: string;
  empty: string;
  metaBy: string;
  metaPublished: string;
  metaMinRead: (minutes: number) => string;
  next: string;
  prev: string;
  tagsTitle: string;
  tagsIntro: string;
  tagCount: (count: number) => string;
  aboutTitle: string;
  aboutIntro: string;
  aboutBody: string[];
  notFoundTitle: string;
  notFoundBody: string;
  rights: (year: number) => string;
}

const es: Dictionary = {
  siteName: "Nerf's World",
  siteDescription: 'Escritos, viajes y pensamientos de TRIP.',
  author: 'TRIP',
  nav: {
    home: 'Inicio',
    thoughts: 'Pensamientos',
    trips: 'Viajes',
    tags: 'Etiquetas',
    about: 'Sobre el autor',
  },
  sections: {
    thoughts: 'Pensamientos',
    trips: 'Viajes',
    tags: 'Etiquetas',
    about: 'Sobre el autor',
    post: 'Escrito',
  },
  homeLabel: 'Empezá aquí',
  homeTitle: 'Un lugar tranquilo para pensar en voz alta.',
  homeIntro:
    'Este blog no es un feed. Es un archivo de ideas, viajes y cosas que me importan.',
  paths: [
    {
      href: '/thoughts',
      title: 'Pensamientos',
      body: 'Ideas y escritos, en orden de publicación.',
    },
    {
      href: '/trips',
      title: 'Viajes',
      body: 'Fotos y lugares. Sin ruido.',
    },
    {
      href: '/tags',
      title: 'Etiquetas',
      body: 'Explora el archivo por tema.',
    },
  ],
  latestTitle: 'Lo más reciente',
  empty: 'Aún no hay posts aquí.',
  metaBy: 'Escrito por',
  metaPublished: 'Publicado',
  metaMinRead: (minutes: number) => `${minutes} min de lectura`,
  next: 'Siguiente post',
  prev: 'Post anterior',
  tagsTitle: 'Un índice por palabra.',
  tagsIntro: 'Todas las etiquetas del blog.',
  tagCount: (count: number) =>
    count === 1 ? '1 post' : `${count} posts`,
  aboutTitle: 'Sobre TRIP',
  aboutIntro: 'Quién escribe y por qué existe este sitio.',
  aboutBody: [
    'Soy TRIP. Escribo sobre lo que me importa: ideas, viajes y tecnología.',
    'Este sitio es mi archivo personal. Escribo cuando quiero y publico cuando el texto está listo. No hay ruido ni humo.',
  ],
  notFoundTitle: 'Página no encontrada',
  notFoundBody: 'Esta página no existe. Vuelve al inicio y sigue explorando.',
  rights: (year: number) => `© ${year} TRIP`,
};

const en: Dictionary = {
  siteName: "Nerf's World",
  siteDescription: 'Writing, trips and thoughts by TRIP.',
  author: 'TRIP',
  nav: {
    home: 'Home',
    thoughts: 'Thoughts',
    trips: 'Trips',
    tags: 'Tags',
    about: 'About the author',
  },
  sections: {
    thoughts: 'Thoughts',
    trips: 'Trips',
    tags: 'Tags',
    about: 'About the author',
    post: 'Writing',
  },
  homeLabel: 'Start here',
  homeTitle: 'A quiet place to think out loud.',
  homeIntro:
    'This blog is not a feed. It is an archive of ideas, trips and things that matter to me.',
  paths: [
    {
      href: '/thoughts',
      title: 'Thoughts',
      body: 'Ideas and writing, in order of publication.',
    },
    {
      href: '/trips',
      title: 'Trips',
      body: 'Photos and places. No noise.',
    },
    {
      href: '/tags',
      title: 'Tags',
      body: 'Browse the archive by topic.',
    },
  ],
  latestTitle: 'Latest',
  empty: 'No posts here yet.',
  metaBy: 'Written by',
  metaPublished: 'Published',
  metaMinRead: (minutes: number) => `${minutes} min read`,
  next: 'Next post',
  prev: 'Previous post',
  tagsTitle: 'An index by word.',
  tagsIntro: 'All tags in the blog.',
  tagCount: (count: number) => (count === 1 ? '1 post' : `${count} posts`),
  aboutTitle: 'About TRIP',
  aboutIntro: 'Who writes here and why this site exists.',
  aboutBody: [
    'I am TRIP. I write about what matters to me: ideas, trips and technology.',
    'This site is my personal archive. I write when I feel like it and publish when the text is ready. No noise, no smoke.',
  ],
  notFoundTitle: 'Page not found',
  notFoundBody: 'This page does not exist. Go back home and keep exploring.',
  rights: (year: number) => `© ${year} TRIP`,
};

const dictionaries: Record<Lang, Dictionary> = { es, en };

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

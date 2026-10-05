import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '@config/site';
import { getDictionary, postLang } from '@i18n/config';

export async function GET(context) {
  const posts = await getCollection('blog');
  const enPosts = posts
    .filter((p) => postLang(p.id) === 'en')
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 20);
  const dict = getDictionary('en');
  return rss({
    title: site.name,
    description: dict.siteDescription,
    site: context.site!,
    items: enPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}`,
      author: post.data.author || site.author,
      categories: post.data.tags,
    })),
    customData: `<language>en</language>`,
  });
}
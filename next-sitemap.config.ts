import type { IConfig } from 'next-sitemap';

const config: IConfig = {
  siteUrl: process.env.NEXT_PUBLIC_URL_BLOG || 'http://localhost:3000', // URL do seu site
  generateRobotsTxt: true, // Gera robots.txt automaticamente
  exclude: [
    '/server-sitemap.xml', // Exclui sitemap gerado pelo servidor
    '/dashboard',
    '/user/profile',
    '/central_notifications',
    '/all_users',
    '/user/users_blog',
    '/user/add_user',
    '/user/profile',
    '/contacts_form/all_contacts',
    '/newsletter',
    '/categories/all_categories',
    '/categories/add_category',
    '/tags/all_tags',
    '/tags/add_tag',
    '/posts/all_posts',
    '/posts/all_posts/post/[post_id]',
    '/posts/add_post',
    '/posts/comments',
    '/marketing_publication/all_marketing_publication',
    '/marketing_publication/all_marketing_publication/[marketing_publication_id]',
    '/marketing_publication/add_marketing_publication',
    '/marketing_publication/config_interval_banner',
    '/configurations/configuration',
    '/configurations/seo_pages',
    '/configurations/seo_pages/[seo_id]'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_URL_BLOG}/server-sitemap.xml`, // Adiciona sitemaps extras
    ],
  },
}

export default config
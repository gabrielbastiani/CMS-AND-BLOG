import { IConfig } from 'next-sitemap';

const config: IConfig = {
    siteUrl: 'https://seublog.com', // Substitua pelo URL do seu blog
    generateRobotsTxt: true, // Gera o arquivo robots.txt automaticamente
    exclude: [
        '/marketing_contents/configurations_marketing',
        '/marketing_contents/add_content_marketing',
        '/marketing_contents/all_marketing_contents',
        '/marketing_contents',
        '/user/users_blog',
        '/posts/comments',
        '/posts/all_posts/post',
        '/posts/all_posts',
        '/posts/add_post',
        '/posts',
        '/tags',
        '/tags/all_tags',
        '/categories',
        '/categories/add_category',
        '/categories/all_categories',
        '/newsletter',
        '/dashboard',
        '/user/profile',
        '/user/all_users',
        '/user/add_user',
        '/contacts_form/all_contacts',
        '/central_notifications'
    ], // Rotas a serem excluídas do sitemap
    changefreq: 'daily', // Frequência de alteração das páginas
    priority: 0.7, // Prioridade padrão para as páginas
    sitemapSize: 5000, // Número máximo de URLs por sitemap
    transform: async (config, path) => {
        return {
            loc: path, // URL da página
            changefreq: 'daily',
            priority: path.includes('/noticias/') ? 1.0 : 0.7, // Prioridade mais alta para notícias
            lastmod: new Date().toISOString(), // Data de última modificação
        };
    },
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' }, // Permite acesso geral
            { userAgent: 'Googlebot', allow: '/' }, // Permite acesso específico para Googlebot
        ],
        additionalSitemaps: [
            'https://seublog.com/sitemap-articles.xml', // Adicione sitemaps personalizados, se necessário
        ],
    },
};

export default config;
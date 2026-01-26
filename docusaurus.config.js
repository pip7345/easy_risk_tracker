// @ts-check
const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Easy Risk Tracker',
  tagline: 'Comprehensive Cryptocurrency Project Risk Assessment',
  favicon: 'img/favicon.ico',
  url: 'https://easy-risk-tracker.example.com',
  baseUrl: '/',
  organizationName: 'crypto_bros',
  projectName: 'easy-risk-tracker',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.jpg',
      navbar: {
        title: 'Easy Risk Tracker',
        logo: {
          alt: 'Easy Risk Tracker Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'projectsSidebar',
            position: 'left',
            label: 'Project Assessments',
          },
          {
            href: '/methodology',
            label: 'Methodology',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Assessments',
            items: [
              {
                label: 'All Projects',
                to: '/',
              },
              {
                label: 'Methodology',
                to: '/methodology',
              },
            ],
          },
          {
            title: 'Risk Tiers',
            items: [
              {
                label: '🟢 Low Risk',
                to: '/category/low-risk',
              },
              {
                label: '🟡 Moderate Risk',
                to: '/category/moderate-risk',
              },
              {
                label: '🟠 High Risk',
                to: '/category/high-risk',
              },
              {
                label: '🔴 Critical Risk',
                to: '/category/critical-risk',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Easy Risk Tracker. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  projectsSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: '📊 Project Scores Overview',
    },
    {
      type: 'doc',
      id: 'methodology',
      label: '📋 Scoring Methodology',
    },
    {
      type: 'category',
      label: '🟢 Low Risk Projects',
      items: [
        'projects/gradient',
        'projects/grass',
        'projects/uprock',
        'projects/silencio',
        'projects/tangem',
      ],
    },
    {
      type: 'category',
      label: '🟡 Moderate Risk Projects',
      items: [
        'projects/denet',
        'projects/kast-card',
        'projects/builder',
        'projects/atleta-network',
        'projects/blockchain-sports-ecosystem',
        'projects/amplivio-corsair',
        'projects/zpln',
        'projects/texit',
        'projects/wefi',
      ],
    },
    {
      type: 'category',
      label: '🟠 High Risk Projects',
      items: [
        'projects/cha-ching',
        'projects/miracle-cash',
        'projects/iizr-playbook',
        'projects/veritas-vault',
        'projects/bg-wealth-sharing',
        'projects/bitton',
        'projects/sqwl',
        'projects/masterwealthbuilders',
        'projects/xsynergy',
        'projects/zionix-global',
        'projects/tereth',
        'projects/sosana',
        'projects/quantumfi-global',
        'projects/my-business-club',
        'projects/mario-lundqvist',
        'projects/daisey',
      ],
    },
    {
      type: 'category',
      label: '🔴 Critical Risk Projects',
      items: [
        'projects/bellator',
        'projects/xusd-x1',
      ],
    },
    {
      type: 'category',
      label: '📰 Review Sites',
      items: [
        'projects/behindmlm',
      ],
    },
  ],
};

module.exports = sidebars;

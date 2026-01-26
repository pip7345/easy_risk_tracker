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
        'projects/kast_card',
        'projects/builder',
        'projects/atleta_network',
        'projects/blockchain_sports_ecosystem',
        'projects/amplivio_corsair',
        'projects/zpln',
        'projects/texit',
        'projects/wefi',
      ],
    },
    {
      type: 'category',
      label: '🟠 High Risk Projects',
      items: [
        'projects/cha_ching',
        'projects/miracle_cash',
        'projects/iizr_playbook',
        'projects/veritas_vault',
        'projects/bg_wealth_sharing',
        'projects/bitton',
        'projects/sqwl',
        'projects/masterwealthbuilders',
        'projects/xsynergy',
        'projects/zionix_global',
        'projects/tereth',
        'projects/sosana',
        'projects/quantumfi_global',
        'projects/my_business_club',
        'projects/mario_lundqvist',
        'projects/daisey',
      ],
    },
    {
      type: 'category',
      label: '🔴 Critical Risk Projects',
      items: [
        'projects/bellator',
        'projects/xusd_x1',
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

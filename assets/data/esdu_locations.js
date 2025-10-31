// ESDU Outreach Locations Data
// Separated data file for easy editing and updates
// Supports local and global connections to ESDU Hub

const esduLocations = {
  hub: {
    name: 'ESDU Hub',
    title: 'AUB/ESDU',
    desc: 'American University of Beirut — Environment and Sustainable Development Unit Headquarters',
    lat: 33.897,
    lon: 35.478,
    logo: null,
    website: null,
    category: 'hub'
  },
  local: [
    {
      id: 'beirut',
      name: 'Beirut',
      title: 'Beirut & Mount Lebanon',
      desc: 'ESDU headquarters, urban agriculture initiatives, and community engagement programs',
      lat: 33.8938,
      lon: 35.5018,
      logo: null,
      website: null,
      category: 'community',
      type: 'local'
    },
    {
      id: 'tripoli',
      name: 'Tripoli',
      title: 'North Lebanon',
      desc: 'Community training and capacity building with small producers and local markets',
      lat: 34.438,
      lon: 35.834,
      logo: null,
      website: null,
      category: 'community',
      type: 'local'
    },
    {
      id: 'baalbek',
      name: 'Baalbek',
      title: 'Baalbek-Hermel',
      desc: 'Livestock development and climate resilience initiatives',
      lat: 34.006,
      lon: 36.208,
      logo: null,
      website: null,
      category: 'agriculture',
      type: 'local'
    },
    {
      id: 'zahle',
      name: 'Zahle',
      title: 'Beqaa Valley',
      desc: 'Agri-food value chains, capacity building and farmer extension programs',
      lat: 33.846,
      lon: 35.902,
      logo: null,
      website: null,
      category: 'agriculture',
      type: 'local'
    },
    {
      id: 'nabatieh',
      name: 'Nabatieh',
      title: 'Nabatieh Governorate',
      desc: 'Community training and outreach programs',
      lat: 33.377,
      lon: 35.483,
      logo: null,
      website: null,
      category: 'community',
      type: 'local'
    },
    {
      id: 'saida',
      name: 'Saida',
      title: 'South Lebanon',
      desc: 'Value chains and women-led MSME support programs',
      lat: 33.559,
      lon: 35.375,
      logo: null,
      website: null,
      category: 'community',
      type: 'local'
    },
    {
      id: 'akkar',
      name: 'Akkar',
      title: 'Akkar Governorate',
      desc: 'Climate resilience and emergency response programs',
      lat: 34.568,
      lon: 36.079,
      logo: null,
      website: null,
      category: 'agriculture',
      type: 'local'
    },
    {
      id: 'shouf',
      name: 'Shouf',
      title: 'Shouf Mountains',
      desc: 'Organic agriculture and traditional food preservation',
      lat: 33.693,
      lon: 35.569,
      logo: null,
      website: null,
      category: 'agriculture',
      type: 'local'
    }
  ],
  global: [
    {
      id: 'ottawa',
      name: 'Ottawa',
      title: 'IDRC',
      desc: 'International Development Research Centre — evaluation and knowledge platforms',
      lat: 45.421,
      lon: -75.697,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'brussels',
      name: 'Brussels',
      title: 'EU Partners',
      desc: 'Food systems and urban agriculture networks across Europe',
      lat: 50.846,
      lon: 4.352,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'algiers',
      name: 'Algiers',
      title: 'Algeria Partners',
      desc: 'Regional training and communication for development programs',
      lat: 36.7539,
      lon: 3.0589,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'cairo',
      name: 'Cairo',
      title: 'Egypt Network',
      desc: 'Agrifood value chains and rural development',
      lat: 30.044,
      lon: 31.236,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'tehran',
      name: 'Tehran',
      title: 'Iran Network',
      desc: 'Communication for development and agricultural extension',
      lat: 35.6892,
      lon: 51.3890,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'baghdad',
      name: 'Baghdad',
      title: 'Iraq Partners',
      desc: 'Agricultural higher education and development programs',
      lat: 33.3152,
      lon: 44.3661,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'amman',
      name: 'Amman',
      title: 'Jordan Network',
      desc: 'Extension programs and agricultural training initiatives',
      lat: 31.956,
      lon: 35.945,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'rabat',
      name: 'Rabat',
      title: 'Morocco Network',
      desc: 'Urban agriculture and multi-stakeholder initiatives',
      lat: 34.0209,
      lon: -6.8416,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'ramallah',
      name: 'Ramallah',
      title: 'Palestine Partners',
      desc: 'Value chains and urban agriculture development',
      lat: 31.9024,
      lon: 35.2062,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'damascus',
      name: 'Damascus',
      title: 'Syria Network',
      desc: 'Agricultural development and capacity building programs',
      lat: 33.5138,
      lon: 36.2765,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'tunis',
      name: 'Tunis',
      title: 'Tunisia Network',
      desc: 'Regional capacity building and knowledge management',
      lat: 36.806,
      lon: 10.181,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'sanaa',
      name: 'Sanaa',
      title: 'Yemen Network',
      desc: 'Regional training and value chain analysis programs',
      lat: 15.3494,
      lon: 44.2065,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'abu-dhabi',
      name: 'Abu Dhabi',
      title: 'UAE Partners',
      desc: 'Evaluation theory and practice mainstreaming',
      lat: 24.4539,
      lon: 54.3773,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'khartoum',
      name: 'Khartoum',
      title: 'Sudan Network',
      desc: 'Capacity building for MENA evaluators',
      lat: 15.5007,
      lon: 32.5599,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    },
    {
      id: 'amsterdam',
      name: 'Amsterdam',
      title: 'Netherlands Partners',
      desc: 'Global training and knowledge sharing platforms',
      lat: 52.3676,
      lon: 4.9041,
      logo: null,
      website: null,
      category: 'partnership',
      type: 'global'
    }
  ]
};

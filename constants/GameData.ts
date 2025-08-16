export interface GameItem {
  id: string;
  image: any;
  name: string;
  function: string;
}

export const GAME_ITEMS: GameItem[] = [
  // Level 1: Basic Male Reproductive Organs
  {
    id: 'testis',
    image: require('../assets/images/Game/Testis Sliced.png'),
    name: 'Testis',
    function: 'Menghasilkan sperma dan hormon testosteron'
  },
  {
    id: 'epididirmis',
    image: require('../assets/images/Game/Epididirmis.png'),
    name: 'Epididirmis',
    function: 'Tempat pematangan dan penyimpanan sperma'
  },
  {
    id: 'skrotum',
    image: require('../assets/images/Game/Skrotum + Testis.png'),
    name: 'Skrotum',
    function: 'Melindungi testis dan mengatur suhu'
  },
  {
    id: 'tubulus',
    image: require('../assets/images/Game/Tubulus Semifernus.png'),
    name: 'Tubulus Seminiferus',
    function: 'Tempat pembentukan dan produksi sperma'
  },
  {
    id: 'pampiniform',
    image: require('../assets/images/Game/Pampiniform Plexus + Testicular artery.png'),
    name: 'Pampiniform Plexus',
    function: 'Mengatur suhu testis melalui aliran darah'
  },
  
  // Level 2: Male External and Accessory Organs
  {
    id: 'penis',
    image: require('../assets/images/Game/Penis.png'),
    name: 'Penis',
    function: 'Organ kopulatori dan saluran pengeluaran urin'
  },
  {
    id: 'prostat',
    image: require('../assets/images/Game/Prostate Gland.png'),
    name: 'Kelenjar Prostat',
    function: 'Menghasilkan cairan prostat untuk semen'
  },
  {
    id: 'glandula_bulbo',
    image: require('../assets/images/Game/Glandula bulbuorethralis.png'),
    name: 'Glandula Bulbourethralis',
    function: 'Menghasilkan cairan pre-ejakulasi'
  },
  {
    id: 'duktus_ejaculatorius',
    image: require('../assets/images/Game/Duktus Ejaculatoris.png'),
    name: 'Duktus Ejaculatorius',
    function: 'Mengangkut semen ke uretra'
  },
  {
    id: 'uretra',
    image: require('../assets/images/Game/Urethera.png'),
    name: 'Uretra',
    function: 'Saluran kemih dan reproduksi'
  },
  
  // Level 3: Female Reproductive System
  {
    id: 'ovarium',
    image: require('../assets/images/Game/Tuba uterine, uterus, ovarium.png'),
    name: 'Ovarium dan Tuba Uterine',
    function: 'Menghasilkan sel telur dan mengangkut ovum'
  },
  {
    id: 'vagina',
    image: require('../assets/images/Game/Vagina.png'),
    name: 'Vagina',
    function: 'Reseptor semen dan jalan lahir'
  },
  {
    id: 'klitoris',
    image: require('../assets/images/Game/Klitoris.png'),
    name: 'Klitoris',
    function: 'Organ sensorik dengan 8000 ujung saraf'
  },
  {
    id: 'glandula_vestibular',
    image: require('../assets/images/Game/Glandula Vestibularis Mayor.png'),
    name: 'Glandula Vestibularis Mayor',
    function: 'Menghasilkan lubrikasi vagina'
  },
  {
    id: 'hymen_introitus',
    image: require('../assets/images/Game/Hymen dan introitus vagina .png'),
    name: 'Hymen dan Introitus Vagina',
    function: 'Struktur anatomi vestibular'
  },
  
  // Level 4: External Structures and Complete System
  {
    id: 'perineum',
    image: require('../assets/images/Game/pereneum.png'),
    name: 'Perineum',
    function: 'Dukungan organ reproduksi dan ekskresi'
  },
  {
    id: 'complete_skin',
    image: require('../assets/images/Game/All - skin.png'),
    name: 'Sistem Reproduksi dengan Kulit',
    function: 'Tampilan eksternal sistem reproduksi'
  },
  {
    id: 'complete_system',
    image: require('../assets/images/Game/All.png'),
    name: 'Sistem Reproduksi Lengkap',
    function: 'Integrasi seluruh sistem reproduksi'
  }
];

// Level progression configuration
export const GAME_LEVELS = {
  1: {
    name: "Level 1: Organ Dasar Pria",
    description: "Pelajari organ-organ dasar sistem reproduksi pria",
    items: ['testis', 'epididirmis', 'skrotum', 'tubulus', 'pampiniform'],
    timeBonus: 30,
    difficulty: 'Easy'
  },
  2: {
    name: "Level 2: Organ Aksesori Pria",
    description: "Kelenjar dan saluran tambahan sistem reproduksi pria",
    items: ['penis', 'prostat', 'glandula_bulbo', 'duktus_ejaculatorius', 'uretra'],
    timeBonus: 25,
    difficulty: 'Medium'
  },
  3: {
    name: "Level 3: Sistem Reproduksi Wanita", 
    description: "Organ-organ reproduksi wanita dan fungsinya",
    items: ['ovarium', 'vagina', 'klitoris', 'glandula_vestibular', 'hymen_introitus'],
    timeBonus: 20,
    difficulty: 'Medium'
  },
  4: {
    name: "Level 4: Sistem Lengkap",
    description: "Struktur eksternal dan sistem reproduksi komprehensif",
    items: ['perineum', 'complete_skin', 'complete_system'],
    timeBonus: 15,
    difficulty: 'Hard'
  },
  5: {
    name: "Level 5: Master Challenge",
    description: "Campuran semua organ dari level sebelumnya",
    items: ['testis', 'penis', 'ovarium', 'vagina', 'prostat', 'klitoris', 'complete_system'],
    timeBonus: 10,
    difficulty: 'Expert'
  }
};

export interface Card {
  id: string;
  type: 'image' | 'function';
  content: GameItem;
  isMatched: boolean;
  isSelected: boolean;
}

export const GAME_SETTINGS = {
  INITIAL_TIME: 75, // 1 minute 15 seconds
  POINTS_PER_MATCH: 50,
  TIME_BONUS_MULTIPLIER: 5,
  PENALTY_WRONG_MATCH: 25,
  MAX_LEVELS: 5,
}; 
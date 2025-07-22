export interface GameItem {
  id: string;
  image: any;
  name: string;
  function: string;
}

export const GAME_ITEMS: GameItem[] = [
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
  }
];

export interface Card {
  id: string;
  type: 'image' | 'function';
  content: GameItem;
  isMatched: boolean;
  isSelected: boolean;
}

export const GAME_SETTINGS = {
  INITIAL_TIME: 180, // 3 minutes
  POINTS_PER_MATCH: 100,
  TIME_BONUS_MULTIPLIER: 2,
  PENALTY_WRONG_MATCH: 10,
}; 
import { Assets } from '@/constants'

export const initialSections = [
  {
    type: 'Sensor / Temperature',
    isOpen: true, // 初期値はすべて開いた状態
    cards: [
      {
        id: 1,
        icon: Assets.LOWCODEEDITOR.skillsIcon,
        title: '気温を取得し、P01にセット',
        description: '搭載センサーから気温を取得してProject Data KeysのP01にセットする。',
      },
      {
        id: 12,
        icon: Assets.LOWCODEEDITOR.skillsIcon,
        title: '情報を取得',
        description: 'システムから情報を取得してProject Data Keysにセットする。',
      },
      {
        id: 13,
        icon: Assets.LOWCODEEDITOR.skillsIcon,
        title: '情報を取得',
        description: 'システムから情報を取得してProject Data Keysにセットする。',
      },
    ],
  },
  {
    type: 'Utility / Get Information',
    isOpen: true, // 初期値はすべて開いた状態
    cards: [
      {
        id: 2,
        icon: Assets.LOWCODEEDITOR.skillsIcon,
        title: '情報を取得',
        description: 'システムから情報を取得してProject Data Keysにセットする。',
      },
      {
        id: 3,
        icon: Assets.LOWCODEEDITOR.skillsIcon,
        title: '湿度を取得し、P02にセット',
        description: '搭載センサーから湿度を取得してProject Data KeysのP02にセットする。',
      },
      {
        id: 4,
        icon: Assets.LOWCODEEDITOR.skillsIcon,
        title: '気圧を取得し、P03にセット',
        description: '搭載センサーから気圧を取得してProject Data KeysのP03にセットする。',
      },
    ],
  },
  // 他のセクションもここに追加
]

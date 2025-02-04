import { Assets } from '@/constants'

// 初期ノードの定義
const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: {
      type: 'Root',
      image: Assets.LOWCODEEDITOR.rootIcon,
    },
    position: { x: 0, y: 50 },
  },
]
// {
//   id: '2',
//   type: 'custom',
//   data: {
//     type: 'Sequence',
//     image: Assets.LOWCODEEDITOR.sequenceIcon,
//   },
//   position: { x: 0, y: 200 },
// },
// {
//   id: '3',
//   type: 'custom',
//   data: {
//     type: 'Skill',
//     image: Assets.LOWCODEEDITOR.skillIcon,
//     skillName: 'Move to 001',
//     skillType: 'Action / Move',
//     siteData: ['S01', 'S02'],
//     // customProperties: ['の前まで移動する', 'の後ろに移動する'],
//     customProperties: 'の前まで移動する',
//     userName: '羽田美希',
//     updatedAt: '2024/9/4 18:22',
//   },
//   position: { x: -150, y: 350 },
// },
// {
//   id: '4',
//   type: 'custom',
//   data: {
//     type: 'Decorator',
//     image: Assets.LOWCODEEDITOR.decoratorIcon,
//     conditionalType: ['もしA=Bならば', 'もしA=Bでなければ'], // 条件文の選択肢
//     aValues: ['選択 1', '選択 2'], // Aの選択肢
//     bValues: ['選択 A', '選択 B'], // Bの選択肢
//     userName: '川崎吾郎',
//     updatedAt: '2024/9/4 18:22',
//   },
//   position: { x: 150, y: 350 },
// },
// {
//   id: '5',
//   type: 'custom',
//   data: {
//     type: 'Sub Tree',
//     image: Assets.LOWCODEEDITOR.subTreeIcon,
//     subTreeName: 'タオルを持つ',
//     subTreeType: 'Function / Grab',
//     customProperties: '棚からタオルを識別に掴みます。',
//   },
//   position: { x: 150, y: 600 },
// },

// 初期エッジの定義
const initialEdges = []
// { id: 'e1-2', source: initialNodes[1].id, target: initialNodes[0].id },
// { id: 'e2-3', source: initialNodes[2].id, target: initialNodes[1].id },
// { id: 'e2-4', source: '4', target: '2' },

let nodeId = 1
const getId = () => `node-${nodeId++}`
// ノードのデータを生成する関数
const generateNode = (type, position, skillData = {}) => {
  const id = getId() // ユニークなIDを生成
  switch (type) {
    case 'Decorator':
      return {
        id,
        type: 'custom',
        data: {
          type: 'Decorator',
          image: Assets.LOWCODEEDITOR.decoratorIcon,
          conditionalType: ['もしA=Bならば', 'もしA=Bでなければ'], // 条件文の選択肢
          aValues: ['選択 1', '選択 2'], // Aの選択肢
          bValues: ['選択 A', '選択 B'], // Bの選択肢
          userName: '新規ユーザー',
          updatedAt: '2024/10/05',
        },
        position,
      }
    case 'Sequence':
      return {
        id,
        type: 'custom',
        data: {
          type: 'Sequence',
          image: Assets.LOWCODEEDITOR.sequenceIcon,
        },
        position,
      }
    case 'Skill':
      return {
        id,
        type: 'custom',
        data: {
          type: 'Skill',
          image: Assets.LOWCODEEDITOR.skillIcon,
          skillName: skillData.name || 'New Skill', // デフォルト値
          skillType: skillData.schema.Node.enum || 'Action / New Move', // デフォルト値
          siteData: skillData.siteData || ['S01', 'S02'], // デフォルト値
          customProperties: skillData.description || 'まで移動する', // デフォルト値
          userName: skillData.create_user_name || '新規ユーザー', // デフォルト値
          updatedAt: skillData.update_date || '2024/10/05', // デフォルト値
          ...skillData, // skillDataの他のすべてのプロパティを展開
        },
        position,
      }
    default:
      return null
  }
}

export { generateNode, initialEdges, initialNodes }

import { Button, message } from 'antd';
import Image from 'next/image';
import { useRef } from 'react';
import { Assets } from '@/constants';
import SaveSequenceModal from './SaveSequence/SaveSeaqunceModal';

const Header = ({ onLoadData, nodes }) => {
  // ファイル選択用のinput要素を参照するためのuseRef
  const fileInputRef = useRef(null);

  // ファイルが選択された時の処理
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 選択されたファイルを取得
    if (file && file.type === 'application/json') { // JSONファイルかどうかを確認
      const reader = new FileReader(); // ファイルリーダーを使ってファイルを読み込む
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result); // ファイルの内容をパース
          if (content.nodes && content.edges) {
            // ノードとエッジのデータをonLoadData関数に渡してエディタに適用
            onLoadData(content.nodes, content.edges); // handleLoadDataを呼び出す
            message.success('データのインポートが成功しました。');
          } else {
            message.error('ファイルにノードとエッジが見つかりませんでした。');
          }
        } catch (error) {
          message.error('JSONファイルの解析に失敗しました。');
        }
      };
      reader.readAsText(file); // ファイルをテキストとして読み込む
    } else {
      message.error('JSONファイルを選択してください。');
    }
  };

  // インポートボタンがクリックされたときの処理
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // ファイル選択ダイアログを表示
    }
  };

  return (
    <div className="text-wh1te flex h-[60px] w-full items-center justify-between !bg-[#413D39] bg-black px-6 py-2">
      <div className="flex items-center gap-4 text-white">
        <div className="flex items-center">
          <Image
            src={Assets.LOWCODEEDITOR.logo}
            className="shrink-0"
            alt="gen3p"
            width={200}
            height={90}
          />
        </div>
        <div className="text-[16px] font-[600px]">Technical Preview版</div>
      </div>
      <div className="flex gap-4 text-white">
        {/* ファイル選択のinput要素 */}
        <input
          type="file"
          ref={fileInputRef} // useRefで参照するinput
          style={{ display: 'none' }} // 表示しない
          accept=".json"
          onChange={handleFileChange} // ファイル選択時の処理
        />
        {/* インポートボタン */}
        <Button
          className="!rounded !border-2 !border-white !bg-black !px-6 !text-[14px] !font-bold !text-white"
          onClick={handleImportClick} // インポートクリック時にファイル選択ダイアログを開く
        >
          Import
        </Button>
        <SaveSequenceModal nodes={nodes}>
          <Button
            className="!rounded border !bg-white !px-8 !text-[14px] !font-bold !text-black"
          >
            Save
          </Button>
        </SaveSequenceModal>
      </div>
    </div>
  );
};

export default Header;

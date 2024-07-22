const LogShowDetailContainer = () => {
  return (
    <div>
      <div className="text-lg font-semibold">ログ表示(ログ)</div>
      <div className="mb-5 text-[28px] text-dark-gray-3">/var/logs/hoge.log</div>
      <div className="h-[70vh] w-full overflow-auto rounded-lg border border-solid border-[#d5d3d2] bg-light-gray" />
    </div>
  )
}

export default LogShowDetailContainer

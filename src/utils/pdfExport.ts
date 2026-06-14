const generateTrackPdf = (data: {
  date: string
  distance: string
  duration: string
  points: Array<{
    time: string
    address: string
    battery: number
    accuracy?: number
  }>
  startAddress: string
  endAddress: string
}): string => {
  const pointsHtml = data.points.map((p, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i + 1}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${p.time}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${p.address}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${p.battery}%</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${p.accuracy ? p.accuracy + 'm' : '-'}</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>轨迹报告 - ${data.date}</title>
<style>
  body { font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #1d2129; margin: 40px; }
  h1 { color: #165dff; font-size: 24px; border-bottom: 3px solid #165dff; padding-bottom: 12px; }
  h2 { color: #4e5969; font-size: 18px; margin-top: 32px; }
  .summary { display: flex; gap: 24px; margin: 20px 0; }
  .summary-item { background: #f5f6f7; border-radius: 8px; padding: 16px 24px; flex: 1; }
  .summary-label { color: #86909c; font-size: 13px; }
  .summary-value { color: #1d2129; font-size: 20px; font-weight: 600; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { background: #165dff; color: #fff; padding: 10px 12px; text-align: left; font-size: 14px; }
  td { font-size: 13px; color: #4e5969; }
  .route { background: #f5f6f7; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .route-point { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
  .route-dot { width: 10px; height: 10px; border-radius: 50%; }
  .route-dot.start { background: #00b42a; }
  .route-dot.end { background: #f53f3f; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e6eb; color: #86909c; font-size: 12px; text-align: center; }
</style>
</head>
<body>
  <h1>轨迹报告</h1>
  <div class="summary">
    <div class="summary-item">
      <div class="summary-label">日期</div>
      <div class="summary-value">${data.date}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">总里程</div>
      <div class="summary-value">${data.distance}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">总时长</div>
      <div class="summary-value">${data.duration}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">位置点</div>
      <div class="summary-value">${data.points.length}个</div>
    </div>
  </div>

  <h2>路线摘要</h2>
  <div class="route">
    <div class="route-point"><div class="route-dot start"></div><strong>起点：</strong>${data.startAddress}</div>
    <div class="route-point"><div class="route-dot end"></div><strong>终点：</strong>${data.endAddress}</div>
  </div>

  <h2>位置点明细</h2>
  <table>
    <thead>
      <tr>
        <th>序号</th>
        <th>时间</th>
        <th>地址</th>
        <th>电量</th>
        <th>精度</th>
      </tr>
    </thead>
    <tbody>
      ${pointsHtml}
    </tbody>
  </table>

  <div class="footer">
    安全守护 · 轨迹报告 · 生成时间: ${new Date().toLocaleString('zh-CN')}
  </div>
</body>
</html>`

  return html
}

export const exportTrackPdf = async (data: Parameters<typeof generateTrackPdf>[0]): Promise<void> => {
  const { Taro } = require('@tarojs/taro')

  Taro.showLoading({ title: '生成中...' })

  try {
    const html = generateTrackPdf(data)
    const fileName = `轨迹报告_${data.date.replace(/-/g, '')}.html`

    const fs = Taro.getFileSystemManager()
    const filePath = `${Taro.env.USER_DATA_PATH}/${fileName}`
    fs.writeFileSync(filePath, html, 'utf8')

    console.log('[PDF] 文件已生成:', filePath)

    await new Promise(resolve => setTimeout(resolve, 500))
    Taro.hideLoading()

    Taro.showModal({
      title: '导出成功',
      content: `轨迹报告已生成：${fileName}\n文件保存至应用数据目录，可通过分享发送。`,
      confirmText: '分享',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          Taro.shareFileMessage({
            filePath,
            fileName,
            success: () => {
              console.log('[PDF] 分享成功')
            },
            fail: (err) => {
              console.error('[PDF] 分享失败:', err)
              Taro.showToast({ title: '分享失败', icon: 'none' })
            }
          })
        }
      }
    })
  } catch (error) {
    console.error('[PDF] 生成失败:', error)
    Taro.hideLoading()
    Taro.showToast({ title: '导出失败', icon: 'none' })
  }
}

export default generateTrackPdf

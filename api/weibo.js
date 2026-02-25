export const config = {
  runtime: 'edge'
}

const SUB = '2A25EmUF8DeRhGeFJ7lAX9ijLwzSIHXVn19y0rDV8PUNbmtB-LRb4kW9Nf7gdYjAnAvFqO5OasteygwigpDfuywPr'
const SUBP = '0033WrSXqPxfM725Ws9jqgMF55529P9D9WhUfwlkg.yhQ.8dZlDmFjDf5NHD95QNS0-ESoqcS0nRWs4Dqc_zi--fiKyhiK.Ni--Ni-8WiK.Ni--4i-8FiK.Ri--fiKy2i-2Ni--NiKLWiKnXi--4iKLhiKy2i--fiK.7iKyhi--fi-82i-2c'

export default async function handler() {
  try {
    // 1. 获取超话列表，可先取关没什么用的超话，但小心别手滑取关自担，我就干过这样的事
    const superList = await fetch('https://api.weibo.cn/2/cardlist?containerid=100803_-_followsuper', {
      headers: {
        Cookie: `SUB=${SUB}; SUBP=${SUBP}`
      }
    })

    const data = await superList.json()
    const cards = data.cards || []

    let msg = []

    // 2. 逐个签到，适合团粉，我不粉团所以不知道是否好用
    for (let card of cards) {
      if (!card.scheme) continue
      const containerid = card.scheme.match(/containerid=(\w+)/)?.[1]
      if (!containerid) continue

      const res = await fetch(`https://api.weibo.cn/2/checkin?containerid=${containerid}`, {
        headers: {
          Cookie: `SUB=${SUB}; SUBP=${SUBP}`
        }
      })

      const j = await res.json()
      const status = j.msg == 'succ' ? '签到成功啦' : j.msg || '已经签到啦'
      msg.push(card.item_title + '：' + status)
    }

    return new Response(JSON.stringify({
      code: 200,
      result: msg
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
}
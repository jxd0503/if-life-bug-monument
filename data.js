/* ============================================================
 * 《if 人生 · BUG 纪念碑》数据文件
 * 只放数据，不写任何页面逻辑。
 * 全部文案逐字来自《if人生-BUG纪念碑-剧情文案-v2超级丰富版.md》
 * ============================================================ */
window.STORY_DATA = {

  /* ---------- 属性 ---------- */
  attrs: {
    init: 5, min: 0, max: 10,
    keys: ['tech', 'guts', 'wealth', 'mindset'],
    names: { tech: '技术', guts: '胆识', wealth: '财富', mindset: '心态' }
  },

  /* ---------- 节点 0｜开场 ---------- */
  opening: {
    title: 'if 人生 · BUG 纪念碑',
    lines: [
      '墓园的夜风是凉的。',
      '这里安葬着 1024 个被修复的 bug——404 之魂、那只凌晨三点的野指针、死于拼写的变量名……它们都有名字，而你，是它们的送葬人。',
      '墓碑群的正中，立着一块空碑。',
      '碑上只有一行小字：「我的人生。」',
      '你伸手，触碰碑面。'
    ],
    enterText: '（点击进入）',
    savedText: '这里立着一座属于你的碑',
    savedStoneText: '我的人生。'
  },

  /* ---------- 主节点 ---------- */
  nodes: [
    {
      id: 1, title: '节点 1｜第一行代码', narrative: true,
      scene: [
        '时间回到 2024 年秋天，你大二，软件专业。',
        '实验室的灯还亮着。你敲下人生第一段真正跑起来的代码，屏幕弹出一行字：`Hello, World!`',
        '你盯着那行字看了很久，直到光标开始嘲笑你的感动。',
        '就在这时，微信弹了两条消息，一条来自学长，一条来自老师——你的人生，从今晚开始分叉。'
      ]
    },
    {
      id: 2, title: '节点 2｜大二的岔路',
      scene: [
        '左边，学长发来外包需求：「小项目，一周，3000 块，干不干？」',
        '右边，带队老师发来通知：「校程序设计大赛开始报名了，你来吗？」',
        '当然，你也可以当没看见，回宿舍打游戏。'
      ],
      choices: [
        {
          key: 'A', label: '接外包，先赚钱', style: '冒险',
          effects: { wealth: 2, tech: 1, guts: 1, mindset: -1 },
          achievement: 'jiafang',
          reality: [
            '你接了外包。',
            '甲方改需求的次数比你的代码行数还多。你在 deadline 前学会了通宵，也把第一批 bug 亲手埋进墓园——其中一只墓碑上写着「死于第 8 版需求」。',
            '收到尾款那天，你第一次觉得：代码，真的能换钱。'
          ],
          parallelCond: 'if 你选了 B',
          parallel: [
            '如果你报了名——你会在比赛中拿名次，简历上多一行「省级竞赛获奖」。只是你的银行卡余额，还会是两位数。'
          ],
          stone: { name: '他选择了先赚钱。', epitaph: '墓志铭：改需求的人，永远比写代码的人多。' }
        },
        {
          key: 'B', label: '报名比赛，先成长', style: '中性',
          effects: { tech: 2, mindset: 1, wealth: -1 },
          achievement: 'mvp',
          reality: [
            '你报了名。那场比赛你拿了名次，奖状夹在课本里。后来 HR 问起项目经历，你从那次比赛讲起。',
            '那个外包被另一个同学接了，他后来偶尔跟你吐槽甲方，你笑着听，不接话。'
          ],
          parallelCond: 'if 你选了 A',
          parallel: [
            '如果你接了外包——你会在第 9 遍改需求时收到尾款，提前体会「代码换钱」的快乐，也提前体会「需求永无止境」的绝望。'
          ],
          stone: { name: '他选择了先成长。', epitaph: '墓志铭：那天晚上，奖杯比月亮还亮。' }
        },
        {
          key: 'C', label: '回宿舍躺平', style: '稳健',
          effects: { mindset: 1, wealth: -1 },
          achievement: 'tangping',
          reality: [
            '你回宿舍打了一周游戏，段位上了一个大段。',
            '学期末，你看着比赛获奖名单里同学的名字，第一次觉得手里的游戏不好玩了。'
          ],
          parallelCond: 'if 你选了 A 或 B',
          parallel: [
            '如果你去了比赛或接了外包——你的人生会从那周开始加速。但你也永远不会知道，打游戏的那一周，是你大学四年里最轻松的一周。'
          ],
          stone: { name: '他选择躺平。', epitaph: '墓志铭：躺平不是结束，是给未来的自己放了个假。' }
        }
      ]
    },
    {
      id: 3, title: '节点 3｜第一份工作',
      scene: [
        '毕业那年，你手上有三份 offer：',
        'A 大厂：薪资高、title 好听，但你是上万人里的一个工位。',
        'B 创业公司：薪资低一半，但产品你说了算，CTO 拍胸脯说「这里没有螺丝钉」。',
        'C 自由接单：不用上班，但饭票得自己找。'
      ],
      choices: [
        {
          key: 'A', label: '大厂螺丝钉', style: '稳健',
          effects: { wealth: 2, tech: 1, mindset: -1, guts: -1 },
          achievement: 'luosiding',
          reality: [
            '你成了大厂的一颗螺丝钉。工牌刷开门的那一刻，你闻到了免费咖啡的味道。',
            '三年后你发现，你写过最多的代码是入职培训系统的「Hello, World!」变体。'
          ],
          parallelCond: 'if 你选了 B',
          parallel: [
            '如果去了创业公司——你会天天加班到十点，但你的名字会出现在产品致谢页的第一行。'
          ],
          stone: { name: '大厂螺丝钉。', epitaph: '墓志铭：他的一生被写进了 OKR。' }
        },
        {
          key: 'B', label: '创业冲锋', style: '冒险',
          effects: { tech: 2, guts: 2, mindset: 1, wealth: -1 },
          achievement: 'chuangye',
          reality: [
            '你加入了创业公司。前半年发不出工资，你靠泡面活着；第七个月，产品爆了。',
            '你第一次体验「加班到凌晨但心甘情愿」。'
          ],
          parallelCond: 'if 你选了 A',
          parallel: [
            '如果去了大厂——你的工牌会很体面，余额会很安全，只是你不知道自己每天都在为什么写代码。'
          ],
          stone: { name: '创业冲锋者。', epitaph: '墓志铭：他把青春烧成了产品里的一行代码。' }
        },
        {
          key: 'C', label: '自由猎手', style: '冒险',
          effects: { guts: 2, wealth: 1, tech: 1, mindset: -1 },
          achievement: 'lieshou',
          reality: [
            '你自由了。上午十点还在床上，凌晨两点还在改需求。你学会了谈价格、催款，和「甲方说好的尾款呢」。'
          ],
          parallelCond: 'if 你选了 A',
          parallel: [
            '如果去了大厂——你会有稳定的工资和工位，但你的想象力会在制度里慢慢生锈。'
          ],
          stone: { name: '自由猎手。', epitaph: '墓志铭：他不在任何工位上，他在任何地方。' }
        }
      ]
    },
    {
      id: 4, title: '节点 4｜第一次上线事故',
      scene: [
        '时间跳到你的「食堂订餐系统」上线那天。',
        '凌晨 2:07，手机在桌上震个不停：线上报错，服务挂了。群消息一条接一条，最后一条是产品经理的：「在吗？」',
        '你的手停在电源键上。屏幕已经熄了，但你的心已经亮了——那是恐慌的光。'
      ],
      choices: [
        {
          key: 'A', label: '打开电脑，连夜修', style: '冒险',
          effects: { tech: 2, guts: 1, mindset: -1 },
          reality: [
            '你修到凌晨 4:02。真相是一个变量名拼写错误——它躺在代码里，像一颗定时炸弹。你把它埋进墓园，墓碑上刻「死于拼写」。',
            '第二天你在课堂上睡成一滩，但那个凌晨，你觉得自己像个真正的工程师。'
          ],
          parallelCond: 'if 你选了 B',
          parallel: [
            '如果你回滚了——你会睡个整觉，第二天十分钟定位问题。你会学会「先让系统活着」，但也会错过那个属于工程师的凌晨 4 点。'
          ],
          stone: { name: '死于一个拼写错误，卒于凌晨 4:02。', epitaph: '墓志铭：我明明记得我改了。' }
        },
        {
          key: 'B', label: '先回滚，天亮再说', style: '稳健',
          effects: { mindset: 1, wealth: 1, tech: 1 },
          achievement: 'huigun',
          reality: [
            '你回滚了。睡了整觉，第二天在日志里十分钟定位问题，修完一切如常。',
            '你学会了一件事：先让系统活着，再谈理想。'
          ],
          parallelCond: 'if 你选了 A',
          parallel: [
            '如果你连夜修——你会找到那个拼写错误，成就感拉满，代价是第二天的黑眼圈和课堂睡姿。'
          ],
          stone: { name: '他学会了回滚。', epitaph: '墓志铭：有时候，撤退也是一种部署。' }
        },
        {
          key: 'C', label: '先甩锅，说是测试环境的问题', style: '中性',
          effects: { mindset: -1, guts: -2, tech: -2, wealth: -1 },
          reality: [
            '你甩了锅。群里安静了，但第二天，测试环境真的崩了——而这一次，所有人都看着你。',
            '那晚你学会了人生中最贵的一课：锅会飞回来的。'
          ],
          parallelCond: 'if 你选了 A 或 B',
          parallel: [
            '如果你连夜修或回滚了——你会成为群里被点赞的那个人。而甩锅的那条路，通向的是没人敢把项目交给你的未来。'
          ],
          stone: { name: '他甩锅的那晚，锅自己飞回来了。', epitaph: '墓志铭：这口锅，是他背过最重的东西。' }
        }
      ]
    },
    {
      id: 5, title: '节点 5｜深夜的那只 bug',
      scene: [
        '某个深夜，你盯着屏幕上的 bug 已经三个小时。',
        '这个功能你写了三版，第三版终于能跑，但它偶尔会抽风，你找不到原因。室友都睡了，键盘的光、屏幕的光，和你亮着的眼。',
        '桌面上躺着一杯冷掉的咖啡。',
        '你心里有三个声音在打架。'
      ],
      choices: [
        {
          key: 'A', label: '再试最后一次', style: '冒险',
          effects: { tech: 2, guts: 1, mindset: -1 },
          achievement: 'yemaozi',
          reality: [
            '第四版，你终于找到了。它藏在一个你从没怀疑过的函数里，小得可怜，坏得彻底。',
            '你盯着屏幕笑了很久，截图发朋友圈：「找到了，晚安。」那晚你睡得很沉，梦里，那只 bug 变成一块小墓碑，向你挥了挥手。'
          ],
          parallelCond: 'if 你选了 B',
          parallel: [
            '如果你关机了——第二天你十分钟就找到它。你可能会想：昨晚再多撑十分钟就好了。但其实不会，有些 bug，就是要熬到你亲手抓到它，才肯服气。'
          ],
          stone: { name: '他选择再试最后一次。', epitaph: '墓志铭：凌晨 1:47 绳之以法。碑角画了一个小小的 ✓。' }
        },
        {
          key: 'B', label: '关电脑，明天再战', style: '稳健',
          effects: { mindset: 2, tech: 1 },
          reality: [
            '你关了电脑。第二天神清气爽，十分钟找到那个 bug——它躲在一个 if 条件写反的地方。',
            '你发现一个真理：有些 bug 怕黑，天亮就自己出来了。'
          ],
          parallelCond: 'if 你选了 A',
          parallel: [
            '如果你继续——你会熬到凌晨 3 点，找到它，成就感爆棚，然后在课桌上睡掉半节课。'
          ],
          stone: { name: '他选择先睡。', epitaph: '墓志铭：有些 bug 怕黑，天亮就自己出来了。' }
        },
        {
          key: 'C', label: '推倒重写，换个思路', style: '冒险',
          effects: { tech: 2, guts: 1, mindset: -1 },
          reality: [
            '你把三版代码全部删掉，从零重写。第二天晚上，第四版跑起来了，干净得不可思议。',
            '你意识到：有些 bug 不是修出来的，是删出来的。'
          ],
          parallelCond: 'if 你选了 A 或 B',
          parallel: [
            '如果修或睡——你会保住那三版代码。但它们会像旧衣服一样，在以后的每个深夜提醒你：重写，其实没那么可怕。'
          ],
          stone: { name: '他选择了重写。', epitaph: '墓志铭：DELETE 是最高级的修复。' }
        }
      ]
    },
    {
      id: 6, title: '节点 6｜职业瓶颈',
      scene: [
        '几年过去，你成了团队里的老人。熟悉你的人都走了，新来的小朋友叫你「哥」。工资涨得没有房租快，代码写得没有新框架快。',
        '某个深夜，你盯着自己三年前写的代码，第一次问：就这样了吗？'
      ],
      choices: [
        {
          key: 'A', label: '跳槽，拿更高的薪资', style: '中性',
          effects: { wealth: 2, tech: 1, mindset: -1 },
          reality: [
            '你跳了槽，薪资涨了 40%。新公司的一切都要重新学，你像新人一样熬夜。',
            '半年后你发现：你只是换了一个地方，继续写一样的代码。'
          ],
          parallelCond: 'if 你选了 C',
          parallel: [
            '如果你 All in——你会经历零收入的恐慌，也会等来产品被推荐的夜晚。跳槽是安全的，但那个「被挤爆」的夜晚不会属于你。'
          ],
          stone: { name: '他选择了跳槽。', epitaph: '墓志铭：工资是涨了，Bug 还是那几个。' }
        },
        {
          key: 'B', label: '内部转岗，去做新产品', style: '稳健',
          effects: { tech: 2, mindset: 1 },
          reality: [
            '你转岗去做新产品。从零开始，没人知道怎么做，但也没人告诉你不能这么做。',
            '一年后，新产品成了公司增长最快的一条线，你的名字排在立项名单的第一个。'
          ],
          parallelCond: 'if 你选了 C',
          parallel: [
            '如果你 All in——你会赌上所有积蓄。转岗是稳的，但它给不了你「生死由我」的那种痛快。'
          ],
          stone: { name: '他选择了转岗。', epitaph: '墓志铭：换个战场，重新开局。' }
        },
        {
          key: 'C', label: 'All in，自己出来做产品', style: '冒险',
          effects: { guts: 2, tech: 1, wealth: -1, mindset: -1 },
          achievement: 'allin',
          reality: [
            '你 All in 了。前三个月零收入，第四个月产品被一个博主推荐，服务器被挤爆——你一边哭一边加服务器。',
            '那是你人生中最好的一次崩溃。'
          ],
          parallelCond: 'if 你选了 B',
          parallel: [
            '如果你转岗——产品会晚半年上线，错过那波流量，但你的余额很安全，你也不会在凌晨三点对着账单失眠。'
          ],
          stone: { name: '他选择了 All in。', epitaph: '墓志铭：服务器崩掉的那一刻，是他人生中最好的崩溃。' }
        }
      ]
    },
    {
      id: 7, title: '节点 7｜人生的另一半',
      scene: [
        '深夜十一点，你合上电脑。手机屏幕亮着，有人给你发消息。',
        '那是三种不同的人生。'
      ],
      choices: [
        {
          key: 'A', label: '和程序员同行在一起', style: '中性',
          effects: { mindset: 2, tech: 1 },
          reality: [
            '你们在深夜一起修过 bug，在凌晨一起部署过版本。她/他懂你的报错，你懂她/他的崩溃。',
            '后来你们有了一个约定：谁先找到 bug，谁请喝奶茶。'
          ],
          parallelCond: 'if 你选了 C',
          parallel: [
            '如果你选择事业——你会拥有更多的时间写代码，但深夜十一点合上电脑时，屏幕的暗光会显得特别空。'
          ],
          stone: { name: '他选择与代码同行者相爱。', epitaph: '墓志铭：她/他懂他的报错，他懂她/他的崩溃。' }
        },
        {
          key: 'B', label: '和完全不懂代码的 TA 在一起', style: '稳健',
          effects: { mindset: 2, wealth: 1 },
          reality: [
            'TA 不懂什么是 `null`，但 TA 懂你什么时候需要一杯热牛奶。',
            '你们的分工是：TA 负责生活，你负责梦想。后来你的产品简介里，永远有一句「致我的产品经理」。'
          ],
          parallelCond: 'if 你选了 A',
          parallel: [
            '如果和同行在一起——你们会有聊不完的共同话题，也会有两个人都想加班、没人做饭的夜晚。'
          ],
          stone: { name: '他选择与生活相爱。', epitaph: '墓志铭：她/他看不懂你的代码，但看懂了你的全部。' }
        },
        {
          key: 'C', label: '先搞事业，感情随缘', style: '冒险',
          effects: { wealth: 2, mindset: -1, tech: -1 },
          reality: [
            '你把所有时间给了事业。项目一个个上线，你的名字越来越亮，但你的朋友圈越来越空。',
            '某个深夜你突然发现，你已经很久没有跟人说过「晚安」了。'
          ],
          parallelCond: 'if 你选了 A 或 B',
          parallel: [
            '如果你选择了爱情——你的人生会多一个人分享。而这条「事业优先」的路，通向的是一间只有键盘声的房间。'
          ],
          stone: { name: '他选择了事业。', epitaph: '墓志铭：他 build 了整个世界，唯独忘了 build 自己的生活。' }
        }
      ]
    },
    {
      id: 8, title: '节点 8｜行业寒冬',
      scene: [
        '行业迎来寒冬。裁员名单在群里流传，HC 全部冻结，年终奖打了三折。',
        '你坐在工位上，收到三条消息，分别来自三条路。'
      ],
      choices: [
        {
          key: 'A', label: '降薪保工作', style: '稳健',
          effects: { mindset: -1, wealth: -1, tech: 1 },
          reality: [
            '你接受了降薪。裁员名单出来那天，你的名字不在上面。',
            '你开始在下班后写自己的开源项目——因为你知道，把命运放在别人的资产负债表上，是最危险的事。'
          ],
          parallelCond: 'if 你选了 B',
          parallel: [
            '如果你裸辞——你会赌上所有积蓄。降薪是委屈的，但「安全」二字，在寒冬里比金子还贵。'
          ],
          stone: { name: '他选择了冬眠。', epitaph: '墓志铭：活着过冬，就是胜利。' }
        },
        {
          key: 'B', label: '裸辞，再赌一次', style: '冒险',
          effects: { guts: 2, wealth: -2, mindset: 1 },
          reality: [
            '你裸辞了。朋友们说你疯了，你把积蓄分成十二份，告诉自己：只有一年。',
            '第六个月，你的产品上线，第七个月，它带来第一笔收入。不多，但够你请自己吃一顿好的。'
          ],
          parallelCond: 'if 你选了 A',
          parallel: [
            '如果你降薪——你会安全地过完冬天，但「如果当初赌一把」这个问题，会跟你好多年。'
          ],
          stone: { name: '他选择在寒冬里点火。', epitaph: '墓志铭：火不大，但够暖。' }
        },
        {
          key: 'C', label: '转行，但不离开代码', style: '中性',
          effects: { mindset: 1, wealth: 2, tech: 0 },
          reality: [
            '你转行了——去做技术文档、开源社区、编程培训。你发现：代码之外，还有代码。',
            '你帮过的那些新人，后来叫你「老师」。这个称呼，比「资深工程师」让你更开心。'
          ],
          parallelCond: 'if 你选了 A 或 B',
          parallel: [
            '如果你降薪或裸辞——你会继续在代码一线。但「转行不离开代码」这条路，会让你发现：你爱的从来不是工作，是 Build。'
          ],
          stone: { name: '他离开了战场，没有离开代码。', epitaph: '墓志铭：他不写生产环境的代码了，他写的是未来。' }
        }
      ]
    },
    {
      id: 9, title: '节点 9｜第 1024 次修 bug', final: true,
      scene: [
        '某个深夜，你刚修完第 1024 个 bug。',
        '屏幕突然一暗，又亮起一行字：',
        '「你已经修复了 1024 个 bug。」',
        '「想看看它们吗？」',
        '墓园在你眼前铺开，一望无际。1024 块墓碑，每一块都亮着微弱的光。它们都在等你。',
        '风停了一下。'
      ],
      choices: [
        { key: 'A', label: '抬头，看看它们' },
        { key: 'B', label: '不了，还有下一个 bug 在等我' }
      ]
    }
  ],

  /* ---------- 隐藏节点 ---------- */
  hidden: {
    H1: {
      id: 'H1', title: '隐藏节点 H1｜红蓝药丸', triggerDesc: '连续 3 次 [冒险] 触发',
      scene: [
        '深夜，你的屏幕上突然弹出一条没有来源的消息：',
        '「你的人生重复了 1024 次。每一次，你都选了同一条路。想看看真相吗？」',
        '桌上出现两粒药丸，一粒红，一粒蓝。'
      ],
      choices: [
        {
          key: 'A', label: '吞下红色药丸', style: '冒险',
          effects: { guts: 2 }, flag: 'redPill',
          ending: [
            '世界在你眼前碎裂成数据流。你看见自己人生中修过的所有 bug——它们其实是同一个 bug 的 1024 种变体。',
            '你笑了：原来我一直在修自己。'
          ],
          stone: { name: '觉醒者。', epitaph: '墓志铭：Matrix 里没有 bug，只有未定义的行为。' }
        },
        {
          key: 'B', label: '吞下蓝色药丸', style: '稳健',
          effects: { mindset: 2 },
          ending: [
            '你吞下蓝色药丸，世界恢复原样。你不知道刚才发生了什么，只觉得心情很好。',
            '你关掉屏幕，睡了一个多年来最安稳的觉。'
          ],
          stone: { name: '他选择不知道。', epitaph: '墓志铭：无知是福，sleep 是药。' }
        }
      ]
    },
    H2: {
      id: 'H2', title: '隐藏节点 H2｜隐居大佬的邀请', triggerDesc: '连续 3 次 [稳健] 触发',
      scene: [
        '你的邮箱收到一封没有署名的邮件：',
        '「我维护着一个没有名字的开源项目，活了 20 年。修过 1024 个 bug，没有一个 bug 知道我的名字。想不想来当守墓人？」'
      ],
      choices: [
        {
          key: 'A', label: '接受邀请', style: '稳健',
          effects: { mindset: 2 }, flag: 'gravekeeper',
          ending: [
            '你接受了。从此你是 1024 个 bug 的守墓人，也是无数开源项目的无名维护者。',
            '你活在每一个 commit 里，没有人知道你的名字。'
          ],
          stone: { name: '无名者。', epitaph: '墓志铭：他的代码没有版权，但他的守护没有期限。' }
        },
        {
          key: 'B', label: '婉拒，继续自己的路', style: '冒险',
          effects: { guts: 1, mindset: 1 },
          ending: [
            '你婉拒了。你回了一封邮件：「谢谢，但我还想在自己的代码里，多折腾几年。」',
            '对方回了一个字：「好。」'
          ],
          stone: { name: '他拒绝了隐居。', epitaph: '墓志铭：江湖还没腻，再写几年。' }
        }
      ]
    },
    H3: {
      id: 'H3', title: '隐藏节点 H3｜风口', triggerDesc: '财富 ≥ 7 且 胆识 ≥ 7 触发',
      scene: [
        '你账户里的数字和心里的火都到了一个临界点。朋友在饭局上压低声音：「AI 风口，All in 吗？」'
      ],
      choices: [
        {
          key: 'A', label: 'All in 风口', style: '冒险',
          effectsRandom: [{ wealth: 3 }, { wealth: -3 }],
          effectPreview: '财富 +3 或 -3（随机）',
          ending: [
            '你 All in 了。半年后，风口起飞或坠落——你的人生被这一次选择改写了方向。',
            '无论结果如何，你后来总说：不后悔。'
          ],
          stone: { name: '他赌过风口。', epitaph: '墓志铭：风来了他没躲，这就够了。' }
        },
        {
          key: 'B', label: '落袋为安', style: '稳健',
          effects: { wealth: 2, mindset: 1 },
          ending: [
            '你落袋为安。风口起飞时你错过了一夜暴富，风口坠落时你也躲过了一夜归零。',
            '你后来明白：财富自由不自由不重要，睡得着觉才重要。'
          ],
          stone: { name: '他选择了落袋。', epitaph: '墓志铭：他错过的都是泡沫，他拿住的都是生活。' }
        }
      ]
    }
  },

  /* ---------- 随机事件池 ---------- */
  events: [
    { id: 'ev1', text: '咖啡机坏了，你被迫早睡', effects: { mindset: 1 } },
    { id: 'ev2', text: '硬盘坏了，但你的备份救了你', note: '你开始相信万物皆可 git', effects: { tech: 1, mindset: 1 } },
    { id: 'ev3', text: '猎头深夜来电，报价翻倍', note: '你失眠了一晚', effects: { wealth: 1, mindset: -1 } },
    { id: 'ev4', text: '甲方深夜 @ 你改需求', effects: { mindset: -1, wealth: 1 } },
    { id: 'ev5', text: '你写的工具被陌生人在网上夸了', effects: { mindset: 2 } },
    { id: 'ev6', text: '浏览器更新，你的插件一夜之间全废', effects: { tech: 1, mindset: -1 } }
  ],

  /* ---------- 九种终局结局 ---------- */
  endings: {
    E1: {
      id: 'E1', name: '传奇·开源大神', conditionDesc: '技术 ≥ 8 且 胆识 ≥ 7',
      lines: [
        '你抬起头。1024 块墓碑亮成一片星空，而你站在最亮的地方。',
        '后来，你的名字出现在无数人的依赖文件里——不是依赖，是信仰。',
        '你的开源协议只有一行：自由、开放、永不收费。'
      ],
      epitaph: '他的一生是一个开源协议。Star 数：1024 万。'
    },
    E2: {
      id: 'E2', name: '人生赢家', conditionDesc: '财富 ≥ 8 且 心态 ≥ 7',
      lines: [
        '你抬起头，看见的不是墓碑，是 1024 次选择的回报。',
        '你提前退休，在海边的小屋里写着一个没人用的编译器——你说，这是给 20 年前的自己写的回信。'
      ],
      epitaph: '他实现了财富自由，然后回来继续写代码。墓志铭：快乐是最高级的语言。'
    },
    E3: {
      id: 'E3', name: '平凡而幸福', conditionDesc: '以上均不满足（兜底）',
      lines: [
        '你抬起头。没有烟花，没有掌声。1024 块墓碑安安静静，像你这一生安安静静的选择。',
        '你笑了笑，关掉页面，去接孩子放学。'
      ],
      epitaph: '他的一生没有传奇，但每一行代码都有人用。墓志铭：平凡，是他给自己的最高评价。'
    },
    E4: {
      id: 'E4', name: '燃尽', conditionDesc: '心态 ≤ 3 且 胆识 ≥ 6',
      lines: [
        '你抬起头，发现自己正站在一块墓碑前——碑上刻着你的名字。',
        '原来你已经在这里躺了很久。1024 个 bug 修完了，你忘了给自己留一个休息的 bug。'
      ],
      epitaph: '他燃尽了自己，把光留给了 1024 个 bug。墓志铭：记得 sleep(8)。'
    },
    E5: {
      id: 'E5', name: '逃离·咖啡店', conditionDesc: '心态 ≤ 4 且 财富 ≥ 4',
      lines: [
        '你抬起头，看见的不是墓园，是一间咖啡店的招牌。',
        '你终于承认：代码不是你的归宿，但它是你来时的路。',
        '咖啡店开业那天，你对所有程序员打八折。'
      ],
      epitaph: '他逃离了 Bug，却没有逃离 Build。墓志铭：拿铁，谢谢，不要 bug。'
    },
    E6: {
      id: 'E6', name: '隐居·守墓人', conditionDesc: '隐藏节点 H2 选了「接受邀请」',
      lines: [
        '你接受了那封匿名邮件。从此，你是 1024 个 bug 的守墓人，也是无数开源项目的无名维护者。',
        '你活在每一个 commit 里，没有人知道你的名字，但每个深夜，都有一盏灯为你亮着。'
      ],
      epitaph: '无名者。墓志铭：他的代码没有版权，但他的守护没有期限。'
    },
    E7: {
      id: 'E7', name: '觉醒', conditionDesc: '隐藏节点 H1 选了「红药丸」',
      lines: [
        '世界在你眼前碎裂成数据流。你看见自己人生中修过的所有 bug——它们是同一个 bug 的 1024 种变体。',
        '你笑了：原来我一直在修自己。',
        '从那天起，你写下的每一行代码，都像第一次写的那样新鲜。'
      ],
      epitaph: '觉醒者。墓志铭：Matrix 里没有 bug，只有未定义的行为。'
    },
    E8: {
      id: 'E8', name: '1024 高光', conditionDesc: '节点 9 选 A 且 技术 ≥ 8',
      lines: [
        '1024 块墓碑依次亮起，像一片缓缓点亮的星空。所有碑文汇聚成一个句子，在你眼前拼成：',
        '「这些都不是 bug。」',
        '「是你 Build 过的证明。」',
        '墓园尽头立起一块新碑，碑上刻着整个作品的名字：《if 人生 · BUG 纪念碑》。'
      ],
      epitaph: '献给每一个还在 Build 的人。'
    },
    E9: {
      id: 'E9', name: '未完待续', conditionDesc: '节点 9 选了 B（无论属性）',
      lines: [
        '你关掉了墓园页面。光标回到代码里，一闪一闪，像一座还没刻字的新墓碑。',
        '屏幕右下角弹出一行小字：「下一个 bug，已经在路上了。」'
      ],
      epitaph: '留白。碑文：未完待续。'
    }
  },

  /* 终局判定优先级（节点 9 选 A 时按此顺序判定） */
  endingPriority: ['E7', 'E6', 'E1', 'E8', 'E2', 'E4', 'E5', 'E3'],

  /* ---------- 成就（按剧情文档表格） ---------- */
  achievements: [
    { id: 'jiafang',    name: '甲方爸爸',   desc: '节点 2 选 A',                cond: { type: 'choice', node: 2, key: 'A' } },
    { id: 'mvp',        name: 'MVP 之王',   desc: '节点 2 选 B',                cond: { type: 'choice', node: 2, key: 'B' } },
    { id: 'tangping',   name: '躺平大师',   desc: '节点 2 选 C',                cond: { type: 'choice', node: 2, key: 'C' } },
    { id: 'luosiding',  name: '大厂螺丝钉', desc: '节点 3 选 A',                cond: { type: 'choice', node: 3, key: 'A' } },
    { id: 'chuangye',   name: '创业冲锋者', desc: '节点 3 选 B',                cond: { type: 'choice', node: 3, key: 'B' } },
    { id: 'lieshou',    name: '自由猎手',   desc: '节点 3 选 C',                cond: { type: 'choice', node: 3, key: 'C' } },
    { id: 'huigun',     name: '回滚大师',   desc: '节点 4 选 B',                cond: { type: 'choice', node: 4, key: 'B' } },
    { id: 'yemaozi',    name: '夜猫子',     desc: '节点 5 选 A',                cond: { type: 'choice', node: 5, key: 'A' } },
    { id: 'allin',      name: 'All in 勇者', desc: '节点 6 选 C',               cond: { type: 'choice', node: 6, key: 'C' } },
    { id: 'wenru',      name: '稳如老狗',   desc: '连续 3 次 [稳健] 并触发 H2', cond: { type: 'hidden', hidden: 'H2' } },
    { id: 'maoxian',    name: '冒险狂徒',   desc: '连续 3 次 [冒险] 并触发 H1', cond: { type: 'hidden', hidden: 'H1' } },
    { id: 'zhenxiang',  name: '真相探秘者', desc: '解锁任意隐藏节点',           cond: { type: 'anyHidden' } },
    { id: 'jianzheng',  name: '1024 见证者', desc: '完成一次全流程',            cond: { type: 'complete' } },
    { id: 'shoucang',   name: '墓碑收藏家', desc: '图鉴收集 ≥ 15 块',           cond: { type: 'collection', count: 15 } },
    { id: 'duomian',    name: '多面人生',   desc: '达成 ≥ 3 种不同结局',        cond: { type: 'endings', count: 3 } }
  ],

  /* ---------- 墓碑图鉴（共 27 块：节点 2-8 × 3 + 隐藏节点 × 2） ---------- */
  collection: {
    total: 27,
    special404: { no: 404, name: '404 之魂', epitaph: '他不是不见了，他只是没找到' }
  },

  /* ---------- 个人纪念碑：短句映射表 ---------- */
  phraseMap: {
    2: { A: { short: '先赚钱',     end: '学会了第一课：改需求的人永远比写代码的人多' },
         B: { short: '先成长',     end: '那晚的奖杯比月亮还亮' },
         C: { short: '先躺平',     end: '给自己放了一个假' } },
    3: { A: { short: '进了大厂',   end: '他的一生被写进了 OKR' },
         B: { short: '冲了创业',   end: '把青春烧成了产品里的一行代码' },
         C: { short: '做了自由猎手', end: '他不在任何工位上，他在任何地方' } },
    4: { A: { short: '连夜修',     end: '凌晨 4:02 的月光见证了他的固执' },
         B: { short: '先回滚',     end: '他学会了撤退也是一种部署' },
         C: { short: '甩了锅',     end: '那口锅最后飞了回来' } },
    5: { A: { short: '再试一次',   end: '凌晨 1:47 绳之以法' },
         B: { short: '先睡觉',     end: '有些 bug 怕黑，天亮就自己出来了' },
         C: { short: '推倒重写',   end: 'DELETE 是最高级的修复' } },
    6: { A: { short: '跳了槽',     end: '工资涨了，Bug 还是那几个' },
         B: { short: '转了岗',     end: '换个战场，重新开局' },
         C: { short: 'All in',    end: '服务器崩掉时他哭得最痛快' } },
    9: { A: { short: '回头看了看它们', end: '他带走了 1024 个证明' },
         B: { short: '继续写下一行',   end: '他留下了未完待续' } }
  },

  monumentTemplate: '他选择了{n2s}，于是{n2e}；他选择了{n3s}，于是{n3e}；他选择了{n4s}，于是{n4e}；他选择了{n5s}，于是{n5e}；他选择了{n6s}，于是{n6e}；在第 1024 次修 bug 的那个深夜，他选择了{n9s}——{endingName}。',

  /* ---------- 玩家标签（按优先级） ---------- */
  tags: [
    { id: 'legend',  name: '传奇 Builder',       cond: { tech: 8, guts: 7 } },
    { id: 'winner',  name: '人生赢家 Builder',   cond: { wealth: 8, mindset: 7 } },
    { id: 'awaken',  name: '觉醒 Builder',       cond: { flag: 'redPill' } },
    { id: 'keeper',  name: '守墓 Builder',       cond: { flag: 'gravekeeper' } },
    { id: 'sleepy',  name: '需要 sleep 的 Builder', cond: { mindsetMax: 4 } },
    { id: 'onroad',  name: '在路上的 Builder',   cond: {} }
  ],

  /* ---------- 分享卡片文案 ---------- */
  shareCard: {
    title: 'if 人生 · BUG 纪念碑',
    subtitle: '献给每一个还在 Build 的人',
    footer: '—— 用 TRAE 建造 ——'
  },

  /* ---------- 彩蛋 ---------- */
  easterEggs: {
    konami1024: { sequence: ['1', '0', '2', '4'], text: '1024 快乐，Builder。' },
    consoleText: '如果你能看到这条消息，说明你和我一样，喜欢在控制台里找彩蛋。——来自 1024 号墓地管理员',
    moonText: '守墓人也在看着你。'
  }
};

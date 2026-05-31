import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { slug: 'poe', sortOrder: 0, icon: '🔌', en: { name: 'POE Power Supplies', subtitle: 'IEEE 802.3af/at/bt Compliant' }, zh: { name: 'POE电源适配器', subtitle: '符合IEEE 802.3af/at/bt标准' } },
  { slug: 'adapter', sortOrder: 1, icon: '🔋', en: { name: 'Power Adapters', subtitle: 'Global Certifications' }, zh: { name: '电源适配器', subtitle: '全球认证' } },
  { slug: 'open-frame', sortOrder: 2, icon: '📦', en: { name: 'Open Frame Power Supplies', subtitle: 'Industrial & Medical Grade' }, zh: { name: '裸板电源', subtitle: '工业医疗级' } },
  { slug: 'ups', sortOrder: 3, icon: '⚡', en: { name: 'UPS Systems', subtitle: 'Line Interactive & Online Double Conversion' }, zh: { name: 'UPS不间断电源', subtitle: '在线互动式与双转换在线式' } },
  { slug: 'inverter', sortOrder: 4, icon: '🔄', en: { name: 'Power Inverters', subtitle: 'Pure Sine Wave & Solar Ready' }, zh: { name: '逆变器', subtitle: '纯正弦波 太阳能兼容' } },
  { slug: 'power-station', sortOrder: 5, icon: '🔋', en: { name: 'Portable Power Stations', subtitle: 'Clean Energy Anywhere' }, zh: { name: '便携储能电源', subtitle: '清洁能源 随时随地' } },
  { slug: 'all-in-one', sortOrder: 6, icon: '🏠', en: { name: 'All-in-One Solar Systems', subtitle: 'Complete Home Energy Solution' }, zh: { name: '一体机储能系统', subtitle: '完整家庭能源方案' } },
  { slug: 'micro-inverter', sortOrder: 7, icon: '☀️', en: { name: 'Micro Inverters', subtitle: 'Module-Level MPPT' }, zh: { name: '微型逆变器', subtitle: '组件级MPPT' } },
  { slug: 'industrial', sortOrder: 8, icon: '🏭', en: { name: 'Industrial Power Supplies', subtitle: 'DIN Rail & Heavy Duty' }, zh: { name: '工业电源', subtitle: '导轨式与重载型' } },
]

const products: Array<{
  slug: string; categorySlug: string; sortOrder: number; featured: boolean; priceCents: number
  en: { name: string; subtitle: string; description: string; features: string[] }
  zh: { name: string; subtitle: string; description: string; features: string[] }
  specs: { en: { label: string; value: string }[]; zh?: { label: string; value: string }[] }
  certifications: { name: string }[]
}> = [
  {
    slug: 'poe-60w', categorySlug: 'poe', sortOrder: 0, featured: true, priceCents: 5999,
    en: { name: 'POE-60W Industrial PoE Injector', subtitle: '60W High-Power PoE++', description: 'The POE-60W is an industrial-grade Power over Ethernet injector compliant with IEEE 802.3bt Type 4, delivering up to 60W of power over a single CAT6A cable. Designed for PTZ cameras, wireless APs, and IoT gateways in harsh environments.', features: ['IEEE 802.3af/at/bt compliant', 'Up to 60W output power', 'Wide input 100-240VAC', 'Operating temp: -40°C to +75°C', 'Overload / Short circuit / OVP protection', 'DIN rail or wall mount'] },
    zh: { name: 'POE-60W 工业级PoE供电器', subtitle: '60W大功率PoE++', description: 'POE-60W是一款符合IEEE 802.3bt Type 4标准的工业级以太网供电器，通过单根CAT6A线缆可提供高达60W功率。适用于球机摄像头、无线AP和物联网网关等严苛环境。', features: ['符合IEEE 802.3af/at/bt标准', '最高60W输出功率', '宽电压输入100-240VAC', '工作温度：-40°C至+75°C', '过载/短路/过压保护', 'DIN导轨或壁挂安装'] },
    specs: { en: [{ label: 'Output Power', value: '60W max (PoE++)' }, { label: 'Input Voltage', value: '100-240VAC, 50/60Hz' }, { label: 'Output Voltage', value: '52-57VDC' }, { label: 'Efficiency', value: '>88%' }, { label: 'Operating Temp', value: '-40°C ~ +75°C' }, { label: 'Protection', value: 'OVP/OCP/SCP/OTP' }, { label: 'Certification', value: 'CE, FCC, RoHS' }], zh: [{ label: '输出功率', value: '60W最大(PoE++)' }, { label: '输入电压', value: '100-240VAC, 50/60Hz' }, { label: '输出电压', value: '52-57VDC' }, { label: '效率', value: '>88%' }, { label: '工作温度', value: '-40°C ~ +75°C' }, { label: '保护功能', value: '过压/过流/短路/过温' }, { label: '认证', value: 'CE, FCC, RoHS' }] },
    certifications: [{ name: 'CE' }, { name: 'FCC' }, { name: 'RoHS' }],
  },
  {
    slug: 'poe-30w', categorySlug: 'poe', sortOrder: 1, featured: false, priceCents: 3499,
    en: { name: 'POE-30W Midspan PoE Injector', subtitle: '30W Power Over Ethernet', description: 'The POE-30W is a cost-effective midspan PoE injector compliant with IEEE 802.3af/at, delivering 30W over standard Ethernet cables. Ideal for IP cameras, VoIP phones, and access points.', features: ['IEEE 802.3af/at compliant', 'Up to 30W output', 'Plug-and-play installation', 'Compact metal housing', 'LED status indicators'] },
    zh: { name: 'POE-30W 中跨PoE供电器', subtitle: '30W以太网供电', description: 'POE-30W是一款经济型中跨PoE供电器，符合IEEE 802.3af/at标准，通过标准以太网线缆提供30W功率。适用于IP摄像头、VoIP电话和无线接入点。', features: ['符合IEEE 802.3af/at标准', '最高30W输出', '即插即用安装', '紧凑金属外壳', 'LED状态指示'] },
    specs: { en: [{ label: 'Output Power', value: '30W max (PoE+)' }, { label: 'Input Voltage', value: '100-240VAC, 50/60Hz' }, { label: 'Output Voltage', value: '48-52VDC' }, { label: 'Efficiency', value: '>85%' }, { label: 'Operating Temp', value: '0°C ~ +50°C' }, { label: 'Protection', value: 'OVP/OCP/SCP' }], zh: [{ label: '输出功率', value: '30W最大(PoE+)' }, { label: '输入电压', value: '100-240VAC, 50/60Hz' }, { label: '输出电压', value: '48-52VDC' }, { label: '效率', value: '>85%' }, { label: '工作温度', value: '0°C ~ +50°C' }, { label: '保护功能', value: '过压/过流/短路' }] },
    certifications: [{ name: 'CE' }, { name: 'FCC' }],
  },
  {
    slug: 'adapter-65w', categorySlug: 'adapter', sortOrder: 0, featured: true, priceCents: 2499,
    en: { name: 'ADP-65W Universal Power Adapter', subtitle: '65W with Interchangeable Plugs', description: 'The ADP-65W is a universal power adapter with 4 interchangeable AC plugs (EU/US/UK/AU), delivering 65W with CV/CC modes. Suitable for laptops, monitors, and general electronics.', features: ['65W continuous output', 'Interchangeable AC plugs (EU/US/UK/AU)', 'CV/CC modes', 'Over 87% efficiency', 'Short circuit protection', 'LED power indicator'] },
    zh: { name: 'ADP-65W 通用电源适配器', subtitle: '65W 可换插头', description: 'ADP-65W是一款通用电源适配器，配有4种可更换AC插头（欧/美/英/澳），支持65W恒压恒流输出。适用于笔记本电脑、显示器及通用电子产品。', features: ['65W持续输出', '可更换AC插头（欧/美/英/澳）', '恒压/恒流模式', '效率超87%', '短路保护', 'LED电源指示灯'] },
    specs: { en: [{ label: 'Output Power', value: '65W' }, { label: 'Input', value: '100-240VAC, 1.5A, 50/60Hz' }, { label: 'Output', value: '12-24VDC selectable' }, { label: 'Efficiency', value: 'Level VI / DoE compliant' }, { label: 'Plug Types', value: 'EU / US / UK / AU (interchangeable)' }, { label: 'Safety', value: 'CE, FCC, UL, CCC, PSE' }], zh: [{ label: '输出功率', value: '65W' }, { label: '输入', value: '100-240VAC, 1.5A, 50/60Hz' }, { label: '输出', value: '12-24VDC 可选' }, { label: '效率', value: 'Level VI / DoE合规' }, { label: '插头类型', value: '欧/美/英/澳（可互换）' }, { label: '安全认证', value: 'CE, FCC, UL, CCC, PSE' }] },
    certifications: [{ name: 'CE' }, { name: 'FCC' }, { name: 'UL' }, { name: 'CCC' }],
  },
  {
    slug: 'adapter-120w', categorySlug: 'adapter', sortOrder: 1, featured: false, priceCents: 4599,
    en: { name: 'ADP-120W Desktop Power Adapter', subtitle: '120W High-Density Power', description: 'The ADP-120W is a high-density desktop power adapter delivering 120W in a compact form factor. Ideal for industrial equipment, medical devices, and high-power electronics.', features: ['120W output', 'Compact design (152x68x35mm)', 'Active PFC >0.9', 'Low standby power <0.15W', 'Wide operating temp -10°C~+70°C'] },
    zh: { name: 'ADP-120W 桌面式电源适配器', subtitle: '120W高密度电源', description: 'ADP-120W是一款高密度桌面式电源适配器，在紧凑尺寸中提供120W功率。适用于工业设备、医疗设备和高功率电子产品。', features: ['120W输出', '紧凑设计（152x68x35mm）', '主动PFC >0.9', '低待机功耗<0.15W', '宽工作温度-10°C~+70°C'] },
    specs: { en: [{ label: 'Output Power', value: '120W' }, { label: 'Input', value: '90-264VAC, 47-63Hz' }, { label: 'Output', value: '12V/24V/48V options' }, { label: 'PFC', value: 'Active PFC >0.9' }, { label: 'Efficiency', value: 'Level VI / CoC Tier 2' }, { label: 'Dimension', value: '152 x 68 x 35 mm' }], zh: [{ label: '输出功率', value: '120W' }, { label: '输入', value: '90-264VAC, 47-63Hz' }, { label: '输出', value: '12V/24V/48V 可选' }, { label: 'PFC', value: '主动式 >0.9' }, { label: '效率', value: 'Level VI / CoC Tier 2' }, { label: '尺寸', value: '152 x 68 x 35 mm' }] },
    certifications: [{ name: 'CE' }, { name: 'UL' }, { name: 'FCC' }],
  },
  {
    slug: 'open-frame-150w', categorySlug: 'open-frame', sortOrder: 0, featured: true, priceCents: 3899,
    en: { name: 'OF-150W Open Frame Power Supply', subtitle: '150W Industrial Open Frame PSU', description: 'The OF-150W is a compact open-frame power supply delivering 150W with active PFC. Ideal for embedded systems, industrial equipment, and LED lighting applications. Features include universal AC input, low standby power, and comprehensive protection.', features: ['150W continuous output', 'Active PFC >0.9', 'Universal input 90-264VAC', 'Low standby <0.3W', 'Full protection: OVP/OCP/SCP', 'Compact 3x2 inch footprint', 'Conformal coating option'] },
    zh: { name: 'OF-150W 裸板电源', subtitle: '150W工业级裸板电源', description: 'OF-150W是一款紧凑型150W裸板电源，带主动PFC功能。适用于嵌入式系统、工业设备和LED照明应用。具备通用交流输入、低待机功耗和全方位保护。', features: ['150W持续输出', '主动PFC >0.9', '通用输入90-264VAC', '低待机<0.3W', '全面保护：OVP/OCP/SCP', '3x2英寸紧凑尺寸', '可选项：三防漆涂覆'] },
    specs: {
      en: [{ label: 'Output Power', value: '150W' }, { label: 'Input', value: '90-264VAC, 47-63Hz' }, { label: 'Output', value: '12V/24V/48V options' }, { label: 'Efficiency', value: '>88%' }, { label: 'PFC', value: 'Active >0.9' }, { label: 'Leakage Current', value: '<0.5mA' }, { label: 'Dimension', value: '76.2 x 50.8 x 28 mm' }],
      zh: [{ label: '输出功率', value: '150W' }, { label: '输入', value: '90-264VAC, 47-63Hz' }, { label: '输出', value: '12V/24V/48V 可选' }, { label: '效率', value: '>88%' }, { label: 'PFC', value: '主动式 >0.9' }, { label: '漏电流', value: '<0.5mA' }, { label: '尺寸', value: '76.2 x 50.8 x 28 mm' }],
    },
    certifications: [{ name: 'CE' }, { name: 'FCC' }, { name: 'UL' }],
  },
  {
    slug: 'ups-1000va', categorySlug: 'ups', sortOrder: 0, featured: true, priceCents: 15999,
    en: { name: 'UPS-1000VA Line Interactive UPS', subtitle: '1000VA / 600W Uninterruptible Power', description: 'The UPS-1000VA is a line-interactive UPS with AVR stabilization, protecting critical equipment from power surges, sags, and outages. Pure sine wave output ensures compatibility with sensitive electronics.', features: ['1000VA / 600W capacity', 'AVR voltage stabilization', 'Pure sine wave output', 'LCD display with real-time data', 'USB and RS-232 communication', 'Overload and short circuit protection', 'Auto-restart after power restoration'] },
    zh: { name: 'UPS-1000VA 在线互动式UPS', subtitle: '1000VA / 600W 不间断电源', description: 'UPS-1000VA是一款带AVR稳压功能的在线互动式UPS，保护关键设备免受浪涌、电压跌落和断电影响。纯正弦波输出确保敏感电子设备的兼容性。', features: ['1000VA / 600W容量', 'AVR自动稳压', '纯正弦波输出', 'LCD显示屏实时数据', 'USB和RS-232通信', '过载和短路保护', '电力恢复后自动重启'] },
    specs: { en: [{ label: 'Capacity', value: '1000VA / 600W' }, { label: 'Input', value: '220-240VAC, 50/60Hz' }, { label: 'Output Waveform', value: 'Pure Sine Wave' }, { label: 'Transfer Time', value: '2-6ms typical' }, { label: 'Battery', value: '12V 7Ah x 2' }, { label: 'Runtime (50% load)', value: '~15 minutes' }, { label: 'Communication', value: 'USB + RS-232' }], zh: [{ label: '容量', value: '1000VA / 600W' }, { label: '输入', value: '220-240VAC, 50/60Hz' }, { label: '输出波形', value: '纯正弦波' }, { label: '切换时间', value: '典型2-6ms' }, { label: '电池', value: '12V 7Ah x 2' }, { label: '续航（50%负载）', value: '约15分钟' }, { label: '通信接口', value: 'USB + RS-232' }] },
    certifications: [{ name: 'CE' }, { name: 'RoHS' }],
  },
  {
    slug: 'inverter-3000w', categorySlug: 'inverter', sortOrder: 0, featured: true, priceCents: 32999,
    en: { name: 'INV-3000W Pure Sine Wave Inverter', subtitle: '3000W Off-Grid Solar Inverter', description: 'The INV-3000W is a high-power pure sine wave inverter designed for off-grid solar systems, RVs, and backup power. Features include MPPT-ready input, remote control, and multi-protection.', features: ['3000W continuous / 6000W peak', 'Pure sine wave <3% THD', 'MPPT solar charger ready', 'LCD + remote control', 'Multiple protection: OVP/OCP/OTP/SCP', 'Fan cooling with speed control'] },
    zh: { name: 'INV-3000W 纯正弦波逆变器', subtitle: '3000W离网太阳能逆变器', description: 'INV-3000W是一款大功率纯正弦波逆变器，专为离网太阳能系统、房车和备用电源设计。具备MPPT就绪输入、远程控制及多重保护功能。', features: ['3000W持续/6000W峰值', '纯正弦波<3% THD', 'MPPT太阳能充电就绪', 'LCD屏+远程控制', '多重保护：OVP/OCP/OTP/SCP', '风扇散热带调速'] },
    specs: { en: [{ label: 'Continuous Power', value: '3000W' }, { label: 'Peak Power', value: '6000W (10s)' }, { label: 'Input', value: '12V/24V/48VDC (selectable)' }, { label: 'Output', value: '220-240VAC, 50/60Hz' }, { label: 'THD', value: '<3%' }, { label: 'Efficiency', value: '>90%' }, { label: 'Standby Draw', value: '<0.5A' }], zh: [{ label: '持续功率', value: '3000W' }, { label: '峰值功率', value: '6000W (10s)' }, { label: '输入', value: '12V/24V/48VDC（可选）' }, { label: '输出', value: '220-240VAC, 50/60Hz' }, { label: 'THD', value: '<3%' }, { label: '效率', value: '>90%' }, { label: '待机电流', value: '<0.5A' }] },
    certifications: [{ name: 'CE' }, { name: 'RoHS' }],
  },
  {
    slug: 'power-station-1000wh', categorySlug: 'power-station', sortOrder: 0, featured: true, priceCents: 89999,
    en: { name: 'RPS-1000 Portable Power Station', subtitle: '1024Wh LiFePO₄ Battery', description: 'The RPS-1000 is a portable power station with 1024Wh LiFePO₄ battery, providing reliable clean energy for camping, emergencies, and outdoor work. Features MPPT solar charging, UPS mode, and fast AC recharge.', features: ['1024Wh LiFePO₄ battery pack', '2000 cycle life to 80% capacity', '1000W AC pure sine wave output', 'MPPT solar input up to 200W', 'UPS mode <10ms switchover', 'Fast AC recharge in 1.5 hours', 'LCD display + App connectivity'] },
    zh: { name: 'RPS-1000 便携式储能电源', subtitle: '1024Wh 磷酸铁锂电池', description: 'RPS-1000是一款1024Wh磷酸铁锂电池便携式储能电源，为露营、应急和户外工作提供可靠的清洁能源。具备MPPT太阳能充电、UPS模式和快速交流充电功能。', features: ['1024Wh LiFePO₄电池组', '2000次循环至80%容量', '1000W AC纯正弦波输出', 'MPPT太阳能输入最高200W', 'UPS模式<10ms切换', 'AC快充1.5小时充满', 'LCD显示+App连接'] },
    specs: { en: [{ label: 'Capacity', value: '1024Wh (25.6V / 40Ah)' }, { label: 'AC Output', value: '1000W continuous / 2000W peak' }, { label: 'Battery Type', value: 'LiFePO₄' }, { label: 'Cycle Life', value: '2000 cycles to 80%' }, { label: 'Solar Input', value: '12-45VDC, up to 200W' }, { label: 'AC Recharge', value: '~1.5 hours' }, { label: 'Weight', value: '10.5 kg' }], zh: [{ label: '容量', value: '1024Wh (25.6V / 40Ah)' }, { label: 'AC输出', value: '1000W持续 / 2000W峰值' }, { label: '电池类型', value: '磷酸铁锂 (LiFePO₄)' }, { label: '循环寿命', value: '2000次至80%' }, { label: '太阳能输入', value: '12-45VDC, 最高200W' }, { label: '交流充电', value: '约1.5小时' }, { label: '重量', value: '10.5 kg' }] },
    certifications: [{ name: 'UN38.3' }, { name: 'CE' }, { name: 'FCC' }, { name: 'RoHS' }],
  },
  {
    slug: 'power-station-2000wh', categorySlug: 'power-station', sortOrder: 1, featured: false, priceCents: 159999,
    en: { name: 'RPS-2000 Portable Power Station', subtitle: '2048Wh High-Capacity Energy', description: 'The RPS-2000 is a high-capacity portable power station with 2048Wh LiFePO₄ battery. Features dual MPPT, 2400W AC output, and expandable capacity up to 4096Wh with additional battery.', features: ['2048Wh LiFePO₄ battery', '2400W pure sine wave output', 'Dual MPPT up to 400W solar input', 'Expandable to 4096Wh', 'UPS mode <10ms', 'App monitoring (Bluetooth + WiFi)', 'Zero-emission silent operation'] },
    zh: { name: 'RPS-2000 便携式储能电源', subtitle: '2048Wh大容量储能', description: 'RPS-2000是一款2048Wh磷酸铁锂电池大容量便携式储能电源。配备双MPPT、2400W交流输出，可通过外接电池扩展至4096Wh。', features: ['2048Wh LiFePO₄电池', '2400W纯正弦波输出', '双MPPT最高400W太阳能输入', '可扩展至4096Wh', 'UPS模式<10ms', 'App监控（蓝牙+WiFi）', '零排放静音运行'] },
    specs: { en: [{ label: 'Capacity', value: '2048Wh (51.2V / 40Ah)' }, { label: 'AC Output', value: '2400W continuous / 3600W peak' }, { label: 'Battery Type', value: 'LiFePO₄' }, { label: 'Solar Input', value: 'Dual MPPT, 12-48VDC, up to 400W' }, { label: 'AC Recharge', value: '~2 hours' }, { label: 'Weight', value: '21 kg' }, { label: 'Expandable', value: 'Up to 4096Wh (external battery)' }], zh: [{ label: '容量', value: '2048Wh (51.2V / 40Ah)' }, { label: 'AC输出', value: '2400W持续 / 3600W峰值' }, { label: '电池类型', value: '磷酸铁锂 (LiFePO₄)' }, { label: '太阳能输入', value: '双MPPT, 12-48VDC, 最高400W' }, { label: '交流充电', value: '约2小时' }, { label: '重量', value: '21 kg' }, { label: '可扩展', value: '最高4096Wh（外接电池）' }] },
    certifications: [{ name: 'UN38.3' }, { name: 'CE' }, { name: 'FCC' }, { name: 'RoHS' }],
  },
  {
    slug: 'micro-inverter-800w', categorySlug: 'micro-inverter', sortOrder: 0, featured: true, priceCents: 24999,
    en: { name: 'MI-800W Micro Inverter', subtitle: '800W Module-Level Solar Inverter', description: 'The MI-800W is a grid-tied micro inverter featuring per-panel MPPT for maximum energy harvest. Dual input supports two solar panels, with IP67 rating for outdoor installation.', features: ['800W rated output', 'Dual MPPT (2 panels)', 'Peak efficiency 96.5%', 'IP67 waterproof enclosure', 'Built-in WiFi monitoring', 'Rapid shutdown compliant', '25-year design life'] },
    zh: { name: 'MI-800W 微型逆变器', subtitle: '800W组件级光伏逆变器', description: 'MI-800W是一款并网微型逆变器，采用组件级MPPT实现最大能量采集。双路输入支持两块太阳能板，IP67防护等级适合室外安装。', features: ['800W额定输出', '双路MPPT（2块组件）', '峰值效率96.5%', 'IP67防水外壳', '内置WiFi监控', '符合快速关断要求', '25年设计寿命'] },
    specs: { en: [{ label: 'Rated Output', value: '800W' }, { label: 'MPPT Inputs', value: '2 (for 2 panels)' }, { label: 'Input Voltage Range', value: '22-60VDC' }, { label: 'Startup Voltage', value: '22VDC' }, { label: 'Peak Efficiency', value: '96.5%' }, { label: 'Ingress Protection', value: 'IP67' }, { label: 'Communication', value: 'WiFi (built-in)' }], zh: [{ label: '额定输出', value: '800W' }, { label: 'MPPT输入路数', value: '2路（支持2块组件）' }, { label: '输入电压范围', value: '22-60VDC' }, { label: '启动电压', value: '22VDC' }, { label: '峰值效率', value: '96.5%' }, { label: '防护等级', value: 'IP67' }, { label: '通信方式', value: 'WiFi（内置）' }] },
    certifications: [{ name: 'CE' }, { name: 'EN50549' }, { name: 'VDE-AR-N 4105' }],
  },
  {
    slug: 'industrial-480w', categorySlug: 'industrial', sortOrder: 0, featured: true, priceCents: 28999,
    en: { name: 'IND-480W DIN Rail Power Supply', subtitle: '480W Heavy-Duty Industrial PSU', description: 'The IND-480W is a 480W DIN rail power supply designed for industrial automation, PLC systems, and factory machinery. Features active PFC, wide operating temperature, and rugged aluminum housing.', features: ['480W output in DIN rail format', 'Active PFC >0.95', 'Wide input 90-264VAC', 'Operating temp -25°C to +70°C', 'Full protection: OVP/OCP/SCP/OTP', 'Aluminum housing for heat dissipation', 'Parallel operation capable'] },
    zh: { name: 'IND-480W 导轨式工业电源', subtitle: '480W重型工业电源', description: 'IND-480W是一款480W DIN导轨式工业电源，适用于工业自动化、PLC系统和工厂设备。具备主动PFC、宽工作温度和坚固铝制外壳。', features: ['480W输出DIN导轨安装', '主动PFC >0.95', '宽电压输入90-264VAC', '工作温度-25°C至+70°C', '全面保护：OVP/OCP/SCP/OTP', '铝制外壳散热', '可并联运行'] },
    specs: { en: [{ label: 'Output Power', value: '480W' }, { label: 'Input', value: '90-264VAC, 47-63Hz' }, { label: 'Output', value: '24VDC / 48VDC / 12VDC' }, { label: 'Efficiency', value: '>90% (typical)' }, { label: 'PFC', value: 'Active, >0.95' }, { label: 'Operating Temp', value: '-25°C to +70°C' }, { label: 'Housing', value: 'Aluminum, DIN Rail 4-module' }], zh: [{ label: '输出功率', value: '480W' }, { label: '输入', value: '90-264VAC, 47-63Hz' }, { label: '输出', value: '24VDC / 48VDC / 12VDC' }, { label: '效率', value: '>90%（典型值）' }, { label: 'PFC', value: '主动式, >0.95' }, { label: '工作温度', value: '-25°C至+70°C' }, { label: '外壳', value: '铝合金, DIN导轨4模组' }] },
    certifications: [{ name: 'CE' }, { name: 'UL' }, { name: 'CB' }],
  },
  {
    slug: 'all-in-one-5kw', categorySlug: 'all-in-one', sortOrder: 0, featured: true, priceCents: 199999,
    en: { name: 'AIO-5KW All-in-One Solar System', subtitle: '5kW Hybrid Solar Inverter + Battery', description: 'The AIO-5KW is a complete home energy solution combining a 5kW hybrid inverter, MPPT solar charger, and battery management in a single unit. Supports grid-tied, off-grid, and backup modes.', features: ['5kW hybrid inverter with backup', 'Built-in MPPT up to 6500W solar', 'LiFePO₄ battery compatible (48V)', 'Grid-tie + off-grid + UPS modes', 'Zero export / consumption monitoring', 'Touch screen + App control', 'Parallel up to 3 units (15kW)'] },
    zh: { name: 'AIO-5KW 一体机储能系统', subtitle: '5kW混合逆变器+储能一体机', description: 'AIO-5KW是一款完整的家庭能源解决方案，将5kW混合逆变器、MPPT太阳能充电器和电池管理集于一体。支持并网、离网和备电模式。', features: ['5kW混合逆变器带备电', '内置MPPT最高6500W光伏', '兼容48V LiFePO₄电池', '并网+离网+UPS模式', '零逆流/用电监测', '触屏+App控制', '最多3台并联（15kW）'] },
    specs: { en: [{ label: 'Rated Power', value: '5000W' }, { label: 'Solar Input', value: 'Up to 6500W MPPT' }, { label: 'Battery', value: '48V LiFePO₄ (100-200Ah)' }, { label: 'Output', value: '220-240VAC, 50/60Hz' }, { label: 'Waveform', value: 'Pure sine wave' }, { label: 'Max Efficiency', value: '97% (solar to battery) / 95% (battery to AC)' }, { label: 'Parallel', value: 'Up to 3 units (15kW)' }, { label: 'Display', value: 'Touch screen + WiFi App' }], zh: [{ label: '额定功率', value: '5000W' }, { label: '光伏输入', value: '最高6500W MPPT' }, { label: '电池', value: '48V LiFePO₄ (100-200Ah)' }, { label: '输出', value: '220-240VAC, 50/60Hz' }, { label: '波形', value: '纯正弦波' }, { label: '最高效率', value: '97%（光→电池）/ 95%（电池→AC）' }, { label: '并联', value: '最多3台（15kW）' }, { label: '显示', value: '触摸屏 + WiFi App' }] },
    certifications: [{ name: 'CE' }, { name: 'EN50438' }, { name: 'VDE' }, { name: 'AS4777' }],
  },
  {
    slug: 'ups-3000va', categorySlug: 'ups', sortOrder: 1, featured: false, priceCents: 45999,
    en: { name: 'UPS-3000VA Online UPS', subtitle: '3000VA / 2700W Double Conversion UPS', description: 'The UPS-3000VA is a true online double-conversion UPS providing zero-transfer-time power protection for servers, network equipment, and critical infrastructure. Pure sine wave with PFC input.', features: ['3000VA / 2700W online double conversion', 'Zero transfer time', 'Pure sine wave output', 'PFC input >0.99', 'LCD + SNMP option', 'Extended runtime support (external battery)', 'Emergency power off (EPO)'] },
    zh: { name: 'UPS-3000VA 在线式UPS', subtitle: '3000VA / 2700W 双转换在线式UPS', description: 'UPS-3000VA是真正的在线双转换UPS，为零传输时间保护服务器、网络设备和关键基础设施。纯正弦波输出带PFC输入。', features: ['3000VA / 2700W在线双转换', '零传输时间', '纯正弦波输出', 'PFC输入>0.99', 'LCD + SNMP可选', '支持外接电池延长续航', '紧急断电（EPO）'] },
    specs: { en: [{ label: 'Capacity', value: '3000VA / 2700W' }, { label: 'Type', value: 'Online double conversion' }, { label: 'Input', value: '160-300VAC, 50/60Hz' }, { label: 'Output', value: '220/230/240VAC ±1%' }, { label: 'Transfer Time', value: '0ms (online mode)' }, { label: 'Battery', value: '72V (internal or external)' }, { label: 'Communication', value: 'USB, RS-232, optional SNMP' }], zh: [{ label: '容量', value: '3000VA / 2700W' }, { label: '类型', value: '在线双转换' }, { label: '输入', value: '160-300VAC, 50/60Hz' }, { label: '输出', value: '220/230/240VAC ±1%' }, { label: '切换时间', value: '0ms（在线模式）' }, { label: '电池', value: '72V（内置或外接）' }, { label: '通信接口', value: 'USB, RS-232, 可选SNMP' }] },
    certifications: [{ name: 'CE' }, { name: 'IEC 62040' }],
  },
]

async function main() {
  // 清空数据（按依赖顺序）
  await prisma.productImage.deleteMany()
  await prisma.productSpec.deleteMany()
  await prisma.certification.deleteMany()
  await prisma.productTranslation.deleteMany()
  await prisma.product.deleteMany()
  await prisma.productCategoryTranslation.deleteMany()
  await prisma.productCategory.deleteMany()

  console.log('🗑️ Cleared existing data')

  // 创建品类
  for (const cat of categories) {
    await prisma.productCategory.create({
      data: {
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        icon: cat.icon,
        published: true,
        translations: {
          create: [
            { locale: 'en', name: cat.en.name, subtitle: cat.en.subtitle },
            { locale: 'zh', name: cat.zh.name, subtitle: cat.zh.subtitle },
          ],
        },
      },
    })
  }
  console.log(`✅ Created ${categories.length} categories with translations`)

  // 创建产品
  for (const prod of products) {
    const product = await prisma.product.create({
      data: {
        slug: prod.slug,
        categorySlug: prod.categorySlug,
        sortOrder: prod.sortOrder,
        featured: prod.featured,
        priceCents: prod.priceCents,
        published: true,
        translations: {
          create: [
            {
              locale: 'en',
              name: prod.en.name,
              subtitle: prod.en.subtitle,
              description: prod.en.description,
              features: JSON.stringify(prod.en.features),
            },
            {
              locale: 'zh',
              name: prod.zh.name,
              subtitle: prod.zh.subtitle,
              description: prod.zh.description,
              features: JSON.stringify(prod.zh.features),
            },
          ],
        },
        specs: {
          create: [
            ...prod.specs.en.map((spec, i) => ({
              locale: 'en',
              label: spec.label,
              value: spec.value,
              sortOrder: i,
            })),
            ...(prod.specs.zh ? prod.specs.zh.map((spec, i) => ({
              locale: 'zh',
              label: spec.label,
              value: spec.value,
              sortOrder: i,
            })) : []),
          ],
        },
        certifications: {
          create: prod.certifications.map(c => ({
            name: c.name,
          })),
        },
      },
    })

    // 创建占位产品图片
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `/images/products/${prod.slug}.jpg`,
        alt: prod.en.name,
        sortOrder: 0,
        isPrimary: true,
      },
    })

    console.log(`  📦 ${prod.en.name}`)
  }

  console.log(`\n✅ Seeded ${products.length} products with translations, specs, certifications, and images`)
  console.log('📊 Summary:')
  console.log(`   Categories: ${categories.length}`)
  console.log(`   Products: ${products.length}`)
  console.log(`   Locales: en, zh`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

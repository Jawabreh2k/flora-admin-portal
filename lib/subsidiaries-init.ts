import type { ManagedSubsidiary } from './types'

/**
 * Default subsidiary data to seed when config is first loaded.
 * Mirrors the hardcoded data from the website.
 */
export const DEFAULT_SUBSIDIARIES: ManagedSubsidiary[] = [
  {
    slug: "flora-trading",
    icon: "Package",
    name: {
      en: "Flora Trading Center",
      ar: "مركز فلورا التجاري",
    },
    tag: {
      en: "FMCG & Commodities",
      ar: "السلع الاستهلاكية والتجارية",
    },
    short: {
      en: "Home of the celebrated AMEERA spice brand — processed to strict international quality standards since 1993.",
      ar: "موطن علامة «أميرة» الشهيرة للبهارات — تُصنَّع وفق أعلى معايير الجودة العالمية منذ عام ١٩٩٣.",
    },
    established: { en: "1993", ar: "١٩٩٣" },
    visual: { from: "#5a1020", to: "#8a2a17", glow: "#e0a23a" },
    image: "/images/flora-trading-cover.jpg",
    logo: "/images/flora-trading-logo.png",
    paragraphs: {
      en: [
        "Flora Trading Center began operations in 1993 as a processor of AMEERA spices in Qatar. Over the decades it has grown in stature while contributing meaningfully to the wider socio-economic development of the Flora Group.",
        "\"AMEERA\" is today one of the most admired spice brands among the people of Qatar — a household name built on consistency, taste and trust.",
        "Every AMEERA product is produced to international standards, maintaining the highest level of quality at each stage of the production process. The range now spans more than 20 spice products across a wide variety of pack sizes.",
      ],
      ar: [
        "بدأ مركز فلورا التجاري عملياته عام ١٩٩٣ كمُصنّعٍ لبهارات «أميرة» في قطر. وعلى مدى العقود، نمت مكانته وأسهم إسهاماً ملموساً في التنمية الاجتماعية والاقتصادية الأوسع لمجموعة فلورا.",
        "تُعدّ «أميرة» اليوم من أكثر علامات البهارات تقديراً لدى أهل قطر — اسمٌ مألوفٌ بُني على الاتساق والمذاق والثقة.",
        "يُنتَج كلّ منتجٍ من «أميرة» وفق المعايير الدولية، مع الحفاظ على أعلى مستويات الجودة في كلّ مرحلةٍ من مراحل الإنتاج. وتضمّ التشكيلة الآن أكثر من ٢٠ منتجاً من البهارات بأحجام تعبئةٍ متنوّعة.",
      ],
    },
    highlights: {
      en: [
        {
          title: "The AMEERA Brand",
          body: "A beloved household spice brand with deep equity across the Qatari market and the wider Gulf.",
        },
        {
          title: "International Quality",
          body: "Production governed by international food-safety and quality standards at every stage.",
        },
        {
          title: "20+ Product Lines",
          body: "More than twenty distinct spice products offered across a broad range of pack weights.",
        },
        {
          title: "Three Decades of Trust",
          body: "Operating continuously since 1993, anchoring the Group's commodities vertical.",
        },
      ],
      ar: [
        {
          title: "علامة «أميرة»",
          body: "علامة بهاراتٍ محبوبة وراسخة المكانة في السوق القطري والخليج الأوسع.",
        },
        {
          title: "جودة عالمية",
          body: "إنتاجٌ يخضع لمعايير سلامة الغذاء والجودة الدولية في كلّ مرحلة.",
        },
        {
          title: "أكثر من ٢٠ منتجاً",
          body: "أكثر من عشرين منتجاً مختلفاً من البهارات بمجموعةٍ واسعة من أوزان التعبئة.",
        },
        {
          title: "ثلاثة عقودٍ من الثقة",
          body: "عملٌ متواصل منذ عام ١٩٩٣، يشكّل ركيزة قطاع السلع في المجموعة.",
        },
      ],
    },
    metrics: {
      en: [
        { value: "1993", label: "Established" },
        { value: "20+", label: "Spice Products" },
        { value: "#1", label: "Admired Local Brand" },
      ],
      ar: [
        { value: "١٩٩٣", label: "التأسيس" },
        { value: "+٢٠", label: "منتج بهارات" },
        { value: "الأولى", label: "علامة محلية محبوبة" },
      ],
    },
    website: "https://www.floraonline.net",
    hasProfile: false,
    contact: {
      address: {
        en: "Industrial Area St. 1, Doha, Qatar. P.O. Box: 16118.",
        ar: "المنطقة الصناعية، شارع ١، الدوحة، قطر. ص.ب: ١٦١١٨.",
      },
      phone: "(+974) 44607703 / 44607704",
    },
  },
  {
    slug: "flora-technology",
    icon: "Cpu",
    name: { en: "Flora Technology", ar: "فلورا للتكنولوجيا" },
    tag: {
      en: "Enterprise IT Solutions",
      ar: "حلول تقنية المعلومات للمؤسسات",
    },
    short: {
      en: "State-of-the-art, end-to-end technology solutions for Qatar's governmental and private institutions.",
      ar: "حلولٌ تقنية متكاملة وحديثة للمؤسسات الحكومية والخاصة في قطر.",
    },
    established: { en: "Group Branch", ar: "فرع المجموعة" },
    visual: { from: "#360a16", to: "#1b1633", glow: "#c9a227" },
    image: "/images/flora-technology-cover.jpg",
    logo: "/images/flora-technology-logo.png",
    paragraphs: {
      en: [
        "Flora Technology Co. was established as a branch of the Flora Group with a clear focus: to deliver state-of-the-art, end-to-end technology solutions and services to Qatari governmental and private entities.",
        "Over the years we have developed the expertise to provide highly customised advanced technology solutions — a full lifecycle of services from initial requirements gathering and systems analysis through implementation, installation, programming and custom software development, all the way to end-user training, maintenance and support.",
        "As a Flora Group company we remain strictly committed to the Group's values — placing customer satisfaction at the centre of everything and striving for the highest quality in every product and service. Our experienced professionals drive innovation with the discipline of the Group's high professional and ethical standards.",
      ],
      ar: [
        "تأسّست شركة فلورا للتكنولوجيا كفرعٍ من مجموعة فلورا بهدفٍ واضح: تقديم حلولٍ وخدماتٍ تقنية متكاملة وحديثة للجهات الحكومية والخاصة في قطر.",
        "على مرّ السنين طوّرنا الخبرة لتقديم حلولٍ تقنية متقدّمة ومُخصّصة — دورة خدماتٍ كاملة من جمع المتطلبات وتحليل الأنظمة، مروراً بالتنفيذ والتركيب والبرمجة وتطوير البرمجيات المُخصّصة، وصولاً إلى تدريب المستخدمين والصيانة والدعم.",
        "بصفتنا إحدى شركات مجموعة فلورا، نلتزم التزاماً صارماً بقيم المجموعة — واضعين رضا العميل في صميم كلّ ما نقوم به، وساعين لأعلى جودةٍ في كلّ منتجٍ وخدمة. ويقود خبراؤنا الابتكار بانضباط معايير المجموعة المهنية والأخلاقية العالية.",
      ],
    },
    highlights: {
      en: [
        {
          title: "Requirements & Analysis",
          body: "In-depth assessment of organisational needs, infrastructure audits and tailored solution architecture.",
        },
        {
          title: "Custom Software Development",
          body: "Bespoke application engineering and systems integration across public and private platforms.",
        },
        {
          title: "Implementation & Installation",
          body: "Disciplined deployment, programming and configuration delivered to specification.",
        },
        {
          title: "Training & Support",
          body: "End-user enablement plus full maintenance and managed support for the long term.",
        },
      ],
      ar: [
        {
          title: "المتطلبات والتحليل",
          body: "تقييمٌ معمّق لاحتياجات المؤسسة ومراجعةٌ للبنية التحتية وتصميمُ حلولٍ مُخصّصة.",
        },
        {
          title: "تطوير برمجيات مُخصّصة",
          body: "هندسة تطبيقاتٍ مُخصّصة وتكاملُ أنظمة عبر المنصّات الحكومية والخاصة.",
        },
        {
          title: "التنفيذ والتركيب",
          body: "نشرٌ منضبط وبرمجةٌ وتهيئةٌ تُسلَّم وفق المواصفات.",
        },
        {
          title: "التدريب والدعم",
          body: "تأهيلُ المستخدمين إضافةً إلى صيانةٍ ودعمٍ مُدار على المدى الطويل.",
        },
      ],
    },
    metrics: {
      en: [
        { value: "End-to-End", label: "Solution Lifecycle" },
        { value: "Gov + Private", label: "Sectors Served" },
        { value: "24/7", label: "Support & Maintenance" },
      ],
      ar: [
        { value: "متكامل", label: "دورة الحلول" },
        { value: "حكومي وخاص", label: "القطاعات المخدومة" },
        { value: "٢٤/٧", label: "الدعم والصيانة" },
      ],
    },
    website: "https://www.floraonline.net",
    hasProfile: true,
    contact: {
      address: {
        en: "Flora Building, Rawdat Al Khail St, Al Helal, Bldg No 127, Street 330, Doha, Qatar. P.O. Box: 16118.",
        ar: "مبنى فلورا، شارع روضة الخيل، الهلال، مبنى رقم ١٢٧، شارع ٣٣٠، الدوحة، قطر. ص.ب: ١٦١١٨.",
      },
      phone: "(+974) 44810674",
      fax: "(+974) 44314133",
      email: "info@floragroup.net",
    },
  },
  {
    slug: "flora-security",
    icon: "ShieldCheck",
    name: { en: "Flora Security Systems", ar: "فلورا للأنظمة الأمنية" },
    tag: {
      en: "Certified Security Infrastructure",
      ar: "بنية أمنية معتمدة",
    },
    short: {
      en: "An MOI-certified specialist in access control, video surveillance and physical risk mitigation, registered in 2013.",
      ar: "متخصّصة معتمدة من وزارة الداخلية في أنظمة التحكّم بالوصول والمراقبة بالفيديو والحدّ من المخاطر المادية، مُسجّلة عام ٢٠١٣.",
    },
    established: { en: "2013", ar: "٢٠١٣" },
    visual: { from: "#290a13", to: "#222d3f", glow: "#b8893e" },
    image: "/images/flora-security-cover.jpg",
    logo: "/images/flora-security-logo.png",
    paragraphs: {
      en: [
        "Security has become a necessity across every sector worldwide. With rising risks of theft, break-ins, accidents, vandalism, sabotage and other physical hazards, protecting people and property — and controlling the flow of people — is now essential to business continuity and profitability.",
        "Conscious of that need, Flora Group officially registered Flora Security Systems in 2013 as a Qatari, MOI-certified security specialist. With access control, video surveillance and other innovative products — delivered with the same service and quality that has defined Flora Group since 1993 — the company helps clients meet a fast-growing need for protection and consistently exceed expectations in this sensitive field.",
        "We offer needs-focused security solutions that deliver the greatest possible benefit in terms of safety, organisational efficiency and convenience — helping clients protect the things that matter most.",
      ],
      ar: [
        "أصبح الأمن ضرورةً في كلّ القطاعات حول العالم. ومع تزايد مخاطر السرقة والاقتحام والحوادث والتخريب وغيرها من الأخطار المادية، باتت حماية الأشخاص والممتلكات — وضبط حركة الأفراد — أمراً جوهرياً لاستمرارية الأعمال وربحيتها.",
        "إدراكاً لتلك الحاجة، سجّلت مجموعة فلورا رسمياً شركة فلورا للأنظمة الأمنية عام ٢٠١٣ كشركةٍ قطرية متخصّصة ومعتمدة من وزارة الداخلية. وبأنظمة التحكّم بالوصول والمراقبة بالفيديو ومنتجاتٍ مبتكرة أخرى — تُقدَّم بنفس الخدمة والجودة التي ميّزت مجموعة فلورا منذ ١٩٩٣ — تساعد الشركة عملاءها على تلبية حاجةٍ متنامية للحماية وتتجاوز توقّعاتهم في هذا المجال الحسّاس.",
        "نقدّم حلولاً أمنية تركّز على الاحتياجات وتحقّق أكبر فائدةٍ ممكنة من حيث السلامة والكفاءة التنظيمية والراحة — لمساعدة العملاء على حماية ما يهمّهم أكثر.",
      ],
    },
    highlights: {
      en: [
        {
          title: "MOI Certified",
          body: "Official Ministry of Interior certification ensuring deployments meet Qatar's most rigorous standards.",
        },
        {
          title: "Advanced Access Control",
          body: "Biometric, card-based and multi-factor systems for high-security commercial and government sites.",
        },
        {
          title: "Video Surveillance",
          body: "Enterprise-grade CCTV, intelligent analytics and centralised command for total situational awareness.",
        },
        {
          title: "Physical Risk Mitigation",
          body: "Threat assessment, perimeter protection and risk management across critical assets.",
        },
      ],
      ar: [
        {
          title: "معتمدة من الداخلية",
          body: "اعتمادٌ رسمي من وزارة الداخلية يضمن مطابقة التطبيقات لأكثر المعايير صرامةً في قطر.",
        },
        {
          title: "تحكّم متقدّم بالوصول",
          body: "أنظمة بيومترية وبطاقات وتحقّق متعدّد العوامل للمواقع التجارية والحكومية عالية الأمان.",
        },
        {
          title: "المراقبة بالفيديو",
          body: "كاميرات مراقبة احترافية وتحليلاتٌ ذكية وقيادةٌ مركزية لوعيٍ شاملٍ بالموقف.",
        },
        {
          title: "الحدّ من المخاطر المادية",
          body: "تقييمٌ للتهديدات وحمايةٌ للمحيط وإدارةٌ للمخاطر عبر الأصول الحيوية.",
        },
      ],
    },
    metrics: {
      en: [
        { value: "2013", label: "Registered" },
        { value: "MOI", label: "Certified" },
        { value: "360°", label: "Protection Coverage" },
      ],
      ar: [
        { value: "٢٠١٣", label: "التسجيل" },
        { value: "الداخلية", label: "معتمدة" },
        { value: "°٣٦٠", label: "تغطية الحماية" },
      ],
    },
    website: "https://www.floraonline.net",
    hasProfile: true,
    contact: {
      address: {
        en: "Flora Building, Rawdat Al Khail St, Al Helal, Bldg No 127, Doha, Qatar. P.O. Box: 16118.",
        ar: "مبنى فلورا، شارع روضة الخيل، الهلال، مبنى رقم ١٢٧، الدوحة، قطر. ص.ب: ١٦١١٨.",
      },
      phone: "(+974) 44810674",
      fax: "(+974) 44314133",
      email: "info@floragroup.net",
    },
  },
  {
    slug: "sibonne",
    icon: "Sprout",
    name: { en: "Sibonne", ar: "سيبون" },
    tag: {
      en: "International Floral Supply",
      ar: "توريد الزهور الدولي",
    },
    short: {
      en: "Fresh cut flowers, plants and floral products, sourced through strategic partnerships across 26+ countries.",
      ar: "زهورٌ طازجة ونباتاتٌ ومنتجاتٌ زهرية، تُورَّد عبر شراكاتٍ استراتيجية في أكثر من ٢٦ دولة.",
    },
    established: { en: "Group Company", ar: "شركة المجموعة" },
    visual: { from: "#4a0e17", to: "#7a1f3a", glow: "#d98c6a" },
    image: "/images/sibonne-cover.jpg",
    logo: "/images/sibonne-logo.png",
    paragraphs: {
      en: [
        "Si Bonne was established in Qatar as part of the Flora Group, specialising in fresh cut flowers, plants and floral products. Its facilities deliver a high level of service built on deep commercial experience and knowledge.",
        "Since its establishment, Si Bonne has achieved steady growth and broadened its network and strategic partnerships across more than 26 countries — including Holland, Italy, Ecuador, Colombia, South Africa, Kenya, Ethiopia, Egypt, Saudi Arabia, Jordan, New Zealand, China, Thailand, India and Taiwan, among others.",
      ],
      ar: [
        "تأسّست سيبون في قطر كجزءٍ من مجموعة فلورا، متخصّصةً في الزهور الطازجة والنباتات والمنتجات الزهرية. وتقدّم منشآتها مستوى خدمةٍ عالياً مبنياً على خبرةٍ تجارية ومعرفةٍ عميقة.",
        "منذ تأسيسها، حقّقت سيبون نمواً مطّرداً ووسّعت شبكتها وشراكاتها الاستراتيجية عبر أكثر من ٢٦ دولة — من بينها هولندا وإيطاليا والإكوادور وكولومبيا وجنوب أفريقيا وكينيا وإثيوبيا ومصر والسعودية والأردن ونيوزيلندا والصين وتايلاند والهند وتايوان وغيرها.",
      ],
    },
    highlights: {
      en: [
        {
          title: "Global Sourcing Network",
          body: "Strategic partnerships spanning more than 26 countries across four continents.",
        },
        {
          title: "Fresh Cut Flowers",
          body: "A continuously replenished supply of premium fresh flowers, plants and floral products.",
        },
        {
          title: "Commercial Expertise",
          body: "Service grounded in years of floral trade experience and market knowledge.",
        },
        {
          title: "Steady Growth",
          body: "A consistently expanding network and footprint since its founding.",
        },
      ],
      ar: [
        {
          title: "شبكة توريدٍ عالمية",
          body: "شراكاتٌ استراتيجية تمتدّ عبر أكثر من ٢٦ دولة في أربع قارّات.",
        },
        {
          title: "زهورٌ طازجة",
          body: "إمدادٌ متجدّد باستمرار من الزهور الطازجة الفاخرة والنباتات والمنتجات الزهرية.",
        },
        {
          title: "خبرة تجارية",
          body: "خدمةٌ راسخة في سنواتٍ من خبرة تجارة الزهور ومعرفة السوق.",
        },
        {
          title: "نموٌّ مطّرد",
          body: "شبكةٌ وحضورٌ في توسّعٍ مستمر منذ التأسيس.",
        },
      ],
    },
    metrics: {
      en: [
        { value: "26+", label: "Partner Countries" },
        { value: "4", label: "Continents Sourced" },
        { value: "Fresh", label: "Daily Supply" },
      ],
      ar: [
        { value: "+٢٦", label: "دول شريكة" },
        { value: "٤", label: "قارّات التوريد" },
        { value: "طازج", label: "إمداد يومي" },
      ],
    },
    website: "https://www.floraonline.net",
    hasProfile: false,
    contact: {
      address: {
        en: "Old Airport, near Lulu Hypermarket, Ahmad Bin Hanbal St, Building No. 47, Doha, Qatar. P.O. Box: 16118.",
        ar: "المطار القديم، قرب لولو هايبرماركت، شارع أحمد بن حنبل، مبنى رقم ٤٧، الدوحة، قطر. ص.ب: ١٦١١٨.",
      },
      phone: "(+974) 44607703",
      fax: "(+974) 44504480",
      email: "flora@qatar.net.qa",
    },
  },
  {
    slug: "flora-flowers",
    icon: "Flower2",
    name: { en: "Flora Flowers", ar: "فلورا للزهور" },
    tag: {
      en: "Online Flowers & Gifts",
      ar: "زهور وهدايا عبر الإنترنت",
    },
    short: {
      en: "One of Qatar's most dependable floral and gift delivery stores — we don't just deliver products, we deliver value.",
      ar: "من أكثر متاجر الزهور والهدايا موثوقيةً في قطر — لا نوصّل منتجاتٍ فحسب، بل نوصّل قيمة.",
    },
    established: { en: "Group Company", ar: "شركة المجموعة" },
    visual: { from: "#6a132a", to: "#a33a5a", glow: "#e8b07a" },
    image: "/images/flora-flowers-cover.jpg",
    logo: "/images/flora-flowers-logo.png",
    paragraphs: {
      en: [
        "Flora Flowers has emerged as one of the most successful, reliable and dependable flower stores in Qatar, delivering floral and gift items throughout the country. We believe our work carries real significance in people's lives — we don't merely deliver flowers, we deliver happiness; we don't deliver products only, we deliver value.",
        "The sensitivity of our work demands high ethical standards, punctuality, strict adherence to schedules and sheer professionalism. Today we have won our customers' hearts and become one of the leading florists in Qatar — thanks to our loyal customers, their word-of-mouth and their continued patronage.",
      ],
      ar: [
        "برزت فلورا للزهور كواحدةٍ من أنجح متاجر الزهور وأكثرها موثوقيةً واعتماديةً في قطر، توصّل الزهور والهدايا في جميع أنحاء البلاد. نؤمن أنّ لعملنا أثراً حقيقياً في حياة الناس — فنحن لا نوصّل الزهور فحسب، بل نوصّل السعادة؛ ولا نوصّل منتجاتٍ فقط، بل نوصّل قيمة.",
        "تتطلّب حساسية عملنا معايير أخلاقية عالية والتزاماً بالمواعيد وانضباطاً صارماً بالجداول واحترافيةً تامّة. واليوم كسبنا قلوب عملائنا وأصبحنا من أبرز محلّات الزهور في قطر — بفضل عملائنا الأوفياء وتوصياتهم وثقتهم المستمرة.",
      ],
    },
    highlights: {
      en: [
        {
          title: "Same-Day Delivery",
          body: "Reliable floral and gift delivery across Qatar, on schedule and with care.",
        },
        {
          title: "Curated Arrangements",
          body: "Thoughtfully designed bouquets and gifts for every occasion and sentiment.",
        },
        {
          title: "Trusted Reputation",
          body: "One of the leading florists in Qatar, grown largely through word of mouth.",
        },
        {
          title: "Service First",
          body: "Punctuality, ethics and professionalism at the heart of every order.",
        },
      ],
      ar: [
        {
          title: "توصيلٌ في اليوم نفسه",
          body: "توصيلٌ موثوق للزهور والهدايا في أنحاء قطر، في الموعد وبعناية.",
        },
        {
          title: "تنسيقاتٌ مُختارة",
          body: "باقاتٌ وهدايا مصمّمة بعناية لكلّ مناسبةٍ وشعور.",
        },
        {
          title: "سمعةٌ موثوقة",
          body: "من أبرز محلّات الزهور في قطر، نمت أساساً عبر التوصية الشفهية.",
        },
        {
          title: "الخدمة أولاً",
          body: "الالتزام بالمواعيد والأخلاق والاحترافية في صميم كلّ طلب.",
        },
      ],
    },
    metrics: {
      en: [
        { value: "Qatar-wide", label: "Delivery Reach" },
        { value: "Same-Day", label: "Fulfilment" },
        { value: "5★", label: "Customer Loyalty" },
      ],
      ar: [
        { value: "كل قطر", label: "نطاق التوصيل" },
        { value: "نفس اليوم", label: "التنفيذ" },
        { value: "★٥", label: "ولاء العملاء" },
      ],
    },
    website: "https://www.floraonline.net",
    hasProfile: false,
    contact: {
      address: {
        en: "Old Airport, near Lulu Hypermarket, Ahmad Bin Hanbal St, Building No. 47, Doha, Qatar. P.O. Box: 16118.",
        ar: "المطار القديم، قرب لولو هايبرماركت، شارع أحمد بن حنبل، مبنى رقم ٤٧، الدوحة، قطر. ص.ب: ١٦١١٨.",
      },
      phone: "(+974) 44607703",
      fax: "(+974) 44504480",
      email: "flora@qatar.net.qa",
    },
  },
  {
    slug: "royal-stone",
    icon: "Building2",
    name: {
      en: "Royal Stone Trading & Contracting",
      ar: "رويال ستون للتجارة والمقاولات",
    },
    tag: {
      en: "Civil Construction & Materials",
      ar: "الإنشاءات المدنية والمواد",
    },
    short: {
      en: "A well-established trading and contracting company, leading general contracting and material supply in Qatar since 2014.",
      ar: "شركة تجارةٍ ومقاولاتٍ راسخة، رائدة في المقاولات العامة وتوريد المواد في قطر منذ عام ٢٠١٤.",
    },
    established: { en: "2014", ar: "٢٠١٤" },
    visual: { from: "#3a1410", to: "#6a3a22", glow: "#d9a441" },
    image: "/images/royal-stone-cover.jpg",
    logo: "/images/royal-stone-logo.png",
    paragraphs: {
      en: [
        "Royal Stone Trading and Contracting is a well-established company formed in early 2014, with strong domain expertise and professional experience. It is focused on excelling as a leading general contracting and construction-materials supply company in the State of Qatar.",
        "What sets Royal Stone apart is its partnership with Flora Group — one of Qatar's leading and most reputed organisations, with a strong presence in the country built over decades.",
        "As a subsidiary of Flora Group, Royal Stone integrates the Group's decades of experience, market relationships, facilities, standards, professionalism and reputation with a construction team carrying more than a decade of domain expertise — delivering projects on time, to quality, and to the highest levels of client satisfaction.",
      ],
      ar: [
        "رويال ستون للتجارة والمقاولات شركةٌ راسخة تأسّست مطلع عام ٢٠١٤، تتمتّع بخبرةٍ متخصّصة عميقة. وتركّز على التميّز كشركةٍ رائدة في المقاولات العامة وتوريد مواد البناء في دولة قطر.",
        "ما يميّز رويال ستون هو شراكتها مع مجموعة فلورا — إحدى أعرق المؤسسات القطرية وأكثرها سمعةً، بحضورٍ قويّ في البلاد بُني على مدى عقود.",
        "بصفتها شركةً تابعة لمجموعة فلورا، تدمج رويال ستون عقوداً من خبرة المجموعة وعلاقاتها السوقية ومنشآتها ومعاييرها واحترافيتها وسمعتها مع فريق بناءٍ يحمل أكثر من عقدٍ من الخبرة المتخصّصة — لتسليم المشاريع في موعدها وبالجودة المطلوبة وأعلى مستويات رضا العملاء.",
      ],
    },
    highlights: {
      en: [
        {
          title: "General Contracting",
          body: "End-to-end civil construction and general contracting across the State of Qatar.",
        },
        {
          title: "Material Supply",
          body: "Reliable sourcing and supply of quality construction materials at scale.",
        },
        {
          title: "Group Backing",
          body: "The credibility, standards and market relationships of the wider Flora Group.",
        },
        {
          title: "On-Time Delivery",
          body: "Projects executed to schedule, to quality and to client satisfaction.",
        },
      ],
      ar: [
        {
          title: "المقاولات العامة",
          body: "إنشاءاتٌ مدنية ومقاولاتٌ عامة متكاملة في أنحاء دولة قطر.",
        },
        {
          title: "توريد المواد",
          body: "توريدٌ موثوق لمواد البناء عالية الجودة على نطاقٍ واسع.",
        },
        {
          title: "دعم المجموعة",
          body: "مصداقية ومعايير وعلاقات مجموعة فلورا الأوسع.",
        },
        {
          title: "تسليمٌ في الموعد",
          body: "مشاريع تُنفَّذ وفق الجدول وبالجودة المطلوبة ورضا العملاء.",
        },
      ],
    },
    metrics: {
      en: [
        { value: "2014", label: "Founded" },
        { value: "11+ yrs", label: "Team Expertise" },
        { value: "On-Time", label: "Project Delivery" },
      ],
      ar: [
        { value: "٢٠١٤", label: "التأسيس" },
        { value: "+١١ سنة", label: "خبرة الفريق" },
        { value: "في الموعد", label: "تسليم المشاريع" },
      ],
    },
    website: "https://www.floragroup.net",
    hasProfile: true,
    contact: {
      address: {
        en: "Flora Building, Rawdat Al Khail St, Al Helal, Bldg No 127, Street 330, Zone 41, Nuaija (Al Hilal West), Doha, Qatar. P.O. Box: 16118.",
        ar: "مبنى فلورا، شارع روضة الخيل، الهلال، مبنى رقم ١٢٧، شارع ٣٣٠، المنطقة ٤١، النعيجة (الهلال الغربي)، الدوحة، قطر. ص.ب: ١٦١١٨.",
      },
      phone: "(+974) 44810674",
      fax: "(+974) 44314133",
      email: "royal@floragroup.net",
    },
  },
]

/**
 * Ensures the config payload has subsidiaries initialized.
 * If missing, seeds with DEFAULT_SUBSIDIARIES.
 */
export function ensureSubsidiariesInitialized(payload: any): void {
  if (!payload.subsidiaries) {
    payload.subsidiaries = {
      enabled: true,
      items: DEFAULT_SUBSIDIARIES,
    }
  }
}

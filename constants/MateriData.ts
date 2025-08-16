export interface MateriItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detailDescription: string;
  image: any;
  model3d: any;
  icon: string;
  category: string;
  functions: string[];
}

export const MATERI_ITEMS: MateriItem[] = [
  {
    id: "testis",
    title: "Testis",
    subtitle: "Organ Reproduksi Utama Pria",
    description:
      "Testis adalah organ reproduksi utama pada pria yang menghasilkan sperma dan hormon testosteron.",
    detailDescription: `
Testis merupakan organ reproduksi pria yang berbentuk oval dan terletak di dalam skrotum. Testis memiliki fungsi ganda yaitu sebagai kelenjar eksokrin yang menghasilkan sperma dan sebagai kelenjar endokrin yang menghasilkan hormon testosteron.

Struktur Testis:
• Tunika albuginea: Lapisan luar yang keras
• Tubulus seminiferus: Tempat pembentukan sperma
• Sel sertoli: Memberikan nutrisi pada sperma
• Sel leydig: Menghasilkan testosteron

Proses spermatogenesis berlangsung selama 74 hari dan menghasilkan jutaan sperma setiap hari.
    `,
    image: require("../assets/images/Game/Testis Sliced.png"),
    model3d: require("../assets/models/Testis Sliced.glb"),
    icon: "🔸",
    category: "Organ Utama",
    functions: [
      "Menghasilkan sperma melalui spermatogenesis",
      "Memproduksi hormon testosteron",
      "Mengatur pematangan seksual sekunder",
    ],
  },
  {
    id: "epididirmis",
    title: "Epididirmis",
    subtitle: "Tempat Pematangan Sperma",
    description:
      "Epididirmis adalah saluran berkelok-kelok tempat sperma mengalami pematangan dan penyimpanan.",
    detailDescription: `
Epididirmis adalah struktur berbentuk seperti topi yang terletak di bagian atas dan belakang testis. Struktur ini merupakan saluran berkelok-kelok yang sangat panjang (sekitar 6 meter jika diluruskan).

Bagian Epididirmis:
• Kaput (kepala): Bagian atas yang menerima sperma dari testis
• Korpus (badan): Bagian tengah tempat pematangan sperma
• Kauda (ekor): Bagian bawah tempat penyimpanan sperma matang

Fungsi utama epididirmis adalah memberikan lingkungan yang tepat untuk pematangan sperma. Sperma yang keluar dari testis belum mampu membuahi ovum, mereka memerlukan waktu 10-14 hari di epididirmis untuk menjadi matang dan motil.
    `,
    image: require("../assets/images/Game/Epididirmis.png"),
    model3d: require("../assets/models/Epididirmis.glb"),
    icon: "🌀",
    category: "Saluran",
    functions: [
      "Mematangkan sperma selama 10-14 hari",
      "Menyimpan sperma matang",
      "Mengatur konsentrasi sperma",
    ],
  },
  {
    id: "skrotum",
    title: "Skrotum",
    subtitle: "Pelindung Testis",
    description:
      "Skrotum adalah kantung yang melindungi testis dan mengatur suhu optimal untuk produksi sperma.",
    detailDescription: `
Skrotum adalah kantung kulit yang berisi testis dan epididirmis. Struktur ini memiliki peran penting dalam menjaga suhu testis agar tetap optimal untuk produksi sperma.

Lapisan Skrotum:
• Kulit: Lapisan terluar yang fleksibel
• Dartos: Otot polos yang mengatur suhu
• Fascia spermatika: Jaringan ikat pelindung
• Tunika vaginalis: Membran serosa

Regulasi Suhu:
Skrotum menjaga suhu testis sekitar 2-3°C lebih rendah dari suhu tubuh (sekitar 35°C). Ketika dingin, otot dartos berkontraksi dan mengangkat testis mendekati tubuh. Sebaliknya, saat panas, skrotum mengendur dan menjauhkan testis dari tubuh.
    `,
    image: require("../assets/images/Game/Skrotum + Testis.png"),
    model3d: require("../assets/models/Skrotum + Testicle.glb"),
    icon: "🛡️",
    category: "Pelindung",
    functions: [
      "Melindungi testis dari benturan",
      "Mengatur suhu optimal (35°C)",
      "Menyediakan ruang untuk testis",
    ],
  },
  {
    id: "tubulus",
    title: "Tubulus Seminiferus",
    subtitle: "Pabrik Sperma",
    description:
      "Tubulus seminiferus adalah saluran di dalam testis tempat pembentukan sperma berlangsung.",
    detailDescription: `
Tubulus seminiferus adalah saluran berkelok-kelok di dalam testis yang merupakan tempat terjadinya spermatogenesis. Setiap testis mengandung sekitar 250-400 tubulus seminiferus dengan panjang total mencapai 250 meter.

Struktur Tubulus:
• Sel germinal: Sel yang berkembang menjadi sperma
• Sel sertoli: Sel somatic yang mendukung spermatogenesis
• Membran basalis: Pembatas antara kompartemen
• Lumen: Ruang tengah tempat sperma matang

Tahap Spermatogenesis:
1. Fase mitosis: Spermatogonia membelah
2. Fase meiosis: Pembentukan spermatosit
3. Fase diferensiasi: Pembentukan spermatid
4. Spermiogenesis: Pematangan menjadi sperma

Proses ini berlangsung terus-menerus dan menghasilkan sekitar 300 juta sperma per hari.
    `,
    image: require("../assets/images/Game/Tubulus Semifernus.png"),
    model3d: require("../assets/models/Tubulus Semifernus.glb"),
    icon: "🏭",
    category: "Struktur Internal",
    functions: [
      "Tempat terjadinya spermatogenesis",
      "Menghasilkan 300 juta sperma per hari",
      "Mengatur tahap pematangan sperma",
    ],
  },
  {
    id: "pampiniform",
    title: "Pampiniform Plexus",
    subtitle: "Sistem Pendingin Testis",
    description:
      "Pampiniform plexus adalah jaringan pembuluh darah yang mengatur suhu testis.",
    detailDescription: `
Pampiniform plexus adalah jaringan kompleks pembuluh darah vena yang mengelilingi arteri testicularis. Struktur ini berperan sebagai sistem pendingin alami untuk testis.

Mekanisme Pendinginan:
• Heat exchanger: Darah vena dingin mendinginkan darah arteri panas
• Counter-current flow: Aliran berlawanan arah untuk efisiensi maksimal
• Thermoregulasi: Menjaga suhu testis 2-3°C lebih rendah dari tubuh

Komponen Vaskular:
• Vena testicularis: Mengangkut darah dari testis
• Arteri testicularis: Membawa darah ke testis
• Kapiler: Jaringan pembuluh halus
• Anastomosis: Hubungan antar pembuluh

Gangguan pada pampiniform plexus dapat menyebabkan varikokel, yang merupakan pembesaran vena dan dapat mempengaruhi kesuburan pria.
    `,
    image: require("../assets/images/Game/Pampiniform Plexus + Testicular artery.png"),
    model3d: require("../assets/models/Pampiniform Plexus + Testicular Artery.glb"),
    icon: "🌡️",
    category: "Sistem Vaskular",
    functions: [
      "Mengatur suhu testis",
      "Sistem pendingin counter-current",
      "Mempertahankan suhu optimal spermatogenesis",
    ],
  },
  {
    id: "penis",
    title: "Penis",
    subtitle: "Organ Kopulatori Pria",
    description:
      "Penis adalah organ eksternal pria yang berfungsi untuk kopulasi dan pengeluaran urin.",
    detailDescription: `
Penis merupakan organ reproduksi eksternal pria yang memiliki fungsi ganda sebagai organ kopulatori dan saluran pengeluaran urin. Struktur penis terdiri dari jaringan erektil dan sistem vaskular yang kompleks.

Struktur Penis:
• Korpus kavernosum: Dua ruang erektil utama
• Korpus spongiosum: Ruang erektil yang mengelilingi uretra
• Glans penis: Bagian ujung yang sensitif
• Prepusium: Kulup yang melindungi glans

Mekanisme Ereksi:
Ereksi terjadi karena vasodilatasi arteri dan vasokonstriksi vena, menyebabkan pengisian darah di korpus kavernosum dan korpus spongiosum. Proses ini diatur oleh sistem saraf parasimpatis dan berbagai neurotransmitter.

Fungsi dalam Reproduksi:
Penis memungkinkan deposisi sperma ke dalam saluran reproduksi wanita melalui proses kopulasi, memfasilitasi fertilisasi internal.
    `,
    image: require("../assets/images/Game/Penis.png"),
    model3d: require("../assets/models/Penis.glb"),
    icon: "🔹",
    category: "Organ Eksternal",
    functions: [
      "Organ kopulatori untuk reproduksi",
      "Saluran pengeluaran urin",
      "Deposisi sperma ke saluran reproduksi wanita",
    ],
  },
  {
    id: "prostat",
    title: "Kelenjar Prostat",
    subtitle: "Penghasil Cairan Prostat",
    description:
      "Kelenjar prostat menghasilkan cairan prostat yang merupakan komponen penting semen.",
    detailDescription: `
Kelenjar prostat adalah kelenjar aksesori terbesar pada sistem reproduksi pria, berukuran sebesar buah kenari dan mengelilingi uretra di bawah kandung kemih.

Struktur Prostat:
• Zona perifer: Area terluar, sering terkena kanker
• Zona transisi: Mengelilingi uretra, tempat BPH
• Zona sentral: Mengelilingi duktus ejakulatorius
• Zona fibromuskular: Bagian anterior non-glandular

Fungsi Kelenjar Prostat:
Prostat menghasilkan sekitar 30% volume semen dengan cairan yang mengandung enzim, protein, dan ion yang penting untuk kelangsungan hidup dan motilitas sperma.

Cairan Prostat:
• Mengandung asam sitrat, zinc, dan PAP
• pH alkalin untuk menetralkan keasaman vagina
• Enzim seperti PSA (Prostate Specific Antigen)
• Spermin yang memberikan bau khas semen
    `,
    image: require("../assets/images/Game/Prostate Gland.png"),
    model3d: require("../assets/models/Prostate Gland.glb"),
    icon: "🟣",
    category: "Kelenjar Aksesori",
    functions: [
      "Menghasilkan 30% volume semen",
      "Menyediakan nutrisi untuk sperma",
      "Menetralkan keasaman vagina",
    ],
  },
  {
    id: "glandula_bulbo",
    title: "Glandula Bulbourethralis",
    subtitle: "Kelenjar Cowper",
    description:
      "Kelenjar bulbourethralis atau kelenjar Cowper menghasilkan cairan pre-ejakulasi yang melumasi uretra.",
    detailDescription: `
Glandula bulbourethralis, juga dikenal sebagai kelenjar Cowper, adalah sepasang kelenjar kecil yang terletak di inferior prostat dan mengelilingi uretra membranosa.

Karakteristik Kelenjar:
• Berukuran sebesar kacang polong
• Struktur tubuloalveolar
• Dilapisi epitel kolumnar
• Dikelilingi otot polos dan lurik

Fungsi Utama:
Kelenjar ini menghasilkan cairan bening dan licin yang disekresikan sebelum ejakulasi (pre-ejakulat). Cairan ini berfungsi:
• Menetralkan sisa asam urin di uretra
• Melumasi uretra untuk mempermudah passage sperma
• Menyediakan medium alkali untuk sperma

Sekresi dan Kontrol:
Sekresi dirangsang oleh sistem saraf parasimpatis selama arousal seksual, mempersiapkan uretra untuk ejakulasi.
    `,
    image: require("../assets/images/Game/Glandula bulbuorethralis.png"),
    model3d: require("../assets/models/Glandula bulbuorethralis.glb"),
    icon: "💧",
    category: "Kelenjar Aksesori",
    functions: [
      "Menghasilkan cairan pre-ejakulasi",
      "Melumasi dan membersihkan uretra",
      "Menetralkan sisa asam urin",
    ],
  },
  {
    id: "duktus_ejaculatorius",
    title: "Duktus Ejaculatorius",
    subtitle: "Saluran Ejakulasi",
    description:
      "Duktus ejaculatorius adalah saluran yang mengangkut semen dari vesikula seminalis ke uretra.",
    detailDescription: `
Duktus ejaculatorius adalah saluran pendek yang terbentuk dari pertemuan vas deferens dengan duktus vesikula seminalis. Terdapat sepasang duktus ejaculatorius yang menembus kelenjar prostat.

Anatomi dan Struktur:
• Panjang sekitar 2 cm
• Diameter 2-3 mm
• Menembus zona sentral prostat
• Bermuara di uretra prostatika

Fungsi dalam Ejakulasi:
Selama ejakulasi, kontraksi otot polos duktus ejaculatorius mendorong campuran sperma dan cairan seminal ke dalam uretra prostatika, di mana cairan ini bercampur dengan sekresi prostat.

Komposisi Cairan:
Cairan yang melalui duktus ejaculatorius mengandung:
• Spermatozoa dari vas deferens
• Cairan fruktosa dari vesikula seminalis
• Enzim dan protein untuk nutrisi sperma
• Prostaglandin untuk kontraksi uterus

Koordinasi dengan Organ Lain:
Duktus ejaculatorius bekerja sama dengan sfingter uretra internal untuk mencegah refluks semen ke kandung kemih selama ejakulasi.
    `,
    image: require("../assets/images/Game/Duktus Ejaculatoris.png"),
    model3d: require("../assets/models/Duktus Ejaculatoris.glb"),
    icon: "🔄",
    category: "Saluran",
    functions: [
      "Mengangkut semen ke uretra",
      "Mencampur sperma dengan cairan seminal",
      "Mencegah refluks ke kandung kemih",
    ],
  },
  {
    id: "uretra",
    title: "Uretra",
    subtitle: "Saluran Kemih dan Reproduksi",
    description:
      "Uretra adalah saluran yang mengangkut urin dan semen keluar dari tubuh pria.",
    detailDescription: `
Uretra pria adalah saluran yang membentang dari kandung kemih hingga ujung penis, berfungsi ganda sebagai saluran kemih dan reproduksi. Uretra pria dibagi menjadi empat bagian utama.

Bagian-bagian Uretra:
• Uretra pre-prostatika: Dari kandung kemih ke prostat
• Uretra prostatika: Melewati kelenjar prostat
• Uretra membranosa: Melewati diafragma urogenital
• Uretra spongiosa: Melewati korpus spongiosum penis

Fungsi Dual:
1. Sistem Urinari: Mengalirkan urin dari kandung kemih
2. Sistem Reproduksi: Mengalirkan semen selama ejakulasi

Mekanisme Kontrol:
Sfingter uretra internal dan eksternal mengontrol pengeluaran urin, sedangkan selama ejakulasi, sfingter internal menutup untuk mencegah retrograde ejaculation.

Histologi:
Lapisan mukosa uretra bervariasi sepanjang perjalanannya, dari epitel transisional di bagian proksimal hingga epitel skuamosa berlapis di bagian distal.
    `,
    image: require("../assets/images/Game/Urethera.png"),
    model3d: require("../assets/models/All.glb"),
    icon: "🚰",
    category: "Saluran",
    functions: [
      "Saluran pengeluaran urin",
      "Saluran pengeluaran semen",
      "Kontrol melalui sistem sfingter",
    ],
  },
  {
    id: "vesikula_seminalis",
    title: "Vesikula Seminalis",
    subtitle: "Penghasil Cairan Seminal",
    description:
      "Vesikula seminalis menghasilkan cairan yang kaya fruktosa untuk nutrisi sperma.",
    detailDescription: `
Vesikula seminalis adalah sepasang kelenjar berbentuk kantung yang terletak di posterior kandung kemih. Kelenjar ini menghasilkan sekitar 60-70% volume total semen.

Struktur Anatomi:
• Panjang sekitar 5-6 cm
• Bentuk berkelok-kelok seperti kantung
• Dinding berlipat-lipat untuk memperluas permukaan
• Bermuara ke vas deferens membentuk duktus ejaculatorius

Komposisi Sekresi:
Cairan vesikula seminalis mengandung:
• Fruktosa: Sumber energi utama sperma
• Protein: Termasuk semenogelin untuk koagulasi
• Asam askorbat: Antioksidan
• Prostaglandin: Stimulasi kontraksi saluran reproduksi wanita
• Fosfolipid dan enzim-enzim penting

Fungsi dalam Fertilisasi:
Sekresi vesikula seminalis tidak hanya menyediakan nutrisi tetapi juga membantu transport sperma dalam saluran reproduksi wanita melalui aksi prostaglandin.

Regulasi Hormonal:
Aktivitas vesikula seminalis diregulasi oleh hormon androgen, terutama testosteron dan DHT (dihydrotestosterone).
    `,
    image: require("../assets/images/Game/All.png"),
    model3d: require("../assets/models/Vesicula Seminalis + Ductus Seminalis.glb"),
    icon: "🫧",
    category: "Kelenjar Aksesori",
    functions: [
      "Menghasilkan 60-70% volume semen",
      "Menyediakan fruktosa untuk energi sperma",
      "Menghasilkan prostaglandin untuk motilitas",
    ],
  },
  {
    id: "ovarium",
    title: "Ovarium dan Tuba Uterine",
    subtitle: "Organ Reproduksi Utama Wanita",
    description:
      "Ovarium menghasilkan sel telur dan hormon, sedangkan tuba uterine mengangkut ovum ke uterus.",
    detailDescription: `
Sistem reproduksi wanita terdiri dari ovarium sebagai organ reproduksi utama dan tuba uterine sebagai saluran transport. Komponen ini bekerja sama dalam siklus reproduksi wanita.

Ovarium:
• Organ berbentuk oval berukuran 3x2x1 cm
• Menghasilkan oosit melalui oogenesis
• Memproduksi hormon estrogen dan progesteron
• Mengalami siklus ovulasi bulanan

Tuba Uterine (Fallopian):
• Saluran sepanjang 10-12 cm
• Terdiri dari infundibulum, ampulla, isthmus
• Tempat fertilisasi normal terjadi
• Mengangkut ovum dengan gerakan silia

Uterus:
• Organ muscular berbentuk buah pir terbalik
• Tempat implantasi dan perkembangan embrio
• Terdiri dari endometrium, miometrium, perimetrium
• Mengalami siklus menstruasi bulanan

Interaksi Hormonal:
Sistem HPG (Hipotalamus-Hipofisis-Gonad) mengatur siklus reproduksi melalui FSH, LH, estrogen, dan progesteron dalam feedback loop yang kompleks.
    `,
    image: require("../assets/images/Game/Tuba uterine, uterus, ovarium.png"),
    model3d: require("../assets/models/Tuba uterine, uterus, ovarium.glb"),
    icon: "🌸",
    category: "Organ Reproduksi Wanita",
    functions: [
      "Produksi sel telur dan hormon",
      "Transport ovum ke uterus",
      "Tempat fertilisasi dan implantasi",
    ],
  },
  {
    id: "vagina",
    title: "Vagina",
    subtitle: "Saluran Reproduksi Wanita",
    description:
      "Vagina adalah saluran elastis yang menghubungkan uterus dengan dunia luar.",
    detailDescription: `
Vagina adalah saluran fibromuskular elastis yang membentang dari serviks uteri hingga vulva. Struktur ini memiliki peran penting dalam reproduksi, menstruasi, dan persalinan.

Anatomi Vagina:
• Panjang sekitar 7-10 cm
• Dinding anterior dan posterior yang dapat melebar
• Forniks anterior, posterior, dan lateral di sekitar serviks
• Lapisan mukosa berlipat-lipat (rugae)

Struktur Histologi:
• Epitel skuamosa berlapis tanpa keratinisasi
• Lamina propria dengan jaringan ikat elastis
• Lapisan otot polos sirkuler dan longitudinal
• Adventitia yang menghubungkan dengan organ sekitar

Fungsi Reproduksi:
• Reseptor semen selama kopulasi
• Saluran pengeluaran darah menstruasi
• Jalan lahir selama persalinan
• Produksi sekresi untuk lubrikasi

Mikroflora dan pH:
Vagina mempertahankan pH asam (3.8-4.5) melalui produksi asam laktat oleh bakteri Lactobacillus, menciptakan lingkungan yang melindungi dari infeksi patogen.
    `,
    image: require("../assets/images/Game/Vagina.png"),
    model3d: require("../assets/models/Vagina.glb"),
    icon: "🌺",
    category: "Organ Reproduksi Wanita",
    functions: [
      "Reseptor semen selama kopulasi",
      "Saluran menstruasi dan persalinan",
      "Produksi lubrikasi alami",
    ],
  },
  {
    id: "klitoris",
    title: "Klitoris",
    subtitle: "Organ Sensorik Wanita",
    description:
      "Klitoris adalah organ erektil yang kaya dengan ujung saraf dan berperan dalam respons seksual.",
    detailDescription: `
Klitoris adalah organ erektil yang homolog dengan penis pada pria, memiliki konsentrasi ujung saraf tertinggi dalam tubuh wanita dan berperan sentral dalam respons seksual.

Struktur Anatomi:
• Glans klitoris: Bagian yang terlihat dan sangat sensitif
• Korpus klitoris: Batang yang mengandung jaringan erektil
• Krura klitoris: Akar yang menempel pada arkus pubis
• Bulb vestibular: Jaringan erektil di sisi vagina

Innervasi dan Vaskularisasi:
Klitoris dipersarafi oleh nervus dorsalis klitoris dan cabang nervus pudendal, memberikan sensitivitas yang sangat tinggi. Vaskularisasi oleh arteri klitoris memungkinkan ereksi.

Histologi:
• Jaringan erektil dengan sinusoid vaskular
• Epitel skuamosa berlapis
• Korpus kavernosum dengan septum
• Tunika albuginea yang membungkus

Fungsi:
Klitoris berfungsi khusus untuk sensasi dan respons seksual, tidak memiliki fungsi reproduksi langsung tetapi penting untuk arousal dan orgasme yang dapat memfasilitasi konsepsi.
    `,
    image: require("../assets/images/Game/Klitoris.png"),
    model3d: require("../assets/models/Klitoris.glb"),
    icon: "💎",
    category: "Organ Reproduksi Wanita",
    functions: [
      "Organ sensorik dengan 8000 ujung saraf",
      "Respons seksual dan arousal",
      "Fasilitasi proses reproduksi",
    ],
  },
  {
    id: "glandula_vestibular",
    title: "Glandula Vestibularis Mayor",
    subtitle: "Kelenjar Bartholin",
    description:
      "Glandula vestibularis mayor atau kelenjar Bartholin menghasilkan lubrikasi untuk saluran reproduksi wanita.",
    detailDescription: `
Glandula vestibularis mayor, juga dikenal sebagai kelenjar Bartholin, adalah sepasang kelenjar kecil yang terletak di posterior vestibulum vagina, homolog dengan glandula bulbourethralis pada pria.

Lokasi dan Struktur:
• Terletak di jam 4 dan 8 dari introitus vagina
• Berukuran sekitar 1 cm diameter
• Struktur tubuloalveolar
• Duktus sepanjang 2-2.5 cm bermuara ke vestibulum

Sekresi dan Fungsi:
Kelenjar ini menghasilkan sekret mukoid yang berfungsi:
• Lubrikasi vestibulum dan vagina
• Memfasilitasi penetrasi selama kopulasi
• Mempertahankan kelembaban mukosa
• pH alkali untuk menetralkan keasaman vagina

Regulasi Sekresi:
Aktivitas sekresi dirangsang oleh stimulasi seksual melalui sistem saraf parasimpatis, meningkat selama arousal untuk memfasilitasi aktivitas seksual.

Patologi:
Obstruksi duktus dapat menyebabkan kista Bartholin, sedangkan infeksi dapat menyebabkan bartholinitis yang memerlukan penanganan medis.
    `,
    image: require("../assets/images/Game/Glandula Vestibularis Mayor.png"),
    model3d: require("../assets/models/Glandula Vestibularis Mayor.glb"),
    icon: "💧",
    category: "Organ Reproduksi Wanita",
    functions: [
      "Menghasilkan lubrikasi vagina",
      "Memfasilitasi aktivitas seksual",
      "Mempertahankan kelembaban mukosa",
    ],
  },
  {
    id: "hymen_introitus",
    title: "Hymen dan Introitus Vagina",
    subtitle: "Struktur Vestibular",
    description:
      "Hymen adalah membran tipis yang sebagian menutupi introitus vagina pada wanita muda.",
    detailDescription: `
Hymen adalah struktur anatomi berupa membran tipis yang sebagian menutupi introitus vagina. Struktur ini bervariasi dalam bentuk dan ketebalan antar individu.

Variasi Anatomis Hymen:
• Hymen anular: Berbentuk cincin dengan lubang sentral
• Hymen semilunaris: Berbentuk bulan sabit
• Hymen kribriform: Memiliki beberapa lubang kecil
• Hymen microperforate: Lubang sangat kecil
• Hymen imperforate: Tanpa lubang (abnormal)

Introitus Vagina:
Introitus adalah pintu masuk vagina yang dikelilingi oleh:
• Labia minora yang membentuk batas lateral
• Hymen atau sisa hymen (carunculae hymenales)
• Muara duktus kelenjar Bartholin
• Muara uretra di anterior

Fungsi dan Perkembangan:
Hymen tidak memiliki fungsi biologis yang jelas. Kondisinya tidak dapat menentukan virginitas atau aktivitas seksual sebelumnya, karena dapat rusak akibat aktivitas fisik, tampon, atau pemeriksaan medis.

Pertimbangan Klinis:
Variasi anatomis hymen adalah normal, dan hanya kondisi imperforate yang memerlukan intervensi medis untuk memungkinkan aliran menstruasi.
    `,
    image: require("../assets/images/Game/Hymen dan introitus vagina .png"),
    model3d: require("../assets/models/Hymen dan introitus vagina .glb"),
    icon: "🌙",
    category: "Organ Reproduksi Wanita",
    functions: [
      "Struktur anatomi vestibular",
      "Variasi normal antar individu",
      "Tidak menentukan status seksual",
    ],
  },
  {
    id: "perineum",
    title: "Perineum",
    subtitle: "Area Antara Organ Reproduksi dan Anus",
    description:
      "Perineum adalah area anatomis yang terletak antara organ reproduksi eksternal dan anus.",
    detailDescription: `
Perineum adalah area berbentuk berlian yang terletak antara organ reproduksi eksternal dan anus, dibagi menjadi segitiga urogenital anterior dan segitiga anal posterior.

Batas Anatomis:
• Anterior: Simfisis pubis
• Posterior: Koksiks
• Lateral: Tuberositas iskium dan ramus iskiopubik
• Dibagi oleh garis transversal yang menghubungkan tuberositas iskium

Segitiga Urogenital:
• Mengandung organ reproduksi eksternal
• Diafragma urogenital dengan otot-otot perineal
• Ruang perineal superfisial dan profunda
• Innervasi oleh nervus pudendal

Segitiga Anal:
• Mengandung anus dan saluran anal
• Fossa iskioanal di kedua sisi
• Otot-otot sfingter ani
• Jaringan adiposa untuk bantalan

Fungsi Klinis:
Perineum penting dalam:
• Kontrol kontinensia urin dan feses
• Fungsi seksual
• Proses persalinan (episiotomi)
• Dukungan organ-organ pelvis

Otot-otot Perineal:
Termasuk otot bulbospongiosus, ischiocavernosus, dan transversus perinei yang bekerja sama dalam fungsi reproduksi dan eliminasi.
    `,
    image: require("../assets/images/Game/pereneum.png"),
    model3d: require("../assets/models/Skin + preneum.glb"),
    icon: "🔸",
    category: "Struktur Eksternal",
    functions: [
      "Dukungan organ reproduksi dan ekskresi",
      "Kontrol kontinensia",
      "Fungsi dalam persalinan",
    ],
  },
  {
    id: "complete_system",
    title: "Sistem Reproduksi Lengkap",
    subtitle: "Anatomi Komprehensif",
    description:
      "Model lengkap sistem reproduksi menunjukkan interaksi semua komponen pria dan wanita.",
    detailDescription: `
Model sistem reproduksi lengkap menunjukkan bagaimana semua komponen bekerja secara terintegrasi untuk menghasilkan, mengantarkan, dan memfasilitasi fertilisasi gamet pada manusia.

Sistem Reproduksi Pria:
• Testis: Produksi sperma dan hormon
• Epididirmis: Pematangan dan penyimpanan
• Vas deferens: Saluran pengangkut sperma
• Kelenjar aksesori: Vesikula seminalis, prostat, Cowper
• Penis: Organ kopulatori
• Uretra: Saluran pengeluaran

Sistem Reproduksi Wanita:
• Ovarium: Produksi ovum dan hormon
• Tuba uterine: Transport ovum dan fertilisasi
• Uterus: Implantasi dan perkembangan embrio
• Vagina: Reseptor semen dan jalan lahir
• Organ eksternal: Vulva, klitoris, kelenjar Bartholin

Proses Reproduksi Terintegrasi:
1. Gametogenesis: Spermatogenesis dan oogenesis
2. Kopulasi: Transfer sperma ke saluran reproduksi wanita
3. Fertilisasi: Pertemuan sperma dan ovum di tuba uterine
4. Implantasi: Penempelan blastokista di endometrium
5. Perkembangan: Embriogenesis dan organogenesis

Regulasi Hormonal:
Sistem HPG mengkoordinasi kedua sistem reproduksi melalui hormon-hormon seperti GnRH, FSH, LH, testosteron, estrogen, dan progesteron dalam siklus feedback yang kompleks.
    `,
    image: require("../assets/images/Game/All.png"),
    model3d: require("../assets/models/All.glb"),
    icon: "🔬",
    category: "Sistem Lengkap",
    functions: [
      "Integrasi seluruh sistem reproduksi",
      "Koordinasi gametogenesis dan fertilisasi",
      "Regulasi hormonal terpadu",
    ],
  },
];

export const MATERI_CATEGORIES = [
  "Semua",
  "Organ Utama",
  "Saluran",
  "Pelindung",
  "Struktur Internal",
  "Sistem Vaskular",
  "Organ Eksternal",
  "Kelenjar Aksesori",
  "Organ Reproduksi Wanita",
  "Struktur Eksternal",
  "Sistem Lengkap",
];

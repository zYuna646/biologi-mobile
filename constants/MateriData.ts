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
    id: "complete",
    title: "Sistem Reproduksi Lengkap",
    subtitle: "Anatomi Komprehensif",
    description:
      "Model lengkap sistem reproduksi pria menunjukkan interaksi semua komponen.",
    detailDescription: `
Model sistem reproduksi pria lengkap menunjukkan bagaimana semua komponen bekerja secara terintegrasi untuk menghasilkan dan mengantarkan sperma.

Komponen Terintegrasi:
• Testis: Produksi sperma dan hormon
• Epididirmis: Pematangan dan penyimpanan
• Vas deferens: Saluran pengangkut sperma
• Vesikula seminalis: Cairan seminal
• Prostat: Cairan prostat
• Uretra: Saluran keluaran

Proses Reproduksi:
1. Spermatogenesis di tubulus seminiferus
2. Pematangan di epididirmis
3. Penyimpanan di kauda epididirmis
4. Transport melalui vas deferens
5. Pencampuran dengan cairan seminal
6. Ejakulasi melalui uretra

Regulasi hormonal oleh hipotalamus-hipofisis-testis memastikan fungsi reproduksi yang optimal.
    `,
    image: require("../assets/images/Game/Testis + Epididirmis.png"),
    model3d: require("../assets/models/All.glb"),
    icon: "🔬",
    category: "Sistem Lengkap",
    functions: [
      "Integrasi seluruh sistem reproduksi",
      "Koordinasi produksi dan transport sperma",
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
  "Sistem Lengkap",
];

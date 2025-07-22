# 🧬 Biologi Edukasi - Sistem Reproduksi

Game edukasi biologi untuk anak-anak SD yang fokus pada sistem reproduksi manusia dengan pendekatan interaktif dan menyenangkan.

## ✨ Fitur Utama

### 🎮 Game Matching
- **Cocokkan Gambar dengan Fungsi**: Permainan mencocokkan organ reproduksi dengan fungsinya
- **Sistem Level**: Level otomatis bertambah dengan tingkat kesulitan yang meningkat
- **Sistem Scoring**: 
  - Poin bertambah untuk jawaban benar
  - Poin berkurang untuk jawaban salah (bisa negatif)
  - Bonus waktu dan combo multiplier
- **Timer & Feedback**: 
  - Countdown timer dengan warning audio
  - Pop-up score (+/- points)
  - Animasi combo dan visual feedback
- **Audio System**: Background music dan sound effects lengkap

### 📚 Materi Pembelajaran
- **Grid View dengan Kategori**: 6 materi dengan filter kategori
- **Detail Screen dengan 3 Tab**:
  - 📖 **Penjelasan**: Deskripsi detail dan gambar
  - 🎮 **Model 3D**: Viewer interaktif untuk file .glb
  - ⚙️ **Fungsi**: Daftar fungsi dan fakta menarik
- **Responsive Design**: Optimized untuk tablet, normal, dan small screen
- **Rich Content**: Informasi anatomis yang komprehensif

### 🏆 Sistem Lainnya
- **Papan Skor**: Tracking high scores (placeholder)
- **Pengaturan Audio**: Toggle mute/unmute
- **Navigasi Smooth**: Transisi antar screen yang halus

## 📁 Struktur Proyek

```
biologi-edukasi/
├── app/                     # Expo Router pages
├── assets/
│   ├── sounds/             # Audio files (BGM + SFX)
│   ├── images/Game/        # Game images
│   └── models/             # 3D models (.glb files)
├── components/
│   ├── screens/            # Main screens
│   │   ├── WelcomeScreen.tsx
│   │   ├── MenuScreen.tsx
│   │   ├── MatchingGameScreen.tsx
│   │   ├── MateriScreen.tsx
│   │   └── MateriDetailScreen.tsx
│   ├── ui/                 # Reusable components
│   │   ├── GameButton.tsx
│   │   ├── GameCard.tsx
│   │   ├── SimpleMatchCard.tsx
│   │   └── SimpleModel3DViewer.tsx
│   └── AppController.tsx   # Main navigation controller
├── constants/
│   ├── Config.ts          # App configuration & theme
│   ├── GameData.ts        # Game items & settings
│   └── MateriData.ts      # Educational materials data
└── utils/
    └── SoundManager.ts    # Audio management
```

## 🎨 Design System

### Color Theme
- **Primary**: `#4CAF50` (Green - biologi theme)
- **Secondary**: `#8BC34A` (Light green)
- **Accent**: `#FF9800` (Orange highlights)
- **Background**: `#E8F5E8` (Very light green)
- **Text**: `#2E7D32` (Dark green)

### Typography
- **Title Font**: SpaceMono
- **Body Font**: System default
- **Responsive sizing**: Berbeda untuk tablet, normal, small screen

### Components
- **GameButton**: 3 variants (primary, secondary, accent) × 3 sizes
- **Cards**: Rounded corners, shadows, hover effects
- **Responsive Grid**: Auto-adjust columns berdasarkan screen size

## 📚 Materi Pembelajaran

### 6 Topik Utama:
1. **🔸 Testis** - Organ Reproduksi Utama
2. **🌀 Epididirmis** - Tempat Pematangan Sperma  
3. **🛡️ Skrotum** - Pelindung Testis
4. **🏭 Tubulus Seminiferus** - Pabrik Sperma
5. **🌡️ Pampiniform Plexus** - Sistem Pendingin
6. **🔬 Sistem Lengkap** - Anatomi Komprehensif

### Kategori Filter:
- Semua, Organ Utama, Saluran, Pelindung, Struktur Internal, Sistem Vaskular, Sistem Lengkap

## 🎮 Game Mechanics

### Matching Game
- **Cards**: Image cards + Function cards
- **Objective**: Cocokkan gambar organ dengan fungsinya
- **Scoring System**:
  ```
  Base Score: 100 points per match
  Time Bonus: (remaining_time / 10) × 2
  Combo Multiplier: 1x to 5x max
  Wrong Penalty: -10 points
  Final Score = (Base + Time Bonus) × Combo - Penalties
  ```
- **Level Progression**: Otomatis lanjut dengan lebih banyak cards

### 3D Model Integration
- **Format**: GLB files dari folder `assets/models/`
- **Files Available**:
  - Testis Sliced.glb
  - Epididirmis.glb
  - Skrotum + Testicle.glb
  - Tubulus Semifernus.glb
  - Pampiniform Plexus + Testicular Artery.glb
  - All.glb (complete system)

## 🔊 Audio System

### Sound Files Required:
```
assets/sounds/
├── bgm.mp3                 # Background music (looping)
├── card-flip.mp3          # Card flip sound
├── card-match.mp3         # Correct match sound
├── card-wrong.mp3         # Wrong match sound
├── game-complete.mp3      # Level complete (optional)
└── tick.mp3               # Time warning sound
```

### Audio Features:
- **Background Music**: Continuous loop during gameplay
- **Sound Effects**: Interactive feedback untuk semua actions
- **Mute Toggle**: User dapat mute/unmute
- **Volume Control**: Otomatis adjusted per sound type

## 🚀 Setup & Installation

```bash
# Install dependencies
npm install

# Install 3D dependencies
npm install expo-three expo-gl expo-gl-cpp three@0.166.0 --legacy-peer-deps

# Start development server
npx expo start

# For testing on device
npx expo start --tunnel
```

### Required Assets:
1. **Audio files**: Place di `assets/sounds/` (lihat README di folder tersebut)
2. **3D models**: Sudah tersedia di `assets/models/`
3. **Images**: Sudah tersedia di `assets/images/Game/`

## 📱 Platform Support

- **Orientation**: Landscape only
- **Platforms**: iOS & Android
- **Screen Sizes**: 
  - Small (< 700px): Mobile phones
  - Normal (700-900px): Large phones
  - Tablet (> 900px): Tablets & landscape

## 🎯 Educational Goals

### Learning Objectives:
- Memahami struktur anatomi sistem reproduksi pria
- Mengenal fungsi setiap organ reproduksi
- Visualisasi 3D untuk pemahaman spatial
- Gamifikasi untuk engagement dan retention

### Target Audience:
- **Primary**: Siswa SD kelas 4-6
- **Secondary**: Siswa SMP sebagai review
- **Content Level**: Disesuaikan untuk anak-anak dengan bahasa sederhana

## 🔧 Technical Features

### Performance:
- **Responsive Design**: Semua screen size supported
- **Smooth Animations**: 60fps target dengan optimized rendering
- **Memory Management**: Proper cleanup untuk audio dan 3D assets
- **Error Handling**: Graceful fallbacks untuk missing assets

### Architecture:
- **Component-Based**: Reusable UI components
- **State Management**: React hooks untuk local state
- **Navigation**: Custom controller dengan typed routing
- **Asset Management**: Optimized loading dan caching

## 🚧 Roadmap

### Phase 1 (Current): ✅ 
- ✅ Basic game mechanics
- ✅ Audio system
- ✅ Materi system dengan 3D placeholder
- ✅ Responsive design

### Phase 2 (Future):
- [ ] Real 3D model viewer dengan GLTFLoader
- [ ] Leaderboard dengan persistent storage
- [ ] More organ systems (female reproductive, etc.)
- [ ] Quiz mode dengan multiple choice
- [ ] Achievement system
- [ ] Multi-language support

### Phase 3 (Advanced):
- [ ] AR mode untuk 3D models
- [ ] Voice narration
- [ ] Teacher dashboard
- [ ] Progress tracking
- [ ] Social features (share scores)

## 📄 License

MIT License - Lihat file LICENSE untuk detail lengkap.

## 👥 Contributors

- **Developer**: Game development dan educational content
- **Content**: Anatomical accuracy review
- **Design**: UI/UX dan visual elements

---

**🎓 "Belajar biologi jadi lebih seru dengan gamifikasi!"**

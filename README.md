# 🌱 Biologi Edukasi - Reproduksi

Game edukasi biologi yang dirancang khusus untuk anak-anak Sekolah Dasar (SD) dengan fokus pada materi reproduksi makhluk hidup.

## ✨ Fitur Utama

### 🎮 Game Interaktif
- Tampilan menarik dengan tema hijau alami
- Animasi smooth dan responsif
- Interface yang ramah anak

### 📚 Materi Lengkap
- **Perkembangbiakan Tumbuhan** - Cara tumbuhan berkembang biak
- **Perkembangbiakan Hewan** - Proses reproduksi hewan
- **Siklus Hidup** - Metamorfosis dan pertumbuhan
- **Organ Reproduksi** - Pengenalan organ reproduksi
- **Kuis & Permainan** - Uji pemahaman dengan games
- **Ensiklopedia Mini** - Kamus istilah biologi

### 🎨 Desain untuk Anak
- Warna-warna cerah dan menarik
- Emoji dan ikon yang fun
- Layout sederhana dan mudah dipahami
- Orientasi landscape untuk pengalaman optimal

## 🚀 Cara Menjalankan

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Jalankan Aplikasi**
   ```bash
   npx expo start
   ```

3. **Buka di Device**
   - Scan QR code dengan Expo Go app
   - Jalankan di Android/iOS emulator
   - Buka di web browser

## 🏗️ Struktur Project

```
biologi-edukasi/
├── app/                          # App routing
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation
│   │   └── index.tsx            # Home screen
│   └── _layout.tsx              # Root layout
├── components/
│   ├── screens/                 # Screen components
│   │   ├── WelcomeScreen.tsx    # Welcome/splash screen
│   │   └── MenuScreen.tsx       # Main menu
│   ├── ui/                      # UI components
│   │   ├── GameButton.tsx       # Custom button
│   │   └── GameCard.tsx         # Menu cards
│   └── AppController.tsx        # Main app controller
├── constants/
│   ├── Config.ts               # App configuration
│   └── Colors.ts               # Color themes
└── assets/                     # Images and fonts
```

## 🎯 Komponen Utama

### AppController
Mengelola navigasi dan state management aplikasi.

### WelcomeScreen
- Splash screen dengan animasi menarik
- Informasi fitur aplikasi
- Button untuk memulai

### MenuScreen
- Grid layout untuk menu topik
- Fun facts section
- Header dan footer informatif

### UI Components
- **GameButton**: Button dengan berbagai style dan animasi
- **GameCard**: Card component untuk menu items

## 🎨 Theme & Styling

Aplikasi menggunakan tema hijau yang sesuai dengan topik biologi:
- **Primary**: `#4CAF50` (Green)
- **Secondary**: `#8BC34A` (Light Green)
- **Accent**: `#FF9800` (Orange)
- **Background**: `#E8F5E8` (Very Light Green)

## 📱 Orientasi

Aplikasi dikonfigurasi untuk **landscape mode only** agar memberikan pengalaman viewing yang optimal untuk anak-anak.

## 🔧 Konfigurasi

### app.json
```json
{
  "orientation": "landscape"
}
```

### Config.ts
```typescript
export const Config = {
  APP_NAME: 'Biologi Edukasi - Reproduksi',
  APP_VERSION: '1.0.0',
  GAME_THEME: { ... }
}
```

## 🎓 Target Audience

Dirancang khusus untuk:
- Anak-anak Sekolah Dasar (7-12 tahun)
- Pembelajaran biologi dasar
- Materi reproduksi makhluk hidup

## 🔮 Roadmap

- [ ] Implementasi content screens untuk setiap topik
- [ ] Mini games interaktif
- [ ] Sistem progress tracking
- [ ] Audio narration
- [ ] Offline support
- [ ] Animations dan micro-interactions

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

## 📄 License

MIT License - Lihat file LICENSE untuk detail lengkap.

# 🚀 FlowDesk — Modern Productivity Platform

A production-ready productivity app combining **Todos**, **Sticky Notes**, and a **Kanban Board** with real-time Firebase sync.

Built by **Ritesh Verma** · [hieritesh.netlify.app](https://hieritesh.netlify.app)

## ✨ Features

- ✅ Beautiful dashboard with stats & progress
- ✅ Advanced Todo management (priority, due dates, tags, categories)
- ✅ Colorful sticky notes with pin & archive
- ✅ Drag-and-drop Kanban board
- ✅ Firebase Auth (Email + Google)
- ✅ Real-time Firestore sync
- ✅ Dark / Light / System theme
- ✅ Mobile-first responsive design
- ✅ PWA ready
- ✅ About / Support section

## 🛠️ Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd flowdesk
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Email/Password + Google)
4. Enable **Firestore Database**
5. Copy your config values

### 3. Environment Variables

```bash
cp .env.local.example .env.local
# Fill in your Firebase values
```

### 4. Firestore Indexes

Create composite indexes in Firestore console:
- `todos`: `userId` ASC + `order` ASC + `createdAt` DESC
- `notes`: `userId` ASC + `archived` ASC + `pinned` DESC + `updatedAt` DESC
- `categories`: `userId` ASC + `createdAt` ASC

### 5. Deploy Security Rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 6. Run Dev

```bash
npm run dev
# Open http://localhost:3000
```

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
# Add your NEXT_PUBLIC_FIREBASE_* env vars in Vercel dashboard
```

## 💝 Support

If this helped you, consider donating:

**UPI:** `riteshverma.in@ptyes`

**Instagram:** [@hieritesh](https://instagram.com)

---

Made with ❤️ by Ritesh Verma

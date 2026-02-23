# 🧮 PopsMath - Interactive Math Learning Website

An engaging, interactive math learning website for 6th graders to study **Proportional Relationships** and **Circles**.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Features

### 📚 Learning Content
- **6 Comprehensive Sections** covering:
  1. What Are Proportional Relationships?
  2. The Constant of Proportionality (k)
  3. Writing Equations (y = kx)
  4. Graphing Proportional Relationships
  5. Circles: Circumference (C = πd)
  6. Circles: Area (A = πr²)

### 🎯 Interactive Elements
- **Step-by-step examples** with detailed explanations
- **Practice questions** for each section (55 total)
- **Instant feedback** with explanations
- **Difficulty indicators** (Easy/Medium/Hard)
- **Common mistakes** section to avoid pitfalls

### 📝 Sample Tests
- **2 comprehensive tests** (20 questions each)
- **Password protected** (Password: `PopsMath2024`)
- **Two viewing modes**: One at a time or all questions
- **Auto-grading** with detailed results
- **Score tracking** with explanations

### 📊 Progress Tracking
- Track completed sections
- View practice scores
- Save test scores
- Progress stored in localStorage

### 🎨 Design
- Clean, student-friendly interface
- Mobile responsive (works on tablets/phones)
- Encouraging messages throughout
- Colorful, engaging visuals

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jmarma/PopsMath)

### Option 2: Manual Deploy

1. **Fork or clone this repository**

2. **Go to [Vercel](https://vercel.com)**

3. **Create a new project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Framework Preset: Next.js (auto-detected)
   - Click "Deploy"

4. **That's it!** Your site will be live in ~1 minute.

## 💻 Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/jmarma/PopsMath.git
cd PopsMath

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
PopsMath/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── section/[id]/
│   │   │   └── page.tsx          # Section pages
│   │   └── test/[id]/
│   │       └── page.tsx          # Test pages
│   ├── components/
│   │   └── Navigation.tsx        # Nav component
│   ├── data/
│   │   ├── metadata.json         # Course info
│   │   ├── lesson_plan.json      # All lessons
│   │   ├── practice_questions.json
│   │   ├── test_1.json
│   │   └── test_2.json
│   ├── lib/
│   │   └── progress.ts           # Progress utilities
│   └── types/
│       └── index.ts              # TypeScript types
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔐 Test Password

The sample tests are password protected to prevent accidental access:

**Password: `PopsMath2024`**

## 📱 Responsive Design

The website is fully responsive and works great on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktops

## 🎓 Curriculum Source

Content based on **Illustrative Mathematics v.360** curriculum for 6th Grade (Accelerated).

## 📄 License

This project is for educational purposes.

---

Made with ❤️ for learning math!
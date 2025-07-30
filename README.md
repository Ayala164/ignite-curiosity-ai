# Ignite Curiosity AI - פלטפורמה חינוכית עם בינה מלאכותית

פלטפורמה חינוכית מתקדמת המשלבת בינה מלאכותית לשיעורים אינטראקטיביים לילדים.

## מבנה הפרויקט

```
ignite-curiosity-ai/
├── client/          # צד לקוח (React + Vite)
├── server/          # צד שרת (Node.js + Express + MongoDB)
├── package.json     # הגדרות פרויקט ראשיות
└── README.md
```

## דרישות מערכת

- Node.js 18+ 
- MongoDB 6.0+
- npm או yarn

## התקנה מהירה

```bash
# שכפול הפרויקט
git clone <repository-url>
cd ignite-curiosity-ai

# התקנת כל התלויות והגדרת קבצי סביבה
npm run setup
```

## הגדרת מסד הנתונים

1. התקן MongoDB מקומית או השתמש ב-MongoDB Atlas
2. עדכן את `server/.env` עם כתובת MongoDB שלך:
```
MONGODB_URI=mongodb://localhost:27017/ignite-curiosity
```

## הרצת הפרויקט

### הרצה במצב פיתוח (שרת + לקוח יחד)
```bash
npm run dev
```

### הרצה נפרדת

#### שרת בלבד
```bash
npm run dev:server
# או
cd server && npm run dev
```

#### לקוח בלבד  
```bash
npm run dev:client
# או
cd client && npm run dev
```

## כתובות

- **לקוח**: http://localhost:8080
- **שרת**: http://localhost:5000
- **API**: http://localhost:5000/api
- **בדיקת בריאות**: http://localhost:5000/health

## בניית הפרויקט לייצור

```bash
# בניית כל הפרויקט
npm run build

# בניית שרת בלבד
npm run build:server

# בניית לקוח בלבד
npm run build:client
```

## הרצה בייצור

```bash
# לאחר בניה
npm start
```

## API Endpoints

### שיעורים (Lessons)
- `GET /api/lessons` - קבלת כל השיעורים
- `GET /api/lessons/:id` - קבלת שיעור לפי ID
- `POST /api/lessons` - יצירת שיעור חדש
- `PUT /api/lessons/:id` - עדכון שיעור
- `DELETE /api/lessons/:id` - מחיקת שיעור

### ילדים (Children)
- `GET /api/children` - קבלת כל הילדים
- `GET /api/children/:id` - קבלת ילד לפי ID
- `POST /api/children` - יצירת ילד חדש
- `PUT /api/children/:id` - עדכון ילד
- `DELETE /api/children/:id` - מחיקת ילד

### סשנים (Sessions)
- `GET /api/sessions` - קבלת כל הסשנים
- `GET /api/sessions/:id` - קבלת סשן לפי ID
- `POST /api/sessions` - יצירת סשן חדש
- `PUT /api/sessions/:id` - עדכון סשן
- `POST /api/sessions/:id/messages` - הוספת הודעה לסשן
- `DELETE /api/sessions/:id` - מחיקת סשן

## Socket.IO Events

### לקוח -> שרת
- `join-lesson` - הצטרפות לשיעור
- `send-message` - שליחת הודעה
- `change-step` - שינוי שלב בשיעור
- `change-speaker` - שינוי דובר נוכחי

### שרת -> לקוח
- `new-message` - הודעה חדשה
- `step-changed` - שלב השתנה
- `speaker-changed` - דובר השתנה
- `user-joined` - משתמש הצטרף
- `user-left` - משתמש עזב
- `session-state` - מצב סשן נוכחי

## טכנולוגיות

### צד שרת
- **Node.js** + **Express** - שרת ו-API
- **MongoDB** + **Mongoose** - מסד נתונים
- **Socket.IO** - תקשורת בזמן אמת
- **TypeScript** - פיתוח מתקדם
- **Express Validator** - ולידציה
- **Helmet** + **CORS** - אבטחה

### צד לקוח
- **React 18** - ממשק משתמש
- **TypeScript** - פיתוח מתקדם
- **Vite** - כלי בנייה מהיר
- **Tailwind CSS** - עיצוב
- **Shadcn/ui** - רכיבי UI
- **React Query** - ניהול מצב שרת
- **Socket.IO Client** - תקשורת בזמן אמת
- **React Router** - ניווט

## פיתוח

### הוספת תכונות חדשות
1. הוסף מודל במסד הנתונים (`server/src/models/`)
2. צור routes (`server/src/routes/`)
3. הוסף validation
4. צור API calls בלקוח (`client/src/services/`)
5. בנה רכיבי UI (`client/src/components/`)

### הרצת בדיקות
```bash
# שרת
cd server && npm test

# לקוח  
cd client && npm test
```

## פריסה

הפרויקט מוכן לפריסה על:
- **Heroku** / **Railway** / **Render** (שרת)
- **Vercel** / **Netlify** (לקוח)
- **MongoDB Atlas** (מסד נתונים)

## תמיכה

לשאלות ותמיכה, פנה למפתחי הפרויקט.
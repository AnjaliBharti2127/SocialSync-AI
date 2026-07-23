<div align="center">

# 📲 SocialSync-AI

### Create, schedule, and automatically publish AI-powered social media content from one unified dashboard.


## 📌 Overview

**SocialSync-AI** is a full-stack social media management platform for content creation, scheduling, and publishing.

Users connect their social media accounts, generate captions with Google Gemini, create or upload media, schedule posts for future publishing, and monitor publishing activity through a dashboard. A background scheduler checks for due posts every minute and automatically publishes them to the selected social platforms.

| Layer | Directory | Technologies |
|---|---|---|
| 🎨 Frontend | `client/` | React, TypeScript, Vite, Tailwind CSS |
| ⚙️ Backend | `server/` | Node.js, Express, TypeScript |
| 🗄️ Database | — | MongoDB, Mongoose |
| 🤖 AI text | — | Google Gemini |
| 🖼️ AI image | — | Pollinations.ai |
| ☁️ Media storage | — | Cloudinary |
| 🔗 Publishing | — | Zernio API |

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Email/password registration and login using JWT and bcrypt |
| 🔗 **Social Account Connection** | Connect, view, and disconnect social accounts (Twitter, Instagram, Facebook, LinkedIn, and business/page variants) |
| 🤖 **AI Caption Generation** | Generate captions from a prompt and tone using Google Gemini |
| 🖼️ **AI Image Generation** | Optional image generation via Pollinations.ai, stored on Cloudinary |
| ✍️ **Manual Post Creation** | Write your own caption and upload your own image or video |
| 🗓️ **Post Scheduling** | Schedule posts to one or more platforms for a future date and time |
| ⏱️ **Automatic Publishing** | A cron scheduler checks every minute and publishes due posts automatically |
| 📊 **Dashboard** | View scheduled posts, published posts, connected accounts, and recent activity |
| 📝 **Activity Log** | Recent publishing activity, success and failure |

---

## 🎬 Demo

> **TODO:** No screenshots, GIFs, or a live deployment link currently exist in the repository. Add them here once available — e.g. Dashboard, AI Composer, and Scheduler views.

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- Axios
- react-hot-toast
- lucide-react / react-simple-icons

</td>
<td valign="top" width="50%">

### Backend
- Node.js
- Express 5
- TypeScript (`tsx`)
- MongoDB + Mongoose
- JSON Web Token
- bcrypt
- Multer
- Cloudinary
- node-cron
- Google Gemini API (`@google/genai`)
- Pollinations.ai
- Zernio API (`@zernio/node`) — **TODO:** document setup

</td>
</tr>
</table>

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       Frontend        │
                         │  React + TypeScript   │
                         └──────────┬────────────┘
                                    │
                               REST API + JWT
                                    │
                         ┌──────────▼────────────┐
                         │        Backend         │
                         │  Express + TypeScript  │
                         └──────────┬────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌──────────────┐     ┌────────────────┐     ┌────────────────┐
      │   MongoDB    │     │ Google Gemini  │     │   Cloudinary   │
      │   Database   │     │ Text Generation│     │ Media Storage  │
      └──────────────┘     └────────────────┘     └───────▲────────┘
                                                            │
                                                  ┌─────────┴─────────┐
                                                  │  Pollinations.ai  │
                                                  │ Image Generation  │
                                                  └────────────────────┘

                         ┌──────────────────┐        every minute
                         │    Zernio API    │◀───────────────────────┐
                         │ Connect & Publish│                        │
                         └──────────────────┘               ┌────────┴─────────┐
                                                              │    node-cron     │
                                                              │ Scheduler Worker │
                                                              └──────────────────┘
```

---

## 🔄 Application Workflow

1. The user registers or logs in.
2. The backend issues a JWT access token.
3. The user connects one or more social media accounts (via the Zernio OAuth flow).
4. The user writes a post manually or generates content using AI (Gemini for text, Pollinations.ai for an optional image).
5. The user selects platforms and a publishing date/time, and the post is saved to MongoDB with status `scheduled`.
6. A cron job (`node-cron`) checks every minute for posts due to publish.
7. Due posts are published through the Zernio API to the connected accounts.
8. Each post's status is updated to `published` or `failed`.
9. The result is recorded in the activity log.

---

## 🚀 Installation

### Prerequisites
- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

> **TODO:** There is no root-level install script — `client/` and `server/` are separate npm projects, installed and run independently.

```bash
# 1. Clone the repository
git clone https://github.com/AnjaliBharti2127/SocialSync-AI.git
cd SocialSync-AI

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

---

## 🔑 Environment Variables

No `.env.example` file exists in the repository — these were identified by tracing `process.env.*` / `import.meta.env.*` references in the source code.

**`server/.env`**

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

GEMINI_API_KEY=your_google_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ZERNIO_API_KEY=your_zernio_api_key
```

**`client/.env`**

```env
VITE_API_BASE_URL=http://localhost:3000
```

> Never commit real API keys, passwords, tokens, or database credentials to GitHub.

---

## ▶️ Running the Project

**Start the backend** (from `/server`):

```bash
npm run server   # nodemon + tsx, auto-restarts on changes
# or
npm start         # runs once via tsx
```

Runs at `http://localhost:3000` by default.

**Start the frontend** (from `/client`):

```bash
npm run dev
```

Vite will print the local frontend URL in the terminal.

---

## 🧭 Usage

1. **Create an account** — register with name, email, and password.
2. **Connect a platform** — open **Account** and connect a supported social account.
3. **Create content** on **AI Composer** — generate a caption with AI, write your own, generate an image, or upload your own media.
4. **Schedule the post** on **Scheduler** — choose platforms, date, time, caption, and media.
5. **Track activity** on the **Dashboard** — scheduled, published, and failed posts, connected accounts, and recent activity.

---

## 🔌 Core API Routes

*(Verified directly against `server/routes/*.ts`. All routes below except register/login require a `Bearer <JWT>` token.)*

**Authentication**

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |

**Social Accounts**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/accounts` | Fetch the current user's connected accounts |
| `POST` | `/api/accounts` | Add a connected account record |
| `DELETE` | `/api/accounts/:id` | Disconnect an account |

**Social OAuth (Zernio)**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/oauth/:platform/url` | Generate a platform connect/auth URL |
| `GET` | `/api/oauth/sync` | Sync connected accounts from Zernio into MongoDB |

**Posts**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts` | Fetch the current user's posts |
| `GET` | `/api/posts/generations` | Fetch AI generation history |
| `POST` | `/api/posts` | Create/schedule a post (supports media upload) |
| `POST` | `/api/posts/generate` | Generate AI post text (+ optional image) |

**Activity**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/activity` | Fetch the 10 most recent activity log entries |

> **Note:** editing (`PATCH`) or deleting (`DELETE`) an individual post is not currently implemented on the backend — see Future Improvements.

---

## 🔐 Security

- Passwords are hashed with bcrypt before storage
- Protected routes require a valid JWT (`authMiddleware.ts`)
- Sensitive credentials are read from environment variables, not hardcoded
- User-specific resources are scoped to the authenticated user's ID
- Uploaded media is handled in-memory via Multer before being streamed to Cloudinary
- API keys (Gemini, Cloudinary, Zernio) live only on the backend and are never exposed to the frontend

---

## 📁 Project Structure

```text
SocialSync-AI/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/                 # Axios instance (base URL, auth header)
│   │   ├── components/          # Layout, Sidebar, AccountList, PlatformPickerModal
│   │   ├── context/              # AuthContext (JWT/user via localStorage)
│   │   ├── data/                  # Placeholder/mock data
│   │   ├── pages/                  # Home, Login, Dashboard, Accounts, AIComposer, Schedule
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── config/                  # DB, Cloudinary, Multer, Zernio client setup
│   ├── controllers/              # Auth, Accounts, Posts, Activity, Social-OAuth logic
│   ├── middlewares/               # JWT auth middleware
│   ├── models/                     # User, Account, Post, Generation, ActivityLog
│   ├── routes/                      # Express route definitions
│   ├── services/                     # Cron-based publishing scheduler
│   ├── package.json
│   └── server.ts
│
├── .gitignore
└── README.md
```

---

## ⚠️ Current Limitations

**Confirmed from the codebase:**
- No `.env.example`, `LICENSE`, or CI/CD configuration is present
- No automated tests were found
- `Accounts.tsx` briefly renders hardcoded dummy data (`dummyAccountsData`, etc.) before the real API response replaces it
- `AIComposer.tsx` and `Schedule.tsx` each contain large blocks of commented-out legacy code above the active implementation
- `postController.ts` includes a commented-out Leonardo.ai image integration alongside the active Pollinations.ai one — an apparent in-progress/reverted provider migration
- Only a single "Initial commit" exists in Git history — no development timeline to reference
- Editing or deleting an individual scheduled post has no backend route yet
- The `@zernio/node` integration's setup/account-creation process isn't documented in-repo

**General considerations:**
- Social publishing depends on third-party platform permissions and API availability
- Some platforms may require developer, creator, page, or business accounts to connect
- AI-generated content may need manual review before publishing
- Third-party APIs (Gemini, Cloudinary, Pollinations.ai, Zernio) may enforce their own rate limits

---

## 🔮 Future Improvements

> These are suggested directions, not an official roadmap — no issue tracker or planning doc was found in the repo.

- Edit/delete routes for individual scheduled posts
- Post performance and engagement analytics
- Drag-and-drop visual content calendar
- Recurring post scheduling, templates, and saved drafts
- AI hashtag recommendations
- Team workspaces and role-based permissions
- Email/in-app publishing notifications
- Automated unit and integration tests
- CI/CD (e.g. GitHub Actions) and Docker support
- Additional social platforms
- Retry queue for failed publishing attempts

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a pull request

---

## ⚖️ Disclaimer

SocialSync-AI integrates with third-party services including Google Gemini, Cloudinary, Pollinations.ai, and the Zernio publishing API. Each service has its own terms of service, API limits, pricing, and content policies. Review AI-generated content before publishing, and test with non-critical social media accounts before scheduling anything live.

---

## 👩‍💻 Author

**Anjali Bharti**
- GitHub: [@AnjaliBharti2127](https://github.com/AnjaliBharti2127)
- LinkedIn: [Anjali Bharti](https://www.linkedin.com/in/anjali-bharti-5647b2321/)

---

<div align="center">

### ⭐ Support the Project

If you found this project useful, consider giving the repository a star.

**Built with React, TypeScript, Node.js, MongoDB, and AI.**

</div>

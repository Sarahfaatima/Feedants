# Feedants — Competition Details

A full-stack implementation of the Feedants **Competition Details** screen: React Native (Expo) frontend, Node.js/Express backend, MongoDB/Mongoose data layer. Built for the Feedants Full Stack Development Internship technical assignment.

```
/
├── mobile/    React Native (Expo) app
├── server/    Express + MongoDB API
└── README.md
```

Every value shown on the Competition Details screen — prices, dates, remaining spots, registration state, rewards, winners, testimonials — is served from MongoDB through the API. Nothing about the competition is hardcoded in the app; the only hardcoded strings are the static UI labels used for the English/Hindi toggle (e.g. "Registered", "Go back").

---

## 1. Prerequisites

- Node.js 20+ (developed on Node 22)
- MongoDB, configured as a (possibly single-node) **replica set** — required for the multi-document transaction used by the registration endpoint. See §2.1.
- Expo Go app on your phone, or an Android/iOS simulator, to run the mobile app
- Your computer and phone on the same Wi-Fi network (if using a physical device)

## 2. Backend setup (`server/`)

```bash
cd server
npm install
cp .env.example .env   # then edit values as needed, see §2.2
```

### 2.1 MongoDB with a replica set

The registration endpoint uses a MongoDB **transaction** to atomically (a) increment the competition's booked-seat count only if a seat is still free, and (b) insert the registration record — see §5 for why. Multi-document transactions require the target `mongod` to be part of a replica set, even a single-node one.

If you already have MongoDB running as a plain standalone instance, initialize a single-node replica set instead of reinstalling anything:

```bash
mongod --replSet rs0 --dbpath <your-data-dir> --port 27017
# in another terminal:
mongosh --eval "rs.initiate({_id:'rs0', members:[{_id:0, host:'127.0.0.1:27017'}]})"
```

If port 27017 is already taken by another MongoDB instance (e.g. a Windows service installed without replication), run this one on an alternate port (e.g. `27018`) and point `MONGODB_URI` at it instead — this is exactly what was done during development on this machine (see `.env.example`).

Alternatively, a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster is already configured as a replica set out of the box and needs no local setup — just drop its connection string into `MONGODB_URI`.

### 2.2 Environment variables (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port (default `4000`) |
| `MONGODB_URI` | MongoDB connection string; **must** point at a replica set (see §2.1) |
| `JWT_SECRET` | Secret used to sign JWTs — change for any real deployment |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `CORS_ORIGIN` | Allowed origin(s), comma separated, or `*` |
| `MAX_UPLOAD_BYTES` | Max submission file size (default 50MB) |
| `SEED_DEMO_EMAIL` / `SEED_DEMO_PASSWORD` | Credentials for the seeded demo account (dev only) |

### 2.3 Seed demo data

```bash
npm run seed
```

This creates:
- a demo user (see printed credentials, also `demo@feedants.com` / `Demo@1234` by default)
- the "Feedants Classical Dance" competition, matching the design reference
- the demo user registered into it (via the real registration service, not a raw DB write)
- 4 previous winners, 3 testimonials, and the 6-position reward table

**All competition dates are computed relative to the moment you run the seed script** (e.g. `registrationClose = now + ~1.25 days`), not fixed calendar dates — so the competition is always in a live `registration_open` state right after seeding, regardless of when you (or an evaluator) run it. Re-run `npm run seed` any time to reset the demo data.

### 2.4 Run the API

```bash
npm run dev     # nodemon, auto-reload
# or
npm start
```

Health check: `GET http://localhost:4000/api/health`

## 3. Mobile app setup (`mobile/`)

```bash
cd mobile
npm install
cp .env.example .env   # then set EXPO_PUBLIC_API_URL, see below
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `a`/`i` for an emulator/simulator.

### 3.1 Pointing the app at your backend

Edit `mobile/.env`:

| Environment | `EXPO_PUBLIC_API_URL` |
|---|---|
| Android emulator | `http://10.0.2.2:4000` |
| iOS simulator | `http://localhost:4000` |
| Physical device (Expo Go) | `http://<your-computer's-LAN-IP>:4000` |

Find your LAN IP with `ipconfig` (Windows) or `ifconfig`/`ip addr` (macOS/Linux). The API must be reachable from wherever the app runs — `localhost` only works when the app and server share the same machine (e.g. iOS simulator on the same Mac).

### 3.2 Demo login

The app opens straight into the tab bar (Home). Log in from the **Profile** tab, or tap the bottom CTA on a competition's details screen, using:

```
demo@feedants.com / Demo@1234
```

(seeded in §2.3). You can also register a new account from the login screen.

---

## 4. API reference

All responses are JSON. Authenticated routes expect `Authorization: Bearer <token>`.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account, returns `{ token, user }` |
| POST | `/api/auth/login` | — | Returns `{ token, user }` |
| GET | `/api/auth/me` | required | Current user |
| GET | `/api/competitions` | optional | List competitions |
| GET | `/api/competitions/:id` | optional | Competition detail + computed `lifecycleStatus`, `remainingSpots`, `isFull`, and (if logged in) `viewer.isRegistered` |
| GET | `/api/competitions/:id/winners` | — | Previous winners |
| GET | `/api/competitions/:id/testimonials` | — | Testimonials |
| GET | `/api/competitions/:id/rewards` | — | Reward table |
| GET | `/api/competitions/:id/participation` | required | The authoritative viewer state: `isRegistered`, `canRegister`, `canSubmit`, `remainingSpots`, `submission`, etc. — the frontend drives all its button states from this, never from local counters |
| POST | `/api/competitions/:id/register` | required | Registers the caller (see §5 for concurrency handling) |
| POST | `/api/competitions/:id/submission` | required | Multipart upload (`file` field); validates registration + submission window + file type/size + duplicate |
| GET | `/api/competitions/:id/submission` | required | The caller's own submission, if any |

Errors are always `{ error: { message, code } }` with an appropriate HTTP status (400/401/403/404/409/422/500).

## 5. Concurrency-safe registration (why it's built this way)

The two hard requirements were: never oversell a competition's capacity, and never let a user register twice, **even under concurrent requests**. Both are enforced at the database level, not in application logic that reads-then-writes (which would race):

1. **Capacity**: `Competition.findOneAndUpdate({ _id, status: 'active', $expr: { $lt: ['$bookedCount', '$capacity'] } }, { $inc: { bookedCount: 1 } })`. The capacity comparison and the increment happen as a single atomic document operation — there is no window between "check" and "write" for two requests to both pass the check.
2. **No duplicates**: a unique compound index on `Registration { competition, user }`. A second registration attempt is rejected by MongoDB itself with a duplicate-key error, not by an application-level `findOne` check (which would itself race).
3. Both writes run inside one MongoDB **transaction** (`src/services/registrationService.js`). If the `Registration` insert fails (duplicate), the transaction aborts and the `bookedCount` increment is rolled back automatically — no manual compensation logic needed.

This was verified with a script that fires 10 concurrent registration attempts against a competition with `capacity: 3`: exactly 3 succeed, `bookedCount` ends at exactly 3, and the other 7 receive a clean `409 COMPETITION_FULL`.

`bookedCount` on the `Competition` document is a denormalized counter for fast reads (avoids a `COUNT` query on every page load at scale); `Registration` documents remain the source of truth / audit trail.

## 6. Competition lifecycle

Nothing about "is registration open" or "can I submit" is stored as a flag or computed on the client. `src/services/lifecycleService.js` derives one of `upcoming → registration_open → registration_closed → submission_open → submission_closed → results_published` from the current server time compared against the competition's stored timestamps, on every request. The mobile app renders its CTA and countdown purely from what the API returns for the current moment.

## 7. Assumptions, decisions, trade-offs, and what I'd improve

**Assumptions**
- One submission per user per competition (no resubmission/edit flow) — simplest model that satisfies the stated "Submitted" state; a real product would likely allow replacing an entry until the window closes.
- Duets/group entries are out of scope; one file per registrant.
- The design reference's own displayed dates (e.g. submission starting before registration closes) look like placeholder/inconsistent values rather than an intended lifecycle rule, so the seed script uses a logically consistent ordering (`registration → submission → results`) instead of literally reproducing that sequence, while keeping the same relative magnitudes (e.g. a ~1-day registration countdown) and all other visible values (prize pool, entry fee, rewards, judge, winners) as close to the reference as possible.
- "Only contributions from paid participants will be considered for judging" (the disclaimer text) is treated as a business rule for judging, not something enforced at the API layer — there's no separate payment-capture step to condition on for this assignment.

**Major technical decisions**
- **MongoDB transactions over optimistic/manual locking** for registration, because the assignment explicitly asked for an atomic strategy and transactions map most directly and legibly onto "increment a counter and insert a row, or do neither." See §5.
- **Denormalized `bookedCount`** on `Competition` rather than counting `Registration` documents on every read, since the details screen is the highest-traffic read path and is expected to scale to "thousands of concurrent users."
- **Lifecycle computed server-side, on every request**, from raw timestamps rather than a stored/cached status field, so it's never possible for the client and server to disagree about whether registration is open.
- **JWT with no refresh-token flow** — appropriately scoped for this assignment; see below for what a production system would need instead.
- **Local disk storage for submissions** via multer, behind a thin enough abstraction (`fileUrl`/`fileName`/`mimeType` on the `Submission` model) that swapping in S3/Cloud Storage later is a change to one controller, not the schema.
- **Bilingual content stored as `{ en, hi }` sub-documents** on `Competition` (description, judgingParameters, rules) rather than a separate translations table, since the competition catalog is expected to be small relative to read volume — this trades a little schema flatness for avoiding an extra join/lookup on the hot read path.
- **express-validator + a small `validate` middleware** for request validation, and a centralized `errorHandler` so every route throws a plain `ApiError` and gets a consistent JSON error shape.

**Trade-offs considered**
- Considered doing the capacity check with only a unique index and no transaction (i.e., always try to increment, let over-capacity registrations get "cleaned up" later) — rejected because it would let capacity be briefly exceeded, which the assignment explicitly disallows.
- Considered storing `lifecycleStatus` as a cached field updated by a cron/worker instead of computing it per-request — rejected for this scope because it adds a moving part (a scheduler) and a staleness window in exchange for CPU cycles that are trivial for a single date-range comparison.
- Considered `mongodb-memory-server` to make the backend runnable with zero local MongoDB setup — rejected in favor of documenting a real replica-set setup (§2.1), since an in-memory DB would silently mask the exact concurrency behavior (transactions, indexes) this assignment is being evaluated on.

**What I'd change for a real production deployment**
- Move file storage to S3/Cloud Storage with signed upload URLs instead of local disk + `express.static`, and put a CDN in front of it.
- Add a refresh-token flow (short-lived access token + rotating refresh token) instead of a single long-lived JWT.
- Add per-competition admin CRUD (currently competitions are seed/DB-managed only — there's no admin API, since it wasn't in scope).
- Add server-side image/video transcoding + virus scanning on submissions.
- Replace the in-memory rate limiter (`express-rate-limit`) with a Redis-backed store so limits are consistent across multiple API instances behind a load balancer.
- Add structured logging/metrics (e.g. pino + OpenTelemetry) and a proper migrations tool for schema changes instead of ad-hoc seed scripts.
- Paginate `GET /api/competitions` and the winners/testimonials lists once the catalog grows beyond a page.

## 8. Demo account

```
Email:    demo@feedants.com
Password: Demo@1234
```

Created by `npm run seed` in `server/`. Development-only credentials — not meant for production use.

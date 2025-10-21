# Ganapatih-BE-Twitter App — README

> **Base URL contoh**: `https://your-domain.com`  
> Semua endpoint diprefiks dengan `/api/...`

---

## Daftar Isi

- [Langkah Instalasi Project](#langkah-instalasi-project)
- [Autentikasi & Otorisasi](#autentikasi--otorisasi)
- [Konvensi Respons Error Global](#konvensi-respons-error-global)
- [A. Register User](#a-register-user)
- [B. Login User](#b-login-user)
- [C. Check Login + Refresh Token](#c-check-login--refresh-token)
- [C. Logout](#c-logout)
- [D. Create Post](#d-create-post)
- [E. Follow Request](#e-follow-request)
- [F. Unfollow Request](#f-unfollow-request)
- [G. Get Followed User Post (Feed)](#g-get-followed-user-post-feed)
- [H. Search User by Username](#h-search-user-by-username)
- [J. Get My Profile](#j-get-my-profile)
- [Ringkasan Status Kode](#ringkasan-status-kode)
- [Catatan Implementasi](#catatan-implementasi)
- [Postman Collection](#postman-collection)

---

## Langkah Instalasi Project

## 0) Prasyarat

- **Node.js ≥ 18** dan **npm ≥ 10**
- **Docker Engine** + **Docker Compose plugin** (untuk testing)
  link dokumentasi instalasi: https://docs.docker.com/compose/install/
- **Git**
- Port kosong: 5432 (Postgres), 3000 (App)

## 1) Clone & Install Dependencies

```bash
git clone ganapatih-recruitment-be
cd ganapatih-recruitment-be
npm install
```

## 2) Siapkan Environment

Salin contoh env:

```bash
.env.example .env
.env.test.example .env.test
```

```
DATABASE_URL=URLDATABASEPRISMA
DIRECT_URL=URLDATABASEPRISMAFORMIGRATEPROD
JWT_SECRET=JWTSECRET
BASE_CLIENT=YOURCLIENTAPPLINK
PORT=3000

untuk testing, DATABASE_URL bisa disesuaikan ke postgresql://prisma:prisma@localhost:5433/tests (mengacu docker-compose.yml)
```

## 3) Prisma — Generate & Migrate

```bash
npx prisma generate
npx prisma db push
```

## 5) Jalankan Aplikasi

### Development

```bash
npm run dev
```

### Build & Start

```bash
npm run build
npm start
```

## 6) Testing

Script test sudah men-setup DB dan Prisma untuk **.env.test**:

```bash
npm run test
```

ketik 'y' dan enter bila muncul

```
? Are you sure you want to reset your database? All data will be lost. › (y/N)

```

Hasil testing: ![Gambar testing](/public/testing.png)

## Autentikasi & Otorisasi

- **Skema**: Bearer Token via **Cookie**
  - Cookie name: `Authorization`
  - Nilainya: `Bearer <token>`
- Endpoint yang **butuh login**: ditandai dengan 🔒
- Jika token tidak valid/kedaluwarsa → `401 Invalid token`

---

## Respons Error Global

```json
(500)
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## A. Register User

**Route**: `POST /api/register`  
**Body**:

```json
{
  "username": "E",
  "password": "12345"
}
```

**Respons**:

```json
(201)
{
  "id": "19cad4b1-6f68-4bf3-b769-d493c1b89573",
  "username": "Aulatul Jannah"
}
```

```json
(409)
{
  "success": false,
  "message": "Username already exists"
}
```

```json
(400)
{
  "success": false,
  "message": "Validation error",
  "details": "Password field required"
}
```

---

## B. Login User

**Route**: `POST /api/login`  
**Body**:

```json
{
  "username": "C ngefollow E",
  "password": "12345"
}
```

**Respons**:

```json
(200)
{
  "token": "string"
}
```

```json
(401)
{
  "success": false,
  "message": "Invalid username/ password"
}
```

```json
(404)
{
  "success": false,
  "message": "Data not found"
}
```

> Setelah `200`, server mengirim cookie `Authorization=Bearer <token>`.

---

## C. Check Login + Refresh Token 🔒

**Route**: `GET /api/login`  
**Cookie**: `Authorization=Bearer ${tokenFromResultLogin}`

**Respons**:

```json
(401)
{
  "success": false,
  "message": "Invalid token"
}
```

```json
(200)
{
  "success": true,
  "message": "Token is valid",
  "userid": "{{userid}}"
}
```

---

## C. Logout 🔒

**Route**: `GET /api/logout`  
**Cookie**: `Authorization=Bearer ${tokenFromResultLogin}`

**Respons**:

```json
(200)
{
  "success": true,
  "message": "Logout success"
}
```

```json
(401)
{
  "success": false,
  "message": "Invalid token"
}
```

---

## D. Create Post 🔒

**Route**: `POST /api/posts`  
**Cookie**: `Authorization=Bearer ${token}`  
**Body**:

```json
{
  "content": "konten baru"
}
```

**Respons**:

```json
(201)
{
  "id": "0d7210dd-6d09-4cd5-9c20-0e022f16400e",
  "userid": "1dc93aae-0991-4c75-9f7c-df5481c49b26",
  "content": "konten baru",
  "createdat": "2025-10-21T04:47:32.976Z"
}
```

```json
(422)
{
  "success": false,
  "message": "Column character limit has reached"
}
```

```json
(400)
{
  "success": false,
  "message": "Validation error",
  "details": "Content field is required"
}
```

```json
(401)
{
  "success": false,
  "message": "Invalid token"
}
```

**Batasan**: Maksimal 200 karakter (`422` jika terlampaui).

---

## E. Follow Request 🔒

**Route**: `POST /api/follow/{{userid}}`  
**Cookie**: `Authorization=Bearer ${token}`

**Respons**:

```json
(200)
{
  "message": "You are now following user 19cad4b1-6f68-4bf3-b769-d493c1b89573"
}
```

**atau**

```json
(200)
{
  "message": "You have following user 19cad4b1-6f68-4bf3-b769-d493c1b89573"
}
```

```json
(404)
{
  "success": false,
  "message": "User not found"
}
```

```json
(401)
{
  "success": false,
  "message": "Invalid token"
}
```

---

## F. Unfollow Request 🔒

**Route**: `DELETE /api/follow/{{userid}}`  
**Cookie**: `Authorization=Bearer ${token}`

**Respons**:

```json
(200)
{
  "message": "You unfollowing user 19cad4b1-6f68-4bf3-b769-d493c1b89573"
}
```

**atau**

```json
(200)
{
  "message": "You have unfollowed user 19cad4b1-6f68-4bf3-b769-d493c1b89573"
}
```

```json
(404)
{
  "success": false,
  "message": "User not found"
}
```

```json
(401)
{
  "success": false,
  "message": "Invalid token"
}
```

---

## G. Get Followed User Post (Feed) 🔒

**Route**: `GET /api/feed?page=3&limit=10`  
**Cookie**: `Authorization=Bearer ${token}`

**Respons**:

```json
(200)
{
  "page": 3,
  "dataPerPage": 10,
  "totalPage": 5,
  "posts": [
    {
      "id": "c1a6c9ad-8969-4680-8cd4-146335b149a9",
      "userid": "1dc93aae-0991-4c75-9f7c-df5481c49b26",
      "content": "geboy",
      "createdat": "2025-10-19T11:33:41.420Z",
      "username": "C ngefollow E"
    }
    // ... lainnya
  ]
}
```

**atau (kosong)**

```json
(200)
{
  "page": 3,
  "dataPerPage": 10,
  "totalPage": 0,
  "posts": []
}
```

```json
(401)
{
  "success": false,
  "message": "Invalid token"
}
```

**Parameter Query**

- `page` (number) — halaman saat ini.
- `limit` (number) — jumlah data per halaman.

---

## H. Search User by Username 🔒

**Route**: `GET /api/users?search=ulA&page=1&limit=5`  
**Cookie**: `Authorization=Bearer ${token}`

**Parameter**

- `search`: filter berdasarkan `username` (case-insensitive).
- `page`: nomor halaman.
- `limit`: jumlah data per halaman.

**Respons**:

```json
(200)
{
  "users": [
    {
      "id": "19cad4b1-6f68-4bf3-b769-d493c1b89573",
      "username": "Aulatul Jannah",
      "following": [],
      "followers": []
    }
  ],
  "totalPages": 1,
  "page": 1,
  "dataPerPage": 5
}
```

```json
(401)
{
  "success": false,
  "message": "Invalid username/ password"
}
```

---

## J. Get My Profile 🔒

**Route**: `GET /api/me`  
**Cookie**: `Authorization=Bearer ${token}`

**Respons**:

```json
(200)
{
  "success": true,
  "message": "Get my profile successfully finish",
  "user": {
    "id": "1dc93aae-0991-4c75-9f7c-df5481c49b26",
    "username": "C ngefollow E",
    "created_at": "2025-10-15T08:42:31.657Z",
    "refresh_token": "{{}}",
    "posts": ["...", "..."],
    "followers": ["...", "..."],
    "following": ["...", "..."]
  }
}
```

```json
(401)
{
  "success": false,
  "message": "Invalid username/ password"
}
```

---

## Ringkasan Status Kode

- `200 OK` — Berhasil (GET/aksi follow/unfollow, validasi token, logout).
- `201 Created` — Berhasil membuat resource (register, post).
- `400 Bad Request` — Validasi input gagal.
- `401 Unauthorized` — Token tidak valid / kredensial salah.
- `404 Not Found` — Data tidak ditemukan (mis. target user).
- `409 Conflict` — Duplikasi (username sudah ada).
- `422 Unprocessable Entity` — Batas kolom/aturan bisnis dilanggar.
- `500 Internal Server Error` — Error tak terduga di server.

---

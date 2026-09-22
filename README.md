# Personal Portfolio / Resume Website

A full-stack personal portfolio site: Spring Boot REST API + MySQL backend, Angular frontend,
secured with JWT-based authentication and Google OAuth2 for admin login, fully containerized with Docker.

## Architecture

- **Backend**: Spring Boot 3.3 (Java 17), Spring Security, Spring Data JPA, MySQL
- **Frontend**: Angular 18 (standalone components, signals), served via nginx in production
- **Auth**: Admin logs in either with a local username/password (JWT issued directly) or
  "Sign in with Google" (OAuth2 login → backend verifies the email is on an allow-list → issues
  the same JWT). All admin API calls require `Authorization: Bearer <token>`.
- **Public site**: No login needed. Visitors see your profile, education, experience, skills,
  certifications, and social links, and can submit a contact form.
- **Deployment**: `docker-compose` runs three containers — `mysql`, `backend`, `frontend` (nginx) — on one bridge network. Nginx reverse-proxies `/api`, `/oauth2`, and `/login/oauth2` to the backend, so frontend and backend share one origin in production (no CORS headaches).

## Project Structure

```
portfolio-project/
├── backend/                  # Spring Boot app
│   ├── src/main/java/com/portfolio/app/
│   │   ├── entity/            # Profile, Education, Experience, Certification, Skill, SocialLink, ContactMessage, AdminUser
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── controller/        # PublicController (open), Admin*Controller (JWT-protected), AuthController
│   │   ├── security/          # JwtUtil, JwtAuthenticationFilter, OAuth2 success/failure handlers
│   │   ├── config/            # SecurityConfig, DataSeeder
│   │   └── dto/, exception/
│   ├── src/main/resources/application.yml
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                  # Angular app
│   ├── src/app/
│   │   ├── core/               # services, guards, interceptor, models
│   │   ├── features/public/    # visitor-facing resume page
│   │   ├── features/admin/     # login, OAuth2 redirect handler, dashboard + CRUD editors
│   │   └── shared/components/  # navbar
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## 1. Configure Google OAuth2

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and create an OAuth 2.0 Client ID (type: Web application).
2. Add an authorized redirect URI matching where you'll run this:
   - Local docker-compose: `http://localhost/login/oauth2/code/google`
   - Production domain: `https://yourdomain.com/login/oauth2/code/google`
3. Copy the generated Client ID and Client Secret into your `.env` file (see below).

## 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in real values — especially:
- `JWT_SECRET` — generate with `openssl rand -base64 64`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from step 1
- `ADMIN_ALLOWED_EMAILS` — your Google account email(s); **only these can log in via Google**, even though anyone can technically attempt Google sign-in
- `ADMIN_DEFAULT_USERNAME` / `ADMIN_DEFAULT_PASSWORD` — local fallback login, seeded automatically on first backend startup
- `MYSQL_ROOT_PASSWORD`, `DB_PASSWORD` — database credentials

**Never commit `.env`** — it's already in `.gitignore`.

## 3. Run with Docker Compose

```bash
docker-compose up --build
```

This builds and starts all three containers. First startup takes a few minutes (Maven dependency download + npm install + Angular build).

- Frontend (public site + admin login): **http://localhost**
- Backend API directly: **http://localhost:8080/api**
- MySQL: **localhost:3306** (exposed for local inspection if needed)

## 4. Log in as admin

- Go to `http://localhost/admin/login`
- Either:
  - Use the seeded local credentials (`ADMIN_DEFAULT_USERNAME` / `ADMIN_DEFAULT_PASSWORD` from `.env`), or
  - Click "Sign in with Google" — only works if your Google account's email is in `ADMIN_ALLOWED_EMAILS`
- Once logged in, you land on `/admin` — a dashboard with tabs to edit your Profile, Experience, Education, Skills, Certifications, Social Links, and view incoming Contact Messages.

All changes save immediately to MySQL via the protected `/api/admin/**` endpoints and are reflected on the public site right away (no rebuild needed — it's all data-driven).

## 5. Local development (without Docker)

**Backend:**
```bash
cd backend
# Requires a running MySQL instance matching application.yml defaults,
# or export DB_HOST/DB_USERNAME/DB_PASSWORD/etc. to point elsewhere
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
ng serve
```
Visit `http://localhost:4200`. The dev `environment.ts` points API calls directly at `http://localhost:8080/api`, so run the backend too. CORS is already configured server-side for `http://localhost:4200`.

## API Overview

| Endpoint | Auth | Description |
|---|---|---|
| `POST /api/auth/login` | Public | Username/password login → returns JWT |
| `GET /oauth2/authorization/google` | Public | Starts Google OAuth2 login flow |
| `GET /api/public/profile`, `/education`, `/experience`, `/certifications`, `/skills`, `/social-links` | Public | Read-only portfolio data |
| `POST /api/public/contact` | Public | Submit contact form |
| `GET/POST/PUT/DELETE /api/admin/**` | JWT (ROLE_ADMIN) | Full CRUD on all portfolio content + contact message inbox |

## Security notes

- Passwords are hashed with BCrypt; never stored in plaintext.
- JWT secret, DB credentials, and Google OAuth2 secret are all environment-driven — nothing sensitive is hardcoded in source.
- The `ADMIN_ALLOWED_EMAILS` allow-list is what actually restricts admin access via Google login — without it, any Google account could log in. Keep this list tight.
- Admin endpoints are stateless and JWT-protected; CSRF is disabled since there are no cookie-based sessions.
- Change `JWT_SECRET` and all default passwords before deploying anywhere public.

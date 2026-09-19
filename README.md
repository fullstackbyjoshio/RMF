# RMF Region 12 — Maiden Provincial Convention 2026 Registration

A secure, animated registration form built with Python (Flask) + SQLite.

## Event details (extracted from the scanned form)
- **Event:** Maiden Provincial Convention 2026
- **Dates:** 13th – 15th November 2026
- **Theme:** "The Excellent Man"
- **Fields:** Full Name (Surname first), Email, Phone Number, Zone, Area,
  Attendance mode (Physically / Online), Date of Birth (calendar picker),
  Position held in RMF (optional), Position in Church (optional)

## Quick start
```bash
cd rmf_convention
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
export SECRET_KEY=$(python -c "import secrets;print(secrets.token_hex(32))")
export ADMIN_PASSWORD="pick-a-strong-password"
python app.py
# open http://localhost:5000
```

## Security features
- CSRF tokens (session-bound, verified on every POST)
- Strict Content-Security-Policy + `X-Frame-Options: DENY`, `nosniff`, HSTS
- Rate limiting (10 submissions / 10 min / IP) and honeypot spam trap
- Server-side validation with parameterized SQL (injection-safe)
- Unique-email constraint, obfuscated admin path, session-gated dashboard
- `SESSION_COOKIE_HTTPONLY`, `SameSite=Lax`, 64 KB request cap

## Admin
- Dashboard: `/rmf-admin-2026/` (password from `ADMIN_PASSWORD`)
- Export: `/rmf-admin-2026/export.csv`

## Before going live
1. Replace the placeholder zone names in `ZONES` (top of `app.py`) with the
   official RMF Region 12 zones.
2. Set a strong `SECRET_KEY` and `ADMIN_PASSWORD` via environment variables.
3. Serve behind HTTPS (e.g. Nginx + gunicorn) so HSTS applies.
4. Optional: add an SMTP confirmation email in the `/register` handler.

## Deployment options (Python hosting required)
- **PythonAnywhere** — easiest for .ng projects
- **VPS** (Ubuntu): `gunicorn -w 3 -b 127.0.0.1:8000 app:app` behind Nginx + Let's Encrypt
- **Railway / Render** — connect the repo, set env vars, done

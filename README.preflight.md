# Trae Preflight

This folder is prepared for `wangxt-758-1`.

Use `.env` for stable local ports and compose project identity:

- APP_PORT: 18058
- API_PORT: 19058
- WEB_PORT: 20058
- DB_PORT: 21058
- REDIS_PORT: 22058

Smoke entry:

```bash
bash scripts/smoke.sh
```

The preflight files are environment scaffolding only. The generated business
project can replace or extend them when needed.

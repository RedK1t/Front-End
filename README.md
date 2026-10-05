<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/RedK1t/RedKit/main/docs/assets/logo-light.svg">
    <img src="https://raw.githubusercontent.com/RedK1t/RedKit/main/docs/assets/logo-dark.svg" alt="RedKit" width="96">
  </picture>
</p>

<h1 align="center">RedKit Dashboard</h1>

<p align="center">React + TypeScript web app that brings every RedKit tool together in one UI.<br>
Part of <a href="https://github.com/RedK1t/RedKit"><b>RedKit</b></a>, a modular, web-based penetration-testing framework.</p>

---

## Features

Recon (WHOIS, subdomains, ports, endpoints), web analysis, the AI vulnerability scanner and reports, the interceptor (HTTP history, Repeater, Intruder) with an in-browser Kali desktop, and an AI assistant. Accounts and storage are handled by Supabase.

**Stack:** React 19, TypeScript, Vite, Tailwind, shadcn/ui, Supabase.

## Run

```bash
cp template.env .env    # service URLs + Supabase/Groq keys (baked in at build time)
npm install
npm run dev             # http://localhost:5173
```

With Docker (nginx):

```bash
docker build -t redkit-frontend . && docker run -p 5173:5173 redkit-frontend
```

The dashboard calls the backend services at the URLs set in `.env`. To bring up the whole stack, see the [RedKit](https://github.com/RedK1t/RedKit) repo.

## License

[MIT](LICENSE). For authorized security testing and education only. Only scan systems you own or have written permission to test.

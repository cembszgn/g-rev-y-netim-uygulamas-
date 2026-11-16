# Yayına alma kontrol listesi

- GitHub'daki public repository'yi Vercel veya Netlify'a aktarın.
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback için `vercel.json` veya Netlify `_redirects` kullanın.
- API örneği ayrı Node servisi gerektirir. Arayüz LocalStorage ile çalışır; frontend deploy'u için API zorunlu değildir.

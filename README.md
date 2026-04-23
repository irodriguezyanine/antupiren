# Eventos Antupirén - Rediseño Web

Sitio multi-página en Next.js para reemplazar `eventosantupiren.cl`, optimizado para conversión a WhatsApp, SEO local y administración interna de contenido.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Deploy en Vercel
- Cloudinary para almacenamiento de contenido editable y fotos de galería
- Panel admin interno en `/admin`

## Configuración local

1. Instalar dependencias:

```bash
npm install
```

2. Copiar variables:

```bash
cp .env.example .env.local
```

3. Completar `.env.local`:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Opcionales: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GTM_ID`, `CONTACT_WEBHOOK_URL`

4. Correr en desarrollo:

```bash
npm run dev
```

## Estructura pública

- `/`
- `/matrimonios`
- `/eventos-corporativos`
- `/celebraciones-sociales`
- `/activaciones-de-marca`
- `/galeria`
- `/nosotros`
- `/contacto`

## Panel administrador

- Login: `/admin/login`
- Dashboard: `/admin`

Funciones:
- Edición rápida de textos y WhatsApp
- Subida de fotos por categoría (Cloudinary)
- Editor avanzado de JSON para controlar textos, secciones, testimonios y galería

## Deploy en Vercel

1. Subir repositorio a GitHub
2. Importar proyecto en Vercel
3. Cargar variables de `.env.example` en Development, Preview y Production
4. Deploy

## Notas importantes

- Si Cloudinary no está configurado, el sitio usa contenido semilla local y el admin no podrá persistir cambios.
- El objetivo de conversión principal es WhatsApp; deja GA4/GTM configurado para medir resultados reales.

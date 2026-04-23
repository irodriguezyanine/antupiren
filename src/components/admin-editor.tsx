"use client";

import { useMemo, useState } from "react";

import type { EventCategory, SiteContent } from "@/types/content";

type AdminEditorProps = {
  initialContent: SiteContent;
};

const categoryOptions: EventCategory[] = [
  "matrimonios",
  "corporativos",
  "sociales",
  "activaciones",
  "espacio",
];

export function AdminEditor({ initialContent }: AdminEditorProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [jsonDraft, setJsonDraft] = useState(
    JSON.stringify(initialContent, null, 2),
  );
  const [status, setStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const activeTestimonials = useMemo(
    () => content.testimonials.filter((item) => item.enabled).length,
    [content.testimonials],
  );

  async function saveContent(next: SiteContent) {
    setIsSaving(true);
    setStatus("");

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });

    setIsSaving(false);
    if (!response.ok) {
      setStatus("No se pudo guardar. Revisa configuración de Cloudinary.");
      return;
    }

    setStatus("Cambios guardados correctamente.");
    setContent(next);
    setJsonDraft(JSON.stringify(next, null, 2));
  }

  async function handleSaveJson() {
    try {
      const parsed = JSON.parse(jsonDraft) as SiteContent;
      parsed.updatedAt = new Date().toISOString();
      await saveContent(parsed);
    } catch {
      setStatus("JSON inválido. Corrige formato antes de guardar.");
    }
  }

  async function handleQuickSave() {
    const next = {
      ...content,
      updatedAt: new Date().toISOString(),
    };
    await saveContent(next);
  }

  async function handleUpload(formData: FormData) {
    setUploading(true);
    setStatus("");

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!response.ok) {
      setStatus("No se pudo subir imagen a Cloudinary.");
      return;
    }

    const uploaded = (await response.json()) as {
      secureUrl: string;
      publicId: string;
      title: string;
      description: string;
      category: EventCategory;
    };

    const next = {
      ...content,
      gallery: [
        ...content.gallery,
        {
          id: crypto.randomUUID(),
          title: uploaded.title,
          description: uploaded.description,
          category: uploaded.category,
          imageUrl: uploaded.secureUrl,
          publicId: uploaded.publicId,
          enabled: true,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    setContent(next);
    setJsonDraft(JSON.stringify(next, null, 2));
    setStatus("Imagen subida. Guarda para publicar cambios.");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-amber-900">Panel Administrador</h1>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-900">Edición rápida</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Ajusta textos clave sin editar JSON completo.
          </p>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="text-zinc-700">Título Home</span>
              <input
                className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                value={content.brand.heroTitle}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    brand: { ...prev.brand, heroTitle: event.target.value },
                  }))
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-700">Subtítulo Home</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                rows={3}
                value={content.brand.heroSubtitle}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    brand: { ...prev.brand, heroSubtitle: event.target.value },
                  }))
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-700">WhatsApp principal</span>
              <input
                className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                value={content.contact.whatsappNumber}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, whatsappNumber: event.target.value },
                  }))
                }
              />
            </label>
            <button
              type="button"
              onClick={handleQuickSave}
              disabled={isSaving}
              className="rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
            >
              {isSaving ? "Guardando..." : "Guardar cambios rápidos"}
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-900">Subir foto a galería</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Sube imagen y asígnala a una categoría. Luego guarda para publicar.
          </p>
          <form
            className="mt-4 space-y-3"
            action={async (formData) => {
              await handleUpload(formData);
            }}
          >
            <input
              type="text"
              name="title"
              required
              placeholder="Título"
              className="w-full rounded-lg border border-amber-200 px-3 py-2"
            />
            <input
              type="text"
              name="description"
              required
              placeholder="Descripción"
              className="w-full rounded-lg border border-amber-200 px-3 py-2"
            />
            <select
              name="category"
              className="w-full rounded-lg border border-amber-200 px-3 py-2"
              defaultValue="matrimonios"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={uploading}
              className="rounded-full border border-amber-300 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-60"
            >
              {uploading ? "Subiendo..." : "Subir imagen"}
            </button>
          </form>
        </article>
      </section>

      <section className="mt-6 rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-amber-900">Editor avanzado (JSON)</h2>
          <p className="text-xs text-zinc-500">
            Testimonios activos: {activeTestimonials} · Fotos: {content.gallery.length}
          </p>
        </div>
        <textarea
          value={jsonDraft}
          onChange={(event) => setJsonDraft(event.target.value)}
          className="h-[420px] w-full rounded-lg border border-amber-200 p-3 font-mono text-xs"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveJson}
            disabled={isSaving}
            className="rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
          >
            {isSaving ? "Guardando..." : "Guardar JSON"}
          </button>
          {status ? <p className="text-sm text-zinc-700">{status}</p> : null}
        </div>
      </section>
    </main>
  );
}

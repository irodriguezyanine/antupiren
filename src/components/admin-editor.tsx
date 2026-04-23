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
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingCard, setUploadingCard] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [cardModalIndex, setCardModalIndex] = useState<number | null>(null);

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

  async function handleGalleryUpload(formData: FormData) {
    setUploadingGallery(true);
    setStatus("");
    formData.set("mode", "gallery");

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setUploadingGallery(false);

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
    setGalleryModalOpen(false);
    setStatus("Imagen subida. Guarda para publicar cambios.");
  }

  async function handleCardBackgroundUpload(
    formData: FormData,
    cardIndex: number,
  ) {
    setUploadingCard(true);
    setStatus("");
    formData.set("mode", "card-background");

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setUploadingCard(false);

    if (!response.ok) {
      setStatus("No se pudo subir fondo de tarjeta.");
      return;
    }

    const uploaded = (await response.json()) as {
      secureUrl: string;
      publicId: string;
    };

    const nextCards = [...content.homeEventTypes];
    const current = nextCards[cardIndex];
    if (!current) {
      setStatus("No se encontró la tarjeta seleccionada.");
      return;
    }

    nextCards[cardIndex] = {
      ...current,
      backgroundImageUrl: uploaded.secureUrl,
      backgroundPublicId: uploaded.publicId,
    };

    const next = {
      ...content,
      homeEventTypes: nextCards,
      updatedAt: new Date().toISOString(),
    };

    setContent(next);
    setJsonDraft(JSON.stringify(next, null, 2));
    setCardModalIndex(null);
    setStatus("Fondo de tarjeta actualizado. Guarda para publicar.");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-amber-900">Panel Administrador</h1>
          <p className="text-sm text-zinc-600">Gestiona contenido, galería y textos del sitio.</p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-amber-100 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Última actualización</p>
          <p className="mt-1 text-sm font-semibold text-amber-900">
            {new Date(content.updatedAt).toLocaleString("es-CL")}
          </p>
        </article>
        <article className="rounded-xl border border-amber-100 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Testimonios activos</p>
          <p className="mt-1 text-sm font-semibold text-amber-900">{activeTestimonials}</p>
        </article>
        <article className="rounded-xl border border-amber-100 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Fotos cargadas</p>
          <p className="mt-1 text-sm font-semibold text-amber-900">{content.gallery.length}</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="soft-shadow rounded-xl border border-amber-100 bg-white p-5">
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

        <article className="soft-shadow rounded-xl border border-amber-100 bg-white p-5">
          <h2 className="text-lg font-semibold text-amber-900">Gestión visual (Cloudinary)</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Sube fotos en modales y reemplaza fondos de tarjetas del home con estilo catálogo.
          </p>
          <div className="mt-4 space-y-4">
            <button
              type="button"
              onClick={() => setGalleryModalOpen(true)}
              className="rounded-full border border-amber-300 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
            >
              Abrir modal de subida a galería
            </button>

            <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Fondos de tarjetas home
              </p>
              {content.homeEventTypes.map((card, index) => (
                <div
                  key={card.title}
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-white px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-amber-900">{card.title}</p>
                    <p className="text-xs text-zinc-500">
                      {card.backgroundImageUrl ? "Fondo personalizado" : "Sin fondo personalizado"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCardModalIndex(index)}
                    className="rounded-full border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    Reemplazar fondo
                  </button>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="soft-shadow mt-6 rounded-xl border border-amber-100 bg-white p-5">
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

      {galleryModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-amber-100 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-amber-900">Subir foto a galería</h3>
              <button
                type="button"
                onClick={() => setGalleryModalOpen(false)}
                className="rounded-full border border-amber-300 px-3 py-1 text-xs text-amber-900"
              >
                Cerrar
              </button>
            </div>
            <form
              className="space-y-3"
              action={async (formData) => {
                await handleGalleryUpload(formData);
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
                disabled={uploadingGallery}
                className="rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
              >
                {uploadingGallery ? "Subiendo..." : "Subir a Cloudinary"}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {cardModalIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-amber-100 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-amber-900">
                Reemplazar fondo: {content.homeEventTypes[cardModalIndex]?.title}
              </h3>
              <button
                type="button"
                onClick={() => setCardModalIndex(null)}
                className="rounded-full border border-amber-300 px-3 py-1 text-xs text-amber-900"
              >
                Cerrar
              </button>
            </div>
            <form
              className="space-y-3"
              action={async (formData) => {
                if (cardModalIndex === null) return;
                await handleCardBackgroundUpload(formData, cardModalIndex);
              }}
            >
              <input
                type="file"
                name="file"
                accept="image/*"
                required
                className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
              />
              <p className="text-xs text-zinc-500">
                Recomendado: imagen horizontal (mínimo 1200px de ancho).
              </p>
              <button
                type="submit"
                disabled={uploadingCard}
                className="rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
              >
                {uploadingCard ? "Subiendo..." : "Guardar fondo de tarjeta"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

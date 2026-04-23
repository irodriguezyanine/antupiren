"use client";

import { ImagePlus, Pencil, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import type { EventCategory, SiteContent } from "@/types/content";

type AdminEditorProps = {
  initialContent: SiteContent;
};

type AdminTab =
  | "inicio"
  | "secciones"
  | "tarjetas"
  | "galeria"
  | "testimonios"
  | "contacto";

type PageKey = keyof SiteContent["pages"];

type SignedUploadPayload = {
  ok: boolean;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  error?: string;
};

const categoryOptions: EventCategory[] = [
  "matrimonios",
  "corporativos",
  "sociales",
  "activaciones",
  "espacio",
];

const pageLabels: Record<PageKey, string> = {
  matrimonios: "Matrimonios",
  corporativos: "Corporativos",
  sociales: "Sociales",
  activaciones: "Activaciones",
  galeria: "Galería",
  nosotros: "Nosotros",
  contacto: "Contacto",
};

const tabs: { id: AdminTab; label: string }[] = [
  { id: "inicio", label: "Inicio" },
  { id: "secciones", label: "Secciones" },
  { id: "tarjetas", label: "Tarjetas Home" },
  { id: "galeria", label: "Galería" },
  { id: "testimonios", label: "Testimonios" },
  { id: "contacto", label: "Contacto" },
];

export function AdminEditor({ initialContent }: AdminEditorProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [status, setStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("inicio");

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [cardModalIndex, setCardModalIndex] = useState<number | null>(null);
  const [galleryReplaceIndex, setGalleryReplaceIndex] = useState<number | null>(null);

  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingCard, setUploadingCard] = useState(false);
  const [uploadingGalleryReplace, setUploadingGalleryReplace] = useState(false);

  const [galleryUploadTitle, setGalleryUploadTitle] = useState("");
  const [galleryUploadDescription, setGalleryUploadDescription] = useState("");
  const [galleryUploadCategory, setGalleryUploadCategory] =
    useState<EventCategory>("matrimonios");

  const [galleryUploadFile, setGalleryUploadFile] = useState<File | null>(null);
  const [cardUploadFile, setCardUploadFile] = useState<File | null>(null);
  const [galleryReplaceFile, setGalleryReplaceFile] = useState<File | null>(null);

  const galleryFileRef = useRef<HTMLInputElement | null>(null);
  const cardFileRef = useRef<HTMLInputElement | null>(null);
  const galleryReplaceFileRef = useRef<HTMLInputElement | null>(null);

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
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatus(payload?.error ?? "No se pudo guardar los cambios.");
      return;
    }

    setStatus("Cambios guardados correctamente.");
    setContent(next);
  }

  async function handleSaveAll() {
    const next = {
      ...content,
      updatedAt: new Date().toISOString(),
    };
    await saveContent(next);
  }

  async function signedCloudinaryUpload(
    file: File,
    folder: string,
  ): Promise<{ secureUrl: string; publicId: string }> {
    const signatureRes = await fetch("/api/admin/cloudinary-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });

    const signaturePayload = (await signatureRes.json()) as SignedUploadPayload;
    if (!signatureRes.ok || !signaturePayload.ok) {
      throw new Error(
        signaturePayload.error || "No se pudo generar firma de upload Cloudinary.",
      );
    }

    const form = new FormData();
    form.append("file", file);
    form.append("folder", signaturePayload.folder);
    form.append("api_key", signaturePayload.apiKey);
    form.append("timestamp", String(signaturePayload.timestamp));
    form.append("signature", signaturePayload.signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`,
      {
        method: "POST",
        body: form,
      },
    );

    const uploadJson = (await uploadRes.json().catch(() => null)) as
      | {
          secure_url?: string;
          public_id?: string;
          error?: { message?: string };
        }
      | null;

    if (!uploadRes.ok || !uploadJson?.secure_url || !uploadJson?.public_id) {
      throw new Error(
        uploadJson?.error?.message ||
          "Cloudinary rechazó la subida (revisa credenciales y formato).",
      );
    }

    return {
      secureUrl: uploadJson.secure_url,
      publicId: uploadJson.public_id,
    };
  }

  async function submitGalleryUpload() {
    if (!galleryUploadFile) {
      setStatus("Selecciona un archivo antes de subir.");
      return;
    }
    if (!galleryUploadTitle.trim() || !galleryUploadDescription.trim()) {
      setStatus("Completa título y descripción para la foto.");
      return;
    }

    setUploadingGallery(true);
    setStatus("");

    try {
      const uploaded = await signedCloudinaryUpload(
        galleryUploadFile,
        "antupiren/gallery",
      );

      const next = {
        ...content,
        gallery: [
          ...content.gallery,
          {
            id: crypto.randomUUID(),
            title: galleryUploadTitle.trim(),
            description: galleryUploadDescription.trim(),
            category: galleryUploadCategory,
            imageUrl: uploaded.secureUrl,
            publicId: uploaded.publicId,
            enabled: true,
          },
        ],
        updatedAt: new Date().toISOString(),
      };

      setContent(next);
      setGalleryModalOpen(false);
      setGalleryUploadFile(null);
      setGalleryUploadTitle("");
      setGalleryUploadDescription("");
      setGalleryUploadCategory("matrimonios");
      setStatus("Imagen subida correctamente. Guarda para publicar.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Error subiendo a Cloudinary.");
    } finally {
      setUploadingGallery(false);
    }
  }

  async function submitCardBackgroundUpload(cardIndex: number) {
    if (!cardUploadFile) {
      setStatus("Selecciona una imagen para reemplazar el fondo.");
      return;
    }

    setUploadingCard(true);
    setStatus("");

    try {
      const uploaded = await signedCloudinaryUpload(cardUploadFile, "antupiren/cards");
      const nextCards = [...content.homeEventTypes];
      const current = nextCards[cardIndex];
      if (!current) {
        throw new Error("No se encontró la tarjeta seleccionada.");
      }

      nextCards[cardIndex] = {
        ...current,
        backgroundImageUrl: uploaded.secureUrl,
        backgroundPublicId: uploaded.publicId,
      };

      setContent((prev) => ({
        ...prev,
        homeEventTypes: nextCards,
        updatedAt: new Date().toISOString(),
      }));
      setCardModalIndex(null);
      setCardUploadFile(null);
      setStatus("Fondo actualizado. Guarda para publicar.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo subir fondo.");
    } finally {
      setUploadingCard(false);
    }
  }

  async function submitGalleryReplaceUpload(itemIndex: number) {
    if (!galleryReplaceFile) {
      setStatus("Selecciona una imagen para reemplazar.");
      return;
    }

    setUploadingGalleryReplace(true);
    setStatus("");

    try {
      const uploaded = await signedCloudinaryUpload(
        galleryReplaceFile,
        "antupiren/gallery",
      );
      setContent((prev) => {
        const next = [...prev.gallery];
        const item = next[itemIndex];
        if (!item) return prev;
        next[itemIndex] = {
          ...item,
          imageUrl: uploaded.secureUrl,
          publicId: uploaded.publicId,
        };

        return {
          ...prev,
          gallery: next,
          updatedAt: new Date().toISOString(),
        };
      });

      setGalleryReplaceIndex(null);
      setGalleryReplaceFile(null);
      setStatus("Foto reemplazada correctamente. Guarda para publicar.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo reemplazar la foto.");
    } finally {
      setUploadingGalleryReplace(false);
    }
  }

  function updatePage(pageKey: PageKey, field: string, value: string | boolean) {
    setContent((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageKey]: {
          ...prev.pages[pageKey],
          [field]: value,
        },
      },
    }));
  }

  function addTestimonial() {
    setContent((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          id: crypto.randomUUID(),
          author: "Nuevo testimonio",
          role: "Cliente",
          text: "Escribe aquí la experiencia del cliente.",
          eventType: "General",
          enabled: true,
        },
      ],
    }));
  }

  function removeTestimonial(index: number) {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  }

  function removeGalleryItem(index: number) {
    setContent((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-amber-900">Panel Administrador</h1>
          <p className="text-sm text-zinc-600">
            Editor visual profesional para textos, fotos y secciones del sitio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
          >
            Ir al sitio público
          </Link>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
          >
            {isSaving ? "Guardando..." : "Guardar todo"}
          </button>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-amber-100 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Última actualización</p>
          <p className="mt-1 text-sm font-semibold text-amber-900">
            {new Date(content.updatedAt).toISOString().slice(0, 19).replace("T", " ")}
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

      <section className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              activeTab === tab.id
                ? "bg-amber-700 font-semibold text-white"
                : "border border-amber-200 bg-white text-amber-900 hover:bg-amber-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {activeTab === "inicio" ? (
        <section className="space-y-4 rounded-xl border border-amber-100 bg-white p-5">
          <h2 className="text-lg font-semibold text-amber-900">Editor de Inicio</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <span className="text-zinc-700">Nombre del sitio</span>
              <input
                className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                value={content.brand.siteName}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    brand: { ...prev.brand, siteName: event.target.value },
                  }))
                }
              />
            </label>
            <label className="text-sm">
              <span className="text-zinc-700">Tagline</span>
              <input
                className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                value={content.brand.tagline}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    brand: { ...prev.brand, tagline: event.target.value },
                  }))
                }
              />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="text-zinc-700">Título hero</span>
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
            <label className="text-sm md:col-span-2">
              <span className="text-zinc-700">Subtítulo hero</span>
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
          </div>
        </section>
      ) : null}

      {activeTab === "secciones" ? (
        <section className="space-y-4 rounded-xl border border-amber-100 bg-white p-5">
          <h2 className="text-lg font-semibold text-amber-900">Editor de Secciones</h2>
          {(Object.keys(content.pages) as PageKey[]).map((pageKey) => (
            <article key={pageKey} className="rounded-xl border border-amber-100 p-4">
              <p className="text-sm font-semibold text-amber-900">{pageLabels[pageKey]}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="text-sm md:col-span-2">
                  <span className="text-zinc-700">Título hero</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                    value={content.pages[pageKey].heroTitle}
                    onChange={(event) =>
                      updatePage(pageKey, "heroTitle", event.target.value)
                    }
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="text-zinc-700">Subtítulo hero</span>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                    rows={2}
                    value={content.pages[pageKey].heroSubtitle}
                    onChange={(event) =>
                      updatePage(pageKey, "heroSubtitle", event.target.value)
                    }
                  />
                </label>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "tarjetas" ? (
        <section className="space-y-4 rounded-xl border border-amber-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-amber-900">Tarjetas del Home</h2>
            <p className="text-xs text-zinc-500">Estilo catálogo con fondo editable</p>
          </div>
          {content.homeEventTypes.map((card, index) => (
            <article key={card.href} className="rounded-xl border border-amber-100 p-4">
              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <div className="relative h-28 overflow-hidden rounded-lg border border-amber-100 bg-amber-50">
                  {card.backgroundImageUrl ? (
                    <Image
                      src={card.backgroundImageUrl}
                      alt={`Fondo ${card.title}`}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setCardModalIndex(index)}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/70"
                    title="Editar fondo"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <label className="text-sm">
                    <span className="text-zinc-700">Título</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                      value={card.title}
                      onChange={(event) =>
                        setContent((prev) => {
                          const next = [...prev.homeEventTypes];
                          next[index] = { ...next[index], title: event.target.value };
                          return { ...prev, homeEventTypes: next };
                        })
                      }
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-zinc-700">Ruta</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                      value={card.href}
                      onChange={(event) =>
                        setContent((prev) => {
                          const next = [...prev.homeEventTypes];
                          next[index] = { ...next[index], href: event.target.value };
                          return { ...prev, homeEventTypes: next };
                        })
                      }
                    />
                  </label>
                  <label className="text-sm md:col-span-2">
                    <span className="text-zinc-700">Descripción</span>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2"
                      rows={2}
                      value={card.description}
                      onChange={(event) =>
                        setContent((prev) => {
                          const next = [...prev.homeEventTypes];
                          next[index] = {
                            ...next[index],
                            description: event.target.value,
                          };
                          return { ...prev, homeEventTypes: next };
                        })
                      }
                    />
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCardModalIndex(index)}
                className="mt-3 rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
              >
                Reemplazar fondo con modal
              </button>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "galeria" ? (
        <section className="space-y-4 rounded-xl border border-amber-100 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-amber-900">Galería</h2>
            <button
              type="button"
              onClick={() => setGalleryModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
            >
              <ImagePlus size={15} />
              Subir nueva foto
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {content.gallery.map((item, index) => (
              <article
                key={item.id}
                className="rounded-xl border border-amber-100 bg-amber-50/30 p-3"
              >
                <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
                  <div className="relative h-24 overflow-hidden rounded-lg border border-amber-100 bg-white">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="130px"
                    />
                    <button
                      type="button"
                      onClick={() => setGalleryReplaceIndex(index)}
                      className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/70"
                      title="Editar foto"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                  <div className="grid gap-2">
                    <input
                      className="rounded-lg border border-amber-200 px-3 py-2 text-sm"
                      value={item.title}
                      onChange={(event) =>
                        setContent((prev) => {
                          const next = [...prev.gallery];
                          next[index] = { ...next[index], title: event.target.value };
                          return { ...prev, gallery: next };
                        })
                      }
                    />
                    <textarea
                      className="rounded-lg border border-amber-200 px-3 py-2 text-sm"
                      rows={2}
                      value={item.description}
                      onChange={(event) =>
                        setContent((prev) => {
                          const next = [...prev.gallery];
                          next[index] = { ...next[index], description: event.target.value };
                          return { ...prev, gallery: next };
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryItem(index)}
                  className="mt-2 text-xs font-semibold text-red-700 underline"
                >
                  Eliminar foto
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "testimonios" ? (
        <section className="space-y-4 rounded-xl border border-amber-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-amber-900">Testimonios</h2>
            <button
              type="button"
              onClick={addTestimonial}
              className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
            >
              Agregar testimonio
            </button>
          </div>
          <div className="grid gap-3">
            {content.testimonials.map((item, index) => (
              <article key={item.id} className="rounded-xl border border-amber-100 p-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    className="rounded-lg border border-amber-200 px-3 py-2 text-sm"
                    value={item.author}
                    onChange={(event) =>
                      setContent((prev) => {
                        const next = [...prev.testimonials];
                        next[index] = { ...next[index], author: event.target.value };
                        return { ...prev, testimonials: next };
                      })
                    }
                  />
                  <input
                    className="rounded-lg border border-amber-200 px-3 py-2 text-sm"
                    value={item.role}
                    onChange={(event) =>
                      setContent((prev) => {
                        const next = [...prev.testimonials];
                        next[index] = { ...next[index], role: event.target.value };
                        return { ...prev, testimonials: next };
                      })
                    }
                  />
                  <textarea
                    className="md:col-span-2 rounded-lg border border-amber-200 px-3 py-2 text-sm"
                    rows={3}
                    value={item.text}
                    onChange={(event) =>
                      setContent((prev) => {
                        const next = [...prev.testimonials];
                        next[index] = { ...next[index], text: event.target.value };
                        return { ...prev, testimonials: next };
                      })
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTestimonial(index)}
                  className="mt-2 text-xs font-semibold text-red-700 underline"
                >
                  Eliminar testimonio
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "contacto" ? (
        <section className="space-y-4 rounded-xl border border-amber-100 bg-white p-5">
          <h2 className="text-lg font-semibold text-amber-900">Contacto y redes</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              <span className="text-zinc-700">WhatsApp</span>
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
          </div>
        </section>
      ) : null}

      {status ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-zinc-700">
          {status}
        </p>
      ) : null}

      {galleryModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-amber-100 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-amber-900">Subir foto a galería</h3>
              <button
                type="button"
                onClick={() => setGalleryModalOpen(false)}
                className="rounded-full border border-amber-300 p-2 text-amber-900 hover:bg-amber-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Título"
                  value={galleryUploadTitle}
                  onChange={(event) => setGalleryUploadTitle(event.target.value)}
                  className="w-full rounded-lg border border-amber-200 px-3 py-2"
                />
                <select
                  value={galleryUploadCategory}
                  onChange={(event) =>
                    setGalleryUploadCategory(event.target.value as EventCategory)
                  }
                  className="w-full rounded-lg border border-amber-200 px-3 py-2"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Descripción"
                value={galleryUploadDescription}
                onChange={(event) => setGalleryUploadDescription(event.target.value)}
                rows={2}
                className="w-full rounded-lg border border-amber-200 px-3 py-2"
              />

              <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Archivo de imagen
                </p>
                <input
                  ref={galleryFileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/webp,image/png"
                  className="hidden"
                  onChange={(event) =>
                    setGalleryUploadFile(event.target.files?.[0] ?? null)
                  }
                />
                <button
                  type="button"
                  onClick={() => galleryFileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
                >
                  <Upload size={14} />
                  Seleccionar imagen
                </button>
                <p className="mt-2 text-sm text-zinc-600">
                  {galleryUploadFile?.name || "Sin archivo seleccionado"}
                </p>
              </div>

              <button
                type="button"
                disabled={uploadingGallery}
                onClick={submitGalleryUpload}
                className="rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
              >
                {uploadingGallery ? "Subiendo..." : "Subir foto"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {cardModalIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-amber-100 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-amber-900">
                Reemplazar fondo: {content.homeEventTypes[cardModalIndex]?.title}
              </h3>
              <button
                type="button"
                onClick={() => setCardModalIndex(null)}
                className="rounded-full border border-amber-300 p-2 text-amber-900 hover:bg-amber-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Imagen de fondo
              </p>
              <input
                ref={cardFileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/webp,image/png"
                className="hidden"
                onChange={(event) => setCardUploadFile(event.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => cardFileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
              >
                <Upload size={14} />
                Elegir archivo
              </button>
              <p className="mt-2 text-sm text-zinc-600">
                {cardUploadFile?.name || "Sin archivo seleccionado"}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                Recomendado: horizontal, mínimo 1200px de ancho.
              </p>
            </div>

            <button
              type="button"
              disabled={uploadingCard}
              onClick={() => submitCardBackgroundUpload(cardModalIndex)}
              className="mt-4 rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
            >
              {uploadingCard ? "Subiendo..." : "Guardar fondo"}
            </button>
          </div>
        </div>
      ) : null}

      {galleryReplaceIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-amber-100 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-amber-900">
                Cambiar foto: {content.gallery[galleryReplaceIndex]?.title}
              </h3>
              <button
                type="button"
                onClick={() => setGalleryReplaceIndex(null)}
                className="rounded-full border border-amber-300 p-2 text-amber-900 hover:bg-amber-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-4">
              <input
                ref={galleryReplaceFileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/webp,image/png"
                className="hidden"
                onChange={(event) =>
                  setGalleryReplaceFile(event.target.files?.[0] ?? null)
                }
              />
              <button
                type="button"
                onClick={() => galleryReplaceFileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
              >
                <Upload size={14} />
                Seleccionar nueva imagen
              </button>
              <p className="mt-2 text-sm text-zinc-600">
                {galleryReplaceFile?.name || "Sin archivo seleccionado"}
              </p>
            </div>

            <button
              type="button"
              disabled={uploadingGalleryReplace}
              onClick={() => submitGalleryReplaceUpload(galleryReplaceIndex)}
              className="mt-4 rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
            >
              {uploadingGalleryReplace ? "Subiendo..." : "Actualizar foto"}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

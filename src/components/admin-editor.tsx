"use client";

import { ImagePlus, Palette, Pencil, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import type { AdminEditorPanelStyle, EventCategory, SiteContent } from "@/types/content";

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
type MainAdminTab = "editor" | "estadisticas" | "calendario";

type PageKey = keyof SiteContent["pages"];
type SiteColorKey =
  | "sitePrimaryColor"
  | "siteSecondaryColor"
  | "siteAccentColor"
  | "siteSurfaceColor"
  | "siteTextColor";

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
const mainTabs: { id: MainAdminTab; label: string }[] = [
  { id: "editor", label: "Editor" },
  { id: "estadisticas", label: "Estadísticas" },
  { id: "calendario", label: "Calendario" },
];

const siteColorLabels: Record<SiteColorKey, string> = {
  sitePrimaryColor: "Color primario",
  siteSecondaryColor: "Color secundario",
  siteAccentColor: "Color acento",
  siteSurfaceColor: "Color de fondo",
  siteTextColor: "Color de texto",
};

const largeColorPalette = [
  "#0f172a",
  "#1e293b",
  "#334155",
  "#475569",
  "#64748b",
  "#0b3b2e",
  "#14532d",
  "#166534",
  "#047857",
  "#0f766e",
  "#155e75",
  "#1d4ed8",
  "#1e40af",
  "#1d4ed8",
  "#2563eb",
  "#4f46e5",
  "#4338ca",
  "#6d28d9",
  "#7c3aed",
  "#9333ea",
  "#a21caf",
  "#be185d",
  "#c026d3",
  "#db2777",
  "#be123c",
  "#e11d48",
  "#b91c1c",
  "#dc2626",
  "#ea580c",
  "#f97316",
  "#d97706",
  "#ca8a04",
  "#65a30d",
  "#16a34a",
  "#22c55e",
  "#84cc16",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#2dd4bf",
  "#4ade80",
  "#f59e0b",
  "#eab308",
  "#f43f5e",
  "#fb7185",
  "#f472b6",
  "#f5f5f4",
  "#e7e5e4",
  "#d6d3d1",
  "#a8a29e",
  "#78716c",
  "#57534e",
];

export function AdminEditor({ initialContent }: AdminEditorProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [status, setStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<MainAdminTab>("editor");
  const [activeTab, setActiveTab] = useState<AdminTab>("inicio");

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [cardModalIndex, setCardModalIndex] = useState<number | null>(null);
  const [galleryReplaceIndex, setGalleryReplaceIndex] = useState<number | null>(null);
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);
  const [paletteTarget, setPaletteTarget] = useState<SiteColorKey>("sitePrimaryColor");

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
  const [heroBackgroundFile, setHeroBackgroundFile] = useState<File | null>(null);
  const [uploadingHeroBackground, setUploadingHeroBackground] = useState(false);
  const [panelBackgroundFile, setPanelBackgroundFile] = useState<File | null>(null);
  const [panelBackgroundTarget, setPanelBackgroundTarget] = useState<AdminTab | null>(null);
  const [uploadingPanelBackground, setUploadingPanelBackground] = useState(false);

  const galleryFileRef = useRef<HTMLInputElement | null>(null);
  const cardFileRef = useRef<HTMLInputElement | null>(null);
  const galleryReplaceFileRef = useRef<HTMLInputElement | null>(null);
  const heroBackgroundFileRef = useRef<HTMLInputElement | null>(null);
  const panelBackgroundFileRef = useRef<HTMLInputElement | null>(null);

  const activeTestimonials = useMemo(
    () => content.testimonials.filter((item) => item.enabled).length,
    [content.testimonials],
  );

  async function saveContent(next: SiteContent): Promise<boolean> {
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
      return false;
    }

    setStatus("Cambios guardados correctamente.");
    setContent(next);
    return true;
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

      const saved = await saveContent(next);
      if (saved) {
        setGalleryModalOpen(false);
        setGalleryUploadFile(null);
        setGalleryUploadTitle("");
        setGalleryUploadDescription("");
        setGalleryUploadCategory("matrimonios");
        setStatus("Imagen subida y publicada correctamente.");
      }
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

      const next = {
        ...content,
        homeEventTypes: nextCards,
        updatedAt: new Date().toISOString(),
      };
      const saved = await saveContent(next);
      if (saved) {
        setCardModalIndex(null);
        setCardUploadFile(null);
        setStatus("Fondo actualizado y publicado.");
      }
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
      const nextGallery = [...content.gallery];
      const item = nextGallery[itemIndex];
      if (!item) {
        throw new Error("No se encontró la imagen de galería a reemplazar.");
      }
      nextGallery[itemIndex] = {
        ...item,
        imageUrl: uploaded.secureUrl,
        publicId: uploaded.publicId,
      };
      const next = {
        ...content,
        gallery: nextGallery,
        updatedAt: new Date().toISOString(),
      };
      const saved = await saveContent(next);
      if (saved) {
        setGalleryReplaceIndex(null);
        setGalleryReplaceFile(null);
        setStatus("Foto reemplazada y publicada.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo reemplazar la foto.");
    } finally {
      setUploadingGalleryReplace(false);
    }
  }

  async function submitHeroBackgroundUpload() {
    if (!heroBackgroundFile) {
      setStatus("Selecciona una imagen para el fondo del Hero.");
      return;
    }

    setUploadingHeroBackground(true);
    setStatus("");

    try {
      const uploaded = await signedCloudinaryUpload(heroBackgroundFile, "antupiren/hero");
      setContent((prev) => ({
        ...prev,
        brand: {
          ...prev.brand,
          heroBackgroundImageUrl: uploaded.secureUrl,
          heroBackgroundPublicId: uploaded.publicId,
        },
        updatedAt: new Date().toISOString(),
      }));
      setHeroBackgroundFile(null);
      setStatus("Fondo del Hero actualizado. Guarda todo para publicar.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "No se pudo subir fondo del Hero.",
      );
    } finally {
      setUploadingHeroBackground(false);
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

  function getPanelStyle(tabId: AdminTab): Required<AdminEditorPanelStyle> {
    const style = content.adminEditor?.panelStyles?.[tabId] ?? {};
    return {
      gradientFrom: style.gradientFrom ?? "#f7f5ef",
      gradientVia: style.gradientVia ?? "#efe2d2",
      gradientTo: style.gradientTo ?? "#f9f3e8",
      backgroundImageUrl: style.backgroundImageUrl ?? "",
      backgroundPublicId: style.backgroundPublicId ?? "",
      overlayOpacity: style.overlayOpacity ?? 0,
    };
  }

  function updatePanelStyle(tabId: AdminTab, patch: Partial<AdminEditorPanelStyle>) {
    setContent((prev) => {
      const current = prev.adminEditor?.panelStyles?.[tabId] ?? {};
      return {
        ...prev,
        adminEditor: {
          panelStyles: {
            ...(prev.adminEditor?.panelStyles ?? {}),
            [tabId]: {
              ...current,
              ...patch,
            },
          },
        },
      };
    });
  }

  async function submitPanelBackgroundUpload(tabId: AdminTab) {
    if (!panelBackgroundFile) {
      setStatus("Selecciona una imagen para el fondo de la tarjeta principal.");
      return;
    }

    setUploadingPanelBackground(true);
    setStatus("");

    try {
      const uploaded = await signedCloudinaryUpload(
        panelBackgroundFile,
        `antupiren/editor-panels/${tabId}`,
      );
      updatePanelStyle(tabId, {
        backgroundImageUrl: uploaded.secureUrl,
        backgroundPublicId: uploaded.publicId,
      });
      setPanelBackgroundFile(null);
      setPanelBackgroundTarget(null);
      setStatus("Fondo de la tarjeta principal actualizado. Guarda todo para publicar.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "No se pudo subir el fondo de la tarjeta.",
      );
    } finally {
      setUploadingPanelBackground(false);
    }
  }

  function renderPanelBackgroundEditor(tabId: AdminTab) {
    const style = getPanelStyle(tabId);
    const overlayPercent = Math.round(style.overlayOpacity * 100);

    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
        <p className="text-sm font-semibold text-amber-900">Fondo de tarjeta principal</p>
        <p className="mt-1 text-xs text-zinc-500">
          Configura degradé + imagen para la tarjeta principal de esta pestaña.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-xs">
            <span className="text-zinc-600">Color inicial</span>
            <input
              type="color"
              className="mt-1 h-10 w-full rounded-md border border-amber-200"
              value={style.gradientFrom}
              onChange={(event) => updatePanelStyle(tabId, { gradientFrom: event.target.value })}
            />
          </label>
          <label className="text-xs">
            <span className="text-zinc-600">Color medio</span>
            <input
              type="color"
              className="mt-1 h-10 w-full rounded-md border border-amber-200"
              value={style.gradientVia}
              onChange={(event) => updatePanelStyle(tabId, { gradientVia: event.target.value })}
            />
          </label>
          <label className="text-xs">
            <span className="text-zinc-600">Color final</span>
            <input
              type="color"
              className="mt-1 h-10 w-full rounded-md border border-amber-200"
              value={style.gradientTo}
              onChange={(event) => updatePanelStyle(tabId, { gradientTo: event.target.value })}
            />
          </label>
        </div>
        <label className="mt-3 block text-xs">
          <span className="text-zinc-600">Intensidad overlay ({overlayPercent}%)</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            className="mt-2 w-full"
            value={overlayPercent}
            onChange={(event) =>
              updatePanelStyle(tabId, { overlayOpacity: Number(event.target.value) / 100 })
            }
          />
        </label>
        <div className="mt-3 rounded-xl border border-dashed border-amber-300 bg-white p-3">
          <input
            ref={panelBackgroundFileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/webp,image/png"
            className="hidden"
            onChange={(event) => setPanelBackgroundFile(event.target.files?.[0] ?? null)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPanelBackgroundTarget(tabId);
                panelBackgroundFileRef.current?.click();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
            >
              <Upload size={14} />
              Elegir imagen
            </button>
            <button
              type="button"
              disabled={uploadingPanelBackground || panelBackgroundTarget !== tabId}
              onClick={() => submitPanelBackgroundUpload(tabId)}
              className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
            >
              {uploadingPanelBackground && panelBackgroundTarget === tabId
                ? "Subiendo..."
                : "Subir imagen"}
            </button>
            <button
              type="button"
              onClick={() =>
                updatePanelStyle(tabId, {
                  backgroundImageUrl: "",
                  backgroundPublicId: "",
                })
              }
              className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
            >
              Quitar imagen
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            {panelBackgroundTarget === tabId && panelBackgroundFile
              ? panelBackgroundFile.name
              : style.backgroundImageUrl || "Sin imagen seleccionada"}
          </p>
        </div>
        <div
          className="mt-3 h-28 rounded-xl border border-amber-100 bg-cover bg-center"
          style={{
            backgroundImage: style.backgroundImageUrl
              ? `linear-gradient(135deg, ${style.gradientFrom} 0%, ${style.gradientVia} 48%, ${style.gradientTo} 100%), url(${style.backgroundImageUrl})`
              : `linear-gradient(135deg, ${style.gradientFrom} 0%, ${style.gradientVia} 48%, ${style.gradientTo} 100%)`,
            backgroundBlendMode: style.backgroundImageUrl ? "overlay" : "normal",
          }}
        />
      </div>
    );
  }

  function getPanelContainerStyle(tabId: AdminTab) {
    const style = getPanelStyle(tabId);
    return {
      backgroundImage: style.backgroundImageUrl
        ? `linear-gradient(135deg, ${style.gradientFrom} 0%, ${style.gradientVia} 48%, ${style.gradientTo} 100%), url(${style.backgroundImageUrl})`
        : `linear-gradient(135deg, ${style.gradientFrom} 0%, ${style.gradientVia} 48%, ${style.gradientTo} 100%)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundBlendMode: style.backgroundImageUrl ? "overlay" : "normal",
    };
  }

  function updateSiteColor(field: SiteColorKey, value: string) {
    setContent((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: value,
      },
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

      <section className="mb-6 flex flex-wrap gap-2">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveMainTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              activeMainTab === tab.id
                ? "bg-amber-700 font-semibold text-white"
                : "border border-amber-200 bg-white text-amber-900 hover:bg-amber-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {activeMainTab === "editor" ? (
        <>
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
        <section
          className="space-y-4 rounded-xl border border-amber-100 p-5"
          style={getPanelContainerStyle("inicio")}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-amber-900">Editor de Inicio</h2>
            <button
              type="button"
              onClick={() => setPaletteModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
            >
              <Palette size={14} />
              Configurar paleta del sitio
            </button>
          </div>
          {renderPanelBackgroundEditor("inicio")}
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
            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 md:col-span-2">
              <p className="text-sm font-semibold text-amber-900">Estilo visual del Hero</p>
              <p className="mt-1 text-xs text-zinc-500">
                Define paleta de degradé y/o imagen de fondo con overlay profesional.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <label className="text-xs">
                  <span className="text-zinc-600">Color inicial</span>
                  <input
                    type="color"
                    className="mt-1 h-10 w-full rounded-md border border-amber-200"
                    value={content.brand.heroGradientFrom || "#2f5a3f"}
                    onChange={(event) =>
                      setContent((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, heroGradientFrom: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="text-xs">
                  <span className="text-zinc-600">Color medio</span>
                  <input
                    type="color"
                    className="mt-1 h-10 w-full rounded-md border border-amber-200"
                    value={content.brand.heroGradientVia || "#5a3515"}
                    onChange={(event) =>
                      setContent((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, heroGradientVia: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="text-xs">
                  <span className="text-zinc-600">Color final</span>
                  <input
                    type="color"
                    className="mt-1 h-10 w-full rounded-md border border-amber-200"
                    value={content.brand.heroGradientTo || "#2b1a0f"}
                    onChange={(event) =>
                      setContent((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, heroGradientTo: event.target.value },
                      }))
                    }
                  />
                </label>
              </div>

              <label className="mt-3 block text-xs">
                <span className="text-zinc-600">Intensidad del overlay ({Math.round((content.brand.heroOverlayOpacity ?? 0.55) * 100)}%)</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2 w-full"
                  value={Math.round((content.brand.heroOverlayOpacity ?? 0.55) * 100)}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      brand: {
                        ...prev.brand,
                        heroOverlayOpacity: Number(event.target.value) / 100,
                      },
                    }))
                  }
                />
              </label>

              <div className="mt-3 rounded-xl border border-dashed border-amber-300 bg-white p-3">
                <input
                  ref={heroBackgroundFileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/webp,image/png"
                  className="hidden"
                  onChange={(event) =>
                    setHeroBackgroundFile(event.target.files?.[0] ?? null)
                  }
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => heroBackgroundFileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
                  >
                    <Upload size={14} />
                    Elegir imagen de fondo
                  </button>
                  <button
                    type="button"
                    disabled={uploadingHeroBackground}
                    onClick={submitHeroBackgroundUpload}
                    className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
                  >
                    {uploadingHeroBackground ? "Subiendo..." : "Subir imagen Hero"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        brand: {
                          ...prev.brand,
                          heroBackgroundImageUrl: "",
                          heroBackgroundPublicId: "",
                        },
                      }))
                    }
                    className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
                  >
                    Quitar imagen
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  {heroBackgroundFile?.name ||
                    content.brand.heroBackgroundImageUrl ||
                    "Sin imagen de fondo seleccionada"}
                </p>
              </div>

              <div
                className="mt-3 h-32 rounded-xl border border-amber-100 bg-cover bg-center"
                style={{
                  backgroundImage: content.brand.heroBackgroundImageUrl
                    ? `linear-gradient(135deg, ${content.brand.heroGradientFrom || "#2f5a3f"} 0%, ${content.brand.heroGradientVia || "#5a3515"} 48%, ${content.brand.heroGradientTo || "#2b1a0f"} 100%), url(${content.brand.heroBackgroundImageUrl})`
                    : `linear-gradient(135deg, ${content.brand.heroGradientFrom || "#2f5a3f"} 0%, ${content.brand.heroGradientVia || "#5a3515"} 48%, ${content.brand.heroGradientTo || "#2b1a0f"} 100%)`,
                  backgroundBlendMode: content.brand.heroBackgroundImageUrl ? "overlay" : "normal",
                }}
              />
            </div>
            <div className="rounded-xl border border-amber-100 bg-white p-4 md:col-span-2">
              <p className="text-sm font-semibold text-amber-900">Paleta activa del sitio</p>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {(
                  [
                    "sitePrimaryColor",
                    "siteSecondaryColor",
                    "siteAccentColor",
                    "siteSurfaceColor",
                    "siteTextColor",
                  ] as SiteColorKey[]
                ).map((field) => (
                  <div key={field} className="space-y-1">
                    <p className="text-[11px] text-zinc-600">{siteColorLabels[field]}</p>
                    <div
                      className="h-10 rounded-md border border-amber-200"
                      style={{ backgroundColor: content.brand[field] || "#000000" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "secciones" ? (
        <section
          className="space-y-4 rounded-xl border border-amber-100 p-5"
          style={getPanelContainerStyle("secciones")}
        >
          <h2 className="text-lg font-semibold text-amber-900">Editor de Secciones</h2>
          {renderPanelBackgroundEditor("secciones")}
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
        <section
          className="space-y-4 rounded-xl border border-amber-100 p-5"
          style={getPanelContainerStyle("tarjetas")}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-amber-900">Tarjetas del Home</h2>
            <p className="text-xs text-zinc-500">Estilo catálogo con fondo editable</p>
          </div>
          {renderPanelBackgroundEditor("tarjetas")}
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
        <section
          className="space-y-4 rounded-xl border border-amber-100 p-5"
          style={getPanelContainerStyle("galeria")}
        >
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
          {renderPanelBackgroundEditor("galeria")}

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
        <section
          className="space-y-4 rounded-xl border border-amber-100 p-5"
          style={getPanelContainerStyle("testimonios")}
        >
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
          {renderPanelBackgroundEditor("testimonios")}
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
        <section
          className="space-y-4 rounded-xl border border-amber-100 p-5"
          style={getPanelContainerStyle("contacto")}
        >
          <h2 className="text-lg font-semibold text-amber-900">Contacto y redes</h2>
          {renderPanelBackgroundEditor("contacto")}
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
        </>
      ) : null}

      {activeMainTab === "estadisticas" ? (
        <section className="space-y-4 rounded-xl border border-amber-100 bg-white p-5">
          <h2 className="text-lg font-semibold text-amber-900">Estadísticas del contenido</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Última actualización</p>
              <p className="mt-1 text-sm font-semibold text-amber-900">
                {new Date(content.updatedAt).toISOString().slice(0, 19).replace("T", " ")}
              </p>
            </article>
            <article className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Testimonios activos</p>
              <p className="mt-1 text-sm font-semibold text-amber-900">{activeTestimonials}</p>
            </article>
            <article className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Fotos cargadas</p>
              <p className="mt-1 text-sm font-semibold text-amber-900">{content.gallery.length}</p>
            </article>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-xl border border-amber-100 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Páginas activas</p>
              <p className="mt-1 text-sm font-semibold text-amber-900">
                {Object.values(content.pages).filter((page) => page.enabled).length}/
                {Object.values(content.pages).length}
              </p>
            </article>
            <article className="rounded-xl border border-amber-100 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Tarjetas Home</p>
              <p className="mt-1 text-sm font-semibold text-amber-900">
                {content.homeEventTypes.length}
              </p>
            </article>
            <article className="rounded-xl border border-amber-100 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Badges de confianza</p>
              <p className="mt-1 text-sm font-semibold text-amber-900">
                {content.trustBadges.length}
              </p>
            </article>
            <article className="rounded-xl border border-amber-100 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Total estadísticas</p>
              <p className="mt-1 text-sm font-semibold text-amber-900">{content.stats.length}</p>
            </article>
          </div>
        </section>
      ) : null}

      {activeMainTab === "calendario" ? (
        <section className="space-y-4 rounded-xl border border-amber-100 bg-white p-5">
          <h2 className="text-lg font-semibold text-amber-900">Calendario</h2>
          <p className="text-sm text-zinc-600">
            Vista rápida mensual para planificación interna. Puedes usarlo para organizar visitas,
            reuniones y fechas de eventos.
          </p>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
              <p key={day} className="rounded-md bg-amber-100 px-2 py-1 font-semibold text-amber-900">
                {day}
              </p>
            ))}
            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={`day-${index + 1}`}
                className="min-h-14 rounded-md border border-amber-100 bg-amber-50/30 p-1 text-left"
              >
                <p className="text-[11px] text-zinc-600">{index + 1}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Notas rápidas</p>
            <p className="mt-2 text-sm text-zinc-700">
              Integraremos eventos reales cuando definas si quieres sincronizar con Google Calendar
              o mantener este calendario manual.
            </p>
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

      {paletteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-amber-100 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-amber-900">Paleta global del sitio</h3>
              <button
                type="button"
                onClick={() => setPaletteModalOpen(false)}
                className="rounded-full border border-amber-300 p-2 text-amber-900 hover:bg-amber-100"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-sm text-zinc-600">
              Elige el color a editar y luego haz clic en cualquier tono de la paleta grande.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-5">
              {(Object.keys(siteColorLabels) as SiteColorKey[]).map((field) => (
                <label
                  key={field}
                  className={`rounded-xl border p-3 ${
                    paletteTarget === field
                      ? "border-amber-400 bg-amber-50"
                      : "border-amber-100 bg-white"
                  }`}
                >
                  <span className="mb-2 block text-xs font-medium text-zinc-700">
                    {siteColorLabels[field]}
                  </span>
                  <input
                    type="radio"
                    name="paletteTarget"
                    checked={paletteTarget === field}
                    onChange={() => setPaletteTarget(field)}
                    className="sr-only"
                  />
                  <input
                    type="color"
                    className="h-10 w-full rounded-md border border-amber-200"
                    value={content.brand[field] || "#000000"}
                    onChange={(event) => updateSiteColor(field, event.target.value)}
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Paleta amplia (52 colores)
              </p>
              <div className="mt-3 grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-13">
                {largeColorPalette.map((color) => (
                  <button
                    key={`${paletteTarget}-${color}`}
                    type="button"
                    onClick={() => updateSiteColor(paletteTarget, color)}
                    title={`Aplicar ${color} a ${siteColorLabels[paletteTarget]}`}
                    className="h-8 w-8 rounded-md border border-white/60 shadow-sm hover:scale-105"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-amber-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Vista rápida
              </p>
              <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200">
                <div
                  className="px-4 py-3 text-white"
                  style={{
                    background: `linear-gradient(120deg, ${content.brand.sitePrimaryColor || "#4a2a0a"} 0%, ${content.brand.siteSecondaryColor || "#8a4b1f"} 100%)`,
                  }}
                >
                  Encabezado y botones principales
                </div>
                <div
                  className="px-4 py-4"
                  style={{
                    backgroundColor: content.brand.siteSurfaceColor || "#f7f5ef",
                    color: content.brand.siteTextColor || "#1f2937",
                  }}
                >
                  <p className="text-sm">
                    Texto general del sitio con color de acento para detalles.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: content.brand.siteAccentColor || "#b66a2f" }}
                    />
                    <span className="text-xs">Acento visual</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPaletteModalOpen(false)}
                className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

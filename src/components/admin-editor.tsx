"use client";

import {
  BarChart3,
  ChevronRight,
  FileText,
  ImagePlus,
  Images,
  LayoutPanelTop,
  Palette,
  Pencil,
  Phone,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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
type ColorTarget =
  | { kind: "site"; field: SiteColorKey; label: string }
  | {
      kind: "hero";
      field:
        | "heroGradientFrom"
        | "heroGradientVia"
        | "heroGradientTo"
        | "heroTextPrimaryColor"
        | "heroTextSecondaryColor"
        | "heroChipTextColor"
        | "heroChipBackgroundColor"
        | "heroPrimaryButtonTextColor"
        | "heroPrimaryButtonBackgroundColor"
        | "heroSecondaryButtonTextColor"
        | "heroSecondaryButtonBackgroundColor";
      label: string;
    }
  | {
      kind: "panel";
      tabId: AdminTab;
      field: "gradientFrom" | "gradientVia" | "gradientTo";
      label: string;
    };

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
const editorSectionMeta: Record<
  AdminTab,
  { label: string; description: string; icon: typeof LayoutPanelTop }
> = {
  inicio: {
    label: "Inicio",
    description: "Hero principal, textos base y paleta global del sitio.",
    icon: LayoutPanelTop,
  },
  secciones: {
    label: "Secciones",
    description: "Textos hero por página y mensajes de CTA.",
    icon: FileText,
  },
  tarjetas: {
    label: "Tarjetas Home",
    description: "Tarjetas de servicios con fondo, encuadre y copy.",
    icon: Images,
  },
  galeria: {
    label: "Galería",
    description: "Subida, reemplazo y edición de galería destacada.",
    icon: ImagePlus,
  },
  testimonios: {
    label: "Testimonios",
    description: "Opiniones de clientes y visualización en Home.",
    icon: BarChart3,
  },
  contacto: {
    label: "Contacto",
    description: "WhatsApp, redes, dirección y formulario.",
    icon: Phone,
  },
};

const siteColorLabels: Record<SiteColorKey, string> = {
  sitePrimaryColor: "Color primario",
  siteSecondaryColor: "Color secundario",
  siteAccentColor: "Color acento",
  siteSurfaceColor: "Color de fondo",
  siteTextColor: "Color de texto",
};
const siteColorDefaults: Record<SiteColorKey, string> = {
  sitePrimaryColor: "#4a2a0a",
  siteSecondaryColor: "#8a4b1f",
  siteAccentColor: "#b66a2f",
  siteSurfaceColor: "#f7f5ef",
  siteTextColor: "#1f2937",
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
  const [editingSection, setEditingSection] = useState<AdminTab | null>(null);

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [cardModalIndex, setCardModalIndex] = useState<number | null>(null);
  const [galleryReplaceIndex, setGalleryReplaceIndex] = useState<number | null>(null);
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);
  const [paletteTarget, setPaletteTarget] = useState<SiteColorKey>("sitePrimaryColor");
  const [colorPickerTarget, setColorPickerTarget] = useState<ColorTarget | null>(null);

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
  const galleryUploadPreviewUrl = useMemo(
    () => (galleryUploadFile ? URL.createObjectURL(galleryUploadFile) : ""),
    [galleryUploadFile],
  );
  const cardUploadPreviewUrl = useMemo(
    () => (cardUploadFile ? URL.createObjectURL(cardUploadFile) : ""),
    [cardUploadFile],
  );
  const galleryReplacePreviewUrl = useMemo(
    () => (galleryReplaceFile ? URL.createObjectURL(galleryReplaceFile) : ""),
    [galleryReplaceFile],
  );
  const heroBackgroundPreviewUrl = useMemo(
    () => (heroBackgroundFile ? URL.createObjectURL(heroBackgroundFile) : ""),
    [heroBackgroundFile],
  );
  const panelBackgroundPreviewUrl = useMemo(
    () => (panelBackgroundFile ? URL.createObjectURL(panelBackgroundFile) : ""),
    [panelBackgroundFile],
  );
  const hasHeroImage = Boolean(heroBackgroundPreviewUrl || content.brand.heroBackgroundImageUrl);
  const hasPendingHeroFile = Boolean(heroBackgroundFile);

  useEffect(() => () => {
    if (galleryUploadPreviewUrl) URL.revokeObjectURL(galleryUploadPreviewUrl);
  }, [galleryUploadPreviewUrl]);
  useEffect(() => () => {
    if (cardUploadPreviewUrl) URL.revokeObjectURL(cardUploadPreviewUrl);
  }, [cardUploadPreviewUrl]);
  useEffect(() => () => {
    if (galleryReplacePreviewUrl) URL.revokeObjectURL(galleryReplacePreviewUrl);
  }, [galleryReplacePreviewUrl]);
  useEffect(() => () => {
    if (heroBackgroundPreviewUrl) URL.revokeObjectURL(heroBackgroundPreviewUrl);
  }, [heroBackgroundPreviewUrl]);
  useEffect(() => () => {
    if (panelBackgroundPreviewUrl) URL.revokeObjectURL(panelBackgroundPreviewUrl);
  }, [panelBackgroundPreviewUrl]);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (colorPickerTarget) {
        setColorPickerTarget(null);
        return;
      }
      if (paletteModalOpen) {
        setPaletteModalOpen(false);
        return;
      }
      if (editingSection) {
        setEditingSection(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [colorPickerTarget, paletteModalOpen, editingSection]);

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

  function getCardMediaSettings(index: number) {
    const card = content.homeEventTypes[index];
    return {
      positionX: card?.backgroundPositionX ?? 50,
      positionY: card?.backgroundPositionY ?? 50,
      zoom: card?.backgroundZoom ?? 1,
    };
  }

  function updateCardMediaSettings(
    index: number,
    patch: Partial<{ backgroundPositionX: number; backgroundPositionY: number; backgroundZoom: number }>,
  ) {
    setContent((prev) => {
      const next = [...prev.homeEventTypes];
      const current = next[index];
      if (!current) return prev;
      next[index] = { ...current, ...patch };
      return { ...prev, homeEventTypes: next };
    });
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
        <div className="mt-3 flex flex-wrap gap-2">
          {renderColorDot({
            kind: "panel",
            tabId,
            field: "gradientFrom",
            label: "Inicio",
          })}
          {renderColorDot({
            kind: "panel",
            tabId,
            field: "gradientVia",
            label: "Medio",
          })}
          {renderColorDot({
            kind: "panel",
            tabId,
            field: "gradientTo",
            label: "Final",
          })}
          <button
            type="button"
            onClick={() =>
              updatePanelStyle(tabId, {
                gradientFrom: "#f7f5ef",
                gradientVia: "#efe2d2",
                gradientTo: "#f9f3e8",
                overlayOpacity: 0,
              })
            }
            className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-amber-100"
          >
            <RotateCcw size={12} />
            Reset estilo
          </button>
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
              title="Elegir imagen"
            >
              <Upload size={14} />
            </button>
            <button
              type="button"
              disabled={uploadingPanelBackground || panelBackgroundTarget !== tabId}
              onClick={() => submitPanelBackgroundUpload(tabId)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-60"
              title="Subir imagen"
            >
              <Upload size={14} />
            </button>
            <button
              type="button"
              onClick={() =>
                updatePanelStyle(tabId, {
                  backgroundImageUrl: "",
                  backgroundPublicId: "",
                })
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-300 text-amber-900 hover:bg-amber-100"
              title="Quitar imagen"
            >
              <X size={14} />
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
            backgroundImage:
              (panelBackgroundTarget === tabId && panelBackgroundPreviewUrl) || style.backgroundImageUrl
                ? `linear-gradient(135deg, ${style.gradientFrom} 0%, ${style.gradientVia} 48%, ${style.gradientTo} 100%), url(${(panelBackgroundTarget === tabId && panelBackgroundPreviewUrl) || style.backgroundImageUrl})`
              : `linear-gradient(135deg, ${style.gradientFrom} 0%, ${style.gradientVia} 48%, ${style.gradientTo} 100%)`,
            backgroundBlendMode:
              (panelBackgroundTarget === tabId && panelBackgroundPreviewUrl) || style.backgroundImageUrl
                ? "overlay"
                : "normal",
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

  function renderColorDot(target: ColorTarget) {
    const value = getColorTargetValue(target);
    return (
      <button
        type="button"
        onClick={() => setColorPickerTarget(target)}
        className="group inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-2 py-1 hover:border-amber-400"
        title={`Editar ${target.label}`}
      >
        <span
          className="h-6 w-6 rounded-full border border-white shadow ring-1 ring-black/10"
          style={{ backgroundColor: value }}
        />
        <span className="text-xs text-zinc-600 group-hover:text-zinc-800">{target.label}</span>
      </button>
    );
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

  function getSiteColor(field: SiteColorKey): string {
    return content.brand[field] || siteColorDefaults[field];
  }

  function getColorTargetValue(target: ColorTarget): string {
    if (target.kind === "site") {
      return getSiteColor(target.field);
    }
    if (target.kind === "hero") {
      return (
        content.brand[target.field] ||
        {
          heroGradientFrom: "#2f5a3f",
          heroGradientVia: "#5a3515",
          heroGradientTo: "#2b1a0f",
          heroTextPrimaryColor: "#ffffff",
          heroTextSecondaryColor: "#fef3c7",
          heroChipTextColor: "#ffffff",
          heroChipBackgroundColor: "rgba(255,255,255,0.18)",
          heroPrimaryButtonTextColor: "#78350f",
          heroPrimaryButtonBackgroundColor: "#ffffff",
          heroSecondaryButtonTextColor: "#ffffff",
          heroSecondaryButtonBackgroundColor: "rgba(255,255,255,0.10)",
        }[target.field]
      );
    }
    const style = getPanelStyle(target.tabId);
    return style[target.field] || "#000000";
  }

  function applyColorToTarget(target: ColorTarget, value: string) {
    if (target.kind === "site") {
      updateSiteColor(target.field, value);
      return;
    }
    if (target.kind === "hero") {
      setContent((prev) => ({
        ...prev,
        brand: {
          ...prev.brand,
          [target.field]: value,
        },
      }));
      return;
    }
    updatePanelStyle(target.tabId, { [target.field]: value });
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
          <section className="mb-4 rounded-2xl border border-amber-100 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-amber-900">Secciones editables</h2>
                <button
                  type="button"
                  onClick={() => setPaletteModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-300 px-3 py-1.5 text-xs text-amber-900 hover:bg-amber-100"
                >
                  <Palette size={13} />
                  Paleta global
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                Selecciona una sección para abrir su editor avanzado.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {tabs.map((tab) => {
                const meta = editorSectionMeta[tab.id];
                const Icon = meta.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setEditingSection(tab.id);
                    }}
                    className="group rounded-xl border border-amber-100 bg-amber-50/40 p-4 text-left transition hover:border-amber-300 hover:bg-amber-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-amber-900 ring-1 ring-amber-200">
                        <Icon size={16} />
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-amber-800"
                      />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-amber-900">{meta.label}</p>
                    <p className="mt-1 text-xs text-zinc-600">{meta.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {editingSection ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-100 bg-white/95 px-5 py-4 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                      Editor
                    </span>
                    <select
                      className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs text-zinc-700"
                      value={activeTab}
                      onChange={(event) => setActiveTab(event.target.value as AdminTab)}
                    >
                      {tabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                          {tab.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-300 text-amber-900 hover:bg-amber-100"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="max-h-[calc(92vh-70px)] overflow-y-auto p-5">
      {activeTab === "inicio" ? (
        <section
          className="space-y-4 rounded-xl border border-amber-100 p-5"
          style={getPanelContainerStyle("inicio")}
        >
          <h2 className="text-lg font-semibold text-amber-900">Editor de Inicio</h2>
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
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Colores de fondo
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {renderColorDot({
                  kind: "hero",
                  field: "heroGradientFrom",
                  label: "Inicio",
                })}
                {renderColorDot({
                  kind: "hero",
                  field: "heroGradientVia",
                  label: "Medio",
                })}
                {renderColorDot({
                  kind: "hero",
                  field: "heroGradientTo",
                  label: "Final",
                })}
                <div className="ml-auto flex items-center gap-2">
                  <input
                    ref={heroBackgroundFileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/webp,image/png"
                    className="hidden"
                    onChange={(event) =>
                      setHeroBackgroundFile(event.target.files?.[0] ?? null)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => heroBackgroundFileRef.current?.click()}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                    title={hasHeroImage ? "Cambiar imagen Hero" : "Elegir imagen Hero"}
                  >
                    <Upload size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={uploadingHeroBackground || (!hasPendingHeroFile && !hasHeroImage)}
                    onClick={() => {
                      if (hasHeroImage && !hasPendingHeroFile) {
                        setContent((prev) => ({
                          ...prev,
                          brand: {
                            ...prev.brand,
                            heroBackgroundImageUrl: "",
                            heroBackgroundPublicId: "",
                          },
                        }));
                        return;
                      }
                      void submitHeroBackgroundUpload();
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-60"
                    title={
                      hasHeroImage && !hasPendingHeroFile
                        ? "Quitar foto del Hero"
                        : "Subir foto del Hero"
                    }
                  >
                    {hasHeroImage && !hasPendingHeroFile ? <X size={14} /> : <Upload size={14} />}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Colores de texto y botones
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {renderColorDot({
                  kind: "hero",
                  field: "heroTextPrimaryColor",
                  label: "Título",
                })}
                {renderColorDot({
                  kind: "hero",
                  field: "heroTextSecondaryColor",
                  label: "Subtítulo",
                })}
                {renderColorDot({
                  kind: "hero",
                  field: "heroChipTextColor",
                  label: "Texto chips",
                })}
                {renderColorDot({
                  kind: "hero",
                  field: "heroChipBackgroundColor",
                  label: "Fondo chips",
                })}
                {renderColorDot({
                  kind: "hero",
                  field: "heroPrimaryButtonTextColor",
                  label: "Botón principal texto",
                })}
                {renderColorDot({
                  kind: "hero",
                  field: "heroPrimaryButtonBackgroundColor",
                  label: "Botón principal fondo",
                })}
                {renderColorDot({
                  kind: "hero",
                  field: "heroSecondaryButtonTextColor",
                  label: "Botón secundario texto",
                })}
                {renderColorDot({
                  kind: "hero",
                  field: "heroSecondaryButtonBackgroundColor",
                  label: "Botón secundario fondo",
                })}
                <button
                  type="button"
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      brand: {
                        ...prev.brand,
                        heroGradientFrom: "#2f5a3f",
                        heroGradientVia: "#5a3515",
                        heroGradientTo: "#2b1a0f",
                        heroOverlayOpacity: 0.55,
                        heroTextPrimaryColor: "#ffffff",
                        heroTextSecondaryColor: "#fef3c7",
                        heroChipTextColor: "#ffffff",
                        heroChipBackgroundColor: "rgba(255,255,255,0.18)",
                        heroPrimaryButtonTextColor: "#78350f",
                        heroPrimaryButtonBackgroundColor: "#ffffff",
                        heroSecondaryButtonTextColor: "#ffffff",
                        heroSecondaryButtonBackgroundColor: "rgba(255,255,255,0.10)",
                      },
                    }))
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-amber-100"
                >
                  <RotateCcw size={12} />
                  Reset Hero
                </button>
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
              <p className="mt-2 text-xs text-zinc-500">
                {heroBackgroundFile?.name ||
                  content.brand.heroBackgroundImageUrl ||
                  "Sin imagen de fondo seleccionada"}
              </p>

              <div className="relative mt-3 overflow-hidden rounded-xl border border-amber-100">
                <div
                  className="h-44 bg-cover bg-center"
                  style={{
                    backgroundImage: (heroBackgroundPreviewUrl || content.brand.heroBackgroundImageUrl)
                      ? `linear-gradient(135deg, ${content.brand.heroGradientFrom || "#2f5a3f"} 0%, ${content.brand.heroGradientVia || "#5a3515"} 48%, ${content.brand.heroGradientTo || "#2b1a0f"} 100%), url(${heroBackgroundPreviewUrl || content.brand.heroBackgroundImageUrl})`
                      : `linear-gradient(135deg, ${content.brand.heroGradientFrom || "#2f5a3f"} 0%, ${content.brand.heroGradientVia || "#5a3515"} 48%, ${content.brand.heroGradientTo || "#2b1a0f"} 100%)`,
                    backgroundBlendMode:
                      heroBackgroundPreviewUrl || content.brand.heroBackgroundImageUrl
                        ? "overlay"
                        : "normal",
                  }}
                />
                {(heroBackgroundPreviewUrl || content.brand.heroBackgroundImageUrl) ? (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: `rgba(0,0,0,${Math.min(Math.max(content.brand.heroOverlayOpacity ?? 0.55, 0), 1)})`,
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 z-10 p-4">
                  <span
                    className="inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
                    style={{
                      color: content.brand.heroChipTextColor || "#ffffff",
                      backgroundColor:
                        content.brand.heroChipBackgroundColor || "rgba(255,255,255,0.18)",
                    }}
                  >
                    El centro de eventos de Peñalolén
                  </span>
                  <p
                    className="mt-2 text-lg font-semibold leading-tight"
                    style={{ color: content.brand.heroTextPrimaryColor || "#ffffff" }}
                  >
                    {content.brand.heroTitle || "Tu historia empieza aquí"}
                  </p>
                  <p
                    className="mt-1 max-w-xl text-xs"
                    style={{ color: content.brand.heroTextSecondaryColor || "#fef3c7" }}
                  >
                    {content.brand.heroSubtitle ||
                      "Matrimonios, eventos corporativos, activaciones y celebraciones en Peñalolén."}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={{
                        color: content.brand.heroPrimaryButtonTextColor || "#78350f",
                        backgroundColor: content.brand.heroPrimaryButtonBackgroundColor || "#ffffff",
                      }}
                    >
                      Cotiza por WhatsApp
                    </span>
                    <span
                      className="inline-flex rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold"
                      style={{
                        color: content.brand.heroSecondaryButtonTextColor || "#ffffff",
                        backgroundColor:
                          content.brand.heroSecondaryButtonBackgroundColor ||
                          "rgba(255,255,255,0.10)",
                      }}
                    >
                      Ver galería
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-white p-4 md:col-span-2">
              <p className="text-sm font-semibold text-amber-900">Paleta activa del sitio</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    "sitePrimaryColor",
                    "siteSecondaryColor",
                    "siteAccentColor",
                    "siteSurfaceColor",
                    "siteTextColor",
                  ] as SiteColorKey[]
                ).map((field) => (
                  <span key={field}>
                    {renderColorDot({ kind: "site", field, label: siteColorLabels[field] })}
                  </span>
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
              {(() => {
                const media = getCardMediaSettings(index);
                return (
                  <>
              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <div className="relative h-28 overflow-hidden rounded-lg border border-amber-100 bg-amber-50">
                  {card.backgroundImageUrl ? (
                    <Image
                      src={card.backgroundImageUrl}
                      alt={`Fondo ${card.title}`}
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: `${media.positionX}% ${media.positionY}%`,
                        transform: `scale(${media.zoom})`,
                      }}
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
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <label className="text-xs">
                  <span className="text-zinc-600">Posición horizontal ({Math.round(media.positionX)}%)</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    className="mt-1 w-full"
                    value={media.positionX}
                    onChange={(event) =>
                      updateCardMediaSettings(index, {
                        backgroundPositionX: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label className="text-xs">
                  <span className="text-zinc-600">Posición vertical ({Math.round(media.positionY)}%)</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    className="mt-1 w-full"
                    value={media.positionY}
                    onChange={(event) =>
                      updateCardMediaSettings(index, {
                        backgroundPositionY: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label className="text-xs">
                  <span className="text-zinc-600">Zoom ({media.zoom.toFixed(2)}x)</span>
                  <input
                    type="range"
                    min={1}
                    max={2}
                    step={0.05}
                    className="mt-1 w-full"
                    value={media.zoom}
                    onChange={(event) =>
                      updateCardMediaSettings(index, {
                        backgroundZoom: Number(event.target.value),
                      })
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => setCardModalIndex(index)}
                className="mt-3 rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
              >
                Reemplazar fondo con modal
              </button>
                  </>
                );
              })()}
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
                </div>
              </div>
            </div>
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
              {galleryUploadPreviewUrl ? (
                <div className="overflow-hidden rounded-xl border border-amber-100">
                  <Image
                    src={galleryUploadPreviewUrl}
                    alt="Vista previa galería"
                    unoptimized
                    width={1200}
                    height={700}
                    className="h-44 w-full object-cover"
                  />
                </div>
              ) : null}

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

            {cardModalIndex !== null ? (
              (() => {
                const media = getCardMediaSettings(cardModalIndex);
                const previewUrl =
                  cardUploadPreviewUrl || content.homeEventTypes[cardModalIndex]?.backgroundImageUrl || "";
                return (
                  <>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <label className="text-xs">
                        <span className="text-zinc-600">
                          Posición horizontal ({Math.round(media.positionX)}%)
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          className="mt-1 w-full"
                          value={media.positionX}
                          onChange={(event) =>
                            updateCardMediaSettings(cardModalIndex, {
                              backgroundPositionX: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label className="text-xs">
                        <span className="text-zinc-600">
                          Posición vertical ({Math.round(media.positionY)}%)
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          className="mt-1 w-full"
                          value={media.positionY}
                          onChange={(event) =>
                            updateCardMediaSettings(cardModalIndex, {
                              backgroundPositionY: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label className="text-xs">
                        <span className="text-zinc-600">Zoom ({media.zoom.toFixed(2)}x)</span>
                        <input
                          type="range"
                          min={1}
                          max={2}
                          step={0.05}
                          className="mt-1 w-full"
                          value={media.zoom}
                          onChange={(event) =>
                            updateCardMediaSettings(cardModalIndex, {
                              backgroundZoom: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                    </div>
                    <div className="mt-3 overflow-hidden rounded-xl border border-amber-100 bg-zinc-900">
                      {previewUrl ? (
                        <div className="relative h-48">
                          <Image
                            src={previewUrl}
                            alt="Vista previa del fondo de tarjeta"
                            unoptimized
                            fill
                            className="object-cover"
                            style={{
                              objectPosition: `${media.positionX}% ${media.positionY}%`,
                              transform: `scale(${media.zoom})`,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-48 items-center justify-center text-sm text-zinc-300">
                          Aun no hay imagen para previsualizar.
                        </div>
                      )}
                    </div>
                  </>
                );
              })()
            ) : null}

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
            {galleryReplacePreviewUrl || (galleryReplaceIndex !== null && content.gallery[galleryReplaceIndex]?.imageUrl) ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-amber-100">
                <Image
                  src={
                    galleryReplacePreviewUrl ||
                    content.gallery[galleryReplaceIndex!]?.imageUrl ||
                    ""
                  }
                  alt="Vista previa reemplazo galería"
                  unoptimized
                  width={1200}
                  height={700}
                  className="h-44 w-full object-cover"
                />
              </div>
            ) : null}

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

      {colorPickerTarget ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-amber-100 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-amber-900">
                Elegir color: {colorPickerTarget.label}
              </h3>
              <button
                type="button"
                onClick={() => setColorPickerTarget(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-300 text-amber-900 hover:bg-amber-100"
              >
                <X size={14} />
              </button>
            </div>
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
              <span
                className="h-9 w-9 rounded-full border border-white shadow ring-1 ring-black/10"
                style={{ backgroundColor: getColorTargetValue(colorPickerTarget) }}
              />
              <p className="text-sm text-zinc-700">{getColorTargetValue(colorPickerTarget)}</p>
            </div>
            <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-13">
              {largeColorPalette.map((color) => (
                <button
                  key={`picker-${color}`}
                  type="button"
                  onClick={() => applyColorToTarget(colorPickerTarget, color)}
                  className="h-8 w-8 rounded-full border border-white/70 shadow-sm hover:scale-105"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="mt-4">
              <input
                type="color"
                value={getColorTargetValue(colorPickerTarget)}
                onChange={(event) => applyColorToTarget(colorPickerTarget, event.target.value)}
                className="h-10 w-20 rounded-md border border-amber-200"
              />
            </div>
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

            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(siteColorLabels) as SiteColorKey[]).map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => setPaletteTarget(field)}
                  className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 ${
                    paletteTarget === field
                      ? "border-amber-500 bg-amber-50"
                      : "border-amber-200 bg-white"
                  }`}
                >
                  <span
                    className="h-6 w-6 rounded-full border border-white shadow ring-1 ring-black/10"
                    style={{ backgroundColor: getSiteColor(field) }}
                  />
                  <span className="text-xs text-zinc-700">{siteColorLabels[field]}</span>
                </button>
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

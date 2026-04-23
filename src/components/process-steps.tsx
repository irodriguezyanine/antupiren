import { CalendarCheck2, ClipboardPenLine, PartyPopper, Telescope } from "lucide-react";

const steps = [
  {
    title: "Cuéntanos tu idea",
    description: "Escríbenos por WhatsApp y conversemos el tipo de evento, fecha y necesidades.",
    icon: Telescope,
  },
  {
    title: "Visita y propuesta",
    description: "Te mostramos el espacio en terreno y te enviamos una propuesta clara.",
    icon: CalendarCheck2,
  },
  {
    title: "Planificación",
    description: "Definimos montaje, servicios y detalles para que todo fluya sin estrés.",
    icon: ClipboardPenLine,
  },
  {
    title: "Día del evento",
    description: "Nuestro equipo ejecuta con precisión para que tú vivas la experiencia.",
    icon: PartyPopper,
  },
];

export function ProcessSteps() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <article
            key={step.title}
            className="soft-shadow rounded-2xl border border-amber-100 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-900">
                <Icon size={16} />
              </span>
              <span className="text-xs font-semibold text-zinc-500">Paso {index + 1}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-amber-900">{step.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600">{step.description}</p>
          </article>
        );
      })}
    </div>
  );
}

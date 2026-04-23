"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "¿Puedo agendar una visita antes de cotizar?",
    a: "Sí. La visita en terreno es la mejor forma de conocer el espacio y resolver dudas logísticas.",
  },
  {
    q: "¿El recinto sirve para eventos pequeños y grandes?",
    a: "Sí, contamos con configuraciones flexibles para actividades íntimas o de mayor convocatoria.",
  },
  {
    q: "¿Trabajan con empresas y activaciones de marca?",
    a: "Sí, desarrollamos eventos corporativos, team building, lanzamientos y experiencias de marca.",
  },
  {
    q: "¿Cómo reservo una fecha?",
    a: "Escríbenos por WhatsApp, revisamos disponibilidad y te acompañamos en todo el proceso.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, index) => {
        const active = open === index;
        return (
          <article
            key={item.q}
            className="rounded-2xl border border-amber-100 bg-white px-4 py-3"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-amber-900"
              onClick={() => setOpen(active ? -1 : index)}
            >
              {item.q}
              <ChevronDown
                size={16}
                className={`transition ${active ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            {active ? <p className="mt-2 text-sm text-zinc-600">{item.a}</p> : null}
          </article>
        );
      })}
    </div>
  );
}

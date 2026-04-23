import { Camera, ChefHat, Flower2, ParkingSquare, ShieldCheck, Speaker } from "lucide-react";

const benefits = [
  { title: "Espacios versátiles", icon: Flower2, text: "Interior y exterior para distintos formatos." },
  { title: "Producción audiovisual", icon: Speaker, text: "Sonido y soporte técnico para tu evento." },
  { title: "Gastronomía flexible", icon: ChefHat, text: "Opciones para distintos estilos y presupuestos." },
  { title: "Entorno fotográfico", icon: Camera, text: "Jardines y vistas ideales para fotos memorables." },
  { title: "Estacionamiento", icon: ParkingSquare, text: "Comodidad para invitados y proveedores." },
  { title: "Seguridad y respaldo", icon: ShieldCheck, text: "Equipo experimentado en eventos complejos." },
];

export function BenefitsGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map((item) => {
        const Icon = item.icon;
        return (
          <article
            key={item.title}
            className="soft-shadow rounded-2xl border border-amber-100 bg-white p-5"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-900">
              <Icon size={17} />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-amber-900">{item.title}</h3>
            <p className="mt-2 text-xs text-zinc-600">{item.text}</p>
          </article>
        );
      })}
    </div>
  );
}

import { Building2, Home } from "lucide-react";
import type { ServiceCategory } from "./types";

type Props = {
  value: ServiceCategory | null;
  onChange: (category: ServiceCategory) => void;
};

const OPTIONS: {
  value: ServiceCategory;
  label: string;
  desc: string;
  Icon: typeof Home;
}[] = [
  {
    value: "interior",
    label: "Interior",
    desc: "Inside your home — living rooms, bedrooms, kitchens.",
    Icon: Home,
  },
  {
    value: "exterior",
    label: "Exterior",
    desc: "Outside walls, façades, weather-proof finishes.",
    Icon: Building2,
  },
];

export function CategoryStep({ value, onChange }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`p-6 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 ${
              active
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border bg-background hover:border-primary/30"
            }`}
          >
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <o.Icon className="h-6 w-6" />
            </div>
            <div className="mt-4 font-display font-bold text-lg text-foreground">
              {o.label}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{o.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

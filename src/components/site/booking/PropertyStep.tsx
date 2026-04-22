import { Building, Building2, Castle, Store } from "lucide-react";
import type { PropertyType } from "./types";

type Props = {
  value: PropertyType | null;
  onChange: (p: PropertyType) => void;
};

const OPTIONS: { value: PropertyType; label: string; Icon: typeof Building }[] = [
  { value: "building", label: "Building", Icon: Building2 },
  { value: "villa", label: "Villa", Icon: Castle },
  { value: "apartment", label: "Apartment", Icon: Building },
  { value: "office", label: "Office", Icon: Store },
];

export function PropertyStep({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`p-6 rounded-2xl border-2 text-center transition-all hover:-translate-y-1 ${
              active
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border bg-background hover:border-primary/30"
            }`}
          >
            <o.Icon
              className={`h-10 w-10 mx-auto ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <div className="mt-3 font-semibold text-foreground">{o.label}</div>
          </button>
        );
      })}
    </div>
  );
}

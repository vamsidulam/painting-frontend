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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`p-4 rounded-xl border-2 text-center transition-all hover:-translate-y-0.5 ${
              active
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border bg-background hover:border-primary/30"
            }`}
          >
            <o.Icon
              className={`h-8 w-8 mx-auto ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <div className="mt-2 font-semibold text-sm text-foreground">
              {o.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

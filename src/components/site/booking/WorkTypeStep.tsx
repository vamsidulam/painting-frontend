import { Paintbrush, Palette } from "lucide-react";
import type { WorkType } from "./types";

type Props = {
  value: WorkType | null;
  onChange: (w: WorkType) => void;
};

const OPTIONS: {
  value: WorkType;
  label: string;
  subtitle: string;
  Icon: typeof Paintbrush;
}[] = [
  {
    value: "fresh",
    label: "Fresh Painting",
    subtitle: "Brand new walls, first coat.",
    Icon: Palette,
  },
  {
    value: "repainting",
    label: "Repainting",
    subtitle: "Refresh existing walls.",
    Icon: Paintbrush,
  },
];

export function WorkTypeStep({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`p-5 rounded-2xl border-2 text-center transition-all hover:-translate-y-0.5 ${
              active
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border bg-background hover:border-primary/30"
            }`}
          >
            <o.Icon
              className={`h-9 w-9 mx-auto ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <div className="mt-2 font-semibold text-foreground">{o.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {o.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
}

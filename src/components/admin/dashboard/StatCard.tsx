import { motion } from "framer-motion";
import { Counter } from "./Counter";

type Props = {
  label: string;
  value: number;
  trend?: string;
  prefix?: string;
  suffix?: string;
  index?: number;
};

export function StatCard({
  label,
  value,
  trend,
  prefix,
  suffix,
  index = 0,
}: Props) {
  const isNegative = trend?.startsWith("-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-card rounded-2xl px-6 py-5 shadow-card border border-border flex flex-col justify-between min-h-32.5"
    >
      <div className="text-sm font-medium text-muted-foreground">{label}</div>

      <div className="mt-3 font-display font-bold text-3xl md:text-4xl text-foreground leading-none tracking-tight">
        <Counter to={value} prefix={prefix} suffix={suffix} />
      </div>

      {trend && (
        <div className="mt-3 text-xs font-semibold">
          <span
            className={
              isNegative
                ? "text-destructive"
                : "text-success"
            }
          >
            {trend}
          </span>
          <span className="text-muted-foreground font-normal ml-1.5">
            vs last week
          </span>
        </div>
      )}
    </motion.div>
  );
}

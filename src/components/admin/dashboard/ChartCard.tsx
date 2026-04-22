import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className = "",
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-card rounded-2xl shadow-card border border-border p-6 h-full flex flex-col ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </motion.div>
  );
}

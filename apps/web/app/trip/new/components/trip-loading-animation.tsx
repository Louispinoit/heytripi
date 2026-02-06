"use client";

import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import type { LoadingStep } from "../types";

interface TripLoadingAnimationProps {
  steps: LoadingStep[];
}

export function TripLoadingAnimation({ steps }: TripLoadingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-80 rounded-2xl bg-card border shadow-xl p-6"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 mb-3">
            <Loader2 className="size-6 text-primary animate-spin" />
          </div>
          <h3 className="font-semibold text-lg">Tripy prépare ton voyage</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Ça va être génial !
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="shrink-0">
                {step.status === "done" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check className="size-3.5" />
                  </motion.div>
                ) : step.status === "active" ? (
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="size-3.5 text-primary animate-spin" />
                  </div>
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                    <div className="size-2 rounded-full bg-muted-foreground/30" />
                  </div>
                )}
              </div>
              <span
                className={`text-sm ${
                  step.status === "active"
                    ? "text-foreground font-medium"
                    : step.status === "done"
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

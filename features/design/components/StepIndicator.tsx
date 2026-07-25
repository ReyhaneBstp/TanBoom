import { cn } from "@/shared/utils/mergeClasses";
import { useDesignStepper } from "../hooks/useDesignStepper";

export function StepIndicator() {
  const { steps } = useDesignStepper();

  return (
    <div className="grid grid-cols-6 gap-2 rounded-[1.5rem] border border-white/70 bg-white/45 p-2 backdrop-blur-2xl">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "rounded-[1.15rem] px-2.5 py-2.5 text-center transition-all",
            step.isActive && "bg-white shadow-soft-primary",
            step.isCompleted &&
              !step.isActive &&
              "bg-primary-100/70"
          )}
        >
          <div
            className={cn(
              "mx-auto mb-1 flex size-7 items-center justify-center rounded-full text-xs font-semibold",
              step.isActive
                ? "bg-primary-400 text-white"
                : "bg-white/70 text-muted-foreground",
              step.isCompleted &&
                !step.isActive &&
                "bg-primary-400/80 text-white"
            )}
          >
            {index + 1}
          </div>

          <p className="mt-1 truncate text-[11px] font-semibold text-foreground">
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
}
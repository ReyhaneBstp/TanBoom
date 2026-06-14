import { STEPPER_STEPS } from "@/features/designer/constants/design-options";
import { cn } from "@/shared/utils/utils";
import { useDesignStore } from "@/features/designer/store/useDesignStore";

export function StepIndicator() {
  const currentStep = useDesignStore((s) => s.currentStep);
  const gender = useDesignStore((s) => s.gender);
  const garmentTypeId = useDesignStore((s) => s.garmentTypeId);
  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const sketch = useDesignStore((s) => s.sketch);
  const generatedImages = useDesignStore((s) => s.generatedImages);

  const completedSteps = [
    Boolean(gender && garmentTypeId),
    selectedFabricIds.length > 0,
    Boolean(sketch.file && sketch.description.trim().length > 8),
    generatedImages.length > 0,
    generatedImages.length > 0,
  ];

  return (
    <div className="grid grid-cols-5 gap-2 rounded-[1.5rem] border border-white/70 bg-white/45 p-2 backdrop-blur-2xl">
      {STEPPER_STEPS.map((step, index) => {
        const isActive = currentStep === index + 1;
        const isCompleted = completedSteps[index];

        return (
          <div
            key={step.id}
            className={cn(
              "rounded-[1.15rem] px-2.5 py-2.5 text-center transition-all",
              isActive && "bg-white shadow-soft-primary",
              isCompleted && !isActive && "bg-primary-100/70"
            )}
          >
            <div
              className={cn(
                "mx-auto mb-1 flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                isActive ? "bg-primary-300 text-white" : "bg-white/70 text-muted-foreground",
                isCompleted && !isActive && "bg-primary-300/80 text-white"
              )}
            >
              {step.id}
            </div>
            <p className="truncate text-[11px] font-semibold text-foreground mt-1">
              {step.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
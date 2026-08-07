"use client";
import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { STEP_IDS } from "@/features/design/definitions/design-steps";
import { useResultDraftStore } from "../store/resultDraftStore";

export function useResetDesign() {
  const router = useRouter();
  const pathname = usePathname();

  const reset = useCallback(() => {
    useResultDraftStore.getState().clear();
    router.replace(`${pathname}?step=${STEP_IDS.GENDER}`, { scroll: false });
    // پاک‌سازی سایر storeها
    import("../store/sketchStore").then(({ useSketchStore }) =>
      useSketchStore.getState().reset()
    );
    import("../store/generationStore").then(({ useGenerationStore }) =>
      useGenerationStore.getState().reset()
    );
  }, [router, pathname]);

  return reset;
}
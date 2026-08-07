"use client";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useUpdateUrl } from "./useUpdateUrl";
import type { Gender } from "@/features/design/types/design";

export function useStepGenderUrl() {
  const searchParams = useSearchParams();
  const updateUrl = useUpdateUrl();
  const genderParam = searchParams.get("gender") as Gender | null;
  const gender: Gender | null =
    genderParam === "women" || genderParam === "men" ? genderParam : null;

  const setGender = useCallback(
    (newGender: Gender) => {
      updateUrl({ gender: newGender, garment: null });
    },
    [updateUrl]
  );

  return { gender, setGender };
}
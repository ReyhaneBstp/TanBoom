"use client";
import { useCallback } from "react";
import { useCompressedParam } from "./useCompressedParam";

export function useStepResultUrl() {
  const { getValue, setValue } = useCompressedParam("title");

  const designTitle = getValue<string>() ?? "";

  const setDesignTitle = useCallback(
    (title: string) => setValue(title || null),
    [setValue]
  );

  return { designTitle, setDesignTitle };
}
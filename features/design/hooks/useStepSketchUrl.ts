"use client";
import { useCallback } from "react";
import { useCompressedParam } from "./useCompressedParam";

export function useStepSketchUrl() {
  const { getValue, setValue } = useCompressedParam("sketchDesc");

  const description = getValue<string>() ?? "";

  const updateDescription = useCallback(
    (desc: string) => setValue(desc || null),
    [setValue]
  );

  return { description, updateDescription };
}
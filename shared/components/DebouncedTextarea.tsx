"use client";

import { useState, useEffect, useRef } from "react";
import { Textarea } from "./Textarea";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";

interface DebouncedTextareaProps
  extends Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange"> {
  value: string;
  onDebouncedChange: (value: string) => void;
  delay?: number;
}

export function DebouncedTextarea({
  value,
  onDebouncedChange,
  delay = 400,
  ...rest
}: DebouncedTextareaProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedOnChange = useDebouncedCallback(onDebouncedChange, delay);

  const isTypingRef = useRef(false);
  useEffect(() => {
    if (!isTypingRef.current) {
      setLocalValue(value);
    }
    isTypingRef.current = false;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    isTypingRef.current = true;
    setLocalValue(next);
    debouncedOnChange(next);
  };

  return <Textarea {...rest} value={localValue} onChange={handleChange} />;
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "./Input";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";

interface DebouncedInputProps
  extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  value: string;
  onDebouncedChange: (value: string) => void;
  delay?: number;
}

export function DebouncedInput({
  value,
  onDebouncedChange,
  delay = 400,
  ...rest
}: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedOnChange = useDebouncedCallback(onDebouncedChange, delay);

  const isTypingRef = useRef(false);
  useEffect(() => {
    if (!isTypingRef.current) {
      setLocalValue(value);
    }
    isTypingRef.current = false;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    isTypingRef.current = true;
    setLocalValue(next);
    debouncedOnChange(next);
  };

  return <Input {...rest} value={localValue} onChange={handleChange} />;
}
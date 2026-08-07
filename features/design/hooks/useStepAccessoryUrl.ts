"use client";
import { useCallback } from "react";
import { useCompressedParam } from "./useCompressedParam";

interface AccessoryState {
  selectedAccessories: string[];
  accessoryPlacements: Record<string, string>;
}

export function useStepAccessoryUrl() {
  const { getValue, setValue } = useCompressedParam("accessories");

  const state: AccessoryState = getValue<AccessoryState>() ?? {
    selectedAccessories: [],
    accessoryPlacements: {},
  };

  const setState = useCallback(
    (newState: AccessoryState) => setValue(newState),
    [setValue]
  );

  const toggleAccessory = useCallback(
    (accessoryId: string) => {
      const exists = state.selectedAccessories.includes(accessoryId);
      const newAccessories = exists
        ? state.selectedAccessories.filter((id) => id !== accessoryId)
        : [...state.selectedAccessories, accessoryId];
      const newPlacements = exists
        ? (() => {
            const { [accessoryId]: _, ...rest } = state.accessoryPlacements;
            return rest;
          })()
        : state.accessoryPlacements;
      setState({
        selectedAccessories: newAccessories,
        accessoryPlacements: newPlacements,
      });
    },
    [state, setState]
  );

  const setAccessoryPlacement = useCallback(
    (accessoryId: string, placement: string) => {
      const newPlacements = {
        ...state.accessoryPlacements,
        [accessoryId]: placement,
      };
      setState({ ...state, accessoryPlacements: newPlacements });
    },
    [state, setState]
  );

  return {
    selectedAccessories: state.selectedAccessories,
    accessoryPlacements: state.accessoryPlacements,
    toggleAccessory,
    setAccessoryPlacement,
  };
}
"use client";
import { useCallback } from "react";
import { useCompressedParam } from "./useCompressedParam";
import type { SolidFabric } from "@/features/design/types/design";

interface FabricState {
  customFabrics: SolidFabric[];
  selectedFabricIds: string[];
  fabricAssignments: Record<string, string>;
}

export function useStepFabricUrl() {
  const { getValue, setValue } = useCompressedParam("fabrics");

  const state: FabricState = getValue<FabricState>() ?? {
    customFabrics: [],
    selectedFabricIds: [],
    fabricAssignments: {},
  };

  const setState = useCallback(
    (newState: FabricState) => setValue(newState),
    [setValue]
  );

  const addCustomFabric = useCallback(
    (hex: string, material: string) => {
      const id = `custom-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 5)}`;
      const label = `${material} (${hex})`;
      const newFabric: SolidFabric = {
        id,
        kind: "solid",
        hex,
        material,
        label,
      };
      const newState: FabricState = {
        ...state,
        customFabrics: [...state.customFabrics, newFabric],
        selectedFabricIds: [...state.selectedFabricIds, id],
      };
      setState(newState);
    },
    [state, setState]
  );

  const removeCustomFabric = useCallback(
    (fabricId: string) => {
      const newState: FabricState = {
        customFabrics: state.customFabrics.filter((f) => f.id !== fabricId),
        selectedFabricIds: state.selectedFabricIds.filter(
          (id) => id !== fabricId
        ),
        fabricAssignments: (() => {
          const { [fabricId]: _, ...rest } = state.fabricAssignments;
          return rest;
        })(),
      };
      setState(newState);
    },
    [state, setState]
  );

  const toggleFabric = useCallback(
    (fabricId: string) => {
      const exists = state.selectedFabricIds.includes(fabricId);
      const newSelectedIds = exists
        ? state.selectedFabricIds.filter((id) => id !== fabricId)
        : [...state.selectedFabricIds, fabricId];
      const newAssignments = exists
        ? (() => {
            const { [fabricId]: _, ...rest } = state.fabricAssignments;
            return rest;
          })()
        : state.fabricAssignments;
      setState({
        ...state,
        selectedFabricIds: newSelectedIds,
        fabricAssignments: newAssignments,
      });
    },
    [state, setState]
  );

  const setFabricAssignment = useCallback(
    (fabricId: string, assignment: string) => {
      const newAssignments = {
        ...state.fabricAssignments,
        [fabricId]: assignment,
      };
      setState({ ...state, fabricAssignments: newAssignments });
    },
    [state, setState]
  );

  return {
    customFabrics: state.customFabrics as SolidFabric[],
    selectedFabricIds: state.selectedFabricIds,
    fabricAssignments: state.fabricAssignments,
    addCustomFabric,
    removeCustomFabric,
    toggleFabric,
    setFabricAssignment,
  };
}
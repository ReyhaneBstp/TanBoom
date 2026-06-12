import { HiOutlineCheck, HiOutlinePaintBrush, HiOutlineSwatch } from "react-icons/hi2";

import { FABRIC_OPTIONS } from "@/constants/design-options";
import { cn } from "@/lib/utils";
import type { FabricKind, FabricOption, PatternedFabric, SolidFabric } from "@/types/design";

interface StepFabricProps {
  activeFabricKind: FabricKind;
  selectedFabricIds: string[];
  onChangeKind: (kind: FabricKind) => void;
  onToggleFabric: (fabricId: string) => void;
}

const isSolidFabric = (fabric: FabricOption): fabric is SolidFabric => fabric.kind === "solid";

const isPatternedFabric = (fabric: FabricOption): fabric is PatternedFabric => fabric.kind === "patterned";

export function StepFabric({ activeFabricKind, selectedFabricIds, onChangeKind, onToggleFabric }: StepFabricProps) {
  const solidFabrics = FABRIC_OPTIONS.filter(isSolidFabric);
  const patternedFabrics = FABRIC_OPTIONS.filter(isPatternedFabric);

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-full border border-white/80 bg-white/45 p-1 backdrop-blur-xl">
        {[
          { id: "solid" as const, label: "ساده", icon: HiOutlineSwatch },
          { id: "patterned" as const, label: "طرح‌دار", icon: HiOutlinePaintBrush }
        ].map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeKind(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition",
                activeFabricKind === tab.id ? "bg-white text-rose-600 shadow-soft-rose" : "text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeFabricKind === "solid" ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {solidFabrics.map((fabric) => {
            const selected = selectedFabricIds.includes(fabric.id);

            return (
              <button
                key={fabric.id}
                type="button"
                onClick={() => onToggleFabric(fabric.id)}
                className={cn(
                  "group rounded-[1.5rem] border border-white/80 bg-white/45 p-3 text-center backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-soft-rose",
                  selected && "border-rose-300 bg-white shadow-soft-rose ring-4 ring-rose-200/35"
                )}
              >
                <span
                  className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/70 shadow-inner"
                  style={{ backgroundColor: fabric.hex }}
                >
                  {selected ? <HiOutlineCheck className="size-5 text-white drop-shadow" /> : null}
                </span>
                <span className="mt-2 block text-xs font-semibold text-foreground">{fabric.label}</span>
                <span className="mt-1 block text-[10px] text-muted-foreground" dir="ltr">
                  {fabric.hex}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
          {patternedFabrics.map((fabric) => {
            const selected = selectedFabricIds.includes(fabric.id);

            return (
              <button
                key={fabric.id}
                type="button"
                onClick={() => onToggleFabric(fabric.id)}
                className={cn(
                  "min-w-36 rounded-[1.6rem] border border-white/80 bg-white/45 p-2.5 text-right backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-soft-rose",
                  selected && "border-rose-300 bg-white shadow-soft-rose ring-4 ring-rose-200/35"
                )}
              >
                <span
                  className="relative block h-28 rounded-[1.25rem] bg-cover bg-center"
                  style={{ backgroundImage: `url("${fabric.imageData}")` }}
                >
                  {selected ? (
                    <span className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-full bg-rose-300 text-white">
                      <HiOutlineCheck className="size-4" />
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block px-1 text-xs font-semibold text-foreground">{fabric.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <p className="rounded-[1.3rem] border border-white/70 bg-white/40 px-4 py-3 text-xs leading-6 text-muted-foreground backdrop-blur-xl">
        می‌توانید چند پارچه را هم‌زمان انتخاب کنید؛ رنگ‌های ساده با کد Hex و پارچه‌های طرح‌دار با داده تصویر به پرامپت افزوده می‌شوند.
      </p>
    </div>
  );
}

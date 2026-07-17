"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineArrowDownTray,
  HiOutlineSparkles,
  HiOutlineArrowPath,
  HiOutlineBookmark,
  HiOutlineGlobeAlt,
  HiOutlineShoppingBag,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { handleDownload } from "@/shared/utils/downloadFile";
import { useGenerationStore } from "../store/generationStore";
import { useStepStore } from "../store/stepStore";
import { useGenerateImage } from "../hooks/useGenerateImage";
import {
  saveDesignToDashboard,
  publishDesignToGallery,
} from "@/server/actions/design-actions";
import { OrderModal } from "./OrderModal";
import { useGlobalStore } from "@/shared/store/useGlobalStore";

export function StepResult() {
  const generatedImages = useGenerationStore((s) => s.generatedImages);
  const { generateBackView, generateFront, isGeneratingBack } =
    useGenerateImage();
  const restart = useStepStore((s) => s.reset);

  const hasBack = generatedImages.some((img) => img.id === "back");

  const [isSaving, setIsSaving] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  const [designTitle, setDesignTitle] = useState("");
  const { showSnackbar } = useGlobalStore();

  useEffect(() => {
    if (generatedImages.length === 0) {
      generateFront();
    }
  }, []);

  const frontImage = generatedImages.find((img) => img.id === "front")?.src;
  const backImage = generatedImages.find((img) => img.id === "back")?.src;

  const handleSave = async (action: "dashboard" | "gallery") => {
    if (!frontImage) {
      return;
    }
    setIsSaving(true);
    const title = designTitle.trim() || "طرح جدید";
    try {
      let res;
      if (action === "dashboard") {
        res = await saveDesignToDashboard({
          title,
          frontImage,
          backImage: backImage ?? undefined,
        });
        showSnackbar("طرح در داشبورد شما ذخیره شد", "success");
      } else {
        res = await publishDesignToGallery({
          title,
          frontImage,
          backImage: backImage ?? undefined,
        });
        showSnackbar("طرح در گالری عمومی منتشر شد", "success");
      }
      setCurrentDesignId(res.designId);
    } catch (error: any) {
      showSnackbar("خطا در ذخیره‌سازی", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOrderClick = async () => {
    if (!currentDesignId && frontImage) {
      try {
        const res = await saveDesignToDashboard({
          title: designTitle.trim() || "طرح جدید",
          frontImage,
          backImage: backImage ?? undefined,
        });
        setCurrentDesignId(res.designId);
        setShowOrderModal(true);
      } catch (error: any) {
        showSnackbar("عملیات با خطا مواجه شد", "error");
      }
    } else {
      setShowOrderModal(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {generatedImages.map((image) => (
          <article
            key={image.id}
            className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 p-3 shadow-soft-primary backdrop-blur-xl"
          >
            <img
              src={image.src}
              alt={image.title}
              className="aspect-[4/5] w-full rounded-[1.55rem] object-cover"
            />
            <div className="flex items-center justify-between px-2 py-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {image.title}
                </h3>
              </div>
              <button
                onClick={() =>
                  handleDownload(image.src, `${image.id}-design.png`)
                }
                className="flex size-9 items-center justify-center rounded-full bg-white/80 text-primary-500"
              >
                <HiOutlineArrowDownTray className="size-5" />
              </button>
            </div>
          </article>
        ))}

        {generatedImages.length === 1 && !hasBack && (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-rose-200 bg-white/45 p-6 text-center backdrop-blur-xl">
            <HiOutlineSparkles className="size-8 text-rose-400 mb-3" />
            <h3 className="text-sm font-semibold text-foreground">
              نمای پشت لباس
            </h3>
            <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
              بر اساس نمای جلو و توضیحات شما، پشت لباس طراحی شود.
            </p>
            <Button
              type="button"
              variant="glass"
              onClick={generateBackView}
              disabled={isGeneratingBack}
              className="mt-5 gap-2"
            >
              {isGeneratingBack ? (
                <>
                  <HiOutlineArrowPath className="size-4 animate-spin" />
                  در حال تولید...
                </>
              ) : (
                <>
                  <HiOutlineSparkles className="size-4" />
                  تولید نمای پشت
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* سه دکمه اصلی */}
      <div className="rounded-[2rem] border border-white/80 bg-white/45 p-4 backdrop-blur-xl space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <HiOutlineSparkles className="size-5 text-primary-500" />
          مدیریت طرح
        </h3>

        <div className="space-y-2">
          <label
            htmlFor="design-title"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          >
            <HiOutlinePencilSquare className="size-4" />
            نام طرح
          </label>
          <Input
            id="design-title"
            value={designTitle}
            onChange={(e) => setDesignTitle(e.target.value)}
            placeholder="مثلاً: مانتو تابستانه لینن"
            maxLength={80}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="glass"
            onClick={() => handleSave("dashboard")}
            disabled={isSaving}
            className="flex-1 gap-2"
          >
            <HiOutlineBookmark className="size-5" />
            ذخیره در داشبورد شخصی
          </Button>

          <Button
            variant="glass"
            onClick={() => handleSave("gallery")}
            disabled={isSaving}
            className="flex-1 gap-2"
          >
            <HiOutlineGlobeAlt className="size-5" />
            انتشار در گالری عمومی
          </Button>

          <Button
            variant="glass"
            onClick={handleOrderClick}
            disabled={isSaving}
            className="flex-1 gap-2"
          >
            <HiOutlineShoppingBag className="size-5" />
            ثبت سفارش
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={restart}
          className="mt-2"
        >
          طراحی جدید
        </Button>
      </div>

      {/* مودال ثبت سفارش */}
      {showOrderModal && currentDesignId && (
        <OrderModal
          designId={currentDesignId}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
}

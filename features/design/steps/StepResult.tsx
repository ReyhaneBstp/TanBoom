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
  HiOutlineExclamationTriangle,
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
import { getActionErrorMessage } from "@/shared/utils/getActionErrorMessage";

export function StepResult() {
  const generatedImages = useGenerationStore((s) => s.generatedImages);
  const frontError = useGenerationStore((s) => s.frontError);
  const backError = useGenerationStore((s) => s.backError);
  const { generateBackView, generateFront, isGeneratingFront, isGeneratingBack } =
    useGenerateImage();
  const restart = useStepStore((s) => s.reset);

  const hasBack = generatedImages.some((img) => img.id === "back");

  const [isSaving, setIsSaving] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  const [designTitle, setDesignTitle] = useState("");
  const { showLoading, hideLoading, showSnackbar } = useGlobalStore();

  useEffect(() => {
    const { generatedImages, frontError, isGeneratingFront } =
      useGenerationStore.getState();
    if (generatedImages.length === 0 && !frontError && !isGeneratingFront) {
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
    showLoading(
      action === "dashboard"
        ? "در حال ذخیره طرح در داشبورد..."
        : "در حال انتشار طرح در گالری..."
    );
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
      showSnackbar(
        getActionErrorMessage(
          error,
          action === "dashboard"
            ? "ذخیره‌ی طرح انجام نشد. لطفاً دوباره تلاش کنید؛ اگر مشکل ادامه داشت تصویر را دانلود و بعداً ذخیره کنید."
            : "انتشار طرح انجام نشد. لطفاً دوباره تلاش کنید."
        ),
        "error"
      );
    } finally {
      hideLoading();
      setIsSaving(false);
    }
  };

  const handleOrderClick = async () => {
    if (!currentDesignId && frontImage) {
      setIsSaving(true);
      showLoading("در حال آماده‌سازی سفارش...");
      try {
        const res = await saveDesignToDashboard({
          title: designTitle.trim() || "طرح جدید",
          frontImage,
          backImage: backImage ?? undefined,
        });
        setCurrentDesignId(res.designId);
        setShowOrderModal(true);
      } catch (error: any) {
        showSnackbar(
          getActionErrorMessage(
            error,
            "آماده‌سازی سفارش انجام نشد. لطفاً دوباره روی «ثبت سفارش دوخت» بزنید."
          ),
          "error"
        );
      } finally {
        hideLoading();
        setIsSaving(false);
      }
    } else {
      setShowOrderModal(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {!frontImage && frontError && (
          <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-[2rem] border border-dashed border-rose-300 bg-rose-50/60 p-6 text-center backdrop-blur-xl">
            <span className="flex size-14 items-center justify-center rounded-full bg-rose-100">
              <HiOutlineExclamationTriangle className="size-7 text-rose-500" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              تولید تصویر ناموفق بود
            </h3>
            <p className="mt-1 max-w-[220px] text-xs leading-5 text-muted-foreground">
              مشکلی در تولید تصویر پیش آمد. نگران نباشید، می‌توانید دوباره تلاش
              کنید.
            </p>
            <Button
              type="button"
              onClick={generateFront}
              disabled={isGeneratingFront}
              className="mt-5 gap-2"
            >
              {isGeneratingFront ? (
                <>
                  <HiOutlineArrowPath className="size-4 animate-spin" />
                  در حال تولید...
                </>
              ) : (
                <>
                  <HiOutlineArrowPath className="size-4" />
                  تلاش مجدد
                </>
              )}
            </Button>
          </div>
        )}

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
                className="flex size-9 items-center justify-center rounded-full bg-white/80 text-primary-500 transition-transform hover:scale-110"
              >
                <HiOutlineArrowDownTray className="size-5" />
              </button>
            </div>
          </article>
        ))}

        {frontImage && !hasBack && (
          <div
            className={`flex flex-col items-center justify-center rounded-[2rem] border border-dashed p-6 text-center backdrop-blur-xl ${
              backError
                ? "border-rose-300 bg-rose-50/60"
                : "border-rose-200 bg-white/45"
            }`}
          >
            {backError ? (
              <>
                <span className="flex size-12 items-center justify-center rounded-full bg-rose-100">
                  <HiOutlineExclamationTriangle className="size-6 text-rose-500" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  تولید نمای پشت ناموفق بود
                </h3>
                <p className="mt-1 max-w-[220px] text-xs leading-5 text-muted-foreground">
                  مشکلی پیش آمد؛ لطفاً دوباره تلاش کنید.
                </p>
              </>
            ) : (
              <>
                <HiOutlineSparkles className="mb-3 size-8 text-rose-400" />
                <h3 className="text-sm font-semibold text-foreground">
                  نمای پشت لباس
                </h3>
                <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
                  بر اساس نمای جلو و توضیحات شما، پشت لباس طراحی شود.
                </p>
              </>
            )}
            <Button
              type="button"
              variant={backError ? "default" : "glass"}
              onClick={generateBackView}
              disabled={isGeneratingBack}
              className="mt-5 gap-2"
            >
              {isGeneratingBack ? (
                <>
                  <HiOutlineArrowPath className="size-4 animate-spin" />
                  در حال تولید...
                </>
              ) : backError ? (
                <>
                  <HiOutlineArrowPath className="size-4" />
                  تلاش مجدد
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

      {frontImage && (
        <div className="space-y-5 rounded-[2rem] border border-white/80 bg-white/45 p-5 backdrop-blur-xl">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
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

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => handleSave("dashboard")}
              disabled={isSaving}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-primary-200/70 bg-gradient-to-b from-white/90 to-primary-50/70 px-4 py-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-soft-primary disabled:pointer-events-none disabled:opacity-45"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-transform group-hover:scale-110">
                <HiOutlineBookmark className="size-5" />
              </span>
              <span className="text-sm font-bold text-foreground">
                ذخیره در داشبورد
              </span>
              <span className="text-[11px] leading-4 text-muted-foreground">
                طرح فقط برای خودتان ذخیره می‌شود
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSave("gallery")}
              disabled={isSaving}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-sky-200/70 bg-gradient-to-b from-white/90 to-sky-50/70 px-4 py-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-soft-primary disabled:pointer-events-none disabled:opacity-45"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-transform group-hover:scale-110">
                <HiOutlineGlobeAlt className="size-5" />
              </span>
              <span className="text-sm font-bold text-foreground">
                انتشار در گالری
              </span>
              <span className="text-[11px] leading-4 text-muted-foreground">
                طرح شما برای عموم نمایش داده می‌شود
              </span>
            </button>

            <button
              type="button"
              onClick={handleOrderClick}
              disabled={isSaving}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-rose-200/70 bg-gradient-to-b from-white/90 to-rose-50/70 px-4 py-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-soft-primary disabled:pointer-events-none disabled:opacity-45"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-transform group-hover:scale-110">
                <HiOutlineShoppingBag className="size-5" />
              </span>
              <span className="text-sm font-bold text-foreground">
                ثبت سفارش دوخت
              </span>
              <span className="text-[11px] leading-4 text-muted-foreground">
                طرح شما توسط خیاط دوخته می‌شود
              </span>
            </button>
          </div>

          <Button type="button" variant="ghost" onClick={restart} className="mt-1">
            طراحی جدید
          </Button>
        </div>
      )}


      {!frontImage && frontError && (
        <div className="flex justify-center">
          <Button type="button" variant="ghost" onClick={restart}>
            بازگشت و طراحی جدید
          </Button>
        </div>
      )}


      {showOrderModal && currentDesignId && (
        <OrderModal
          designId={currentDesignId}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { useGenerationStore } from "../../store/generationStore";
import { useGenerateImage } from "../../hooks/useGenerateImage";
import {
  saveDesignToDashboard,
  publishDesignToGallery,
} from "@/server/actions/design-actions";
import { OrderModal } from "./OrderModal";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import { getActionErrorMessage } from "@/shared/utils/getActionErrorMessage";
import { getCurrentUserProfile } from "@/server/actions/get-current-user-profile";
import { isProfileCompleteForOrder } from "@/server/services/user-service";
import { ProfileIncompleteDialog } from "./ProfileIncompleteDialog";
import { useStepResultUrl } from "../../hooks/useStepResultUrl";
import { useResetDesign } from "../../hooks/useResetDesign";
import { useResultDraftStore } from "../../store/resultDraftStore";

type DesignView = "front" | "back";

export function StepResult() {
  const router = useRouter();
  const frontError = useGenerationStore((s) => s.frontError);
  const backError = useGenerationStore((s) => s.backError);
  const {
    generateBackView,
    generateFront,
    isGeneratingFront,
    isGeneratingBack,
  } = useGenerateImage();
  const resetDesign = useResetDesign();
  const { showLoading, hideLoading, showSnackbar } = useGlobalStore();

  const images = useResultDraftStore((s) => s.images);
  const title = useResultDraftStore((s) => s.title);
  const setTitle = useResultDraftStore((s) => s.setTitle);

  const { setDesignTitle: setUrlTitle } = useStepResultUrl();

  const hasBack = images.some((img) => img.id === "back");

  const [isSaving, setIsSaving] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileDialogAction, setProfileDialogAction] = useState<
    "order" | "gallery" | null
  >(null);

  const [activeView, setActiveView] = useState<DesignView>("front");
  const hasAutoSwitchedRef = useRef(false);
  const prevHasBackRef = useRef(hasBack);
  const userNavigatedRef = useRef(false);

  const goToView = (view: DesignView) => {
    userNavigatedRef.current = true;
    setActiveView(view);
  };

  useEffect(() => {
    if (images.length === 0 && !frontError && !isGeneratingFront) {
      generateFront();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, frontError, isGeneratingFront]);

  useEffect(() => {
    const justFinishedGenerating = hasBack && !prevHasBackRef.current;
    prevHasBackRef.current = hasBack;
    if (
      justFinishedGenerating &&
      !isGeneratingBack &&
      !hasAutoSwitchedRef.current &&
      !userNavigatedRef.current
    ) {
      setActiveView("back");
      hasAutoSwitchedRef.current = true;
    }
  }, [hasBack, isGeneratingBack]);

  useEffect(() => {
    getCurrentUserProfile()
      .then((user) => {
        setUserProfile(user);
        setLoadingProfile(false);
      })
      .catch(() => setLoadingProfile(false));
  }, []);

  useEffect(() => {
    setUrlTitle(title);
  }, [title, setUrlTitle]);

  const frontImage = images.find((img) => img.id === "front")?.src;
  const backImage = images.find((img) => img.id === "back")?.src;
  const activeImage = activeView === "front" ? frontImage : backImage ?? frontImage;

  const executePublishToGallery = async () => {
    if (!frontImage) return;
    setIsSaving(true);
    showLoading("در حال انتشار طرح در گالری...");
    const designTitle = title.trim() || "طرح جدید";
    try {
      if (!userProfile?.name?.trim()) {
        showSnackbar(
          "برای نمایش نام شما در گالری، لطفاً نام کاربری خود را در بخش اطلاعات شخصی تکمیل کنید.",
          "info"
        );
      }
      const res = await publishDesignToGallery({
        title: designTitle,
        frontImage,
        backImage: backImage ?? undefined,
      });
      showSnackbar("طرح در گالری عمومی منتشر شد", "success");
      setCurrentDesignId(res.designId);
    } catch (error: any) {
      showSnackbar(
        getActionErrorMessage(
          error,
          "انتشار طرح انجام نشد. لطفاً دوباره تلاش کنید."
        ),
        "error"
      );
    } finally {
      hideLoading();
      setIsSaving(false);
    }
  };

  const initiateGalleryPublish = () => {
    if (!frontImage) return;
    if (!userProfile || !userProfile?.name?.trim()) {
      setProfileDialogAction("gallery");
      setProfileDialogOpen(true);
      return;
    }
    executePublishToGallery();
  };

  const executeOrderFlow = async () => {
    if (!currentDesignId && frontImage) {
      setIsSaving(true);
      showLoading("در حال آماده‌سازی سفارش...");
      try {
        const res = await saveDesignToDashboard({
          title: title.trim() || "طرح جدید",
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

  const initiateOrder = () => {
    if (loadingProfile) {
      showSnackbar("در حال بررسی اطلاعات شما...", "info");
      return;
    }
    if (!userProfile || !isProfileCompleteForOrder(userProfile)) {
      setProfileDialogAction("order");
      setProfileDialogOpen(true);
      return;
    }
    executeOrderFlow();
  };

  const handleSaveToDashboard = async () => {
    if (!frontImage) return;
    setIsSaving(true);
    showLoading("در حال ذخیره طرح در داشبورد...");
    const designTitle = title.trim() || "طرح جدید";
    try {
      const res = await saveDesignToDashboard({
        title: designTitle,
        frontImage,
        backImage: backImage ?? undefined,
      });
      showSnackbar("طرح در داشبورد شما ذخیره شد", "success");
      setCurrentDesignId(res.designId);
    } catch (error: any) {
      showSnackbar(
        getActionErrorMessage(
          error,
          "ذخیره‌ی طرح انجام نشد. لطفاً دوباره تلاش کنید."
        ),
        "error"
      );
    } finally {
      hideLoading();
      setIsSaving(false);
    }
  };

  const handleProfileDialogContinue = () => {
    setProfileDialogOpen(false);
    if (profileDialogAction === "order") {
      executeOrderFlow();
    } else if (profileDialogAction === "gallery") {
      executePublishToGallery();
    }
  };

  const handleProfileDialogComplete = () => {
    setProfileDialogOpen(false);
    router.push("/dashboard?profile=edit");
  };

  const handleBackTabClick = () => {
    if (hasBack) {
      goToView("back");
    } else if (!isGeneratingBack) {
      userNavigatedRef.current = true;
      generateBackView();
    }
  };

  const handleToggleView = () => {
    goToView(activeView === "front" ? "back" : "front");
  };

  const handleRestart = () => {
    hasAutoSwitchedRef.current = false;
    userNavigatedRef.current = false;
    prevHasBackRef.current = false;
    resetDesign();
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-1">
      <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-4 shadow-soft-primary backdrop-blur-xl sm:p-6">
        {frontError && !frontImage ? (
          <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-xl border border-dashed border-rose-300 bg-rose-50/60 p-4 text-center">
            <HiOutlineExclamationTriangle className="mb-2 h-7 w-7 text-rose-500" />
            <p className="text-sm font-semibold text-foreground">
              تولید تصویر ناموفق بود
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              مشکلی پیش آمد، می‌توانید دوباره تلاش کنید.
            </p>
            <Button
              onClick={generateFront}
              disabled={isGeneratingFront}
              className="mt-4 gap-1.5 text-xs"
              size="sm"
            >
              {isGeneratingFront ? (
                <>
                  <HiOutlineArrowPath className="h-4 w-4 animate-spin" />
                  در حال تولید...
                </>
              ) : (
                <>
                  <HiOutlineArrowPath className="h-4 w-4" />
                  تلاش مجدد
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:gap-5">
            <div className="flex-1">
              <div className="mb-3 flex gap-1 rounded-xl bg-muted/30 p-1">
                <button
                  type="button"
                  onClick={() => goToView("front")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    activeView === "front"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  نمای جلو
                </button>
                <button
                  type="button"
                  onClick={handleBackTabClick}
                  disabled={isGeneratingBack}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    activeView === "back" && hasBack
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  } disabled:cursor-wait`}
                >
                  {isGeneratingBack ? (
                    <>
                      <HiOutlineArrowPath className="h-3.5 w-3.5 animate-spin" />
                      در حال تولید...
                    </>
                  ) : hasBack ? (
                    "نمای پشت"
                  ) : backError ? (
                    <>
                      <HiOutlineExclamationTriangle className="h-3.5 w-3.5 text-rose-500" />
                      خطا
                    </>
                  ) : (
                    <>
                      <HiOutlineSparkles className="h-3.5 w-3.5" />
                      تولید نمای پشت
                    </>
                  )}
                </button>
              </div>

              <div className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-muted/10">
                {activeImage ? (
                  <img
                    key={activeView}
                    src={activeImage}
                    alt={activeView === "front" ? "نمای جلو" : "نمای پشت"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    در حال بارگذاری...
                  </div>
                )}

                {activeImage && (
                  <button
                    onClick={() =>
                      handleDownload(activeImage, `${activeView}-design.png`)
                    }
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-primary-500 opacity-0 backdrop-blur transition group-hover:opacity-100"
                    title="دانلود"
                  >
                    <HiOutlineArrowDownTray className="h-4 w-4" />
                  </button>
                )}

                {frontImage && backImage && (
                  <>
                    <button
                      onClick={handleToggleView}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-primary-500 shadow backdrop-blur"
                      aria-label="تغییر نما"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleToggleView}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-primary-500 shadow backdrop-blur"
                      aria-label="تغییر نما"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {frontImage && (
              <div className="mt-4 flex flex-col gap-3 md:mt-0 md:w-44 md:shrink-0">
                <div className="space-y-1.5">
                  <label
                    htmlFor="design-title"
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground"
                  >
                    <HiOutlinePencilSquare className="h-3.5 w-3.5" />
                    نام طرح
                  </label>
                  <Input
                    id="design-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً: مانتو تابستانه"
                    maxLength={80}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 md:flex md:flex-col md:gap-2">
                  <button
                    type="button"
                    onClick={handleSaveToDashboard}
                    disabled={isSaving}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-primary-200/70 bg-gradient-to-b from-white/90 to-primary-50/70 px-2 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary-400 disabled:opacity-45 md:flex-row md:justify-start md:gap-2 md:px-3 md:py-2.5"
                  >
                    <HiOutlineBookmark className="h-5 w-5 text-primary-600" />
                    <div className="text-center md:text-left">
                      <span className="text-[11px] font-bold leading-tight text-foreground md:text-xs">
                        ذخیره
                      </span>
                      <span className="block text-[9px] leading-tight text-muted-foreground md:hidden">
                        در داشبورد
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={initiateGalleryPublish}
                    disabled={isSaving}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-sky-200/70 bg-gradient-to-b from-white/90 to-sky-50/70 px-2 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 disabled:opacity-45 md:flex-row md:justify-start md:gap-2 md:px-3 md:py-2.5"
                  >
                    <HiOutlineGlobeAlt className="h-5 w-5 text-sky-600" />
                    <div className="text-center md:text-left">
                      <span className="text-[11px] font-bold leading-tight text-foreground md:text-xs">
                        انتشار
                      </span>
                      <span className="block text-[9px] leading-tight text-muted-foreground md:hidden">
                        در گالری
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={initiateOrder}
                    disabled={isSaving}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-rose-200/70 bg-gradient-to-b from-white/90 to-rose-50/70 px-2 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-rose-400 disabled:opacity-45 md:flex-row md:justify-start md:gap-2 md:px-3 md:py-2.5"
                  >
                    <HiOutlineShoppingBag className="h-5 w-5 text-rose-600" />
                    <div className="text-center md:text-left">
                      <span className="text-[11px] font-bold leading-tight text-foreground md:text-xs">
                        سفارش
                      </span>
                      <span className="block text-[9px] leading-tight text-muted-foreground md:hidden">
                        دوخت
                      </span>
                    </div>
                  </button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRestart}
                  className="mt-auto gap-1 text-xs md:mt-2"
                >
                  <HiOutlineArrowPath className="h-4 w-4" />
                  طراحی جدید
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {showOrderModal && currentDesignId && (
        <OrderModal
          designId={currentDesignId}
          onClose={() => setShowOrderModal(false)}
        />
      )}

      {profileDialogOpen && (
        <ProfileIncompleteDialog
          open={profileDialogOpen}
          actionType={profileDialogAction!}
          onCompleteProfile={handleProfileDialogComplete}
          onContinue={handleProfileDialogContinue}
          onClose={() => setProfileDialogOpen(false)}
        />
      )}
    </div>
  );
}
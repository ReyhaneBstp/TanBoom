"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Label } from "@/shared/components/Label";
import { updateProfile } from "@/server/actions/update-profile";
import { useGlobalStore } from "@/shared/store/useGlobalStore";

interface ProfileFormProps {
  initialData: {
    name: string;
    fullName: string | null;
    address: string | null;
    postalCode: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const { showSnackbar } = useGlobalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState(initialData.name || "");
  const [fullName, setFullName] = useState(initialData.fullName || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [postalCode, setPostalCode] = useState(initialData.postalCode || "");
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!name.trim()) {
      setErrors({ name: "نام کاربری الزامی است" });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    if (fullName.trim()) formData.append("fullName", fullName.trim());
    if (address.trim()) formData.append("address", address.trim());
    if (postalCode.trim()) formData.append("postalCode", postalCode.trim());

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        showSnackbar("اطلاعات شخصی شما با موفقیت به‌روزرسانی شد.", "success");
        const url = new URL(window.location.href);
        const returnTo = url.searchParams.get("returnTo");
        if (returnTo) {
          router.push(returnTo);
        } else {
          router.refresh();
        }
      } else {
        showSnackbar(result.message || "خطا در به‌روزرسانی.", "error");
      }
    } catch (error) {
      showSnackbar("خطای ناشناخته رخ داد.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="profile-name">نام کاربری (نام نمایشی)</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نامی که در گالری نمایش داده می‌شود"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="profile-fullName">نام و نام خانوادگی</Label>
        <Input
          id="profile-fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="نام و نام خانوادگی کامل"
        />
      </div>

      <div>
        <Label htmlFor="profile-address">آدرس</Label>
        <Input
          id="profile-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="آدرس کامل محل تحویل سفارش"
        />
      </div>

      <div>
        <Label htmlFor="profile-postalCode">کد پستی</Label>
        <Input
          id="profile-postalCode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="کد پستی ده رقمی"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "در حال ذخیره..." : "ذخیره اطلاعات"}
      </Button>
    </form>
  );
}
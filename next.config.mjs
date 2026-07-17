/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // تصاویر تولیدشده به صورت data URL به سرور اکشن‌ها ارسال می‌شوند
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;

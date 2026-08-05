import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/Card";
import Image from "next/image";
import heroImage from "@/assets/landing/login.webp";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md pt-10 sm:pt-14">
      <Card className="mx-auto flex w-full max-w-[400px] flex-col overflow-hidden sm:min-h-[440px]">
        <CardHeader className="border-b border-white/60 bg-white/35 text-center">
          <CardTitle className="text-2xl text-primary-600">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className="flex justify-center ">
            <Image
              src={heroImage}
              alt="تصویر ورود"
              className="w-[430px]"
              priority
            />
          </div>
        </CardHeader>
        <div className="border-t border-gray-200" />
        <CardContent className="flex flex-1 flex-col justify-between p-5 pt-5 sm:p-6 sm:pt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
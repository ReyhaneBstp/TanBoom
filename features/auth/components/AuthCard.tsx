import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/Card";

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
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-white/60 bg-white/35 text-center">
          <CardTitle className="text-2xl text-primary-600">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-5 sm:p-6 sm:pt-6">{children}</CardContent>
      </Card>
    </div>
  );
}

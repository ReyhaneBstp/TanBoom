import { DesignStepper } from "./components/DesignStepper";

export default function DesignerRoute() {
  return     <main className="relative min-h-screen overflow-hidden bg-primary-mesh px-4 py-6 sm:px-6 lg:px-8">
  <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary-100/90 to-transparent" />
  <div className="absolute -left-24 top-16 -z-10 size-72 rounded-full bg-primary-200/40 blur-3xl" />
  <div className="absolute -right-16 bottom-20 -z-10 size-64 rounded-full bg-purple-100/70 blur-3xl" />

  <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col justify-center">
    <DesignStepper />
  </section>
</main>
}
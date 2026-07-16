import GhirasApp from "@/components/GhirasApp";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-4 py-12 sm:py-16">
      <header className="mb-10 flex flex-col items-center gap-3 text-center">
        <Logo className="h-24 w-24 sm:h-28 sm:w-28" />
        <h1 className="font-display text-6xl font-black text-leaf-deep sm:text-7xl">
          غِراس
        </h1>
        <p className="font-text text-xl text-ink-soft sm:text-2xl">
          قصصٌ تُروى، وقيمٌ تُغرس
        </p>
      </header>

      <GhirasApp />

      <footer className="mt-14 text-sm text-ink-soft/70">
        غِراس — قصص تُكتب بحب لأطفالكم
      </footer>
    </main>
  );
}

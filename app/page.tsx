import GhirasApp from "@/components/GhirasApp";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-4 py-10 sm:py-14">
      <header className="mb-9 flex flex-col items-center gap-1 text-center">
        <Logo className="h-28 w-28 sm:h-32 sm:w-32" />
        <h1 className="mt-2 text-5xl font-black tracking-tight text-ink sm:text-6xl">
          غِراس
        </h1>
        <p className="mt-1 text-lg font-medium text-ink-soft sm:text-xl">
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

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 <span className="text-primary font-bold">StreameX</span>. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">DMCA</Link>
        </div>
      </div>
    </footer>
  );
}

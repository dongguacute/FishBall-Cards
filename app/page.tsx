import Image from "next/image";
import { FloatingDock } from "@/components/FloatingDock";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
      <FloatingDock />
    </div>
  );
}

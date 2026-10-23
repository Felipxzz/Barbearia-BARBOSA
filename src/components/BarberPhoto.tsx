import { useState } from "react";
import { Scissors } from "lucide-react";

export default function BarberPhoto({ src, name, className }: { src?: string; name: string; className: string }) {
  const [failedSource, setFailedSource] = useState<string>();
  if (!src || failedSource === src) return <div className={`${className} flex items-center justify-center bg-muted text-primary`} aria-label={name}><Scissors className="w-5 h-5" /></div>;
  return <img src={src} alt={name} className={className} loading="lazy" onError={() => setFailedSource(src)} />;
}
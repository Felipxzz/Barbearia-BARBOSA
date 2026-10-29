
import { Scissors } from "lucide-react";

interface BarberPhotoProps {
  src?: string;
  name: string;
  className: string;
}

export default function BarberPhoto({
  src,
  name,
  className,
}: BarberPhotoProps) {
  if (!src) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-muted text-primary`}
        aria-label={name}
      >
        <Scissors className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Foto de ${name}`}
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}

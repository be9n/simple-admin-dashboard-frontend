import { Loader2Icon } from "lucide-react";

export default function Spinner({ className }: { className?: string }) {
  return <Loader2Icon className={`animate-spin ${className}`} />;
}

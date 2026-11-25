import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clock,
  Download,
  Eye,
  FileText,
  Film,
  Image,
  Landmark,
  Layers,
  Loader2,
  Mic,
  Monitor,
  Music,
  Play,
  Plus,
  Search,
  Smartphone,
  Trash2,
  Upload,
  X,
  type LucideProps,
} from "lucide-react";

export function IconFilm(p: LucideProps) { return <Film strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconClapperboard(p: LucideProps) { return <Clapperboard strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconLandmark(p: LucideProps) { return <Landmark strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconPlay(p: LucideProps) { return <Play strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconSearch(p: LucideProps) { return <Search strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconCalendar(p: LucideProps) { return <Calendar strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconPlus(p: LucideProps) { return <Plus strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconArrowRight(p: LucideProps) { return <ArrowRight strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconChevronLeft(p: LucideProps) { return <ChevronLeft strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconChevronRight(p: LucideProps) { return <ChevronRight strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconChevronDown(p: LucideProps) { return <ChevronDown strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconTrash(p: LucideProps) { return <Trash2 strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconEye(p: LucideProps) { return <Eye strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconLayers(p: LucideProps) { return <Layers strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconMic(p: LucideProps) { return <Mic strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconMusic(p: LucideProps) { return <Music strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconImage(p: LucideProps) { return <Image strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconFileText(p: LucideProps) { return <FileText strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconCheck(p: LucideProps) { return <Check strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconX(p: LucideProps) { return <X strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconUpload(p: LucideProps) { return <Upload strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconMonitor(p: LucideProps) { return <Monitor strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconSmartphone(p: LucideProps) { return <Smartphone strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconAlertCircle(p: LucideProps) { return <AlertCircle strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconClock(p: LucideProps) { return <Clock strokeWidth={1.75} aria-hidden="true" {...p} />; }
export function IconDownload(p: LucideProps) { return <Download strokeWidth={1.75} aria-hidden="true" {...p} />; }

export function IconLoader({ style, ...p }: LucideProps) {
  return (
    <Loader2
      strokeWidth={1.75}
      aria-hidden="true"
      style={{ animation: "spin 1s linear infinite", ...style }}
      {...p}
    />
  );
}

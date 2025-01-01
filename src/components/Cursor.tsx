import { cn } from "@/lib/utils";

type CursorProps = {
  style: React.CSSProperties;
  isActive: boolean;
};

const Cursor = ({ style, isActive }: CursorProps) => {
  return (
    <div
      className={cn(
        "fixed w-[2px] h-[32px] bg-[var(--cursor)] transition-all duration-100 cursor",
        !isActive && "opacity-0"
      )}
      style={style}
    />
  );
};

export default Cursor;

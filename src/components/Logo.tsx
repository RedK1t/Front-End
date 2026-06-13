import { useTheme } from "@/context/ThemeContext";
import iconLight from "@/assets/logo/icon-light.svg";
import iconDark from "@/assets/logo/icon-dark.svg";
import wordmarkLight from "@/assets/logo/wordmark-light.svg";
import wordmarkDark from "@/assets/logo/wordmark-dark.svg";

type LogoProps = {
  /** "icon" = mark only, "wordmark" = mark + RedKit text. */
  variant?: "icon" | "wordmark";
} & React.ImgHTMLAttributes<HTMLImageElement>;

// The "*-light" files are the light-colored (white) logos meant for DARK
// backgrounds; the "*-dark" files are the dark/red logos for LIGHT backgrounds.
export default function Logo({
  variant = "icon",
  alt = "RedKit",
  ...props
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const src =
    variant === "wordmark"
      ? isDark
        ? wordmarkLight
        : wordmarkDark
      : isDark
        ? iconLight
        : iconDark;
  return <img src={src} alt={alt} {...props} />;
}

import { useMemo } from "react";
import katex from "katex";

export function TeX({
  math,
  block = false,
  className = "",
}: {
  math: string;
  block?: boolean;
  className?: string;
}) {
  const html = useMemo(
    () =>
      katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: "ignore",
      }),
    [math, block],
  );
  const Tag = block ? "div" : "span";
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

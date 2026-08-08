/** Blocking head script — runs before paint so the dot never flashes unset/white. */
export const logoDotColorScript = `(function(){var c=["#fbbf24","#0ea5e9","#ef4444","#10b981"];document.documentElement.style.setProperty("--logo-dot",c[Math.floor(Math.random()*c.length)])})();`;

export function LogoDot() {
  return (
    <span className="italic" style={{ color: "var(--logo-dot, #fbbf24)" }}>
      .
    </span>
  );
}

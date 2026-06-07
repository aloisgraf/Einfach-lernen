import Link from "next/link";

const TreeLogo = ({ size = 36 }: { size?: number }) => (
  <svg className="logo-tree" width={size} height={size * (42 / 36)} viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14.5" y="30" width="7" height="11" rx="3" fill="#7C5230" />
    <ellipse cx="18" cy="18" rx="11" ry="13" fill="#2D6A4F" />
    <ellipse cx="10" cy="22" rx="7.5" ry="9" fill="#52B788" />
    <ellipse cx="26" cy="22" rx="7.5" ry="9" fill="#52B788" />
    <ellipse cx="18" cy="27" rx="9" ry="7" fill="#2D6A4F" />
    <ellipse cx="18" cy="10" rx="6" ry="7.5" fill="#3d8a62" />
  </svg>
);

export default function LvHeader() {
  return (
    <header>
      <Link href="/" className="logo-wrap">
        <TreeLogo />
        <div className="logo-text">
          <span className="logo-brand">Lernversum</span>
          <span className="logo-slogan">Wo Lernen einfach wird.</span>
        </div>
      </Link>
      <nav>
        <Link href="/#beratung">Beratung</Link>
        <Link href="/#lernanalyse">Lernstandsanalyse</Link>
        <Link href="/#legasthenie">Legasthenie &amp; Dyskalkulie</Link>
        <Link href="/ueber-mich">Über mich</Link>
        <Link href="/#sommerkurse" className="nav-cta">☀️ Sommerkurse</Link>
      </nav>
    </header>
  );
}

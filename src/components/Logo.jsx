export default function Logo({ full = false }) {
  if (full) return <img className="logo-full" src="/images/logo-full.png" alt="Vastra" />;
  return (
    <span className="logo">
      <img className="logo-mark" src="/images/logo-mark.png" alt="" />
      <span className="logo-text"><b>VASTRA</b><small>Bangalore · India</small></span>
    </span>);
}

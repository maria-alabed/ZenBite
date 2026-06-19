export default function Sparks() {
  return (
    <div className="op-sparks" aria-hidden>
      {[...Array(6)].map((_, i) => (
        <span key={i} className={`op-spark op-spark-${i + 1}`} />
      ))}
    </div>
  );
}
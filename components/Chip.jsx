import clsx from "clsx"

export default function Chip({ index, name, backgroundColor, color, wrongGuessedCount }) {
  const styles = { backgroundColor, color }
  const isLost = wrongGuessedCount > index

  return (
    <span
      className={clsx("chip", isLost && "lost")}
      style={styles}
    >
      {isLost && <span className="chip-skull" aria-hidden="true">💀</span>}
      {name}
    </span>
  )
}

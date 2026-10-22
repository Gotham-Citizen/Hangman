import clsx from "clsx"

export default function Chip({ index, name, backgroundColor, color, wrongGuessedCount }) {
  const styles = { backgroundColor, color }

  return (
    <span
      className={clsx("chip", wrongGuessedCount > index && "lost")}
      style={styles}
    >
      {name}
    </span>
  )
}

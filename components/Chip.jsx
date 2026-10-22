import clsx from "clsx"

export default function Chip({index, name, backgroundColor, color, wrongGuessedCount}) {
  const styles = {
    backgroundColor: backgroundColor,
    color: color
  }

  return (
    <span 
      className={clsx(
        "chip" ,
        (wrongGuessedCount - 1 >= index) && "lost"
      )}
      style={styles} >
        {name}
    </span>
  )
}
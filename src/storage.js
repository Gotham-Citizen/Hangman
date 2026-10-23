export function loadGameState() {
  try {
    const saved = localStorage.getItem('hangmanGameState')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn("Failed to load game state:", e)
  }
  return null
}

export function saveGameState(state) {
  try {
    localStorage.setItem('hangmanGameState', JSON.stringify(state))
  } catch (e) {
    console.warn("Failed to save game state:", e)
  }
}
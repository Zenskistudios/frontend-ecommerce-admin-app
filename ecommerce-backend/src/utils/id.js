// Simple unique id generator (no external dependency)
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

module.exports = { generateId, v4: generateId };

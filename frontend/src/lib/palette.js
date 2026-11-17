export function filterCommands(commands, query) {
  const term = query.trim().toLowerCase()
  if (!term) return commands

  return commands.filter((command) => {
    const haystack = [command.label, command.path, command.description, ...(command.keywords ?? [])]
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
}

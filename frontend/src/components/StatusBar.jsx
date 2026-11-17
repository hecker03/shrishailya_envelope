import './StatusBar.css'

function StatusBar({ branch, sha, built, lastCommit }) {
  const parts = []
  if (branch) parts.push(sha ? `${branch}@${sha}` : branch)
  if (built) parts.push(`built ${built}`)
  if (lastCommit) parts.push(`last commit ${lastCommit}`)

  if (parts.length === 0) {
    return null
  }

  return (
    <footer className="status-bar" aria-label="Repository status">
      <div className="status-bar-inner">
        {parts.map((part, index) => (
          <span key={part} className="status-bar-item">
            {index > 0 ? (
              <span className="status-bar-sep" aria-hidden="true">
                |
              </span>
            ) : null}
            {part}
          </span>
        ))}
      </div>
    </footer>
  )
}

export default StatusBar

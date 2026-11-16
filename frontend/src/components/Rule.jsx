import './Rule.css'

function Rule({ label }) {
  if (!label) {
    return <hr className="rule" />
  }

  return (
    <div className="rule-labeled" role="separator" aria-orientation="horizontal">
      <span className="rule-label">{label}</span>
    </div>
  )
}

export default Rule

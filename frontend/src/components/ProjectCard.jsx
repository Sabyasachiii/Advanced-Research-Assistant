export default function ProjectCard({ project, index, onClick }) {
  return (
    <article className="project-card" onClick={onClick}>
      <div className="project-card-top">
        <div className="project-number">{String(index + 1).padStart(2, "0")}</div>

        <div className="project-status">
          <span />
          ACTIVE
        </div>
      </div>

      <div className="project-core-wrapper">
        <div className="project-core">◇</div>
      </div>

      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description || "No project description available."}</p>
      </div>

      <div className="project-footer">
        <span>AI RESEARCH CORE</span>
        <span className="open-arrow">→</span>
      </div>

      <div className="project-card-corner" />
    </article>
  );
}

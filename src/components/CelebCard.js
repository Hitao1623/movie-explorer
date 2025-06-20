import { Link } from "react-router-dom";
import "../styles/components/CelebCard.css";

// CelebCard component receives one "person" object as prop
export default function CelebCard({ person }) {
  // Compute image URL for celeb profile (fallback if no image)
  const imageUrl = person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : "/default-poster.jpg";

  // Render CelebCard
  return (
    <div key={person.id} className="celeb-card">
      {/* Celeb image (clickable, links to person detail page) */}
      <Link to={`/person/${person.id}`}>
        <img src={imageUrl} alt={person.name} className="celeb-image" />
      </Link>

      {/* Celeb name (clickable link) */}
      <p>
        <Link to={`/person/${person.id}`} className="celeb-name-link">
          {person.name}
        </Link>
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/pages/PersonDetail.css";
import { useNavigate } from "react-router-dom";

export default function PersonDetail() {
  // TMDB API Key (used to call person detail and credits API)
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  // Get person_id from URL params (extracted from route path)
  const { id } = useParams();

  // State: store person detail object
  const [person, setPerson] = useState(null);

  // State: store list of movie credits (known for)
  const [credits, setCredits] = useState([]);

  // State: loading state
  const [loading, setLoading] = useState(true);

  // State: error message (if any)
  const [error, setError] = useState(null);

  // Hook: for programmatic navigation (used by back button)
  const navigate = useNavigate();

  // Effect: fetch person detail & credits when person_id changes
  useEffect(() => {
    const fetchPersonDetail = async () => {
      try {
        // Fetch person detail (biography, image, etc.)
        const resPerson = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`);
        const dataPerson = await resPerson.json();

        // Fetch combined credits
        const resCredits = await fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}`);
        const dataCredits = await resCredits.json();

        // Update state with fetched data
        setPerson(dataPerson);
        setCredits(dataCredits.cast || []);
      } catch (err) {
        console.error("Failed to fetch person detail", err);
        setError("Something went wrong.");
      } finally {
        // Disable loading spinner
        setLoading(false);
      }
    };

    // Trigger fetch
    fetchPersonDetail();
  }, [id]);

  // If still loading
  if (loading) return <p>Loading...</p>;

  // If fetch error
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // If no data found
  if (!person) return <p>No data found.</p>;

  // Construct image URL for person profile (fallback to default)
  const imageUrl = person.profile_path ? `https://image.tmdb.org/t/p/w300${person.profile_path}` : "/default-poster.jpg";

  // Render component
  return (
    <div className="person-detail-container">
      {/* Back button (go back to previous page) */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Header section: image + biography */}
      <div className="person-header">
        {/* Person image */}
        <img src={imageUrl} alt={person.name} className="person-image" />

        {/* Person info block */}
        <div className="person-info">
          <h1>{person.name}</h1>
          <h3>Biography</h3>
          <p className="person-biography">{person.biography || "No biography available."}</p>
        </div>
      </div>

      {/* Known For section (movies only) */}
      <h3>Known For</h3>
      <div className="known-for-list">
        {credits
          .filter((item) => item.media_type === "movie") // movies only
          .filter((item) => item.poster_path) // must have poster
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0)) // sort by popularity
          .slice(0, 10) // limit top 10
          .map((item) => (
            // Link to movie detail page
            <Link key={item.id} to={`/movie/${item.id}`} className="known-for-card">
              <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name} />
              <p>{item.title || item.name}</p>
            </Link>
          ))}
      </div>
    </div>
  );
}

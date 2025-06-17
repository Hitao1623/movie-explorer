import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        if (!res.ok) {
          throw new Error("Movie not found.");
        }
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Load failed", err);
        setError("Failed to load movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!movie) return null;

  const { title, poster_path, release_date = "-", genres, overview, runtime, vote_average, tagline } = movie;

  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "/default-poster.jpg";

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        Back
      </button>

      <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>{title}</h2>

      {tagline && <p style={{ fontStyle: "italic", color: "#777", marginBottom: "10px" }}>{tagline}</p>}

      <div style={{ position: "relative", width: "300px", marginBottom: "20px" }}>
        <img src={imageUrl} alt={`Poster for ${title}`} style={{ width: "100%", borderRadius: "10px" }} />
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <FavoriteButton movie={movie} />
        </div>
      </div>

      <p>
        <strong>Release Date:</strong> {release_date}
      </p>
      <p>
        <strong>Runtime:</strong> {runtime ? `${runtime} mins` : "N/A"}
      </p>
      <p>
        <strong>Rating:</strong> {vote_average ? vote_average.toFixed(1) : "N/A"}
      </p>
      <p>
        <strong>Genres:</strong> {genres?.map((g) => g.name).join(", ") || "N/A"}
      </p>

      <p style={{ marginTop: "10px" }}>{overview}</p>
    </div>
  );
}

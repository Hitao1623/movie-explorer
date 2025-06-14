// src/pages/MovieDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = "dcb6a2332e848860ad8bc86b5ece16bb";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        const data = await res.json();

        if (data.success === false || res.status !== 200) {
          setError("Movie not found.");
        } else {
          setMovie(data);
        }
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

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>{movie.title}</h2>
      <img
        src={imageUrl}
        alt={movie.title}
        style={{ width: "300px", borderRadius: "8px", marginBottom: "20px" }}
      />
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ")}</p>
      <p style={{ marginTop: "10px" }}>{movie.overview}</p>
    </div>
  );
}

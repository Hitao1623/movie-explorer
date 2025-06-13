import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const imgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

  return (
    <div style={{ width: "200px", margin: "10px" }}>
      <Link to={`/movie/${movie.id}`}>
        <img src={imgUrl} alt={movie.title} width="200" />
        <h4>{movie.title}</h4>
      </Link>
    </div>
  );
}

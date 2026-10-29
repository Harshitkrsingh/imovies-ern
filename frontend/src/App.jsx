import { useEffect, useMemo, useState } from "react";
import { Film, Search, UserRound, LogOut, Ticket, ShieldCheck, X, CalendarDays, Clock3, Star, Plus, Trash2, Popcorn, Clapperboard } from "lucide-react";

const API = "https://imovies-ern-1.onrender.com";
const fallbackPoster = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("imovies_user")) || null; } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("imovies_token") || "");
  const [activeTab, setActiveTab] = useState("home");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadMovies() {
    try {
      const response = await fetch(`${API}/movies`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load movies");
      setMovies(data);
    } catch (error) {
      setNotice("Backend se connection nahi ho raha. MongoDB aur backend server start karo.");
    } finally { setLoading(false); }
  }

  async function loadBookings() {
    if (!token) return;
    try {
      const response = await fetch(`${API}/bookings/mine`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (response.ok) setBookings(data);
    } catch { /* Keep the page usable if the server restarts. */ }
  }

  useEffect(() => { loadMovies(); }, []);
  useEffect(() => { if (token) loadBookings(); else setBookings([]); }, [token]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4200);
    return () => clearTimeout(timer);
  }, [notice]);

  const filteredMovies = useMemo(() => movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (genre === "All" || movie.genre === genre);
  }), [movies, search, genre]);

  function handleAuth(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("imovies_token", data.token);
    localStorage.setItem("imovies_user", JSON.stringify(data.user));
    setAuthOpen(false);
    setNotice(`Welcome ${data.user.name}!`);
  }

  function logout() {
    localStorage.removeItem("imovies_token");
    localStorage.removeItem("imovies_user");
    setToken("");
    setUser(null);
    setActiveTab("home");
    setNotice("You have been logged out.");
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <button className="brand" onClick={() => setActiveTab("home")}><span className="brand-icon"><Film size={22}/></span><span>i<span className="brand-red">M</span>ovies</span></button>
        <nav className="nav-links">
          <button className={activeTab === "home" ? "nav-active" : ""} onClick={() => setActiveTab("home")}>Home</button>
          <button className={activeTab === "bookings" ? "nav-active" : ""} onClick={() => { if (!user) { setAuthOpen(true); return; } setActiveTab("bookings"); }}>My Bookings</button>
          {user?.role === "admin" && <button className={activeTab === "admin" ? "nav-active" : ""} onClick={() => setActiveTab("admin")}>Admin</button>}
        </nav>
        <div className="nav-right">
          {user ? <><span className="user-chip"><UserRound size={15}/>{user.name.split(" ")[0]}</span><button className="icon-btn" title="Logout" onClick={logout}><LogOut size={18}/></button></> : <button className="login-btn" onClick={() => { setAuthMode("login"); setAuthOpen(true); }}>Login / Sign up</button>}
        </div>
      </header>

      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")}><X size={15}/></button></div>}

      {activeTab === "home" && <>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow"><span className="live-dot"/> YOUR NEXT MOVIE NIGHT STARTS HERE</div>
            <h1>Stories worth<br/><span>watching.</span></h1>
            <p>Discover the latest blockbusters, pick your seats, and make it a night to remember.</p>
            <button className="primary-btn" onClick={() => document.getElementById("movies")?.scrollIntoView({ behavior: "smooth" })}>Explore movies <span>↗</span></button>
            <div className="hero-stats"><div><strong>{movies.length || "08"}+</strong><small>Movies to explore</small></div><div><strong>4K</strong><small>Big-screen vibes</small></div><div><strong>Easy</strong><small>Secure booking</small></div></div>
          </div>
          <div className="hero-art"><div className="hero-glow"/><div className="ticket ticket-back"><span>IMOVIES</span><Clapperboard size={25}/></div><div className="ticket ticket-front"><div className="ticket-top"><span>ADMIT ONE</span><Popcorn size={24}/></div><div className="ticket-title">MOVIE<br/>NIGHT</div><div className="ticket-line"/><div className="ticket-bottom"><span>GOOD STORIES.<br/>GREAT COMPANY.</span><span className="ticket-stamp">IM</span></div></div><div className="floating-star star-one">✦</div><div className="floating-star star-two">✧</div></div>
        </section>
        <main className="main-content" id="movies">
          <div className="section-heading"><div><div className="eyebrow muted">NOW SHOWING</div><h2>Find your <span>next favourite.</span></h2></div><div className="movie-count">{filteredMovies.length} movies</div></div>
          <div className="filters"><div className="search-box"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search movies..." /></div><div className="genre-pills">{["All", ...new Set(movies.map((m) => m.genre))].map((item) => <button key={item} className={genre === item ? "pill selected" : "pill"} onClick={() => setGenre(item)}>{item}</button>)}</div></div>
          {loading ? <div className="empty-state">Loading movies…</div> : filteredMovies.length ? <div className="movie-grid">{filteredMovies.map((movie) => <MovieCard key={movie._id} movie={movie} onClick={() => setSelectedMovie(movie)} />)}</div> : <div className="empty-state">No movies found. Try another search.</div>}
        </main>
      </>}

      {activeTab === "bookings" && <main className="page-content"><div className="section-heading"><div><div className="eyebrow muted">YOUR TICKETS</div><h2>My <span>Bookings.</span></h2></div></div>{bookings.length ? <div className="booking-list">{bookings.map((b) => <div className="booking-card" key={b._id}><img src={b.movie?.poster || fallbackPoster} onError={(e) => e.currentTarget.src = fallbackPoster} alt=""/><div className="booking-info"><h3>{b.movie?.title || "Movie"}</h3><p><CalendarDays size={15}/> {b.showDate} <Clock3 size={15}/> {b.showTime}</p><p>Seats: {b.seats.join(", ")}</p><small>Booking ID: {b.bookingCode}</small></div><div className="booking-price"><span>Confirmed</span><strong>₹{b.totalAmount}</strong></div></div>)}</div> : <div className="empty-state"><Ticket size={34}/><h3>No bookings yet</h3><p>Pick a movie and book your first show.</p><button className="primary-btn" onClick={() => setActiveTab("home")}>Browse movies</button></div>}</main>}

      {activeTab === "admin" && user?.role === "admin" && <AdminPanel token={token} movies={movies} reload={loadMovies} notify={setNotice}/>}

      <footer><div className="footer-brand"><Film size={20}/> iMovies</div><span>Good stories. Great company.</span><small>© {new Date().getFullYear()} IMovies · Demo booking experience</small></footer>

      {authOpen && <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setAuthOpen(false)} onSuccess={handleAuth} notify={setNotice}/>}
      {selectedMovie && <MovieModal movie={selectedMovie} token={token} user={user} onClose={() => setSelectedMovie(null)} onLogin={() => { setSelectedMovie(null); setAuthOpen(true); }} notify={setNotice} refreshBookings={loadBookings}/>}
    </div>
  );
}

function MovieCard({ movie, onClick }) {
  return <article className="movie-card" onClick={onClick} tabIndex="0" onKeyDown={(e) => e.key === "Enter" && onClick()}><div className="poster-wrap"><img src={movie.poster || fallbackPoster} alt={movie.title} loading="lazy" onError={(e) => e.currentTarget.src = fallbackPoster}/><div className="poster-overlay"><button className="book-now" onClick={(e) => { e.stopPropagation(); onClick(); }}>Book tickets <span>↗</span></button></div><span className="rating"><Star size={13} fill="currentColor"/> {movie.rating}</span></div><div className="movie-meta"><div className="movie-tags"><span>{movie.genre}</span><span>{movie.language}</span></div><h3>{movie.title}</h3><div className="movie-sub"><span>{movie.year} · {movie.duration}</span><strong>₹{movie.price}</strong></div></div></article>;
}

function AuthModal({ mode, setMode, onClose, onSuccess, notify }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const response = await fetch(`${API}/auth/${mode === "login" ? "login" : "signup"}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Authentication failed.");
      onSuccess(data);
    } catch (error) { notify(error.message || "Could not connect to server."); }
    finally { setBusy(false); }
  }

  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="modal auth-modal"><button className="modal-close" onClick={onClose}><X/></button><div className="modal-icon"><Film size={24}/></div><div className="eyebrow muted">{mode === "login" ? "WELCOME BACK" : "JOIN THE CLUB"}</div><h2>{mode === "login" ? "Good to see you." : "Your movie nights start here."}</h2><p className="modal-copy">{mode === "login" ? "Sign in to continue your next big-screen adventure." : "Create an account to book your favourite movies."}</p><form onSubmit={submit} className="form-stack">{mode === "signup" && <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name"/></label>}<label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"/></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" placeholder="At least 6 characters"/></label><button className="primary-btn full-btn" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"} <span>↗</span></button></form><p className="switch-auth">{mode === "login" ? "New to IMovies?" : "Already have an account?"} <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Create account" : "Sign in"}</button></p><small className="admin-hint">Admin demo: register with admin@imovies.com</small></div></div>;
}

function MovieModal({ movie, token, user, onClose, onLogin, notify, refreshBookings }) {
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [time, setTime] = useState(movie.shows?.[0] || "6:30 PM");
  const [taken, setTaken] = useState([]);
  const [seats, setSeats] = useState([]);
  const [busy, setBusy] = useState(false);
  const seatNames = Array.from({ length: 40 }, (_, i) => `${String.fromCharCode(65 + Math.floor(i / 8))}${(i % 8) + 1}`);

  useEffect(() => {
    let active = true;
    fetch(`${API}/bookings/taken?movieId=${movie._id}&showDate=${date}&showTime=${encodeURIComponent(time)}`)
      .then((r) => r.json()).then((data) => { if (active && Array.isArray(data)) setTaken(data); })
      .catch(() => {});
    setSeats([]);
    return () => { active = false; };
  }, [movie._id, date, time]);

  async function book() {
    if (!user || !token) { onLogin(); return; }
    if (!seats.length) { notify("Please select at least one seat."); return; }
    setBusy(true);
    try {
      const response = await fetch(`${API}/bookings`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ movieId: movie._id, showDate: date, showTime: time, seats }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed.");
      notify(`Booking confirmed! Your code is ${data.bookingCode}`);
      await refreshBookings();
      onClose();
    } catch (error) { notify(error.message || "Booking failed."); }
    finally { setBusy(false); }
  }

  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="modal movie-modal"><button className="modal-close" onClick={onClose}><X/></button><div className="detail-top"><img src={movie.poster || fallbackPoster} onError={(e) => e.currentTarget.src = fallbackPoster} alt={movie.title}/><div className="detail-info"><div className="eyebrow muted">NOW SHOWING</div><h2>{movie.title}</h2><p className="detail-tags">{movie.genre} · {movie.language} · {movie.duration}</p><div className="detail-rating"><Star size={16} fill="currentColor"/> {movie.rating} <span>· {movie.year}</span></div><p>{movie.description}</p><strong className="detail-price">₹{movie.price} <small>/ seat</small></strong></div></div><div className="booking-section"><div className="booking-step"><span className="step-number">01</span><div><h3>Choose your show</h3><p>Select a date and a show time.</p></div></div><div className="date-time-row"><label>Show date<input type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={(e) => setDate(e.target.value)} /></label><label>Show time<select value={time} onChange={(e) => setTime(e.target.value)}>{(movie.shows || ["6:30 PM"]).map((s) => <option key={s}>{s}</option>)}</select></label></div><div className="booking-step"><span className="step-number">02</span><div><h3>Pick your seats</h3><p>Click to select seats. Grey seats are already booked.</p></div></div><div className="screen-label"><span/> SCREEN THIS WAY <span/></div><div className="seat-grid">{seatNames.map((seat) => <button key={seat} disabled={taken.includes(seat)} className={`seat ${taken.includes(seat) ? "taken" : ""} ${seats.includes(seat) ? "chosen" : ""}`} onClick={() => setSeats((old) => old.includes(seat) ? old.filter((s) => s !== seat) : [...old, seat])}>{seat}</button>)}</div><div className="seat-legend"><span><i className="legend-available"/> Available</span><span><i className="legend-selected"/> Selected</span><span><i className="legend-taken"/> Booked</span></div><div className="booking-total"><div><small>{seats.length} seat(s) selected</small><strong>₹{seats.length * movie.price}</strong></div><button className="primary-btn" disabled={busy} onClick={book}>{busy ? "Booking…" : user ? "Confirm booking" : "Login to book"} <span>↗</span></button></div></div></div></div>;
}

function AdminPanel({ token, movies, reload, notify }) {
  const [form, setForm] = useState({ title: "", genre: "Action", language: "Hindi", duration: "2h 00m", rating: "8.0", year: String(new Date().getFullYear()), poster: "", description: "", price: "180" });
  const [busy, setBusy] = useState(false);

  async function addMovie(e) {
    e.preventDefault(); setBusy(true);
    try {
      const response = await fetch(`${API}/movies`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not add movie.");
      notify("Movie added successfully.");
      setForm({ title: "", genre: "Action", language: "Hindi", duration: "2h 00m", rating: "8.0", year: String(new Date().getFullYear()), poster: "", description: "", price: "180" });
      reload();
    } catch (error) { notify(error.message); }
    finally { setBusy(false); }
  }

  async function deleteMovie(id) {
    if (!confirm("Delete this movie?")) return;
    try {
      const response = await fetch(`${API}/movies/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete movie.");
      notify("Movie deleted."); reload();
    } catch (error) { notify(error.message); }
  }

  return <main className="page-content"><div className="section-heading"><div><div className="eyebrow muted"><ShieldCheck size={13} style={{display:"inline",verticalAlign:"middle"}}/> ADMIN WORKSPACE</div><h2>Manage <span>movies.</span></h2></div></div><div className="admin-layout"><form className="admin-form" onSubmit={addMovie}><h3><Plus size={18}/> Add a movie</h3>{[["title","Movie title"],["poster","Poster image URL"],["duration","Duration"],["description","Short description"]].map(([key,label]) => <label key={key}>{label}<input required={key === "title"} value={form[key]} onChange={(e) => setForm({...form,[key]:e.target.value})} placeholder={label}/></label>)}<div className="admin-form-row"><label>Genre<select value={form.genre} onChange={(e) => setForm({...form,genre:e.target.value})}>{["Action","Drama","Sci-Fi","Comedy","Fantasy","Horror","Romance"].map((g)=><option key={g}>{g}</option>)}</select></label><label>Language<select value={form.language} onChange={(e) => setForm({...form,language:e.target.value})}><option>Hindi</option><option>English</option><option>Telugu</option><option>Tamil</option></select></label></div><div className="admin-form-row"><label>Rating<input type="number" min="0" max="10" step=".1" value={form.rating} onChange={(e)=>setForm({...form,rating:e.target.value})}/></label><label>Price (₹)<input type="number" min="1" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/></label></div><button className="primary-btn full-btn" disabled={busy}>{busy ? "Adding…" : "Add movie"} <Plus size={16}/></button></form><div className="admin-movie-list"><h3>Current movies <span>{movies.length}</span></h3>{movies.map((movie)=><div className="admin-movie-row" key={movie._id}><img src={movie.poster || fallbackPoster} onError={(e)=>e.currentTarget.src=fallbackPoster} alt=""/><div><strong>{movie.title}</strong><small>{movie.genre} · ₹{movie.price}</small></div><button className="delete-btn" onClick={()=>deleteMovie(movie._id)} title="Delete movie"><Trash2 size={17}/></button></div>)}</div></div></main>;
}

export default App;

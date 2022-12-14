import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Youtube from 'react-youtube'
import './App.css'

function App() {
  /* Setting the state of the app. */
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '19eeb79824e73188417a3488a1133fbe'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const IMAGE_URL = 'https://image.tmdb.org/t/p/original'


  /* Setting the state of the app. */
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [trailer, setTrailer] = useState(null)
  const [movie, setMovie] = useState({ title: "Loading Movies" })
  const [playing, setPlaying] = useState(false)

  
  /**
   * It fetches movies from the API and sets the state of the movies and movie variables
   * @param searchKey - The search keyword
   */
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover"
    const { data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results)
    setMovie(results[0])

    if(results.length){
      await fetchMovie(results[0].id)
    }
  }

  /**
   * We are fetching the movie data from the API and then we are checking if the movie has a trailer.
   * If it does, we are setting the trailer to the official trailer. If it doesn't, we are setting the
   * trailer to the first trailer in the list
   * @param id - The id of the movie we want to fetch
   */
  const fetchMovie= async(id) => {
    const {data} = await axios.get(`${API_URL}/movies/${id}`, {
      params:{
        api_key: API_KEY,
        append_to_response: "videos"
      }
    })
    if(data.videos && data.videos.results){
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  }

  const selectMovie = async(movie) => {
    fetchMovie(movie.id)
    setMovie(movie)
    window.scrollTo(0,0)
  }

  /**
   * The useEffect hook is used to fetch the movies when the app component mounts and also call the
   * fetchMovies function whenever the searchKey value changes
   * @param e - the event object
   */
  const searchMovies = (e) =>{
    e.preventDefault();
    fetchMovies(searchKey);
  } 
  useEffect(()=>{
    fetchMovies();
  },[])

  /* Returning the JSX code that will be rendered in the browser. */
  return (
    <div>
    <h2 className='text-center mt-5 mb-5'>Trailer Movies</h2>
    {/* Buscador */}
      <from className='container mb-4' onSubmit={searchMovies}>
        <input type="text" placeholder='search' onChange={(e)=> setSearchKey(e.target.value)}/>
        <button className='btn btn-primary'>Search</button>
      </from>
      {/* Aqui va el contenedor reproductor del trailer */}

      {/* contenedor para previsualizar  */}
      {/* <div>
        <div
          className="viewtrailer"
          style={{
            backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
          }}
        >
          
          

          <div className="container">

            
            
            <button className="boton">Play Trailer</button>
            <h1 className="text-white">{movie.title}</h1>
            {movie.overview ? (
              <p className="text-white">{movie.overview}</p>
            ) : null}
          </div>
        </div>
      </div> */}

      {/* esto es por prueba */}
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <Youtube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* contenedor de posters de peliculas */}
      <div className='container mt-3'>
        <div className='row'>
        {movies.map((movie)=>(
          <div key={movie.id} className="col-md-4 mb-3" onClick={()=> selectMovie(movie)}>
            <img src={`${IMAGE_URL + movie.poster_path}`} alt="URL_IMAGE" height={600} width="100%"/>
            <h4 className='text-center'>{movie.title}</h4>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

/* Exporting the App component so that it can be imported in other files. */
export default App;

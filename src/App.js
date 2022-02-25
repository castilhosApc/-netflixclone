import React, { useEffect, useState } from "react";
import "./App.css"
import tmdb, { getMovieInfo } from "./tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      const list = await tmdb.getHomeList();
      setMovieList(list);
      
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random()*(originals[0].items.results.length -1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await tmdb.getMovieInfo(chosen.id)
      setFeaturedData(chosenInfo);
    }

    loadAll();
    
  }, []); /* Quando carregar a tela vai acontecer essa o que estiver aqui */

  useEffect(() => {
    const scrollListener = () =>{
      if (window.scrollY > 35){
        setBlackHeader(true) ;
      }else{
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])
  
  
  return (
    <div className="page">

      <Header black={blackHeader}></Header>

      { featuredData &&
      <FeaturedMovie item={featuredData}/>
      }
      <section className="lists">
        {movieList.map((item, key)=>(
         <MovieRow key={key} title={item.title} items={item.items}></MovieRow>
        ))}
      </section>

      <footer>
        Feito por Matheus Castilhos<br/>
        Direitos de imagem para a Netflix<br/>
        Informações pegas do site Tmdb.org
      </footer>
      { movieList.length < 0 && 
        <div className="loading">
          <img src='https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif' />
        </div>
      }
    </div>
  )
}

// import Credentials from './credential.json' assert { type: `json` }
import * as Credentials from './credential.json';
import useHttp from '../hooks/http.hook';

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&apikey=${Credentials.publick_key}`);
    return res.data.results.map(_transformCharacter);
  }

  const getAllComics = async (offset = 0) => {
    const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&apikey=${Credentials.publick_key}`);
    return res.data.results.map(_transformComics);
  }

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?apikey=${Credentials.publick_key}`);
    return _transformCharacter(res.data.results[0]);
  }

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    }
  }

  const _transformComics = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description,
      thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
      url: comic.urls[0].url,
      price: comic.prices[0].price
    }
  }
  return { loading, error, getAllCharacters, getCharacter, getAllComics, clearError }
}

export default useMarvelService;
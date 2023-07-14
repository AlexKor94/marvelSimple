// import Credentials from './credential.json' assert { type: `json` }
import * as Credentials from './credential.json';

class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';

  getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status} `);
    }

    return await res.json();
  }

  getAllCharacters = () => {
    return this.getResource(`${this._apiBase}characters?limit=9&offset=210&apikey=${Credentials.publick_key}
`);
  }

  getCharacter = (id) => {
    return this.getResource(`${this._apiBase}characters/${id}?apikey=${Credentials.publick_key}
`);
  }
}

export default MarvelService;
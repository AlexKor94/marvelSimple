
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Helmet from 'react-helmet';

import './singleCharacterPage.scss';

const SingleCharacterPage = (props) => {
  const character = useLocation().state;
  useEffect(() => console.log(character), []);

  let imgStyle = { 'objectFit': 'cover' };
  if (character.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
    imgStyle = { 'objectFit': 'unset' };
  }

  return (
    <div className='single__character'>
      <Helmet>
        <meta
          name="description"
          content={`${character.name} from comic`}
        />
        <title>{character.name}</title>
      </Helmet>
      <div className="single__character-img">
        <img src={character.thumbnail} alt={character.name} style={imgStyle} />
      </div>
      <div className="single__character-about">
        <h1 className="single__characte-title">{character.name}</h1>
        <div className="single__characte-description">{character.description}</div>
      </div>
    </div>
  )
}

export default SingleCharacterPage;
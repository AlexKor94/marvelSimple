// control point
import { useEffect, useState } from 'react';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import PropTypes from 'prop-types';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const { getCharacter, clearError, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {

        const { charId } = props;

        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )

}

const View = ({ data }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = data;

    const missComics = comics.length === 0 ? "Sorry, but I don't find any comics with this character" : null;

    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'unset' };
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description === "" ? "Sorry description is empty" : description}
            </div>
            <div className="char__comics">Comics:</div>
            {missComics}
            <ul className="char__comics-list">
                {
                    comics.map((item, i) => {
                        if (i > 9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}


CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;
// control point
import { useEffect, useState } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

import PropTypes from 'prop-types';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const { loading, error, getCharacter, clearError, process, setProcess } = useMarvelService();

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
        // console.log(char);
        setChar(char);
    }

    const setContent = (process, char) => {
        // console.log(process, char);
        switch (process) {
            case 'waiting':
                return <Skeleton />
            case 'loading':
                return <Spinner />
            case 'confirmed':
                return <View char={char} />
            case 'error':
                return <ErrorMessage />
            default:
                throw new Error('Unexpected process state')
        }
    }

    // const skeleton = char || loading || error ? null : <Skeleton />;
    // const errorMessage = error ? <ErrorMessage /> : null;
    // const spiner = loading ? <Spinner /> : null;
    // const content = !(loading || error || !char) ? <View char={char} /> : null;
    // console.log(char);
    return (
        <div className="char__info">
            {setContent(process, char)}
            {/* {skeleton}
            {errorMessage}
            {spiner}
            {content} */}
        </div>
    )

}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;

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
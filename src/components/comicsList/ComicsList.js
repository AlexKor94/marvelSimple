
import { useState, useEffect, useRef } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = (props) => {
    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [offset, setOffset] = useState(0);

    const { loading, error, getAllComics, clearError } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onLoaded);
    }


    const onLoaded = (res) => {
        let ended = false;

        if (res.length < 8) {
            ended = true;
        }

        setComics(comics => [...comics, ...res]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);

    }

    const itemsRef = useRef([]);

    const focusOnItem = (id) => {
        if (id < itemsRef.current.length && id > -1) {
            itemsRef.current[id].focus();
        }

    }

    function createComics(comics) {
        const items = comics.map((comic, i) => {

            let imgStyle = { 'objectFit': 'cover' };
            if (comic.thumbnail.indexOf('image_not_available') > -1) {
                imgStyle = { 'objectFit': 'unset' };
            }

            const onKeyPress = (e) => {
                if (e.key === '') {
                    focusOnItem(i);
                } else if (e.key === 'ArrowRight') {
                    focusOnItem(i + 1);
                } else if (e.key === 'ArrowLeft') {
                    focusOnItem(i - 1);
                } else if (e.key === 'ArrowUp') {
                    focusOnItem(i - 4);
                } else if (e.key === 'ArrowDown') {
                    focusOnItem(i + 4);
                }
            }

            return (
                <li
                    className="comics__item"
                    tabIndex={0}
                    key={i}
                    ref={el => itemsRef.current[i] = el}
                    onKeyDown={(e) => onKeyPress(e)}>
                    <a href={comic.url}>
                        <img src={comic.thumbnail} alt={comic.title} className="comics__item-img" style={imgStyle} />
                        <div className="comics__item-name">{comic.title}</div>
                        <div className="comics__item-price">{comic.price ? comic.price + '$' : 'NOT AVAILABLE'}</div>
                    </a>
                </li>

            )
        });

        return items;
    }

    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const err = error ? <ErrorMessage /> : null;
    return (

        <div className="comics__list">
            {err}
            {spinner}
            <ul className="comics__grid">
                {createComics(comics)}
            </ul>
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': comicsEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}>
                <div className="inner">{newItemLoading ? 'Loading' : 'load more'}</div>
            </button>
        </div>
    )
}

export default ComicsList;
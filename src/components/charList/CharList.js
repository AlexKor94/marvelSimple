// Логіка має бути наступна:

// 1. При зміні фокусу картка виділяється.Стандартне виділення потрібно замінити на більш виразне.
// 2. При натискані ENTER або кліком лівою кнопкою миші потрібно додавати до картки класс "char__item_selected", картка має завантажитись з права.
// 3. У блоці карток користувачу надати можливість змінювати фокус не лише клавішою TAB, а і стрілками.

import { useState, useEffect, useRef } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import PropTypes from 'prop-types';
import './charList.scss';

const CharList = (props) => {

    const [characters, setCharacters] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(res => {
                onLoaded(res);
            });

    }

    const onLoaded = (res) => {
        let ended = false;
        if (res.length < 9) {
            ended = true;
        }

        setCharacters(characters => [...characters, ...res]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemsRef = useRef([]);

    const focusOnItem = (id) => {
        itemsRef.current.forEach(item => {
            item.classList.remove('char__item_selected')
        });
        if (id < itemsRef.current.length && id > -1) {
            itemsRef.current[id].focus();
        }

    }

    function createCards(characters, onCharSelected) {
        const items = characters.map((character, i) => {

            let imgStyle = { 'objectFit': 'cover' };
            if (character.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                < li
                    tabIndex={0}
                    className="char__item"
                    key={character.id}
                    ref={el => itemsRef.current[i] = el}
                    onClick={() => {
                        onCharSelected(character.id);
                        focusOnItem(i);
                        itemsRef.current[i].classList.add('char__item_selected');
                    }}
                    onKeyDown={(e) => {
                        if (e.key === '' || e.key === 'Enter') {
                            props.onCharSelected(character.id);
                            focusOnItem(i);
                            itemsRef.current[i].classList.add('char__item_selected');
                        } else if (e.key === 'ArrowRight') {
                            focusOnItem(i + 1);
                        } else if (e.key === 'ArrowLeft') {
                            focusOnItem(i - 1);
                        } else if (e.key === 'ArrowUp') {
                            focusOnItem(i - 3);
                        } else if (e.key === 'ArrowDown') {
                            focusOnItem(i + 3);
                        }
                    }}>
                    <img
                        src={character.thumbnail}
                        alt={character.name}
                        style={imgStyle}
                    />
                    <div className="char__name">{character.name}</div>
                </li >
            )
        });

        return items;
    }


    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const err = error ? <ErrorMessage /> : null;
    return (
        <div className="char__list">
            {err}
            {spinner}
            <ul className="char__grid">
                {createCards(characters, props.onCharSelected)}
            </ul>
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': charEnded ? "none" : "block" }}
                onClick={() => onRequest(offset)}>
                <div className="inner">{newItemLoading ? 'Loading' : 'load more'}</div>
            </button>
        </div>
    );

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
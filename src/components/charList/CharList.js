// Логіка має бути наступна:

// 1. При зміні фокусу картка виділяється.Стандартне виділення потрібно замінити на більш виразне.
// 2. При натискані ENTER або кліком лівою кнопкою миші потрібно додавати до картки класс "char__item_selected", картка має завантажитись з права.
// 3. У блоці карток користувачу надати можливість змінювати фокус не лише клавішою TAB, а і стрілками.


import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import PropTypes from 'prop-types';
import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

//<li className="char__item char__item_selected">

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        err: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onLoading();
        this.marvelService.getAllCharacters(offset)
            .then(res => {
                this.onLoaded(res);
            })
            .catch(err => this.onError());
    }

    onLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onLoaded(res) {
        let ended = false;
        if (res.length < 9) {
            ended = true;
        }

        this.setState(({ offset, characters }) => ({
            characters: [...characters, ...res],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError() {
        this.setState({
            loading: false,
            err: true
        })
    }

    itemsRef = [];

    setRef = (ref) => {
        this.itemsRef.push(ref);
    }

    focusOnItem = (id) => {
        this.itemsRef.forEach(item => item.classList.remove('char__item_selected'));
        if (id < this.itemsRef.length && id > -1) {
            this.itemsRef[id].classList.add('char__item_selected');
            this.itemsRef[id].focus();
        }

    }

    createCards(characters, onCharSelected) {
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
                    ref={this.setRef}
                    onClick={() => {
                        onCharSelected(character.id);
                        this.focusOnItem(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === '' || e.key === 'Enter') {
                            this.props.onCharSelected(character.id);
                            this.focusOnItem(i);
                        } else if (e.key === 'ArrowRight') {
                            this.focusOnItem(i + 1);
                        } else if (e.key === 'ArrowLeft') {
                            this.focusOnItem(i - 1);
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

    render() {
        const { characters, loading, err, offset, newItemLoading, charEnded } = this.state;
        const spinner = loading ? <Spinner /> : null;
        const error = err ? <ErrorMessage /> : null;
        return (
            <div className="char__list">
                {error}
                {spinner}
                <ul className="char__grid">
                    {this.createCards(characters, this.props.onCharSelected)}
                </ul>
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ 'display': charEnded ? "none" : "block" }}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">{newItemLoading ? 'Loading' : 'load more'}</div>
                </button>
            </div>
        );
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
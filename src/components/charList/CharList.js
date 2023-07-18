import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

//<li className="char__item char__item_selected">

class CharList extends Component {

    state = {
        characters: [],
        loading: true,
        err: false,
        newItemLoading: false,
        offset: 1548,
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

    render() {
        const { characters, loading, err, offset, newItemLoading, charEnded } = this.state;
        const spinner = loading ? <Spinner /> : null;
        const error = err ? <ErrorMessage /> : null;
        return (
            <div className="char__list">
                {error}
                {spinner}
                <ul className="char__grid">
                    <CreateCards characters={characters} onCharSelected={this.props.onCharSelected} />
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


const CreateCards = ({ characters, onCharSelected }) => {
    const items = characters.map(character => {

        let imgStyle = { 'objectFit': 'cover' };
        if (character.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = { 'objectFit': 'unset' };
        }

        return (
            < li className="char__item" key={character.id} onClick={() => onCharSelected(character.id)}>
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

export default CharList;
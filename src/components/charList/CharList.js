import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

//<li className="char__item char__item_selected">

class CharList extends Component {

    state = {
        characters: []
    }

    componentDidMount() {
        const marvelService = new MarvelService();
        marvelService.getAllCharacters().then(res => {
            this.setState({
                characters: res
            })
        });
    }

    render() {
        return (
            <div className="char__list">
                <ul className="char__grid">
                    <CreateCards characters={this.state.characters} />
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}


const CreateCards = ({ characters }) => {
    const items = characters.map(character => {

        let imgStyle = { 'objectFit': 'cover' };
        if (character.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = { 'objectFit': 'unset' };
        }

        return (
            < li className="char__item" key={character.id}>
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
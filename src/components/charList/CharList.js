import './charList.scss';
import { Component } from "react";
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

class CharList extends Component{
    
    state = {
        characters: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charactersEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharactersListLoading();
        this.marvelService.getAllCharacters(offset)
        .then(this.onCharactersLoaded)
        .catch(this.onError)
    }

    onCharactersListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharactersLoaded = (newCharacters) => {

        let isEnded = false;
        if(newCharacters.length < 9) {
            isEnded = true;
        }



        this.setState(({characters, offset}) => (
            {
                characters: [...characters, ...newCharacters],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
            }
        ))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    renderItems(arr) {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    onClick={() => this.props.onCharacterSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    render() {

        const {characters, loading, error, offset, newItemLoading, charactersEnded} = this.state;

        const items = this.renderItems(characters);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                    {errorMessage}
                    {spinner}
                    {content}
                <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charactersEnded? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;
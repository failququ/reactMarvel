

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = '5d90fb362dc0e9496e056f8d1699ac16';

    getResource = async (url) => {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&apikey=${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?&apikey=${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (character) => {
        return {
                    id: character.id,
                    name: character.name,
                    description:character.description,
                    thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
                    homepage: character.urls[0].url,
                    wiki: character.urls[1].url,
                    comics: character.comics.items
        }
    }
}

export default MarvelService;
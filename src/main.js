import {
    getUniqueRandomNumbers,
    typeWriteEffect
} from './utils/utils.js'

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


// html elements
let articles = $$('article');
const heading1 = $('h1');
const pokedexBtn = $('.pokedex-btn');
const favBtn = $('.fav-btn');
const overlay = $$('.overlay');
const blurSpinner = $('.blur-spinner');
const loadingSpinner = $('.loading-spinner');
const addToFav = $$('.btn-svg');
const counterFav = $('.counter-fav');
const search = $('.search');
const emptyFavList = $('.fav-items-empty');
const favListAlert = $('.animated-text');
const pokedexTextAlert = $('.empty-list-message-pokedex');
const updateCounter = (operation) => {
    const currentNum = Number(counterFav.textContent);
    if(operation === 'add'){
        counterFav.textContent = currentNum + 1;
    } else {
        counterFav.textContent = currentNum - 1;
    }
}
const grid = $('.grid');
const MODES = {
    shuffle: 'shuffle',
    favorite: 'favorite'
}

// observer
let observer;

// flag searcher
let isSearching = false;

// reset timeout
let hideTimeout;

// favortite pokemons list
let favPokemonList = [];

search.addEventListener('input', (e)=> {
    if(!isSearching && e.target.value.length > 0){
        isSearching = true;
        articles = $$('article');
    } else if(isSearching && e.target.value.length === 0) {
        isSearching = false;
    }
    const inputValue = e.target.value.toUpperCase();
    const articlesCopy = Array.from(articles);
    const names = articlesCopy.map(article => article.querySelector('.text-name').textContent);
    const filteredName = names.filter(name => name.startsWith(inputValue));

    articles.forEach(article => {
        const articleName = article.querySelector('.text-name').textContent;
        if(!filteredName.includes(articleName)){
            article.classList.add('hidden');
        } else {
            article.classList.remove('hidden');
        }
    })
})

function searchPokemon(event){
    articles = $$('article');
    const eventLength = event.target.value.length
    const pokemonNames = Array.from(articles).map(article => article.querySelector('.text-name'));
    // const matchedArticles = articles.filter((article, index) => {
    //     const pokemonName = article.querySelector('.text-name');
    // })
    return pokemonNames
}

addToFav.forEach(fav => {
    fav.addEventListener('click', (e)=> {
        const article = e.target.closest('article');
        const pokeName = article.querySelector('.text-name').textContent;

        fav.classList.toggle('active-fav');
        if(fav.classList.contains('active-fav')){
            favPokemonList.push(article);
            updateCounter('add');
        } else {
            favPokemonList = favPokemonList.filter(item => {
                const name = item.querySelector('.text-name').textContent;
                name !== pokeName
            });
            updateCounter('minus');
        }

        if(grid.classList.contains(MODES.favorite) && !fav.classList.contains('active-fav')){
            article.remove();
        }
    })
})

grid.addEventListener('click', (e)=> {
    const articles = $$('article');
    if(articles.length === 0){
        emptyFavList.classList.remove('hidden');
        pokedexTextAlert.classList.remove('hidden');
        typeWriteEffect('No Pokémon here… Go on an adventure!', 30, favListAlert);
        favBtn.style.pointerEvents = 'none';
    }
})

favBtn.addEventListener('click', ()=> {
    console.log(grid.classList)

    if(favPokemonList.length === 0){
        emptyFavList.classList.remove('hidden');
        typeWriteEffect('No Pokémon here… Go on an adventure!', 30, favListAlert);
        favBtn.style.pointerEvents = 'none';
        clearTimeout(hideTimeout);

        hideTimeout = setTimeout(() => {
            favBtn.style.pointerEvents = 'auto';
            emptyFavList.classList.add('hidden');
        }, 5000);
        return;
    }
    grid.classList.toggle(MODES.favorite)
    if(grid.classList.contains(MODES.favorite) && favPokemonList.length > 0){
        const articles = $$('article');
        articles.forEach(article => article.remove());
        favPokemonList.forEach(article => grid.prepend(article));        
    } else {
        articles.forEach(article => article.remove())
        createNewArticles(12, grid, blurSpinner);
        observeLastItem();
    }
})

// addToFav.forEach(fav => {
//     fav.addEventListener('click', (e)=> {
//         const favPokemon = pokemonData(e);
//         favPokemonList.push(favPokemon);
//         localStorage.setItem(favPokemon.name, JSON.stringify(favPokemon))
//     })
// })

function pokemonData(e){
    const article = e.target.closest('article');
    console.log(article)
    const pokemonName = article.querySelector('.text-name').textContent;
    const pokemonHeight = article.querySelector('.height').textContent;
    const pokemonWeight = article.querySelector('.weight').textContent;
    const pokemonTypes = article.querySelector('.types').textContent;
    const pokemonAbilities = article.querySelector('.abilities').textContent;
    const pokemonDescription = article.querySelector('p').textContent;
    const pokemonImg = article.querySelector('.img-container .pokemon-img').src;

    const pokemonInfo = {
        name: pokemonName,
        height: pokemonHeight,
        weigh: pokemonWeight,
        types: pokemonTypes,
        abilities: pokemonAbilities,
        description: pokemonDescription,
        img: pokemonImg
    }
    return pokemonInfo
}

function observeLastItem(){
    if(observer) observer.disconnect();
    const grid = $('.grid');
    const lastItem = $('.grid article:last-of-type');

    // el segundo parámetro de IntersectionObserver (observer) hace referencia 
    // a la variable globar observer que he definido antes
    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                console.log('yas mama');
                observer.unobserve(entry.target);
                createNewArticles(5, grid, blurSpinner);
                observe();
            }
        })
    }, {threshold:0.5})

    if (lastItem){
        observer.observe(lastItem);
    }

    function observe(){
        const articles = $$('article');
        const lastArticle = articles[articles.length - 1]
        if(lastArticle){
            observer.observe(lastArticle);
        }
    }
}

// favBtn.addEventListener('click', ()=> {
//     const numberOfFav = favPokemonList.length;
//     console.log(favPokemonList);
//     const articles = $$('.grid article');
//     const articlesToRemove = Math.abs(numberOfFav - articles.length) ;
//     for (let i = 1; i<articlesToRemove; i++){
//         articles[i].remove();
//     }
//    // document.querySelectorAll('.grid article').forEach(art => art.remove());
//     createNewArticles(numberOfFav, grid, blurSpinner);
// })


async function createNewArticles(numElements, parentElement, reference){
    for(let i = 0; i<numElements; i++){
        const newArticle = document.createElement('article');
        newArticle.classList.add('new-article');
        newArticle.innerHTML = `
            <div class="card-wrapper">
                <div class="left-content">
                        <div class="heading-card">
                            <h2><span class="text-name"></span><span class="underlined"></span></h2>
                            <div class="btn-svg" aria-label="Button to add the pokemon to favorite"></div>                   
                        </div>
                        <ul>
                            <li>
                                <h3 class="metres">Altura: <span class="height"></span></h3>
                            </li>
                            <li>
                                <h3 class="kg">Peso: <span class="weight"></span></h3>
                            </li>
                            <li>
                                <h3>Tipo: <span class="types"></span></h3>
                            </li>
                            <li>
                                <h3>Habilidades: <span class="abilities"></span></h3>
                            </li>
                        </ul>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quaerat quia officiis harum</p>
                    </div>
                    <div class="img-container">
                        <div class="background-img" aria-hidden="true"></div>
                        <img src="assets/pikachu.webp" class="pokemon-img" alt="">
                    </div>
                <div class="blur-spinner"></div>
            </div>
        `
        parentElement.insertBefore(newArticle, reference)
    }


    const newArticle = $$('.new-article');
    await updateCardContent(newArticle);
    newArticle.forEach(article => {
        const favBtn = article.querySelector('.btn-svg');
        const blurSpinner = article.querySelector('.blur-spinner');
        blurSpinner.remove();
        article.classList.remove('new-article');

        favBtn.addEventListener('click', ()=> {
        const id = article.id;
        favBtn.classList.toggle('active-fav');
        if(favBtn.classList.contains('active-fav')){
            favPokemonList.push(article);
            updateCounter('add');
        } else {
            favPokemonList = favPokemonList.filter(item => item.id !== id);
            updateCounter('minus');
        }

        if(grid.classList.contains(MODES.favorite) && !favBtn.classList.contains('active-fav')){
            article.remove();
        }
    })
    });

    
}

//url 
const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/';

function deleteFavoriteFromGrid(){
    const articles = $$('article');
    articles.forEach(art => art.remove());
}

pokedexBtn.addEventListener('click', async ()=> {
    pokedexTextAlert.classList.add('hidden');
    emptyFavList.classList.add('hidden');
    if(favPokemonList.length >= 0) {
        deleteFavoriteFromGrid();
        grid.classList.remove(MODES.favorite);
        grid.classList.add(MODES.shuffle);
        createNewArticles(12, grid, blurSpinner);
        observeLastItem();
        return
    }
    if(grid.classList.contains(MODES.favorite) && favPokemonList.length === 0){
        grid.classList.toggle(MODES.shuffle);
        deleteFavoriteFromGrid();
        createNewArticles(12, grid, blurSpinner);
        observeLastItem();
        return
    }
    const articles = $$('article');
    blurSpinner.style.display = 'block';
    loadingSpinner.style.display = 'block';
    await updateCardContent(articles);
    blurSpinner.style.display = 'none';
    loadingSpinner.style.display = 'none';
    overlay.forEach(element => element.style.display = 'none');
})

document.addEventListener('DOMContentLoaded', async ()=> {
    await updateCardContent(articles);
    blurSpinner.style.display = 'none';
    loadingSpinner.style.display = 'none';
    pokedexBtn.classList.add('show');
    observeLastItem();
})

async function getPokemon(id){
    try{
        const res = await fetch(`${pokeApiUrl}${id}`);

        if(!res.ok){
            throw new Error(`Error en la solicitud; ${res.status}`);
        }

        const data = await res.json();
        // console.log(data.name);
        return data;
    } catch (error){
        console.error('Error al obtener el pokemon')
    }
} 

async function updateCardContent(articles, pokemonName = null){
    const numOfArticles = articles.length;
    const randomNumArray = getUniqueRandomNumbers(numOfArticles, 1000);
    let index = 0;
    const pokemonNameList = pokemonName;
    for (let article of articles){
        const pokemon = pokemonName 
            ? await getPokemon(pokemonNameList[index])    
            : await getPokemon(randomNumArray[index]);
        index++
        const selectEl = (element) => article.querySelector(element)
        const name = selectEl('.text-name');
        const underlined = selectEl('.underlined');
        const height = selectEl('.height');
        const weight = selectEl('.weight');
        const imgUrl = selectEl('img');
        const textDescription = selectEl('p');
        const types = selectEl('.types');
        const abilities = selectEl('.abilities');
        const backgroundImg = selectEl('.background-img');
    
        if(pokemon?.name){
            const pokemonTypes = (pokemon.types?.map(t => t.type.name)) || ['sin', 'información'];
            const pokemonAbilities = (pokemon.abilities?.map(a => a.ability.name)) || ['sin', 'información'];

            name.textContent = pokemon.name.toUpperCase();
            height.textContent = parseFloat((pokemon.height * 0.1).toFixed(1));
            weight.textContent = parseFloat((pokemon.weight * 0.1).toFixed(1));
            types.textContent = pokemonTypes.join(', ');
            abilities.textContent = pokemonAbilities.join(', ');
            article.id = randomNumArray[index];

            imgUrl.setAttribute('src', `${pokemon.sprites.other['official-artwork'].front_default}`);

            const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`).then(res => res.json());

            textDescription.textContent = species?.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || 'Description not available';

            if(species?.color.name){
                const color = species.color.name;
                underlined.style.backgroundColor = color === 'white' ? '#e1dedeff' : `${color}`;
                backgroundImg.style.backgroundColor = color === 'white' ? '#e1dedeff' : `${color}`;
            } else {
                underlined.classList.add('default-underlined-color');
            }

        } else {
            overlay.forEach(element => element.style.display = 'block')
        }
    }
}
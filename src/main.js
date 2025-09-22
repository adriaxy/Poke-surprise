import {
    getUniqueRandomNumbers,
    typeWriteEffect
} from './utils/utils.js'

import {
    updateFavoriteListCounter,
    showEmptyFavListMessage,
    removeArticles
} from './utils/dom.js'

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// html elements
let articles = $$('article');
const body = $('body');
const header = $('header');
const grid = $('.grid');

const colorOptions = $$('.grid-color-options button');
const colorPickerBtn = $('.picker-color-btn');
const gridColorOptions = $('.grid-color-options');
const gridColorOptionsWrapper = $('.picker-color-wrapper');

const pokedexBtn = $('.pokedex-btn');
const favBtn = $('.fav-btn');
const addToFav = $$('.btn-svg');

const overlay = $$('.overlay');
const blurSpinner = $('.blur-spinner');
const loadingSpinner = $('.loading-spinner');
const counterFav = $('.counter-fav');

const search = $('.search');
const inputSearch = $('.search-pokemon');

const emptyFavList = $('.fav-items-empty');
const favListAlert = $('.animated-text');
const pokedexTextAlert = $('.empty-list-message-pokedex');

const MODES = {
    shuffle: 'shuffle',
    favorite: 'favorite'
}

// observer
let observer;

// flags
let isSearching = false;
let usingKeyboard = false;
let tabOnColorPicker = false;

// reset timeout
let hideTimeout;

// favortite pokemons list
let favPokemonList = [];

// Search bar
search.addEventListener('input', (e)=> {
    const query = e.target.value.toUpperCase()
    articles = $$('article');

    if(!query){
        articles.forEach(article => article.classList.remove('hidden'))
        return      
    }

    articles.forEach(article => {
        const pokemonName = article.querySelector('.text-name').textContent.toUpperCase();
        article.classList.toggle('hidden', !pokemonName.startsWith(query))
    })
})

window.addEventListener('keydown', (e)=> {
    if(e.key === 'Tab') usingKeyboard = true;
});

window.addEventListener('mousedown', ()=> {
    usingKeyboard = false;
});

inputSearch.addEventListener('focus', ()=> {
    if(usingKeyboard){
        inputSearch.setAttribute('data-focus-method', 'key');
    } else {
        inputSearch.removeAttribute('data-focus-method');
    }
})

inputSearch.addEventListener('blur', ()=> {
    inputSearch.removeAttribute('data-focus-method');
})

// Color picker 
colorPickerBtn.addEventListener('click', ()=> {
    gridColorOptions.classList.toggle('hidden');
    colorPickerBtn.classList.toggle('active');
})

colorOptions.forEach(color => {
    color.addEventListener('click', (e) => {
        colorOptions.forEach(color => {
            color.classList.remove('selected');
        })
        e.target.classList.add('selected');
        const colorName = e.target.dataset.color;
        body.style.backgroundColor = `var(--${colorName})`
        header.style.backgroundColor = `var(--${colorName})`
    })
})

body.addEventListener('click', (e) => {
    const elementClicked = e.target.closest('.picker-color-wrapper') || e.target.closest('.grid-color-options');
    if(!elementClicked){
        gridColorOptions.classList.add('hidden');
    }
})

// Add to favorite (card's button)
addToFav.forEach(favBtn => {
    favBtn.addEventListener('click', (e)=> {
        const article = e.target.closest('article');
        const pokeName = article.querySelector('.text-name').textContent;

        favBtn.classList.toggle('active-fav');
        if(favBtn.classList.contains('active-fav')){
            favPokemonList.push(article);
            updateFavoriteListCounter(true, counterFav);
        } else {
            favPokemonList = favPokemonList.filter(item => {
                const name = item.querySelector('.text-name').textContent;
                return name !== pokeName
            });
            updateFavoriteListCounter(false, counterFav);
        }

        if(grid.classList.contains(MODES.favorite) && !favBtn.classList.contains('active-fav')){
            article.remove();
        }
    })
})

// Favorite btn to see favorite list
favBtn.addEventListener('click', ()=> {
    if(!favPokemonList.length){
        showEmptyFavListMessage(true, emptyFavList, favBtn);
        typeWriteEffect('No Pokémon here… Go on an adventure!', 30, favListAlert);
        clearTimeout(hideTimeout);

        hideTimeout = setTimeout(() => {
            showEmptyFavListMessage(false, emptyFavList, favBtn);
        }, 5000);
        return;
    }

    grid.classList.toggle(MODES.favorite)
    if(grid.classList.contains(MODES.favorite) && favPokemonList.length > 0){
        removeArticles();
        favPokemonList.forEach(article => grid.prepend(article));        
    } else {
        removeArticles();
        createNewArticles(12, grid, blurSpinner);
        observeLastItem();
    }
})

function observeLastItem(){
    if(observer) observer.disconnect();
    const grid = $('.grid');
    const lastItem = $('.grid article:last-of-type');

    // el segundo parámetro de IntersectionObserver (observer) hace referencia 
    // a la variable globar observer que he definido antes
    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
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

async function createNewArticles(numElements, parentElement, reference){
    for(let i = 0; i<numElements; i++){
        const newArticle = document.createElement('article');
        newArticle.classList.add('new-article');
        newArticle.innerHTML = `
            <div class="card-wrapper">
                <div class="left-content">
                        <div class="heading-card">
                            <h2><span class="text-name"></span><span class="underlined"></span></h2>
                            <button class="btn-svg" aria-label="Button to add the pokemon to favorite"></button>                   
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
            updateFavoriteListCounter(true, counterFav);;
        } else {
            favPokemonList = favPokemonList.filter(item => item.id !== id);
            updateFavoriteListCounter(false, counterFav);;
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
    favBtn.style.pointerEvents = 'auto';
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
    await createNewArticles(12, grid, blurSpinner);
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


grid.addEventListener('click', (e)=> {
    const articles = $$('article');
    if(articles.length === 0){
        emptyFavList.classList.remove('hidden');
        pokedexTextAlert.classList.remove('hidden');
        typeWriteEffect('No Pokémon here… Go on an adventure!', 30, favListAlert);
        favBtn.style.pointerEvents = 'none';
    }
})
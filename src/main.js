import {
    getUniqueRandomNumbers
} from './utils/utils.js'

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


// html elements
const articles = $$('article');
const heading1 = $('h1');
const pokedexBtn = $('button');
const overlay = $$('.overlay');
const blurSpinner = $('.blur-spinner');
const grid = $('.grid');

// observer
let observer;

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

async function createNewArticles(numElements, parentElement, reference){
    for(let i = 0; i<numElements; i++){
        const newArticle = document.createElement('article');
        newArticle.classList.add('new-article');
        newArticle.innerHTML = `
            <div class="card-wrapper">
                        <div class="left-content">
                            <h2><span class="text-name"></span><span class="underlined"></span></h2>
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
                    </div>
        `
        parentElement.insertBefore(newArticle, reference)
    }

    const newArticle = $$('.new-article');
    await updateCardContent(newArticle);
    newArticle.forEach(article => article.classList.remove('new-article'));

    //finalmente eliminar la clase newAerticle de los nuevos articles para no actualizarlos si vuelvo a hacer scroll
}

//url 
const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/';


pokedexBtn.addEventListener('click', async ()=> {
    const articles = $$('article');
    blurSpinner.style.opacity = '1';
    await updateCardContent(articles);
    blurSpinner.style.opacity = '0';
    overlay.forEach(element => element.style.display = 'none' )
})

document.addEventListener('DOMContentLoaded', async ()=> {
    await updateCardContent(articles);
    blurSpinner.style.opacity = '0';
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

async function updateCardContent(articles){
    console.log('click')
    const numOfArticles = articles.length;
    const randomNumArray = getUniqueRandomNumbers(numOfArticles, 1000);
    let index = 0;
    for (let article of articles){
        const pokemon = await getPokemon(randomNumArray[index]);
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
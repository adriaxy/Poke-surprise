import{
    typeWriteEffect
} from './utils/utils.js'

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// html elements
const articles = $$('article');
const heading1 = $('h1');
const heading2 = $$('h2');
const btnDice = $('button');
const overlay = $$('.overlay');
const imgTitle = document.createElement('img');
const blurSpinner = $('.blur-spinner');
imgTitle.classList.add('pokedex');
imgTitle.setAttribute('src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png');

//text
const headin1Text = 'Poké Surprise'

//url 
const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/';


btnDice.addEventListener('click', async ()=> {
    blurSpinner.style.opacity = '1';
    await updateCardContent(articles);
    blurSpinner.style.opacity = '0';
    overlay.forEach(element => element.style.display = 'none' )
})

function appendImg(){
    heading1.appendChild(imgTitle);
}

document.addEventListener('DOMContentLoaded', async ()=> {
    typeWriteEffect(headin1Text, 50, heading1, appendImg);
    await updateCardContent(articles);
    blurSpinner.style.opacity = '0';
    btnDice.classList.add('show');
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
    for (let article of articles){
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        const pokemon = await getPokemon(randomNum);
        const name = article.querySelector('.text-name');
        const underlined = article.querySelector('.underlined');
        const height = article.querySelector('.height');
        const weight = article.querySelector('.weight');
        const imgUrl = article.querySelector('img');
        const textDescription = article.querySelector('p');
        const types = article.querySelector('.types');
        const abilities = article.querySelector('.abilities');

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

            textDescription.textContent = species?.flavor_text_entries.find(entry => entry.language.name === 'es')?.flavor_text || 'Descripción no disponible';

            if(species?.color.name){
                const color = species.color.name;
                underlined.style.backgroundColor = color === 'white' ? '#e1dedeff' : `${color}`;
                console.log(color)
            } else {
                underlined.classList.add('default-underlined-color');
            }

        } else {
            overlay.forEach(element => element.style.display = 'block')
        }
    }
}

// async function updateCardContent(articles){
//     for (let article of articles){
//         const randomNum = Math.floor(Math.random() * 1000) + 1;
//         const pokemon = await getPokemon(randomNum);
//         const name = article.querySelector('h2');
//         const height = article.querySelector('.height');
//         const weight = article.querySelector('.weight');
//         const imgUrl = article.querySelector('img');
//         const textDescription = article.querySelector('p');
//         const types = article.querySelector('.types');
//         const abilities = article.querySelector('.abilities');
//         if(pokemon?.name){
//             const pokemonTypes = (pokemon.types?.map(t => t.type.name)) || ['sin', 'información'];
//             const pokemonAbilities = (pokemon.abilities?.map(a => a.ability.name)) || ['sin', 'información'];

//             name.textContent = pokemon.name.toUpperCase();
//             height.textContent = parseFloat((pokemon.height * 0.1).toFixed(1));
//             weight.textContent = parseFloat((pokemon.weight * 0.1).toFixed(1));
//             types.textContent = pokemonTypes.join(', ');
//             abilities.textContent = pokemonAbilities.join(', ');

//             imgUrl.setAttribute('src', `${pokemon.sprites.other['official-artwork'].front_default}`);

//             const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`).then(res => res.json());
//             textDescription.textContent = species?.flavor_text_entries.find(entry => entry.language.name === 'es')?.flavor_text || 'Descripción no disponible';
            

//         } else {
//             overlay.forEach(element => element.style.display = 'block')
//         }
//     }
// }
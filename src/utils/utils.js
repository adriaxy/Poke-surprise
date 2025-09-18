export function typeWriteEffect(text, time, element){
    element.textContent = '';
    const stringToArr = Array.from(text);

    let counter = 0;

    const interval = setInterval(()=> {
        element.textContent += stringToArr[counter];
        counter ++;

        if(counter >= stringToArr.length){
            clearInterval(interval)
        }
    }, time)
}

export function getUniqueRandomNumbers(length, randomNum){
  const allNumbers = Array.from({length:randomNum}, (_, index) => index + 1);

  const shuffle = allNumbers.toSorted(() => Math.random() - 0.5).slice(0,length);

  return shuffle
}

export function filteredPokemonNames(inputValue, articles){
    const pokemonNames = Array.from(articles).map(article => article.querySelector('.text-name').textContent);
    return pokemonNames.filter(name => name.startsWith(inputValue));
}
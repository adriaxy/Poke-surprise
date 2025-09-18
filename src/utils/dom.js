export function updateFavoriteListCounter(isAdding, counterElement){
    const currentNum = Number(counterElement.textContent);
    if(isAdding){
        counterElement.textContent = currentNum + 1;
    } else {
        counterElement.textContent = currentNum - 1;
    }
}
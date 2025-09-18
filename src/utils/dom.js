export function updateFavoriteListCounter(isAdding, counterElement){
    const currentNum = Number(counterElement.textContent);
    if(isAdding){
        counterElement.textContent = currentNum + 1;
    } else {
        counterElement.textContent = currentNum - 1;
    }
}

export function showEmptyFavListMessage(isShowing, emptyFavList, favBtn){
    if(isShowing){
        emptyFavList.classList.remove('hidden');
        favBtn.style.pointerEvents = 'none';
    } else {
        favBtn.style.pointerEvents = 'auto';
        emptyFavList.classList.add('hidden');
    }
}

export function removeArticles(){
    const articles = document.querySelectorAll('article');
    articles.forEach(article => article.remove());
}

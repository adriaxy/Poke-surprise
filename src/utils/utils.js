export function typeWriteEffect(text, time, element, appendImgFunction){
    const stringToArr = Array.from(text);

    let counter = 0;

    const interval = setInterval(()=> {
        element.textContent += stringToArr[counter];
        counter ++;

        if(counter >= stringToArr.length){
            clearInterval(interval)
            appendImgFunction();
        }
    }, time)
}


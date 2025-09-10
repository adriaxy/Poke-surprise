export function typeWriteEffect(text, time, element, appendImgFunction, appendUnderlinedFunction){
    const stringToArr = Array.from(text);

    let counter = 0;

    const interval = setInterval(()=> {
        element.textContent += stringToArr[counter];
        counter ++;

        if(counter >= stringToArr.length){
            clearInterval(interval)
            appendImgFunction();
            appendUnderlinedFunction(element);
        }
    }, time)
}

export function getUniqueRandomNumbers(length, randomNum){
  const allNumbers = Array.from({length:randomNum}, (_, index) => index + 1);

  const shuffle = allNumbers.toSorted(() => Math.random() - 0.5).slice(0,length);

  return shuffle
}

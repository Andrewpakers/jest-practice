/**
 *
 * @param {string} string Sentence to gave the first character capitalized
 * @return {string} string with the first character capitalized
 */
const _capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function _reverseString(string) {
    let stringArray = string.split("");
    stringArray = stringArray.reverse();
    const newString = stringArray.join("");
    return newString
}

const _caluclator = {
    add: (num1, num2) => {
        return num1 + num2
    },
    subtract: (num1, num2) => {
        return num2 - num1
    },
    multiply: (num1, num2) => {
        return num1 * num2
    },
    divide: (num1, num2) => {
        return num2 / num1
    },
}

const _caesar = function(targetStr, shift) {
    const messageArray = [];
    if (shift >= 26) {
        shift = (shift % 26);
    } else if (shift <= -26) {
        shift = shift % -26;
    }
    for (let i = 0; i < targetStr.length; i++){
        let letterCode = targetStr.charCodeAt(i) + shift;
        let startingCode = targetStr.charCodeAt(i);
        if (!!targetStr.charAt(i).match(/[.,:!?]/) || targetStr.charAt(i).match(/\s/)) {
            messageArray.push(targetStr.charAt(i));
            continue;
        } else if (letterCode > 122) {
            letterCode = 97 + (letterCode - 123);
        } else if (letterCode > 90 && targetStr.charCodeAt(i) < 97){
            letterCode = 65 + (letterCode - 91);
        }else if (letterCode < 65 && startingCode >= 65 && startingCode <= 90){
            letterCode = 90 - (64 - letterCode);
        }

        messageArray.push(String.fromCharCode(letterCode));
    }
    return messageArray.join("");
};

function _analyzeArray(array) {
    const sortedArray = array.sort((a,b) => (a-b));
    const _average = sortedArray.reduce((a,b) => (a+b)) / array.length;
    const _min = sortedArray[0];
    const _max = sortedArray[sortedArray.length - 1]
    
    return {
        average: _average,
        min: _min,
        max: _max,
        length: sortedArray.length,
    }
}

module.exports = {
    capitalize: _capitalize,
    reverseString: _reverseString,
    calculator: _caluclator,
    caesar: _caesar,
    analyzeArray: _analyzeArray,
}

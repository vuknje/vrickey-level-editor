function parseLevelsStringFromUnreal(text) {
    const regex = /([^\"(),=]+)+/g;
    let definitionPart;
    let levels = [];
    
    text.trim().match(regex).forEach((found) => {
        if (found.startsWith('Definition')) {
            definitionPart = found;
            return;
        }
        
        levels.push(found);
    });

    return {definitionPart, levels};     
}

function generateUnrealLevels({definitionPart, levels}) {
    return '(' + levels.map((level) => `(${definitionPart}="${level.replace(/\n/g, '')}")`).join(',') + ')'
}

export {parseLevelsStringFromUnreal, generateUnrealLevels};
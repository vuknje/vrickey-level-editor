const legendMap = {
    "0" : "empty",
    "b" : "brick-random-depth",
    "B" : "brick-uniform-depth",
    
    "o" : "ball",
    "Q" : 'big-ball',
    "O" : "ball-above-pyramid",

    "n" : "narrow-passage",
    "N" : "narrow-passage-x",
        
    "5" : "potion-inverse-directions",
    "6" : "potion-inverse-directions-vertical",

    "3" : "potion-rotate-all",
    "4" : "potion-rotate-all-vertical",

    "7" : "potion-shrink",
    "8" : "potion-shrink-vertical",

    "g" : "glass-brick",
    "G" : "glass-brick-bomb",

    "A" : "pyramid-up",
    "V" : "pyramid-down",
    "#" : "goal",
    
    "U" : "spike-down",    
    "D" : "spike-up",
    "u" : "spike-left",    
    "d" : "spike-right",

    "l" : "slide-left-inverse",
    "r" : "slide-right-inverse",
    "L" : "slide-left",
    "R" : "slide-right",
    "I" : "column",
    "J" : "column-down",
    "C" : "cannon",
    "c" : "cannon-destrucrtible-projectile",
    "." : "delimiter",
    "w" : "wheel",
    "W" : "wheel-reverse",
    "+" : "pushbrick-pushed",
    "-" : "pushbrick",

    "p" : "ammo-pickup",

    "a" : "pyramid-up-rotate",
    "v" : "pyramid-down-rotate",
    "k" : "slide-left-inverse-rotate",
    "e" : "slide-right-inverse-rotate",
    "K" : "slide-left-rotate",
    "E" : "slide-right-rotate",

    "*" : "rock",
    "%" : "rock-special",

    '^': 'turbo',
    '$': 'turbo-stop',

    's': 'shield-pickup'
};

const mirrorMap = {
    "L": "R",
    "R": "L",
    "l": "r",
    "r": "l",

    "K": "E",
    "E": "K",
    "k": "e",
    "e": "k",

    "w": "W",
    "W": "w",

    "u": "d",
    "d": "u"
};  

export {legendMap, mirrorMap};
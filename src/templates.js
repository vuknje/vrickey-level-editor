import { legendMap } from './legend.js';

function templateLevel(lines) {
    return `<table>${getTRs(lines)}</table>`;

    function getTRs(lines) {
        return lines.reduce((html, line) => {
            return html + `<tr>${getTD(line)}</tr>`;;
        }, '');
    }

    function getTD(line) {
        return line.reduce((html, symbol) => {
            return html + `<td width="20%">${ symbol2img(symbol) }</td>`
        }, '');
    } 
}

function templateLevelsList(levels) {
    return levels.reduce((html, level, index) => {
        return html + `<li class="level-list-item">Level ${ index }</li>`;;
    }, '');
}

function templateLegend(levels) {
    return Object.entries(legendMap).reduce((html, [symbol, label], index) => {
        return html + `
            <tr title="${label.replace(/-/g, ' ')}">
                <td class="legend-item-text">${symbol}</td><td class="legend-item">${ symbol2img(symbol) }</td>
            </tr>`;;
    }, '');
}

function symbol2img(symbol) {
    const elementName = legendMap[symbol];
    return elementName
        ? `<img class="${legendMap[symbol]}" src="elements/${legendMap[symbol]}.png" />`
        : '';
}

export { templateLevel, templateLevelsList, templateLegend };
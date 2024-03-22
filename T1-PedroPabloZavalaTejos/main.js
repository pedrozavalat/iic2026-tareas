const APPLE = "https://gist.githubusercontent.com/Hernan4444/d500438113d5eedc297f9c207fb03337/raw/474e0494400b27b96f381b04048deab5c8c586b9/Apple.csv"
const SONY = "https://gist.githubusercontent.com/Hernan4444/d500438113d5eedc297f9c207fb03337/raw/474e0494400b27b96f381b04048deab5c8c586b9/Sony.csv"

// COMPLETAR CON CÓDIGO JS y D3.JS NECESARIO

const WIDTH = 900;
const HEIGHT = 600;

const svg = d3.select("#vis")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

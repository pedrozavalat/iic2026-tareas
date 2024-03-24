/*
Fuentes bibliográficas:
  1. Para hacer el tooltip me guie de la siguiente pagina
    How to add a tooltip in d3  - https://observablehq.com/@john-guerra/how-to-add-a-tooltip-in-d3

*/

/* Constantes */
const APPLE = "https://gist.githubusercontent.com/Hernan4444/d500438113d5eedc297f9c207fb03337/raw/474e0494400b27b96f381b04048deab5c8c586b9/Apple.csv"
const SONY = "https://gist.githubusercontent.com/Hernan4444/d500438113d5eedc297f9c207fb03337/raw/474e0494400b27b96f381b04048deab5c8c586b9/Sony.csv"
const WIDTH = 900;
const HEIGHT = 600;
const MARGIN = {
  top: 50,
  left: 50,
  bottom: 50,
  right: 50
};
const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.left - MARGIN.right;
const CHART_TITLE = "Acciones de Apple"

const svg = d3.select("#vis")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  
d3.select("body").append("div").attr("class", "tooltip")


/* Funcion que incorpora los datos en la visualizacion */
function joinData(data) {
  console.log(data);

  const minStock = d3.min(data, d => d.min);
  const maxStock = d3.max(data, d => d.max);
  

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, WIDTHVIS])
    .paddingInner(0.6)
  
  const yScale = d3.scaleLinear()
    .domain([0.9 * minStock, 1.1 * maxStock])
    .range([HEIGHTVIS, 0])

  const axisX = d3.axisBottom(xScale);
  const axisY = d3.axisLeft(yScale);

  // Eje x
  svg.append("g")
    .call(axisX)
    .attr("id", "axis-x")
    .attr("transform", `translate(${MARGIN.left} ${HEIGHTVIS + MARGIN.top})`);

  // Eje y
  svg.append("g")
    .call(axisY.tickFormat(d => `$${d}`))
    .attr("id", "axis-y")
    .attr("transform", `translate(${MARGIN.right -10} ${MARGIN.top})`);

  // Titulo del gráfico
  svg.append("text")
    .attr("transform", `translate(${WIDTH / 2.7} ${MARGIN.top - 10})`)
    .text(CHART_TITLE)
    .attr("id", "vis-title")

  // Vertical lines: stock minimum and maximum values
  svg.select("#axis-x")
    .selectAll("line")
    .data(data)
    .join("line")
    .attr("class", "stock-vertical-line")
    .attr("y1", (d) => yScale(d.min) - HEIGHTVIS)
    .attr("y2", (d) => yScale(d.max) - HEIGHTVIS)
  
  // Rect: stock start and end values
  const tooltip = d3.select(".tooltip");
  /* Funcion que maneja eventosd el mouse al estar sobre un rect */
  const mouseEnter = (event, data) => {
    const [x, y] = d3.pointer(event);
  
    
    
    const toolTipHTML = `
      <span class="center bolder"><p>Date: ${data.date}</p></span>
      <ul>
        <li><p><span class="bolder">Minimum stock</span>: ${data.min}</p></li>
        <li><p><span class="bolder">Maximum stock</span>: ${data.min}</p></li>
        <li><p><span class="bolder">Start value</span>: ${data.start}</p></li>
        <li><p><span class="bolder">End value</span>: ${data.end}</p></li>
      </ul>
    `
    
    tooltip
      .style("top", `${HEIGHT + parseInt(y)}px`)
      .style("left", `${HEIGHTVIS + parseInt(x)}px`)
      .style("visibility", "visible")
      .attr("position", "absolute")
      .html(toolTipHTML)
  }
  /* Funcion que maneja los eventos del mouse al salir de un rect */
  const mouseOut = () => {
    tooltip.html(``)
      .style("visibility", "hidden")
  }
  
  // Componentes rect
  svg.select("#axis-x")
    .selectAll("li")
    .data(data)
    .join("rect")
    .attr("x", (d) => xScale(d.date))
    .attr("y", (d) => d.start < d.end ? yScale(d.end) - HEIGHTVIS : yScale(d.start) - HEIGHTVIS)
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => Math.abs(yScale(d.end) - yScale(d.start)))
    .attr("class", (d) => d.start < d.end ? "stock-rect up" : "stock-rect down")
    .on('mouseenter', mouseEnter)
    .on('mouseout', mouseOut)

  // Legend
  svg.append("circle")
    .attr("cx", WIDTHVIS - MARGIN.left)
    .attr("cy", MARGIN.top)
    .attr("r", 5)
    .attr("class", "up")
    
  svg.append("circle")
    .attr("cx", WIDTHVIS - MARGIN.left)
    .attr("cy", MARGIN.top + 30)
    .attr("r", 5)
    .attr("class", "down")
    
  svg.append("text")
    .text("Positive trend")
    .attr("x", WIDTHVIS - MARGIN.left + 10)
    .attr("y", MARGIN.top + 5)

  svg.append("text")
    .text("Negative trend")
    .attr("x", WIDTHVIS - MARGIN.left + 10)
    .attr("y", MARGIN.top + 35)
    

  
}




function loadData() {
  const processData = (data) => ({
    date: data.fecha,
    start: +data.inicio,
    min: +data.minimo,
    max: +data.maximo,
    end: +data.fin,
  });

  const sortDataByDate = (data) => data.sort((a, b) => a.date - b.date);

  d3.csv(APPLE, processData)
    .then((datos) => {
      const sortData = sortDataByDate(datos);
      joinData(sortData);
    }).catch((error) => {
      console.log(error);
    });
  ;
}


loadData();
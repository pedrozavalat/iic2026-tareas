// El archivi incluye reproducciónn de música. 
// Al final se explica como apagarlo por si acaso 😅

const SERIES_URL = "https://raw.githubusercontent.com/Hernan4444/public_files/main/db_series.csv"

const SVG1 = d3.select("#vis-1").append("svg");
const SVG2 = d3.select("#vis-2").append("svg");

// Editar tamaños como estime conveniente
const WIDTH_VIS_1 = 800;
const HEIGHT_VIS_1 = 350;

const WIDTH_VIS_2 = 800;
const HEIGHT_VIS_2 = 1600;

const HEIGHT = HEIGHT_VIS_1 + HEIGHT_VIS_2;
const MARGIN = {
    top: 90,
    bottom: 90,
    right: 30,
    left: 70, 
};

SVG1.attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);
SVG2.attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);


function crearSeries() {
    /* 
    Esta función utiliza el dataset indicado en SERIES_URL para crear 
    la primeva visualización.
    En esta visualización están las 3 series que deben ser dibujadas aplicando data-join 
    */

    d3.csv(SERIES_URL, d3.autoType)
        .then(series => {
            console.log(series)
            
            const BOOK_WIDTH = 30;
            const BOOK_HEIGHT = 80;
            const DIF_TEJUELO = 10; // Diferencia del tejuelo y la altura del libro

            const escalaX = d3.scaleBand()
                .domain(series.map(d => d.serie))
                .range([0, WIDTH_VIS_1])
                .padding(0.4); 

            // Obtenemos la maxima altura entre barras para que sean comparables
            const maxPersonajeExtra = d3.max(series.map(d => d.personajes_extras));            
            const maxPersonajesRecurrentes = d3.max(series.map(d => d.personajes_recurrentes)); 
            const maxAltura = Math.max(maxPersonajeExtra, maxPersonajesRecurrentes); 
            // Obtenemos la maxima anchura que puede tener un libro
            const maxAnchura = d3.max(series.map(d => d.aventuras)); 
            
            // Posicion del libro en el eje Y
            const escalaY = d3.scaleLinear()
                .domain([0, maxAltura * 1.5])
                .range([HEIGHT_VIS_1, 0]); 
            
            // Rango de la altura de cada libro. 
            const escalaAltura = d3.scaleLinear()
                .domain([0, maxAltura * 1.5])
                .range([0, HEIGHT_VIS_1]); 

            const escalaAnchura = d3.scaleLinear()
                .domain([0, maxAnchura])
                .range([0, 120]); 

            
            
            // Escala categorica para el libro izquierdo
            const escalaManga = d3.scaleOrdinal(d3.extent(series, d=>d.manga), d3.schemeObservable10); 
            // Escala logaritmica para el libro de al medio. Entre mas claro el libro, menos capitulos
            // Mientras que, entre mas oscuro, mas capitulos (amarillo claro -> naranjo oscuro)
            const escalaCantCaps = d3.scaleLinear()
                .domain(d3.extent(series, d => d.cantidad_caps))
                .range(['white', 'black']); 
            
            const escalaSeries = d3.scaleOrdinal(d3.extent(series, d=>d.serie), d3.schemeSet1); 
            

            // Contenedor que presenta las 3 series de Dragon ball 
            const contenedorSeries = SVG1
                .selectAll("g.series")
                .data(series)
                .join(enter => {
                        // Tag <g> creado para cada serie
                        const gSeries = enter
                            .append("g")
                            .attr("class", "libros");
                        // Libros izquierda (creado para cada serie)
                        gSeries.append("rect")
                            .attr('id', 'izquierda')
                            .attr("fill", (d) => escalaManga(d.manga))
                            .attr('width', BOOK_WIDTH)
                            .attr('height', (d) => escalaAltura(d.personajes_extras))
                            .attr('x', (d) => escalaX(d.serie))
                            .attr('y', (d) => escalaY(d.personajes_extras) - MARGIN.bottom)
                        // Libros de al medio (creado para cada serie)
                        gSeries.append("rect")
                            .attr('id', 'medio')
                            .attr('fill', d => escalaCantCaps(d.cantidad_caps))
                            .attr('width', (d) => escalaAnchura(d.aventuras))
                            .attr('height', BOOK_HEIGHT)
                            .attr('x', (d) => escalaX(d.serie) + BOOK_WIDTH) 
                            .attr('y', HEIGHT_VIS_1 -  MARGIN.bottom - 80) 
                        // Libros derecha (creado para cada serie)
                        gSeries.append("rect")
                            .attr('id', 'derecha')
                            .attr('fill', d => escalaSeries(d.serie))
                            .attr('width', BOOK_WIDTH)
                            .attr('height', (d) => escalaAltura(d.personajes_recurrentes))
                            .attr('x', (d) => escalaX(d.serie) + BOOK_WIDTH + escalaAnchura(d.aventuras)) 
                            .attr('y', (d) => escalaY(d.personajes_recurrentes) - MARGIN.bottom)
                        
                        // Titulo debajo de cada serie, con el color segun la escala "escalaSeries"
                        gSeries.append("text")
                            .attr('x', (d) => escalaX(d.serie)) 
                            .attr('y', HEIGHT_VIS_1 -  MARGIN.bottom + 34) 
                            .attr("fill", d => escalaSeries(d.serie))
                            .text(d => d.serie)

                        // Agregamos los tejuelos para cada libro (izquierda, al medio, derecha). 
                        gSeries.append("rect")
                            .attr("fill", "magenta")
                            .attr("width", BOOK_WIDTH)
                            .attr("height", 5)
                            .attr('x', (d) => escalaX(d.serie)) 
                            .attr('y', (d) => escalaY(d.personajes_extras) - MARGIN.bottom + DIF_TEJUELO)
                        gSeries.append("rect")
                            .attr("fill", "magenta")
                            .attr('width', (d) => escalaAnchura(d.aventuras))
                            .attr("height", 5)
                            .attr('x', (d) => escalaX(d.serie) + BOOK_WIDTH) 
                            .attr('y', HEIGHT_VIS_1 -  MARGIN.bottom - 80 + DIF_TEJUELO) 
                        gSeries.append("rect")
                            .attr("fill", "magenta")
                            .attr('width', BOOK_WIDTH)
                            .attr("height", 5)
                            .attr('x', (d) => escalaX(d.serie) + BOOK_WIDTH + escalaAnchura(d.aventuras)) 
                            .attr('y', (d) => escalaY(d.personajes_recurrentes) - MARGIN.bottom + DIF_TEJUELO)
                    },
                    update => update,
                    exit => exit
                );
            
            const legend = d3.selectAll('legend').select('li')
            console.log(legend)
        
            
            
            
            
            


        // No olvides actualizar los <span> con el "style" de background-color
        // según el color categóricos elegidos. Cada span tiene un ID único.


        /* 
        Cada vez que se haga click en un conjunto de libros. Debes llamar a
        preprocesarPersonajes(serie, false) donde "serie" 
        corresponde al nombre de la serie presionada.
    
        preprocesarPersonajes se encargará de ejecutar a crearPersonajes(...)
        */
    })



}

function crearPersonajes(dataset, serie, filtrar_dataset, ordenar_dataset) {
    // Actualizo nombre de un H4 para saber qué hacer con el dataset
    let texto = `Serie: ${serie} - Filtrar: ${filtrar_dataset} - Orden: ${ordenar_dataset}`
    d3.selectAll("#selected").text(texto);

    // Nos quedamos con los personajes asociados a la serie seleccionada
    let datos = dataset.filter(d => {
        if (serie == "Dragon Ball") {
            return d.Dragon_ball == true;
        }
        else if (serie == "Dragon Ball Z") {
            return d.Dragon_ball_z == true;
        }
        else if (serie == "Dragon Ball GT") {
            return d.Dragon_ball_gt == true;
        }
    })

    // 1. Filtrar, cuando corresponde, por poder_aumenta > 10
    // Completar aquí
    console.log(filtrar_dataset)


    // 2. Ordenar, según corresponda, los personajes. Completar aquí
    console.log(ordenar_dataset)


    // 3. Confeccionar la visualización 
    // Todas las escalas deben estar basadas en la información de "datos"
    // y NO en "dataset".

    console.log(datos)
    // No olvides que está prohibido el uso de loop (no son necesarios)
    // Y debes aplicar correctamente data-join
    // ¡Mucho éxito 😁 !
}


function ejecutar() {
    crearSeries();
}

ejecutar();

// /* 
// Código extra para reproducir música acorde a la tarea.
// Si no quieres escuchar cuando se carga la página, solo cambia la línea:
// let playAudio = true; por let playAudio = false;
// O bien elimina todo el código que está a continuación 😅 
// */
// try {
//     const audio = new Audio('https://github.com/Hernan4444/public_files/raw/main/dbgt.mp3');
//     audio.volume = 0.3;
//     audio.loop = true;
//     let playAudio = false;
//     if (playAudio) {
//         audio.play();
//         d3.select("#sound").text("OFF Music 🎵")
//     }
//     d3.select("#sound").on("click", d => {
//         playAudio = !playAudio;
//         if (playAudio) {
//             audio.play();
//             d3.select("#sound").text("OFF Music 🎵")
//         }
//         else {
//             audio.pause();
//             d3.select("#sound").text("ON Music 🎵")
//         }
//     })
// } catch (error) { };

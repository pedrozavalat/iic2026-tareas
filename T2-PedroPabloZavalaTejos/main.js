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

// Definimos las escalas para poder usarlas en ambas visualizaciones. 
let escalaManga;
let escalaCantCaps; 
let escalaSeries

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
                .paddingOuter(0.45)

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
            
            // ESCALAS 
            // Escala categorica para el libro izquierdo
            escalaManga = d3.scaleOrdinal(
                d3.extent(series, d => d.manga), d3.schemeObservable10
            ); 
            // Escala logaritmica para el libro de al medio. Entre mas claro el libro, menos 
            // capitulos. Mientras que, entre mas oscuro, mas capitulos.
            escalaCantCaps = d3.scaleLinear()
                .domain(d3.extent(series, d => d.cantidad_caps))
                .range(['white', 'black']); 
            
            escalaSeries = d3.scaleOrdinal(d3.extent(series, d => d.serie), d3.schemeSet1); 

            // Contenedor que presenta las 3 series de Dragon ball, donde creamos 
            // 3 libros para cada serie. 
            const contenedorSeries = SVG1
                .selectAll("g.series")
                .data(series)
                .join(enter => {
                    // Tag <g> creado para cada serie
                    const gSeries = enter
                        .append("g")
                        .attr("class", "serie")
                    // Libros izquierda (creado para cada serie)
                    gSeries.append("rect")
                        .attr('id', 'izquierda')
                        .attr("fill", (d) => escalaManga(d.manga))
                        .attr('width', BOOK_WIDTH)
                        .attr('height', (d) => escalaAltura(d.personajes_extras))
                        .attr('x', (d) => escalaX(d.serie))
                        .attr('y', (d) => escalaY(d.personajes_extras) - MARGIN.bottom);
                        
                    // Libros de al medio (creado para cada serie)
                    gSeries.append("rect")
                        .attr('id', 'medio')
                        .attr('fill', d => escalaCantCaps(d.cantidad_caps))
                        .attr('width', (d) => escalaAnchura(d.aventuras))
                        .attr('height', BOOK_HEIGHT)
                        .attr('x', (d) => escalaX(d.serie) + BOOK_WIDTH) 
                        .attr('y', HEIGHT_VIS_1 -  MARGIN.bottom - 80);
                    // Libros derecha (creado para cada serie)
                    gSeries.append("rect")
                        .attr('id', 'derecha')
                        .attr('fill', d => escalaSeries(d.serie))
                        .attr('width', BOOK_WIDTH)
                        .attr('height', (d) => escalaAltura(d.personajes_recurrentes))
                        .attr('x', (d) => escalaX(d.serie) + BOOK_WIDTH + escalaAnchura(d.aventuras)) 
                        .attr('y', (d) => escalaY(d.personajes_recurrentes) - MARGIN.bottom);
                    
                    // Titulo debajo de cada serie, con el color segun la escala "escalaSeries"
                    gSeries.append("text")
                        .attr('x', (d) => escalaX(d.serie)) 
                        .attr('y', HEIGHT_VIS_1 -  MARGIN.bottom + 34) 
                        .attr("fill", d => escalaSeries(d.serie))
                        .text(d => d.serie);

                    // Agregamos los tejuelos para cada libro (izquierda, al medio, derecha). 
                    gSeries.append("rect")
                        .attr("fill", "magenta")
                        .attr("width", BOOK_WIDTH)
                        .attr("height", 5)
                        .attr('x', (d) => escalaX(d.serie)) 
                        .attr('y', (d) => escalaY(d.personajes_extras) - MARGIN.bottom + DIF_TEJUELO);
                    gSeries.append("rect")
                        .attr("fill", "magenta")
                        .attr('width', (d) => escalaAnchura(d.aventuras))
                        .attr("height", 5)
                        .attr('x', (d) => escalaX(d.serie) + BOOK_WIDTH) 
                        .attr('y', HEIGHT_VIS_1 -  MARGIN.bottom - 80 + DIF_TEJUELO); 
                    gSeries.append("rect")
                        .attr("fill", "magenta")
                        .attr('width', BOOK_WIDTH)
                        .attr("height", 5)
                        .attr('x', (d) => escalaX(d.serie) + BOOK_WIDTH + escalaAnchura(d.aventuras)) 
                        .attr('y', (d) => escalaY(d.personajes_recurrentes) - MARGIN.bottom + DIF_TEJUELO);
                    // Agregamos la interaccion de cada tag g.series al momento de entrar el mouse
                    gSeries.on('mouseenter', (_, d) => {
                        d3.select('#detailName').text(d.serie)
                        d3.select('#detailCaps').text(d.cantidad_caps)
                        d3.select('#detailAventuras').text(d.aventuras)
                        d3.select('#detailPersRecurrent').text(d.personajes_recurrentes)
                        d3.select('#detailPersExtras').text(d.personajes_extras)
                        d3.select('#detailPersManga').text(d.manga)
                    });
                    return gSeries;
                },
                update => update,
                exit => exit
                );
            
            // LEYENDAS
            // Editamos los spans segun si la serie se basa en Manga o no. 
            d3.selectAll("span")
                .filter((d, i, e) => e[i].id.includes("legendManga"))
                .style('background-color', function() {
                    const tipo = this.id.split("legendManga")[1];
                    const basadoEnManga = tipo === "True" ? true : false;
                    return escalaManga(basadoEnManga);
            });
            // Editamos los spans de cada serie para asignarles el mismo color que del libro
            d3.selectAll("span")
                .filter((_, i, e) => e[i].id.includes("legendDB")) // filtramos id con "legendDB"
                .style('background-color', function() {
                    const tipo = this.id.split("legendDB")[1]
                    return tipo.length === 0 
                        ? escalaSeries('Dragon Ball') 
                        : escalaSeries(`Dragon Ball ${tipo}`);
            });

            // EVENTOS
            // Evento click sobre una serie. Cada vez que realizamos click, se resalta la 
            // serie clickeada y se opaca el resto. Ademas, actualizamos la visualizacion 2. 
            // ResaltarSerie(...) realiza la logica del click
            const resaltarSerie = (serieActual) => {
                contenedorSeries.filter(d => d.serie !== serieActual )
                    .attr('opacity', 0.1); 
                // Mientras que, la serie actual la resaltamos.
                contenedorSeries.filter(d => d.serie == serieActual)
                    .attr('opacity', 1);
                // Llamamos a preprocesarPersonajes(...) para ejecutar crearPersonajes(...). 
                preprocesarPersonajes(serieActual, false);
            }
            // Consideramos los elementos donde al hacer click resaltamos el conjunto de libros. 
            // Aca tenemos los 3 botones y el conjunto de series de la visualizacion 1. 
            d3.select('#DragonBall').on('click', (e) => resaltarSerie(e.target.innerText));
            d3.select('#DragonBallGT').on('click', (e) => resaltarSerie(e.target.innerText));
            d3.select('#DragonBallZ').on('click', (e) => resaltarSerie(e.target.innerText));
            contenedorSeries.on('click', (_, datoActual) => resaltarSerie(datoActual.serie)); 
    })



}

function crearPersonajes(dataset, serie, filtrar_dataset, ordenar_dataset) {
    // Actualizo nombre de un H4 para saber qué hacer con el dataset
    let texto = `Serie: ${serie} - Filtrar: ${filtrar_dataset} - Orden: ${ordenar_dataset}`
    d3.selectAll("#selected").text(texto);

    // Nos quedamos con los personajes asociados a la serie seleccionada !
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
    // Cantidad de personajes por fila 

    const N = 5;
    const RADIO_CABEZA = 10;
    const RADIO_CS = 20; // Radio Cuerpo Superior (CS)
    const ANCHO_BRAZO = 6;

    const contenedorPersonajes = SVG2.selectAll('g.personaje')
        .data(datos)
        .join(
            enter => {
                // Creamos el tag g para cada personaje. 
                const personaje = enter.append('g')
                    .attr('class', 'personaje')
                    .style('opacity', 0)
                    .attr('transform', (d, i) => {
                        let posX = (i % N) * 150;
                        let posY = Math.floor(i / N) * 150;
                        return `translate(${posX + 100}, ${posY + 100})`;
                    }
                );

                personaje.transition('enterPersonaje').duration(500).style('opacity', 1); 
                // ESCALAS
                // Maximos para cada escalas
                const maxPoderMinimo = d3.max(datos.map(d => d.poder_minimo)); 
                const maxPoderPromedio = d3.max(datos.map(d => d.poder_promedio)); 
                // Escala desde valores de poder minimo a pixeles entre 5 a 100. 
                const escalaBrazo = d3.scaleLog().domain([1, maxPoderMinimo]).range([15, 40]);
                // Escala de valores de poder promedio a pixeles entre 5 a 100. CI: Cuerpo inferior
                const escalaLargoCI = d3.scaleLog().domain([1, maxPoderPromedio]).range([RADIO_CS, 80]); 

                // Definimos las metricas de aventuras: minimo, maximo y mediana. 
                const minAventura = d3.min(datos.map(d => d.aventuras)); 
                const medianAventura= d3.median(datos.map(d => d.aventuras)); 
                const maxAventura = d3.max(datos.map(d => d.aventuras)); 
                // Definimos una escala divergente para los colores segun las aventuras de c/personaje
                const escalaColorCI = d3.scaleDiverging(d3.interpolatePiYG)
                    .domain([minAventura, medianAventura, maxAventura])
                
                // Definimos el brazo del personaje. El color sera amarillo para todos. 
                personaje.append('ellipse')
                    .attr('class', 'brazo')
                    .attr('cx', 24)
                    .attr('cy', 37)
                    .attr('rx', d => escalaBrazo(d.poder_minimo))
                    .attr('ry', ANCHO_BRAZO)
                    .attr('transform', `rotate(${40}, ${24}, ${37})`)
                    .attr('fill', 'yellow')
                // Definimos la cabeza del personaje. 
                personaje.append('circle')
                    .attr('class', 'cabeza')
                    .attr('r', RADIO_CABEZA)
                    .attr('fill', d => escalaSeries(d.primera_serie));
                
                // Definimos el cuerpo superior. 
                personaje.append('circle')
                    .attr('class', 'cuerpo-superior')
                    .attr('r', RADIO_CS)
                    .attr('fill', d => escalaSeries(d.serie_recurrente))
                    .attr('cx', 0)
                    .attr('cy', 30)
                // Definimos el cuerpo inferior
                personaje.append('rect')
                    .attr('class', 'cuerpo-inferior')
                    .attr('x', -RADIO_CS)
                    .attr('y', 30)
                    .attr('fill', d => escalaColorCI(d.aventuras))
                    .attr('width', 2 * RADIO_CS)
                    .attr('height', d => escalaLargoCI(d.poder_promedio))
                // Definimos el nombre de cada personaje 
                personaje.append('text')
                    .text(d => d.personaje)
                    .attr('class', 'nombre')
                    .attr('fill', 'lightgray')
                    .attr('text-anchor', 'middle')
                    .attr('x', 0)
                    .attr('y', -20)
                    
                return personaje;
            },
            update => update,
            exit => exit
    );  

    // EVENTOS
    // Funcion que resalta un personaje sobre los demas
    const resaltarPersonaje = (personajeActual) => {
        // Opacamos el resto de los personajes
        console.log(personajeActual)
        contenedorPersonajes
            .filter(d => d.personaje !== personajeActual)
            .style('opacity', 0.1);
        // Resaltamos el personaje con el mouse sobre él 
        contenedorPersonajes
            .filter(d => d.personaje == personajeActual)
            .style('opacity', 1);
    }
    contenedorPersonajes.on('mouseover', (_, personajes) => {
        resaltarPersonaje(personajes.personaje)
    }); 
    
    contenedorPersonajes.on('mouseout', (_, personajeActual) => {
        // restablecemos la opacidad para cada personaje. 
        contenedorPersonajes
            .filter(d => d.personaje !== personajeActual)
            .style('opacity', 1);

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

////////////////////////////
// NO EDITAR ESTE ARCHIVO //
////////////////////////////
const personjesURL = "https://raw.githubusercontent.com/Hernan4444/public_files/main/db_personajes.csv"


/* Cada vez que se seleccione un tipo de planeta, esta función será llamada
para actualizar la segunda visualización */
let PERSONAJES = [];
function preprocesarPersonajes(categoria, filtrar_dataset) {
    // Si la lista de datos está vacía, descargo el dataset
    // y lo guardo en mi variable externa "PERSONAJES".
    if (PERSONAJES.length == 0) {
        d3.csv(personjesURL, d3.autoType).then(dataset => {
            // Como no pongo let antes, sobrescribo la variable anterior.
            PERSONAJES = dataset;
            // Llamo de nuevo a preprocesarPersonajes 
            // para que ahora si se ejecute cuando PERSONAJES tenga datos
            preprocesarPersonajes(categoria, filtrar_dataset)
        })
        // Hacemos return para que la función no continue su ejecución
        return 0;
    }

    // Generamos una copia del dataset
    let data = JSON.parse(JSON.stringify(PERSONAJES));

    // Cada vez que se oprime filtrar, se llama nuevamente
    // a preprocesarPersonajes con filtro=true
    d3.select("#filter-button").on("click", (event) => {
        preprocesarPersonajes(categoria, true);
    })

    // Cada vez que se oprime Restaurar filtro, se llama nuevamente
    // a preprocesarPersonajes con filtro=false
    d3.select("#filter-reset").on("click", (event) => {
        preprocesarPersonajes(categoria, false);
    })

    // Cada vez que cambia el selector de orden, se llama nuevamente
    // a crearPersonajes para que actualice la visualización
    d3.select("#order-by").on("change", (_) => {
        let ordenar_dataset = document.getElementById("order-by").selectedOptions[0].value;
        crearPersonajes(data, categoria, filtrar_dataset, ordenar_dataset);
    })

    // Llamamos a la segunda función encargada de crear los datos
    let ordenar_dataset = document.getElementById("order-by").selectedOptions[0].value;
    crearPersonajes(data, categoria, filtrar_dataset, ordenar_dataset);
}


d3.select("#DragonBall").on("click", () => preprocesarPersonajes("Dragon Ball", false));
d3.select("#DragonBallZ").on("click", () => preprocesarPersonajes("Dragon Ball Z", false));
d3.select("#DragonBallGT").on("click", () => preprocesarPersonajes("Dragon Ball GT", false));


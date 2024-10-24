// Selecciona el div donde se mostrará la gráfica
const chart = d3.select("#chart");

// Dimensiones del gráfico
const width = 800;
const height = 400;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

// Crear SVG dentro del div "chart"
const svg = chart.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip para mostrar información adicional
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

// Enlace de Dropbox al archivo (sin encabezados)
const fileUrl = "https://www.dropbox.com/scl/fi/llo681jigm2w53htljogv/MS_MC.txt?rlkey=4p58ksuedog6jaav928ufnncq&dl=1";

// Cargar el archivo CSV desde Dropbox sin encabezados
d3.csv(fileUrl, function(d) {
    // Asegúrate de que los datos se carguen correctamente
    console.log("Registro de fila:", d); // Depuración para cada fila
    return {
        columna1: d[0],  // Primera columna del archivo
        columna2: +d[1]  // Segunda columna del archivo, se convierte a número
    };
}).then(data => {
    // Verifica si los datos están cargados correctamente
    console.log("Datos cargados:", data);

    // Si los datos no tienen el formato esperado, no se podrá continuar
    if (!data || data.length === 0) {
        console.error("No se encontraron datos o los datos están vacíos.");
        return;
    }

    // Crear escalas
    const x = d3.scaleBand()
        .domain(data.map(d => d.columna1))  // Cambia 'columna1' según tu lógica
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.columna2)])  // Cambia 'columna2' según tu lógica
        .range([height, 0]);

    // Añadir los ejes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Crear barras del gráfico de barras
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.columna1))
        .attr("y", d => y(d.columna2))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.columna2))
        .on("mouseover", function (event, d) {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`Columna 1: ${d.columna1}<br>Columna 2: ${d.columna2}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function () {
            tooltip.transition().duration(500).style("opacity", 0);
        });
});

// Mostrar características del archivo
function displayFileInfo() {
    d3.csv(fileUrl, function(d) {
        return {
            columna1: d[0],  // Primera columna
            columna2: +d[1]  // Segunda columna
        };
    }).then(data => {
        const numRegistros = data.length;
        const columnas = ["columna1", "columna2"];  // Nombres manuales asignados

        const infoDiv = d3.select("#file-info");
        infoDiv.html(`<p><strong>Número de registros:</strong> ${numRegistros}</p>
                      <p><strong>Columnas:</strong> ${columnas.join(', ')}</p>`);
    });
}

// Llamar a la función para mostrar la información del archivo
displayFileInfo();

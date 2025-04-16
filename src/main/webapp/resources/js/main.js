const svgElement = document.getElementById("graph");

document.addEventListener("DOMContentLoaded", function () {
    redrawGraph();

    svgElement.addEventListener("click", function (event) {
        event.preventDefault();
        console.log('graph clicked')

        const r = Number($("[id$='r'] input").val().replace(',', '.'));

        console.log(r)
        const rect = svgElement.getBoundingClientRect();

        const svgX = event.clientX - rect.left; // Click position in SVG width
        const svgY = event.clientY - rect.top;  // Click position in SVG height
        console.log('coorinates x,y,r: ', svgX, svgY, r);

        const x = ((svgX - 200) / 120 * 5); // Transform SVG X to graph X
        const y = ((200 - svgY) / 120) * 5; // Transform SVG Y to graph Y and invert Y-axis


        const svgFormId = 'svg-form'

        document.getElementById(svgFormId + ":xValue").value = x.toFixed(3);
        document.getElementById(svgFormId + ":yValue").value = y.toFixed(3);
        document.getElementById(svgFormId + ":rValue").value = r;
        document.getElementById(svgFormId + ":svgClickButton").click();

    });
});

// Функция для полной перерисовки графика
function redrawGraph() {
    const svg = document.getElementById("graph");
    if (!svg) return;

    // Очищаем весь график (кроме осей)
    const elementsToRemove = svg.querySelectorAll("rect, path, polygon, circle");
    elementsToRemove.forEach(el => el.remove());

    const r = Number($("[id$='r'] input").val().replace(',', '.'));
    console.log(r);
    if (isNaN(r)) return;

    // Масштабный коэффициент (120px соответствует R=5)
    const scale = 120 / 5;

    // Рисуем фигуры с новым масштабом
    drawShapes(svg, r, scale);

    // Рисуем точки
    drawPoints();

    // Обновляем подписи осей
    updateAxisLabels(r);
}

function drawShapes(svg, r, scale) {
    const centerX = 200;
    const centerY = 200;

    // 1. Прямоугольник (x ∈ [-R/2, 0], y ∈ [0, R])
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", (centerX - scale * r / 2).toString());
    rect.setAttribute("y", (centerY - scale * r).toString());
    rect.setAttribute("width", (scale * r / 2).toString());
    rect.setAttribute("height", (scale * r).toString());
    rect.setAttribute("fill", "deepskyblue");
    rect.setAttribute("fill-opacity", "0.6");
    rect.setAttribute("stroke", "black");
    svg.appendChild(rect);

    // 2. Полукруг (правая нижняя часть круга радиуса R)
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d",
        `M ${centerX} ${centerY}
     L ${centerX + r * scale} ${centerY}
     A ${r * scale} ${r * scale} 0 0 1 ${centerX} ${centerY + r * scale}
     Z`);
    path.setAttribute("fill", "deepskyblue");
    path.setAttribute("fill-opacity", "0.6");
    path.setAttribute("stroke", "black");
    svg.appendChild(path);



    // 3. Треугольник (нижняя правая часть, повернут относительно оси X)
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points",
        `${centerX},${centerY} 
         ${centerX - r/2 * scale},${centerY} 
         ${centerX},${centerY + scale * r/2}`);
    polygon.setAttribute("fill", "deepskyblue");
    polygon.setAttribute("fill-opacity", "0.6");
    polygon.setAttribute("stroke", "black");
    svg.appendChild(polygon);
}



// Функция для обновления подписей осей
function updateAxisLabels(r) {
    const svg = document.getElementById("graph");
    if (!svg) return;

    // Удаляем старые подписи
    const oldLabels = svg.querySelectorAll(".axis-label");
    oldLabels.forEach(label => label.remove());

    const centerX = 200;
    const centerY = 200;
    const scale = 120 / 5 * r;

    // Добавляем новые подписи
    addAxisLabel(svg, centerX - scale, centerY + 5, "-R");
    addAxisLabel(svg, centerX - scale/2, centerY + 5, "-R/2");
    addAxisLabel(svg, centerX + scale/2, centerY + 5, "R/2");
    addAxisLabel(svg, centerX + scale, centerY + 5, "R");

    addAxisLabel(svg, centerX - 25, centerY - scale, "R");
    addAxisLabel(svg, centerX - 25, centerY - scale/2, "R/2");
    addAxisLabel(svg, centerX - 25, centerY + scale/2, "-R/2");
    addAxisLabel(svg, centerX - 25, centerY + scale, "-R");
}

// Вспомогательная функция для добавления подписи
function addAxisLabel(svg, x, y, text) {
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x.toString());
    label.setAttribute("y", y.toString());
    label.setAttribute("class", "axis-label");
    label.setAttribute("font-size", "12");
    label.textContent = text;
    svg.appendChild(label);
}

// Модифицированная функция drawPoints
const drawPoints = () => {
    const svg = document.getElementById("graph");
    if (!svg) return;

    // Очищаем только точки (не фигуры)
    const oldPoints = svg.querySelectorAll(".point");
    oldPoints.forEach(point => point.remove());

    const currentR = Number($("[id$='r'] input").val().replace(',', '.'));

    console.log('currentR: ', currentR);
    const table = document.getElementById("resultsTable");

    if (isNaN(currentR) || !table) return;

    const baseScale = 120 / 5; // Базовый масштаб (120px = 5 единицам)

    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const x = parseFloat(row.cells[0].textContent.trim());
        const y = parseFloat(row.cells[1].textContent.trim());
        const pointR = parseFloat(row.cells[2].textContent.trim());
        const result = row.cells[3].textContent.trim() === 'внутри';

        if (isNaN(x) || isNaN(y) || isNaN(pointR)) continue;

        // Масштабируем координаты с учетом pointR и currentR
        // Формула: (x / pointR) * currentR — приводит точку к текущему R
        const scaledX = (x / pointR) * currentR;
        const scaledY = (y / pointR) * currentR;

        // Переводим в SVG-координаты
        const svgX = 200 + scaledX * baseScale;
        const svgY = 200 - scaledY * baseScale;

        console.log("mnjn")

        const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        point.setAttribute("class", "point");
        point.setAttribute("cx", svgX.toString());
        point.setAttribute("cy", svgY.toString());
        point.setAttribute("r", "4");
        point.setAttribute("fill", result ? "green" : "red");
        point.setAttribute("stroke", "black");

        svg.appendChild(point);
    }
};

function updateGraph() {


    console.log('updating graph...');

    redrawGraph();
    drawPoints();
    
}

function drawPoint(x, y, color) {
    if (isNaN(x) || isNaN(y)) {
        console.log('Invalid data in drawPoint:', x, y);
        return;
    }
    console.log('in drawPoint: ', x,y,color);
    const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    point.setAttribute("cx", x);
    point.setAttribute("cy", y);
    point.setAttribute("r", "3");
    point.setAttribute("fill", color);
    point.setAttribute("class", "graph-point");
    svgElement.appendChild(point);
}

function removePoints(){

    console.log('removing points');    
    const svg = document.getElementById('graph');
    const oldPoints = svg.querySelectorAll('.point');
    console.log(oldPoints);
    if (oldPoints.length > 0) {
        oldPoints.forEach(point => point.remove());
    }
    updateGraph()
}

document.addEventListener("DOMContentLoaded", function () {
    const pointForm = document.getElementById('pointForm');

    pointForm.addEventListener('input', function(event) {
        if (event.target.name === 'pointForm:r') {
            const newR = parseFloat(event.target.value);
            console.log('R change detected. New R:', newR); 
            updateGraph();
            console.log('graph updated!');
        }
    });
});
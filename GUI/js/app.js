/**
 * ========================================================================
 * APLICACIÓN WEB - Calculadora Sísmica NEC-15
 * ========================================================================
 * Lógica de interfaz de usuario y manejo de eventos
 */

// Variables globales
let currentResults = null;
let spectrumChart = null;
let spectrumChart2 = null;
let forcesChart = null;

// ========================================================================
// INICIALIZACIÓN
// ========================================================================

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Event listeners para tabs
    setupTabs();

    // Event listeners para formulario
    setupForm();

    // Event listeners para botones
    setupButtons();

    // Event listeners para modal
    setupModal();

    // Generar campos iniciales
    generateFloors();

    // Cargar tema guardado
    loadTheme();
}

// ========================================================================
// NAVEGACIÓN POR TABS
// ========================================================================

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remover clase active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Agregar clase active al seleccionado
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// ========================================================================
// FORMULARIO Y VALIDACIONES
// ========================================================================

function setupForm() {
    const form = document.getElementById('seismicForm');
    const generateFloorsBtn = document.getElementById('generateFloors');
    const nPisosInput = document.getElementById('nPisos');

    // Generar campos al cambiar número de pisos
    generateFloorsBtn.addEventListener('click', generateFloors);
    nPisosInput.addEventListener('change', generateFloors);

    // Submit del formulario
    form.addEventListener('submit', handleFormSubmit);
}

function generateFloors() {
    const nPisos = parseInt(document.getElementById('nPisos').value) || 3;
    const container = document.getElementById('floorsContainer');

    container.innerHTML = '';

    for (let i = 1; i <= nPisos; i++) {
        const floorRow = document.createElement('div');
        floorRow.className = 'floor-row';
        floorRow.innerHTML = `
            <div class="floor-label">Piso ${i}</div>
            <div class="form-group">
                <label>Altura (m)</label>
                <input type="number" step="0.1" min="0.1" 
                       class="altura" value="3.0" required>
            </div>
            <div class="form-group">
                <label>Peso (t)</label>
                <input type="number" step="0.1" min="0.1" 
                       class="peso" value="100" required>
            </div>
        `;
        container.appendChild(floorRow);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Mostrar indicador de carga
    showLoading();

    // Recolectar datos del formulario
    const params = collectFormData();

    // Validar datos
    if (!validateInput(params)) {
        hideLoading();
        return;
    }

    // Ejecutar cálculos
    try {
        currentResults = NEC15.calcularCompleto(params);

        // Mostrar resultados
        displayResults(currentResults);

        // Generar gráficas
        generateCharts(currentResults);

        // Cambiar a tab de resultados
        document.querySelector('[data-tab="results"]').click();

        // Mostrar botones de exportación
        document.getElementById('exportButtons').style.display = 'flex';

        hideLoading();

    } catch (error) {
        console.error('Error en cálculo:', error);
        alert('Error al realizar el cálculo. Verifique los datos ingresados.');
        hideLoading();
    }
}

function collectFormData() {
    // Parámetros del sitio
    const zona = document.getElementById('zona').value;
    const suelo = document.getElementById('suelo').value;
    const region = document.getElementById('region').value;

    // Características de la estructura
    const nPisos = parseInt(document.getElementById('nPisos').value);
    const alturas = Array.from(document.querySelectorAll('.altura')).map(input => parseFloat(input.value));
    const pesos = Array.from(document.querySelectorAll('.peso')).map(input => parseFloat(input.value));

    // Sistema estructural
    const sistema = document.getElementById('sistema').value;

    // Factores de diseño
    const R = parseFloat(document.getElementById('factorR').value);
    const I = parseFloat(document.getElementById('factorI').value);
    const fiP = parseFloat(document.getElementById('fiP').value);
    const fiE = parseFloat(document.getElementById('fiE').value);

    return {
        zona, suelo, region,
        nPisos, alturas, pesos,
        sistema, R, I, fiP, fiE
    };
}

function validateInput(params) {
    if (!params.zona || !params.suelo || !params.region || !params.sistema) {
        alert('Por favor complete todos los parámetros requeridos');
        return false;
    }

    if (params.nPisos < 1 || params.nPisos > 50) {
        alert('El número de pisos debe estar entre 1 y 50');
        return false;
    }

    if (params.alturas.some(h => h <= 0)) {
        alert('Todas las alturas deben ser mayores a 0');
        return false;
    }

    if (params.pesos.some(p => p <= 0)) {
        alert('Todos los pesos deben ser mayores a 0');
        return false;
    }

    return true;
}

// ========================================================================
// MOSTRAR RESULTADOS
// ========================================================================

function displayResults(results) {
    const container = document.getElementById('resultsContainer');

    const html = `
        <div class="results-grid">
            <div class="result-card">
                <div class="result-label">Periodo Fundamental</div>
                <div class="result-value">
                    ${results.resultados.T1.toFixed(4)}
                    <span class="result-unit">seg</span>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-label">Sa(T₁)</div>
                <div class="result-value">
                    ${results.resultados.Sa_T1.toFixed(4)}
                    <span class="result-unit">g</span>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-label">Coeficiente Sísmico</div>
                <div class="result-value">
                    ${results.resultados.C.toFixed(4)}
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-label">Cortante Basal</div>
                <div class="result-value">
                    ${results.resultados.V.toFixed(2)}
                    <span class="result-unit">t</span>
                </div>
            </div>
        </div>
        
        <div class="card mt-lg">
            <h3>Parámetros de Entrada</h3>
            <table class="forces-table">
                <tr>
                    <th>Parámetro</th>
                    <th>Valor</th>
                </tr>
                <tr>
                    <td>Zona Sísmica</td>
                    <td>${results.entrada.zona} (Z=${NEC15.getZ(results.entrada.zona)})</td>
                </tr>
                <tr>
                    <td>Tipo de Suelo</td>
                    <td>${results.entrada.suelo}</td>
                </tr>
                <tr>
                    <td>Región</td>
                    <td>${results.entrada.region} (η=${NEC15.getEta(results.entrada.region)})</td>
                </tr>
                <tr>
                    <td>Número de Pisos</td>
                    <td>${results.entrada.nPisos}</td>
                </tr>
                <tr>
                    <td>Altura Total</td>
                    <td>${results.entrada.hn.toFixed(2)} m</td>
                </tr>
                <tr>
                    <td>Peso Total</td>
                    <td>${results.entrada.W.toFixed(2)} t</td>
                </tr>
            </table>
        </div>
        
        <div class="card mt-lg">
            <h3>Resultados del Análisis</h3>
            <table class="forces-table">
                <tr>
                    <th>Parámetro</th>
                    <th>Valor</th>
                </tr>
                <tr>
                    <td>Factor de reducción (f)</td>
                    <td>${results.resultados.f.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Coeficiente mínimo (C_min)</td>
                    <td>${results.resultados.C_min.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Coeficiente final (C)</td>
                    <td>${results.resultados.C.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>V/W (%)</td>
                    <td>${results.resultados.porcentaje_peso.toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>T₁ límite (1.3×Ta)</td>
                    <td>${results.validaciones.T1_limite.toFixed(4)} seg</td>
                </tr>
                <tr>
                    <td>Validación cortante</td>
                    <td>${results.validaciones.mensaje_cortante}</td>
                </tr>
            </table>
        </div>
        
        <div class="card mt-lg">
            <h3>Distribución de Fuerzas Laterales</h3>
            <p><strong>Exponente k:</strong> ${results.distribucion.k.toFixed(3)}</p>
            <table class="forces-table">
                <thead>
                    <tr>
                        <th>Nivel</th>
                        <th>Altura (m)</th>
                        <th>Fuerza (t)</th>
                        <th>% del V</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.distribucion.fuerzas.map((fuerza, i) => `
                        <tr>
                            <td>Piso ${i + 1}</td>
                            <td>${results.distribucion.Hi[i].toFixed(2)}</td>
                            <td>${fuerza.toFixed(2)}</td>
                            <td>${results.distribucion.porcentajes[i].toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2"><strong>TOTAL</strong></td>
                        <td><strong>${results.resultados.V.toFixed(2)}</strong></td>
                        <td><strong>100%</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// ========================================================================
// GRÁFICAS
// ========================================================================

function generateCharts(results) {
    generateSpectrumChart(results);
    generateSpectrumChart2(results);
    generateForcesChart(results);
}

function generateSpectrumChart(results) {
    const ctx = document.getElementById('spectrumChart');

    // Destruir gráfica anterior si existe
    if (spectrumChart) {
        spectrumChart.destroy();
    }

    // Crear gráfica combinada (Elastic / Inelastic Spectrum)
    spectrumChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: results.espectro.T,
            datasets: [
                {
                    label: 'Elastic Response Spectrum',
                    data: results.espectro.Sa_elastico,
                    borderColor: 'rgb(0, 0, 255)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Inelastic Response Spectrum',
                    data: results.espectro.Sa_inelastico,
                    borderColor: 'rgb(255, 0, 0)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 40,
                        font: {
                            size: 11
                        },
                        color: '#000'
                    }
                },
                title: {
                    display: true,
                    text: 'Elastic / Inelastic Spectrum',
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Arial'
                    },
                    color: 'rgb(220, 20, 60)',
                    padding: {
                        top: 5,
                        bottom: 10
                    }
                },
                subtitle: {
                    display: true,
                    text: `Zona: ${results.entrada.zona}   Suelos: ${results.entrada.suelo}  Region ${results.entrada.region}`,
                    font: {
                        size: 12,
                        weight: 'normal',
                        family: 'Arial'
                    },
                    color: 'rgb(0, 0, 255)',
                    padding: {
                        bottom: 10
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'T (seg)',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        color: '#000'
                    },
                    min: 0,
                    max: 4,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) { return Number.isInteger(value) ? value : ''; },
                        color: '#000',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Sa (g)',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        color: '#000'
                    },
                    min: 0,
                    ticks: {
                        color: '#000',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

function generateSpectrumChart2(results) {
    const ctx = document.getElementById('spectrumChart2');

    // Destruir gráfica anterior si existe
    if (spectrumChart2) {
        spectrumChart2.destroy();
    }

    // Crear gráfica de espectro inelástico con T1
    spectrumChart2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: results.espectro.T,
            datasets: [
                {
                    label: 'Inelastic Response Spectrum',
                    data: results.espectro.Sa_inelastico,
                    borderColor: 'rgb(255, 0, 0)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'T1',
                    data: [
                        { x: results.resultados.T1, y: 0 },
                        { x: results.resultados.T1, y: results.resultados.Sa_T1 }
                    ],
                    borderColor: 'rgb(0, 0, 255)',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 40,
                        font: {
                            size: 11
                        },
                        color: '#000'
                    }
                },
                title: {
                    display: true,
                    text: 'Inelastic Spectrum',
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Arial'
                    },
                    color: 'rgb(220, 20, 60)',
                    padding: {
                        top: 5,
                        bottom: 10
                    }
                },
                subtitle: {
                    display: true,
                    text: `Zona: ${results.entrada.zona}   Suelos: ${results.entrada.suelo}`,
                    font: {
                        size: 12,
                        weight: 'normal',
                        family: 'Arial'
                    },
                    color: 'rgb(0, 0, 255)',
                    padding: {
                        bottom: 10
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'T (seg)',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        color: '#000'
                    },
                    min: 0,
                    max: 4,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) { return Number.isInteger(value) ? value : ''; },
                        color: '#000',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Sa (g)',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        color: '#000'
                    },
                    min: 0,
                    ticks: {
                        color: '#000',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

function generateForcesChart(results) {
    const ctx = document.getElementById('forcesChart');

    // Destruir gráfica anterior si existe
    if (forcesChart) {
        forcesChart.destroy();
    }

    const labels = results.distribucion.fuerzas.map((_, i) => `Piso ${i + 1}`);

    forcesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Fuerza Lateral (t)',
                data: results.distribucion.fuerzas,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: `Distribución de Fuerzas Laterales - Cortante Basal V = ${results.resultados.V.toFixed(2)} t`,
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Nivel',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Fuerza (t)',
                        font: { size: 14, weight: 'bold' }
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// ========================================================================
// BOTONES Y ACCIONES
// ========================================================================

function setupButtons() {
    // Botón reset
    document.getElementById('resetBtn').addEventListener('click', resetForm);

    // Botón ejemplo
    document.getElementById('exampleBtn').addEventListener('click', loadExample);

    // Botón exportar PDF
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);

    // Botón guardar proyecto
    document.getElementById('exportJSON').addEventListener('click', exportToJSON);

    // Botón cambiar tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Botón ayuda
    document.getElementById('helpBtn').addEventListener('click', showHelp);
}

function resetForm() {
    document.getElementById('seismicForm').reset();
    generateFloors();
    document.getElementById('resultsContainer').innerHTML = '<p class="placeholder">Complete los datos y presione "Calcular" para ver los resultados.</p>';
    document.getElementById('exportButtons').style.display = 'none';
    document.querySelector('[data-tab="input"]').click();
}

function loadExample() {
    // Cargar ejemplo de Quito
    document.getElementById('zona').value = 'V';
    document.getElementById('suelo').value = 'B';
    document.getElementById('region').value = 'Sierra';
    document.getElementById('nPisos').value = '3';
    document.getElementById('sistema').value = 'porticos_ha';
    document.getElementById('factorR').value = '8';
    document.getElementById('factorI').value = '1.5';
    document.getElementById('fiP').value = '1.0';
    document.getElementById('fiE').value = '1.0';

    generateFloors();

    // Configurar alturas y pesos
    const alturas = document.querySelectorAll('.altura');
    const pesos = document.querySelectorAll('.peso');
    alturas.forEach(input => input.value = '3.0');
    pesos.forEach(input => input.value = '96.0');

    alert('Ejemplo cargado: Edificio de 3 pisos en Quito');
}

async function exportToPDF() {
    if (!currentResults) {
        alert('Primero debe realizar un cálculo.');
        return;
    }

    const btn = document.getElementById('exportPDF');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>⏳</span> Generando...';
    btn.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let y = margin;

        // 1. Título y Encabezado
        pdf.setFontSize(18);
        pdf.setTextColor(30, 64, 175); // Azul primario
        pdf.text('Reporte de Cálculo Sísmico NEC-15', pageWidth / 2, y, { align: 'center' });
        y += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Fecha: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' });
        y += 15;

        // 2. Capturar Tablas de Resultados (html2canvas)
        // Aseguramos que el contenedor sea visible para capturarlo bien
        const resultsContainer = document.getElementById('resultsContainer');

        // Ocultar botones temporalmente del canvas si estuvieran dentro (no lo están, pero por seguridad)
        const canvas = await html2canvas(resultsContainer, {
            scale: 2, // Mejor resolución
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Comprobar si cabe en la página, si no, nueva página
        if (y + imgHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
        y += imgHeight + 10;

        // 3. Agregar Gráficas
        // --- FIX: Mostrar temporalmente la pestaña de gráficas para que Chart.js pueda exportarlas ---
        const graphsTab = document.getElementById('graphs');
        const originalDisplay = graphsTab.style.display;
        const originalPosition = graphsTab.style.position;
        const originalLeft = graphsTab.style.left;

        // Forzar visualización fuera de pantalla para que tengan dimensiones
        graphsTab.style.display = 'block';
        graphsTab.style.position = 'absolute';
        graphsTab.style.left = '-9999px';

        try {
            // Función auxiliar para agregar imagen de gráfica
            const addChartToPdf = (chart, title) => {
                if (!chart) return;

                // Verificar espacio
                const chartHeight = 80; // Altura estimada en el PDF
                if (y + chartHeight + 20 > pageHeight - margin) {
                    pdf.addPage();
                    y = margin;
                }

                // Título de la gráfica
                pdf.setFontSize(12);
                pdf.setTextColor(0);
                pdf.text(title, margin, y + 5);
                y += 10;

                const chartImg = chart.toBase64Image();

                // Relación de aspecto del chart
                // Asumimos un ancho fijo y altura proporcional, pero limitada
                const chartW = pageWidth - (margin * 2);
                const chartH = chartHeight;

                pdf.addImage(chartImg, 'PNG', margin, y, chartW, chartH);
                y += chartH + 10;
            };

            addChartToPdf(spectrumChart, 'Espectro Elástico e Inelástico');
            addChartToPdf(spectrumChart2, 'Espectro Inelástico (Diseño) y T1');
            addChartToPdf(forcesChart, 'Distribución de Fuerzas Laterales');
        } catch (chartError) {
            console.error('Error al agregar gráficas:', chartError);
            // Continuar sin gráficas
        } finally {
            // Restaurar estado original de la pestaña
            graphsTab.style.display = originalDisplay;
            graphsTab.style.position = originalPosition;
            graphsTab.style.left = originalLeft;
        }

        // Pie de página
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            pdf.text(`Página ${i} de ${totalPages} - Generado por Calculadora NEC-15`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        // Descargar
        pdf.save(`Reporte_NEC15_${new Date().toISOString().slice(0, 10)}.pdf`);

    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('Hubo un error al generar el PDF. Por favor intente nuevamente.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function exportToJSON() {
    if (!currentResults) {
        alert('No hay resultados para exportar');
        return;
    }

    const dataStr = JSON.stringify(currentResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proyecto_sismico_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// ========================================================================
// TEMA (MODO OSCURO)
// ========================================================================

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Actualizar ícono
    const icon = document.querySelector('.theme-icon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const icon = document.querySelector('.theme-icon');
    icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// ========================================================================
// MODAL
// ========================================================================

function setupModal() {
    const modal = document.getElementById('helpModal');
    const closeBtn = modal.querySelector('.close');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function showHelp() {
    const modal = document.getElementById('helpModal');
    modal.classList.add('show');
}

// ========================================================================
// UTILIDADES
// ========================================================================

function showLoading() {
    // Implementar indicador de carga
    console.log('Calculando...');
}

function hideLoading() {
    console.log('Cálculo completado');
}

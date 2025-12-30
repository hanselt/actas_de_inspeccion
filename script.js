// Configuración de autoguardado para Tablets
const formFields = [
    'acta_correlativo', 'modalidad', 'fecha', 'expediente', 'rd', 
    'nombre_proyecto', 'director', 'coarpe', 'residente', 
    'conservador', 'localidad', 'distrito', 'conclusiones', 'recomendaciones'
];

document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    
    // Escuchar cambios en cualquier campo para guardar automáticamente
    formFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                saveData();
                showIndicator();
            });
        }
    });
});

function saveData() {
    const data = {};
    formFields.forEach(id => {
        data[id] = document.getElementById(id).value;
    });
    localStorage.setItem('acta_current_draft', JSON.stringify(data));
}

function loadSavedData() {
    const saved = localStorage.getItem('acta_current_draft');
    if (saved) {
        const data = JSON.parse(saved);
        formFields.forEach(id => {
            if (data[id]) document.getElementById(id).value = data[id];
        });
    }
}

function showIndicator() {
    const indicator = document.getElementById('save-indicator');
    indicator.style.opacity = '1';
    setTimeout(() => { indicator.style.opacity = '0'; }, 2000);
}

function clearForm() {
    if (confirm('¿Está seguro de borrar todos los campos del acta actual?')) {
        localStorage.removeItem('acta_current_draft');
        location.reload();
    }
}

// Función principal de exportación
function exportToPDF() {
    const element = document.getElementById('pdf-area');
    const filename = document.getElementById('acta_correlativo').value || 'acta-inspeccion';

    // Configuración optimizada para A4
    const opt = {
        margin: [15, 15, 15, 15],
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 3, 
            letterRendering: true, 
            useCORS: true 
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // UI Feedback para el usuario en tablet
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = 'Generando...';
    btn.disabled = true;

    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerText = originalText;
        btn.disabled = false;
    });
}
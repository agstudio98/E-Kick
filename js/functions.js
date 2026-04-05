/* --- THREE.JS ADVANCED HERO --- */
let scene, camera, renderer, mainMesh, wireMesh;

function init3D() {
    const canvas = document.getElementById('canvas-hero');
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Geometría: TorusKnot para el "diagrama"
    const geometry = new THREE.TorusKnotGeometry(10, 3, 150, 20);
    
    // Material 1: Sólido sutil (Normal para colores técnicos)
    const material = new THREE.MeshNormalMaterial({ 
        transparent: true, 
        opacity: 0.1,
        wireframe: false
    });
    
    // Material 2: Wireframe marcado (Brutalista)
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    mainMesh = new THREE.Mesh(geometry, material);
    wireMesh = new THREE.Mesh(geometry, wireframeMaterial);
    
    scene.add(mainMesh);
    scene.add(wireMesh);

    camera.position.z = 35;

    // Interacción suave con el mouse
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        targetX = (event.clientX - windowHalfX) * 0.001;
        targetY = (event.clientY - windowHalfY) * 0.001;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;

        // Rotación base constante
        mainMesh.rotation.y += 0.002;
        mainMesh.rotation.x += 0.001;
        
        wireMesh.rotation.y = mainMesh.rotation.y;
        wireMesh.rotation.x = mainMesh.rotation.x;

        // Suavizado de movimiento de mouse
        mainMesh.rotation.x += (targetY - mainMesh.rotation.x) * 0.05;
        mainMesh.rotation.y += (targetX - mainMesh.rotation.y) * 0.05;

        // Efecto de "latido" técnico
        const scale = 1 + Math.sin(time) * 0.05;
        wireMesh.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }

    animate();
}

/* --- INTERACCIONES FAQ --- */
function toggleFaq(element) {
    const content = element.querySelector('.faq-content');
    const span = element.querySelector('span');
    
    // Cerrar otros abiertos (opcional, pero queda mas prolijo)
    const allFaqs = document.querySelectorAll('.faq-item');
    allFaqs.forEach(item => {
        if (item !== element) {
            const c = item.querySelector('.faq-content');
            const s = item.querySelector('span');
            c.style.maxHeight = null;
            s.style.transform = "rotate(0deg)";
            s.innerText = "+";
        }
    });

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        span.style.transform = "rotate(0deg)";
        span.innerText = "+";
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        span.style.transform = "rotate(45deg)";
        span.innerText = "+"; // Usamos + rotado 45deg para que parezca una x
    }
}

/* --- BURGER MENU LOGIC --- */
function initMenu() {
    const burger = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-links a');

    if (!burger || !navLinks) return;

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevenir scroll cuando el menú está abierto
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

/* --- EVENT LISTENERS --- */
window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    init3D();
    initMenu();
});

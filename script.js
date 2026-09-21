const botonNo = document.querySelector(".no");

function moverBotonNo() {
    botonNo.style.position = "fixed";

    const anchoBoton = botonNo.offsetWidth;
    const altoBoton = botonNo.offsetHeight;

    const nuevaX = Math.random() * (window.innerWidth - anchoBoton);
    const nuevaY = Math.random() * (window.innerHeight - altoBoton);

    botonNo.style.left = `${nuevaX}px`;
    botonNo.style.top = `${nuevaY}px`;
}

botonNo.addEventListener("mouseover", moverBotonNo);

botonNo.addEventListener("touchstart", function (event) {
    event.preventDefault();
    moverBotonNo();
});

const botonSi = document.querySelector(".si");
const bienvenida = document.querySelector(".bienvenida");
const segundaPantalla = document.querySelector(".segunda-pantalla");
const particulas = document.querySelector(".particulas");

function crearParticulas() {
    if (!particulas) return;

    particulas.innerHTML = "";

    for (let i = 0; i < 55; i++) {
        const particula = document.createElement("span");

        particula.className = "particula";
        particula.style.setProperty("--x", `${Math.random() * 100}%`);
        particula.style.setProperty("--y", `${Math.random() * 100}%`);
        particula.style.setProperty("--tamano", `${2 + Math.random() * 4}px`);
        particula.style.setProperty("--retraso", `${Math.random() * 4}s`);
        particula.style.setProperty("--duracion", `${3 + Math.random() * 5}s`);
        particula.style.setProperty("--movimiento", `${-20 + Math.random() * 40}px`);
        particula.style.setProperty("--opacidad", `${0.35 + Math.random() * 0.65}`);

        particulas.appendChild(particula);
    }
}

let animacionUniverso;

function iniciarUniverso() {
    const canvas = document.querySelector(".universo-canvas");

    if (!canvas) return;

    const contexto = canvas.getContext("2d");
    const estrellas = [];
    const punteros = new Map();
    const ramos = [
    { x: -650, y: -420, escala: 0.7, profundidad: 0.65, mensaje: "Te quiero mucho", fase: 0 },
    { x: 620, y: -500, escala: 0.8, profundidad: 0.75, mensaje: "Qué bonita estás", fase: 1 },
    { x: -850, y: 180, escala: 1, profundidad: 0.9, mensaje: "Gracias por existir", fase: 2 },
    { x: 760, y: 260, escala: 1.1, profundidad: 1, mensaje: "Eres muy especial", fase: 3 },
    { x: -300, y: 700, escala: 0.85, profundidad: 0.8, mensaje: "Nunca dejes de sonreír", fase: 4 },
    { x: 420, y: 760, escala: 1.2, profundidad: 1.1, mensaje: "Que nunca te falten flores", fase: 5 },
    { x: 1250, y: -100, escala: 0.65, profundidad: 0.55, mensaje: "Te mereces cosas bonitas", fase: 6 },
    { x: -1350, y: -180, escala: 0.6, profundidad: 0.5, mensaje: "Siempre eres especial", fase: 7 },

    { x: 1050, y: -780, escala: 0.75, profundidad: 0.7, mensaje: "Tu sonrisa ilumina todo", fase: 8 },
    { x: -1150, y: -720, escala: 0.9, profundidad: 0.85, mensaje: "Eres una persona increíble", fase: 9 },
    { x: 1450, y: 520, escala: 0.7, profundidad: 0.6, mensaje: "Espero que este detalle te haga sonreír", fase: 10 },
    { x: -1500, y: 650, escala: 0.8, profundidad: 0.75, mensaje: "Te mereces toda la felicidad", fase: 11 },
    { x: 300, y: -1050, escala: 1, profundidad: 0.95, mensaje: "Nunca olvides lo valiosa que eres", fase: 12 },
    { x: -500, y: -1100, escala: 0.65, profundidad: 0.55, mensaje: "Que siempre encuentres motivos para sonreír", fase: 13 },
    { x: 1150, y: 950, escala: 0.9, profundidad: 0.8, mensaje: "Siempre tendrás un lugar especial", fase: 14 },
    { x: -1050, y: 1050, escala: 1.15, profundidad: 1, mensaje: "Gracias por hacer el mundo más bonito", fase: 15 },
    { x: 1750, y: -650, escala: 0.55, profundidad: 0.45, mensaje: "Eres única", fase: 16 },
    { x: -1800, y: 300, escala: 0.6, profundidad: 0.5, mensaje: "Te adoro muchísimo", fase: 17 }
];

    let camaraX = 0;
    let camaraY = 0;
    let zoom = 1;
    let ultimoX = 0;
    let ultimoY = 0;
    let distanciaPinchAnterior = null;

    function ajustarCanvas() {
        const escala = window.devicePixelRatio || 1;

        canvas.width = window.innerWidth * escala;
        canvas.height = window.innerHeight * escala;

        contexto.setTransform(escala, 0, 0, escala, 0, 0);
    }

    function crearEstrellas() {
        estrellas.length = 0;

        for (let i = 0; i < 180; i++) {
            estrellas.push({
                x: (Math.random() - 0.5) * 4000,
                y: (Math.random() - 0.5) * 3000,
                radio: Math.random() * 1.8 + 0.3,
                opacidad: Math.random() * Math.PI * 2
            });
        }
    }

    function limitarZoom() {
        zoom = Math.max(0.55, Math.min(2.5, zoom));
    }

    function obtenerPosicionPantalla(objeto) {
        return {
            x: window.innerWidth / 2 + (objeto.x - camaraX) * zoom,
            y: window.innerHeight / 2 + (objeto.y - camaraY) * zoom
        };
    }

    function dibujarTierra() {
        const posicion = obtenerPosicionPantalla({ x: 0, y: 0 });
        const radioBase = Math.min(window.innerWidth, window.innerHeight) * 0.13;
        const radio = radioBase * zoom;

        const gradiente = contexto.createRadialGradient(
            posicion.x - radio * 0.35,
            posicion.y - radio * 0.4,
            radio * 0.1,
            posicion.x,
            posicion.y,
            radio
        );

        gradiente.addColorStop(0, "#72c9ed");
        gradiente.addColorStop(0.65, "#2875b5");
        gradiente.addColorStop(1, "#09284d");

        contexto.save();

        contexto.beginPath();
        contexto.arc(posicion.x, posicion.y, radio, 0, Math.PI * 2);
        contexto.fillStyle = gradiente;
        contexto.shadowColor = "rgba(94, 190, 255, 0.8)";
        contexto.shadowBlur = 30;
        contexto.fill();

        contexto.clip();

        contexto.fillStyle = "rgba(75, 170, 91, 0.85)";

        contexto.beginPath();
        contexto.ellipse(
            posicion.x - radio * 0.28,
            posicion.y - radio * 0.18,
            radio * 0.35,
            radio * 0.2,
            -0.3,
            0,
            Math.PI * 2
        );
        contexto.fill();

        contexto.beginPath();
        contexto.ellipse(
            posicion.x + radio * 0.28,
            posicion.y + radio * 0.2,
            radio * 0.3,
            radio * 0.16,
            0.5,
            0,
            Math.PI * 2
        );
        contexto.fill();

        contexto.restore();
    }

    function dibujarRamo(ramo, tiempo) {
    const posicion = obtenerPosicionPantalla(ramo);
    const escala = ramo.escala * ramo.profundidad * zoom;

    if (
        posicion.x < -180 ||
        posicion.x > window.innerWidth + 180 ||
        posicion.y < -220 ||
        posicion.y > window.innerHeight + 220
    ) {
        return;
    }

    const balanceo = Math.sin(tiempo * 0.001 + ramo.fase) * 0.08;

    contexto.save();
    contexto.translate(posicion.x, posicion.y);
    contexto.rotate(balanceo);
    contexto.scale(escala, escala);

    contexto.globalAlpha = 0.45 + ramo.profundidad * 0.5;
    contexto.shadowColor = "rgba(255, 211, 63, 0.75)";
    contexto.shadowBlur = 18;

    // Tallo
    contexto.beginPath();
    contexto.moveTo(0, 90);
    contexto.quadraticCurveTo(-8, 25, 0, -35);
    contexto.strokeStyle = "#477a3b";
    contexto.lineWidth = 7;
    contexto.lineCap = "round";
    contexto.stroke();

    // Hojas
    contexto.fillStyle = "#477f3d";

    contexto.beginPath();
    contexto.ellipse(-25, 45, 28, 11, -0.45, 0, Math.PI * 2);
    contexto.fill();

    contexto.beginPath();
    contexto.ellipse(25, 25, 28, 11, 0.45, 0, Math.PI * 2);
    contexto.fill();

    // Pétalos
    const petalos = 9;

    for (let i = 0; i < petalos; i++) {
        const angulo = (Math.PI * 2 * i) / petalos;

        contexto.save();
        contexto.rotate(angulo);
        contexto.translate(0, -60);

        contexto.beginPath();
        contexto.ellipse(0, 0, 19, 34, 0, 0, Math.PI * 2);
        contexto.fillStyle = i % 2 === 0 ? "#ffd447" : "#f6bd29";
        contexto.fill();

        contexto.restore();
    }

    // Centro de la flor
    contexto.beginPath();
    contexto.arc(0, 0, 23, 0, Math.PI * 2);
    contexto.fillStyle = "#8f581f";
    contexto.fill();

    contexto.restore();

    dibujarMensaje(ramo, posicion, escala);
}

function dibujarMensaje(ramo, posicion, escala) {
    const visible =
        posicion.x > 0 &&
        posicion.x < window.innerWidth &&
        posicion.y > 0 &&
        posicion.y < window.innerHeight;

    if (!visible || zoom < 0.7) return;

    contexto.save();

    contexto.globalAlpha = Math.min(1, 0.35 + zoom * 0.45);
    contexto.fillStyle = "#fff0a8";
    contexto.font = `${Math.max(12, 15 * escala)}px Georgia`;
    contexto.textAlign = "center";
    contexto.shadowColor = "rgba(255, 218, 105, 0.8)";
    contexto.shadowBlur = 10;

    contexto.fillText(
        ramo.mensaje,
        posicion.x,
        posicion.y + 125 * escala
    );

    contexto.restore();
}

function dibujarRamos(tiempo) {
    for (const ramo of ramos) {
        dibujarRamo(ramo, tiempo);
    }
}

    function dibujar() {
        contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const estrella of estrellas) {
            estrella.opacidad += 0.01;

            const posicion = obtenerPosicionPantalla(estrella);

            if (
                posicion.x < -10 ||
                posicion.x > window.innerWidth + 10 ||
                posicion.y < -10 ||
                posicion.y > window.innerHeight + 10
            ) {
                continue;
            }

            const brillo = (Math.sin(estrella.opacidad) + 1) / 2;

            contexto.beginPath();
            contexto.arc(
                posicion.x,
                posicion.y,
                estrella.radio * zoom,
                0,
                Math.PI * 2
            );

            contexto.fillStyle = `rgba(255, 238, 170, ${0.25 + brillo * 0.65})`;
            contexto.fill();
        }

        function dibujar(timestamp = 0) {
    contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const estrella of estrellas) {
        estrella.opacidad += 0.01;

        const posicion = obtenerPosicionPantalla(estrella);

        if (
            posicion.x < -10 ||
            posicion.x > window.innerWidth + 10 ||
            posicion.y < -10 ||
            posicion.y > window.innerHeight + 10
        ) {
            continue;
        }

        const brillo = (Math.sin(estrella.opacidad) + 1) / 2;

        contexto.beginPath();
        contexto.arc(
            posicion.x,
            posicion.y,
            estrella.radio * zoom,
            0,
            Math.PI * 2
        );

        contexto.fillStyle = `rgba(255, 238, 170, ${0.25 + brillo * 0.65})`;
        contexto.fill();
    }

    dibujarRamos(timestamp);
    dibujarTierra();

    animacionUniverso = requestAnimationFrame(dibujar);
}
        dibujarTierra();
        animacionUniverso = requestAnimationFrame(dibujar);
    }

    canvas.addEventListener("pointerdown", (evento) => {
        canvas.setPointerCapture(evento.pointerId);
        punteros.set(evento.pointerId, evento);

        ultimoX = evento.clientX;
        ultimoY = evento.clientY;

        if (punteros.size === 2) {
            const valores = [...punteros.values()];
            distanciaPinchAnterior = Math.hypot(
                valores[0].clientX - valores[1].clientX,
                valores[0].clientY - valores[1].clientY
            );
        }
    });

    canvas.addEventListener("pointermove", (evento) => {
        punteros.set(evento.pointerId, evento);

        if (punteros.size === 1) {
            const desplazamientoX = evento.clientX - ultimoX;
            const desplazamientoY = evento.clientY - ultimoY;

            camaraX -= desplazamientoX / zoom;
            camaraY -= desplazamientoY / zoom;

            ultimoX = evento.clientX;
            ultimoY = evento.clientY;
        }

        if (punteros.size === 2) {
            const valores = [...punteros.values()];
            const distanciaActual = Math.hypot(
                valores[0].clientX - valores[1].clientX,
                valores[0].clientY - valores[1].clientY
            );

            if (distanciaPinchAnterior) {
                zoom *= distanciaActual / distanciaPinchAnterior;
                limitarZoom();
            }

            distanciaPinchAnterior = distanciaActual;
        }
    });

    function finalizarPuntero(evento) {
        punteros.delete(evento.pointerId);

        if (punteros.size < 2) {
            distanciaPinchAnterior = null;
        }
    }

    canvas.addEventListener("pointerup", finalizarPuntero);
    canvas.addEventListener("pointercancel", finalizarPuntero);

    canvas.addEventListener(
        "wheel",
        (evento) => {
            evento.preventDefault();

            zoom *= evento.deltaY < 0 ? 1.1 : 0.9;
            limitarZoom();
        },
        { passive: false }
    );

    ajustarCanvas();
    crearEstrellas();
    dibujar();

    window.addEventListener("resize", ajustarCanvas);
}

botonSi.addEventListener("click", function () {
    bienvenida.style.display = "none";
    segundaPantalla.style.display = "block";

    iniciarUniverso();
});
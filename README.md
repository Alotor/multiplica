# ¡Multiplica!

Juego para aprender las tablas de multiplicar (del 2 al 9), pensado para móvil y tablet.

- **Frontend only**: sin backend, todo el progreso se guarda en `localStorage`.
- **Funciona offline**: es una PWA; tras la primera visita se puede usar sin conexión e instalar en la pantalla de inicio.
- **Repetición espaciada**: cada operación (p. ej. `3×7`, que cubre también `7×3`) tiene un nivel de dominio 0–5 estilo Leitner. Acertar sube el nivel y aleja la próxima revisión (1, 2, 4, 8, 16 días); fallar lo baja y la hace aparecer enseguida.
- **Sesiones contrarreloj** de 2 o 5 minutos con récord por duración.
- **Curva de dificultad** dentro de la sesión: empieza con operaciones fáciles (tablas del 2, 5, 9), aprieta en el tramo central con las difíciles (3, 7, 8) y termina con fáciles para acabar con buen sabor de boca.
- **Puntuación**: 5/10/15 puntos según dificultad + bonus por racha de aciertos. Al fallar se muestra la solución y la pregunta vuelve a aparecer unas preguntas después.
- **Extras**: 18 mascotas animales que se desbloquean al superar récords (de hámster a dragón), galería de animales, efectos de sonido con WebAudio (con silencio), racha de días jugados, historial de partidas y pantalla de progreso para padres con un mapa de calor del dominio de cada operación.

## Desarrollo

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción en dist/
npm run preview   # sirve el build
```

## Despliegue

Es un sitio estático: sube el contenido de `dist/` a cualquier hosting
(GitHub Pages, Netlify, Cloudflare Pages, un nginx…). Usa rutas relativas
(`base: './'`), así que funciona también en subdirectorios.

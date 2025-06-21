import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/BokehPass.js';

// Fade-in content sections and initialize the 3D background
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('mainContent');
    container.style.opacity = '1';

    const sections = document.querySelectorAll('.hidden');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => observer.observe(section));
    } else {
        sections.forEach(section => section.classList.add('visible'));
    }

    initVortex();
});

function initVortex() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Environment map for refraction
    const envLoader = new THREE.CubeTextureLoader();
    const envMap = envLoader.load([
        'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/env/px.jpg',
        'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/env/nx.jpg',
        'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/env/py.jpg',
        'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/env/ny.jpg',
        'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/env/pz.jpg',
        'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/env/nz.jpg'
    ]);
    scene.background = envMap;

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        envMap: envMap,
        roughness: 0.05,
        transmission: 1.0,
        thickness: 1.0,
        transparent: true,
        side: THREE.DoubleSide
    });

    const sphereGeo = new THREE.SphereGeometry(5, 128, 128);
    const glassSphere = new THREE.Mesh(sphereGeo, glassMaterial);
    scene.add(glassSphere);

    const vortexGeo = new THREE.SphereGeometry(4.9, 128, 128);
    const vortexMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
            varying vec3 vPos;
            void main() {
                vPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vPos;
            void main() {
                float r = length(vPos.xy);
                float angle = atan(vPos.y, vPos.x) + time * 0.5;
                float pattern = sin(8.0 * r - time * 2.0 + angle * 4.0);
                vec3 colorA = vec3(0.2, 0.6, 1.0);
                vec3 colorB = vec3(0.1, 0.0, 0.3);
                vec3 col = mix(colorA, colorB, pattern * 0.5 + 0.5);
                gl_FragColor = vec4(col, 0.6);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const vortex = new THREE.Mesh(vortexGeo, vortexMaterial);
    scene.add(vortex);

    // User interaction controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;

    // Postprocessing passes
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.4, 0.2, 0.85);
    composer.addPass(bloom);
    const dof = new BokehPass(scene, camera, { focus: 5.0, aperture: 0.003, maxblur: 0.01 });
    composer.addPass(dof);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    // Scroll-driven zoom
    window.addEventListener('scroll', () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = window.scrollY / maxScroll;
        camera.position.z = 15 - scrollFraction * 5;
    });

    function animate(time) {
        requestAnimationFrame(animate);
        vortexMaterial.uniforms.time.value = time * 0.001;
        vortex.rotation.y += 0.002;
        controls.update();
        composer.render();
    }
    animate();
}

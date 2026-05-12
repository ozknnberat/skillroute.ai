import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1. Temel Sahne ve Kamera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Fare Kontrolleri (Uzayı çevirmek için)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Dönüşlere yumuşaklık katar
controls.autoRotate = true; // Kendi kendine yavaşça döner
controls.autoRotateSpeed = 1.0;

// 3. Işıklar (Kürelerin parlaması için)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x2563ff, 50, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// 4. Sahte Eğitim Rotası Verisi (Gökay'dan gelecek verinin simülasyonu)
const nodesData = [];
for(let i = 0; i < 15; i++) {
    nodesData.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 15
    });
}

// 5. Küreleri (Dersler) ve Çizgileri (Bağlantılar) Oluştur
const sphereGeo = new THREE.SphereGeometry(0.4, 16, 16);
const sphereMat = new THREE.MeshStandardMaterial({ 
    color: 0x00ffcc, 
    emissive: 0x0088aa, // Hafif parlama efekti
    wireframe: false 
});

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2563ff, transparent: true, opacity: 0.6 });
const points = [];

nodesData.forEach((pos) => {
    // Küreyi (Node) Ekle
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(pos.x, pos.y, pos.z);
    scene.add(sphere);
    
    // Çizgi çizmek için koordinatı kaydet
    points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
});

// Noktaları birbirine bağlayan "Eğitim Yolunu" çiz
const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(lineGeo, lineMaterial);
scene.add(line);

camera.position.z = 15;

// 6. Animasyon Döngüsü
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Fare hareketlerini ve otomatik dönüşü günceller
    renderer.render(scene, camera);
}
animate();

// Ekran boyutuna göre ayarla
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
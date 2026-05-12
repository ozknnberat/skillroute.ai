async function fetchAIAgentData() {
    try {
        const konu = "Siber Güvenlik"; // Kullanıcıdan gelen input buraya bağlanacak
        // IP Adresini kendi GCP Dış IP'n ile değiştir!
        const url = `http://SUNUCU_IP_ADRESIN:8000/generate-all/${konu}?butce=5000`;
        
        console.log("Bulut Zekasına Bağlanılıyor...");
        
        const response = await fetch(url);
        const aiData = await response.json(); // Artık gerçek JSON alıyoruz

        console.log("Zekadan Gelen Veri:", aiData);
        
        const nodes = aiData.education_route.nodes;
        const points = [];

        // 3D Sahneyi temizle (Eskileri sil)
        scene.children = scene.children.filter(c => c.type !== "Mesh" && c.type !== "Line");

        nodes.forEach((node) => {
            const xPos = (node.level * 4) - 5; 
            const yPos = (Math.random() - 0.5) * 8;
            const zPos = (Math.random() - 0.5) * 8;

            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.position.set(xPos, yPos, zPos);
            scene.add(sphere);
            
            points.push(new THREE.Vector3(xPos, yPos, zPos));
        });

        if (points.length > 1) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeo, lineMaterial);
            scene.add(line);
        }
        
        // Donanım Listesini Konsola Yazdır (UI'da basacağız)
        console.log("Alışveriş Tavsiyesi:", aiData.shopping_list.budget_summary);

    } catch (error) {
        console.error("Entegrasyon Hatası:", error);
    }
}
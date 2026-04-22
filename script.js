// Custom Cursor Interaction
const cursor = document.querySelector('.cursor');
let cursorX = 0, cursorY = 0;
let targetCursorX = 0, targetCursorY = 0;

document.addEventListener('mousemove', (e) => {
    targetCursorX = e.clientX;
    targetCursorY = e.clientY;
});

function animateCursor() {
    // Smooth interpolation (lerp)
    cursorX += (targetCursorX - cursorX) * 0.2;
    cursorY += (targetCursorY - cursorY) * 0.2;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Typewriter Effect
const texts = [
    "AI Developer",
    "Machine Learning Engineer",
    "AI Product Builder"
];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
let isDeleting = false;

(function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];

    if (isDeleting) {
        letter = currentText.slice(0, --index);
    } else {
        letter = currentText.slice(0, ++index);
    }

    document.querySelector('.typewriter').textContent = letter;

    let typeSpeed = 100;

    if (isDeleting) {
        typeSpeed /= 2;
    }

    if (!isDeleting && letter.length === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false;
        count++;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
})();

// ID Card Elastic Drag Physics (Natural Office Pendulum)
const dragCard = document.getElementById('profile-card');
const cardWrapper = document.querySelector('.glass-id-card-wrapper');
const lanyard = document.querySelector('.lanyard-glass');

if (dragCard && cardWrapper && lanyard) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let velX = 0, velY = 0;
    let rotation = 0;
    let rotVel = 0;
    let animationFrame;

    // Set origin to the center of the punched hole (15px from top)
    dragCard.style.transformOrigin = '50% 15px';

    // Physics constants
    const gravity = 0.5;
    const friction = 0.96;
    const springStiffness = 0.06;
    const originalLanyardLen = 260;

    function updateTransforms() {
        // dx/dy relative to the anchor at y=-245 (if hole is at 15)
        const dx = currentX;
        const dy = currentY + 260; // 260 is the distance from top anchor to hole center

        const dist = Math.sqrt(dx * dx + dy * dy);
        const scaleY = dist / originalLanyardLen;

        // Angle logic for the pendulum
        const angleRad = Math.atan2(dx, dy);
        const angleDeg = angleRad * (180 / Math.PI);

        // Calculate a 3D Tilt based on velocity and distance
        const tiltX = (velY * 0.8) + (currentY * 0.05);
        const tiltY = (-velX * 0.8) - (currentX * 0.05);

        // Match the card's Z-depth to prevent visual separation
        lanyard.style.transform = `rotate(${-angleDeg}deg) scaleY(${scaleY}) translateZ(1px)`;

        // Add 3D perspective tilt to the card itself, matching Z-depth
        dragCard.style.transform = `translate3d(${currentX}px, ${currentY}px, 1px) rotateZ(${-angleDeg}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Dynamic shadowing based on position
        dragCard.style.boxShadow = `${-currentX / 5}px ${30 - currentY / 5}px 60px rgba(0,0,0,0.5)`;
    }

    dragCard.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        cancelAnimationFrame(animationFrame);
        dragCard.style.transition = 'none';
        lanyard.style.transition = 'none';
        document.body.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const targetX = e.clientX - startX;
        const targetY = e.clientY - startY;

        // Inertia tracking while dragging
        velX = targetX - currentX;
        velY = targetY - currentY;

        currentX = targetX;
        currentY = targetY;

        updateTransforms();
    });

    function animatePendulum() {
        if (isDragging) return;

        // Gravity & Spring Pull towards center
        const springForceX = -currentX * springStiffness;
        const springForceY = -currentY * springStiffness;

        velX += springForceX;
        velY += springForceY + gravity; // Gravity always pulls down slightly

        // Apply friction
        velX *= friction;
        velY *= friction;

        currentX += velX;
        currentY += velY;

        updateTransforms();

        // Stop condition
        if (Math.abs(velX) > 0.01 || Math.abs(currentX) > 0.01 || Math.abs(velY) > 0.01 || Math.abs(currentY) > 0.01) {
            animationFrame = requestAnimationFrame(animatePendulum);
        } else {
            animationFrame = requestAnimationFrame(idleMotion);
        }
    }

    // Add idle floating/parallax motion when not dragged
    function idleMotion() {
        if (isDragging) return;

        const time = Date.now() * 0.001;
        // Subtle floating
        const floatX = Math.sin(time * 0.5) * 5;
        const floatY = Math.cos(time * 0.3) * 5;

        // Subtle mouse parallax
        const parallaxX = (targetCursorX - window.innerWidth / 2) * 0.02;
        const parallaxY = (targetCursorY - window.innerHeight / 2) * 0.02;

        currentX = floatX + parallaxX;
        currentY = floatY + parallaxY;

        updateTransforms();
        animationFrame = requestAnimationFrame(idleMotion);
    }

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.cursor = 'default';
        animatePendulum();
    });

    // Start idle motion immediately
    idleMotion();
}


// Scroll Reveal & Skill Bars Animation
const revealElements = document.querySelectorAll('.reveal, .skill-bars .fill');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.classList.contains('fill')) {
                entry.target.style.transform = "scaleX(1)";
            }
        }
    });
};

const revealOptions = {
    threshold: 0.15
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Projects Modal Logic
const projectsData = {
    'modal-smartburn': {
        title: 'SmartBurn Crawler',
        description: 'SmartBurn Crawler is a compact agricultural machine designed to manage crop residue efficiently and reduce the environmental impact of stubble burning. The system combines a crawler-based mobility platform for stable operation on uneven farmland and slopes (20°–30°) with a multi-stage processing unit that performs cutting, shredding, and controlled combustion of agricultural waste. A regulated combustion chamber and basic emission control mechanisms help reduce harmful pollutants compared to traditional open-field burning. The design focuses on sustainable residue management, operational safety, and improved field efficiency, offering a practical solution for modern precision agriculture.Integrated agricultural residue management system. Top 10 Finalist at AgriSpark International Hackathon (Bangkok 2025). Designed to provide a sustainable solution to agricultural waste and prevent harmful field burning.',
        tech: ['Robotics', 'Embedded Systems', 'Mechanical Design', 'Crawler Mobility System', 'Combustion Control', 'Sustainable Agriculture Tech'],
        results: 'Recognized internationally for environmental impact and scalable design.'
    },
    'modal-ripple': {
        title: 'Ripple Health Smart Watch',
        description: 'Ripple is a smart wearable system designed to enhance personal safety and health monitoring through an integrated IoT-based platform. The device combines multiple sensors such as SpO₂, motion sensors, and GPS modules to continuously monitor vital parameters and detect abnormal conditions. By leveraging embedded systems and real-time sensor data processing, Ripple can identify potential health risks or emergencies and trigger automated alerts with location information. The project focuses on creating a scalable wearable solution for preventive healthcare, emergency response, and everyday safety, with ongoing prototyping aimed at optimizing power efficiency, sensor accuracy, and reliable connectivity.',
        tech: ['IoT', 'Wearable Technology', 'Machine Learning', 'Embedded Systems', 'Sensor Data Processing', 'HealthTech'],
        results: 'Achieved high accuracy in anomaly detection and minimal latency in alerting.'
    },
    'modal-exam': {
        title: 'AI-Based Exam Paper Corrector',
        description: 'The AI-Based Exam Paper Corrector is a research-driven system designed to automate the evaluation of student answer sheets using Natural Language Processing (NLP) and machine learning techniques. The platform analyzes student responses, compares them with model answers, and determines similarity and relevance to generate consistent scores. By reducing manual grading workload and minimizing evaluator bias, the system aims to improve fairness and efficiency in academic assessments. The project focuses on building a scalable evaluation framework capable of handling both objective and descriptive answers, with ongoing research exploring improved accuracy, dataset expansion, and model optimization for real-world educational deployment.',
        tech: ['Artificial Intelligence', 'Machine Learning', 'Natural Language Processing', 'Text Similarity Analysis', 'Python'],
        results: 'Reduced manual grading time by 80% with high correlation to human graders.'
    },
    'modal-accident': {
        title: 'Social Media Accident Severity Analysis',
        description: 'The Social Media Accident Severity Analysis system is an AI-driven platform designed to detect and analyze road accidents using real-time social media data. The system applies Natural Language Processing (NLP) and sentiment analysis to evaluate posts related to traffic incidents and determine the severity of the situation. By analyzing keywords, sentiment intensity, and contextual information, the platform classifies incidents into different severity levels and helps identify high-risk situations. The solution aims to support traffic management and emergency response systems by enabling faster incident awareness and suggesting alternative routes to reduce congestion and improve road safety.',
        tech: ['Artificial Intelligence', 'Machine Learning', 'Natural Language Processing', 'Sentiment Analysis', 'Python'],
        results: 'Successfully classified accident severity to optimize ambulance routing.'
    },
    'modal-sloweye': {
        title: 'Slow Eye – AI Oculomotor Therapy Platform',
        description: 'A transformative computer vision-based therapy system aimed at providing eye movement training for patients needing oculomotor rehabilitation.',
        tech: ['OpenCV', 'MediaPipe', 'JavaScript', 'Python'],
        results: 'Developed an engaging interface that improves patient adherence to therapy.'
    },
    'modal-speech': {
        title: 'Speech Therapy AI Platform',
        description: 'The Speech Therapy AI Platform is an intelligent web-based system designed to assist individuals in improving their pronunciation, fluency, and speech clarity through AI-driven analysis. The platform uses speech recognition and audio processing models to evaluate spoken words and compare them with expected pronunciation patterns. By providing real-time feedback and corrective suggestions, the system helps users practice speech exercises and track their progress over time. The solution aims to make speech therapy more accessible, scalable, and cost-effective, reducing dependency on continuous in-person therapy while supporting personalized voice rehabilitation.',
        tech: ['Artificial Intelligence', 'Machine Learning', 'Speech Recognition', 'Audio Signal Processing', 'Web Development'],
        results: 'Provided accessible remote therapy tracking for speech pathologists.'
    },
    'modal-aquaponic': {
        title: 'Aquaponic Tank with Automatic Fish Feeder',
        description: 'The Aquaponic Tank with Automatic Fish Feeder is a smart agricultural system designed to integrate aquaculture and hydroponic farming into a single sustainable ecosystem. The system uses IoT-based sensors to monitor critical parameters such as water temperature and pH levels, ensuring optimal conditions for both fish and plant growth. An automated fish feeding mechanism regulates feeding schedules to maintain a balanced aquatic environment while reducing manual intervention. By combining sensor monitoring, automated control, and sustainable farming principles, the project demonstrates a scalable solution for efficient food production and smart agriculture.',
        tech: ['IoT', 'Embedded Systems', 'Sensor Integration', 'Aquaponics', 'Sustainable Agriculture'],
        results: 'Finalist at Inception Prototype Expo. Demonstrates autonomous agricultural sustainability.'
    }
};

const modalContainer = document.getElementById('modal-container');

function openModal(id) {
    const data = projectsData[id];
    if (!data) return;

    modalContainer.innerHTML = `
        <div class="modal-content glass">
            <button class="modal-close" onclick="closeModal()"><i class='bx bx-x'></i></button>
            <h2>${data.title}</h2>
            <div class="modal-tech">
                ${data.tech.map(t => `<span>${t}</span>`).join('')}
            </div>
            <p style="margin: 20px 0; font-size: 1.1rem; color: #ddd;">${data.description}</p>
            <div style="background: rgba(140, 0, 255, 0.1); padding: 15px; border-left: 4px solid var(--primary-color); border-radius: 4px;">
                <strong>Key Results:</strong> ${data.results}
            </div>
        </div>
    `;

    modalContainer.classList.add('active');
}

function closeModal() {
    modalContainer.classList.remove('active');
}

modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
        closeModal();
    }
});

// Three.js Background Animation (Hogwarts Magical Sparks & Fog)
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();

// We want a dark ethereal mystic fog
scene.fog = new THREE.FogExp2(0x000000, 0.000001);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 400;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Particles representing magical golden sparks (lumos)
const particleCount = 2500; // Dense magical atmosphere
const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

// For movement
const particleVelocities = [];
const particleOscillations = [];

for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particleVelocities.push({
        x: (Math.random() - 0.5) * 0.2, // Drifting slowly
        y: Math.random() * 0.8 + 0.2,   // Floating upwards like embers
        z: (Math.random() - 0.5) * 0.2
    });

    particleOscillations.push({
        speed: Math.random() * 0.05 + 0.01,
        angle: Math.random() * Math.PI * 2
    });
}

particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

// Shader material for glowing golden embers
const pMaterial = new THREE.PointsMaterial({
    color: 0xffffff, // Hogwarts Gold
    size: 4,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(particles, pMaterial);
scene.add(particleSystem);

// --- Shooting Stars Implementation ---
const shootingStarCount = 3;
const shootingStars = [];
const shootingStarGeometry = new THREE.BufferGeometry();
const starLines = [];

for (let i = 0; i < shootingStarCount; i++) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    shootingStars.push({
        line: line,
        active: false,
        timer: Math.random() * 200,
        speed: 15 + Math.random() * 10
    });
}
// ------------------------------------

// Resize handler
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Update TagCloud radius if it exists
    if (typeof tagCloud !== 'undefined') {
        const newRadius = window.innerWidth > 768 ? 280 : 180;
        // The TagCloud library usually allows updating options like this
        tagCloud.pause();
        tagCloud = TagCloud(container, myTags, {
            radius: newRadius,
            maxSpeed: "normal",
            initSpeed: "normal",
            direction: 135,
            keep: true
        });
    }
}

// Interactivity (Mouse tracking for parallax effect)
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.15;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.15;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Update particle positions
    const positions = particleSystem.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        // move upwards
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;

        // sine wave oscillation for magical flutter
        particleOscillations[i].angle += particleOscillations[i].speed;
        positions[i * 3] += Math.sin(particleOscillations[i].angle) * 0.5;

        // recycle particles from the bottom when they float too high
        if (positions[i * 3 + 1] > 1000) {
            positions[i * 3 + 1] = -1000;
            positions[i * 3] = Math.random() * 2000 - 1000; // randomized horizontal reset
        }
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;

    // --- Update Shooting Stars ---
    shootingStars.forEach(star => {
        if (!star.active) {
            star.timer -= 1;
            if (star.timer <= 0) {
                star.active = true;
                star.startX = Math.random() * 2000 - 1000;
                star.startY = Math.random() * 1000 + 500;
                star.startZ = Math.random() * 500 - 250;
                star.endX = star.startX - 1000;
                star.endY = star.startY - 1000;
                star.endZ = star.startZ;
                star.progress = 0;
            }
        } else {
            star.progress += 0.02 * (star.speed / 20);
            if (star.progress >= 1) {
                star.active = false;
                star.timer = Math.random() * 300 + 100;
                star.line.material.opacity = 0;
            } else {
                const px = star.startX + (star.endX - star.startX) * star.progress;
                const py = star.startY + (star.endY - star.startY) * star.progress;
                const pz = star.startZ + (star.endZ - star.startZ) * star.progress;

                const tailLen = 150;
                const tx = star.startX + (star.endX - star.startX) * Math.max(0, star.progress - 0.1);
                const ty = star.startY + (star.endY - star.startY) * Math.max(0, star.progress - 0.1);
                const tz = star.startZ + (star.endZ - star.startZ) * Math.max(0, star.progress - 0.1);

                const positions = new Float32Array([px, py, pz, tx, ty, tz]);
                star.line.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                star.line.geometry.attributes.position.needsUpdate = true;

                // Fade in/out
                star.line.material.opacity = Math.sin(star.progress * Math.PI) * 0.8;
            }
        }
    });
    // ----------------------------

    // Smooth Parallax camera movement based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    // Gently rotate the entire scene for a cosmic floating effect
    scene.rotation.y += 0.001;

    renderer.render(scene, camera);
}

animate();

// Skills 3D Sphere (TagCloud)
const container = '.sphere';
const techIcons = {
    'Python': '<i class="bx bxl-python" style="color: #00e5ff; font-size: 3rem;"></i>',
    'OpenCV': '<i class="bx bx-camera" style="color: #ffffff; font-size: 3rem;"></i>',
    'TensorFlow': '<span style="font-size: 2.2rem; font-weight: bold; color: #ff9900;">TF</span>',
    'Scikit-learn': '<span style="font-size: 2.2rem; font-weight: bold; color: #f7931e;">SK</span>',
    'C / C++': '<i class="bx bxl-c-plus-plus" style="color: #00599c; font-size: 3rem;"></i>',
    'HTML': '<i class="bx bxl-html5" style="color: #e34f26; font-size: 3rem;"></i>',
    'React.js': '<i class="bx bxl-react" style="color: #00e5ff; font-size: 3rem;"></i>',
    'Node.js': '<i class="bx bxl-nodejs" style="color: #888888; font-size: 3rem;"></i>',
    'JavaScript': '<i class="bx bxl-javascript" style="color: #f7df1e; font-size: 3rem;"></i>',
    'PHP': '<i class="bx bxl-php" style="color: #777bb4; font-size: 3rem;"></i>',
    'SQL': '<i class="bx bx-data" style="color: #f29111; font-size: 3rem;"></i>',
    'NoSQL': '<span style="font-size: 1.8rem; font-weight: bold; color: #47a248;">NoSQL</span>',
    'MongoDB': '<i class="bx bxl-mongodb" style="color: #47a248; font-size: 3rem;"></i>',
    'Data Analysis': '<i class="bx bx-bar-chart-alt-2" style="color: #00e5ff; font-size: 3rem;"></i>',
    'Machine Learning': '<i class="bx bx-brain" style="color: #ffffff; font-size: 3rem;"></i>',
    'AI Concepts': '<i class="bx bx-chip" style="color: #00e5ff; font-size: 3rem;"></i>',
    'Statistics': '<i class="bx bx-stats" style="color: #ff3366; font-size: 3rem;"></i>',
    'Classification': '<i class="bx bx-layer" style="color: #ffcc00; font-size: 3rem;"></i>',
    'Sentiment Analysis': '<i class="bx bx-message-rounded-dots" style="color: #ffffff; font-size: 3rem;"></i>',
    'MySQL': '<i class="bx bx-server" style="color: #00758f; font-size: 3rem;"></i>',
    'Pandas': '<span style="font-size: 2.2rem; font-weight: bold; color: #ffffff;">PD</span>',
    'NumPy': '<span style="font-size: 2.2rem; font-weight: bold; color: #013243;">NP</span>',
    'Jupyter': '<i class="bx bx-book-bookmark" style="color: #f37626; font-size: 3rem;"></i>',
    'Power BI': '<span style="font-size: 2.2rem; font-weight: bold; color: #f2c811;">BI</span>',
    'Excel': '<i class="bx bxs-file-blank" style="color: #107c41; font-size: 3rem;"></i>',
    'Tableau': '<span style="font-size: 2.2rem; font-weight: bold; color: #e97627;">TB</span>',
    'Web Security': '<i class="bx bx-shield-quarter" style="color: #ff3333; font-size: 3rem;"></i>',
    'API': '<i class="bx bx-plug" style="color: #00e5ff; font-size: 3rem;"></i>',
    'Git': '<i class="bx bxl-git" style="color: #f05032; font-size: 3rem;"></i>',
    'GitHub': '<i class="bx bxl-github" style="color: #ffffff; font-size: 3rem;"></i>',
    'SDLC': '<i class="bx bx-refresh" style="color: #44ff44; font-size: 3rem;"></i>',
    'Debugging': '<i class="bx bx-bug" style="color: #ff4444; font-size: 3rem;"></i>'
};

const myTags = Object.keys(techIcons);

var tagCloud = TagCloud(container, myTags, {
    radius: window.innerWidth > 768 ? 280 : 180,
    maxSpeed: "normal",
    initSpeed: "normal",
    direction: 135,
    keep: true
});

document.addEventListener("DOMContentLoaded", () => {
    const checkExist = setInterval(function () {
        const list = document.querySelectorAll(".sphere .tagcloud--item");
        if (list.length) {
            clearInterval(checkExist);
            list.forEach(el => {
                const text = el.innerText;
                if (techIcons[text]) {
                    el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;">
                        ${techIcons[text]}
                        <span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">${text}</span>
                    </div>`;
                }

                el.style.transition = "all 0.3s ease";
                let originalColor = '';

                el.addEventListener("mouseenter", () => {
                    const icon = el.firstElementChild.querySelector("i") || el.firstElementChild.querySelector("span");
                    const spanNodes = el.firstElementChild.querySelectorAll("span");
                    const spanLabel = spanNodes.length > 1 ? spanNodes[1] : spanNodes[0];

                    if (icon) {
                        originalColor = icon.style.color;
                        icon.style.color = "#ffffff";
                    }
                    if (spanLabel) spanLabel.style.color = "#ffffff";

                    el.style.transform = "scale(1.3)";
                    el.style.zIndex = "100";
                });

                el.addEventListener("mouseleave", () => {
                    const icon = el.firstElementChild.querySelector("i") || el.firstElementChild.querySelector("span");
                    const spanNodes = el.firstElementChild.querySelectorAll("span");
                    const spanLabel = spanNodes.length > 1 ? spanNodes[1] : spanNodes[0];

                    if (icon && originalColor) {
                        icon.style.color = originalColor;
                    }
                    if (spanLabel) spanLabel.style.color = "#e0e0e0";

                    el.style.transform = "scale(1)";
                    el.style.zIndex = "1";
                });
            });
        }
    }, 100);

    // Mobile Menu Toggle Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('bx-menu');
            hamburger.querySelector('i').classList.toggle('bx-x');
            e.stopPropagation();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.add('bx-menu');
                hamburger.querySelector('i').classList.remove('bx-x');
            }
        });

        // Close menu when link is clicked
        const navItems = document.querySelectorAll('.nav-links li a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.add('bx-menu');
                hamburger.querySelector('i').classList.remove('bx-x');
            });
        });
    }
});

import os

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if 'div class="skills-grid reveal"' in line:
        start_idx = i
    if '<!-- Projects Section -->' in line:
        end_idx = i - 1  # Before the section tag

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + [
        '        <div class="sphere-container reveal" style="display: flex; justify-content: center; align-items: center; min-height: 500px; overflow: visible;">\n',
        '            <span class="sphere"></span>\n',
        '        </div>\n'
    ] + lines[end_idx:]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

# Add TagCloud CDN
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

if 'TagCloud.min.js' not in content:
    content = content.replace('<script src="script.js"></script>', '<script src="https://cdn.jsdelivr.net/npm/TagCloud@2.2.0/dist/TagCloud.min.js"></script>\n    <script src="script.js"></script>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)

tagcloud_script = '''
// Skills 3D Sphere (TagCloud)
const container = '.sphere';
const myTags = [
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bxl-python" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">Python</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bxl-javascript" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">JavaScript</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bx-code-alt" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">C/C++</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bxl-react" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">React.js</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bxl-nodejs" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">Node.js</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bx-brain" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">ML & AI</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bx-camera" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">Computer Vision</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bx-data" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">SQL & DBMS</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bxl-mongodb" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">MongoDB</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><i class="bx bxl-git" style="color: #ffffff; font-size: 3rem;"></i><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">Git Version</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><span style="font-size: 2.2rem; font-weight: bold; color: #ffffff;">TF</span><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">TensorFlow</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><span style="font-size: 2.2rem; font-weight: bold; color: #ffffff;">PD</span><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">Pandas</span></div>',
    '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px;"><span style="font-size: 2.2rem; font-weight: bold; color: #ffffff;">BI</span><span style="font-size: 0.9rem; margin-top: 5px; font-family:var(--font-head);">Power BI</span></div>'
];

var tagCloud = TagCloud(container, myTags, {
    radius: window.innerWidth > 768 ? 260 : 180,
    maxSpeed: "fast",
    initSpeed: "fast",
    direction: 135,
    keep: true,
    useHTML: true
});

document.addEventListener("DOMContentLoaded", () => {
    const checkExist = setInterval(function() {
        const list = document.querySelectorAll(".sphere .tagcloud--item");
        if (list.length) {
            clearInterval(checkExist);
            list.forEach(el => {
                el.style.transition = "all 0.3s ease";
                el.addEventListener("mouseenter", () => {
                    if (el.firstElementChild.querySelector("i, span")) {
                        el.firstElementChild.querySelectorAll("i, span").forEach(child => child.style.color = "#888888");
                    }
                    el.style.transform = "scale(1.2)";
                });
                el.addEventListener("mouseleave", () => {
                    if (el.firstElementChild.querySelector("i, span")) {
                        el.firstElementChild.querySelectorAll("i, span").forEach(child => child.style.color = "#ffffff");
                    }
                    el.style.transform = "scale(1)";
                });
            });
        }
    }, 100);
});
'''

with open('script.js', 'r', encoding='utf-8') as f:
    if "const container = '.sphere';" not in f.read():
        with open('script.js', 'a', encoding='utf-8') as fa:
            fa.write('\\n' + tagcloud_script + '\\n')

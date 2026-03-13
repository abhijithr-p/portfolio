import sys

with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_css = """
/* Profile Card Styles */
.profile-card-container {
    width: 100%;
    max-width: 380px;
    height: 480px;
    position: relative;
    transform-style: preserve-3d;
}

.profile-card {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.1s ease-out; /* Smooth follow */
}

.profile-card-content {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6), inset 0 0 20px rgba(140, 0, 255, 0.1);
    overflow: hidden;
    border-radius: 24px;
}

.profile-glow {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: var(--primary-color);
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    pointer-events: none;
    z-index: 1;
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    transform: translateZ(30px);
    z-index: 5;
    margin-bottom: 30px;
}

.profile-image-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.profile-image i {
    font-size: 3.5rem;
    color: var(--secondary-color);
}

.profile-status {
    background: rgba(0, 255, 128, 0.1);
    color: #4CAF50;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(0, 255, 128, 0.2);
}
.status-dot {
    width: 8px;
    height: 8px;
    background-color: #4CAF50;
    border-radius: 50%;
    box-shadow: 0 0 8px #4CAF50;
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

.profile-info {
    transform: translateZ(50px);
    z-index: 5;
}

.profile-name {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 5px;
    letter-spacing: 0.5px;
}

.profile-title {
    font-size: 1.1rem;
    color: var(--secondary-color);
    margin-bottom: 25px;
    font-weight: 400;
}

.profile-divider {
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.0) 100%);
    margin-bottom: 25px;
}

.profile-details {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #cbd5e1;
    font-size: 0.95rem;
}

.detail-item i {
    font-size: 1.2rem;
    color: rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.05);
    padding: 8px;
    border-radius: 8px;
}
"""

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if line.startswith("/* ID Card Styles */"):
        start_idx = i
    if line.startswith(".id-issued {"):
        end_idx = i + 3 # line + 3 lines to capture closing brace

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + [new_css + "\n"] + lines[end_idx:]
    with open('style.css', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("CSS updated successfully.")
else:
    print(f"Could not find indices: start={start_idx}, end={end_idx}")

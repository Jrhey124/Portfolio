document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleSkills");
    const skillsSection = document.getElementById("skillsSection");

    toggleButton.addEventListener("click", function () {
        skillsSection.style.display = skillsSection.style.display === "none" ? "block" : "none";
    });

    tsParticles.load("tsparticles", {
        fullScreen: { enable: true },
        particles: {
            number: { value: 50 },
            color: { value: "#66c0f4" },
            shape: { type: "circle" },
            opacity: { value: 0.6 },
            size: { value: 3 },
            move: { enable: true, speed: 1 }
        },
        interactivity: {
            events: {
                onhover: { enable: true, mode: "repulse" }
            }
        }
    });
});

function showModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

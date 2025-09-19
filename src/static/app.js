document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft =
          details.max_participants - details.participants.length;

        // Create participants HTML with delete icons instead of bullet points
        const participantsHTML =
          // Function to fetch activities from API
          async function fetchActivities() {
            try {
              const response = await fetch("/activities");
              const activities = await response.json();

              // Clear loading message
              activitiesList.innerHTML = "";

              // Mostrar actividades con botón de registro individual
              Object.entries(activities).forEach(([name, details]) => {
                const activityCard = document.createElement("div");
                activityCard.className = "activity-card";

                const spotsLeft = details.max_participants - details.participants.length;

                // Participantes
                const participantsHTML =
                  details.participants.length > 0
                    ? `<div class="participants-section">
                        <h5>Participantes:</h5>
                        <ul class="participants-list">
                          ${details.participants
                            .map(
                              (email) =>
                                `<li><span class="participant-email">${email}</span><button class="delete-btn" data-activity="${name}" data-email="${email}">❌</button></li>`
                            )
                            .join("")}
                        </ul>
                      </div>`
                    : `<p><em>Aún sin participantes</em></p>`;

                activityCard.innerHTML = `
                  <h4>${name}</h4>
                  <p>${details.description}</p>
                  <p><strong>Horario:</strong> ${details.schedule}</p>
                  <p><strong>Disponibilidad:</strong> ${spotsLeft} lugares libres</p>
                  <div class="participants-container">
                    ${participantsHTML}
                  </div>
                  <div class="register-section">
                    <input type="email" class="register-email" placeholder="Correo del estudiante" />
                    <button class="register-btn" data-activity="${name}">Registrar estudiante</button>
                  </div>
                `;

                activitiesList.appendChild(activityCard);
              });

              // Eliminar participante
              document.querySelectorAll(".delete-btn").forEach((button) => {
                button.addEventListener("click", async (e) => {
                  const activity = button.getAttribute("data-activity");
                  const email = button.getAttribute("data-email");
                  if (confirm(`¿Eliminar a ${email} de ${activity}?`)) {
                    try {
                      const response = await fetch(`/activities/${activity}/participants/${email}`, {
                        method: "DELETE",
                      });
                      if (response.ok) {
                        fetchActivities();
                      } else {
                        alert("Error eliminando participante");
                      }
                    } catch {
                      alert("Error eliminando participante");
                    }
                  }
                });
              });

              // Registrar estudiante desde cada tarjeta
              document.querySelectorAll(".register-btn").forEach((button) => {
                button.addEventListener("click", async (e) => {
                  const activity = button.getAttribute("data-activity");
                  const emailInput = button.parentElement.querySelector(".register-email");
                  const email = emailInput.value.trim();
                  if (!email) {
                    messageDiv.textContent = "Por favor ingresa el correo del estudiante.";
                    messageDiv.className = "message error";
                    messageDiv.classList.remove("hidden");
                    return;
                  }
                  try {
                    const response = await fetch(`/activities/${activity}/participants`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });
                    if (response.ok) {
                      messageDiv.textContent = "¡Registro exitoso!";
                      messageDiv.className = "message success";
                      messageDiv.classList.remove("hidden");
                      fetchActivities();
                      emailInput.value = "";
                    } else {
                      const error = await response.json();
                      messageDiv.textContent = error.detail || "Error al registrar.";
                      messageDiv.className = "message error";
                      messageDiv.classList.remove("hidden");
                    }
                  } catch {
                    messageDiv.textContent = "Error de red.";
                    messageDiv.className = "message error";
                    messageDiv.classList.remove("hidden");
                  }
                });
              });
            });

  // Inicializar app
  fetchActivities();
});

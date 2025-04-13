document.addEventListener("DOMContentLoaded", () => {
    const {
      eventsRef,
      leaderboardRef,
      registrationsRef,
      onValue,
      push
    } = window.firebaseRefs;
  
    const eventList = document.getElementById("eventList");
    const eventSelect = document.getElementById("eventSelect");
    const registerForm = document.getElementById("registerForm");
    const registrationStatus = document.getElementById("registrationStatus");
  
    function loadEvents() {
      onValue(eventsRef, (snapshot) => {
        const events = snapshot.val();
        if (!events) {
          eventList.innerHTML = "<p>No events available.</p>";
          return;
        }
        eventList.innerHTML = "";
        eventSelect.innerHTML = "<option disabled selected>Select an event</option>";
        for (let id in events) {
          const event = events[id];
          const div = document.createElement("div");
          div.innerHTML = `<h3>${event.title}</h3><p><strong>${event.date}</strong></p><p>${event.desc}</p>`;
          eventList.appendChild(div);
  
          const option = document.createElement("option");
          option.value = id;
          option.textContent = event.title;
          eventSelect.appendChild(option);
        }
      });
    }
  
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const eventId = eventSelect.value;
      if (name && email && eventId) {
        const regData = { name, email, eventId, timestamp: Date.now() };
        push(registrationsRef, regData);
        registrationStatus.innerHTML = `<p>✅ ${name}, you are registered successfully!</p>`;
        registerForm.reset();
      } else {
        registrationStatus.innerHTML = `<p style='color:red'>❌ Please complete all fields!</p>`;
      }
    });
  
    function loadLeaderboard() {
      const leaderboardContainer = document.getElementById("leaderboardContent");
      onValue(leaderboardRef, (snapshot) => {
        const data = snapshot.val();
        leaderboardContainer.innerHTML = "";
        for (let event in data) {
          const div = document.createElement("div");
          div.innerHTML = `<h3>${event}</h3>
            <p>🥇 1st: ${data[event]["1st"]}</p>
            <p>🥈 2nd: ${data[event]["2nd"]}</p>
            <p>🥉 3rd: ${data[event]["3rd"]}</p>`;
          leaderboardContainer.appendChild(div);
        }
      });
    }
  
    function startCountdown() {
      const countdown = document.getElementById("countdown");
      const eventDate = new Date("April 25, 2025 10:00:00").getTime();
      setInterval(() => {
        const now = new Date().getTime();
        const diff = eventDate - now;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          countdown.innerHTML = `<p>🎉 Starts in: ${days} days, ${hours} hours</p>`;
        } else {
          countdown.innerHTML = "<p>🎊 Amiphoria 2025 is Live!</p>";
        }
      }, 1000);
    }
  
    loadEvents();
    loadLeaderboard();
    startCountdown();
  });
  
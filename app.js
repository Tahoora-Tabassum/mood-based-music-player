// Store all mood data
const moodData = {
  happy: {
    emoji: "😊",
    title: "Happy",
    quote: "Happiness is not something ready-made. It comes from your own actions.",
    music: [
      {title: "Waka Waka - Shakira", url: "https://www.youtube.com/results?search_query=waka+waka+shakira" },
      { title: "Good as Hell - Lizzo", url: "https://www.youtube.com/results?search_query=good+as+hell+lizzo" },
      { title: "Walking on Sunshine - Katrina & The Waves", url: "https://www.youtube.com/results?search_query=walking+on+sunshine" },
      { title: "Don't Stop Me Now - Queen", url: "https://www.youtube.com/results?search_query=dont+stop+me+now+queen" }
    ]
  },
  sad: {
    emoji: "😢",
    title: "Sad",
    quote: "Sadness is but a wall between two gardens.",
    music: [
      { title: "Let Me Down Slowly - Alec Benjamin", url: "https://youtu.be/50VNCymT-Cs?si=TuimZ2e3e8YOAX99"},
      { title: "Love Is Gone - Dylan Matthew", url: "https://youtu.be/mv23MnaNvGM?si=K6rDq0b3W8Z9-AEE"},
      { title: "Only Love Can Hurt - Paloma Faith", url: "https://youtu.be/d2GOjxA8HQ4?si=k0XEzMgMN141CUPc"},
      {title: "Broken Angel - Arash", url: "https://youtu.be/3pXrVb5vW1o?si=1Yk2b0b1bJH6q8ZK"}
    ]
  },
  motivated: {
    emoji: "💪",
    title: "Motivated",
    quote: "The only way to do great work is to love what you do.",
    music: [
      {title: "Unstoppable - Sia", url: "https://youtu.be/YaEG2aWJnZ8?si=uBy3tz_-Qw4RbYc4" },
      { title: "Eye of the Tiger - Survivor", url: "https://youtu.be/btPJPFnesV4?si=XPSlC57yHFexwYkf" },
      { title: "Stronger - Kanye West", url: "https://youtu.be/cNld-AHw-Wg?si=uWJ7sGBRDqL1jAuC" },
      { title: "Power - 50 Cent", url: "https://youtu.be/HhRTkLnd7LY?si=eWkOmBLDsW6zBNjS" }
    ]
  },
  stressed: {
    emoji: "😰",
    title: "Stressed",
    quote: "Breathe. Let go. Remind yourself that this too shall pass.",
    music: [
      {title: "Suzume no Tojimari - Suzume", url: "https://youtu.be/qal34e9v_pk?si=gWg2um2F09gC6GtN" },
      { title: "Weightless - Marconi Union", url: "https://youtu.be/DOT1LmQbFFA?si=80unLBwusQiBQQnc" },
      { title: "Peaceful Piano - Various Artists", url: "https://youtu.be/WJ3-F02-F_Y?si=sQolTLYOvJnhLlID" },
      { title: "Meditation - Enya", url: "https://youtu.be/owjKyXmAXTs?si=xMXMIozYMz4uZ1xx" }
    ]
  }
};

// Get elements
const closeBtn = document.getElementById("closeBtn");
const moodButtons = document.querySelectorAll(".mood-btn");
const cardSection = document.getElementById("cardSection");
const moodEmoji = document.getElementById("moodEmoji");
const moodTitle = document.getElementById("moodTitle");
const quote = document.getElementById("quote");
const musicList = document.getElementById("musicList");

closeBtn.addEventListener("click", () => {
  cardSection.style.display = "none";  // hides the existing popup
});
closeBtn.addEventListener("click", () => {
  cardSection.style.display = "none";  // hides the popup
});

// Add click event to mood buttons
moodButtons.forEach(button => {
  button.addEventListener("click", function() {
    const mood = this.getAttribute("data-mood");
    displayMood(mood);
  });
});

// Display mood content
function displayMood(mood) {
  const data = moodData[mood];
  
  if (data) {
    moodEmoji.textContent = data.emoji;
    moodTitle.textContent = data.title;
    quote.textContent = data.quote;
    
    // Update music list
    musicList.innerHTML = "";
    data.music.forEach(song => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${song.url}" target="_blank">${song.title}</a>`;
      musicList.appendChild(li);
    });
   // Show card section
    cardSection.style.display = "block";
  }
}

// Music player buttons (simple actions)
document.getElementById("playBtn").addEventListener("click", function() {
  alert("▶️ Playing music...");
});

document.getElementById("pauseBtn").addEventListener("click", function() {
  alert("⏸️ Paused");
});

document.getElementById("nextBtn").addEventListener("click", function() {
  alert("⏭️ Skipped to next track");
});

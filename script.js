let slideIndex = 1;

document.addEventListener("DOMContentLoaded", () => {
    showSlides(slideIndex); // initialize image carousel
    updateUI(); // set initial voting numbers to 0
});

// setting up slideshow logic
function plusSlides(n) { showSlides(slideIndex += n); }

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    //loop slides wif index exceeds limits
    if (n > slides.length) {slideIndex = 1}     
    if (n < 1) {slideIndex = slides.length}

    for (let i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
    for (let i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }
    if (slides[slideIndex-1]) {
        slides[slideIndex-1].style.display = "block";  
        dots[slideIndex-1].className += " active";
    }
}

// setting up voting Logic
const counts = { midori: 0, zenzero: 0, shiru: 0 };
const feed = []; //array for storing vote history

function updateUI() {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    for (const cat of Object.keys(counts)) {
        const countEl = document.querySelector(`[data-count="${cat}"]`);
        const pctEl = document.querySelector(`[data-pct="${cat}"]`);
        if (countEl) countEl.textContent = counts[cat];
        if (pctEl) {
          //prevent division by zero
            const pct = total === 0 ? 0 : Math.round((counts[cat] / total) * 100);
            pctEl.textContent = `${pct}%`;
        }
    }
}

//event listener for cat cards on vote page
document.getElementById("catGrid")?.addEventListener("click", (e) => {
  //find button even if user clicks on image instead
    const card = e.target.closest("button[data-cat]");
    if (!card) return;
    const cat = card.dataset.cat;
    counts[cat]++; //add vote to total
    document.getElementById("statusText").textContent = `Voted: ${cat}. Total: ${Object.values(counts).reduce((a, b) => a + b, 0)}`;
    
    // update results
    feed.unshift({ cat, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
    feed.splice(8); //keep only the 8 most recent votes
    const feedList = document.getElementById("feedList");
    feedList.innerHTML = feed.map(item => `<li>${item.cat} vote — ${item.time}</li>`).join('');
    
    updateUI(); // update numbers after each vote
});
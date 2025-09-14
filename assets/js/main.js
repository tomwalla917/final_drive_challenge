// --- Capstone Challenge: Football Adventure ---
document.getElementById('startBtn').addEventListener('click', startGame);

function startGame() {
  // Prompt for name, specialty
  let name = prompt("Enter your name:");
  if (!name) {
    alert("You are required to enter a name!");
    return;
  }
  let specialty = prompt("Choose 'passing' or 'running' for your specialty");
  if (!specialty) {
    alert("You must select a specialty");
    return;
  }
  specialty = specialty.trim().toLowerCase();
  if (specialty !== "passing" && specialty !== "running") {
    alert("specialty must be either 'passing' or 'running'.");
    return;
  }

  alert("You are on the 50 yard line and must make it to the endzone (50 yards) to win. You have 6 plays.");

  // Utility function: returns a random integer from 0 up to (but not including) max
  const randInt = (max) => Math.floor(Math.random() * max);

  // Constructor for Player
  class Player {
    constructor(name, specialty) {
      this.name = name;
      this.specialty = specialty;
      this.plays = [];
      this.yard = 50; // Starting at 50 yard line
      this.playsUsed = 0;
      this.maxPlays = 6;
    }
    
    // Method to add a play to the player's collection
    addPlay(play) {
      this.plays.push(play);
      this.playsUsed++;
    }
    
    // Method to get a summary of the player's stats
    getStats() {
      const playNames = this.plays.map(play => play.name);
      return `${this.name} (${this.specialty}) | Yard Line: ${this.yard} | Plays Used: ${this.playsUsed}/${this.maxPlays} | Last Plays: ${playNames.slice(-3).join(", ") || "None"}`;
    }

    // Method to lose yards (never goes below 0)
    loseYards(amount = 5) {
      this.yard = Math.max(0, this.yard + amount);
    }
    
    // Method to gain yards (capped at 100 for endzone)
    gainYards(amount = 10) {
      this.yard = Math.min(100, this.yard - amount);
    }
    
    // Check if player reached endzone
    reachedEndzone() {
      return this.yard <= 0;
    }
    
    // Check if player is out of plays
    outOfPlays() {
      return this.playsUsed >= this.maxPlays;
    }
  }

  // Array of possible play choices (each is an object)
  const playChoices = [
    { name: "Run middle", baseYards: 6, variance: 2 },
    { name: "Run wide", baseYards: 10, variance: 3 },
    { name: "Short pass", baseYards: 14, variance: 2 },
    { name: "Long pass", baseYards: 20, variance: 5 }
  ];

  const player = new Player(name, specialty);

  // Player creation check
  console.log("Player created:", {
    name: player.name,
    specialty: player.specialty,
    plays: player.plays,
    yard: player.yard
  });

  function getRandomPlay() {
    let randomIndex = randInt(playChoices.length);
    return playChoices[randomIndex];
  }

  function calculateYards(play, playerSpecialty) {
    let baseYards = play.baseYards;
    let variance = play.variance;
    
    // Add specialty bonus
    if ((playerSpecialty === "running" && play.name.includes("Run")) ||
        (playerSpecialty === "passing" && play.name.includes("pass"))) {
      baseYards += 2; // Bonus for specialty
    }
    
    // Random variance (can be positive or negative)
    let randomVariance = randInt(variance * 2 + 1) - variance;
    let totalYards = baseYards + randomVariance;
    
    // Small chance of losing yards (fumble/sack)
    if (randInt(10) === 0) { // 10% chance
      totalYards = -Math.abs(randInt(5) + 1);
    }
    
    return Math.max(-10, totalYards); // Minimum -10 yards lost
  }

  // Utility function: displays the player's stats in the HTML page
  const showStats = player => {
    document.getElementById('stats').textContent = player.getStats();
  };

  // Main game loop
  while (!player.outOfPlays() && !player.reachedEndzone()) {
    let play1 = getRandomPlay();
    let play2 = getRandomPlay();
    
    // Ensure different plays
    while (play1.name === play2.name) {
      play2 = getRandomPlay();
    }
    
    let choice = prompt(`Play ${player.playsUsed + 1} of ${player.maxPlays}\nCurrent position: ${player.yard} yard line\n\nChoose your play:\n1: ${play1.name}\n2: ${play2.name}\n\nEnter 1 or 2:`);

    if (!choice || (choice !== "1" && choice !== "2")) {
      if (!choice) {
        alert("Game ended by player choice.");
        break;
      } else {
        alert("Invalid selection! Enter 1 or 2 to select a play.");
        continue;
      }
    }

    let selectedPlay = choice === "1" ? play1 : play2;
    player.addPlay(selectedPlay);
    
    let yardsGained = calculateYards(selectedPlay, player.specialty);
    let oldYard = player.yard;
    
    if (yardsGained > 0) {
      player.gainYards(yardsGained);
      alert(`${selectedPlay.name} - SUCCESS!\nGained ${yardsGained} yards!\nMoved from ${oldYard} to ${player.yard} yard line.`);
    } else {
      player.loseYards(Math.abs(yardsGained));
      alert(`${selectedPlay.name} - LOSS!\nLost ${Math.abs(yardsGained)} yards!\nMoved from ${oldYard} to ${player.yard} yard line.`);
    }
    
    showStats(player);
    
    console.log(`${player.name} used ${selectedPlay.name}, yards gained: ${yardsGained}, current position: ${player.yard}`);
  }

  // End game logic
  if (player.reachedEndzone()) {
    let finalPosition = player.yard <= 0 ? "ENDZONE!" : `${player.yard} yard line`;
    alert(`🎉 TOUCHDOWN! 🎉\n${player.name} reached the endzone in ${player.playsUsed} plays!\nFinal position: ${finalPosition}`);
  }  else if (player.outOfPlays()) {
    alert(`😞 Game Over! 😞\n${player.name} ran out of plays!\nFinal position: ${player.yard} yard line\nYou needed to reach the 0 yard line to score.`);
  }
  
  showStats(player);
}
// ============================================
// VERSION AND CACHE RESET
// ============================================
const QUESTIONS_VERSION = 'v5';
const QUIZ_START_DATE = new Date("2025-02-17");

// Unified cache clearing function
function clearCacheAndReload() {
    localStorage.removeItem('dailyQuestions');
    localStorage.removeItem('dailyQuestionsDate');
    localStorage.removeItem('dailyQuestionsVersion');
    localStorage.removeItem('gameState');
    localStorage.removeItem('lastPlayed');
    location.reload();
}

window.addEventListener('load', () => {
    const lastCheck = localStorage.getItem('lastDateCheck');
    const currentDate = new Date().toDateString();
    
    if (lastCheck !== currentDate) {
        localStorage.setItem('lastDateCheck', currentDate);
        clearCacheAndReload();
    }
});

// Add cache control headers
document.head.innerHTML += `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
`;

// Initial cache check
(function() {
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem('dailyQuestionsDate');
    const storedVersion = localStorage.getItem('dailyQuestionsVersion');
    const storedLast = localStorage.getItem('lastPlayed');

    console.debug('Cache check:', { 
        storedDate, 
        storedVersion, 
        today: todayStr, 
        storedLast,
        currentTime: new Date().toLocaleTimeString() 
    });

    if ((storedDate && storedDate !== todayStr) || 
        (storedVersion && storedVersion !== QUESTIONS_VERSION)) {
        clearCacheAndReload();
    }
})();

// Regular interval check (every minute)
setInterval(() => {
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem('dailyQuestionsDate');
    
    if (!storedDate || storedDate !== todayStr) {
        clearCacheAndReload();
    }
}, 60000);

// Midnight reset checker
function checkMidnightReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow - now;
    
    setTimeout(() => {
        clearCacheAndReload();
        checkMidnightReset();
    }, timeUntilMidnight);
}

document.addEventListener('DOMContentLoaded', checkMidnightReset);








// FIXED QUESTION POOL & DAILY SELECTOR
// --------------------------------------
// Define your fixed pool of 35 questions in the desired order.
const questionPool = [
    // Group 1: Questions 1 - 5
    // Question 1:
{
  "question": "Where was the first McDonald's restaurant located?",
  "answer": [33.9471, -118.1182],
  "name": "San Bernardino, California, USA",
  "image": "images/mcdonalds_first.jpg",
  "info": "The first McDonald's opened in 1940 in San Bernardino, California, by Richard and Maurice McDonald, pioneering the fast-food model with the 'Speedee Service System.'"
},
  
    // Question 2:
    {
  "question": "Where exactly was Ernesto 'Che' Guevara executed?",
  "answer": [-18.8314, -64.2164],
  "name": "La Higuera, Vallegrande, Bolivia",
  "image": "images/che_guevara_execution.jpg",
  "info": "Che Guevara was executed on October 9, 1967, in La Higuera, Bolivia, after being captured with CIA support. Nazi war criminal Klaus Barbie played a role in the operation."
},
  
    // Question 3:
    {
  "question": "Where did the Hindenburg disaster occur?",
  "answer": [40.0336, -74.3535],
  "name": "Naval Air Station Lakehurst, New Jersey, USA",
  "image": "images/hindenburg_disaster.jpg",
  "info": "On May 6, 1937, the German airship Hindenburg caught fire and crashed while attempting to land at Naval Air Station Lakehurst, killing 36 people."
},
  
    // Question 4:
    {
  "question": "Where was the first telephone call made?",
  "answer": [42.3593, -71.0574],
  "name": "Bell's Workshop, Boston, Massachusetts, USA",
  "image": "images/first_telephone_call.jpg",
  "info": "The first telephone call was made by Alexander Graham Bell on March 10, 1876, from his workshop in Boston, Massachusetts, when he famously said, 'Mr. Watson, come here, I want to see you.'"
},
  
    // Question 5:
    {
        "question": "Where was the first European settlement in the Americas?",
        "answer": [19.8908, -71.0569],
        "name": "La Isabela, Dominican Republic",
        "image": "images/la_isabela.jpg",
        "info": "La Isabela, founded by Christopher Columbus in 1493, was the first European settlement in the Americas, located on the northern coast of the Dominican Republic."
      },
  
    // Group 2: Questions 6 - 10
    // Question 6:
    {
      question: "In 1914, a political assassination set off a world-changing conflict. Where did it occur?",
      answer: [43.85833474991576, 18.42894146627073],
      name: "Sarajevo, Bosnia and Herzegovina",
      image: "images/sarajevo_assassination.jpg",
      info: "The assassination of Archduke Franz Ferdinand in Sarajevo on June 28, 1914, triggered the events leading to World War I."
    },
  
    // Question 7:
    {
      question: "In 1815, a battle in Europe marked the final defeat of Napoleon Bonaparte. Can you pinpoint the exact coordinates of the battlefield?",
      answer: [50.678668268134196, 4.411857217238671],
      name: "Waterloo, Belgium",
      image: "images/waterloo.jpg",
      info: "The Battle of Waterloo, fought on June 18, 1815, ended Napoleon's rule and marked the end of the Napoleonic Wars."
    },
  
    // Question 8:
    {
      question: "A 1984 chemical disaster exposed 500,000+ people to toxic gas, causing thousands of deaths. Where did it occur?",
      answer: [23.280299141020528, 77.40985172024006],
      name: "Bhopal, India",
      image: "images/bhopal.jpg",
      info: "The Bhopal disaster, caused by a gas leak at a Union Carbide pesticide plant, is considered one of the worst industrial accidents in history."
    },
  
    // Question 9:
    {
      question: "A 1969 music festival, a counterculture landmark with legendary performances, took place at which location?",
      answer: [41.70017623204302, -74.87996781357901],
      name: "Bethel, New York, USA",
      image: "images/woodstock.jpg",
      info: "The Woodstock Festival, held in August 1969, became a symbol of the 1960s counterculture movement and featured performances by legendary artists."
    },
  
    // Question 10:
    {
      question: "Julian Assange was arrested in 2019 after years of asylum at an embassy, ending a high-profile standoff. Where did this happen?",
      answer: [51.50130873871635, -0.17266394049243808],
      name: "Ecuadorian Embassy, London, UK",
      image: "images/ecuadorian_embassy.jpg",
      info: "On April 11, 2019, WikiLeaks founder Julian Assange was arrested by British authorities at the Ecuadorian Embassy in London after Ecuador withdrew his asylum status."
    },
  
    // Group 3: Questions 11 - 15
    // Question 11:
    {
     question: "Considered the world's oldest temple complex, this site predates Stonehenge by millennia and reshapes views on early civilization. Where is it located?",
     answer: [37.22360917058424, 38.92284021054165],
     name: "Göbekli Tepe, Şanlıurfa, Turkey",
     image: "images/gobeklitepe.jpg",
     info: "Göbekli Tepe, dating to around 9600 BCE, reshaped our view of early societies, revealing complex rituals before settled agriculture."
     },
  
    // Question 12:
    {
      question: "A failed invasion attempt was launched here in 1961 by CIA-trained exiles in an effort to overthrow a government. Where did this take place?",
      answer: [22.176129883568084, -81.04344422700221],
      name: "Bay of Pigs, Cuba",
      image: "images/bay_of_pigs.jpg",
      info: "On April 17, 1961, the U.S.-backed Bay of Pigs invasion attempted to overthrow Fidel Castro’s government but ended in failure."
    },
  
    // Question 13:
    {
      question: "The 1972 World Chess Championship, a historic Cold War showdown between Bobby Fischer and Boris Spassky, was held in this city. Where was it?",
      answer: [64.14064248617701, -21.874510561681276],
      name: "Laugardalshöll Arena, Reykjavik, Iceland",
      image: "images/fischer_spassky.jpg",
      info: "The 1972 World Chess Championship between Bobby Fischer and Boris Spassky in Reykjavik, Iceland, was a major Cold War-era event."
    },
  
    // Question 14:
    {
      question: "A mysterious monolith appeared in 2020 at this remote desert location, sparking global curiosity. Can you pinpoint it on the map?",
      answer: [38.34370568767272, -109.66608671164448],
      name: "Utah Monolith Site, USA",
      image: "images/utah_monolith.jpg",
      info: "In late 2020, a strange metallic monolith was discovered in the Utah desert, causing widespread speculation before it mysteriously disappeared."
    },
  
    // Question 15:
    {
      question: "A massive explosion in 2020 devastated this city's port, causing widespread destruction and loss of life. Where did this happen?",
      answer: [33.901389, 35.519167],
      name: "Beirut Port, Lebanon",
      image: "images/beirut_explosion.jpg",
      info: "On August 4, 2020, a warehouse storing ammonium nitrate exploded at the Beirut Port, causing one of the largest non-nuclear blasts in history."
    },
  
    // Group 4: Questions 16 - 20
    // Question 16:
    {
      question: "One of the most controversial psychology experiments took place at this university in 1971, testing the effects of perceived power. Where was it?",
      answer: [37.42863, -122.172996],
      name: "Stanford University, Palo Alto, USA",
      image: "images/stanford_prison.jpg",
      info: "In 1971, the Stanford Prison Experiment, led by Philip Zimbardo, studied power dynamics but was halted over ethical concerns."
    },
  
    // Question 17:
    {
      question: "The first film ever screened for a paying audience was shown at this location in 1895. Can you pinpoint it?",
      answer: [48.870278, 2.329444],
      name: "Salon Indien du Grand Café, Paris, France",
      image: "images/lumiere_screening.jpg",
      info: "On December 28, 1895, the Lumière brothers held the first commercial film screening at the Salon Indien du Grand Café in Paris, marking the birth of cinema."
    },
  
    // Question 18:
    {
     question: "A famous fugitive was found hiding in a secret compound in 2011, leading to a major military operation. What are the coordinates of this location?",
     answer: [34.169333, 73.242444],
     name: "Osama bin Laden's Compound, Abbottabad, Pakistan",
     image: "images/bin_laden_compound.jpg",
     info: "On May 2, 2011, U.S. Navy SEALs conducted Operation Neptune Spear, resulting in the death of Osama bin Laden at a compound in Abbottabad, Pakistan."
    },
  
    // Question 19:
    {
      question: "A secret Cold War facility, built beneath the ice and powered by a nuclear reactor, was meant to house ballistic missiles. Where was this ambitious project located?",
      answer: [77.1667, -61.1333],
      name: "Camp Century, Greenland",
      image: "images/camp_century.jpg",
      info: "Camp Century was a U.S. military base buried under the Greenland ice sheet, part of a top-secret plan called Project Iceworm to deploy nuclear missiles."
    },
  
    // Question 20:
    {
      question: "A mysterious radio signal, believed by some to be of extraterrestrial origin, was detected at this observatory in 1977. Can you identify where the signal was received?",
      answer: [40.2511, -83.0492],
      name: "Big Ear Radio Observatory, Ohio, USA",
      image: "images/big_ear.jpg",
      info: "The 'Wow! signal,' a strong and unexplained radio signal from deep space, was detected by the Big Ear Observatory in Ohio in 1977."
    },
  
    // Group 5: Questions 21 - 25
// Question 21:
{
    question: "A sculpture containing an encrypted message that has remained unsolved for decades stands at this exact location. Can you find it?",
    answer: [38.95227, -77.14573],
    name: "Kryptos Sculpture, CIA Headquarters, Virginia, USA",
    image: "images/kryptos.jpg",
    info: "The Kryptos sculpture at CIA headquarters contains four encoded messages—one of which remains unsolved despite extensive cryptographic efforts."
  },
  
  // Question 22:
  {
    question: "The world's longest-running experiment, started in 1927 to observe the flow of a mysterious substance, is located at this university. Can you find the precise spot?",
    answer: [-27.4975, 153.0137],
    name: "University of Queensland, Brisbane, Australia",
    image: "images/pitch_drop.jpg",
    info: "The Pitch Drop Experiment at the University of Queensland has been continuously running since 1927, demonstrating the viscosity of pitch."
  },
  
  // Question 23:
  {
    question: "One of the last uncontacted tribes on Earth fiercely protects this island, attacking outsiders on sight. Can you locate their exact home?",
    answer: [11.56204405612773, 92.24468100339757],
    name: "North Sentinel Island, Andaman Islands, India",
    image: "images/north_sentinel.jpg",
    info: "North Sentinel Island is home to the Sentinelese, one of the last uncontacted tribes on Earth, who reject all outside contact."
  },
  
  // Question 24:
  {
    question: "Engineers over 2,000 years ago built a device at this location capable of calculating astronomical positions, long before modern computers. Where was it discovered?",
    answer: [35.8897, 23.3078],
    name: "Antikythera Shipwreck, Greece",
    image: "images/antikythera.jpg",
    info: "The Antikythera Mechanism, discovered in an ancient shipwreck, is considered the world's first analog computer, built by Greek engineers around 100 BCE."
  },
  
  // Question 25:
  {
    question: "This small settlement, accessible only by a long sea journey, is the most remote permanently inhabited place on Earth. Can you locate it?",
    answer: [-37.066667, -12.316667],
    name: "Edinburgh of the Seven Seas, Tristan da Cunha",
    image: "images/tristan_da_cunha.jpg",
    info: "Tristan da Cunha is the most isolated inhabited island, located in the South Atlantic, with a population of fewer than 300 people."
  },
  
  // Group 6: Questions 26 - 30
  // Question 26:
  {
    question: "At this location, a natural gas field has been burning continuously for over 50 years, earning it the nickname 'The Door to Hell.' Can you locate it?",
    answer: [40.2525, 58.4396],
    name: "Darvaza Gas Crater, Turkmenistan",
    image: "images/darvaza.jpg",
    info: "The Darvaza Gas Crater has been burning since 1971, after a failed Soviet drilling operation caused the ground to collapse."
  },
  
  // Question 27:
  {
    question: "A high-security vault at this location stores the world’s most important seeds, safeguarding global agriculture against catastrophe. Where is it?",
    answer: [78.23603819612708, 15.494725938944827],
    name: "Svalbard Global Seed Vault, Norway",
    image: "images/seed_vault.jpg",
    info: "The Svalbard Global Seed Vault, buried deep in an Arctic mountain, is designed to protect biodiversity in case of a global disaster."
  },
  
  // Question 28:
  {
    question: "At this unique location, you can physically touch two separate continents at the same time, as the Earth’s crust is slowly pulling them apart. Can you find it?",
    answer: [64.25441620709742, -21.117882898151148],
    name: "Silfra Fissure, Iceland",
    image: "images/silfra.jpg",
    info: "Silfra Fissure is a rift between the North American and Eurasian tectonic plates, where divers can swim between two continents."
  },
  
  // Question 29:
  {
    question: "This is the location where Vincent van Gogh painted his famous work *Starry Night*, while in the asylum during 1889. Can you pinpoint the site?",
    answer: [43.7766337116391, 4.83339010423285],
    name: "Saint-Paul-de-Mausole Asylum, Saint-Rémy-de-Provence, France",
    image: "images/starry_night_van_gogh.jpg",
    info: "Van Gogh created his masterpiece *Starry Night* during his time at the Saint-Paul-de-Mausole Asylum in Saint-Rémy-de-Provence, France."
  },
  
  // Question 30:
  {
    question: "In 1969, The Beatles gave an unplanned rooftop performance at a famous location, marking a milestone in music history. Where did this happen?",
    answer: [51.510417, -0.139722],
    name: "Apple Corps Ltd. Headquarters, London, UK",
    image: "images/beatles_rooftop.jpg",
    info: "This is the location where The Beatles held their final live performance, an impromptu concert on a rooftop in London."
  },
  
    // Group 7: Questions 31 - 35
    // Question 31:
    {
        question: "A secluded presidential retreat, where a landmark Middle East peace agreement was negotiated in 1978, lies in a forested mountainous region. What are its coordinates?",
        answer: [39.64748827674952, -77.46496436991295],
        name: "Camp David, Maryland, USA",
        image: "images/camp_david.jpg",
        info: "The Camp David Accords, brokered by Jimmy Carter, led to a peace treaty between Egypt and Israel."
      },
      
      // Question 32:
      {
        question: "A vast underground army of terracotta soldiers, crafted for a 3rd-century BCE emperor, guards a hidden tomb. What are the coordinates of this archaeological marvel?",
        answer: [34.38424811270382, 109.27974707372914],
        name: "Terracotta Army, Xi'an, China",
        image: "images/terracotta.jpg",
        info: "Discovered in 1974, the Terracotta Army was created to protect China's first emperor, Qin Shi Huang, in the afterlife."
      },
      
      // Question 33:
      {
        question: "In 1928, a serendipitous discovery in a modest laboratory led to the development of a life-saving antibiotic. Can you locate the exact coordinates of this discovery site?",
        answer: [51.517222, -0.173056],
        name: "StMary's Hospital, London, UK",
        image: "images/scientific_discovery.jpg",
        info: "At this laboratory, Alexander Fleming discovered penicillin, revolutionizing medicine and earning him the Nobel Prize in 1945."
      },
      
      // Question 34:
      {
        question: "The stadium hosting the first FIFA World Cup final in 1930 witnessed a host nation victory. What are its coordinates?",
        answer: [-34.894744300827945, -56.153273281057544],
        name: "Estadio Centenario, Montevideo, Uruguay",
        image: "images/estadio_centenario.jpg",
        info: "Uruguay defeated Argentina 4-2 in the inaugural World Cup final, held in front of 93,000 spectators."
      },
      
      // Question 35:
      {
        question: "In 1816, a famous writer conceived one of Gothic fiction's most enduring works during a summer stay at a lakeside villa. Where was it?",
        answer: [46.22038440083739, 6.183875570533945],
        name: "Lake Geneva, Switzerland",
        image: "images/frankenstein_creation.jpg",
        info: "At this location near Lake Geneva, Mary Shelley began writing Frankenstein during the 'Year Without a Summer,' shaping Gothic literature and inspiring horror and sci-fi."
      }
  ];
  
  const imageCreditsPool = [
    // Group 1 (Questions 1-5)
    ["1: Courtesy of National Geographic Historical Archive",        // Q1
     "2: From the Smithsonian Institution Digital Collection",      // Q2
     "3: Provided by World History Photo Database",                // Q3
     "4: From UNESCO World Heritage Digital Archive",              // Q4
     "5: Courtesy of Library of Congress Digital Collection"],      // Q5

    // Group 2 (Questions 6-10)
    ["1: From British Museum Digital Archives",                     // Q6
     "2: Courtesy of European Historical Photo Database",          // Q7
     "3: From Russian State Historical Archive",                   // Q8
     "4: Provided by Asian Heritage Digital Collection",           // Q9
     "5: From African Cultural Heritage Database"],                // Q10

    // Group 3 (Questions 11-15)
    ["1: Courtesy of Australian National Archives",                 // Q11
     "2: From South American Historical Society",                  // Q12
     "3: Provided by Middle Eastern Heritage Foundation",          // Q13
     "4: From Nordic Historical Photo Collection",                 // Q14
     "5: Courtesy of Mediterranean Cultural Archive"],             // Q15

    // Group 4 (Questions 16-20)
    ["1: From Pacific Historical Photo Database",                   // Q16
     "2: Courtesy of Canadian National Archives",                  // Q17
     "3: From Indian Historical Society Collection",               // Q18
     "4: Provided by Southeast Asian Heritage Archive",            // Q19
     "5: From Central American Cultural Database"],                // Q20

    // Group 5 (Questions 21-25)
    ["1: From French National Photo Archives",                      // Q21
     "2: Courtesy of German Historical Society",                   // Q22
     "3: From Italian Cultural Heritage Collection",               // Q23
     "4: Provided by Spanish Royal Archives",                      // Q24
     "5: From Portuguese Maritime Museum"],                        // Q25

    // Group 6 (Questions 26-30)
    ["1: From Mexican National Archives",                          // Q26
     "2: Courtesy of Brazilian Historical Institute",              // Q27
     "3: From Argentine Cultural Heritage Foundation",             // Q28
     "4: Provided by Chilean National Museum",                     // Q29
     "5: From Peruvian Archaeological Archives"],                  // Q30

    // Group 7 (Questions 31-35)
    ["1: From Japanese Imperial Archives",                         // Q31
     "2: Courtesy of Korean Cultural Heritage Administration",     // Q32
     "3: From Chinese Historical Society",                         // Q33
     "4: Provided by Vietnamese National Museum",                  // Q34
     "5: From Thai Royal Collection"]                             // Q35
];

function getDailyImageCredit() {
    const today = new Date();
    const diffDays = Math.floor((today - QUIZ_START_DATE) / (1000 * 60 * 60 * 24));
    const segments = imageCreditsPool.length;
    const segmentIndex = diffDays % segments;
    return imageCreditsPool[segmentIndex];
}





function getDailyQuizNumber() {
    const today = new Date();
    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
    const startMidnight = new Date(QUIZ_START_DATE.setHours(0, 0, 0, 0));
    const diffTime = todayMidnight - startMidnight;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}






function getDailyQuestions() {
    const today = new Date();
    const todayStr = today.toDateString();
    const storedDate = localStorage.getItem('dailyQuestionsDate');

    // Calculate number of days elapsed from QUIZ_START_DATE.
    const diffDays = Math.floor((today - QUIZ_START_DATE) / (1000 * 60 * 60 * 24));
    const segments = Math.floor(questionPool.length / 5);
    const segmentIndex = diffDays % segments;
    const dailySubset = questionPool.slice(segmentIndex * 5, segmentIndex * 5 + 5);

    if (storedDate !== todayStr) {
        localStorage.setItem('dailyQuestionsDate', todayStr);
        localStorage.setItem('dailyQuestions', JSON.stringify(dailySubset));
        localStorage.setItem('dailyQuestionsVersion', QUESTIONS_VERSION);
        return dailySubset;
    } else {
        const storedQuestions = localStorage.getItem('dailyQuestions');
        return storedQuestions ? JSON.parse(storedQuestions) : dailySubset;
    }
}




    
// --------------------------------------
// EXISTING GLOBAL VARIABLES & GAME FUNCTIONS (UNCHANGED)
let marker = null;
let correctMarker = null;
let line = null;
let currentQuestion = 0;
let allGuesses = [];
let allMarkers = [];
let allLines = [];
let map, correctLocation, canGuess = true, totalScore = 0, roundsPlayed = 0;
let currentGuess = null;
let mapClickEnabled = true;
let quizStartTime = null;
let questionStartTimes = [];
let totalGameTime = 0;
const LAST_PLAYED_KEY = 'lastPlayed';
const DAILY_SCORES_KEY = 'dailyScores';

// NEW QUESTIONS INITIALIZATION: Use the daily selector to get 5 questions for today.
let questions = getDailyQuestions();

function showModal() {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'block';
    
    // Add slight delay to ensure proper rendering
    setTimeout(() => {
        adjustModalContent();
    }, 100);
}

// Add these event listeners
window.addEventListener('resize', adjustModalContent);
window.addEventListener('load', adjustModalContent);

function hideModal() {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'none';
}

function adjustModalContent() {
    const modalMap = document.getElementById('modal-map');
    const modalInfo = document.querySelector('.modal-info');

    // Default sizes
    modalMap.style.height = '25vh';
    modalInfo.style.maxHeight = '50vh';

    // Laptop screen adjustments
    if (window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches) {
        modalMap.style.height = '20vh';
        modalInfo.style.maxHeight = '55vh';
    }

    // Force map refresh
    if (modalMapInstance) {
        modalMapInstance.invalidateSize();
    }

    // Adjust text size
    adjustModalTextSize();
}


function saveDailyScore() {
    const today = new Date().toDateString();
    const dailyScores = JSON.parse(localStorage.getItem(DAILY_SCORES_KEY) || '{}');
    const finalTime = Math.min(totalGameTime, 600000);  // Maximum is 10 minutes
    dailyScores[today] = {
        score: totalScore,
        completionTime: finalTime
    };
    localStorage.setItem(DAILY_SCORES_KEY, JSON.stringify(dailyScores));
    localStorage.setItem('dailyGuesses', JSON.stringify(allGuesses));
}







function markAsPlayed() {
    const today = new Date().toDateString();
    localStorage.setItem(LAST_PLAYED_KEY, today);
}


function canPlayToday() {
    // If no 'lastPlayed' key is stored or it is not equal to today's date, return true.
    const lastPlayed = localStorage.getItem('lastPlayed');
    const todayStr = new Date().toDateString();
    return lastPlayed !== todayStr;
}



function markAsPlayed() {
    const today = new Date().toDateString();
    localStorage.setItem(LAST_PLAYED_KEY, today);
}

// Timer variables
let startTime;
let timerInterval;
let elapsedTime = 0; // Track elapsed time in milliseconds
const initialTime = 120000; // 2 minutes in milliseconds
let timeLeft = initialTime; // 2 minutes in milliseconds

// In the saveGameState function, add timeLeft and lastTimerUpdate
function saveGameState() {
    const gameState = {
        currentQuestion: currentQuestion,
        allGuesses: allGuesses,
        totalScore: totalScore,
        quizStartTime: quizStartTime,
        timeLeft: timeLeft,
        lastTimerUpdate: Date.now(), // Add this to track when we saved the time
        totalGameTime: totalGameTime, // <-- Add this line to persist totalGameTime
        completed: false,
        lastAnsweredQuestion: allGuesses.length - 1,
        [LAST_PLAYED_KEY]: new Date().toDateString()
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        const today = new Date().toDateString();

        // If we have a saved game for today which is incomplete, restore it.
        if (state[LAST_PLAYED_KEY] === today && !state.completed) {
            currentQuestion = state.allGuesses ? state.allGuesses.length : 0;
            allGuesses = state.allGuesses || [];
            totalScore = state.totalScore || 0;
            quizStartTime = state.quizStartTime;
            timeLeft = state.timeLeft || initialTime;
            totalGameTime = state.totalGameTime || 0;

            if (!allGuesses[currentQuestion]) {
                startTimer();
            }
            return true;
        }

        // If the saved game is marked complete
        if (state[LAST_PLAYED_KEY] === today && state.completed) {
            currentQuestion = questions.length;
            allGuesses = state.allGuesses || [];
            totalScore = state.totalScore || 0;
            totalGameTime = state.totalGameTime || 0;
            timeLeft = 0;
            clearInterval(timerInterval);
            return true;
        }
    }
    return false;
}







// Modify the game initialization logic
if (!loadGameState()) {
    // Initialize a new game state and save it
    currentQuestion = 0;
    allGuesses = [];
    totalScore = 0;
    quizStartTime = null;
    timeLeft = initialTime;
    saveGameState();
}
// Initial theme setup
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function startTimer() {
    if (!quizStartTime) {
        quizStartTime = Date.now();
    }
    // Record start time for the current question
    questionStartTimes[currentQuestion] = Date.now();
    const offset = initialTime - timeLeft;
    startTime = Date.now() - offset;
    timerInterval = setInterval(updateTimer, 1000);
}



function updateQuestionTime() {
    if (questionStartTimes[currentQuestion]) {
        // Calculate elapsed time for this question, but cap it at 2 minutes (120000 ms)
        const timeSpent = Math.min(Date.now() - questionStartTimes[currentQuestion], 120000);
        totalGameTime += timeSpent;
        // Clear to avoid double-counting
        questionStartTimes[currentQuestion] = null;
    }
}



function formatCompletionTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}



function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    timeLeft = initialTime - elapsedTime;

    if (timeLeft <= 0) {
        stopTimer();
        timeLeft = 0;
        handleTimeout();
    }

    const formattedTime = formatTime(timeLeft);
    document.getElementById('timer').textContent = formattedTime;
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function handleTimeout() {
    if (canGuess) {
        const correctAnswer = questions[currentQuestion].answer;
        updateQuestionTime();  // record time for this timed-out question
        canGuess = false;
        stopTimer();
        timeLeft = 0;
        
        // Get the final guess (either from marker or null)
        let finalGuess = marker ? marker.getLatLng() : null;
        allGuesses[currentQuestion] = finalGuess;
        
        // Calculate score and update displays if there was a marker
        if (finalGuess) {
            const distance = calculateDistance(finalGuess.lat, finalGuess.lng, correctAnswer[0], correctAnswer[1]);
            const roundScore = Math.max(0, Math.round(4000 * (1 - distance / 20000)));
            totalScore += roundScore;
            document.getElementById('distance').textContent = `${Math.round(distance)} km`;
        } else {
            document.getElementById('distance').textContent = `-`;
        }
        document.getElementById('score').textContent = `Score: ${totalScore}`;
        
        // Update button states
        const nextButton = document.querySelector('.next-button');
        nextButton.style.display = 'block';
        document.getElementById('submit-guess').style.display = 'none';
        nextButton.textContent = currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question';
        
        // Show correct location on main map
        if (correctMarker) map.removeLayer(correctMarker);
        correctMarker = L.marker([correctAnswer[0], correctAnswer[1]], { icon: correctIcon }).addTo(map);
        
        // Show modal with correct information
        showGuessAndCorrectLocation(finalGuess, L.latLng(correctAnswer[0], correctAnswer[1]));
        
        // Save game state
        saveGameState();
    }
}





// Icon definitions
const userIcon = L.divIcon({
    className: 'user-guess-pin',
    html: `
        <div class="pin-wrapper">
            <div class="pin-head"></div>
            <div class="pin-point"></div>
        </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const correctIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style='background-color: #2ecc71; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;'></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});






function initializeMap() {
    map = L.map('map', {
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
        center: [50, 10],
        zoom: 3,
        wheelDebounceTime: 150,
        wheelPxPerZoomLevel: 120
    });
    
    // Add this after map initialization
    map.setMaxBounds([
        [-60, -Infinity],
        [80, Infinity]
    ]);

    map.on('drag', function() {
        let center = map.getCenter();
        if (center.lat > 85) {
            center.lat = 85;
            map.panTo([85, center.lng]);
        }
        if (center.lat < -85) {
            center.lat = -85;
            map.panTo([-85, center.lng]);
        }
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
    map.scrollWheelZoom.enable();
    map.on('click', handleGuess);
    let zoomTimeout;
    map.on('zoomend', () => {
      clearTimeout(zoomTimeout);
      zoomTimeout = setTimeout(() => {
        if (correctMarker) {
          updatePinSize(map, correctMarker);
          if (line) { updateLine(); }
        }
      }, 100); // Adjust the delay (in milliseconds) as needed
    });
}


  

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function handleGuess(e) {
    if (!canGuess || !mapClickEnabled) return; // Modified this line

    const userGuess = e.latlng;
    currentGuess = userGuess;

    if (marker && map) {
        map.removeLayer(marker);
    }

    marker = L.marker([userGuess.lat, userGuess.lng], { icon: userIcon }).addTo(map);
    document.getElementById('submit-guess').style.display = 'block';
}

function showGuessAndCorrectLocation(userGuess, correctLatLng) {
    const modal = document.getElementById('info-modal');
    const modalMapContainer = document.getElementById('modal-map');
    const modalLocationInfo = document.getElementById('modal-location-info');
    const nextButton = modal.querySelector('.next-button');
    modal.style.display = 'flex';

    function handleClickOutside(event) {
        if (!modal.contains(event.target) && event.target !== nextButton) {
            event.stopPropagation();
        }
    }

    document.addEventListener('mousedown', handleClickOutside);

    const modalMap = L.map(modalMapContainer, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        zoomControl: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        keyboard: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
    }).addTo(modalMap);

    modalMap.on('load', function() {
        setTimeout(() => {
            modalMap.invalidateSize();
        }, 100);
    });

    const correctMarker = L.marker([correctLatLng.lat, correctLatLng.lng], { icon: correctIcon }).addTo(modalMap);

    let bounds;
    let distance = 0;
    let roundScore = 0;

    // Check for either userGuess or marker (for unsubmitted pins)
    const finalGuess = userGuess || (marker ? marker.getLatLng() : null);

    if (finalGuess) {
        L.marker([finalGuess.lat, finalGuess.lng], { icon: userIcon }).addTo(modalMap);
        L.polyline([
            [finalGuess.lat, finalGuess.lng],
            [correctLatLng.lat, correctLatLng.lng]
        ], { 
            color: '#7ac5f0', 
            weight: 3, 
            opacity: 0.8, 
            smoothFactor: 1, 
            dashArray: '10', 
            className: 'animated-line' 
        }).addTo(modalMap);

        bounds = L.latLngBounds([
            [finalGuess.lat, finalGuess.lng],
            [correctLatLng.lat, correctLatLng.lng]
        ]);
        distance = calculateDistance(finalGuess.lat, finalGuess.lng, correctLatLng.lat, correctLatLng.lng);
        roundScore = Math.max(0, Math.round(4000 * (1 - distance / 20000)));
    } else {
        bounds = L.latLngBounds([
            [correctLatLng.lat, correctLatLng.lng],
            [correctLatLng.lat, correctLatLng.lng]
        ]);
    }

    let padValue = finalGuess ? (distance > 10000 ? 0.05 : distance > 5000 ? 0.1 : 0.2) : 0.5;

    setTimeout(() => {
        modalMap.invalidateSize();
        modalMap.fitBounds(bounds.pad(padValue), { 
            padding: [20, 20], 
            maxZoom: 12, 
            duration: 0.5, 
            animate: true 
        });
    }, 250);

    const currentQuestionInfo = questions[currentQuestion];

    document.querySelector('#modal-distance .distance-value').textContent = finalGuess ? `${Math.round(distance)} km` : '-';
    document.querySelector('#modal-score .score-value').textContent = finalGuess ? roundScore : '0';

    const miniTitle = document.createElement('h4');
    miniTitle.textContent = currentQuestionInfo.name;
    miniTitle.classList.add('modal-mini-title');

    modalLocationInfo.innerHTML = '';
    modalLocationInfo.innerHTML += `
        <img src="${currentQuestionInfo.image}" alt="${currentQuestionInfo.name}">
    `;
    modalLocationInfo.appendChild(miniTitle);
    modalLocationInfo.innerHTML += `
        <p>${currentQuestionInfo.info}</p>
    `;

    setTimeout(adjustModalTextSize, 0);

    nextButton.style.display = 'block';
    nextButton.onclick = () => {
        nextQuestion();
        modal.style.display = 'none';
        modalMap.remove();
        document.removeEventListener('mousedown', handleClickOutside);
    };
}




function submitGuess() {
    if (marker) {
        const userGuess = marker.getLatLng();
        const correctLatLng = questions[currentQuestion].location;
        const distance = calculateDistance(userGuess.lat, userGuess.lng, correctLatLng.lat, correctLatLng.lng);
        const points = calculateScore(distance);
        totalScore += points;
        document.getElementById('distance').textContent = `${distance.toFixed(0)} km`;
        document.getElementById('score').textContent = totalScore;
        showGuessAndCorrectLocation(userGuess, correctLatLng);
        document.getElementById('submit-guess').style.display = 'none';
    } else {
        alert('Please place a marker on the map.');
    }
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        canGuess = true;
        timeLeft = initialTime;
        if (marker) map.removeLayer(marker);
        if (correctMarker) map.removeLayer(correctMarker);
        if (line) map.removeLayer(line);
        marker = null;
        currentGuess = null;
        map.setView([50, 10], 3);
        map.on('click', handleGuess);
        document.getElementById('question').textContent = questions[currentQuestion].question;
        document.getElementById('score').textContent = 'Score: -';
        document.getElementById('distance').textContent = 'Distance: -';
        adjustQuestionFontSize();
        // document.querySelector('.next-button').style.display = 'none'; // REMOVE THIS LINE
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        if (map.tap) map.tap.enable();
        mapClickEnabled = true;
        startTimer();
    } else {
        endGame();
    }
}




document.querySelector('.next-button').addEventListener('click', function() {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'none';
    const modalMapContainer = document.getElementById('modal-map');
    if (modalMapContainer) {
        const modalMap = L.map(modalMapContainer);
        modalMap.remove();
    }
    nextQuestion();
});




function showAllGuessesOnMap() {
    if (!questions || !questions.length) {
        questions = JSON.parse(localStorage.getItem('dailyQuestions') || '[]');
    }

    const mapElement = document.getElementById('map');
    mapElement.style.height = 'calc(100vh - 100px)';

    const timerContainer = document.querySelector('.timer-container-map');
    if (timerContainer) {
        timerContainer.style.display = 'none';
    }

    // Clear existing markers and lines
    if (marker) map.removeLayer(marker);
    if (correctMarker) map.removeLayer(correctMarker);
    if (line) map.removeLayer(line);

    let allPoints = [];

    questions.forEach((question, index) => {
        const correctLocation = [question.answer[0], question.answer[1]];

        // Always add correct location marker
        const correctMarker = L.marker(correctLocation, {
            icon: L.divIcon({
                className: 'end-game-pin',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            }),
            interactive: true
        }).addTo(map);
        
        // Bind the popup with autoPan options (with your preferred padding) 
        const popupContent = `
            <div class="location-info">
                <h3>${question.name}</h3>
                <img src="${question.image}" alt="${question.name}">
                <p>${question.info}</p>
            </div>
        `;
        correctMarker.bindPopup(popupContent, {
            autoPan: true,
            autoPanPadding: [50, 50]
        });

        // When the marker is clicked, force a zoom in if the map is fully zoomed out.
        // Adjust the zoom level threshold and target zoom as needed.
        correctMarker.on('click', function(e) {
            const currentZoom = map.getZoom();
            // Set threshold zoom level below which we force zoom-in (e.g., 4)
            if (currentZoom < 4) {
                map.setView(e.latlng, 6, { animate: true });
                setTimeout(() => {
                    correctMarker.openPopup();
                }, 300);
            } else {
                // Otherwise, open the popup immediately.
                correctMarker.openPopup();
            }
        });

        // Add correct location to points for bounds calculation
        allPoints.push(L.latLng(correctLocation));

        // Add user guess and line only if a guess exists for this round
        const guess = allGuesses[index];
        if (guess && guess.lat && guess.lng) {
            const userMarker = L.marker([guess.lat, guess.lng], { icon: userIcon }).addTo(map);
            allPoints.push(L.latLng(guess.lat, guess.lng));

            const line = L.polyline([
                [guess.lat, guess.lng],
                correctLocation
            ], {
                color: '#7ac5f0',
                weight: 3,
                opacity: 0.8,
                smoothFactor: 1,
                dashArray: '10',
                className: 'animated-line'
            }).addTo(map);
        }
    });

    // Fit bounds to show all points
    if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50] });
    }

    const endScreen = document.getElementById('end-screen');
    const endContent = document.querySelector('.end-content');
    endContent.classList.add('minimized');
    endScreen.classList.add('minimized');

    const expandButton = document.createElement('button');
    expandButton.className = 'expand-button';
    expandButton.innerHTML = '<i class="fas fa-expand-alt"></i>';
    expandButton.onclick = () => {
        endContent.classList.remove('minimized');
        endScreen.classList.remove('minimized');
        expandButton.remove();
        mapElement.style.height = 'calc(100vh - 200px)';
        requestAnimationFrame(() => {
            setTimeout(() => {
                map.invalidateSize();
                mapClickEnabled = true;
                map.dragging.enable();
                map.touchZoom.enable();
                map.doubleClickZoom.enable();
                map.scrollWheelZoom.enable();
                map.boxZoom.enable();
                map.keyboard.enable();
                if (map.tap) map.tap.enable();
                map.on('click', handleGuess);
            }, 0);
        });
    };
    endContent.appendChild(expandButton);
    mapElement.style.height = 'calc(100vh - 80px)';
    map.invalidateSize();
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
    mapClickEnabled = false;
    map.off('click', handleGuess);
}



function shareResults() {
    if (!questions || !questions.length) {
        questions = JSON.parse(localStorage.getItem('dailyQuestions') || '[]');
    }

    const dailyData = JSON.parse(localStorage.getItem(DAILY_SCORES_KEY) || '{}')[new Date().toDateString()];
    const completionTime = formatCompletionTime(dailyData.completionTime);
    const quizNumber = getDailyQuizNumber();
    
    let shareText = `CartoObscura #${quizNumber}\n\nFinal Score: ${totalScore}\nTime: ${completionTime}\n\n`;
    let scoreIcons = '';
    
    allGuesses.forEach((guess, index) => {
        const correctAnswer = questions[index].answer;
        let distance = null;
        if (guess && guess.lat && guess.lng) {
            distance = calculateDistance(guess.lat, guess.lng, correctAnswer[0], correctAnswer[1]);
        }
        let icon = '❌';
        if (distance !== null) {
            if (distance <= 50) icon = '🎯';
            else if (distance <= 300) icon = '🟢';
            else if (distance <= 1000) icon = '🟡';
            else if (distance <= 2000) icon = '🟠';
            else if (distance <= 4000) icon = '🔴';
        }
        scoreIcons += icon;
    });
    
    shareText += `${scoreIcons}\n\nPlay at: CartoObscura.com`;

    // Only use navigator.share on mobile devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (navigator.share) {
            navigator.share({
                title: 'Todays Results',
                text: shareText
            }).catch(() => {
                copyToClipboard(shareText);
            });
        } else {
            copyToClipboard(shareText);
        }
    } else {
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            const button = document.getElementById('share-results');
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        })
        .catch(() => alert('Unable to share results'));
}



function endGame() {
    if (questionStartTimes[currentQuestion]) {
        updateQuestionTime();
    }

    currentQuestion = questions.length;
    const gameState = {
        completed: true,
        currentQuestion: currentQuestion,
        allGuesses: allGuesses,
        totalScore: totalScore,
        totalGameTime: totalGameTime,
        [LAST_PLAYED_KEY]: new Date().toDateString()
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    localStorage.setItem('dailyGuesses', JSON.stringify(allGuesses));

    stopTimer();
    timeLeft = 0;
    clearInterval(timerInterval);

    saveDailyScore();

    // Rest of your existing endGame code...
    // Just ensure you're using totalGameTime for the completion time display
    const finalGameTime = Math.min(totalGameTime, 600000);
    const formattedCompletionTime = formatCompletionTime(finalGameTime);

    const statsContainer = document.querySelector('.stats-container');
    const questionContainer = document.getElementById('question-container');
    const placeholder = document.createElement('div');
    placeholder.style.height = questionContainer.offsetHeight + 'px';
    placeholder.id = 'question-placeholder';
    questionContainer.parentNode.replaceChild(placeholder, questionContainer);
    statsContainer.style.display = 'none';

    const endScreen = document.getElementById('end-screen');
    const finalScoreElement = document.getElementById('final-score');
    const finalStats = document.getElementById('final-stats');
    const finalTime = document.getElementById('final-time');

    let totalDistance = 0;
    let guessDetails = '';
    questions.forEach((question, index) => {
        const guess = allGuesses[index];
        let distance = null;
        if (guess) {
            distance = calculateDistance(guess.lat, guess.lng, question.answer[0], question.answer[1]);
        }
        totalDistance += distance === null ? 0 : distance;
        const distanceValue = distance === null ? '-' : Math.round(distance);
        let icon = '';

        if (distance === null || distanceValue === '-') {
            icon = '<i class="fas fa-times red-x"></i>';
        } else if (distance <= 50) {
            icon = '<span class="bullseye-emoji">🎯</span>';
        } else if (distance <= 300) {
            icon = '<i class="fas fa-circle green-circle"></i>';
        } else if (distance <= 1000) {
            icon = '<i class="fas fa-circle yellow-circle"></i>';
        } else if (distance <= 2000) {
            icon = '<i class="fas fa-circle orange-circle"></i>';
        } else if (distance <= 4000) {
            icon = '<i class="fas fa-circle red-circle"></i>';
        } else {
            icon = '<i class="fas fa-times red-x"></i>';
        }

        guessDetails += `
            <div class="guess-detail">
                ${index + 1}. Distance: ${distanceValue} km ${icon}
            </div>
        `;
    });

    const maxPossibleDistance = 12000;
    const accuracyWeight = 1.5;
    const penaltyFactor = 1.2;
    const baseMultiplier = 0.9;
    const averageDistance = totalDistance / questions.length;
    const accuracy = Math.max(0, baseMultiplier * 100 * Math.pow((1 - (averageDistance / maxPossibleDistance) * penaltyFactor), accuracyWeight));

    finalScoreElement.textContent = `Final Score: ${totalScore}`;
    finalTime.textContent = `Completion Time: ${formattedCompletionTime}`;
    finalStats.innerHTML = `
        <div class="accuracy">Overall Accuracy: ${accuracy.toFixed(1)}%</div>
        <div class="guess-history">
            <h3>Your Guesses:</h3>
            ${guessDetails}
        </div>
    `;

    endScreen.style.display = 'flex';
    const endButtons = document.querySelector('.end-buttons');
    endButtons.innerHTML = `
        <button id="see-results-map" class="end-button">See Results on Map</button>
        <button id="share-results" class="end-button">Share Results</button>
    `;

    document.getElementById('see-results-map').addEventListener('click', showAllGuessesOnMap);
    document.getElementById('share-results').addEventListener('click', shareResults);
    mapClickEnabled = false;
}








function adjustQuestionFontSize() {
    const questionElement = document.getElementById('question');
    if (!questionElement) return;
    const textLength = questionElement.textContent.length;
    let fontSize = '1rem'; // Default font size
    if (textLength > 100) {
        fontSize = '0.8rem';
    } else if (textLength > 80) {
        fontSize = '0.9rem';
    }
    questionElement.style.fontSize = fontSize;
}

// ... (Existing code) ...

document.addEventListener('DOMContentLoaded', () => {
    try {
        const dailyCreditsContainer = document.getElementById('daily-credits');
        if (dailyCreditsContainer) {
            const todayCredits = getDailyImageCredit();
            // todayCredits will be one array of 5 credits for the current day
            todayCredits.forEach(credit => {
                const creditElement = document.createElement('p');
                creditElement.textContent = credit;
                creditElement.style.marginBottom = '8px'; // Add some spacing between credits
                dailyCreditsContainer.appendChild(creditElement);
            });
        }
        // START BUTTON LOGIC
        const startButton = document.getElementById('start-game');

        // Retrieve saved game state (if any)
        const savedState = JSON.parse(localStorage.getItem('gameState') || '{}');
        // Check if a saved game exists AND it’s from today (i.e. !canPlayToday() returns true)
        if ( Object.keys(savedState).length > 0 && !canPlayToday() ) {
            if (savedState.completed) {
                // If the game is completed, show "Show Today's Results"
                startButton.classList.add('played');
                startButton.innerHTML = '<span>Show Today\'s Results</span>';
            } else {
                // If the game is incomplete, show "Continue Game"
                startButton.classList.add('continue');
                startButton.innerHTML = '<span>Continue Game</span>';
                // Load the saved questions if they exist
                questions = JSON.parse(localStorage.getItem('dailyQuestions') || '[]');
                // Load the question if the game is continued
                if (loadGameState() && currentQuestion < questions.length && currentQuestion >= 0) {
                    document.getElementById("question").textContent = questions[currentQuestion].question;
                    adjustQuestionFontSize();
                }
            }
        } else {
            // If there's no saved gameState or it's a new day, show "Start Quiz"
            startButton.innerHTML = '<span>Start Quiz</span>';
        }

        // THEME TOGGLE & RESIZE LISTENER
        window.addEventListener('resize', adjustModalTextSize);

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.checked = localStorage.getItem('theme') === 'dark';
            themeToggle.addEventListener('change', () => {
                const newTheme = themeToggle.checked ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }

        // START GAME BUTTON CLICK HANDLER
        startButton.onclick = function () {
            const savedState = JSON.parse(localStorage.getItem('gameState') || '{}');
            // If there's a saved gameState for today, handle continue or finished logic
            if (Object.keys(savedState).length > 0 && !canPlayToday()) {
                if (savedState.completed) {
                    // If the game is completed, show the end screen results directly
                    allGuesses = JSON.parse(localStorage.getItem('dailyGuesses') || '[]');
                    questions = JSON.parse(localStorage.getItem('dailyQuestions') || '[]');
                    totalScore = savedState.totalScore || 0;
                    const heroContainer = document.querySelector('.hero-container');
                    heroContainer.style.display = "none";
                    const gameSection = document.getElementById('game-section');
                    gameSection.style.display = "block";
                    initializeMap();
                    endGame();
                    return;
                } else {
                    // If the game is incomplete, continue the game
                    const heroContainer = document.querySelector('.hero-container');
                    const gameSection = document.getElementById('game-section');
                    if (heroContainer && gameSection) {
                        heroContainer.style.display = "none";
                        gameSection.style.display = "block";
                        initializeMap();
                        if (loadGameState()) {
                            if (currentQuestion < questions.length) {
                                document.getElementById("question").textContent = questions[currentQuestion].question;
                                document.getElementById("score").textContent = `Score: ${totalScore}`;
                                adjustQuestionFontSize();
                                startTimer();
                            } else {
                                endGame(); // In case currentQuestion already equals questions.length
                            }
                        }
                    }
                }
                return;
            }

            // Check if the game can be played today
            if (!canPlayToday()) {
                // If the game has already been played today, prevent starting a new game
                alert("You've already played today's quiz. Please come back tomorrow!");
                return;
            }

            // Regular new game start logic
            const heroContainer = document.querySelector('.hero-container');
            const gameSection = document.getElementById('game-section');
            if (heroContainer && gameSection) {
                heroContainer.style.display = "none";
                gameSection.style.display = "block";
                initializeMap();

                // Mark the game as played today *before* starting
                markAsPlayed();

                localStorage.setItem('dailyQuestions', JSON.stringify(questions));
                document.getElementById("question").textContent = questions[currentQuestion].question;
                adjustQuestionFontSize();
                startTimer();
            }
        };
        

        // ADDITIONAL EVENT LISTENER FROM SECOND DOMContentLoaded
        const openModalButton = document.getElementById('open-modal-button');
        if (openModalButton) {
            openModalButton.addEventListener('click', showModal);
        }

        const endScreen = document.getElementById('end-screen');
        if (endScreen) {
            const seeResultsBtn = endScreen.querySelector('#see-results-map');
            const shareResultsBtn = endScreen.querySelector('#share-results');
            if (seeResultsBtn) {
                seeResultsBtn.addEventListener('click', showAllGuessesOnMap);
            }
            if (shareResultsBtn) {
                shareResultsBtn.addEventListener('click', shareResults);
            }
        }
    } catch (error) {
        console.error("Error during DOMContentLoaded:", error);
    }
});


 // Final closing bracket for DOMContentLoaded


 document.getElementById('submit-guess').addEventListener('click', function() {
    updateQuestionTime();  // Record time for the current question
    saveGameState();       // Persist state immediately
    
    if (!currentGuess) return;
    
    // Lock this question by disabling further input and stopping the timer.
    canGuess = false;
    stopTimer();

    const correctAnswer = questions[currentQuestion].answer;
    const distance = calculateDistance(currentGuess.lat, currentGuess.lng, correctAnswer[0], correctAnswer[1]);
    
    // Record this answer to lock-in the response for this question.
    allGuesses.push(currentGuess);
    saveGameState(); // Update storage with the latest answer so a refresh won’t allow re-answering.
    
    const nextButton = document.querySelector('.next-button');
    nextButton.style.display = 'block';
    this.style.display = 'none';
    
    if (currentQuestion === questions.length - 1) {
        nextButton.textContent = 'See Results';
    } else {
        nextButton.textContent = 'Next Question';
    }
    
    const score = Math.max(0, Math.round(4000 * (1 - distance / 20000)));
    totalScore += score;
    
    // New animation code
    const scoreBox = document.querySelector('.stat-box:nth-child(2)');
    const distanceBox = document.querySelector('.stat-box:nth-child(1)');
    
    document.getElementById('score').textContent = `Score: ${totalScore}`;
    document.getElementById('distance').textContent = `Distance: ${Math.round(distance)} km`;
    
    scoreBox.classList.add('reveal');
    distanceBox.classList.add('reveal');
    
    setTimeout(() => {
        scoreBox.classList.remove('reveal');
        distanceBox.classList.remove('reveal');
    }, 1500);
    
    showGuessAndCorrectLocation(currentGuess, L.latLng(correctAnswer[0], correctAnswer[1]));
});

window.addEventListener('beforeunload', saveGameState);






function adjustMapBounds(marker) {
    const bounds = marker.getBounds();
    const padding = 50; // Adjust padding as needed
    map.fitBounds(bounds.pad(0.1), {
        padding: [padding, padding],
        maxZoom: 18,
        animate: true,
        duration: 0.5
    });
}

function handleGuessSubmission(distance, score) {
    const scoreBox = document.querySelector('.stat-box:nth-child(2)');
    const distanceBox = document.querySelector('.stat-box:nth-child(1)');
    
    // Update the values
    document.getElementById('distance').textContent = `${Math.round(distance)} km`;
    document.getElementById('score').textContent = score;
    
    // Add the reveal animation
    scoreBox.classList.add('reveal');
    distanceBox.classList.add('reveal');
    
    // Remove the animation class after it completes
    setTimeout(() => {
        scoreBox.classList.remove('reveal');
        distanceBox.classList.remove('reveal');
    }, 1500);
}

function submitGuess() {
    if (marker) {
        const userGuess = marker.getLatLng();
        const correctLatLng = questions[currentQuestion].location;
        const distance = calculateDistance(userGuess.lat, userGuess.lng, correctLatLng.lat, correctLatLng.lng);
        const points = calculateScore(distance);
        totalScore += points;
        document.getElementById('distance').textContent = `${distance.toFixed(0)} km`;
        document.getElementById('score').textContent = totalScore;
        showGuessAndCorrectLocation(userGuess, correctLatLng);
        document.getElementById('submit-guess').style.display = 'none';
    } else {
        alert('Please place a marker on the map.');
    }
}

function adjustModalContent() {
    const modalMap = document.getElementById('modal-map');
    const modalInfo = document.querySelector('.modal-info');

    // Default sizes
    modalMap.style.height = '25vh';
    modalInfo.style.maxHeight = '50vh';

    // Laptop screen adjustments
    if (window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches) {
        modalMap.style.height = '20vh';
        modalInfo.style.maxHeight = '55vh';
    }

    // Force map refresh
    if (modalMapInstance) {
        modalMapInstance.invalidateSize();
    }

    // Adjust text size
    adjustModalTextSize();
}




function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

function adjustModalTextSize() {
    const modalInfo = document.querySelector('.modal-info p');
    const modalContainer = document.querySelector('.modal-info');
    
    if (!modalInfo || !modalContainer) return;
    
    // Reset font size to measure natural height
    modalInfo.style.fontSize = '0.9rem';
    
    // Get the container's height and the text content height
    const containerHeight = modalContainer.clientHeight;
    const textHeight = modalInfo.scrollHeight;
    
    // Calculate ratio between container and text height
    const ratio = containerHeight / textHeight;
    
    // If text is too large for container
    if (ratio < 1) {
        // Calculate new font size (with a minimum of 0.6rem)
        const newSize = Math.max(0.6, 0.9 * ratio);
        modalInfo.style.fontSize = `${newSize}rem`;
    }
}

function adjustModalSize() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    const modalContent = document.querySelector('.modal-content');
    const modalMap = document.querySelector('#modal-map');
    const modalInfo = document.querySelector('.modal-info');
    
    // Adjust map size based on screen height
    const mapHeight = window.innerHeight <= 700 ? '45vh' 
        : window.innerHeight <= 900 ? '50vh' 
        : '55vh';
    
    modalMap.style.height = mapHeight;
    
    // Adjust content padding and spacing
    const contentPadding = window.innerWidth <= 480 ? '8px' : '16px';
    
    modalContent.style.padding = contentPadding;
}

window.addEventListener('resize', adjustModalSize);
window.addEventListener('load', adjustModalSize);

document.addEventListener('DOMContentLoaded', () => {
    const aboutToggle = document.querySelector('.about-toggle');
    const aboutContent = document.querySelector('.about-content');

    aboutToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        aboutContent.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!aboutContent.contains(e.target)) {
            aboutContent.classList.remove('active');
        }
    });
});



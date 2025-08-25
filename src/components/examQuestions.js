export const examQuestions = {
  analytical: {
    1: { // Logical Reasoning Test
      questions: [
        {
          id: 1,
          question: "If all roses are flowers and some flowers fade quickly, which statement must be true?",
          options: [
            "All roses fade quickly",
            "Some roses may fade quickly",
            "No roses fade quickly",
            "Only roses fade quickly"
          ],
          correctAnswer: 1,
          explanation: "Since some flowers fade quickly and all roses are flowers, it's possible that some roses are among those flowers that fade quickly."
        },
        {
          id: 2,
          question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
          options: ["40", "42", "44", "46"],
          correctAnswer: 1,
          explanation: "The differences are 4, 6, 8, 10, so the next difference is 12. 30 + 12 = 42."
        },
        {
          id: 3,
          question: "If A > B and B > C, then:",
          options: [
            "A = C",
            "A < C",
            "A > C",
            "Cannot be determined"
          ],
          correctAnswer: 2,
          explanation: "By transitivity, if A > B and B > C, then A > C."
        }
      ]
    },
    2: { // Problem Solving Assessment
      questions: [
        {
          id: 1,
          question: "A train travels 120 km in 2 hours. At the same speed, how long will it take to travel 300 km?",
          options: ["4 hours", "5 hours", "6 hours", "7 hours"],
          correctAnswer: 1,
          explanation: "Speed = 120km/2h = 60km/h. Time = 300km ÷ 60km/h = 5 hours."
        },
        {
          id: 2,
          question: "If 3x + 7 = 22, what is the value of x?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 2,
          explanation: "3x = 22 - 7 = 15, so x = 15 ÷ 3 = 5."
        }
      ]
    }
  },
  verbal: {
    3: { // Reading Comprehension
      questions: [
        {
          id: 1,
          question: "Choose the word that best completes the sentence: The weather was so _____ that we had to cancel our picnic.",
          options: ["pleasant", "terrible", "moderate", "predictable"],
          correctAnswer: 1,
          explanation: "Only 'terrible' weather would necessitate canceling a picnic."
        },
        {
          id: 2,
          question: "What is the synonym of 'abundant'?",
          options: ["scarce", "plentiful", "limited", "moderate"],
          correctAnswer: 1,
          explanation: "'Plentiful' means existing in large quantity, which is the same as 'abundant'."
        }
      ]
    },
    4: { // Vocabulary and Grammar
      questions: [
        {
          id: 1,
          question: "Identify the grammatically correct sentence:",
          options: [
            "Me and him went to the store",
            "Him and I went to the store",
            "He and I went to the store",
            "I and he went to the store"
          ],
          correctAnswer: 2,
          explanation: "The correct form uses 'He and I' as the compound subject."
        },
        {
          id: 2,
          question: "The following are examples of Palindrome, except.",
          options: [
            "level",
            "same",
            "deified",
            "noon",
            "murdrum"
          ],
          correctAnswer: 1,
          explanation: "A Palindrome is a word, phrase, number or sequence of words that reads the same backward as forward."
        },
        {
          id: 3,
          question: "That perfume always EVOKES pleasant memories",
          options: [
            "angers",
            "erases",
            "calls up",
            "confuses"
          ],
          correctAnswer: 2,
          explanation: "The word EVOKES means brings to mind, calls forth, or causes to be remembered or felts"
        },
        {
          id: 4,
          question: "The attorney wanted to EXPEDITE the process because her client was becoming impatient",
          options: ["accelerate", "evaluate", "reverse", "justify"],
          correctAnswer: 0,
          explanation: "The word EXPEDITE means to make something happen faster or to speed up a process."
        },
        {
          id: 5,
          question: "The suspect gave a PLAUSIBLE explanation for his presence at the scene, so the police decided to look elsewhere for the perpetrator of the crime.",
          options: ["unbelievable", "credible", "insufficient", "apologetic"],
          correctAnswer: 1,
          explanation: "The word “plausible” means something that seems reasonable, believable, or possible.s"
        },
        {
          id: 6,
          question: "He based his conclusion on what he INFERRED from the evidence, not on what he actually observed.",
          options: ["predicted", "imagined", "surmised", "implied"],
          correctAnswer: 2,
          explanation: "The word “inferred” is the past tense of infer, which means to conclude or figure out something based on evidence, reasoning, or hints (not directly stated)."
        },
        {
          id: 7,
          question: "Sila ay nagdadamayan sa hirap at ginhawa. Sila ay totoong 'naghihiramang suklay'",
          options: ["mag asawa", "magkapatid", "magkaibigan", "magka anak"],
          correctAnswer: 2,
          explanation: "Ang ibig sabihin ng kahiramang suklay ay matalik na kaibigan "
        },
        {
          id: 8,
          question: "There is no PANACEA that will solve our financial difficulty.",
          options: ["cure-all", "answer", "paradox", "criteria"],
          correctAnswer: 0,
          explanation: "Meaning: a supposed cure for all problems, diseases, or difficulties."
        },
        {
          id: 9,
          question: "A multifarious task would",
          options: ["have many different components", "have very few components", "be very complex", "be impossible to complete"],
          correctAnswer: 0,
          explanation: "Multifarious means having many different aspects or components"
        },
        {
          id: 10,
          question: "Plaintive cries would be",
          options: ["musical, soothing", "plain, understanding", "loud, jarring", "sorrowful, mournful"],
          correctAnswer: 3,
          explanation: "Plaintive means expressing sorrow; mournful, melancholy"
        },
        {
          id: 11,
          question: "People with inveterate beliefs",
          options: ["can be easily manipulated", "have adopted their beliefs from another", "hold their beliefs deeply and passionately.", "change their beliefs frequently"],
          correctAnswer: 2,
          explanation: "Inveterate beliefs are deep-rooted or firmly established."
        },
        {
          id: 12,
          question: "If you were involved in an altercation, you",
          options: ["had an accident", "had a heated argument", "served in a war", "were part of a conspiracy"],
          correctAnswer: 1,
          explanation: "An altercation is a heated dispute or quarrel"
        },
        {
          id: 13,
          question: "If you are a contentious person, you",
          options: ["are usually right", "believe in 'an eye for an eye'", "always try to keep the peace", "are very competitive and quarrelsome"],
          correctAnswer: 3,
          explanation: "A contentious person is quarrelsome, competitive, quick to fight. Contentious also means controversial, causing contention"
        },
        {
          id: 14,
          question: "If you are part of a cabal, you",
          options: ["are involved in a secret plot", "are participating in a protest", "belong to the majority", "are fighting against the enemy"],
          correctAnswer: 0,
          explanation: "A cabal is a scheme or conspiracy; a small group joined in a secret plot"
        },
        {
          id: 15,
          question: "If you are a bellicose leader, you",
          options: ["do everything in your power to avoid war", "are eager to wage war", "remain neutral during international conflicts", "treat all citizens equally"],
          correctAnswer: 1,
          explanation: "A bellicose person is belligerent, quarrelsome; eager to wage war."
        },
        {
          id: 16,
          question: "If an apocalypse is near, you can expect",
          options: ["a period of extended peace", "a time of anarchy", "total devastation and destruction", "an invasion"],
          correctAnswer: 2,
          explanation: "An apocalypse is a cataclysmic event that brings total devastation or the end of the world"
        },
        {
          id: 17,
          question: "If your country suffers an incursion, your territory",
          options: ["has been invaded", "is in a depression", "has seceded to form a new state", "has had a natural disaster"],
          correctAnswer: 0,
          explanation: "An incursion is a raid or temporary invasion of someone else's territory"
        },
        {
          id: 18,
          question: "If you meet your nemesis, you meet",
          options: ["the leader of your country", "your guardian angel", "the cause of your misfortunes", "the person who decides your fate"],
          correctAnswer: 2,
          explanation: "A nemesis is a source of harm or ruin; the cause of one's misery or downfall, bane; agent of retribution or vengeance."
        },
        {
          id: 19,
          question: "If you pillage a village, you",
          options: ["set it on fire", "destroy it with bombs", "negotiate peace between warring tribes", "ransack it and steal as much as you can"],
          correctAnswer: 3,
          explanation: "To pillage means to forcibly rob of goods; to plunder."
        },
        {
          id: 20,
          question: "If you are a placid person, you",
          options: ["are usually calm and peaceful", "are always trying to pick a fight", "are disloyal", "are not to be trusted"],
          correctAnswer: 0,
          explanation: "Placid means calm and peaceful; free form disturbance."
        },
        {
          id: 21,
          question: "If you plan a reprisal, you",
          options: ["plan to surrender", "plan to retaliate", "hope to negotiate a cease-fire", "plan to desert the army"],
          correctAnswer: 1,
          explanation: "A reprisal is an act of retaliation for an injury. It is also the practice of using political or military force without actually resorting to war"
        },
        {
          id: 22,
          question: "Choose the sentence with the correct subject-verb agreement:",
          options: [
            "Each of the students have submitted their projects.",
            "Each of the students has submitted their projects.",
            "Each of the students were submitting their projects.",
            "Each of the students are submitting their projects."
          ],
          correctAnswer: 1,
          explanation: "‘Each’ is singular, so the correct verb is ‘has’ not ‘have’."
        },

        {
          id: 23,
          question: "Identify the grammatically correct sentence:",
          options: [
            "She don’t like to eat vegetables.",
            "She doesn’t likes to eat vegetables.",
            "She doesn’t like to eat vegetables.",
            "She don’t likes to eat vegetables."
          ],
          correctAnswer: 2,
          explanation: "The subject ‘She’ requires ‘doesn’t’ and the base form ‘like,’ so the correct answer is ‘She doesn’t like to eat vegetables.’"
        },
        {
          id: 24,
          question: "Which of the following sentences is punctuated correctly?",
          options: [
            "Maria said 'I will attend the meeting tomorrow'.",
            "Maria said, 'I will attend the meeting tomorrow.'",
            "Maria said, I will attend the meeting tomorrow.",
            "Maria said I will attend the meeting tomorrow."
          ],
          correctAnswer: 1,
          explanation: "Direct speech requires a comma before the quotation and the period should be inside the quotation marks."
        },
        {
          id: 25,
          question: "Which word best completes the sentence: 'Neither of the answers ___ correct.'",
          options: [
            "are",
            "were",
            "is",
            "have"
          ],
          correctAnswer: 2,
          explanation: "‘Neither’ is singular, so the correct verb is ‘is.’"
        },
        {
          id: 26,
          question: "Select the sentence with the correct pronoun usage:",
          options: [
            "Between you and I, the project was difficult.",
            "Between you and me, the project was difficult.",
            "Between I and you, the project was difficult.",
            "Between me and you, the project was difficult."
          ],
          correctAnswer: 1,
          explanation: "After a preposition (‘between’), the objective case ‘me’ should be used, not ‘I.’"
        },
        {
          id: 27,
          question: "Which sentence is grammatically correct?",
          options: [
            "The committee have reached a decision.",
            "The committee has reached a decision.",
            "The committee are reach a decision.",
            "The committee were reached a decision."
          ],
          correctAnswer: 1,
          explanation: "‘Committee’ is treated as a singular collective noun, so the correct verb is ‘has.’"
        },

        {
          id: 28,
          question: "Which of the following sentences is correct?",
          options: [
            "She enjoys to swim every morning.",
            "She enjoys swimming every morning.",
            "She enjoy swimming every morning.",
            "She enjoyed to swimming every morning."
          ],
          correctAnswer: 1,
          explanation: "After ‘enjoy,’ the gerund form (swimming) is used instead of the infinitive."
        },

        {
          id: 29,
          question: "Fill in the blank: 'I am looking forward ___ your reply.'",
          options: [
            "in",
            "to",
            "at",
            "for"
          ],
          correctAnswer: 1,
          explanation: "The correct phrase is ‘looking forward to.’"
        },

        {
          id: 30,
          question: "Choose the correctly structured sentence:",
          options: [
            "He is senior than me.",
            "He is more senior than me.",
            "He is senior to me.",
            "He is the most senior than me."
          ],
          correctAnswer: 2,
          explanation: "The adjective ‘senior’ does not require ‘more’ or ‘than.’ The correct usage is ‘senior to.’"
        },

        {
          id: 31,
          question: "Which is the correct sentence?",
          options: [
            "I suggested him to take rest.",
            "I suggested that he takes rest.",
            "I suggested that he take rest.",
            "I suggested for him to take rest."
          ],
          correctAnswer: 2,
          explanation: "The subjunctive form ‘take’ is used after ‘suggested that.’"
        },

        {
          id: 32,
          question: "Select the correct pronoun: 'It was ___ who called you yesterday.'",
          options: [
            "me",
            "I",
            "myself",
            "mine"
          ],
          correctAnswer: 1,
          explanation: "After a linking verb (‘was’), the subject pronoun ‘I’ is correct, not ‘me.’"
        },

        {
          id: 33,
          question: "Which of the following is correct?",
          options: [
            "She, as well as her friends, are going to the party.",
            "She, as well as her friends, is going to the party.",
            "She, as well as her friends, going to the party.",
            "She, as well as her friends, were going to the party."
          ],
          correctAnswer: 1,
          explanation: "The subject is ‘She’ (singular), so the verb should be ‘is.’"
        },

        {
          id: 34,
          question: "Fill in the blank: 'He has lived in Manila ___ 2010.'",
          options: [
            "since",
            "for",
            "from",
            "in"
          ],
          correctAnswer: 0,
          explanation: "‘Since’ is used for a starting point in time, while ‘for’ is used for duration."
        },

        {
          id: 35,
          question: "Which sentence is grammatically correct?",
          options: [
            "Each of the players know the rules.",
            "Each of the players knows the rules.",
            "Each of the players knowing the rules.",
            "Each of the players known the rules."
          ],
          correctAnswer: 1,
          explanation: "‘Each’ is singular, so the correct verb is ‘knows.’"
        },

        {
          id: 36,
          question: "Choose the correct sentence:",
          options: [
            "Neither of them are available today.",
            "Neither of them is available today.",
            "Neither of them were available today.",
            "Neither of them be available today."
          ],
          correctAnswer: 1,
          explanation: "‘Neither’ is singular, so the correct form is ‘is.’"
        },

        {
          id: 37,
          question: "Which of the following is correct?",
          options: [
            "He is the tallest of the two brothers.",
            "He is taller of the two brothers.",
            "He is the taller of the two brothers.",
            "He is most tall of the two brothers."
          ],
          correctAnswer: 2,
          explanation: "When comparing two, use the comparative form ‘taller,’ not the superlative ‘tallest.’"
        },

        {
          id: 38,
          question: "Select the correct sentence:",
          options: [
            "I have visited Baguio last year.",
            "I visited Baguio last year.",
            "I had visited Baguio last year.",
            "I have been visited Baguio last year."
          ],
          correctAnswer: 1,
          explanation: "When specifying a finished time (‘last year’), use the simple past tense."
        },

        {
          id: 39,
          question: "Fill in the blank: 'By this time next year, she ___ graduated.'",
          options: [
            "will",
            "will have",
            "has",
            "is"
          ],
          correctAnswer: 1,
          explanation: "The future perfect tense ‘will have graduated’ is correct for an action completed by a future time."
        },

        {
          id: 40,
          question: "Which sentence is correct?",
          options: [
            "If I was you, I would accept the offer.",
            "If I were you, I would accept the offer.",
            "If I am you, I would accept the offer.",
            "If I will be you, I would accept the offer."
          ],
          correctAnswer: 1,
          explanation: "In hypothetical situations, the subjunctive form ‘were’ is used (‘If I were you’)."
        },
        {
          id: 41,
          question: "Which sentence is grammatically correct?",
          options: [
            "She sings good.",
            "She sings well.",
            "She sing well.",
            "She singing well."
          ],
          correctAnswer: 1,
          explanation: "‘Well’ is the correct adverb form to describe how she sings."
        },

        {
          id: 42,
          question: "Fill in the blank: 'He is capable ___ solving the problem.'",
          options: [
            "in",
            "of",
            "at",
            "to"
          ],
          correctAnswer: 1,
          explanation: "The correct phrase is ‘capable of.’"
        },

        {
          id: 43,
          question: "Choose the correct sentence:",
          options: [
            "There is many reasons to celebrate.",
            "There are many reasons to celebrate.",
            "There is many reason to celebrate.",
            "There are many reason to celebrate."
          ],
          correctAnswer: 1,
          explanation: "‘Reasons’ is plural, so the correct verb is ‘are.’"
        },

        {
          id: 44,
          question: "Which of the following is correct?",
          options: [
            "She is married with a doctor.",
            "She is married to a doctor.",
            "She is married by a doctor.",
            "She is married at a doctor."
          ],
          correctAnswer: 1,
          explanation: "The correct expression is ‘married to,’ not ‘married with.’"
        },

        {
          id: 45,
          question: "Fill in the blank: 'She insisted ___ paying the bill.'",
          options: [
            "in",
            "on",
            "to",
            "for"
          ],
          correctAnswer: 1,
          explanation: "The correct phrase is ‘insisted on.’"
        },

        {
          id: 46,
          question: "Which sentence is correct?",
          options: [
            "She prefers tea than coffee.",
            "She prefers tea to coffee.",
            "She prefers tea over coffee than.",
            "She prefers tea instead coffee."
          ],
          correctAnswer: 1,
          explanation: "The correct usage is ‘prefer A to B.’"
        },

        {
          id: 47,
          question: "Choose the correct sentence:",
          options: [
            "She didn’t went to school yesterday.",
            "She doesn’t went to school yesterday.",
            "She didn’t go to school yesterday.",
            "She not went to school yesterday."
          ],
          correctAnswer: 2,
          explanation: "After ‘didn’t,’ the base form ‘go’ is used, not ‘went.’"
        },

        {
          id: 48,
          question: "Which of the following sentences is correct?",
          options: [
            "The informations are accurate.",
            "The information are accurate.",
            "The information is accurate.",
            "The information’s are accurate."
          ],
          correctAnswer: 2,
          explanation: "‘Information’ is an uncountable noun, so it takes a singular verb: ‘is accurate.’"
        },

        {
          id: 49,
          question: "Select the correctly punctuated sentence:",
          options: [
            "Its a beautiful day, isn’t it?",
            "It’s a beautiful day, isn’t it?",
            "Its a beautiful day isn’t it?",
            "It’s a beautiful day isn’t it."
          ],
          correctAnswer: 1,
          explanation: "‘It’s’ means ‘it is,’ and a comma is needed before the tag question."
        },

        {
          id: 50,
          question: "Fill in the blank: 'He succeeded ___ solving the puzzle.'",
          options: [
            "to",
            "in",
            "at",
            "on"
          ],
          correctAnswer: 1,
          explanation: "The correct phrase is ‘succeeded in.’"
        }


      ]
    },
    5: { // Idiomatic Expression and Correct Spelling
      questions: [
        {
          id: 1,
          question: "If you don't spill the beans now, you might gonna regret it",
          options: ["spread rumors", "let out a secret", "plant some weeds", "none of the above"],
          correctAnswer: 1,
          explanation: "“Spill the beans” means to reveal a secret or disclose information that was meant to be kept hidden."
        },
        {
          id: 2,
          question: "Hey, man, you are absolutely barking up the wrong tree here because I'm innocent.",
          options: ["choosing the wrong dog", "giving up a fight", "accusing the wrong person", "setting up an event in a tree"],
          correctAnswer: 2,
          explanation: "“Barking up the wrong tree” means to make a wrong assumption or to pursue the wrong course of action."
        },
        {
          id: 3,
          question: "One proven way to beat an enemy is find his Achilles heel",
          options: ["secret strategy", "amulet", "strong point", "weak spot"],
          correctAnswer: 3,
          explanation: "“Find his Achilles’ heel” means to discover a person’s weakness or vulnerable point despite their overall strength."
        },
        {
          id: 4,
          question: "His new Ferrari cost an arm and a leg so he is now looking for another job",
          options: ["very expensive", "got fired", "met an accident", "was stolen"],
          correctAnswer: 0,
          explanation: "“Cost an arm and a leg” means to be very expensive or overpriced."
        },
        {
          id: 5,
          question: "He married a woman who was born with a silver spoon in her mouth",
          options: ["born very beautiful", "born very poor", "born into a very rich family", "born very talkative"],
          correctAnswer: 2,
          explanation: "“Born with a silver spoon (in one’s mouth)” means to be born into a wealthy and privileged family."
        },
        {
          id: 6,
          question: "They were able to weather the storm",
          options: ["reached home safely", "survived the crisis", "defeated the enemies", "realized their mistakes", "predicted the calamity"],
          correctAnswer: 1,
          explanation: "“Weather the storm” means to endure difficulties or survive a tough situation without giving up."
        },
        {
          id: 7,
          question: "Trust men and they will be true to you",
          options: ["a man is loyal in whom confidence had been placed", "man must trust you to be faithful to you", "a secret is a test of friendship", "destruct the people justifies their deserving", "trust all men in everthing or more in anything"],
          correctAnswer: 0,
          explanation: "“Trust men and they will be true to you” means if you show trust and confidence in people, they are more likely to act honestly and remain loyal in return."
        },
        {
          id: 8,
          question: "Cut your coat to your cloth",
          options: ["walk in accordance with your ability", "desire only what you can afford", "patronize first your own product", "express only relevant ideas", "dress up according to the accessories"],
          correctAnswer: 1,
          explanation: "“Cut your coat according to your cloth” means to live within your means or spend only what you can afford."
        },
        {
          id: 9,
          question: "Paddle your own canoe",
          options: ["always tries his best", "earn his own money", "have self-respect", "learn from his mistakes", "be self-reliant"],
          correctAnswer: 4,
          explanation: "“Paddle your own canoe” means to be independent and rely on yourself rather than depending on others."
        },
        {
          id: 10,
          question: "This report leaves much to be desired",
          options: ["satisfactory", "longed", "important", "legible", "ready"],
          correctAnswer: 1,
          explanation: "When someone says “This report leaves much to be desired,” the implied answer is that the report is “longed for improvement” or “longed to be better.”s"
        }
      ]
    }
  },
  numerical: {
    6: { // Basic Mathematics
      questions: [
        {
          id: 1,
          question: "What is 15% of 200?",
          options: ["25", "30", "35", "40"],
          correctAnswer: 1,
          explanation: "15% of 200 = 0.15 × 200 = 30."
        },
        {
          id: 2,
          question: "If a rectangle has a length of 8 cm and width of 5 cm, what is its area?",
          options: ["30 cm²", "35 cm²", "40 cm²", "45 cm²"],
          correctAnswer: 2,
          explanation: "Area = length × width = 8 × 5 = 40 cm²."
        }
      ]
    },
    7: { // Data Interpretation
      questions: [
        {
          id: 1,
          question: "A pie chart shows: 40% Red, 30% Blue, 20% Green, 10% Yellow. If there are 500 items total, how many are Blue?",
          options: ["120", "150", "180", "200"],
          correctAnswer: 1,
          explanation: "30% of 500 = 0.30 × 500 = 150."
        }
      ]
    }
  },
  general: {
    8: { // Philippine History and Culture
      questions: [
        {
          id: 1,
          question: "Who is known as the 'Father of the Philippine Revolution'?",
          options: ["Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo", "Antonio Luna"],
          correctAnswer: 1,
          explanation: "Andres Bonifacio is widely recognized as the 'Father of the Philippine Revolution'."
        },
        {
          id: 2,
          question: "What is the national flower of the Philippines?",
          options: ["Rose", "Sampaguita", "Orchid", "Sunflower"],
          correctAnswer: 1,
          explanation: "Sampaguita (Jasminum sambac) is the national flower of the Philippines."
        }
      ]
    },
    9: { // Current Affairs
      questions: [
        {
          id: 1,
          question: "What does 'GDP' stand for in economics?",
          options: [
            "General Development Plan",
            "Gross Domestic Product",
            "Global Distribution Program",
            "Government Development Policy"
          ],
          correctAnswer: 1,
          explanation: "GDP stands for Gross Domestic Product, a measure of economic activity."
        }
      ]
    }
  }
};
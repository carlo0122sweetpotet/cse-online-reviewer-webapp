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
        },
        {
          id: 3,
          question: "There are no effective boundaries when it comes to pollutants. Studies have shown that toxic insecticides that have been banned in many countries are riding the wind from countries where they remain legal. Compounds such as DDT and toxaphene have been found in remote places like the Yukon and other Arctic regions. This paragraph best supports the statement that",
          options: ["toxic insecticides such as DDT have not been banned throughout the world", "more pollutants find their way into polar climates than they do into warmer areas", "studies have proven that many countries have ignored their own anti-pollution laws", "DDT and toxaphene are the two most toxix insecticides in the world"],
          correctAnswer: 0,
          explanation: ""
        },
        {
          id: 4,
          question: "Most researchers in needy countries are based on the thinking and approach of the highly developed Western world, and seldom have they been directed toward meeting the countries; own development needs. The sentence best supports the statement that",
          options: ["highly developed countries offer the best guide for the development of needy countries", "most researchers done in needy countries are missing their objectives", "most researchers have universal application", "needy countries need researchers to help them reach the status of the western world", "needy countries spend so much time for conducting researchers"],
          correctAnswer: 3,
          explanation: ""
        },
        {
          id: 5,
          question: "Critical reading is a demanding process. To read critically, you must slow down your reading and, with pencil in hand, perform specific operations on the text. Mark up the text with your reactions, conclusions, and questions. When you read, become an active participant. This paragraph best supports the statement that",
          options: ["critical reading is a slow, dull, but essential process", "the best critical reading happens at critical times in a person's life", "readers should get in the habit of questioning the truth of what they read", "critical reading requires thoughtful and careful attention", "critical reading should take place at the same time each day"],
          correctAnswer: 3,
          explanation: ""
        },
        {
          id: 6,
          question: "Two person look out through the same bars; one sees mud and the other, the stars. The sentence best supports the statement that",
          options: ["some people are more blind than others", "people see things differently depending on their own perspective", "people have varied ways of looking at different things", "people have different tastes and interests", "people tend to influence one another's views of things"],
          correctAnswer: 2,
          explanation: ""
        },
        {
          id: 7,
          question: "Nagawang mabago ng mga kasalukuyang awitin ang kamalayan ng Pilipino upang kantahin ang sarili niyang mga awit sa tanging wikang nakapagsasastinig sa kanyang kaluluwa. Isinasaad ng pangungusap na",
          options: ["madamdamin at makabuluhan ang mga awiting isinulat sa wikang Pilipino", "tagumpay ang mga awiting Pilipino na mabago ang kaugalian ng mga tao Pilipino", "madaling matutuhan ang mga awiting Pilipino dahil ang mga ito ay nasusulat sa katutubong wika", "natutuhan nang tangkilikin ng mga Pilipino ang kanilang mga sariling awitin", "nagkakaroon na ng kamalayan ang mga Pilipino tungkol sa lahat ng mga awitin ngayon"],
          correctAnswer: 3,
          explanation: ""
        },
        {
          id: 8,
          question: "Sixty years ago I know everthing; now I know nothing; education is a progressive discovery of our own ignorance. The sentence best supports the statement that",
          options: ["the older we get, the more we forget what we have learned", "the older we get, the more knowledgeable we become", "the more we learn, the more we realize that there's more we need to know", "we learn more as we grow old", "ignorance is a lifelong experience"],
          correctAnswer: 0,
          explanation: ""
        },
        {
          id: 9,
          question: "In a modern economy, the results of long-range planning frequently depend upon the future value of money. The ability then to predict the value of money is a key to economic progress. The paragraph best supports the statement that",
          options: ["the value of money is unpredictable at times", "the unpredictability of money is an obstacle to a nation's prosperity", "economic progress is facilitated by properly controlling budgetary expenses", "long-range planning is unheard of in traditional economies", "financial planning is indispensable in modern economy"],
          correctAnswer: 1,
          explanation: ""
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
        },
        {
          id: 11,
          question: "What does the idiom 'hit the sack' mean?",
          options: ["To go to sleep", "To start a fight", "To quit a job", "To lose money", "To work hard"],
          correctAnswer: 0,
          explanation: "'Hit the sack' is an informal idiom meaning to go to bed or sleep."
        },
        {
          id: 12,
          question: "Which of the following is spelled correctly?",
          options: ["Consciense", "Conscience", "Consciensce", "Conciense", "Consciense"],
          correctAnswer: 1,
          explanation: "'Conscience' is the correct spelling, meaning an inner sense of right and wrong."
        },
        {
          id: 13,
          question: "What does the idiom 'burn the midnight oil' mean?",
          options: ["To waste time", "To stay up late working or studying", "To spend too much money", "To relax after work", "To argue with someone"],
          correctAnswer: 1,
          explanation: "'Burn the midnight oil' means to stay up late at night, usually to study or work."
        },
        {
          id: 14,
          question: "Choose the correctly spelled word:",
          options: ["Mischevious", "Mischievous", "Mischievious", "Mischivous", "Mischivious"],
          correctAnswer: 1,
          explanation: "The correct spelling is 'Mischievous', meaning playful in a teasing or troublesome way."
        },
        {
          id: 15,
          question: "What does the idiom 'throw in the towel' mean?",
          options: ["To surrender or give up", "To fight harder", "To clean up a mess", "To waste effort", "To change plans suddenly"],
          correctAnswer: 0,
          explanation: "'Throw in the towel' means to give up or surrender, originally from boxing."
        },
        {
          id: 16,
          question: "Which of the following is spelled correctly?",
          options: ["Indispensible", "Indespensible", "Indispensable", "Indespansable", "Indispansable"],
          correctAnswer: 2,
          explanation: "'Indispensable' is the correct spelling, meaning absolutely necessary."
        },
        {
          id: 17,
          question: "What does the idiom 'cut to the chase' mean?",
          options: ["To get straight to the point", "To run away quickly", "To avoid responsibility", "To finish something slowly", "To argue endlessly"],
          correctAnswer: 0,
          explanation: "'Cut to the chase' means to get directly to the important part without wasting time."
        },
        {
          id: 18,
          question: "Which of the following is spelled correctly?",
          options: ["Embarrasment", "Embarasment", "Embarrassment", "Embarassment", "Embarresment"],
          correctAnswer: 2,
          explanation: "The correct spelling is 'Embarrassment' with double 'r' and double 's'."
        },
        {
          id: 19,
          question: "What does the idiom 'beat around the bush' mean?",
          options: ["To avoid the main topic", "To hunt in the forest", "To damage plants", "To prepare for farming", "To hide from someone"],
          correctAnswer: 0,
          explanation: "'Beat around the bush' means to avoid talking about the main issue directly."
        },
        {
          id: 20,
          question: "Instead of being direct, Maria tends to beat around the bush whenever serious topics are discussed. What does 'beat around the bush' mean?",
          options: ["To avoid the main topic", "To hunt in the forest", "To damage plants", "To prepare for farming", "To hide from someone"],
          correctAnswer: 0,
          explanation: "'Beat around the bush' means to avoid talking about the main issue directly."
        },
        {
          id: 21,
          question: "Rico only visits his relatives once in a blue moon. What does 'once in a blue moon' mean?",
          options: ["Something that never happens", "Something that happens very rarely", "Something that happens every day", "Something that is impossible", "Something that happens yearly"],
          correctAnswer: 1,
          explanation: "'Once in a blue moon' means something that happens very rarely."
        },
        {
          id: 22,
          question: "After the discussion, the ball is in your court now. What does 'the ball is in your court' mean?",
          options: ["You must decide what happens next", "You have to play fairly", "You must share responsibility", "You have an advantage in a game", "You should apologize first"],
          correctAnswer: 0,
          explanation: "'The ball is in your court' means it’s your turn to take action or make a decision."
        },
        {
          id: 23,
          question: "Knowing he could no longer delay the surgery, the patient decided to bite the bullet. What does 'bite the bullet' mean?",
          options: ["To face a painful or difficult situation bravely", "To speak harshly", "To hurt someone intentionally", "To accept defeat", "To stay silent"],
          correctAnswer: 0,
          explanation: "'Bite the bullet' means to bravely accept something unpleasant or difficult."
        },
        {
          id: 24,
          question: "When the politician became popular, many people quickly jumped on the bandwagon. What does 'jump on the bandwagon' mean?",
          options: ["To join others in doing something popular", "To leave a group suddenly", "To criticize unfairly", "To act without thinking", "To support a rival team"],
          correctAnswer: 0,
          explanation: "'Jump on the bandwagon' means to join something once it becomes popular or successful."
        },
        {
          id: 25,
          question: "There’s no use crying over spilled milk after you missed the deadline. What does 'cry over spilled milk' mean?",
          options: ["To regret something that cannot be undone", "To waste food unnecessarily", "To complain about small matters", "To feel sympathy for others", "To ask for forgiveness"],
          correctAnswer: 0,
          explanation: "'Cry over spilled milk' means to be upset over something that has already happened and cannot be changed."
        },
        {
          id: 26,
          question: "The exhausted students decided to hit the sack after studying all night. What does 'hit the sack' mean?",
          options: ["To go to sleep", "To start a fight", "To quit a job", "To lose money", "To work hard"],
          correctAnswer: 0,
          explanation: "'Hit the sack' means to go to bed or sleep."
        },
        {
          id: 27,
          question: "Despite many difficulties, the team managed to weather the storm. What does 'weather the storm' mean?",
          options: ["Wait for rain to stop", "Go sailing in a storm", "Survive difficulties", "Predict the weather", "Stay indoors during typhoon"],
          correctAnswer: 2,
          explanation: "'Weather the storm' means to survive or endure difficulties."
        },
        {
          id: 28,
          question: "Realizing that their plan had failed, the group decided to throw in the towel. What does 'throw in the towel' mean?",
          options: ["To surrender or give up", "To fight harder", "To clean up a mess", "To waste effort", "To change plans suddenly"],
          correctAnswer: 0,
          explanation: "'Throw in the towel' means to give up or surrender, originally from boxing."
        },
        {
          id: 29,
          question: "The professor told the students to cut to the chase and focus on the key points. What does 'cut to the chase' mean?",
          options: ["To get straight to the point", "To run away quickly", "To avoid responsibility", "To finish something slowly", "To argue endlessly"],
          correctAnswer: 0,
          explanation: "'Cut to the chase' means to get directly to the important part without wasting time."
        },
        {
          id: 30,
          question: "The new employee quickly learned to paddle his own canoe at the workplace. What does 'paddle your own canoe' mean?",
          options: ["To rely on yourself", "To enjoy outdoor activities", "To learn slowly", "To complain often", "To travel frequently"],
          correctAnswer: 0,
          explanation: "'Paddle your own canoe' means to be independent and self-reliant."
        },
        {
          id: 31,
          question: "When Jose finally found his long-lost friend, he realized he had found his Achilles’ heel. What does 'Achilles’ heel' mean?",
          options: ["A source of great strength", "A hidden talent", "A weakness or vulnerability", "A great achievement", "A sudden fortune"],
          correctAnswer: 2,
          explanation: "'Achilles’ heel' refers to a weakness or vulnerable point in someone’s character or situation."
        },
        {
          id: 32,
          question: "The manager told the employees not to make a mountain out of a molehill. What does 'make a mountain out of a molehill' mean?",
          options: ["To exaggerate a small problem", "To solve a big problem", "To climb a mountain", "To ignore an issue", "To create an obstacle"],
          correctAnswer: 0,
          explanation: "'Make a mountain out of a molehill' means to exaggerate or overreact to a minor issue."
        },
        {
          id: 33,
          question: "After many years of rivalry, the two companies decided to bury the hatchet. What does 'bury the hatchet' mean?",
          options: ["To hide weapons", "To start a new project", "To end a conflict and make peace", "To delay a decision", "To compete more fiercely"],
          correctAnswer: 2,
          explanation: "'Bury the hatchet' means to reconcile or end a conflict."
        },
        {
          id: 34,
          question: "She always lets the cat out of the bag whenever there’s a surprise planned. What does 'let the cat out of the bag' mean?",
          options: ["To release an animal", "To reveal a secret unintentionally", "To create a problem", "To lose a valuable item", "To ask for help"],
          correctAnswer: 1,
          explanation: "'Let the cat out of the bag' means to reveal a secret, often by accident."
        },
        {
          id: 35,
          question: "Despite the pressure, the lawyer kept his cards close to his chest during negotiations. What does 'keep your cards close to your chest' mean?",
          options: ["To gamble recklessly", "To hide your plans or intentions", "To speak honestly", "To play fairly", "To reveal all details"],
          correctAnswer: 1,
          explanation: "'Keep your cards close to your chest' means to keep your plans, ideas, or intentions secret."
        },
        {
          id: 36,
          question: "The teacher told Ana to put her best foot forward in the competition. What does 'put your best foot forward' mean?",
          options: ["To walk carefully", "To make a good impression", "To move quickly", "To give up early", "To try to escape"],
          correctAnswer: 1,
          explanation: "'Put your best foot forward' means to try your best and make a good impression."
        },
        {
          id: 37,
          question: "When asked about the incident, the official said he would cross the bridge when he got to it. What does 'cross the bridge when you come to it' mean?",
          options: ["To plan ahead carefully", "To avoid responsibility", "To deal with problems only when they arise", "To ignore the situation", "To postpone success"],
          correctAnswer: 2,
          explanation: "'Cross the bridge when you come to it' means to deal with a problem only when it actually happens."
        },
        {
          id: 38,
          question: "The businessman was walking on thin ice after breaking the company’s rules. What does 'walking on thin ice' mean?",
          options: ["Being in a risky or dangerous situation", "Walking very carefully", "Being successful", "Being cautious", "Losing balance"],
          correctAnswer: 0,
          explanation: "'Walking on thin ice' means being in a risky or dangerous situation where one mistake could lead to trouble."
        },
        {
          id: 39,
          question: "The journalist called a spade a spade during the heated debate. What does 'call a spade a spade' mean?",
          options: ["To speak honestly and directly", "To insult someone", "To remain silent", "To exaggerate facts", "To use polite words"],
          correctAnswer: 0,
          explanation: "'Call a spade a spade' means to speak the truth directly, even if it is unpleasant."
        },
        {
          id: 40,
          question: "Even if the plan failed, the leader reminded everyone that every cloud has a silver lining. What does 'every cloud has a silver lining' mean?",
          options: ["Every situation has both pros and cons", "There is something good even in a bad situation", "Rainy days are useful for farmers", "A person should always be optimistic", "Every failure is permanent"],
          correctAnswer: 1,
          explanation: "'Every cloud has a silver lining' means that something good can be found in every bad situation."
        },
        {
          id: 41,
          question: "After losing his job, Marco decided to turn over a new leaf and start fresh. What does 'turn over a new leaf' mean?",
          options: ["To read a new book", "To move to another city", "To change behavior for the better", "To start a business", "To abandon responsibilities"],
          correctAnswer: 2,
          explanation: "'Turn over a new leaf' means to change one’s behavior for the better."
        },
        {
          id: 42,
          question: "Despite the controversy, the senator decided to stick to his guns. What does 'stick to your guns' mean?",
          options: ["To carry a weapon", "To stand firm in one’s decision", "To prepare for battle", "To remain silent", "To escape responsibility"],
          correctAnswer: 1,
          explanation: "'Stick to your guns' means to remain firm in one’s position or belief despite opposition."
        },
        {
          id: 43,
          question: "The businessman was caught red-handed accepting a bribe. What does 'caught red-handed' mean?",
          options: ["To be caught injured", "To be caught in the act of doing something wrong", "To be caught in public", "To be embarrassed", "To be falsely accused"],
          correctAnswer: 1,
          explanation: "'Caught red-handed' means to be caught in the act of doing something illegal or wrong."
        },
        {
          id: 44,
          question: "The detective said the missing piece of evidence was the smoking gun in the case. What does 'smoking gun' mean?",
          options: ["A weapon used in a crime", "An obvious clue or proof of guilt", "A dangerous situation", "A misleading sign", "An old story"],
          correctAnswer: 1,
          explanation: "'Smoking gun' means a piece of evidence that serves as undeniable proof of guilt."
        },
        {
          id: 45,
          question: "Maria’s sudden resignation was just the tip of the iceberg. What does 'the tip of the iceberg' mean?",
          options: ["The best part of something", "The smallest visible part of a bigger problem", "The final solution", "The easiest challenge", "The end of an issue"],
          correctAnswer: 1,
          explanation: "'Tip of the iceberg' means a small, visible part of a much larger hidden issue."
        },
        {
          id: 46,
          question: "When Pedro was promoted, his colleagues gave him the cold shoulder. What does 'give the cold shoulder' mean?",
          options: ["To ignore someone deliberately", "To congratulate warmly", "To criticize publicly", "To offer support", "To dismiss someone politely"],
          correctAnswer: 0,
          explanation: "'Give the cold shoulder' means to deliberately ignore or reject someone."
        },
        {
          id: 47,
          question: "The lawyer’s argument was weak, so the judge took it with a grain of salt. What does 'take with a grain of salt' mean?",
          options: ["To believe completely", "To doubt or view something with skepticism", "To ignore respectfully", "To criticize harshly", "To accept wholeheartedly"],
          correctAnswer: 1,
          explanation: "'Take with a grain of salt' means to regard something as not completely reliable or to be skeptical about it."
        },
        {
          id: 48,
          question: "When the company failed, the workers were left high and dry. What does 'left high and dry' mean?",
          options: ["To be left without help or resources", "To be left in a safe place", "To be abandoned in the desert", "To be rewarded unexpectedly", "To be confused about choices"],
          correctAnswer: 0,
          explanation: "'Left high and dry' means to be abandoned without help or resources."
        },
        {
          id: 49,
          question: "Carla finally decided to face the music after missing work for a week. What does 'face the music' mean?",
          options: ["To listen to a concert", "To accept the unpleasant consequences of one’s actions", "To avoid punishment", "To explain calmly", "To entertain others"],
          correctAnswer: 1,
          explanation: "'Face the music' means to accept the negative consequences of one’s actions."
        },
        {
          id: 50,
          question: "Despite his opponent’s harsh words, Ramon kept his cool and did not retaliate. What does 'keep your cool' mean?",
          options: ["To avoid heat", "To stay calm under pressure", "To remain distant", "To act indifferent", "To hide emotions completely"],
          correctAnswer: 1,
          explanation: "'Keep your cool' means to stay calm and composed, especially in a difficult situation."
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

document.addEventListener('DOMContentLoaded', () => {
    const paForm = document.getElementById('paForm');
    const downloadPdfButton = document.getElementById('downloadPdfButton');
    const competencySelect = document.getElementById('competencySelect');
    const competencyIndicatorsContainer = document.getElementById('competencyIndicatorsContainer');
    const rubricsContainer = document.getElementById('rubricsContainer'); // Added for displaying rubrics on page

    const competencyIndicatorsData = {
        "1": [
            "1.1: Demonstrates respect and empathy for diverse cultural perspectives.",
            "1.2: Applies knowledge of cultural traditions and global trends to address challenges.",
            "1.3: Effectively communicates across languages and cultural contexts.",
            "1.4: Collaborates with others to build understanding and solve problems across cultural divides."
        ],
        "2": [
            "2.1: Breaks down problems into smaller components and identifies solutions.",
            "2.2: Demonstrates originality and flexibility in generating ideas.",
            "2.3: Evaluates evidence critically to make reasoned decisions.",
            "2.4: Applies knowledge creatively to innovate and adapt to new situations."
        ],
        "3": [
            "3.1: Inspires and motivates others through inclusive and ethical leadership.",
            "3.2: Builds and sustains positive relationships within teams.",
            "3.3: Mediates conflicts constructively and promotes collaboration.",
            "3.4: Takes initiative in group settings and contributes to collective problem-solving."
        ],
        "4": [
            "4.1: Demonstrates a growth mindset by embracing setbacks as learning opportunities.",
            "4.2: Maintains focus and balance in the face of stress or uncertainty.",
            "4.3: Advocates for personal and community well-being.",
            "4.4: Perseveres in the pursuit of meaningful goals."
        ],
        "5": [
            "5.1: Engages in service projects that address community needs.",
            "5.2: Reflects on the ethical implications of actions and decisions.",
            "5.3: Promotes sustainability and equity in personal and collaborative endeavors.",
            "5.4: Demonstrates honesty, fairness, and accountability in decision-making."
        ],
        "6": [
            "6.1: Writes, speaks, and presents ideas with clarity and purpose.",
            "6.2: Uses creative forms of expression to convey ideas effectively.",
            "6.3: Actively listens and responds thoughtfully in conversations.",
            "6.4: Adapts communication styles to suit different audiences and contexts."
        ]
    };

    // Ensure jsPDF is loaded before trying to use it
    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF library is not loaded.');
        alert('Error: jsPDF library not found. Please check your internet connection or the script tag.');
        if (downloadPdfButton) {
            downloadPdfButton.disabled = true;
            downloadPdfButton.textContent = 'PDF Library Error';
        }
        return;
    }
    const { jsPDF } = window.jspdf;

    function updateCompetencyIndicators() {
        const selectedCompetency = competencySelect.value;
        competencyIndicatorsContainer.innerHTML = ''; // Clear previous indicators

        if (selectedCompetency && competencyIndicatorsData[selectedCompetency]) {
            const ul = document.createElement('ul');
            competencyIndicatorsData[selectedCompetency].forEach(indicatorText => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'competencyIndicator';
                checkbox.value = indicatorText;
                checkbox.id = 'indicator-' + indicatorText.replace(/[^a-zA-Z0-9]/g, "-"); // Create a unique ID
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = indicatorText;
                
                li.appendChild(checkbox);
                li.appendChild(label);
                ul.appendChild(li);
            });
            competencyIndicatorsContainer.appendChild(ul);
        } else {
            competencyIndicatorsContainer.innerHTML = '<p>Please select a competency to see indicators.</p>';
        }
    }

    if (competencySelect) {
        competencySelect.addEventListener('change', updateCompetencyIndicators);
        // Initial call to populate if a competency is pre-selected (though unlikely with "Select Competency" option)
        updateCompetencyIndicators();
    }

    // Placeholder for rubrics data
    const rubricsData = {
        "1.1: Demonstrates respect and empathy for diverse cultural perspectives.": {
            "Grade 1-3": {
                "Beginning": "Understand little about how other people from different places do things. Might say things that are not nice about them.",
                "Developing": "Knows that people from different places are different but doesn't always understand why. Tries to be nice sometimes.",
                "Proficient": "Understands that people from different places have different ideas. Does not judge different ideas.",
                "Mastery": "Understands how people from different cultures see the world and tries to see things from their point of view."
            },
            "Grade 4-5": {
                "Beginning": "Knows that there are different cultures and tries to be respectful, and understands how others feel with guidance.",
                "Developing": "Respects that people from different cultures have different ideas and feelings. Tries to understand why they think the way they do.",
                "Proficient": "Fully understands and cares about how people from different cultures see the world by showing empathy.",
                "Mastery": "Deeply understands and respects the viewpoints of people from different cultures. Always includes their ideas and helps others learn about them."
            },
            "Grade 6-8": {
                "Beginning": "Shows little understanding of different cultures and might rely on stereotypes about them.",
                "Developing": "Recognizes that different cultures have different ways of doing things and be respectful and show empathy with guidance.",
                "Proficient": "Respects and tries to understand different cultural viewpoints and can talk about the differences in a thoughtful way.",
                "Mastery": "Fully understands and values different cultural perspectives and actively includes them in their interactions and projects, helping to promote understanding among others."
            },
            "Grade 9-12": {
                "Beginning": "Shows limited understanding or respect for different cultural perspectives; may rely on stereotypes or generalizations.",
                "Developing": "Recognizes cultural differences and demonstrates basic respect, though empathy (understanding and sharing the feelings of others) is not consistently evident.",
                "Proficient": "Respects and empathizes with diverse perspectives, engaging in meaningful conversations about cultural differences and similarities.",
                "Mastery": "Fully integrates diverse perspectives into interactions and projects, actively promoting cultural understanding and appreciation within their community and beyond."
            }
        },
        "1.2: Applies knowledge of cultural traditions and global trends to address challenges.": {
            "Grade 1-3": {
                "Beginning": "(intentionally left blank)",
                "Developing": "(intentionally left blank)",
                "Proficient": "Has some knowledge about tradition culture and global trends/issues.",
                "Mastery": "Can come up some ideas relating to contemporary problems using understandings about local and global situation."
            },
            "Grade 4-5": {
                "Beginning": "Has limited knowledge about different cultural traditions or what's going on globally.",
                "Developing": "Knows some things about different cultures and the world but needs some guidance on how to use this to solve problems.",
                "Proficient": "Can demonstrate their knowledge of different cultures and global events when think about how to solve problems.",
                "Mastery": "Uses their strong knowledge of different cultures or global trends to really understand problems and come up with creative solutions, even for big challenges."
            },
            "Grade 6-8": {
                "Beginning": "Has limited knowledge of different cultural traditions or current events around the world and struggles to use this information to solve problems.",
                "Developing": "Knows some cultural traditions or global trends but might not always see how they connect to different problems.",
                "Proficient": "Can use their understanding of cultural traditions and global trends to think about problems in ways that make sense.",
                "Mastery": "Uses a deep understanding of cultural traditions and global trends to generate creative and effective solutions for problems."
            },
            "Grade 9-12": {
                "Beginning": "Identifies cultural traditions (customs, beliefs of different groups) or global trends (major patterns or changes happening worldwide) relevant to tasks or problems with guidance.",
                "Developing": "Identifies some relevant cultural traditions or global trends but applies them inconsistently or in a basic way to address challenges.",
                "Proficient": "Effectively applies knowledge of cultural traditions and global trends to analyze and address challenges in familiar contexts.",
                "Mastery": "Synthesizes knowledge of diverse cultural traditions and global trends to create innovative and insightful solutions for complex, global challenges."
            }
        },
        "1.3: Effectively communicates across languages and cultural contexts.": {
            "Grade 1-3": {
                "Beginning": "(intentionally left blank)",
                "Developing": "(intentionally left blank)",
                "Proficient": "Can sometimes talk to people from different places or who speak different languages, but it can be hard.",
                "Mastery": "Can talk clearly and in a way that is respectful to people who speak different languages or come from different places."
            },
            "Grade 4-5": {
                "Beginning": "Finds it hard to communicate clearly with people who have different languages or come from different cultures.",
                "Developing": "Can usually communicate okay with people from different cultures or who speak different languages about familiar things.",
                "Proficient": "Can communicate clearly and respectfully with people from different cultures and who speak different languages in many situations.",
                "Mastery": "Is excellent at communicating effectively with application of communication, language skills and understandings to cultures."
            },
            "Grade 6-8": {
                "Beginning": "Assistance is needed when communicate with people from different cultures or who speak different languages, or in verbal/written format.",
                "Developing": "Can communicate in familiar cultural, language situations or way of expression, but might not equally effective in the other situation.",
                "Proficient": "Communicates clearly and in a way that shows they understand and respect different cultures and languages consistently.",
                "Mastery": "Is highly skilled at communicating with diverse groups of people from different cultural and language backgrounds effectively to make audience engaged."
            },
            "Grade 9-12": {
                "Beginning": "Can communicates with some clarity in either one language or single cultural context.",
                "Developing": "Communicates effectively in familiar cultural and linguistic contexts but may need assistance with appropriateness in unfamiliar ones.",
                "Proficient": "Demonstrates clarity and appropriateness according to context in their communication across multilingual and multicultural settings.",
                "Mastery": "Adapts communication style (verbal, nonverbal, written) seamlessly to effectively engage diverse audiences across different languages and cultural contexts, ensuring understanding and building rapport."
            }
        },
        "1.4: Collaborates with others to build understanding and solve problems across cultural divides.": {
            "Grade 1-3": {
                "Beginning": "(intentionally left blank)",
                "Developing": "(intentionally left blank)",
                "Proficient": "Works well with others who are different from them. Tries to understand their ideas and solve problems together.",
                "Mastery": "Is excellent at working with people from all different backgrounds. Helps everyone understand each other and solve problems together peacefully."
            },
            "Grade 4-5": {
                "Beginning": "Can work well with people with similarities or known each other well.",
                "Developing": "Participates in group work with people from different backgrounds and tries to understanding their ideas or solving problems.",
                "Proficient": "Works well with people from different cultures and tries to understand their ideas to solve problems together.",
                "Mastery": "Is very good at working with people from all different cultures. Helps everyone understand each other's ideas and tries to lead a team to make everyone work towards same goals."
            },
            "Grade 6-8": {
                "Beginning": "Starts to work with people from different cultures and understands their viewpoints with assistance.",
                "Developing": "Works with others from different cultures but tries to understanding their perspectives or finding common ground to solve problems.",
                "Proficient": "Works effectively with people from different cultural backgrounds, can lead the team and work out solutions to problems together.",
                "Mastery": "Is skilled at leading group work with people from diverse cultural backgrounds, helping everyone understand each other and working together to solve problems with empathy and respect."
            },
            "Grade 9-12": {
                "Beginning": "Begins to engage in collaborative efforts with individuals from different cultural backgrounds.",
                "Developing": "Participates in collaborative efforts with individuals from diverse cultural backgrounds begin to address cultural misunderstandings or build strong understanding.",
                "Proficient": "Collaborates effectively with individuals from diverse cultural settings, fostering understanding and working together to solve problems across cultural divides.",
                "Mastery": "Leads collaborative efforts to bridge cultural divides, proactively fostering understanding, resolving misunderstandings with empathy and cultural sensitivity, and guiding diverse teams towards shared solutions."
            }
        },
        "2.1: Breaks down problems into smaller components and identifies solutions.": {
            "Grade 1-3": {
                "Beginning": "Needs some help to understand what the problem is really about. Their ideas for fixing it might not make sense or be complete.",
                "Developing": "Can sometimes see parts of a problem. Their ideas might fix some of it but not all.",
                "Proficient": "Can break down a problem into smaller parts. Has some good ideas for how to solve it.",
                "Mastery": "Can really understand all the parts of a problem, even tricky ones. Comes up with thorough and reasonable ways to fix it."
            },
            "Grade 4-5": {
                "Beginning": "Needs help to see all the parts of a problem. Their ideas to solve it might only fix some of it.",
                "Developing": "Can break down some problems but might miss some important parts. Their solutions might not solve everything.",
                "Proficient": "Can break down problems into smaller pieces and come up with clear and logical ways to solve them.",
                "Mastery": "Can understand even complicated problems by breaking them down. Comes up with solutions that make sense."
            },
            "Grade 6-8": {
                "Beginning": "breaks down a problem into smaller pieces with guidance. Their ideas for solutions might be unclear or not fully address the problem.",
                "Developing": "Can sometimes break down a problem with guidance. Their proposed solutions might only address some parts of the problem.",
                "Proficient": "Can break down problems into smaller, more manageable parts. Proposes solutions that are clear, make sense, and address the problem.",
                "Mastery": "Can analyze problems thoroughly by breaking them down into smaller parts and understanding how they connect. Proposes creative and well-supported solutions."
            },
            "Grade 9-12": {
                "Beginning": "Struggles to identify key components of a problem; proposed solutions are vague, incomplete, or don't address the core issue.",
                "Developing": "Breaks down problems inconsistently, addressing some but not all aspects; proposed solutions may lack a clear connection to the problem's components.",
                "Proficient": "Breaks down problems systematically by identifying key components and their relationships; proposes clear, logical, and well-organized solutions.",
                "Mastery": "Analyzes problems comprehensively by dissecting them into fundamental components and understanding underlying complexities; proposes innovative, well-supported, and thoroughly reasoned solutions."
            }
        },
        "2.2: Demonstrates originality and flexibility in generating ideas.": {
            "Grade 1-3": {
                "Beginning": "Doesn't have many ideas and has trouble thinking of different ways to do things.",
                "Developing": "Can think of a few different ideas but might get stuck if their first idea doesn't work.",
                "Proficient": "Can come up with lots of different and new ideas. Can change their ideas if they need to.",
                "Mastery": "Comes up with independent ideas all the time. Is great at thinking in different ways to solve problems."
            },
            "Grade 4-5": {
                "Beginning": "Doesn't come up with many new ideas and finds it hard to change their thinking.",
                "Developing": "Can come up with some different ideas but might have trouble changing their ideas when things change.",
                "Proficient": "Can come up with many creative ideas and can change their thinking or try new things if their first ideas don't work.",
                "Mastery": "Is full of unique and interesting ideas and can easily change their thinking to find the best solution to a problem on their own."
            },
            "Grade 6-8": {
                "Beginning": "Has few original ideas and struggles to think in different ways when needed.",
                "Developing": "Can come up with more than one idea with guidance but might struggle to change their approach if their initial ideas don't work.",
                "Proficient": "Regularly comes up with creative ideas and can change their approach or ideas based on what they learn or if things change.",
                "Mastery": "Always comes up with highly original ideas and can easily think in different ways to solve even complex problems."
            },
            "Grade 9-12": {
                "Beginning": "Generates few original ideas and demonstrates limited flexibility in their thinking or approach to tasks.",
                "Developing": "Generates multiple ideas but may struggle to adapt their thinking or innovate when faced with new information or changing conditions.",
                "Proficient": "Consistently generates creative and original ideas, demonstrating flexibility in their thinking and adapting their approaches based on feedback or new information.",
                "Mastery": "Produces highly original and inventive ideas, demonstrating exceptional flexibility and innovation in their thinking and problem-solving approaches, even in complex situations."
            }
        },
        "2.3: Evaluates evidence critically to make reasoned decisions.": {
            "Grade 1-3": {
                "Beginning": "Might make assertion without really thinking about it.",
                "Developing": "Their reasons for opinion might not be very strong.",
                "Proficient": "Can sometimes look at information and see if it makes sense. Makes arguments based on good reasons.",
                "Mastery": "Is very good at looking at information and deciding if it's really true and important. Always makes arguments based on careful thinking and good reasons."
            },
            "Grade 4-5": {
                "Beginning": "Finds it hard to look at information and decide if it's good information. Their choices might not be based on facts.",
                "Developing": "Can sometimes tell if information is helpful but might not always think carefully about it. Their reasons for choices might not be very clear.",
                "Proficient": "Looks at information closely and decides if it's good evidence independently. Uses this information to make choices that make sense.",
                "Mastery": "Is excellent at looking at information and figuring out if it's strong evidence considering quality of source and relevance. Uses this to make thoughtful and logical decisions."
            },
            "Grade 6-8": {
                "Beginning": "Starts to look at information carefully to decide if it's true or important. Their decisions might not be based on good reasons.",
                "Developing": "Can look at information and understand the importance of evaluating information, but might not always be very thorough in their thinking.",
                "Proficient": "Carefully looks at information and decides if it's good evidence to support their ideas. Makes decisions based on clear and logical reasons.",
                "Mastery": "Shows exceptional ability to look at information, evaluate how strong it is from multiple aspects, and use it to make well-reasoned and logical decisions."
            },
            "Grade 9-12": {
                "Beginning": "Evaluates evidence with guidance; decisions may be based on incomplete, unreliable, or irrelevant information without logical reasoning.",
                "Developing": "Evaluates evidence inconsistently, accepting information at face value or relying on limited sources; reasoning may lack depth or thoroughness.",
                "Proficient": "Evaluates evidence systematically by considering its source, relevance, and validity; uses this evaluation to make reasoned, logical, and well-supported decisions.",
                "Mastery": "Demonstrates exceptional critical thinking by thoroughly analyzing and synthesizing complex evidence from various sources to make insightful, well-justified, and nuanced decisions."
            }
        },
        "2.4: Applies knowledge creatively to innovate and adapt to new situations.": {
            "Grade 1-3": {
                "Beginning": "(intentionally left blank)",
                "Developing": "(intentionally left blank)",
                "Proficient": "Can fully understand what they know. Starts to apply knowledge to answer other questions.",
                "Mastery": "Is excellent at using what they know to come up with ideas to answer questions."
            },
            "Grade 4-5": {
                "Beginning": "Tries to get deeper understandings to what have been learned.",
                "Developing": "Can understand what they have learned, but assistance is needed when trying to apply knowledge to other contexts.",
                "Proficient": "Can use what they've learned to solve new problems and try different ways of doing things.",
                "Mastery": "Is very good at using their knowledge to create new ideas as solutions in many different situations."
            },
            "Grade 6-8": {
                "Beginning": "Start to explore how to use what they know in new situations or come up with new ways of doing things.",
                "Developing": "Can use what they know in situations they've seen before, and needs guidance to transfer to new contexts.",
                "Proficient": "Can consistently use their knowledge in new situations and come up with creative ways to solve problems or do things differently.",
                "Mastery": "Shows exceptional ability to use their knowledge in a wide range of dynamic and complex situations."
            },
            "Grade 9-12": {
                "Beginning": "adapts their knowledge to new situations with guidance with little innovation in their approach.",
                "Developing": "Applies knowledge in familiar contexts, and start to apply it creatively or innovate in unfamiliar or complex scenarios.",
                "Proficient": "Consistently applies their knowledge creatively to adapt to new situations and innovate in their approaches to tasks and challenges.",
                "Mastery": "Excels in applying their knowledge to create innovative and effective solutions in dynamic and complex situations, demonstrating a high degree of adaptability and resourcefulness."
            }
        },
        "3.1: Inspires and motivates others through inclusive and ethical leadership.": {
            "Grade 1-3": {
                "Beginning": "(intentionally left blank)",
                "Developing": "(intentionally left blank)",
                "Proficient": "(intentionally left blank)",
                "Mastery": "(intentionally left blank)"
            },
            "Grade 4-5": {
                "Beginning": "Start to learn how to encourage others and what inclusivity is when learning how to lead.",
                "Developing": "Sometimes gets others to join in. Usually tries to include everyone and be fair when leading.",
                "Proficient": "Gets others interested in working together and makes sure everyone feels included and is treated fairly when they are helping to lead.",
                "Mastery": "Inspires others to work together and makes everyone feel important and included. Always acts fairly."
            },
            "Grade 6-8": {
                "Beginning": "Can sometimes encourage others to work together. Usually tries to be fair and include everyone when helping lead.",
                "Developing": "Can get others excited to participate. Shows some understanding of being fair and including others when leading.",
                "Proficient": "Effectively encourages their peers to work together. Consistently tries to be fair and include everyone when taking a leadership role.",
                "Mastery": "Is great at inspiring others and making them want to work together. Always makes sure everyone feels included and is treated fairly, and encourages others to lead in a positive way."
            },
            "Grade 9-12": {
                "Beginning": "Start to understand inclusivity and ethical consideration in leadership with limited practices.",
                "Developing": "Engages peers when asked to do so; demonstrates preliminary inclusivity and ethical awareness in leadership situations.",
                "Proficient": "Motivates peers effectively, consistently modeling inclusive (ensuring everyone is involved and valued) and ethical (acting with integrity and fairness) leadership.",
                "Mastery": "Inspires peers and broader groups with transformative, inclusive, and ethical leadership practices, fostering a positive and collaborative environment where everyone feels valued and motivated."
            }
        },
        "3.2: Builds and sustains positive relationships within teams.": {
            "Grade 1-3": {
                "Beginning": "Has trouble making friends in a group. Might not want to work with others or might argue a lot.",
                "Developing": "Plays with others in a group but sometimes has trouble sharing or working things out.",
                "Proficient": "Is good at making friends in a group and works well with others.",
                "Mastery": "Is great at making everyone in a group feel like they belong and helps the team work together really well."
            },
            "Grade 4-5": {
                "Beginning": "Finds it hard to get along with others in a group. Might avoid working with others or cause disagreements.",
                "Developing": "Participates in group activities but sometimes needs helps getting along with others or solving problems.",
                "Proficient": "Works well with others in a group consistently and helps everyone to get along.",
                "Mastery": "Helps everyone in a group feel connected and work together smoothly. Is very good at staying positive."
            },
            "Grade 6-8": {
                "Beginning": "Needs some helps to work With others together.",
                "Developing": "Works with others in a group but might needs assistance to share ideas with others or supports others' ideas.",
                "Proficient": "Actively works to have good relationships with teammates and helps the group work well together.",
                "Mastery": "Is excellent at building strong relationships within a team and helps everyone work together effectively."
            },
            "Grade 9-12": {
                "Beginning": "Struggles to build relationships within teams; may avoid collaboration or contribute to conflicts within the group.",
                "Developing": "Participates in team activities but struggles to sustain positive relationships or effectively resolve conflicts that arise.",
                "Proficient": "Actively builds positive relationships with team members, contributing to effective teamwork and demonstrating skills in conflict resolution.",
                "Mastery": "Strengthens team dynamics through proactive relationship-building, fostering a positive and supportive environment, and effectively employing conflict mediation strategies to ensure team cohesion."
            }
        },
        "3.3: Mediates conflicts constructively and promotes collaboration.": {
            "Grade 1-3": {
                "Beginning": "Avoids facing arguments or conflicts. Might make things worse.",
                "Developing": "Tries to help when others argue with basic skills.",
                "Proficient": "Helps others solve arguments in a good way so everyone can work together again.",
                "Mastery": "Is good at helping people solve even big arguments so everyone feels heard and can work together happily."
            },
            "Grade 4-5": {
                "Beginning": "Is not very confident to help when there are disagreements. Might take sides or make things more tense.",
                "Developing": "Attempts to help when there are disagreements but might not always be successful or fair.",
                "Proficient": "Helps people who are disagreeing to talk and find a way to work together peacefully.",
                "Mastery": "Is excellent at helping people who are fighting to understand each other and find solutions so everyone can work together well."
            },
            "Grade 6-8": {
                "Beginning": "Intervenes conflicts by stopping it from escalating.",
                "Developing": "Tries to help solve small-scale disagreements with some skills.",
                "Proficient": "Is good at helping people who are in a conflict find a solution so they can work together positively.",
                "Mastery": "Is highly skilled at resolving conflicts, helping people understand each other's viewpoints and finding solutions that allow for positive collaboration and strong group dynamics."
            },
            "Grade 9-12": {
                "Beginning": "Starts to mediate conflicts between others; may exacerbate tensions within a group rather than helping to resolve them.",
                "Developing": "Attempts to mediate conflicts between others but with limited success or consistency in finding positive solutions.",
                "Proficient": "Mediates conflicts effectively by listening to all sides, identifying common ground, and guiding individuals towards positive collaboration and resolution.",
                "Mastery": "Skillfully resolves conflicts by employing advanced mediation techniques, fostering a culture of collaboration, mutual respect, and trust within groups, leading to stronger team cohesion and productivity."
            }
        },
        "3.4: Takes initiative in group settings and contributes to collective problem-solving.": {
            "Grade 1-3": {
                "Beginning": "Usually waits for others to tell them what to do in a group. Helps little with solving problems.",
                "Developing": "Sometimes has ideas in a group but choose to keep them instead of sharing. Helps a little with solving problems when asked.",
                "Proficient": "Often has ideas in a group and shares them. Helps solve problems by offering suggestions and helping out.",
                "Mastery": "Always has great ideas in a group and helps the team solve even hard problems. They often lead the way and get others involved."
            },
            "Grade 4-5": {
                "Beginning": "Usually lets others take the lead in a group. Doesn't often share ideas for solving problems.",
                "Developing": "Sometimes offers ideas in a group and helps solve problems when someone asks them to.",
                "Proficient": "Regularly shares their ideas in a group and helps the group solve problems by offering solutions and taking action.",
                "Mastery": "Is always coming up with ideas in a group and helps the team solve even difficult problems. Often takes charge and gets everyone working together towards a solution."
            },
            "Grade 6-8": {
                "Beginning": "Rarely offers ideas or steps up to help when the group needs to solve a problem.",
                "Developing": "Occasionally suggests ideas or takes the lead in a group. Their help with problem-solving might not always be consistent.",
                "Proficient": "Often takes the lead in group activities and actively helps the group find solutions to problems by sharing ideas and participating.",
                "Mastery": "Consistently steps up to lead in group situations and is a driving force in helping the group find creative and effective solutions to problems."
            },
            "Grade 9-12": {
                "Beginning": "Rarely takes initiative in group settings or contributes meaningfully to the process of collective problem-solving.",
                "Developing": "Occasionally takes initiative in group tasks; contributions to problem-solving are sometimes helpful but may lack consistency or depth.",
                "Proficient": "Regularly takes initiative in group settings, contributing effectively to collective problem-solving through active participation, idea generation, and willingness to lead when appropriate.",
                "Mastery": "Consistently leads by example in group settings, proactively taking initiative and driving group efforts toward successful and innovative solutions to complex problems."
            }
        },
        "4.1: Demonstrates a growth mindset by embracing setbacks as learning opportunities.": {
            "Grade 1-3": {
                "Beginning": "Gets very upset when things don't go their way and thinks they can't do it.",
                "Developing": "Feels sad or frustrated when they make a mistake but can sometimes try again.",
                "Proficient": "Would not easily give up, but with basic reflection for improvements happen.",
                "Mastery": "Understands that mistakes help them learn and tries to figure out what to do differently next time."
            },
            "Grade 4-5": {
                "Beginning": "Gets discouraged when things are hard and sees mistakes as bad things.",
                "Developing": "Knows that mistakes can help them learn, and start to develop reflective skills to try to work out different practices next time.",
                "Proficient": "Tries to learn from mistakes and uses what they learned to help them do better in the future.",
                "Mastery": "Always demonstrates resilience by not giving up, and has clear strategies/ideas to do better in future."
            },
            "Grade 6-8": {
                "Beginning": "Finds it hard to deal with mistakes and usually sees challenges as things they can't overcome.",
                "Developing": "Can sometimes see mistakes as a chance to learn but might still get upset or give up easily.",
                "Proficient": "Thinks through about their mistakes and uses what they learned to improve in the future.",
                "Mastery": "Always looks at mistakes as a way to grow and learn with demonstration of excellent reflection skills."
            },
            "Grade 9-12": {
                "Beginning": "Struggles to cope with setbacks; views challenges as barriers rather than opportunities for learning and growth.",
                "Developing": "Acknowledges setbacks and reflects on the experience with some guidance to keep going.",
                "Proficient": "Reflects on setbacks constructively, identifying what they can learn and applying those lessons to future tasks and challenges to move on.",
                "Mastery": "Fully embraces setbacks as opportunities for growth and learning, inspiring others with their resilient attitude and determination to improve."
            }
        },
        "4.2: Maintains focus and balance in the face of stress or uncertainty.": {
            "Grade 1-3": {
                "Beginning": "Gets easily upset or distracted.",
                "Developing": "Can sometimes calm down or focus when things are hard, but it's not always easy.",
                "Proficient": "Knows how to calm down and focus when facing difficulties.",
                "Mastery": "Can always be focused with a peaceful mind even when things are tricky or they are not sure what will happen."
            },
            "Grade 4-5": {
                "Beginning": "Gets worried or can't focus when things get stressful or confusing.",
                "Developing": "Tries some ways to deal with stress or confusion but might still get overwhelmed sometimes.",
                "Proficient": "Uses good ways to stay calm and focused when things are stressful or when they don't know what to expect.",
                "Mastery": "Stays very calm and focused even when things are stressful or when there are many unknowns. They can help others feel better too."
            },
            "Grade 6-8": {
                "Beginning": "Starts to stay calm and focused when things get stressful or uncertain.",
                "Developing": "Knows some ways to handle stress and can stay focused or balanced when things are really tough with help.",
                "Proficient": "Uses effective ways to stay focused and keep their emotions stable when facing stressful or uncertain situations and can tries to help others.",
                "Mastery": "Shows great ability to stay focused and emotionally balanced even when things are complex or stressful. They can often help others to feel better."
            },
            "Grade 9-12": {
                "Beginning": "Start to be aware of maintaining focus or manage feelings of stress or uncertainty in challenging situations.",
                "Developing": "Demonstrates some basic coping strategies (e.g., taking a break, talking to someone) and tries to sustain balance during extended periods of stress or uncertainty.",
                "Proficient": "Applies effective coping strategies (e.g., mindfulness, problem-solving) to maintain focus and emotional balance in stressful or uncertain situations.",
                "Mastery": "Models exceptional focus and emotional balance, remaining composed and effective even under high levels of stress or significant uncertainty, and often supports others in doing the same."
            }
        },
        "4.3: Advocates for personal and community well-being.": {
            "Grade 1-3": {
                "Beginning": "Tries to identify what they need to make them happy.",
                "Developing": "Knows that it's important to be healthy and happy.",
                "Proficient": "Knows what makes them feel good and tries to help others feel good too.",
                "Mastery": "Always looks out for their own well-being and finds ways to help everyone in their community be healthy and happy."
            },
            "Grade 4-5": {
                "Beginning": "Understands that it's important to be healthy and happy.",
                "Developing": "Can stay balanced. Sometimes thinks about whether others are staying okay.",
                "Proficient": "Speaks up for things that help themselves and their community stay healthy and happy.",
                "Mastery": "Is a strong voice for things that make themselves and their community healthy and happy, and inspires others to do the same."
            },
            "Grade 6-8": {
                "Beginning": "Tries to think about or to speak up about what makes themselves or their community healthy and happy.",
                "Developing": "Is starting to think about what's good for themselves and their community but might not always take action.",
                "Proficient": "Regularly talks about and supports things that help themselves and their community be healthy, safe, and happy.",
                "Mastery": "Is a leader in promoting well-being for themselves and their community, inspiring others to prioritize their health and happiness."
            },
            "Grade 9-12": {
                "Beginning": "Tries to consider or advocate for personal and community well-being, primarily focusing on their own immediate needs.",
                "Developing": "Shows awareness of the importance of well-being for themselves and others.",
                "Proficient": "Consistently advocates for both personal and community well-being (e.g., healthy habits, safety, mental health) in meaningful and appropriate ways.",
                "Mastery": "Demonstrates exceptional advocacy for well-being, taking initiative to raise awareness, promote healthy practices, and inspire others to prioritize their physical, emotional, and social wellness."
            }
        },
        "4.4: Perseveres in the pursuit of meaningful goals.": {
            "Grade 1-3": {
                "Beginning": "Starts to learn how to set up goals.",
                "Developing": "Is able to determine simple goals and to build pathway in achieving the goal.",
                "Proficient": "Can Keep trying even when things are hard and doesn't give up until they reach their goal.",
                "Mastery": "Show exceptional persistence on pursuing important goals, even when things are really tough."
            },
            "Grade 4-5": {
                "Beginning": "Usually tries to finish goals they start but might need help when facing setbacks.",
                "Developing": "Can successfully achieve goals they set up, and start to think about how to establish a more meaningful goal.",
                "Proficient": "Keeps working towards their meaningful goals even when overcoming barriers are required on the way.",
                "Mastery": "Shows great determination in reaching challenging goals, even when facing big challenges."
            },
            "Grade 6-8": {
                "Beginning": "Begins to learn how to set up a goal that is more meaningful or for a longer period of time.",
                "Developing": "Can usually work effectively and manage to reach regular goals, and try to deal with challenging ones.",
                "Proficient": "Sticks with their personal goals and keeps working hard even when things are difficult or take a long time to achieve.",
                "Mastery": "Shows exceptional determination and keeps working towards important goals no matter what."
            },
            "Grade 9-12": {
                "Beginning": "Tries to build abilities, skills, strategies of pursuing long-term or challenging goals.",
                "Developing": "Can maintain focus on goals for a certain period of time and try to cope with bumps on the way with help.",
                "Proficient": "Perseveres consistently, overcoming challenges and adapting strategies as needed to achieve meaningful goals they have set for themselves.",
                "Mastery": "Demonstrates exceptional perseverance, showing unwavering commitment to meaningful goals and inspiring others through their determination, focus, and ability to overcome obstacles."
            }
        },
        "5.1: Engages in service projects that address community needs.": {
            "Grade 1-3": {
                "Beginning": "(an intentional blank)",
                "Developing": "(an intentional blank)",
                "Proficient": "Helps with service projects and does their part to help the community.",
                "Mastery": "Takes part in service project proactively."
            },
            "Grade 4-5": {
                "Beginning": "Has heard about helping the community but hasn't been very involved in projects.",
                "Developing": "Participates in service projects when asked to do so.",
                "Proficient": "Actively takes part in service projects and helps in a way that makes a difference in the community.",
                "Mastery": "Comes up with own service projects and encourage others to participate."
            },
            "Grade 6-8": {
                "Beginning": "Shows little understanding of or involvement in service projects.",
                "Developing": "Joins in service projects and helps out voluntarily to try to make a difference in community.",
                "Proficient": "Takes an active role in service projects and helps to meet the needs of the community in a meaningful way.",
                "Mastery": "Takes charge of planning and leading service projects with consideration of authentic important community needs."
            },
            "Grade 9-12": {
                "Beginning": "Shows some involvement, but the understanding of community needs is limited in service projects.",
                "Developing": "Participates in service projects, and can demonstrate initiative in identifying or planning with some guidance.",
                "Proficient": "Actively engages in service projects, contributing meaningfully to addressing identified community needs.",
                "Mastery": "Takes initiative to design and lead impactful service projects addressing significant community needs within their school, community, or beyond."
            }
        },
      
        "5.2: Reflects on the ethical implications of actions and decisions.": {
            "Grade 1-3": {
                "Beginning": "(an intentional blank)",
                "Developing": "(an intentional blank)",
                "Proficient": "Is starting to think about what is fair and unfair.",
                "Mastery": "Usually thinks about whether their actions are fair and right before they do something."
            },
            "Grade 4-5": {
                "Beginning": "Sometimes thinks about whether something is fair or not, but not always.",
                "Developing": "Usually thinks about whether their actions are fair and right before they do something.",
                "Proficient": "Usually thinks about what is right and wrong and tries to make good choices.",
                "Mastery": "Always thinks very carefully about whether their actions are fair and right and why."
            },
            "Grade 6-8": {
                "Beginning": "Rarely stops to think about whether their choices are the right thing to do.",
                "Developing": "Starts to think about the right and wrong things to do, but might not always do it.",
                "Proficient": "Regularly thinks about the ethical side of their actions and tries to make responsible decisions.",
                "Mastery": "Carefully considers the ethical reasons behind their actions and decisions, thinking about how it affects others."
            },
            "Grade 9-12": {
                "Beginning": "Rarely considers the ethical implications(right vs. wrong, fairness) of their actions or decisions.",
                "Developing": "Demonstrates awareness of ethical considerations(e.g.,fairness, honesty) but may not consistently apply them to their actions and decisions.",
                "Proficient": "Consistently evaluates and applies ethical considerations (e.g.,principles of justice, responsibility) in their decision-making processes.",
                "Mastery": "Models exceptional ethical reasoning, thoughtfully considering the broader implications and potential consequences of their actions and decisions on themselves and others."
            }
        },
        "5.3: Promotes sustainability and equity in personal and collaborative endeavors.": {
            "Grade 1-3": {
                "Beginning": "(an intentional blank)",
                "Developing": "(an intentional blank)",
                "Proficient": "Tries to save resources and make sure everyone is treated fairly when working with others.",
                "Mastery": "Always looks for ways to save resources and make sure everyone is treated equally in everything they do and when working with others."
            },
            "Grade 4-5": {
                "Beginning": "Start to know about saving things and being fair, but doesn't do it much.",
                "Developing": "Understands it's important to take care of the Earth and be fair to everyone, but doesn't always act on it.",
                "Proficient": "Works to save resources and make sure everyone has a chance to participate fairly in projects.",
                "Mastery": "Always finds ways to help the environment and make sure everyone has a fair chance in all they do and in group projects."
            },
            "Grade 6-8": {
                "Beginning": "Shows limited understanding of the importance of taking care of the environment or making sure things are fair for everyone.",
                "Developing": "Understands that it's important to protect the environment and treat everyone fairly.",
                "Proficient": "Actively tries to use resources wisely and make sure everyone is treated fairly in their own work and when working with others.",
                "Mastery": "Takes the lead in finding ways to be more sustainable and make sure everyone is respected in their own actions and in group projects, encouraging others to do the same."
            },
            "Grade 9-12": {
                "Beginning": "Demonstrates limited awareness or action to promote sustainability(e.g.,conserving resources) or equity(fairness for all).",
                "Developing": "Acknowledges the importance of sustainability and equity in projects but acts inconsistently in personal and group settings.",
                "Proficient": "Actively promotes sustainability(e.g.,reducing waste,conserving energy) and equity(e.g.,ensuring equal opportunities) in personal and group projects.",
                "Mastery": "Leads by example, designing and implementing initiatives that significantly advance sustainability and equity within their school, community, or beyond."
            }
        },
        "5.4: Demonstrates honesty, fairness, and accountability in decision-making.": {
            "Grade 1-3": {
                "Beginning": "(an intentional blank)",
                "Developing": "(an intentional blank)",
                "Proficient": "Always tries to tell the truth and be fair in their choices on their own.",
                "Mastery": "Always tells the truth, is fair to everyone, and encourage others to do the same."
            },
            "Grade 4-5": {
                "Beginning": "Sometimes makes honest choices and tries to be fair, but might not always.",
                "Developing": "Usually tries to be honest and fair when making choices.",
                "Proficient": "Always tries to be honest and fair when making decisions. Considers impacts on others.",
                "Mastery": "Always makes honest and fair choices and considers others' perspectives."
            },
            "Grade 6-8": {
                "Beginning": "Has trouble always being honest and fair. Might try to blame others when things go wrong.",
                "Developing": "Usually makes honest and fair decisions with some guidance.",
                "Proficient": "Consistently makes ethical decisions independently.Thinks about accountability in decision and actions.",
                "Mastery": "Always acts with ethics and encouraging others to do the same. Takes accountability for decisions and actions."
            },
            "Grade 9-12": {
                "Beginning": "Struggles to make honest or fair decisions; avoids taking responsibility or accountability for their actions.",
                "Developing": "Makes honest decisions inconsistently; takes accountability for actions primarily when prompted or when consequences are evident.",
                "Proficient": "Consistently demonstrates honesty, fairness, and accountability in their decisions and actions, understanding the importance of these values.",
                "Mastery": "Exemplifies honesty and fairness in all decisions, proactively taking accountability for their actions and inspiring others through their example to uphold these ethical principles."
            }
        },
        "6.1: Writes, speaks, and presents ideas with clarity and purpose.": {
            "Grade 1-3": {
                "Beginning": "Shares ideas, but they may be hard to understand. Struggles to stay on topic.",
                "Developing": "Shares ideas clearly about familiar things but might get mixed up when talking about new things.",
                "Proficient": "Shares ideas clearly and stays on topic when talking or writing. People can understand what they mean.",
                "Mastery": "Shares even tricky ideas very clearly in more than on way. They know how to keep people interested and understand their point."
            },
            "Grade 4-5": {
                "Beginning": "Shares ideas, but the meaning might not be clear. It can be hard to follow.",
                "Developing": "Shares ideas clearly about things they know in either speaking or writing.",
                "Proficient": "Shares ideas clearly and usually make efforts to consider audience.",
                "Mastery": "Shares difficult ideas in various ways.They can organize their ideas well to make others understand."
            },
            "Grade 6-8": {
                "Beginning": "Shares ideas, but they may lack clear organization or a main point.",
                "Developing": "Shares ideas clearly with improvement in being an organized way or have a clear purpose.",
                "Proficient": "Clearly shares ideas in writing,speaking,and presentations, with a clear purpose and logical organization across different situations.",
                "Mastery": "Articulates even complex ideas clearly and purposefully in writing, speaking, and presentations, adapting how they share to keep different audiences engaged."
            },
            "Grade 9-12": {
                "Beginning": "Starts to develop structure and clarity in communication.",
                "Developing": "Communicates ideas clearly in familiar contexts but may lack a strong sense of purpose or logical flow in more complex settings.",
                "Proficient": "Consistently communicates ideas with clarity, coherence, and a defined purpose across various audiences and contexts.",
                "Mastery": "Articulates complex ideas with precision, adapting tone, style, and structure to effectively engage and inform diverse audiences for specific purposes."
            }
        },
        "6.2: Uses creative forms of expression to convey ideas effectively.": {
            "Grade 1-3": {
                "Beginning": "Tries to be creative but it might not help get their idea across.",
                "Developing": "Uses some creative ways to share ideas, like drawing or acting, but it might not always be easy to understand.",
                "Proficient": "Uses fun and creative ways to share ideas so that others can understand them better.",
                "Mastery": "Always finds new and exciting ways to share even hard ideas so everyone really understands."
            },
            "Grade 4-5": {
                "Beginning": "Tries some creative ways to share ideas, but it might not always be clear.",
                "Developing": "Uses some creative ways to share ideas, like stories or pictures, but sometimes it's hard to see the point.",
                "Proficient": "Uses creative ways like stories, songs, or art to help people understand their ideas.",
                "Mastery": "Finds many interesting and unique ways to share even harder ideas so that everyone can understand them well."
            },
            "Grade 6-8": {
                "Beginning": "Shows some creativity when sharing ideas, but it might not always make sense or help others understand.",
                "Developing": "Uses creative ways to share ideas, like using different words or making visuals, but sometimes it's not very clear.",
                "Proficient": "Uses creative ways like storytelling, visuals, or technology to make their ideas interesting and easier to understand.",
                "Mastery": "Consistently uses new and interesting creative methods to share even complex ideas in a way that really grabs people's attention and helps them understand."
            },
            "Grade 9-12": {
                "Beginning": "Demonstrates limited creativity or effectiveness when expressing ideas.",
                "Developing": "Uses some creative forms of expression but may struggle with clarity, purpose, or impact.",
                "Proficient": "Effectively integrates creative expression(e.g., visual aids, multimedia, performance) into communication to enhance understanding and engagement.",
                "Mastery": "Consistently employs innovative and impactful creative methods to communicate complex ideas effectively, leaving a lasting impression on the audience."
            }
        },
        "6.3: Actively listens and responds thoughtfully in conversations.": {
            "Grade 1-3": {
                "Beginning": "(an intentional blank)",
                "Developing": "(an intentional blank)",
                "Proficient": "Can pay attention when others talk and understand most of ideas.",
                "Mastery": "Always listens very carefully and gives thoughtful reactions to help everyone understand each other."
            },
            "Grade 4-5": {
                "Beginning": "Sometimes can listen carefully when others talk with guidance.",
                "Developing": "Usually listens and understands when others talk about things in more complicated situation.",
                "Proficient": "Listens carefully when others talk and can understand brief ideas and makes attempts to build mutual understandings.",
                "Mastery": "Always listens very carefully to what others say and gives thoughtful responses that help everyone understand each other better."
            },
            "Grade 6-8": {
                "Beginning": "Has trouble paying attention when others are talking. Their responses might not be related or helpful.",
                "Developing": "Pays attention when others are talking about things in more complex conversations and can understand main ideas.",
                "Proficient": "Pays close attention when others are talking and can fully grasp ideas before responding appropriately to push conversation going in complex conversations.",
                "Mastery": "Shows exceptional listening skills by really paying attention to what others say and responding in a way that helps everyone understand each other and keeps the conversation going in all situations. Can also reads between lines to identify unsaid intensions."
            },
            "Grade 9-12": {
                "Beginning": "Begin to learn how to listen actively; might interrupt when others are talking.",
                "Developing": "Can listen actively and start to build capacity to fully engage and respond thoughtfully in more complex or nuanced conversations.",
                "Proficient": "Consistently listens actively and responds thoughtfully to others in various contexts, demonstrating understanding and respect for different perspectives.",
                "Mastery": "Demonstrates exceptional listening and response skills, fostering mutual understanding, building rapport, and contributing meaningfully to all conversations."
            }
        },
        "6.4: Adapts communication styles to suit different audiences and contexts.": {
            "Grade 1-3": {
                "Beginning": "(an intentional blank)",
                "Developing": "(an intentional blank)",
                "Proficient": "(an intentional blank)",
                "Mastery": "(an intentional blank)"
            },
            "Grade 4-5": {
                "Beginning": "(an intentional blank)",
                "Developing": "(an intentional blank)",
                "Proficient": "Knows how to talk differently to different people(like a friend versus a grown-up).",
                "Mastery": "Always knows the best way to talk and act with different people in different situations to help everyone understand and connect."
            },
            "Grade 6-8": {
                "Beginning": "Starts to be aware of that it is necessary to adjust communication style according to context.",
                "Developing": "Understands why it is necessary to adjust communication style when needed. Tries to learn with guidance.",
                "Proficient": "Changes how they communicate(like their words and tone) depending on who they are talking to and the situation so that they can be understood.",
                "Mastery": "Seamlessly changes how they communicate in diverse situations and with people with different backgrounds so that they can connect with everyone and make sure their message is clear and engaging."
            },
            "Grade 9-12": {
                "Beginning": "Is skillful in a specific communication style and tends to stick with it regardless of audience and context.",
                "Developing": "Demonstrates awareness and efforts in pair communication styles with context to try to convey messages effectively.",
                "Proficient": "Adapts communication style appropriately(e.g.,language, tone, format) to effectively engage different audiences in various contexts.",
                "Mastery": "Seamlessly adapts communication styles (verbal, nonverbal, written, digital) to effectively engage, inform, and inspire diverse audiences across a wide range of contexts."
            }
        }
    };

    function displayRubricsForSelectedIndicators() {
        if (!rubricsContainer) return;
        rubricsContainer.innerHTML = '';
        const selectedCheckboxes = document.querySelectorAll('#competencyIndicatorsContainer input[name="competencyIndicator"]:checked');
        const selectedGrade = document.getElementById('gradeSelect').value;
        
        if (selectedCheckboxes.length === 0) {
            rubricsContainer.innerHTML = '<p>Please select indicator</p>';
            return;
        }

        if (!selectedGrade) {
            rubricsContainer.innerHTML = '<p>Please select Grade level first</p>';
            return;
        }

        const ul = document.createElement('ul');
        selectedCheckboxes.forEach(checkbox => {
            const indicatorText = checkbox.value;
            if (rubricsData[indicatorText]) {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${indicatorText}</strong>`;
                
                // 根据选择的年级显示对应的评分标准
                const gradeKey = getGradeKey(selectedGrade);
                const rubricLevels = rubricsData[indicatorText][gradeKey];
                
                if (rubricLevels) {
                    const levelUl = document.createElement('ul');
                    // 遍历评分标准的每个级别
                    Object.entries(rubricLevels).forEach(([level, description]) => {
                        const levelLi = document.createElement('li');
                        levelLi.innerHTML = `<strong>${level}:</strong> ${description}`;
                        levelUl.appendChild(levelLi);
                    });
                    li.appendChild(levelUl);
                } else {
                    li.innerHTML += '<span style="color: #777;">(no rubric has been provided)</span>';
                }
                ul.appendChild(li);
            } else {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${indicatorText}</strong>: <span style="color: #777;">(no rubric has been provided)</span>`;
                ul.appendChild(li);
            }
        });
        rubricsContainer.appendChild(ul);
    }

    // 添加辅助函数来获取年级对应的评分标准键值
    function getGradeKey(grade) {
        const gradeNum = parseInt(grade);
        if (gradeNum <= 3) return "Grade 1-3";
        if (gradeNum <= 5) return "Grade 4-5";
        if (gradeNum <= 8) return "Grade 6-8";
        return "Grade 9-12";
    }

    // Update rubrics display when indicator selection changes
    if (competencyIndicatorsContainer) {
        competencyIndicatorsContainer.addEventListener('change', (event) => {
            if (event.target.type === 'checkbox') {
                displayRubricsForSelectedIndicators();
            }
        });
    }
    // Also update when competency changes (as indicators are re-rendered)
    if (competencySelect) {
        competencySelect.addEventListener('change', displayRubricsForSelectedIndicators);
    }

    // 添加年级选择的事件监听器
    const gradeSelect = document.getElementById('gradeSelect');
    if (gradeSelect) {
        gradeSelect.addEventListener('change', displayRubricsForSelectedIndicators);
    }

    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', () => {
            const doc = new jsPDF();
            let yPosition = 10;
            const lineSpacing = 7;
            const sectionSpacing = 10;
            const indent = 10;
            const maxWidth = 180;

            function addText(label, value, isTextArea = false) {
                if (value && value.trim() !== '') {
                    doc.setFontSize(14); // 增大标签字体
                    doc.setFont(undefined, 'bold');
                    doc.text(label, indent, yPosition);
                    yPosition += lineSpacing * 1.2; // 增加行间距
                    doc.setFont(undefined, 'normal');
                    doc.setFontSize(12); // 增大内容字体
                    if (isTextArea) {
                        const lines = doc.splitTextToSize(value, maxWidth - indent);
                        doc.text(lines, indent + 5, yPosition);
                        yPosition += lines.length * (lineSpacing * 0.7) + (lineSpacing * 0.3);
                    } else {
                        doc.text(value, indent + 5, yPosition);
                        yPosition += lineSpacing;
                    }
                    yPosition += (lineSpacing * 0.7); // 增加段落间距
                }
            }

            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text("Performance Assessment Plan", doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' });
            yPosition += sectionSpacing * 1.5;

            const formData = new FormData(paForm);

            const grade = formData.get('grade');
            if (grade) {
                const gradeText = document.querySelector(`#gradeSelect option[value="${grade}"]`).textContent;
                addText("Grade:", gradeText);
            }
            
            addText("Unit Name:", formData.get('unitName'));
            addText("Learning Objective/Standards:", formData.get('learningObjectives'), true);
            addText("Essential Questions:", formData.get('essentialQuestions'), true);
            addText("Backgrounds (Authentic Situation):", formData.get('backgrounds'), true);
            addText("PA Description:", formData.get('paDescription'), true);
            addText("Criteria for Success:", formData.get('criteriaForSuccess'), true);
            addText("Artifacts/Final Products/Evidence:", formData.get('artifactsEvidence'), true);

            const competency = formData.get('competency');
            if (competency) {
                const competencyText = document.querySelector(`#competencySelect option[value="${competency}"]`).textContent;
                addText("Competency:", competencyText);

                const selectedIndicators = [];
                document.querySelectorAll('#competencyIndicatorsContainer input[name="competencyIndicator"]:checked').forEach(checkbox => {
                    selectedIndicators.push(checkbox.value);
                });

                if (selectedIndicators.length > 0) {
                    doc.setFontSize(12);
                    doc.setFont(undefined, 'bold');
                    doc.text("Selected Competency Indicators:", indent, yPosition);
                    yPosition += lineSpacing;
                    doc.setFont(undefined, 'normal');
                    doc.setFontSize(10);

                    selectedIndicators.forEach(indicator => {
                        // 检查是否需要新页面
                        if (yPosition > doc.internal.pageSize.getHeight() - 20) {
                            doc.addPage();
                            yPosition = 10;
                        }

                        const indicatorLines = doc.splitTextToSize("- " + indicator, maxWidth - indent - 5);
                        doc.text(indicatorLines, indent + 5, yPosition);
                        yPosition += indicatorLines.length * (lineSpacing * 0.7) + (lineSpacing * 0.2);

                        // 添加评分标准
                        if (rubricsData[indicator]) {
                            const gradeKey = getGradeKey(grade);
                            const rubricLevels = rubricsData[indicator][gradeKey];
                            
                            if (rubricLevels) {
                                doc.setFontSize(9);
                                doc.setFont(undefined, 'italic');
                                
                                Object.entries(rubricLevels).forEach(([level, description]) => {
                                    // 检查是否需要新页面
                                    if (yPosition > doc.internal.pageSize.getHeight() - 20) {
                                        doc.addPage();
                                        yPosition = 10;
                                    }

                                    const rubricText = `${level}: ${description}`;
                                    const rubricLines = doc.splitTextToSize(rubricText, maxWidth - indent - 10);
                                    doc.text(rubricLines, indent + 10, yPosition);
                                    yPosition += rubricLines.length * (lineSpacing * 0.6) + (lineSpacing * 0.1);
                                });
                                
                                doc.setFont(undefined, 'normal');
                                yPosition += (lineSpacing * 0.3);
                            }
                        }
                    });
                }
            }

            // 检查是否有数据被添加
            if (yPosition <= sectionSpacing * 1.5 + 10) {
                alert("请填写一些信息以生成PDF。");
                return;
            }

            try {
                doc.save('performance_assessment.pdf');
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('生成PDF时发生错误。请重试。');
            }
        });
    } else {
        console.error('Download button not found');
    }
});

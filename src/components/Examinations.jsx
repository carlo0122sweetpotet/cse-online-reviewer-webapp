import { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, Award, ChevronRight, Brain, MessageSquare, Calculator, Globe, Play } from 'lucide-react';
import { examQuestions } from './examQuestions';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

const Examinations = ({ user, userData, onExamCompleted }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [examinations, setExaminations] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [randomizedQuestions, setRandomizedQuestions] = useState([]);

    const categories = [
        {
            id: 'analytical',
            title: 'Analytical Ability',
            description: 'Test your logical reasoning and problem-solving skills',
            icon: Brain,
            color: 'from-purple-500 to-blue-600',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-100',
            hoverColor: 'hover:bg-purple-50'
        },
        {
            id: 'verbal',
            title: 'Verbal Ability',
            description: 'Assess your language comprehension and communication skills',
            icon: MessageSquare,
            color: 'from-green-500 to-teal-600',
            textColor: 'text-green-600',
            bgColor: 'bg-green-100',
            hoverColor: 'hover:bg-green-50'
        },
        {
            id: 'numerical',
            title: 'Numerical Ability',
            description: 'Evaluate your mathematical and quantitative reasoning',
            icon: Calculator,
            color: 'from-orange-500 to-red-600',
            textColor: 'text-orange-600',
            bgColor: 'bg-orange-100',
            hoverColor: 'hover:bg-orange-50'
        },
        {
            id: 'general',
            title: 'General Information',
            description: 'Test your knowledge of current affairs and general topics',
            icon: Globe,
            color: 'from-indigo-500 to-purple-600',
            textColor: 'text-indigo-600',
            bgColor: 'bg-indigo-100',
            hoverColor: 'hover:bg-indigo-50'
        }
    ];

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        // Simulate loading examinations data
        const fetchExaminations = async () => {
            setLoading(true);
            // Mock data organized by categories
            setTimeout(() => {
                setExaminations({
                    analytical: [
                        {
                            id: 1,
                            title: 'Logical Reasoning Test',
                            description: 'Pattern recognition and logical sequences',
                            duration: 'unlimited',
                            questions: 30,
                            difficulty: 'Professional Level'
                        },
                        {
                            id: 2,
                            title: 'Problem Solving Assessment',
                            description: 'Critical thinking and analytical skills',
                            duration: 'unlimited',
                            questions: 40,
                            difficulty: 'Professional Level'
                        }
                    ],
                    verbal: [
                        {
                            id: 3,
                            title: 'Reading Comprehension',
                            description: 'Text analysis and understanding',
                            duration: 'unlimited',
                            questions: 35,
                            difficulty: 'Professional Level'
                        },
                        {
                            id: 4,
                            title: 'Vocabulary and Grammar',
                            description: 'Language proficiency assessment',
                            duration: 'unlimited',
                            questions: 50,
                            difficulty: 'Professional Level'
                        },
                        {
                            id: 5,
                            title: 'Idiomatic Expression and Correct Spelling',
                            description: 'This section focuses on developing language proficiency through the proper use of idiomatic expressions and accurate spelling',
                            duration: 'unlimited',
                            questions: 50,
                            difficulty: 'Professional Level'
                        }
                    ],
                    numerical: [
                        {
                            id: 6,
                            title: 'Basic Mathematics',
                            description: 'Arithmetic and basic mathematical operations',
                            duration: 'unlimited',
                            questions: 35,
                            difficulty: 'Professional Level'
                        },
                        {
                            id: 7,
                            title: 'Data Interpretation',
                            description: 'Charts, graphs, and statistical analysis',
                            duration: 'unlimited',
                            questions: 25,
                            difficulty: 'Professional Level'
                        }
                    ],
                    general: [
                        {
                            id: 8,
                            title: 'Philippine History and Culture',
                            description: 'National heritage and cultural knowledge',
                            duration: 'unlimited',
                            questions: 30,
                            difficulty: 'Professional Level'
                        },
                        {
                            id: 9,
                            title: 'Current Affairs',
                            description: 'Recent events and contemporary issues',
                            duration: 'unlimited',
                            questions: 25,
                            difficulty: 'Professional Level'
                        }
                    ]
                });
                setLoading(false);
            }, 1000);
        };

        fetchExaminations();
    }, [user]);

    useEffect(() => {
        if (selectedExam && selectedCategory) {
            const originalQuestions = examQuestions[selectedCategory]?.[selectedExam]?.questions || [];
            if (originalQuestions.length > 0) {
                setRandomizedQuestions(shuffleArray(originalQuestions));
            }
        }
    }, [selectedExam, selectedCategory]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'hard':
                return 'bg-red-100 text-red-800';
            case 'professional level':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAnswerSelect = (questionId, answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    const handleSubmitExam = async () => {
        if (isSubmitting) return; // Prevent multiple submissions

        setIsSubmitting(true);

        try {
            const questions = examQuestions[selectedCategory]?.[selectedExam]?.questions || [];
            const examData = examinations[selectedCategory]?.find(e => e.id === selectedExam);

            const score = calculateScore(questions);
            const correctAnswers = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

            // Create unique ID using timestamp and exam ID
            const uniqueId = `${selectedExam}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const examResult = {
                examId: selectedExam,
                examTitle: examData?.title,
                category: selectedCategory,
                score: score,
                correctAnswers: correctAnswers,
                totalQuestions: questions.length,
                completedAt: new Date(),
                timeSpent: null,
                id: uniqueId // Use unique ID
            };

            await updateDoc(doc(db, 'users', user.uid), {
                examResults: arrayUnion(examResult)
            });

            await updateDoc(doc(db, 'users', user.uid), {
                recentActivity: arrayUnion({
                    action: 'exam_completed',
                    description: `Completed ${examData?.title} with ${score}% score`,
                    timestamp: new Date(),
                    id: `activity-${uniqueId}` // Use related unique ID
                })
            });

            if (onExamCompleted) {
                onExamCompleted();
            }

            setShowResults(true);
        } catch (error) {
            console.error('Error saving exam result:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateScore = (questions) => {
        let correct = 0;
        questions.forEach(q => {
            if (selectedAnswers[q.id] === q.correctAnswer) {
                correct++;
            }
        });
        return Math.round((correct / questions.length) * 100);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white">
                    <h2 className="text-xl font-semibold mb-2">Philippine Civil Service Exam</h2>
                    <p className="opacity-90">Loading examination categories...</p>
                </div>
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    // Exam Taking Interface
    if (selectedExam) {
        const category = categories.find(c => c.id === selectedCategory);
        const examData = examinations[selectedCategory]?.find(e => e.id === selectedExam);
        const questions = randomizedQuestions.length > 0 ? randomizedQuestions : [];

        if (showResults) {
            const score = calculateScore(questions);
            return (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
                        <h2 className="text-xl font-semibold mb-2">Exam Completed!</h2>
                        <p className="opacity-90">{examData?.title}</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Score</h3>
                        <div className="text-4xl font-bold text-blue-600 mb-4">{score}%</div>
                        <p className="text-gray-600 mb-6">
                            You answered {questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} out of {questions.length} questions correctly.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setSelectedExam(null);
                                    setShowResults(false);
                                    setCurrentQuestion(0);
                                    setSelectedAnswers({});
                                    setRandomizedQuestions([]);
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
                            >
                                Back to Exams
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedExam(null);
                                    setShowResults(false);
                                    setCurrentQuestion(0);
                                    setSelectedAnswers({});
                                    setRandomizedQuestions([]);
                                }}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Back to Categories
                            </button>
                        </div>
                    </div>

                    {/* Review Answers */}
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Review Your Answers</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {questions.map((question, index) => (
                                <div key={question.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                                    <h4 className="font-medium text-gray-900 mb-3">
                                        {index + 1}. {question.question}
                                    </h4>
                                    <div className="space-y-2 mb-3">
                                        {question.options.map((option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className={`p-2 rounded ${optionIndex === question.correctAnswer
                                                    ? 'bg-green-100 text-green-800'
                                                    : selectedAnswers[question.id] === optionIndex
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-50'
                                                    }`}
                                            >
                                                {option} {optionIndex === question.correctAnswer && '✓'}
                                                {selectedAnswers[question.id] === optionIndex && optionIndex !== question.correctAnswer && '✗'}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 italic">{question.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (questions.length === 0) {
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Available</h3>
                        <p className="text-gray-600 mb-4">This exam doesn't have questions yet.</p>
                        <button
                            onClick={() => {
                                setSelectedExam(null);
                                setRandomizedQuestions([]);
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Exams
                        </button>
                    </div>
                </div>
            );
        }

        const currentQ = questions[currentQuestion];

        return (
            <div className="space-y-6">
                {/* Exam Header */}
                <div className={`sticky top-0 z-10 bg-gradient-to-r ${category.color} rounded-xl p-4 md:p-6 text-white shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg md:text-xl font-semibold mb-1">{examData?.title}</h2>
                            <p className="opacity-90 text-sm md:text-base">Question {currentQuestion + 1} of {questions.length}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs md:text-sm opacity-90">Progress</div>
                            <div className="text-base md:text-lg font-semibold">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</div>
                        </div>
                    </div>
                    <div className="mt-3 md:mt-4 w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        {currentQ.question}
                    </h3>

                    <div className="space-y-3">
                        {currentQ.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(currentQ.id, index)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${selectedAnswers[currentQ.id] === index
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {currentQuestion === questions.length - 1 ? (
                        <button
                            onClick={handleSubmitExam}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (selectedCategory) {
        const category = categories.find(c => c.id === selectedCategory);
        const categoryExams = examinations[selectedCategory] || [];
        const IconComponent = category.icon;

        return (
            <div className="space-y-6">
                {/* Category Header */}
                <div className={`bg-gradient-to-r ${category.color} rounded-xl p-6 text-white`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <IconComponent className="w-8 h-8" />
                            <div>
                                <h2 className="text-xl font-semibold mb-1">{category.title}</h2>
                                <p className="opacity-90">{category.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                        >
                            Back to Categories
                        </button>
                    </div>
                </div>

                {/* Exams List */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Available Examinations</h3>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {categoryExams.map((exam) => (
                            <div key={exam.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                                    <div className="flex-1">
                                        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-3 md:space-y-0 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-900">{exam.title}</h4>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-start ${getDifficultyColor(exam.difficulty)}`}>
                                                {exam.difficulty}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-3">{exam.description}</p>

                                        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-6 md:space-y-0 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{exam.duration} minutes</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{exam.questions} questions</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:ml-6">
                                        <button
                                            onClick={() => setSelectedExam(exam.id)}
                                            className={`w-full md:w-auto inline-flex items-center justify-center px-6 py-3 ${category.textColor} border-2 border-current rounded-lg hover:bg-current hover:text-white transition-colors font-medium`}
                                        >
                                            Start Exam
                                            <Play className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white">
                <div className="flex items-center space-x-3">
                    <BookOpen className="w-8 h-8" />
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Philippine Civil Service Exam</h2>
                        <p className="opacity-90">Choose your examination category to begin</p>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => {
                    const IconComponent = category.icon;
                    const categoryExams = examinations[category.id] || [];

                    return (
                        <div
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`bg-white rounded-xl border border-gray-200 p-6 cursor-pointer transition-all duration-200 ${category.hoverColor} hover:shadow-lg hover:border-gray-300`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`p-3 rounded-lg ${category.bgColor}`}>
                                    <IconComponent className={`w-8 h-8 ${category.textColor}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                                    <p className="text-gray-600 mb-4">{category.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>{categoryExams.length} exam{categoryExams.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 ${category.textColor}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Civil Service Exam</h3>
                        <p className="text-gray-600 leading-relaxed">
                            The Philippine Civil Service Examination is designed to test your aptitude and knowledge
                            across four key areas. Each category contains multiple examinations that will assess
                            your readiness for government service. Take your time and choose the category you'd
                            like to focus on first.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Examinations;
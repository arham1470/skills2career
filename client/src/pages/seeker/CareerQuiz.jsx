import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, ChevronLeft, CheckCircle, Brain, Heart, Wrench,
  Trophy, RotateCcw, ArrowRight, Sparkles, Briefcase, Loader2,
  Zap, Target, Clock
} from "lucide-react";
import { QUIZ_SECTIONS, calculateResults } from "../../data/quizData";
import api from "../../utils/api";
import Button from "../../components/ui/Button";

const sectionIcons = {
  interests: Heart,
  personality: Brain,
  skills: Wrench,
};

const sectionColors = {
  interests: "text-rose-500 bg-rose-50 border-rose-100",
  personality: "text-violet-500 bg-violet-50 border-violet-100",
  skills: "text-amber-500 bg-amber-50 border-amber-100",
};

const StepPath = ({ sections, currentIdx, started }) => {
  if (!started) return null;
  return (
    <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1">
      {sections.map((s, i) => {
        const Icon = sectionIcons[s.id];
        const isActive = i === currentIdx;
        const isPast = i < currentIdx;
        return (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap shrink-0 ${
              isActive
                ? "bg-primary-50 border-primary-200 text-primary-700"
                : isPast
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-gray-50 border-gray-200 text-gray-500"
            }`}>
              <Icon className="w-3.5 h-3.5" />
              {s.title}
              {isPast && <CheckCircle className="w-3 h-3" />}
            </div>
            {i < sections.length - 1 && (
              <div className={`w-6 h-0.5 rounded-full shrink-0 ${isPast ? "bg-emerald-200" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MatchRing = ({ percentage, size = 72, stroke = 6 }) => {
  const radius = (size - stroke) / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 75 ? "text-emerald-500" : percentage >= 50 ? "text-amber-500" : "text-primary-500";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={radius}
          stroke="currentColor" strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${color} transition-all duration-1000`}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${color}`}>{percentage}%</span>
    </div>
  );
};

const CareerQuiz = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previousResult, setPreviousResult] = useState(null);
  const [loadingPrevious, setLoadingPrevious] = useState(true);
  const [viewError, setViewError] = useState("");

  useEffect(() => {
    api.get("/seeker/career-quiz")
      .then((res) => {
        if (res.data?.careerAssessment) setPreviousResult(res.data.careerAssessment);
      })
      .catch(() => {})
      .finally(() => setLoadingPrevious(false));
  }, []);

  const sections = QUIZ_SECTIONS;
  const currentSection = sections[currentSectionIdx];
  const currentQuestion = currentSection?.questions[currentQuestionIdx];

  const totalQuestions = useMemo(
    () => sections.reduce((sum, s) => sum + s.questions.length, 0),
    [sections]
  );
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const globalQuestionIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < currentSectionIdx; i++) idx += sections[i].questions.length;
    idx += currentQuestionIdx;
    return idx;
  }, [currentSectionIdx, currentQuestionIdx, sections]);

  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < currentSection.questions.length - 1) {
      setCurrentQuestionIdx((p) => p + 1);
    } else if (currentSectionIdx < sections.length - 1) {
      setCurrentSectionIdx((p) => p + 1);
      setCurrentQuestionIdx(0);
    } else {
      finishQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((p) => p - 1);
    } else if (currentSectionIdx > 0) {
      setCurrentSectionIdx((p) => p - 1);
      setCurrentQuestionIdx(sections[currentSectionIdx - 1].questions.length - 1);
    }
  };

  const finishQuiz = () => {
    const res = calculateResults(answers);
    setResults(res);
  };

  const handleSave = async () => {
    if (!results) return;
    setSaving(true);
    try {
      await api.post("/seeker/career-quiz", {
        topCareer: results[0].career,
        topPercentage: results[0].percentage,
        allResults: results.map((r) => ({
          career: r.career, percentage: r.percentage,
          skills: r.skills, internships: r.internships,
        })),
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save quiz results", err);
    } finally {
      setSaving(false);
    }
  };

  const restartQuiz = () => {
    setStarted(false);
    setCurrentSectionIdx(0);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setResults(null);
    setSaved(false);
    setViewError("");
  };

  const isAnswered = currentQuestion && answers[currentQuestion.id] != null;

  // ---------- Intro Screen ----------
  if (!started && !results) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Career Assessment Quiz</h1>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Discover your ideal path</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base">
                Discover your ideal career path with our comprehensive assessment. We will analyze
                your <strong>interests</strong>, <strong>personality</strong>, and <strong>skills</strong> to
                recommend the best career matches, essential skills to learn, and relevant internships
                to apply for.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> {totalQuestions} questions
                </span>
                <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Briefcase className="w-4 h-4 text-primary-500" /> Personalized matches
                </span>
                <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Clock className="w-4 h-4 text-amber-500" /> ~5 mins
                </span>
              </div>

              {viewError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                  {viewError}
                </div>
              )}

              {loadingPrevious ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Loader2 className="w-4 h-4 animate-spin" /> Checking previous result...
                </div>
              ) : previousResult ? (
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 mb-6">
                  <p className="text-sm text-primary-700 font-medium mb-3">
                    Your last assessment was on{" "}
                    {previousResult.takenAt
                      ? new Date(previousResult.takenAt).toLocaleDateString()
                      : "a previous session"}
                    . Top match: <strong>{previousResult.topCareer}</strong> ({previousResult.topPercentage}%)
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" onClick={() => setStarted(true)}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (Array.isArray(previousResult.allResults) && previousResult.allResults.length > 0) {
                          setResults(previousResult.allResults);
                          setSaved(true);
                          setViewError("");
                        } else {
                          setViewError("No valid result found. Please take the quiz first.");
                        }
                      }}
                    >
                      View Last Result <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="mt-auto">
                <Button variant="primary" size="lg" onClick={() => setStarted(true)}>
                  Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Section Cards */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm flex flex-col">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quiz Sections</h3>
            <div className="space-y-3 flex-1">
              {sections.map((s, i) => {
                const Icon = sectionIcons[s.id];
                const colors = sectionColors[s.id];
                return (
                  <div
                    key={s.id}
                    className="group flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                  >
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${colors}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm">{s.title}</h3>
                        <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{s.questions.length} questions &middot; {s.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Results Screen ----------
  if (results) {
    if (!Array.isArray(results) || results.length === 0) {
      return (
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Result Available</h2>
            <p className="text-gray-500 mb-6">Your previous assessment data is missing or incomplete.</p>
            <Button variant="primary" size="lg" onClick={restartQuiz}>
              Take the Quiz <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    const topMatch = results[0];
    const topThree = results.slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-50 rounded-full -translate-y-1/2 opacity-40 pointer-events-none" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Your Career Assessment Results</h2>
            <p className="text-gray-500 text-sm">Based on your interests, personality, and skills</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Top Match Card */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-5 lg:p-6 text-white shadow-lg flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative">
              <p className="text-primary-100 text-sm font-medium mb-1">Recommended Career</p>
              <h3 className="text-xl lg:text-2xl font-bold mb-4">{topMatch.career}</h3>

              <div className="flex items-center gap-4 mb-5">
                <MatchRing percentage={topMatch.percentage} size={80} stroke={7} />
                <div>
                  <p className="text-xs text-primary-100 font-medium">Match Score</p>
                  <p className="text-2xl font-bold">{topMatch.percentage}%</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-xs text-primary-100 font-medium mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Recommended Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topMatch.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 bg-white/15 rounded-lg text-xs font-medium backdrop-blur-sm border border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-primary-100 font-medium mb-2 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Recommended Internships
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topMatch.internships.slice(0, 5).map((intern) => (
                      <span key={intern} className="px-2.5 py-1 bg-white/15 rounded-lg text-xs font-medium backdrop-blur-sm border border-white/10">
                        {intern}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Top 3 + All Matches */}
          <div className="space-y-6">
            {/* Top 3 Matches */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 lg:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-500" /> Top Career Matches
              </h3>
              <div className="space-y-4">
                {topThree.map((match, idx) => (
                  <div key={match.career}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${
                          idx === 0
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : idx === 1
                            ? "bg-gray-50 text-gray-600 border-gray-200"
                            : "bg-orange-50 text-orange-600 border-orange-200"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-medium text-gray-900 text-sm">{match.career}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{match.percentage}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-gray-400" : "bg-orange-300"
                        }`}
                        style={{ width: `${match.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Career Matches */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 lg:p-6 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">All Career Matches</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((r) => (
                  <div
                    key={r.career}
                    className="group flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate("/seeker/recommended")}
                  >
                    <span className="text-sm text-gray-700 font-medium">{r.career}</span>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                      {r.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {!saved && (
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
              ) : (
                <><CheckCircle className="w-4 h-4 mr-2" /> Save Result</>
              )}
            </Button>
          )}
          {saved && (
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-100">
              <CheckCircle className="w-4 h-4" /> Saved Successfully
            </span>
          )}
          <Button variant="outline" onClick={restartQuiz}>
            <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
          </Button>
          <Button variant="outline" onClick={() => navigate("/seeker/recommended")}>
            Browse Internships <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ---------- Quiz Screen ----------
  const progressPercent = ((answeredCount / totalQuestions) * 100).toFixed(0);
  const SectionIcon = sectionIcons[currentSection.id];

  return (
    <div>
      {/* Progress Header */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <StepPath sections={sections} currentIdx={currentSectionIdx} started={started} />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sectionColors[currentSection.id]}`}>
              <SectionIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{currentSection.title}</span>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              {currentQuestionIdx + 1} / {currentSection.questions.length}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            {progressPercent}% completed
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(globalQuestionIndex / totalQuestions) * 100}%`,
              background: "linear-gradient(90deg, #3b82f6 25%, #60a5fa 50%, #3b82f6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-40 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
              Q{globalQuestionIndex + 1}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, idx) => {
              const selected = answers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`group w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    selected
                      ? "border-primary-500 bg-primary-50 text-primary-900 shadow-sm"
                      : "border-gray-100 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      selected
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-300 text-gray-400 group-hover:border-gray-400"
                    }`}
                  >
                    {selected ? <CheckCircle className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-medium">{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentSectionIdx === 0 && currentQuestionIdx === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!isAnswered}
        >
          {currentSectionIdx === sections.length - 1 &&
          currentQuestionIdx === currentSection.questions.length - 1
            ? "See Results"
            : "Next"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CareerQuiz;

import React, { useState } from 'react';
import { progressService } from '../services/api';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  Send
} from 'lucide-react';

const LessonQuiz = ({ courseId, lesson, onQuizCompleted }) => {
  const questions = lesson.quiz || [];
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!questions || questions.length === 0) {
    return (
      <div className="empty-quiz-state">
        <HelpCircle size={40} color="#94a3b8" />
        <h4>No Quiz for This Lesson</h4>
        <p>This module focuses on practical demonstrations. Move to the next lesson or review notes.</p>
      </div>
    );
  }

  const handleSelectOption = (questionIdx, optionIdx) => {
    if (quizResult) return; // Prevent change after submit until retake
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIdx]: optionIdx
    }));
    setErrorMsg('');
  };

  const handleSubmitQuiz = async () => {
    // Check if all answered
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      setErrorMsg(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const answersArray = questions.map((_, idx) => selectedAnswers[idx]);
      const res = await progressService.submitQuiz(courseId, {
        lessonId: lesson._id,
        userAnswers: answersArray
      });

      if (res.data.success) {
        setQuizResult(res.data.result);
        if (onQuizCompleted) {
          onQuizCompleted(res.data);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setQuizResult(null);
    setErrorMsg('');
  };

  return (
    <div className="interactive-quiz-card">
      <div className="quiz-header">
        <div className="quiz-title-group">
          <div className="quiz-icon-pill">
            <HelpCircle size={20} color="#4f46e5" />
          </div>
          <div>
            <h3>Knowledge Check Quiz</h3>
            <p className="quiz-subtitle">Answer {questions.length} questions to test your comprehension & earn credit.</p>
          </div>
        </div>

        {quizResult && (
          <div className={`quiz-score-badge ${quizResult.passed ? 'badge-passed' : 'badge-failed'}`}>
            <Award size={18} />
            <span>{quizResult.score} / {quizResult.totalQuestions} ({quizResult.percentage}%)</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="quiz-alert-error">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quiz Questions List */}
      <div className="quiz-questions-list">
        {questions.map((q, qIdx) => {
          const selectedOption = selectedAnswers[qIdx];
          const reviewInfo = quizResult ? quizResult.review[qIdx] : null;

          return (
            <div key={qIdx} className={`question-item ${reviewInfo ? (reviewInfo.isCorrect ? 'item-correct' : 'item-incorrect') : ''}`}>
              <div className="question-text-row">
                <span className="question-number">Q{qIdx + 1}</span>
                <p className="question-prompt">{q.question}</p>
              </div>

              <div className="options-grid">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let optionClass = 'quiz-option-button';

                  if (quizResult) {
                    if (optIdx === q.correctAnswer) {
                      optionClass += ' option-correct';
                    } else if (isSelected && optIdx !== q.correctAnswer) {
                      optionClass += ' option-wrong';
                    }
                  } else if (isSelected) {
                    optionClass += ' option-selected';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={optionClass}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      disabled={!!quizResult}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + optIdx)}</span>
                      <span className="option-label">{opt}</span>
                      {quizResult && optIdx === q.correctAnswer && (
                        <CheckCircle2 size={18} className="option-state-icon text-success" />
                      )}
                      {quizResult && isSelected && optIdx !== q.correctAnswer && (
                        <XCircle size={18} className="option-state-icon text-danger" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Show explanation after submission */}
              {quizResult && reviewInfo && reviewInfo.explanation && (
                <div className="question-explanation-box">
                  <strong>Explanation:</strong> {reviewInfo.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="quiz-footer-actions">
        {quizResult ? (
          <div className="quiz-result-summary">
            {quizResult.passed ? (
              <div className="result-banner pass-banner">
                <Sparkles size={20} color="#10b981" />
                <span>Great job! You passed the quiz. Progress has been saved to MongoDB Atlas!</span>
              </div>
            ) : (
              <div className="result-banner retry-banner">
                <span>Score below 60%. Review the module notes and try again to pass.</span>
              </div>
            )}
            <button onClick={handleRetake} className="btn btn-secondary btn-sm">
              <RotateCcw size={15} />
              <span>Retake Quiz</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="btn btn-primary"
          >
            <Send size={16} />
            <span>{submitting ? 'Grading Answers...' : 'Submit Answers & Verify'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonQuiz;


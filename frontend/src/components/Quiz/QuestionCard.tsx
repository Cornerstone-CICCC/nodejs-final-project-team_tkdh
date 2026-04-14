import type { Quiz } from "../../types";

type QuestionCardProps = {
  quiz: Quiz;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelect: (index: number) => void;
};

export function QuestionCard({
  quiz,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="question-card">
      <p className="question-card__progress">
        Question {questionIndex + 1} / {totalQuestions}
      </p>
      <h2 className="question-card__question">{quiz.question}</h2>
      <div className="question-card__options">
        {quiz.options.map((option, i) => (
          <button
            key={i}
            className={`question-card__option ${selectedOption === i ? "question-card__option--selected" : ""}`}
            onClick={() => onSelect(i)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

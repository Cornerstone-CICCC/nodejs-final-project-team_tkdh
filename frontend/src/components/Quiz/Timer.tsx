type TimerProps = {
  timeLeft: number;
};

export function Timer({ timeLeft }: TimerProps) {
  const isUrgent = timeLeft <= 10;

  return (
    <div className={`timer ${isUrgent ? "timer--urgent" : ""}`}>
      <span className="timer__value">{timeLeft}</span>
      <span className="timer__label">seconds</span>
    </div>
  );
}

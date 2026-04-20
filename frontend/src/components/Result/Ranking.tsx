import type { Scores, TeamId } from "../../types";

type RankingProps = {
  scores: Scores;
  myTeam: TeamId | null;
};

const TEAM_LABELS: Record<TeamId, string> = {
  team1: "Team 1",
  team2: "Team 2",
};

export function Ranking({ scores, myTeam }: RankingProps) {
  const sorted = (["team1", "team2"] as TeamId[]).sort(
    (a, b) => scores[b] - scores[a],
  );
  const isDraw = scores.team1 === scores.team2;
  const topScore = sorted[0] ? scores[sorted[0]] : 0;

  return (
    <div className="ranking">
      <h2 className="ranking__title">Final Ranking</h2>

      <ol className="ranking__list">
        {sorted.map((team, i) => {
          const isWinner = !isDraw && scores[team] === topScore;
          const isMine = team === myTeam;
          return (
            <li
              key={team}
              className={`ranking__item ${isWinner ? "ranking__item--winner" : ""}`}
            >
              <span className="ranking__rank">#{i + 1}</span>
              <span className="ranking__name">
                {TEAM_LABELS[team]}
                {isMine && <span className="ranking__you"> (You)</span>}
              </span>
              <span className="ranking__score">{scores[team]} pts</span>
              {isWinner && <span className="ranking__badge">Winner</span>}
            </li>
          );
        })}
      </ol>

      {isDraw && <p className="ranking__draw">It's a draw!</p>}
    </div>
  );
}

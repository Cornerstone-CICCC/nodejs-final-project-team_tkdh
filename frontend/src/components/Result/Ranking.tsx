import type { Team } from "../../types";

type RankingProps = {
  teams: Team[];
};

export function Ranking({ teams }: RankingProps) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="ranking">
      <h2 className="ranking__title">Final Ranking</h2>

      <ol className="ranking__list">
        {sorted.map((team, i) => (
          <li key={team.id} className="ranking__item">
            <span className="ranking__rank">#{i + 1}</span>
            <span className="ranking__name">{team.name}</span>
            <span className="ranking__score">{team.score} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
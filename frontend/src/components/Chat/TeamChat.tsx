import { useState } from "react";
import type { Message } from "../../types";


type TeamChatProps = {
  messages: Message[];
  onSend: (text: string) => void;
};

function DiceBearAvatar({ seed }: { seed: string }) {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

  return (
    <img
      src={avatarUrl}
      alt="avatar"
      className="team-chat__avatar"
    />
  );
}

export function TeamChat({ messages, onSend }: TeamChatProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  };

  return (
    <div className="team-chat">
      <h3 className="team-chat__title">
  Team Chat

  <div className="team-chat__avatars">
    <DiceBearAvatar seed="player1" />
    <DiceBearAvatar seed="player2" />
    <DiceBearAvatar seed="player3" />
    <DiceBearAvatar seed="player4" />
  </div>
</h3>

      <div className="team-chat__messages">
        {messages.map((msg) => (
          <div key={msg.id} className="team-chat__message">
            <DiceBearAvatar seed={msg.userId || msg.userName} />

            <div className="team-chat__content">
              <span className="team-chat__author">{msg.userName}</span>
              <span className="team-chat__text">{msg.text}</span>
            </div>
          </div>
        ))}
      </div>

      <form className="team-chat__form" onSubmit={handleSubmit}>
        <input
          className="team-chat__input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="team-chat__send" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
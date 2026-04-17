# WebSocket / Socket.io 学習メモ

## 1. WebSocket とは

WebSocket は、**サーバーとクライアント間で双方向のリアルタイム通信を行うためのプロトコル**です。
1つのTCP接続の上で、HTTPとは別のルールで通信します。

### HTTP との違い

| 項目 | HTTP | WebSocket |
|---|---|---|
| 通信方向 | クライアント → サーバー（リクエスト起点） | 双方向 |
| 接続 | リクエストごとに接続・切断 | 一度繋いだら維持 |
| サーバーから能動的に送信 | できない（ポーリングが必要） | できる |
| プロトコル | `http://` / `https://` | `ws://` / `wss://` |
| 用途 | ページ取得、API呼び出し | チャット、通知、ゲーム、株価更新 |

### なぜ必要か

HTTPだけでチャットを作ろうとすると、クライアントが定期的にサーバーに「新しいメッセージある？」と聞き続ける必要があります（ポーリング）。これは無駄な通信が多く、リアルタイム性も低いです。

WebSocket なら接続を保ったまま、サーバーが新しいメッセージを**プッシュで送れる**ので効率的です。

### 接続の流れ

```
1. クライアント → サーバー: HTTPリクエスト "Upgrade: websocket"
2. サーバー → クライアント: HTTP 101 Switching Protocols
3. 以降、TCP接続上でWebSocket通信（双方向）
```

最初の「ハンドシェイク」だけHTTPを使い、その後プロトコルを切り替える仕組みです。

---

## 2. Socket.io とは

Socket.io は、**WebSocket をより使いやすくしたライブラリ**です。Node.js サーバー側 (`socket.io`) とクライアント側 (`socket.io-client`) のペアで使います。

### WebSocket との関係

Socket.io は内部で WebSocket を使いますが、**WebSocketそのものではありません**。
以下のような機能を追加しています:

- **自動フォールバック**: WebSocketが使えない環境では自動でHTTP long-pollingに切り替え
- **自動再接続**: ネットワーク切断時に自動で繋ぎ直す
- **ルーム / Namespace**: 特定のグループだけに送信できる
- **イベントベースAPI**: `emit()` / `on()` で直感的に書ける
- **JSONの自動シリアライズ**: オブジェクトをそのまま送れる

### なぜ Socket.io を使うのか

生のWebSocketは強力ですが、以下の処理を自前で書く必要があります:
- 切断検知と再接続
- メッセージ形式の定義（JSONのパース等）
- ルーム機能（特定のクライアントグループへの配信）

Socket.io はこれらを全て面倒見てくれるので、実装が楽になります。

---

## 3. Socket.io の基本概念

### Server と Client

```
サーバー側 (Node.js)              クライアント側 (ブラウザ)
┌──────────────────┐             ┌──────────────────┐
│ import { Server }│             │ import { io }    │
│   from "socket.io"│ ←── ws ──→ │ from "socket.io-│
│                  │             │   client"        │
│ const io = new   │             │                  │
│   Server(server) │             │ const socket =   │
│                  │             │   io("http://... │
└──────────────────┘             └──────────────────┘
```

### Event — `emit` と `on`

通信は全て「イベント」という形で行います。
- `emit("イベント名", データ)` — 送信
- `on("イベント名", callback)` — 受信

#### 例：チャットメッセージ

**クライアント側**:
```ts
// 送信
socket.emit("chat:send", { text: "Hello!" });

// 受信
socket.on("chat:message", (message) => {
  console.log(message);
});
```

**サーバー側**:
```ts
io.on("connection", (socket) => {
  // クライアントから受信
  socket.on("chat:send", (data) => {
    // 全員に配信
    io.emit("chat:message", {
      userId: socket.id,
      text: data.text,
    });
  });
});
```

### Room（ルーム）

**特定のクライアントグループだけに送信したい時**に使います。
Quiz App ではチームごとにRoomを作れば、チーム内だけでチャットを共有できます。

```ts
// サーバー側: クライアントをRoomに入れる
socket.join("team-1");

// そのRoomにだけ送信
io.to("team-1").emit("chat:message", message);
```

### Namespace

大きめの機能分割に使います（例: `/chat`, `/game`）。
小規模アプリではRoomだけで十分なことが多いです。

### 送信方法の種類

| 書き方 | 送信先 |
|---|---|
| `socket.emit(...)` | その接続1人だけに返す |
| `io.emit(...)` | 接続している全員 |
| `io.to("room").emit(...)` | 指定Roomの全員 |
| `socket.to("room").emit(...)` | 指定Roomの全員（自分以外） |
| `socket.broadcast.emit(...)` | 自分以外の全員 |

---

## 4. 本プロジェクト (Quiz App) での使い方

### 全体像

```
┌─────────────────────┐           ┌──────────────────────────┐
│  React (Frontend)   │           │  Express + Socket.io      │
│                     │           │                           │
│  useSocket フック    │ ←── ws ──→│  メモリ上で管理:           │
│   - socket.on(...)  │           │   - Game session          │
│   - socket.emit(...) │          │   - Teams (Room)          │
│                     │           │   - Scores                │
└─────────────────────┘           │   - Current question      │
                                  │   - Timer                 │
                                  └──────────────────────────┘
```

### Room の使い方

ゲーム開始時に各ユーザーを**チームごとのRoom**に入れます。

```
Room "team-1": Alice, Bob, Charlie
Room "team-2": Dave, Eve, Frank
```

これで:
- チームチャットは `io.to("team-1").emit(...)` で他チームに漏れない
- クイズの出題は `io.emit(...)` で全員に同時に配信

### イベント一覧（想定）

#### クライアント → サーバー

| イベント名 | ペイロード | 意味 |
|---|---|---|
| `game:join` | `{ userId }` | ゲームに参加する |
| `chat:send` | `{ text }` | チーム内にメッセージ送信 |
| `team:answer` | `{ optionIndex }` | チームとして回答を提出 |

#### サーバー → クライアント

| イベント名 | ペイロード | 意味 |
|---|---|---|
| `game:start` | `{ teamId, teams }` | ゲーム開始、チーム割り当て通知 |
| `game:question` | `{ question, options, index }` | 次の問題（`correctIndex`は含まない） |
| `game:timer` | `timeLeft: number` | 残り秒数（毎秒更新） |
| `game:result` | `{ correctIndex, teams }` | 各問題の結果、スコア更新 |
| `game:end` | `{ teams }` | 最終ランキング |
| `chat:message` | `{ userId, userName, text, timestamp }` | チームチャットの受信 |

### ゲーム進行フロー

```
[ゲーム開始]
 └─ サーバー: 参加ユーザーをチームにランダム割り当て
 └─ サーバー: 各ユーザーを team Room に入れる
 └─ サーバー: DBから10問取得 → ランダムに5問選ぶ → メモリに保存
 └─ io.emit("game:start", { teams })

[各問題 (5問ループ)]
 └─ io.emit("game:question", { question, options, index })  ← correctIndex抜き
 └─ 30秒タイマー: 毎秒 io.emit("game:timer", timeLeft)
 └─ クライアントが "team:answer" を送信 → サーバーでチーム代表の回答として受け付け
 └─ 30秒経過 → スコア計算 → io.emit("game:result", { correctIndex, teams })

[5問終了]
 └─ io.emit("game:end", { teams })
```

### セキュリティのポイント

- **`correctIndex` は問題配信時に送らない** — クライアント側でDevToolsを開けば見えてしまう。結果発表時にのみ送信する
- **チームの回答は1つだけ** — チーム内の誰かが答えたら、それをチームの回答として記録（または多数決）
- **他チームのRoomにjoinできないように** — Room名をユーザー入力から作らない

---

## 5. 参考リンク

- [Socket.io 公式ドキュメント](https://socket.io/docs/v4/)
- [Socket.io Rooms](https://socket.io/docs/v4/rooms/)
- [WebSocket MDN](https://developer.mozilla.org/ja/docs/Web/API/WebSocket)

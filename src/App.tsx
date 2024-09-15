import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import GameMap from '../component/GameMap'; // Correct import path for GameMap
import { getNPC } from '../component/Character';

const NAME = "Leah";
var npc = getNPC();

const App: React.FC = () => {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  const [newMessageText, setNewMessageText] = useState("");
  const [isChatFocused, setIsChatFocused] = useState(false);

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isChatFocused) {
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isChatFocused]);

  return (
    <div style={{ display: 'flex', height: '100vh',  }}>
      <div style={{ width: '50%', padding: '10px', position: 'relative', zIndex: 1, margin: 0, }}>
        <main className="chat" style={{ display: 'flex', flexDirection: 'column', height: '100%',  }}>
          <header style={{ width: '45.6%', boxSizing: 'border-box'}}>
            <h1>Who are you talking to?</h1>
            <p>
              Currently talking to <strong>{npc}</strong>
            </p>
          </header>
          <div style={{ flex: 1, overflowY: 'auto',  }}>
            {messages?.map((message) => (
              <article
                key={message._id}
                className={message.author === NAME ? "message-mine" : ""}
                style={{  }}
              >
                <div>{message.author}</div>
                <p>{message.body}</p>
              </article>
            ))}
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await sendMessage({ body: newMessageText, author: NAME });
              setNewMessageText("");
            }}
            style={{ width: '45%', boxSizing: 'border-box', float: "right"}}
          >
            <input
              value={newMessageText}
              onChange={async (e) => {
                const text = e.target.value;
                setNewMessageText(text);
              }}
              placeholder="Write a message…"
              style={{ width: 'calc(100% - 80px)', boxSizing: 'border-box'}}
              onFocus={() => setIsChatFocused(true)}
              onBlur={() => setIsChatFocused(false)}
            />
            <button type="submit" disabled={!newMessageText} style={{ width: '50px'}}>
              Send
            </button>
          </form>
        </main>
      </div>
      <div style={{ width: '60%', position: 'relative',  }}>
        <GameMap />
      </div>
    </div>
  );
};

export default App;

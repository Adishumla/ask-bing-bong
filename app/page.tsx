"use client";
import Image from "next/image";
import useState from "react-usestateref";
import userPic from "../public/user.png";
import botPic from "../public/bot.png";

enum Creator {
  me = 0,
  bot = 1,
}

interface MessageProps {
  text: string;
  from: Creator;
  key: number;
}

interface InputProps {
  onSend: (input: string) => void;
  disabled: boolean;
}

const ChatMessage = ({ text, from }: MessageProps) => {
  return (
    <>
      {from == Creator.me && (
        <div className="bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image
            src={userPic}
            alt="User"
            className="rounded-full w-10 h-10 object-cover object-center overflow-auto"
          />
          <p className="text-gray-800">{text}</p>
        </div>
      )}
      {from == Creator.bot && (
        <div className="bg-gray-100 p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image src={botPic} alt="Bot" className="rounded-full w-10 h-10" />
          <p className="text-gray-800">{text}</p>
        </div>
      )}
    </>
  );
};

const ChatInput = ({ onSend, disabled }: InputProps) => {
  const [input, setInput] = useState("");

  const sendInput = () => {
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      sendInput();
    }
  };

  return (
    <div className="bg-white border-2 p-2 rounded-lg flex justify-center">
      <input
        value={input}
        onChange={(ev: any) => setInput(ev.target.value)}
        className="w-full py-2 px-3 text-gray-800 rounded-lg focus:outline-none"
        type="text"
        placeholder="Type your message here..."
        disabled={disabled}
        onKeyDown={(ev) => handleKeyDown(ev)}
      />
      {disabled && (
        <svg
          aria-hidden="true"
          className="mt-1 w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50Z"
            fill="currentColor"
          />
          <path
            d="M93.5 50C93.5 74.3 74.3 93.5 50 93.5C25.7 93.5 6.5 74.3 6.5 50C6.5 25.7 25.7 6.5 50 6.5C74.3 6.5 93.5 25.7 93.5 50ZM50 94C26.2 94 6 73.8 6 50C6 26.2 26.2 6 50 6C73.8 6 94 26.2 94 50C94 73.8 73.8 94 50 94Z"
            fill="currentColor"
          />
        </svg>
      )}
      {!disabled && (
        <button
          onClick={() => sendInput()}
          className="p-2 rounded-md text-gray-500 bottom-1.5 right-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default function Home() {
  const [messages, setMessages, messagesRef] = useState<MessageProps[]>([]);
  const [loading, setLoading, loadingRef] = useState(false);

  const callApi = async (input: string) => {
    setLoading(true);

    const myMessage: MessageProps = {
      text: input,
      from: Creator.me,
      key: new Date().getTime(),
    };

    setMessages([...messagesRef.current, myMessage]);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input + ",Answer as a neanderthal would.",
      }),
    }).then((response) => response.json());
    setLoading(false);

    if (response) {
      const botMessage: MessageProps = {
        text: response.text,
        from: Creator.bot,
        key: new Date().getTime(),
      };
      setMessages([...messagesRef.current, botMessage]);
    } else {
      const botMessage: MessageProps = {
        text: "Sorry, I can't understand you",
        from: Creator.bot,
        key: new Date().getTime(),
      };
      setMessages([...messagesRef.current, botMessage]);
    }
  };

  return (
    <main className="relative max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mt-10">Ask Bing-Bong</h1>
      <div className="sticky top-0 w-full pt-10 px-4">
        <ChatInput onSend={(input) => callApi(input)} disabled={loading} />
      </div>

      <div className="mt-10 px-4">
        {messages.map((msg: MessageProps) => (
          <ChatMessage key={msg.key} text={msg.text} from={msg.from} />
        ))}
      </div>
    </main>
  );
}

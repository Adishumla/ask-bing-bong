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
        <div className="bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap mb-1 mt-1">
          <Image
            src={userPic}
            alt="User"
            className="rounded-full w-10 h-10 object-cover object-center overflow-auto"
          />
          <p className="text-gray-800">{text}</p>
        </div>
      )}
      {from == Creator.bot && (
        <div className="bg-gray-100 p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap mt-1 mb-1">
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
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}

      {!disabled && (
        <button
          onClick={() => sendInput()}
          className="p-2 rounded-lg text-gray-500 bottom-1.5 right-1 hover:bg-gray-100 transition-colors duration-200"
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
        prompt: input + ",Answer as a neanderthal",
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
      <h1 className="text-4xl font-bold text-center mt-10 text-gray-800 dark:text-gray-100">
        Ask Bing-Bong
      </h1>
      <p className="text-center text-gray-500 mt-2 dark:text-gray-400">
        Me Bong, you ask
      </p>

      <div className="flex flex-col h-screen overflow-y-auto px-2 py-2 mt-10 max-h-1/2 pb-72">
        <div className="mt-10 px-4">
          {messages.map((msg: MessageProps) => (
            <ChatMessage key={msg.key} text={msg.text} from={msg.from} />
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 max-w-2xl h-auto rounded-t-lg mx-auto bg-white dark:bg-gray-900 pb-4 md: w-11/12">
        <div className="fixed bottom-0 right-0 left-0 max-w-2xl mx-auto bg-white dark:bg-gray-900 pb-4 md: w-11/12 z-30">
          <ChatInput onSend={(input) => callApi(input)} disabled={loading} />
        </div>
      </div>
    </main>
  );
}

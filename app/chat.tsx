import { streamAsyncIterator } from "@/service/streamiterator";

import React, { useState } from "react";

export default function () {
  const [chapter, setChapter] = useState({
    noveloutline:
      "他的目标是成为一名能够保护世界和平的英雄，为此他不断修炼，提升自己。",
    language: "Chinese",
  });

  const [chapterOutput, setChapterOutput] = useState("");
  const [loading, setLoading] = useState(false);



  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(chapterOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 收集表单数据
    const formData = {
      noveloutline: chapter.noveloutline,
      language: chapter.language,
    };
    console.log("compoents charactor data:", formData);

    setLoading(true);
    try {
      // 发送异步POST请求到后端API
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const decoder = new TextDecoder();
      let chatContent = '';
      if (!res.ok || !res.body) {
        return;
      }
      for await (const event of streamAsyncIterator(res.body)) {

        const data = decoder.decode(event).split("\n")
        for (const chunk of data) {
          if(!chunk) continue;
          const message = JSON.parse(chunk);

          const content = message?.choices?.[0]?.delta?.content
          if (content) {
            chatContent += content;
            setChapterOutput(chatContent);
          }
        }
        
      }
      setLoading(false);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      // 这里可以添加错误处理逻辑，例如显示错误通知给用户
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center justify-between mb-4">
        <ol className="flex ">
          <li>
            <a href="/">Home 》 </a>
          </li>
          <li>
            <a href="#">Chapter outline</a>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-2 gap-8 h-full ">
        <div className="h-full ">
          <h2 className="text-2xl font-bold mb-4">
            Create detail chapter outline
          </h2>
          <form onSubmit={handleSubmit} className="w-full h-full">
            {/* Novel outline */}
            <div className="mb-4">
              <label
                htmlFor="noveloutline"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Novel outline:
              </label>
              <textarea
                rows={16}
                name="noveloutline"
                id="noveloutline"
                value={chapter.noveloutline}
                onChange={(e) =>
                  setChapter({ ...chapter, noveloutline: e.target.value })
                }
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Chapter's Noveloutline"
              ></textarea>
            </div>

            {/* Language */}
            <div className="mb-4">
              <label
                htmlFor="language"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Language:
              </label>
              <select
                name="language"
                id="language"
                value={chapter.language}
                onChange={(e) =>
                  setChapter({ ...chapter, language: e.target.value })
                }
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {/* 这里传递的值是value里的值 */}
                <option value="English">English</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Chapter Outline"}
              </button>
            </div>

  
          </form>
        </div>

        <div className="h-full">
          <h2 className="text-2xl font-bold mb-11">detail chatper outline Output</h2>
          <textarea
            value={chapterOutput}
            readOnly
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={16}
            placeholder="Chapter outline will appear here..."
          ></textarea>

          <button
            onClick={copyToClipboard}
            className="mt-2 relative bg-blue-500 hover:bg-blue-700 text-xl font-bold text-white p-2 rounded-sm px-2 py-1"
          >
            Copy
            {isCopied && (
              <span className="absolute top-0 py-1 px-1 right-0 transform translate-x-11 -translate-y-1/2 text-xs text-white-500 bg-gray-950 rounded">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


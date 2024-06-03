"use client";
import ChatInput from "@/components/ChatInput";
import ChatItem from "@/components/ChatItem";
import { Container, List, Stack } from "@mui/material";
import OpenAI from "openai";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage, useResizeObserver } from "usehooks-ts";

const ModelName = "mistralai/mistral-7b-instruct";

const ChatPage = () => {
  // 利用useHooks ts中， localStorage observer的特性实现本地缓存key
  const [apiKey, setApiKey, removeApiKey] = useLocalStorage("apiKey", "");

  const [messages, setMessages] = useState<OpenAI.ChatCompletionMessageParam[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const chatAIRef = useRef<OpenAI>();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // observe 高度变化，如果加载到了底部，可以自动滚动
  const { height = 0 } = useResizeObserver({
    ref: listRef,
  });

  const initAI = (key: string) => {
    chatAIRef.current = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: key,
      dangerouslyAllowBrowser: true,
    });
  };

  const destroyAI = () => {
    if (chatAIRef.current) {
      chatAIRef.current = undefined;
    }
  };

  const beforeSend = (value: string) => {
    if (!chatAIRef.current) {
      // 这里提示用户请先输入api key，使用浏览器自带alert处理了。
      alert("please input api key first!");
      return;
    }
    send(value);
  };

  // 发送请求的核心逻辑
  const send = async (value: string) => {
    setLoading(true);
    const requestMsg: OpenAI.ChatCompletionUserMessageParam = {
      role: "user",
      content: value,
    };
    const newMessages = [...messages, requestMsg];
    setMessages(newMessages);
    const completions = await chatAIRef.current?.chat.completions.create({
      model: ModelName,
      messages: [...messages, requestMsg],
    });

    const completionMsgs =
      completions?.choices.map((item) => item.message) || [];
    setMessages((prev) => [...prev, ...completionMsgs]);
    setLoading(false);
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (messageEndRef && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // api 变化重新设置openai client
  useEffect(() => {
    if (apiKey) {
      initAI(apiKey);
    } else {
      destroyAI();
    }
  }, [apiKey]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, height]);

  return (
    <Container className="h-full p-0" maxWidth="lg">
      <Stack
        className="h-full"
        direction="column"
        justifyContent="space-between"
        alignItems="stretch"
        spacing={2}
      >
        <List sx={{ overflowY: "auto" }}>
          {/* div 用于计算高度，高度变化则滚动列表 */}
          <div ref={listRef}>
            {messages.map((message, index) => {
              return (
                <ChatItem modelName={ModelName} message={message} key={index} />
              );
            })}
            {loading && (
              <ChatItem
                modelName={ModelName}
                message={{
                  role: "assistant",
                  content: null,
                }}
              />
            )}
            <div ref={messageEndRef}></div>
          </div>
        </List>
        <ChatInput onSumbit={beforeSend} />
      </Stack>
    </Container>
  );
};

export default ChatPage;

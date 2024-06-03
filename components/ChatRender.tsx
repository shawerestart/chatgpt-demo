"use client";
import { Marked } from "marked";
import hljs from "highlight.js";
import { markedHighlight } from "marked-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

type ChatRenderProps = {
  message: string;
};
const ChatRender = (props: ChatRenderProps) => {
  const { message } = props;

  const el = useRef(null);

  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  const html = marked.parse(message) as string;

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [html],
      typeSpeed: 0,
      backSpeed: 0,
      fadeOut: true,
      loop: false,
      showCursor: false,
      onStringTyped: () => {
        console.log("on string typed");
      },
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, [html]);
  return (
    // <div className="show-html" dangerouslySetInnerHTML={{ __html: html }}></div>
    <span className="mt-2" ref={el}></span>
  );
};

export default ChatRender;

import React from 'react';
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MarkDownProps extends React.HTMLProps<HTMLDivElement> {
  text: string;
}

const MarkDownParcer = ({ text, ...props }: MarkDownProps) => {
  return (
    <article {...props}>
      <Markdown
        rehypePlugins={[rehypeRaw]}
        components={{}}
      >
        {text}
      </Markdown>
    </article>
  );
};

export default MarkDownParcer;
"use client";
import { FormControl, IconButton, OutlinedInput } from "@mui/material";
import classNames from "classnames";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useMemo,
  useState,
} from "react";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import SettingDialog from "./SettingDialog";

type ChatInputProps = {
  onSumbit?: (value: string) => void;
};

const ChatInput = (props: ChatInputProps) => {
  const { onSumbit } = props;
  const [input, setInput] = useState<string>("");

  const handleOnKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSumbit?.(input);
      setInput("");
    }
  };

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.value;
    setInput(e.target.value);
  };

  // 如果是空字符串，不能发送，禁用发送按钮
  const isEmpty = useMemo(() => {
    return input.length === 0;
  }, [input]);


  // 提交后记得清除本地输入框内容
  const onInputSumbit = () => {
    onSumbit?.(input);
    setInput("");
  };

  return (
    <>
      <FormControl
        className="w-full"
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <OutlinedInput
          id="chat-input"
          className="!rounded-2xl"
          placeholder="Message ChatGPT"
          fullWidth={true}
          value={input}
          onChange={onInputChange}
          onKeyDown={handleOnKeydown}
          startAdornment={<SettingDialog />}
          endAdornment={
            <IconButton
              className={classNames([
                "rounded-2xl",
                isEmpty ? "!bg-gray-100" : "bg-blue-100",
              ])}
              color="primary"
              type="button"
              sx={{ p: "10px" }}
              aria-label="send"
              disabled={isEmpty}
              onClick={onInputSumbit}
            >
              <ArrowUpwardRoundedIcon />
            </IconButton>
          }
        />
      </FormControl>
    </>
  );
};
export default ChatInput;

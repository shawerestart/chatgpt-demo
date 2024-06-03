import { useMemo } from "react";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { stringAvatar } from "@/utils/string.util";
// 美化GPT代码输出
import ChatRender from "./ChatRender";
import OpenAI from "openai";

type ChatItemProps = {
  modelName: string;
  message: OpenAI.ChatCompletionMessageParam;
};

const ChatItem = (props: ChatItemProps) => {
  const { message, modelName } = props;

  const nickname = useMemo(() => {
    return message.role === "user" ? "You" : modelName || "";
  }, [message]);

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={nickname} {...stringAvatar(nickname)} />
        </ListItemAvatar>
        <ListItemText
          primary={nickname}
          secondary={
            <>
              {/* <div className="mt-2">
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {message.content || <LinearProgress />}
                </Typography>
              </div> */}
              {message.content ? (
                <ChatRender message={message.content as string} />
              ) : (
                <LinearProgress className="mt-2" />
              )}
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export default ChatItem;

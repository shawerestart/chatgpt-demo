import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import BrightnessHighRoundedIcon from "@mui/icons-material/BrightnessHighRounded";
import { useLocalStorage } from "usehooks-ts";

export default function SettingDialog() {
  const [open, setOpen] = useState(false);

  const [value, setValue, removeValue] = useLocalStorage("apiKey", "");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onKeyChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.value;
    setValue(() => e.target.value);
  };

  const saveApiKey = (apiKey: string) => {
    if (apiKey) {
      setValue(() => apiKey);
    } else {
      removeValue();
    }
  };

  return (
    <>
      <IconButton
        color="primary"
        type="button"
        sx={{ p: "10px" }}
        aria-label="setting"
        onClick={handleClickOpen}
      >
        <BrightnessHighRoundedIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const apiKey = formJson.apiKey;
            console.log("apiKey", apiKey);
            saveApiKey(apiKey);
            handleClose();
          },
        }}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            please enter your open ai key here
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="apiKey"
            name="apiKey"
            label="Api Key"
            fullWidth
            variant="standard"
            value={value}
            onChange={onKeyChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

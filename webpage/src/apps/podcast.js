import axios from "axios";
import { IP_PORT } from "./ip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Podcast() {
  const [board, setBoard] = useState("");
  const [aid, setAid] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [audio, setAudio] = useState("");
  const [resVis, setResVis] = useState("hidden")
  const getAudio = () => {
    if ((board !== "") && (aid !== "")) {
      axios.get(IP_PORT+"/podcast?b="+board+"&a="+aid
      ).then((rsp) => {
        setTitle(rsp.data.title);
        setAuthor(rsp.data.author);
        setAudio(IP_PORT+"/audio?a="+rsp.data.audio+"&t="+new Date().getTime());
        setResVis("visible");
      })
    } else {
      setTitle("");
      setAuthor("");
      setAudio("");
      setResVis("hidden");
    }
  };
  return (
    <>
    <header className="title">Podcast</header>
    <Stack
      component="form"
      sx={{
        position: "relative",
        left: "35%",
        width: "30%",
      }}
      spacing={2}
      noValidate
      autoComplete="off"
    >
      <TextField
        required
        label="Board (required)"
        focused
        onChange={(event) => setBoard(event.target.value)}
        sx={{ input: { color: "white" } }}
      />
      <TextField
        required
        label="AID (required)"
        focused
        onChange={(event) => setAid(event.target.value)}
        sx={{ input: { color: "white" } }}
      />
      <Button
        variant="contained"
        onClick={getAudio}
      >
        Submit
      </Button>
      <Box sx={{ display: 'flex', flexDirection: 'column', visibility: resVis }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5" color="white">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="rgb(187 187 187)" component="div">
            {author}
          </Typography>
        </CardContent>
        <audio src={audio} controls>
        </audio>
      </Box>
    </Stack>
    </>
  );
};
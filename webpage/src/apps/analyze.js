import axios from "axios";
import { IP_PORT } from "./ip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

export default function Analyze() {
  const [top10Board, setTop10Board] = useState([]);
  const [board, setBoard] = useState("");
  const [keyword, setKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [push, setPush] = useState("");
  const [maxPost, setMaxPost] = useState("");
  const [poSem, setPoSem] = useState(0);
  const [puSem, setPuSem] = useState(0);
  const [HKW, setHKW] = useState([]);
  const [kwPNG, setKwPNG] = useState("");
  const [cityPNG, setCityPNG] = useState("");
  const [resVis, setResVis] = useState("hidden");
  if (top10Board.length === 0){
    axios.get(IP_PORT+"/hot_board?n_boards=20"
    ).then((rsp) => {
      setTop10Board(rsp.data);
    })
  }
  const getAnalyze = () => {
    setResVis("hidden")
    setPoSem(0);
    setPuSem(0);
    setHKW([]);
    setKwPNG("");
    setCityPNG("");
    let url = IP_PORT+"/analyze?";
    if (board !== "") {
      url = url+"b="+board;
      if (keyword !== "") { url = url+"&k="+keyword };
      if (author !== "") { url = url+"&a="+author };
      if (push !== "") { url = url+"&p="+push };
      if (maxPost !== "") { url = url+"&m="+maxPost };
      axios.get(url
      ).then((rsp) => {
        if (!Array.isArray(rsp.data)) {
          setPoSem(rsp.data.post_semantic);
          setPuSem(rsp.data.push_semantic);
          setHKW(rsp.data.hot_keyword);
          setKwPNG(
            IP_PORT+"/image?i="+rsp.data.keyword_png+"&t="+new Date().getTime());
          setCityPNG(
            IP_PORT+"/image?i="+rsp.data.city_png+"&t="+new Date().getTime());
          setResVis("visible");
      }})
    }
  };
  return (
    <>
    <header className="title">Analyze</header>
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
      <Autocomplete
        options={top10Board} 
        onInputChange={(event, newValue) => setBoard(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            label="Board (required)"
            focused
            sx={{ input: { color: "white" } }}
          />
        )}
      />
      <TextField
        label="Keyword (optional)"
        focused
        onChange={(event) => setKeyword(event.target.value)}
        sx={{ input: { color: "white" } }}
      />
      <TextField
        label="Author (optional)"
        focused
        onChange={(event) => setAuthor(event.target.value)}
        sx={{ input: { color: "white" } }}
      />
      <TextField
        label="Push (optional)"
        focused
        onChange={(event) => setPush(event.target.value)}
        sx={{ input: { color: "white" } }}
      />
      <TextField
        label="Max Posts (optional)"
        focused
        onChange={(event) => setMaxPost(event.target.value)}
        sx={{ input: { color: "white" } }}
      />
      <Button
        variant="contained"
        onClick={getAnalyze}
      >
        Submit
      </Button>
    </Stack>
    <Box sx={{ position: "relative", left: "35%", width: 400, visibility: resVis }}>
      <CardContent>
        <Typography component="div" variant="h5" color="white" sx={{ fontStyle: 'italic' }}>
          {HKW.map(v => (
            v+" "
          ))}
        </Typography>
        <Typography variant="subtitle1" color="rgb(187 187 187)" component="div">
          Post Score: {poSem}
        </Typography>
        <Typography variant="subtitle1" color="rgb(187 187 187)" component="div">
          Push Score: {puSem}
        </Typography>
      </CardContent>
    </Box>
    <Box sx={{ position: "relative", left: "35%", width: 400, height: 310, visibility: resVis }}>
      <CardMedia
        sx={{ height: 300 }}
        image={kwPNG}
      />
    </Box>
    <Box sx={{ position: "relative", left: "35%", width: 400, height: 310, visibility: resVis }}>
      <CardMedia
        sx={{ height: 300 }}
        image={cityPNG}
      />
    </Box>
    </>
  )
};
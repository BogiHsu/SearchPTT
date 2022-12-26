import axios from "axios";
import { IP_PORT } from "./ip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';

export default function Search() {
  const [top10Board, setTop10Board] = useState([]);
  const [board, setBoard] = useState("");
  const [keyword, setKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [push, setPush] = useState("");
  const [maxPost, setMaxPost] = useState("");
  const [resData, setResData] = useState([]);
  const [resVis, setResVis] = useState("hidden");
  if (top10Board.length === 0){
    axios.get(IP_PORT+"/hot_board?n_boards=20"
    ).then((rsp) => {
      setTop10Board(rsp.data);
    })
  }
  const getSearch = () => {
    setResData([]);
    setResVis("hidden");
    let url = IP_PORT+"/search?";
    if (board !== "") {
      url = url+"b="+board;
      if (keyword !== "") { url = url+"&k="+keyword };
      if (author !== "") { url = url+"&a="+author };
      if (push !== "") { url = url+"&p="+push };
      if (maxPost !== "") { url = url+"&m="+maxPost };
      axios.get(url
      ).then((rsp) => {
        setResData(rsp.data)
        setResVis("visible");
      })
    }
  };
  return (
    <>
    <header className="title">Search</header>
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
        onClick={getSearch}
      >
        Submit
      </Button>
    </Stack>
    <TableContainer
      sx={{
        mt: "2%",
        backgroundColor: 'rgb(0, 40, 60)',
        position: "relative",
        left: "5%",
        width: "90%",
        visibility: resVis
      }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "white" }} align="left">Time</TableCell>
            <TableCell sx={{ color: "white" }} align="left">Title</TableCell>
            <TableCell sx={{ color: "white" }} align="left">Author</TableCell>
            <TableCell sx={{ color: "white" }} align="left">Summary</TableCell>
            <TableCell sx={{ color: "white" }} align="left">Keyword</TableCell>
            <TableCell sx={{ color: "white" }} align="left">AID</TableCell>
            <TableCell sx={{ color: "white" }} align="left">URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resData.map((res) => (
            <TableRow key={res.title}>
              <TableCell sx={{ color: "white" }} align="left">{res.date}</TableCell>
              <TableCell sx={{ color: "white" }} align="left">{res.title}</TableCell>
              <TableCell sx={{ color: "white" }} align="left">{res.author}</TableCell>
              <TableCell sx={{ color: "white" }} align="left">{res.summary.join('; ')}</TableCell>
              <TableCell sx={{ color: "white" }} align="left">{res.keyword.join('; ')}</TableCell>
              <TableCell sx={{ color: "white" }} align="left">{res.aid}</TableCell>
              <TableCell sx={{ color: "white" }} align="left">
                <Link href={res.web_url} target="_blank" rel="noopener">Link</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
};
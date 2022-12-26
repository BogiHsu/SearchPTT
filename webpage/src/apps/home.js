import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import letter_p_home from './letter-p-home.png';

export default function Home() {
  return (
    <>
      <header className="title">SearchPTT</header>
      <Card class="card">
        <CardMedia
          component="img"
          sx={{
            borderRadius: "50%",
            position: "relative",
            left: "30%",
            width: "40%"}}
          image={letter_p_home} // Letter p icons created by yukyik - Flaticon
        />
        <CardContent
          sx={{
            position: "relative",
            left: "5%",
            width: "90%"}}
        >
          <Typography gutterBottom variant="h6" component="div">
            <> SearchPTT is a web app for exploring popular posts and trends on PTT. </>
            <> You can also "play" a selected post like listening to a podcast. </>
          </Typography>
        </CardContent>
      </Card>
    </>
  )
};
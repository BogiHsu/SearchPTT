import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CardContent from '@mui/material/CardContent';
import photo from './photo.jpg';

export default function About() {
  return (
    <>
      <header className="title">About</header>
      <Card class="card">
        <CardMedia
          component="img"
          sx={{
            borderRadius: "50%",
            position: "relative",
            left: "30%",
            width: "40%"}}
          image={photo}
        />
        <CardContent
          sx={{
            position: "relative",
            left: "20%",
            width: "60%"}}
        >
          <Typography gutterBottom variant="h6" component="div">
            <PersonIcon/><> 許博竣 (Po-chun Hsu)</>
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            <SchoolIcon/><> f07942095</>
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            <EmailIcon/><> f07942095@ntu.edu.tw</>
          </Typography>
        </CardContent>
      </Card>
    </>
  )
};
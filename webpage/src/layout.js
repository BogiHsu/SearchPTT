import { React, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import HomeIcon from '@mui/icons-material/Home';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RadioIcon from '@mui/icons-material/Radio';
import InfoIcon from '@mui/icons-material/Info';

const actions = [
  { icon: <Link to='/about'><InfoIcon className="icon" /></Link>, name: 'About' },
  { icon: <Link to='/podcast'><RadioIcon className="icon" /></Link>, name: 'Podcast' },
  { icon: <Link to='/analyze'><AssessmentIcon className="icon" /></Link>, name: 'Analyze' },
  { icon: <Link to='/search'><FindInPageIcon className="icon" /></Link>, name: 'Search' },
  { icon: <Link to='/'><HomeIcon className="icon" /></Link>, name: 'Home' },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Box sx={{ height: '100%', flexGrow: 1 }}>
        <SpeedDial
          ariaLabel='SpeedDial'
          sx={{ position: 'absolute', bottom: '5%', right: '2%' }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </Box>
      <Outlet />
    </div>
  )
};
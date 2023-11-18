import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import tasks from "../src/tasks.json";

export default function Info(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Card sx={{ maxWidth: 345, position: 'relative' }}> {/* Make sure the card position is set to relative */}
      <CardMedia
        component="img"
        alt={tasks[props.id].name}
        height="140"
        image={tasks[props.id].image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {tasks[props.id].name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          INFO BELONGS HERE
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small" onClick={handleClick}>Learn More</Button>
      </CardActions>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        sx={{ marginLeft: 4 }} // Add some space between the card and the popover
      >
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="Sample Image"
            height="140"
            image="https://via.placeholder.com/345x140"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Sample Title
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is some sample text for the Learn More section. It has been designed to match the size and layout of the original card.
            </Typography>
          </CardContent>
        </Card>
      </Popover>
    </Card>
  );
}

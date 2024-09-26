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

  // Finde den Task basierend auf der ID
  const task = tasks[props.id];

  return (
    <Card sx={{ maxWidth: 345, position: 'relative' }}>
      {/* Sidebar Content */}
      <CardMedia
        component="img"
        alt={task.name}
        height="140"
        image={task.image} // Bild wird in der Sidebar angezeigt
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {task.name} {/* Name wird in der Sidebar angezeigt */}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          INFO BELONGS HERE {/* Text in der Sidebar */}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small" onClick={handleClick}>Learn More</Button> {/* Öffnet das Popover */}
      </CardActions>

      {/* Popover Content (unterschiedlicher Inhalt) */}
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
        sx={{ marginLeft: 4 }}
      >
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt={task.name}
            height="140"
            image={task.icon ? `/path/to/icons/${task.icon}.png` : task.image} 
            // Optional ein anderes Bild im Popover, z.B. ein Icon statt des Bildes aus der Sidebar
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {task.name} {/* Der Name bleibt gleich */}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.description || "Keine detaillierte Beschreibung verfügbar."} {/* Detaillierte Beschreibung im Popover */}
            </Typography>
            {/* Füge zusätzliche Informationen nur im Popover hinzu */}
            <Typography variant="body2" color="text.secondary">
              <strong>Weitere Details:</strong> 
              {/* Beispiel: Zusätzlicher Content im Popover */}
              <ul>
                <li>Standort: {task.loc.join(', ')}</li>
                <li>ID: {task.id}</li>
              </ul>
            </Typography>
          </CardContent>
        </Card>
      </Popover>
    </Card>
  );
}

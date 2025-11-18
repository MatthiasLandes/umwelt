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
  const { id, compact } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation(); // Prevent triggering parent onClick
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Find the task based on the ID
  const task = tasks[id];
  
  // Compact style for list view
  const cardStyle = compact ? 
    { maxWidth: 345, position: 'relative', marginBottom: '0' } : 
    { maxWidth: 345, position: 'relative' };

  return (
    <Card sx={cardStyle}>
      {/* Sidebar Content */}
      <CardMedia
        component="img"
        alt={task.name}
        height={compact ? "80" : "140"}
        image={task.image}
      />
      <CardContent sx={compact ? { padding: '8px' } : {}}>
        <Typography gutterBottom variant={compact ? "body1" : "h5"} component="div">
          {task.name}
        </Typography>
        {!compact && (
          <Typography variant="body2" color="text.secondary">
            {task.sidebarInfo || "Keine Info verfügbar."}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        {!compact && <Button size="small">Share</Button>}
        <Button size="small" onClick={handleClick}>Learn More</Button>
      </CardActions>

      {/* Popover Content */}
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
            image={task.popoverImage || task.image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {task.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.description || "Keine detaillierte Beschreibung verfügbar."}
            </Typography>
            {task.extraDetails && (
              <Typography variant="body2" color="text.secondary" component="div">
                <strong>Weitere Details:</strong>
                <ul>
                  {Object.entries(task.extraDetails).map(([key, value]) => (
                    <li key={key}>
                      {key}: {Array.isArray(value) ? value.join(', ') : value}
                    </li>
                  ))}
                </ul>
              </Typography>
            )}
          </CardContent>
        </Card>
      </Popover>
    </Card>
  );
}

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import tasks from "../src/tasks.json";

export default function Info(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { id, compact } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation(); // Prevent triggering parent onClick
  };

  const handleClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Find the task based on the ID
  const task = tasks[id];

  if (!task) return null;

  return (
    <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        alt={task.name}
        height={compact ? "120" : "140"}
        image={task.image}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: 2 } }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem', lineHeight: 1.2, mb: 1 }}>
          {task.name}
        </Typography>

        {compact && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <LocationOnIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" noWrap>
                {task.sidebarInfo || "Bayern"}
              </Typography>
            </Box>
          </Box>
        )}

        {!compact && (
          <Typography variant="body2" color="text.secondary">
            {task.sidebarInfo || "Keine Info verfügbar."}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button size="small" onClick={handleClick} variant="outlined" fullWidth>
          Details
        </Button>
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
        sx={{ ml: 1 }}
      >
        <Card sx={{ maxWidth: 400 }}>
          <CardMedia
            component="img"
            alt={task.name}
            height="200"
            image={task.popoverImage || task.image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {task.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {task.description || "Keine detaillierte Beschreibung verfügbar."}
            </Typography>

            {task.extraDetails && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Weitere Details
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(task.extraDetails).map(([key, value]) => (
                    <Chip
                      key={key}
                      label={`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Popover>
    </Card>
  );
}

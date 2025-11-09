import { useWeatherStore } from '@/index';
import { Switch, FormControlLabel, Box, Typography, Button, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const options = [
  { key: 'showFeelsLike' as const, label: 'Ощущается как' },
  { key: 'showHumidity' as const, label: 'Влажность' },
  { key: 'showWind' as const, label: 'Ветер' },
  { key: 'showPressure' as const, label: 'Давление' },
] as const;

const SettingsModal = () => {
  const { settings, updateSettings, setShowSettings } = useWeatherStore();

  return (
    <Dialog
      open={true}
      onClose={() => setShowSettings(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          maxWidth: 400,
          margin: 'auto'
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h3" fontWeight="bold">
          Настройки
        </Typography>
        <IconButton 
          onClick={() => setShowSettings(false)}
          sx={{
            '&:hover': { transform: 'scale(1.1)' },
            transition: 'transform 0.2s'
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.units === 'imperial'}
              onChange={() =>
                updateSettings({
                  units: settings.units === 'metric' ? 'imperial' : 'metric',
                })
              }
              color="primary"
            />
          }
          label={
            <Typography variant="body1">
              Фаренгейты
            </Typography>
          }
          sx={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            marginLeft: 0,
            marginRight: 0,
            width: '100%'
          }}
        />

        {options.map(({ key, label }) => (
          <FormControlLabel
            key={key}
            control={
              <Switch
                checked={settings[key]}
                onChange={() => updateSettings({ [key]: !settings[key] })}
                color="primary"
              />
            }
            label={
              <Typography variant="body1">
                {label}
              </Typography>
            }
            sx={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              marginLeft: 0,
              marginRight: 0,
              width: '100%'
            }}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={() => setShowSettings(false)}
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 2,
          fontSize: '1rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976d2, #1565c0)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0, #0d47a1)',
          }
        }}
      >
        Сохранить
      </Button>
    </Dialog>
  );
};

export default SettingsModal;
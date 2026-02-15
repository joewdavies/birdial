import { Slider, Text, Stack, Group, ActionIcon } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface TimeSliderProps {
  value: number;
  onChange: (value: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export function TimeSlider({
  value,
  onChange,
  isPlaying,
  onPlayToggle,
}: TimeSliderProps) {
  const currentMonth = Math.floor(value);
  const dayOfMonth = Math.round((value - currentMonth) * 30) + 1;

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500}>
          Time of Year
        </Text>
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            {dayOfMonth} {MONTHS[currentMonth]}
          </Text>
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={onPlayToggle}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <IconPlayerPause size={16} />
            ) : (
              <IconPlayerPlay size={16} />
            )}
          </ActionIcon>
        </Group>
      </Group>
      <Slider
        value={value}
        onChange={onChange}
        min={0}
        max={11.99}
        step={0.1}
        marks={MONTHS.map((label, index) => ({
          value: index,
          label: index % 3 === 0 ? label : undefined,
        }))}
        label={null}
        styles={{
          markLabel: { fontSize: 10 },
        }}
      />
    </Stack>
  );
}

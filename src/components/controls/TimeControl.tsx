import { Paper } from "@mantine/core";
import { TimeSlider } from "./TimeSlider";

interface TimeControlProps {
  value: number;
  onChange: (value: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export function TimeControl({
  value,
  onChange,
  isPlaying,
  onPlayToggle,
}: TimeControlProps) {
  return (
    <Paper
      p="md"
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 1,
        maxWidth: 600,
        marginInline: "auto",
      }}
    >
      <TimeSlider
        value={value}
        onChange={onChange}
        isPlaying={isPlaying}
        onPlayToggle={onPlayToggle}
      />
    </Paper>
  );
}

import { Paper, Group, Box, Text } from "@mantine/core";
import type { Bird } from "../../types";

interface LegendProps {
  birds: Bird[];
  visibility: Record<string, boolean>;
}

export function Legend({ birds, visibility }: LegendProps) {
  const visibleBirds = birds.filter((bird) => visibility[bird.id]);

  if (visibleBirds.length === 0) return null;

  return (
    <Paper
      p="xs"
      style={{
        position: "absolute",
        bottom: 90,
        left: 16,
        zIndex: 1,
      }}
    >
      <Group gap="md">
        {visibleBirds.map((bird) => (
          <Group key={bird.id} gap={6} wrap="nowrap">
            <Box
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: bird.color,
                flexShrink: 0,
              }}
            />
            <Text size="xs">{bird.name}</Text>
          </Group>
        ))}
      </Group>
    </Paper>
  );
}

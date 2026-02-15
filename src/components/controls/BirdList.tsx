import { Stack, Text, Switch, Group, Box } from "@mantine/core";
import type { Bird } from "../../types";

interface BirdListProps {
  birds: Bird[];
  visibility: Record<string, boolean>;
  onToggle: (birdId: string) => void;
}

export function BirdList({ birds, visibility, onToggle }: BirdListProps) {
  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        Species
      </Text>
      <Stack gap={8}>
        {birds.map((bird) => (
          <Group key={bird.id} justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
              <Box
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: bird.color,
                  flexShrink: 0,
                }}
              />
              <Box style={{ minWidth: 0 }}>
                <Text size="sm" truncate>
                  {bird.name}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {bird.scientificName}
                </Text>
              </Box>
            </Group>
            <Switch
              size="sm"
              checked={visibility[bird.id] ?? true}
              onChange={() => onToggle(bird.id)}
              aria-label={`Toggle ${bird.name}`}
            />
          </Group>
        ))}
      </Stack>
    </Stack>
  );
}

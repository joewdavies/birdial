import { Stack, Paper, Drawer, ActionIcon, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { BirdList } from "../controls/BirdList";
import type { Bird } from "../../types";

interface SidebarProps {
  birds: Bird[];
  visibility: Record<string, boolean>;
  onToggleBird: (birdId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({
  birds,
  visibility,
  onToggleBird,
}: Omit<SidebarProps, "isOpen" | "onClose">) {
  return (
    <BirdList birds={birds} visibility={visibility} onToggle={onToggleBird} />
  );
}

export function Sidebar({
  birds,
  visibility,
  onToggleBird,
  isOpen,
  onClose,
}: SidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <Drawer
        opened={isOpen}
        onClose={onClose}
        size="xs"
        withCloseButton={false}
        styles={{
          body: { padding: 16 },
        }}
      >
        <Stack gap="md">
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={onClose}
            style={{ alignSelf: "flex-end" }}
            aria-label="Close species list"
          >
            <IconX size={18} />
          </ActionIcon>
          <Text size="sm" fw={500}>
            Species
          </Text>
          <SidebarContent
            birds={birds}
            visibility={visibility}
            onToggleBird={onToggleBird}
          />
        </Stack>
      </Drawer>
    );
  }

  if (!isOpen) return null;

  return (
    <Paper
      p="md"
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        width: 280,
        maxHeight: "calc(100% - 120px)",
        overflow: "auto",
        zIndex: 1,
      }}
    >
      <SidebarContent
        birds={birds}
        visibility={visibility}
        onToggleBird={onToggleBird}
      />
    </Paper>
  );
}

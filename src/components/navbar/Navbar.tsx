import { Flex, ActionIcon, Box } from "@mantine/core";
import { IconBrandGithub, IconFeather } from "@tabler/icons-react";
import { Logo } from "./Logo";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <Flex
      align="center"
      px="md"
      h={56}
      style={{
        borderBottom: "1px solid var(--mantine-color-dark-4)",
      }}
    >
      <Box style={{ flex: 1 }}>
        <ActionIcon
          size="lg"
          variant="default"
          onClick={onToggleSidebar}
          aria-label="Toggle species list"
        >
          <IconFeather size={20} />
        </ActionIcon>
      </Box>
      <Logo />
      <Box style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <ActionIcon
          size="lg"
          variant="default"
          component="a"
          href="https://github.com/joewdavies/birdial"
          target="_blank"
        >
          <IconBrandGithub stroke={1.5} />
        </ActionIcon>
      </Box>
    </Flex>
  );
}

import { Flex } from "@mantine/core";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <Flex
      justify="space-between"
      align="center"
      px="md"
      h={56}
      style={{
        borderBottom: "1px solid var(--mantine-color-dark-4)",
      }}
    >
      <Logo />
    </Flex>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Navbar } from '../components/navbar/Navbar';
import { Globe } from '../components/globe/Globe';
import { Sidebar } from '../components/sidebar/Sidebar';
import { TimeControl } from '../components/controls/TimeControl';
import { Legend } from '../components/controls/Legend';
import { birds, getDefaultVisibility } from '../data/birds';
import { useBirdMigrations } from '../hooks/useBirdMigrations';

export function App() {
  const [visibility, setVisibility] = useState(getDefaultVisibility);
  const [monthProgress, setMonthProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sidebarOpen, { toggle: toggleSidebar, close: closeSidebar }] =
    useDisclosure(false);

  const { tracks, positions } = useBirdMigrations(
    birds,
    visibility,
    monthProgress,
  );

  const handleToggleBird = useCallback((birdId: string) => {
    setVisibility((prev) => ({
      ...prev,
      [birdId]: !prev[birdId],
    }));
  }, []);

  const handlePlayToggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setMonthProgress((prev) => {
        const next = prev + 0.05;
        return next >= 12 ? 0 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onToggleSidebar={toggleSidebar} />
      <div style={{ flex: 1, position: 'relative' }}>
        <Globe tracks={tracks} positions={positions} />
        <Sidebar
          birds={birds}
          visibility={visibility}
          onToggleBird={handleToggleBird}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        <Legend birds={birds} visibility={visibility} />
        <TimeControl
          value={monthProgress}
          onChange={setMonthProgress}
          isPlaying={isPlaying}
          onPlayToggle={handlePlayToggle}
        />
      </div>
    </div>
  );
}

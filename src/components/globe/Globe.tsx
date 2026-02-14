import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export function Globe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const mapOptions = {
      container: containerRef.current,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#0b1d2d",
            },
          },
        ],
      },
      center: [0, 20],
      zoom: 1.2,
      pitch: 25,
      bearing: 0,
      projection: "globe",
      antialias: true,
    } as maplibregl.MapOptions;
    const map = new maplibregl.Map(mapOptions);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        minHeight: 0,
      }}
    />
  );
}

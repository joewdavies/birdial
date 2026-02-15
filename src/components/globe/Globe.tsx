import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { FeatureCollection, LineString, Point } from 'geojson';

const TRACKS_SOURCE = 'bird-tracks';
const POSITIONS_SOURCE = 'bird-positions';
const TRACKS_LAYER = 'bird-tracks-layer';
const POSITIONS_LAYER = 'bird-positions-layer';

interface GlobeProps {
  tracks: FeatureCollection<LineString>;
  positions: FeatureCollection<Point>;
}

export function Globe({ tracks, positions }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const isMapReady = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style:
        'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
      center: [0, 20],
      zoom: 2,
      attributionControl: false,
    });

    map.setPadding({ top: 0, bottom: 150, left: 0, right: 0 });

    map.on('style.load', () => {
      map.setProjection({ type: 'globe' });

      map.addSource(TRACKS_SOURCE, {
        type: 'geojson',
        data: tracks,
      });

      map.addSource(POSITIONS_SOURCE, {
        type: 'geojson',
        data: positions,
      });

      map.addLayer({
        id: TRACKS_LAYER,
        type: 'line',
        source: TRACKS_SOURCE,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-opacity': 0.7,
        },
      });

      map.addLayer({
        id: POSITIONS_LAYER,
        type: 'circle',
        source: POSITIONS_SOURCE,
        paint: {
          'circle-radius': 8,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      isMapReady.current = true;
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      isMapReady.current = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady.current) return;

    const tracksSource = map.getSource(
      TRACKS_SOURCE,
    ) as maplibregl.GeoJSONSource;
    const positionsSource = map.getSource(
      POSITIONS_SOURCE,
    ) as maplibregl.GeoJSONSource;

    if (tracksSource) {
      tracksSource.setData(tracks);
    }
    if (positionsSource) {
      positionsSource.setData(positions);
    }
  }, [tracks, positions]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
      }}
    />
  );
}

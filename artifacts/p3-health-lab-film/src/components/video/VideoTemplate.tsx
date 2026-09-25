import {
  VideoCanvas,
  type VideoAspectRatio,
  VideoPausedContext,
  useVideoPlayer,
} from '@/lib/video';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useRef } from 'react';

import { EvidenceScene } from './video_scenes/EvidenceScene';
import { AirScene } from './video_scenes/AirScene';
import { IntroScene } from './video_scenes/IntroScene';
import { OutroScene } from './video_scenes/OutroScene';
import { SharedHealthScene } from './video_scenes/SharedHealthScene';

export const SCENE_DURATIONS = {
  intro: 4200,
  air: 5200,
  evidence: 5600,
  shared: 5200,
  outro: 4200,
};

const VIDEO_ASPECT_RATIO: VideoAspectRatio = '16:9';

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: IntroScene,
  air: AirScene,
  evidence: EvidenceScene,
  shared: SharedHealthScene,
  outro: OutroScene,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  paused = false,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  paused?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop, paused });
  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSceneKeyRef = useRef<string | null>(null);
  const sceneStartSeconds = Object.keys(SCENE_DURATIONS).reduce<Record<string, number>>(
    (starts, key, index, keys) => {
      starts[key] = keys.slice(0, index).reduce((total, previousKey) => total + SCENE_DURATIONS[previousKey], 0) / 1000;
      return starts;
    },
    {},
  );

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    if (paused) {
      audio.pause();
      return;
    }
    if (lastSceneKeyRef.current !== currentSceneKey) {
      lastSceneKeyRef.current = currentSceneKey;
      const targetTime = sceneStartSeconds[baseSceneKey] ?? 0;
      if (Math.abs(audio.currentTime - targetTime) > 0.18) {
        audio.currentTime = targetTime;
      }
    }
    audio.play().catch(() => {});
  }, [baseSceneKey, currentSceneKey, muted, paused, sceneStartSeconds]);

  return (
    <VideoPausedContext.Provider value={paused}>
      <VideoCanvas aspectRatio={VIDEO_ASPECT_RATIO} className="film-stage">
        <AnimatePresence mode="sync">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </VideoCanvas>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </VideoPausedContext.Provider>
  );
}

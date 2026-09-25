import {
  VideoCanvas,
  type VideoAspectRatio,
  VideoPausedContext,
  useVideoPlayer,
} from '@/lib/video';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

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

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  return (
    <VideoPausedContext.Provider value={paused}>
      <VideoCanvas aspectRatio={VIDEO_ASPECT_RATIO} className="film-stage">
        <AnimatePresence mode="sync">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </VideoCanvas>
    </VideoPausedContext.Provider>
  );
}

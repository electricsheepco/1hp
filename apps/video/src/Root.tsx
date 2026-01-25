import { Composition } from "remotion";
import { Post } from "./compositions/Post";
import { Reel } from "./compositions/Reel";

// Aspect ratios
const POST_WIDTH = 1080;
const POST_HEIGHT = 1080;
const REEL_WIDTH = 1080;
const REEL_HEIGHT = 1920;

// 30fps, durations in frames
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Instagram Post (1:1) */}
      <Composition
        id="Post"
        component={Post}
        durationInFrames={5 * FPS} // 5 seconds
        fps={FPS}
        width={POST_WIDTH}
        height={POST_HEIGHT}
        defaultProps={{
          title: "1HP",
          subtitle: "One Human Powered",
          tagline: "Movement, by humans",
          illustration: "runner-start",
        }}
      />

      {/* Instagram Reel / Story (9:16) */}
      <Composition
        id="Reel"
        component={Reel}
        durationInFrames={10 * FPS} // 10 seconds
        fps={FPS}
        width={REEL_WIDTH}
        height={REEL_HEIGHT}
        defaultProps={{
          title: "1HP",
          subtitle: "One Human Powered",
          tagline: "Movement, by humans",
          pillars: ["Participate", "Equip", "Measure"],
        }}
      />

      {/* Event Promo Post */}
      <Composition
        id="EventPost"
        component={Post}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={POST_WIDTH}
        height={POST_HEIGHT}
        defaultProps={{
          title: "Chennai Marathon",
          subtitle: "15 Feb 2025",
          tagline: "Find your event at 1HP.in",
          illustration: "runner-start",
        }}
      />

      {/* Event Promo Reel */}
      <Composition
        id="EventReel"
        component={Reel}
        durationInFrames={8 * FPS}
        fps={FPS}
        width={REEL_WIDTH}
        height={REEL_HEIGHT}
        defaultProps={{
          title: "Chennai Marathon",
          subtitle: "15 Feb 2025",
          tagline: "1HP.in/participate",
          pillars: ["21K", "42K", "10K"],
        }}
      />
    </>
  );
};

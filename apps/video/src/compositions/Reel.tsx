import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// 1HP brand colours
const COLOURS = {
  background: "#FAF8F5",
  foreground: "#3D3629",
  primary: "#C96442",
  muted: "#807A6F",
};

const illustrations = [
  staticFile("illustrations/undraw_runner-start_585j.svg"),
  staticFile("illustrations/undraw_bike-ride_ba0o.svg"),
  staticFile("illustrations/undraw_fitness-stats_uk0g.svg"),
  staticFile("illustrations/undraw_morning-workout_73u9.svg"),
];

type ReelProps = {
  title: string;
  subtitle: string;
  tagline: string;
  pillars: string[];
};

export const Reel: React.FC<ReelProps> = ({
  title,
  subtitle,
  tagline,
  pillars,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOURS.background,
        fontFamily: "Sora, system-ui, sans-serif",
      }}
    >
      {/* Scene 1: Title reveal (0-3s) */}
      <Sequence from={0} durationInFrames={3 * fps}>
        <TitleScene title={title} subtitle={subtitle} />
      </Sequence>

      {/* Scene 2: Pillars (3-7s) */}
      <Sequence from={3 * fps} durationInFrames={4 * fps}>
        <PillarsScene pillars={pillars} />
      </Sequence>

      {/* Scene 3: Tagline + CTA (7-10s) */}
      <Sequence from={7 * fps} durationInFrames={3 * fps}>
        <TaglineScene tagline={tagline} />
      </Sequence>

      {/* Persistent bottom accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 12,
          backgroundColor: COLOURS.primary,
          transform: `scaleX(${interpolate(frame, [0, 45], [0, 1], {
            extrapolateRight: "clamp",
          })})`,
          transformOrigin: "left",
        }}
      />
    </AbsoluteFill>
  );
};

// Title Scene Component
const TitleScene: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const illustrationIndex = Math.floor((frame / 30) % illustrations.length);

  return (
    <AbsoluteFill>
      {/* Background illustration */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.1,
        }}
      >
        <Img
          src={illustrations[illustrationIndex]}
          style={{
            width: "70%",
            height: "70%",
            objectFit: "contain",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}
        >
          <h1
            style={{
              fontSize: 200,
              fontWeight: 200,
              color: COLOURS.foreground,
              letterSpacing: "-0.02em",
              margin: 0,
              transform: `scale(${titleScale})`,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 56,
              fontWeight: 300,
              color: COLOURS.foreground,
              opacity: subtitleOpacity,
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Pillars Scene Component
const PillarsScene: React.FC<{ pillars: string[] }> = ({ pillars }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          width: "100%",
        }}
      >
        {pillars.map((pillar, index) => {
          const delay = index * 15;
          const pillarSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const translateX = interpolate(frame - delay, [0, 15], [-50, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={pillar}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "32px 48px",
                backgroundColor: "rgba(201, 100, 66, 0.1)",
                borderRadius: 16,
                borderLeft: `6px solid ${COLOURS.primary}`,
                opacity,
                transform: `translateX(${translateX}px) scale(${pillarSpring})`,
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 500,
                  color: COLOURS.foreground,
                }}
              >
                {pillar}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Tagline Scene Component
const TaglineScene: React.FC<{ tagline: string }> = ({ tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
          transform: `scale(${scale})`,
        }}
      >
        <h2
          style={{
            fontSize: 72,
            fontWeight: 300,
            color: COLOURS.foreground,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Movement,
          <br />
          by humans
        </h2>
        <div
          style={{
            padding: "24px 48px",
            backgroundColor: COLOURS.primary,
            borderRadius: 12,
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: "#fff",
            }}
          >
            {tagline}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

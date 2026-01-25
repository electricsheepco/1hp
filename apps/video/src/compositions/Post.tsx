import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 1HP brand colours
const COLOURS = {
  background: "#FAF8F5", // warm cream
  foreground: "#3D3629", // dark brown
  primary: "#C96442", // terracotta
  muted: "#807A6F", // muted brown
};

const getIllustration = (name: string) => {
  const files: Record<string, string> = {
    "runner-start": "illustrations/undraw_runner-start_585j.svg",
    "bike-ride": "illustrations/undraw_bike-ride_ba0o.svg",
    "fitness-stats": "illustrations/undraw_fitness-stats_uk0g.svg",
    "morning-workout": "illustrations/undraw_morning-workout_73u9.svg",
  };
  return staticFile(files[name] || files["runner-start"]);
};

type PostProps = {
  title: string;
  subtitle: string;
  tagline: string;
  illustration: string;
};

export const Post: React.FC<PostProps> = ({
  title,
  subtitle,
  tagline,
  illustration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [15, 30], [20, 0], {
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  const illustrationScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const illustrationOpacity = interpolate(frame, [10, 25], [0, 0.15], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOURS.background,
        fontFamily: "Sora, system-ui, sans-serif",
      }}
    >
      {/* Background illustration */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: illustrationOpacity,
          transform: `scale(${illustrationScale})`,
        }}
      >
        <Img
          src={getIllustration(illustration)}
          style={{
            width: "80%",
            height: "80%",
            objectFit: "contain",
          }}
        />
      </AbsoluteFill>

      {/* Content */}
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
            gap: 24,
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: 180,
              fontWeight: 200,
              color: COLOURS.foreground,
              letterSpacing: "-0.02em",
              margin: 0,
              transform: `scale(${titleScale})`,
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 48,
              fontWeight: 300,
              color: COLOURS.foreground,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              margin: 0,
            }}
          >
            {subtitle}
          </p>

          {/* Tagline */}
          <p
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: COLOURS.muted,
              opacity: taglineOpacity,
              margin: 0,
              marginTop: 20,
            }}
          >
            {tagline}
          </p>
        </div>
      </AbsoluteFill>

      {/* Bottom accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: COLOURS.primary,
          transform: `scaleX(${interpolate(frame, [0, 30], [0, 1], {
            extrapolateRight: "clamp",
          })})`,
          transformOrigin: "left",
        }}
      />
    </AbsoluteFill>
  );
};

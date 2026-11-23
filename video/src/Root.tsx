import { Composition } from "remotion";
import { Reel, layout, reelIds } from "./Reel";
import { POSTS, PostSlide, SIZES } from "./posts";
import { FPS, H, W } from "./theme";

/** Reels: one 1080×1920 / 30 fps composition each. Posts: one still composition sized per network. */
export function Root() {
  return (
    <>
      {reelIds.map((id) => (
        <Composition key={id} id={id} component={Reel} defaultProps={{ id }} width={W} height={H} fps={FPS} durationInFrames={layout(id).total} />
      ))}
      <Composition
        id="Post"
        component={PostSlide}
        defaultProps={{ postId: POSTS[0].id, index: 0 }}
        width={1080}
        height={1350}
        fps={30}
        durationInFrames={1}
        calculateMetadata={({ props }) => {
          const net = POSTS.find((p) => p.id === props.postId)?.net ?? "ig";
          const [width, height] = SIZES[net];
          return { width, height };
        }}
      />
    </>
  );
}

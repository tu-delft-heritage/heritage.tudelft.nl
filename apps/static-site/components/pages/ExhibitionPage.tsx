import { Manifest } from "@iiif/presentation-3";
import { createPaintingAnnotationsHelper } from "@iiif/helpers/painting-annotations";
import { getRenderingStrategy } from "react-iiif-vault/utils";
import { TitlePanel } from "../exhibitions/TitleBlock";
import { InfoBlock } from "../exhibitions/InfoBlock";
import { ImageBlock } from "../exhibitions/ImageBlock";
import { MediaBlock } from "../exhibitions/MediaBlock";

export interface ExhibitionPageProps {
  manifest: Manifest;
  meta: {};
  slug: string;
  viewObjectLinks: Array<{ service: string; slug: string; canvasId: string; targetCanvasId: string }>;
}

export async function ExhibitionPage(props: ExhibitionPageProps) {
  const helper = createPaintingAnnotationsHelper();
  const canvas: any = props.manifest.items[0];

  if (!canvas) return null;

  return (
    <>
      <div className="mt-12 auto-rows-auto grid-cols-12 content-center justify-center lg:grid">
        <TitlePanel manifest={props.manifest} />

        {props.manifest.items.map((canvas: any, idx) => {
          const paintables = helper.getPaintables(canvas);
          const strategy = getRenderingStrategy({
            canvas,
            loadImageService: () => void 0,
            paintables,
            supports: ["empty", "images", "media", "3d-model", "textual-content", "complex-timeline"],
          });

          const foundLinks = props.viewObjectLinks.filter((link) => link.canvasId === canvas.id);

          if (strategy.type === "textual-content") {
            return <InfoBlock canvas={canvas} strategy={strategy} />;
          }

          if (strategy.type === "images") {
            return <ImageBlock canvas={canvas} index={idx} objectLinks={foundLinks} />;
          }

          if (strategy.type === "media") {
            return <MediaBlock canvas={canvas} strategy={strategy} index={idx} />;
          }

          return null;
        })}
      </div>
    </>
  );
}

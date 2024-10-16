import { NextRequest, NextResponse } from "next/server";
import { allPublications } from "contentlayer/generated";
import { getValue } from "@iiif/helpers";

import siteCollections from "@repo/iiif/build/collections/site/collection.json";
import allCollections from "@repo/iiif/build/collections/collection.json";
import exhibitions from "@repo/iiif/build/collections/exhibitions/collection.json";
import manifests from "@repo/iiif/build/manifests/collection.json";

function getThumb(item: any) {
  if (!item.thumbnail || item.thumbnail.length === 0) return;

  const thumbId = item.thumbnail[0].id;
  if (!thumbId) return;

  return thumbId.replace("/full/200,/", "/full/400,/");
}

export const GET = async (req: NextRequest, res: NextResponse) => {
  const search = req.nextUrl.searchParams.get("q") || "";
  const type = req.nextUrl.searchParams.get("type") || "";

  let i = 0;
  const maxResults = 24;

  if (type === "publication") {
    const found = search
      ? allPublications.filter((publication) => {
          return publication.title.toLowerCase().includes(search.toLowerCase());
        })
      : allPublications;

    return NextResponse.json({
      results: found.map((publication) => ({
        type: "publication",
        title: publication.title,
        subtitle: publication.author,
        thumbnail: publication.image,
        link: `/publications/${publication.id}`,
      })),
    });
  }

  if (type === "collection") {
    const results = [];
    const collectionItems = [...siteCollections.items, ...allCollections.items];

    for (const item of collectionItems) {
      let label = getValue(item.label, { fallbackLanguages: ["nl", "en"] });
      if (!label) {
        label = ((item.label && item.label.nl) || ["Untitled Collection"])[0] as string;
      }
      const fullSlug = item["hss:slug"].replace("iiif/", "/");
      if (search && !label.toLowerCase().includes(search.toLowerCase())) continue;

      i++;
      if (i > maxResults) break;

      results.push({
        type: "collection",
        title: label,
        link: `/${fullSlug}`,
        thumbnail: getThumb(item),
      });
    }

    return NextResponse.json({
      results,
    });
  }

  if (type === "exhibition") {
    const results = [];
    const collection = exhibitions;

    for (const item of collection.items) {
      let label = getValue(item.label, { fallbackLanguages: ["nl", "en"] });
      if (!label) {
        label = ((item.label && item.label.nl) || ["Untitled Exhibition"])[0] as string;
      }
      const fullSlug = item["hss:slug"].replace("iiif/", "/");
      if (search && !label.toLowerCase().includes(search.toLowerCase())) continue;

      i++;
      if (i > maxResults) break;

      results.push({
        type: "exhibition",
        title: label,
        link: `/${fullSlug.replace("manifests/", "exhibitions/")}`,
        thumbnail: getThumb(item),
        color: "bg-yellow-400",
      });
    }

    return NextResponse.json({
      results,
    });
  }

  if (type === "manifest") {
    const results = [];

    const collection = manifests;
    let total = 0;

    for (const item of collection.items) {
      if (item.type !== "Manifest") continue;

      let label = getValue(item.label, { fallbackLanguages: ["nl", "en"] });
      if (!label) {
        label = ((item.label && item.label.nl) || ["Untitled Manifest"])[0] as string;
      }
      const fullSlug = item["hss:slug"].replace("iiif/", "/");
      if (search && !label.toLowerCase().includes(search.toLowerCase())) continue;
      total++;
      if (total > maxResults) break;
      results.push({
        type: "manifest",
        title: label,
        link: `/${fullSlug.replace("manifests/", "objects/")}`,
        thumbnail: getThumb(item),
      });
    }

    //

    return NextResponse.json({
      results,
    });
  }
  // Type:
  //  - publication
  //  - collection
  //  - manifest
  return NextResponse.json({
    results: [],
  });
};

import { ObjectivesResponse } from "@/lib/api-types";
import { hashIds, loadObjectiveForScene } from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse<ObjectivesResponse>> {
  const sceneId = request.nextUrl.searchParams.get("sceneId");

  if (!sceneId) {
    return NextResponse.json({
      message: "Scene ID is required",
      success: false,
    }, { status: 400 });
  } else if (!hashIds.isValidId(sceneId)) {
    return NextResponse.json({
      message: "Invalid Scene ID",
      success: false,
    }, { status: 400 });
  }

  const realSceneId = Number(hashIds.decode(sceneId)[0].valueOf());

  console.log("Loading objectives for scene", sceneId, "[", realSceneId, "]");

  const objectives = await loadObjectiveForScene(realSceneId);

  return NextResponse.json({
    message: "success",
    success: true,
    data: {
      objectives: objectives.map(objective => ({
        id: objective.id,
        description: objective.description,
      }))
    }
  })
} 
import { NextRequest } from "next/server";

const mockCharacter: {
    [key: string]: Character
} = {
    "zhenxiao": {
        id: "zhenxiao",
        name: "ZhenXiao",
        image: "public/zhenxiao.png"
    }
}

interface Character {
    id: string;
    name: string;
    image: string;
}

export async function POST(request: NextRequest) {
    const { characterId } = await request.json();
    const character = mockCharacter[characterId];
    return Response.json({ data: character });
}
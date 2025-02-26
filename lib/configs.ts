export interface Scenario {
    id: string;
    scenes: (VideoScene | ImageTextScene)[]
}

export interface VideoScene {
    type: "video";
    url: string;
}

export interface ImageTextScene {
    type: "image-text";
    chat: boolean;
}

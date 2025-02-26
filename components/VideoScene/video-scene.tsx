export interface VideoSceneProps {
  url: string;
  active: boolean
}

export default function VideoScene({ url }: VideoSceneProps) {
  return (
    <div className="w-full h-full">
      <video autoPlay controls={false}>
        <source src={url} />
      </video>
    </div>
  )
}
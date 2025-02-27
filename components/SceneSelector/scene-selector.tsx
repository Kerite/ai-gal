"use client"
import scenarios from "@/configs/scenario.json"
import Image from "next/image"
import Link from "next/link";

export default function SceneSelector() {
  return (
    <div className="flex">
      {
        scenarios.scenarios?.map(scenario => {
          return (
            <div key={scenario.id}>
              <Link href={`/scenario/${scenario.id}`} className="relative flex flex-col">
                <div className="relative size-56">
                  <Image alt={scenario.name} src={scenario.image} fill style={{ objectFit: 'cover' }} />
                </div>
                <span className="mx-auto">{scenario.name}</span>
              </Link>
            </div>
          )
        })
      }
    </div>
  )
}

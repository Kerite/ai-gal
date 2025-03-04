"use client"
import { ScenarioSummary } from "@/lib/types";
import Image from "next/image"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SceneSelector() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  useEffect(() => {
    const fetchScenarios = async () => {
      const scenarios = await fetch("/api/scenarios", {
        method: "GET"
      }).then(res => res.json());
      setScenarios(scenarios);
    }
    fetchScenarios();
  }, []);
  return (
    <div className="flex">
      {
        scenarios.map(scenario => {
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

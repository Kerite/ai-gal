"use client"

import { useEffect, useState } from "react"

export default function ConversationScene({
    conversation
}: { conversation: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        setCurrentIndex(0);
    }, [conversation])

    useEffect(() => {

    }, [conversation, currentIndex])

    return (
        <div>
            <span>{conversation[currentIndex]}</span>
        </div>
    )
}
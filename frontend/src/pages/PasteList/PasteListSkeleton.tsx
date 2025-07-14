import { PasteEntrySkeleton } from "./PasteEntrySkeleton"

export const PasteListSkeleton = () => {
    return <>
        {Array(5).fill(undefined).map(() => <PasteEntrySkeleton />)}
    </>
}
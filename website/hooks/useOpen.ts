import { useState } from "react";

export default function useOpen(defaultValue = false) {
    const [isOpen, setOpen] = useState(defaultValue);
    const toggle = () => setOpen((prev) => !prev);
    const close = () => setOpen(false);
    return { isOpen, setOpen, toggle, close };
    
}
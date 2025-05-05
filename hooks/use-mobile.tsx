"use client"

import { useState, useEffect } from "react"

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Verificar inicialmente
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Verificar no carregamento
    checkIfMobile()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkIfMobile)

    // Limpar listener
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [breakpoint])

  return isMobile
}

// For backward compatibility
export { useIsMobile as useMobile }

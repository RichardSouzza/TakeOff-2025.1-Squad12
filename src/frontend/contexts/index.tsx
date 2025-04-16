"use client";

import { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";

interface ToastProviderProps {
    children: React.ReactNode
}

interface ToastContextProps {
    toastMessage: (text: string, theme: 'success' | 'warn' | 'error') => void;
}

const ToastContext = createContext({} as ToastContextProps)

export function ToastProvider({ children }: ToastProviderProps) {
    function toastMessage(text: string, theme: 'success' | 'warn' | 'error') {
        if (theme == "success") {
            toast[theme](text, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light"
            });
            return;
        }

        toast[theme](text, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light"
        });
    }

    return (
        <ToastContext.Provider value={{ toastMessage }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const toast = useContext(ToastContext)
    return toast;
}

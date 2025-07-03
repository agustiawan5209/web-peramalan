import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

type ToastProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    duration?: number;
    variant?: "default" | "success" | "error";
};

export const Toast: React.FC<ToastProps> = ({
    open,
    onOpenChange,
    title,
    description,
    duration = 3000,
    variant = "default",
}) => {
    return (
        <ToastPrimitive.Provider swipeDirection="up" duration={duration}>
            <ToastPrimitive.Root
                open={open}
                onOpenChange={onOpenChange}
                className={`fixed top-4 right-1/2 translate-x-1/2 w-1/3 z-50 rounded-md shadow-lg px-4 py-3 bg-white border ${
                    variant === "success"
                        ? "bg-green-50 border-green-500"
                        : variant === "error"
                        ? "bg-red-50 border-red-500"
                        : "bg-blue-50 border-blue-500"
                }`}
            >
                <div className="flex items-start">
                    <div className="flex-1">
                        <ToastPrimitive.Title className="text-sm font-medium text-gray-900">
                            {title}
                        </ToastPrimitive.Title>
                        {description && (
                            <ToastPrimitive.Description className="mt-1 text-xs text-gray-700">
                                {description}
                            </ToastPrimitive.Description>
                        )}
                    </div>
                    <ToastPrimitive.Close
                        aria-label="Close"
                        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
                    >
                        ×
                    </ToastPrimitive.Close>
                </div>
            </ToastPrimitive.Root>
            <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50" />
        </ToastPrimitive.Provider>
    );
};


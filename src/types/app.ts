export interface SnackbarState {
    show: boolean;
    message: string;
}

export interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

export interface Position {
    x: number;
    y: number;
}
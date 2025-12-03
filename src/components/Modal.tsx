import { useLayoutEffect, useRef } from 'react';

export interface ModalProps {
    show: boolean;
    onClose?: () => void;
    closeOnOutsideClick?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export function Modal({
    style,
    className,
    children,
    show,
    closeOnOutsideClick,
    onClose,
}: ModalProps & React.PropsWithChildren) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useLayoutEffect(() => {
        if (dialogRef.current?.open && !show) {
            dialogRef.current.close();
        } else if (!dialogRef.current?.open && show) {
            dialogRef.current?.showModal();
        }
    }, [show]);
    return (
        <dialog
            className={className}
            onClick={(event) => {
                if (closeOnOutsideClick && event.target === dialogRef.current && onClose) {
                    onClose();
                }
            }}
            ref={dialogRef}
            style={{ padding: 0, border: 0 }}
        >
            <div style={style} onClick={(event) => event.stopPropagation()} className={'modal-content'}>
                {children}
            </div>
        </dialog>
    );
}

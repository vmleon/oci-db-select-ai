interface Props {
    children: any,
    isLoading: boolean
}

export default function Narration({ children, isLoading }: Props) {

    if (isLoading) {
        return null;
    }

    if (!children) {
        return null;
    }

    return <span>{children}</span>;
}